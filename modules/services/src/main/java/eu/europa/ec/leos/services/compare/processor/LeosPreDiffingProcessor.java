package eu.europa.ec.leos.services.compare.processor;

import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.support.XercesUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class LeosPreDiffingProcessor {

    private XPathCatalog xPathCatalog = new XPathCatalog();

    public String adjustTrackChanges(String content) {

        Document document = XercesUtils.createXercesDocument(content.getBytes());
        NodeList elements = XercesUtils.getElementsByXPath(document, xPathCatalog.getXPathTrackChanges());
        for (int countElements = 0; countElements < elements.getLength(); countElements++) {
            Node element = elements.item(countElements);
            if (XercesUtils.getAttributeValue(element, "leos:action").equals("delete")) {
                element.getParentNode().removeChild(element);
            } else if (XercesUtils.getAttributeValue(element, "leos:action").equals("insert")) {
                for(int countChildren = 0; countChildren < element.getChildNodes().getLength(); countChildren++) {
                    Node child = element.getChildNodes().item(countChildren);
                    element.getParentNode().insertBefore(child, element);
                }
                element.getParentNode().removeChild(element);
            }
        }

        return new String(XercesUtils.nodeToByteArray(document));

    }

}
