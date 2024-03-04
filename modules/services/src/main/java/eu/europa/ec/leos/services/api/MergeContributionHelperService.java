package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.model.action.SoftActionType;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.services.clone.InternalRefMap;
import eu.europa.ec.leos.services.document.ContributionService;
import eu.europa.ec.leos.services.dto.request.ApplyContributionsRequest;
import eu.europa.ec.leos.services.dto.request.MergeActionVO;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.vo.structure.TocItem;
import io.atlassian.fugue.Pair;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static eu.europa.ec.leos.services.dto.request.MergeActionVO.ElementState;
import static eu.europa.ec.leos.services.support.XercesUtils.getAttributeValue;
import static eu.europa.ec.leos.services.support.XercesUtils.getContentNodeAsXmlFragment;
import static eu.europa.ec.leos.services.support.XercesUtils.getFirstChild;
import static eu.europa.ec.leos.services.support.XercesUtils.getId;
import static eu.europa.ec.leos.services.support.XercesUtils.getNumTag;
import static eu.europa.ec.leos.services.support.XercesUtils.nodeToByteArray;
import static eu.europa.ec.leos.services.support.XercesUtils.nodeToString;
import static eu.europa.ec.leos.services.support.XercesUtils.removeAttribute;
import static eu.europa.ec.leos.services.support.XercesUtils.replaceElement;
import static eu.europa.ec.leos.services.support.XmlHelper.EC;
import static eu.europa.ec.leos.services.support.XmlHelper.EMPTY_STRING;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ACTION_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ACTION_NUMBER;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_EDITABLE_ATTR;
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
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TITLE_NUMBER;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_UID;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_UID_NUMBER;
import static eu.europa.ec.leos.services.support.XmlHelper.LS;
import static eu.europa.ec.leos.services.support.XmlHelper.NUM;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_DELETE_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_MOVE_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.UTF_8;
import static eu.europa.ec.leos.services.support.XmlHelper.XMLID;


@Service
public class MergeContributionHelperService {

    private static final Logger LOG = LoggerFactory.getLogger(MergeContributionHelperService.class);

    private final XmlContentProcessor xmlContentProcessor;
    private final ContributionService contributionService;

    private final int MAX_LENGTH_STR_FOUND = 10;

    public MergeContributionHelperService(XmlContentProcessor xmlContentProcessor,
                                          ContributionService contributionService) {
        this.xmlContentProcessor = xmlContentProcessor;
        this.contributionService = contributionService;
    }

    private void setActionAttributeOnImpactedElements(Node doc, String action, String id, String actionToSearch) {
        NodeList impactedElements = XercesUtils.getElementsByXPath(doc,
                "//*[@" + XMLID + " = '" + id + "']//*[@" + actionToSearch + "]");
        for (int i = 0; i < impactedElements.getLength(); i++) {
            Node impactedElement = impactedElements.item(i);
            setActionAttribute(doc, impactedElement, action);
        }
    }

