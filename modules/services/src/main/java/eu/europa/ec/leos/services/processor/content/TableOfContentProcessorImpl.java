/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.1 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
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

import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.services.numbering.config.NumberConfigFactory;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.support.IdGenerator;
import eu.europa.ec.leos.services.support.XmlUtils;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.vo.structure.AknTag;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.services.utils.StructureConfigUtils;
import eu.europa.ec.leos.vo.structure.NumberingType;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.structure.TocItem;
import eu.europa.ec.leos.vo.structure.TocItemTypeName;
import eu.europa.ec.leos.vo.toc.indent.IndentedItemType;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import jakarta.inject.Provider;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static eu.europa.ec.leos.services.support.XmlUtils.removeAttribute;
import static eu.europa.ec.leos.services.processor.content.indent.IndentConversionHelper.NUMBERED_AND_LEVEL_ITEMS;
import static eu.europa.ec.leos.services.processor.content.indent.IndentConversionHelper.NUMBERED_ITEMS;
import static eu.europa.ec.leos.services.processor.content.indent.IndentConversionHelper.UNUMBERED_ITEMS;
import static eu.europa.ec.leos.services.support.XmlUtils.createElement;
import static eu.europa.ec.leos.services.support.XmlUtils.createDocument;
import static eu.europa.ec.leos.services.support.XmlUtils.getFirstElementByName;
import static eu.europa.ec.leos.services.processor.content.XmlContentProcessorHelper.getAllChildTableOfContentItems;
import static eu.europa.ec.leos.services.support.XmlHelper.CLASS_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.CN;
import static eu.europa.ec.leos.services.support.XmlHelper.CONTENT;
import static eu.europa.ec.leos.services.support.XmlHelper.EC;
import static eu.europa.ec.leos.services.support.XmlHelper.EMPTY_STRING;
import static eu.europa.ec.leos.services.support.XmlHelper.INDENT;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INDENT_ORIGIN_INDENT_LEVEL_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INDENT_ORIGIN_NUM_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INDENT_ORIGIN_NUM_ID_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INDENT_ORIGIN_NUM_ORIGIN_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INDENT_ORIGIN_TYPE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INDENT_UNUMBERED_PARAGRAPH;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ORIGIN_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_ACTION_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_ACTION_ROOT_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_DATE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_MOVE_FROM;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_MOVE_TO;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_TRANS_FROM;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_USER_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LIST;
import static eu.europa.ec.leos.services.support.XmlHelper.NUM;
import static eu.europa.ec.leos.services.support.XmlHelper.PARAGRAPH;
import static eu.europa.ec.leos.services.support.XmlHelper.POINT;
import static eu.europa.ec.leos.services.support.XmlHelper.SUBPARAGRAPH;

@Component
public class TableOfContentProcessorImpl implements TableOfContentProcessor {

    private static final Logger LOG = LoggerFactory.getLogger(TableOfContentProcessorImpl.class);

    @Autowired
    protected Provider<StructureContext> structureContextProvider;
    @Autowired
    protected DocumentLanguageContext documentLanguageContext;
    @Autowired
    protected NumberConfigFactory numberConfigFactory;
    @Autowired
    protected MessageHelper messageHelper;

    public List<TableOfContentItemVO> buildTableOfContent(String startingNode, byte[] xmlContent, TocMode mode, boolean withNode) {
        List<TocItem> tocItems = structureContextProvider.get().getTocItems();
        return buildTableOfContent(startingNode, xmlContent, mode, tocItems, withNode);
    }

    public List<TableOfContentItemVO> buildTableOfContent(String startingNode, byte[] xmlContent, TocMode mode, List<TocItem> tocItems, boolean withNode) {
        LOG.trace("Start building TOC from tag {} and mode {}", startingNode, mode);
        long startTime = System.currentTimeMillis();
        Map<TocItem, List<TocItem>> tocRules = structureContextProvider.get().getTocRules();
        List<NumberingConfig> numberingConfigs = structureContextProvider.get().getNumberingConfigs();

        List<TableOfContentItemVO> itemVOList = new ArrayList<>();
        try {
            Document document = createDocument(xmlContent);
            Node node = getFirstElementByName(document, startingNode);
            if (node != null) {
                itemVOList = getAllChildTableOfContentItems(node, tocItems, tocRules, numberingConfigs, mode,
                        documentLanguageContext.getDocumentLanguage(), messageHelper, withNode);
            }
            setNumberingTypeForHigherSubDivision(itemVOList);
            LOG.debug("Xerces Build table of content completed in {} ms", (System.currentTimeMillis() - startTime));
            return itemVOList;
        } catch (Exception e) {
            LOG.error("Unable to build the Table of content item list", e);
            throw new RuntimeException("Unable to build the Table of content item list", e);
        }
    }

