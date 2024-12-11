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
import eu.europa.ec.leos.services.support.IdGenerator;
import eu.europa.ec.leos.services.support.MergeUtils;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.services.utils.StructureConfigUtils;
import eu.europa.ec.leos.vo.structure.LangNumConfig;
import eu.europa.ec.leos.vo.structure.TocItem;
import io.atlassian.fugue.Pair;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static eu.europa.ec.leos.services.dto.request.MergeActionVO.ElementState;
import static eu.europa.ec.leos.services.dto.request.MergeActionVO.ElementState.ADD;
import static eu.europa.ec.leos.services.dto.request.MergeActionVO.ElementState.DELETE;
import static eu.europa.ec.leos.services.dto.request.MergeActionVO.MergeAction.UNSELECT;
import static eu.europa.ec.leos.services.support.MergeUtils.copyTrackChangesAttributes;
import static eu.europa.ec.leos.services.support.MergeUtils.getSiblingForRenumbering;
import static eu.europa.ec.leos.services.support.MergeUtils.removeChildren;
import static eu.europa.ec.leos.services.support.MergeUtils.removeTrackChangesAttributes;
import static eu.europa.ec.leos.services.support.MergeUtils.removesDeletedPrefixFromElementId;
import static eu.europa.ec.leos.services.support.MergeUtils.removesMovedPrefixFromElementId;
import static eu.europa.ec.leos.services.support.MergeUtils.removesPrefixFromElementId;
import static eu.europa.ec.leos.services.support.MergeUtils.undoAllTrackChangesForElement;
import static eu.europa.ec.leos.services.support.XercesUtils.addAttribute;
import static eu.europa.ec.leos.services.support.XercesUtils.cleanTrackChangesForElement;
import static eu.europa.ec.leos.services.support.XercesUtils.createElementAsLastChildOfNode;
import static eu.europa.ec.leos.services.support.XercesUtils.createNodeFromXmlFragment;
import static eu.europa.ec.leos.services.support.XercesUtils.createXercesDocument;
import static eu.europa.ec.leos.services.support.XercesUtils.getAscendantWithAttributeExceptValue;
import static eu.europa.ec.leos.services.support.XercesUtils.getAttributeValue;
import static eu.europa.ec.leos.services.support.XercesUtils.getChildren;
import static eu.europa.ec.leos.services.support.XercesUtils.getContentNodeAsXmlFragment;
import static eu.europa.ec.leos.services.support.XercesUtils.getElementById;
import static eu.europa.ec.leos.services.support.XercesUtils.getEndTagNodeAsXmlFragment;
import static eu.europa.ec.leos.services.support.XercesUtils.getFirstAscendant;
import static eu.europa.ec.leos.services.support.XercesUtils.getFirstAncestorWithTagNames;
import static eu.europa.ec.leos.services.support.XercesUtils.getFirstChild;
import static eu.europa.ec.leos.services.support.XercesUtils.getId;
import static eu.europa.ec.leos.services.support.XercesUtils.getLastChild;
import static eu.europa.ec.leos.services.support.XercesUtils.getNumTag;
import static eu.europa.ec.leos.services.support.XercesUtils.getStartTagNodeAsXmlFragment;
import static eu.europa.ec.leos.services.support.XercesUtils.hasAscendantWithId;
import static eu.europa.ec.leos.services.support.XercesUtils.hasAttribute;
import static eu.europa.ec.leos.services.support.XercesUtils.hasAttributeWithValue;
import static eu.europa.ec.leos.services.support.XercesUtils.hasDescendantWithAttribute;
import static eu.europa.ec.leos.services.support.XercesUtils.isListIntro;
import static eu.europa.ec.leos.services.support.XercesUtils.nodeToByteArray;
import static eu.europa.ec.leos.services.support.XercesUtils.nodeToString;
import static eu.europa.ec.leos.services.support.XercesUtils.removeAttribute;
import static eu.europa.ec.leos.services.support.XercesUtils.replaceElement;
import static eu.europa.ec.leos.services.support.XercesUtils.setId;
import static eu.europa.ec.leos.services.support.XmlHelper.ARTICLE;
import static eu.europa.ec.leos.services.support.XmlHelper.CONTENT;
import static eu.europa.ec.leos.services.support.XmlHelper.CROSSHEADING;
import static eu.europa.ec.leos.services.support.XmlHelper.EMPTY_STRING;
import static eu.europa.ec.leos.services.support.XmlHelper.HEADING;
import static eu.europa.ec.leos.services.support.XmlHelper.HIGHER_ELEMENTS;
import static eu.europa.ec.leos.services.support.XmlHelper.INDENT;
import static eu.europa.ec.leos.services.support.XmlHelper.INLINE;
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
import static eu.europa.ec.leos.services.support.XmlHelper.LEVEL;
import static eu.europa.ec.leos.services.support.XmlHelper.LIST;
import static eu.europa.ec.leos.services.support.XmlHelper.LS;
import static eu.europa.ec.leos.services.support.XmlHelper.MOVE_FROM;
import static eu.europa.ec.leos.services.support.XmlHelper.NUM;
import static eu.europa.ec.leos.services.support.XmlHelper.PARAGRAPH;
import static eu.europa.ec.leos.services.support.XmlHelper.POINT;
import static eu.europa.ec.leos.services.support.XmlHelper.RECITAL;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_DELETE_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_MOVE_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.SUBPARAGRAPH;
import static eu.europa.ec.leos.services.support.XmlHelper.UTF_8;
import static eu.europa.ec.leos.services.support.XmlHelper.XMLID;
import static eu.europa.ec.leos.services.utils.StructureConfigUtils.getTocItemByName;
import static java.util.stream.Collectors.groupingBy;

@Service
public class MergeContributionService {

    private static final String AKN = "akn";

    private static final int MAXLENGTHSTR = 20;
    private static final int MINLENGTHSTR = 6;

    private final XmlContentProcessor xmlContentProcessor;
    private final ContributionService contributionService;
    private final DocumentLanguageContext documentLanguageContext;
    private final NumberService numberService;

    enum ActionType {
        MOVE_TO,
        MOVE_FROM,
        ADD,
        DELETE,
        INS,
        DEL,
        INDENT,
        NUMBER
    }

    private class ElementToBeProcessed {
        private String id;
        private String tagName;
        private final ActionType actionType;
        private final Node node;
        private Node reallyImpactedNode;

        ElementToBeProcessed(String id, String tagName, Node node, Node reallyImpactedNode, ActionType actionType) {
            this.id = id;
            this.tagName = tagName;
            this.actionType = actionType;
            this.node = node;
            this.reallyImpactedNode = reallyImpactedNode;
        }

        public String getTagName() {
            return this.tagName;
        }

        public void setTagName(String tagName) {
            this.tagName = tagName;
        }

        public String getId() {
            return this.id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public ActionType getActionType() {
            return this.actionType;
        }

        public Node getNode() {
            return this.node;
        }

        public Node getReallyImpactedNode() {
            return this.reallyImpactedNode;
        }

        public void setReallyImpactedNode(Node node) {
            this.reallyImpactedNode = node;
        }

        public boolean equals(Object obj) {
            if (obj == null) return false;
            if (obj == this) return true;
            if (!(obj instanceof ElementToBeProcessed)) return false;
            ElementToBeProcessed o = (ElementToBeProcessed) obj;
            return o.id.equals(this.id) && o.tagName.equals(this.tagName) && o.actionType.equals(this.actionType);
        }
    }

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
        AtomicBoolean mergingCompletelySuccessfull = new AtomicBoolean(true);
        byte[] xmlContent = xmlDocument.getContent().get().getSource().getBytes();
        byte[] contributionXmlContent = request.getMergeActions().isEmpty() ? null
                : request.getMergeActions().get(0).getContributionVO().getXmlContent();
        Node contributionDocument = XercesUtils.createXercesDocument(contributionXmlContent);

        // Sort the merge actions so that move actions are done first

        // Sort other actions
        List<MergeActionVO> sortedActionEvents =
                request.getMergeActions().stream().filter((MergeActionVO m) -> !m.getAction().equals(MergeActionVO.MergeAction.UNDO)).collect(Collectors.toList());
        sortedActionEvents = sortedActionEvents.stream().sorted(Collections.reverseOrder(Comparator.comparing(MergeActionVO::getElementState))).collect(Collectors.toList());

        // Sort undo actions
        List<MergeActionVO> sortedUndoEvents =
                request.getMergeActions().stream().filter((MergeActionVO m) -> m.getAction().equals(MergeActionVO.MergeAction.UNDO)).collect(Collectors.toList());
        sortedUndoEvents =
                sortedUndoEvents.stream().sorted(Comparator.comparing(MergeActionVO::getElementState)).collect(Collectors.toList());

        // Process merging
        for (MergeActionVO mergeActionVO : sortedActionEvents ) {
            List<String> impactedElements = new ArrayList<String>();
            if (!mergeActionVO.getAction().equals(MergeActionVO.MergeAction.PROCESSED)
                    && !mergeActionVO.getAction().equals(UNSELECT)) {
                xmlContent = mergeTrackChangesFromContribution(
                        mergeActionVO.getContributionVO(),
                        xmlContent,
                        mergeActionVO.getElementId(),
                        mergeActionVO.getElementState(),
                        mergeActionVO.isWithTrackChanges(),
                        impactedElements,
                        mergingCompletelySuccessfull,
                        tocItemsList, request.getMergeActions());
                if (HIGHER_ELEMENTS.contains(mergeActionVO.getElementTagName().replace(AKN, "")) && DELETE.equals(mergeActionVO.getElementState())) {
                    String language = documentLanguageContext.getDocumentLanguage();
                    xmlContent = this.numberService.renumberHigherSubDivisions(xmlContent, language, mergeActionVO.getElementTagName().replace(AKN, ""), tocItemsList);
                }
            } else {
                if (ElementState.MOVE.equals(mergeActionVO.getElementState())) {
                    String cleanedElementId = removesPrefixFromElementId(mergeActionVO.getElementId());
                    impactedElements.add(mergeActionVO.getElementId().startsWith(SOFT_MOVE_PLACEHOLDER_ID_PREFIX) ? cleanedElementId :
                            SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId);
                }
            }
            // Sets "mergeAction" attribute on contribution elements where merging has been done
            updateActionOnImpactedElements(contributionDocument, mergeActionVO.getAction().name(),
                    mergeActionVO.getElementId(), impactedElements, tocItemsList);
        }

        // Process undo merging actions
        for (MergeActionVO mergeActionVO : sortedUndoEvents ) {
            List<String> impactedElements = new ArrayList<String>();
            String currentMergeAction = xmlContentProcessor.getElementAttributeValueByNameAndId(mergeActionVO.getContributionVO().getXmlContent(),
                    LEOS_MERGE_ACTION_ATTR, mergeActionVO.getElementTagName(), mergeActionVO.getElementId());
            if (currentMergeAction != null) {
                if (!currentMergeAction.equals(MergeActionVO.MergeAction.PROCESSED.name())) {
                    xmlContent = undoTrackChangesFromContribution(
                            mergeActionVO.getContributionVO(),
                            xmlContent,
                            mergeActionVO.getElementId(),
                            mergeActionVO.getElementState(),
                            impactedElements,
                            mergingCompletelySuccessfull,
                            tocItemsList, request.getMergeActions());
                    if (HIGHER_ELEMENTS.contains(mergeActionVO.getElementTagName().replace(AKN, "")) && MergeActionVO.ElementState.ADD.equals(mergeActionVO.getElementState())) {
                        String language = documentLanguageContext.getDocumentLanguage();
                        xmlContent = this.numberService.renumberHigherSubDivisions(xmlContent, language, mergeActionVO.getElementTagName().replace(AKN, ""), tocItemsList);
                    }
                } else {
                    if (ElementState.MOVE.equals(mergeActionVO.getElementState())) {
                        String cleanedElementId = removesPrefixFromElementId(mergeActionVO.getElementId());
                        impactedElements.add(mergeActionVO.getElementId().startsWith(SOFT_MOVE_PLACEHOLDER_ID_PREFIX) ? cleanedElementId :
                                SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId);
                    }
                }
                // Removes "mergeAction" attribute on contribution elements where merging has been undone
                removeActionOnImpactedElement(contributionDocument, mergeActionVO.getElementId(), impactedElements);
            }
        }
        
        // Update contribution xml in DB
        if (!request.getMergeActions().isEmpty()) {
            contributionXmlContent = nodeToByteArray(contributionDocument);
            executeContributionAction(request.getMergeActions().get(0), contributionXmlContent);
        }
        xmlContent = resetActionOnDocument(xmlContent);
        xmlContent = updateInternalReferences(xmlContent, intRefMap);
        return new MergeContributionResponse(mergingCompletelySuccessfull.get(), xmlContent);
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

    private void removeFromElementsToBeProcessedById(String id, LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed) {
        Optional<ElementToBeProcessed> element = elementsToBeProcessed.stream().filter((elt) -> elt.getId().equals(id)).findFirst();
        element.ifPresent(elementsToBeProcessed::remove);
    }

    private boolean isStillToBeProcessed(String tagName, LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed) {
        return elementsToBeProcessed.stream().anyMatch((elt) -> elt.getTagName().equals(tagName));
    }

    private boolean isStillToBeProcessed(String id, String tagName, LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed) {
        if (!elementsToBeProcessed.stream().anyMatch((elt) -> elt.getId().equals(id) && elt.getTagName().equals(tagName))) {
            return elementsToBeProcessed.stream().anyMatch((elt) -> removesPrefixFromElementId(elt.getId()).equals(id) && elt.getTagName().equals(tagName));
        } else {
            return true;
        }
    }

    private boolean contains(Node reallyImpactedNode, LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed) {
        return elementsToBeProcessed.stream().anyMatch((elt) -> elt.getId().equals(getId(reallyImpactedNode)));
    }

    private List<ElementToBeProcessed> extractElementsToBeProcessedByActionType(ActionType type, LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed) {
        return elementsToBeProcessed.stream().filter((elt) -> elt.getActionType().equals(type)).collect(Collectors.toList());
    }

    private LinkedHashSet<ElementToBeProcessed> populateElementsToBeProcessed(byte[] xmlContent,
                                                                              Node contributionNode,
                                                                              String elementId,
                                                                              List<TocItem> tocItemsList,
                                                                              List<MergeActionVO> currentMergeActions) {
        LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed = new LinkedHashSet<>();
        NodeList addedElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_ACTION_ATTR + " = '" + LEOS_TC_INSERT_ACTION + "']");
        for (int i = 0; i < addedElts.getLength(); i++) {
            Node elt = addedElts.item(i);
            Node reallyImpactedElement = checkIfIsInTable(elt, xmlContent);
            if (!isAlreadyProcessed(reallyImpactedElement, contributionNode)
                    && !hasParentInAnotherAction(contributionNode, reallyImpactedElement, currentMergeActions)
                    && !isUnselected(contributionNode, reallyImpactedElement, currentMergeActions)
                    && !reallyImpactedElement.getNodeName().equals(NUM)
                    && !XercesUtils.hasAttribute(reallyImpactedElement, LEOS_SOFT_MOVE_FROM)) {
                if (contains(reallyImpactedElement, elementsToBeProcessed)) {
                    elementsToBeProcessed.add(new ElementToBeProcessed(getId(elt), elt.getNodeName(), elt,
                            elt, ActionType.ADD));
                } else {
                    elementsToBeProcessed.add(new ElementToBeProcessed(getId(reallyImpactedElement), reallyImpactedElement.getNodeName(), elt,
                            reallyImpactedElement, ActionType.ADD));
                }
            }
        }

        NodeList deletedElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_ACTION_ATTR + " = '" + LEOS_TC_DELETE_ACTION + "']");
        for (int i = 0; i < deletedElts.getLength(); i++) {
            Node elt = deletedElts.item(i);
            Node reallyImpactedElement = checkIfIsInTable(elt);
            if (!isAlreadyProcessed(reallyImpactedElement, contributionNode)
                    && !hasParentInAnotherAction(contributionNode, reallyImpactedElement, currentMergeActions)
                    && !isUnselected(contributionNode, reallyImpactedElement, currentMergeActions)
                    && !reallyImpactedElement.getNodeName().equals(NUM)
                    && !XercesUtils.hasAttribute(reallyImpactedElement, LEOS_SOFT_MOVE_TO)) {
                if (contains(reallyImpactedElement, elementsToBeProcessed)) {
                    elementsToBeProcessed.add(new ElementToBeProcessed(getId(elt), elt.getNodeName(), elt,
                            elt, ActionType.DELETE));
                } else {
                    elementsToBeProcessed.add(new ElementToBeProcessed(getId(reallyImpactedElement), reallyImpactedElement.getNodeName(), elt,
                            reallyImpactedElement, ActionType.DELETE));
                }
            }
        }

        NodeList insertedElements = XercesUtils.getElementsByName(contributionNode, LEOS_TC_INSERT_ELEMENT_NAME);
        List<Node> list = filterInsertedAndDeletedNodes(insertedElements);
        for (Node elt : list) {
            if (!elt.getParentNode().getNodeName().equals(NUM)) {
                // Checks if "ins" tag is part of table
                Node reallyImpactedElement = handleAddedTextInTableColumn(elt, xmlContent);
                // Checks if "ins" tag is part of entire inserted point, paragraph, ...
                reallyImpactedElement = getRealUpdatedNode(xmlContent, reallyImpactedElement, true, tocItemsList);
                if (!isAlreadyProcessed(reallyImpactedElement, contributionNode)
                        && !hasParentInAnotherAction(contributionNode, reallyImpactedElement, currentMergeActions)
                        && !isUnselected(contributionNode, reallyImpactedElement, currentMergeActions)) {
                    if (contains(reallyImpactedElement, elementsToBeProcessed)) {
                        elementsToBeProcessed.add(new ElementToBeProcessed(getId(elt), elt.getNodeName(), elt,
                                elt, ActionType.INS));
                    } else {
                        elementsToBeProcessed.add(new ElementToBeProcessed(getId(reallyImpactedElement), reallyImpactedElement.getNodeName(), elt,
                                reallyImpactedElement, ActionType.INS));
                    }
                }
            }
        }

