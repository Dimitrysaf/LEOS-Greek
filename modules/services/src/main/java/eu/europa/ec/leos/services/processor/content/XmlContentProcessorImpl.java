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

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.base.Stopwatch;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.SoftActionType;
import eu.europa.ec.leos.model.annex.LevelItemVO;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.dto.coedition.CoEditionContext;
import eu.europa.ec.leos.services.dto.document.SpecificDocumentInformationDTO;
import eu.europa.ec.leos.services.label.ReferenceLabelService;
import eu.europa.ec.leos.services.label.ref.Ref;
import eu.europa.ec.leos.services.numbering.depthBased.ClassToDepthType;
import eu.europa.ec.leos.services.structure.StructureService;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.support.EditableAttributeValue;
import eu.europa.ec.leos.services.support.IdGenerator;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.support.XmlUtils;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.template.TemplateConfigurationService;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.util.LeosDomainUtil;
import eu.europa.ec.leos.vo.structure.AknTag;
import eu.europa.ec.leos.vo.structure.Attribute;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.services.utils.StructureConfigUtils;
import eu.europa.ec.leos.vo.structure.RefConfig;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.structure.TocItem;
import eu.europa.ec.leos.vo.structure.TocItemTypeName;
import io.atlassian.fugue.Pair;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.Validate;
import org.apache.commons.lang3.tuple.ImmutableTriple;
import org.apache.commons.text.StringEscapeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import jakarta.inject.Provider;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static eu.europa.ec.leos.services.compare.ContentComparatorService.ATTR_NAME;
import static eu.europa.ec.leos.services.compare.ContentComparatorService.CONTENT_SOFT_ADDED_CLASS;
import static eu.europa.ec.leos.services.processor.content.TableOfContentHelper.isElementInToc;
import static eu.europa.ec.leos.services.processor.content.XmlContentProcessorHelper.isSoftAdded;
import static eu.europa.ec.leos.services.processor.content.XmlContentProcessorHelper.isSoftDeletedOrMovedTo;
import static eu.europa.ec.leos.services.support.LeosXmlUtils.getTitleValue;
import static eu.europa.ec.leos.services.support.XmlUtils.*;
import static eu.europa.ec.leos.services.support.XmlHelper.*;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.normalizeSpace;
import static org.apache.commons.text.StringEscapeUtils.escapeXml10;

public abstract class XmlContentProcessorImpl implements XmlContentProcessor {

    private static final Logger LOG = LoggerFactory.getLogger(XmlContentProcessorImpl.class);

    public static final String NBSP = "\u00a0";
    public static final String[] NUMBERED_AND_LEVEL_ITEMS = {PARAGRAPH, POINT, LEVEL, INDENT};
    private static final String INSERT_TAG = "ins";
    private static final String LEOS_UID_PREFIX = " leos:uid=\"";
    private static final String LEOS_TITLE_PREFIX = " leos:title=\"";
    private static final String INS_END_TAG = "</ins>";
    private static final String INS_START_TAG = "<ins ";
    private static final String BACKSLASH_QUOTE = "\"";

    @Autowired
    private CloneContext cloneContext;
    @Autowired
    protected ReferenceLabelService referenceLabelService;
    @Autowired
    protected MessageHelper messageHelper;
    @Autowired
    protected Provider<StructureContext> structureContextProvider;
    @Autowired
    protected TableOfContentProcessor tableOfContentProcessor;
    @Autowired
    protected SecurityContext securityContext;
    @Autowired
    protected XPathCatalog xPathCatalog;
    @Autowired
    protected UserService userService;
    @Autowired
    protected TrackChangesContext trackChangesContext;
    @Autowired
    protected CoEditionContext coEditionContext;
    @Autowired
    protected DocumentLanguageContext documentLanguageContext;
    @Autowired
    protected StructureService structureService;
    @Autowired
    protected TemplateConfigurationService templateConfigurationService;