    private void setNumberingTypeForHigherSubDivision(List<TableOfContentItemVO> itemVOList) {
        setNumberingTypeForChapter(itemVOList);
    }

    private void setNumberingTypeForChapter(List<TableOfContentItemVO> itemVOList) {
        TableOfContentItemVO bodyToc = itemVOList.stream()
                .filter(tocItemVO -> (tocItemVO.getTagName().equals(AknTag.BODY) || tocItemVO.getTagName().equals(AknTag.MAIN_BODY)))
                .findFirst().orElse(null);
        if (bodyToc != null) {
            TableOfContentItemVO chapterTocItemVo =
                    bodyToc.flattened()
                            .filter(tocItemVO -> (tocItemVO.getTagName().equals(AknTag.CHAPTER)
                                    && (tocItemVO.getNumber() != null && (tocItemVO.getNumber().equals("1") || tocItemVO.getNumber().equals("I")))))
                            .findFirst().orElse(null);
            if (chapterTocItemVo != null) {
                String number = chapterTocItemVo.getNumber();
                final NumberingType numberingType;
                if (number.equals("1")) {
                    numberingType = NumberingType.HIGHER_ELEMENT_NUM;
                } else if (number.equals("I")) {
                    numberingType = NumberingType.ROMAN_UPPER;
                } else {
                    numberingType = chapterTocItemVo.getNumberingType();
                }
                bodyToc.flattened()
                        .filter(tocItemVO -> (tocItemVO.getTagName().equals(AknTag.CHAPTER)))
                        .collect(Collectors.toList())
                        .forEach(tocItemVO -> tocItemVO.setNumberingType(numberingType));
            }
        }
    }

    public static TocItem getTocItemFromNumberingType(String number, String tagName, TocItem originalTocItem,
            List<NumberingConfig> numberingConfigs, List<TocItem> tocItems, Node node, String language) {
        Node parent = null;
        if (originalTocItem.getParentNameNumberingTypeDependency() != null) {
            parent = XmlUtils.getParentWithTagName(node, originalTocItem.getParentNameNumberingTypeDependency().value());
        }
        TocItemTypeName tocItemType = parent != null ? StructureConfigUtils.getTocItemTypeFromTagNameAndAttributes(tocItems,
                parent.getNodeName(),
                XmlUtils.getAttributes(parent)) : TocItemTypeName.REGULAR;
        if (tagName.equals(POINT)) {
            return StructureConfigUtils.getTocItemByTagNameAndTocItemType(tocItems, tocItemType, tagName, language);
        } else if (tagName.equals(INDENT)) {
            if (node.getParentNode().getParentNode().getNodeName().equalsIgnoreCase(POINT)) {
                return StructureConfigUtils.getTocItemByTagNameAndTocItemType(tocItems, tocItemType, tagName, language);
            } else {
                List<TocItem> foundTocItems = StructureConfigUtils.getTocItemsByName(tocItems, INDENT);
                int depth = XmlUtils.getPointDepth(node);
                return StructureConfigUtils.getTocItemByNumValue(numberingConfigs, foundTocItems, number, depth, language);
            }
        }
        return originalTocItem;
    }

    private Node buildElement(Node node, String tagName, TableOfContentItemVO tocVo) {
        String newId = tocVo.getId() != null ? tocVo.getId() : IdGenerator.generateId();
        Node elementNode = createElement(node.getOwnerDocument(), tagName, newId, EMPTY_STRING);
        XmlUtils.insertOrUpdateAttributeValue(elementNode, LEOS_ORIGIN_ATTR, tocVo.getOriginAttr());
        return elementNode;
    }

