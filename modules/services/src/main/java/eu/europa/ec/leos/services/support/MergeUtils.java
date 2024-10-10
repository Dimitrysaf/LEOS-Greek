package eu.europa.ec.leos.services.support;

import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.vo.structure.TocItem;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.util.Arrays;
import java.util.List;

import static eu.europa.ec.leos.services.support.XercesUtils.getChildren;
import static eu.europa.ec.leos.services.support.XercesUtils.getElementById;
import static eu.europa.ec.leos.services.support.XercesUtils.getFirstChild;
import static eu.europa.ec.leos.services.support.XercesUtils.getId;
import static eu.europa.ec.leos.services.support.XercesUtils.getNumTag;
import static eu.europa.ec.leos.services.support.XercesUtils.hasAttribute;
import static eu.europa.ec.leos.services.support.XercesUtils.hasAttributeWithValue;
import static eu.europa.ec.leos.services.support.XercesUtils.removeAttribute;
import static eu.europa.ec.leos.services.support.XmlHelper.EMPTY_STRING;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ACTION_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ACTION_ENTER;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ACTION_NUMBER;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_AUTO_NUM_OVERWRITE;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_DELETABLE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_EDITABLE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INDENT_LEVEL_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INDENT_NUMBERED_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INDENT_ORIGIN_INDENT_LEVEL_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INDENT_ORIGIN_NUM_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INDENT_ORIGIN_NUM_ID_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INDENT_ORIGIN_NUM_ORIGIN_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INDENT_ORIGIN_TYPE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INDENT_UNUMBERED_PARAGRAPH;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INITIAL_NUM;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_MERGE_ACTION_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ORIGIN_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_ACTION_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_ACTION_ROOT_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_DATE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_MOVED_LABEL_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_MOVE_FROM;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_MOVE_TO;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_USER_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TC_DELETE_ACTION;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TC_DELETE_ELEMENT_NAME;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TC_INSERT_ACTION;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TC_INSERT_ELEMENT_NAME;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TC_ORIGINAL_NUMBER;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TITLE;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TITLE_ENTER;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TITLE_NUMBER;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_UID;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_UID_ENTER;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_UID_NUMBER;
import static eu.europa.ec.leos.services.support.XmlHelper.MOVE_FROM;
import static eu.europa.ec.leos.services.support.XmlHelper.MOVE_TO;
import static eu.europa.ec.leos.services.support.XmlHelper.NUM;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_DELETE_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_MOVE_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.XMLID;
import static eu.europa.ec.leos.services.utils.StructureConfigUtils.getTocItemByName;

public class MergeUtils {
    private static final Logger LOG = LoggerFactory.getLogger(MergeUtils.class);

    public static void removeChildren(Node node) {
        while (node.hasChildNodes())
            node.removeChild(node.getFirstChild());
    }

    public static boolean undoAllTrackChangesForElement(Node node, Node exceptionNode) {
        NodeList nodeList = node.getChildNodes();
        for (int index = 0; index < nodeList.getLength(); index++) {
            Node childNode = nodeList.item(index);
            if (childNode.getNodeType() != Node.TEXT_NODE && !getId(childNode).equals(getId(exceptionNode))) {
                boolean isNodeDeleted = undoCleanTrackChanges(childNode, true);
                if(isNodeDeleted) {
                    index--;
                } else {
                    isNodeDeleted = undoAllTrackChangesForElement(childNode, exceptionNode);
                    if(isNodeDeleted) {
                        index--;
                    }
                }
            }
        }
        return false;
    }

    public static boolean undoAllTrackChangesForElement(Node node, boolean resetNum) {
        NodeList nodeList = node.getChildNodes();
        for (int index = 0; index < nodeList.getLength(); index++) {
            Node childNode = nodeList.item(index);
            if (childNode.getNodeType() != Node.TEXT_NODE) {
                boolean isNodeDeleted = undoCleanTrackChanges(childNode, resetNum);
                if(isNodeDeleted) {
                    index--;
                } else {
                    isNodeDeleted = undoAllTrackChangesForElement(childNode, resetNum);
                    if(isNodeDeleted) {
                        index--;
                    }
                }
            }
        }
        return false;
    }

