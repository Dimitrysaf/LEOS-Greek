package eu.europa.ec.digit.leos.pilot.export.service.processor.node;

import eu.europa.ec.digit.leos.pilot.export.util.XPathCatalog;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import javax.xml.xpath.XPathExpressionException;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeConfig.Attribute;
import static eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeConfigProcessor.getDocEEATagList;
import static eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.deleteElementsByXPath;
import static eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.evalXpath;
import static eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.parseXml;

@Service
public class XmlNodeProcessorImpl implements XmlNodeProcessor {

    private static final Logger LOG = LoggerFactory.getLogger(XmlNodeProcessorImpl.class);

    @Override
    public Map<String, String> getValuesFromXml(byte[] xmlContent, String[] keys, Map<String, XmlNodeConfig> config) {
        Map<String, String> metaDataMap = new HashMap<>();
        try {
            XmlUtil.XmlFile xmlFile = parseXml(xmlContent);
            Document document = xmlFile.getXmlDocument();
            for (String key : keys) {
                XmlNodeConfig nodeConfig = config.get(key);
                if (nodeConfig != null) {
                    Node node = evalXpath(nodeConfig.xPath, document);
                    if (node != null) {
                        metaDataMap.put(key, node.getTextContent());
                    }
                }
            }
        } catch (Exception e) {
            LOG.error("Error parsing XML", e);
        }
        return metaDataMap;
    }

    @Override
    public byte[] setValuesInXml(byte[] xmlContent, Map<String, String> keyValue,
                                 Map<String, XmlNodeConfig> config, Map<String, XmlNodeConfig> oldConfig) {
        try {
            XmlUtil.XmlFile xmlFile = parseXml(xmlContent);
            Document document = xmlFile.getXmlDocument();

            for (Map.Entry<String, String> entry : keyValue.entrySet()) {
                String key = entry.getKey();
                XmlNodeConfig nodeConfig = config.get(key);

                if (nodeConfig == null) {
                    LOG.debug("Configuration not found for: {}, ignoring and continuing", key);
                    continue;
                }

                String value = entry.getValue();
                if (getDocEEATagList().contains(key)) {
                    value = Boolean.parseBoolean(value) ? "(Text with EEA relevance)" : "";
                }

                Node node = evalXpath(nodeConfig.xPath, document);

                if (oldConfig != null && oldConfig.containsKey(key)) {
                    Node oldNode = evalXpath(oldConfig.get(key).xPath, document);
                    if (oldNode != null) {
                        node = oldNode;
                    }
                }

                if (node != null && nodeConfig.delete && value.isEmpty()) {
                    Node parentNode = evalXpath(nodeConfig.xPathParent, document);
                    if (parentNode != null) {
                        deleteElementsByXPath(parentNode, nodeConfig.xPathParent, true);
                    }
                } else if (node != null) {
                    updateNode(node, value);
                } else if (nodeConfig.create &&
                        (!getDocEEATagList().contains(key) || !value.isEmpty())) {
                    createAndUpdateNode(document, nodeConfig.xPath, nodeConfig.attributes, value);
                }
            }

            return XmlUtil.nodeToByteArray(document);
        } catch (Exception e) {
            LOG.error("Error updating XML", e);
        }
        return null;
    }

    private void updateNode(Node node, String value) {
        node.setTextContent(value);
    }

    private void createAndUpdateNode(Document document, String xPath, List<Attribute> configAttributes, String value) throws XPathExpressionException {
        String[] nodes = xPath.split("(?<!/)(?=((/+)))");

        // 1. iterate and break at first non-existing node in xml
        StringBuilder partialXPath = new StringBuilder();
        int index = 0;
        Node node = null;
        for (; index < nodes.length; index++) {
            partialXPath.append(nodes[index]);
            Node found = evalXpath(partialXPath.toString(), document);
            if (!nodes[index].isEmpty() && found == null) {// ignore nodes
                LOG.debug("Node not found:{}", nodes[index]);
                break;
            } else {
                node = found;
            }
        }
        if (node != null) {
            // 2. create xml structure for remaining absent nodes
            Deque<String> stack = new ArrayDeque<>();
            for (; index < nodes.length; index++) {
                if (!(nodes[index].contains("documentCollection") || nodes[index].contains("collectionBody"))) {
                    stack.push(nodes[index].replaceAll("//|/", "") // Strip // and /
                            .replaceAll("@refersTo='#.+' or ", "")); // Strip refersTo first 'or' condition
                }
            }

            LOG.debug("Need to add node in path {}. First missing node: {}; Has to add these nodes (inverse) : {}", xPath, partialXPath.toString(), getQueueAsString(stack));
            addToFragment(document, node, configAttributes, stack, value);
        } else {
            throw new IllegalStateException("The XPath used for populating the Document is not valid " + xPath);
        }
    }

    private void addToFragment(Document document, Node node, List<Attribute> configAttributes, Deque<String> stack, String value) {
        Set<XmlNodeConfig.Attribute> attributes;
        // 2.2 create rest of structure; add content only to the leaf.
        while (stack.peekLast() != null) {
            String nextFragment = stack.pollLast();
            nextFragment = XPathCatalog.removeNamespaceFromXml(nextFragment);
            String tagName = parseForTagName(nextFragment);

            // 2.1 handle if final selection is attribute value
            attributes = new HashSet<>();
            if (!stack.isEmpty() && stack.getLast().startsWith("@")) {
                attributes.add(new XmlNodeConfig.Attribute(stack.pollLast().substring(1), value, null));
            }
            boolean isAttr = false;
            if (!attributes.isEmpty()) {
                isAttr = true;
            }

            XmlNodeConfig.Attribute fragmentAttribute = parseForAttribute(nextFragment);
            if (fragmentAttribute != null) {
                attributes.add(fragmentAttribute);
            }
            LOG.debug("Adding {}, with attributes from stack: ", tagName, getAttributesAsString(attributes));
            attributes.addAll(configAttributes.stream().filter(attr -> attr.parent.equals(tagName)).collect(Collectors.toSet()));
            LOG.debug("Added attributes from configAttributes {}: ", getAttributesAsString(attributes));
            attributes.clear();
        }
    }

    /*
        parse xpathFragment between // or / for existance of attribute selector,
        we expect attribute selector wil be in format [@attName='attValue']
        returns null if there is no attribute
        returns attribute if there is attribute selector.
     */
    private XmlNodeConfig.Attribute parseForAttribute(String xPathFragment) {
        if (xPathFragment == null || !xPathFragment.contains("[")) {
            return null;
        }
        Pattern pattern = Pattern.compile("(?<tagName>[a-zA-Z]+?)\\[@(?<attName>.+?)='(?<attValue>.+?)'\\]");
        Matcher matcher = pattern.matcher(xPathFragment.trim());

        matcher.matches();
        String tagName = matcher.group("tagName");
        String attributeName = matcher.group("attName");
        String attributeValue = matcher.group("attValue");
        return new XmlNodeConfig.Attribute(attributeName, attributeValue, tagName);
    }

    private String parseForTagName(String xPathFragment) {
        return xPathFragment != null && xPathFragment.contains("[") ? xPathFragment.substring(0, xPathFragment.indexOf("[")) : xPathFragment;
    }

    public static String getQueueAsString(Queue<String> queue) {
        String str = "{";
        for (String s : queue) {
            str += ", " + s;
        }
        str += "}";
        return str;
    }

    public static String getAttributesAsString(Set<Attribute> attrs) {
        String str = "";
        for (Attribute attr : attrs) {
            str += "" + attr.parent + "[" + attr.name + "=" + attr.value + "]";
        }
        return str;
    }
}