    public boolean isFirstElement(TableOfContentItemVO tableOfContentItemVO, String elementName) {
        return this.containsElement(tableOfContentItemVO, elementName);
    }

    public boolean containsElement(TableOfContentItemVO tableOfContentItemVO, String elementName) {
        Node firstList = XmlUtils.getFirstChild(tableOfContentItemVO.getNode(), LIST);
        if (firstList == null) {
            return XmlUtils.getFirstChild(tableOfContentItemVO.getNode(), elementName) != null;
        } else {
            return XmlUtils.getFirstChild(firstList, elementName) != null;
        }
    }

    public void convertTocItemContent(TableOfContentItemVO item, TableOfContentItemVO subelement, IndentedItemType beforeIndentedType, IndentedItemType afterIndentedType, boolean restored) {
        switch (afterIndentedType) {
            case POINT:
                convertToPoint(item, beforeIndentedType, item.getNumber());
                break;
            case OTHER_SUBPOINT:
                convertToSubpoint(item, beforeIndentedType);
                break;
            case FIRST_SUBPOINT:
                convertToFirstSubpoint(item, subelement, beforeIndentedType, item.getNumber());
                break;
            case PARAGRAPH:
                convertToParagraph(item, beforeIndentedType, item.getNumber());
                break;
            case OTHER_SUBPARAGRAPH:
                convertToSubparagraph(item, beforeIndentedType);
                break;
            case FIRST_SUBPARAGRAPH:
                convertToFirstSubparagraph(item, subelement, beforeIndentedType, item.getNumber());
                break;
        }
        if (restored) {
            restoreElement(item);
        }
    }

    void restoreElement(TableOfContentItemVO item) {
        Node originalItem = item.getNode();
        resetNum(originalItem);
        resetIndentAttributes(originalItem);
        item.setNode(originalItem);
    }

    void convertToSubpoint(TableOfContentItemVO item, IndentedItemType beforeIndentItemType) {
        Node originalItem = item.getNode();
        List<Node> children = getChildren(originalItem);

        switch (beforeIndentItemType) {
            case FIRST_SUBPOINT:
            case FIRST_SUBPARAGRAPH:
                originalItem = changeTagName(originalItem, SUBPARAGRAPH, false);
                break;
            case POINT:
            case PARAGRAPH:
            case OTHER_SUBPARAGRAPH:
                if (!children.isEmpty()) {
                    return;
                }
                originalItem = changeTagName(originalItem, SUBPARAGRAPH, false);
                break;
        }
        copyAttributesAndSetId(item, originalItem);
        item.setNode(originalItem);
    }

    void convertToPoint(TableOfContentItemVO item, IndentedItemType beforeIndentItemType, String num) {
        Node originalItem = item.getNode();
        List<Node> children = getChildren(originalItem);

        switch (beforeIndentItemType) {
            case FIRST_SUBPOINT:
            case FIRST_SUBPARAGRAPH:
                Node firstSubelement;
                if (children.isEmpty()) {
                    return;
                } else {
                    firstSubelement = getSubelementFromFirstElement(children);
                }

                Node content = XmlUtils.getFirstChild(firstSubelement, CONTENT);
                moveToParent(content, false);
                originalItem = changeTagName(originalItem, TableOfContentProcessor.getTagValueFromTocItemVo(item), false);
                updateNumTag(originalItem, num);
                break;
            case OTHER_SUBPOINT:
            case OTHER_SUBPARAGRAPH:
                if (!children.isEmpty()) {
                    return;
                }
                createNumTag(originalItem, num);
                originalItem = changeTagName(originalItem, TableOfContentProcessor.getTagValueFromTocItemVo(item), false);
                break;
            case PARAGRAPH:
                if (!children.isEmpty()) {
                    return;
                }
                updateNumTag(originalItem, num);
                originalItem = changeTagName(originalItem, TableOfContentProcessor.getTagValueFromTocItemVo(item), false);
                break;
        }
        copyAttributesAndSetId(item, originalItem);
        removeAttribute(originalItem, XmlHelper.REFERS_TO_ATTR);
        item.setNode(originalItem);
    }

