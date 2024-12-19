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
package eu.europa.ec.leos.services.processor.content;

import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.model.action.SoftActionType;
import eu.europa.ec.leos.model.action.TrackChangeActionType;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.numbering.NumberProcessorHandler;
import eu.europa.ec.leos.services.numbering.config.NumberConfig;
import eu.europa.ec.leos.services.numbering.config.NumberConfigFactory;
import eu.europa.ec.leos.services.support.LeosXercesUtils;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.services.utils.StructureConfigUtils;
import eu.europa.ec.leos.vo.structure.LangNumConfig;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.vo.structure.TocItem;
import eu.europa.ec.leos.vo.structure.TocItemTypeName;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import io.atlassian.fugue.Pair;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.Validate;
import org.jsoup.Jsoup;
import org.jsoup.parser.Parser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static eu.europa.ec.leos.services.processor.content.TableOfContentHelper.ELEMENTS_WITHOUT_CONTENT;
import static eu.europa.ec.leos.services.processor.content.TableOfContentHelper.hasTocItemTrackChangeAction;
import static eu.europa.ec.leos.services.processor.content.XmlContentProcessorHelper.updateTocItemTypeAttributes;
import static eu.europa.ec.leos.services.support.MergeUtils.removeChildren;
import static eu.europa.ec.leos.services.support.XercesUtils.addAttribute;
import static eu.europa.ec.leos.services.support.XercesUtils.createElementAsLastChildOfNode;
import static eu.europa.ec.leos.services.support.XercesUtils.createXercesDocument;
import static eu.europa.ec.leos.services.support.XercesUtils.getChildren;
import static eu.europa.ec.leos.services.support.XercesUtils.getDescendants;
import static eu.europa.ec.leos.services.support.XercesUtils.getFirstChild;
import static eu.europa.ec.leos.services.support.XercesUtils.getId;
import static eu.europa.ec.leos.services.support.XercesUtils.getNumTag;
import static eu.europa.ec.leos.services.support.XercesUtils.nodeToByteArray;
import static eu.europa.ec.leos.services.support.XercesUtils.nodeToString;
import static eu.europa.ec.leos.services.support.XercesUtils.removeAttribute;
import static eu.europa.ec.leos.services.support.XercesUtils.updateXMLIDAttributeFullStructureNode;
import static eu.europa.ec.leos.services.support.XmlHelper.ARTICLE;
import static eu.europa.ec.leos.services.support.XmlHelper.CITATION;
import static eu.europa.ec.leos.services.support.XmlHelper.CONTENT;
import static eu.europa.ec.leos.services.support.XmlHelper.EC;
import static eu.europa.ec.leos.services.support.XmlHelper.ELEMENTS_TO_BE_NUMBERED;
import static eu.europa.ec.leos.services.support.XmlHelper.EMPTY_STRING;
import static eu.europa.ec.leos.services.support.XmlHelper.HEADING;
import static eu.europa.ec.leos.services.support.XmlHelper.INDENT;
import static eu.europa.ec.leos.services.support.XmlHelper.INTRO;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ACTION_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ACTION_NUMBER;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_DELETABLE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_DEPTH_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_EDITABLE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ID_TO_BE_REMOVED;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ID_TO_BE_RESTORED;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INITIAL_NUM_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_LIST_TYPE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ORIGIN_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_RENUMBER_ORIGIN;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_ACTION_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_ACTION_DELETE;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_ACTION_ROOT_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_DATE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_MOVED_LABEL_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_MOVE_FROM;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_MOVE_TO;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_USER_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TC_DELETE_ACTION;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TC_INSERT_ACTION;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TC_INSERT_ELEMENT_NAME;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TC_MOVE_ACTION;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TC_MOVE_TO_ORIGIN_ACTION;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TITLE;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_UID;
import static eu.europa.ec.leos.services.support.XmlHelper.LEVEL;
import static eu.europa.ec.leos.services.support.XmlHelper.LIST;
import static eu.europa.ec.leos.services.support.XmlHelper.LS;
import static eu.europa.ec.leos.services.support.XmlHelper.MAIN_BODY;
import static eu.europa.ec.leos.services.support.XmlHelper.NUM;
import static eu.europa.ec.leos.services.support.XmlHelper.PARAGRAPH;
import static eu.europa.ec.leos.services.support.XmlHelper.POINT;
import static eu.europa.ec.leos.services.support.XmlHelper.PREFACE;
import static eu.europa.ec.leos.services.support.XmlHelper.RECITAL;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_DELETE_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_MOVE_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_TEMP_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.SUBPARAGRAPH;
import static eu.europa.ec.leos.services.support.XmlHelper.SUBPOINT;
import static eu.europa.ec.leos.services.support.XmlHelper.UTF_8;
import static eu.europa.ec.leos.services.support.XmlHelper.XMLID;
import static eu.europa.ec.leos.services.support.XmlHelper.getDateAsXml;
import static eu.europa.ec.leos.services.support.XmlHelper.getSoftUserAttribute;
import static eu.europa.ec.leos.util.LeosDomainUtil.unWrapXmlFragment;
import static eu.europa.ec.leos.util.LeosDomainUtil.wrapXmlFragment;


@Service
@Instance(instances = {InstanceType.OS, InstanceType.COMMISSION})
public class XmlContentProcessorProposal extends XmlContentProcessorImpl {

    private static final Logger LOG = LoggerFactory.getLogger(XmlContentProcessorProposal.class);

    private static final List<String> POINT_PARENT_ELEMENTS = Arrays.asList(ARTICLE, LEVEL, PARAGRAPH);

    @Autowired
    private CloneContext cloneContext;
    @Autowired
    private NumberProcessorHandler numberProcessorHandler;
    @Autowired
    protected NumberConfigFactory numberConfigFactory;

