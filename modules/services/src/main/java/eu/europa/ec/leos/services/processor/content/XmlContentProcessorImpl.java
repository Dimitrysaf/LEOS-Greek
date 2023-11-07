/*
 * Copyright 2022 European Commission
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

import com.google.common.base.Stopwatch;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.SoftActionType;
import eu.europa.ec.leos.model.annex.LevelItemVO;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.label.ReferenceLabelService;
import eu.europa.ec.leos.services.label.ref.Ref;
import eu.europa.ec.leos.services.numbering.depthBased.ClassToDepthType;
import eu.europa.ec.leos.services.support.EditableAttributeValue;
import eu.europa.ec.leos.services.support.IdGenerator;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.util.LeosDomainUtil;
import eu.europa.ec.leos.vo.toc.Attribute;
import eu.europa.ec.leos.vo.toc.NumberingConfig;
import eu.europa.ec.leos.vo.toc.StructureConfigUtils;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import eu.europa.ec.leos.vo.toc.TocItemTypeName;
import io.atlassian.fugue.Pair;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.Validate;
import org.apache.commons.lang3.tuple.ImmutableTriple;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.inject.Provider;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
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
import static eu.europa.ec.leos.services.support.LeosXercesUtils.getTitleValue;
import static eu.europa.ec.leos.services.support.XercesUtils.addAttribute;
import static eu.europa.ec.leos.services.support.XercesUtils.addSibling;
import static eu.europa.ec.leos.services.support.XercesUtils.createElement;
import static eu.europa.ec.leos.services.support.XercesUtils.createNodeFromXmlFragment;
import static eu.europa.ec.leos.services.support.XercesUtils.createXercesDocument;
import static eu.europa.ec.leos.services.support.XercesUtils.getAttributeValue;
import static eu.europa.ec.leos.services.support.XercesUtils.getChildContent;
import static eu.europa.ec.leos.services.support.XercesUtils.getChildren;
import static eu.europa.ec.leos.services.support.XercesUtils.getContentByTagName;
import static eu.europa.ec.leos.services.support.XercesUtils.getFirstChild;
import static eu.europa.ec.leos.services.support.XercesUtils.getFirstElementByName;
import static eu.europa.ec.leos.services.support.XercesUtils.getId;
import static eu.europa.ec.leos.services.support.XercesUtils.getNextSibling;
import static eu.europa.ec.leos.services.support.XercesUtils.getParentId;
import static eu.europa.ec.leos.services.support.XercesUtils.hasAttributeWithValue;
import static eu.europa.ec.leos.services.support.XercesUtils.importNodeInDocument;
import static eu.europa.ec.leos.services.support.XercesUtils.insertOrUpdateAttributeValue;
import static eu.europa.ec.leos.services.support.XercesUtils.insertOrUpdateStylingAttribute;
import static eu.europa.ec.leos.services.support.XercesUtils.is;
import static eu.europa.ec.leos.services.support.XercesUtils.isFirstSubParagraph;
import static eu.europa.ec.leos.services.support.XercesUtils.nodeToByteArray;
import static eu.europa.ec.leos.services.support.XercesUtils.nodeToString;
import static eu.europa.ec.leos.services.support.XercesUtils.removeAttribute;
import static eu.europa.ec.leos.services.support.XercesUtils.removeXmlNSAttributes;
import static eu.europa.ec.leos.services.support.XercesUtils.updateXMLIDAttributeFullStructureNode;
import static eu.europa.ec.leos.services.support.XmlHelper.*;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringEscapeUtils.escapeXml10;
import static org.apache.commons.lang3.StringUtils.normalizeSpace;

public abstract class XmlContentProcessorImpl implements XmlContentProcessor {

    private static final Logger LOG = LoggerFactory.getLogger(XmlContentProcessorImpl.class);

    public static final String NBSP = "\u00a0";
    public static final String[] NUMBERED_AND_LEVEL_ITEMS = {PARAGRAPH, POINT, LEVEL, INDENT};

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

    @Override
    public byte[] anonymizeTrackChanges(byte[] xmlContent) {
        Document document = createXercesDocument(xmlContent);
        NodeList elements = XercesUtils.getElementsByXPath(document, xPathCatalog.getXPathTrackChanges());
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
        Document document = createXercesDocument(xmlContent);
        cleanTrackChangesForElement(document);
        return nodeToByteArray(document);
    }

    private boolean cleanTrackChangesForElement(Node node) {
        NodeList nodeList = node.getChildNodes();
        for (int index = 0; index < nodeList.getLength(); index++) {
            Node childNode = nodeList.item(index);
            if (childNode.getNodeType() != Node.TEXT_NODE) {
                boolean isNodeDeleted = doCleanTrackChanges(childNode);
                if(isNodeDeleted) {
                    index--;
                } else {
                    isNodeDeleted = cleanTrackChangesForElement(childNode);
                    if(isNodeDeleted) {
                        index--;
                    }
                }
            }
        }
        if(!node.hasChildNodes()) {
            XercesUtils.deleteElement(node);
            return true;
        }
        return false;
    }

    private boolean doCleanTrackChanges(Node node) {
        boolean isNodeDeleted = false;
        if(LEOS_TC_DELETE_ELEMENT_NAME.equals(node.getNodeName())) {
            XercesUtils.deleteElement(node);
            isNodeDeleted = true;
        } else if(LEOS_TC_INSERT_ELEMENT_NAME.equals(node.getNodeName())) {
            XercesUtils.replaceElement(node.getFirstChild(), node);
            isNodeDeleted = true;
        } else if(hasAttributeWithValue(node, LEOS_ACTION_ATTR, LEOS_TC_DELETE_ACTION)) {
            if("span".equals(node.getNodeName())) {
                XercesUtils.deleteElement(node);
                isNodeDeleted = true;
            } else {
                removeTrackChangesAttributes(node);
            }
        } else if(hasAttributeWithValue(node, LEOS_ACTION_ATTR, LEOS_TC_INSERT_ACTION)) {
            if("span".equals(node.getNodeName())) {
                XercesUtils.replaceElement(node.getFirstChild(), node);
                isNodeDeleted = true;
            } else {
                removeTrackChangesAttributes(node);
            }
        }
        return isNodeDeleted;
    }

    private void removeTrackChangesAttributes(Node node) {
        XercesUtils.removeAttribute(node, LEOS_ACTION_ATTR);
        XercesUtils.removeAttribute(node, LEOS_ACTION_NUMBER);
        XercesUtils.removeAttribute(node, LEOS_ACTION_ENTER);
        XercesUtils.removeAttribute(node, LEOS_TITLE);
        XercesUtils.removeAttribute(node, LEOS_TITLE_NUMBER);
        XercesUtils.removeAttribute(node, LEOS_TITLE_ENTER);
        XercesUtils.removeAttribute(node, LEOS_UID);
        XercesUtils.removeAttribute(node, LEOS_UID_NUMBER);
        XercesUtils.removeAttribute(node, LEOS_UID_ENTER);
        XercesUtils.removeAttribute(node, LEOS_TC_ORIGINAL_NUMBER);
    }

    @Override
    public byte[] cleanSoftActions(byte[] xmlContent) {
        Document document = createXercesDocument(xmlContent);
        cleanSoftActionForElement(document);
        return nodeToByteArray(document);
    }

    private void cleanSoftActionForElement(Node node) {
        NodeList nodeList = node.getChildNodes();
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node childNode = nodeList.item(i);
            if (childNode.getNodeType() != Node.TEXT_NODE) {
                doCleanSoftAction(childNode);
                removeMiscAttributes(childNode);
                cleanSoftActionForElement(childNode);
            }
        }
    }

    private void doCleanSoftAction(Node node) {
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
                    XercesUtils.deleteElement(node);
                    break;
            }
        }
    }

    private SoftActionType getSoftAction(Node node) {
        SoftActionType softActionType = null;
        String tagName = node.getNodeName();
        String attrVal = XercesUtils.getAttributeValue(node, LEOS_SOFT_ACTION_ATTR);
        if (!isExcludedNode(tagName) && attrVal != null) {
            softActionType = SoftActionType.of(attrVal);
        }
        return softActionType;
    }

    private void cleanSoftActionAttributes(Node node) {
        XercesUtils.removeAttribute(node, LEOS_SOFT_ACTION_ATTR);
        XercesUtils.removeAttribute(node, LEOS_SOFT_ACTION_ROOT_ATTR);
        XercesUtils.removeAttribute(node, LEOS_SOFT_USER_ATTR);
        XercesUtils.removeAttribute(node, LEOS_SOFT_DATE_ATTR);
    }

    private void cleanMoveFromAttributes(Node node) {
        XercesUtils.removeAttribute(node, LEOS_SOFT_MOVED_LABEL_ATTR);
        XercesUtils.removeAttribute(node, LEOS_SOFT_MOVE_FROM);
        XercesUtils.removeAttribute(node, LEOS_SOFT_MOVE_TO);
    }

    @Override
    public byte[] cleanMiscAttributes(byte[] xmlContent) {
        Document document = createXercesDocument(xmlContent);
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
        if(XercesUtils.containsAttributeWithValue(node, LEOS_ORIGIN_ATTR, EC)) {
            XercesUtils.removeAttribute(node, LEOS_ORIGIN_ATTR);
        }
        XercesUtils.removeAttribute(node, LEOS_DEPTH_ATTR);
        XercesUtils.removeAttribute(node, LEOS_EDITABLE_ATTR);
        XercesUtils.removeAttribute(node, LEOS_DELETABLE_ATTR);
    }

    @Override
    public byte[] cleanSoftActionsForNode(byte[] xmlContent, List<TocItem> tocItemList) {
        Document document = createXercesDocument(xmlContent);
        cleanSoftActionsForNode(document, tocItemList);
        return nodeToByteArray(document);
    }

    private void cleanSoftActionsForNode(Node node, List<TocItem> tocItemList) {
        Node childNode = node.getFirstChild().getFirstChild();
        if (childNode.getNodeType() != Node.TEXT_NODE) {
            cleanSoftActionAttributes(childNode);
            cleanMoveFromAttributes(childNode);
            XercesUtils.removeAttribute(childNode, LEOS_ORIGIN_ATTR);
            TocItem tocItem = StructureConfigUtils.getTocItemByName(tocItemList, childNode.getNodeName());
            if(tocItem != null && tocItem.isEditable()) {
                insertOrUpdateAttributeValue(childNode, LEOS_EDITABLE_ATTR, "true");
            }
            insertOrUpdateAttributeValue(childNode, LEOS_DELETABLE_ATTR, "true");
        }
    }

    @Override
    public byte[] createDocumentContentWithNewTocList(List<TableOfContentItemVO> tableOfContentItemVOs, byte[] content, User user, boolean isTrackChangesEnabled) {
        LOG.trace("Start building the document content for the new toc list");
        long startTime = System.currentTimeMillis();
        List<TocItem> tocItems = structureContextProvider.get().getTocItems();
        List<NumberingConfig> numberingConfigs = structureContextProvider.get().getNumberingConfigs();
        Map<TocItem, List<TocItem>> tocRules = structureContextProvider.get().getTocRules();

        Document document = createXercesDocument(content);
        for (TableOfContentItemVO tocVo : tableOfContentItemVOs) {
            Node node = navigateToTocElement(tocVo, document);
            LOG.trace("Build content for parent TOC item '{}', node '{}'", tocVo.getTocItem().getAknTag().value(), node.getNodeName());
            Node newNode = buildTocItemContent(tocItems, numberingConfigs, tocRules, document, null, tocVo, user, isTrackChangesEnabled);
            newNode = importNodeInDocument(document, newNode);
            XercesUtils.replaceElement(newNode, node);
        }

        LOG.trace("Build the document content for the new toc list completed in {} ms", (System.currentTimeMillis() - startTime));
        return nodeToByteArray(document);
    }

    private Node navigateToTocElement(TableOfContentItemVO tocVo, Node document) {
        return getFirstElementByName(document, tocVo.getTocItem().getAknTag().value());
    }

    protected abstract Node buildTocItemContent(List<TocItem> tocItems, List<NumberingConfig> numberingConfigs, Map<TocItem, List<TocItem>> tocRules,
                                                Document document, Node parentNode, TableOfContentItemVO tocVo, User user, boolean isTrackChangesEnabled);

    @Override
    public String getElementValue(byte[] xmlContent, String xPath, boolean namespaceEnabled) {
        Document document = createXercesDocument(xmlContent, namespaceEnabled);
        Node node = XercesUtils.getFirstElementByXPath(document, xPath, namespaceEnabled);
        String elementValue = null;
        if (node != null) {
            elementValue = node.getTextContent();
        }
        return elementValue;
    }

    @Override
    public boolean evalXPath(byte[] xmlContent, String xPath, boolean namespaceEnabled) {
        Document document = createXercesDocument(xmlContent, namespaceEnabled);
        return XercesUtils.evalXPath(document, xPath, namespaceEnabled);
    }

    @Override
    public int getElementCountByXpath(byte[] xmlContent, String xPath, boolean namespaceEnabled){
        Document document = createXercesDocument(xmlContent, namespaceEnabled);
        return XercesUtils.getElementCountByXpath(document, xPath, namespaceEnabled);
    }

    @Override
    public String getAttributeValueByXpath(byte[] xmlContent, String xPath, String attrName) {
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getFirstElementByXPath(document, xPath);
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
        Document document = createXercesDocument(xmlContent, namespaceEnabled);
        XercesUtils.deleteElementsByXPath(document, xPath, namespaceEnabled);
        return nodeToByteArray(document);
    }

    @Override
    public byte[] insertElement(byte[] xmlContent, String xPath, boolean namespaceEnabled, String newContent) {
        Document document = createXercesDocument(xmlContent, namespaceEnabled);
        Node node = XercesUtils.getFirstElementByXPath(document, xPath, namespaceEnabled);
        if (node != null) {
            Node newNode = XercesUtils.createNodeFromXmlFragment(document, newContent.getBytes(UTF_8), false);
            addSibling(newNode, node, false);
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] replaceElement(byte[] xmlContent, String xPath, boolean namespaceEnabled, String newContent) {
        Document document = createXercesDocument(xmlContent, namespaceEnabled);  //TODO remove the boolean, always coming as true
        Node node = XercesUtils.getFirstElementByXPath(document, xPath, namespaceEnabled);
        if (node != null) {
            node = XercesUtils.replaceElement(node, newContent);
            xmlContent = nodeToByteArray(node);
        }
        return xmlContent;
    }

    @Override
    public byte[] replaceElementById(byte[] xmlContent, String newContent, String elementId) {
        Document document = createXercesDocument(xmlContent);
        Node elementNode = XercesUtils.getElementById(document, elementId);

        if (elementNode != null) {
            Node documentNode = XercesUtils.replaceElement(elementNode, newContent);
            xmlContent = nodeToByteArray(documentNode);
            //TODO refactor doXMLPostProcessing to work with Node in input too. To increase performance
            xmlContent = doXMLPostProcessing(xmlContent);
            xmlContent = processUnnumberedParagraph(xmlContent, newContent, elementId);
        }
        return xmlContent;
    }

    private byte[] processUnnumberedParagraph(byte[] xmlContent, String newContent, String elementId) {
        if (newContent.startsWith(PARA_OPEN_TAG) && newContent.contains(LIST_CLOSE)) {
            Document newNode = createXercesDocument(newContent.getBytes(StandardCharsets.UTF_8), false);
            if (newNode.getDocumentElement().getTagName().equals(PARAGRAPH)
                    && XercesUtils.getFirstChild(XercesUtils.getFirstChild(newNode), NUM) == null) {
                Document updatedDocument = createXercesDocument(xmlContent);
                Node updatedNode = XercesUtils.getElementById(updatedDocument, elementId);
                if(updatedNode != null) {
                    String updatedNodeContent = XmlHelper.removeAllNameSpaces(XercesUtils.nodeToString(updatedNode));
                    NodeList nodeList = updatedNode.getChildNodes();
                    for (int i = 0; i < nodeList.getLength(); i++) {
                        String childNodeContent = XmlHelper.removeAllNameSpaces(XercesUtils.nodeToString(nodeList.item(i)));
                        if (nodeList.item(i).getNodeName().equals(LIST)) {
                            if (i == 0) {
                                updatedNodeContent = updatedNodeContent.replace(childNodeContent, childNodeContent + PARA_END);
                            } else {
                                updatedNodeContent = updatedNodeContent.replace(childNodeContent, PARA_START + childNodeContent + PARA_END);
                            }
                        } else if (nodeList.item(i).getNodeName().equals(SUBPARAGRAPH)) {
                            if (i == 0) {
                                updatedNodeContent = updatedNodeContent.replace(childNodeContent, childNodeContent.replaceFirst(SUBPARA_REGEX, "").replace(SUBPARA_END, PARA_END));
                            } else {
                                updatedNodeContent = updatedNodeContent.replace(childNodeContent, childNodeContent.replace("<" + SUBPARAGRAPH, "<" + PARAGRAPH).replace(SUBPARA_END, PARA_END));
                            }
                        }
                        updatedNodeContent = updatedNodeContent.replace(PARA_END + PARA_END, PARA_END);
                    }
                    Document newDocument = createXercesDocument(xmlContent);
                    Node newElementNode = XercesUtils.getElementById(newDocument, elementId);
                    Node updatedDocumentNode = XercesUtils.replaceElement(newElementNode, updatedNodeContent);
                    xmlContent = nodeToByteArray(updatedDocumentNode);
                }
            }
        }
        return xmlContent;
    }

    @Override
    public byte[] insertElementByTagNameAndId(byte[] xmlContent, String elementTemplate, String tagName, String idAttributeValue, boolean before, boolean isTrackChangesEnabled) {
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, idAttributeValue);
        if (node != null) {
            Node newNode = XercesUtils.createNodeFromXmlFragment(document, elementTemplate.getBytes(UTF_8), false);
            if (XercesUtils.isListIntro(node) && before) {
                XercesUtils.addSibling(newNode, node.getParentNode(), before);
            } else if (XercesUtils.isListIntro(node) && !before) {
                node.getParentNode().getParentNode().insertBefore(node, node.getParentNode());
                XercesUtils.removeAttribute(node, REFERS_TO_ATTR);
                node.getParentNode().insertBefore(newNode, node.getParentNode().getFirstChild());
                XercesUtils.addAttribute(newNode, REFERS_TO_ATTR, INTRODUCTORY_PART);
            } else if (XercesUtils.isListWrapper(node) && !before) {
                XercesUtils.addSibling(newNode, node.getParentNode(), before);
            } else if (XercesUtils.isListWrapper(node) && before) {
                Node nextSiblingOfParent = XercesUtils.getNextSibling(node.getParentNode());
                if (nextSiblingOfParent == null) {
                    node.getParentNode().getParentNode().appendChild(node);
                } else {
                    node.getParentNode().getParentNode().insertBefore(node, nextSiblingOfParent);
                }
                XercesUtils.removeAttribute(node, REFERS_TO_ATTR);
                node.getParentNode().appendChild(newNode);
                XercesUtils.addAttribute(newNode, REFERS_TO_ATTR, ENDING_PART);
            }
            XercesUtils.addSibling(newNode, node, before);

            if(isTrackChangesEnabled) {
                ZonedDateTime localDateTime = ZonedDateTime.now();
                addAttribute(newNode, LEOS_ACTION_ATTR, "insert");
                addAttribute(newNode, LEOS_UID, securityContext.getUser().getLogin());
                addAttribute(newNode, LEOS_TITLE,
                        securityContext.getUser().getName() + " : " + localDateTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
            }
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] addChildToParent(byte[] xmlContent, String elementContent, String parentId) {
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, parentId);
        if (node != null) {
            Node newNode = XercesUtils.createNodeFromXmlFragment(document, elementContent.getBytes(UTF_8), false);
            XercesUtils.addLastChild(newNode, node);
        }
        return nodeToByteArray(document);
    }

    @Override
    public String getElementByNameAndId(byte[] xmlContent, String tagName, String idAttributeValue) {
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementByNameAndId(document, tagName, idAttributeValue);
        String elementAsString = null;
        if (node != null) {
            elementAsString = nodeToString(node);
            elementAsString = removeAllNameSpaces(elementAsString);
        }
        return elementAsString;
    }

    @Override
    public String getParentTagNameById(byte[] xmlContent, String idAttributeValue) {
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, idAttributeValue);
        return XercesUtils.getParentTagName(node);
    }

    @Override
    public String getParentIdById(byte[] xmlContent, String idAttributeValue) {
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, idAttributeValue);
        return XercesUtils.getParentId(node);
    }

    @Override
    public String getElementAttributeValueByNameAndId(byte[] xmlContent, String attributeName, String tagName, String idAttributeValue) {
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementByNameAndId(document, tagName, idAttributeValue);
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
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, idAttributeValue);
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
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, idAttributeValue);
        if (node != null) {
            return XercesUtils.isListIntro(node);
        }
        return false;
    }

    @Override
    public Element getSiblingElement(byte[] xmlContent, String tagName, String idAttributeValue, List<String> elementTags, boolean before) {
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, idAttributeValue);
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
        while ((sibling = XercesUtils.getSibling(node, before)) != null && !foundIntro && element == null) {
            String elementTagName = sibling.getNodeName();
            if (elementTags.contains(elementTagName) || elementTags.isEmpty()) {
                String elementId = getId(sibling) != null ? getId(sibling) : "";
                String elementFragment = nodeToString(sibling);
                element = new Element(elementId, elementTagName, elementFragment);
            }
            String refersTo = XercesUtils.getAttributeValue(sibling, XmlHelper.REFERS_TO_ATTR);
            foundIntro = refersTo != null && refersTo.equals(XmlHelper.INTRODUCTORY_PART);
        }
        return element;
    }

    @Override
    public Element getChildElement(byte[] xmlContent, String tagName, String idAttributeValue, List<String> elementTags, int position) {
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, idAttributeValue);
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
    public Element getLastChildElement(byte[] xmlContent, String tagName, String idAttributeValue, List<String> elementTags) {
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, idAttributeValue);
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
        Document document = createXercesDocument(xmlContent);
        NodeList elements = XercesUtils.getElementsByXPath(document, xPath);
        for (int i = 0; i < elements.getLength(); i++) {
            Node element = elements.item(i);
            elementAttributesList.add(XercesUtils.getAttributes(element));
        }
        return elementAttributesList;
    }

    @Override
    public Map<String, String> getElementAttributesByPath(byte[] xmlContent, String xPath, boolean namespaceEnabled) {
        Map<String, String> attributes = new HashMap<>();
        Document document = createXercesDocument(xmlContent, namespaceEnabled);
        Node element = XercesUtils.getFirstElementByXPath(document, xPath, namespaceEnabled);
        if (element != null) {
            attributes = XercesUtils.getAttributes(element);
        }
        return attributes;
    }

    protected Map<String, String> getElementAttributesByPath(Node node, String xPath) {
        Map<String, String> attributes = new HashMap<>();
        Node element = XercesUtils.getFirstElementByXPath(node, xPath);
        if (element != null) {
            attributes = XercesUtils.getAttributes(element);
        }
        return attributes;
    }

    @Override
    public String getElementContentFragmentByPath(byte[] xmlContent, String xPath, boolean namespaceEnabled) {
        Document document = createXercesDocument(xmlContent, namespaceEnabled);
        XercesUtils.addLeosNamespace(document);
        Node element = XercesUtils.getFirstElementByXPath(document, xPath, namespaceEnabled);
        if (element != null) {
            return XercesUtils.getContentNodeAsXmlFragment(element);
        }
        return null;
    }

    @Override
    public String getElementFragmentByPath(byte[] xmlContent, String xPath, boolean namespaceEnabled) {
        Document document = createXercesDocument(xmlContent, namespaceEnabled);
        XercesUtils.addLeosNamespace(document);
        Node element = XercesUtils.getFirstElementByXPath(document, xPath, namespaceEnabled);
        if (element != null) {
            return nodeToString(element);
        }
        return null;
    }

    @Override
    public byte[] setAttributeForAllChildren(byte[] xmlContent, String parentTag, List<String> elementTags, String attributeName, String value) {
        Document document = createXercesDocument(xmlContent);
        NodeList nodeList = XercesUtils.getElementsByName(document, parentTag);
        for (int nodeIndex = 0; nodeIndex < nodeList.getLength(); nodeIndex++) {
            Node node = nodeList.item(nodeIndex);
            List<Node> children = getChildren(node);
            for (int childIndex = 0; childIndex < children.size(); childIndex++) {
                setAttribute(children.get(childIndex), elementTags, attributeName, value);
            }
        }
        return nodeToByteArray(document);
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
            XercesUtils.addAttribute(node, attrName, String.valueOf(attrValue));
        }

        List<Node> children = getChildren(node);
        for (int i = 0; i < children.size(); i++) {
            setAttribute(children.get(i), elementTags, attrName, attrValue);
        }
    }

    private void updatePointStructure(Node parentNode) {
        NodeList points = XercesUtils.getElementsByName(parentNode, POINT);
        for (int i = 0; i < points.getLength(); i++) {
            Node point = points.item(i);
            Node list = XercesUtils.getFirstChild(point, LIST);
            if(list != null) {
                List<Node> level2Points = XercesUtils.getChildren(list, POINT);
                List<Node> level2Indents = XercesUtils.getChildren(list, INDENT);
                if((level2Points == null || level2Points.isEmpty()) && (level2Indents == null || level2Indents.isEmpty())) {
                    List<Node> alineas = XercesUtils.getChildren(point, Arrays.asList(SUBPOINT, SUBPARAGRAPH));
                    if(alineas != null && alineas.size() == 1) {
                        Node alinea = alineas.get(0);
                        Node content = XercesUtils.getFirstChild(alinea, CONTENT);
                        XercesUtils.replaceElement(content, alinea);
                    }
                    point.removeChild(list);
                }
            }
        }
    }

    private void updateParagraphStructure(Node parentNode) {
        NodeList paragraphs = XercesUtils.getElementsByName(parentNode, PARAGRAPH);
        for (int i = 0; i < paragraphs.getLength(); i++) {
            Node paragraph = paragraphs.item(i);
            Node list = XercesUtils.getFirstChild(paragraph, LIST);
            if(list != null) {
                List<Node> level2Points = XercesUtils.getChildren(list, POINT);
                List<Node> level2Indents = XercesUtils.getChildren(list, INDENT);
                if((level2Points == null || level2Points.isEmpty()) && (level2Indents == null || level2Indents.isEmpty())) {
                    List<Node> subparagraphs = XercesUtils.getChildren(paragraph, SUBPARAGRAPH);
                    if(subparagraphs != null && subparagraphs.size() == 1) {
                        Node subparagraph = subparagraphs.get(0);
                        Node content = XercesUtils.getFirstChild(subparagraph, CONTENT);
                        XercesUtils.replaceElement(content, subparagraph);
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
        Document document = createXercesDocument(xmlContent);
        updatePointStructure(document);
        updateParagraphStructure(document);
        long preProcessingTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);
        LOG.trace("Finished XML post processing: doXMLPostProcessing at {}ms", preProcessingTime, (System.currentTimeMillis() - preProcessingTime));
        return nodeToByteArray(document);
    }

    public void doXMLPostProcessing(Document document) {
        Node node = document.getFirstChild();  //avoid adding id to <akomantoso> tag
        if (XML_STYLESHEET.equals(node.getNodeName())) {
            node = node.getNextSibling();
        }
        doXmlPostProcessingCommon(node);
        specificInstanceXMLPostProcessing(node);
        updatePointStructure(node);
        updateParagraphStructure(node);
    }

    private void doXmlPostProcessingCommon(Node node) {
        injectTagIdsInNode(node, IdGenerator.DEFAULT_PREFIX);
        modifyAuthorialNoteMarkers(node, 1);
        updateReferences(node.getOwnerDocument());
        convertAlineasToSubparagraphs(node.getOwnerDocument());
        moveSubparagraphsInList(node.getOwnerDocument());
        updateMetaReferences(node);
    }

    @Override
    public byte[] doXMLPostProcessing(byte[] xmlContent) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        Document document = doXmlPostProcessingCommon(xmlContent);

        specificInstanceXMLPostProcessing(document);
        updatePointStructure(document);
        updateParagraphStructure(document);
        long postProcessingTime = stopwatch.elapsed(TimeUnit.MILLISECONDS);

        LOG.trace("Finished XML post processing: doXMLPostProcessing at {}ms",
                postProcessingTime, (System.currentTimeMillis() - postProcessingTime));
        return nodeToByteArray(document);
    }

    private Document doXmlPostProcessingCommon(byte[] xmlContent) {
        long startTime = System.currentTimeMillis();
        Document document = createXercesDocument(xmlContent);

        // Inject Ids
        Stopwatch stopwatch = Stopwatch.createStarted();
        injectTagIdsInNode(document.getDocumentElement(), IdGenerator.DEFAULT_PREFIX);
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

        LOG.trace("Finished doXMLPostProcessing: Ids Injected at {}ms, authNote Renumbering at {}ms, mref udpated at {}ms, convert alineas to subparagraphs " +
                        "at {}ms, move subparagraphs as intro and conclusion at {}ms, Total time " +
                        "elapsed {}ms",
                injectIdTime, authNoteTime, mrefUpdateTime, convertAlineasToSubparagraphsTime, moveSubparagraphsInListTime,
                (System.currentTimeMillis() - startTime));
        return document;
    }

    public abstract void specificInstanceXMLPostProcessing(Node node);

    protected void updateNewElements(Node parentNode, String elementTagName, String subElementTagName, String origin) {
        NodeList elementsList = XercesUtils.getElementsByName(parentNode, elementTagName);
        for (int i = 0; i < elementsList.getLength(); i++) {
            Node node = elementsList.item(i);
            String elementOrigin = modifySubElement(node, origin);
            List<Node> subElements = XercesUtils.getChildren(node, Arrays.asList(subElementTagName, LIST));
            for (int j = 0; j < subElements.size(); j++) {
                Node subElement = subElements.get(j);
                String subElementOrigin = getAttributeValue(subElement, LEOS_ORIGIN_ATTR);
                if (j == 0 && !is(subElement, LIST) && elementOrigin.equals(EC) && (subElementOrigin == null)) {
                    createTransformationNode(node, subElement);
                } else if (is(subElement, LIST)) {
                    List<Node> listSubElements = XercesUtils.getChildren(subElement, subElementTagName);
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
                if (XercesUtils.getAttributeValue(node, LEOS_INDENT_ORIGIN_TYPE_ATTR) == null) {
                    XercesUtils.removeAttribute(node, LEOS_SOFT_TRANS_FROM);
                }
            }
        }
    }

    private void createTransformationNode(Node node, Node subElement) {
        final String elementId = XercesUtils.getId(node);
        XercesUtils.addAttribute(subElement, LEOS_SOFT_USER_ATTR, getSoftUserAttribute(securityContext.getUser()));
        XercesUtils.addAttribute(subElement, LEOS_SOFT_DATE_ATTR, getDateAsXml());
        XercesUtils.addAttribute(subElement, LEOS_ORIGIN_ATTR, EC);
        XercesUtils.addAttribute(subElement, LEOS_SOFT_ACTION_ATTR, SoftActionType.TRANSFORM.getSoftAction());
        XercesUtils.addAttribute(subElement, XMLID, SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX + elementId);
    }

    protected String modifySubElement(Node node, String parentOrigin) {

        String originOfDocument = getOriginOfDocument(node);
        String originAttr = getAttributeValue(node, LEOS_ORIGIN_ATTR);
        if (originAttr == null) {
            originAttr = parentOrigin;
        }

        if (originAttr.equals(parentOrigin) && !is(node, LIST)) {
            XercesUtils.addAttribute(node, LEOS_ORIGIN_ATTR, originAttr);
            String softAction = getAttributeValue(node, LEOS_SOFT_ACTION_ATTR);
            if (softAction == null && !CN.equals(originOfDocument) && !is(node, MAIN_BODY)) {
                XercesUtils.addAttribute(node, LEOS_SOFT_ACTION_ATTR, SoftActionType.ADD.getSoftAction());
                XercesUtils.addAttribute(node, LEOS_SOFT_USER_ATTR, getSoftUserAttribute(securityContext.getUser()));
                XercesUtils.addAttribute(node, LEOS_SOFT_DATE_ATTR, getDateAsXml());
            }
        }
        return originAttr;
    }

    public byte[] convertAlineasInDocumentContent(byte[] xmlContent) {
        long startTime = System.currentTimeMillis();
        Document document = createXercesDocument(xmlContent);

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
        NodeList nodeList = XercesUtils.getElementsByName(node, SUBPOINT);
        return nodeList.getLength() > 0;
    }

    private void convertAlineasToSubparagraphs(Document document) {
        int nbAlineas = XercesUtils.getElementCountByXpath(document, "//akn:" + SUBPOINT, true);
        for (int i = 0; i < nbAlineas; i++) {
            Node alinea = XercesUtils.getFirstElementByName(document, SUBPOINT);
            XercesUtils.renameNode(document, alinea, SUBPARAGRAPH);
        }
    }

    private void moveSubparagraphsInList(Node node) {
        NodeList nodeList = XercesUtils.getElementsByName(node, SUBPARAGRAPH);
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node subpara = nodeList.item(i);
            Node nextSiblingList = XercesUtils.getNextSibling(subpara);
            boolean moved = false;
            if (((!isSoftDeletedOrMovedTo(subpara) && !isSoftDeletedOrMovedTo(nextSiblingList)) || (isSoftDeletedOrMovedTo(subpara) && isSoftDeletedOrMovedTo(nextSiblingList)))
                    && nextSiblingList != null
                    && is(nextSiblingList, LIST)) {
                Node firstChildList = XercesUtils.getFirstChild(nextSiblingList);
                if (firstChildList != null
                        && (!is(firstChildList, SUBPARAGRAPH) || isSoftDeletedOrMovedTo(firstChildList)) && (compareSoftAction(subpara,
                        nextSiblingList) || isSoftAdded(nextSiblingList))) {
                    nextSiblingList.insertBefore(subpara, nextSiblingList.getFirstChild());
                    moved = true;
                }
            }
            if (!moved) {
                Node previousSiblingList = XercesUtils.getPrevSibling(subpara);
                if (previousSiblingList != null && is(previousSiblingList, LIST)
                        && ((!isSoftDeletedOrMovedTo(subpara) && !isSoftDeletedOrMovedTo(previousSiblingList))
                        || (isSoftDeletedOrMovedTo(subpara) && isSoftDeletedOrMovedTo(previousSiblingList)))) {
                    List<Node> children = XercesUtils.getChildren(previousSiblingList);
                    Node lastChildList = children.size() > 0 ? children.get(children.size()-1) : null;
                    if (lastChildList != null && !is(lastChildList, SUBPARAGRAPH)) {
                        previousSiblingList.appendChild(subpara);
                    }
                }
            }
            if (is(subpara.getParentNode(), LIST)) {
                List<Node> children = XercesUtils.getChildren(subpara.getParentNode());
                int index = children.indexOf(subpara);
                if (index == 0) {
                    addAttribute(subpara, XmlHelper.REFERS_TO_ATTR, XmlHelper.INTRODUCTORY_PART);
                } else if (index == children.size()-1) {
                    addAttribute(subpara, XmlHelper.REFERS_TO_ATTR, XmlHelper.ENDING_PART);
                } else if (index == children.size()-2 && is(children.get(index+1), SUBPARAGRAPH)) {
                    addAttribute(subpara, XmlHelper.REFERS_TO_ATTR, XmlHelper.ENDING_PART);
                    Node nextSibling = children.get(index+1);
                    removeAttribute(nextSibling, XmlHelper.REFERS_TO_ATTR);
                    subpara.getParentNode().getParentNode().insertBefore(nextSibling, subpara.getParentNode().getNextSibling());
                } else if (index == 1 && is(children.get(0), SUBPARAGRAPH)) {
                    addAttribute(subpara, XmlHelper.REFERS_TO_ATTR, XmlHelper.INTRODUCTORY_PART);
                    Node prevSibling = children.get(0);
                    removeAttribute(prevSibling, XmlHelper.REFERS_TO_ATTR);
                    subpara.getParentNode().getParentNode().insertBefore(prevSibling, subpara.getParentNode());
                }
            } else {
                removeAttribute(subpara, XmlHelper.REFERS_TO_ATTR);
            }
        }
    }

    private void injectTagIdsInNode(Node node, String idPrefix) {
        String tagName = node.getNodeName();
        if (skipNodeAndChildren(tagName)) {// skipping node processing along with children
            return;
        }

        String idAttrValue = null;
        if (!skipNodeOnly(tagName)) {// do not update id for this tag
            idAttrValue = updateNodeWithId(node, idPrefix);
        }

        idPrefix = determinePrefixForChildren(tagName, idAttrValue, idPrefix);
        List<Node> children = getChildren(node);
        for (int i = 0; i < children.size(); i++) {
            injectTagIdsInNode(children.get(i), idPrefix);
        }
    }

    private String updateNodeWithId(Node node, String idPrefix) {
        String idAttrValue = getAttributeValue(node, XMLID);
        if (idAttrValue == null || idAttrValue.isEmpty()) {
            idAttrValue = IdGenerator.generateId(idPrefix, 7);
            XercesUtils.addAttribute(node, XMLID, idAttrValue);
        }
        return idAttrValue;
    }

    private void modifyAuthorialNoteMarkers(Node node, int markerNumber) {
        NodeList nodeList = XercesUtils.getElementsByName(node, AUTHORIAL_NOTE);
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node child = nodeList.item(i);
            XercesUtils.addAttribute(child, MARKER_ATTRIBUTE, Integer.toString(markerNumber++));
            if(XercesUtils.getAttributeValue(child, PLACEMENT) == null) {
                XercesUtils.addAttribute(child, PLACEMENT, BOTTOM);
            }
        }
    }

    @Override
    public byte[] updateReferences(byte[] xmlContent) {
        Document document = createXercesDocument(xmlContent);
        if (updateReferences(document)) {
            return nodeToByteArray(document);
        } else {
            return null;
        }
    }

    boolean updateReferences(Document document) {
        boolean updated = false;
        String sourceRef = getContentByTagName(document, LEOS_REF);
        NodeList nodeList = XercesUtils.getElementsByName(document, MREF);

        HashMap<String, String> parentStatementsOfReferences = new HashMap<>();
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node child = nodeList.item(i);
            List<Ref> refs = findReferences(child, sourceRef);
            if (!refs.isEmpty()) {

                boolean capital = false;
                String id = XercesUtils.getAttributeValue(child.getParentNode(), XMLID);
                String completeStatement = "";
                if (parentStatementsOfReferences.get(id) == null) {
                    completeStatement = child.getParentNode().getTextContent();
                    parentStatementsOfReferences.put(id, completeStatement);
                } else {
                    completeStatement = parentStatementsOfReferences.get(id);
                }
                String pieceForCrossReference = child.getTextContent();
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

                Result<String> labelResult = referenceLabelService.generateLabel(refs, sourceRef, getParentId(child), document, capital);
                if (labelResult.isOk()) {
                    String childXml = XercesUtils.getContentNodeAsXmlFragment(child);
                    String updatedMrefContent = labelResult.get();
                    if (!updatedMrefContent.replaceAll("\\s+", "").equals(childXml.replaceAll("\\s+", ""))) {
                        child = XercesUtils.addContentToNode(child, updatedMrefContent);
                        updated = true;
                    }
                    XercesUtils.removeAttribute(child, LEOS_REF_BROKEN_ATTR);
                } else {
                    XercesUtils.addAttribute(child, LEOS_REF_BROKEN_ATTR, "true");
                    updated = true;
                }

            }
        }
        return updated;
    }

    private void updateMetaReferences(Node node) {

        NodeList metaReferencesNodeList = XercesUtils.getElementsByXPath(node, xPathCatalog.getXPathMetaReferences(), true);
        Node metaReferences = metaReferencesNodeList.item(0);

        if (metaReferences != null) {

            NodeList subparagraphWithReferToINPAttributeNodeList = XercesUtils.getElementsByXPath(node,
                    xPathCatalog.getXPathSubparagraphWithReferToINPAttribute(), true);
            NodeList INPListNodes = XercesUtils.getElementsByXPath(node, xPathCatalog.getXPathMetaReferenceForINP(), true);
            if (subparagraphWithReferToINPAttributeNodeList.getLength() > 0) {
                if (INPListNodes.getLength() == 0) {
                    Node tclNode = createElement(node.getOwnerDocument(), TLC_CONCEPT, TLC_CONCEPT_INP_ID, EMPTY_STRING);
                    XercesUtils.insertOrUpdateAttributeValue(tclNode, HREF, "http://publications.europa.eu/resource/authority/subdivision/INP");
                    XercesUtils.insertOrUpdateAttributeValue(tclNode, XML_SHOW_AS, "introductory part");
                    metaReferences.appendChild(tclNode);
                }
            } else {
                for (int i = 0; i < INPListNodes.getLength(); i++) {
                    metaReferences.removeChild(INPListNodes.item(i));
                }
            }

            NodeList subparagraphWithReferToWRPAttributeNodeList = XercesUtils.getElementsByXPath(node,
                    xPathCatalog.getXPathSubparagraphWithReferToWRPAttribute(), true);
            NodeList WRPListNodes = XercesUtils.getElementsByXPath(node, xPathCatalog.getXPathMetaReferenceForWRP(), true);
            if (subparagraphWithReferToWRPAttributeNodeList.getLength() > 0) {
                if (WRPListNodes.getLength() == 0) {
                    Node tclNode = createElement(node.getOwnerDocument(), TLC_CONCEPT, TLC_CONCEPT_WRP_ID, EMPTY_STRING);
                    XercesUtils.insertOrUpdateAttributeValue(tclNode, HREF, "http://publications.europa.eu/resource/authority/subdivision/WRP");
                    XercesUtils.insertOrUpdateAttributeValue(tclNode, XML_SHOW_AS, "closing part");
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
        NodeList nodeList = XercesUtils.getElementsByName(node, REF);
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
        if (href != null) {
            String[] hrefMixedArr = href.split("/");
            if (hrefMixedArr.length > 1) {
                documentRef = hrefMixedArr[0];
                href = hrefMixedArr[1];
            } else {
                href = hrefMixedArr[0];
            }
        }
        String refVal = node.getTextContent();
        return new Ref(id, href, documentRef, origin, refVal);
    }

    @Override
    public byte[] replaceTextInElement(byte[] xmlContent, String origText, String newText, String elementId, int startOffset, int endOffset) {
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, elementId);
        byte[] newElement = null;
        if (node != null) {
            String elementContent = nodeToString(node);
            StringBuilder eltContent = new StringBuilder(elementContent);
            ImmutableTriple<String, Integer, Integer> result = getSubstringAvoidingTags(elementContent, startOffset, startOffset + origText.length());
            String matchingText = result.left;
            if (matchingText.equals(origText)
                    || matchingText.replace(NON_BREAKING_SPACE, WHITESPACE).equals(escapeXml10(origText.replace(NON_BREAKING_SPACE, WHITESPACE)))
                    || normalizeSpace(matchingText).replace(NON_BREAKING_SPACE, WHITESPACE).equals(escapeXml10(origText.replace(NON_BREAKING_SPACE, WHITESPACE)))) {
                eltContent.replace(result.middle, result.right, escapeXml10(normalizeNewText(origText, newText)));
                Node newNode = XercesUtils.createNodeFromXmlFragment(document, eltContent.toString().getBytes(UTF_8), false);
                XercesUtils.replaceElement(newNode, node);
                newElement = nodeToByteArray(document);
            } else {
                LOG.debug("Text not matching {}, original text:{}, matched text:{}", elementId, origText, matchingText);
            }
        }
        return newElement;
    }

    @Override
    public byte[] appendElementToTag(byte[] xmlContent, String tagName, String newContent, boolean asFirstChild) {
        Document document = createXercesDocument(xmlContent);
        NodeList nodeList = document.getElementsByTagName(tagName);
        if (nodeList.getLength() == 0) {
            throw new IllegalArgumentException("No tag found with name " + tagName);
        }

        Node newNode = createNodeFromXmlFragment(document, newContent.getBytes(UTF_8));
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node node = nodeList.item(i);
            if (asFirstChild) {
                XercesUtils.addFirstChild(newNode, node);
            } else {
                XercesUtils.addLastChild(newNode, node);
            }
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] insertDepthAttribute(byte[] xmlContent, String tagName, String elementId) {
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, elementId);
        if (tagName.equals(NUM)) {
            tagName = XercesUtils.getParentTagName(node);
            elementId = XercesUtils.getParentId(node);
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
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, elementId);
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
        insertOrUpdateStylingAttribute(nodeToSetAttributes, INLINE_NUM_PROPERTY, org.apache.commons.lang.StringUtils.isNotEmpty(inlinePropertyStr) ? inlinePropertyStr : null);
        return nodeToByteArray(document);
    }

    @Override
    public byte[] searchAndReplaceText(byte[] xmlContent, String searchText, String replaceText) {
        Document document = createXercesDocument(xmlContent);
        String xPath = String.format("//*[contains(lower-case(text()), %s)]", wrapXPathWithQuotes(searchText.toLowerCase()));
        NodeList nodeList = XercesUtils.getElementsByXPath(document, xPath);
        boolean found = false;
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node child = nodeList.item(i);
            String content = child.getTextContent();
            if (content != null && isEditableElement(child)) {
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

        Document document = createXercesDocument(xmlContent, true);
        XercesUtils.addLeosNamespace(document);

        Node akomaNtosoNode = XercesUtils.getFirstElementByXPath(document, xPathCatalog.getXPathAkomaNtoso(), true);
        Node meta = XercesUtils.getFirstElementByXPath(document, xPathCatalog.getXPathMeta(), true);
        Node coverPageNode = XercesUtils.getFirstElementByXPath(document, xPathCatalog.getXPathCoverPage(), true);
        if(akomaNtosoNode != null) {
            akomaNtosoNode.setTextContent(StringUtils.EMPTY);

            if(meta != null) {
                XercesUtils.addChild(meta, akomaNtosoNode);
            }

            if(coverPageNode != null) {
                XercesUtils.addChild(coverPageNode, akomaNtosoNode);
                coverPageContent = nodeToByteArray(akomaNtosoNode);
            }
        }

        return coverPageContent;
    }

    public static boolean isEditableElement(Node node) {
        Validate.isTrue(node != null, "Node can not be null");
        Validate.isTrue(node.getParentNode() != null, "Parent Node can not be null");
        EditableAttributeValue editableAttrVal = getEditableAttributeForNode(node);
        while (EditableAttributeValue.UNDEFINED.equals(editableAttrVal) && node.getParentNode() != null) {
            editableAttrVal = getEditableAttributeForNode(node.getParentNode());
            node = node.getParentNode();
        }
        return EditableAttributeValue.UNDEFINED.equals(editableAttrVal) ? true : Boolean.parseBoolean(editableAttrVal.name());
    }

    private static EditableAttributeValue getEditableAttributeForNode(Node node) {
        Map<String, String> attrs = XercesUtils.getAttributes(node);
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
        Document document = createXercesDocument(xmlContent);
        Element element = null;
        Node node = XercesUtils.getElementById(document, idAttributeValue);
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

        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, idAttributeValue);
        if (node == null) {
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
        Document document = createXercesDocument(xmlContent);
        NodeList nodeList = XercesUtils.getElementsByXPath(document, xpath);
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
        Document document = createXercesDocument(xmlContent.getBytes(StandardCharsets.UTF_8));
        Node node = document.getFirstChild();
        node = setAttributeForDefinitionArticle(node);
        String idPrefix = "imp_" + XercesUtils.getId(node);
        String newIdAttrValue = IdGenerator.generateId(idPrefix, 7);
        addAttribute(node, XMLID, newIdAttrValue);
        String updatedElement = nodeToString(node);
        updatedElement = removeSelfClosingElements(updatedElement);
        return updatedElement;
    }

    private Node setAttributeForDefinitionArticle(Node node) {
        if (is(node, ARTICLE)) {
            // Will check here if it is a definitions' article.
            // The checking is done thanks to the points' numbering scheme of the article
            // That could be done just checking the heading, but I found it not accurate, because:
            //  1. Heading text can depend on the language
            //  2. Heading text can be slightly different from exact text "Definitions"
            //  Example: Article 5 of REGULATION 575 2013.
            Node pointOrIndent = XercesUtils.getFirstDescendant(node, Arrays.asList(POINT, INDENT));
            if (pointOrIndent != null) {
                int depth = XercesUtils.getPointDepth(pointOrIndent);
                String numValue = XercesUtils.getFirstChild(pointOrIndent, NUM).getTextContent();
                List<TocItem> tocItems = structureContextProvider.get().getTocItems();
                List<NumberingConfig> numberingConfigs = structureContextProvider.get().getNumberingConfigs();
                List<TocItem> foundTocItems = StructureConfigUtils.getTocItemsByName(tocItems, pointOrIndent.getNodeName());
                TocItem tocItem = StructureConfigUtils.getTocItemByNumValue(numberingConfigs, foundTocItems, numValue, depth);
                // Means it's a definition article
                if (tocItem != null
                        && tocItem.getNumberingType().equals(
                                StructureConfigUtils.getNumberingTypeByTagNameAndTocItemType(tocItems,
                                        TocItemTypeName.DEFINITION, pointOrIndent.getNodeName()))) {
                    Attribute attribute =  StructureConfigUtils.getAttributeByTagNameAndTocItemType(tocItems, TocItemTypeName.DEFINITION, ARTICLE);
                    if (attribute != null) {
                        XercesUtils.addAttribute(node, attribute.getAttributeName(), attribute.getAttributeValue());
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
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getFirstElementByXPath(document, xPath);
        if (node == null) {
            throw new IllegalArgumentException("Didn't found a node in xpath: " + xPath + ", namespace: true");
        }
        return XercesUtils.getAttributeValue(node, XMLID);
    }

    @Override
    public String removeEmptyHeading(String newContent) {
        boolean removed = false;
        Document document = createXercesDocument(newContent.getBytes(StandardCharsets.UTF_8), false);
        XercesUtils.addLeosNamespace(document);
        Node heading = XercesUtils.getFirstElementByName(document, HEADING);
        if (heading != null && heading.getTextContent().replaceAll(NBSP, "").trim().isEmpty()) {
            removeElement(heading);
            removed = true;
        }
        if(removed){
            return XercesUtils.nodeToString(document);
        } else { //skip re-parsing if no change
            return newContent;
        }
    }

    public void removeElement(Node node) {
        String contentOrigin = getAttributeValue(node, LEOS_ORIGIN_ATTR);
        if(CN.equals(contentOrigin)) {
            XercesUtils.deleteElement(node);
        } else {
            XercesUtils.addAttribute(node, LEOS_SOFT_ACTION_ATTR, SoftActionType.DELETE.getSoftAction());
            XercesUtils.addAttribute(node, LEOS_SOFT_USER_ATTR, getSoftUserAttribute(securityContext.getUser()));
            XercesUtils.addAttribute(node, LEOS_SOFT_DATE_ATTR, getDateAsXml());
            updateXMLIDAttributeFullStructureNode(node, SOFT_DELETE_PLACEHOLDER_ID_PREFIX, true);
        }
    }

    @Override
    public LevelItemVO getLevelItemVo(byte[] xmlContent, String elementId, String elementTagName) {
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, elementId);
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
        String autoNumberOverwrite = XercesUtils.getAttributeValue(node, LEOS_AUTO_NUM_OVERWRITE);
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
                String elementNumber = XercesUtils.getChildContent(node, NUM);
                if (elementNumber.contains(".")) {
                    String[] levelArr = StringUtils.split(elementNumber, LEVEL_NUM_SEPARATOR);
                    depth = levelArr.length;
                } else {
                    if (!XercesUtils.getId(node).equals(elementId) && elementNumber.contains("#")) {
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
        node = XercesUtils.getElementById(node, elementId);
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
        Document document = createXercesDocument(xmlContent);
        NodeList nodeList = XercesUtils.getElementsByName(document, REF);
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
                        XercesUtils.addAttribute(child, HREF, ref);
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
        Document document = createXercesDocument(xmlContent);
        List<Element> elements = new ArrayList<>();
        for (String elementTag : elementTags) {
            NodeList nodeList = XercesUtils.getElementsByName(document, elementTag);
            for (int i = 0; i < nodeList.getLength(); i++) {
                Node child = nodeList.item(i);
                String id = getId(child);
                if (id != null) {
                    elements.add(new Element(id, child.getNodeName(), withContent ? nodeToString(document) : null));
                }
            }
        }
        return elements;
    }

    @Override
    public byte[] ignoreNotSelectedElements(byte[] xmlContent, List<String> rootElements, List<String> elementIds) {
        List<String> ancestorIds = getAncestorsIdsForElements(xmlContent, elementIds);
        Document document = createXercesDocument(xmlContent);
        for (String rootElement : rootElements) {
            Node node = XercesUtils.getFirstElementByName(document, rootElement);
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
        Document document = createXercesDocument(xmlContent);
        XercesUtils.deleteElementById(document, elementId);
        return nodeToByteArray(document);
    }

    @Override
    public void updateSoftMoveLabelAttribute(Node documentNode, String attr) {
        String sourceDocumentRef = getContentByTagName(documentNode, LEOS_REF);
        NodeList nodeList = XercesUtils.getElementsByXPath(documentNode, String.format("//*[@%s]", attr));
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node node = nodeList.item(i);
            Result<String> labelResult = referenceLabelService.generateSoftMoveLabel(getRefFromSoftMovedElt(node, attr),
                    XercesUtils.getParentId(node), documentNode, attr, sourceDocumentRef);
            if (labelResult != null && labelResult.isOk()) {
                XercesUtils.addAttribute(node, LEOS_SOFT_MOVED_LABEL_ATTR, labelResult.get());
                addTrackChangeAttributes(node, attr);
                createMoveInfoTitle(node);
            }
        }
    }

    private void addTrackChangeAttributes(Node node, String attr) {
        if (cloneContext != null && cloneContext.isClonedProposal()) {
            String userLogin = securityContext.getUser().getLogin();
            String leosAction = null;
            switch (attr) {
                case LEOS_SOFT_MOVE_TO:
                    leosAction = "delete";
                    break;
                case LEOS_SOFT_MOVE_FROM:
                    leosAction = "insert";
                    break;
                default:
                    leosAction = null;

            }
            XercesUtils.addAttribute(node, LEOS_UID_ATTR, userLogin);
            XercesUtils.addAttribute(node, LEOS_ACTION_ATTR, leosAction);
        }
    }

    private Ref getRefFromSoftMovedElt(Node node, String attr) {
        String id = XercesUtils.getId(node);
        String href = XercesUtils.getAttributeValue(node, attr);
        String origin = XercesUtils.getAttributeValue(node, LEOS_ORIGIN_ATTR);
        return new Ref(id, href, null, origin);
    }

    protected Element getSiblingOfParentElement(byte[] xmlContent, String tagName, String id) {
        LOG.trace("getSiblingOfParentElement for node {} with id {}", tagName, id);
        Element element = null;
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, id);
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

    protected byte[] removeElement(byte[] xmlContent, Element element, String currentOrigin, boolean isTrackChangesEnabled) {
        Document document = createXercesDocument(xmlContent);
        String tagName = element.getElementTagName();
        String elementId = element.getElementId();
        Node node = XercesUtils.getElementById(document, elementId);
        boolean isSoftMovedFrom = isSoftMovedFrom(node);
        boolean isProposalElement = isProposalElement(node);
        boolean isSoftDeleted = isSoftDeletedOrMovedTo(node);
        Node parentNode = node.getParentNode();
        List<Node> siblings =  XercesUtils.getChildren(parentNode, Arrays.asList(SUBPARAGRAPH, POINT, INDENT, LIST, CROSSHEADING));
        boolean singleChild = siblings.size() <= 1;
        boolean firstChild = siblings.indexOf(node) == 0;

        if ((Arrays.asList(SUBPARAGRAPH, SUBPOINT).contains(tagName) && firstChild && !is(parentNode, LIST))
                || (Arrays.asList(POINT, INDENT, INDENT).contains(tagName) && singleChild)) {
            // Cases when the deleted element should be the wrapping element
            node = parentNode;
        } else if (tagName.equals(SUBPARAGRAPH) && is(parentNode, LIST) && firstChild) {
            // Cases when the deleted element should be the wrapping element (subparagraph is intro of the first list)
            Node grandParentNode = parentNode.getParentNode();
            if (grandParentNode != null && !is(grandParentNode,LEVEL)) {
                List<Node> parentNodeSiblings = XercesUtils.getChildren(grandParentNode, Arrays.asList(SUBPARAGRAPH, LIST));
                if (parentNodeSiblings.indexOf(parentNode) == 0) {
                    node = grandParentNode;
                }
            }
        }

        Node list = is(node.getParentNode(),LIST) ? node.getParentNode() : null;
        if (isSoftMovedFrom) {
            softDeleteOriginalNode(node, isTrackChangesEnabled);
            restoreTransformedNodeToContent(node);
            XercesUtils.deleteElement(node);
        } else if (isProposalElement && !isSoftDeleted) {
            removeMovedInElements(node, isTrackChangesEnabled);
            softDeleteElementForNode(node, isTrackChangesEnabled);
        } else {
            restoreTransformedNodeToContent(node);
            XercesUtils.deleteElement(node);
        }

        // Delete empty lists
        if (list != null && XercesUtils.getChildren(list).isEmpty()) {
            XercesUtils.deleteElement(list);
        }

        doXMLPostProcessing(document);
        return nodeToByteArray(document);
    }

    private void softDeleteOriginalNode(Node node, boolean isTrackChangesEnabled) {
        doSoftDeleteOriginalNode(node, isTrackChangesEnabled);
        List<Node> children = XercesUtils.getChildren(node);
        for (int i = 0; i < children.size(); i++) {
            softDeleteOriginalNode(children.get(i), isTrackChangesEnabled);
        }
    }

    private void doSoftDeleteOriginalNode(Node node, boolean isTrackChangesEnabled) {
        String originalId = XercesUtils.getAttributeValue(node, LEOS_SOFT_MOVE_FROM);
        Boolean originalActionRoot = XercesUtils.getAttributeValueAsBoolean(node, LEOS_SOFT_ACTION_ROOT_ATTR);
        LOG.debug("Setting original node {} as MOVED. Actual node {}", originalId, getId(node));
        if (originalId != null && Boolean.TRUE.equals(originalActionRoot)) {
            Node originalNode = XercesUtils.getElementById(node.getOwnerDocument(), originalId);
            if (originalNode != null) {
                softDeleteElementForNode(originalNode, isTrackChangesEnabled);
            } else {
                LOG.warn("Original Node with id {} cannot be set to softdelete" , originalId);
            }
        }
    }

    private void removeMovedInElements(Node node, boolean isTrackChangesEnabled) {
        List<Node> children = XercesUtils.getChildren(node);
        for (int i = 0; i < children.size(); i++) {
            Node child = children.get(i);
            String originalId = XercesUtils.getAttributeValue(child, LEOS_SOFT_MOVE_FROM);
            if(originalId != null) {
                LOG.debug("Deleting MOVED node {}. The original {} will be set to sofdelete ", getId(child), originalId);
                XercesUtils.deleteElement(child);
                Node originNode  = XercesUtils.getElementById(node.getOwnerDocument(), originalId);
                softDeleteElementForNode(originNode, isTrackChangesEnabled);
            } else {
                removeMovedInElements(child, isTrackChangesEnabled);
                // If all children of LIST are removed remove LIST also
                if(LIST.equals(child.getNodeName()) && XercesUtils.getChildren(child).size() == 0) {
                    XercesUtils.deleteElement(child);
                }
            }
        }
    }

    protected boolean isSoftTransformed(Node node) {
        SoftActionType actionType = XercesUtils.getAttributeForSoftAction(node, LEOS_SOFT_ACTION_ATTR);
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
        Node contentNode = XercesUtils.getFirstChild(node, CONTENT);
        Node nextSameTypeNode = XercesUtils.getNextSibling(node, node.getNodeName()); // can be SUBPARAGRAPH and ALINEA (for now)
        Node nextListNode = XercesUtils.getNextSibling(node, LIST);
        if (!isNull(nextSameTypeNode) && !isNull(nextListNode)) {
            if(isCNNode(nextSameTypeNode)){
                XercesUtils.deleteElement(nextSameTypeNode);
                XercesUtils.replaceElement(contentNode, node);
                node = contentNode.getParentNode();
            } else {
                throw new IllegalStateException("Wrong structure! TRANSFORMED node " + node.getNodeName() + ", id: " + getId(node) + " is not followed by CN node");
            }
        }
        return node;
    }

    private boolean isCNNode(Node node) {
        return CN.equals(XercesUtils.getAttributeValue(node, LEOS_ORIGIN_ATTR));
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
        Node prevSibling = XercesUtils.getPrevSibling(node);
        Node nextSibling = XercesUtils.getNextSibling(node);
        boolean isFirstSubParagraph = isFirstSubParagraph(prevSibling);
        if (nextSibling == null) {
            if (XercesUtils.isListIntro(prevSibling)) {
                node.getParentNode().getParentNode().insertBefore(prevSibling, node.getParentNode());
                if (XercesUtils.getNextSibling(node.getParentNode()) != null) {
                    return;
                }
            }
            if (isFirstSubParagraph) {
                Node contentNode = XercesUtils.getFirstChild(prevSibling, CONTENT);
                XercesUtils.replaceElement(contentNode, prevSibling);
            }
        }
    }

    protected boolean isProposalElement(Map<String, String> attributes) {
        return ((attributes.get(LEOS_ORIGIN_ATTR) != null) && attributes.get(LEOS_ORIGIN_ATTR).equals(EC));
    }

    protected boolean isProposalElement(Node node) {
        String originAttr = XercesUtils.getAttributeValue(node, LEOS_ORIGIN_ATTR);
        return (originAttr != null && originAttr.equals(EC));
    }

    protected boolean isSoftMovedFrom(Map<String, String> attributes) {
        return SoftActionType.MOVE_FROM.getSoftAction().equals(attributes.get(LEOS_SOFT_ACTION_ATTR));
    }

    protected boolean isSoftMovedFrom(Node node) {
        return XercesUtils.getAttributeValue(node, LEOS_SOFT_MOVE_FROM) != null;
    }

    protected String softDeleteElement(String content, boolean namespaceEnabled) {
        return softDeleteElement(content.getBytes(UTF_8), namespaceEnabled, true);
    }

    protected String softDeleteElement(byte[] xmlContent, boolean namespaceEnabled, boolean replacePrefix) {
        Document document = createXercesDocument(xmlContent, namespaceEnabled);
        XercesUtils.addLeosNamespace(document);
        Node node = document.getFirstChild();
        return softDeleteElement(node, replacePrefix);
    }

    protected String softDeleteElement(Node node, boolean replacePrefix) {
        insertOrUpdateAttributeValue(node, LEOS_EDITABLE_ATTR, Boolean.FALSE.toString());
        insertOrUpdateAttributeValue(node, LEOS_DELETABLE_ATTR, Boolean.FALSE.toString());
        updateSoftAttributes(SoftActionType.DELETE, node, true);

        cleanMoveFromAttributes(node);

        updateXMLIDAttributeFullStructureNode(node, SOFT_DELETE_PLACEHOLDER_ID_PREFIX, replacePrefix);
        return XercesUtils.nodeToString(node);
    }

    protected void softDeleteElementForNode(Node node, boolean isTrackChangesEnabled) {
        XercesUtils.insertOrUpdateAttributeValue(node, LEOS_EDITABLE_ATTR, Boolean.FALSE.toString());
        XercesUtils.insertOrUpdateAttributeValue(node, LEOS_DELETABLE_ATTR, Boolean.FALSE.toString());
        SoftActionType actionType;
        if(SoftActionType.TRANSFORM.equals(getSoftAction(node))){
            actionType = SoftActionType.DELETE_TRANSFORM;
        } else {
            actionType = SoftActionType.DELETE;
        }
        updateSoftAttributes(actionType, node, true);

        cleanMoveFromAttributes(node);
        updateXMLIDAttributeFullStructureNode(node, SOFT_DELETE_PLACEHOLDER_ID_PREFIX, true);

        if(isTrackChangesEnabled) {
            ZonedDateTime localDateTime = ZonedDateTime.now();
            addAttribute(node, LEOS_ACTION_ATTR, "delete");
            addAttribute(node, LEOS_UID, securityContext.getUser().getLogin());
            addAttribute(node, LEOS_TITLE,
                    securityContext.getUser().getName() + " : " + localDateTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        }

        propagateSoftDeleteToChildren(XercesUtils.getChildren(node), actionType);
    }

    private void propagateSoftDeleteToChildren(List<Node> children, SoftActionType actionType) {
        for (int i = 0; i < children.size(); i++) {
            Node child = children.get(i);
            String origin = XercesUtils.getAttributeValue(child, LEOS_ORIGIN_ATTR);
            if (CN.equals(origin) && is(child, Arrays.asList(SUBPARAGRAPH, SUBPOINT))) { // The CN part of the split should be
                // removed
                restoreTransformedNodeToContent(child);
                XercesUtils.deleteElement(child);
            } else {
                XercesUtils.removeAttribute(child, LEOS_SOFT_ACTION_ATTR);
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

        propagateSoftDeleteToChildren(XercesUtils.getChildren(node), actionType);
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
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, elementId);
        addAttribute(node, attrName, attrVal);
        return nodeToByteArray(document);
    }

    @Override
    public byte[] removeAttributeFromElement(byte[] xmlContent, String elementId, String attrName) {
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, elementId);
        removeAttribute(node, attrName);
        return nodeToByteArray(document);
    }

    @Override
    public List<Element> getElementsByPath(byte[] xmlContent, String xPath) {
        Document document = createXercesDocument(xmlContent);
        List<Element> elements = new ArrayList<>();
        NodeList nodeList = XercesUtils.getElementsByXPath(document, xPath);
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
        Node node;
        if (tocVo.getNode() != null) {
            node = tocVo.getNode();
            node = importNodeInDocument(document, node);
        } else {
            final String nodeTemplate;
            if (tocVo.getTocItem().getAknTag().value().equals(LIST)) {
                nodeTemplate = XmlHelper.getTemplate(LIST);
            } else {
                nodeTemplate = XmlHelper.getTemplate(tocVo.getTocItem(), tocVo.getNumber(), tocVo.getHeading(), messageHelper);
            }
            node = createNodeFromXmlFragment(document, nodeTemplate.getBytes(UTF_8), false);
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
    public LeosCategory identifyCategory(String docName, byte[] xmlContent) {
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
                case COUNCIL_EXPLANATORY:
                    category = LeosCategory.COUNCIL_EXPLANATORY;
                    break;
                case PROP_ACT:
                    category = null;
                    break;
                case STAT_FINANC_LEGIS:
                    category = LeosCategory.STAT_FINANC_LEGIS;
                    break;
                default:
                    category = LeosCategory.MEDIA;
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
    public boolean isClonedDocument(byte[] xmlContent) {
        String xPath = xPathCatalog.getXPathClonedProposal();
        return evalXPath(xmlContent, xPath, true);
    }

    @Override
    public String getOriginalDocRefFromClonedContent(byte[] xmlContent) {
        return getElementValue(xmlContent, xPathCatalog.getXPathRefOriginForCloneRefAttr(), true);
    }

    @Override
    public byte[] updateInitialNumberForArticles(byte[] xmlContent) {
        Document document = createXercesDocument(xmlContent);
        NodeList nodes = XercesUtils.getElementsByName(document, ARTICLE);
        for (int i = 0; i < nodes.getLength(); i++) {
            Node node = nodes.item(i);
            String num = XercesUtils.getNodeNum(node);
            if (num != null) {
                XercesUtils.addAttribute(node, LEOS_INITIAL_NUM, num);
            }
        }
        return XercesUtils.nodeToByteArray(document);
    }

    @Override
    public byte[] insertSoftAddedClassAttribute(byte[] contentBytes) {
        Document document = createXercesDocument(contentBytes);
        NodeList nodes = document.getElementsByTagName(DOC);
        if (nodes != null && nodes.getLength() > 0) {
            Node bodyNode = XercesUtils.getFirstChild(nodes.item(0), MAIN_BODY);
            XercesUtils.insertOrUpdateAttributeValueRecursively(bodyNode, ATTR_NAME, CONTENT_SOFT_ADDED_CLASS);
        }
        return nodeToByteArray(document);
    }

    protected boolean compareSoftAction(Node firstNode, Node secondNode) {
        SoftActionType softActionAttrSecondNode = XercesUtils.getAttributeForSoftAction(secondNode, LEOS_SOFT_ACTION_ATTR);
        SoftActionType softActionAttrFirstNode = XercesUtils.getAttributeForSoftAction(firstNode, LEOS_SOFT_ACTION_ATTR);
        if (softActionAttrFirstNode == null) {
            softActionAttrFirstNode = XercesUtils.getAttributeForSoftAction(firstNode.getParentNode(), LEOS_SOFT_ACTION_ATTR);
        }
        return softActionAttrSecondNode == null || softActionAttrSecondNode.equals(softActionAttrFirstNode);
    }

    @Override
    public boolean isRevisionAnnex(byte[] contentBytes) {
    	boolean isRevisionAnnex = false;
        Document document = createXercesDocument(contentBytes);
        NodeList nodes = document.getElementsByTagName(DOC);
        if(nodes != null && nodes.getLength() > 0) {
            Node node = XercesUtils.getFirstChild(nodes.item(0), MAIN_BODY);
            String origin = XercesUtils.getAttributeValue(node, LEOS_ORIGIN_ATTR);
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
                Node child = XercesUtils.getFirstChild(nodes.item(0), MAIN_BODY);
                origin = XercesUtils.getAttributeValue(child, LEOS_ORIGIN_ATTR);
            }
        }
        return origin;
    }

    protected boolean isPContent(String content, String tagName) {
        return getElementContentFragmentByPath(content.getBytes(UTF_8), "/" + tagName + "/content/p", false) != null;
    }

    protected int countChildren(byte[] xmlContent, String elementId, List<String> childrenNames) {
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getElementById(document, elementId);
        return XercesUtils.countChildren(node, childrenNames);
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

            Document document = createXercesDocument(wrappedContentXml.getBytes(UTF_8));
            Node node = XercesUtils.getFirstElementByName(document, CONTENT);
            String contentId = XercesUtils.getId(node);
            mergeOnElement = new Element(contentId, CONTENT, contentXml);
        }
        return mergeOnElement;
    }

    @Override
    public byte[] removeDuplicateIds(byte[] xmlContent, boolean namespaceEnabled) {
        //overriding of the ID if there is a case
        Document document = createXercesDocument(xmlContent, namespaceEnabled);
        Set idsSet = new HashSet();
        removeDuplicateIdsFromDocument(document.getDocumentElement(), IdGenerator.DEFAULT_PREFIX, idsSet);
        idsSet.clear();
        return nodeToByteArray(document);
    }

    private void removeDuplicateIdsFromDocument(Node node, String idPrefix, Set idsSet) {
        String tagName = node.getNodeName();
        if (skipNodeAndChildren(tagName)) {// skipping node processing along with children
            return;
        }

        String idAttrValue = null;
        if (!skipNodeOnly(tagName)) {// do not update id for this tag
            idAttrValue = updateNodeWithIdIfDuplicate(node, idPrefix, idsSet);
        }

        idPrefix = determinePrefixForChildren(tagName, idAttrValue, idPrefix);
        List<Node> children = getChildren(node);
        for (int i = 0; i < children.size(); i++) {
            removeDuplicateIdsFromDocument(children.get(i), idPrefix, idsSet);
        }
    }

    private void createMoveInfoTitle(Node node) {
        if (cloneContext != null && cloneContext.isClonedProposal()) {
            String title = getTitleValue(securityContext);
            XercesUtils.addAttribute(node, LEOS_TITLE, title);
            Node numNode = XercesUtils.getFirstChild(node, NUM);
            if (numNode != null) {
                XercesUtils.addAttribute(numNode, LEOS_TITLE, title);
            }
        }
    }

    private String updateNodeWithIdIfDuplicate(Node node, String idPrefix, Set idsSet) {
        String idAttrValue = getAttributeValue(node, XMLID);
        if (idAttrValue == null || idAttrValue.isEmpty() || idsSet.contains(idAttrValue)) {
            for (int i = 0; i < 3 && idsSet.contains(idAttrValue) ; i++) {
                //eliminate the risk for infinite loop.  :D
                idAttrValue = IdGenerator.generateId(idPrefix, 7);
            }
            if(idsSet.contains(idAttrValue)){
                LOG.error("After 3 loops, the id '{}' is the same", idAttrValue);
                throw new IllegalStateException("Duplicate id attribute generated three times! Try again!");
            }
            XercesUtils.addAttribute(node, XMLID, idAttrValue);
        }
        idsSet.add(idAttrValue);
        return idAttrValue;
    }
}