    void convertToFirstSubpoint(TableOfContentItemVO item, TableOfContentItemVO subelement, IndentedItemType beforeIndentItemType, String num) {
        Node originalItem = item.getNode();
        List<Node> children = getChildren(originalItem);
        Node firstSubpoint = null;

        switch (beforeIndentItemType) {
            case FIRST_SUBPARAGRAPH:
                Node firstSubelement;
                if (children.isEmpty()) {
                    return;
                } else {
                    firstSubelement = getSubelementFromFirstElement(children);
                }

                firstSubpoint = changeTagName(firstSubelement, SUBPARAGRAPH, false);
                firstSubelement.getParentNode().replaceChild(firstSubpoint, firstSubelement);
                originalItem = changeTagName(originalItem, TableOfContentProcessor.getTagValueFromTocItemVo(item), true);
                updateNumTag(originalItem, num);
                break;
            case OTHER_SUBPOINT:
            case OTHER_SUBPARAGRAPH:
                firstSubpoint = changeTagName(originalItem, SUBPARAGRAPH, false);
                originalItem.appendChild(firstSubpoint);
                originalItem = changeTagName(originalItem, TableOfContentProcessor.getTagValueFromTocItemVo(item), true);
                createNumTag(originalItem, num);
                break;
            case PARAGRAPH:
            case POINT:
                firstSubpoint = changeTagName(originalItem, SUBPARAGRAPH, false);
                originalItem.appendChild(firstSubpoint);
                originalItem = changeTagName(originalItem, TableOfContentProcessor.getTagValueFromTocItemVo(item), true);
                updateNumTag(originalItem, num);
                break;
        }
        copyAttributesAndSetId(item, originalItem);
        removeAttribute(originalItem, XmlHelper.REFERS_TO_ATTR);
        item.setNode(originalItem);
        copyAttributesAndSetId(subelement, firstSubpoint);
        subelement.setNode(firstSubpoint);
    }

    void convertToSubparagraph(TableOfContentItemVO item, IndentedItemType beforeIndentItemType) {
        Node originalItem = item.getNode();
        List<Node> children = getChildren(originalItem);

        switch (beforeIndentItemType) {
            case FIRST_SUBPOINT:
            case FIRST_SUBPARAGRAPH:
                originalItem = changeTagName(originalItem, SUBPARAGRAPH, false);
                break;
            case POINT:
            case PARAGRAPH:
            case OTHER_SUBPOINT:
                if (!children.isEmpty()) {
                    return;
                }
                originalItem = changeTagName(originalItem, SUBPARAGRAPH, false);
                break;
        }
        copyAttributesAndSetId(item, originalItem);
        item.setNode(originalItem);
    }

    void convertToParagraph(TableOfContentItemVO item, IndentedItemType beforeIndentItemType, String num) {
        Node originalItem = item.getNode();
        List<Node> children = getChildren(originalItem);

        switch (beforeIndentItemType) {
            case FIRST_SUBPOINT:
            case FIRST_SUBPARAGRAPH:
                Node firstSubelement;
                if (children.isEmpty()) {
                    return;
                } else {
                    firstSubelement = getSubelementFromFirstElement(children);
                }

                Node content = XmlUtils.getFirstChild(firstSubelement, CONTENT);
                moveToParent(content, false);
                originalItem = changeTagName(originalItem, PARAGRAPH, false);
                updateNumTag(originalItem, num);
                break;
            case OTHER_SUBPOINT:
            case OTHER_SUBPARAGRAPH:
                if (!children.isEmpty()) {
                    return;
                }
                createNumTag(originalItem, num);
                originalItem = changeTagName(originalItem, PARAGRAPH, false);
                break;
            case POINT:
                if (!children.isEmpty()) {
                    return;
                }
                updateNumTag(originalItem, num);
                originalItem = changeTagName(originalItem, PARAGRAPH, false);
                break;
        }
        copyAttributesAndSetId(item, originalItem);
        removeAttribute(originalItem, XmlHelper.REFERS_TO_ATTR);
        item.setNode(originalItem);
    }

