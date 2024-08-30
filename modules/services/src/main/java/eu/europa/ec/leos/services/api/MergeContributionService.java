package eu.europa.ec.leos.services.api;

import com.sun.istack.NotNull;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.model.action.SoftActionType;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.services.clone.InternalRefMap;
import eu.europa.ec.leos.services.document.ContributionService;
import eu.europa.ec.leos.services.dto.request.ApplyContributionsRequest;
import eu.europa.ec.leos.services.dto.request.MergeActionVO;
import eu.europa.ec.leos.services.numbering.NumberService;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.response.MergeContributionResponse;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.services.utils.StructureConfigUtils;
import eu.europa.ec.leos.vo.structure.LangNumConfig;
import eu.europa.ec.leos.vo.structure.TocItem;
import io.atlassian.fugue.Pair;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static eu.europa.ec.leos.services.dto.request.MergeActionVO.ElementState;
import static eu.europa.ec.leos.services.dto.request.MergeActionVO.ElementState.ADD;
import static eu.europa.ec.leos.services.support.XercesUtils.addAttribute;
import static eu.europa.ec.leos.services.support.XercesUtils.createElementAsLastChildOfNode;
import static eu.europa.ec.leos.services.support.XercesUtils.createXercesDocument;
import static eu.europa.ec.leos.services.support.XercesUtils.getAttributeValue;
import static eu.europa.ec.leos.services.support.XercesUtils.getContentNodeAsXmlFragment;
import static eu.europa.ec.leos.services.support.XercesUtils.getElementById;
import static eu.europa.ec.leos.services.support.XercesUtils.getFirstChild;
import static eu.europa.ec.leos.services.support.XercesUtils.getFirstElementByXPath;
import static eu.europa.ec.leos.services.support.XercesUtils.getId;
import static eu.europa.ec.leos.services.support.XercesUtils.getNumTag;
import static eu.europa.ec.leos.services.support.XercesUtils.hasAttribute;
import static eu.europa.ec.leos.services.support.XercesUtils.nodeToByteArray;
import static eu.europa.ec.leos.services.support.XercesUtils.nodeToString;
import static eu.europa.ec.leos.services.support.XercesUtils.removeAttribute;
import static eu.europa.ec.leos.services.support.XercesUtils.replaceElement;
import static eu.europa.ec.leos.services.support.XmlHelper.ARTICLE;
import static eu.europa.ec.leos.services.support.XmlHelper.CONTENT;
import static eu.europa.ec.leos.services.support.XmlHelper.CROSSHEADING;
import static eu.europa.ec.leos.services.support.XmlHelper.EC;
import static eu.europa.ec.leos.services.support.XmlHelper.EMPTY_STRING;
import static eu.europa.ec.leos.services.support.XmlHelper.HEADING;
import static eu.europa.ec.leos.services.support.XmlHelper.HIGHER_ELEMENTS;
import static eu.europa.ec.leos.services.support.XmlHelper.INDENT;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ACTION_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ACTION_ENTER;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ACTION_NUMBER;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_AUTO_NUM_OVERWRITE;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_DELETABLE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_EDITABLE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INITIAL_NUM;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_MERGE_ACTION_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ORIGIN_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_ACTION_ADD;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_ACTION_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_ACTION_DELETE;
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
import static eu.europa.ec.leos.services.support.XmlHelper.LEVEL;
import static eu.europa.ec.leos.services.support.XmlHelper.LIST;
import static eu.europa.ec.leos.services.support.XmlHelper.LS;
import static eu.europa.ec.leos.services.support.XmlHelper.MOVE_FROM;
import static eu.europa.ec.leos.services.support.XmlHelper.MOVE_TO;
import static eu.europa.ec.leos.services.support.XmlHelper.NUM;
import static eu.europa.ec.leos.services.support.XmlHelper.P;
import static eu.europa.ec.leos.services.support.XmlHelper.PARAGRAPH;
import static eu.europa.ec.leos.services.support.XmlHelper.POINT;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_DELETE_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_MOVE_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.SUBPARAGRAPH;
import static eu.europa.ec.leos.services.support.XmlHelper.UTF_8;
import static eu.europa.ec.leos.services.support.XmlHelper.XMLID;
import static eu.europa.ec.leos.services.utils.StructureConfigUtils.getTocItemByName;

@Service
public class MergeContributionService {

    private static final Logger LOG = LoggerFactory.getLogger(MergeContributionService.class);
    private static final String AKN = "akn";

    private final XmlContentProcessor xmlContentProcessor;
    private final ContributionService contributionService;
    private final DocumentLanguageContext documentLanguageContext;
    private final NumberService numberService;

    private final int MAX_LENGTH_STR_FOUND = 20;
    private final int MIN_LENGTH_STR_FOUND = 6;
    private List<String> impactedElements;
    private List<String> mainElements;
    private List<TocItem> tocItemsList;
    private boolean mergingCompletelySuccessfull = true;
    private List<MergeActionVO> currentMergeActions;

    @Autowired
    public MergeContributionService(XmlContentProcessor xmlContentProcessor,
                                    ContributionService contributionService,
                                    DocumentLanguageContext documentLanguageContext,
                                    NumberService numberService) {
        this.xmlContentProcessor = xmlContentProcessor;
        this.contributionService = contributionService;
        this.documentLanguageContext = documentLanguageContext;
        this.numberService = numberService;
    }

    //Main method: merging the merge actions contained in the request
    public MergeContributionResponse updateDocumentWithContributions(ApplyContributionsRequest request,
                                                                     XmlDocument xmlDocument,
                                                                     List<TocItem> tocItemsList,
                                                                     List<InternalRefMap> intRefMap) throws Exception {
        this.tocItemsList = tocItemsList;
        updatedMainElements();
        mergingCompletelySuccessfull = true;
        byte[] xmlContent = xmlDocument.getContent().get().getSource().getBytes();
        byte[] contributionXmlContent = request.getMergeActions().isEmpty() ? null
                : request.getMergeActions().get(0).getContributionVO().getXmlContent();
        Node contributionDocument = XercesUtils.createXercesDocument(contributionXmlContent);

        // Sort the merge actions so that move actions are done first

        // Sort other actions
        List<MergeActionVO> sortedActionEvents =
                request.getMergeActions().stream().filter((MergeActionVO m) -> !m.getAction().equals(MergeActionVO.MergeAction.UNDO)).collect(Collectors.toList());
        sortedActionEvents = sortedActionEvents.stream().sorted(Collections.reverseOrder(Comparator.comparing((MergeActionVO m) -> m.getElementState()))).collect(Collectors.toList());

        // Sort undo actions
        List<MergeActionVO> sortedUndoEvents =
                request.getMergeActions().stream().filter((MergeActionVO m) -> m.getAction().equals(MergeActionVO.MergeAction.UNDO)).collect(Collectors.toList());
        sortedUndoEvents =
                sortedUndoEvents.stream().sorted(Comparator.comparing((MergeActionVO m) -> m.getElementState())).collect(Collectors.toList());

        this.currentMergeActions = request.getMergeActions();
        // Process merging
        for (MergeActionVO mergeActionVO : sortedActionEvents ) {
            impactedElements = new ArrayList<String>();
            if (!mergeActionVO.getAction().equals(MergeActionVO.MergeAction.PROCESSED)) {
                xmlContent = mergeTrackChangesFromContribution(
                        mergeActionVO.getContributionVO(),
                        xmlContent,
                        mergeActionVO.getElementId(),
                        mergeActionVO.getElementState(),
                        intRefMap,
                        mergeActionVO.isWithTrackChanges());
                if (HIGHER_ELEMENTS.contains(mergeActionVO.getElementTagName().replace(AKN, "")) && MergeActionVO.ElementState.DELETE.equals(mergeActionVO.getElementState())) {
                    String language = documentLanguageContext.getDocumentLanguage();
                    xmlContent = this.numberService.renumberHigherSubDivisions(xmlContent, language, mergeActionVO.getElementTagName().replace(AKN, ""), this.tocItemsList);
                }
            } else {
                if (ElementState.MOVE.equals(mergeActionVO.getElementState())) {
                    String cleanedElementId = removesPrefixFromElementId(mergeActionVO.getElementId());
                    impactedElements.add(mergeActionVO.getElementId().startsWith(SOFT_MOVE_PLACEHOLDER_ID_PREFIX) ? cleanedElementId :
                            SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId);
                }
            }
            // Sets "mergeAction" attribute on contribution elements where merging has been done
            updateActionOnImpactedElements(contributionDocument, mergeActionVO.getAction().name(), mergeActionVO.getElementId());
        }

        // Process undo merging actions
        for (MergeActionVO mergeActionVO : sortedUndoEvents ) {
            impactedElements = new ArrayList<String>();
            String currentMergeAction = xmlContentProcessor.getElementAttributeValueByNameAndId(mergeActionVO.getContributionVO().getXmlContent(),
                    LEOS_MERGE_ACTION_ATTR, mergeActionVO.getElementTagName(), mergeActionVO.getElementId());
            if (currentMergeAction != null) {
                if (!currentMergeAction.equals(MergeActionVO.MergeAction.PROCESSED.name())) {
                    xmlContent = undoTrackChangesFromContribution(
                            mergeActionVO.getContributionVO(),
                            xmlContent,
                            mergeActionVO.getElementId(),
                            mergeActionVO.getElementState(),
                            intRefMap);
                    if (HIGHER_ELEMENTS.contains(mergeActionVO.getElementTagName().replace(AKN, "")) && MergeActionVO.ElementState.ADD.equals(mergeActionVO.getElementState())) {
                        String language = documentLanguageContext.getDocumentLanguage();
                        xmlContent = this.numberService.renumberHigherSubDivisions(xmlContent, language, mergeActionVO.getElementTagName().replace(AKN, ""), this.tocItemsList);
                    }
                } else {
                    if (ElementState.MOVE.equals(mergeActionVO.getElementState())) {
                        String cleanedElementId = removesPrefixFromElementId(mergeActionVO.getElementId());
                        impactedElements.add(mergeActionVO.getElementId().startsWith(SOFT_MOVE_PLACEHOLDER_ID_PREFIX) ? cleanedElementId :
                                SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId);
                    }
                }
                // Removes "mergeAction" attribute on contribution elements where merging has been undone
                removeActionOnImpactedElement(contributionDocument, mergeActionVO.getElementId());
            }
        }
        
        // Update contribution xml in DB
        if (!request.getMergeActions().isEmpty()) {
            contributionXmlContent = nodeToByteArray(contributionDocument);
            executeContributionAction(request.getMergeActions().get(0), contributionXmlContent);
        }
        xmlContent = resetActionOnDocument(xmlContent);
        return new MergeContributionResponse(this.mergingCompletelySuccessfull, xmlContent);
    }

    private void executeContributionAction(MergeActionVO mergeActionVO, byte[] updatedXmlContent) throws Exception {
        contributionService.updateContributionMergeActions(mergeActionVO.getContributionVO().
                        getDocumentId(), mergeActionVO.getContributionVO().getLegFileName(),
                mergeActionVO.getContributionVO().getDocumentName(), mergeActionVO.getContributionVO().getVersionedReference(),
                updatedXmlContent);
    }