    @Override
    public byte[] addTrackChangesAttributesForMovedElement(byte[] xmlContent, String elementId, SoftActionType direction, String trackUser, String softUser,
                                                           String title) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, direction.equals(SoftActionType.MOVE_TO) ? SOFT_DELETE_PLACEHOLDER_ID_PREFIX + elementId : elementId);
        if (node != null) {
            addAttribute(node, LEOS_UID, trackUser);
            addAttribute(node, LEOS_TITLE, title);
            addAttribute(node, LEOS_SOFT_ACTION_ROOT_ATTR, "true");
            if (direction.equals(SoftActionType.MOVE_FROM)) {
                if (Arrays.asList(PART, TITLE, CHAPTER, SECTION, ARTICLE).contains(node.getNodeName())) {
                    removeAttribute(node, LEOS_UID);
                }
                removeAttribute(node, LEOS_ACTION_ATTR);
                addAttribute(node, LEOS_SOFT_ACTION_ATTR, SoftActionType.MOVE_FROM.getSoftAction());
                addAttribute(node, LEOS_SOFT_MOVE_FROM, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + elementId);
                addAttribute(node, LEOS_SOFT_USER_ATTR, softUser);
            } else if (direction.equals(SoftActionType.MOVE_TO)) {
                addAttribute(node, LEOS_ACTION_ATTR, LEOS_TC_DELETE_ACTION);
                addAttribute(node, LEOS_SOFT_ACTION_ATTR, SoftActionType.MOVE_TO.getSoftAction());
                addAttribute(node, LEOS_SOFT_MOVE_TO, elementId);
                addAttribute(node, XMLID, SOFT_MOVE_PLACEHOLDER_ID_PREFIX + elementId);
            }
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] addTrackChangesAttributes(byte[] xmlContent) {
        if(!trackChangesContext.isTrackChangesEnabled()) {
            return  xmlContent;
        }
        Document document = createDocument(xmlContent);
        List<Node> nodeList = XmlUtils.getDescendants(document, ELEMENTS_IN_TOC);
        for (int i = 0; i < nodeList.size(); i++) {
            final Node node = nodeList.get(i);
            addAttribute(node, LEOS_UID, securityContext.getUser().getLogin());
            addAttribute(node, LEOS_TITLE, getTitleValue(securityContext));
            addAttribute(node, LEOS_ACTION_ATTR, LEOS_TC_INSERT_ACTION);
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] addTrackChangesAttributes(byte[] xmlContent, String elementId) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(xmlContent, elementId);
        if (node != null) {
            addAttribute(node, LEOS_UID, securityContext.getUser().getLogin());
            addAttribute(node, LEOS_TITLE, getTitleValue(securityContext));
            addAttribute(node, LEOS_ACTION_ATTR, LEOS_TC_INSERT_ACTION);
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] anonymizeTrackChanges(byte[] xmlContent) {
        Document document = createDocument(xmlContent);
        NodeList elements = XmlUtils.getElementsByXPath(document, xPathCatalog.getXPathTrackChanges());
        for (int i = 0; i < elements.getLength(); i++) {
            Node element = elements.item(i);
            NamedNodeMap attributes = element.getAttributes();
            Node uid = attributes.getNamedItem(LEOS_UID);
            uid.setNodeValue(LEOS_ANONYMOUS.toLowerCase());
            Node title = attributes.getNamedItem(LEOS_TITLE);
            title.setNodeValue(LEOS_ANONYMOUS + " " + title.getTextContent().substring(title.getTextContent().indexOf(":")));
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] cleanTrackChanges(byte[] xmlContent) {
        Document document = createDocument(xmlContent);
        cleanTrackChangesForElement(document);
        return nodeToByteArray(document);
    }

    @Override
    public byte[] cleanTrackChanges(byte[] xmlContent, String elementId) {
        Document document = createDocument(xmlContent);
        Node element = XmlUtils.getElementById(document, elementId);
        if (element != null) {
            cleanTrackChangesForElement(element);
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] cleanSoftActions(byte[] xmlContent) {
        Document document = createDocument(xmlContent);
        cleanSoftActionForElement(document);
        return nodeToByteArray(document);
    }

    private void cleanSoftActionForElement(Node node) {
        NodeList nodeList = node.getChildNodes();
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node childNode = nodeList.item(i);
            if (childNode.getNodeType() != Node.TEXT_NODE) {
                boolean isNodeDeleted = doCleanSoftAction(childNode);
                if (isNodeDeleted) {
                    i--;
                }
                cleanSoftActionForElement(childNode);
            }
        }
    }

    @Override
    public byte[] cleanSoftActionsAndRemoveMiscAttributes(byte[] xmlContent) {
        Document document = createDocument(xmlContent);
        cleanSoftActionAndRemoveMiscAttributesForElement(document);
        return nodeToByteArray(document);
    }

    private void cleanSoftActionAndRemoveMiscAttributesForElement(Node node) {
        NodeList nodeList = node.getChildNodes();
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node childNode = nodeList.item(i);
            if (childNode.getNodeType() != Node.TEXT_NODE) {
                boolean isNodeDeleted = doCleanSoftAction(childNode);
                if (isNodeDeleted) {
                    i--;
                }
                removeMiscAttributes(childNode);
                cleanSoftActionAndRemoveMiscAttributesForElement(childNode);
            }
        }
    }

    private boolean doCleanSoftAction(Node node) {
        SoftActionType softAction = getSoftAction(node);
        if (softAction != null) {
            switch (softAction) {
                case MOVE_FROM:
                    cleanSoftActionAttributes(node);
                    cleanMoveFromAttributes(node);
                    break;
                case ADD:
                case TRANSFORM:
                case UNDELETE:
                    cleanSoftActionAttributes(node);
                    break;
                case MOVE_TO:
                case DELETE:
                    XmlUtils.deleteElement(node);
                    return true;
            }
        }
        return false;
    }

    private SoftActionType getSoftAction(Node node) {
        SoftActionType softActionType = null;
        String tagName = node.getNodeName();
        String attrVal = getAttributeValue(node, LEOS_SOFT_ACTION_ATTR);
        if (!isExcludedNode(tagName) && attrVal != null) {
            softActionType = SoftActionType.of(attrVal);
        }
        return softActionType;
    }

    private void cleanSoftActionAttributes(Node node) {
        removeAttribute(node, LEOS_SOFT_ACTION_ATTR);
        removeAttribute(node, LEOS_SOFT_ACTION_ROOT_ATTR);
        removeAttribute(node, LEOS_SOFT_USER_ATTR);
        removeAttribute(node, LEOS_SOFT_DATE_ATTR);
    }

    private void cleanMoveFromAttributes(Node node) {
        removeAttribute(node, LEOS_SOFT_MOVED_LABEL_ATTR);
        removeAttribute(node, LEOS_SOFT_MOVE_FROM);
        removeAttribute(node, LEOS_SOFT_MOVE_TO);
    }

    @Override
    public byte[] cleanMiscAttributes(byte[] xmlContent) {
        Document document = createDocument(xmlContent);
        cleanMiscAttributesForChildren(document);
        return nodeToByteArray(document);
    }

    private void cleanMiscAttributesForChildren(Node node) {
        NodeList nodeList = node.getChildNodes();
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node childNode = nodeList.item(i);
            if (childNode.getNodeType() != Node.TEXT_NODE) {
                removeMiscAttributes(childNode);
                cleanMiscAttributesForChildren(childNode);
            }
        }
    }

    private void removeMiscAttributes(Node node) {
        if(XmlUtils.containsAttributeWithValue(node, LEOS_ORIGIN_ATTR, EC)) {
            removeAttribute(node, LEOS_ORIGIN_ATTR);
        }
        removeAttribute(node, LEOS_DEPTH_ATTR);
        removeAttribute(node, LEOS_EDITABLE_ATTR);
        removeAttribute(node, LEOS_DELETABLE_ATTR);
    }

    @Override
    public byte[] cleanSoftActionsForNode(byte[] xmlContent, List<TocItem> tocItemList) {
        Document document = createDocument(xmlContent);
        cleanSoftActionsForNode(document, tocItemList);
        return nodeToByteArray(document);
    }

    private void cleanSoftActionsForNode(Node node, List<TocItem> tocItemList) {
        Node childNode = node.getFirstChild().getFirstChild();
        if (childNode.getNodeType() != Node.TEXT_NODE) {
            cleanSoftActionAttributes(childNode);
            cleanMoveFromAttributes(childNode);
            removeAttribute(childNode, LEOS_ORIGIN_ATTR);
            TocItem tocItem = StructureConfigUtils.getTocItemByName(tocItemList, childNode.getNodeName());
            if(tocItem != null && tocItem.isEditable()) {
                insertOrUpdateAttributeValue(childNode, LEOS_EDITABLE_ATTR, "true");
            }
            insertOrUpdateAttributeValue(childNode, LEOS_DELETABLE_ATTR, "true");
        }
    }

    @Override
    public byte[] createDocumentContentWithNewTocList(List<TableOfContentItemVO> tableOfContentItemVOs, byte[] content, User user,
            boolean isTrackChangesEnabled) {
        LOG.trace("Start building the document content for the new toc list");
        long startTime = System.currentTimeMillis();
        List<TocItem> tocItems = structureContextProvider.get().getTocItems();
        List<NumberingConfig> numberingConfigs = structureContextProvider.get().getNumberingConfigs();
        Map<TocItem, List<TocItem>> tocRules = structureContextProvider.get().getTocRules();

        Document document = createDocument(content);
        for (TableOfContentItemVO tocVo : tableOfContentItemVOs) {
            Node node = navigateToTocElement(tocVo, document);
            LOG.trace("Build content for parent TOC item '{}', node '{}'", tocVo.getTagName(), node.getNodeName());
            Node newNode = buildTocItemContent(tocItems, numberingConfigs, tocRules, document, null, tocVo, user, isTrackChangesEnabled);
            newNode = importNodeInDocument(document, newNode);
            XmlUtils.replaceElement(newNode, node);
        }

        LOG.trace("Build the document content for the new toc list completed in {} ms", (System.currentTimeMillis() - startTime));
        return nodeToByteArray(document);
    }

    private Node navigateToTocElement(TableOfContentItemVO tocVo, Node document) {
        return getFirstElementByName(document, tocVo.getTagName().value());
    }

    protected abstract Node buildTocItemContent(List<TocItem> tocItems, List<NumberingConfig> numberingConfigs, Map<TocItem, List<TocItem>> tocRules,
            Document document, Node parentNode, TableOfContentItemVO tocVo, User user, boolean isTrackChangesEnabled);

    @Override
    public String getElementValue(byte[] xmlContent, String xPath, boolean namespaceEnabled) {
        Document document = createDocument(xmlContent, namespaceEnabled);
        Node node = XmlUtils.getFirstElementByXPath(document, xPath, namespaceEnabled);
        String elementValue = null;
        if (node != null) {
            elementValue = node.getTextContent();
        }
        return elementValue;
    }

    @Override
    public boolean evalXPath(byte[] xmlContent, String xPath, boolean namespaceEnabled) {
        Document document = createDocument(xmlContent, namespaceEnabled);
        return XmlUtils.evalXPath(document, xPath, namespaceEnabled);
    }

    @Override
    public int getElementCountByXpath(byte[] xmlContent, String xPath, boolean namespaceEnabled){
        Document document = createDocument(xmlContent, namespaceEnabled);
        return XmlUtils.getElementCountByXpath(document, xPath, namespaceEnabled);
    }

    @Override
    public Node getElementByXpath(byte[] xmlContent, String xPath) {
        Document document = createDocument(xmlContent);
        return XmlUtils.getFirstElementByXPath(document, xPath);
    }

    @Override
    public String getAttributeValueByXpath(byte[] xmlContent, String xPath, String attrName) {
        Node node = getElementByXpath(xmlContent, xPath);
        String docType = null;
        if (node != null) {
            docType = getAttributeValue(node, attrName);
        }
        return docType;
    }

    @Override
    public String getDocReference(byte[] content) {
        String aknFirstChildXPath = xPathCatalog.getXPathAkomaNtosoFirstChild();
        return getAttributeValueByXpath(content, aknFirstChildXPath, XML_NAME);
    }

    @Override
    public byte[] removeElement(byte[] xmlContent, String xPath, boolean namespaceEnabled) {
        Document document = createDocument(xmlContent, namespaceEnabled);
        XmlUtils.deleteElementsByXPath(document, xPath, namespaceEnabled);
        return nodeToByteArray(document);
    }

    @Override
    public byte[] insertElement(byte[] xmlContent, String xPath, boolean namespaceEnabled, String newContent) {
        Document document = createDocument(xmlContent, namespaceEnabled);
        Node node = XmlUtils.getFirstElementByXPath(document, xPath, namespaceEnabled);
        if (node != null) {
            Node newNode = createNodeFromXmlFragment(document, newContent.getBytes(UTF_8), false);
            addSibling(newNode, node, false);
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] replaceElement(byte[] xmlContent, String xPath, boolean namespaceEnabled, String newContent) {
        Document document = createDocument(xmlContent, namespaceEnabled);  //TODO remove the boolean, always coming as true
        Node node = XmlUtils.getFirstElementByXPath(document, xPath, namespaceEnabled);
        if (node != null) {
            node = XmlUtils.replaceElement(node, newContent);
            xmlContent = nodeToByteArray(node);
        }
        return xmlContent;
    }

    @Override
    public byte[] replaceElementById(byte[] xmlContent, String newContent, String elementId, boolean doPostProcessing) {
        Document document = createDocument(xmlContent);
        Node elementNode = XmlUtils.getElementById(document, elementId);

        if (elementNode != null) {
            Document documentNode = (Document) XmlUtils.replaceElement(elementNode, newContent);
            if (doPostProcessing) documentNode = doXMLPostProcessingOnDocument(nodeToByteArray(documentNode));
            xmlContent = processUnnumberedParagraph(documentNode, newContent, elementId);
        }
        return xmlContent;
    }

    private byte[] processUnnumberedParagraph(Document updatedDocument , String newContent, String elementId) {
        byte [] xmlContent = nodeToByteArray(updatedDocument);
        if (newContent.startsWith(PARA_OPEN_TAG) && newContent.contains(LIST_CLOSE)) {
            Document newNode = createDocument(newContent.getBytes(StandardCharsets.UTF_8), false);
            if (newNode.getDocumentElement().getTagName().equals(PARAGRAPH)
                    && getFirstChild(getFirstChild(newNode), NUM) == null) {
                Node updatedNode = XmlUtils.getElementById(updatedDocument, elementId);
                if(updatedNode != null) {
                    String updatedNodeContent = removeAllNameSpaces(nodeToString(updatedNode));
                    List<Node> nodeList = getChildren(updatedNode);
                    for (int i = 0; i < nodeList.size(); i++) {
                        String childNodeContent = removeAllNameSpaces(nodeToString(nodeList.get(i)));
                        if (nodeList.get(i).getNodeName().equals(LIST)) {
                            if (i == 0) {
                                updatedNodeContent = updatedNodeContent.replace(childNodeContent, childNodeContent + PARA_END);
                            } else {
                                updatedNodeContent = updatedNodeContent.replace(childNodeContent, PARA_START + childNodeContent + PARA_END);
                            }
                        } else if (nodeList.get(i).getNodeName().equals(SUBPARAGRAPH)) {
                            if (i == 0) {
                                updatedNodeContent = updatedNodeContent.replace(childNodeContent, childNodeContent.replaceFirst(SUBPARA_REGEX, "").replace(SUBPARA_END, PARA_END));
                            } else {
                                updatedNodeContent = updatedNodeContent.replace(childNodeContent, childNodeContent.replace("<" + SUBPARAGRAPH, "<" + PARAGRAPH).replace(SUBPARA_END, PARA_END));
                            }
                        }
                        updatedNodeContent = updatedNodeContent.replaceAll(PARA_END + "[^<|>]*" + PARA_END, PARA_END);
                    }
                    Node updatedDocumentNode = XmlUtils.replaceElement(updatedNode, updatedNodeContent);
                    xmlContent = nodeToByteArray(updatedDocumentNode);
                }
            }
        }
        return xmlContent;
    }

    private List<Node> findAllNodesInGroup(Node parent, String groupValue) {
        List<Node> nodeList = new ArrayList<>();
        for(int i = 0; i < parent.getChildNodes().getLength(); i++) {
            Node child = parent.getChildNodes().item(i);
            if(hasAttributeWithValue(child, LEOS_GROUP, groupValue)) {
                nodeList.add(child);
            }
        }
        return nodeList;
    }

    private String findNextGroupNumber(Node node) {
        int groupNumber = 0;
        List<Node> nodesWithGroup = getDescendantsWithAttribute(node, LEOS_GROUP);
        for(Node child : nodesWithGroup) {
            int childGroupNumber = Integer.parseInt(getAttributeValue(child, LEOS_GROUP));
            if(childGroupNumber > groupNumber) {
                groupNumber = childGroupNumber;
            }
        }
        return String.valueOf(groupNumber + 1);
    }

    @Override
    public byte[] repeatGroup(byte[] xmlContent, String idAttributeValue, boolean before, boolean isTrackChangesEnabled) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, idAttributeValue);
        if (node != null) {
            List<Node> nodeList = findAllNodesInGroup(node.getParentNode(), getAttributeValue(node, LEOS_GROUP));
            String newGroupNumber = findNextGroupNumber(document);
            Node targetNode = before ? nodeList.get(0) : nodeList.get(nodeList.size()-1);
            for(int i = 0; i < nodeList.size(); i++) {
                Node nodeToClone = nodeList.get(i);
                Node newNode = createNodeFromXmlFragment(document, nodeToByteArray(nodeToClone), false);
                XmlUtils.removeAttributeRecursively(newNode, XMLID);
                addAttribute(newNode, LEOS_REPEATED_ATTR, "true");
                addAttribute(newNode, LEOS_GROUP, newGroupNumber);
                addSibling(newNode, targetNode, before);

                if (isTrackChangesEnabled) {
                    addAttribute(newNode, LEOS_ACTION_ATTR, "insert");
                    addAttribute(newNode, LEOS_UID, securityContext.getUser().getLogin());
                    addAttribute(newNode, LEOS_TITLE, getTitleValue(securityContext));
                }

                if(!before) {
                    targetNode = newNode;
                }
            }
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] repeatElement(byte[] xmlContent, String idAttributeValue, boolean before, boolean isTrackChangesEnabled) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, idAttributeValue);
        if (node != null) {
            Node newNode = createNodeFromXmlFragment(document, nodeToByteArray(node), false);
            XmlUtils.removeAttributeRecursively(newNode, XMLID);
            addAttribute(newNode, LEOS_REPEATED_ATTR, "true");
            addSibling(newNode, node, before);

            if (isTrackChangesEnabled) {
                addAttribute(newNode, LEOS_ACTION_ATTR, "insert");
                addAttribute(newNode, LEOS_UID, securityContext.getUser().getLogin());
                addAttribute(newNode, LEOS_TITLE, getTitleValue(securityContext));
            }
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] insertElementByTagNameAndId(byte[] xmlContent, String elementTemplate, String tagName, String idAttributeValue, boolean before, boolean isTrackChangesEnabled) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, idAttributeValue);
        if (node != null) {
            Node newNode = createNodeFromXmlFragment(document, elementTemplate.getBytes(UTF_8), false);
            if (XmlUtils.isListIntro(node) && before) {
                addSibling(newNode, node.getParentNode(), before);
            } else if (XmlUtils.isListIntro(node) && !before) {
                node.getParentNode().getParentNode().insertBefore(node, node.getParentNode());
                removeAttribute(node, REFERS_TO_ATTR);
                node.getParentNode().insertBefore(newNode, node.getParentNode().getFirstChild());
                addAttribute(newNode, REFERS_TO_ATTR, INTRODUCTORY_PART);
            } else if (XmlUtils.isListWrapper(node) && !before) {
                addSibling(newNode, node.getParentNode(), before);
            } else if (XmlUtils.isListWrapper(node) && before) {
                Node nextSiblingOfParent = getNextSibling(node.getParentNode());
                if (nextSiblingOfParent == null) {
                    node.getParentNode().getParentNode().appendChild(node);
                } else {
                    node.getParentNode().getParentNode().insertBefore(node, nextSiblingOfParent);
                }
                removeAttribute(node, REFERS_TO_ATTR);
                node.getParentNode().appendChild(newNode);
                addAttribute(newNode, REFERS_TO_ATTR, ENDING_PART);
            }
            addSibling(newNode, node, before);

            if (isTrackChangesEnabled) {
                addAttribute(newNode, LEOS_ACTION_ATTR, "insert");
                addAttribute(newNode, LEOS_UID, securityContext.getUser().getLogin());
                addAttribute(newNode, LEOS_TITLE, getTitleValue(securityContext));
            }
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] insertElementByTagNameAndIdWithoutCheckOnIntro(byte[] xmlContent, String elementTemplate, String idAttributeValue,
                                                                 boolean before, boolean isTrackChangesEnabled) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, idAttributeValue);
        if (node != null) {
            Node newNode = createNodeFromXmlFragment(document, elementTemplate.getBytes(UTF_8), false);
            addSibling(newNode, node, before);

            if (isTrackChangesEnabled) {
                addAttribute(newNode, LEOS_ACTION_ATTR, "insert");
                addAttribute(newNode, LEOS_UID, securityContext.getUser().getLogin());
                addAttribute(newNode, LEOS_TITLE, getTitleValue(securityContext));
            }
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] addChildToParent(byte[] xmlContent, String elementContent, String parentId) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, parentId);
        if (node != null) {
            Node newNode = createNodeFromXmlFragment(document, elementContent.getBytes(UTF_8), false);
            node.appendChild(newNode);
        }
        return nodeToByteArray(document);
    }

    @Override
    public String getElementByNameAndId(byte[] xmlContent, String tagName, String idAttributeValue) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementByNameAndId(document, tagName, idAttributeValue);
        String elementAsString = null;
        if (node != null) {
            elementAsString = nodeToString(node);
            elementAsString = removeAllNameSpaces(elementAsString);
        }
        return elementAsString;
    }

    @Override
    public String getParentTagNameById(byte[] xmlContent, String idAttributeValue) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, idAttributeValue);
        return XmlUtils.getParentTagName(node);
    }

    @Override
    public String getParentIdById(byte[] xmlContent, String idAttributeValue) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, idAttributeValue);
        return getParentId(node);
    }

    @Override
    public String getElementAttributeValueByNameAndId(byte[] xmlContent, String attributeName, String tagName, String idAttributeValue) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementByNameAndId(document, tagName, idAttributeValue);
        String attrVal = "false";
        if (node != null) {
            String nodeAttrVal = getAttributeValue(node, attributeName);
            if (nodeAttrVal != null) {
                attrVal = nodeAttrVal;
            }
        }
        return attrVal;
    }

    @Override
    public Element getParentElement(byte[] xmlContent, String idAttributeValue) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, idAttributeValue);
        Element element = null;
        if (node != null) {
            element = getParentElement(node);
        }
        return element;
    }

    protected Element getParentElement(Node node) {
        Element element = null;
        Node parentNode = node.getParentNode();
        if (parentNode != null) {
            String elementTagName = parentNode.getNodeName();
            String parentId = getAttributeValue(parentNode, XMLID);
            if (parentId == null) {
                parentId = "";
            }
            String elementFragment = nodeToString(parentNode);
            element = new Element(parentId, elementTagName, elementFragment);
        }
        return element;
    }

    @Override
    public Boolean isListIntro(byte[] xmlContent, String idAttributeValue) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, idAttributeValue);
        if (node != null) {
            return XmlUtils.isListIntro(node);
        }
        return false;
    }

    @Override
    public Element getSiblingElement(byte[] xmlContent, String tagName, String idAttributeValue, List<String> elementTags, boolean before) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, idAttributeValue);
        Element element = null;
        if (node != null) {
            element = getSiblingElement(node, elementTags, before);
        }
        return element;
    }

    protected Element getSiblingElement(Node node, List<String> elementTags, boolean before) {
        Element element = null;
        Node sibling;
        // TODO: Workaround infinite loop in lists with intro
        boolean foundIntro = false;
        while ((sibling = XmlUtils.getSibling(node, before)) != null && !foundIntro && element == null) {
            String elementTagName = sibling.getNodeName();
            if (elementTags.contains(elementTagName) || elementTags.isEmpty()) {
                String elementId = getId(sibling) != null ? getId(sibling) : "";
                String elementFragment = nodeToString(sibling);
                element = new Element(elementId, elementTagName, elementFragment);
            }
            String refersTo = getAttributeValue(sibling, REFERS_TO_ATTR);
            foundIntro = refersTo != null && refersTo.equals(INTRODUCTORY_PART);
        }
        return element;
    }

    @Override
    public Element getChildElement(byte[] xmlContent, String tagName, String idAttributeValue, List<String> elementTags, int position) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, idAttributeValue);
        Element element = null;
        if (node != null) {
            List<Node> nodeList = getChildren(node);
            int childProcessed = 0;
            String elementTagName;
            for (int i = 0; i < nodeList.size(); i++) {
                node = nodeList.get(i);
                if (childProcessed < position) {
                    elementTagName = node.getNodeName();
                    if (elementTags.contains(elementTagName) || elementTags.isEmpty()) {
                        childProcessed++;
                        if (childProcessed == position) {
                            String elementId = getId(node) != null ? getId(node) : "";
                            String elementFragment = nodeToString(node);
                            element = new Element(elementId, elementTagName, elementFragment);
                        }
                    }
                }
            }
        }
        return element;
    }

    @Override
    public Element getFirstChildElement(byte[] xmlContent, String idAttributeValue) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, idAttributeValue);
        Element element = null;
        if (node != null) {
            node = getFirstChild(node);
            if (node != null) {
                String elementTagName = node.getNodeName();
                String elementId = getId(node) != null ? getId(node) : "";
                String elementFragment = nodeToString(node);
                element = new Element(elementId, elementTagName, elementFragment);
            }
        }
        return element;
    }

    @Override
    public Element getLastChildElement(byte[] xmlContent, String idAttributeValue) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, idAttributeValue);
        Element element = null;
        if (node != null) {
            node = getLastChild(node);
            if (node != null) {
                String elementTagName = node.getNodeName();
                String elementId = getId(node) != null ? getId(node) : "";
                String elementFragment = nodeToString(node);
                element = new Element(elementId, elementTagName, elementFragment);
            }
        }
        return element;
    }

    @Override
    public Element getLastChildElement(byte[] xmlContent, String tagName, String idAttributeValue, List<String> elementTags) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, idAttributeValue);
        Element element = null;
        if (node != null) {
            List<Node> nodeList = getChildren(node);
            String elementTagName;
            for (int i = 0; i < nodeList.size(); i++) {
                node = nodeList.get(i);
                elementTagName = node.getNodeName();
                if (elementTags.contains(elementTagName) || elementTags.isEmpty()) {
                    String elementId = getId(node) != null ? getId(node) : "";
                    String elementFragment = nodeToString(node);
                    element = new Element(elementId, elementTagName, elementFragment);
                }
            }
        }
        return element;
    }

    @Override
    public List<Map<String, String>> getElementsAttributesByPath(byte[] xmlContent, String xPath) {
        List<Map<String, String>> elementAttributesList = new ArrayList<>();
        Document document = createDocument(xmlContent);
        NodeList elements = XmlUtils.getElementsByXPath(document, xPath);
        for (int i = 0; i < elements.getLength(); i++) {
            Node element = elements.item(i);
            elementAttributesList.add(XmlUtils.getAttributes(element));
        }
        return elementAttributesList;
    }

    @Override
    public Map<String, String> getElementAttributesByPath(byte[] xmlContent, String xPath, boolean namespaceEnabled) {
        Map<String, String> attributes = new HashMap<>();
        Document document = createDocument(xmlContent, namespaceEnabled);
        Node element = XmlUtils.getFirstElementByXPath(document, xPath, namespaceEnabled);
        if (element != null) {
            attributes = XmlUtils.getAttributes(element);
        }
        return attributes;
    }

    protected Map<String, String> getElementAttributesByPath(Node node, String xPath) {
        Map<String, String> attributes = new HashMap<>();
        Node element = XmlUtils.getFirstElementByXPath(node, xPath);
        if (element != null) {
            attributes = XmlUtils.getAttributes(element);
        }
        return attributes;
    }

    @Override
    public String getElementContentFragmentByPath(byte[] xmlContent, String xPath, boolean namespaceEnabled) {
        Document document = createDocument(xmlContent, namespaceEnabled);
        XmlUtils.addLeosNamespace(document);
        Node element = XmlUtils.getFirstElementByXPath(document, xPath, namespaceEnabled);
        if (element != null) {
            return XmlUtils.getContentNodeAsXmlFragment(element);
        }
        return null;
    }

    @Override
    public String getElementFragmentByPath(byte[] xmlContent, String xPath, boolean namespaceEnabled) {
        Document document = createDocument(xmlContent, namespaceEnabled);
        XmlUtils.addLeosNamespace(document);
        Node element = XmlUtils.getFirstElementByXPath(document, xPath, namespaceEnabled);
        if (element != null) {
            return nodeToString(element);
        }
        return null;
    }

    public byte[] removeAttributeForAllChildren(byte[] xmlContent, String parentTag, List<String> elementTags, String attributeName) {
        Document document = createDocument(xmlContent);
        NodeList nodeList = XmlUtils.getElementsByName(document, parentTag);
        for (int nodeIndex = 0; nodeIndex < nodeList.getLength(); nodeIndex++) {
            Node node = nodeList.item(nodeIndex);
            List<Node> children = getChildren(node);
            for (int childIndex = 0; childIndex < children.size(); childIndex++) {
                removeAttributeFromNode(children.get(childIndex), elementTags, attributeName);
            }
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] setAttributeForAllChildren(byte[] xmlContent, String parentTag, List<String> elementTags, String attributeName, String value) {
        Document document = createDocument(xmlContent);
        NodeList nodeList = XmlUtils.getElementsByName(document, parentTag);
        for (int nodeIndex = 0; nodeIndex < nodeList.getLength(); nodeIndex++) {
            Node node = nodeList.item(nodeIndex);
            List<Node> children = getChildren(node);
            for (int childIndex = 0; childIndex < children.size(); childIndex++) {
                setAttribute(children.get(childIndex), elementTags, attributeName, value);
            }
        }
        return nodeToByteArray(document);
    }

    private static void removeAttributeFromNode(Node node, List<String> elementTags, String attrName) {
        String tagName = node.getNodeName();
        if (tagName.equals(META)) {
            return;
        }

        if (elementTags.contains(tagName) || elementTags.isEmpty()) {
            removeAttribute(node, attrName);
        }

        List<Node> children = getChildren(node);
        for (int i = 0; i < children.size(); i++) {
            removeAttributeFromNode(children.get(i), elementTags, attrName);
        }
    }

    private static void setAttribute(Node node, List<String> elementTags, String attrName, String attrValue) {
        String tagName = node.getNodeName();
        if (tagName.equals(META)) {
            return;
        }

        if (elementTags.contains(tagName) || elementTags.isEmpty()) {
            String val = getAttributeValue(node, attrName);
            if (val != null) {
                LOG.trace("Attribute {} already exists. Updating the value to {}", attrName, attrValue);
            }
            addAttribute(node, attrName, String.valueOf(attrValue));
        }

        List<Node> children = getChildren(node);
        for (int i = 0; i < children.size(); i++) {
            setAttribute(children.get(i), elementTags, attrName, attrValue);
        }
    }

    private void updatePointStructure(Node parentNode) {
        NodeList points = XmlUtils.getElementsByName(parentNode, POINT);
        for (int i = 0; i < points.getLength(); i++) {
            Node point = points.item(i);
            Node list = getFirstChild(point, LIST);
            if(list != null) {
                List<Node> level2Points = getChildren(list, POINT);
                List<Node> level2Indents = getChildren(list, INDENT);
                if((level2Points == null || level2Points.isEmpty()) && (level2Indents == null || level2Indents.isEmpty())) {
                    List<Node> alineas = getChildren(point, Arrays.asList(SUBPOINT, SUBPARAGRAPH));
                    if(alineas != null && alineas.size() == 1) {
                        Node alinea = alineas.get(0);
                        Node content = getFirstChild(alinea, CONTENT);
                        XmlUtils.replaceElement(content, alinea);
                    }
                    point.removeChild(list);
                }
            }
        }
    }

    private void updateParagraphStructure(Node parentNode) {
        NodeList paragraphs = XmlUtils.getElementsByName(parentNode, PARAGRAPH);
        for (int i = 0; i < paragraphs.getLength(); i++) {
            Node paragraph = paragraphs.item(i);
            Node list = getFirstChild(paragraph, LIST);
            if(list != null) {
                List<Node> level2Points = getChildren(list, POINT);
                List<Node> level2Indents = getChildren(list, INDENT);
                if((level2Points == null || level2Points.isEmpty()) && (level2Indents == null || level2Indents.isEmpty())) {
                    List<Node> subparagraphs = getChildren(paragraph, SUBPARAGRAPH);
                    if(subparagraphs != null && subparagraphs.size() == 1) {
                        Node subparagraph = subparagraphs.get(0);
                        Node content = getFirstChild(subparagraph, CONTENT);
                        XmlUtils.replaceElement(content, subparagraph);
                    }
                    paragraph.removeChild(list);
                }
            }
        }
    }

    @Override
    public void updateIfEmptyOrigin(Node node, boolean isEmptyOrigin){
    }

    @Override
    public void updateElementSplit(Node paragraph) {
    }

    @Override
    public byte[] doXMLPreProcessing(byte[] xmlContent) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        Document document = createDocument(xmlContent);
        updatePointStructure(document);
        updateParagraphStructure(document);
        long preProcessingTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);
        LOG.trace("Finished XML post processing: doXMLPostProcessing at {}ms", (System.currentTimeMillis() - preProcessingTime));
        return nodeToByteArray(document);
    }

    public void doXMLPostProcessingWithInternalRefs(Document document) {
        doXmlPostProcessingCommonWithInternalRefs(document);
        specificInstanceXMLPostProcessing(document);
        updatePointStructure(document);
        updateParagraphStructure(document);
    }

    private void doXmlPostProcessingCommonWithInternalRefs(Document document) {
        injectTagIdsInNode(document.getDocumentElement());
        modifyAuthorialNoteMarkers(document, 1);
        updateReferences(document);
        convertAlineasToSubparagraphs(document);
        moveSubparagraphsInList(document);
        updateMetaReferences(document.getFirstChild());
    }

    @Override
    public Document doXMLPostProcessingOnDocumentWithInternalRefs(byte[] xmlContent) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        Document document = doXmlPostProcessingCommonWithInternalRefs(xmlContent);

        specificInstanceXMLPostProcessing(document);
        updatePointStructure(document);
        updateParagraphStructure(document);
        long postProcessingTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        LOG.trace("Finished XML post processing: doXMLPostProcessing at {}ms",
                postProcessingTime, (System.currentTimeMillis() - postProcessingTime));
        return document;
    }

    private Document doXMLPostProcessingOnDocument(byte[] xmlContent) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        Document document = doXmlPostProcessingCommon(xmlContent);

        specificInstanceXMLPostProcessing(document);
        long postProcessingTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        LOG.trace("Finished XML post processing: doXMLPostProcessing at {}ms",
                postProcessingTime, (System.currentTimeMillis() - postProcessingTime));
        return document;
    }

    @Override
    public byte[] doXMLPostProcessingWithInternalRefs(byte[] xmlContent) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        Document document = doXmlPostProcessingCommonWithInternalRefs(xmlContent);

        specificInstanceXMLPostProcessing(document);
        updatePointStructure(document);
        updateParagraphStructure(document);
        long postProcessingTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        LOG.trace("Finished XML post processing: doXMLPostProcessing at {}ms", (System.currentTimeMillis() - postProcessingTime));
        return nodeToByteArray(document);
    }

    @Override
    public byte[] doXMLPostProcessingWithExternalRefs(byte[] xmlContent) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        Document document = doXmlPostProcessingCommonWithExternalRefs(xmlContent);

        specificInstanceXMLPostProcessing(document);
        updatePointStructure(document);
        updateParagraphStructure(document);
        long postProcessingTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        LOG.trace("Finished XML post processing: doXMLPostProcessing at {}ms", (System.currentTimeMillis() - postProcessingTime));
        return nodeToByteArray(document);
    }

    private void doXMLPostProcessing(Document document) {
        Stopwatch stopwatch = Stopwatch.createStarted();

        doXmlPostProcessingCommon(document);
        specificInstanceXMLPostProcessing(document);
        long postProcessingTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        LOG.trace("Finished XML post processing: doXMLPostProcessing at {}ms", (System.currentTimeMillis() - postProcessingTime));
    }

    @Override
    public byte[] doXMLPostProcessing(byte[] xmlContent) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        Document document = doXmlPostProcessingCommon(xmlContent);

        specificInstanceXMLPostProcessing(document);
        long postProcessingTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        LOG.trace("Finished XML post processing: doXMLPostProcessing at {}ms", (System.currentTimeMillis() - postProcessingTime));
        return nodeToByteArray(document);
    }

    private Document doXmlPostProcessingCommonWithInternalRefs(byte[] xmlContent) {
        long startTime = System.currentTimeMillis();
        Document document = createDocument(xmlContent);

        // Inject Ids
        Stopwatch stopwatch = Stopwatch.createStarted();
        injectTagIdsInNode(document.getDocumentElement());
        long injectIdTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        // modify Authnote markers
        modifyAuthorialNoteMarkers(document, 1);
        long authNoteTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        // update refs
        updateReferences(document);
        long mrefUpdateTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        // Convert alineas to subparagraphs
        convertAlineasToSubparagraphs(document);
        long convertAlineasToSubparagraphsTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        // Move subparagraphs as intro and conclusion
        moveSubparagraphsInList(document);
        updateMetaReferences(document.getFirstChild());
        long moveSubparagraphsInListTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        LOG.info("Finished doXMLPostProcessing: Ids Injected at {}ms, authNote Renumbering at {}ms, refs at {}ms, convert alineas to subparagraphs " +
                        "at {}ms, move subparagraphs as intro and conclusion at {}ms, Total time " +
                        "elapsed {}ms",
                injectIdTime, authNoteTime, mrefUpdateTime, convertAlineasToSubparagraphsTime, moveSubparagraphsInListTime,
                (System.currentTimeMillis() - startTime));
        return document;
    }


    private Document doXmlPostProcessingCommonWithExternalRefs(byte[] xmlContent) {
        long startTime = System.currentTimeMillis();
        Document document = createDocument(xmlContent);

        // Inject Ids
        Stopwatch stopwatch = Stopwatch.createStarted();
        injectTagIdsInNode(document.getDocumentElement());
        long injectIdTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        // modify Authnote markers
        modifyAuthorialNoteMarkers(document, 1);
        long authNoteTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        // update refs
        updateExternalReferences(document);
        long mrefUpdateTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        // Convert alineas to subparagraphs
        convertAlineasToSubparagraphs(document);
        long convertAlineasToSubparagraphsTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        // Move subparagraphs as intro and conclusion
        moveSubparagraphsInList(document);
        updateMetaReferences(document.getFirstChild());
        long moveSubparagraphsInListTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        LOG.info("Finished doXMLPostProcessing: Ids Injected at {}ms, authNote Renumbering at {}ms, refs at {}ms, convert alineas to subparagraphs " +
                        "at {}ms, move subparagraphs as intro and conclusion at {}ms, Total time " +
                        "elapsed {}ms",
                injectIdTime, authNoteTime, mrefUpdateTime, convertAlineasToSubparagraphsTime, moveSubparagraphsInListTime,
                (System.currentTimeMillis() - startTime));
        return document;
    }

    private void doXmlPostProcessingCommon(Document document) {
        long startTime = System.currentTimeMillis();

        // Inject Ids
        Stopwatch stopwatch = Stopwatch.createStarted();
        injectTagIdsInNode(document.getDocumentElement());
        long injectIdTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        // modify Authnote markers
        modifyAuthorialNoteMarkers(document, 1);
        long authNoteTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        // Move subparagraphs as intro and conclusion
        moveSubparagraphsInList(document);
        updateMetaReferences(document.getFirstChild());
        long moveSubparagraphsInListTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        LOG.info("Finished doXMLPostProcessing: Ids Injected at {}ms, authNote Renumbering at {}ms, move subparagraphs as intro and conclusion at {}ms, Total time " +
                        "elapsed {}ms",
                injectIdTime, authNoteTime, moveSubparagraphsInListTime,
                (System.currentTimeMillis() - startTime));
    }

    private Document doXmlPostProcessingCommon(byte[] xmlContent) {
        long startTime = System.currentTimeMillis();
        Document document = createDocument(xmlContent);

        // Inject Ids
        Stopwatch stopwatch = Stopwatch.createStarted();
        injectTagIdsInNode(document.getDocumentElement());
        long injectIdTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        // modify Authnote markers
        modifyAuthorialNoteMarkers(document, 1);
        long authNoteTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        // Move subparagraphs as intro and conclusion
        moveSubparagraphsInList(document);
        updateMetaReferences(document.getFirstChild());
        long moveSubparagraphsInListTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        LOG.info("Finished doXMLPostProcessing: Ids Injected at {}ms, authNote Renumbering at {}ms, move subparagraphs as intro and conclusion at {}ms, Total time " +
                        "elapsed {}ms",
                injectIdTime, authNoteTime, moveSubparagraphsInListTime,
                (System.currentTimeMillis() - startTime));
        return document;
    }

    public abstract void specificInstanceXMLPostProcessing(Node node);

    protected void updateNewElements(Node parentNode, String elementTagName, String subElementTagName, String origin) {
        NodeList elementsList = XmlUtils.getElementsByName(parentNode, elementTagName);
        for (int i = 0; i < elementsList.getLength(); i++) {
            Node node = elementsList.item(i);
            String elementOrigin = modifySubElement(node, origin);
            List<Node> subElements = getChildren(node, Arrays.asList(subElementTagName, LIST));
            for (int j = 0; j < subElements.size(); j++) {
                Node subElement = subElements.get(j);
                String subElementOrigin = getAttributeValue(subElement, LEOS_ORIGIN_ATTR);
                if (j == 0 && !is(subElement, LIST) && elementOrigin.equals(EC) && (subElementOrigin == null)) {
                    createTransformationNode(node, subElement);
                } else if (is(subElement, LIST)) {
                    List<Node> listSubElements = getChildren(subElement, subElementTagName);
                    for (int k = 0; k < listSubElements.size(); k++) {
                        Node listSubElement = listSubElements.get(k);
                        String listSubElementOrigin = getAttributeValue(listSubElement, LEOS_ORIGIN_ATTR);
                        String listSubElementSoftAction = getAttributeValue(listSubElement, LEOS_SOFT_ACTION_ATTR);
                        if (k==0 && j==0 && is(listSubElement, SUBPARAGRAPH) && elementOrigin.equals(EC) && (listSubElementOrigin == null
                                || !listSubElementOrigin.equals(EC))
                                && (listSubElementSoftAction == null
                                || isSoftAdded(listSubElement))) {
                            createTransformationNode(node, listSubElement);
                        } else {
                            modifySubElement(listSubElement, origin);
                        }
                    }
                } else {
                    modifySubElement(subElement, origin);
                }
                if (getAttributeValue(node, LEOS_INDENT_ORIGIN_TYPE_ATTR) == null) {
                    removeAttribute(node, LEOS_SOFT_TRANS_FROM);
                }
            }
        }
    }

    private void createTransformationNode(Node node, Node subElement) {
        final String elementId = getId(node);
        addAttribute(subElement, LEOS_SOFT_USER_ATTR, getSoftUserAttribute(securityContext.getUser()));
        addAttribute(subElement, LEOS_SOFT_DATE_ATTR, getDateAsXml());
        addAttribute(subElement, LEOS_ORIGIN_ATTR, EC);
        addAttribute(subElement, LEOS_SOFT_ACTION_ATTR, SoftActionType.TRANSFORM.getSoftAction());
        addAttribute(subElement, XMLID, SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX + elementId);
    }

    private boolean isIndented(Node node) {
        if (!hasAttribute(node, LEOS_INDENT_ORIGIN_TYPE_ATTR) && XmlUtils.getFirstChild(node, Arrays.asList(SUBPARAGRAPH, LIST)) != null) {
            Node firstSubParagraph = XmlUtils.getFirstDescendant(node, Arrays.asList(SUBPARAGRAPH));
            return (firstSubParagraph != null) && hasAttribute(firstSubParagraph, LEOS_INDENT_ORIGIN_TYPE_ATTR);
        }
        return hasAttribute(node, LEOS_INDENT_ORIGIN_TYPE_ATTR);
    }

    protected String modifySubElement(Node node, String parentOrigin) {

        String originOfDocument = getOriginOfDocument(node);
        String originAttr = getAttributeValue(node, LEOS_ORIGIN_ATTR);
        if (originAttr == null) {
            originAttr = parentOrigin;
        }

        if (originAttr.equals(parentOrigin) && !is(node, LIST)) {
            addAttribute(node, LEOS_ORIGIN_ATTR, originAttr);
            String softAction = getAttributeValue(node, LEOS_SOFT_ACTION_ATTR);
            if (softAction == null && !CN.equals(originOfDocument) && !is(node, MAIN_BODY) && !isIndented(node)) {
                addAttribute(node, LEOS_SOFT_ACTION_ATTR, SoftActionType.ADD.getSoftAction());
                addAttribute(node, LEOS_SOFT_USER_ATTR, getSoftUserAttribute(securityContext.getUser()));
                addAttribute(node, LEOS_SOFT_DATE_ATTR, getDateAsXml());
            }
        }
        return originAttr;
    }

    public byte[] convertAlineasInDocumentContent(byte[] xmlContent) {
        long startTime = System.currentTimeMillis();
        Document document = createDocument(xmlContent);

        // Convert alineas to subparagraphs
        Stopwatch stopwatch = Stopwatch.createStarted();
        convertAlineasToSubparagraphs(document);
        long convertAlineaToSubparagraphsTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        // Move subparagraphs as intros
        moveSubparagraphsInList(document);
        updateMetaReferences(document.getFirstChild());
        long moveSubparagraphsInListTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);


        LOG.trace("Finished conversion: Convert Alineas to Subparagraphs at {}ms, Move Subparagraphs as Intros at {}ms, Total time " +
                        "elapsed {}ms",
                convertAlineaToSubparagraphsTime, moveSubparagraphsInListTime, (System.currentTimeMillis() - startTime));
        return nodeToByteArray(document);
    }

    public boolean containsAlineas(Node node) {
        NodeList nodeList = XmlUtils.getElementsByName(node, SUBPOINT);
        return nodeList.getLength() > 0;
    }

    private void convertAlineasToSubparagraphs(Document document) {
        int nbAlineas = XmlUtils.getElementCountByXpath(document, "//akn:" + SUBPOINT, true);
        for (int i = 0; i < nbAlineas; i++) {
            Node alinea = getFirstElementByName(document, SUBPOINT);
            XmlUtils.renameNode(document, alinea, SUBPARAGRAPH);
        }
    }

    private void moveSubparagraphsInList(Node node) {
        NodeList nodeList = XmlUtils.getElementsByName(node, SUBPARAGRAPH);
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node subpara = nodeList.item(i);
            Node subparaParent = subpara.getParentNode();
            Node subparaParentSibbling = subparaParent.getNextSibling();
            Node pOfSubparagraph = getPOfSubparagraph(subpara);
            if (subpara.getAttributes().getNamedItem(REFERS_TO_ATTR) != null
                    && subpara.getAttributes().getNamedItem(REFERS_TO_ATTR).getNodeValue().equals(ENDING_PART)
                    && pOfSubparagraph != null && !pOfSubparagraph.getTextContent().trim().isEmpty()
                    && !Character.isLowerCase(pOfSubparagraph.getTextContent().trim().charAt(0))) {
                if (subparaParentSibbling != null) {
                    subparaParent.getParentNode().insertBefore(subpara, subparaParentSibbling);
                } else {
                    subparaParent.getParentNode().appendChild(subpara);
                }
            }
        }
        nodeList = XmlUtils.getElementsByName(node, SUBPARAGRAPH);
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node subpara = nodeList.item(i);
            Node nextSiblingList = getNextSibling(subpara);
            boolean moved = false;
            if (((!isSoftDeletedOrMovedTo(subpara) && !isSoftDeletedOrMovedTo(nextSiblingList)) || (isSoftDeletedOrMovedTo(subpara) && isSoftDeletedOrMovedTo(nextSiblingList)))
                    && nextSiblingList != null
                    && is(nextSiblingList, LIST)) {
                Node firstChildList = getFirstChild(nextSiblingList);
                if (firstChildList != null
                        && (!is(firstChildList, SUBPARAGRAPH) || isSoftDeletedOrMovedTo(firstChildList)) && (compareSoftAction(subpara,
                        nextSiblingList) || isSoftAdded(nextSiblingList))) {
                    nextSiblingList.insertBefore(subpara, nextSiblingList.getFirstChild());
                    moved = true;
                }
            }
            Node pOfSubparagraph = getPOfSubparagraph(subpara);
            if (!moved && pOfSubparagraph != null
                    && (subpara.getTextContent().isEmpty()
                    || (!pOfSubparagraph.getTextContent().trim().isEmpty()
                    && Character.isLowerCase(pOfSubparagraph.getTextContent().trim().charAt(0))))) {
                Node previousSiblingList = XmlUtils.getPrevSibling(subpara);
                if (previousSiblingList != null && is(previousSiblingList, LIST)
                        && ((!isSoftDeletedOrMovedTo(subpara) && !isSoftDeletedOrMovedTo(previousSiblingList))
                        || (isSoftDeletedOrMovedTo(subpara) && isSoftDeletedOrMovedTo(previousSiblingList)))) {
                    List<Node> children = getChildren(previousSiblingList);
                    Node lastChildList = children.size() > 0 ? children.get(children.size()-1) : null;
                    if (lastChildList != null && !is(lastChildList, SUBPARAGRAPH)) {
                        previousSiblingList.appendChild(subpara);
                    }
                }
            }
            if (is(subpara.getParentNode(), LIST)) {
                List<Node> children = getChildren(subpara.getParentNode());
                int index = children.indexOf(subpara);
                if (index == 0) {
                    addAttribute(subpara, REFERS_TO_ATTR, INTRODUCTORY_PART);
                } else if (index == children.size()-1) {
                    addAttribute(subpara, REFERS_TO_ATTR, ENDING_PART);
                } else if (index == children.size()-2 && is(children.get(index+1), SUBPARAGRAPH)) {
                    addAttribute(subpara, REFERS_TO_ATTR, ENDING_PART);
                    Node nextSibling = children.get(index+1);
                    removeAttribute(nextSibling, REFERS_TO_ATTR);
                    subpara.getParentNode().getParentNode().insertBefore(nextSibling, subpara.getParentNode().getNextSibling());
                } else if (index == 1 && is(children.get(0), SUBPARAGRAPH)) {
                    addAttribute(subpara, REFERS_TO_ATTR, INTRODUCTORY_PART);
                    Node prevSibling = children.get(0);
                    removeAttribute(prevSibling, REFERS_TO_ATTR);
                    subpara.getParentNode().getParentNode().insertBefore(prevSibling, subpara.getParentNode());
                }
            } else {
                removeAttribute(subpara, REFERS_TO_ATTR);
            }
        }
    }

    private static Node getPOfSubparagraph(Node subpara) {
        Node pText = XmlUtils.getFirstElementByXPath(subpara, "akn:content/akn:p");
        return pText != null ? pText : null;
    }

    private void injectTagIdsInNode(Node node) {
        String tagName = node.getNodeName();
        if (skipNodeAndChildren(tagName)) {// skipping node processing along with children
            return;
        }

        if (!skipNodeOnly(tagName)) {// do not update id for this tag
            String idAttrValue = getAttributeValue(node, XMLID);
            if (idAttrValue == null || idAttrValue.isEmpty()) {
                idAttrValue = IdGenerator.generateId();
                addAttribute(node, XMLID, idAttrValue);
            }
        }

        List<Node> children = getChildren(node);
        for (int i = 0; i < children.size(); i++) {
            injectTagIdsInNode(children.get(i));
        }
    }

    private void modifyAuthorialNoteMarkers(Node node, int markerNumber) {
        NodeList nodeList = XmlUtils.getElementsByName(node, AUTHORIAL_NOTE);

        for (int i = 0; i < nodeList.getLength(); i++) {
            Node child = nodeList.item(i);
            StringBuilder sb = new StringBuilder(5);
            sb.append('(').append(markerNumber++).append(')');
            addAttribute(child, MARKER_ATTRIBUTE, sb.toString());
            if(getAttributeValue(child, PLACEMENT) == null) {
                addAttribute(child, PLACEMENT, BOTTOM);
            }
        }
    }

    @Override
    public byte[] updateExternalReferencesOnAnnexesUpdate(byte[] xmlContent) {
        Document document = createDocument(xmlContent);
        updateExternalReferences(document);
        return nodeToByteArray(document);
    }

    @Override
    public byte[] updateReferencesOnImport(byte[] xmlContent, Map<String, String> refsMatching) {
        Document document = createDocument(xmlContent);
        updateReferencesOnImport(document, refsMatching);
        return nodeToByteArray(document);
    }

    private void updateReferencesOnImport(Document document, Map<String, String> refsMatching) {
        NodeList mrefList = XmlUtils.getElementsByName(document, MREF);
        for (int i = 0; i < mrefList.getLength(); i++) {
            Node mref = mrefList.item(i);
            List<Node> refs = getChildren(mref);
            for (Node ref: refs) {
                String href = getAttributeValue(ref, HREF);
                if (href != null) {
                    for (Map.Entry<String,String> refMatch : refsMatching.entrySet()) {
                        String newRef = refMatch.getKey();
                        String oldRef = refMatch.getValue();
                        href = href.replace(oldRef, newRef);
                    }
                    insertOrUpdateAttributeValue(ref, HREF, href);
                }
            }
        }
        updateReferences(document);
    }

    @Override
    public Pair<byte[], List<Element>> updateReferences(byte[] xmlContent) {
        Document document = createDocument(xmlContent);
        List<Element> updatedMrefs = updateReferences(document);
        if (!updatedMrefs.isEmpty()) {
            return new Pair<>(nodeToByteArray(document), updatedMrefs);
        } else {
            return new Pair<>(xmlContent, updatedMrefs);
        }
    }

    @Override
    public Pair<byte[], List<Element>> updateExternalReferences(byte[] xmlContent) {
        Document document = createDocument(xmlContent);
        List<Element> updatedMrefs = updateExternalReferences(document);
        if (!updatedMrefs.isEmpty()) {
            return new Pair<>(nodeToByteArray(document), updatedMrefs);
        } else {
            return new Pair<>(xmlContent, updatedMrefs);
        }
    }

    @Override
    public String updateReferences(String content, XmlDocument xmlDocument) {
        String wrappedContentXml = LeosDomainUtil.wrapXmlFragment(content);
        byte[] xmlContent = wrappedContentXml.getBytes(StandardCharsets.UTF_8);
        Document document = createDocument(xmlContent);
        Document sourceDoc = createDocument(xmlDocument.getContent().get().getSource().getBytes());
        if (updateReferences(document, sourceDoc)) {
            return nodeToString(document.getDocumentElement().getChildNodes().item(0));
        } else {
            return content;
        }
    }

    private List<Element> updateReferences(Document document) {
        List<Element> updatedMrefs = new ArrayList<>();
        String sourceRef = getContentByTagName(document, LEOS_REF);
        NodeList mrefList = XmlUtils.getElementsByName(document, MREF);
        boolean isRefConfigEnabled = isRefConfigEnabled(document, mrefList);

        HashMap<String, String> parentStatementsOfReferences = new HashMap<>();
        for (int i = 0; i < mrefList.getLength(); i++) {
            Node mref = mrefList.item(i);
            List<Ref> refs = findReferences(mref, sourceRef);
            if (!refs.isEmpty()) {
                boolean capital = false;
                String id = getAttributeValue(mref.getParentNode(), XMLID);
                String completeStatement = "";
                if (parentStatementsOfReferences.get(id) == null) {
                    completeStatement = mref.getParentNode().getTextContent();
                    parentStatementsOfReferences.put(id, completeStatement);
                } else {
                    completeStatement = parentStatementsOfReferences.get(id);
                }
                String pieceForCrossReference = mref.getTextContent();
                int positionOfCrossReference = completeStatement.indexOf(pieceForCrossReference);
                if (positionOfCrossReference <= 0) {
                    capital = true;
                } else {
                    int indexPositionBefore = positionOfCrossReference-1;
                    int charPositionBefore = completeStatement.charAt(indexPositionBefore);
                    while((charPositionBefore == 32 || charPositionBefore == 160) && indexPositionBefore > 0) {
                        indexPositionBefore--;
                        charPositionBefore = completeStatement.charAt(indexPositionBefore);
                    }
                    if (charPositionBefore == 32 || charPositionBefore == 160 || charPositionBefore == '.') {
                        capital = true;
                    }
                }
                completeStatement = StringUtils.replaceOnce(completeStatement, pieceForCrossReference, StringUtils.repeat("-", pieceForCrossReference.length()));
                parentStatementsOfReferences.put(id, completeStatement);

                if (isRefConfigEnabled) {
                    Result<String> labelResult;
                    if (refs.size() == 1 && refs.get(0).isDocNodeRef()) {
                        labelResult = referenceLabelService.generateRefLabelForDocNode(refs.get(0));
                    } else {
                        labelResult = referenceLabelService.generateLabel(refs, sourceRef, getParentId(mref), document, capital);
                    }
                    if (labelResult.isOk()) {
                        String childXml = XmlUtils.getContentNodeAsXmlFragment(mref);
                        String updatedMrefContent = labelResult.get();
                        if (!updatedMrefContent.replaceAll("\\s+", "").equals(childXml.replaceAll("\\s+", ""))) {
                            mref = XmlUtils.addContentToNode(mref, updatedMrefContent);
                            updatedMrefs.add(new Element(XmlUtils.getId(mref), MREF, nodeToString(mref)));
                        } else if (XmlUtils.hasAttributeWithValue(mref, LEOS_REF_BROKEN_ATTR, "true")) {
                            updatedMrefs.add(new Element(XmlUtils.getId(mref), MREF, nodeToString(mref)));
                        }
                        XmlUtils.removeAttribute(mref, LEOS_REF_BROKEN_ATTR);
                    } else if (!XmlUtils.hasAttribute(mref, LEOS_REF_BROKEN_ATTR)
                            || !XmlUtils.getAttributeValue(mref, LEOS_REF_BROKEN_ATTR).equals("true")) {
                        XmlUtils.addAttribute(mref, LEOS_REF_BROKEN_ATTR, "true");
                        updatedMrefs.add(new Element(XmlUtils.getId(mref), MREF, nodeToString(mref)));
                    }
                }
            }
        }
        return updatedMrefs;
    }

    private List<Node> getExternalReferences(Document document) {
        List<Node> externalReferences = new ArrayList<>();
        NodeList refList = XmlUtils.getElementsByXPath(document, XPathCatalog.getXPathExternalReferences());
        for (int i = 0; i < refList.getLength(); i++) {
            externalReferences.add(refList.item(i).getParentNode());
        }
        return externalReferences.stream().distinct().collect(Collectors.toList());
    }

    private List<Element> updateExternalReferences(Document document) {
        List<Element> updatedMrefs = new ArrayList<>();
        String sourceRef = getContentByTagName(document, LEOS_REF);
        List<Node> refList = getExternalReferences(document);

        HashMap<String, String> parentStatementsOfReferences = new HashMap<>();
        for (Node mref : refList) {
            List<Ref> refs = findReferences(mref, sourceRef);
            if (!refs.isEmpty()) {
                boolean capital = false;
                String id = getAttributeValue(mref.getParentNode(), XMLID);
                String completeStatement = "";
                if (parentStatementsOfReferences.get(id) == null) {
                    completeStatement = mref.getParentNode().getTextContent();
                    parentStatementsOfReferences.put(id, completeStatement);
                } else {
                    completeStatement = parentStatementsOfReferences.get(id);
                }
                String pieceForCrossReference = mref.getTextContent();
                int positionOfCrossReference = completeStatement.indexOf(pieceForCrossReference);
                if (positionOfCrossReference <= 0) {
                    capital = true;
                } else {
                    int indexPositionBefore = positionOfCrossReference - 1;
                    int charPositionBefore = completeStatement.charAt(indexPositionBefore);
                    while ((charPositionBefore == 32 || charPositionBefore == 160) && indexPositionBefore > 0) {
                        indexPositionBefore--;
                        charPositionBefore = completeStatement.charAt(indexPositionBefore);
                    }
                    if (charPositionBefore == 32 || charPositionBefore == 160 || charPositionBefore == '.') {
                        capital = true;
                    }
                }
                completeStatement = StringUtils.replaceOnce(completeStatement, pieceForCrossReference, StringUtils.repeat("-", pieceForCrossReference.length()));
                parentStatementsOfReferences.put(id, completeStatement);

                Result<String> labelResult;
                if (refs.size() == 1 && refs.get(0).isDocNodeRef()) {
                    labelResult = referenceLabelService.generateRefLabelForDocNode(refs.get(0));
                } else {
                    labelResult = referenceLabelService.generateLabel(refs, sourceRef, getParentId(mref), document, capital);
                }
                if (labelResult.isOk()) {
                    String childXml = XmlUtils.getContentNodeAsXmlFragment(mref);
                    String updatedMrefContent = labelResult.get();
                    if (!updatedMrefContent.replaceAll("\\s+", "").equals(childXml.replaceAll("\\s+", ""))) {
                        mref = XmlUtils.addContentToNode(mref, updatedMrefContent);
                        updatedMrefs.add(new Element(XmlUtils.getId(mref), MREF, nodeToString(mref)));
                    }
                    if (XmlUtils.hasAttributeWithValue(mref, LEOS_REF_BROKEN_ATTR, "true")) {
                        updatedMrefs.add(new Element(XmlUtils.getId(mref), MREF, nodeToString(mref)));
                    }
                    XmlUtils.removeAttribute(mref, LEOS_REF_BROKEN_ATTR);
                } else if (!XmlUtils.hasAttribute(mref, LEOS_REF_BROKEN_ATTR)
                        || !XmlUtils.getAttributeValue(mref, LEOS_REF_BROKEN_ATTR).equals("true")) {
                    XmlUtils.addAttribute(mref, LEOS_REF_BROKEN_ATTR, "true");
                    updatedMrefs.add(new Element(XmlUtils.getId(mref), MREF, nodeToString(mref)));
                }
            }
        }
        return updatedMrefs;
    }

    private boolean updateReferences(Document eltDoc, Document wholeDoc) {
        boolean updated = false;
        String sourceRef = getContentByTagName(wholeDoc, LEOS_REF);
        NodeList mrefList = XmlUtils.getElementsByName(eltDoc, MREF);
        boolean isRefConfigEnabled = isRefConfigEnabled(wholeDoc, mrefList);

        HashMap<String, String> parentStatementsOfReferences = new HashMap<>();
        for (int i = 0; i < mrefList.getLength(); i++) {
            Node mref = mrefList.item(i);
            List<Ref> refs = findReferences(mref, sourceRef);
            if (!refs.isEmpty()) {
                boolean capital = false;
                String id = getAttributeValue(mref.getParentNode(), XMLID);
                String completeStatement = "";
                if (parentStatementsOfReferences.get(id) == null) {
                    completeStatement = mref.getParentNode().getTextContent();
                    parentStatementsOfReferences.put(id, completeStatement);
                } else {
                    completeStatement = parentStatementsOfReferences.get(id);
                }
                String pieceForCrossReference = mref.getTextContent();
                int positionOfCrossReference = completeStatement.indexOf(pieceForCrossReference);
                if (positionOfCrossReference <= 0) {
                    capital = true;
                } else {
                    int indexPositionBefore = positionOfCrossReference-1;
                    int charPositionBefore = completeStatement.charAt(indexPositionBefore);
                    while((charPositionBefore == 32 || charPositionBefore == 160) && indexPositionBefore > 0) {
                        indexPositionBefore--;
                        charPositionBefore = completeStatement.charAt(indexPositionBefore);
                    }
                    if (charPositionBefore == 32 || charPositionBefore == 160 || charPositionBefore == '.') {
                        capital = true;
                    }
                }
                completeStatement = StringUtils.replaceOnce(completeStatement, pieceForCrossReference, StringUtils.repeat("-", pieceForCrossReference.length()));
                parentStatementsOfReferences.put(id, completeStatement);

                if (isRefConfigEnabled) {
                    Result<String> labelResult;
                    if (refs.size() == 1 && refs.get(0).isDocNodeRef()) {
                        labelResult = referenceLabelService.generateRefLabelForDocNode(refs.get(0));
                    } else {
                        labelResult = referenceLabelService.generateLabel(refs, sourceRef, getParentId(mref), wholeDoc, capital);
                    }
                    if (labelResult.isOk()) {
                        String childXml = XmlUtils.getContentNodeAsXmlFragment(mref);
                        String updatedMrefContent = labelResult.get();
                        if (!updatedMrefContent.replaceAll("\\s+", "").equals(childXml.replaceAll("\\s+", ""))) {
                            mref = XmlUtils.addContentToNode(mref, updatedMrefContent);
                            updated = true;
                        } else if (!updated) {
                            updated = hasAttributeWithValue(mref, LEOS_REF_BROKEN_ATTR, "true");
                        }
                        removeAttribute(mref, LEOS_REF_BROKEN_ATTR);
                    } else {
                        addAttribute(mref, LEOS_REF_BROKEN_ATTR, "true");
                        updated = true;
                    }
                }
            }
        }
        return updated;
    }

    public boolean isRefConfigEnabled(Document document, NodeList mrefList) {
        RefConfig refConfig = null;
        if (mrefList.getLength() > 0) {
            String docTemplate = XmlUtils.getElementsByXPath(document, xPathCatalog.getXPathDocTemplate()).item(0).getTextContent();
            List<RefConfig> refConfigs = structureService.getRefConfigs(docTemplate);
            if ((refConfigs != null) && !refConfigs.isEmpty()) {
                String language = XmlUtils.getElementsByXPath(document, xPathCatalog.getXPathDocLanguage()).item(0).getTextContent();
                refConfig = refConfigs.stream().filter(value -> value.getLanguage().equalsIgnoreCase(language) ||
                        value.getLanguage().equalsIgnoreCase("default")).findFirst().get();
            }
        }
        return ((refConfig != null) && refConfig.isInternalRef());
    }

    private void updateMetaReferences(Node node) {

        NodeList metaReferencesNodeList = XmlUtils.getElementsByXPath(node, xPathCatalog.getXPathMetaReferences(), true);
        Node metaReferences = metaReferencesNodeList.item(0);

        if (metaReferences != null) {

            NodeList subparagraphWithReferToINPAttributeNodeList = XmlUtils.getElementsByXPath(node,
                    xPathCatalog.getXPathSubparagraphWithReferToINPAttribute(), true);
            NodeList INPListNodes = XmlUtils.getElementsByXPath(node, xPathCatalog.getXPathMetaReferenceForINP(), true);
            if (subparagraphWithReferToINPAttributeNodeList.getLength() > 0) {
                if (INPListNodes.getLength() == 0) {
                    Node tclNode = createElement(node.getOwnerDocument(), TLC_CONCEPT, TLC_CONCEPT_INP_ID, EMPTY_STRING);
                    insertOrUpdateAttributeValue(tclNode, HREF, "http://publications.europa.eu/resource/authority/subdivision/INP");
                    insertOrUpdateAttributeValue(tclNode, XML_SHOW_AS, "introductory part");
                    metaReferences.appendChild(tclNode);
                }
            } else {
                for (int i = 0; i < INPListNodes.getLength(); i++) {
                    metaReferences.removeChild(INPListNodes.item(i));
                }
            }

            NodeList subparagraphWithReferToWRPAttributeNodeList = XmlUtils.getElementsByXPath(node,
                    xPathCatalog.getXPathSubparagraphWithReferToWRPAttribute(), true);
            NodeList WRPListNodes = XmlUtils.getElementsByXPath(node, xPathCatalog.getXPathMetaReferenceForWRP(), true);
            if (subparagraphWithReferToWRPAttributeNodeList.getLength() > 0) {
                if (WRPListNodes.getLength() == 0) {
                    Node tclNode = createElement(node.getOwnerDocument(), TLC_CONCEPT, TLC_CONCEPT_WRP_ID, EMPTY_STRING);
                    insertOrUpdateAttributeValue(tclNode, HREF, "http://publications.europa.eu/resource/authority/subdivision/WRP");
                    insertOrUpdateAttributeValue(tclNode, XML_SHOW_AS, "closing part");
                    metaReferences.appendChild(tclNode);
                }
            } else {
                for (int i = 0; i < WRPListNodes.getLength(); i++) {
                    metaReferences.removeChild(WRPListNodes.item(i));
                }
            }

        }

    }

    private List<Ref> findReferences(Node node, String documentRefSource) {
        List<Ref> refs = new ArrayList<>();
        NodeList nodeList = XmlUtils.getElementsByName(node, REF);
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node child = nodeList.item(i);
            refs.add(getRefElement(child, documentRefSource));
        }
        return refs;
    }

    private Ref getRefElement(Node node, String documentRef) {
        String id = getAttributeValue(node, XMLID);
        String href = getAttributeValue(node, HREF);
        String origin = getAttributeValue(node, LEOS_ORIGIN_ATTR);
        boolean isDocNodeRef = false;
        if (href != null) {
            String[] hrefMixedArr = href.split("/");
            if (hrefMixedArr.length > 1) {
                documentRef = hrefMixedArr[0];
                if (documentRef.endsWith(".xml")) {
                    documentRef = documentRef.substring(0, documentRef.length() - 4);
                }
                href = hrefMixedArr[1];
            } else {
                href = hrefMixedArr[0];
                isDocNodeRef = href.startsWith("docNodeRef");
            }
            href = href.charAt(0) == '~' ? href.substring(1) : href;
        }
        String refVal = node.getTextContent();
        return new Ref(id, href, documentRef, origin, refVal, isDocNodeRef);
    }

    @Override
    public byte[] replaceTextInElement(byte[] xmlContent, String origText, String newText, String elementId, int startOffset, int endOffset, boolean isTrackChangesEnabled) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, elementId);
        byte[] newElement = null;
        if (node != null) {
            String elementContent = nodeToString(node);
            if(elementContent != null && elementContent.toLowerCase().startsWith("<docpurpose")){
                elementContent = StringEscapeUtils.unescapeXml(elementContent);
            }
            StringBuilder eltContent = new StringBuilder(elementContent);
            ImmutableTriple<String, Integer, Integer> result = getSubstringAvoidingTags(elementContent, startOffset, startOffset + origText.length());
            String matchingText = result.left;
            if (matchingText.equals(origText)
                    || matchingText.replace(NON_BREAKING_SPACE, WHITESPACE).equals(escapeXml10(origText.replace(NON_BREAKING_SPACE, WHITESPACE)))
                    || normalizeSpace(matchingText).replace(NON_BREAKING_SPACE, WHITESPACE).equals(escapeXml10(origText.replace(NON_BREAKING_SPACE, WHITESPACE)))) {
                String newElementsForReplacement = null;
                boolean isTrackChangesInInsertTag = false;
                if (isTrackChangesEnabled){
                    if(INSERT_TAG.equalsIgnoreCase(node.getNodeName())){
                        newElement = generateModifiedTrackChangesDocument(origText, newText, node,result, eltContent, document);
                        isTrackChangesInInsertTag = true;
                    }else {
                        newElementsForReplacement = generateTrackChangesText(origText, newText, node);
                    }
                }else{
                    newElementsForReplacement = escapeXml10(normalizeNewText(origText, newText));
                }
                if(!isTrackChangesInInsertTag) {
                    newElement = getDocumentWithReplacedNewElement(document, node, eltContent, result, newElementsForReplacement);
                }
            } else {
                LOG.debug("Text not matching {}, original text:{}, matched text:{}", elementId, origText, matchingText);
            }
        }
        return newElement;
    }

    private static byte[] getDocumentWithReplacedNewElement(Document document, Node node, StringBuilder eltContent, ImmutableTriple<String, Integer, Integer> result, String newElements) {
        eltContent.replace(result.middle, result.right, newElements);
        Node newNode = createNodeFromXmlFragment(document, eltContent.toString().getBytes(UTF_8), false);
        XmlUtils.replaceElement(newNode, node);
        return nodeToByteArray(document);
    }

    /**
     * Generate the document for the case when a new suggestion is accepted on an already newly inserted text.
     *
     * This method generates additional Nodes (del and ins) appended to the already ins node.
     *
     * It splits the original ins node and inserts the new nodes replacing the text for which
     * the suggestion was accepted
     *
     * @param origText
     * @param newText
     * @param node
     * @param result
     * @param eltContent
     * @param document
     * @return
     */
    private byte[] generateModifiedTrackChangesDocument(String origText, String newText, Node node, ImmutableTriple<String, Integer, Integer> result, StringBuilder eltContent, Document document) {

        String userLogin = null;
        String userName = null;
        User user = securityContext != null && securityContext.hasAuthenticationInContext() ? securityContext.getUser() : null;
        if (user != null){
            userLogin = user.getLogin();
            userName = user.getName();
        }
        String oldLogin = getAttributeValue(node,"leos:uid");
        if(StringUtils.equals(userLogin, oldLogin)){
            return getDocumentWithReplacedNewElement(document, node, eltContent, result, escapeXml10(normalizeNewText(origText, newText)));
        }
        String prefixId = IdGenerator.getPrefixId(getId(node.getParentNode()));
        String uid = "";
        String title = "";
        if(userLogin != null && userName!= null) {
            uid =  new StringBuilder(LEOS_UID_PREFIX).append(userLogin).append(BACKSLASH_QUOTE).toString();
            title =   new StringBuilder(LEOS_TITLE_PREFIX).append(getTitleValue(securityContext)).append(BACKSLASH_QUOTE).toString();
        }

        String newNodeContentFromExisting = new  StringBuilder(eltContent.substring(0,result.middle)).append(INS_END_TAG).toString();

        Node newNodeFromExisting = createNodeFromXmlFragment(document, newNodeContentFromExisting.getBytes(UTF_8), false);
        XmlUtils.replaceElement(newNodeFromExisting, node);

        String deleteTagContent = new StringBuilder("<del ") //delete tag added
                .append(XMLID).append("=\"").append(IdGenerator.generateId(prefixId)).append(BACKSLASH_QUOTE) //id
                .append(uid)
                .append(title)
                .append(">")
                .append(escapeXml10(normalizeSpace(origText)))
                .append("</del>").toString();


        Node deleteTagNode = appendNodeFromContent(document, newNodeFromExisting, deleteTagContent);

        String insertTagContent =  new StringBuilder(INS_START_TAG) // insert tag added
                .append(XMLID).append("=\"").append(IdGenerator.generateId(prefixId)).append(BACKSLASH_QUOTE) //id
                .append(uid)
                .append(title)
                .append(">")
                .append(escapeXml10(normalizeSpace(newText)))
                .append(INS_END_TAG).toString();


        Node insertTagNode = appendNodeFromContent(document, deleteTagNode, insertTagContent);

        String oldUid;
        if(oldLogin == null) {
            oldUid = uid;
        }else{
            oldUid =  new StringBuilder(LEOS_UID_PREFIX).append(oldLogin).append(BACKSLASH_QUOTE).toString();
        }
        String oldTitle = getAttributeValue(node,"leos:title");
        if(oldTitle == null) {
            oldTitle = title;
        }else{
            oldTitle =  new StringBuilder(LEOS_TITLE_PREFIX).append(oldTitle).append(BACKSLASH_QUOTE).toString();
        }
        String lastFragmentOfPreviousNode = new StringBuilder(INS_START_TAG)
                .append(XMLID).append("=\"").append(IdGenerator.generateId(prefixId)).append(BACKSLASH_QUOTE) //id
                .append(oldUid)
                .append(oldTitle)
                .append(">")
                .append(eltContent.substring(result.right))
                .toString();

        appendNodeFromContent(document, insertTagNode, lastFragmentOfPreviousNode);

        return nodeToByteArray(document);
    }

    private static Node appendNodeFromContent(Document document, Node currentNode, String tagContent) {
        Node parentNode = currentNode.getParentNode();
        Node createdNode = createNodeFromXmlFragment(document, tagContent.getBytes(UTF_8), false);
        // insert of deleted tag
        Node nextSibling = currentNode.getNextSibling();

        if(nextSibling != null){
            parentNode.insertBefore(createdNode, nextSibling);
        }else{
            parentNode.appendChild(createdNode);
        }
        return createdNode;
    }

    private String generateTrackChangesText(String origText, String newText, Node node) {
        String userLogin = null;
        String userName = null;
        User user = securityContext != null && securityContext.hasAuthenticationInContext() ? securityContext.getUser() : null;
        if (user != null){
            userLogin = user.getLogin();
            userName = user.getName();
        }

        String prefixId = IdGenerator.getPrefixId(getId(node));
        String uid = "";
        String title = "";
        if(userLogin != null && userName!= null) {
             uid =  new StringBuilder(LEOS_UID_PREFIX).append(userLogin).append(BACKSLASH_QUOTE).toString();
             title =   new StringBuilder(LEOS_TITLE_PREFIX).append(getTitleValue(securityContext)).append(BACKSLASH_QUOTE).toString();
        }

        String elementToAdd = new StringBuilder("<del ") //delete tag added
                .append(XMLID).append("=\"").append(IdGenerator.generateId(prefixId)).append(BACKSLASH_QUOTE) //id
                .append(uid)
                .append(title)
                .append(">")
                .append(escapeXml10(normalizeSpace(origText)))
                .append("</del>")
                // insert tag added
                .append(INS_START_TAG)
                .append(XMLID).append("=\"").append(IdGenerator.generateId(prefixId)).append(BACKSLASH_QUOTE) //id
                .append(uid)
                .append(title)
                .append(">")
                .append(escapeXml10(normalizeSpace(newText)))
                .append(INS_END_TAG).toString();
        LOG.info("Element to add {}", elementToAdd);
        return elementToAdd;
    }

    @Override
    public byte[] appendElementToTag(byte[] xmlContent, String tagName, String newContent, boolean asFirstChild) {
        Document document = createDocument(xmlContent);
        NodeList nodeList = document.getElementsByTagName(tagName);
        if (nodeList.getLength() == 0) {
            throw new IllegalArgumentException("No tag found with name " + tagName);
        }

        Node newNode = createNodeFromXmlFragment(document, newContent.getBytes(UTF_8));
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node node = nodeList.item(i);
            if (asFirstChild) {
                XmlUtils.addFirstChild(newNode, node);
            } else {
                XmlUtils.addLastChild(newNode, node);
            }
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] insertDepthAttribute(byte[] xmlContent, String tagName, String elementId) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, elementId);
        if (tagName.equals(NUM)) {
            tagName = XmlUtils.getParentTagName(node);
            elementId = getParentId(node);
        }

        NodeList nodeList = document.getElementsByTagName(tagName);
        for (int i = 0; i < nodeList.getLength(); i++) {
            node = nodeList.item(i);
            int depth = getElementDepth(node, elementId);
            addAttribute(node, LEOS_DEPTH_ATTR, String.valueOf(depth));
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] insertCrossheadingAttributes(byte[] xmlContent, String tagName, String elementId, boolean before) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, elementId);
        String indentLevelStr = getAttributeValue(node, LEOS_INDENT_LEVEL_ATTR);
        String inlinePropertyStr = getAttributeValue(node, INLINE_NUM_PROPERTY);
        Node nodeToSetAttributes;
        if (before) {
            nodeToSetAttributes = node.getPreviousSibling();
        } else {
            nodeToSetAttributes = node.getNextSibling();
        }
        insertOrUpdateAttributeValue(nodeToSetAttributes, LEOS_ORIGIN_ATTR, CN);
        if (tagName.equals(BLOCK)) {
            insertOrUpdateAttributeValue(nodeToSetAttributes, LEOS_CROSS_HEADING_BLOCK_NAME, CROSSHEADING);
        }
        insertOrUpdateAttributeValue(nodeToSetAttributes, LEOS_INDENT_LEVEL_ATTR, indentLevelStr);
        insertOrUpdateStylingAttribute(nodeToSetAttributes, INDENT_LEVEL_PROPERTY, indentLevelStr);
        insertOrUpdateStylingAttribute(nodeToSetAttributes, INLINE_NUM_PROPERTY, org.apache.commons.lang3.StringUtils.isNotEmpty(inlinePropertyStr) ? inlinePropertyStr : null);
        return nodeToByteArray(document);
    }

    @Override
    public byte[] searchAndReplaceText(byte[] xmlContent, String searchText, String replaceText) {
        Document document = createDocument(xmlContent);
        String xPath = String.format("//*[contains(lower-case(text()), %s)]", wrapXPathWithQuotes(searchText.toLowerCase()));
        NodeList nodeList = XmlUtils.getElementsByXPath(document, xPath);
        boolean found = false;
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node child = nodeList.item(i);
            String content = child.getTextContent();
            if (content != null && isEditableElement(child, true)) {
                String updatedContent = content.replaceAll("(?i)" + Pattern.quote(searchText), Matcher.quoteReplacement(replaceText));
                child.setTextContent(escapeXml10(updatedContent));
                found = true;
            }
        }

        if (found) { //update content only if any change happened
            xmlContent = nodeToByteArray(document);
        }
        return xmlContent;
    }

    @Override
    public byte[] getCoverPageContentForRendition(byte[] xmlContent) {
        byte[] coverPageContent = StringUtils.EMPTY.getBytes(StandardCharsets.UTF_8);

        Document document = createDocument(xmlContent, true);
        XmlUtils.addLeosNamespace(document);

        Node akomaNtosoNode = XmlUtils.getFirstElementByXPath(document, xPathCatalog.getXPathAkomaNtoso(), true);
        Node meta = XmlUtils.getFirstElementByXPath(document, xPathCatalog.getXPathMeta(), true);
        Node coverPageNode = XmlUtils.getFirstElementByXPath(document, xPathCatalog.getXPathCoverPage(), true);
        if(akomaNtosoNode != null) {
            akomaNtosoNode.setTextContent(StringUtils.EMPTY);

            if(meta != null) {
                XmlUtils.addChild(meta, akomaNtosoNode);
            }

            if(coverPageNode != null) {
                XmlUtils.addChild(coverPageNode, akomaNtosoNode);
                coverPageContent = nodeToByteArray(akomaNtosoNode);
            }
        }

        return coverPageContent;
    }

    public static boolean isEditableElement(Node node, boolean allowUndefined) {
        Validate.isTrue(node != null, "Node can not be null");
        Validate.isTrue(node.getParentNode() != null, "Parent Node can not be null");
        EditableAttributeValue editableAttrVal = getEditableAttributeForNode(node);
        while (EditableAttributeValue.UNDEFINED.equals(editableAttrVal) && node.getParentNode() != null) {
            editableAttrVal = getEditableAttributeForNode(node.getParentNode());
            node = node.getParentNode();
        }
        return EditableAttributeValue.UNDEFINED.equals(editableAttrVal) ? allowUndefined : Boolean.parseBoolean(editableAttrVal.name());
    }

    private static EditableAttributeValue getEditableAttributeForNode(Node node) {
        Map<String, String> attrs = XmlUtils.getAttributes(node);
        String tagName = node.getNodeName();
        String attrVal = attrs.get(LEOS_EDITABLE_ATTR);

        if (attrVal != null) {
        	return attrVal.equalsIgnoreCase("false") ? EditableAttributeValue.FALSE : EditableAttributeValue.TRUE;
        } else if (isExcludedNode(tagName)) {
            return EditableAttributeValue.FALSE;
        }

        return EditableAttributeValue.UNDEFINED;
    }

    @Override
    public Element getElementById(byte[] xmlContent, String idAttributeValue) {
        Validate.isTrue(idAttributeValue != null, "Id can not be null");
        Document document = createDocument(xmlContent);
        Element element = null;
        Node node = XmlUtils.getElementById(document, idAttributeValue);
        if (node != null) {
            String nodeString = nodeToString(node);
            nodeString = removeXmlNSAttributes(nodeString);
            element = new Element(idAttributeValue, node.getNodeName(), nodeString);
        }
        return element;
    }

    @Override
    public List<String> getAncestorsIdsForElementId(byte[] xmlContent, String idAttributeValue) {
        Validate.isTrue(idAttributeValue != null, "Id can not be null");
        LinkedList<String> ancestorsIds = new LinkedList<String>();

        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, idAttributeValue);
        if (idAttributeValue.startsWith("docNodeRef_")) {
            ancestorsIds.addFirst(idAttributeValue);
            return ancestorsIds;
        } else if (node == null) {
            String errorMsg = String.format("Element with id: %s does not exists.", idAttributeValue);
            LOG.error(errorMsg);
            throw new IllegalArgumentException(errorMsg);
        }

        while ((node = node.getParentNode()) != null) {
            String idValue = getAttributeValue(node, XMLID);
            if (idValue != null) {
                ancestorsIds.addFirst(idValue);
            }
        }
        return ancestorsIds;
    }

    @Override
    public byte[] removeElements(byte[] xmlContent, String xpath, int levelsToRemove) {
        Document document = createDocument(xmlContent);
        NodeList nodeList = XmlUtils.getElementsByXPath(document, xpath);
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node node = nodeList.item(i);
            Node parent = node.getParentNode();
            for (int level = 0; level < levelsToRemove; level++) {
                node = parent; // go up in node levels
                parent = parent.getParentNode();
            }
            parent.removeChild(node);
            LOG.debug("Removed nodeName '{}' with id '{}' ", node.getNodeName(), getId(node));
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] removeElements(byte[] xmlContent, String xpath) {
        return removeElements(xmlContent, xpath, 0);
    }

    @Override
    public String doImportedElementPreProcessing(String xmlContent, String elementType) {
        xmlContent = normalizeSpace(xmlContent);
        Document document = createDocument(xmlContent.getBytes(StandardCharsets.UTF_8));
        Node node = document.getFirstChild();
        node = setAttributeForDefinitionArticle(node);
        generateId(node);
        String updatedElement = nodeToString(node);
        updatedElement = removeSelfClosingElements(updatedElement);
        return updatedElement;
    }

    private void generateId(Node node) {
        String idPrefix = "imp" + IdGenerator.PREFIX_DELIMITER + getId(node).replaceAll("_", "");
        String newIdAttrValue = IdGenerator.generateId(idPrefix);
        addAttribute(node, XMLID, newIdAttrValue);
        for(int i = 0; i < node.getChildNodes().getLength(); i++) {
            Node child = node.getChildNodes().item(i);
            if(OJ_IMPORT_ELEMENTS.contains(child.getNodeName().toLowerCase())) {
                generateId(child);
            }
        }
    }


    private Node setAttributeForDefinitionArticle(Node node) {
        if (is(node, ARTICLE)) {
            // Will check here if it is a definitions' article.
            // The checking is done thanks to the points' numbering scheme of the article
            // That could be done just checking the heading, but I found it not accurate, because:
            //  1. Heading text can depend on the language
            //  2. Heading text can be slightly different from exact text "Definitions"
            //  Example: Article 5 of REGULATION 575 2013.
            Node pointOrIndent = XmlUtils.getFirstDescendant(node, Arrays.asList(POINT, INDENT));
            if (pointOrIndent != null) {
                int depth = XmlUtils.getPointDepth(pointOrIndent);
                String numValue = getFirstChild(pointOrIndent, NUM).getTextContent();
                List<TocItem> tocItems = structureContextProvider.get().getTocItems();
                List<NumberingConfig> numberingConfigs = structureContextProvider.get().getNumberingConfigs();
                List<TocItem> foundTocItems = StructureConfigUtils.getTocItemsByName(tocItems, pointOrIndent.getNodeName());
                TocItem tocItem = StructureConfigUtils.getTocItemByNumValue(numberingConfigs, foundTocItems, numValue, depth,
                        documentLanguageContext.getDocumentLanguage());
                // Means it's a definition article
                if (tocItem != null
                        && StructureConfigUtils.getNumberingTypeByLanguage(tocItem, documentLanguageContext.getDocumentLanguage()).equals(
                                StructureConfigUtils.getNumberingTypeByTagNameAndTocItemType(tocItems,
                                        TocItemTypeName.DEFINITION, pointOrIndent.getNodeName(), documentLanguageContext.getDocumentLanguage()))) {
                    Attribute attribute =  StructureConfigUtils.getAttributeByTagNameAndTocItemType(tocItems, TocItemTypeName.DEFINITION, ARTICLE);
                    if (attribute != null) {
                        addAttribute(node, attribute.getAttributeName(), attribute.getAttributeValue());
                    }
                }
            }
        }
        return node;
    }

    @Override
    public Element getTocElement(final byte[] xmlContent, final String idAttributeValue, final List<TableOfContentItemVO> toc, final List<String> tagNames) {
        Element currentElement = getElementById(xmlContent, idAttributeValue);
        if (isElementInToc(currentElement, toc)) {
            return currentElement;
        } else {
            Element childElement = getChildElement(xmlContent, currentElement.getElementTagName(), currentElement.getElementId(), tagNames, 1);
            if (childElement != null) {
                currentElement = childElement;
            }
        }

        while (currentElement != null && !isElementInToc(currentElement, toc)) {
            currentElement = getParentElement(xmlContent, currentElement.getElementId());
        }
        return currentElement;
    }

    @Override
    public String getElementIdByPath(byte[] xmlContent, String xPath) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getFirstElementByXPath(document, xPath);
        if (node == null) {
            return null;
        }
        return getAttributeValue(node, XMLID);
    }

    @Override
    public String removeEmptyHeading(String newContent) {
        boolean removed = false;
        Document document = createDocument(newContent.getBytes(StandardCharsets.UTF_8), false);
        XmlUtils.addLeosNamespace(document);
        Node heading = getFirstElementByName(document, HEADING);
        if (heading != null && heading.getTextContent().replaceAll(NBSP, "").trim().isEmpty()) {
            removeElement(heading);
            removed = true;
        }
        if(removed){
            return nodeToString(document);
        } else { //skip re-parsing if no change
            return newContent;
        }
    }

    public void removeElement(Node node) {
        String contentOrigin = getAttributeValue(node, LEOS_ORIGIN_ATTR);
        if(CN.equals(contentOrigin)) {
            XmlUtils.deleteElement(node);
        } else {
            addAttribute(node, LEOS_SOFT_ACTION_ATTR, SoftActionType.DELETE.getSoftAction());
            addAttribute(node, LEOS_SOFT_USER_ATTR, getSoftUserAttribute(securityContext.getUser()));
            addAttribute(node, LEOS_SOFT_DATE_ATTR, getDateAsXml());
            updateXMLIDAttributeFullStructureNode(node, SOFT_DELETE_PLACEHOLDER_ID_PREFIX, true);
        }
    }

    @Override
    public LevelItemVO getLevelItemVo(byte[] xmlContent, String elementId, String elementTagName) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, elementId);
        LevelItemVO levelItemVo = new LevelItemVO();
        if (node != null) {
            if (NUM.equals(elementTagName)) {
                node = node.getParentNode();
                if (node == null) {
                    throw new IllegalStateException("Element " + elementId + "is not NUM of a Level node.");
                }
            }
            int depth = getElementDepth(node, elementId);
            levelItemVo = createLevelItemVO(elementId, node, depth);
        }
        return levelItemVo;
    }

    private static int getElementDepth(Node node, String elementId) {
        int depth = 0;
        Node numNode = getFirstChild(node, NUM);
        String autoNumberOverwrite = getAttributeValue(node, LEOS_AUTO_NUM_OVERWRITE);
        if (numNode != null) {
            if (autoNumberOverwrite != null && autoNumberOverwrite.equalsIgnoreCase(Boolean.TRUE.toString())) {
                String typeAttr = getAttributeValue(node, CLASS_ATTR);
                if (typeAttr != null) {
                    ClassToDepthType classToDepthType = ClassToDepthType.of(typeAttr);
                    if (classToDepthType != null) {
                        depth = classToDepthType.getDepth();
                    }
                }
            } else {
                String elementNumber = getChildContent(node, NUM);
                if (elementNumber.contains(".")) {
                    String[] levelArr = StringUtils.split(elementNumber, LEVEL_NUM_SEPARATOR);
                    depth = levelArr.length;
                } else {
                    if (!getId(node).equals(elementId) && elementNumber.contains("#")) {
                        depth = calculateDepthForNewElement(node, elementId);
                    } else {
                        Node parent = node.getParentNode();
                        while (parent != null) {
                            if (is(parent, Arrays.asList(NUMBERED_AND_LEVEL_ITEMS))) {
                                depth++;
                            }
                            parent = parent.getParentNode();
                        }
                    }
                }
            }
        }
        return depth;
    }

    private static int calculateDepthForNewElement(Node node, String elementId) {
        int depth = 0;
        node = XmlUtils.getElementById(node, elementId);
        if (node != null) {
            depth = getElementDepth(node, elementId);
        }
        return depth;
    }

    private LevelItemVO createLevelItemVO(String elementId, Node node, int depth) {
        LevelItemVO levelItemVo = new LevelItemVO();
        levelItemVo.setId(elementId);
        levelItemVo.setLevelDepth(depth);
        levelItemVo.setLevelNum(getChildContent(node, NUM));
        levelItemVo.setOrigin(getAttributeValue(node, LEOS_ORIGIN_ATTR));

        while ((node = getNextSibling(node, LEVEL)) != null) {
            int nextDepth = getElementDepth(node, elementId);
            if (nextDepth - depth == 1) { // If next sibling depth is > current level depth then add it as a child
                String siblingElementId = getId(node);
                if (siblingElementId != null) {
                    LevelItemVO childItemVO = createLevelItemVO(siblingElementId, node, nextDepth);
                    levelItemVo.addChildLevelItemVO(childItemVO);
                } else {
                    throw new IllegalStateException("Invalid XML element without Id exists");
                }
            } else if (nextDepth <= depth) {
                break;
            }
        }
        return levelItemVo;
    }

    @Override
    public byte[] updateRefsWithRefOrigin(byte[] xmlContent, String newRef, String oldRef) {
        Document document = createDocument(xmlContent);
        NodeList nodeList = XmlUtils.getElementsByName(document, REF);
        boolean flag = false;
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node child = nodeList.item(i);
            String href = getAttributeValue(child, HREF);
            if (href != null) {
                int index = href.indexOf('/');
                if (index >= 0) {
                    String refXml = href.substring(0, index);
                    if (refXml.equals(oldRef)) {
                        String ref = newRef + href.substring(index);
                        addAttribute(child, HREF, ref);
                        flag = true;
                    }
                }
            }
        }

        if (flag) { //update only if changed
            LOG.info("Updated all internal references prefix from '{}' to '{}'", oldRef, newRef);
            xmlContent = nodeToByteArray(document);
        }
        return xmlContent;
    }

    @Override
    public byte[] updateDepthAttribute(byte[] xmlContent) {
        return xmlContent;
    }

    @Override
    public byte[] insertAffectedAttributeIntoParentElements(byte[] xmlContent, String idAttributeValue) {
        return xmlContent;
    }

    @Override
    public byte[] prepareForRenumber(byte[] xmlContent) {
        return xmlContent;
    }

    @Override
    public byte[] insertAutoNumOverwriteAttributeIntoParentElements(byte[] xmlContent, String idAttributeValue) {
        return xmlContent;
    }

    @Override
    public List<Element> getElementsByTagName(byte[] xmlContent, List<String> elementTags, boolean withContent) {
        Document document = createDocument(xmlContent);
        List<Element> elements = new ArrayList<>();
        for (String elementTag : elementTags) {
            NodeList nodeList = XmlUtils.getElementsByName(document, elementTag);
            for (int i = 0; i < nodeList.getLength(); i++) {
                Node child = nodeList.item(i);
                String id = getId(child);
                if (id != null) {
                    elements.add(new Element(id, child.getNodeName(), withContent ? nodeToString(child) : null));
                }
            }
        }
        return elements;
    }

    @Override
    public byte[] ignoreNotSelectedElements(byte[] xmlContent, List<String> rootElements, List<String> elementIds) {
        List<String> ancestorIds = getAncestorsIdsForElements(xmlContent, elementIds);
        Document document = createDocument(xmlContent);
        for (String rootElement : rootElements) {
            Node node = getFirstElementByName(document, rootElement);
            if (node != null) {
                ignoreNotSelectedElement(node, elementIds, ancestorIds);
            }
        }
        return nodeToByteArray(document);
    }

    private List<String> getAncestorsIdsForElements(byte[] xmlContent, List<String> elementIds) {
        List<String> ancestorIds = new ArrayList<>();
        elementIds.stream().forEach(elementId -> {
            ancestorIds.addAll(this.getAncestorsIdsForElementId(xmlContent, elementId));
        });
        return ancestorIds.stream().distinct().collect(Collectors.toList());
    }

    private void ignoreNotSelectedElement(Node node, List<String> elementIds, List<String> ancestorIds) {
        String tagName = node.getNodeName();
        String elementId = getId(node);
        if (elementId != null) {
            if (elementIds.contains(elementId) || tagName.equals(NUM) || tagName.equals(HEADING)) {
                return;
            } else if (!ancestorIds.contains(elementId)) {
                addAttribute(node, STATUS_IGNORED_ATTR, STATUS_IGNORED_ATTR_VALUE);
                return;
            }
        }
        List<Node> children = getChildren(node);
        for (int i = 0; i < children.size(); i++) {
            ignoreNotSelectedElement(children.get(i), elementIds, ancestorIds);
        }
    }

    protected byte[] deleteElementById(byte[] xmlContent, String elementId) {
        Document document = createDocument(xmlContent);
        XmlUtils.deleteElementById(document, elementId);
        return nodeToByteArray(document);
    }

    @Override
    public void updateSoftMoveLabelAttribute(Node documentNode, String attr) {
        String sourceDocumentRef = getContentByTagName(documentNode, LEOS_REF);
        NodeList nodeList = XmlUtils.getElementsByXPath(documentNode, String.format("//*[@%s]", attr));
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node node = nodeList.item(i);
            Result<String> labelResult = referenceLabelService.generateSoftMoveLabel(getRefFromSoftMovedElt(node, attr),
                    getParentId(node), documentNode, attr, sourceDocumentRef);
            if (labelResult != null && labelResult.isOk()) {
                addAttribute(node, LEOS_SOFT_MOVED_LABEL_ATTR, labelResult.get());
                coEditionContext.addUpdatedElement(getId(node), node.getNodeName(), nodeToString(node), null);
                if (!Arrays.asList(PART, TITLE, CHAPTER, SECTION, ARTICLE).contains(node.getNodeName())) {
                    addTrackChangeAttributes(node, attr);
                }
                createMoveInfoTitle(node);
            }
        }
    }

    private void addTrackChangeAttributes(Node node, String attr) {
        if (trackChangesContext != null && trackChangesContext.isTrackChangesEnabled()) {
            String userLogin = securityContext.getUser().getLogin();
            String leosAction = null;
            switch (attr) {
                case LEOS_SOFT_MOVE_TO:
                    leosAction = "delete";
                    break;
                default:
                    leosAction = null;

            }
            if(leosAction != null) {
                if (!XmlUtils.hasAttribute(node, LEOS_UID_ATTR)) {
                    addAttribute(node, LEOS_UID_ATTR, userLogin);
                }
                addAttribute(node, LEOS_ACTION_ATTR, leosAction);
            }
        }
    }

    private Ref getRefFromSoftMovedElt(Node node, String attr) {
        String id = getId(node);
        String href = getAttributeValue(node, attr);
        String origin = getAttributeValue(node, LEOS_ORIGIN_ATTR);
        return new Ref(id, href, null, origin);
    }

    protected Element getSiblingOfParentElement(byte[] xmlContent, String tagName, String id) {
        LOG.trace("getSiblingOfParentElement for node {} with id {}", tagName, id);
        Element element = null;
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, id);
        if (node != null) {
            Node parent = node.getParentNode();
            if (parent != null) {
                element = getSiblingElement(parent, Collections.emptyList(), false);
            }
        }
        return element;
    }

    @Override
    public Pair<byte[], Element> getSplittedElement(byte[] xmlContent, String content, String tagName, String idAttributeValue) {
        Element splitElement;
        if (Arrays.asList(SUBPARAGRAPH, SUBPOINT).contains(tagName) || (PARAGRAPH.equals(tagName) && !content.contains("<" + SUBPARAGRAPH + ">"))) {
            splitElement = getSiblingElement(xmlContent, tagName, idAttributeValue, Collections.emptyList(), false);
            // Case when subparagraph is a list's wrap up
            if (splitElement == null) {
                Element parentElement = getParentElement(xmlContent, idAttributeValue);
                Element listSibling = parentElement != null ? getSiblingElement(xmlContent, parentElement.getElementTagName(), parentElement.getElementId(),
                        Collections.emptyList(),
                        false) : null;
                splitElement = listSibling != null ? getChildElement(xmlContent, listSibling.getElementTagName(), listSibling.getElementId(),
                        Arrays.asList(tagName),
                        1) : null;
            }
        } else if (LEVEL.equals(tagName)) {
            return null;
        } else if (CONTENT.equals(tagName)) {
            splitElement = getSiblingOfParentElement(xmlContent, CONTENT, idAttributeValue);
        } else {
            splitElement = getChildElement(xmlContent, tagName, idAttributeValue, Arrays.asList(SUBPARAGRAPH, SUBPOINT), 2);
        }
        // Case when subparagraph is outside of a list and part of next sibling's list
        if (splitElement != null && splitElement.getElementTagName().equals(LIST)) {
            splitElement = getChildElement(xmlContent, tagName, splitElement.getElementId(), Arrays.asList(tagName), 1);
        }

        return buildSplittedElementPair(xmlContent, splitElement);
    }

    @Override
    public List<String> extractElementIdsFromXml(byte[] xmlContent) {
        List<String> allIds = new ArrayList<>();

        try {
            Document document = createDocument(xmlContent);

            String[] elementNames = {"citation", "recitals", "recital", "part", "title", "chapter", "section", "article"};

            for (String elementName : elementNames) {
                NodeList nodeList = document.getElementsByTagName(elementName);
                for (int i = 0; i < nodeList.getLength(); i++) {

                    if (elementName.equals("recitals") && i == 0){
                        continue;
                    }

                    Node node = nodeList.item(i);
                    String id = getId(node);
                    if (id != null && !id.trim().isEmpty()) {
                        allIds.add(id);
                    }
                }
            }

        } catch (Exception e) {
            LOG.error("Error extracting IDs: {}", e.getMessage(), e);
        }

        return allIds;
    }

    protected byte[] removeElement(byte[] xmlContent, Element element, String currentOrigin, boolean isTrackChangesEnabled) {
        Document document = createDocument(xmlContent);
        String tagName = element.getElementTagName();
        String elementId = element.getElementId();
        Node node = XmlUtils.getElementById(document, elementId);
        boolean isSoftMovedFrom = isSoftMovedFrom(node);
        boolean isProposalElement = isProposalElement(node) || (isTrackChangesEnabled && !cloneContext.isClonedProposal());
        boolean isSoftDeleted = isSoftDeletedOrMovedTo(node);
        Node parentNode = node.getParentNode();
        List<Node> siblings =  getChildren(parentNode, Arrays.asList(SUBPARAGRAPH, POINT, INDENT, LIST, CROSSHEADING));
        boolean singleChild = siblings.size() <= 1;
        boolean firstChild = siblings.indexOf(node) == 0;

        if (!is(parentNode, LEVEL)) {
            if ((Arrays.asList(SUBPARAGRAPH, SUBPOINT).contains(tagName) && firstChild && !is(parentNode, LIST))
                    || (Arrays.asList(POINT, INDENT, INDENT).contains(tagName) && singleChild)) {
                // Cases when the deleted element should be the wrapping element
                node = parentNode;
            } else if (tagName.equals(SUBPARAGRAPH) && is(parentNode, LIST) && firstChild) {
                // Cases when the deleted element should be the wrapping element (subparagraph is intro of the first list)
                Node grandParentNode = parentNode.getParentNode();
                if (grandParentNode != null && !is(grandParentNode, LEVEL)) {
                    List<Node> parentNodeSiblings = getChildren(grandParentNode, Arrays.asList(SUBPARAGRAPH, LIST));
                    if (parentNodeSiblings.indexOf(parentNode) == 0) {
                        node = grandParentNode;
                    }
                }
            }
        }

        Node list = is(node.getParentNode(),LIST) ? node.getParentNode() : null;
        if (isSoftMovedFrom) {
            softDeleteOriginalNode(node, isTrackChangesEnabled);
            restoreTransformedNodeToContent(node);
            XmlUtils.deleteElement(node);
        } else if (isProposalElement && !isSoftDeleted) {
            removeMovedInElements(node, isTrackChangesEnabled);
            softDeleteElementForNode(node, isTrackChangesEnabled);
        } else {
            restoreTransformedNodeToContent(node);
            XmlUtils.deleteElement(node);
        }

        // Delete empty lists
        if (list != null && getChildren(list).isEmpty()) {
            XmlUtils.deleteElement(list);
        }

        doXMLPostProcessing(document);
        return nodeToByteArray(document);
    }

    private void softDeleteOriginalNode(Node node, boolean isTrackChangesEnabled) {
        doSoftDeleteOriginalNode(node, isTrackChangesEnabled);
        List<Node> children = getChildren(node);
        for (int i = 0; i < children.size(); i++) {
            softDeleteOriginalNode(children.get(i), isTrackChangesEnabled);
        }
    }

    private void doSoftDeleteOriginalNode(Node node, boolean isTrackChangesEnabled) {
        String originalId = getAttributeValue(node, LEOS_SOFT_MOVE_FROM);
        Boolean originalActionRoot = XmlUtils.getAttributeValueAsBoolean(node, LEOS_SOFT_ACTION_ROOT_ATTR);
        LOG.debug("Setting original node {} as MOVED. Actual node {}", originalId, getId(node));
        if (originalId != null && Boolean.TRUE.equals(originalActionRoot)) {
            Node originalNode = XmlUtils.getElementById(node.getOwnerDocument(), originalId);
            if (originalNode != null) {
                softDeleteElementForNode(originalNode, isTrackChangesEnabled);
            } else {
                LOG.warn("Original Node with id {} cannot be set to softdelete" , originalId);
            }
        }
    }

    private void removeMovedInElements(Node node, boolean isTrackChangesEnabled) {
        List<Node> children = getChildren(node);
        for (int i = 0; i < children.size(); i++) {
            Node child = children.get(i);
            String originalId = getAttributeValue(child, LEOS_SOFT_MOVE_FROM);
            if(originalId != null) {
                LOG.debug("Deleting MOVED node {}. The original {} will be set to sofdelete ", getId(child), originalId);
                XmlUtils.deleteElement(child);
                Node originNode  = XmlUtils.getElementById(node.getOwnerDocument(), originalId);
                softDeleteElementForNode(originNode, isTrackChangesEnabled);
            } else {
                removeMovedInElements(child, isTrackChangesEnabled);
                // If all children of LIST are removed remove LIST also
                if(LIST.equals(child.getNodeName()) && getChildren(child).size() == 0) {
                    XmlUtils.deleteElement(child);
                }
            }
        }
    }

    protected boolean isSoftTransformed(Node node) {
        SoftActionType actionType = XmlUtils.getAttributeForSoftAction(node, LEOS_SOFT_ACTION_ATTR);
        return (actionType!= null && actionType.equals(SoftActionType.TRANSFORM));
    }

    /**
     * TODO this behaviour is wrong. Need to be changed.
     *
     * When softdeleting "sub1", restore initial node structure, and delete the cn subparagraph.
     *
     * Input:
     * <paragraph>
     *     <subparagraph leos:origin="ec" leos:softaction="trans" xml:id="sub1">
     *         <content>
     *             <p>Art</p>
     *         </content>
     *     </subparagraph>
     *     <subparagraph leos:origin="cn" xml:id="sub2">
     *         <content>
     *             <p>icle 4</p>
     *         </content>
     *     </subparagraph>
     * </paragraph>
     *
     * Output:
     * <paragraph>
     *     <content>
     *         <p>Art</p>
     *     </content>
     * </paragraph>
     */
    protected Node restoreTransformedNode(Node node) {
        Node contentNode = getFirstChild(node, CONTENT);
        Node nextSameTypeNode = getNextSibling(node, node.getNodeName()); // can be SUBPARAGRAPH and ALINEA (for now)
        Node nextListNode = getNextSibling(node, LIST);
        if (!isNull(nextSameTypeNode) && !isNull(nextListNode)) {
            if(isCNNode(nextSameTypeNode)){
                XmlUtils.deleteElement(nextSameTypeNode);
                XmlUtils.replaceElement(contentNode, node);
                node = contentNode.getParentNode();
            } else {
                throw new IllegalStateException("Wrong structure! TRANSFORMED node " + node.getNodeName() + ", id: " + getId(node) + " is not followed by CN node");
            }
        }
        return node;
    }

    private boolean isCNNode(Node node) {
        return CN.equals(getAttributeValue(node, LEOS_ORIGIN_ATTR));
    }

    /**
     * When deleting "sub2", check if previous node is EC transformed and in that case, restore to content.
     *
     * Input Node that would be deleted:
     * <subparagraph leos:origin="cn" xml:id="sub2">
     *     <content>
     *         <p>icle 4</p>
     *     </content>
     * </point>
     * OR
     * <aubparagraph leos:origin="cn" xml:id="sub2">
     *     <content>
     *         <p>icle 4</p>
     *     </content>
     * </point>
     *
     * Full structure:
     * <paragraph>
     *     <subparagraph leos:origin="ec" leos:softaction="trans" xml:id="sub1">
     *         <content>
     *             <p>Art</p>
     *         </content>
     *     </subparagraph>
     *     <subparagraph leos:origin="cn" xml:id="sub2">
     *         <content>
     *             <p>icle 4</p>
     *         </content>
     *     </subparagraph>
     * </paragraph>
     *
     * Output structure:
     * <paragraph>
     *     <content>
     *         <p>Art</p>
     *     </content>
     *     <subparagraph leos:origin="cn" xml:id="sub2">
     *         <content>
     *             <p>icle 4</p>
     *         </content>
     *     </subparagraph>
     * </paragraph>
     *
     * Alternative Full structure:
     * <paragraph>
     *     <list>
     *       <subparagraph leos:origin="ec" xml:id="sub1">
     *          <content>
     *              <p>Art</p>
     *          </content>
     *        </subparagraph>
     *        <point leos:origin="cn" xml:id="sub2">
     *          <content>
     *             <p>icle 4</p>
     *          </content>
     *        </point>
     *     </list>
     * </paragraph>
     *
     * Output structure:
     * <paragraph>
     *     <content>
     *         <p>Art</p>
     *     </content>
     *     <list>
     *          <subparagraph leos:origin="cn" xml:id="sub2">
     *             <content>
     *                 <p>icle 4</p>
     *             </content>
     *          </subparagraph>
     *     </list>
     * </paragraph>
     */

    protected void restoreTransformedNodeToContent(Node node) {
        Node prevSibling = XmlUtils.getPrevSibling(node);
        Node nextSibling = getNextSibling(node);
        boolean isFirstSubParagraph = isFirstSubParagraph(prevSibling);
        if (nextSibling == null) {
            if (XmlUtils.isListIntro(prevSibling)) {
                node.getParentNode().getParentNode().insertBefore(prevSibling, node.getParentNode());
                if (getNextSibling(node.getParentNode()) != null) {
                    return;
                }
            }
            if (isFirstSubParagraph) {
                Node contentNode = getFirstChild(prevSibling, CONTENT);
                XmlUtils.replaceElement(contentNode, prevSibling);
            }
        }
    }

    protected boolean isProposalElement(Map<String, String> attributes) {
        return ((attributes.get(LEOS_ORIGIN_ATTR) != null) && attributes.get(LEOS_ORIGIN_ATTR).equals(EC));
    }

    protected boolean isProposalElement(Node node) {
        String originAttr = getAttributeValue(node, LEOS_ORIGIN_ATTR);
        return (originAttr != null && originAttr.equals(EC));
    }

    protected boolean isSoftMovedFrom(Map<String, String> attributes) {
        return SoftActionType.MOVE_FROM.getSoftAction().equals(attributes.get(LEOS_SOFT_ACTION_ATTR));
    }

    protected boolean isSoftMovedFrom(Node node) {
        return getAttributeValue(node, LEOS_SOFT_MOVE_FROM) != null;
    }

    protected String softDeleteElement(String content, boolean namespaceEnabled) {
        return softDeleteElement(content.getBytes(UTF_8), namespaceEnabled, true);
    }

    protected String softDeleteElement(byte[] xmlContent, boolean namespaceEnabled, boolean replacePrefix) {
        Document document = createDocument(xmlContent, namespaceEnabled);
        XmlUtils.addLeosNamespace(document);
        Node node = document.getFirstChild();
        return softDeleteElement(node, replacePrefix);
    }

    protected String softDeleteElement(Node node, boolean replacePrefix) {
        insertOrUpdateAttributeValue(node, LEOS_EDITABLE_ATTR, Boolean.FALSE.toString());
        insertOrUpdateAttributeValue(node, LEOS_DELETABLE_ATTR, Boolean.FALSE.toString());
        updateSoftAttributes(SoftActionType.DELETE, node, true);

        cleanMoveFromAttributes(node);

        updateXMLIDAttributeFullStructureNode(node, SOFT_DELETE_PLACEHOLDER_ID_PREFIX, replacePrefix);
        return nodeToString(node);
    }

    protected void softDeleteElementForNode(Node node, boolean isTrackChangesEnabled) {
        insertOrUpdateAttributeValue(node, LEOS_EDITABLE_ATTR, Boolean.FALSE.toString());
        insertOrUpdateAttributeValue(node, LEOS_DELETABLE_ATTR, Boolean.FALSE.toString());
        SoftActionType actionType;
        if(SoftActionType.TRANSFORM.equals(getSoftAction(node))){
            actionType = SoftActionType.DELETE_TRANSFORM;
        } else {
            actionType = SoftActionType.DELETE;
        }
        updateSoftAttributes(actionType, node, true);

        cleanMoveFromAttributes(node);
        updateXMLIDAttributeFullStructureNode(node, SOFT_DELETE_PLACEHOLDER_ID_PREFIX, true);

        if (isTrackChangesEnabled) {
            addAttribute(node, LEOS_ACTION_ATTR, "delete");
            addAttribute(node, LEOS_UID, securityContext.getUser().getLogin());
            addAttribute(node, LEOS_TITLE, getTitleValue(securityContext));
        }

        propagateSoftDeleteToChildren(getChildren(node), actionType);
    }

    private void propagateSoftDeleteToChildren(List<Node> children, SoftActionType actionType) {
        for (int i = 0; i < children.size(); i++) {
            Node child = children.get(i);
            String origin = getAttributeValue(child, LEOS_ORIGIN_ATTR);
            if (CN.equals(origin) && is(child, Arrays.asList(SUBPARAGRAPH, SUBPOINT))) { // The CN part of the split should be
                // removed
                restoreTransformedNodeToContent(child);
                XmlUtils.deleteElement(child);
            } else {
                removeAttribute(child, LEOS_SOFT_ACTION_ATTR);
                propagateSoftDeleteToChildren(child, actionType);
            }
        }
    }

    private void propagateSoftDeleteToChildren(Node node, SoftActionType actionType) {
        cleanMoveFromAttributes(node);
        updateXMLIDAttributeFullStructureNode(node, SOFT_DELETE_PLACEHOLDER_ID_PREFIX, false);

        if(is(node, ELEMENTS_IN_TOC)) {
            updateSoftAttributes(actionType, node, false);
        }

        propagateSoftDeleteToChildren(getChildren(node), actionType);
    }

    protected void updateSoftAttributes(SoftActionType softAction, Node node, boolean isRoot) {
        if (softAction != null) {
            insertOrUpdateAttributeValue(node, LEOS_SOFT_ACTION_ATTR, softAction.getSoftAction());
        }
        insertOrUpdateAttributeValue(node, LEOS_SOFT_ACTION_ROOT_ATTR, String.valueOf(isRoot));
        insertOrUpdateAttributeValue(node, LEOS_SOFT_USER_ATTR, getSoftUserAttribute(securityContext.getUser()));
        insertOrUpdateAttributeValue(node, LEOS_SOFT_DATE_ATTR, getDateAsXml());
    }

    protected abstract Pair<byte[], Element> buildSplittedElementPair(byte[] xmlContent, Element splitElement);

    @Override
    public Pair<byte[], String> updateSoftMovedElement(byte[] xmlContent, String elementContent) {
        return new Pair(null, null);
    }

    @Override
    public boolean isAnnexComparisonRequired(byte[] contentBytes) {
        return true;
    }

    @Override
    public byte[] insertAttributeToElement(byte[] xmlContent, String elementTag, String elementId, String attrName, String attrVal) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, elementId);
        addAttribute(node, attrName, attrVal);
        return nodeToByteArray(document);
    }

    @Override
    public byte[] removeAttributeFromElement(byte[] xmlContent, String elementId, String attrName) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, elementId);
        removeAttribute(node, attrName);
        return nodeToByteArray(document);
    }

    @Override
    public List<Element> getElementsByPath(byte[] xmlContent, String xPath) {
        Document document = createDocument(xmlContent);
        List<Element> elements = new ArrayList<>();
        NodeList nodeList = XmlUtils.getElementsByXPath(document, xPath);
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node child = nodeList.item(i);
            String id = getId(child);
            if (id != null) {
                elements.add(new Element(id, child.getNodeName(), nodeToString(child)));
            }
        }
        return elements;
    }

    protected Node getNode(Document document, TableOfContentItemVO tocVo) {
        Node node = tocVo.getNode();
        if (!tocVo.isNewNode() && node == null) {
            node = XmlUtils.getElementByNameAndId(document, tocVo.getTagName().value(), tocVo.getId());
            if (node == null && hasIDAPrefix(tocVo.getId())) {
                node = XmlUtils.getElementByNameAndId(document, tocVo.getTagName().value(), removeIDPrefix(tocVo.getId()));
            }
        }
        if (node == null) {
            final String nodeTemplate;
            if (tocVo.getTagName().equals(AknTag.LIST)) {
                nodeTemplate = getTemplate(LIST);
            } else {
                List<TocItem> items = structureContextProvider.get().getTocItems();
                nodeTemplate = getTemplate(StructureConfigUtils.getTocItemByName(items, tocVo.getTagName()), tocVo.getNumber(), tocVo.getHeading(),
                        messageHelper);
            }
            node = createNodeFromXmlFragment(document, nodeTemplate.getBytes(UTF_8), false);
        } else {
            node = importNodeInDocument(document, node);
        }
        return node;
    }

    protected void appendChildIfNotNull(Node childNode, Node node) {
        if (childNode != null) {
            node.appendChild(childNode.cloneNode(true));
        }
    }

    protected void appendChildrenIfNotNull(List<Node> childrenNode, Node node) {
        for (int i = 0; i < childrenNode.size(); i++) {
            appendChildIfNotNull(childrenNode.get(i), node);
        }
    }

    protected void appendChildrenIfNotNull(NodeList childrenNode, Node node) {
        for (int i = 0; i < childrenNode.getLength(); i++) {
            appendChildIfNotNull(childrenNode.item(i), node);
        }
    }

    @Override
    public LeosCategory identifyCategory(byte[] xmlContent) {
        LeosCategory category = null;
        String xPath = xPathCatalog.getXPathAkomaNtosoFirstChild();
        Node node = getElementByXpath(xmlContent, xPath);
        if (XmlHelper.BILL.equals(node.getNodeName())) {
            category = LeosCategory.BILL;
        } else if (COVERPAGE.equals(node.getNodeName())) {
            category = LeosCategory.COVERPAGE;
        } else {
            String docNameAttr = getAttributeValue(node, XML_NAME);
            if (docNameAttr != null) {
                switch (docNameAttr) {
                    case ANNEX_FILE_PREFIX:
                        category = LeosCategory.ANNEX;
                        break;
                    case MEMORANDUM_FILE_PREFIX:
                        category = LeosCategory.MEMORANDUM;
                        break;
                    case COUNCIL_EXPLANATORY:
                        category = LeosCategory.COUNCIL_EXPLANATORY;
                        break;
                    case PROP_ACT:
                        category = LeosCategory.PROPOSAL;
                        break;
                    case STAT_DIGIT_FINANC_LEGIS:
                        category = LeosCategory.STAT_DIGIT_FINANC_LEGIS;
                        break;
                    default:
                        category = LeosCategory.MEDIA;
                }
            }
        }
        return category;
    }

    @Override
    public String getOriginalMilestoneName(String docName, byte[] xmlContent) {
        if(docName != null && docName.startsWith(PROPOSAL_FILE)) {
            String xPath = xPathCatalog.getXPathRefOriginForCloneOriginalMilestone();
            return getElementValue(xmlContent, xPath, true);
        }
        return null;
    }

    @Override
    public byte[] updateInitialNumberForArticles(byte[] xmlContent) {
        Document document = createDocument(xmlContent);
        NodeList nodes = XmlUtils.getElementsByName(document, ARTICLE);
        for (int i = 0; i < nodes.getLength(); i++) {
            Node node = nodes.item(i);
            String num = XmlUtils.getNodeNum(node);
            if (num != null) {
                addAttribute(node, LEOS_INITIAL_NUM, num);
            }
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] insertSoftAddedClassAttribute(byte[] contentBytes) {
        Document document = createDocument(contentBytes);
        NodeList nodes = document.getElementsByTagName(DOC);
        if (nodes != null && nodes.getLength() > 0) {
            Node bodyNode = getFirstChild(nodes.item(0), MAIN_BODY);
            XmlUtils.insertOrUpdateAttributeValueRecursively(bodyNode, ATTR_NAME, CONTENT_SOFT_ADDED_CLASS);
        }
        return nodeToByteArray(document);
    }

    protected boolean compareSoftAction(Node firstNode, Node secondNode) {
        SoftActionType softActionAttrSecondNode = XmlUtils.getAttributeForSoftAction(secondNode, LEOS_SOFT_ACTION_ATTR);
        SoftActionType softActionAttrFirstNode = XmlUtils.getAttributeForSoftAction(firstNode, LEOS_SOFT_ACTION_ATTR);
        if (softActionAttrFirstNode == null) {
            softActionAttrFirstNode = XmlUtils.getAttributeForSoftAction(firstNode.getParentNode(), LEOS_SOFT_ACTION_ATTR);
        }
        return softActionAttrSecondNode == null || softActionAttrSecondNode.equals(softActionAttrFirstNode);
    }

    @Override
    public boolean isRevisionAnnex(byte[] contentBytes) {
    	boolean isRevisionAnnex = false;
        Document document = createDocument(contentBytes);
        NodeList nodes = document.getElementsByTagName(DOC);
        if(nodes != null && nodes.getLength() > 0) {
            Node node = getFirstChild(nodes.item(0), MAIN_BODY);
            String origin = getAttributeValue(node, LEOS_ORIGIN_ATTR);
            isRevisionAnnex = CN.equals(origin);
        }
        return isRevisionAnnex;
    }

    @Override
    public String getOriginOfDocument(Node node) {
        String origin = "";
        Document document = null;
        if (node instanceof Document) {
            document = (Document) node;
        } else if (node instanceof Node) {
            document = node.getOwnerDocument();
        }
        if (document != null) {
            NodeList nodes = document.getElementsByTagName(DOC);
            if (nodes != null && nodes.getLength() > 0) {
                Node child = getFirstChild(nodes.item(0), MAIN_BODY);
                origin = getAttributeValue(child, LEOS_ORIGIN_ATTR);
            }
        }
        return origin;
    }

    protected boolean isPContent(String content, String tagName) {
        return getElementContentFragmentByPath(content.getBytes(UTF_8), "/" + tagName + "/content/p", false) != null;
    }

    protected int countChildren(byte[] xmlContent, String elementId, List<String> childrenNames) {
        Document document = createDocument(xmlContent);
        Node node = XmlUtils.getElementById(document, elementId);
        return XmlUtils.countChildren(node, childrenNames);
    }

    protected Element getMergedOnElement(Element mergeOnElement, byte[] xmlContent) {
        Element parentElement = getParentElement(xmlContent, mergeOnElement.getElementId());
        if (Arrays.asList(PARAGRAPH, POINT, INDENT).contains(parentElement.getElementTagName())
                && getChildElement(xmlContent, parentElement.getElementTagName(), parentElement.getElementId(), Arrays.asList(SUBPARAGRAPH, SUBPOINT, LIST), 3) == null) {
            return parentElement;
        } else if (Arrays.asList(LEVEL).contains(parentElement.getElementTagName())
                && countChildren(xmlContent, parentElement.getElementId(), Arrays.asList(SUBPARAGRAPH)) == 2) {
            //is the last subparagraph of a Level. Unwrap it and return the <content> tag.
            String contentXml = mergeOnElement.getElementFragment().replaceAll("<subparagraph.*?>", "").replaceAll("</subparagraph>", "");
            String wrappedContentXml = LeosDomainUtil.wrapXmlFragment(contentXml);

            Document document = createDocument(wrappedContentXml.getBytes(UTF_8));
            Node node = getFirstElementByName(document, CONTENT);
            String contentId = getId(node);
            mergeOnElement = new Element(contentId, CONTENT, contentXml);
        }
        return mergeOnElement;
    }

    @Override
    public byte[] removeDuplicateIds(byte[] xmlContent, boolean namespaceEnabled) {
        //overriding of the ID if there is a case
        Document document = createDocument(xmlContent, namespaceEnabled);
        Set idsSet = new HashSet();
        removeDuplicateIdsFromDocument(document.getDocumentElement(), idsSet);
        idsSet.clear();
        return nodeToByteArray(document);
    }

    private void removeDuplicateIdsFromDocument(Node node, Set idsSet) {
        String tagName = node.getNodeName();
        if (skipNodeAndChildren(tagName)) {// skipping node processing along with children
            return;
        }

        if (!skipNodeOnly(tagName)) {// do not update id for this tag
            String idAttrValue = getAttributeValue(node, XMLID);
            if (idAttrValue == null || idAttrValue.isEmpty() || idsSet.contains(idAttrValue)) {
                for (int i = 0; i < 3 && idsSet.contains(idAttrValue) ; i++) {
                    //eliminate the risk for infinite loop.  :D
                    idAttrValue = IdGenerator.generateId();
                }
                if(idsSet.contains(idAttrValue)){
                    LOG.error("After 3 loops, the id '{}' is the same", idAttrValue);
                    throw new IllegalStateException("Duplicate id attribute generated three times! Try again!");
                }
                addAttribute(node, XMLID, idAttrValue);
            }
            idsSet.add(idAttrValue);
        } else {
            removeAttribute(node, XMLID);
            removeAttribute(node, ID);
        }

        List<Node> children = getChildren(node);
        for (int i = 0; i < children.size(); i++) {
            removeDuplicateIdsFromDocument(children.get(i), idsSet);
        }
    }

    private void createMoveInfoTitle(Node node) {
        if (cloneContext != null && cloneContext.isClonedProposal()) {
            String title = getTitleValue(securityContext);
            addAttribute(node, LEOS_TITLE, title);
            Node numNode = getFirstChild(node, NUM);
            if (numNode != null) {
                addAttribute(numNode, LEOS_TITLE, title);
            }
        }
    }

    public SpecificDocumentInformationDTO getSpecificDocumentInformation(byte xmlContent[]) {
        Document document = createDocument(xmlContent);
        // We really should have this information on xml, if not, there is something wrong in template
        NodeList nodeListForResfersTo = XmlUtils.getElementsByXPath(document, ".//akn:longTitle//*[@refersTo]");
        String refersToOfDocument = nodeListForResfersTo.item(0).getAttributes().getNamedItem("refersTo").getTextContent();
        String showAs = nodeListForResfersTo.item(0).getTextContent();
        return new SpecificDocumentInformationDTO(refersToOfDocument, showAs);
    }

    @Override
    public byte[] alignBaseVersionDocumentIds(XmlDocument sourceXmlDoc, XmlDocument targetXmlDoc) throws IllegalArgumentException {
        Document sourceDoc = XmlUtils.createDocument(sourceXmlDoc);
        Document targetDoc = XmlUtils.createDocument(targetXmlDoc);
        Node attachmentsNode = removeAttachmentsIfExist(targetDoc);
        alignAllIds(sourceDoc, targetDoc, sourceXmlDoc.getCategory().toString());
        reinsertAttachments(targetDoc, attachmentsNode);
        highlightCoverPageDocPurpose(targetXmlDoc, targetDoc);
        return nodeToByteArray(targetDoc);
    }

    private Node removeAttachmentsIfExist(Document document) {
        Node attachmentsNode = getFirstElementByXPath(document, xPathCatalog.getXPathAttachments());
        return attachmentsNode != null ? deleteElement(attachmentsNode) : null;
    }

    private static void reinsertAttachments(Document document, Node attachmentsNode) {
        if (attachmentsNode != null) {
            Node billNode = getFirstElementByXPath(document, XPathCatalog.getXPathElement(BILL));
            addChild(attachmentsNode, billNode);
        }
    }

    private static void highlightCoverPageDocPurpose(XmlDocument xmlDocument, Document document) {
        if (LeosCategory.PROPOSAL.equals(xmlDocument.getCategory())) {
            Node docPurposeNode = getFirstElementByXPath(document, XPathCatalog.getXPathElement(DOC_PURPOSE));
            highlightNodeForTranslation(docPurposeNode);
        }
    }

    public void alignAllIds(Node sourceDoc, Node targetDoc, String category) {
        if (sourceDoc != null && targetDoc != null) {
            NodeList sourceNodes = getAllNodesWithId(sourceDoc);
            NodeList targetNodes = getAllNodesWithId(targetDoc);

            if (sourceNodes.getLength() == targetNodes.getLength()) {
                for (int i = 0; i < sourceNodes.getLength(); i++) {
                    Node sourceNode = sourceNodes.item(i);
                    Node targetNode = targetNodes.item(i);
                    validateNodeAlignment(sourceNode, targetNode, category);
                    String sourceNodeId = getId(sourceNode);
                    setId(targetNode, sourceNodeId);
                }
            } else {
                throw new IllegalArgumentException(category + " document not structurally aligned");
            }
        } else if (sourceDoc != null || targetDoc != null) {
            throw new IllegalArgumentException(category + " document not structurally aligned");
        }
    }

    private static NodeList getAllNodesWithId(Node node) {
        NodeList nodes = getElementsByXPath(node, String.format(".//*[@%s]", XMLID));
        if (nodes.getLength() == 0) {
            nodes = getElementsByXPath(node, String.format(".//*[@%s]", ID), false);
        }
        return nodes;
    }

    private void validateNodeAlignment(Node sourceNode, Node targetNode, String category) throws IllegalArgumentException {
        if (!sourceNode.getNodeName().equals(targetNode.getNodeName())
                || !getFirstAscendantId(sourceNode).equals(getFirstAscendantId(targetNode))
                || !getPreviousSiblingId(sourceNode).equals(getPreviousSiblingId(targetNode))) {
            throw new IllegalArgumentException(category + " document not structurally aligned");
        }
    }

    @Override
    public byte[] alignLatestVersionDocument(byte[] sourceXml, byte[] sourceBaseXml, XmlDocument targetXmlDoc) throws IllegalArgumentException {
        Document sourceBaseDoc = createDocument(sourceBaseXml);
        Document sourceDoc = createDocument(sourceXml);
        Document targetDoc = XmlUtils.createDocument(targetXmlDoc);

        alignMetaNode(sourceDoc, targetDoc);
        replaceUnchangedContentInSourceDocByTarget(targetDoc, sourceDoc, sourceBaseDoc);
        replaceDocumentRefsFromProposalInSourceByTarget(sourceDoc, targetDoc);
        alignInternalReferences(sourceDoc, targetDoc);
        alignAlternatives(targetXmlDoc, sourceDoc, sourceBaseDoc);
        alignAttachmentsIds(sourceDoc, targetDoc);

        return nodeToByteArray(sourceDoc);
    }

    private static void alignMetaNode(Document sourceDoc, Document targetDoc) {
        Node sourceMeta = getFirstElementByXPath(sourceDoc, XPathCatalog.getXPathElement(META));
        Node targetMeta = getFirstElementByXPath(targetDoc, XPathCatalog.getXPathElement(META));
        Node sourceMetaDocPurpose = getFirstElementByXPath(sourceMeta, XPathCatalog.getXPathProprietaryDocPurpose());

        // Take previous target meta node, adding/removing nodes based on source
        removeDeletedNodes(targetMeta, sourceMeta);
        addNewNodes(sourceMeta, targetMeta);
        importAndReplaceNodeInDocument(sourceDoc, sourceMeta, targetMeta);

        // Maintain docPurpose from source to be aligned later with standard alignment depending on content changed
        importAndReplaceNodeInDocument(sourceDoc, sourceMetaDocPurpose, sourceMetaDocPurpose);
    }

    private static void removeDeletedNodes(Node targetRootNode, Node sourceRootNode) {
        NodeList targetNodes = getAllNodesWithId(targetRootNode);
        for (int i = 0; i < targetNodes.getLength(); i++) {
            Node targetNode = targetNodes.item(i);
            Node nodeInSource = XmlUtils.getElementById(sourceRootNode, getId(targetNode));
            if (nodeInSource == null) {
                deleteElement(targetNode);
            }
        }
    }

    private static void addNewNodes(Node sourceRootNode, Node targetRootNode) {
        NodeList sourceNodes = getAllNodesWithId(sourceRootNode);
        for (int i = 0; i < sourceNodes.getLength(); i++) {
            Node sourceNode = sourceNodes.item(i);
            addNodeToDocumentIfNotExists(targetRootNode, sourceNode);
        }
    }

    private static void addNodeToDocumentIfNotExists(Node targetRootNode, Node nodeToBeAdded) {
        Node nodeInTargetDocument = XmlUtils.getElementById(targetRootNode, getId(nodeToBeAdded));
        if (nodeInTargetDocument == null) {
            Node importedNode = importNodeInDocument(targetRootNode.getOwnerDocument(), nodeToBeAdded);
            Node prevSiblingInTargetDocument = XmlUtils.getElementById(targetRootNode, getPreviousSiblingId(nodeToBeAdded));
            if (prevSiblingInTargetDocument != null) {
                addSibling(importedNode, prevSiblingInTargetDocument, false);
            } else {
                Node parentNodeInTargetDocument = XmlUtils.getElementById(targetRootNode, getId(nodeToBeAdded.getParentNode()));
                addFirstChild(importedNode, parentNodeInTargetDocument);
            }
        }
    }

    private static void importAndReplaceNodeInDocument(Document doc, Node originalNode, Node nodeToImport) {
        if (originalNode != null && nodeToImport != null && !originalNode.isSameNode(nodeToImport)) {
            Node importedNode = importNodeInDocument(doc, nodeToImport);
            String originalNodeId = getId(originalNode);
            Node nodeToBeReplaced = originalNodeId != null ? XmlUtils.getElementById(doc, originalNodeId) : originalNode;
            XmlUtils.replaceElement(importedNode, nodeToBeReplaced);
        }
    }

    private static void replaceUnchangedContentInSourceDocByTarget(Document targetDoc, Document sourceDoc, Document sourceBaseDoc) {
        NodeList sourceNodes = getAllNodesWithId(sourceDoc);
        for (int i = 0; i < sourceNodes.getLength(); i++) {
            Node sourceNode = sourceNodes.item(i);
            highlightNodeForTranslation(sourceNode);
            Node targetNode = XmlUtils.getElementById(targetDoc, getId(sourceNode));
            Node sourceBaseNode = XmlUtils.getElementById(sourceBaseDoc, getId(sourceNode));
            if (targetNode != null && anyHasTextOrImgChildren(sourceNode, targetNode)) {
                Node alignedNode = alignChildNodes(sourceNode, targetDoc);
                if (changedTextContentInSource(sourceNode, sourceBaseNode) || changedImageContentInSource(sourceNode, sourceBaseNode)) {
                    highlightNodeForTranslation(alignedNode);
                }
                importAndReplaceNodeInDocument(sourceDoc, sourceNode, alignedNode);
            }
        }
    }

    private static void highlightNodeForTranslation(Node node) {
        if (!hasAscendantOfType(node, META) && !hasAscendantOfType(node, PREFACE) && !is(node, NUM) && anyHasTextOrImgChildren(node)) {
            insertAttributeIfNotPresent(node, LEOS_UPDATE_TRANSLATION, "true");
        }
    }

    private static boolean anyHasTextOrImgChildren(Node... nodes) {
        List<String> childrenTypes = new ArrayList<>(STYLING_ELEMENTS);
        childrenTypes.add(IMG);
        return Arrays.stream(nodes).anyMatch(node -> !getChildren(node, childrenTypes, true).isEmpty());
    }

    private static boolean changedTextContentInSource(Node sourceNode, Node sourceBaseNode) {
        List<Node> sourceTextNodes = getTextChildren(sourceNode);
        if (!sourceTextNodes.isEmpty()) {
            return sourceBaseNode == null || !getTextChildren(sourceBaseNode).stream().map(Node::getTextContent).collect(Collectors.joining())
                    .equals(sourceTextNodes.stream().map(Node::getTextContent).collect(Collectors.joining()));
        }
        return false;
    }

    private static boolean changedImageContentInSource(Node sourceNode, Node sourceBaseNode) {
        List<Node> sourceImgChildren = getChildren(sourceNode, IMG);
        if (!sourceImgChildren.isEmpty()) {
            return sourceBaseNode == null || !getChildren(sourceBaseNode, IMG).stream().map((node) -> getAttributeValue(node, "src")).collect(Collectors.joining())
                    .equals(sourceImgChildren.stream().map((node) -> getAttributeValue(node, "src")).collect(Collectors.joining()));
        }
        return false;
    }

    /**
     * Returns the equivalent target node with its child nodes (with ID) replaced by the source node's child nodes (with ID) if they exist in target.
     * If the source node has any child (with ID) that doesn't exist in target, it returns the source node.
     *
     * @param sourceNode
     * @param targetDoc
     * @return
     */
    private static Node alignChildNodes(Node sourceNode, Document targetDoc) {
        // Clone target document to avoid replacing sourceChildNodes in the original targetDoc, which can be required when aligning children nodes
        Document clonedTargetDoc = (Document) targetDoc.cloneNode(true);
        Node clonedTargetNode = XmlUtils.getElementById(clonedTargetDoc, getId(sourceNode));
        List<Node> sourceChildNodesWithId = getNonStylingChildren(sourceNode);
        if (sourceChildNodesWithId.stream().allMatch((Node sourceChildNodeWithId) -> {
            Node targetChildNodeWithId = XmlUtils.getElementById(clonedTargetNode, getId(sourceChildNodeWithId));
            if (targetChildNodeWithId != null) {
                highlightNodeAndDescendantsForTranslation(sourceChildNodeWithId);
                // Target node's text will be returned to be replaced in source doc, but source node's children with ID will be kept (to be aligned later)
                importAndReplaceNodeInDocument(clonedTargetDoc, targetChildNodeWithId, sourceChildNodeWithId);
                return true;
            }
            // If there's no corresponding node in target document (because it's new in source), we need to take the whole source node to overwrite the target node
            return false;
        })) {
            removeDeletedNodes(clonedTargetNode, sourceNode);
            return clonedTargetNode;
        }
        return sourceNode;
    }

    private static void highlightNodeAndDescendantsForTranslation(Node node) {
        highlightNodeForTranslation(node);
        NodeList sourceNodes = getAllNodesWithId(node);
        for (int i = 0; i < sourceNodes.getLength(); i++) {
            Node sourceNode = sourceNodes.item(i);
            highlightNodeForTranslation(sourceNode);
        }
    }

    private void replaceDocumentRefsFromProposalInSourceByTarget(Document sourceDoc, Document targetDoc) {
        NodeList sourceDocumentRefNodes = getElementsByXPath(sourceDoc, xPathCatalog.getXPathDocumentRefFromProposal());
        NodeList targetDocumentRefNodes = getElementsByXPath(targetDoc, xPathCatalog.getXPathDocumentRefFromProposal());
        for (int i = 0; i < sourceDocumentRefNodes.getLength(); i++) {
            Node sourceDocumentRefNode = sourceDocumentRefNodes.item(i);
            Node targetDocumentRefNode = targetDocumentRefNodes.item(i);
            importAndReplaceNodeInDocument(sourceDoc, sourceDocumentRefNode, targetDocumentRefNode);
        }
    }

    private void alignInternalReferences(Document sourceDoc, Document targetDoc) {
        String targetLanguage = getFirstElementByXPath(targetDoc, xPathCatalog.getXPathDocLanguage()).getNodeValue();
        NodeList mrefList = XmlUtils.getElementsByName(sourceDoc, MREF);
        for (int i = 0; i < mrefList.getLength(); i++) {
            List<Node> refs = getChildren(mrefList.item(i), REF);
            for (Node ref : refs) {
                String href = getAttributeValue(ref, HREF);
                if (href != null) {
                    addAttribute(ref, HREF, href.replaceAll("(?<=-)[a-z]{2}(?=\\.xml)", targetLanguage));
                }
            }
        }
    }

    private void alignAlternatives(XmlDocument targetXmlDoc, Document sourceDoc, Document sourceBaseDoc) {
        List<Node> sourceAlternativeNodes = XmlUtils.getDescendantsWithAttribute(sourceDoc, LEOS_ALTERNATIVE_ATTR);
        List<Node> sourceBaseAlternativeNodes = XmlUtils.getDescendantsWithAttribute(sourceBaseDoc, LEOS_ALTERNATIVE_ATTR);

        sourceAlternativeNodes.forEach(sourceAlternativeNode -> {
            Node sourceBaseAlternativeNode = sourceBaseAlternativeNodes.stream()
                    .filter(sourceBaseNode -> StringUtils.equals(getId(sourceAlternativeNode), getId(sourceBaseNode))).findFirst().orElse(null);
            String selectedOption = XmlUtils.getAttributeValue(sourceAlternativeNode, LEOS_SELECTED_OPTION_ATTR);
            if (!StringUtils.equals(selectedOption, XmlUtils.getAttributeValue(sourceBaseAlternativeNode, LEOS_SELECTED_OPTION_ATTR))) {
                replaceAlternativeNodeWithContentFromLanguageTemplateConfig(targetXmlDoc, sourceAlternativeNode, selectedOption);
            }
        });
    }

    private void replaceAlternativeNodeWithContentFromLanguageTemplateConfig(XmlDocument targetXmlDoc, Node sourceAlternativeNode, String selectedOption) {
        LeosMetadata targetDocMetadata = targetXmlDoc.getMetadata().get();
        documentLanguageContext.setDocumentLanguage(targetDocMetadata.getLanguage());
        JsonNode targetAlternatives = templateConfigurationService.getElementJsonFromTemplateConfiguration(targetDocMetadata.getDocTemplate(), "alternatives");
        String optionList = XmlUtils.getAttributeValue(sourceAlternativeNode, LEOS_OPTION_LIST_ATTR);
        targetAlternatives.elements().forEachRemaining(alternativesList -> {
            if (StringUtils.equals(optionList, alternativesList.get("name").asText())) {
                alternativesList.get("list").elements().forEachRemaining(alternativeItem -> {
                    if (StringUtils.equals(selectedOption, alternativeItem.get("index").asText())) {
                        String xmlFragment = alternativeItem.get("content").asText();
                        Node targetAlternativeNode = createNodeFromXmlFragment(sourceAlternativeNode.getOwnerDocument(),
                                xmlFragment.getBytes(StandardCharsets.UTF_8), false);
                        XmlUtils.replaceElement(targetAlternativeNode, sourceAlternativeNode);
                    }
                });
            }
        });
    }

    private void alignAttachmentsIds(Document sourceDoc, Document targetDoc) {
        Node sourceAttachmentsNode = getFirstElementByXPath(sourceDoc, xPathCatalog.getXPathAttachments());
        Node targetAttachmentsNode = getFirstElementByXPath(targetDoc, xPathCatalog.getXPathAttachments());
        alignAllIds(sourceAttachmentsNode, targetAttachmentsNode, LeosCategory.BILL.toString());
        importAndReplaceNodeInDocument(sourceDoc, sourceAttachmentsNode, targetAttachmentsNode);
    }
}