    void convertToFirstSubparagraph(TableOfContentItemVO item, TableOfContentItemVO subelement, IndentedItemType beforeIndentItemType, String num) {
        Node originalItem = item.getNode();
        List<Node> children = getChildren(originalItem);
        Node firstSubpoint = null;

        switch (beforeIndentItemType) {
            case FIRST_SUBPOINT:
                Node firstSubelement;
                if (children.isEmpty()) {
                    return;
                } else {
                    firstSubelement = getSubelementFromFirstElement(children);
                }

                firstSubpoint = changeTagName(firstSubelement, SUBPARAGRAPH, false);
                firstSubelement.getParentNode().replaceChild(firstSubpoint, firstSubelement);
                originalItem = changeTagName(originalItem, PARAGRAPH, true);
                updateNumTag(originalItem, num);
                break;
            case OTHER_SUBPOINT:
            case OTHER_SUBPARAGRAPH:
                firstSubpoint = changeTagName(originalItem, SUBPARAGRAPH, false);
                originalItem.appendChild(firstSubpoint);
                originalItem = changeTagName(originalItem, PARAGRAPH, true);
                createNumTag(originalItem, num);
                break;
            case PARAGRAPH:
            case POINT:
                firstSubpoint = changeTagName(originalItem, SUBPARAGRAPH, false);
                originalItem.appendChild(firstSubpoint);
                originalItem = changeTagName(originalItem, PARAGRAPH, true);
                updateNumTag(originalItem, num);
                break;
        }
        copyAttributesAndSetId(item, originalItem);
        removeAttribute(originalItem, XmlHelper.REFERS_TO_ATTR);
        item.setNode(originalItem);
        copyAttributesAndSetId(subelement, firstSubpoint);
        subelement.setNode(firstSubpoint);
    }

    public int getIndentedItemIndentLevel(Node node) {
        return getItemIndentLevel(node, 0);
    }

    int getItemIndentLevel(Node node, int startingDepth) {
        Node parent = node.getParentNode();
        while (parent != null) {
            if (ArrayUtils.contains(NUMBERED_AND_LEVEL_ITEMS, parent.getNodeName().toLowerCase())) {
                startingDepth++;
            }
            parent = parent.getParentNode();
        }

        return startingDepth;
    }

    public List<Node> getChildren(Node node) {
        List<String> elementNames = new ArrayList<String>();
        elementNames.addAll(Arrays.asList(UNUMBERED_ITEMS));
        elementNames.add(LIST);
        return XmlUtils.getChildren(node, elementNames);
    }

    public void moveToParent(Node node, boolean copy) {
        Node parent = node.getParentNode();
        Node next = parent.getNextSibling();
        Node grandParent = parent.getParentNode();
        if (grandParent.getNodeName().equalsIgnoreCase(LIST)) {
            next = grandParent;
            grandParent = grandParent.getParentNode();
        }
        if (next != null) {
            grandParent.insertBefore(node, next);
        } else {
            grandParent.appendChild(node);
        }
        if (copy) {
            copyAttributes(node, parent, XmlUtils.getId(node), XmlUtils.getAttributeValue(node, LEOS_ORIGIN_ATTR));
        }
        parent.getParentNode().removeChild(parent);
    }

    public void resetSoftActionAttributes(Node node) {
        XmlUtils.removeAttribute(node, LEOS_SOFT_ACTION_ATTR);
        XmlUtils.removeAttribute(node, LEOS_SOFT_TRANS_FROM);
        XmlUtils.removeAttribute(node, LEOS_SOFT_MOVE_FROM);
        XmlUtils.removeAttribute(node, LEOS_SOFT_MOVE_TO);
        XmlUtils.removeAttribute(node, LEOS_SOFT_USER_ATTR);
        XmlUtils.removeAttribute(node, LEOS_SOFT_DATE_ATTR);
        XmlUtils.removeAttribute(node, LEOS_SOFT_ACTION_ROOT_ATTR);
    }

    public void resetIndentAttributes(Node node) {
        XmlUtils.removeAttribute(node, LEOS_INDENT_ORIGIN_INDENT_LEVEL_ATTR);
        XmlUtils.removeAttribute(node, LEOS_INDENT_ORIGIN_TYPE_ATTR);
        XmlUtils.removeAttribute(node, LEOS_INDENT_ORIGIN_NUM_ATTR);
        XmlUtils.removeAttribute(node, LEOS_INDENT_ORIGIN_NUM_ID_ATTR);
        XmlUtils.removeAttribute(node, LEOS_INDENT_ORIGIN_NUM_ORIGIN_ATTR);
        XmlUtils.removeAttribute(node, LEOS_INDENT_UNUMBERED_PARAGRAPH);
    }