    private static boolean undoCleanTrackChanges(Node node, boolean resetNum) {
        boolean isNodeDeleted = false;
        if (LEOS_TC_DELETE_ELEMENT_NAME.equals(node.getNodeName())) {
            XercesUtils.replaceElement(node.getFirstChild(), node);
            isNodeDeleted = true;
        } else if (LEOS_TC_INSERT_ELEMENT_NAME.equals(node.getNodeName())) {
            Node parent = node.getParentNode();
            XercesUtils.deleteElement(node);
            List<Node> children = parent != null ? getChildren(parent) : null;
            while (parent != null
                    && !parent.getNodeName().equals(NUM)
                    && (StringUtils.isBlank(parent.getTextContent())
                    || (children.size() == 1 && children.get(0).getNodeName().equals(NUM)))) {
                Node tmp = parent;
                parent = parent.getParentNode();
                if (tmp.getParentNode() != null) {
                    XercesUtils.deleteElement(tmp);
                }
                children = parent != null ? getChildren(parent) : null;
            }
            if (parent != null && parent.getNodeName().equals(NUM) && resetNum && StringUtils.isBlank(parent.getTextContent())) {
                parent.setTextContent("#");
            }
            isNodeDeleted = true;
        } else if (hasAttributeWithValue(node, LEOS_ACTION_ATTR, LEOS_TC_DELETE_ACTION)
                || hasAttributeWithValue(node, LEOS_SOFT_ACTION_ATTR, MOVE_TO)) {
            removeTrackChangesAttributes(node, true);
        } else if (hasAttributeWithValue(node, LEOS_ACTION_ATTR, LEOS_TC_INSERT_ACTION)
                || hasAttributeWithValue(node, LEOS_SOFT_ACTION_ATTR, MOVE_FROM)) {
            Node parent = node.getParentNode();
            XercesUtils.deleteElement(node);
            List<Node> children = parent != null ? getChildren(parent) : null;
            while (parent != null && !parent.getNodeName().equals(NUM) && (StringUtils.isBlank(parent.getTextContent())
                    || (children.size() == 1 && children.get(0).getNodeName().equals(NUM)))) {
                Node tmp = parent;
                parent = parent.getParentNode();
                if (tmp.getParentNode() != null) {
                    XercesUtils.deleteElement(tmp);
                }
                children = parent != null ? getChildren(parent) : null;
            }
            if (parent != null && parent.getNodeName().equals(NUM) && resetNum && StringUtils.isBlank(parent.getTextContent())) {
                parent.setTextContent("#");
            }
            isNodeDeleted = true;
        }
        return isNodeDeleted;
    }

    public static void removeTrackChangesAttributes(Node nodeToRestore, boolean resetNum) {
        List<String> attrsToRemove = Arrays.asList(LEOS_SOFT_USER_ATTR, LEOS_SOFT_DATE_ATTR, LEOS_SOFT_ACTION_ATTR,
                LEOS_SOFT_MOVED_LABEL_ATTR, LEOS_SOFT_ACTION_ROOT_ATTR, LEOS_SOFT_MOVE_TO, LEOS_SOFT_MOVE_FROM,
                LEOS_ACTION_NUMBER, LEOS_TC_ORIGINAL_NUMBER, LEOS_TITLE_NUMBER, LEOS_UID_NUMBER, LEOS_ACTION_ENTER,
                LEOS_TITLE_ENTER, LEOS_UID_ENTER, LEOS_ACTION_ATTR, LEOS_TITLE, LEOS_ORIGIN_ATTR,
                LEOS_UID, LEOS_INITIAL_NUM, LEOS_AUTO_NUM_OVERWRITE, LEOS_INDENT_LEVEL_ATTR, LEOS_INDENT_NUMBERED_ATTR,
                LEOS_INDENT_ORIGIN_TYPE_ATTR, LEOS_INDENT_ORIGIN_INDENT_LEVEL_ATTR, LEOS_INDENT_ORIGIN_NUM_ID_ATTR,
                LEOS_INDENT_ORIGIN_NUM_ATTR, LEOS_INDENT_ORIGIN_NUM_ORIGIN_ATTR, LEOS_INDENT_UNUMBERED_PARAGRAPH);
        for (String attrToRemove: attrsToRemove) {
            XercesUtils.removeAttribute(nodeToRestore, attrToRemove);
        }
        if (getId(nodeToRestore).startsWith(SOFT_MOVE_PLACEHOLDER_ID_PREFIX)) {
            XercesUtils.updateXMLIDAttribute(nodeToRestore, EMPTY_STRING, true);
        }
        if (resetNum) {
            Node numNode = getFirstChild(nodeToRestore, NUM);
            if (numNode != null) {
                removeTrackChangesAttributes(numNode, false);
                numNode.setTextContent("#");
                removeAttribute(numNode, LEOS_ORIGIN_ATTR);
            }
        }
    }

