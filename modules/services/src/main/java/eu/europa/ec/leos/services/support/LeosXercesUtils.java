package eu.europa.ec.leos.services.support;

import static eu.europa.ec.leos.services.numbering.depthBased.ClassToDepthType.TYPE_1;
import static eu.europa.ec.leos.services.numbering.depthBased.ClassToDepthType.TYPE_2;
import static eu.europa.ec.leos.services.numbering.depthBased.ClassToDepthType.TYPE_3;
import static eu.europa.ec.leos.services.support.XercesUtils.*;
import static eu.europa.ec.leos.services.support.XmlHelper.*;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.security.SecurityContext;
import io.atlassian.fugue.Maybe;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.*;

import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;

import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

public class LeosXercesUtils {

    private static final Logger LOG = LoggerFactory.getLogger(LeosXercesUtils.class);
    public static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssZZZZZ");
    public static final String AKN_BODY = "aknBody";

    public static Node buildNumElement(Node node, String numLabel, SecurityContext securityContext, boolean isTrackChangesEnabled) {
        Node numNode = getFirstChild(node, getNumTag(node.getNodeName()));
        if (numNode != null) {
            Node delNode = getFirstChild(numNode, "del");
            Node insNode = getFirstChild(numNode, "ins");
            if ((delNode == null || (delNode.getAttributes().getNamedItem(LEOS_TC_ORIGINAL_NUMBER) == null &&
                    delNode.getAttributes().getNamedItem(LEOS_ACTION_NUMBER) == null &&
                    delNode.getAttributes().getNamedItem(LEOS_ACTION_ENTER) == null)) &&
                (insNode == null || insNode.getAttributes().getNamedItem(LEOS_TC_ORIGINAL_NUMBER) == null)
            ) {
                if (node.getNodeName().equals(DIVISION)) {
                    buildNumElementForDivision(node, numLabel, numNode);
                } else {
                    if (!isTrackChangesEnabled ||
                        hasAttributeWithValue(node, LEOS_ACTION_ATTR, LEOS_TC_INSERT_ACTION) || hasAttributeWithValue(numNode, LEOS_ACTION_ATTR, LEOS_TC_MOVE_ACTION) ||
                        (delNode != null && insNode != null && delNode.getTextContent().equals(numLabel)) ||
                        numNode.getTextContent() == null || numNode.getTextContent().equals(numLabel) || numNode.getTextContent().contains("#")
                    ) {
                        // Explanation for this part of this if:
                        // - hasAttributeWithValue(node, LEOS_ACTION_ATTR, LEOS_TC_INSERT_ACTION) || hasAttributeWithValue(numNode, LEOS_ACTION_ATTR, LEOS_TC_MOVE_ACTION)
                        // Skip track changes for num node as the parent node is already being tracked.
                        // Skip track change for num node as it is moved from somewhere else.
                        numNode.setTextContent(numLabel);
                        removeAttribute(node, LEOS_UID_NUMBER);
                        removeAttribute(node, LEOS_TITLE_NUMBER);
                        removeAttribute(node, LEOS_ACTION_NUMBER);
                        removeAttribute(node, LEOS_TC_ORIGINAL_NUMBER);
                    } else if (delNode != null && insNode != null) {
                        // It would be delNode != null && insNode != null && !delNode.getTextContent().equals(numLabel)
                        // But there is no need of adding !delNode.getTextContent().equals(numLabel) in the end
                        insNode.setTextContent(numLabel);
                        addAttribute(insNode, LEOS_UID, securityContext.getUser().getLogin());
                        addAttribute(insNode, LEOS_TITLE, getTitleValue(securityContext));
                    } else {
                        String oldNumLabel = numNode.getTextContent();

                        numNode.setTextContent(null);

                        Node deletedNum = createElementAsLastChildOfNode(node.getOwnerDocument(), numNode, "del", oldNumLabel);
                        addAttribute(deletedNum, LEOS_UID, securityContext.getUser().getLogin());
                        addAttribute(deletedNum, LEOS_TITLE, getTitleValue(securityContext));
                        if (POINT.equals(node.getNodeName()) || LEVEL.equals(node.getNodeName()) || RECITAL.equals(node.getNodeName())) {
                            addAttribute(deletedNum, LEOS_ACTION_NUMBER, LEOS_TC_DELETE_ACTION);
                            addAttribute(deletedNum, LEOS_TC_ORIGINAL_NUMBER, oldNumLabel);
                        }

                        if(StringUtils.isNotEmpty(numLabel)) {
                            Node insertedNum = createElementAsLastChildOfNode(node.getOwnerDocument(), numNode, "ins", numLabel);
                            addAttribute(insertedNum, LEOS_UID, securityContext.getUser().getLogin());
                            addAttribute(insertedNum, LEOS_TITLE, getTitleValue(securityContext));
                            if (POINT.equals(node.getNodeName()) || LEVEL.equals(node.getNodeName()) || RECITAL.equals(node.getNodeName())) {
                                addAttribute(insertedNum, LEOS_ACTION_NUMBER, LEOS_TC_INSERT_ACTION);
                                addAttribute(insertedNum, LEOS_TC_ORIGINAL_NUMBER, oldNumLabel);
                            }
                        }
                    }
                }
            } else if ((delNode != null) && (insNode != null)) {
                String oldNumLabel = delNode.getTextContent();
                if (!oldNumLabel.equals(numLabel)) {
                    insNode.setTextContent(numLabel);
                    addAttribute(insNode, LEOS_UID, securityContext.getUser().getLogin());
                    addAttribute(insNode, LEOS_TITLE, getTitleValue(securityContext));
                } else {
                    numNode.removeChild(delNode);
                    numNode.removeChild(insNode);
                    numNode.setTextContent(numLabel);
                    removeAttribute(node, LEOS_UID_NUMBER);
                    removeAttribute(node, LEOS_TITLE_NUMBER);
                    removeAttribute(node, LEOS_ACTION_NUMBER);
                    removeAttribute(node, LEOS_TC_ORIGINAL_NUMBER);
                }
            } else if ((insNode != null) && node.getNodeName().equalsIgnoreCase(POINT) && !insNode.getTextContent().equals(numLabel)) {
                insNode.setTextContent(numLabel);
            }
        } else {
            numNode = createElementAsFirstChildOfNode(node, getNumTag(node.getNodeName()), numLabel);
        }
        return numNode;
    }