    public Node buildTocItemContent(List<TocItem> tocItems, List<NumberingConfig> numberingConfigs, Map<TocItem, List<TocItem>> tocRules,
                                    Document document, Node parentNode, TableOfContentItemVO tocVo, User user, boolean isTrackChangesEnabled) {

        // 1. Get the corresponding node from the XML, or create a new one using the template
        Node node = getNode(document, tocVo);
        LOG.debug("buildTocItemContent for tocItemName '{}', tocItemId '{}', nodeName '{}', nodeId '{}', children {}", tocVo.getTocItem().getAknTag().value(), tocVo.getId(), node.getNodeName(), getId(node), tocVo.getChildItemsView().size());

        // 2. Store the node details in temp variables
        Node numNode = buildNumNode(node, tocVo);
        Node headingNode = buildHeadingNode(node, tocVo, user);
        Node introNode = getFirstChild(node, INTRO);  //recitals intro
        List<Node> childrenNode = XmlContentProcessorHelper.extractLevelNonTocItems(tocItems, tocRules, node, tocVo);

        // 3. clean the node and build it again.
        node.setTextContent(EMPTY_STRING);
        updateDepthAttribute(tocVo, node);
        addTrackChangeAttributes(tocVo, node, numNode, isTrackChangesEnabled);
        appendChildIfNotNull(numNode, node);

        if (!(ELEMENTS_WITHOUT_CONTENT.contains(tocVo.getTocItem().getAknTag().value().toLowerCase()) &&
                TableOfContentHelper.hasTocItemTrackChangeAction(tocVo, TrackChangeActionType.DELETE) &&
                tocVo.getId().startsWith(SOFT_MOVE_PLACEHOLDER_ID_PREFIX))) {
            appendChildIfNotNull(headingNode, node);
            appendChildIfNotNull(introNode, node);

            // 4. Propagate to children
            for (TableOfContentItemVO child : tocVo.getChildItemsView()) {
                Node newChild = buildTocItemContent(tocItems, numberingConfigs, tocRules, document, node, child, user, isTrackChangesEnabled);
                LOG.debug("buildTocItemContent adding {} '{}' as child of {}", newChild.getNodeName(), getId(newChild), node.getNodeName());
                XercesUtils.addChild(newChild, node);
            }
            appendChildrenIfNotNull(childrenNode, node); // only for part of the body which is not configured in structure.xml, like CLAUSE tag
        }
        String tagName = tocVo.getTocItem().getAknTag().value();

        if (isTrackChangesEnabled()) {
            if (SoftActionType.MOVE_TO.equals(tocVo.getSoftActionAttr())) {
                updateXMLIDAttributeFullStructureNode(node, SOFT_MOVE_PLACEHOLDER_ID_PREFIX, false);
            } else if (SoftActionType.DELETE.equals(tocVo.getSoftActionAttr())) {
                updateXMLIDAttributeFullStructureNode(node, SOFT_DELETE_PLACEHOLDER_ID_PREFIX, false);
            }
            processSoftElements(node, tocVo, user);
        }
        updateTocItemTypeAttributes(tocItems, node, tocVo);
        if (tagName.equals(ARTICLE)) {
            removeNumberingForParagraphInDefinitionArticle(node, tocVo.getTocItemType(), isTrackChangesEnabled);
            setAttributeForNumberingInListsArticle(tocItems, node, tocVo.getTocItemType());
        }
        return node;
    }

    /**
     *  if is definition  remove num children from paragraphs
     * @param node
     * @param tocItemType
     */
    private void removeNumberingForParagraphInDefinitionArticle(Node node, TocItemTypeName tocItemType, boolean isTrackChangesEnabled) {
        if(TocItemTypeName.DEFINITION.equals(tocItemType)){
            List<Node> lists = getChildren(node, PARAGRAPH);
            for (Node paragraph : lists) {
                Node numChild = getFirstChild(paragraph, NUM);
                if (numChild != null) {
                    if(isTrackChangesEnabled){
                        String currentNum = numChild.getTextContent();
                        removeChildren(numChild);
                        Node delNode = createElementAsLastChildOfNode(numChild.getOwnerDocument(), numChild, "del", currentNum);
                        addAttribute(delNode, LEOS_ACTION_NUMBER, LEOS_TC_DELETE_ACTION);
                        addAttribute(delNode, LEOS_UID, securityContext.getUser().getLogin());
                        addAttribute(delNode, LEOS_TITLE, LeosXercesUtils.getTitleValue(securityContext));
                    }else{
                        paragraph.removeChild(numChild);
                    }
                }
            }
        }
    }

    private void setAttributeForNumberingInListsArticle(List<TocItem> tocItems, Node node, TocItemTypeName tocItemType) {
        List<Node> lists = getDescendants(node, Arrays.asList(LIST));
        for (Node list : lists) {
            XercesUtils.insertOrUpdateAttributeValue(list, LEOS_LIST_TYPE_ATTR,
                    StructureConfigUtils.getNumberingTypeByTagNameAndTocItemType(tocItems, tocItemType, POINT, documentLanguageContext.getDocumentLanguage()).toString().toLowerCase());
        }
    }

    private void processSoftElements(Node node, TableOfContentItemVO tocVo, User user) {
        XercesUtils.addAttribute(node, LEOS_ORIGIN_ATTR, tocVo.getOriginAttr());
        String moveId = null;
        if (tocVo.getSoftActionAttr() != null) {
            switch (tocVo.getSoftActionAttr()) {
                case MOVE_TO:
                    moveId = tocVo.getSoftMoveTo();
                    break;
                case MOVE_FROM:
                    moveId = tocVo.getSoftMoveFrom();
                    break;
                default:
                    moveId = null;
            }
        }
        XmlContentProcessorHelper.updateSoftInfo(node, tocVo.getSoftActionAttr(), tocVo.isSoftActionRoot(), user,
                cloneContext.isClonedProposal() ? tocVo.getOriginAttr() : EC, moveId,
                tocVo, getOriginOfDocument(node));
    }