    private Node changeTagName(Node oldNode, String newTagName, boolean hasList) {
        Node newNode = XmlUtils.createElement(oldNode.getOwnerDocument(), newTagName, EMPTY_STRING);
        copyAttributes(newNode, oldNode, XmlUtils.getId(oldNode), XmlUtils.getAttributeValue(oldNode, LEOS_ORIGIN_ATTR));
        copyContent(newNode, oldNode, hasList);
        return newNode;
    }

    private void copyAttributes(Node node, Node oldNode, String id, String origin) {
        Map<String, String> attributes = XmlUtils.getAttributes(oldNode);
        for (Map.Entry<String, String> attr : attributes.entrySet()) {
            if (!attr.getKey().equals(CLASS_ATTR)) {
                XmlUtils.insertOrUpdateAttributeValue(node, attr.getKey(), attr.getValue());
            }
        }
        XmlUtils.setId(node, id);
        XmlUtils.insertOrUpdateAttributeValue(node, LEOS_ORIGIN_ATTR, origin);
    }

    private void copyAttributesAndSetId(TableOfContentItemVO item, Node node) {
        if (item.isIndented()) {
            XmlUtils.insertOrUpdateAttributeValue(node, LEOS_INDENT_ORIGIN_INDENT_LEVEL_ATTR, String.valueOf(item.getIndentOriginIndentLevel()));
            XmlUtils.insertOrUpdateAttributeValue(node, LEOS_INDENT_ORIGIN_TYPE_ATTR, item.getIndentOriginType().name());
            XmlUtils.insertOrUpdateAttributeValue(node, LEOS_INDENT_ORIGIN_NUM_ATTR, item.getIndentOriginNumValue());
            XmlUtils.insertOrUpdateAttributeValue(node, LEOS_INDENT_ORIGIN_NUM_ID_ATTR, item.getIndentOriginNumId());
            XmlUtils.insertOrUpdateAttributeValue(node, LEOS_INDENT_ORIGIN_NUM_ORIGIN_ATTR, item.getIndentOriginNumOrigin());
            if (item.getTagName().equals(AknTag.PARAGRAPH) && StringUtils.isEmpty(item.getNumber())) {
                XmlUtils.insertOrUpdateAttributeValue(node, LEOS_INDENT_UNUMBERED_PARAGRAPH, "true");
            }
        } else {
            resetIndentAttributes(node);
        }
        if (item.getSoftActionAttr() != null) {
            XmlUtils.insertOrUpdateAttributeValue(node, LEOS_SOFT_ACTION_ATTR, item.getSoftActionAttr().getSoftAction());
        } else {
            resetSoftActionAttributes(node);
        }
        if (item.getSoftTransFrom() != null) {
            XmlUtils.insertOrUpdateAttributeValue(node, LEOS_SOFT_TRANS_FROM, item.getSoftTransFrom());
        } else {
            XmlUtils.removeAttribute(node, LEOS_SOFT_TRANS_FROM);
        }
        XmlUtils.setId(node, item.getId());
        XmlUtils.insertOrUpdateAttributeValue(node, LEOS_ORIGIN_ATTR, item.getOriginAttr());
    }

    private void copyContent(Node node, Node oldNode, boolean hasList) {
        Node num = XmlUtils.getFirstChild(oldNode, NUM);
        if (num != null && Arrays.asList(NUMBERED_ITEMS).contains(node.getNodeName())) {
            node.appendChild(num);
        }
        Node content = XmlUtils.getFirstChild(oldNode, CONTENT);
        if (content != null) {
            node.appendChild(content);
        }
        if ((node.getNodeName().equalsIgnoreCase(POINT) || node.getNodeName().equalsIgnoreCase(INDENT)) && hasList) {
            Node subpoint = XmlUtils.getFirstChild(oldNode, SUBPARAGRAPH);
            if (subpoint == null) {
                Node list = XmlUtils.getFirstChild(oldNode, LIST);
                if (list != null) {
                    subpoint = XmlUtils.getFirstChild(list, SUBPARAGRAPH);
                }
            }
            if (subpoint != null) {
                node.appendChild(subpoint);
            }
        }
        if (node.getNodeName().equalsIgnoreCase(PARAGRAPH) && hasList) {
            Node subparagraph = XmlUtils.getFirstChild(oldNode, SUBPARAGRAPH);
            if (subparagraph == null) {
                Node list = XmlUtils.getFirstChild(oldNode, LIST);
                if (list != null) {
                    subparagraph = XmlUtils.getFirstChild(list, SUBPARAGRAPH);
                }
            }
            if (subparagraph != null) {
                node.appendChild(subparagraph);
            }
        }
    }

