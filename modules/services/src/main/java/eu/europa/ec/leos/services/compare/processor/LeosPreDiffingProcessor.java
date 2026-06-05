package eu.europa.ec.leos.services.compare.processor;

import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.support.XmlUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ACTION_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TC_DELETE_ACTION;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TC_INSERT_ACTION;
import static eu.europa.ec.leos.services.support.XmlHelper.NUM;
import static eu.europa.ec.leos.services.support.XmlHelper.UTF_8;

public class LeosPreDiffingProcessor {

    private XPathCatalog xPathCatalog = new XPathCatalog();

    public String adjustTrackChanges(String content) {
        Document document = XmlUtils.createDocument(content.getBytes(UTF_8));
        NodeList elements = XmlUtils.getElementsByXPath(document, xPathCatalog.getXPathTrackChanges());
        for (int i = 0; i < elements.getLength(); i++) {
            Node element = elements.item(i);
            String action = XmlUtils.getAttributeValue(element, LEOS_ACTION_ATTR);
            String nodeName = element.getNodeName();

            if (action == null && !nodeName.equals("ins") && !nodeName.equals("del")) {
                continue;
            }

            if (nodeName.equals("del") || LEOS_TC_DELETE_ACTION.equals(action)) {
                handleDelete(document, element);
            } else if (nodeName.equals("ins") || (nodeName.equalsIgnoreCase("inline") && LEOS_TC_INSERT_ACTION.equals(action))) {
                handleInsert(element);
            } else if (LEOS_TC_INSERT_ACTION.equals(action)) {
                XmlUtils.removeTrackChangesAttributes(element);
            }
        }
        return this.removeEmptyTablesMultiPass(new String(XmlUtils.nodeToByteArray(document)));
    }

    private void handleDelete(Document document, Node element) {
        Node parent = element.getParentNode();
        parent.removeChild(element);
        if (!parent.hasChildNodes()) {
            if (parent.getNodeName().equals(NUM)) {
                parent.getParentNode().removeChild(parent);
            } else {
                parent.appendChild(document.createTextNode("\u00A0"));
            }
        }
    }

    private void handleInsert(Node element) {
        Node parent = element.getParentNode();
        NodeList children = element.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);
            if (child.getNodeType() == Node.TEXT_NODE && child.getTextContent().trim().isEmpty()){
                continue;
            }
            parent.insertBefore(child, element);
        }
        parent.removeChild(element);
        if (!parent.hasChildNodes() && parent.getNodeName().equals(NUM)) {
            parent.getParentNode().removeChild(parent);
        }
    }

    // More strict version - only removes if truly empty (recommended)
    private String removeTrulyEmptyTables(String xmlContent) {
        if (xmlContent == null || xmlContent.isEmpty()) {
            return xmlContent;
        }

        // (?s) = dotall mode → . matches newlines
        // (?i) = case insensitive (for TABLE/table/Table...)
        String regexStrict = "(?is)<table\\b[^>]*>" +
                "(?:\\s*|\\s*<\\!--.*?-->\\s*)" +     // allow only whitespace or comments
                "</table>|" +
                "<table\\b[^>]*\\s*/>";

        return xmlContent.replaceAll(regexStrict, "");
    }

    // For chaining / multiple passes (sometimes needed with nested cases)
    private String removeEmptyTablesMultiPass(String input) {
        String result = input;
        String previous;

        do {
            previous = result;
            result = this.removeTrulyEmptyTables(result);
        } while (!result.equals(previous));

        return result;
    }
}