    private void updateDepthAttribute(TableOfContentItemVO tocVo, Node node) {
        if (tocVo.getItemDepth() > 0) {
            addAttribute(node, LEOS_DEPTH_ATTR, String.valueOf(tocVo.getItemDepth()));
        }
    }

    private void addTrackChangeAttributes(TableOfContentItemVO tocVo, Node node, Node numNode, boolean isTrackChangesEnabled) {
        if (isTrackChangesEnabled && securityContext.getUser() != null && StringUtils.isNotEmpty(tocVo.getTrackChangeAction())) {
            if (!hasTocItemTrackChangeAction(tocVo, LEOS_TC_MOVE_TO_ORIGIN_ACTION)) {
                Node nodeToAddOrRemoveAttribute = node;
                if (numNode != null && hasTocItemTrackChangeAction(tocVo, LEOS_TC_MOVE_ACTION)) {
                    nodeToAddOrRemoveAttribute = numNode;
                }
                String action = tocVo.getTrackChangeAction();
                if (hasTocItemTrackChangeAction(tocVo, LEOS_TC_MOVE_ACTION)) {
                    action = LEOS_TC_INSERT_ACTION;
                }
                addAttribute(nodeToAddOrRemoveAttribute, LEOS_ACTION_ATTR, action);
                addAttribute(nodeToAddOrRemoveAttribute, LEOS_UID, securityContext.getUser().getLogin());
                addAttribute(nodeToAddOrRemoveAttribute, LEOS_TITLE, LeosXercesUtils.getTitleValue(securityContext));
            } else if (numNode != null) {
                removeAttribute(numNode, LEOS_ACTION_ATTR);
                removeAttribute(numNode, LEOS_UID);
                removeAttribute(numNode, LEOS_TITLE);
            }
        }
    }

    @Override
    protected Pair<byte[], Element> buildSplittedElementPair(byte[] xmlContent, Element splitElement) {
        if (splitElement == null) {
            return null;
        }
        return new Pair<>(xmlContent, splitElement);
    }

    @Override
    public Element getMergeOnElement(byte[] xmlContent, String content, String tagName, String idAttributeValue, boolean checkParent) {
        if (!isPContent(content, tagName)) {
            return null;
        }

        Element mergeOnElement = getSiblingElement(xmlContent, tagName, idAttributeValue, Arrays.asList(tagName, LIST), true);

        // Case when element is intro
        if ((mergeOnElement == null) && (isListIntro(xmlContent, idAttributeValue))) {
            Element parentElement = getParentElement(xmlContent, idAttributeValue);
            mergeOnElement = parentElement != null ? getSiblingElement(xmlContent, parentElement.getElementTagName(), parentElement.getElementId(),
                    Arrays.asList(tagName,
                            parentElement.getElementTagName()), true) : null;
            if (mergeOnElement != null && mergeOnElement.getElementTagName().equalsIgnoreCase(LIST)) {
                mergeOnElement = getLastChildElement(xmlContent, mergeOnElement.getElementTagName(), mergeOnElement.getElementId(), Collections.emptyList());
            }
        }
        if ((mergeOnElement == null) || ((mergeOnElement != null) &&
                (!isPContent(mergeOnElement.getElementFragment(), mergeOnElement.getElementTagName())))) {
            return null;
        }
        return getMergedOnElement(mergeOnElement, xmlContent) ;
    }

    @Override
    public byte[] mergeElement(byte[] xmlContent, String content, String tagName, String idAttributeValue) {
        Element mergeOnElement = getMergeOnElement(xmlContent, content, tagName, idAttributeValue, false);
        String contentFragment = getElementContentFragmentByPath(content.getBytes(UTF_8), "/" + tagName + "/content/p", false);
        String mergeOnElementFragment =  CONTENT.equalsIgnoreCase(mergeOnElement.getElementTagName())
                ? "/content/p" : "/" + mergeOnElement.getElementTagName() + "/content/p";
        String contentFragmentMergeOn = getElementContentFragmentByPath(mergeOnElement.getElementFragment().getBytes(UTF_8),
                mergeOnElementFragment, false);
        String fragment = mergeOnElement.getElementFragment();
        if(!fragment.contains(contentFragmentMergeOn)){
            fragment =  Jsoup.parse(fragment, EMPTY_STRING, Parser.xmlParser()).toString();
        }
        final String replace = fragment.replace(contentFragmentMergeOn, contentFragmentMergeOn + " " + contentFragment);

        byte[] updatedXmlContent = replaceElementById(xmlContent, replace, mergeOnElement.getElementId());

        updatedXmlContent = replaceElementById(updatedXmlContent, content, idAttributeValue);
        updatedXmlContent = deleteElementById(updatedXmlContent, idAttributeValue);
        Element parentElement = getParentElement(updatedXmlContent, mergeOnElement.getElementId());
        if (parentElement != null && Arrays.asList(LEVEL, POINT, INDENT).contains(parentElement.getElementTagName()) &&
                getChildElement(updatedXmlContent, parentElement.getElementTagName(), parentElement.getElementId(),
                        Arrays.asList(SUBPARAGRAPH, SUBPOINT, LIST), 2) == null) {
            final String xPath = "/" + parentElement.getElementTagName() + "/" + mergeOnElement.getElementTagName();
            String mergedElementFragment = getElementFragmentByPath(parentElement.getElementFragment().getBytes(UTF_8), xPath, false);
            String mergedContentFragment = getElementFragmentByPath(parentElement.getElementFragment().getBytes(UTF_8), xPath + "/content", false);
            mergedElementFragment = XmlHelper.removeAllNameSpaces(mergedElementFragment);
            mergedContentFragment = XmlHelper.removeAllNameSpaces(mergedContentFragment);
            String parentElementFragment = parentElement.getElementFragment().replace(mergedElementFragment, mergedContentFragment);
            updatedXmlContent = replaceElementById(updatedXmlContent, parentElementFragment, parentElement.getElementId());
        }

        return updatedXmlContent;
    }