    private int countNonEmptyTextNodesInAllDescendants(Node node) {
        int count = 0;
        NodeList children = node.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);
            if (child.getNodeType() != Node.TEXT_NODE && !child.getNodeName().equalsIgnoreCase(LEOS_TC_INSERT_ELEMENT_NAME) && !child.getNodeName().equalsIgnoreCase(LEOS_TC_DELETE_ELEMENT_NAME)) {
                count += countNonEmptyTextNodes(child);
                count += countNonEmptyTextNodesInAllDescendants(child);
            }
        }
        return count;
    }

    // For each action (add, delete, content update), merge contribution's content to original document
    private byte[] mergeTrackChangesFromContribution(ContributionVO contribution,
                                                     byte[] xmlContent,
                                                     String elementId,
                                                     ElementState elementState,
                                                     List<InternalRefMap> intRefMap,
                                                     boolean withTrackChanges) {
        elementId = removesMovedPrefixFromElementId(elementId);
        Node contributionNode = XercesUtils.getElementById(contribution.getXmlContent(), elementId);
        if (contributionNode == null) {
            return xmlContent;
        }
        int countNonEmptyTextNodes = countNonEmptyTextNodesInAllDescendants(contributionNode);
        String cleanedElementId = removesPrefixFromElementId(elementId);

        // Processes changes in main element
        Pair<String, byte[]> result = mergeTrackChangesFromContributionNode(
                xmlContent,
                contribution.getXmlContent(),
                cleanedElementId,
                contributionNode,
                elementState,
                withTrackChanges
        );
        String newFragment = result.left();
        xmlContent = result.right();

        // Processes main element
        if (ElementState.DELETE.equals(elementState)) {
            Node originalNode = XercesUtils.getElementById(xmlContent, cleanedElementId);
            if (originalNode == null) {
                this.mergingCompletelySuccessfull = false;
            } else {
                xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(contributionNode), cleanedElementId);
                if (!withTrackChanges) {
                    xmlContent = xmlContentProcessor.applyDeleteActionOnElement(xmlContent, SOFT_DELETE_PLACEHOLDER_ID_PREFIX + cleanedElementId, true);
                    xmlContent = renumberFragment(xmlContent, SOFT_DELETE_PLACEHOLDER_ID_PREFIX + cleanedElementId);
                } else {
                    xmlContent = renumberFragment(xmlContent, cleanedElementId);
                }
            }
            impactedElements.add(getId(contributionNode));
        } else if (ADD.equals(elementState)) {
            newFragment = updateInternalReferences(newFragment, intRefMap);
            xmlContent = mergeInsertedEltInXml(xmlContent, contribution.getXmlContent(), newFragment, cleanedElementId,
                    true);
            if (!withTrackChanges) {
                xmlContent = xmlContentProcessor.applyAddActionOnElement(xmlContent, cleanedElementId, true);
            }
            xmlContent = renumberFragment(xmlContent,  cleanedElementId);
            impactedElements.add(getId(contributionNode));
        } else if (ElementState.MOVE.equals(elementState)) {
            Node originalNode = XercesUtils.getElementById(xmlContent, cleanedElementId);
            if (originalNode == null) {
                this.mergingCompletelySuccessfull = false;
            } else {
                newFragment = updateInternalReferences(newFragment, intRefMap);
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId, false);
                Node contributionRemovedNode = XercesUtils.getElementById(contribution.getXmlContent(), SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId);
                if (contributionRemovedNode != null) {
                    xmlContent = xmlContentProcessor.replaceElementById(xmlContent, XercesUtils.nodeToString(contributionRemovedNode), cleanedElementId);
                    xmlContent = copyTrackChangesForMovedElement(xmlContent, contributionRemovedNode, cleanedElementId, SoftActionType.MOVE_TO);
                }
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, cleanedElementId, false);
                xmlContent = this.mergeInsertedEltInXml(xmlContent,
                        contribution.getXmlContent(),
                        newFragment,
                        cleanedElementId,
                        true);
                Node contributionAddedNode = XercesUtils.getElementById(contribution.getXmlContent(), cleanedElementId);
                if (contributionAddedNode != null) {
                    xmlContent = copyTrackChangesForMovedElement(xmlContent, contributionAddedNode, cleanedElementId, SoftActionType.MOVE_FROM);
                }
                if (!withTrackChanges) {
                    xmlContent = xmlContentProcessor.applyMoveActionOnElement(xmlContent, cleanedElementId, true);
                    xmlContent = renumberFragment(xmlContent, cleanedElementId);
                } else {
                    xmlContent = renumberFragment(xmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId);
                    xmlContent = renumberFragment(xmlContent, cleanedElementId);
                }
            }
            impactedElements.add(SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId);
            impactedElements.add(cleanedElementId);
        } else if (ElementState.CONTENT_CHANGE.equals(elementState)) {
            Node originalNode = XercesUtils.getElementById(xmlContent, cleanedElementId);
            if (originalNode != null) {
                xmlContent = xmlContentProcessor.replaceElementById(xmlContent, newFragment, cleanedElementId);
            } else if (countNonEmptyTextNodes == 0) {
                newFragment = updateInternalReferences(newFragment, intRefMap);
                xmlContent = mergeInsertedEltInXml(xmlContent, contribution.getXmlContent(), newFragment, cleanedElementId,
                        false);
                if (!withTrackChanges) {
                    xmlContent = xmlContentProcessor.applyAddActionOnElement(xmlContent, cleanedElementId, true);
                }
            }
            impactedElements.add(getId(contributionNode));
            xmlContent = renumberFragment(xmlContent,  cleanedElementId);
        }
        return xmlContent;
    }

    // Merging tracked elements from inside contribution node
    private Pair<String, byte[]> mergeTrackChangesFromContributionNode(byte[] xmlContent,
                                                                       byte[] contributionXmlContent,
                                                                       String elementId,
                                                                       Node contributionNode,
                                                                       ElementState elementState,
                                                                       boolean withTrackChanges) {
        String newFragment = XercesUtils.nodeToString(contributionNode);
        Node relatedParentOriginalNode = XercesUtils.getElementById(xmlContent, getId(contributionNode.getParentNode()));
        if (relatedParentOriginalNode == null) {
            mergingCompletelySuccessfull = false;
            return new Pair(newFragment, xmlContent);
        }
        Node originalNodeRefForContent = XercesUtils.getFirstElementByXPath(relatedParentOriginalNode,
                "//*[@" + XMLID + " = '" + getId(relatedParentOriginalNode) + "']" +
                        "//*[@" + XMLID + " = '" + elementId + "']");


        if (!HIGHER_ELEMENTS.contains(contributionNode.getNodeName().toLowerCase())) {
            // Merges all "ins" and "del" tag from inside contribution node
            mergeInsertedAndDeletedTextFromContributionNode(
                    elementId,
                    contributionNode,
                    relatedParentOriginalNode,
                    withTrackChanges
            );
            // Merges moved elements from inside contribution node
            xmlContent = mergeMovedElementsInContributionNode(
                    xmlContent,
                    contributionXmlContent,
                    contributionNode,
                    relatedParentOriginalNode,
                    elementId,
                    withTrackChanges
            );
            // Merges removed and added elements from inside contribution node
            mergeInsertedAndDeletedElementsInContributionNode(
                    contributionNode,
                    relatedParentOriginalNode,
                    elementId,
                    withTrackChanges
            );
        }

        Node originalNodeRefForContentAfter = XercesUtils.getElementById(nodeToByteArray(relatedParentOriginalNode), elementId);
        if (originalNodeRefForContentAfter != null) {
            checkNum(originalNodeRefForContentAfter, originalNodeRefForContent, elementState, withTrackChanges);
            if (!withTrackChanges) {
                resolveTrackChange(originalNodeRefForContentAfter, true);
            } else {
                copyTrackChangesAttributes(originalNodeRefForContentAfter, contributionNode);
            }
            newFragment = nodeToString(originalNodeRefForContentAfter);
        } else if (originalNodeRefForContentAfter == null && originalNodeRefForContent != null) {
            newFragment = "";
        } else {
            checkNum(contributionNode, null, elementState, withTrackChanges);
            newFragment = nodeToString(contributionNode);
        }
        return new Pair(newFragment, xmlContent);
    }

    // Merges all "ins" and "del" tag from inside contribution node
    private void mergeInsertedAndDeletedTextFromContributionNode(String elementId,
                                                                   Node contributionNode,
                                                                   Node relatedParentOriginalNode,
                                                                   boolean withTrackChanges
    ) {
        // First, processes all "ins" nodes
        NodeList insElts = XercesUtils.getElementsByName(contributionNode, LEOS_TC_INSERT_ELEMENT_NAME);
        for (int i = 0; i < insElts.getLength(); i++) {
            Node insElt = insElts.item(i);
            if (insElt.getParentNode().getNodeName().equals(NUM)) {
                continue;
            }
            // Checks if "ins" tag is part of entire inserted point, paragraph, ...
            Node realInsElt = getRealUpdatedNode(relatedParentOriginalNode, insElt, true);

            // If that's a list, we must check intro and conclusion, to not add sth already present
            handleIntroAndConclusionForList(relatedParentOriginalNode, realInsElt, elementId);
            if (realInsElt.getNodeName().equals(LEOS_TC_INSERT_ELEMENT_NAME)) {
                mergeInsDelElt(relatedParentOriginalNode, insElt, withTrackChanges, true);
                impactedElements.add(getId(insElt));
            } else {
                if (!withTrackChanges) {
                    replaceElement(insElt, getContentNodeAsXmlFragment(insElt));
                    i--;
                }
                checkNum(realInsElt, null, ADD, withTrackChanges);
                mergeInsertedEltInsideNode(relatedParentOriginalNode, realInsElt, nodeToString(realInsElt), withTrackChanges, elementId);
                impactedElements.add(getId(realInsElt));
            }
        }

        // First, processes all "del" nodes
        NodeList delElts = XercesUtils.getElementsByName(contributionNode, LEOS_TC_DELETE_ELEMENT_NAME);
        for (int i = 0; i < delElts.getLength(); i++) {
            Node delElt = delElts.item(i);
            if (delElt.getParentNode().getNodeName().equals(NUM)) {
                continue;
            }
            delElt = getRealUpdatedNode(relatedParentOriginalNode, delElt, false);
            if (!delElt.getParentNode().getNodeName().equals(NUM) && delElt.getNodeName().equals(LEOS_TC_DELETE_ELEMENT_NAME)) {
                mergeInsDelElt(relatedParentOriginalNode, delElt, withTrackChanges, false);
                impactedElements.add(getId(delElt));
            } else {
                Node originalNodeToBeRemoved = XercesUtils.getElementById(relatedParentOriginalNode, getId(delElt));
                if (originalNodeToBeRemoved != null) {
                    Node originalNodeParent = originalNodeToBeRemoved.getParentNode();
                    checkNum(delElt, originalNodeToBeRemoved, ElementState.DELETE, withTrackChanges);
                    if (withTrackChanges) {
                        XercesUtils.replaceElement(originalNodeToBeRemoved, nodeToString(delElt));
                    } else {
                        originalNodeToBeRemoved.getParentNode().removeChild(originalNodeToBeRemoved);
                    }
                    handleEmptyList(relatedParentOriginalNode, originalNodeParent, elementId);
                    impactedElements.add(getId(delElt));
                } else {
                    mergingCompletelySuccessfull = false;
                }
            }
        }
    }

    // Manage moved tracked elements inside contribution node and remove or add related elements outside node in original content with or without track changes
    private byte[] mergeMovedElementsInContributionNode(byte[] xmlContent,
                                                        byte[] contributionXmlContent,
                                                        Node contributionNode,
                                                        Node relatedParentOriginalNode,
                                                        String elementId,
                                                        boolean withTrackChanges) {
        NodeList moveFromElts = XercesUtils.getElementsByXPath(contributionNode, "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_SOFT_ACTION_ATTR + " = " +
                "'" + SoftActionType.MOVE_FROM.getSoftAction() + "']");
        List<String> moveToEltsInsideElement = new ArrayList<>();
        List<Node> sortedMoveFromElts = sortMovedElements(moveFromElts);
        for (int i = 0; i < sortedMoveFromElts.size(); i++) {
            Node moveFromElt = sortedMoveFromElts.get(i);
            String moveFromId = getId(moveFromElt);

            // Check that the element is movable
            Node contributionMovedFromNodeParent = XercesUtils.getElementById(contributionXmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId).getParentNode();
            if (XercesUtils.getElementById(xmlContent, getId(contributionMovedFromNodeParent)) == null) {
                mergingCompletelySuccessfull = false;
                continue;
            }

            Node elementInOriginalContent = moveFromId != null ? XercesUtils.getElementById(xmlContent, moveFromId) : null;
            Node movedElementInOriginalContent = moveFromId != null ? XercesUtils.getElementById(xmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId)
                    : null;
            if (elementInOriginalContent != null && movedElementInOriginalContent == null) {
                Node parentOfElementInOriginalContent = elementInOriginalContent.getParentNode();
                // Take care to remove the moved (moved_to) element outside or inside of the impacted element
                Node originalMovedNode = XercesUtils.getFirstElementByXPath(relatedParentOriginalNode,
                        "//*[@" + XMLID + " = '" + elementId + "']//*[@" + XMLID + " = '" + moveFromId + "']");
                Node contributionMovedNodeInside = XercesUtils.getFirstElementByXPath(contributionNode,
                        "//*[@" + XMLID + " = '" + elementId + "']//*[@" + XMLID +
                                " = '" + SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId + "']");
                Node moveToElt = XercesUtils.getElementById(contributionXmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId);
                checkNum(moveToElt, elementInOriginalContent, ElementState.DELETE, withTrackChanges);
                if (contributionMovedNodeInside == null) {
                    if (withTrackChanges) {
                        xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(moveToElt), moveFromId);
                    } else {
                        xmlContent = xmlContentProcessor.removeElementById(xmlContent, moveFromId, false);
                    }
                    xmlContent = renumberFragment(xmlContent, getId(parentOfElementInOriginalContent));
                } else {
                    if (originalMovedNode != null) {
                        if (withTrackChanges) {
                            XercesUtils.replaceElement(originalMovedNode, nodeToString(moveToElt));
                        } else {
                            originalMovedNode.getParentNode().removeChild(originalMovedNode);
                        }
                    }
                    moveToEltsInsideElement.add(getId(moveToElt));
                }
                // Take care to add the moved element (moved_from) inside of the impacted element
                if (elementInOriginalContent != null) {
                    if (!withTrackChanges) {
                        resolveTrackChange(moveFromElt, true);
                    }
                    checkNum(elementInOriginalContent, null, ADD, withTrackChanges);
                    mergeInsertedEltInsideNode(relatedParentOriginalNode, moveFromElt, nodeToString(elementInOriginalContent), withTrackChanges, elementId);
                    if (withTrackChanges) {
                        originalMovedNode = XercesUtils.getFirstElementByXPath(relatedParentOriginalNode, "//*[@" + XMLID + " = '" + elementId + "']//*[@" + XMLID +
                                " = '" + moveFromId + "']");
                        if (originalMovedNode != null) {
                            copyTrackChangesAttributes(originalMovedNode, moveFromElt);
                        }
                    }
                }
                impactedElements.add(moveFromId);
                impactedElements.add(SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId);
            }
        }

        NodeList moveToElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_SOFT_ACTION_ATTR + " = '" + SoftActionType.MOVE_TO.getSoftAction() + "']");
        List<Node> sortedMoveToElts = sortMovedElements(moveToElts);
        for (int i = 0; i < sortedMoveToElts.size(); i++) {
            Node moveToElt = sortedMoveToElts.get(i);
            if (moveToEltsInsideElement.contains(getId(moveToElt))) {
                continue;
            }
            // Get moved element in original document
            String moveFromId = getId(moveToElt).replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
            if (isMovedElementInAnotherAction(contributionNode, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId)) {
                continue;
            }

            // Check that the element is movable
            Node contributionMovedFromNodeParent = XercesUtils.getElementById(contributionXmlContent, moveFromId).getParentNode();
            if (XercesUtils.getElementById(xmlContent, getId(contributionMovedFromNodeParent)) == null) {
                mergingCompletelySuccessfull = false;
                continue;
            }

            Node elementInOriginalContent = moveFromId != null ? XercesUtils.getElementById(xmlContent, moveFromId) : null;
            Node movedElementInOriginalContent = moveFromId != null ? XercesUtils.getElementById(xmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId)
                    : null;
            if (elementInOriginalContent != null && movedElementInOriginalContent == null) {
                // Take care to remove the moved element (moved_to) inside of the impacted element
                Node originalMovedNode = XercesUtils.getFirstElementByXPath(relatedParentOriginalNode,
                        "//*[@" + XMLID + " = '" + elementId + "']//*[@" + XMLID + " = '" + moveFromId + "']");

                if (originalMovedNode != null) {
                    checkNum(moveToElt, originalMovedNode, ElementState.DELETE, withTrackChanges);
                    if (withTrackChanges) {
                        XercesUtils.replaceElement(originalMovedNode, nodeToString(moveToElt));
                    } else {
                        originalMovedNode.getParentNode().removeChild(originalMovedNode);
                    }
                }
                // Take care to add the moved element (moved_from) outside/inside of the impacted element
                Node contributionMovedNodeInside = XercesUtils.getFirstElementByXPath(contributionNode,
                        "//*[@" + XMLID + " = '" + elementId + "']" +
                                "//*[@" + XMLID + " = '" + moveFromId + "']");
                if (contributionMovedNodeInside == null) {
                    xmlContent = xmlContentProcessor.removeElementById(xmlContent, moveFromId, false);
                    checkNum(elementInOriginalContent, null, ADD, withTrackChanges);
                    xmlContent = mergeInsertedEltInXml(xmlContent, contributionXmlContent, nodeToString(elementInOriginalContent), moveFromId,
                            withTrackChanges);
                    if (withTrackChanges) {
                        Node elementInContribution = XercesUtils.getElementById(contributionXmlContent, moveFromId);
                        xmlContent = copyTrackChangesForMovedElement(xmlContent, elementInContribution, moveFromId, SoftActionType.MOVE_TO);
                    }
                    Node insertedElementInOriginalContent = XercesUtils.getElementById(xmlContent, moveFromId);
                    if (insertedElementInOriginalContent != null) {
                        xmlContent = renumberFragment(xmlContent, getId(insertedElementInOriginalContent.getParentNode()));
                    }
                }
                impactedElements.add(moveFromId);
                impactedElements.add(SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId);
            }
        }
        return xmlContent;
    }

    // Merges all inserted or removed tracked elements from inside contribution node
    private void mergeInsertedAndDeletedElementsInContributionNode(Node contributionNode,
                                                                   Node relatedParentOriginalNode,
                                                                   String elementId,
                                                                   boolean withTrackChanges) {
        NodeList addedElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_ACTION_ATTR + " = '" + LEOS_TC_INSERT_ACTION + "']");
        for (int i = 0; i < addedElts.getLength(); i++) {
            Node addedElt = addedElts.item(i);
            if (!addedElt.getNodeName().equals(NUM) && !XercesUtils.hasAttribute(addedElt, LEOS_SOFT_MOVE_FROM)) {
                checkNum(addedElt, null, ADD, withTrackChanges);
                mergeInsertedEltInsideNode(relatedParentOriginalNode, addedElt, nodeToString(addedElt), withTrackChanges, elementId);
                impactedElements.add(getId(addedElt));
            }
        }
        NodeList deletedElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_ACTION_ATTR + " = '" + LEOS_TC_DELETE_ACTION + "']");
        for (int i = 0; i < deletedElts.getLength(); i++) {
            Node deletedElt = deletedElts.item(i);
            if (!deletedElt.getNodeName().equals(NUM) && !XercesUtils.hasAttribute(deletedElt, LEOS_SOFT_MOVE_TO)) {
                Node originalNodeToBeRemoved = XercesUtils.getFirstElementByXPath(relatedParentOriginalNode,
                        "//*[@" + XMLID + " = '" + elementId + "']" +
                                "//*[@" + XMLID + " = '" + getId(deletedElt) + "']");
                if (originalNodeToBeRemoved != null) {
                    checkNum(deletedElt, originalNodeToBeRemoved, ElementState.DELETE, withTrackChanges);
                    if (withTrackChanges) {
                        XercesUtils.replaceElement(originalNodeToBeRemoved, nodeToString(deletedElt));
                    } else {
                        originalNodeToBeRemoved.getParentNode().removeChild(originalNodeToBeRemoved);
                    }
                    impactedElements.add(getId(deletedElt));
                } else {
                    mergingCompletelySuccessfull = false;
                }
            }
        }
    }

    private String optimizeContent(String contentToBeUpdated, String contentToBeFound, boolean next) {
        if (!next) {
            contentToBeFound = contentToBeFound.length() > MAX_LENGTH_STR_FOUND ? contentToBeFound.substring(contentToBeFound.length() - MAX_LENGTH_STR_FOUND - 1) :
                    contentToBeFound;
        } else {
            contentToBeFound = contentToBeFound.length() > MAX_LENGTH_STR_FOUND ? contentToBeFound.substring(0, MAX_LENGTH_STR_FOUND) :
                    contentToBeFound;
        }
        if (contentToBeFound.length() > MIN_LENGTH_STR_FOUND && !StringUtils.isBlank(contentToBeFound) && StringUtils.countMatches(contentToBeUpdated,
                contentToBeFound.trim()) == 0) {
            do {
                contentToBeFound = next ? contentToBeFound.substring(0, contentToBeFound.length() - 1) : contentToBeFound.substring(1);
            } while (contentToBeFound.length() >= MIN_LENGTH_STR_FOUND && StringUtils.countMatches(contentToBeUpdated, contentToBeFound.trim()) == 0);
        }
        return contentToBeFound;
    }

    private void mergeInsDelElt(
            Node nodeToBeUpdated,
            Node nodeToBeAddedOrRemoved,
            boolean withTrackChanges,
            boolean isIns
    ) {
        Node originalRemovedOrInsertedNode = XercesUtils.getElementById(nodeToBeUpdated, getId(nodeToBeAddedOrRemoved));
        boolean checkPrevious = true;
        boolean found = false;
        if (originalRemovedOrInsertedNode == null) {
            Node originalUpdatedNode = XercesUtils.getElementById(nodeToBeUpdated, getId(nodeToBeAddedOrRemoved.getParentNode()));
            if (originalUpdatedNode != null) {
                String contentToBeAddedOrRemoved = getContentNodeAsXmlFragment(nodeToBeAddedOrRemoved);

                Node previousNode = getSibling(nodeToBeAddedOrRemoved, true);
                String prevContent = getContent(previousNode);
                Node previousNodeParent = previousNode!=null ? XercesUtils.getElementById(originalUpdatedNode, getId(previousNode.getParentNode())) : null;

                Node nextNode = getSibling(nodeToBeAddedOrRemoved, false);
                String nextContent = getContent(nextNode);
                Node nextNodeParent = nextNode != null ? XercesUtils.getElementById(originalUpdatedNode, getId(nextNode.getParentNode())) : null;

                // First checks which one is the best: previous or next content
                if (previousNodeParent != null && nextNodeParent != null && previousNodeParent.equals(nextNodeParent)) {
                    String contentToBeUpdated = nodeToString(previousNodeParent);
                    prevContent = optimizeContent(contentToBeUpdated, prevContent, false);
                    nextContent = optimizeContent(contentToBeUpdated, nextContent, true);
                    if (prevContent.length() > 1 && !StringUtils.isBlank(prevContent)
                            && nextContent.length() > 1 && !StringUtils.isBlank(nextContent)) {
                        int prevNbOfOc = StringUtils.countMatches(contentToBeUpdated, prevContent.trim());
                        int nextNbOfOc = StringUtils.countMatches(contentToBeUpdated, nextContent.trim());
                        if ((prevNbOfOc == 0 || prevNbOfOc > 1) && nextNbOfOc == 1) {
                            checkPrevious = false;
                        } else if ((nextNbOfOc == 0 || nextNbOfOc > 1) && prevNbOfOc == 1) {
                            checkPrevious = true;
                        } else if (prevNbOfOc == 0)  {
                            checkPrevious = false;
                        } else if (nextNbOfOc == 0)  {
                            checkPrevious = true;
                        } else {
                            checkPrevious = prevContent.length() >= nextContent.length();
                        }
                    }
                }
                // Checks using only previous
                if (previousNodeParent != null && checkPrevious) {
                    String contentToBeUpdated = nodeToString(previousNodeParent);
                    prevContent = optimizeContent(contentToBeUpdated, prevContent, false);
                    if (!isIns) {
                        int index = contentToBeUpdated.indexOf(prevContent);
                        if (index == -1) {
                            prevContent = prevContent.trim();
                            index = contentToBeUpdated.indexOf(prevContent);
                        }
                        if (prevContent.length() > 1 && !StringUtils.isBlank(prevContent) &&  index >= 0) {
                            String prevContentInOriginalContent = contentToBeUpdated.substring(0, index + prevContent.length());
                            String strToBeUpdated = contentToBeUpdated.substring(index + prevContent.length());
                            contentToBeAddedOrRemoved = strToBeUpdated.indexOf(contentToBeAddedOrRemoved) >= 0 ? contentToBeAddedOrRemoved : contentToBeAddedOrRemoved.trim();
                            XercesUtils.replaceElement(previousNodeParent,
                                    prevContentInOriginalContent + strToBeUpdated.replaceFirst(Pattern.quote(contentToBeAddedOrRemoved),
                                            withTrackChanges ? nodeToString(nodeToBeAddedOrRemoved) : ""));
                            found = true;
                        }
                    } else {
                        NodeList children = previousNodeParent.getChildNodes();
                        for (int i = 0; i < children.getLength(); i++) {
                            Node child = children.item(i);
                            String childContent = getContent(child);
                            if (childContent.indexOf(prevContent.trim()) >= 0 && prevContent.length() > 1 && !StringUtils.isBlank(prevContent)) {
                                String toBeReplacedBy = withTrackChanges ? prevContent + nodeToString(nodeToBeAddedOrRemoved) : prevContent + getContentNodeAsXmlFragment(nodeToBeAddedOrRemoved);
                                if (nextContent != null && nextContent.startsWith(" ")) {
                                    toBeReplacedBy += " ";
                                }
                                XercesUtils.replaceElement(child,
                                        nodeToString(child).replaceFirst(nodeToString(child).indexOf(prevContent) == -1 ?
                                                        Pattern.quote(prevContent.trim()) :
                                                        Pattern.quote(prevContent),
                                                toBeReplacedBy));
                                found = true;
                                break;
                            }
                        }
                    }
                }

                // Check using only next
                if (nextNodeParent != null && !found) {
                    String contentToBeUpdated = nodeToString(nextNodeParent);
                    nextContent = optimizeContent(contentToBeUpdated, nextContent, true);
                    if (!isIns) {
                        int index = contentToBeUpdated.indexOf(nextContent);
                        if (index == -1) {
                            nextContent = nextContent.trim();
                            index = contentToBeUpdated.indexOf(nextContent);
                        }
                        if (nextContent.length() > 1 && !StringUtils.isBlank(nextContent) && index >= 0) {
                            String nextContentInOriginalContent = contentToBeUpdated.substring(index);
                            String strToBeUpdated = contentToBeUpdated.substring(0, index);
                            contentToBeAddedOrRemoved = strToBeUpdated.indexOf(contentToBeAddedOrRemoved) >= 0 ? contentToBeAddedOrRemoved : contentToBeAddedOrRemoved.trim();
                            if (withTrackChanges) {
                                XercesUtils.replaceElement(nextNodeParent,
                                        strToBeUpdated.replaceFirst(Pattern.quote(contentToBeAddedOrRemoved),
                                                nodeToString(nodeToBeAddedOrRemoved)) + nextContentInOriginalContent);
                            } else {
                                XercesUtils.replaceElement(nextNodeParent,
                                        strToBeUpdated.replaceFirst(Pattern.quote(contentToBeAddedOrRemoved),
                                                "") + nextContentInOriginalContent);
                            }
                            found = true;
                        }
                    } else {
                        NodeList children = nextNodeParent.getChildNodes();
                        for (int i = 0; i < children.getLength(); i++) {
                            Node child = children.item(i);
                            String childContent = getContent(child);
                            if (childContent.indexOf(nextContent.trim()) >= 0 && nextContent.length() > 1 && !StringUtils.isBlank(nextContent)) {
                                String toBeReplacedBy = withTrackChanges ? nodeToString(nodeToBeAddedOrRemoved) + nextContent :
                                        getContentNodeAsXmlFragment(nodeToBeAddedOrRemoved) + nextContent;
                                if (prevContent != null && prevContent.endsWith(" ")) {
                                    toBeReplacedBy = " " + toBeReplacedBy;
                                }
                                XercesUtils.replaceElement(child, nodeToString(child).replaceFirst(nodeToString(child).indexOf(nextContent) == -1 ?
                                                Pattern.quote(nextContent.trim()) :
                                                Pattern.quote(nextContent),
                                        toBeReplacedBy));
                                found = true;
                                break;
                            }
                        }
                    }
                }
                if (isIns && !found && nextNodeParent != null && (prevContent == null || StringUtils.isBlank(prevContent)) && nextContent != null && StringUtils.isNotBlank(nextContent)) {
                    Node newNode = XercesUtils.createNodeFromXmlFragment(nextNodeParent.getOwnerDocument(),
                            nodeToString(nodeToBeAddedOrRemoved).getBytes(UTF_8));
                    nextNodeParent.insertBefore(newNode, nextNodeParent.getFirstChild());
                    if (!withTrackChanges) {
                        replaceElement(newNode, getContentNodeAsXmlFragment(newNode));
                    }
                    found = true;
                }
                if (isIns && !found && previousNodeParent!= null && (nextContent == null || StringUtils.isBlank(nextContent))) {
                    Node newNode = XercesUtils.createNodeFromXmlFragment(previousNodeParent.getOwnerDocument(), nodeToString(nodeToBeAddedOrRemoved).getBytes(UTF_8));
                    previousNodeParent.appendChild(newNode);
                    if (!withTrackChanges) {
                        replaceElement(newNode, getContentNodeAsXmlFragment(newNode));
                    }
                    found = true;
                }
            }
        }
        if (!found) {
            mergingCompletelySuccessfull = found;
        }
    }

    // Undo merging
    private byte[] undoTrackChangesFromContribution(ContributionVO contribution, byte[] xmlContent, String elementId,
                                                    ElementState elementState, List<InternalRefMap> intRefMap) {
        elementId = removesMovedPrefixFromElementId(elementId);
        Node contributionNode = XercesUtils.getElementById(contribution.getXmlContent(), elementId);
        if (contributionNode == null) {
            return xmlContent;
        }

        String cleanedElementId = removesPrefixFromElementId(elementId);

        // Undo merging from inside main element
        Pair<String, byte[]> result = undoTrackChangesInContributionNode(
                xmlContent,
                contribution,
                cleanedElementId,
                contributionNode);
        String newFragment = result.left();
        xmlContent = result.right();

        // Undo merging on main element
        removeAttribute(contributionNode, LEOS_MERGE_ACTION_ATTR);
        if (ElementState.DELETE.equals(elementState)) {
            newFragment = updateInternalReferences(newFragment, intRefMap);
            xmlContent = xmlContentProcessor.restoreNumElementOnIntermediateNodes(xmlContent, cleanedElementId, null, contributionNode.getNodeName());
            xmlContent = xmlContentProcessor.removeElementById(xmlContent, SOFT_DELETE_PLACEHOLDER_ID_PREFIX + cleanedElementId, false);
            xmlContent = this.mergeInsertedEltInXml(xmlContent, contribution.getXmlContent(), newFragment, elementId,
                    false);
            xmlContent = xmlContentProcessor.restoreNumElementOnIntermediateNodes(xmlContent, cleanedElementId, null, contributionNode.getNodeName());
            xmlContent = renumberFragment(xmlContent, cleanedElementId);
            impactedElements.add(elementId);
        } else if (ADD.equals(elementState)) {
            xmlContent = xmlContentProcessor.restoreNumElementOnIntermediateNodes(xmlContent, cleanedElementId, null, contributionNode.getNodeName());
            xmlContent = xmlContentProcessor.removeElementById(xmlContent, cleanedElementId, false);
            impactedElements.add(elementId);
        } else if (ElementState.MOVE.equals(elementState)) {
            newFragment = updateInternalReferences(newFragment, intRefMap);
            xmlContent = xmlContentProcessor.restoreNumElementOnIntermediateNodes(xmlContent, cleanedElementId, null, contributionNode.getNodeName());
            xmlContent = xmlContentProcessor.removeElementById(xmlContent, cleanedElementId, false);
            Node movedOriginalNode = XercesUtils.getElementById(xmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId);
            if (movedOriginalNode != null) {
                xmlContent = xmlContentProcessor.replaceElementById(xmlContent, newFragment, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId);
            } else {
                xmlContent = mergeInsertedEltInXml(xmlContent, contribution.getXmlContent(), newFragment,
                        SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId, false);
            }
            xmlContent = xmlContentProcessor.restoreNumElementOnIntermediateNodes(xmlContent, cleanedElementId, null, contributionNode.getNodeName());
            xmlContent = renumberFragment(xmlContent, cleanedElementId);
            impactedElements.add(SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId);
            impactedElements.add(cleanedElementId);
        } else if (ElementState.CONTENT_CHANGE.equals(elementState)) {
            Node originalNode = XercesUtils.getElementById(xmlContent, cleanedElementId);
            if (originalNode != null) {
                xmlContent = xmlContentProcessor.replaceElementById(xmlContent, newFragment, cleanedElementId);
                xmlContent = renumberFragment(xmlContent, cleanedElementId);
            }
            impactedElements.add(elementId);
        }
        return xmlContent;
    }

    // Undo merging from inside main element
    private Pair<String, byte[]> undoTrackChangesInContributionNode(byte[] xmlContent,
                                                                    ContributionVO contribution,
                                                                    String elementId,
                                                                    Node contributionNode) {
        String newFragment = XercesUtils.nodeToString(contributionNode);
        Node relatedParentOriginalNode = XercesUtils.getElementById(xmlContent, getId(contributionNode.getParentNode()));
        if (relatedParentOriginalNode == null) {
            return new Pair(newFragment, xmlContent);
        }
        Node originalNodeRefForContent = XercesUtils.getFirstElementByXPath(relatedParentOriginalNode,
                "//*[@" + XMLID + " = '" + getId(relatedParentOriginalNode) + "']" +
                        "//*[@" + XMLID + " = '" + elementId + "']");

        // Undo merging of "ins", "del" from inside main element
        undoInsertedAndDeletedTextInContributionNode(
                contributionNode,
                relatedParentOriginalNode, elementId);

        // Undo merging of moved elements from inside main element
        xmlContent = undoMovedElementsInContributionNode(xmlContent,
                contributionNode,
                relatedParentOriginalNode,
                elementId,
                contribution);

        // Undo merging of inserted and removed elements from inside main element
        undoInsertedAndDeletedElementsInContributionNode(contributionNode, relatedParentOriginalNode, elementId);

        resolveTrackChangesInEntireNode(contributionNode);
        resetAction(contributionNode);
        newFragment = nodeToString(contributionNode);

        Node originalNodeRefForContentAfter = XercesUtils.getElementById(nodeToByteArray(relatedParentOriginalNode), elementId);
        if (originalNodeRefForContentAfter != null) {
            resolveTrackChangesInEntireNode(originalNodeRefForContentAfter);
            newFragment = nodeToString(originalNodeRefForContentAfter);
        } else if (originalNodeRefForContent != null) {
            newFragment = "";
        }

        return new Pair(newFragment, xmlContent);
    }

    // Undo all "ins" and "del" tag in contribution node -- Used while accepting without track changes
    private void undoInsertedAndDeletedTextInContributionNode(Node contributionNode, Node relatedParentOriginalNode, String elementId) {
        NodeList insElts = XercesUtils.getElementsByName(contributionNode, LEOS_TC_INSERT_ELEMENT_NAME);
        for (int i = 0; i < insElts.getLength(); i++) {
            Node insElt = insElts.item(i);
            if (insElt.getParentNode().getNodeName().equals(NUM)) {
                continue;
            }
            insElt = getRealUpdatedNodeOnUndo(relatedParentOriginalNode, insElt, true);
            handleIntroAndConclusionForListOnUndo(relatedParentOriginalNode, insElt, elementId);
            if (insElt.getNodeName().equals(LEOS_TC_INSERT_ELEMENT_NAME)) {
                undoInsInContent(relatedParentOriginalNode, insElt);
                impactedElements.add(getId(insElt));
            } else {
                Node originalAddedNode = XercesUtils.getElementById(relatedParentOriginalNode, getId(insElt));
                if (originalAddedNode != null) {
                    originalAddedNode.getParentNode().removeChild(originalAddedNode);
                }
                impactedElements.add(getId(insElt));
            }
        }
        NodeList delElts = XercesUtils.getElementsByName(contributionNode, LEOS_TC_DELETE_ELEMENT_NAME);
        for (int i = 0; i < delElts.getLength(); i++) {
            Node delElt = delElts.item(i);
            if (delElt.getParentNode().getNodeName().equals(NUM) || StringUtils.isEmpty(delElt.getTextContent())) {
                continue;
            }
            Node realDelElt = getRealUpdatedNodeOnUndo(relatedParentOriginalNode, delElt, false);
            handleIntroAndConclusionForList(relatedParentOriginalNode, realDelElt, elementId);
            if (realDelElt.getNodeName().equals(LEOS_TC_DELETE_ELEMENT_NAME)) {
                undoDelInContent(relatedParentOriginalNode, delElt);
                impactedElements.add(getId(delElt));
            } else {
                removeAttribute(realDelElt, LEOS_MERGE_ACTION_ATTR);
                resolveTrackChange(realDelElt, true);
                undoDelInContent(realDelElt, delElt);
                Node originalDeletedNode = getFirstElementByXPath(relatedParentOriginalNode, "//*[@" + XMLID + " = '" + elementId + "']//*[@" + XMLID + " = " +
                        "'" + getId(realDelElt) + "']");
                if (originalDeletedNode != null) {
                    originalDeletedNode.getParentNode().removeChild(originalDeletedNode);
                }
                mergeInsertedEltInsideNode(relatedParentOriginalNode, realDelElt, nodeToString(realDelElt), false, elementId);
                impactedElements.add(getId(realDelElt));
            }
        }
    }

    private void undoInsInContent(Node nodeToBeUpdated, Node nodeToBeRemovedAgain) {
        Node originalAddedNode = XercesUtils.getElementById(nodeToBeUpdated, getId(nodeToBeRemovedAgain));
        // Case where merge was done with track changes
        if (originalAddedNode != null) {
            originalAddedNode.getParentNode().removeChild(originalAddedNode);
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
                    String contentToBeUpdated = nodeToString(previousNodeParent);
                    prevContent = optimizeContent(contentToBeUpdated, prevContent, false);
                    String strToBeFound = prevContent + contentToBeRemoved;
                    strToBeFound = contentToBeUpdated.indexOf(strToBeFound) == -1 ? prevContent + contentToBeRemoved.trim() : strToBeFound;
                    if (strToBeFound.length() > 1 && !StringUtils.isBlank(strToBeFound) && contentToBeUpdated.indexOf(strToBeFound) >= 0) {
                        XercesUtils.replaceElement(previousNodeParent, contentToBeUpdated.replaceFirst(Pattern.quote(strToBeFound),
                                prevContent));
                        found = true;
                    }
                }
                if (nextNodeParent != null && !found) {
                    String contentToBeUpdated = nodeToString(nextNodeParent);
                    nextContent = optimizeContent(contentToBeUpdated, nextContent, true);
                    String strToBeFound = contentToBeRemoved + nextContent;
                    strToBeFound = contentToBeUpdated.indexOf(strToBeFound) == -1 ?
                            contentToBeRemoved.trim() + nextContent: strToBeFound;
                    if (strToBeFound.length() > 1 && !StringUtils.isBlank(strToBeFound) && contentToBeUpdated.indexOf(strToBeFound) >= 0) {
                        XercesUtils.replaceElement(nextNodeParent, contentToBeUpdated.replaceFirst(Pattern.quote(strToBeFound),
                                nextContent));
                    }
                }
                if (previousNodeParent != null && !found) {
                    String contentToBeUpdated = nodeToString(previousNodeParent);
                    String contentToCompareTo = getContentNodeAsXmlFragment(previousNodeParent);
                    String strToBeFound = contentToBeRemoved;
                    if (StringUtils.countMatches(contentToBeUpdated, strToBeFound) == 1 && StringUtils.countMatches(contentToCompareTo, strToBeFound) == 1) {
                        XercesUtils.replaceElement(previousNodeParent, contentToBeUpdated.replaceFirst(Pattern.quote(strToBeFound),
                                ""));
                    }
                }
                if (nextNodeParent != null && !found) {
                    String contentToBeUpdated = nodeToString(nextNodeParent);
                    String contentToCompareTo = getContentNodeAsXmlFragment(nextNodeParent);
                    String strToBeFound = contentToBeRemoved;
                    if (StringUtils.countMatches(contentToBeUpdated, strToBeFound) == 1 && StringUtils.countMatches(contentToCompareTo, strToBeFound) == 1) {
                        XercesUtils.replaceElement(nextNodeParent, contentToBeUpdated.replaceFirst(Pattern.quote(strToBeFound),
                                ""));
                    }
                }
            }
        }
    }

    private void undoDelInContent(Node nodeToBeUpdated, Node nodeToBeAddedAgain) {
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

                String contentToBeAdded = getContentNodeAsXmlFragment(nodeToBeAddedAgain);

                // Avoid adding it again (already undone)
                if ((nextContent != null && (nextContent.startsWith(contentToBeAdded) || nextContent.trim().startsWith(contentToBeAdded)))
                        || (prevContent != null && (prevContent.endsWith(contentToBeAdded) || prevContent.trim().endsWith(contentToBeAdded)))) {
                    return;
                }

                if (previousNodeParent != null) {
                    String contentToBeUpdated = nodeToString(previousNodeParent);
                    prevContent = optimizeContent(contentToBeUpdated, prevContent, false);
                    NodeList children = previousNodeParent.getChildNodes();
                    for (int i = 0; i < children.getLength(); i++) {
                        Node child = children.item(i);
                        String childContent = getContent(child);
                        if (childContent.indexOf(prevContent) >= 0 && prevContent.length() > 1 && !StringUtils.isBlank(prevContent)
                                && childContent.indexOf(prevContent + contentToBeAdded) == -1) {
                            XercesUtils.replaceElement(child, nodeToString(child).replaceFirst(Pattern.quote(prevContent),
                                    prevContent + contentToBeAdded));
                            found = true;
                            break;
                        }
                    }
                }
                if (nextNodeParent != null && !found) {
                    String contentToBeUpdated = nodeToString(nextNodeParent);
                    nextContent = optimizeContent(contentToBeUpdated, nextContent, true);
                    NodeList children = nextNodeParent.getChildNodes();
                    for (int i = 0; i < children.getLength(); i++) {
                        Node child = children.item(i);
                        String childContent = getContent(child);
                        if (childContent.indexOf(nextContent) >= 0 && nextContent.length() > 1 && !StringUtils.isBlank(nextContent)
                                && childContent.indexOf(contentToBeAdded + nextContent) == -1) {
                            XercesUtils.replaceElement(child, nodeToString(child).replaceFirst(Pattern.quote(nextContent),
                                    contentToBeAdded + nextContent));
                            break;
                        }
                    }
                }
            }
        }
    }

    // Undo moves and remove or add related elements outside node in original content
    private byte[] undoMovedElementsInContributionNode(byte[] xmlContent,
                                                       Node contributionNode,
                                                       Node relatedParentOriginalNode,
                                                       String elementId,
                                                       ContributionVO contribution) {
        NodeList moveFromElts = XercesUtils.getElementsByXPath(contributionNode, "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_SOFT_ACTION_ATTR + " = " +
                "'" + SoftActionType.MOVE_FROM.getSoftAction() + "']");
        List<String> moveToEltsInsideElement = new ArrayList<>();
        List<Node> sortedMoveFromElts = sortMovedElements(moveFromElts);
        for (int i = 0; i < sortedMoveFromElts.size(); i++) {
            Node moveFromElt = sortedMoveFromElts.get(i);
            //Get moved element in original document
            String moveFromId = getId(moveFromElt);

            Node elementInOriginalContent = XercesUtils.getFirstElementByXPath(relatedParentOriginalNode,
                    "//*[@" + XMLID + " = '" + elementId + "']//*[@" + XMLID + " = '" + moveFromId + "']");
            Node movedElementInOriginalContent = moveFromId != null ? XercesUtils.getElementById(xmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId)
                    : null;
            String parentElementId = null;
            if (elementInOriginalContent != null) {
                parentElementId = getId(elementInOriginalContent.getParentNode());
                elementInOriginalContent.getParentNode().removeChild(elementInOriginalContent);
            }

            Node contributionMovedNodeInside = XercesUtils.getFirstElementByXPath(contributionNode,
                    "//*[@" + XMLID + " = '" + elementId + "']//*[@" + XMLID +
                            " = '" + SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId + "']");
            if (contributionMovedNodeInside == null) {
                if (movedElementInOriginalContent != null) {
                    xmlContent = xmlContentProcessor.removeElementById(xmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId, false);
                }
                if (elementInOriginalContent != null) {
                    resolveTrackChange(elementInOriginalContent, true);
                    xmlContent = undoDeletionInXml(xmlContent, contribution.getXmlContent(), SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId,
                            nodeToString(elementInOriginalContent), moveFromElt.getNodeName().toLowerCase());
                }
                if (parentElementId != null) {
                    xmlContent = renumberFragment(xmlContent, parentElementId);
                }
            } else {
                Node originalMovedNode = XercesUtils.getFirstElementByXPath(relatedParentOriginalNode,
                        "//*[@" + XMLID + " = '" + elementId + "']//*[@" + XMLID +
                                " = '" + SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId + "']");
                if (originalMovedNode != null && elementInOriginalContent != null) {
                    resolveTrackChange(elementInOriginalContent, true);
                    XercesUtils.replaceElement(originalMovedNode, nodeToString(elementInOriginalContent));
                    moveToEltsInsideElement.add(SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId);
                }
            }
            impactedElements.add(SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId);
            impactedElements.add(moveFromId);
        }
        NodeList moveToElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_SOFT_ACTION_ATTR + " = '" + SoftActionType.MOVE_TO.getSoftAction() + "']");
        List<Node> sortedMoveToElts = sortMovedElements(moveToElts);
        for (int i = 0; i < sortedMoveToElts.size(); i++) {
            Node moveToElt = sortedMoveToElts.get(i);
            if (moveToEltsInsideElement.contains(getId(moveToElt))) {
                continue;
            }
            //Get moved element in original document
            String moveFromId = getId(moveToElt).replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
            if (isMovedElementInAnotherAction(contributionNode, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId)) {
                continue;
            }

            Node movedElementInOriginalContent = XercesUtils.getFirstElementByXPath(relatedParentOriginalNode,
                    "//*[@" + XMLID + " = '" + elementId + "']//*[@" + XMLID + " = '" + SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId + "']");
            Node movedFromElementInOriginalContent = XercesUtils.getFirstElementByXPath(relatedParentOriginalNode,
                    "//*[@" + XMLID + " = '" + elementId + "']//*[@" + XMLID + " = '" + moveFromId + "']");
            Node elementInOriginalContent = moveFromId != null ? XercesUtils.getElementById(xmlContent, moveFromId)
                    : null;
            String moveFromParentElementId = null;
            if (elementInOriginalContent != null) {
                moveFromParentElementId = getId(elementInOriginalContent.getParentNode());
            }
            if (movedElementInOriginalContent != null) {
                movedElementInOriginalContent.getParentNode().removeChild(movedElementInOriginalContent);
            }
            if (elementInOriginalContent != null && movedFromElementInOriginalContent == null) {
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, moveFromId, false);
                resolveTrackChange(elementInOriginalContent, true);
                mergeInsertedEltInsideNode(relatedParentOriginalNode, moveToElt, nodeToString(elementInOriginalContent), false, elementId);
                if (moveFromParentElementId != null) {
                    xmlContent = renumberFragment(xmlContent, moveFromParentElementId);
                }
            }
            impactedElements.add(SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId);
            impactedElements.add(moveFromId);
        }
        return xmlContent;
    }

    // Undo added or removed tracked elements in contribution node
    private void undoInsertedAndDeletedElementsInContributionNode(Node contributionNode, Node relatedParentOriginalNode, String elementId) {
        NodeList addedElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_ACTION_ATTR + " = '" + LEOS_TC_INSERT_ACTION + "']");
        for (int i = 0; i < addedElts.getLength(); i++) {
            Node addedElt = addedElts.item(i);
            if (!addedElt.getNodeName().equals(NUM) && !XercesUtils.hasAttribute(addedElt, LEOS_SOFT_MOVE_FROM)) {
                Node originalAddedNode = XercesUtils.getElementById(relatedParentOriginalNode, getId(addedElt));
                if (originalAddedNode != null) {
                    originalAddedNode.getParentNode().removeChild(originalAddedNode);
                }
                impactedElements.add(getId(addedElt));
            }
        }
        NodeList deletedElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_ACTION_ATTR + " = '" + LEOS_TC_DELETE_ACTION + "']");
        for (int i = 0; i < deletedElts.getLength(); i++) {
            Node deletedElt = deletedElts.item(i);
            if (!deletedElt.getNodeName().equals(NUM) && !XercesUtils.hasAttribute(deletedElt, LEOS_SOFT_MOVE_TO)) {
                removeAttribute(deletedElt, LEOS_MERGE_ACTION_ATTR);
                mergeInsertedEltInsideNode(relatedParentOriginalNode, deletedElt, nodeToString(deletedElt), false, elementId);
                impactedElements.add(getId(deletedElt));
            }
        }
    }

    private byte[] mergeInsertedEltInXml(byte[] xmlContent,
                                         byte[] contributionXMLContent,
                                         String contributionElementFragment,
                                         String contributionElementId,
                                         boolean withTrackChanges) {
        Element documentElement = xmlContentProcessor.getElementById(xmlContent, contributionElementId);

        Node contributionElement = XercesUtils.getElementById(contributionXMLContent, contributionElementId);

        Node contributionPreviousSibling = getSiblingInXml(xmlContent, contributionElement, true);
        Node contributionNextSibling = getSiblingInXml(xmlContent, contributionElement, false);
        Node contributionParentElement = contributionElement.getParentNode();

        Element xmlPreviousSibling = contributionPreviousSibling != null ? xmlContentProcessor.getElementById(xmlContent, getId(contributionPreviousSibling)) : null;
        if (xmlPreviousSibling == null && contributionPreviousSibling != null) {
            xmlPreviousSibling = xmlContentProcessor.getElementById(xmlContent, removesPrefixFromElementId(getId(contributionPreviousSibling)));
        }
        Element xmlNextSibling = contributionNextSibling != null ? xmlContentProcessor.getElementById(xmlContent, getId(contributionNextSibling)) : null;
        if (xmlNextSibling == null && contributionNextSibling != null) {
            xmlNextSibling = xmlContentProcessor.getElementById(xmlContent, removesPrefixFromElementId(getId(contributionNextSibling)));
        }

        // Chooses best one if both are available
        boolean bestChoiceIsPrev = true;
        if (xmlNextSibling != null && xmlPreviousSibling != null) {
            if ((XercesUtils.hasAttribute(contributionPreviousSibling, LEOS_ACTION_ATTR) || XercesUtils.hasAttribute(contributionPreviousSibling,
                    LEOS_SOFT_ACTION_ATTR))
                && !XercesUtils.hasAttribute(contributionNextSibling, LEOS_ACTION_ATTR) && !XercesUtils.hasAttribute(contributionNextSibling,
                    LEOS_SOFT_ACTION_ATTR)) {
                bestChoiceIsPrev = false;
            }
        }

        Element xmlParentSibling = contributionParentElement != null ? xmlContentProcessor.getElementById(xmlContent, getId(contributionParentElement)) : null;

        if (documentElement != null) {
            xmlContent = xmlContentProcessor.replaceElementById(xmlContent, contributionElementFragment, contributionElementId);
        } else if (xmlParentSibling != null && xmlPreviousSibling == null && xmlNextSibling != null) {
            // that means that element should be at first position
            Element firstEltOfParent = xmlContentProcessor.getFirstChildElement(xmlContent, xmlParentSibling.getElementId());
            xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent,  contributionElementFragment,
                    firstEltOfParent.getElementId(),true, withTrackChanges);
        } else if (xmlParentSibling != null && xmlNextSibling == null && xmlPreviousSibling != null) {
            // that means that element should be at last position
            Element lastEltOfParent = xmlContentProcessor.getLastChildElement(xmlContent, xmlParentSibling.getElementId());
            xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent,  contributionElementFragment,
                    lastEltOfParent.getElementId(),false, withTrackChanges);
        } else if (xmlPreviousSibling != null && bestChoiceIsPrev) {
            xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent,  contributionElementFragment,
                    xmlPreviousSibling.getElementId(),false, withTrackChanges);
        } else if (xmlNextSibling != null) {
            xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent,  contributionElementFragment,
                    xmlNextSibling.getElementId(),true, withTrackChanges);
        } else if (xmlParentSibling != null) {
            xmlContent = xmlContentProcessor.addChildToParent(xmlContent, contributionElementFragment, xmlParentSibling.getElementId());
        } else {
            mergingCompletelySuccessfull = false;
        }
        contributionElementId = removesPrefixFromElementId(contributionElementId);
        if (withTrackChanges) {
            xmlContent = copyTrackChangesAttributes(xmlContent, contributionElement, contributionElementId);
        }
        return xmlContent;
    }

    private boolean mergeInsertedEltInsideNode(Node originalNode,
                                               Node refNode,
                                               String content,
                                               boolean withTrackChanges,
                                               String elementId) {
        Node documentElement = XercesUtils.getFirstElementByXPath(originalNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + XMLID + " = '" + getId(refNode) + "']");
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
                resolveTrackChangesInEntireNode(newNode);
            } else {
                copyTrackChangesAttributes(newNode, refNode);
            }
            if (xmlPreviousSibling != null) {
                XercesUtils.addSibling(newNode, xmlPreviousSibling, false);
            } else if (xmlNextSibling != null) {
                XercesUtils.addSibling(newNode, xmlNextSibling, true);
            } else if (xmlParentSibling != null) {
                XercesUtils.addChild(newNode, xmlParentSibling);
            } else {
                mergingCompletelySuccessfull = false;
                return false;
            }
        }
        return true;
    }

    private void setActionAttribute(Node doc, String elementId, String action) {
        Node contributionNode = XercesUtils.getElementById(doc, elementId);
        XercesUtils.insertOrUpdateAttributeValue(contributionNode, LEOS_MERGE_ACTION_ATTR, action);
        if (!HIGHER_ELEMENTS.contains(contributionNode.getNodeName())) {
            List<Node> descendants = XercesUtils.getDescendants(contributionNode, mainElements);
            for (Node descendant : descendants) {
                XercesUtils.insertOrUpdateAttributeValue(descendant, LEOS_MERGE_ACTION_ATTR, action);
            }
        }
    }

    private void updateActionOnImpactedElements(Node doc, String action, String elementId) {
        if (doc != null) {
            setActionAttribute(doc, elementId, action);
            for (String impactedId : impactedElements) {
                setActionAttribute(doc, impactedId, action);
            }
        }
    }

    private byte[] resetActionOnDocument(byte[] xmlContent) {
        Document document = createXercesDocument(xmlContent);
        NodeList nodes = XercesUtils.getElementsByXPath(document, "//*[@" + LEOS_MERGE_ACTION_ATTR + "]");
        for (int i=0; i<nodes.getLength(); i++) {
            Node node = nodes.item(i);
            XercesUtils.removeAttribute(node, LEOS_MERGE_ACTION_ATTR);
        }
        return nodeToByteArray(document);
    }

    private void resetAction(Node node) {
        XercesUtils.removeAttribute(node, LEOS_MERGE_ACTION_ATTR);
        List<Node> nodes = XercesUtils.getChildren(node);
        for (Node child : nodes) {
            resetAction(child);
        }
    }

    private void removeActionOnImpactedElement(Node doc, String elementId) {
        Node contributionNode = XercesUtils.getElementById(doc, elementId);
        if (contributionNode != null) {
            resetAction(contributionNode);
            for (String impactedId : impactedElements) {
                Node impactedNode = XercesUtils.getElementById(doc, impactedId);
                resetAction(impactedNode);
            }
        }
    }

    private void updatedMainElements() {
        this.mainElements = new ArrayList<>();
        for (TocItem tocItem : this.tocItemsList) {
            if (tocItem.isDraggable()) {
                this.mainElements.add(tocItem.getAknTag().value());
            }
        }
        this.mainElements.add(HEADING);
        this.mainElements.add(PARAGRAPH);
    }

    private int countChildren(@NotNull Node node) {
        int count = 0;
        NodeList children = node.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);
            if ((child.getNodeType() == Node.TEXT_NODE && StringUtils.isNotEmpty(child.getTextContent().trim())) || (child.getNodeType() != Node.TEXT_NODE && !child.getNodeName().equals(NUM))) {
                count++;
            }
        }
        return count;
    }

    private int countNonEmptyTextNodes(Node node) {
        if (node == null) {
            return 0;
        }
        int count = 0;
        NodeList children = node.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);
            if (child.getNodeType() == Node.TEXT_NODE && !StringUtils.isBlank(child.getTextContent().trim()) && StringUtils.isAsciiPrintable(child.getTextContent().trim())) {
                count ++;
            }
        }
        return count;
    }

    private Node getRealUpdatedNode(Node relatedOriginalNode, Node impactedNode, boolean insertion) {
        if (insertion && impactedNode.getNodeName().equals(LEOS_TC_INSERT_ELEMENT_NAME)) {
            Node parentNode = impactedNode;
            Node prevNode;
            Node originalParentElt;
            int countNonEmptyTextNodes = 0;
            do {
                prevNode = parentNode;
                parentNode = parentNode.getParentNode();
                countNonEmptyTextNodes = countNonEmptyTextNodes(parentNode);

                originalParentElt = parentNode != null ? XercesUtils.getElementById(relatedOriginalNode, getId(parentNode)) : null;
                if (originalParentElt == null && parentNode != null && getId(parentNode).contains(SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX)) {
                    originalParentElt = XercesUtils.getElementById(relatedOriginalNode, getId(parentNode).replaceAll(SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX, ""));
                }
            } while (parentNode != null && countNonEmptyTextNodes == 0
                    && (originalParentElt == null
                    || (hasAttribute(parentNode, LEOS_SOFT_DATE_ATTR) && !hasAttribute(prevNode, LEOS_SOFT_DATE_ATTR))
                    || parentNode.getNodeName().equals(CONTENT)
                    || parentNode.getNodeName().equals(P)));
            return prevNode != null
                    && !prevNode.getNodeName().equals(NUM)
                    && !prevNode.getNodeName().equals(CONTENT) && !prevNode.getNodeName().equals(P)
                    && (!hasAttribute(prevNode, LEOS_SOFT_ACTION_ATTR)
                    || !XercesUtils.getAttributeValue(prevNode, LEOS_SOFT_ACTION_ATTR).equals(MOVE_FROM))
                    && !hasAttribute(prevNode, LEOS_ACTION_ATTR) ? prevNode : impactedNode;
        } else if (impactedNode.getNodeName().equals(LEOS_TC_DELETE_ELEMENT_NAME)) {
            Node parentNode = impactedNode;
            Node prevNode = null;
            do {
                prevNode = parentNode;
                parentNode = parentNode.getParentNode();
            } while (countChildren(parentNode) == 1);
            return prevNode != null ? prevNode : impactedNode;
        }
        return impactedNode;
    }
    private void resolveTrackChangesInEntireNode(Node nodeToRestore) {
        resolveTrackChange(nodeToRestore, false);
        List<Node> children = XercesUtils.getChildren(nodeToRestore);
        for (Node child: children) {
            resolveTrackChangesInEntireNode(child);
        }
    }
    private void resolveTrackChange(Node nodeToRestore, boolean resetNum) {
        TocItem tocItem = getTocItemByName(this.tocItemsList, nodeToRestore.getNodeName().replace("akn", ""));
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
        XercesUtils.removeAttribute(nodeToRestore, LEOS_ACTION_ENTER);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_TITLE_ENTER);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_UID_ENTER);
        String origin = XercesUtils.getAttributeValue(nodeToRestore, LEOS_ORIGIN_ATTR);
        if (LS.equals(origin)) {
            XercesUtils.addAttribute(nodeToRestore, LEOS_ORIGIN_ATTR, EC);
        }
        if (tocItem == null || tocItem.isEditable()) {
            if (XercesUtils.hasAttribute(nodeToRestore, LEOS_EDITABLE_ATTR)) {
                XercesUtils.addAttribute(nodeToRestore, LEOS_EDITABLE_ATTR, "true");
            }
        } else {
            XercesUtils.removeAttribute(nodeToRestore, LEOS_EDITABLE_ATTR);
        }
        if (tocItem == null || tocItem.isDeletable()) {
            if (XercesUtils.hasAttribute(nodeToRestore, LEOS_DELETABLE_ATTR)) {
                XercesUtils.addAttribute(nodeToRestore, LEOS_DELETABLE_ATTR, "true");
            }
        } else {
            XercesUtils.removeAttribute(nodeToRestore, LEOS_DELETABLE_ATTR);
        }
        XercesUtils.removeAttribute(nodeToRestore, LEOS_ACTION_ATTR);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_INITIAL_NUM);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_TITLE);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_UID);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_AUTO_NUM_OVERWRITE);
        XercesUtils.updateXMLIDAttributeFullStructureNode(nodeToRestore, EMPTY_STRING, true);
        Node numNode = getFirstChild(nodeToRestore, getNumTag(nodeToRestore.getNodeName()));
        if (isAutoNumbering(nodeToRestore, numNode)) {
            if (resetNum) {
                numNode.setTextContent("#");
            }
            XercesUtils.removeAttribute(numNode, LEOS_ACTION_ATTR);
            XercesUtils.removeAttribute(numNode, LEOS_TITLE);
            XercesUtils.removeAttribute(numNode, LEOS_UID);
            XercesUtils.addAttribute(numNode, LEOS_ORIGIN_ATTR, EC);
        }
    }

    private byte[] copyTrackChangesAttributes(byte[] xmlContent, Node sourceElement, String elementId) {
        List<String> attrsToCopy = Arrays.asList(LEOS_SOFT_USER_ATTR, LEOS_SOFT_DATE_ATTR, LEOS_SOFT_ACTION_ATTR, LEOS_SOFT_MOVED_LABEL_ATTR,
                LEOS_SOFT_ACTION_ROOT_ATTR, LEOS_SOFT_MOVE_TO, LEOS_SOFT_MOVE_FROM, LEOS_ORIGIN_ATTR, LEOS_ACTION_ATTR, LEOS_TITLE,
                LEOS_UID, LEOS_EDITABLE_ATTR, LEOS_DELETABLE_ATTR);
        TocItem tocItem = getTocItemByName(this.tocItemsList, sourceElement.getNodeName().replace("akn", ""));
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
        Node numNode = getFirstChild(sourceElement, getNumTag(sourceElement.getNodeName()));
        if (numNode != null) {
            String numId = getId(numNode);
            xmlContent = copyTrackChangesAttributes(xmlContent, numNode, numId);
        }
        return xmlContent;
    }

    private void copyTrackChangesAttributes(Node destElement, Node sourceElement) {
        List<String> attrsToCopy = Arrays.asList(LEOS_SOFT_USER_ATTR, LEOS_SOFT_DATE_ATTR, LEOS_SOFT_MOVED_LABEL_ATTR, LEOS_SOFT_ACTION_ATTR,
                LEOS_SOFT_ACTION_ROOT_ATTR, LEOS_SOFT_MOVE_TO, LEOS_SOFT_MOVE_FROM, LEOS_ORIGIN_ATTR, LEOS_ACTION_ATTR, LEOS_TITLE, LEOS_UID,
                LEOS_EDITABLE_ATTR, LEOS_DELETABLE_ATTR);
        TocItem tocItem = getTocItemByName(this.tocItemsList, destElement.getNodeName().replace("akn", ""));
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
            copyTrackChangesAttributes(destNumNode, sourceNumNode);
        }
    }

    private String updateInternalReferences(String xmlContentStr, List<InternalRefMap> map) {
        for (InternalRefMap internalRefMap : map) {
            if (internalRefMap.getClonedRef() != null) {
                xmlContentStr = xmlContentStr.replaceAll(internalRefMap.getClonedRef(), internalRefMap.getRef());
            }
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

    private String cleanContent(@NotNull String str) {
        return str.replaceAll("(\\n[\\s]+)$", " ")
                .replaceAll("([\\s]+\\n)$", " ")
                .replaceAll("^([\\s]+\\n)", " ")
                .replaceAll("^(\\n[\\s]+)", " ")
                .replaceAll("([\\r\\n]+)", "")
                .replaceAll("(^[\\t]+)", "")
                .replaceAll("([\\t]+$)", "");
    }

    private String getContent(Node node) {
        if (node == null) {
            return null;
        }
        if (node.getNodeType() == Node.ELEMENT_NODE) {
            return cleanContent(getContentNodeAsXmlFragment(node));
        } else {
            return cleanContent(node.getTextContent());
        }
    }

    private Node getRealUpdatedNodeOnUndo(Node relatedParentOriginalNode, Node impactedNode, boolean isIns) {
        Node parentNode = impactedNode;
        if (isIns) {
            while (parentNode != null && !hasAttribute(parentNode, LEOS_MERGE_ACTION_ATTR)) {
                parentNode = parentNode.getParentNode();
            }
        } else {
            Node prevNode;
            Node originalParent;
            do {
                prevNode = parentNode;
                parentNode = parentNode.getParentNode();
                originalParent = getId(parentNode) != null ? XercesUtils.getElementById(relatedParentOriginalNode, getId(parentNode)) : null;
            } while (parentNode != null && originalParent == null);
            parentNode = prevNode;
        }
        return parentNode != null
                && !parentNode.getNodeName().equals(NUM)
                && (!hasAttribute(parentNode, LEOS_SOFT_ACTION_ATTR) || !getAttributeValue(parentNode, LEOS_SOFT_ACTION_ATTR).equals(MOVE_FROM))
                && !hasAttribute(parentNode, LEOS_ACTION_ATTR) ? parentNode : impactedNode;
    }

    private byte[] undoDeletionInXml(byte[] xmlToBeUpdated, byte[] refXml, String refId, String elementFragment, String tagName) {
        Element contributionPreviousSibling = xmlContentProcessor.getSiblingElement(refXml, tagName, refId, Collections.emptyList(), true);
        Element contributionNextSibling = xmlContentProcessor.getSiblingElement(refXml, tagName, refId, Collections.emptyList(), false);
        Element contributionParentElement = xmlContentProcessor.getParentElement(refXml, refId);

        Element xmlPreviousSibling = contributionPreviousSibling != null ? xmlContentProcessor.getElementById(xmlToBeUpdated, contributionPreviousSibling.getElementId()) : null;
        Element xmlNextSibling = contributionNextSibling != null ? xmlContentProcessor.getElementById(xmlToBeUpdated, contributionNextSibling.getElementId()) : null;
        Element xmlParentSibling = contributionParentElement != null ? xmlContentProcessor.getElementById(xmlToBeUpdated, contributionParentElement.getElementId()) : null;

        Node originalNode = XercesUtils.getElementById(xmlToBeUpdated, removesPrefixFromElementId(refId));
        Node currentPrevSibling = originalNode != null ? XercesUtils.getSibling(originalNode, true) : null;
        Node currentNextSibling = originalNode != null ? XercesUtils.getSibling(originalNode, false) : null;
        Node currentParent = originalNode != null ? originalNode.getParentNode() : null;

        if (xmlPreviousSibling != null && xmlPreviousSibling.getElementId() != null && (currentPrevSibling == null || (!getId(currentPrevSibling).equals(xmlPreviousSibling.getElementId())))) {
            xmlToBeUpdated = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlToBeUpdated,  elementFragment,
                    contributionPreviousSibling.getElementId(),false, false);
        } else if (xmlNextSibling !=null && xmlNextSibling.getElementId() != null && (currentNextSibling == null || (!getId(currentNextSibling).equals(xmlNextSibling.getElementId())))) {
            xmlToBeUpdated = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlToBeUpdated,  elementFragment,
                    contributionNextSibling.getElementId(),true, false);
        } else if (xmlParentSibling != null && xmlParentSibling.getElementId() != null && (currentParent == null || (!getId(currentParent).equals(xmlParentSibling.getElementId())))) {
            xmlToBeUpdated = xmlContentProcessor.addChildToParent(xmlToBeUpdated,  elementFragment, contributionParentElement.getElementId());
        }
        return xmlToBeUpdated;
    }

    private String removesPrefixFromElementId(String elementId) {
        String cleanedElementId = elementId;
        if (elementId.contains(SOFT_MOVE_PLACEHOLDER_ID_PREFIX)) {
            cleanedElementId = elementId.replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
        }
        if (elementId.contains(SOFT_DELETE_PLACEHOLDER_ID_PREFIX)) {
            cleanedElementId = elementId.replace(SOFT_DELETE_PLACEHOLDER_ID_PREFIX, "");
        }
        return cleanedElementId;
    }

    private String removesMovedPrefixFromElementId(String elementId) {
        String cleanedElementId = elementId;
        if (elementId.contains(SOFT_MOVE_PLACEHOLDER_ID_PREFIX)) {
            cleanedElementId = elementId.replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
        }
        return cleanedElementId;
    }

    private Node getSiblingInXml(byte[] xmlContent, Node contributionNode, boolean before) {
        Node contributionSibling = XercesUtils.getSibling(contributionNode, before);
        while (contributionSibling != null &&
                (XercesUtils.hasAttribute(contributionSibling, LEOS_ACTION_ATTR)
                        || XercesUtils.hasAttribute(contributionSibling, LEOS_SOFT_ACTION_ATTR))) {
            String tcAction = XercesUtils.getAttributeValue(contributionSibling, LEOS_ACTION_ATTR);
            String softAction = XercesUtils.getAttributeValue(contributionSibling, LEOS_SOFT_ACTION_ATTR);
            if ((tcAction != null && (softAction == null || !softAction.equals(MOVE_TO)) && tcAction.equals(LEOS_TC_DELETE_ACTION))
                || (softAction != null && softAction.equals(LEOS_SOFT_ACTION_DELETE))) {
                if (XercesUtils.getElementById(xmlContent, getId(contributionSibling)) != null || XercesUtils.getElementById(xmlContent,
                        removesPrefixFromElementId(getId(contributionSibling))) != null) {
                    break;
                }
            } else if ((tcAction != null && (softAction == null || !softAction.equals(MOVE_FROM)) && tcAction.equals(LEOS_TC_INSERT_ACTION))
                || (softAction != null && softAction.equals(LEOS_SOFT_ACTION_ADD))) {
                if (XercesUtils.getElementById(xmlContent, getId(contributionSibling)) != null) {
                    break;
                }
            } else if (softAction != null && (softAction.equals(MOVE_FROM) || softAction.equals(MOVE_TO))) {
                Node originalSibling = XercesUtils.getElementById(xmlContent, getId(contributionSibling));
                if (originalSibling != null && XercesUtils.hasAttribute(contributionSibling, LEOS_SOFT_ACTION_ATTR)
                        && XercesUtils.getAttributeValue(contributionSibling, LEOS_SOFT_ACTION_ATTR) == softAction) {
                    break;
                }
            }

            contributionSibling = XercesUtils.getSibling(contributionSibling, before);
        }
        return contributionSibling;
    }

    private void handleEmptyList(@NotNull Node relatedParentOriginalNode, @NotNull Node list, @NotNull String elementId) {
        list = XercesUtils.getElementById(relatedParentOriginalNode, getId(list));
        if (list != null && list.getNodeName().equals(LIST)) {
            List<Node> points = XercesUtils.getChildren(list, Arrays.asList(POINT, INDENT, CROSSHEADING));
            if (points.isEmpty()) {
                handleIntroAndConclusionForListOnUndo(relatedParentOriginalNode, list, elementId);
            }
        }
    }

    private void handleSubparagraphsInList(@NotNull Node relatedParentOriginalNode, Node subpara, @NotNull String elementId) {
        if (subpara != null && subpara.getNodeName().equals(SUBPARAGRAPH)) {
            String subparaId = getId(subpara);
            Node relatedNode = XercesUtils.getFirstElementByXPath(relatedParentOriginalNode, "//*[@" + XMLID + " = '" + elementId + "']//*[@" + XMLID +
                    " = '" + subparaId + "']");
            if (relatedNode == null) {
                subpara = XercesUtils.getFirstChild(subpara);
                subparaId = getId(subpara);
                relatedNode = XercesUtils.getFirstElementByXPath(relatedParentOriginalNode, "//*[@" + XMLID + " = '" + elementId + "']//*[@" + XMLID +
                        " = '" + subparaId + "']");
            }
            if (relatedNode != null) {
                XercesUtils.replaceElement(subpara, nodeToString(relatedNode));
                relatedNode.getParentNode().removeChild(relatedNode);
            }
        }
    }

    private void handleIntroAndConclusionForList(@NotNull Node relatedParentOriginalNode, @NotNull Node list, @NotNull String elementId) {
        if (list.getNodeName().equals(LIST)) {
            Node intro = XercesUtils.getFirstChild(list);
            handleSubparagraphsInList(relatedParentOriginalNode, intro, elementId);
            Node conclusion = XercesUtils.getLastChild(list);
            handleSubparagraphsInList(relatedParentOriginalNode, conclusion, elementId);
        }
    }

    private void handleIntroAndConclusionForListOnUndo(@NotNull Node relatedParentOriginalNode, @NotNull Node list, @NotNull String elementId) {
        list = XercesUtils.getElementById(relatedParentOriginalNode, getId(list));
        if (list != null && list.getNodeName().equals(LIST)) {
            int nbOfSiblings = XercesUtils.getChildren(list.getParentNode(), Arrays.asList(LIST, SUBPARAGRAPH)).size();
            Node intro = XercesUtils.getFirstChild(list);
            Node conclusion = XercesUtils.getLastChild(list);
            if (nbOfSiblings == 1 && intro != null && intro.getNodeName().equals(SUBPARAGRAPH) && (conclusion == null
                    || !conclusion.getNodeName().equals(SUBPARAGRAPH) || conclusion.equals(intro))) {
                // Take content of intro and insert it before list
                list.getParentNode().insertBefore(XercesUtils.getFirstChild(intro), list);
            } else if (nbOfSiblings == 1 && conclusion != null && conclusion.getNodeName().equals(SUBPARAGRAPH) && (intro == null
                    || !intro.getNodeName().equals(SUBPARAGRAPH))) {
                // Take content of conclusion and insert it after list
                Node nextSibling = list.getNextSibling();
                if (nextSibling != null) {
                    list.getParentNode().insertBefore(XercesUtils.getFirstChild(conclusion), nextSibling);
                } else {
                    list.getParentNode().appendChild(XercesUtils.getFirstChild(conclusion));
                }
            } else {
                if (intro != null && intro.getNodeName().equals(SUBPARAGRAPH)) {
                    list.getParentNode().insertBefore(intro, list);
                }
                if (conclusion != null && conclusion.getNodeName().equals(SUBPARAGRAPH) && !conclusion.equals(intro)) {
                    Node nextSibling = list.getNextSibling();
                    if (nextSibling != null) {
                        list.getParentNode().insertBefore(conclusion, nextSibling);
                    } else {
                        list.getParentNode().appendChild(conclusion);
                    }
                }
            }
        }
    }

    private byte[] copyTrackChangesForMovedElement(byte[] xmlContent, Node contributionNode, String elementId, SoftActionType softActionType) {
        String title = getAttributeValue(contributionNode, LEOS_TITLE);
        String softUser = getAttributeValue(contributionNode, LEOS_SOFT_USER_ATTR);
        String trackUser = getAttributeValue(contributionNode, LEOS_UID);
        xmlContent = xmlContentProcessor.addTrackChangesAttributesForMovedElement(xmlContent, elementId, softActionType, trackUser,
                softUser, title);
        return xmlContent;
    }

    private void checkNum(Node refNode, Node originalNode, ElementState mergeAction, boolean isWithTrackChanges) {
        Node numNode = getFirstChild(refNode, getNumTag(refNode.getNodeName()));
        Node originalNumNode = originalNode != null ? getFirstChild(originalNode, getNumTag(originalNode.getNodeName())) : null;
        if (isAutoNumbering(refNode, numNode)) {
            if (isWithTrackChanges) {
                if (ElementState.DELETE.equals(mergeAction) && originalNumNode != null) {
                    Node refDelNode = getFirstChild(numNode, "del");
                    String oldNumLabel = originalNumNode.getTextContent();
                    numNode.setTextContent(null);
                    Node deletedNum = createElementAsLastChildOfNode(refNode.getOwnerDocument(), numNode, "del", oldNumLabel);
                    if (refDelNode != null) {
                        addAttribute(deletedNum, LEOS_UID, XercesUtils.getAttributeValue(refDelNode, LEOS_UID));
                        addAttribute(deletedNum, LEOS_TITLE, XercesUtils.getAttributeValue(refDelNode, LEOS_TITLE));
                    } else {
                        if (XercesUtils.hasAttribute(refNode, LEOS_ACTION_ATTR)) {
                            addAttribute(deletedNum, LEOS_UID, XercesUtils.getAttributeValue(refNode, LEOS_UID));
                            addAttribute(deletedNum, LEOS_TITLE, XercesUtils.getAttributeValue(refNode, LEOS_TITLE));
                        }
                    }
                    addAttribute(deletedNum, LEOS_ACTION_NUMBER, LEOS_TC_DELETE_ACTION);
                    addAttribute(deletedNum, LEOS_TC_ORIGINAL_NUMBER, oldNumLabel);
                    if (!XercesUtils.hasAttribute(refNode, LEOS_ACTION_ATTR) && !XercesUtils.hasAttribute(refNode, LEOS_SOFT_ACTION_ATTR)) {
                        addAttribute(refNode, LEOS_AUTO_NUM_OVERWRITE, "true");
                    }
                } else if (ADD.equals(mergeAction)) {
                    Node refInsNode = getFirstChild(numNode, "ins");
                    if (refInsNode != null) {
                        String oldNumLabel = numNode.getTextContent().trim();
                        numNode.setTextContent(null);
                        Node insertNum = createElementAsLastChildOfNode(refNode.getOwnerDocument(), numNode, "ins", oldNumLabel);
                        addAttribute(insertNum, LEOS_UID, XercesUtils.getAttributeValue(refInsNode, LEOS_UID));
                        addAttribute(insertNum, LEOS_TITLE,  XercesUtils.getAttributeValue(refInsNode, LEOS_TITLE));
                        addAttribute(insertNum, LEOS_TC_ORIGINAL_NUMBER, oldNumLabel);
                    }
                } else if (!ElementState.CONTENT_CHANGE.equals(mergeAction)) {
                    numNode.setTextContent("#");
                }
            } else {
                numNode.setTextContent("#");
                removeAttribute(refNode, LEOS_AUTO_NUM_OVERWRITE);
            }
        }
    }

    private byte[] renumberFragment(byte[] xmlContent, String elementId) {
        Node e = getElementById(xmlContent, elementId);
        if (e != null) {
            if (HIGHER_ELEMENTS.contains(e.getNodeName())) {
                String language = documentLanguageContext.getDocumentLanguage();
                xmlContent = this.numberService.renumberHigherSubDivisions(xmlContent, language, e.getNodeName(), this.tocItemsList);
            }
            if (Arrays.asList(POINT, INDENT, CROSSHEADING, SUBPARAGRAPH, LIST).contains(e.getNodeName())) {
                e = XercesUtils.getFirstAscendant(e, Arrays.asList(PARAGRAPH, ARTICLE, LEVEL));
            }
            if (e.getNodeName().equals(PARAGRAPH)) {
                Node numP = XercesUtils.getFirstChild(e, NUM);
                if (numP != null) {
                    elementId = getId(e.getParentNode());
                }
            }
            List<Node> articles = XercesUtils.getDescendants(e, Arrays.asList(ARTICLE));
            if (articles.size() > 0) {
                return this.numberService.renumberSpecificElementChildren(xmlContent, ARTICLE, elementId);
            } else {
                return this.numberService.renumberSpecificElementChildren(xmlContent, PARAGRAPH, elementId);
            }
        }
        return xmlContent;
    }

    private boolean isAutoNumbering(Node node, Node numNode) {
        Optional<TocItem> tocItem =
                this.tocItemsList.stream().filter((item) -> item.getAknTag().name().equalsIgnoreCase(node.getNodeName())).findFirst();
        if (tocItem.isPresent() && tocItem.get().getAutoNumbering() != null) {
            LangNumConfig langNumConfig = StructureConfigUtils.getLangNumConfigByLanguage(tocItem.get().getAutoNumbering().getLangNumConfigs(),
                    documentLanguageContext.getDocumentLanguage());
            return (numNode != null && (langNumConfig != null && langNumConfig.isAuto()));
        }
        return false;
    }

    private boolean isMovedElementInAnotherAction(Node contributionNode, String movedId) {
        for (MergeActionVO action : this.currentMergeActions) {
            String eltId = action.getElementId();
            if (eltId.equals(getId(contributionNode))) {
                continue;
            }
            Node actionContributionNode = XercesUtils.getElementById(contributionNode, eltId);
            if (actionContributionNode != null) {
                NodeList nodes = XercesUtils.getElementsByXPath(actionContributionNode, "//*[@" + XMLID + " = '" + eltId + "']//*[@" + XMLID + " = " +
                        "'" + removesMovedPrefixFromElementId(movedId) + "']");
                if (nodes.getLength() > 0) {
                    return true;
                }
            }
        }
        return false;
    }

    private List<Node> sortMovedElements(NodeList movedElts) {
        List<Pair<Node, Integer>> listNodes = new ArrayList<>();
        for (int i=0; i<movedElts.getLength(); i++) {
            Node movedElt = movedElts.item(i);
            String softAction = XercesUtils.getAttributeValue(movedElt, LEOS_SOFT_ACTION_ATTR);
            NodeList moveInsideElts = XercesUtils.getElementsByXPath(movedElt, "//*[@" + XMLID + " = '" + getId(movedElt) + "']//*[@" + LEOS_SOFT_ACTION_ATTR +
                    " = '" + (softAction.equals(SoftActionType.MOVE_FROM.getSoftAction()) ?  SoftActionType.MOVE_FROM.getSoftAction() :
                    SoftActionType.MOVE_TO.getSoftAction()) + "']");
            Pair<Node, Integer> sortedListItemWithWeight = new Pair<>(movedElt, moveInsideElts.getLength());
            listNodes.add(sortedListItemWithWeight);
        }
        return listNodes.stream().sorted(Comparator.comparing(Pair::right))
                .collect(Collectors.toList()).stream().map(n -> n.left()).collect(Collectors.toList());
    }
}