        NodeList deletedElements = XercesUtils.getElementsByName(contributionNode, LEOS_TC_DELETE_ELEMENT_NAME);
        list = filterInsertedAndDeletedNodes(deletedElements);
        for (Node elt : list) {
            if (!elt.getParentNode().getNodeName().equals(NUM)) {
                Node reallyImpactedElement = getRealUpdatedNode(xmlContent, elt, false, tocItemsList);
                if (!isAlreadyProcessed(reallyImpactedElement, contributionNode)
                        && !isUnselected(contributionNode, reallyImpactedElement, currentMergeActions)
                        && !hasParentInAnotherAction(contributionNode,
                        reallyImpactedElement, currentMergeActions)) {
                    if (contains(reallyImpactedElement, elementsToBeProcessed)) {
                        elementsToBeProcessed.add(new ElementToBeProcessed(getId(elt), elt.getNodeName(), elt,
                                elt, ActionType.DEL));
                    } else {
                        elementsToBeProcessed.add(new ElementToBeProcessed(getId(reallyImpactedElement), reallyImpactedElement.getNodeName(), elt,
                                reallyImpactedElement, ActionType.DEL));
                    }
                }
            }
        }

        NodeList moveFromElts = XercesUtils.getElementsByXPath(contributionNode, "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_SOFT_ACTION_ATTR + " = " +
                "'" + SoftActionType.MOVE_FROM.getSoftAction() + "']");
        List<Node> movedList = sortMovedElements(moveFromElts);
        for (Node elt : movedList) {
            if (!isAlreadyProcessed(elt, contributionNode) && !isUnselected(contributionNode, elt, currentMergeActions)
                    && !hasParentInAnotherAction(contributionNode, elt, currentMergeActions)) {
                elementsToBeProcessed.add(new ElementToBeProcessed(getId(elt), elt.getNodeName(), elt, elt,
                        ActionType.MOVE_FROM));
            }
        }

        NodeList moveToElts = XercesUtils.getElementsByXPath(contributionNode, "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_SOFT_ACTION_ATTR + " =" +
                " '" + SoftActionType.MOVE_TO.getSoftAction() + "']");
        movedList = sortMovedElements(moveToElts);
        for (Node elt : movedList) {
            if (!isAlreadyProcessed(elt, contributionNode) && !isUnselected(contributionNode, elt, currentMergeActions)
                    && !hasParentInAnotherAction(contributionNode, elt, currentMergeActions)) {
                elementsToBeProcessed.add(new ElementToBeProcessed(getId(elt), elt.getNodeName(), elt, elt,
                        ActionType.MOVE_TO));
            }
        }