    public static String removesPrefixFromElementId(String elementId) {
        String cleanedElementId = elementId;
        if (elementId.contains(SOFT_MOVE_PLACEHOLDER_ID_PREFIX)) {
            cleanedElementId = elementId.replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
        }
        if (elementId.contains(SOFT_DELETE_PLACEHOLDER_ID_PREFIX)) {
            cleanedElementId = elementId.replace(SOFT_DELETE_PLACEHOLDER_ID_PREFIX, "");
        }
        return cleanedElementId;
    }

    public static String removesDeletedPrefixFromElementId(String elementId) {
        String cleanedElementId = elementId;
        if (elementId.contains(SOFT_DELETE_PLACEHOLDER_ID_PREFIX)) {
            cleanedElementId = elementId.replace(SOFT_DELETE_PLACEHOLDER_ID_PREFIX, "");
        }
        return cleanedElementId;
    }

    public static String removesMovedPrefixFromElementId(String elementId) {
        String cleanedElementId = elementId;
        if (elementId.contains(SOFT_MOVE_PLACEHOLDER_ID_PREFIX)) {
            cleanedElementId = elementId.replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
        }
        return cleanedElementId;
    }

    public static byte[] copyTrackChangesAttributes(List<TocItem> tocItemsList, XmlContentProcessor xmlContentProcessor, byte[] xmlContent, Node sourceElement,
                                              String elementId) {
        Node destNode = getElementById(xmlContent, elementId);
        if (destNode == null) {
            return xmlContent;
        }
        List<String> attrsToCopy = Arrays.asList(LEOS_SOFT_USER_ATTR, LEOS_SOFT_DATE_ATTR, LEOS_SOFT_ACTION_ATTR, LEOS_SOFT_MOVED_LABEL_ATTR,
                LEOS_SOFT_ACTION_ROOT_ATTR, LEOS_SOFT_MOVE_TO, LEOS_SOFT_MOVE_FROM, LEOS_ORIGIN_ATTR, LEOS_ACTION_ATTR, LEOS_TITLE,
                LEOS_UID, LEOS_ACTION_NUMBER, LEOS_TC_ORIGINAL_NUMBER, LEOS_TITLE_NUMBER, LEOS_UID_NUMBER, LEOS_ACTION_ENTER,
                LEOS_TITLE_ENTER, LEOS_UID_ENTER, LEOS_EDITABLE_ATTR, LEOS_DELETABLE_ATTR, LEOS_INDENT_LEVEL_ATTR,
                LEOS_INDENT_NUMBERED_ATTR,
                LEOS_INDENT_ORIGIN_TYPE_ATTR, LEOS_INDENT_ORIGIN_INDENT_LEVEL_ATTR, LEOS_INDENT_ORIGIN_NUM_ID_ATTR,
                LEOS_INDENT_ORIGIN_NUM_ATTR, LEOS_INDENT_ORIGIN_NUM_ORIGIN_ATTR, LEOS_INDENT_UNUMBERED_PARAGRAPH);
        TocItem tocItem = getTocItemByName(tocItemsList, sourceElement.getNodeName().replace("akn", ""));
        for (String attr : attrsToCopy) {
            if (XercesUtils.hasAttribute(sourceElement, attr)) {
                if (tocItem == null || ((!attr.equals(LEOS_EDITABLE_ATTR) || tocItem.isEditable()) && (!attr.equals(LEOS_DELETABLE_ATTR) || tocItem.isDeletable())) ) {
                    xmlContent = xmlContentProcessor.insertAttributeToElement(xmlContent, sourceElement.getNodeName().toLowerCase(), elementId,
                            attr,
                            XercesUtils.getAttributeValue(sourceElement, attr));
                } else {
                    xmlContent = xmlContentProcessor.removeAttributeFromElement(xmlContent, elementId,
                            attr);
                }
            }
        }
        if (!getId(sourceElement).equals(elementId)) {
            xmlContent = xmlContentProcessor.insertAttributeToElement(xmlContent, sourceElement.getNodeName().toLowerCase(), elementId,
                    XMLID,
                    XercesUtils.getAttributeValue(sourceElement, XMLID));
        }
        Node sourceNumNode = getFirstChild(sourceElement, getNumTag(sourceElement.getNodeName()));
        Node destNumNode = getFirstChild(destNode, getNumTag(destNode.getNodeName()));
        if (sourceNumNode != null && destNumNode!=null) {
            String numId = getId(destNumNode);
            xmlContent = copyTrackChangesAttributes(tocItemsList, xmlContentProcessor, xmlContent, sourceNumNode, numId);
        }
        return xmlContent;
    }