    public static String getTitleValue(SecurityContext securityContext) {
        return securityContext.getUser().getName() + " : " + ZonedDateTime.now().format(DATE_FORMAT);
    }

    private static void buildNumElementForDivision(Node node, String numLabel, Node numNode) {
        boolean isAutoNumOverwrite = getAttributeValueAsSimpleBoolean(node, LEOS_AUTO_NUM_OVERWRITE);
        if (isAutoNumOverwrite) {
            if (!numNode.getTextContent().equals(numLabel)) {
                numNode.setTextContent(numLabel);
            }
        } else {
            String classAttr = getAttributeValue(node, CLASS_ATTR);
            formatDivisionPartWithLeosRules(node, numNode, numLabel, classAttr);
        }
    }

    public static void formatHeadingNodeForDivision(Node node, TableOfContentItemVO tocVo, Node headingNode) {
        String heading = tocVo.getHeading();
        String style = tocVo.getStyle();
        if (style.equals(TYPE_1.name().toLowerCase())) {
            heading = heading.toUpperCase();
        } else {
            heading = heading.substring(0, 1).toUpperCase() + heading.substring(1).toLowerCase();
        }
        formatDivisionPartWithLeosRules(node, headingNode, heading, style);
    }

    private static void formatDivisionPartWithLeosRules(Node node, Node divisionNodePart, String textContent, String style) {
    	Node formattedNode;
    	if (style.contains(TYPE_1.name().toLowerCase()) || style.contains(TYPE_2.name().toLowerCase())) {
    		formattedNode = getBoldNode(node, divisionNodePart, textContent);
    	} else if (style.contains(TYPE_3.name().toLowerCase())) {
    		formattedNode = getBoldNode(node, divisionNodePart, "");
    		Node iNode = getItalicNode(node, divisionNodePart, textContent);
    		formattedNode.appendChild(iNode);
    	} else { // TYPE_4
    		formattedNode = getItalicNode(node, divisionNodePart, textContent);
    	}
    	divisionNodePart.setTextContent("");
    	divisionNodePart.appendChild(formattedNode);
    }
    