        NodeList indentedElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_INDENT_ORIGIN_TYPE_ATTR + "]");
        for (int i = 0; i < indentedElts.getLength(); i++) {
            Node elt = indentedElts.item(i);
            if (!isAlreadyProcessed(elt, contributionNode)
                    && !isUnselected(contributionNode, elt, currentMergeActions)
                    && !hasParentInAnotherAction(contributionNode, elt, currentMergeActions)
                    && !isStillToBeProcessed(getId(elt), elt.getNodeName(), elementsToBeProcessed)) {
                elementsToBeProcessed.add(new ElementToBeProcessed(getId(elt), elt.getNodeName(), elt, elt,
                        ActionType.INDENT));
            }
        }

        NodeList updatedNumberingElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//" + ARTICLE);
        for (int i = 0; i < updatedNumberingElts.getLength(); i++) {
            Node elt = updatedNumberingElts.item(i);

            if (isNumberChangedArticle(elt))  {
                elementsToBeProcessed.add(new ElementToBeProcessed(getId(elt), elt.getNodeName(), elt, elt,
                        ActionType.NUMBER));
            }
        }
        return elementsToBeProcessed;
    }

    private boolean isCurrentlyIndented(@NotNull Node node, Node originalParent) {
        Node num = getFirstChild(node, NUM);
        Node contributionParent = node.getParentNode();
        if (contributionParent.getNodeName().equals(LIST)) {
            contributionParent = contributionParent.getParentNode();
        }
        if (originalParent != null && originalParent.getNodeName().equals(LIST)) {
            originalParent = originalParent.getParentNode();
        }
        if (originalParent != null && !getId(originalParent).replaceAll(SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX, "")
                .equals(getId(contributionParent).replaceAll(SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX, ""))) {
            return true;
        }
        String originNum = getAttributeValue(node, LEOS_INDENT_ORIGIN_NUM_ATTR);
        String originTag = getAttributeValue(node, LEOS_INDENT_ORIGIN_TYPE_ATTR);
        if (originTag != null && !originTag.equalsIgnoreCase(node.getNodeName())) {
            return true;
        } else if (num == null && originNum != null && !originNum.equals("UNNUMBERED")) {
            return true;
        } else if (num != null && originNum != null) {
            cleanTrackChangesForElement(num);
            String numValue = num.getTextContent();
            return !numValue.equals(originNum);
        }
        return false;
    }
    
    private boolean isNumberChangedArticle(Node article) {
        if (article.getNodeName().equals(ARTICLE)) {
            NodeList nbParagraphs = XercesUtils.getElementsByXPath(article,
                    "//*[@" + XMLID + " = '" + getId(article) + "']//" + PARAGRAPH);
            NodeList nbtoUnbParagraphs = XercesUtils.getElementsByXPath(article,
                    "//*[@" + XMLID + " = '" + getId(article) + "']//" + PARAGRAPH + "[@"+ LEOS_ACTION_NUMBER + " = '" + LEOS_TC_DELETE_ACTION + "']");
            NodeList unbtoNbParagraphs = XercesUtils.getElementsByXPath(article,
                    "//*[@" + XMLID + " = '" + getId(article) + "']//" + PARAGRAPH + "[@"+ LEOS_ACTION_NUMBER + " = '" + LEOS_TC_INSERT_ACTION + "']");

            return (nbParagraphs.getLength() == nbtoUnbParagraphs.getLength() || nbParagraphs.getLength() == unbtoNbParagraphs.getLength());
        }
        return false;
    }

    // For each action (add, delete, content update), merge contribution's content to original document
    private byte[] mergeTrackChangesFromContribution(ContributionVO contribution,
                                                     byte[] xmlContent,
                                                     String elementId,
                                                     ElementState elementState,
                                                     boolean withTrackChanges,
                                                     List<String> impactedElements,
                                                     AtomicBoolean mergingCompletelySuccessfull,
                                                     List<TocItem> tocItemsList,
                                                     List<MergeActionVO> currentMergeActions) {
        elementId = removesMovedPrefixFromElementId(elementId);
        Node contributionNode = XercesUtils.getElementById(contribution.getXmlContent(), elementId);
        if (contributionNode == null) {
            return xmlContent;
        }
        LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed = populateElementsToBeProcessed(xmlContent, contributionNode, elementId,
                tocItemsList, currentMergeActions);

        byte[] newFragment = XercesUtils.nodeToByteArray(contributionNode);
        Document destDocument = createXercesDocument(xmlContent);
        Node elementInDestDocument = getElementById(xmlContent, elementId);

        int countNonEmptyTextNodes = countNonEmptyTextNodesInAllDescendants(contributionNode);
        boolean elementToBeAdded =
                (ADD.equals(elementState) || (ElementState.CONTENT_CHANGE.equals(elementState) && countNonEmptyTextNodes == 0 && elementInDestDocument == null));

        // If an element is added, first add new content in the document and clean all track changes
        if (elementToBeAdded) {
            if (elementInDestDocument != null) {
                elementState = ElementState.CONTENT_CHANGE;
            }
            Node newNodeFromContribution = createNodeFromXmlFragment(destDocument, newFragment);
            // Undo all track changes inside new content
            undoAllTrackChangesForElement(newNodeFromContribution, true);
            resolveTrackChangesInEntireNode(newNodeFromContribution, tocItemsList);
            xmlContent = mergeInsertedEltInXml(xmlContent, contributionNode, nodeToString(newNodeFromContribution),
                    elementId, false, false, false, tocItemsList, mergingCompletelySuccessfull);
        }

        String cleanedElementId = removesPrefixFromElementId(elementId);

        if (hasAttribute(contributionNode, LEOS_INDENT_ORIGIN_TYPE_ATTR) && !elementToBeAdded) {
            xmlContent = doIndent(xmlContent, elementId, contributionNode, withTrackChanges, elementsToBeProcessed, impactedElements, tocItemsList, mergingCompletelySuccessfull);
        }

        // Merges changes in main element
        xmlContent = mergeTrackChangesFromContributionNode(
                xmlContent,
                contributionNode,
                withTrackChanges,
                elementToBeAdded,
                elementsToBeProcessed,
                impactedElements,
                mergingCompletelySuccessfull,
                tocItemsList,
                currentMergeActions
        );

        Node originalUpdatedNode = XercesUtils.getElementById(xmlContent, cleanedElementId);
        String refIdForNumbering;
        if (originalUpdatedNode == null) {
            if (!elementState.equals(ElementState.CONTENT_CHANGE)) {
                mergingCompletelySuccessfull.set(false);
            }
            return xmlContent;
        } else {
            refIdForNumbering = getId(originalUpdatedNode);
            if (DELETE.equals(elementState) && !withTrackChanges) {
                refIdForNumbering = getId(getSiblingForRenumbering(originalUpdatedNode));
            }
        }

        // Processes main element
        if (DELETE.equals(elementState)) {
            xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(contributionNode), cleanedElementId);
            if (!withTrackChanges) {
                xmlContent = xmlContentProcessor.applyDeleteActionOnElement(xmlContent, SOFT_DELETE_PLACEHOLDER_ID_PREFIX + cleanedElementId, true);
            }
            xmlContent = renumberFragment(xmlContent, refIdForNumbering, tocItemsList);
            impactedElements.add(getId(contributionNode));
        } else if (elementToBeAdded) {
            xmlContent = copyTrackChangesAttributes(tocItemsList, xmlContentProcessor, xmlContent, contributionNode, cleanedElementId);
            if (!withTrackChanges) {
                xmlContent = xmlContentProcessor.applyAddActionOnElement(xmlContent, cleanedElementId, true);
                xmlContent = xmlContentProcessor.cleanTrackChanges(xmlContent, cleanedElementId);
            }
            xmlContent = renumberFragment(xmlContent, refIdForNumbering, tocItemsList);
            impactedElements.add(getId(contributionNode));
        } else if (ElementState.MOVE.equals(elementState)) {
            xmlContent = doMoveElement(xmlContent, elementId, contributionNode, withTrackChanges, elementsToBeProcessed,
                    mergingCompletelySuccessfull, impactedElements, tocItemsList);
            impactedElements.add(SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId);
            impactedElements.add(cleanedElementId);
        } else if (ElementState.CONTENT_CHANGE.equals(elementState)) {
            if (withTrackChanges) {
                copyTrackChangesAttributes(tocItemsList, originalUpdatedNode, contributionNode);
            } else {
                resolveTrackChange(originalUpdatedNode, false, tocItemsList);
            }
            xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(originalUpdatedNode), cleanedElementId);
            impactedElements.add(getId(contributionNode));
            xmlContent = renumberFragment(xmlContent,  elementId, tocItemsList);
        }
        if (isNumberChangedArticle(contributionNode)) {
            xmlContent = mergeNumberArticle(xmlContent, contributionNode, withTrackChanges, tocItemsList);
        }
        return xmlContent;
    }

    // Merging tracked elements from inside contribution node
    private byte[] mergeTrackChangesFromContributionNode(byte[] xmlContent,
                                                         Node contributionNode,
                                                         boolean withTrackChanges,
                                                         boolean isToBeAdded,
                                                         LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed,
                                                         List<String> impactedElements,
                                                         AtomicBoolean mergingCompletelySuccessfull,
                                                         List<TocItem> tocItemsList,
                                                         List<MergeActionVO> currentMergeActions) {

        if (!isToBeAdded) {
            // 1. Manages indented elements
            xmlContent = mergeIndentedElementsInContributionNode(
                    xmlContent,
                    withTrackChanges,
                    elementsToBeProcessed,
                    mergingCompletelySuccessfull,
                    impactedElements,
                    tocItemsList
            );
        }

        // 2. Merges added elements from inside contribution node
        xmlContent = mergeInsertedElementsInContributionNode(
                xmlContent,
                contributionNode,
                withTrackChanges,
                elementsToBeProcessed,
                impactedElements,
                tocItemsList,
                mergingCompletelySuccessfull
        );

        // 3. Merges all "ins" from inside contribution node
        xmlContent = mergeInsertedTextFromContributionNode(
                xmlContent,
                withTrackChanges,
                elementsToBeProcessed,
                impactedElements,
                tocItemsList,
                mergingCompletelySuccessfull
        );

        // 4. Merges moved elements from inside contribution node
        xmlContent = mergeMovedElementsInContributionNode(
                xmlContent,
                contributionNode,
                withTrackChanges,
                elementsToBeProcessed,
                mergingCompletelySuccessfull,
                impactedElements,
                tocItemsList,
                currentMergeActions
        );

        // 5. Merges all "del" from inside contribution node
        xmlContent = mergeDeletedTextFromContributionNode(
                xmlContent,
                withTrackChanges,
                elementsToBeProcessed,
                impactedElements,
                tocItemsList,
                mergingCompletelySuccessfull
        );

        // 6. Merges removed elements from inside contribution node
        xmlContent = mergeDeletedElementsInContributionNode(
                xmlContent,
                withTrackChanges,
                elementsToBeProcessed,
                impactedElements,
                tocItemsList,
                mergingCompletelySuccessfull
        );

        // 7. Merges change numbering on articles
        xmlContent = mergeNumberOfArticlesInContributionNode(
                xmlContent,
                withTrackChanges,
                elementsToBeProcessed,
                tocItemsList
        );

        return xmlContent;
    }

    private boolean isAlreadyProcessed(Node node, Node contributionNode) {
        Node ascWithMergeAction = getAscendantWithAttributeExceptValue(node, LEOS_MERGE_ACTION_ATTR, UNSELECT.name());
        return ascWithMergeAction != null &&
                !hasAscendantWithId(contributionNode, getId(ascWithMergeAction));
    }

    private boolean shouldRenumber(@NotNull byte[] xmlContent, @NotNull String id,
                                   LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed,
                                   List<TocItem> tocItemsList) {
        Node node = getElementById(xmlContent, id);
        if (node == null) {
            node = getElementById(xmlContent, removesPrefixFromElementId(id));
        }
        if (node == null) {
            return false;
        }
        Node parentNode = node.getParentNode();
        String tagName = node.getNodeName();
        Node numNode = getFirstChild(node, NUM);
        if (isNumDeleted(numNode)) {
            return false;
        }
        if ((parentNode != null
                && parentNode.getNodeName().equals(LIST))) {
            List<Node> children = getChildren(parentNode, tagName);
            for (Node child : children) {
                if (isStillToBeProcessed(getId(child), child.getNodeName(), elementsToBeProcessed)) {
                    return false;
                }
            }
        } else if (isAutoNumbering(node, numNode, tocItemsList)) {
            return !isStillToBeProcessed(tagName, elementsToBeProcessed);
        }
        return true;
    }

    private Node handleAddedTextInTableColumn(Node node, byte[] xmlContent) {
        Node tdNode = getFirstAscendant(node, Arrays.asList("td"));
        if (tdNode != null) {
            if (getElementById(xmlContent, getId(tdNode)) == null) {
                return tdNode;
            }
            Node trNode = getFirstAscendant(node, Arrays.asList("tr"));
            if (getElementById(xmlContent, getId(trNode)) == null) {
                return trNode;
            }
        }
        return node;
    }

    List<Node> filterInsertedAndDeletedNodes(NodeList list) {
        List<Node> filteredList = new ArrayList<>();
        for (int i = 0; i < list.getLength(); i++) {
            Node node = list.item(i);
            if (node != null && !node.getParentNode().getNodeName().equals(NUM)) {
                filteredList.add(node);
            }
        }
        return filteredList;
    }

    private byte[] changeArticleToNumber(byte[] xmlContent, List<Node> xmlParagraphs, List<Node> contributionParagraphs, boolean withTrackChanges,
                                         List<TocItem> tocItemsList) {
        for (int i = 0; i < xmlParagraphs.size(); i++) {
            Node xmlParagraph = xmlParagraphs.get(i);
            Node xmlNum = getFirstChild(xmlParagraph);
            Optional<Node> contributionParagraph =
                    contributionParagraphs.stream().filter((p) -> getId(p).equals(getId(xmlParagraph))).findAny();
            if (contributionParagraph.isPresent()) {
                if (withTrackChanges) {
                    xmlContent = copyTrackChangesAttributes(tocItemsList, xmlContentProcessor, xmlContent, contributionParagraph.get(),
                            getId(xmlParagraph));
                    if (!xmlNum.getNodeName().equals(NUM)) {
                        xmlContent = xmlContentProcessor.insertElementByTagNameAndId(xmlContent,
                                nodeToString(getFirstChild(contributionParagraph.get(), NUM)), NUM, getId(xmlNum), true, false);
                    } else {
                        xmlContent = xmlContentProcessor.replaceElementById(xmlContent,
                                nodeToString(getFirstChild(contributionParagraph.get(), NUM)), getId(xmlNum));
                    }
                } else {
                    resolveTrackChange(xmlParagraph, true, tocItemsList);
                    Node contributionNum = getFirstChild(contributionParagraph.get(), NUM);
                    Node newNum = createNodeFromXmlFragment(xmlParagraph.getOwnerDocument(),
                            ("<" + NUM + " " + XMLID + "=\"" + getId(contributionNum) + "\">#</" + NUM + ">").getBytes(StandardCharsets.UTF_8), false);
                    xmlContent = xmlContentProcessor.replaceElementById(xmlContent,
                            nodeToString(xmlParagraph), getId(xmlParagraph));
                    if (!xmlNum.getNodeName().equals(NUM)) {
                        xmlContent = xmlContentProcessor.insertElementByTagNameAndId(xmlContent,
                                nodeToString(newNum), NUM, getId(xmlNum), true, false);
                    } else {
                        xmlContent = xmlContentProcessor.replaceElementById(xmlContent,
                                nodeToString(newNum), getId(xmlNum));
                    }
                }
            } else {
                Node newNum = xmlNum.getNodeName().equals(NUM) ? xmlNum : null;
                if (newNum == null) {
                    newNum = createNodeFromXmlFragment(xmlParagraph.getOwnerDocument(),
                            ("<" + NUM + " " + XMLID + "=\"" + IdGenerator.generateId() + "\">" + String.valueOf(i) + ".</" + NUM + ">").getBytes(StandardCharsets.UTF_8),
                            false);
                }
                if (withTrackChanges) {
                    newNum = createNodeFromXmlFragment(xmlParagraph.getOwnerDocument(),
                            ("<" + NUM + " " + XMLID + "=\"" + IdGenerator.generateId() + "\"></" + NUM + ">").getBytes(StandardCharsets.UTF_8),
                            true);
                    Node insNode = createElementAsLastChildOfNode(newNum.getOwnerDocument(), newNum, "ins", String.valueOf(i) + ".");
                    addAttribute(insNode, LEOS_UID, getAttributeValue(contributionParagraphs.get(0), LEOS_UID_NUMBER));
                    addAttribute(insNode, LEOS_TITLE, getAttributeValue(contributionParagraphs.get(0), LEOS_TITLE_NUMBER));
                    addAttribute(xmlParagraph, LEOS_ACTION_NUMBER, LEOS_TC_INSERT_ACTION);
                    addAttribute(xmlParagraph, LEOS_TC_ORIGINAL_NUMBER, "UNNUMBERED");
                    addAttribute(xmlParagraph, LEOS_SOFT_DATE_ATTR, getAttributeValue(contributionParagraphs.get(0), LEOS_SOFT_DATE_ATTR));
                    addAttribute(xmlParagraph, LEOS_SOFT_USER_ATTR, getAttributeValue(contributionParagraphs.get(0), LEOS_SOFT_USER_ATTR));
                    addAttribute(xmlParagraph, LEOS_TITLE_NUMBER, getAttributeValue(contributionParagraphs.get(0), LEOS_TITLE_NUMBER));
                    addAttribute(xmlParagraph, LEOS_UID_NUMBER, getAttributeValue(contributionParagraphs.get(0), LEOS_UID_NUMBER));
                } else {
                    resolveTrackChange(xmlParagraph, true, tocItemsList);
                }
                xmlContent = xmlContentProcessor.replaceElementById(xmlContent,
                        nodeToString(xmlParagraph), getId(xmlParagraph));
                if (!xmlNum.getNodeName().equals(NUM)) {
                    xmlContent = xmlContentProcessor.insertElementByTagNameAndId(xmlContent,
                            nodeToString(newNum), NUM, getId(xmlNum), true, false);
                } else {
                    xmlContent = xmlContentProcessor.replaceElementById(xmlContent,
                            nodeToString(newNum), getId(xmlNum));
                }
            }
        }
        return xmlContent;
    }

    private byte[] changeArticleToUnnumber(byte[] xmlContent, List<Node> xmlParagraphs, List<Node> contributionParagraphs, boolean withTrackChanges,
                                           List<TocItem> tocItemsList) {
        for (Node xmlParagraph : xmlParagraphs) {
            Node xmlNum = getFirstChild(xmlParagraph);
            if (xmlNum.getNodeName().equals(NUM)) {
                Optional<Node> contributionParagraph =
                        contributionParagraphs.stream().filter((p) -> getId(p).replace(SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX, "").equals(getId(xmlParagraph).replace(SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX, ""))).findAny();
                if (contributionParagraph.isPresent()) {
                    if (withTrackChanges) {
                        xmlContent = copyTrackChangesAttributes(tocItemsList, xmlContentProcessor, xmlContent, contributionParagraph.get(),
                                getId(xmlParagraph));
                        xmlContent = xmlContentProcessor.replaceElementById(xmlContent,
                                nodeToString(getFirstChild(contributionParagraph.get(), NUM)), getId(xmlNum));
                    } else {
                        resolveTrackChange(xmlParagraph, true, tocItemsList);
                        xmlContent = xmlContentProcessor.replaceElementById(xmlContent,
                                nodeToString(xmlParagraph), getId(xmlParagraph));
                        xmlContent = xmlContentProcessor.removeElementById(xmlContent,
                                getId(xmlNum), false);
                    }
                } else {
                    Node newNum = xmlNum.getNodeName().equals(NUM) ? xmlNum : null;
                    if (newNum == null) {
                        newNum = createNodeFromXmlFragment(xmlParagraph.getOwnerDocument(),
                                ("<" + NUM + " " + XMLID + "=\"" + IdGenerator.generateId() + "\">" + getContentNodeAsXmlFragment(xmlNum) +
                                        "</" + NUM + ">").getBytes(StandardCharsets.UTF_8), false);
                    }
                    if (withTrackChanges) {
                        String currentNum = newNum.getTextContent();
                        removeChildren(newNum);
                        Node delNode = createElementAsLastChildOfNode(newNum.getOwnerDocument(), newNum, "del", currentNum);
                        addAttribute(delNode, LEOS_UID, getAttributeValue(contributionParagraphs.get(0), LEOS_UID_NUMBER));
                        addAttribute(delNode, LEOS_TITLE, getAttributeValue(contributionParagraphs.get(0), LEOS_TITLE_NUMBER));
                        addAttribute(delNode, LEOS_ACTION_NUMBER, LEOS_TC_DELETE_ACTION);
                        addAttribute(xmlParagraph, LEOS_ACTION_NUMBER, LEOS_TC_DELETE_ACTION);
                        addAttribute(xmlParagraph, LEOS_SOFT_DATE_ATTR, getAttributeValue(contributionParagraphs.get(0), LEOS_SOFT_DATE_ATTR));
                        addAttribute(xmlParagraph, LEOS_SOFT_USER_ATTR, getAttributeValue(contributionParagraphs.get(0), LEOS_SOFT_USER_ATTR));
                        addAttribute(xmlParagraph, LEOS_TITLE_NUMBER, getAttributeValue(contributionParagraphs.get(0), LEOS_TITLE_NUMBER));
                        addAttribute(xmlParagraph, LEOS_UID_NUMBER, getAttributeValue(contributionParagraphs.get(0), LEOS_UID_NUMBER));
                    } else {
                        resolveTrackChange(xmlParagraph, true, tocItemsList);
                    }
                    xmlContent = xmlContentProcessor.replaceElementById(xmlContent,
                            nodeToString(xmlParagraph), getId(xmlParagraph));
                    if (withTrackChanges) {
                        xmlContent = xmlContentProcessor.replaceElementById(xmlContent,
                                nodeToString(newNum), getId(xmlNum));
                    } else {
                        xmlContent = xmlContentProcessor.removeElementById(xmlContent,
                                getId(xmlNum), false);
                    }
                }
            }
        }
        return xmlContent;
    }

    // Merges change of numbering (unnumber to number) in an article
    private byte[] mergeNumberArticle(byte[] xmlContent,
                                      Node article,
                                      boolean withTrackChanges,
                                      List<TocItem> tocItemsList
    ) {
        List<Node> contributionParagraphs = getChildren(article, PARAGRAPH);
        Node articleInXml = getElementById(xmlContent, getId(article));
        if (articleInXml != null) {
            List<Node> xmlParagraphs = getChildren(articleInXml, PARAGRAPH);
            if (contributionParagraphs.size() > 0 && xmlParagraphs.size() > 0) {
                String action = getAttributeValue(contributionParagraphs.get(0), LEOS_ACTION_NUMBER);
                if (action != null && action.equals(LEOS_TC_INSERT_ACTION)) {
                    xmlContent = changeArticleToNumber(xmlContent, xmlParagraphs, contributionParagraphs, withTrackChanges, tocItemsList);
                    xmlContent = renumberFragment(xmlContent, getId(article), tocItemsList);
                } else if (action != null && action.equals(LEOS_TC_DELETE_ACTION)) {
                    xmlContent = changeArticleToUnnumber(xmlContent, xmlParagraphs, contributionParagraphs, withTrackChanges, tocItemsList);
                    xmlContent = renumberFragment(xmlContent, getId(article), tocItemsList);
                }
            }
        }
        return xmlContent;
    }

    // Undo change of numbering (unnumber to number) in an article
    private byte[] undoNumberArticle(byte[] xmlContent,
                                      Node article,
                                     List<TocItem> tocItemsList
    ) {
        List<Node> contributionParagraphs = getChildren(article, PARAGRAPH);
        Node articleInXml = getElementById(xmlContent, getId(article));
        if (articleInXml != null) {
            List<Node> xmlParagraphs = getChildren(articleInXml, PARAGRAPH);
            if (contributionParagraphs.size() > 0 && xmlParagraphs.size() > 0) {
                String action = getAttributeValue(contributionParagraphs.get(0), LEOS_ACTION_NUMBER);
                if (action != null && action.equals(LEOS_TC_DELETE_ACTION)) {
                    xmlContent = changeArticleToNumber(xmlContent, xmlParagraphs, contributionParagraphs, false, tocItemsList);
                    xmlContent = renumberFragment(xmlContent, getId(article), tocItemsList);
                } else if (action != null && action.equals(LEOS_TC_INSERT_ACTION)) {
                    xmlContent = changeArticleToUnnumber(xmlContent, xmlParagraphs, contributionParagraphs, false, tocItemsList);
                    xmlContent = renumberFragment(xmlContent, getId(article), tocItemsList);
                }
            }
        }
        return xmlContent;
    }

    // Merges change of numbering (unnumber to number) in articles
    private byte[] mergeNumberOfArticlesInContributionNode(byte[] xmlContent,
                                                            boolean withTrackChanges,
                                                            LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed,
                                                            List<TocItem> tocItemsList
    ) {
        List<ElementToBeProcessed> articleList = extractElementsToBeProcessedByActionType(ActionType.NUMBER, elementsToBeProcessed);
        for (ElementToBeProcessed articleElement : articleList) {
            elementsToBeProcessed.remove(articleElement);
            xmlContent = mergeNumberArticle(xmlContent, articleElement.getNode(), withTrackChanges, tocItemsList);
        }
        return xmlContent;
    }

    // Undo change of numbering (unnumber to number) in articles
    private byte[] undoNumberOfArticlesInContributionNode(byte[] xmlContent, Node contributionNode, String elementId,
                                                          List<TocItem> tocItemsList) {
        NodeList updatedNumberingElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//" + ARTICLE);
        for (int i = 0; i < updatedNumberingElts.getLength(); i++) {
            Node elt = updatedNumberingElts.item(i);

            if (isNumberChangedArticle(elt))  {
                xmlContent = undoNumberArticle(xmlContent, elt, tocItemsList);
            }
        }
        return xmlContent;
    }

    // Merges all "ins" tag from inside contribution node
    private byte[] mergeInsertedTextFromContributionNode(byte[] xmlContent,
                                                         boolean withTrackChanges,
                                                         LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed,
                                                         List<String> impactedElements,
                                                         List<TocItem> tocItemsList,
                                                         AtomicBoolean mergingCompletelySuccessfull
    ) {
        List<ElementToBeProcessed> insertList = extractElementsToBeProcessedByActionType(ActionType.INS, elementsToBeProcessed);
        for (ElementToBeProcessed insertedElement : insertList) {
            elementsToBeProcessed.remove(insertedElement);
            if (impactedElements.contains(insertedElement.getId())) {
                continue;
            }

            // Adding element in xml content
            if (insertedElement.getTagName().equals(LEOS_TC_INSERT_ELEMENT_NAME)) {
                xmlContent = mergeInsertedOrDeletedText(xmlContent, insertedElement.getNode(), withTrackChanges, true, mergingCompletelySuccessfull);
                impactedElements.add(insertedElement.getId());
            } else {
                Node tmp = insertedElement.getReallyImpactedNode();
                Node refParent = insertedElement.getReallyImpactedNode().getParentNode();
                Node nodeParentInXmlContent;
                if (refParent != null && getId(refParent) != null) {
                    nodeParentInXmlContent = getElementById(xmlContent, getId(refParent));
                    while (refParent != null && getId(refParent) != null && nodeParentInXmlContent == null) {
                        tmp = refParent;
                        refParent = refParent.getParentNode();
                        nodeParentInXmlContent = (refParent != null && getId(refParent) != null) ? getElementById(xmlContent, getId(refParent)) : null;
                    }
                    insertedElement.setReallyImpactedNode(tmp);
                    insertedElement.setId(getId(tmp));
                    insertedElement.setTagName(tmp.getNodeName());
                }
                // If that's a list, we must check intro and conclusion, to not add sth already present
                // this method removes intro and conclusion from document content
                xmlContent = handleIntroAndConclusionForList(xmlContent, insertedElement.getReallyImpactedNode(), insertedElement.getNode());

                if (!withTrackChanges) {
                    replaceElement(insertedElement.getNode(), getContentNodeAsXmlFragment(insertedElement.getNode()));
                }
                Node newElement = createNodeFromXmlFragment(insertedElement.getNode().getOwnerDocument(), nodeToByteArray(insertedElement.getReallyImpactedNode()), false);
                checkNum(newElement, null, ADD, withTrackChanges, false, tocItemsList);
                if (!withTrackChanges) {
                    resolveTrackChangesInEntireNode(newElement, tocItemsList);
                }
                xmlContent = mergeInsertedEltInXml(xmlContent, insertedElement.getReallyImpactedNode(), nodeToString(newElement), insertedElement.getId(),
                        withTrackChanges, false, false, tocItemsList, mergingCompletelySuccessfull);
                if (shouldRenumber(xmlContent, insertedElement.getId(), elementsToBeProcessed, tocItemsList)) {
                    xmlContent = renumberFragment(xmlContent, insertedElement.getId(), tocItemsList);
                }
                impactedElements.add(insertedElement.getId());
            }
        }
        return xmlContent;
    }

    // Merges all "del" tag from inside contribution node
    private byte[] mergeDeletedTextFromContributionNode(byte[] xmlContent,
                                                        boolean withTrackChanges,
                                                        LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed,
                                                        List<String> impactedElements,
                                                        List<TocItem> tocItemsList,
                                                        AtomicBoolean mergingCompletelySuccessfull
    ) {
        List<ElementToBeProcessed> delList = extractElementsToBeProcessedByActionType(ActionType.DEL, elementsToBeProcessed);
        for (ElementToBeProcessed deletedElement : delList) {
            elementsToBeProcessed.remove(deletedElement);
            if (impactedElements.contains(deletedElement.getId())) {
                continue;
            }
            if (deletedElement.getTagName().equals(LEOS_TC_DELETE_ELEMENT_NAME)) {
                xmlContent = mergeInsertedOrDeletedText(xmlContent, deletedElement.getReallyImpactedNode(), withTrackChanges, false, mergingCompletelySuccessfull);
                impactedElements.add(deletedElement.getId());
            } else {
                Node originalNodeToBeRemoved = XercesUtils.getElementById(xmlContent, deletedElement.getId());
                if (originalNodeToBeRemoved != null) {
                    Node originalNodeParent = originalNodeToBeRemoved.getParentNode();
                    checkNum(deletedElement.getReallyImpactedNode(), originalNodeToBeRemoved, DELETE,
                            withTrackChanges, false, tocItemsList);
                    if (withTrackChanges) {
                        xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(deletedElement.getReallyImpactedNode()), getId(originalNodeToBeRemoved));
                        if (shouldRenumber(xmlContent, deletedElement.getId(), elementsToBeProcessed, tocItemsList)) {
                            xmlContent = renumberFragment(xmlContent, deletedElement.getId(), tocItemsList);
                        }
                    } else {
                        Node sibling = getSiblingForRenumbering(originalNodeToBeRemoved);
                        xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(originalNodeToBeRemoved), false);
                        xmlContent = manageOnElementDeletion(xmlContent, getId(originalNodeParent), deletedElement);
                        xmlContent = renumberFragment(xmlContent, getId(sibling), tocItemsList);
                    }
                    impactedElements.add(deletedElement.getId());
                } else {
                    mergingCompletelySuccessfull.set(false);
                }
            }
        }
        return xmlContent;
    }

    private void addMovedPrefixInAllSubElements(Node moveToElt) {
        NodeList nodesWithId = XercesUtils.getElementsByXPath(moveToElt, "//*[@" + XMLID + " = '" + getId(moveToElt) + "']//*[@" + XMLID + "]");
        for (int i = 0; i < nodesWithId.getLength(); i++) {
            Node node = nodesWithId.item(i);
            String id = getId(node);
            if (!id.startsWith(SOFT_MOVE_PLACEHOLDER_ID_PREFIX)) {
                setId(node, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + id);
            }
        }
    }

    private byte[] doMoveElement(byte[] xmlContent,
                                 String idWithoutMovedPrefix,
                                 Node contributionNode,
                                 boolean withTrackChanges,
                                 LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed,
                                 AtomicBoolean mergingCompletelySuccessfull,
                                 List<String> impactedElements,
                                 List<TocItem> tocItemsList) {
        Node moveFromElt = XercesUtils.getElementById(contributionNode, idWithoutMovedPrefix);
        Node elementInOriginalContent = XercesUtils.getElementById(xmlContent, idWithoutMovedPrefix);
        if (elementInOriginalContent != null) {
            Node movedElementInOriginalContent = XercesUtils.getElementById(xmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + idWithoutMovedPrefix);
            Node moveToElt = XercesUtils.getElementById(contributionNode, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + idWithoutMovedPrefix);

            byte[] backupXmlContent = Arrays.copyOf(xmlContent, xmlContent.length);
            boolean backupMergingCompletelySuccessfull = mergingCompletelySuccessfull.get();
            mergingCompletelySuccessfull.set(true);
            if (withTrackChanges && movedElementInOriginalContent == null) {
                checkNum(moveToElt, elementInOriginalContent, DELETE, withTrackChanges, true, tocItemsList);
                addMovedPrefixInAllSubElements(moveToElt);
                xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(moveToElt), idWithoutMovedPrefix);
                if (shouldRenumber(xmlContent, getId(moveToElt), elementsToBeProcessed, tocItemsList)) {
                    xmlContent = renumberFragment(xmlContent, getId(moveToElt), tocItemsList);
                }
            } else if (!withTrackChanges && movedElementInOriginalContent != null) {
                Node sibOfMovedElementInOriginalContent = getSiblingForRenumbering(movedElementInOriginalContent);
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + idWithoutMovedPrefix, false);
                xmlContent = manageOnElementDeletion(xmlContent, getId(movedElementInOriginalContent.getParentNode()), null);
                xmlContent = renumberFragment(xmlContent, getId(sibOfMovedElementInOriginalContent), tocItemsList);
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, idWithoutMovedPrefix, false);
                xmlContent = manageOnElementDeletion(xmlContent, getId(elementInOriginalContent.getParentNode()), null);
            } else {
                Node sibling = getSiblingForRenumbering(elementInOriginalContent);
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, idWithoutMovedPrefix, false);
                xmlContent = manageOnElementDeletion(xmlContent, getId(elementInOriginalContent.getParentNode()), null);
                if (shouldRenumber(xmlContent, getId(sibling), elementsToBeProcessed, tocItemsList)) {
                    xmlContent = renumberFragment(xmlContent, getId(sibling), tocItemsList);
                }
            }
            // Take care to add the moved element (moved_from) inside of the impacted element
            if (!withTrackChanges) {
                removeTrackChangesAttributes(moveFromElt, true);
            } else {
                copyTrackChangesAttributes(tocItemsList, elementInOriginalContent, moveFromElt);
            }

            checkNum(elementInOriginalContent, null, ADD, withTrackChanges, true, tocItemsList);
            xmlContent = mergeInsertedEltInXml(xmlContent, moveFromElt, nodeToString(elementInOriginalContent),
                    idWithoutMovedPrefix, withTrackChanges, false
                    , false, tocItemsList, mergingCompletelySuccessfull);
            if (!mergingCompletelySuccessfull.get()) {
                xmlContent = backupXmlContent;
            }
           mergingCompletelySuccessfull.set(backupMergingCompletelySuccessfull);
            if (shouldRenumber(xmlContent, getId(elementInOriginalContent), elementsToBeProcessed, tocItemsList)) {
                xmlContent = renumberFragment(xmlContent, getId(elementInOriginalContent), tocItemsList);
            }
            impactedElements.add(idWithoutMovedPrefix);
            impactedElements.add(SOFT_MOVE_PLACEHOLDER_ID_PREFIX + idWithoutMovedPrefix);
        }
        return xmlContent;
    }

    // Manage moved tracked elements inside contribution node and remove or add related elements outside node in original content with or without track changes
    private byte[] mergeMovedElementsInContributionNode(byte[] xmlContent,
                                                        Node contributionNode,
                                                        boolean withTrackChanges,
                                                        LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed,
                                                        AtomicBoolean mergingCompletelySuccessfull,
                                                        List<String> impactedElements,
                                                        List<TocItem> tocItemsList,
                                                        List<MergeActionVO> currentMergeActions) {
        List<ElementToBeProcessed> moveFromElts = extractElementsToBeProcessedByActionType(ActionType.MOVE_FROM, elementsToBeProcessed);

        for (ElementToBeProcessed moveFromElt : moveFromElts) {
            elementsToBeProcessed.remove(moveFromElt);
            if (moveFromElt.getReallyImpactedNode() == null || moveFromElt.getId() == null) {
                continue;
            }
            xmlContent = doMoveElement(xmlContent, moveFromElt.getId(), contributionNode, withTrackChanges, elementsToBeProcessed, mergingCompletelySuccessfull, impactedElements, tocItemsList);
        }

        List<ElementToBeProcessed> moveToElts = extractElementsToBeProcessedByActionType(ActionType.MOVE_TO, elementsToBeProcessed);
        for (ElementToBeProcessed moveToElt : moveToElts) {
            elementsToBeProcessed.remove(moveToElt);
            if (moveToElt.getReallyImpactedNode() == null || moveToElt.getId() == null) {
                continue;
            }
            // Get moved element in original document
            String moveFromId = moveToElt.getId().replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
            if (isMovedElementInAnotherAction(contributionNode, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId, currentMergeActions)) {
                continue;
            }

            xmlContent = doMoveElement(xmlContent, moveFromId, contributionNode, withTrackChanges, elementsToBeProcessed, mergingCompletelySuccessfull,
                    impactedElements, tocItemsList);
        }
        return xmlContent;
    }

    private Node checkIfIsInTable(Node node, byte[] xmlContent) {
        if (node.getNodeName().equals("tr") || node.getNodeName().equals("td")) {
            Node parentNode = node;
            Node previousNode = node;
            while (parentNode != null && getElementById(xmlContent, getId(parentNode)) == null) {
                previousNode = parentNode;
                parentNode = parentNode.getParentNode();
            }
            return previousNode;
        }
        return node;
    }

    private boolean isNumDeleted(Node numNode) {
        if (numNode == null) {
            return true;
        } else {
            List<Node> children = getChildren(numNode);
            List<Node> delChildren = getChildren(numNode, "del");
            return !delChildren.isEmpty() && delChildren.size() == children.size();
        }
    }

    private byte[] alignNum(byte[] xmlContent, Node contributionNode, String id, boolean withTrackChanges, List<TocItem> tocItemsList) {
        Node xmlNode = getElementById(xmlContent, id);
        if (xmlNode == null) {
            return xmlContent;
        }
        Node firstChild = getFirstChild(xmlNode.getParentNode(), Arrays.asList(PARAGRAPH, POINT, CROSSHEADING));
        Node xmlNum = getFirstChild(xmlNode, NUM);
        Node contributionNum = getFirstChild(contributionNode, NUM);
        if (xmlNum == null && !isNumDeleted(contributionNum)) {
            if (!withTrackChanges) {
                cleanTrackChangesForElement(contributionNode);
            }
            Node newNode = createNodeFromXmlFragment(xmlNode.getOwnerDocument(), nodeToByteArray(contributionNum), false);
            if (!getId(firstChild).equals(getId(xmlNode)) && !withTrackChanges) {
                newNode.setTextContent("#");
            }
            xmlNode.insertBefore(newNode, getFirstChild(xmlNode));
            if (withTrackChanges) {
                checkNum(contributionNode, xmlNode, ElementState.ADD, withTrackChanges, true, tocItemsList);
            }
            xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(xmlNode), getId(xmlNode));
        } else if (xmlNum != null && isNumDeleted(contributionNum)) {
            if (!withTrackChanges || contributionNum == null) {
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(xmlNum), false);
            } else {
                xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(contributionNum), getId(xmlNum));
            }
        } else if (xmlNum != null && !withTrackChanges && !getId(firstChild).equals(getId(xmlNode))) {
            xmlNum.setTextContent("#");
            xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(xmlNum), getId(xmlNum));
        }
        return xmlContent;
    }

    private byte[] doIndent(byte[] xmlContent, String id, Node indentedNode, boolean withTrackChanges,
                            LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed,
                            List<String> impactedElements, List<TocItem> tocItemsList, AtomicBoolean mergingCompletelySuccessfull) {
        Node originalIndentedElt = getElementById(xmlContent, id);
        if (originalIndentedElt == null || !isCurrentlyIndented(indentedNode, originalIndentedElt.getParentNode())) {
            return xmlContent;
        }
        String parentId = getId(originalIndentedElt.getParentNode());
        removeFromElementsToBeProcessedById(id, elementsToBeProcessed);
        impactedElements.add(getId(indentedNode));
        if (!withTrackChanges) {
            resolveTrackChange(originalIndentedElt, false, tocItemsList);
        }
        String newFragment = getStartTagNodeAsXmlFragment(originalIndentedElt).replace("<" + originalIndentedElt.getNodeName(),
                "<" + indentedNode.getNodeName());
        newFragment += getContentNodeAsXmlFragment(originalIndentedElt);
        newFragment += getEndTagNodeAsXmlFragment(originalIndentedElt).replace(originalIndentedElt.getNodeName() + ">", indentedNode.getNodeName() + ">");
        xmlContent = xmlContentProcessor.removeElementById(xmlContent, id, false);
        xmlContent = manageOnElementDeletion(xmlContent, parentId, null);
        xmlContent = mergeInsertedEltInXml(xmlContent, indentedNode, newFragment, id, withTrackChanges,
                false, true, tocItemsList, mergingCompletelySuccessfull);
        xmlContent = alignNum(xmlContent, indentedNode, id, withTrackChanges, tocItemsList);
        if (withTrackChanges) {
            xmlContent= copyTrackChangesAttributes(tocItemsList, xmlContentProcessor, xmlContent, indentedNode, id);
        }
        if (shouldRenumber(xmlContent, id, elementsToBeProcessed, tocItemsList)) {
            xmlContent = renumberFragment(xmlContent, id, tocItemsList);
        }
        List<Node> children = getChildren(indentedNode, Arrays.asList(LIST, PARAGRAPH, INDENT, POINT, CROSSHEADING));
        for (Node child : children) {
            if (getElementById(xmlContent, getId(child)) == null) {
                String childFragment = getStartTagNodeAsXmlFragment(child) + getEndTagNodeAsXmlFragment(child);
                xmlContent = xmlContentProcessor.addChildToParent(xmlContent, childFragment, id);
                List<Node> listChildren = getChildren(child);
                for (Node listChild : listChildren) {
                    if (getId(listChild).startsWith(SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX)
                            && listChild.getNodeName().equals(SUBPARAGRAPH)
                            && listChild.getParentNode().getNodeName().equals(LIST)) {
                        Node contentNode = getElementById(xmlContent, getId(getFirstChild(listChild)));
                        if (contentNode != null) {
                            String subparaFragment = getStartTagNodeAsXmlFragment(listChild);
                            subparaFragment += nodeToString(contentNode);
                            subparaFragment += getEndTagNodeAsXmlFragment(listChild);
                            xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(contentNode), false);
                            xmlContent = xmlContentProcessor.addChildToParent(xmlContent, subparaFragment, getId(listChild.getParentNode()));
                        }
                    } else {
                        xmlContent = doIndent(xmlContent, getId(listChild), listChild, withTrackChanges, elementsToBeProcessed, impactedElements,
                                tocItemsList, mergingCompletelySuccessfull);
                    }
                }
            } else {
                // means that child should be moved to new position
                Node xmlNode = getElementById(xmlContent, getId(child));
                Node xmlParent = xmlNode.getParentNode();
                if (isCurrentlyIndented(child, xmlParent)) {
                    if (child.getNodeName().equals(LIST)) {
                        xmlContent = doMoveList(xmlContent, xmlNode, child, tocItemsList, mergingCompletelySuccessfull);
                    } else {
                        xmlContent = doMoveElement(xmlContent, getId(child), child, false, elementsToBeProcessed, mergingCompletelySuccessfull,
                                impactedElements, tocItemsList);
                    }
                }
            }
        }
        return xmlContent;
    }

    private byte[] doMoveList(byte[] xmlContent, Node xmlList, Node contributionList, List<TocItem> tocItemsList, AtomicBoolean mergingCompletelySuccessfull) {
        Node targetParent = contributionList.getParentNode();
        Node xmlTargetParent = getElementById(xmlContent, getId(targetParent));
        if (xmlTargetParent == null) {
            xmlTargetParent = getElementById(xmlContent, getId(targetParent).replaceAll(SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX, ""));
        }
        if (xmlTargetParent != null) {
            xmlContent = moveOutIntroAndConclusionFromList(xmlContent, xmlList);
            xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(xmlList), false);
            xmlContent = mergeInsertedEltInXml(xmlContent, contributionList, nodeToString(xmlList),
                    getId(contributionList), false, true, false, tocItemsList, mergingCompletelySuccessfull);
        }
        return xmlContent;
    }

    // Merges all indented tracked elements from inside contribution node
    private byte[] mergeIndentedElementsInContributionNode(byte[] xmlContent,
                                                           boolean withTrackChanges,
                                                           LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed,
                                                           AtomicBoolean mergingCompletelySuccessfull,
                                                           List<String> impactedElements,
                                                           List<TocItem> tocItemsList) {
        List<ElementToBeProcessed> indentedElts = extractElementsToBeProcessedByActionType(ActionType.INDENT, elementsToBeProcessed);
        for (ElementToBeProcessed indentedElt : indentedElts) {
            if (isStillToBeProcessed(indentedElt.getId(), indentedElt.getTagName(),
                    elementsToBeProcessed)) {
                elementsToBeProcessed.remove(indentedElt);
                xmlContent = doIndent(xmlContent, indentedElt.getId(), indentedElt.getNode(), withTrackChanges, elementsToBeProcessed,
                        impactedElements, tocItemsList, mergingCompletelySuccessfull);
            }
        }
        return xmlContent;
    }

    // Merges all inserted tracked elements from inside contribution node
    private byte[] mergeInsertedElementsInContributionNode(byte[] xmlContent,
                                                           Node contributionNode,
                                                           boolean withTrackChanges,
                                                           LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed,
                                                           List<String> impactedElements,
                                                           List<TocItem> tocItemsList,
                                                           AtomicBoolean mergingCompletelySuccessfull) {
        List<ElementToBeProcessed> addedElts = extractElementsToBeProcessedByActionType(ActionType.ADD, elementsToBeProcessed);
        for (ElementToBeProcessed addedElt : addedElts) {
            elementsToBeProcessed.remove(addedElt);
            Node newElement = createNodeFromXmlFragment(contributionNode.getOwnerDocument(), nodeToByteArray(addedElt.getReallyImpactedNode()), false);
            Node newAddedElement = newElement;
            if (!addedElt.getReallyImpactedNode().equals(addedElt.getNode())) {
                newAddedElement = getElementById(newElement, getId(addedElt.getNode()));
            }
            undoAllTrackChangesForElement(newAddedElement, true);
            checkNum(newAddedElement, null, ADD, withTrackChanges, false, tocItemsList);
            if (!withTrackChanges) {
                resolveTrackChangesInEntireNode(newElement, tocItemsList);
            }
            xmlContent = mergeInsertedEltInXml(xmlContent, addedElt.getNode(), nodeToString(newElement), getId(newElement), withTrackChanges,
                    false, false, tocItemsList, mergingCompletelySuccessfull);
            if (shouldRenumber(xmlContent, addedElt.getId(), elementsToBeProcessed, tocItemsList)) {
                xmlContent = renumberFragment(xmlContent, addedElt.getId(), tocItemsList);
            }
            impactedElements.add(addedElt.getId());
        }
        return xmlContent;
    }

    private boolean isToBeDeleted(Node node) {
        List<Node> children = getChildren(node);
        int nbOfChildren = children.size();
        return nbOfChildren == 1
                || children.stream().filter((child) -> hasAttributeWithValue(child, LEOS_ACTION_ATTR, LEOS_TC_DELETE_ACTION)).count() == nbOfChildren;
    }

    private Node checkIfIsInTable(Node node) {
        if (node.getNodeName().equals("tr") || node.getNodeName().equals("td")) {
            Node prevNode = node;
            Node parentNode = node.getParentNode();
            while (parentNode != null && isToBeDeleted(parentNode)) {
                prevNode = parentNode;
                parentNode = parentNode.getParentNode();
            }
            return prevNode;
        }
        return node;
    }

    // Merges all removed tracked elements from inside contribution node
    private byte[] mergeDeletedElementsInContributionNode(byte[] xmlContent,
                                                          boolean withTrackChanges,
                                                          LinkedHashSet<ElementToBeProcessed> elementsToBeProcessed,
                                                          List<String> impactedElements,
                                                          List<TocItem> tocItemsList,
                                                          AtomicBoolean mergingCompletelySuccessfull) {
        List<ElementToBeProcessed> deletedElements = extractElementsToBeProcessedByActionType(ActionType.DELETE, elementsToBeProcessed);
        for (ElementToBeProcessed deletedElement : deletedElements) {
            elementsToBeProcessed.remove(deletedElement);
            if (impactedElements.contains(deletedElement.getId())) {
                continue;
            }
            String cleanedElementId = removesDeletedPrefixFromElementId(deletedElement.getId());
            Node originalNodeToBeRemoved = getElementById(xmlContent, cleanedElementId);
            if (originalNodeToBeRemoved == null) {
                originalNodeToBeRemoved = getElementById(xmlContent, deletedElement.getId());
            }
            if (originalNodeToBeRemoved != null) {
                checkNum(deletedElement.getReallyImpactedNode(), originalNodeToBeRemoved, DELETE, withTrackChanges, false, tocItemsList);
                if (withTrackChanges) {
                    xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(deletedElement.getReallyImpactedNode()), getId(originalNodeToBeRemoved));
                    if (shouldRenumber(xmlContent, deletedElement.getId(), elementsToBeProcessed, tocItemsList)) {
                        xmlContent = renumberFragment(xmlContent, deletedElement.getId(), tocItemsList);
                    }
                } else {
                    Node sibling = getSiblingForRenumbering(originalNodeToBeRemoved);
                    xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(originalNodeToBeRemoved), false);
                    xmlContent = manageOnElementDeletion(xmlContent, getId(originalNodeToBeRemoved.getParentNode()), deletedElement);
                    xmlContent = renumberFragment(xmlContent, getId(sibling), tocItemsList);
                }
                impactedElements.add(deletedElement.getId());
            } else {
                mergingCompletelySuccessfull.set(false);
            }
        }
        return xmlContent;
    }

    private String optimizeContent(String contentToBeUpdated, String contentToBeFound, boolean next) {
        if (!next) {
            contentToBeFound = contentToBeFound.length() > MAXLENGTHSTR ? contentToBeFound.substring(contentToBeFound.length() - MAXLENGTHSTR - 1) :
                    contentToBeFound;
        } else {
            contentToBeFound = contentToBeFound.length() > MAXLENGTHSTR ? contentToBeFound.substring(0, MAXLENGTHSTR) :
                    contentToBeFound;
        }
        if (contentToBeFound.length() > MINLENGTHSTR && !StringUtils.isBlank(contentToBeFound) && StringUtils.countMatches(contentToBeUpdated,
                contentToBeFound.trim()) == 0) {
            do {
                contentToBeFound = next ? contentToBeFound.substring(0, contentToBeFound.length() - 1) : contentToBeFound.substring(1);
            } while (contentToBeFound.length() >= MINLENGTHSTR && StringUtils.countMatches(contentToBeUpdated, contentToBeFound.trim()) == 0);
        }
        return contentToBeFound;
    }

    private boolean isInlineElement(Node node) {
        List<Node> children = getChildren(node);
        return (children.size() == 1 && children.get(0).getNodeName().equals(INLINE));
    }

    private Node getRelatedNode(Node nodeParent, Node inline) {
        String contentInline = getContentNodeAsXmlFragment(inline);
        List<Node> children = getChildren(nodeParent);
        for (Node child: children) {
            String childContent = getContentNodeAsXmlFragment(child);
            if (childContent.equals(contentInline)) {
                return child;
            }
        }
        return null;
    }

    private boolean handleInlineDeletion(Node nodeParent,
                                         Node nodeToBeAddedOrRemoved,
                                         boolean withTrackChanges, AtomicBoolean mergingCompletelySuccessfull) {
        if (isInlineElement(nodeToBeAddedOrRemoved)) {
            Node inline = getChildren(nodeToBeAddedOrRemoved).get(0);
            Node nodeToBeDeleted = getRelatedNode(nodeParent, inline);
            if (nodeToBeDeleted != null) {
                if (withTrackChanges) {
                    XercesUtils.replaceElement(nodeToBeDeleted, nodeToString(nodeToBeAddedOrRemoved));
                } else {
                    nodeToBeDeleted.getParentNode().removeChild(nodeToBeDeleted);
                }
            } else {
                mergingCompletelySuccessfull.set(false);
            }
            return true;
        } else {
            return false;
        }
    }

    private byte[] mergeInsertedOrDeletedText(
            byte[] xmlContent,
            Node nodeToBeAddedOrRemoved,
            boolean withTrackChanges,
            boolean isIns,
            AtomicBoolean mergingCompletelySuccessfull
    ) {
        Node originalRemovedOrInsertedNode = XercesUtils.getElementById(xmlContent, getId(nodeToBeAddedOrRemoved));
        boolean checkPrevious = true;
        boolean found = false;
        if (originalRemovedOrInsertedNode == null) {
            Node originalUpdatedNode = XercesUtils.getElementById(xmlContent, getId(nodeToBeAddedOrRemoved.getParentNode()));
            Node refOriginalParentNode = null;
            if (originalUpdatedNode != null) {
                refOriginalParentNode = originalUpdatedNode.getParentNode();
                String contentToBeAddedOrRemoved = getContentNodeAsXmlFragment(nodeToBeAddedOrRemoved);

                Node previousNode = getSibling(nodeToBeAddedOrRemoved, true);
                String prevContent = getContent(previousNode);
                Node previousNodeParent = previousNode!=null ? XercesUtils.getElementById(originalUpdatedNode, getId(previousNode.getParentNode())) : null;

                Node nextNode = getSibling(nodeToBeAddedOrRemoved, false);
                String nextContent = getContent(nextNode);
                Node nextNodeParent = nextNode != null ? XercesUtils.getElementById(originalUpdatedNode, getId(nextNode.getParentNode())) : null;

                // Handle inline elements (mathjax, ...)
                if (!isIns
                        && handleInlineDeletion(originalUpdatedNode, nodeToBeAddedOrRemoved, withTrackChanges, mergingCompletelySuccessfull)) {
                    xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(originalUpdatedNode), getId(originalUpdatedNode));
                    return xmlContent;
                }

                // First checks which one is the best: previous or next content
                if (previousNodeParent != null && previousNodeParent.equals(nextNodeParent)) {
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
                            contentToBeAddedOrRemoved = strToBeUpdated.contains(contentToBeAddedOrRemoved) ? contentToBeAddedOrRemoved : contentToBeAddedOrRemoved.trim();
                            XercesUtils.replaceElement(previousNodeParent,
                                    prevContentInOriginalContent + strToBeUpdated.replaceFirst(Pattern.quote(contentToBeAddedOrRemoved),
                                            withTrackChanges ? nodeToString(nodeToBeAddedOrRemoved).replaceAll("\\\\", "\\\\\\\\") : ""));
                            found = true;
                        }
                    } else {
                        NodeList children = previousNodeParent.getChildNodes();
                        for (int i = 0; i < children.getLength(); i++) {
                            Node child = children.item(i);
                            String childContent = getContent(child);
                            if (childContent.contains(prevContent.trim()) && prevContent.length() > 1 && !StringUtils.isBlank(prevContent)) {
                                String toBeReplacedBy = withTrackChanges ? prevContent + nodeToString(nodeToBeAddedOrRemoved) : prevContent + getContentNodeAsXmlFragment(nodeToBeAddedOrRemoved);
                                if (nextContent != null && nextContent.startsWith(" ")) {
                                    toBeReplacedBy += " ";
                                }
                                XercesUtils.replaceElement(child,
                                        nodeToString(child).replaceFirst(!nodeToString(child).contains(prevContent) ?
                                                        Pattern.quote(prevContent.trim()) :
                                                        Pattern.quote(prevContent),
                                                toBeReplacedBy.replaceAll("\\\\", "\\\\\\\\")));
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
                            contentToBeAddedOrRemoved = strToBeUpdated.contains(contentToBeAddedOrRemoved) ? contentToBeAddedOrRemoved : contentToBeAddedOrRemoved.trim();
                            if (withTrackChanges) {
                                XercesUtils.replaceElement(nextNodeParent,
                                        strToBeUpdated.replaceFirst(Pattern.quote(contentToBeAddedOrRemoved),
                                                nodeToString(nodeToBeAddedOrRemoved).replaceAll("\\\\", "\\\\\\\\")) + nextContentInOriginalContent);
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
                            if (childContent.contains(nextContent.trim()) && nextContent.length() > 1 && !StringUtils.isBlank(nextContent)) {
                                String toBeReplacedBy = withTrackChanges ? nodeToString(nodeToBeAddedOrRemoved) + nextContent :
                                        getContentNodeAsXmlFragment(nodeToBeAddedOrRemoved) + nextContent;
                                if (prevContent != null && prevContent.endsWith(" ")) {
                                    toBeReplacedBy = " " + toBeReplacedBy;
                                }
                                XercesUtils.replaceElement(child, nodeToString(child).replaceFirst(!nodeToString(child).contains(nextContent) ?
                                                Pattern.quote(nextContent.trim()) :
                                                Pattern.quote(nextContent),
                                        toBeReplacedBy.replaceAll("\\\\", "\\\\\\\\")));
                                found = true;
                                break;
                            }
                        }
                    }
                }
                if (isIns && !found && nextNodeParent != null && (prevContent == null || StringUtils.isBlank(prevContent)) && StringUtils.isNotBlank(nextContent)) {
                    Node newNode = XercesUtils.createNodeFromXmlFragment(nextNodeParent.getOwnerDocument(),
                            nodeToString(nodeToBeAddedOrRemoved).getBytes(UTF_8));
                    nextNodeParent.insertBefore(newNode, nextNodeParent.getFirstChild());
                    if (!withTrackChanges) {
                        replaceElement(newNode, getContentNodeAsXmlFragment(newNode));
                    }
                    found = true;
                }
                if (isIns && !found && previousNodeParent != null && (nextContent == null || StringUtils.isBlank(nextContent))) {
                    Node newNode = XercesUtils.createNodeFromXmlFragment(previousNodeParent.getOwnerDocument(), nodeToString(nodeToBeAddedOrRemoved).getBytes(UTF_8));
                    previousNodeParent.appendChild(newNode);
                    if (!withTrackChanges) {
                        replaceElement(newNode, getContentNodeAsXmlFragment(newNode));
                    }
                    found = true;
                }
                if (!isIns && !found && nodeToString(nodeToBeAddedOrRemoved).length() > 2 && (previousNodeParent != null || nextNodeParent != null)) {
                    if (withTrackChanges) {
                        XercesUtils.replaceElement(nextNodeParent != null ? nextNodeParent : previousNodeParent,
                                nodeToString(nextNodeParent != null ? nextNodeParent : previousNodeParent).replaceFirst(Pattern.quote(contentToBeAddedOrRemoved),
                                        nodeToString(nodeToBeAddedOrRemoved).replaceAll("\\\\", "\\\\\\\\")));
                    } else {
                        XercesUtils.replaceElement(nextNodeParent != null ? nextNodeParent : previousNodeParent,
                                nodeToString(nextNodeParent != null ? nextNodeParent : previousNodeParent).replaceFirst(Pattern.quote(contentToBeAddedOrRemoved),
                                        ""));
                    }
                    found = true;
                }
                if (refOriginalParentNode != null) {
                    xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(refOriginalParentNode), getId(refOriginalParentNode));
                }
            }
        }
        else if (originalRemovedOrInsertedNode != null && !withTrackChanges) {
            if (isIns) {
                Node refParent = originalRemovedOrInsertedNode.getParentNode();
                replaceElement(originalRemovedOrInsertedNode, getContentNodeAsXmlFragment(originalRemovedOrInsertedNode));
                xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(refParent), getId(refParent));
            } else {
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(originalRemovedOrInsertedNode), false);
            }
            found = true;
        }
        if (!found && originalRemovedOrInsertedNode == null) {
            mergingCompletelySuccessfull.set(found);
        }
        return xmlContent;
    }

    // Undo merging
    private byte[] undoTrackChangesFromContribution(ContributionVO contribution, byte[] xmlContent, String elementId,
                                                    ElementState elementState, List<String> impactedElements,
                                                    AtomicBoolean mergingCompletelySuccessfull,
                                                    List<TocItem> tocItemsList, List<MergeActionVO> currentMergeActions) {
        elementId = removesMovedPrefixFromElementId(elementId);
        Node contributionNode = XercesUtils.getElementById(contribution.getXmlContent(), elementId);
        if (contributionNode == null) {
            return xmlContent;
        }

        byte[] newFragment = XercesUtils.nodeToByteArray(contributionNode);
        Document destDocument = createXercesDocument(xmlContent);
        Node elementInDestDocument = getElementById(xmlContent, elementId);
        Boolean elementToBeAdded = (DELETE.equals(elementState));

        // If an element is added, first add new content in the document and clean all track changes
        if (elementToBeAdded) {
            Node newNodeFromContribution = createNodeFromXmlFragment(destDocument, newFragment);
            // Undo all track changes inside new content
            resolveTrackChange(newNodeFromContribution, true, tocItemsList);
            if (elementInDestDocument != null && elementId.startsWith(SOFT_DELETE_PLACEHOLDER_ID_PREFIX)) {
                String parentId = getId(elementInDestDocument.getParentNode());
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, elementId, false);
                xmlContent = manageOnElementDeletion(xmlContent, parentId, null);
            }
            xmlContent = mergeInsertedEltInXml(xmlContent, contributionNode, nodeToString(newNodeFromContribution),
                    elementId, false, false, false,
                    tocItemsList, mergingCompletelySuccessfull);
        }

        String cleanedElementId = removesPrefixFromElementId(elementId);

        // Undo merging from inside main element
        xmlContent = undoTrackChangesInContributionNode(
                xmlContent,
                cleanedElementId,
                contributionNode, impactedElements, tocItemsList, mergingCompletelySuccessfull, currentMergeActions);

        Node originalUpdatedNode = XercesUtils.getElementById(xmlContent, cleanedElementId);
        String refIdForNumbering;
        if (originalUpdatedNode == null) {
            if (!elementState.equals(ElementState.CONTENT_CHANGE)) {
                mergingCompletelySuccessfull.set(false);
            }
            return xmlContent;
        } else {
            refIdForNumbering = getId(originalUpdatedNode);
            if (ADD.equals(elementState)) {
                refIdForNumbering = getId(getSiblingForRenumbering(originalUpdatedNode));
            }
        }

        // Processes main element
        if (ADD.equals(elementState)) {
            xmlContent = xmlContentProcessor.removeElementById(xmlContent, SOFT_DELETE_PLACEHOLDER_ID_PREFIX + cleanedElementId, false);
            xmlContent = xmlContentProcessor.removeElementById(xmlContent, cleanedElementId, false);
            xmlContent = manageOnElementDeletion(xmlContent, getId(originalUpdatedNode.getParentNode()), null);
            xmlContent = renumberFragment(xmlContent, refIdForNumbering, tocItemsList);
            impactedElements.add(getId(contributionNode));
        } else if (elementToBeAdded) {
            resolveTrackChangesInEntireNode(originalUpdatedNode, tocItemsList);
            xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(originalUpdatedNode), getId(originalUpdatedNode));
            xmlContent = renumberFragment(xmlContent,  removesPrefixFromElementId(refIdForNumbering), tocItemsList);
            impactedElements.add(getId(contributionNode));
        } else if (ElementState.MOVE.equals(elementState)) {
            xmlContent = undoMoveElement(xmlContent, contributionNode, elementId, impactedElements, tocItemsList, mergingCompletelySuccessfull);
            impactedElements.add(SOFT_MOVE_PLACEHOLDER_ID_PREFIX + cleanedElementId);
            impactedElements.add(cleanedElementId);
        } else if (ElementState.CONTENT_CHANGE.equals(elementState)) {
            resolveTrackChange(originalUpdatedNode, false, tocItemsList);
            xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(originalUpdatedNode), cleanedElementId);
            impactedElements.add(getId(contributionNode));
            xmlContent = renumberFragment(xmlContent,  elementId, tocItemsList);
        }

        if (hasAttribute(contributionNode, LEOS_INDENT_ORIGIN_TYPE_ATTR) && !elementToBeAdded) {
            xmlContent = undoIndentedElement(xmlContent, contributionNode, mergingCompletelySuccessfull, tocItemsList);
        }
        if (isNumberChangedArticle(contributionNode)) {
            xmlContent = undoNumberArticle(xmlContent, contributionNode, tocItemsList);
        }
        return xmlContent;
    }

    // Undo merging from inside main element
    private byte[] undoTrackChangesInContributionNode(byte[] xmlContent,
                                                      String elementId,
                                                      Node contributionNode,
                                                      List<String> impactedElements,
                                                      List<TocItem> tocItemsList,
                                                      AtomicBoolean mergingCompletelySuccessfull,
                                                      List<MergeActionVO> currentMergeActions) {

        // Undo merging of removed elements from inside main element
        xmlContent = undoDeletedElementsInContributionNode(contributionNode, xmlContent, elementId, impactedElements,
                tocItemsList, mergingCompletelySuccessfull);


        // Undo merging of "del" from inside main element
        xmlContent = undoDeletedTextInContributionNode(
                contributionNode,
                xmlContent, impactedElements, tocItemsList, mergingCompletelySuccessfull);


        // Undo merging of moved elements from inside main element
        xmlContent = undoMovedElementsInContributionNode(xmlContent,
                contributionNode,
                elementId, impactedElements, tocItemsList, mergingCompletelySuccessfull, currentMergeActions);

        // Undo merging of "ins" from inside main element
        xmlContent = undoInsertedTextInContributionNode(
                contributionNode,
                xmlContent, impactedElements, tocItemsList, mergingCompletelySuccessfull);

        // Undo merging of inserted elements from inside main element
        xmlContent = undoInsertedElementsInContributionNode(contributionNode, xmlContent, elementId, impactedElements, tocItemsList);

        xmlContent = undoNumberOfArticlesInContributionNode(xmlContent, contributionNode, elementId, tocItemsList);


        // Undo indentation elements
        xmlContent = undoIndentedElementsInContributionNode(
                xmlContent,
                contributionNode,
                tocItemsList,
                mergingCompletelySuccessfull
        );

        return xmlContent;
    }

    private boolean isEligableToBeUndone(Node node, List<TocItem> tocItemsList) {
        Node desc = getFirstAncestorWithTagNames(node, tocItemsList.stream().map((tocItem) -> tocItem.getAknTag().value()).collect(Collectors.toList()));
        if (desc != null && desc.getParentNode().getNodeName().equals(LIST)) {
            return (hasAttribute(node, LEOS_MERGE_ACTION_ATTR) || hasAttribute(desc, LEOS_MERGE_ACTION_ATTR) || hasAttribute(desc.getParentNode(),
                    LEOS_MERGE_ACTION_ATTR) || hasDescendantWithAttribute(node, LEOS_MERGE_ACTION_ATTR));
        }
        if (hasAttributeWithValue(node, LEOS_MERGE_ACTION_ATTR, MergeActionVO.MergeAction.PROCESSED.name()) || (desc != null && hasAttributeWithValue(desc,
                LEOS_MERGE_ACTION_ATTR, MergeActionVO.MergeAction.PROCESSED.name()))) {
            return false;
        }
        if (hasAttributeWithValue(node, LEOS_MERGE_ACTION_ATTR, UNSELECT.name()) || (desc != null && hasAttributeWithValue(desc,
                LEOS_MERGE_ACTION_ATTR, UNSELECT.name()))) {
            return false;
        }
        return (desc == null) || hasDescendantWithAttribute(node, LEOS_MERGE_ACTION_ATTR) || (hasAttribute(node, LEOS_MERGE_ACTION_ATTR) || hasAttribute(desc, LEOS_MERGE_ACTION_ATTR));
    }

    // Undo all "del" tag in contribution node -- Used while accepting without track changes
    private byte[] undoDeletedTextInContributionNode(Node contributionNode, byte[] xmlContent,
                                                     List<String> impactedElements, List<TocItem> tocItemsList,
                                                     AtomicBoolean mergingCompletelySuccessfull) {
        NodeList delElts = XercesUtils.getElementsByName(contributionNode, LEOS_TC_DELETE_ELEMENT_NAME);
        for (int i = delElts.getLength() - 1; i >= 0; i--) {
            Node delElt = delElts.item(i);
            if (delElt == null || delElt.getParentNode().getNodeName().equals(NUM) || StringUtils.isEmpty(delElt.getTextContent())
                    || !isEligableToBeUndone(delElt, tocItemsList)) {
                continue;
            }
            Node realDelElt = getRealUpdatedNodeOnUndo(xmlContent, delElt, false);
            if (!isEligableToBeUndone(realDelElt, tocItemsList)) {
                continue;
            }

            if (realDelElt.getNodeName().equals(LEOS_TC_DELETE_ELEMENT_NAME)) {
                xmlContent = undoDelInContent(xmlContent, delElt);
                impactedElements.add(getId(delElt));
            } else {
                xmlContent = handleIntroAndConclusionForList(xmlContent, realDelElt, delElt);
                Node sibling = getSiblingForRenumbering(realDelElt);
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(realDelElt), false);
                xmlContent = manageOnElementDeletion(xmlContent, getId(realDelElt.getParentNode()), null);
                xmlContent = renumberFragment(xmlContent, getId(sibling), tocItemsList);

                removeAttribute(realDelElt, LEOS_MERGE_ACTION_ATTR);
                resolveTrackChange(realDelElt, true, tocItemsList);
                undoAllTrackChangesForElement(realDelElt, true);
                xmlContent = mergeInsertedEltInXml(xmlContent, realDelElt, nodeToString(realDelElt),
                        getId(realDelElt), false, false, false,
                        tocItemsList, mergingCompletelySuccessfull);
                xmlContent = renumberFragment(xmlContent, getId(realDelElt), tocItemsList);
                impactedElements.add(getId(realDelElt));
            }
        }
        return xmlContent;
    }

    private byte[] undoIndentedElement(byte[] xmlContent, Node elt, AtomicBoolean mergingCompletelySuccessfull, List<TocItem> tocItemsList) {
        mergingCompletelySuccessfull.set(false);
        String eltId = getId(elt);
        Node xmlElt = getElementById(xmlContent, eltId);
        if (xmlElt != null) {
            resolveTrackChange(xmlElt, false, tocItemsList);
            Node xmlNum = getFirstChild(xmlElt, NUM);
            if (isNumDeleted(xmlNum) && xmlNum != null) {
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(xmlNum), false);
                return xmlContent;
            } else if (xmlNum != null) {
                XercesUtils.cleanTrackChangesForElement(xmlNum);
            }
            xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(xmlElt), eltId);
            xmlContent = renumberFragment(xmlContent, eltId, tocItemsList);
        }
        return xmlContent;
    }

    // Merges all indented tracked elements from inside contribution node
    private byte[] undoIndentedElementsInContributionNode(byte[] xmlContent,
                                                          Node contributionNode,
                                                          List<TocItem> tocItemsList,
                                                          AtomicBoolean mergingCompletelySuccessfull) {
        NodeList indentedElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + getId(contributionNode) + "']//*[@" + LEOS_INDENT_ORIGIN_TYPE_ATTR + "]");
        for (int i = 0; i < indentedElts.getLength(); i++) {
            Node elt = indentedElts.item(i);
            xmlContent = undoIndentedElement(xmlContent, elt, mergingCompletelySuccessfull, tocItemsList);
        }
        return xmlContent;
    }

    // Undo all "ins" tag in contribution node -- Used while accepting without track changes
    private byte[] undoInsertedTextInContributionNode(Node contributionNode, byte[] xmlContent,
                                                      List<String> impactedElements, List<TocItem> tocItemsList,
                                                      AtomicBoolean mergingCompletelySuccessfull) {
        NodeList insElts = XercesUtils.getElementsByName(contributionNode, LEOS_TC_INSERT_ELEMENT_NAME);
        for (int i = 0; i < insElts.getLength(); i++) {
            Node insElt = insElts.item(i);
            if (insElt.getParentNode().getNodeName().equals(NUM)) {
                continue;
            }
            Node realImpactedElt = getRealUpdatedNodeOnUndo(xmlContent, insElt, true);
            if (!isEligableToBeUndone(realImpactedElt, tocItemsList)) {
                continue;
            }
            xmlContent = handleIntroAndConclusionWhileRemovingList(xmlContent, realImpactedElt, insElt);

            if (realImpactedElt.getNodeName().equals(LEOS_TC_INSERT_ELEMENT_NAME)) {
                xmlContent = undoInsInContent(xmlContent, realImpactedElt, mergingCompletelySuccessfull);
                impactedElements.add(getId(realImpactedElt));
            } else {
                Node sibling = getSiblingForRenumbering(realImpactedElt);
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(realImpactedElt), false);
                xmlContent = manageOnElementDeletion(xmlContent, getId(realImpactedElt.getParentNode()), null);
                xmlContent = renumberFragment(xmlContent, getId(sibling), tocItemsList);
                impactedElements.add(getId(realImpactedElt));
            }
        }
        return xmlContent;
    }

    private byte[] undoInsInContent(byte[] xmlContent, Node nodeToBeRemovedAgain, AtomicBoolean mergingCompletelySuccessfull) {
        Node originalAddedNode = XercesUtils.getElementById(xmlContent, getId(nodeToBeRemovedAgain));
        // Case where merge was done with track changes
        if (originalAddedNode != null) {
            xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(originalAddedNode), false);
        } else {
            boolean found = false;
            Node originalUpdatedNode = XercesUtils.getElementById(xmlContent, getId(nodeToBeRemovedAgain.getParentNode()));
            if (originalUpdatedNode != null) {
                Node refOriginalParentNode = null;
                String contentToBeRemoved = getContentNodeAsXmlFragment(nodeToBeRemovedAgain);
                Node previousNode = getSibling(nodeToBeRemovedAgain, true);
                String prevContent = getContent(previousNode);
                Node previousNodeParent = previousNode!=null ? XercesUtils.getElementById(originalUpdatedNode, getId(previousNode.getParentNode())) : null;
                Node nextNode = getSibling(nodeToBeRemovedAgain, false);
                String nextContent = getContent(nextNode);
                Node nextNodeParent = nextNode != null ? XercesUtils.getElementById(originalUpdatedNode, getId(nextNode.getParentNode())) : null;

                // Handle inline elements (mathjax, ...)
                if (handleInlineDeletion(originalUpdatedNode, nodeToBeRemovedAgain, false, mergingCompletelySuccessfull)) {
                    xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(originalUpdatedNode), getId(originalUpdatedNode));
                    return xmlContent;
                }

                if (previousNodeParent != null) {
                    refOriginalParentNode = previousNodeParent.getParentNode();
                    String contentToBeUpdated = nodeToString(previousNodeParent);
                    prevContent = optimizeContent(contentToBeUpdated, prevContent, false);
                    String strToBeFound = prevContent + contentToBeRemoved;
                    strToBeFound = !contentToBeUpdated.contains(strToBeFound) ? prevContent + contentToBeRemoved.trim() : strToBeFound;
                    if (strToBeFound.length() > 1 && !StringUtils.isBlank(strToBeFound) && contentToBeUpdated.contains(strToBeFound)) {
                        XercesUtils.replaceElement(previousNodeParent, contentToBeUpdated.replaceFirst(Pattern.quote(strToBeFound),
                                prevContent.replaceAll("\\\\", "\\\\\\\\")));
                        found = true;
                    }
                }
                if (nextNodeParent != null && !found) {
                    refOriginalParentNode = nextNodeParent.getParentNode();
                    String contentToBeUpdated = nodeToString(nextNodeParent);
                    nextContent = optimizeContent(contentToBeUpdated, nextContent, true);
                    String strToBeFound = contentToBeRemoved + nextContent;
                    strToBeFound = !contentToBeUpdated.contains(strToBeFound) ?
                            contentToBeRemoved.trim() + nextContent: strToBeFound;
                    if (strToBeFound.length() > 1 && !StringUtils.isBlank(strToBeFound) && contentToBeUpdated.contains(strToBeFound)) {
                        XercesUtils.replaceElement(nextNodeParent, contentToBeUpdated.replaceFirst(Pattern.quote(strToBeFound),
                                nextContent.replaceAll("\\\\", "\\\\\\\\")));
                        found = true;
                    }
                }
                if (previousNodeParent != null && !found) {
                    String contentToBeUpdated = nodeToString(previousNodeParent);
                    String contentToCompareTo = getContentNodeAsXmlFragment(previousNodeParent);
                    String strToBeFound = contentToBeRemoved;
                    if (StringUtils.countMatches(contentToBeUpdated, strToBeFound) == 1 && StringUtils.countMatches(contentToCompareTo, strToBeFound) == 1) {
                        XercesUtils.replaceElement(previousNodeParent, contentToBeUpdated.replaceFirst(Pattern.quote(strToBeFound),
                                ""));
                        found = true;
                    }
                }
                if (nextNodeParent != null && !found) {
                    String contentToBeUpdated = nodeToString(nextNodeParent);
                    String contentToCompareTo = getContentNodeAsXmlFragment(nextNodeParent);
                    String strToBeFound = contentToBeRemoved;
                    if (StringUtils.countMatches(contentToBeUpdated, strToBeFound) == 1 && StringUtils.countMatches(contentToCompareTo, strToBeFound) == 1) {
                        XercesUtils.replaceElement(nextNodeParent, contentToBeUpdated.replaceFirst(Pattern.quote(strToBeFound),
                                ""));
                        found = true;
                    }
                }
                if (refOriginalParentNode != null) {
                    xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(refOriginalParentNode), getId(refOriginalParentNode));
                }
            }
        }
        return xmlContent;
    }

    private byte[] undoDelInContent(byte[] xmlContent, Node nodeToBeAddedAgain) {
        Node originalRemovedNode = XercesUtils.getElementById(xmlContent, getId(nodeToBeAddedAgain));
        // Case where merge was done with track changes
        if (originalRemovedNode != null) {
            Node parent = originalRemovedNode.getParentNode();
            replaceElement(originalRemovedNode, getContentNodeAsXmlFragment(originalRemovedNode));
            xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(parent), getId(parent));
        } else {
            // Case where merge was done without track changes
            boolean found = false;
            Node originalUpdatedNode = XercesUtils.getElementById(xmlContent, getId(nodeToBeAddedAgain.getParentNode()));
            if (originalUpdatedNode != null) {
                Node previousNode = getSibling(nodeToBeAddedAgain, true);
                String prevContent = getContent(previousNode);
                Node previousNodeParent = previousNode != null ? XercesUtils.getElementById(originalUpdatedNode, getId(previousNode.getParentNode())) : null;
                Node nextNode = getSibling(nodeToBeAddedAgain, false);
                String nextContent = getContent(nextNode);
                Node nextNodeParent = nextNode != null ? XercesUtils.getElementById(originalUpdatedNode, getId(nextNode.getParentNode())) : null;
                Node refParentToUpdateXml = null;
                String contentToBeAdded = getContentNodeAsXmlFragment(nodeToBeAddedAgain);

                // Avoid adding it again (already undone)
                if ((nextContent != null && (nextContent.startsWith(contentToBeAdded) || nextContent.trim().startsWith(contentToBeAdded)))
                        || (prevContent != null && (prevContent.endsWith(contentToBeAdded) || prevContent.trim().endsWith(contentToBeAdded)))) {
                    return xmlContent;
                }

                if (previousNodeParent != null) {
                    refParentToUpdateXml = previousNodeParent.getParentNode();
                    String contentToBeUpdated = nodeToString(previousNodeParent);
                    prevContent = optimizeContent(contentToBeUpdated, prevContent, false);
                    NodeList children = previousNodeParent.getChildNodes();
                    for (int i = 0; i < children.getLength(); i++) {
                        Node child = children.item(i);
                        String childContent = getContent(child);
                        if (childContent.contains(prevContent) && prevContent.length() > 1 && !StringUtils.isBlank(prevContent)
                                && !childContent.contains(prevContent + contentToBeAdded)) {
                            XercesUtils.replaceElement(child, nodeToString(child).replaceFirst(Pattern.quote(prevContent),
                                    (prevContent + contentToBeAdded).replaceAll("\\\\", "\\\\\\\\")));
                            found = true;
                            break;
                        } else if (childContent.contains(prevContent.trim()) && prevContent.length() > 1 && !StringUtils.isBlank(prevContent)
                                && !childContent.contains(prevContent.trim() + contentToBeAdded)) {
                            XercesUtils.replaceElement(child, nodeToString(child).replaceFirst(Pattern.quote(prevContent.trim()),
                                    (prevContent.trim() + contentToBeAdded).replaceAll("\\\\", "\\\\\\\\")));
                            found = true;
                            break;
                        }
                    }
                }
                if (nextNodeParent != null && !found) {
                    refParentToUpdateXml = nextNodeParent.getParentNode();
                    String contentToBeUpdated = nodeToString(nextNodeParent);
                    nextContent = optimizeContent(contentToBeUpdated, nextContent, true);
                    NodeList children = nextNodeParent.getChildNodes();
                    for (int i = 0; i < children.getLength(); i++) {
                        Node child = children.item(i);
                        String childContent = getContent(child);
                        if (childContent.contains(nextContent) && nextContent.length() > 1 && !StringUtils.isBlank(nextContent)
                                && !childContent.contains(contentToBeAdded + nextContent)) {
                            XercesUtils.replaceElement(child, nodeToString(child).replaceFirst(Pattern.quote(nextContent),
                                    (contentToBeAdded + nextContent).replaceAll("\\\\", "\\\\\\\\")));
                            found = true;
                            break;
                        } else if (childContent.contains(nextContent.trim()) && nextContent.length() > 1 && !StringUtils.isBlank(nextContent)
                                && !childContent.contains(contentToBeAdded + nextContent.trim())) {
                            XercesUtils.replaceElement(child, nodeToString(child).replaceFirst(Pattern.quote(nextContent.trim()),
                                    (contentToBeAdded + nextContent.trim()).replaceAll("\\\\", "\\\\\\\\")));
                            found = true;
                            break;
                        }
                    }
                }
                if (!found && (previousNodeParent != null || nextNodeParent != null)) {
                    String nodeContent = nodeToString(previousNodeParent != null ? previousNodeParent : nextNodeParent);
                    if (nextContent == null || StringUtils.isBlank(nextContent)) {
                        XercesUtils.appendToNodeContent(previousNodeParent != null ? previousNodeParent : nextNodeParent,
                                contentToBeAdded, false);
                        found = true;
                    } else if (prevContent == null || StringUtils.isBlank(prevContent)) {
                        XercesUtils.appendToNodeContent(previousNodeParent != null ? previousNodeParent : nextNodeParent,
                                contentToBeAdded, true);
                        found = true;
                    } else if (nodeContent.contains(prevContent) && prevContent.length() == 1 && !StringUtils.isBlank(prevContent)
                            && !nodeContent.contains(prevContent + contentToBeAdded)) {
                        XercesUtils.replaceElement(previousNodeParent != null ? previousNodeParent : nextNodeParent, nodeContent.replaceFirst(Pattern.quote(prevContent),
                                (prevContent + contentToBeAdded).replaceAll("\\\\", "\\\\\\\\")));
                        found = true;
                    } else if (nodeContent.contains(nextContent) && nextContent.length() == 1 && !StringUtils.isBlank(nextContent)
                            && !nodeContent.contains(contentToBeAdded + nextContent)) {
                        XercesUtils.replaceElement(previousNodeParent != null ? previousNodeParent : nextNodeParent,
                                nodeContent.replaceFirst(Pattern.quote(nextContent),
                                        (contentToBeAdded + nextContent).replaceAll("\\\\", "\\\\\\\\")));
                        found = true;
                    }
                }
                if (refParentToUpdateXml != null) {
                    xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(refParentToUpdateXml), getId(refParentToUpdateXml));
                }
            }
        }
        return xmlContent;
    }

    private byte[] undoMoveElement(byte[] xmlContent, Node contributionNode, String idWithoutMovedPrefix,
                                   List<String> impactedElements, List<TocItem> tocItemsList,
                                   AtomicBoolean mergingCompletelySuccessfull) {
        Node moveFromElt = XercesUtils.getElementById(contributionNode, idWithoutMovedPrefix);
        Node elementInOriginalContent = XercesUtils.getElementById(xmlContent, idWithoutMovedPrefix);
        if (elementInOriginalContent != null) {
            Node movedElementInOriginalContent = XercesUtils.getElementById(xmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + idWithoutMovedPrefix);

            if (movedElementInOriginalContent != null) {
                Node sibOfMovedElementInOriginalContent = getSiblingForRenumbering(movedElementInOriginalContent);
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + idWithoutMovedPrefix, false);
                xmlContent = manageOnElementDeletion(xmlContent, getId(movedElementInOriginalContent.getParentNode()), null);
                xmlContent = renumberFragment(xmlContent, getId(sibOfMovedElementInOriginalContent), tocItemsList);
            }
            Node sibling = getSiblingForRenumbering(elementInOriginalContent);
            xmlContent = xmlContentProcessor.removeElementById(xmlContent, idWithoutMovedPrefix, false);
            xmlContent = manageOnElementDeletion(xmlContent, getId(elementInOriginalContent.getParentNode()), null);
            xmlContent = renumberFragment(xmlContent, getId(sibling), tocItemsList);
            // Take care to add the moved element (moved_from) inside of the impacted element
            removeTrackChangesAttributes(elementInOriginalContent, true);

            xmlContent = mergeInsertedEltInXml(xmlContent, moveFromElt, nodeToString(elementInOriginalContent),
                    SOFT_MOVE_PLACEHOLDER_ID_PREFIX + idWithoutMovedPrefix,
                    false, false, false, tocItemsList, mergingCompletelySuccessfull);
            xmlContent = renumberFragment(xmlContent, getId(elementInOriginalContent), tocItemsList);
            impactedElements.add(idWithoutMovedPrefix);
            impactedElements.add(SOFT_MOVE_PLACEHOLDER_ID_PREFIX + idWithoutMovedPrefix);
        }
        return xmlContent;
    }

    // Undo moves and remove or add related elements outside node in original content
    private byte[] undoMovedElementsInContributionNode(byte[] xmlContent,
                                                       Node contributionNode,
                                                       String elementId,
                                                       List<String> impactedElements,
                                                       List<TocItem> tocItemsList,
                                                       AtomicBoolean mergingCompletelySuccessfull,
                                                       List<MergeActionVO> currentMergeActions) {
        NodeList moveFromElts = XercesUtils.getElementsByXPath(contributionNode, "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_SOFT_ACTION_ATTR + " = " +
                "'" + SoftActionType.MOVE_FROM.getSoftAction() + "']");
        List<String> moveToEltsInsideElement = new ArrayList<>();
        List<Node> sortedMoveFromElts = sortMovedElements(moveFromElts);
        for (Node moveFromElt : sortedMoveFromElts) {
            if (!isEligableToBeUndone(moveFromElt, tocItemsList)) {
                continue;
            }
            //Get moved element in original document
            String moveFromId = getId(moveFromElt);

            xmlContent = undoMoveElement(xmlContent, contributionNode, moveFromId, impactedElements, tocItemsList, mergingCompletelySuccessfull);
            impactedElements.add(SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId);
            impactedElements.add(moveFromId);
        }
        NodeList moveToElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_SOFT_ACTION_ATTR + " = '" + SoftActionType.MOVE_TO.getSoftAction() + "']");
        List<Node> sortedMoveToElts = sortMovedElements(moveToElts);
        for (Node moveToElt : sortedMoveToElts) {
            if (moveToEltsInsideElement.contains(getId(moveToElt)) || !isEligableToBeUndone(moveToElt, tocItemsList)) {
                continue;
            }
            //Get moved element in original document
            String moveFromId = getId(moveToElt).replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
            if (isMovedElementInAnotherAction(contributionNode, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId, currentMergeActions)) {
                continue;
            }

            xmlContent = undoMoveElement(xmlContent, contributionNode, moveFromId, impactedElements, tocItemsList, mergingCompletelySuccessfull);

            impactedElements.add(SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromId);
            impactedElements.add(moveFromId);
        }
        return xmlContent;
    }

    // Undo removed tracked elements in contribution node
    private byte[] undoDeletedElementsInContributionNode(Node contributionNode, byte[] xmlContent, String elementId,
                                                         List<String> impactedElements, List<TocItem> tocItemsList,
                                                         AtomicBoolean mergingCompletelySuccessfull) {
        NodeList deletedElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_ACTION_ATTR + " = '" + LEOS_TC_DELETE_ACTION + "']");
        for (int i = 0; i < deletedElts.getLength(); i++) {
            Node deletedElt = deletedElts.item(i);
            Node realImpactedElt = getRealUpdatedNodeOnUndo(xmlContent, deletedElt, false);
            if (!isEligableToBeUndone(realImpactedElt, tocItemsList)) {
                continue;
            }
            if (!deletedElt.getNodeName().equals(NUM) && !XercesUtils.hasAttribute(deletedElt, LEOS_SOFT_MOVE_TO)) {
                removeAttribute(realImpactedElt, LEOS_MERGE_ACTION_ATTR);
                resolveTrackChangesInEntireNode(realImpactedElt, tocItemsList);
                resolveTrackChange(realImpactedElt, true, tocItemsList);
                xmlContent = mergeInsertedEltInXml(xmlContent, realImpactedElt, nodeToString(realImpactedElt),
                        getId(realImpactedElt), false, false, false, tocItemsList,
                        mergingCompletelySuccessfull);
                xmlContent = renumberFragment(xmlContent, getId(realImpactedElt), tocItemsList);
                impactedElements.add(getId(realImpactedElt));
            }
        }
        return xmlContent;
    }


    // Undo added tracked elements in contribution node
    private byte[] undoInsertedElementsInContributionNode(Node contributionNode, byte[] xmlContent, String elementId,
                                                          List<String> impactedElements,
                                                          List<TocItem> tocItemsList) {
        NodeList addedElts = XercesUtils.getElementsByXPath(contributionNode,
                "//*[@" + XMLID + " = '" + elementId + "']//*[@" + LEOS_ACTION_ATTR + " = '" + LEOS_TC_INSERT_ACTION + "']");
        for (int i = 0; i < addedElts.getLength(); i++) {
            Node addedElt = addedElts.item(i);
            Node realImpactedElt = getRealUpdatedNodeOnUndo(xmlContent, addedElt, true);
            if (!isEligableToBeUndone(realImpactedElt, tocItemsList)) {
                continue;
            }
            if (!addedElt.getNodeName().equals(NUM) && !XercesUtils.hasAttribute(addedElt, LEOS_SOFT_MOVE_FROM)) {
                Node originalNodeToBeDeleted = getElementById(xmlContent, getId(realImpactedElt));
                if (originalNodeToBeDeleted != null) {
                    Node sibling = getSiblingForRenumbering(realImpactedElt);
                    xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(realImpactedElt), false);
                    xmlContent = manageOnElementDeletion(xmlContent, getId(originalNodeToBeDeleted.getParentNode()), null);
                    xmlContent = renumberFragment(xmlContent, getId(sibling), tocItemsList);
                    impactedElements.add(getId(realImpactedElt));
                }
            }
        }
        return xmlContent;
    }

    private byte[] mergeInsertedEltInXml(byte[] xmlContent,
                                         Node contributionNode,
                                         String newFragment,
                                         String contributionElementId,
                                         boolean withTrackChanges,
                                         boolean renumber,
                                         boolean priorityOnParent,
                                         List<TocItem> tocItemsList,
                                         AtomicBoolean mergingCompletelySuccessfull) {
        Element documentElement = xmlContentProcessor.getElementById(xmlContent, contributionElementId);

        Node refNode = getElementById(contributionNode, contributionElementId);

        Node contributionPreviousSibling = XercesUtils.getSibling(refNode, true);
        Node contributionNextSibling = XercesUtils.getSibling(refNode, false);
        Node contributionParentElement = refNode.getParentNode();

        Node xmlPreviousSibling = contributionPreviousSibling != null ? getElementById(xmlContent, getId(contributionPreviousSibling)) :
                null;
        if (xmlPreviousSibling == null && contributionPreviousSibling != null) {
            xmlPreviousSibling = getElementById(xmlContent, removesPrefixFromElementId(getId(contributionPreviousSibling)));
        }
        Node xmlNextSibling = contributionNextSibling != null ? getElementById(xmlContent, getId(contributionNextSibling)) : null;
        if (xmlNextSibling == null && contributionNextSibling != null) {
            xmlNextSibling = getElementById(xmlContent, removesPrefixFromElementId(getId(contributionNextSibling)));
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

        Node xmlParentSibling = contributionParentElement != null ? getElementById(xmlContent, getId(contributionParentElement)) : null;

        priorityOnParent =
                priorityOnParent && xmlParentSibling != null
                        && ((bestChoiceIsPrev && (xmlPreviousSibling != null && !getId(xmlPreviousSibling.getParentNode()).equals(getId(xmlParentSibling))))
                        || (!bestChoiceIsPrev && xmlNextSibling != null && (!getId(xmlNextSibling.getParentNode()).equals(getId(xmlParentSibling)))));

        // Case when a point without any siblings should be inserted, list should be inserted as whole
        if (contributionParentElement != null
                && contributionParentElement.getNodeName().equals(LIST)
                && !refNode.getNodeName().equals(SUBPARAGRAPH)
                && xmlParentSibling == null
                && xmlNextSibling == null
                && xmlPreviousSibling == null) {
            xmlParentSibling = contributionParentElement.getParentNode() != null ? getElementById(xmlContent,
                    getId(contributionParentElement.getParentNode())) : null;
            if (xmlParentSibling != null) {
                Node xmlList = getFirstChild(xmlParentSibling, LIST);
                if (xmlList != null) {
                    xmlParentSibling = xmlList;
                } else {
                    contributionPreviousSibling = XercesUtils.getSibling(refNode.getParentNode(), true);
                    contributionNextSibling = XercesUtils.getSibling(refNode.getParentNode(), false);

                    xmlPreviousSibling = contributionPreviousSibling != null ? getElementById(xmlContent, getId(contributionPreviousSibling)) : null;
                    xmlNextSibling = contributionNextSibling != null ? getElementById(xmlContent, getId(contributionNextSibling)) : null;

                    String newContentElementFragment = getStartTagNodeAsXmlFragment(contributionParentElement);
                    List<Node> parentChildren = getChildren(xmlParentSibling, Arrays.asList(CONTENT, SUBPARAGRAPH));
                    if (parentChildren.size() > 0) {
                        // Manage intro of the list
                        Node listFirstChild = getFirstChild(contributionParentElement);
                        if (listFirstChild.getNodeName().equals(SUBPARAGRAPH)) {
                            String intro = nodeToString(listFirstChild);
                            if (contributionPreviousSibling == null || contributionPreviousSibling.getNodeName().equals(NUM)) {
                                intro = !parentChildren.get(0).getNodeName().equals(CONTENT) ?
                                        nodeToString(parentChildren.get(0)) :
                                        getStartTagNodeAsXmlFragment(listFirstChild) + nodeToString(parentChildren.get(0)) + getEndTagNodeAsXmlFragment(listFirstChild);
                                xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(parentChildren.get(0)), false);
                            } else if (contributionPreviousSibling.getNodeName().equals(SUBPARAGRAPH)) {
                                Node introInXml = getElementById(xmlContent, getId(contributionPreviousSibling));
                                if (introInXml != null) {
                                    intro = nodeToString(introInXml);
                                    xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(introInXml), false);
                                }
                            }
                            newContentElementFragment += intro;
                        }
                    }

                    newContentElementFragment += newFragment;

                    // Manage conclusion of the list
                    Node listLastChild = getLastChild(contributionParentElement);
                    if (listLastChild.getNodeName().equals(SUBPARAGRAPH)) {
                        String conclusion = nodeToString(listLastChild);
                        if (contributionNextSibling != null) {
                            Node conclusionInXml = getElementById(xmlContent, getId(contributionNextSibling));
                            if (conclusionInXml != null) {
                                conclusion = nodeToString(conclusionInXml);
                                xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(conclusionInXml), false);
                            }
                        }
                        newContentElementFragment += conclusion;
                    }
                    newContentElementFragment += getEndTagNodeAsXmlFragment(contributionParentElement);
                    newFragment = newContentElementFragment;
                    xmlParentSibling = getElementById(xmlContent, getId(xmlParentSibling));
                }
            }
        }

        if (documentElement != null) {
            xmlContent = xmlContentProcessor.replaceElementById(xmlContent, newFragment, contributionElementId);
        } else if (xmlParentSibling != null && xmlPreviousSibling == null && xmlNextSibling != null) {
            if (xmlNextSibling.getNodeName().equals(SUBPARAGRAPH)
                    && !refNode.getNodeName().equals(SUBPARAGRAPH)
                    && xmlParentSibling.getNodeName().equals(LIST)) {
                xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent,  newFragment,
                        getId(xmlNextSibling),false, false);
            } else if (xmlNextSibling.getNodeName().equals(SUBPARAGRAPH)
                    && refNode.getNodeName().equals(SUBPARAGRAPH)
                    && xmlParentSibling.getNodeName().equals(LIST)) {
                xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent,  newFragment,
                        getId(xmlParentSibling),true, false);
            } else {
                xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent, newFragment,
                        getId(xmlNextSibling), true, false);
            }
        } else if (xmlParentSibling != null && contributionNextSibling == null && xmlPreviousSibling != null) {
            // that means that element should be at last position
            Node newParentNode = createNodeFromXmlFragment(xmlParentSibling.getOwnerDocument(), nodeToByteArray(xmlParentSibling), false);

            // Checks that last child is not a "content"
            Node lastChild = getLastChild(newParentNode);
            if (lastChild != null && lastChild.getNodeName().equals(CONTENT)) {
                Node contentInContribution = getElementById(contributionNode, getId(lastChild));
                if (contentInContribution != null) {
                    XercesUtils.replaceElement(lastChild, (getStartTagNodeAsXmlFragment(contentInContribution.getParentNode())
                            + nodeToString(lastChild)
                            + getEndTagNodeAsXmlFragment(contentInContribution.getParentNode())));
                    if (!withTrackChanges) {
                        resolveTrackChange(lastChild, false, tocItemsList);
                    }
                    xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(newParentNode), getId(xmlParentSibling));
                    xmlParentSibling = getElementById(xmlContent, getId(xmlParentSibling));
                    lastChild = getLastChild(xmlParentSibling);
                }
            }
            if (lastChild != null) {
                xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent, newFragment,
                        getId(lastChild), false, false);
            } else {
                xmlContent = xmlContentProcessor.addChildToParent(xmlContent, newFragment, getId(xmlParentSibling));
            }
        } else if (xmlPreviousSibling != null && bestChoiceIsPrev && (!priorityOnParent || xmlParentSibling == null)) {
            xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent,  newFragment,
                    getId(xmlPreviousSibling),false, false);
        } else if (xmlNextSibling != null && (!priorityOnParent || xmlParentSibling == null)) {
            xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent,  newFragment,
                    getId(xmlNextSibling),true, false);
        } else if (xmlParentSibling != null) {
            // Checks that last child is not a "content"
            Node lastChild = getLastChild(xmlParentSibling);
            if (lastChild != null && lastChild.getNodeName().equals(CONTENT)) {
                Node mainElementInContribution = getElementById(contributionNode, getId(xmlParentSibling));
                if (mainElementInContribution != null) {
                    Node contentInContribution = getFirstChild(mainElementInContribution, Arrays.asList(SUBPARAGRAPH, CONTENT));
                    if (contentInContribution.getNodeName().equals(SUBPARAGRAPH)) {
                        contentInContribution = getFirstChild(contentInContribution, CONTENT);
                    }
                    XercesUtils.replaceElement(lastChild, (getStartTagNodeAsXmlFragment(contentInContribution.getParentNode())
                            + nodeToString(lastChild)
                            + getEndTagNodeAsXmlFragment(contentInContribution.getParentNode())));
                    if (!withTrackChanges) {
                        resolveTrackChange(lastChild, false, tocItemsList);
                    }
                    xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(xmlParentSibling), getId(xmlParentSibling));
                    xmlParentSibling = getElementById(xmlContent, getId(xmlParentSibling));
                    lastChild = getLastChild(xmlParentSibling);
                } else {
                    XercesUtils.replaceElement(lastChild,
                            "<" + SUBPARAGRAPH + " " + XMLID + "=\"" + SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX + getId(xmlParentSibling) + "\">"
                            + nodeToString(lastChild)
                            + "</" + SUBPARAGRAPH + ">");
                    if (!withTrackChanges) {
                        resolveTrackChange(lastChild, false, tocItemsList);
                    }
                    xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(xmlParentSibling), getId(xmlParentSibling));
                    xmlParentSibling = getElementById(xmlContent, getId(xmlParentSibling));
                    lastChild = getLastChild(xmlParentSibling);
                }
            }
            if (lastChild != null) {
                xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent, newFragment,
                        getId(lastChild), false, false);
            } else {
                xmlContent = xmlContentProcessor.addChildToParent(xmlContent, newFragment, getId(xmlParentSibling));
            }
        } else {
            mergingCompletelySuccessfull.set(false);
            return xmlContent;
        }
        contributionElementId = removesPrefixFromElementId(contributionElementId);

        if (withTrackChanges) {
            xmlContent = copyTrackChangesAttributes(tocItemsList, xmlContentProcessor, xmlContent, refNode, contributionElementId);
        }
        // Handle renumbering
        if (xmlParentSibling != null && renumber) {
            Node newParent = getElementById(xmlContent, getId(xmlParentSibling));
            xmlContent = renumberFragment(xmlContent, getId(newParent), tocItemsList);
        }

        return xmlContent;
    }

    private void setActionAttribute(Node doc, String elementId, String action, List<TocItem> tocItemsList) {
        List<Node> contributionNodes = XercesUtils.getElementsById(doc, elementId);
        for (Node contributionNode : contributionNodes) {
            XercesUtils.insertOrUpdateAttributeValue(contributionNode, LEOS_MERGE_ACTION_ATTR, action);
            if (!HIGHER_ELEMENTS.contains(contributionNode.getNodeName())) {
                List<Node> descendants = XercesUtils.getDescendants(contributionNode, getMainElements(tocItemsList));
                for (Node descendant : descendants) {
                    if (!XercesUtils.hasAttribute(descendant, LEOS_MERGE_ACTION_ATTR)) {
                        XercesUtils.insertOrUpdateAttributeValue(descendant, LEOS_MERGE_ACTION_ATTR, action);
                    }
                }
            }
        }
    }

    private void updateActionOnImpactedElements(Node doc, String action, String elementId,
                                                List<String> impactedElements, List<TocItem> tocItemsList) {
        if (doc != null) {
            setActionAttribute(doc, elementId, action, tocItemsList);
            for (String impactedId : impactedElements) {
                setActionAttribute(doc, impactedId, action, tocItemsList);
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
        if (node != null) {
            XercesUtils.removeAttribute(node, LEOS_MERGE_ACTION_ATTR);
            List<Node> nodes = XercesUtils.getChildren(node);
            for (Node child : nodes) {
                resetAction(child);
            }
        }
    }

    private void removeActionOnImpactedElement(Node doc, String elementId, List<String> impactedElements) {
        Node contributionNode = XercesUtils.getElementById(doc, elementId);
        if (contributionNode != null) {
            resetAction(contributionNode);
            for (String impactedId : impactedElements) {
                Node impactedNode = XercesUtils.getElementById(doc, impactedId);
                resetAction(impactedNode);
            }
        }
    }

    private List<String> getMainElements(List<TocItem> tocItemsList) {
        List<String> mainElements = new ArrayList<>();
        for (TocItem tocItem : tocItemsList) {
            if (tocItem.isDraggable()) {
                mainElements.add(tocItem.getAknTag().value());
            }
        }
        mainElements.add(HEADING);
        mainElements.add(LEVEL);
        mainElements.add(PARAGRAPH);
        return mainElements;
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

    private boolean isListWithOnlyAddedElements(Node node, String tagName, byte[] xmlContent) {
        if (node.getNodeName().equals(LIST)) {
            List<Node> childList = XercesUtils.getChildren(node, tagName);
            for (Node child: childList) {
                Node originalMainElt = XercesUtils.getElementById(xmlContent, getId(child));
                if (originalMainElt == null && getId(child).contains(SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX)) {
                    originalMainElt = XercesUtils.getElementById(xmlContent, getId(child).replaceAll(SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX, ""));
                }
                if (originalMainElt != null) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    private Node getRealUpdatedNode(byte[] xmlContent, Node impactedNode, boolean insertion, List<TocItem> tocItemsList) {
        if (insertion && impactedNode.getNodeName().equals(LEOS_TC_INSERT_ELEMENT_NAME)) {
            Node mainElt = getFirstAscendant(impactedNode,
                    tocItemsList.stream().map((tocItem) -> tocItem.getAknTag().value()).collect(Collectors.toList()));
            if (mainElt != null) {
                if (isListWithOnlyAddedElements(mainElt.getParentNode(), mainElt.getNodeName(), xmlContent)) {
                    return mainElt.getParentNode();
                }
                Node originalMainElt = XercesUtils.getElementById(xmlContent, getId(mainElt));
                if (originalMainElt == null && getId(mainElt).startsWith(SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX)) {
                    originalMainElt = XercesUtils.getElementById(xmlContent, getId(mainElt).replaceAll(SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX, ""));
                }
                return originalMainElt == null || (hasAttribute(mainElt, LEOS_ACTION_NUMBER) && getAttributeValue(mainElt, LEOS_ACTION_NUMBER).equals(LEOS_TC_INSERT_ACTION)) ? mainElt :
                        impactedNode;
            } else {
                return impactedNode;
            }
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

    private void resolveTrackChangesInEntireNode(Node nodeToRestore, List<TocItem> tocItemsList) {
        resolveTrackChange(nodeToRestore, false, tocItemsList);
        List<Node> children = XercesUtils.getChildren(nodeToRestore);
        for (Node child: children) {
            resolveTrackChangesInEntireNode(child, tocItemsList);
        }
    }

    private void resolveTrackChange(Node nodeToRestore, boolean resetNum, List<TocItem> tocItemsList) {
        TocItem tocItem = getTocItemByName(tocItemsList, nodeToRestore.getNodeName().replace("akn", ""));
        List<String> attrsToRemove = Arrays.asList(LEOS_SOFT_USER_ATTR, LEOS_SOFT_DATE_ATTR, LEOS_SOFT_ACTION_ATTR,
                LEOS_SOFT_MOVED_LABEL_ATTR, LEOS_SOFT_ACTION_ROOT_ATTR, LEOS_SOFT_MOVE_TO, LEOS_SOFT_MOVE_FROM,
                LEOS_ACTION_NUMBER, LEOS_TC_ORIGINAL_NUMBER, LEOS_TITLE_NUMBER, LEOS_UID_NUMBER, LEOS_ACTION_ENTER,
                LEOS_TITLE_ENTER, LEOS_UID_ENTER, LEOS_ACTION_ATTR, LEOS_TITLE,
                LEOS_UID, LEOS_INITIAL_NUM, LEOS_AUTO_NUM_OVERWRITE, LEOS_INDENT_LEVEL_ATTR, LEOS_INDENT_NUMBERED_ATTR,
                LEOS_INDENT_ORIGIN_TYPE_ATTR, LEOS_INDENT_ORIGIN_INDENT_LEVEL_ATTR, LEOS_INDENT_ORIGIN_NUM_ID_ATTR,
                LEOS_INDENT_ORIGIN_NUM_ATTR, LEOS_INDENT_ORIGIN_NUM_ORIGIN_ATTR, LEOS_INDENT_UNUMBERED_PARAGRAPH);
        for (String attrToRemove: attrsToRemove) {
            XercesUtils.removeAttribute(nodeToRestore, attrToRemove);
        }
        String origin = XercesUtils.getAttributeValue(nodeToRestore, LEOS_ORIGIN_ATTR);
        if (LS.equals(origin)) {
            XercesUtils.removeAttribute(nodeToRestore, LEOS_ORIGIN_ATTR);
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
        if (!nodeToRestore.getNodeName().equals(SUBPARAGRAPH) || !getId(nodeToRestore).startsWith(SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX)) {
            XercesUtils.updateXMLIDAttribute(nodeToRestore, EMPTY_STRING, true);
        }
        Node numNode = getFirstChild(nodeToRestore, getNumTag(nodeToRestore.getNodeName()));
        if (isAutoNumbering(nodeToRestore, numNode, tocItemsList)) {
            if (resetNum) {
                numNode.setTextContent("#");
            }
            XercesUtils.removeAttribute(numNode, LEOS_ACTION_ATTR);
            XercesUtils.removeAttribute(numNode, LEOS_TITLE);
            XercesUtils.removeAttribute(numNode, LEOS_UID);
            if (XercesUtils.hasAttribute(numNode, LEOS_EDITABLE_ATTR)) {
                XercesUtils.addAttribute(numNode, LEOS_EDITABLE_ATTR, "true");
            }
            XercesUtils.removeAttribute(numNode, LEOS_ORIGIN_ATTR);
        }
    }

    private byte[] updateInternalReferences(byte[] xmlContent, List<InternalRefMap> map) {
        String xmlContentStr = new String(xmlContent, UTF_8);
        for (InternalRefMap internalRefMap : map) {
            if (internalRefMap.getClonedRef() != null) {
                xmlContentStr = xmlContentStr.replaceAll(internalRefMap.getClonedRef(), internalRefMap.getRef());
            }
        }
        return xmlContentStr.getBytes(StandardCharsets.UTF_8);
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

    private Node getRealUpdatedNodeOnUndo(byte[] xmlContent, Node impactedNode, boolean isIns) {
        Node parentNode = impactedNode;
        while (parentNode != null && !hasAttribute(parentNode, LEOS_MERGE_ACTION_ATTR)) {
            parentNode = parentNode.getParentNode();
            if (isIns && parentNode != null && hasAttribute(parentNode, XMLID)) {
                Node originalNode = getElementById(xmlContent, XercesUtils.getId(parentNode));
                if (originalNode == null) {
                    return impactedNode;
                } else if (parentNode != null && isListIntro(parentNode)) { // means that all element (point or paragraph) should be removed
                    Node siblingList = getSibling(parentNode.getParentNode(), true);
                    if (siblingList == null || !siblingList.getNodeName().equals(SUBPARAGRAPH)) {
                        return parentNode.getParentNode().getParentNode();
                    }
                }
            }
        }
        return parentNode != null
                && !parentNode.getNodeName().equals(NUM)
                && (!hasAttribute(parentNode, LEOS_SOFT_ACTION_ATTR) || !getAttributeValue(parentNode, LEOS_SOFT_ACTION_ATTR).equals(MOVE_FROM))
                && !hasAttribute(parentNode, LEOS_ACTION_ATTR) ? parentNode : impactedNode;
    }

    private byte[] manageOnElementDeletion(byte[] xmlContent, String id, ElementToBeProcessed elementToBeProcessed) {
        xmlContent = handleEmptyListInXml(xmlContent, id);
        xmlContent = handleEmptyElementsInXml(xmlContent, id, elementToBeProcessed);
        xmlContent = handleSubparagraphInXml(xmlContent, id);
        return xmlContent;
    }

    private byte[] handleEmptyListInXml(@NotNull byte[] xmlContent, @NotNull String listId) {
        Node list = XercesUtils.getElementById(xmlContent, listId);
        if (list != null && list.getNodeName().equals(LIST)) {
            List<Node> points = XercesUtils.getChildren(list, Arrays.asList(POINT, INDENT, CROSSHEADING));
            if (points.isEmpty()) {
                xmlContent = handleIntroAndConclusionWhileRemovingList(xmlContent, list, null);
            }
        }
        return xmlContent;
    }

    private byte[] handleEmptyElementsInXml(@NotNull byte[] xmlContent, @NotNull String elementId, ElementToBeProcessed elementToBeProcessed) {
        Node element = XercesUtils.getElementById(xmlContent, elementId);
        if (element != null) {
            List<Node> children = XercesUtils.getChildren(element);
            if (children.size() == 1 && children.get(0).getNodeName().equals(NUM)) {
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, elementId, false);
                if (elementToBeProcessed != null) {
                    elementToBeProcessed.setId(elementId);
                }
            } else if (children.size() == 0 && StringUtils.isEmpty(element.getTextContent())) {
                String parentId = element.getParentNode() != null ? getId(element.getParentNode()) : null;
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, elementId, false);
                if (parentId != null) {
                    xmlContent = handleSubparagraphInXml(xmlContent, parentId);
                }
            }
        }
        return xmlContent;
    }

    private byte[] handleSubparagraphInXml(@NotNull byte[] xmlContent, @NotNull String parentOfEltRemovedId) {
        Node parentOfRemovedElt = getElementById(xmlContent, parentOfEltRemovedId);
        if (parentOfRemovedElt != null && !parentOfRemovedElt.getNodeName().equals(LIST)) {
            List<Node> children = getChildren(parentOfRemovedElt, Arrays.asList(SUBPARAGRAPH, LIST));
            if (children.size() == 1 && children.get(0).getNodeName().equals(SUBPARAGRAPH)) {
                xmlContent = xmlContentProcessor.replaceElementById(xmlContent, nodeToString(getFirstChild(children.get(0))), getId(children.get(0)));
            }
        }
        return xmlContent;
    }

    private byte[] handleSubparagraphsInList(@NotNull byte[] xmlContent, Node subpara) {
        if (subpara != null && subpara.getNodeName().equals(SUBPARAGRAPH)) {
            String subparaId = getId(subpara);
            Node relatedNode = XercesUtils.getElementById(xmlContent, subparaId);
            if (relatedNode == null) {
                // Get content
                subpara = XercesUtils.getFirstChild(subpara);
                subparaId = getId(subpara);
                relatedNode = XercesUtils.getElementById(xmlContent, subparaId);
            }
            if (relatedNode != null) {
                replaceElement(subpara, nodeToString(relatedNode));
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, subparaId, false);
            }
        }
        return xmlContent;
    }

    // If that's a list, we must check intro and conclusion
    // this method moves intro and conclusion out of the  list
    private byte[] moveOutIntroAndConclusionFromList(@NotNull byte[] xmlContent, @NotNull Node list) {
        if (list.getNodeName().equals(LIST)) {
            int nbChild = getChildren(list.getParentNode(), SUBPARAGRAPH).size();
            int nbList = getChildren(list.getParentNode(), LIST).size();
            Node intro = XercesUtils.getFirstChild(list);
            Node conclusion = getLastChild(list);
            boolean hasIntro = intro.getNodeName().equals(SUBPARAGRAPH);
            boolean hasConclusion = conclusion.getNodeName().equals(SUBPARAGRAPH) && !getId(conclusion).equals(getId(intro));
            if (nbChild == 0 && nbList == 1 && hasIntro && !hasConclusion) {
                // Intro's content should be moved before list
                Node content = getFirstChild(intro);
                xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent, nodeToString(content), getId(list), true, false);
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(intro), false);
                intro.getParentNode().removeChild(intro);
            } else if (nbChild == 0 && nbList == 1 && hasIntro && hasConclusion) {
                // Intro should be moved before list
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(intro), false);
                xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent, nodeToString(intro), getId(list), true, false);
                intro.getParentNode().removeChild(intro);
                // Conclusion should be moved after list
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(conclusion), false);
                xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent, nodeToString(conclusion), getId(list), false,
                        false);
                conclusion.getParentNode().removeChild(conclusion);
            } else if (nbChild > 0 || nbList > 1) {
                if (hasIntro) {
                    // Intro should be moved before list
                    xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(intro), false);
                    xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent, nodeToString(intro), getId(list), true, false);
                    intro.getParentNode().removeChild(intro);
                }
                if (hasConclusion) {
                    // Conclusion should be moved after list
                    xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(conclusion), false);
                    xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent, nodeToString(conclusion), getId(list), false,
                            false);
                    conclusion.getParentNode().removeChild(conclusion);
                }
            }
        }
        return xmlContent;
    }

    // If that's a list, we must check intro and conclusion, to not add sth already present
    // this method removes intro and conclusion from document content
    private byte[] handleIntroAndConclusionForList(@NotNull byte[] xmlContent, @NotNull Node list, @NotNull Node trackedNode) {
        if (list.getNodeName().equals(LIST)) {
            list = createNodeFromXmlFragment(list.getOwnerDocument(), nodeToByteArray(list));
            trackedNode = getElementById(list, getId(trackedNode));
            Node intro = XercesUtils.getFirstChild(list);
            xmlContent = handleSubparagraphsInList(xmlContent, intro);
            Node conclusion = getLastChild(list);
            xmlContent = handleSubparagraphsInList(xmlContent, conclusion);
        }
        return xmlContent;
    }

    private byte[] handleIntroAndConclusionWhileRemovingList(@NotNull byte[] xmlContent, @NotNull Node list, Node targetNode) {
        list = XercesUtils.getElementById(xmlContent, getId(list));
        boolean listToBeRemoved = false;
        if (list != null && list.getNodeName().equals(LIST)) {
            int nbOfSiblings = XercesUtils.getChildren(list.getParentNode(), Arrays.asList(LIST, SUBPARAGRAPH)).size();
            Node intro = XercesUtils.getFirstChild(list);
            Node conclusion = getLastChild(list);
            boolean isIntroTheTarget = intro != null && targetNode != null && getId(intro).equals(getId(targetNode));
            boolean isConclusionTheTarget = conclusion != null && targetNode != null && getId(conclusion).equals(getId(targetNode));
            if (nbOfSiblings == 1 && intro != null && intro.getNodeName().equals(SUBPARAGRAPH) && !isIntroTheTarget && (conclusion == null
                    || !conclusion.getNodeName().equals(SUBPARAGRAPH) || conclusion.equals(intro))) {
                // Take content of intro and insert it before list
                xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent, nodeToString(XercesUtils.getFirstChild(intro)),
                        getId(list), true, false);
                listToBeRemoved = true;
            } else if (nbOfSiblings == 1 && conclusion != null && !isConclusionTheTarget && conclusion.getNodeName().equals(SUBPARAGRAPH) && (intro == null
                    || !intro.getNodeName().equals(SUBPARAGRAPH))) {
                // Take content of conclusion and insert it after list
                Node nextSibling = list.getNextSibling();
                if (nextSibling != null) {
                    xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent,
                            nodeToString(XercesUtils.getFirstChild(conclusion)),
                            getId(nextSibling), true, false);
                } else {
                    xmlContent = xmlContentProcessor.addChildToParent(xmlContent,
                            nodeToString(XercesUtils.getFirstChild(conclusion)),
                            getId(list.getParentNode()));
                }
                listToBeRemoved = true;
            } else {
                if (intro != null && intro.getNodeName().equals(SUBPARAGRAPH) && isIntroTheTarget) {
                    xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent, nodeToString(intro),
                            getId(list), true, false);
                    listToBeRemoved = true;
                }
                if (conclusion != null && conclusion.getNodeName().equals(SUBPARAGRAPH) && !conclusion.equals(intro) && !isConclusionTheTarget) {
                    Node nextSibling = list.getNextSibling();
                    if (nextSibling != null) {
                        xmlContent = xmlContentProcessor.insertElementByTagNameAndIdWithoutCheckOnIntro(xmlContent,
                                nodeToString(conclusion),
                                getId(nextSibling), true, false);
                    } else {
                        xmlContent = xmlContentProcessor.addChildToParent(xmlContent,
                                nodeToString(conclusion),
                                getId(list.getParentNode()));
                    }
                    listToBeRemoved = true;
                }
            }
            if (listToBeRemoved) {
                xmlContent = xmlContentProcessor.removeElementById(xmlContent, getId(list), false);
            }
        }
        return xmlContent;
    }

    private void checkNum(Node refNode, Node originalNode, ElementState mergeAction, boolean isWithTrackChanges,
                          boolean isMoving, List<TocItem> tocItemsList) {
        Node numNode = getFirstChild(refNode, getNumTag(refNode.getNodeName()));
        Node originalNumNode = originalNode != null ? getFirstChild(originalNode, getNumTag(originalNode.getNodeName())) : null;
        if (isAutoNumbering(refNode, numNode, tocItemsList)) {
            if (isWithTrackChanges) {
                if (DELETE.equals(mergeAction) && (!isMoving || Arrays.asList(POINT, PARAGRAPH).contains(refNode.getNodeName())) && originalNumNode != null) {
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
                } else if (DELETE.equals(mergeAction) && isMoving && originalNumNode != null) {
                    String oldNumLabel = originalNumNode.getTextContent();
                    numNode.setTextContent(oldNumLabel);
                } else if (ADD.equals(mergeAction) && isMoving) {
                    numNode.setTextContent("#");
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

    private byte[] renumberFragment(byte[] xmlContent, String elementId, List<TocItem> tocItemsList) {
        Node e = getElementById(xmlContent, elementId);
        if (e != null) {
            if (e.getNodeName().equals(RECITAL)) {
                return this.numberService.renumberRecitals(xmlContent);
            } else if (e.getNodeName().equals(ARTICLE)) {
                return this.numberService.renumberArticles(xmlContent, true);
            }
            if (HIGHER_ELEMENTS.contains(e.getNodeName())) {
                String language = documentLanguageContext.getDocumentLanguage();
                xmlContent = this.numberService.renumberHigherSubDivisions(xmlContent, language, e.getNodeName(), tocItemsList);
                List<Node> higherNodes = XercesUtils.getDescendants(e, HIGHER_ELEMENTS);
                Map<String, List<Node>> groupedHigherNodes = higherNodes.stream()
                        .collect(groupingBy(Node::getNodeName));
                for (Map.Entry<String,List<Node>> entry : groupedHigherNodes.entrySet() ) {
                    xmlContent = this.numberService.renumberHigherSubDivisions(xmlContent, language, entry.getKey(), tocItemsList);
                }
            }
            if (Arrays.asList(POINT, INDENT, CROSSHEADING, SUBPARAGRAPH, LIST).contains(e.getNodeName())) {
                List<Node> listChildren = getChildren(e, Arrays.asList(POINT, INDENT, CROSSHEADING, PARAGRAPH));
                if (e.getNodeName().equals(LIST) && listChildren.size() == 0) {
                    Node tmp = e.getParentNode();
                    tmp.removeChild(e);
                    e = tmp;
                }
                e = XercesUtils.getFirstAscendant(e, Arrays.asList(PARAGRAPH, ARTICLE, LEVEL));
            }
            if (e.getNodeName().equals(PARAGRAPH)) {
                elementId = getId(e.getParentNode());
            }
            List<Node> articles = XercesUtils.getDescendants(e, Arrays.asList(ARTICLE));
            if (articles.size() > 0) {
                return this.numberService.renumberArticles(xmlContent);
            } else {
                return this.numberService.renumberSpecificElementChildren(xmlContent, PARAGRAPH, elementId);
            }
        }
        return xmlContent;
    }

    private boolean isAutoNumbering(Node node, Node numNode, List<TocItem> tocItemsList) {
        Optional<TocItem> tocItem =
                tocItemsList.stream().filter((item) -> item.getAknTag().name().equalsIgnoreCase(node.getNodeName())).findFirst();
        if (tocItem.isPresent() && tocItem.get().getAutoNumbering() != null) {
            LangNumConfig langNumConfig = StructureConfigUtils.getLangNumConfigByLanguage(tocItem.get().getAutoNumbering().getLangNumConfigs(),
                    documentLanguageContext.getDocumentLanguage());
            return (numNode != null && (langNumConfig != null && langNumConfig.isAuto()));
        }
        return false;
    }

    private boolean hasParentInAnotherAction(Node contributionNode, Node currentNode, List<MergeActionVO> currentMergeActions) {
        for (MergeActionVO action : currentMergeActions) {
            String eltId = action.getElementId();
            if (eltId.equals(getId(contributionNode))) {
                continue;
            }
            if (hasAscendantWithId(currentNode, eltId) && !hasAscendantWithId(contributionNode, eltId)) {
                return true;
            }
        }
        return false;
    }

    private boolean isUnselected(Node contributionNode, Node currentNode, List<MergeActionVO> currentMergeActions) {
        if (hasAttributeWithValue(contributionNode, LEOS_MERGE_ACTION_ATTR, UNSELECT.name())) {
            return false;
        }
        List<String> unselectIds =
                currentMergeActions.stream().filter((action) -> action.getAction().equals(UNSELECT))
                        .map(MergeActionVO::getElementId).collect(Collectors.toList());
        return MergeUtils.isUnselected(currentNode, unselectIds);
    }

    private boolean isMovedElementInAnotherAction(Node contributionNode, String movedId, List<MergeActionVO> currentMergeActions) {
        for (MergeActionVO action : currentMergeActions) {
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
                .collect(Collectors.toList()).stream().map(Pair::left).collect(Collectors.toList());
    }
}
