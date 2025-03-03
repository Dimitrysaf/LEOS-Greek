/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.digit.leos.pilot.export.service.processor.content;

import eu.europa.ec.digit.leos.pilot.export.model.LeosCategory;
import eu.europa.ec.digit.leos.pilot.export.util.XPathCatalog;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.digit.leos.pilot.export.model.LeosCategory.STAT_DIGIT_FINANC_LEGIS;
import static eu.europa.ec.digit.leos.pilot.export.service.impl.XmlDocumentServiceImpl.ANNEX_FILE_PREFIX;
import static eu.europa.ec.digit.leos.pilot.export.service.impl.XmlDocumentServiceImpl.DEC_FILE_PREFIX;
import static eu.europa.ec.digit.leos.pilot.export.service.impl.XmlDocumentServiceImpl.DIR_FILE_PREFIX;
import static eu.europa.ec.digit.leos.pilot.export.service.impl.XmlDocumentServiceImpl.MEMORANDUM_FILE_PREFIX;
import static eu.europa.ec.digit.leos.pilot.export.service.impl.XmlDocumentServiceImpl.PROP_ACT_PREFIX;
import static eu.europa.ec.digit.leos.pilot.export.service.impl.XmlDocumentServiceImpl.REG_FILE_PREFIX;
import static eu.europa.ec.digit.leos.pilot.export.service.impl.XmlDocumentServiceImpl.STAT_DIGIT_FINANC_LEGIS_FILE_PREFIX;
import static eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.XML_NAME;
import static eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.evalXpath;
import static eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.evaluateXPath;
import static eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.nodeToByteArray;
import static eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.parseXml;

@Service
public class XmlContentProcessorImpl implements XmlContentProcessor {
    private static final Logger LOG = LoggerFactory.getLogger(XmlContentProcessorImpl.class);

    @Autowired
    protected XPathCatalog xPathCatalog;

    @Override
    public LeosCategory identifyCategory(String docName, byte[] xmlContent) throws Exception {
        LeosCategory category = null;
        String xPath = xPathCatalog.getXPathAkomaNtosoFirstChild();
        String docNameAttr = getAttributeValueByXpath(xmlContent, xPath, XML_NAME);
        if (docNameAttr != null) {
            switch (docNameAttr) {
                case ANNEX_FILE_PREFIX:
                    category = LeosCategory.ANNEX;
                    break;
                case REG_FILE_PREFIX:
                case DIR_FILE_PREFIX:
                case DEC_FILE_PREFIX:
                    category = LeosCategory.BILL;
                    break;
                case MEMORANDUM_FILE_PREFIX:
                    category = LeosCategory.MEMORANDUM;
                    break;
                case PROP_ACT_PREFIX:
                    category = LeosCategory.PROPOSAL;
                    break;
                case STAT_DIGIT_FINANC_LEGIS_FILE_PREFIX:
                    category = STAT_DIGIT_FINANC_LEGIS;
                    break;
                default:
                    category = LeosCategory.MEDIA;
            }
        }
        return category;
    }

    @Override
    public String getAttributeValueByXpath(byte[] xmlContent, String xPath, String attrName) throws Exception {
        try {
            XmlUtil.XmlFile xmlFile = parseXml(xmlContent);
            Node node = evalXpath(xPath, xmlFile.getXmlDocument());

            if (node != null && node.getAttributes() != null) {
                Node attrNode = node.getAttributes().getNamedItem(attrName);
                return attrNode != null ? attrNode.getNodeValue() : null;
            }
        } catch (Exception e) {
            LOG.error("An exception occurred while parsing the xmlContent", e);
            throw e;
        }
        return null;
    }

    @Override
    public byte[] removeElements(byte[] xmlContent, String xpath, int levelsToRemove) throws Exception {
        try {
            XmlUtil.XmlFile xmlFile = parseXml(xmlContent);
            NodeList nodeList = evaluateXPath(xmlFile.getXmlDocument(), xpath);

            for (int i = 0; i < nodeList.getLength(); i++) {
                Node node = nodeList.item(i);
                Node parent = node.getParentNode();
                for (int level = 0; level < levelsToRemove; level++) {
                    node = parent;
                    parent = parent.getParentNode();
                }
                if (parent != null) {
                    parent.removeChild(node);
                }
            }
            return nodeToByteArray(xmlFile.getXmlDocument());
        } catch (Exception e) {
            LOG.error("An exception occurred while parsing the xmlContent", e);
            throw e;
        }
    }

    @Override
    public List<Map<String, String>> getElementsAttributesByPath(byte[] xmlContent, String xPath) throws Exception {
        List<Map<String, String>> elementAttributesList = new ArrayList<>();
        try {
            XmlUtil.XmlFile xmlFile = parseXml(xmlContent);
            NodeList elements = evaluateXPath(xmlFile.getXmlDocument(), xPath);

            for (int i = 0; i < elements.getLength(); i++) {
                elementAttributesList.add(getAttributes(elements.item(i)));
            }
        } catch (Exception e) {
            LOG.error("An exception occurred while parsing the xmlContent", e);
            throw e;
        }
        return elementAttributesList;
    }

    @Override
    public String getElementValue(byte[] xmlContent, String xPath) throws Exception {
        try {
            XmlUtil.XmlFile xmlFile = parseXml(xmlContent);
            Node node = evalXpath(xPath, xmlFile.getXmlDocument());

            return (node != null) ? node.getTextContent() : null;
        } catch (Exception e) {
            LOG.error("An exception occurred while parsing the xmlContent", e);
            throw e;
        }
    }



    private static Map<String, String> getAttributes(Node node) {
        Map<String, String> attributes = new HashMap<>();
        if (node.hasAttributes()) {
            NamedNodeMap attrMap = node.getAttributes();
            for (int i = 0; i < attrMap.getLength(); i++) {
                Node attr = attrMap.item(i);
                attributes.put(attr.getNodeName(), attr.getNodeValue());
            }
        }
        return attributes;
    }
}