    private static Node getBoldNode(Node node, Node divisionNodePart, String textContent) {
    	Node bNode;
    	if(XercesUtils.getFirstElementByName(divisionNodePart, BOLD) != null) {
    		bNode = XercesUtils.getFirstElementByName(divisionNodePart, BOLD).cloneNode(true);
    		bNode.setTextContent(textContent);
    	} else {
    		bNode = createElement(node.getOwnerDocument(), BOLD, textContent);
    	}
    	
    	return bNode;
    }
    
    private static Node getItalicNode(Node node, Node divisionNodePart, String textContent) {
    	Node iNode;
    	Node bNode = XercesUtils.getFirstElementByName(divisionNodePart, BOLD);
    	if(bNode != null && XercesUtils.getFirstElementByName(bNode, ITALICS) != null) {
    		iNode = XercesUtils.getFirstElementByName(bNode, ITALICS).cloneNode(true);
    		iNode.setTextContent(textContent);
    	} else {
    		iNode = createElement(node.getOwnerDocument(), ITALICS, textContent);
    	}
    	
    	return iNode;
    }

    private static byte[] wrapWithPageOrientationDivsFinancialStatement(Document document) {
        Element landscapeDiv = XercesUtils.createElement(document, DIV, CLASS_ATTR, ORIENTATION_LANDSCAPE, "");
        Element portraitDiv = XercesUtils.createElement(document, DIV, CLASS_ATTR, ORIENTATION_PORTRAIT, "");

        NodeList bodyNodes = XercesUtils.getElementsByXPath(document, XPathCatalog.getXPathElement(MAIN_BODY));
        boolean hasLandscapeNode = XercesUtils.hasNodeContainingAttributeValue(bodyNodes, CLASS_ATTR, ORIENTATION_LANDSCAPE);

        if (bodyNodes.getLength() == 0 || !hasLandscapeNode) {
            return XercesUtils.nodeToByteArray(document);
        }
        Node mainBody = bodyNodes.item(0);
        List<Node> children = XercesUtils.getChildren(mainBody);
        String prevElement = null;
        mainBody.setTextContent("");
        for (int i = 0; i < children.size(); i++) {
            Node node = children.get(i);
            if (XmlHelper.isOrientableNode(node.getNodeName())) {
                String orientationClass = XercesUtils.getAttributeValue(node, "class");
                if (orientationClass != null && orientationClass.contains(ORIENTATION_LANDSCAPE)) {

                    if (ORIENTATION_LANDSCAPE.equals(prevElement) || (prevElement == null)) {
                        if (prevElement == null) {
                            mainBody.appendChild(landscapeDiv);
                        }
                        landscapeDiv.appendChild(node);
                    } else {
                        landscapeDiv = XercesUtils.createElement(document, DIV, CLASS_ATTR, ORIENTATION_LANDSCAPE, "");
                        landscapeDiv.appendChild(node);
                        mainBody.appendChild(landscapeDiv);
                    }
                    prevElement = ORIENTATION_LANDSCAPE;
                } else {
                    if (ORIENTATION_PORTRAIT.equals(prevElement) || prevElement == null) {
                        if (prevElement == null) {
                            mainBody.appendChild(portraitDiv);
                        }
                        portraitDiv.appendChild(node);
                    } else {
                        portraitDiv = XercesUtils.createElement(document, DIV, CLASS_ATTR, ORIENTATION_PORTRAIT, "");
                        portraitDiv.appendChild(node);
                        mainBody.appendChild(portraitDiv);
                    }
                    prevElement = ORIENTATION_PORTRAIT;
                }
            } else if (prevElement != null) {
                mainBody.appendChild(node);
            }
        }

        return XercesUtils.nodeToByteArray(document);
    }