    private boolean hasOrigin(Node node, String origin) {
        String attrOrigin = XmlUtils.getAttributeValue(node, LEOS_ORIGIN_ATTR);
        if (origin.equals(CN)) {
            return attrOrigin == null || origin.equalsIgnoreCase(attrOrigin);
        } else {
            return attrOrigin.equalsIgnoreCase(EC);
        }
    }

    private void createNumTag(Node node, String num) {
        Node numNode = XmlUtils.createElement(node.getOwnerDocument(), NUM, num);
        String originalNumId = XmlUtils.getAttributeValue(node, LEOS_INDENT_ORIGIN_NUM_ID_ATTR);
        if (originalNumId != null) {
            XmlUtils.setId(numNode, originalNumId);
        }
        String originalNum = XmlUtils.getAttributeValue(node, LEOS_INDENT_ORIGIN_NUM_ATTR);
        if (originalNum != null && originalNum.equals(num) && hasOrigin(node, EC)) {
            XmlUtils.insertOrUpdateAttributeValue(node, LEOS_ORIGIN_ATTR, EC);
        } else {
            XmlUtils.insertOrUpdateAttributeValue(node, LEOS_ORIGIN_ATTR, CN);
        }
        Node firstChild = XmlUtils.getFirstChild(node);
        node.insertBefore(numNode, firstChild);
    }

    private void updateNumTag(Node node, String num) {
        Node numNode = XmlUtils.getFirstChild(node, NUM);
        if (numNode != null) {
            if (!numNode.getTextContent().equals(num)) {
                XmlUtils.insertOrUpdateAttributeValue(numNode, LEOS_ORIGIN_ATTR, CN);
            } else {
                XmlUtils.insertOrUpdateAttributeValue(numNode, LEOS_ORIGIN_ATTR, EC);
            }
            numNode.setTextContent(num);
        } else {
            createNumTag(node, num);
        }
    }

    private void resetNum(Node node) {
        Node numNode = XmlUtils.getFirstChild(node, NUM);
        if (numNode != null) {
            String originalNumId = XmlUtils.getAttributeValue(node, LEOS_INDENT_ORIGIN_NUM_ID_ATTR);
            if (originalNumId != null) {
                XmlUtils.setId(numNode, originalNumId);
            }
            String originalNumValue = XmlUtils.getAttributeValue(node, LEOS_INDENT_ORIGIN_NUM_ATTR);
            if (originalNumValue != null) {
                numNode.setTextContent(originalNumValue);
            }
            String originalNumOrigin = XmlUtils.getAttributeValue(node, LEOS_INDENT_ORIGIN_NUM_ORIGIN_ATTR);
            if (originalNumOrigin != null) {
                XmlUtils.insertOrUpdateAttributeValue(node, LEOS_ORIGIN_ATTR, originalNumOrigin);
            }
        }
    }

    public void setContentInNodeFromTocItem(TableOfContentItemVO tocItem, Node node) {
        NodeList childNodes = node.getChildNodes();
        for (int i = 0; i < childNodes.getLength(); i++) {
            Node childNode = childNodes.item(i);
            if (childNode.getNodeType() == Node.TEXT_NODE) {
                childNode.setTextContent(tocItem.getContent());
            }
        }
    }

    private Node getSubelementFromFirstElement(List<Node> children) {
        Node firstSubelement = children.get(0);
        if (firstSubelement.getNodeName().equalsIgnoreCase(LIST)) {
            List<Node> grandchildren = getChildren(firstSubelement);
            firstSubelement = grandchildren.get(0);
        }
        return firstSubelement;
    }
}