    @Override
    public boolean needsToBeIndented(String elementContent) {
        return false;
    }

    @Override
    public byte[] indentElement(byte[] xmlContent, String elementName, String elementId, String elementContent, List<TableOfContentItemVO> toc) throws IllegalArgumentException {
        return xmlContent;
    }

    @Override
    public byte[] removeElementById(byte[] xmlContent, String elementId, boolean isTrackChangesEnabled) {
        Element element = getElementById(xmlContent, elementId);
        boolean hasOptional = false;
        if (element != null && element.getElementFragment() != null && element.getElementFragment().contains("leos:optional=\"true\"")) {
            hasOptional = true;
        }
        boolean hasRepeated = false;
        if (element != null && element.getElementFragment() != null && element.getElementFragment().contains("leos:repeated=\"true\"")) {
            hasRepeated = true;
        }

        if(hasRepeated) {
            if (element == null) {
                return xmlContent;
            }
            return removeElement(xmlContent, element, LS, isTrackChangesEnabled);
        }
        if (isTrackChangesEnabled || hasOptional) {
            if (element == null) {
                return xmlContent;
            }
            return removeElement(xmlContent, element, LS, isTrackChangesEnabled || hasOptional);
        }
        return deleteElementById(xmlContent, elementId);
    }

    @Override
    public void removeElement(Node node) {
        if (isTrackChangesEnabled()) {
            super.removeElement(node);
        } else {
            XercesUtils.deleteElement(node);
        }
    }

    @Override
    public void specificInstanceXMLPostProcessing(Node node) {
        if (isTrackChangesEnabled()) {
            removeTempIdAttributeIfExists(node);
            updateSoftMoveLabelAttribute(node, LEOS_SOFT_MOVE_TO);
            updateSoftMoveLabelAttribute(node, LEOS_SOFT_MOVE_FROM);
            if (isClonedProposal()) {
                updateNewElements(node, CITATION, null, LS);
                updateNewElements(node, RECITAL, null, LS);
                updateNewElements(node, ARTICLE, null, LS);
                updateNewElements(node, PARAGRAPH, SUBPARAGRAPH, LS);
                updateNewElements(node, POINT, SUBPARAGRAPH, LS);
                updateNewElements(node, INDENT, SUBPARAGRAPH, LS);
                updateNewElements(node, LIST, SUBPARAGRAPH, LS);
                updateNewElements(node, POINT, SUBPOINT, LS);
                updateNewElements(node, INDENT, SUBPOINT, LS);
                updateNewElements(node, PREFACE, null, LS);
                updateNewElements(node, MAIN_BODY, null, LS);
                updateNewElements(node, LEVEL, SUBPARAGRAPH, LS);
            }
        }
    }

    @Override
    public byte[] applyAddActionOnElement(byte[] xmlContent, String elementId, boolean accept) {
        Document document = createXercesDocument(xmlContent);
        Node nodeToBeAdded = XercesUtils.getElementById(document, elementId);
        String tagName = nodeToBeAdded.getNodeName().toLowerCase();
        document = restoreNumElementOnIntermediateNodes(document, elementId, null, tagName);
        if (accept) {
            restoreSoftMovedElementMarkedWithAttribute(nodeToBeAdded);
        } else {
            XercesUtils.deleteElement(nodeToBeAdded);
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] applyDeleteActionOnElement(byte[] xmlContent, String elementId, boolean accept) {
        Document document = createXercesDocument(xmlContent);
        Node nodeToBeRemoved = XercesUtils.getElementById(document, elementId);
        String tagName = nodeToBeRemoved.getNodeName().toLowerCase();
        String docType = getAttributeValueByXpath(xmlContent, xPathCatalog.getXPathForDoc(), XmlHelper.XML_NAME);
        if (docType == null || !docType.equals(LeosCategory.STAT_DIGIT_FINANC_LEGIS.name())) {
            document = restoreNumElementOnIntermediateNodes(document, elementId, null, tagName);
        }
        if (accept) {
            XercesUtils.deleteElement(nodeToBeRemoved);
        } else {
            restoreSoftMovedElementMarkedWithAttribute(nodeToBeRemoved);
            XercesUtils.removeAttribute(nodeToBeRemoved, LEOS_DELETABLE_ATTR);
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] applyMoveActionOnElement(byte[] xmlContent, String movedFromElementId, boolean accept) {
        Document document = createXercesDocument(xmlContent);
        String movedToElementId = SOFT_MOVE_PLACEHOLDER_ID_PREFIX + movedFromElementId;
        Node nodeToBeRemoved;
        Node nodeToBeRestored;
        String tagName;
        if (accept) {
            nodeToBeRemoved = XercesUtils.getElementById(document, movedToElementId);
            nodeToBeRestored = XercesUtils.getElementById(document, movedFromElementId);
            tagName = nodeToBeRestored.getNodeName().toLowerCase();
        } else {
            nodeToBeRestored = XercesUtils.getElementById(document, movedToElementId);
            nodeToBeRemoved = XercesUtils.getElementById(document, movedFromElementId);
            tagName = nodeToBeRestored.getNodeName().toLowerCase();
        }
        document = restoreNumElementOnIntermediateNodes(document, movedToElementId, movedFromElementId, tagName);
        if (!accept) {
            String elementContent = nodeToString(nodeToBeRemoved);
            XercesUtils.deleteElement(nodeToBeRemoved);
            document = (Document) XercesUtils.replaceElement(nodeToBeRestored, elementContent);
            nodeToBeRestored = XercesUtils.getElementById(document, movedFromElementId);
        } else {
            XercesUtils.deleteElement(nodeToBeRemoved);
        }
        restoreSoftMovedElementMarkedWithAttribute(nodeToBeRestored);
        return nodeToByteArray(document);
    }

    private void restoreSoftMovedElementMarkedWithAttribute(Node nodeToRestore) {
        restoreNodeStructure(nodeToRestore);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_ACTION_ATTR);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_TITLE);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_UID);