    /**
     * Wrap the parent of the blockcontainer
     * @param document
     * @return
     */
    private static byte[] wrapWithPageOrientationDivsExplanatoryMemorandum(Document document) {
        NodeList bodyNodes =  XercesUtils.getElementsByXPath(document, XPathCatalog.getXPathElement(BLOCKCONTAINER));
        for (int i = 0; i < bodyNodes.getLength(); i++) {
            Node node = bodyNodes.item(i);
            Element orientationDiv = XercesUtils.createElement(document, DIV, CLASS_ATTR, ORIENTATION, "");
            Node parentNode = node.getParentNode();
            parentNode.getParentNode().replaceChild(orientationDiv, parentNode);
            orientationDiv.appendChild(parentNode);
        }
        return XercesUtils.nodeToByteArray(document);
    }

    private static byte[] wrapWithPageOrientationDivsBill(Document document) {
        Stream.of(PART, "aknTitle", CHAPTER, SECTION).forEach( higherElement -> {
            NodeList nodeList = XercesUtils.getElementsByXPath(document, XPathCatalog.getXPathElement(higherElement));
            for (int i = 0; i < nodeList.getLength(); i++) {
                Node node = nodeList.item(i);
                Element div = XercesUtils.createElement(document, DIV, CLASS_ATTR,  HIGHER_DIVISION, "");
                node.getParentNode().replaceChild(div, node);
                div.appendChild(node);
            }
        });
        NodeList articleNodes = XercesUtils.getElementsByXPath(document, XPathCatalog.getXPathElement(ARTICLE));// instead of AKN_BODY
        for (int i = 0; i < articleNodes.getLength(); i++) {
            Node node = articleNodes.item(i);
            addPortraitAttributeToNode(node);
            Element div = XercesUtils.createElement(document, DIV, CLASS_ATTR,  ORIENTATION, "");
            node.getParentNode().replaceChild(div, node);
            div.appendChild(node);
        }
        addPortraitAttributeToHeading(document);
        return XercesUtils.nodeToByteArray(document);
    }

    public static byte[] wrapWithPageOrientationDivs(Document document) {
        // check if financial statement
        NodeList bodyNodes = XercesUtils.getElementsByXPath(document, XPathCatalog.getXPathFinancialStatement());
        if(bodyNodes.getLength() > 0){
            return wrapWithPageOrientationDivsFinancialStatement(document);
        }
        // check if explanatory memorandum
        bodyNodes = XercesUtils.getElementsByXPath(document, XPathCatalog.getXPathExplanatoryMemorandum());
        if(bodyNodes.getLength() > 0){
            return XercesUtils.nodeToByteArray(document);
        }
        // check if bill
        bodyNodes = XercesUtils.getElementsByXPath(document,  XPathCatalog.getXPathElement("bill"));
        if(bodyNodes.getLength() > 0){
            return wrapWithPageOrientationDivsBill(document);
        }
        // check if Annex
        bodyNodes = XercesUtils.getElementsByXPath(document,  XPathCatalog.getXPathAnnex());
        if(bodyNodes.getLength() > 0){
            return wrapWithPageOrientationDivsAnnex(document);
        }

        return XercesUtils.nodeToByteArray(document);
    }

    private static byte[] wrapWithPageOrientationDivsAnnex(Document document) {
        NodeList bodyNodes =  XercesUtils.getElementsByXPath(document, XPathCatalog.getXPathElement("heading"));
        for (int i = 0; i < bodyNodes.getLength(); i++) {
            Node node = bodyNodes.item(i);
            Element orientationDiv = XercesUtils.createElement(document, DIV, CLASS_ATTR, HIGHER_DIVISION, "");
            Node parentNode = node.getParentNode();
            parentNode.getParentNode().replaceChild(orientationDiv, parentNode);
            orientationDiv.appendChild(parentNode);
        }

        for(String nodeName : orientableNodes){
            bodyNodes = XercesUtils.getElementsByXPath(document, XPathCatalog.getXPathElement(nodeName));
            if(bodyNodes.getLength() > 0){
                break;
            }
        }

        if (bodyNodes == null || bodyNodes.getLength() == 0) {
            return XercesUtils.nodeToByteArray(document);
        }
        for (int i = 0; i < bodyNodes.getLength(); i++) {
            Node node = bodyNodes.item(i);
            String isEditable = XercesUtils.getAttributeValue(node, "leos:editable");
            if (isEditable != null && isEditable.equals("false")) {
                continue;
            }
            Node classAttr = node.getAttributes().getNamedItem(CLASS_ATTR);
            if(classAttr == null
                    || (!classAttr.getTextContent().contains(ORIENTATION_LANDSCAPE)
                    && !classAttr.getTextContent().contains(ORIENTATION_PORTRAIT))){
                XercesUtils.addAttribute(node, CLASS_ATTR, (classAttr == null ? "" : classAttr.getTextContent()) + " " + ORIENTATION_PORTRAIT );
            }
            Element orientationDiv = XercesUtils.createElement(document, DIV, CLASS_ATTR,  ORIENTATION, "");
            node.getParentNode().replaceChild(orientationDiv, node);


            orientationDiv.appendChild(node);
        }
        addPortraitAttributeToHeading(document);
        return XercesUtils.nodeToByteArray(document);
    }