    public static void copyTrackChangesAttributes(List<TocItem> tocItemsList, Node destElement, Node sourceElement) {
        List<String> attrsToCopy = Arrays.asList(LEOS_SOFT_USER_ATTR, LEOS_SOFT_DATE_ATTR, LEOS_SOFT_ACTION_ATTR, LEOS_SOFT_MOVED_LABEL_ATTR,
                LEOS_SOFT_ACTION_ROOT_ATTR, LEOS_SOFT_MOVE_TO, LEOS_SOFT_MOVE_FROM, LEOS_ORIGIN_ATTR, LEOS_ACTION_ATTR, LEOS_TITLE,
                LEOS_UID, LEOS_ACTION_NUMBER, LEOS_TC_ORIGINAL_NUMBER, LEOS_TITLE_NUMBER, LEOS_UID_NUMBER, LEOS_ACTION_ENTER,
                LEOS_TITLE_ENTER, LEOS_UID_ENTER, LEOS_EDITABLE_ATTR, LEOS_DELETABLE_ATTR, LEOS_INDENT_LEVEL_ATTR,
                LEOS_INDENT_NUMBERED_ATTR,
                LEOS_INDENT_ORIGIN_TYPE_ATTR, LEOS_INDENT_ORIGIN_INDENT_LEVEL_ATTR, LEOS_INDENT_ORIGIN_NUM_ID_ATTR,
                LEOS_INDENT_ORIGIN_NUM_ATTR, LEOS_INDENT_ORIGIN_NUM_ORIGIN_ATTR, LEOS_INDENT_UNUMBERED_PARAGRAPH);
        TocItem tocItem = getTocItemByName(tocItemsList, destElement.getNodeName().replace("akn", ""));
        for (String attr : attrsToCopy) {
            if (XercesUtils.hasAttribute(sourceElement, attr)) {
                if (tocItem == null || ((!attr.equals(LEOS_EDITABLE_ATTR) || tocItem.isEditable()) && (!attr.equals(LEOS_DELETABLE_ATTR) || tocItem.isDeletable())) ) {
                    XercesUtils.addAttribute(destElement,
                            attr,
                            XercesUtils.getAttributeValue(sourceElement, attr));
                } else {
                    XercesUtils.removeAttribute(destElement,
                            attr);
                }
            }
        }
        XercesUtils.addAttribute(destElement,
                XMLID,
                XercesUtils.getAttributeValue(sourceElement, XMLID));
        Node sourceNumNode = getFirstChild(sourceElement, getNumTag(sourceElement.getNodeName()));
        Node destNumNode = getFirstChild(destElement, getNumTag(sourceElement.getNodeName()));
        if (sourceNumNode != null && destNumNode != null) {
            copyTrackChangesAttributes(tocItemsList, destNumNode, sourceNumNode);
        }
    }

    public static Node getSiblingForRenumbering(Node node) {
        Node sibling = XercesUtils.getPrevSibling(node,
                node.getNodeName());
        if (sibling == null) {
            sibling = XercesUtils.getNextSibling(node,
                    node.getNodeName());
        }
        if (sibling == null) {
            sibling = node.getParentNode();
        }
        if (sibling == null) {
            return node;
        } else {
            return sibling;
        }
    }

    public static boolean isUnselected(Node node, List<String> ids) {
        if (ids.contains(getId(node)) && !hasAttribute(node, LEOS_MERGE_ACTION_ATTR)) {
            return true;
        }
        Node parent = node.getParentNode();
        while (parent != null && (getId(parent) == null || !ids.contains(getId(parent)))) {
            if (hasAttribute(parent, LEOS_MERGE_ACTION_ATTR)) {
                return false;
            }
            parent = parent.getParentNode();
        }
        return parent != null;
    }
}