        Node headingNode = getFirstChild(nodeToRestore, HEADING);
        boolean isOptionalForHeaderLevel = false;
        boolean isOptionalForLevel = false;
        boolean isGuidance = false;
        if (headingNode != null && headingNode.getAttributes() != null && headingNode.getAttributes().getNamedItem("leos:optional") != null
                && "true".equals(headingNode.getAttributes().getNamedItem("leos:optional").getTextContent())
                && nodeToRestore.getLocalName().equals(LEVEL)) {
            isOptionalForHeaderLevel = true;
        }
        if (nodeToRestore != null && nodeToRestore.getAttributes() != null && nodeToRestore.getAttributes().getNamedItem("leos:optional") != null
                && "true".equals(nodeToRestore.getAttributes().getNamedItem("leos:optional").getTextContent())
                && nodeToRestore.getLocalName().equals(LEVEL)) {
            isOptionalForLevel = true;
        }
        if (nodeToRestore != null && nodeToRestore.getAttributes() != null && nodeToRestore.getAttributes().getNamedItem("leos:guidance") != null
                && "true".equals(nodeToRestore.getAttributes().getNamedItem("leos:guidance").getTextContent())) {
            isGuidance = true;
        }

        if ((XercesUtils.hasAttribute(nodeToRestore, LEOS_EDITABLE_ATTR) || isOptionalForLevel) && !isOptionalForHeaderLevel && !isGuidance) {
            XercesUtils.addAttribute(nodeToRestore, LEOS_EDITABLE_ATTR, "true");
        }
        if (isOptionalForHeaderLevel && !isOptionalForLevel) {
            XercesUtils.removeAttribute(nodeToRestore, LEOS_EDITABLE_ATTR);
        }
        XercesUtils.updateXMLIDAttributeFullStructureNode(nodeToRestore, EMPTY_STRING, true);
        Node numNode = getFirstChild(nodeToRestore, getNumTag(nodeToRestore.getNodeName()));
        Optional<TocItem> tocItem =
                structureContextProvider.get().getTocItems().stream().filter((item) -> item.getAknTag().name().equalsIgnoreCase(nodeToRestore.getNodeName())).findFirst();
        if(tocItem.isPresent() && tocItem.get().getAutoNumbering() != null) {
            LangNumConfig langNumConfig = StructureConfigUtils.getLangNumConfigByLanguage(tocItem.get().getAutoNumbering().getLangNumConfigs(),
                    documentLanguageContext.getDocumentLanguage());

            if (numNode != null && (langNumConfig != null && langNumConfig.isAuto())) {
                if (!isOptionalForHeaderLevel && !isOptionalForLevel) {
                    numNode.setTextContent("#");
                }
                XercesUtils.removeAttribute(numNode, LEOS_ACTION_ATTR);
                XercesUtils.removeAttribute(numNode, LEOS_TITLE);
                XercesUtils.removeAttribute(numNode, LEOS_UID);
            }
        }
    }

    private void restoreNodeStructure(Node nodeToRestore) {
        XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_USER_ATTR);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_DATE_ATTR);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_ACTION_ATTR);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_ACTION_ROOT_ATTR);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_MOVED_LABEL_ATTR);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_MOVE_TO);
        XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_MOVE_FROM);
        String origin = XercesUtils.getAttributeValue(nodeToRestore, LEOS_ORIGIN_ATTR);
        if (LS.equals(origin)) {
            XercesUtils.addAttribute(nodeToRestore, LEOS_ORIGIN_ATTR, EC);
        }
        List<Node> children = XercesUtils.getChildren(nodeToRestore);
        for (int i = 0; i < children.size(); i++) {
            restoreNodeStructure(children.get(i));
        }
    }

    @Override
    public byte[] restoreNumElementOnIntermediateNodes(byte[] xmlContent, String originId, String destId, String tagName) {
        Document document = createXercesDocument(xmlContent);
        document = restoreNumElementOnIntermediateNodes(document, originId, destId, tagName);
        return nodeToByteArray(document);
    }

    private Document restoreNumElementOnIntermediateNodes(Document doc, String originId, String destId, String tagName) {
        NodeList nodesToBeRestored = doc.getElementsByTagName(tagName);
        boolean parentToBeChecked = Arrays.asList(PARAGRAPH, POINT, INDENT).contains(tagName);
        Node refParent = null;
        boolean letsRestore = false;
        for (int nodeIdx = 0; nodeIdx < nodesToBeRestored.getLength(); nodeIdx++) {
            Node nodeToRestore = nodesToBeRestored.item(nodeIdx);
            Node parent = nodeToRestore.getParentNode();
            String idAttrVal = XercesUtils.getAttributeValue(nodeToRestore, XMLID);
            if (letsRestore && (idAttrVal.equals(originId) || idAttrVal.equals(destId))
                    || (XercesUtils.hasAttribute(nodeToRestore, LEOS_ACTION_ATTR)
                    || XercesUtils.hasAttribute(nodeToRestore, LEOS_SOFT_ACTION_ATTR))
                    || (parentToBeChecked && refParent != null && !refParent.equals(parent))) {
                letsRestore = false;
            }
            if (letsRestore) {
                XercesUtils.removeAttribute(nodeToRestore, LEOS_INITIAL_NUM_ATTR);
                Node numNode = getFirstChild(nodeToRestore, getNumTag(nodeToRestore.getNodeName()));
                Optional<TocItem> tocItem =
                        structureContextProvider.get().getTocItems().stream().filter((item) -> item.getAknTag().name().equalsIgnoreCase(nodeToRestore.getNodeName())).findFirst();
                if(tocItem.isPresent() && tocItem.get().getAutoNumbering() != null) {
                    LangNumConfig langNumConfig = StructureConfigUtils.getLangNumConfigByLanguage(tocItem.get().getAutoNumbering().getLangNumConfigs(),
                            documentLanguageContext.getDocumentLanguage());

                    if (numNode != null && (langNumConfig != null && langNumConfig.isAuto())) {
                        numNode.setTextContent("#");
                        XercesUtils.removeAttribute(numNode, LEOS_ACTION_ATTR);
                        XercesUtils.removeAttribute(numNode, LEOS_TITLE);
                        XercesUtils.removeAttribute(numNode, LEOS_UID);
                    }
                }
            }
            if (!letsRestore && (idAttrVal.equals(originId) || idAttrVal.equals(destId))) {
                refParent = nodeToRestore.getParentNode();
                letsRestore = true;
            }
        }
        return doc;
    }

    @Override
    public Pair<byte[], String> updateSoftMovedElement(byte[] xmlContent, String elementContent) {

        Pair<byte[], String> resultFromRemoveSoftElement = removeSoftMovedElementMarkedWithAttribute(xmlContent, elementContent);
        xmlContent = resultFromRemoveSoftElement.left();
        elementContent = resultFromRemoveSoftElement.right();

        Pair<byte[], String> resultFromRestoreSoftElement = restoreSoftMovedElementMarkedWithAttribute(xmlContent, elementContent);
        xmlContent = resultFromRestoreSoftElement.left();
        elementContent = resultFromRestoreSoftElement.right();

        Document fragment = createXercesDocument(wrapXmlFragment(elementContent).getBytes(StandardCharsets.UTF_8));
        NodeList softMovedNodes = XercesUtils.getElementsByXPath(fragment, String.format("//*[@%s]", LEOS_SOFT_MOVE_FROM));

        Pair<byte[], String> result = new Pair<>(xmlContent, elementContent); //default result
        Document document = createXercesDocument(xmlContent);
        for (int nodeIdx = 0; nodeIdx < softMovedNodes.getLength(); nodeIdx++) {
            Node node = softMovedNodes.item(nodeIdx);
            String idAttrVal = XercesUtils.getAttributeValue(node, XMLID);
            if (idAttrVal != null && idAttrVal.indexOf(SOFT_TEMP_PLACEHOLDER_ID_PREFIX) != -1) {
                String updatedIdAttrVal = idAttrVal.replace(SOFT_TEMP_PLACEHOLDER_ID_PREFIX, EMPTY_STRING);
                String xPath = "//*[@xml:id = '" + updatedIdAttrVal + "']";
                NodeList sourceNodes = XercesUtils.getElementsByXPath(fragment, xPath);
                if (sourceNodes != null && sourceNodes.getLength() > 0) { //If moved within article
                    insertSoftMovedAttributesAndRenumber(updatedIdAttrVal, sourceNodes.item(0), document);
                    result = new Pair<>(nodeToByteArray(document), nodeToString(fragment.getFirstChild().getFirstChild()));
                } else { //If moved between articles
                    sourceNodes = XercesUtils.getElementsByXPath(document, xPath);
                    if (sourceNodes != null && sourceNodes.getLength() > 0) {
                        insertSoftMovedAttributesAndRenumber(updatedIdAttrVal, sourceNodes.item(0), document);
                        result = new Pair<>(nodeToByteArray(document), elementContent);
                    }
                }
            }
        }
        return result;
    }

    private Pair<byte[], String> restoreSoftMovedElementMarkedWithAttribute(byte[] xmlContent, String elementContent) {
        Document fragmentToCheckRestore = createXercesDocument(wrapXmlFragment(elementContent).getBytes(StandardCharsets.UTF_8));
        NodeList softMovedNodesToRestore = XercesUtils.getElementsByXPath(fragmentToCheckRestore, String.format("//*[@%s]", LEOS_ID_TO_BE_RESTORED));
        for (int nodeIdx = 0; nodeIdx < softMovedNodesToRestore.getLength(); nodeIdx++) {
            NamedNodeMap attributesOfRejectedNode = softMovedNodesToRestore.item(nodeIdx).getAttributes();
            String idToRestore = attributesOfRejectedNode.getNamedItem(LEOS_ID_TO_BE_RESTORED).getNodeValue();
            attributesOfRejectedNode.removeNamedItem(LEOS_ID_TO_BE_RESTORED);
            Document document = createXercesDocument(xmlContent);
            Node nodeToRestore = XercesUtils.getElementById(document, idToRestore);
            XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_USER_ATTR);
            XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_DATE_ATTR);
            XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_ACTION_ATTR);
            XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_ACTION_ROOT_ATTR);
            XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_MOVED_LABEL_ATTR);
            XercesUtils.removeAttribute(nodeToRestore, LEOS_SOFT_MOVE_TO);
            XercesUtils.removeAttribute(nodeToRestore, LEOS_ACTION_ATTR);
            XercesUtils.removeAttribute(nodeToRestore, LEOS_TITLE);
            XercesUtils.removeAttribute(nodeToRestore, LEOS_UID);
            XercesUtils.removeAttribute(nodeToRestore, LEOS_EDITABLE_ATTR);
            XercesUtils.addAttribute(nodeToRestore, XMLID, XercesUtils.getAttributeValue(nodeToRestore, XMLID).replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, ""));
            Node numNode = getFirstChild(nodeToRestore, getNumTag(nodeToRestore.getNodeName()));
            XercesUtils.removeAttribute(numNode, LEOS_ACTION_ATTR);
            XercesUtils.removeAttribute(numNode, LEOS_TITLE);
            XercesUtils.removeAttribute(numNode, LEOS_UID);

            if (nodeToRestore.getParentNode() != null) {
                List<Node> children = XercesUtils.getChildren(nodeToRestore.getParentNode(), Arrays.asList(INDENT, POINT));
                Node firstElement = children.get(0);
                int elementDepth = XercesUtils.getPointDepth(firstElement);
                String elementName = firstElement.getNodeName();
                NumberConfig numberConfig = numberConfigFactory.getNumberConfig(elementName, elementDepth, firstElement, "EN");
                boolean changeOffset = false;
                for (int nodeListCount = 0; nodeListCount < children.size(); nodeListCount++) {
                    Node node = children.get(nodeListCount);
                    if (changeOffset) {
                        numNode = getFirstChild(node, getNumTag(node.getNodeName()));
                        if (numNode != null) {
                            Node insNode = getFirstChild(numNode, LEOS_TC_INSERT_ELEMENT_NAME);
                            if (insNode != null) {
                                int index = numberConfig.getNumberIndex(insNode.getTextContent()) + 1;
                                insNode.setTextContent(numberConfig.getNumberFromIndex(index));
                            }
                        }
                    }
                    if (nodeToRestore == node) {
                        changeOffset = true;
                    }
                }
            }
            xmlContent = nodeToByteArray(document);
            document = createXercesDocument(xmlContent);
            numberProcessorHandler.renumberDocument(document, ARTICLE, "EN", true);
            xmlContent = nodeToByteArray(document);

        }
        return new Pair<>(xmlContent, unWrapXmlFragment(nodeToString(fragmentToCheckRestore.getFirstChild())));
    }

    private Pair<byte[], String> removeSoftMovedElementMarkedWithAttribute(byte[] xmlContent, String elementContent) {
        Document fragmentToCheckDeleted = createXercesDocument(wrapXmlFragment(elementContent).getBytes(StandardCharsets.UTF_8));
        NodeList softMovedNodesToCheckDeleted = XercesUtils.getElementsByXPath(fragmentToCheckDeleted, String.format("//*[@%s][@%s='accept']", LEOS_ID_TO_BE_REMOVED,
                LEOS_RENUMBER_ORIGIN));
        for (int nodeIdx = 0; nodeIdx < softMovedNodesToCheckDeleted.getLength(); nodeIdx++) {
            NamedNodeMap attributesOfAcceptedNode = softMovedNodesToCheckDeleted.item(nodeIdx).getAttributes();
            attributesOfAcceptedNode.removeNamedItem(LEOS_ID_TO_BE_REMOVED);
            attributesOfAcceptedNode.removeNamedItem(LEOS_RENUMBER_ORIGIN);
            String idToDelete = SOFT_MOVE_PLACEHOLDER_ID_PREFIX + attributesOfAcceptedNode.getNamedItem(XMLID).getNodeValue();
            Document document = createXercesDocument(xmlContent);
            Node nodeToDelete = XercesUtils.getElementById(document, idToDelete);
            if (nodeToDelete != null && nodeToDelete.getParentNode() != null) {
                List<Node> children = XercesUtils.getChildren(nodeToDelete.getParentNode(), Arrays.asList(INDENT, POINT));
                Node firstElement = children.get(0);
                int elementDepth = XercesUtils.getPointDepth(firstElement);
                String elementName = firstElement.getNodeName();
                NumberConfig numberConfig = numberConfigFactory.getNumberConfig(elementName, elementDepth, firstElement, "EN");
                boolean changeOffset = false;
                for (int nodeListCount = 0; nodeListCount < children.size(); nodeListCount++) {
                    Node node = children.get(nodeListCount);
                    if (changeOffset) {
                        Node numNode = getFirstChild(node, getNumTag(node.getNodeName()));
                        if (numNode != null) {
                            Node delNode = getFirstChild(numNode, LEOS_SOFT_ACTION_DELETE);
                            if (delNode != null) {
                                int index = numberConfig.getNumberIndex(delNode.getTextContent()) - 1;
                                delNode.setTextContent(numberConfig.getNumberFromIndex(index));
                            }
                        }
                    }
                    if (nodeToDelete == node) {
                        changeOffset = true;
                    }
                }
            }
            xmlContent = nodeToByteArray(document);
            xmlContent = this.deleteElementById(xmlContent, idToDelete);
            document = createXercesDocument(xmlContent);
            numberProcessorHandler.renumberDocument(document, ARTICLE, "EN", true);
            xmlContent = nodeToByteArray(document);
        }
        return new Pair<>(xmlContent, unWrapXmlFragment(nodeToString(fragmentToCheckDeleted.getFirstChild())));
    }

    private void insertSoftMovedAttributesAndRenumber(String idAttrVal, Node sourceNode, Node document) {
        Validate.notNull(idAttrVal, "Id attribute should not be null");
        Validate.notNull(sourceNode, "source node should not be null");

        Node parentNode = sourceNode.getParentNode();
        String tagName = sourceNode.getNodeName();
        String xPath = "//*[@xml:id = '" + SOFT_MOVE_PLACEHOLDER_ID_PREFIX + idAttrVal + "']";
        NodeList movedNodes = XercesUtils.getElementsByXPath(document, xPath);
        if (movedNodes == null || movedNodes.getLength() == 0) {
            updateSoftAtrributes(idAttrVal, sourceNode, SOFT_MOVE_PLACEHOLDER_ID_PREFIX);
        } else if (!containsSoftActionAttributes(movedNodes.item(0))) {
            updateNodeWithChildren(movedNodes.item(0), XMLID, SOFT_DELETE_PLACEHOLDER_ID_PREFIX, idAttrVal);
            updateSoftAtrributes(idAttrVal, sourceNode, SOFT_MOVE_PLACEHOLDER_ID_PREFIX);
        } else { //Node was already moved so delete the intermediate node to avoid duplicate soft moved nodes
            XercesUtils.deleteElement(sourceNode);
            XercesUtils.addAttribute(movedNodes.item(0), LEOS_SOFT_DATE_ATTR, getDateAsXml());
        }
        while (parentNode != null && !POINT_PARENT_ELEMENTS.contains(parentNode.getNodeName())) {
            parentNode = parentNode.getParentNode();
        }
        try {
            if (ELEMENTS_TO_BE_NUMBERED.contains(tagName) && parentNode != null) {
                numberProcessorHandler.renumberElement(parentNode, tagName, true, "EN");
                coEditionContext.addUpdatedElement(getId(parentNode), parentNode.getNodeName(), nodeToString(parentNode), null);
            }
        } catch (Exception e) {
            LOG.error("Unable to renumber element", e);
        }
    }

    private void updateNodeWithChildren(Node item, String attr, String prefix, String idAttrVal) {
        addAttribute(item, attr, StringUtils.isNotEmpty(prefix) ? prefix + idAttrVal : idAttrVal);
        NodeList childNodes = item.getChildNodes();
        for (int i = 0; i < childNodes.getLength(); i++) {
            Node node = childNodes.item(i);
            if ((childNodes.item(i) instanceof Document) || (node instanceof org.w3c.dom.Element)) {
                updateNodeWithChildren(childNodes.item(i), attr, prefix, XercesUtils.getAttributeValue(childNodes.item(i), attr));
            }
        }
    }

    private void updateSoftAtrributes(String idAttrVal, Node sourceNode, String idPrefix) {
        addAttribute(sourceNode, XMLID, idPrefix + idAttrVal);
        addAttribute(sourceNode, LEOS_SOFT_ACTION_ATTR, SoftActionType.MOVE_TO.getSoftAction());
        addAttribute(sourceNode, LEOS_SOFT_USER_ATTR, getSoftUserAttribute(securityContext.getUser()));
        addAttribute(sourceNode, LEOS_SOFT_DATE_ATTR, getDateAsXml());
        addAttribute(sourceNode, LEOS_SOFT_ACTION_ROOT_ATTR, "true");
        addAttribute(sourceNode, LEOS_SOFT_MOVE_TO, idAttrVal);
        //Add leos:editable=false to make this element read-only inside CKE
        addAttribute(sourceNode, LEOS_EDITABLE_ATTR, "false");
        coEditionContext.addUpdatedElement(idAttrVal, sourceNode.getNodeName(), nodeToString(sourceNode), null);
    }

    private boolean containsSoftActionAttributes(Node node) {
        SoftActionType softActionType = XercesUtils.getAttributeForSoftAction(node, LEOS_SOFT_ACTION_ATTR);
        return softActionType != null;
    }

    private void removeTempIdAttributeIfExists(Node node) {
        String xPath = "//*[starts-with(@xml:id,'" + SOFT_TEMP_PLACEHOLDER_ID_PREFIX + "')]";
        NodeList nodes = XercesUtils.getElementsByXPath(node, xPath);
        for (int idx = 0; idx < nodes.getLength(); idx++) {
            Node tempIdNode = nodes.item(idx);
            String tempIdNodeVal = XercesUtils.getAttributeValue(tempIdNode, XMLID);
            if (tempIdNodeVal != null && tempIdNodeVal.indexOf(SOFT_TEMP_PLACEHOLDER_ID_PREFIX) != -1) {
                String updatedIdAttrVal = tempIdNodeVal.replace(SOFT_TEMP_PLACEHOLDER_ID_PREFIX, EMPTY_STRING);
                XercesUtils.addAttribute(tempIdNode, XMLID, updatedIdAttrVal);
                coEditionContext.addUpdatedElement(tempIdNodeVal, tempIdNode.getNodeName(), nodeToString(tempIdNode), null);
            }
        }
    }

    private boolean isTrackChangesEnabled() {
        return trackChangesContext != null && trackChangesContext.isTrackChangesEnabled();
    }

    private boolean isClonedProposal() {
        return cloneContext != null && cloneContext.isClonedProposal();
    }

    private Node buildHeadingNode(Node node, TableOfContentItemVO tocVo, User user) {
        Node headingNode = XmlContentProcessorHelper.extractOrBuildHeaderElement(node, tocVo, user);
        if (isTrackChangesEnabled()) {
            XmlContentProcessorHelper.addUserInfoIfContentHasChanged(getFirstChild(node, HEADING), headingNode, user);
        }
        return headingNode;
    }

    private Node buildNumNode(Node node, TableOfContentItemVO tocVo) {
        Node numNode = XmlContentProcessorHelper.extractOrBuildNumElement(node, tocVo);
        if (!isTrackChangesEnabled() && XercesUtils.containsAttributeWithValue(numNode, LEOS_ORIGIN_ATTR, LS)) {
            // On TOC drag & drop there´s no clone context (request scope) and then items are added with
            // soft action ADD and origin LS on no cloned proposals.
            XercesUtils.removeAttribute(numNode, LEOS_ORIGIN_ATTR);
        }
        return numNode;
    }
}