    /**
     * Add portrait attribute to heading
     * @param document
     */
    private static void addPortraitAttributeToHeading(Document document) {
        NodeList nodeList = XercesUtils.getElementsByXPath(document, XPathCatalog.getXPathElement(HEADING));
        for (int i = 0; i < nodeList.getLength(); i++) {
            addPortraitAttributeToNode(nodeList.item(i));
        }
    }

    public static String addOrientationPortraitIfNone(String elementContent) {

        Document document = createXercesDocument(elementContent.getBytes(StandardCharsets.UTF_8), false);
        Node node= document.getFirstChild();
        addPortraitAttributeToNode(node);
        return XercesUtils.nodeToStringSimple(node);
    }

    private static void addPortraitAttributeToNode(Node node) {
        if(node != null) {
            Node classAttr = node.getAttributes().getNamedItem(CLASS_ATTR);
            if (classAttr == null
                    || (!classAttr.getTextContent().contains(ORIENTATION_LANDSCAPE)
                    && !classAttr.getTextContent().contains(ORIENTATION_PORTRAIT))) {
                XercesUtils.addAttribute(node, CLASS_ATTR,
                        classAttr == null ? ORIENTATION_PORTRAIT : new StringBuilder(classAttr.getTextContent())
                                .append(" ").append(ORIENTATION_PORTRAIT).toString());
            }
        }
    }

    public static String removeSoftDeletedNodes(String elementContent){
        Document xercesDocument = XercesUtils.createXercesDocument(elementContent.getBytes(StandardCharsets.UTF_8), false);
        List<Node> children = XercesUtils.getChildren(xercesDocument);
        for (Node node : children){
            removeDeletedNodes(node);
        }
       return  XercesUtils.nodeToStringSimple(xercesDocument);
    }

    private static void removeDeletedNodes(Node node) {
        if(node == null){
            return;
        }
        String nodeId = XercesUtils.getId(node);
        if(nodeId != null && nodeId.startsWith("deleted" + IdGenerator.PREFIX_DELIMITER)){
            XercesUtils.deleteElement(node);
        }else if(node.hasChildNodes()){
            List<Node> children = XercesUtils.getNodesAsList(node.getChildNodes());
            for (Node child : children){
                removeDeletedNodes(child);
            }
        }
    }

    public static byte[] removeHighlights(Document document) {
        NodeList highlightNodes = XercesUtils.getElementsByXPath(document,"//*[@name='bgcolor']");
        for (int i = 0; i < highlightNodes.getLength(); i++) {
            XercesUtils.replaceNodeWithSelfContent(highlightNodes.item(i));
        }
        return XercesUtils.nodeToByteArray(document);
    }

    public static byte[] getDocumentContent(XmlDocument document) throws RuntimeException {
        return Optional.ofNullable(document.getContent())
                .map(Maybe::get)
                .map(Content::getSource)
                .map(Content.Source::getBytes)
                .orElseThrow(
                        () -> new RuntimeException(String.format("Document %s is missing content", document.getId())));
    }

    public static final String getDocTemplate(XmlDocument document) {
        return Optional.of(document)
                .map(XmlDocument::getMetadata)
                .map(Maybe::get)
                .map(meta -> meta.getDocTemplate())
                .orElseThrow(() -> new RuntimeException(
                        String.format("Document %s is missing docTemplate", document.getId())));
    }
}
