package eu.europa.ec.leos.services.compare.processor;

import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.support.XercesUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ACTION_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TC_DELETE_ACTION;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TC_INSERT_ACTION;
import static eu.europa.ec.leos.services.support.XmlHelper.UTF_8;

public class LeosPreDiffingProcessor {

    private XPathCatalog xPathCatalog = new XPathCatalog();

    public String adjustTrackChanges(String content) {

        Document document = XercesUtils.createXercesDocument(content.getBytes(UTF_8));
        NodeList elements = XercesUtils.getElementsByXPath(document, xPathCatalog.getXPathTrackChanges());
        for (int countElements = 0; countElements < elements.getLength(); countElements++) {
            Node element = elements.item(countElements);
            if(XercesUtils.getAttributeValue(element, LEOS_ACTION_ATTR) != null
                    || element.getNodeName().equals("ins") || element.getNodeName().equals("del")){
                if ((XercesUtils.getAttributeValue(element, LEOS_ACTION_ATTR) != null && XercesUtils.getAttributeValue(element, LEOS_ACTION_ATTR).equals(LEOS_TC_DELETE_ACTION))
                        || element.getNodeName().equals("del")) {
                    element.getParentNode().removeChild(element);
                } else if (element.getNodeName().equals("ins") || (XercesUtils.getAttributeValue(element, LEOS_ACTION_ATTR) != null
                        && element.getNodeName().equalsIgnoreCase("inline")
                        && XercesUtils.getAttributeValue(element, LEOS_ACTION_ATTR).equals(LEOS_TC_INSERT_ACTION))) {
                    for(int countChildren = 0; countChildren < element.getChildNodes().getLength(); countChildren++) {
                        Node child = element.getChildNodes().item(countChildren);
                        element.getParentNode().insertBefore(child, element);
                    }
                    element.getParentNode().removeChild(element);
                } else if (XercesUtils.getAttributeValue(element, LEOS_ACTION_ATTR) != null && XercesUtils.getAttributeValue(element, LEOS_ACTION_ATTR).equals(LEOS_TC_INSERT_ACTION)) {
                    XercesUtils.removeTrackChangesAttributes(element);
                }
            }
        }

        String xmlContent = new String(XercesUtils.nodeToByteArray(document));
        return this.removeEmptyTablesMultiPass(xmlContent);

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