    private void setActionAttribute(Node doc, Node node, String action) {
        XercesUtils.insertOrUpdateAttributeValue(node, LEOS_MERGE_ACTION_ATTR, action);
        String id = getId(node);
        setActionAttributeOnImpactedElements(doc, action, id.replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, ""), LEOS_ACTION_ATTR);
        setActionAttributeOnImpactedElements(doc, action, id.replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, ""), LEOS_SOFT_ACTION_ATTR);
        if (XercesUtils.hasAttribute(node, LEOS_SOFT_MOVE_FROM) || XercesUtils.hasAttribute(node, LEOS_SOFT_MOVE_TO)) {
            if (id.contains(SOFT_MOVE_PLACEHOLDER_ID_PREFIX)) {
                Node moveFromContributionElement = XercesUtils.getElementById(doc,
                        id.replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, ""));
                XercesUtils.insertOrUpdateAttributeValue(moveFromContributionElement, LEOS_MERGE_ACTION_ATTR, action);
            } else {
                Node moveToContributionElement = XercesUtils.getElementById(doc,
                        SOFT_MOVE_PLACEHOLDER_ID_PREFIX + id);
                XercesUtils.insertOrUpdateAttributeValue(moveToContributionElement, LEOS_MERGE_ACTION_ATTR, action);
            }
        }
    }

    private void updateActionOnImpactedElements(Node doc, String action, String id) {
        Node node = XercesUtils.getElementById(doc, id);
        setActionAttribute(doc, node, action);
        setActionAttributeOnImpactedElements(doc, action, id, LEOS_ACTION_ATTR);
        setActionAttributeOnImpactedElements(doc, action, id, LEOS_SOFT_ACTION_ATTR);
    }

    private void removeActionAttributeOnImpactedElements(Node doc, String id, String actionToSearch) {
        NodeList impactedElements = XercesUtils.getElementsByXPath(doc,
                "//*[@" + XMLID + " = '" + id + "']//*[@" + actionToSearch + "]");
        for (int i = 0; i < impactedElements.getLength(); i++) {
            Node impactedElement = impactedElements.item(i);
            removeActionAttribute(doc, impactedElement);
        }
    }

    private void removeActionAttribute(Node doc, Node node) {
        XercesUtils.removeAttribute(node, LEOS_MERGE_ACTION_ATTR);
        String id = getId(node);
        if (XercesUtils.hasAttribute(node, LEOS_SOFT_MOVE_FROM) || XercesUtils.hasAttribute(node, LEOS_SOFT_MOVE_TO)) {
            if (id.contains(SOFT_MOVE_PLACEHOLDER_ID_PREFIX)) {
                Node moveFromContributionElement = XercesUtils.getElementById(doc,
                        id.replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, ""));
                XercesUtils.removeAttribute(moveFromContributionElement, LEOS_MERGE_ACTION_ATTR);
            } else {
                Node moveToContributionElement = XercesUtils.getElementById(doc,
                        SOFT_MOVE_PLACEHOLDER_ID_PREFIX + id);
                XercesUtils.removeAttribute(moveToContributionElement, LEOS_MERGE_ACTION_ATTR);
            }
        }
    }

    private void removeActionOnImpactedElements(Node doc, String action, String id) {
        Node node = XercesUtils.getElementById(doc, id);
        removeActionAttribute(doc, node);
        removeActionAttributeOnImpactedElements(doc, id, LEOS_MERGE_ACTION_ATTR);
    }

    public byte[] updateDocumentWithContributions(ApplyContributionsRequest request, XmlDocument xmlDocument, List<TocItem> tocItemList,
                                                  List<InternalRefMap> intRefMap) throws IOException {

        byte[] xmlContent = xmlDocument.getContent().get().getSource().getBytes();
        byte[] contributionXmlContent = request.getMergeActions().isEmpty() ? null : request.getMergeActions().get(0).getContributionVO().getXmlContent();
        Node contributionDocument = XercesUtils.createXercesDocument(contributionXmlContent);
        // Sort the merge actions so that move actions are done first
        List<MergeActionVO> sortedUndoEvents =
                request.getMergeActions().stream().filter((MergeActionVO m) -> m.getAction().equals(MergeActionVO.MergeAction.UNDO)).collect(Collectors.toList());
        sortedUndoEvents =
                sortedUndoEvents.stream().sorted(Comparator.comparing((MergeActionVO m) -> m.getElementState())).collect(Collectors.toList());
        List<MergeActionVO> sortedActionEvents =
                request.getMergeActions().stream().filter((MergeActionVO m) -> !m.getAction().equals(MergeActionVO.MergeAction.UNDO)).collect(Collectors.toList());
        sortedActionEvents = sortedActionEvents.stream().sorted(Collections.reverseOrder(Comparator.comparing((MergeActionVO m) -> m.getElementState()))).collect(Collectors.toList());
        for (MergeActionVO mergeActionVO : sortedActionEvents ) {
            if (!mergeActionVO.getAction().equals(MergeActionVO.MergeAction.PROCESSED)) {
                xmlContent = acceptTrackChangesFromContribution(mergeActionVO.getContributionVO(), xmlContent, mergeActionVO.getElementId(),
                        mergeActionVO.getElementState(),
                        intRefMap, mergeActionVO.isWithTrackChanges());
            }
            updateActionOnImpactedElements(contributionDocument, mergeActionVO.getAction().name(), mergeActionVO.getElementId());
        }
        for (MergeActionVO mergeActionVO : sortedUndoEvents ) {
            xmlContent = undoTrackChangesFromContribution(mergeActionVO.getContributionVO(), xmlContent, mergeActionVO.getElementId(),
                    mergeActionVO.getElementState(),
                    intRefMap);
            removeActionOnImpactedElements(contributionDocument, mergeActionVO.getAction().name(), mergeActionVO.getElementId());
        }
        if (!request.getMergeActions().isEmpty()) {
            contributionXmlContent = nodeToByteArray(contributionDocument);
            executeContributionAction(request.getMergeActions().get(0), contributionXmlContent);
        }
        return xmlContent;
    }

    private boolean processInsDelEltsInContent(Node nodeToBeUpdated, Node nodeToBeAddedOrRemoved, boolean withTrackChanges, boolean isAdded) {
        Node originalRemovedNode = XercesUtils.getElementById(nodeToBeUpdated, getId(nodeToBeAddedOrRemoved));
        boolean found = false;
        if (originalRemovedNode == null) {
            Node originalUpdatedNode = XercesUtils.getElementById(nodeToBeUpdated, getId(nodeToBeAddedOrRemoved.getParentNode()));
            if (originalUpdatedNode != null) {
                String contentToBeRemoved = getContentNodeAsXmlFragment(nodeToBeAddedOrRemoved);
                Node previousNode = getSibling(nodeToBeAddedOrRemoved, true);
                String prevContent = getContent(previousNode);
                Node previousNodeParent = previousNode!=null ? XercesUtils.getElementById(originalUpdatedNode, getId(previousNode.getParentNode())) : null;
                Node nextNode = getSibling(nodeToBeAddedOrRemoved, false);
                String nextContent = getContent(nextNode);
                Node nextNodeParent = nextNode != null ? XercesUtils.getElementById(originalUpdatedNode, getId(nextNode.getParentNode())) : null;
                if (previousNodeParent != null) {
                    prevContent = prevContent.length() > MAX_LENGTH_STR_FOUND ? prevContent.substring(prevContent.length() - MAX_LENGTH_STR_FOUND - 1) :
                            prevContent;
                    if (!isAdded) {
                        String contentToBeUpdated = nodeToString(previousNodeParent);
                        int index = contentToBeUpdated.indexOf(prevContent);
                        if (prevContent.length() > 1 && !StringUtils.isBlank(prevContent) &&  index >= 0) {
                            String prevContentInOriginalContent = contentToBeUpdated.substring(0, index + prevContent.length());
                            String strToBeUpdated = contentToBeUpdated.substring(index + prevContent.length());
                            contentToBeRemoved = strToBeUpdated.indexOf(contentToBeRemoved) >= 0 ? contentToBeRemoved : contentToBeRemoved.trim();
                            if (withTrackChanges) {
                                XercesUtils.replaceElement(previousNodeParent,
                                        prevContentInOriginalContent + strToBeUpdated.replaceFirst(Pattern.quote(contentToBeRemoved),
                                                nodeToString(nodeToBeAddedOrRemoved)));
                            } else {
                                XercesUtils.replaceElement(previousNodeParent,
                                        prevContentInOriginalContent + strToBeUpdated.replaceFirst(Pattern.quote(contentToBeRemoved),
                                                ""));
                            }
                            found = true;
                        }
                    } else {
                        NodeList children = previousNodeParent.getChildNodes();
                        for (int i = 0; i < children.getLength(); i++) {
                            Node child = children.item(i);
                            String childContent = getContent(child);
                            if (childContent.indexOf(prevContent) >= 0 && prevContent.length() > 1 && !StringUtils.isBlank(prevContent)) {
                                if (withTrackChanges) {
                                    XercesUtils.replaceElement(child, nodeToString(child).replaceFirst(Pattern.quote(prevContent),
                                            prevContent + nodeToString(nodeToBeAddedOrRemoved)));
                                } else {
                                    XercesUtils.replaceElement(child, nodeToString(child).replaceFirst(Pattern.quote(prevContent),
                                            prevContent + getContentNodeAsXmlFragment(nodeToBeAddedOrRemoved)));
                                }
                                found = true;
                                break;
                            }
                        }
                    }
                }
                if (nextNodeParent != null && !found) {
                    nextContent = nextContent.length() > MAX_LENGTH_STR_FOUND ? nextContent.substring(0, MAX_LENGTH_STR_FOUND) :
                            nextContent;
                    if (!isAdded) {
                        String contentToBeUpdated = nodeToString(nextNodeParent);
                        int index = contentToBeUpdated.indexOf(nextContent);
                        if (nextContent.length() > 1 && !StringUtils.isBlank(nextContent) && index >= 0) {
                            String nextContentInOriginalContent = contentToBeUpdated.substring(index);
                            String strToBeUpdated = contentToBeUpdated.substring(0, index);
                            contentToBeRemoved = strToBeUpdated.indexOf(contentToBeRemoved) >= 0 ? contentToBeRemoved : contentToBeRemoved.trim();
                            if (withTrackChanges) {
                                XercesUtils.replaceElement(nextNodeParent,
                                        strToBeUpdated.replaceFirst(Pattern.quote(contentToBeRemoved),
                                                nodeToString(nodeToBeAddedOrRemoved)) + nextContentInOriginalContent);
                            } else {
                                XercesUtils.replaceElement(nextNodeParent,
                                        strToBeUpdated.replaceFirst(Pattern.quote(contentToBeRemoved),
                                                "") + nextContentInOriginalContent);
                            }
                            found = true;
                        }
                    } else {
                        NodeList children = nextNodeParent.getChildNodes();
                        for (int i = 0; i < children.getLength(); i++) {
                            Node child = children.item(i);
                            String childContent = getContent(child);
                            if (childContent.indexOf(nextContent) >= 0 && nextContent.length() > 1 && !StringUtils.isBlank(nextContent)) {
                                if (withTrackChanges) {
                                    XercesUtils.replaceElement(child, nodeToString(child).replaceFirst(Pattern.quote(nextContent),
                                            nodeToString(nodeToBeAddedOrRemoved) + nextContent));
                                } else {
                                    XercesUtils.replaceElement(child, nodeToString(child).replaceFirst(Pattern.quote(nextContent),
                                            getContentNodeAsXmlFragment(nodeToBeAddedOrRemoved) + nextContent));
                                }
                                found = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
        return found;
    }

    // Marks as accepted all "ins" and "del" tag in contribution node -- Used while accepting without track changes
    private void processInsertedAndDeletedTextInContributionNode(Node contributionNode, Node refNodeForContent, boolean withTrackChanges) {
        NodeList insElts = XercesUtils.getElementsByName(contributionNode, LEOS_TC_INSERT_ELEMENT_NAME);
        for (int i = 0; i < insElts.getLength(); i++) {
            Node insElt = insElts.item(i);
            if (!insElt.getParentNode().getNodeName().equals(NUM)) {
                processInsDelEltsInContent(refNodeForContent, insElt, withTrackChanges, true);
            }
        }
        NodeList delElts = XercesUtils.getElementsByName(contributionNode, LEOS_TC_DELETE_ELEMENT_NAME);
        for (int i = 0; i < delElts.getLength(); i++) {
            Node delElt = delElts.item(i);
            if (!delElt.getParentNode().getNodeName().equals(NUM)) {
                processInsDelEltsInContent(refNodeForContent, delElt, withTrackChanges, false);
            }
        }
    }

    // Marks as accepted all added or removed tracked elements in contribution node -- Used while accepting without track changes
    private void processInsertedAndDeletedElementsInContributionNode(Node contributionNode, Node refNodeForContent, String elementId,
                                                                     boolean withTrackChanges) {
        NodeList addedElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_ACTION_ATTR + " = '" + LEOS_TC_INSERT_ACTION + "']");
        for (int i = 0; i < addedElts.getLength(); i++) {
            Node addedElt = addedElts.item(i);
            if (!addedElt.getNodeName().toLowerCase().equals(NUM) && !XercesUtils.hasAttribute(addedElt, LEOS_SOFT_MOVE_FROM)) {
                acceptAdditionOnNode(refNodeForContent, addedElt, nodeToString(addedElt), withTrackChanges);
            }
        }
        NodeList deletedElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_ACTION_ATTR + " = '" + LEOS_TC_DELETE_ACTION + "']");
        for (int i = 0; i < deletedElts.getLength(); i++) {
            Node deletedElt = deletedElts.item(i);
            if (!deletedElt.getNodeName().toLowerCase().equals(NUM) && !XercesUtils.hasAttribute(deletedElt, LEOS_SOFT_MOVE_TO)) {
                Node originalNodeToBeRemoved = XercesUtils.getElementById(refNodeForContent, getId(deletedElt));
                if (originalNodeToBeRemoved != null) {
                    if (withTrackChanges) {
                        replaceElement(originalNodeToBeRemoved, nodeToString(deletedElt));
                    } else {
                        originalNodeToBeRemoved.getParentNode().removeChild(originalNodeToBeRemoved);
                    }
                }
            }
        }
    }

    // Manage moved tracked elements inside contribution node and remove or add related elements outside node in original content with or without track changes
    private byte[] processMovedElementsInContributionNode(byte[] xmlContent, byte[] contributionXmlContent, Node contributionNode, String elementId,
                                                          boolean withTrackChanges) {
        NodeList moveFromElts = XercesUtils.getElementsByXPath(contributionNode, "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_SOFT_ACTION_ATTR + " = " +
                "'" + SoftActionType.MOVE_FROM.getSoftAction() + "']");
        for (int i = 0; i < moveFromElts.getLength(); i++) {
            Node moveFromElt = moveFromElts.item(i);
            //Get moved element in original document
            String moveFromId = getId(moveFromElt);

            Node elementInOriginalContent = moveFromId != null ? XercesUtils.getElementById(xmlContent, moveFromId) : null;
            Node movedElementInOriginalContent = moveFromId != null ? XercesUtils.getElementById(xmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId)
                    : null;
            if (elementInOriginalContent != null && movedElementInOriginalContent == null) {
                if (withTrackChanges) {
                    Node moveToElt = XercesUtils.getElementById(contributionXmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId);
                    xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(moveToElt), moveFromId);
                } else {
                    xmlContent = xmlContentProcessor.removeElementById(xmlContent, moveFromId, false);
                }
                if (!withTrackChanges) {
                    resolveTrackChange(moveFromElt);
                }
            }
        }
        NodeList moveToElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_SOFT_ACTION_ATTR + " = '" + SoftActionType.MOVE_TO.getSoftAction() + "']");
        for (int i = 0; i < moveToElts.getLength(); i++) {
            Node moveToElt = moveToElts.item(i);
            //Get moved element in original document
            String moveFromId = getId(moveToElt).replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");

            Node elementInOriginalContent = moveFromId != null ? XercesUtils.getElementById(xmlContent, moveFromId) : null;
            Node movedElementInOriginalContent = moveFromId != null ? XercesUtils.getElementById(xmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId)
                    : null;
            if (elementInOriginalContent != null && movedElementInOriginalContent == null) {
                byte[] updatedXmlContent = xmlContent;
                if (withTrackChanges) {
                    updatedXmlContent = xmlContentProcessor.replaceElementById(updatedXmlContent, nodeToString(moveToElt), moveFromId);
                } else {
                    updatedXmlContent = xmlContentProcessor.removeElementById(updatedXmlContent, moveFromId, false);
                }
                Pair<byte[], Boolean> result = acceptAddition(updatedXmlContent, contributionXmlContent, nodeToString(elementInOriginalContent), moveFromId,
                        withTrackChanges);
                if (result.right()) {
                    xmlContent = result.left();
                }
            }
        }
        return xmlContent;
    }

    private void resolveTrackChange(Node nodeToRestore) {
        XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_USER_ATTR);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_DATE_ATTR);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_ACTION_ATTR);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_ACTION_ROOT_ATTR);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_MOVED_LABEL_ATTR);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_MOVE_TO);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_MOVE_FROM);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_ACTION_NUMBER);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_TC_ORIGINAL_NUMBER);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_TITLE_NUMBER);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_UID_NUMBER);
        String origin = XercesUtils.getAttributeValue(nodeToRestore, LEOS_ORIGIN_ATTR);
        if (LS.equals(origin)) {
            XercesUtils.addAttribute(nodeToRestore, LEOS_ORIGIN_ATTR, EC);
        }
        XercesUtils.removeAttribute(nodeToRestore, LEOS_ACTION_ATTR);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_INITIAL_NUM);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_TITLE);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_UID);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_EDITABLE_ATTR);
        XercesUtils.updateXMLIDAttributeFullStructureNode(nodeToRestore, EMPTY_STRING, true);
        Node numNode = getFirstChild(nodeToRestore, getNumTag(nodeToRestore.getNodeName()));
        if (numNode != null) {
            numNode.setTextContent("#");
            XercesUtils.removeAttribute(numNode, LEOS_ACTION_ATTR);
            XercesUtils.removeAttribute(numNode, LEOS_TITLE);
            XercesUtils.removeAttribute(numNode, LEOS_UID);
            XercesUtils.addAttribute(numNode, LEOS_ORIGIN_ATTR, EC);
        }
    }

    private byte[] copyTrackChangesAttributes(byte[] xmlContent, Node sourceElement, String elementId) {
        if (XercesUtils.hasAttribute(sourceElement, LEOS_SOFT_USER_ATTR)) {
            xmlContent = xmlContentProcessor.insertAttributeToElement(xmlContent, sourceElement.getNodeName().toLowerCase(), elementId,
                    LEOS_SOFT_USER_ATTR,
                    XercesUtils.getAttributeValue(sourceElement, LEOS_SOFT_USER_ATTR));
        }
        if (XercesUtils.hasAttribute(sourceElement, LEOS_SOFT_DATE_ATTR)) {
            xmlContent = xmlContentProcessor.insertAttributeToElement(xmlContent, sourceElement.getNodeName().toLowerCase(), elementId,
                    LEOS_SOFT_DATE_ATTR,
                    XercesUtils.getAttributeValue(sourceElement, LEOS_SOFT_DATE_ATTR));
        }
        if (XercesUtils.hasAttribute(sourceElement, LEOS_SOFT_ACTION_ATTR)) {
            xmlContent = xmlContentProcessor.insertAttributeToElement(xmlContent, sourceElement.getNodeName().toLowerCase(), elementId,
                    LEOS_SOFT_ACTION_ATTR,
                    XercesUtils.getAttributeValue(sourceElement, LEOS_SOFT_ACTION_ATTR));
        }
        if (XercesUtils.hasAttribute(sourceElement, LEOS_SOFT_ACTION_ROOT_ATTR)) {
            xmlContent = xmlContentProcessor.insertAttributeToElement(xmlContent, sourceElement.getNodeName().toLowerCase(), elementId,
                    LEOS_SOFT_ACTION_ROOT_ATTR,
                    XercesUtils.getAttributeValue(sourceElement, LEOS_SOFT_ACTION_ROOT_ATTR));
        }
        if (XercesUtils.hasAttribute(sourceElement, LEOS_SOFT_MOVE_TO)) {
            xmlContent = xmlContentProcessor.insertAttributeToElement(xmlContent, sourceElement.getNodeName().toLowerCase(), elementId,
                    LEOS_SOFT_MOVE_TO,
                    XercesUtils.getAttributeValue(sourceElement, LEOS_SOFT_MOVE_TO));
        }
        if (XercesUtils.hasAttribute(sourceElement, LEOS_SOFT_MOVE_FROM)) {
            xmlContent = xmlContentProcessor.insertAttributeToElement(xmlContent, sourceElement.getNodeName().toLowerCase(), elementId,
                    LEOS_SOFT_MOVE_FROM,
                    XercesUtils.getAttributeValue(sourceElement, LEOS_SOFT_MOVE_FROM));
        }
        if (XercesUtils.hasAttribute(sourceElement, LEOS_ORIGIN_ATTR)) {
            xmlContent = xmlContentProcessor.insertAttributeToElement(xmlContent, sourceElement.getNodeName().toLowerCase(), elementId,
                    LEOS_ORIGIN_ATTR,
                    XercesUtils.getAttributeValue(sourceElement, LEOS_ORIGIN_ATTR));
        }
        if (XercesUtils.hasAttribute(sourceElement, LEOS_ACTION_ATTR)) {
            xmlContent = xmlContentProcessor.insertAttributeToElement(xmlContent, sourceElement.getNodeName().toLowerCase(), elementId,
                    LEOS_ACTION_ATTR,
                    XercesUtils.getAttributeValue(sourceElement, LEOS_ACTION_ATTR));
        }
        if (XercesUtils.hasAttribute(sourceElement, LEOS_TITLE)) {
            xmlContent = xmlContentProcessor.insertAttributeToElement(xmlContent, sourceElement.getNodeName().toLowerCase(), elementId,
                    LEOS_TITLE,
                    XercesUtils.getAttributeValue(sourceElement, LEOS_TITLE));
        }
        if (XercesUtils.hasAttribute(sourceElement, LEOS_UID)) {
            xmlContent = xmlContentProcessor.insertAttributeToElement(xmlContent, sourceElement.getNodeName().toLowerCase(), elementId,
                    LEOS_UID,
                    XercesUtils.getAttributeValue(sourceElement, LEOS_UID));
        }
        if (XercesUtils.hasAttribute(sourceElement, LEOS_EDITABLE_ATTR)) {
            xmlContent = xmlContentProcessor.insertAttributeToElement(xmlContent, sourceElement.getNodeName().toLowerCase(), elementId,
                    LEOS_EDITABLE_ATTR,
                    XercesUtils.getAttributeValue(sourceElement, LEOS_EDITABLE_ATTR));
        }
        if (!getId(sourceElement).equals(elementId)) {
            xmlContent = xmlContentProcessor.insertAttributeToElement(xmlContent, sourceElement.getNodeName().toLowerCase(), elementId,
                    XMLID,
                    XercesUtils.getAttributeValue(sourceElement, XMLID));
        }
        Node numNode = getFirstChild(sourceElement, getNumTag(sourceElement.getNodeName()));
        if (numNode != null) {
            String numId = getId(numNode);
            xmlContent = copyTrackChangesAttributes(xmlContent, numNode, numId);
        }
        return xmlContent;
    }

    private String updateInternalReferences(String xmlContentStr, List<InternalRefMap> map) {
        for (InternalRefMap internalRefMap : map) {
            xmlContentStr = xmlContentStr.replaceAll(internalRefMap.getClonedRef(), internalRefMap.getRef());
        }
        return xmlContentStr;
    }

    private boolean isNodeAdded(Node node) {
        return ((node.getNodeType() == Node.ELEMENT_NODE) && (node.getNodeName().equals(LEOS_TC_INSERT_ELEMENT_NAME)
                || (XercesUtils.hasAttribute(node, LEOS_ACTION_ATTR)
                && XercesUtils.getAttributeValue(node, LEOS_ACTION_ATTR).equals(LEOS_TC_INSERT_ACTION))));
    }

    private Node getSibling(Node node, boolean before) {
        Node siblingNode = before ? node.getPreviousSibling() : node.getNextSibling();
        while (siblingNode != null && isNodeAdded(siblingNode)) {
            siblingNode = before ? siblingNode.getPreviousSibling() : siblingNode.getNextSibling();
        }
        return siblingNode;
    }

    private boolean isNodeRemoved(Node node) {
        return ((node.getNodeType() == Node.ELEMENT_NODE) && (node.getNodeName().equals(LEOS_TC_DELETE_ELEMENT_NAME)
                || (XercesUtils.hasAttribute(node, LEOS_ACTION_ATTR) && XercesUtils.getAttributeValue(node, LEOS_ACTION_ATTR).equals(LEOS_TC_DELETE_ACTION))));
    }

    private String getContent(Node node) {
        if (node == null) {
            return null;
        }
        if (node.getNodeType() == Node.ELEMENT_NODE) {
            return getContentNodeAsXmlFragment(node);
        } else {
            return node.getTextContent();
        }
    }

    private Pair<byte[], Boolean> acceptAddition(byte[] xmlContent, byte[] contributionXMLContent, String contributionElementFragment,
                                                 String contributionElementId,
                                                 boolean withTrackChanges) {
        Element documentElement = xmlContentProcessor.getElementById(xmlContent, contributionElementId);

        Node contributionElement = XercesUtils.getElementById(contributionXMLContent, contributionElementId);

        Node contributionPreviousSibling = XercesUtils.getSibling(contributionElement, true);
        while (contributionPreviousSibling != null &&
                ((XercesUtils.hasAttribute(contributionPreviousSibling, LEOS_ACTION_ATTR)
                        && XercesUtils.getAttributeValue(contributionPreviousSibling,
                            LEOS_ACTION_ATTR).equals(LEOS_TC_INSERT_ACTION))
                    || (XercesUtils.hasAttribute(contributionPreviousSibling, LEOS_SOFT_ACTION_ATTR)
                        && XercesUtils.hasAttribute(contributionPreviousSibling, LEOS_SOFT_MOVE_FROM)))) {
            contributionPreviousSibling = XercesUtils.getSibling(contributionPreviousSibling, true);
        }
        Node contributionNextSibling = XercesUtils.getSibling(contributionElement, false);
        while (contributionNextSibling != null &&
                ((XercesUtils.hasAttribute(contributionNextSibling, LEOS_ACTION_ATTR)
                        && XercesUtils.getAttributeValue(contributionNextSibling,
                        LEOS_ACTION_ATTR).equals(LEOS_TC_INSERT_ACTION))
                        || (XercesUtils.hasAttribute(contributionNextSibling, LEOS_SOFT_ACTION_ATTR)
                        && XercesUtils.hasAttribute(contributionNextSibling, LEOS_SOFT_MOVE_FROM)))) {
            contributionNextSibling = XercesUtils.getSibling(contributionNextSibling, false);
        }
        Node contributionParentElement = contributionElement.getParentNode();

        Element xmlPreviousSibling = contributionPreviousSibling != null ? xmlContentProcessor.getElementById(xmlContent, getId(contributionPreviousSibling)) : null;
        if (xmlPreviousSibling == null && contributionPreviousSibling != null
                && (getId(contributionPreviousSibling).startsWith(SOFT_MOVE_PLACEHOLDER_ID_PREFIX)
                || getId(contributionPreviousSibling).startsWith(SOFT_DELETE_PLACEHOLDER_ID_PREFIX))) {
            xmlPreviousSibling = xmlContentProcessor.getElementById(xmlContent, getId(contributionPreviousSibling).replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX,
                    "").replace(SOFT_DELETE_PLACEHOLDER_ID_PREFIX, ""));
        }
        Element xmlNextSibling = contributionNextSibling != null ? xmlContentProcessor.getElementById(xmlContent, getId(contributionNextSibling)) : null;
        if (xmlNextSibling == null && contributionNextSibling != null
                && (getId(contributionNextSibling).startsWith(SOFT_MOVE_PLACEHOLDER_ID_PREFIX)
                || getId(contributionNextSibling).startsWith(SOFT_DELETE_PLACEHOLDER_ID_PREFIX))) {
            xmlNextSibling = xmlContentProcessor.getElementById(xmlContent, getId(contributionNextSibling).replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX,
                    "").replace(SOFT_DELETE_PLACEHOLDER_ID_PREFIX, ""));
        }
        Element xmlParentSibling = contributionParentElement != null ? xmlContentProcessor.getElementById(xmlContent, getId(contributionParentElement)) : null;

        if (documentElement != null) {
            xmlContent = xmlContentProcessor.replaceElementById(xmlContent, contributionElementFragment, contributionElementId);
            contributionElementId = contributionElementId.replace(SOFT_DELETE_PLACEHOLDER_ID_PREFIX, "").replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
            if (withTrackChanges) {
                xmlContent = copyTrackChangesAttributes(xmlContent, contributionElement, contributionElementId);
            }
            return new Pair(xmlContent, true);
        } else if (xmlPreviousSibling != null && xmlPreviousSibling.getElementId() != null) {
            xmlContent = xmlContentProcessor.insertElementByTagNameAndId(xmlContent,  contributionElementFragment,
                    xmlPreviousSibling.getElementTagName(), xmlPreviousSibling.getElementId(),false, withTrackChanges);
            contributionElementId = contributionElementId.replace(SOFT_DELETE_PLACEHOLDER_ID_PREFIX, "").replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
            if (withTrackChanges) {
                xmlContent = copyTrackChangesAttributes(xmlContent, contributionElement, contributionElementId);
            }
            return new Pair(xmlContent, true);
        } else if (xmlNextSibling !=null && xmlNextSibling.getElementId() != null) {
            xmlContent = xmlContentProcessor.insertElementByTagNameAndId(xmlContent,  contributionElementFragment,
                    xmlNextSibling.getElementTagName(), xmlNextSibling.getElementId(),true, withTrackChanges);
            contributionElementId = contributionElementId.replace(SOFT_DELETE_PLACEHOLDER_ID_PREFIX, "").replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
            if (withTrackChanges) {
                xmlContent = copyTrackChangesAttributes(xmlContent, contributionElement, contributionElementId);
            }
            return new Pair(xmlContent, true);
        } else if (xmlParentSibling != null && xmlParentSibling.getElementId() != null) {
            xmlContent = xmlContentProcessor.addChildToParent(xmlContent, contributionElementFragment, xmlParentSibling.getElementId());
            contributionElementId = contributionElementId.replace(SOFT_DELETE_PLACEHOLDER_ID_PREFIX, "").replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
            if (withTrackChanges) {
                xmlContent = copyTrackChangesAttributes(xmlContent, contributionElement, contributionElementId);
            }
            return new Pair(xmlContent, true);
        }
        return new Pair(xmlContent, false);
    }

    private void executeContributionAction(MergeActionVO mergeActionVO, byte[] updatedXmlContent) throws IOException {
        contributionService.updateContributionMergeActions(mergeActionVO.getContributionVO().
                        getDocumentId(), mergeActionVO.getContributionVO().getLegFileName(), mergeActionVO.getContributionVO().getDocumentName(),
                updatedXmlContent);
    }

    private Pair<String, byte[]> processTrackChangesFromContributionNode(byte[] xmlContent, byte[] contributionXmlContent, String elementId,
                                                                         Node contributionNode,
                                                                         Node refNodeForContent, boolean withTrackChanges) {
        processInsertedAndDeletedTextInContributionNode(contributionNode, refNodeForContent, withTrackChanges);
        xmlContent = processMovedElementsInContributionNode(xmlContent, contributionXmlContent, contributionNode, elementId, withTrackChanges);
        processInsertedAndDeletedElementsInContributionNode(contributionNode, refNodeForContent, elementId, withTrackChanges);
        if (!withTrackChanges) {
            resolveTrackChange(refNodeForContent);
        }
        return new Pair(new String(XercesUtils.nodeToByteArray(refNodeForContent), UTF_8), xmlContent);
    }

    private byte[] acceptTrackChangesFromContribution(ContributionVO contribution, byte[] xmlContent, String elementId,
                                                      ElementState elementState, List<InternalRefMap> intRefMap, boolean withTrackChanges) {
        String cleanedElementId = elementId;
        if (elementId.contains(SOFT_MOVE_PLACEHOLDER_ID_PREFIX)) {
            cleanedElementId = elementId.replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
        }
        if (elementId.contains(SOFT_DELETE_PLACEHOLDER_ID_PREFIX)) {
            cleanedElementId = elementId.replace(SOFT_DELETE_PLACEHOLDER_ID_PREFIX, "");
        }
        Pair<byte[], Boolean> resultAdd;
        Node contributionNode = XercesUtils.getElementById(contribution.getXmlContent(), elementId);
        Node originalNode = XercesUtils.getElementById(xmlContent, cleanedElementId);
        Pair<String, byte[]> result = processTrackChangesFromContributionNode(xmlContent, contribution.getXmlContent(), cleanedElementId, contributionNode,
                originalNode != null ?
                originalNode : contributionNode, withTrackChanges);
        String newFragment = result.left();
        xmlContent = result.right();
        removeAttribute(contributionNode, LEOS_MERGE_ACTION_ATTR);
        if (ElementState.DELETE.equals(elementState)) {
            xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(contributionNode), cleanedElementId);
            if (!withTrackChanges) {
                xmlContent = xmlContentProcessor.applyDeleteActionOnElement(xmlContent, SOFT_DELETE_PLACEHOLDER_ID_PREFIX + cleanedElementId, true);
            }
        } else if (ElementState.ADD.equals(elementState)) {
            newFragment = updateInternalReferences(newFragment, intRefMap);
            resultAdd = this.acceptAddition(xmlContent, contribution.getXmlContent(), newFragment, cleanedElementId,
                    true);
            xmlContent = resultAdd.left();
            if (!withTrackChanges) {
                xmlContent = xmlContentProcessor.applyAddActionOnElement(xmlContent, cleanedElementId, true);
            }
        } else if (ElementState.MOVE.equals(elementState)) {
            String softUser;
            String trackUser;
            String title;
            newFragment = updateInternalReferences(newFragment, intRefMap);
            Node contributionRemovedNode = XercesUtils.getElementById(contribution.getXmlContent(), SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId);
            if (contributionRemovedNode != null) {
                xmlContent = xmlContentProcessor.replaceElementById(xmlContent, XercesUtils.nodeToString(contributionRemovedNode), cleanedElementId);
                title = getAttributeValue(contributionRemovedNode, LEOS_TITLE);
                softUser = getAttributeValue(contributionRemovedNode, LEOS_SOFT_USER_ATTR);
                trackUser = getAttributeValue(contributionRemovedNode, LEOS_UID);
                xmlContent = xmlContentProcessor.addTrackChangesAttributesForMovedElement(xmlContent, cleanedElementId, SoftActionType.MOVE_TO, trackUser,
                        softUser, title);
            }
            resultAdd = this.acceptAddition(xmlContent, contribution.getXmlContent(), newFragment, cleanedElementId,
                    true);
            xmlContent = resultAdd.left();
            Node contributionAddedNode = XercesUtils.getElementById(contribution.getXmlContent(), cleanedElementId);
            if (contributionAddedNode != null) {
                title = getAttributeValue(contributionRemovedNode, LEOS_TITLE);
                softUser = getAttributeValue(contributionRemovedNode, LEOS_SOFT_USER_ATTR);
                trackUser = getAttributeValue(contributionRemovedNode, LEOS_UID);
                xmlContent = xmlContentProcessor.addTrackChangesAttributesForMovedElement(xmlContent, cleanedElementId, SoftActionType.MOVE_FROM, trackUser,
                        softUser, title);
            }
            if (!withTrackChanges) {
                xmlContent = xmlContentProcessor.applyMoveActionOnElement(xmlContent, cleanedElementId, true);
            }
        } else if (ElementState.CONTENT_CHANGE.equals(elementState)) {
            if (originalNode != null) {
                xmlContent = xmlContentProcessor.replaceElementById(xmlContent, newFragment, cleanedElementId);
            }
        }
        return xmlContent;
    }

    private boolean undoInsInContent(Node nodeToBeUpdated, Node nodeToBeRemovedAgain) {
        Node originalAddedNode = XercesUtils.getElementById(nodeToBeUpdated, getId(nodeToBeRemovedAgain));
        // Case where merge was done with track changes
        if (originalAddedNode != null) {
            originalAddedNode.getParentNode().removeChild(originalAddedNode);
            return true;
        } else {
            boolean found = false;
            Node originalUpdatedNode = XercesUtils.getElementById(nodeToBeUpdated, getId(nodeToBeRemovedAgain.getParentNode()));
            if (originalUpdatedNode != null) {
                String contentToBeRemoved = getContentNodeAsXmlFragment(nodeToBeRemovedAgain);
                Node previousNode = getSibling(nodeToBeRemovedAgain, true);
                String prevContent = getContent(previousNode);
                Node previousNodeParent = previousNode!=null ? XercesUtils.getElementById(originalUpdatedNode, getId(previousNode.getParentNode())) : null;
                Node nextNode = getSibling(nodeToBeRemovedAgain, false);
                String nextContent = getContent(nextNode);
                Node nextNodeParent = nextNode != null ? XercesUtils.getElementById(originalUpdatedNode, getId(nextNode.getParentNode())) : null;
                if (previousNodeParent != null) {
                    prevContent = prevContent.length() > MAX_LENGTH_STR_FOUND ? prevContent.substring(prevContent.length() - MAX_LENGTH_STR_FOUND - 1) :
                            prevContent;
                    String contentToBeUpdated = nodeToString(previousNodeParent);
                    String strToBeFound = prevContent + contentToBeRemoved;
                    if (strToBeFound.length() > 1 && !StringUtils.isBlank(strToBeFound) && contentToBeUpdated.indexOf(strToBeFound) >= 0) {
                        XercesUtils.replaceElement(nextNodeParent, contentToBeUpdated.replaceFirst(Pattern.quote(strToBeFound),
                                prevContent));
                        found = true;
                    }
                }
                if (nextNodeParent != null && !found) {
                    nextContent = nextContent.length() > MAX_LENGTH_STR_FOUND ? nextContent.substring(0, MAX_LENGTH_STR_FOUND) :
                            nextContent;
                    String contentToBeUpdated = nodeToString(nextNodeParent);
                    String strToBeFound = contentToBeRemoved + nextContent;
                    if (strToBeFound.length() > 1 && !StringUtils.isBlank(strToBeFound) && contentToBeUpdated.indexOf(strToBeFound) >= 0) {
                        XercesUtils.replaceElement(nextNodeParent, contentToBeUpdated.replaceFirst(Pattern.quote(strToBeFound),
                                nextContent));
                        found = true;
                    }
                }
            }
            return found;
        }
    }

    private boolean undoDelInContent(Node nodeToBeUpdated, Node nodeToBeAddedAgain) {
        Node originalRemovedNode = XercesUtils.getElementById(nodeToBeUpdated, getId(nodeToBeAddedAgain));
        // Case where merge was done with track changes
        if (originalRemovedNode != null) {
            XercesUtils.removeElementKeepingChildren(originalRemovedNode);
        } else {
            // Case where merge was done without track changes
            boolean found = false;
            Node originalUpdatedNode = XercesUtils.getElementById(nodeToBeUpdated, getId(nodeToBeAddedAgain.getParentNode()));
            if (originalUpdatedNode != null) {
                Node previousNode = getSibling(nodeToBeAddedAgain, true);
                String prevContent = getContent(previousNode);
                Node previousNodeParent = previousNode != null ? XercesUtils.getElementById(originalUpdatedNode, getId(previousNode.getParentNode())) : null;
                Node nextNode = getSibling(nodeToBeAddedAgain, false);
                String nextContent = getContent(nextNode);
                Node nextNodeParent = nextNode != null ? XercesUtils.getElementById(originalUpdatedNode, getId(nextNode.getParentNode())) : null;
                if (previousNodeParent != null) {
                    prevContent = prevContent.length() > MAX_LENGTH_STR_FOUND ? prevContent.substring(prevContent.length() - MAX_LENGTH_STR_FOUND - 1) :
                            prevContent;
                    NodeList children = previousNodeParent.getChildNodes();
                    for (int i = 0; i < children.getLength(); i++) {
                        Node child = children.item(i);
                        String childContent = getContent(child);
                        if (childContent.indexOf(prevContent) >= 0 && prevContent.length() > 1 && !StringUtils.isBlank(prevContent)) {
                            XercesUtils.replaceElement(child, nodeToString(child).replaceFirst(Pattern.quote(prevContent),
                                    prevContent + getContentNodeAsXmlFragment(nodeToBeAddedAgain)));
                            found = true;
                            break;
                        }
                    }
                }
                if (nextNodeParent != null && !found) {
                    nextContent = nextContent.length() > MAX_LENGTH_STR_FOUND ? nextContent.substring(0, MAX_LENGTH_STR_FOUND) :
                            nextContent;
                    NodeList children = nextNodeParent.getChildNodes();
                    for (int i = 0; i < children.getLength(); i++) {
                        Node child = children.item(i);
                        String childContent = getContent(child);
                        if (childContent.indexOf(nextContent) >= 0 && nextContent.length() > 1 && !StringUtils.isBlank(nextContent)) {
                            XercesUtils.replaceElement(child, nodeToString(child).replaceFirst(Pattern.quote(nextContent),
                                    getContentNodeAsXmlFragment(nodeToBeAddedAgain) + nextContent));
                            found = true;
                            break;
                        }
                    }
                }
            }
            return found;
        }
        return true;
    }

    // Undo all "ins" and "del" tag in contribution node -- Used while accepting without track changes
    private void undoInsertedAndDeletedTextInContributionNode(Node contributionNode, Node refNodeForContent) {
        NodeList insElts = XercesUtils.getElementsByName(contributionNode, LEOS_TC_INSERT_ELEMENT_NAME);
        for (int i = 0; i < insElts.getLength(); i++) {
            Node insElt = insElts.item(i);
            if (!insElt.getParentNode().getNodeName().toLowerCase().equals(NUM)) {
                undoInsInContent(refNodeForContent, insElt);
            }
        }
        NodeList delElts = XercesUtils.getElementsByName(contributionNode, LEOS_TC_DELETE_ELEMENT_NAME);
        for (int i = 0; i < delElts.getLength(); i++) {
            Node delElt = delElts.item(i);
            if (!delElt.getParentNode().getNodeName().toLowerCase().equals(NUM)) {
                undoDelInContent(refNodeForContent, delElt);
            }
        }
    }

    private boolean acceptAdditionOnNode(Node originalNode, Node refNode, String content, boolean withTrackChanges) {
        Node documentElement = XercesUtils.getElementById(originalNode, getId(refNode));
        Node contributionPreviousSibling = XercesUtils.getSibling(refNode, true);
        Node contributionNextSibling = XercesUtils.getSibling(refNode, false);
        Node contributionParentElement = refNode.getParentNode();

        Node xmlPreviousSibling = contributionPreviousSibling != null ? XercesUtils.getElementById(originalNode,
                getId(contributionPreviousSibling)) : null;
        Node xmlNextSibling = contributionNextSibling != null ? XercesUtils.getElementById(originalNode,
                getId(contributionNextSibling)) : null;
        Node xmlParentSibling = contributionParentElement != null ? XercesUtils.getElementById(originalNode,
                getId(contributionParentElement)) : null;

        if (documentElement == null) {
            Node newNode = XercesUtils.createNodeFromXmlFragment(originalNode.getOwnerDocument(), content.getBytes(StandardCharsets.UTF_8));
            if (!withTrackChanges) {
                resolveTrackChange(newNode);
            }
            if (xmlPreviousSibling != null) {
                XercesUtils.addSibling(newNode, xmlPreviousSibling, false);
            } else if (xmlNextSibling != null) {
                XercesUtils.addSibling(newNode, xmlNextSibling, true);
            } else if (xmlParentSibling != null) {
                XercesUtils.addChild(newNode, xmlParentSibling);
            } else {
                return false;
            }
        }
        return true;
    }

    // Undo added or removed tracked elements in contribution node -- Used while accepting without track changes
    private void undoInsertedAndDeletedElementsInContributionNode(Node contributionNode, Node refNodeForContent, String elementId) {
        NodeList addedElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_ACTION_ATTR + " = '" + LEOS_TC_INSERT_ACTION + "']");
        for (int i = 0; i < addedElts.getLength(); i++) {
            Node addedElt = addedElts.item(i);
            if (!addedElt.getNodeName().toLowerCase().equals(NUM) && !XercesUtils.hasAttribute(addedElt, LEOS_SOFT_MOVE_FROM)) {
                Node originalAddedNode = XercesUtils.getElementById(refNodeForContent, getId(addedElt));
                if (originalAddedNode != null) {
                    originalAddedNode.getParentNode().removeChild(originalAddedNode);
                }
            }
        }
        NodeList deletedElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_ACTION_ATTR + " = '" + LEOS_TC_DELETE_ACTION + "']");
        for (int i = 0; i < deletedElts.getLength(); i++) {
            Node deletedElt = deletedElts.item(i);
            if (!deletedElt.getNodeName().toLowerCase().equals(NUM) && !XercesUtils.hasAttribute(deletedElt, LEOS_SOFT_MOVE_TO)) {
                acceptAdditionOnNode(refNodeForContent, deletedElt, nodeToString(deletedElt), false);
            }
        }
    }

    private byte[] acceptAdditionOutsideNode(byte[] xmlToBeUpdated, byte[] refXml, String refId, String elementFragment, String tagName) {
        Element contributionPreviousSibling = xmlContentProcessor.getSiblingElement(refXml, tagName, refId, Collections.emptyList(), true);
        Element contributionNextSibling = xmlContentProcessor.getSiblingElement(refXml, tagName, refId, Collections.emptyList(), false);
        Element contributionParentElement = xmlContentProcessor.getParentElement(refXml, refId);

        Element xmlPreviousSibling = contributionPreviousSibling != null ? xmlContentProcessor.getElementById(xmlToBeUpdated, contributionPreviousSibling.getElementId()) : null;
        Element xmlNextSibling = contributionNextSibling != null ? xmlContentProcessor.getElementById(xmlToBeUpdated, contributionNextSibling.getElementId()) : null;
        Element xmlParentSibling = contributionParentElement != null ? xmlContentProcessor.getElementById(xmlToBeUpdated, contributionParentElement.getElementId()) : null;

        if (xmlPreviousSibling != null && xmlPreviousSibling.getElementId() != null) {
            xmlToBeUpdated = xmlContentProcessor.insertElementByTagNameAndId(xmlToBeUpdated,  elementFragment,
                    contributionPreviousSibling.getElementTagName(), contributionPreviousSibling.getElementId(),false, false);
        } else if (xmlNextSibling !=null && xmlNextSibling.getElementId() != null) {
            xmlToBeUpdated = xmlContentProcessor.insertElementByTagNameAndId(xmlToBeUpdated,  elementFragment,
                    contributionNextSibling.getElementTagName(), contributionNextSibling.getElementId(),true, false);
        } else if (xmlParentSibling != null && xmlParentSibling.getElementId() != null) {
            xmlToBeUpdated = xmlContentProcessor.addChildToParent(xmlToBeUpdated,  elementFragment, contributionParentElement.getElementId());
        }
        return xmlToBeUpdated;
    }

    // undo moves and remove or add related elements outside node in original content
    private byte[] undoMovedElementsInContributionNode(byte[] xmlContent, Node contributionNode, Node refNodeForContent, String elementId,
                                                       ContributionVO contribution) {
        NodeList moveFromElts = XercesUtils.getElementsByXPath(contributionNode, "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_SOFT_ACTION_ATTR + " = " +
                "'" + SoftActionType.MOVE_FROM.getSoftAction() + "']");
        for (int i = 0; i < moveFromElts.getLength(); i++) {
            Node moveFromElt = moveFromElts.item(i);
            //Get moved element in original document
            String moveFromId = getId(moveFromElt);

            Node elementInOriginalContent = XercesUtils.getFirstElementByXPath(refNodeForContent,
                    "//*[@" + XMLID + " = '" + elementId + "']//*[@" + XMLID + " = '" + moveFromId + "']");
            Node movedElementInOriginalContent = moveFromId != null ? XercesUtils.getElementById(xmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId)
                    : null;
            if (movedElementInOriginalContent != null) {
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId, false);
            }
            if (elementInOriginalContent != null) {
                resolveTrackChange(elementInOriginalContent);
                xmlContent = acceptAdditionOutsideNode(xmlContent, contribution.getXmlContent(), SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId,
                        nodeToString(elementInOriginalContent), moveFromElt.getNodeName().toLowerCase());
                elementInOriginalContent.getParentNode().removeChild(elementInOriginalContent);
            }
        }
        NodeList moveToElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_SOFT_ACTION_ATTR + " = '" + SoftActionType.MOVE_TO.getSoftAction() + "']");
        for (int i = 0; i < moveToElts.getLength(); i++) {
            Node moveToElt = moveToElts.item(i);
            //Get moved element in original document
            String moveFromId = getId(moveToElt).replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");

            Node movedElementInOriginalContent = XercesUtils.getFirstElementByXPath(refNodeForContent,
                    "//*[@" + XMLID + " = '" + elementId + "']//*[@" + XMLID + " = '" + SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId + "']");
            Node movedFromElementInOriginalContent = XercesUtils.getFirstElementByXPath(refNodeForContent,
                    "//*[@" + XMLID + " = '" + elementId + "']//*[@" + XMLID + " = '" + moveFromId + "']");
            Node elementInOriginalContent = moveFromId != null ? XercesUtils.getElementById(xmlContent, moveFromId)
                    : null;
            if (movedElementInOriginalContent != null) {
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId, false);
            }
            if (elementInOriginalContent != null && movedFromElementInOriginalContent == null) {
                resolveTrackChange(elementInOriginalContent);
                acceptAdditionOnNode(refNodeForContent, moveToElt, nodeToString(elementInOriginalContent), false);
            }
        }
        return xmlContent;
    }

    private Pair<String, byte[]> undoTrackChangesInContributionNode(byte[] xmlContent, ContributionVO contribution, String elementId,
                                                                    Node contributionNode, Node refNodeForContent) {
        resolveTrackChange(refNodeForContent);
        undoInsertedAndDeletedTextInContributionNode(contributionNode, refNodeForContent);
        xmlContent = undoMovedElementsInContributionNode(xmlContent, contributionNode, refNodeForContent, elementId, contribution);
        undoInsertedAndDeletedElementsInContributionNode(contributionNode, refNodeForContent, elementId);
        return new Pair(new String(XercesUtils.nodeToByteArray(refNodeForContent), UTF_8), xmlContent);
    }

    private byte[] undoTrackChangesFromContribution(ContributionVO contribution, byte[] xmlContent, String elementId,
                                                    ElementState elementState, List<InternalRefMap> intRefMap) {
        String cleanedElementId = elementId;
        if (elementId.contains(SOFT_MOVE_PLACEHOLDER_ID_PREFIX)) {
            cleanedElementId = elementId.replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
        }
        if (elementId.contains(SOFT_DELETE_PLACEHOLDER_ID_PREFIX)) {
            cleanedElementId = elementId.replace(SOFT_DELETE_PLACEHOLDER_ID_PREFIX, "");
        }
        Node contributionNode = XercesUtils.getElementById(contribution.getXmlContent(), elementId);
        removeAttribute(contributionNode, LEOS_MERGE_ACTION_ATTR);
        resolveTrackChange(contributionNode);
        Node originalNode = XercesUtils.getElementById(xmlContent, cleanedElementId);
        Pair<String, byte[]> result = undoTrackChangesInContributionNode(xmlContent, contribution, cleanedElementId, contributionNode, originalNode != null ?
                originalNode : contributionNode);
        String newFragment = result.left();
        xmlContent = result.right();
        if (ElementState.DELETE.equals(elementState)) {
            newFragment = updateInternalReferences(newFragment, intRefMap);
            xmlContent = xmlContentProcessor.restoreNumElementOnIntermediateNodes(xmlContent, cleanedElementId, null, contributionNode.getNodeName());
            xmlContent = xmlContentProcessor.removeElementById(xmlContent, SOFT_DELETE_PLACEHOLDER_ID_PREFIX + cleanedElementId, false);
            Pair<byte[], Boolean> resultAdd = this.acceptAddition(xmlContent, contribution.getXmlContent(), newFragment, elementId,
                    false);
            xmlContent = resultAdd.left();
            xmlContent = xmlContentProcessor.restoreNumElementOnIntermediateNodes(xmlContent, cleanedElementId, null, contributionNode.getNodeName());
        } else if (ElementState.ADD.equals(elementState)) {
            xmlContent = xmlContentProcessor.restoreNumElementOnIntermediateNodes(xmlContent, cleanedElementId, null, contributionNode.getNodeName());
            xmlContent = xmlContentProcessor.removeElementById(xmlContent, cleanedElementId, false);
        } else if (ElementState.MOVE.equals(elementState)) {
            newFragment = updateInternalReferences(newFragment, intRefMap);
            xmlContent = xmlContentProcessor.restoreNumElementOnIntermediateNodes(xmlContent, cleanedElementId, null, contributionNode.getNodeName());
            xmlContent = xmlContentProcessor.removeElementById(xmlContent, cleanedElementId, false);
            Node movedOriginalNode = XercesUtils.getElementById(xmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId);
            if (movedOriginalNode != null) {
                xmlContent = xmlContentProcessor.replaceElementById(xmlContent, newFragment, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId);
                xmlContent = xmlContentProcessor.restoreNumElementOnIntermediateNodes(xmlContent, cleanedElementId, null, contributionNode.getNodeName());
            } else {
                Pair<byte[], Boolean> resultAdd = acceptAddition(xmlContent, contribution.getXmlContent(), newFragment,
                        SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId, false);
                xmlContent = resultAdd.left();
                xmlContent = xmlContentProcessor.restoreNumElementOnIntermediateNodes(xmlContent, cleanedElementId, null, contributionNode.getNodeName());
            }
        } else if (ElementState.CONTENT_CHANGE.equals(elementState)) {
            if (originalNode != null) {
                xmlContent = xmlContentProcessor.replaceElementById(xmlContent, newFragment, cleanedElementId);
                xmlContent = xmlContentProcessor.restoreNumElementOnIntermediateNodes(xmlContent, cleanedElementId, null, contributionNode.getNodeName());
            }
        }
        return xmlContent;
    }
}
