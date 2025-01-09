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

package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.repository.DocumentRuleType;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.Explanatory;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.services.document.AnnexService;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.document.ExplanatoryService;
import eu.europa.ec.leos.services.dto.request.NodeDropValidationRequest;
import eu.europa.ec.leos.services.dto.response.NodeValidationResponse;
import eu.europa.ec.leos.services.processor.content.TableOfContentHelper;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.utils.StructureConfigUtils;
import eu.europa.ec.leos.vo.structure.DocumentRules;
import eu.europa.ec.leos.vo.structure.HigherDivisionType;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.vo.structure.TocItem;
import eu.europa.ec.leos.vo.toc.CheckDocumentRulesVO;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocDropResult;
import eu.europa.ec.leos.vo.toc.TocItemPosition;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import javax.inject.Provider;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static eu.europa.ec.leos.services.processor.content.TableOfContentProcessor.getTagValueFromTocItemVo;
import static eu.europa.ec.leos.services.processor.content.XmlContentProcessorHelper.buildTableOfContentsItemVO;
import static eu.europa.ec.leos.services.support.XercesUtils.createXercesDocument;
import static eu.europa.ec.leos.services.support.XercesUtils.getElementById;
import static eu.europa.ec.leos.services.support.XmlHelper.BODY;
import static eu.europa.ec.leos.services.support.XmlHelper.CROSSHEADING;
import static eu.europa.ec.leos.services.support.XmlHelper.DIVISION;
import static eu.europa.ec.leos.services.support.XmlHelper.INDENT;
import static eu.europa.ec.leos.services.support.XmlHelper.LIST;
import static eu.europa.ec.leos.services.support.XmlHelper.MAIN_BODY;
import static eu.europa.ec.leos.services.support.XmlHelper.POINT;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_MOVE_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.SUBPARAGRAPH;

public abstract class TocApiServiceImpl implements TocApiService {

    private static final Logger LOG = LoggerFactory.getLogger(TocApiServiceImpl.class);
    private static final String DOCUMENT_CONTENT_IS_REQUIRED = "Document content is required!";

    private Provider<StructureContext> structureContextProvider;
    private BillService billService;
    private AnnexService annexService;
    private MessageHelper messageHelper;
    private ExplanatoryService explanatoryService;
    private DocumentLanguageContext documentLanguageContext;
    private final XPathCatalog xPathCatalog;
    private final XmlContentProcessor xmlContentProcessor;

    @Autowired
    protected TocApiServiceImpl(Provider<StructureContext> structureContextProvider, BillService billService,
                                AnnexService annexService, MessageHelper messageHelper,
                                ExplanatoryService explanatoryService, DocumentLanguageContext documentLanguageContext,
                                XPathCatalog xPathCatalog, XmlContentProcessor xmlContentProcessor) {
        this.structureContextProvider = structureContextProvider;
        this.billService = billService;
        this.annexService = annexService;
        this.messageHelper = messageHelper;
        this.explanatoryService = explanatoryService;
        this.documentLanguageContext = documentLanguageContext;
        this.xPathCatalog = xPathCatalog;
        this.xmlContentProcessor = xmlContentProcessor;
    }

    @Override
    public NodeValidationResponse nodeValidationDrop(NodeDropValidationRequest request) {
        String documentRef = request.getDocumentRef();
        LeosCategory category = request.getDocumentType();
        byte[] xmlContent = new byte[0];
        String language = null;
        switch (category) {
            case BILL:
                Bill bill = billService.findBillByRef(documentRef);
                xmlContent = bill.getContent().getOrError(() -> DOCUMENT_CONTENT_IS_REQUIRED).getSource().getBytes();
                this.setStructureContext(bill.getMetadata().getOrError(() -> "BIll metadata is required!").getDocTemplate());
                language = bill.getMetadata().get().getLanguage();
                break;
            case ANNEX:
                Annex annex = annexService.findAnnexByRef(documentRef);
                xmlContent = annex.getContent().getOrError(() -> DOCUMENT_CONTENT_IS_REQUIRED).getSource().getBytes();
                this.setStructureContext(annex.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
                language = annex.getMetadata().get().getLanguage();
                break;
            case COUNCIL_EXPLANATORY:
                Explanatory explanatory = explanatoryService.findExplanatoryByRef(documentRef);
                xmlContent = explanatory.getContent().getOrError(() -> DOCUMENT_CONTENT_IS_REQUIRED).getSource().getBytes();
                this.setStructureContext(explanatory.getMetadata().getOrError(() -> "Explanatory metadata is required!").getDocTemplate());
                language = explanatory.getMetadata().get().getLanguage();
                break;
            default:
                LOG.error("Invalid document type");
        }
        documentLanguageContext.setDocumentLanguage(language);
        TocDropResult result;
        try {
            result = validateDrop(request, xmlContent);
        } catch (Exception e) {
            LOG.error("Failed to validate drop in toc", e);
            throw new RuntimeException(e);
        }
        if(result != null) {
            final String srcItemType = TableOfContentHelper.getDisplayableTocItem(result.getSourceItem().getTocItem(), language, messageHelper);
            if (result.getMessageKey().equals("toc.level.only.higher.division.allowed.between")) {
                result.setSourceItem(null);
                result.setTargetItem(null);
            } else if (result.getTargetItem() != null) {
                final String targetItemType = TableOfContentHelper.getDisplayableTocItem(result.getTargetItem().getTocItem(), language, messageHelper);
                result.setMessageKey(messageHelper.getMessage(result.getMessageKey(), srcItemType, targetItemType));
            } else {
                result.setMessageKey(messageHelper.getMessage("toc.edit.window.drop.error.root.message", srcItemType));
            }
        }
        return new NodeValidationResponse(result);
    }

    private TocDropResult validateDrop(NodeDropValidationRequest request, byte[] xmlContent) {
        Map<TocItem, List<TocItem>> tableOfContentRules = structureContextProvider.get().getTocRules();
        Map<String, DocumentRules.Rule> tableOfContentDocumentRules = structureContextProvider.get().getDocumentRules();
        List<TocItem> tocItems = structureContextProvider.get().getTocItems();
        List<NumberingConfig> numberingConfigs = structureContextProvider.get().getNumberingConfigs();

        String docName = getDocumentName(xmlContent);
        Document document = createXercesDocument(xmlContent);
        String language = documentLanguageContext.getDocumentLanguage();

        TableOfContentItemVO draggedTocItemVO = getTableOfContentItemVO(request.getDraggedNodeId().get(0),
                request.getDraggedNodeTagName(), tocItems, numberingConfigs, document, language);
        TableOfContentItemVO targetTocItemVO = getTableOfContentItemVO(request.getTargetNodeId(),
                request.getTargetNodeTagName(), tocItems, numberingConfigs, document, language);
        TableOfContentItemVO parentTocItemVO = getTableOfContentItemVO(request.getParentNodeId(),
                request.getParentNodeTagName(), tocItems, numberingConfigs, document, language);

        TocDropResult result = new TocDropResult(true, false,"toc.edit.window.drop.success.message",
                new ArrayList<>(), draggedTocItemVO, targetTocItemVO);

        if (draggedTocItemVO != null && !isItemDroppedOnSameTarget(result, draggedTocItemVO, targetTocItemVO)) {
            validateAddingItemAsChildOrSibling(result, draggedTocItemVO, targetTocItemVO, tableOfContentRules,
                    parentTocItemVO, request.getPosition(), language);
        }
        if(result.isSuccess()) {
            validateDocumentRules(result, tableOfContentDocumentRules, draggedTocItemVO, targetTocItemVO,
                    request.getPosition(), request.getTableOfContentItemVOs());
        }

        return result;
    }

    private String getDocumentName(byte[] xmlContent) {
        String docNameXPath = this.xPathCatalog.getXPathDocumentName();
        return this.xmlContentProcessor.getElementValue(xmlContent, docNameXPath, true);
    }

    private void validateDocumentRules(final TocDropResult result, final Map<String, DocumentRules.Rule> tableOfContentDocumentRules,
                                       TableOfContentItemVO sourceItem, final TableOfContentItemVO targetTocItemVO, final TocItemPosition position,
                                       final List<TableOfContentItemVO> tableOfContentItemVOs) {

        CheckDocumentRulesVO checkDocumentRulesVO = new CheckDocumentRulesVO();

        // This is a recursive call that will add the realSourceItemVO in checkDocumentRulesVO
        for (TableOfContentItemVO tableOfContentItemVO : tableOfContentItemVOs) {
            if (tableOfContentItemVO.getTocItem().getAknTag().value().equals(MAIN_BODY) ||
                    tableOfContentItemVO.getTocItem().getAknTag().value().equals(BODY)) {
                // This is a recursive call that will add data in checkDocumentRulesVO
                this.getActualSourceItemVO(tableOfContentItemVO, sourceItem, checkDocumentRulesVO);
            }
        }
        if (checkDocumentRulesVO.getActualSourceItemVO() != null) {
            sourceItem = checkDocumentRulesVO.getActualSourceItemVO();
        }

        if (tableOfContentDocumentRules != null && !tableOfContentDocumentRules.isEmpty()) {
            for (String documentRulesKey: tableOfContentDocumentRules.keySet()) {
                DocumentRules.Rule rule = tableOfContentDocumentRules.get(documentRulesKey);
                for (TableOfContentItemVO tableOfContentItemVO : tableOfContentItemVOs) {
                    if (tableOfContentItemVO.getTocItem().getAknTag().value().equals(MAIN_BODY)) {
                        // This is a recursive call that will add data in checkDocumentRulesVO
                        this.checkLevelStructureInItem(rule, tableOfContentItemVO, checkDocumentRulesVO, sourceItem, targetTocItemVO, position);
                    } else if (tableOfContentItemVO.getTocItem().getAknTag().value().equals(BODY)) {
                        validateHigherDivisionStructure(rule, tableOfContentItemVO, checkDocumentRulesVO, sourceItem, targetTocItemVO, position);
                    }
                }
            }
        }
        if (!checkDocumentRulesVO.isValidStructure()) {
            //if warning is false set success to false else set to true to allow addition of the node
            result.setSuccess(checkDocumentRulesVO.isWarning());
            result.setWarning(checkDocumentRulesVO.isWarning());
            if (checkDocumentRulesVO.isWarning()) {
                result.setWarningMessageKeys(checkDocumentRulesVO.getMessageKey());
                result.setMessageKey("");
            } else {
                result.setMessageKey(checkDocumentRulesVO.getMessageKey().get(0));
            }
        }
    }

    private void getActualSourceItemVO(TableOfContentItemVO tableOfContentItemVOToCheck, TableOfContentItemVO sourceItem, CheckDocumentRulesVO checkDocumentRulesVO) {
        for (TableOfContentItemVO tableOfContentItemVO : tableOfContentItemVOToCheck.getChildItems()) {
            if (tableOfContentItemVO.getId().equals(sourceItem.getId())) {
                checkDocumentRulesVO.setActualSourceItemVO(tableOfContentItemVO);
                return;
            }
            this.getActualSourceItemVO(tableOfContentItemVO, sourceItem, checkDocumentRulesVO);
        }
    }

    private void validateHigherDivisionStructure(DocumentRules.Rule rule, TableOfContentItemVO tableOfContentItemVO, CheckDocumentRulesVO checkDocumentRulesVO,
                                                 TableOfContentItemVO sourceItem, TableOfContentItemVO targetItem, TocItemPosition position) {
        String tocItem = rule.getTocItem().value();
        String ruleTypeString = rule.getType(); // Get the string
        DocumentRuleType ruleType = Arrays.stream(DocumentRuleType.values())
                .filter(r -> r.getRuleType().equals(ruleTypeString))
                .findFirst()
                .orElse(null);
        if (ruleType == null) {
            return;
        }

        switch (ruleType) {
            case STRUCTURE_VALIDATION:
                if(sourceItem.getTocItem().getAknTag().value().equalsIgnoreCase(tocItem)) {
                    if(targetItem.getTocItem().isHigherElement() && position.equals(TocItemPosition.AS_CHILDREN)) {
                        return;
                    } else {
                        if ((!sourceItem.getTocItem().isHigherElement() && targetItem.getTocItem().isHigherElement() &&
                                !position.equals(TocItemPosition.AS_CHILDREN)) ||
                                (!sourceItem.getTocItem().isHigherElement() && !targetItem.getTocItem().isHigherElement() &&
                                        checkHigherDivisionExists(tableOfContentItemVO))) {
                            setInvalidStructureWarning(checkDocumentRulesVO, rule.getErrorMessage());
                        }
                    }
                }
                break;
            case NOT_EMPTY:
                if(checkHigherDivisionIsEmpty(tableOfContentItemVO)) {
                    setInvalidStructureWarning(checkDocumentRulesVO, rule.getErrorMessage());
                }
                break;
            case HIERARCHY:
                List<HigherDivisionType> types = rule.getHigherDivisions().getTypes();
                if ((sourceItem.getTocItem().isHigherElement() && targetItem.getTocItem().isHigherElement() &&
                        !position.equals(TocItemPosition.AS_CHILDREN)) ||
                        (sourceItem.getTocItem().isHigherElement() && !targetItem.getTocItem().isHigherElement() &&
                                !isInHierarchy(sourceItem, tableOfContentItemVO, types, tocItem, position)) ||
                        sourceItem.getTocItem().isHigherElement() && !isHierarchyValid(tableOfContentItemVO)) {
                    setInvalidStructureWarning(checkDocumentRulesVO, rule.getErrorMessage());
                }
                break;
            default:
        }
    }

    private boolean checkHigherDivisionExists(TableOfContentItemVO tableOfContentItemVO) {
        if(tableOfContentItemVO.getTocItem().isHigherElement()) {
            return true;
        }
        for(TableOfContentItemVO childTableOfContentItemVO : tableOfContentItemVO.getChildItems()) {
            if (checkHigherDivisionExists(childTableOfContentItemVO)) {
                return true;
            }
        }
        return false;
    }

    private String getHigherDivisionFromTree(TableOfContentItemVO tableOfContentItemVO) {
        if(tableOfContentItemVO.getTocItem().isHigherElement()) {
            return tableOfContentItemVO.getTocItem().getAknTag().value();
        }
        for(TableOfContentItemVO childTableOfContentItemVO : tableOfContentItemVO.getChildItems()) {
            if (checkHigherDivisionExists(childTableOfContentItemVO)) {
                return getHigherDivisionFromTree(childTableOfContentItemVO);
            }
        }
        return "";
    }

    private boolean isInHierarchy(TableOfContentItemVO sourceItem, TableOfContentItemVO tableOfContentItemVO,
                                  List<HigherDivisionType> higherDivisionTypes, String tocItem, TocItemPosition position) {
        boolean addedInHierarchy = true;
        if(sourceItem.getTocItem().getAknTag().value().equalsIgnoreCase(tocItem)) {
            String higherDivision = getHigherDivisionFromTree(tableOfContentItemVO);
            if(!StringUtils.isEmpty(higherDivision)) {
                addedInHierarchy = higherDivisionTypes.stream().anyMatch(higherDivisionType ->
                        higherDivision.equalsIgnoreCase(higherDivisionType.value())
                                && position.equals(TocItemPosition.AS_CHILDREN));
            }
        }
        return addedInHierarchy;
    }

    private boolean isHierarchyValid(TableOfContentItemVO tableOfContentItemVO) {
        List<TableOfContentItemVO> higherDivisions = getAllHigherDivisionsFromTree(tableOfContentItemVO);
        boolean isHierarchyValid = true;
        if(higherDivisions != null && higherDivisions.size() > 0) {
            TableOfContentItemVO parentItem = higherDivisions.stream()
                    .filter(higherDivision -> higherDivision.getParentItem().getTocItem().isHigherElement())
                    .findFirst()
                    .orElse(null);

            if(parentItem == null) {
                isHierarchyValid = false;
            }
        }
        return isHierarchyValid;
    }

    private List<TableOfContentItemVO> getAllHigherDivisionsFromTree(TableOfContentItemVO tableOfContentItemVO) {
        Stream<TableOfContentItemVO> currentElement = tableOfContentItemVO.getTocItem().isHigherElement() ?
                Stream.of(tableOfContentItemVO) : Stream.empty();

        Stream<TableOfContentItemVO> childElements = tableOfContentItemVO.getChildItems().stream()
                .flatMap(child -> getAllHigherDivisionsFromTree(child).stream());

        return Stream.concat(currentElement, childElements).collect(Collectors.toList());
    }

    private boolean checkHigherDivisionIsEmpty(TableOfContentItemVO tableOfContentItemVO) {
        if(tableOfContentItemVO.getTocItem().isHigherElement()) {
            if (tableOfContentItemVO.getChildItems() != null && tableOfContentItemVO.getChildItems().isEmpty()) {
                return true;
            }
        }
        for(TableOfContentItemVO childTableOfContentItemVO : tableOfContentItemVO.getChildItems()) {
            if(checkHigherDivisionIsEmpty(childTableOfContentItemVO)) {
                return true;
            }
        }
        return false;
    }

    private void setInvalidStructureWarning(CheckDocumentRulesVO checkDocumentRulesVO, String errorMessage) {
        checkDocumentRulesVO.setValidStructure(false);
        checkDocumentRulesVO.setWarning(true);
        checkDocumentRulesVO.getMessageKey().add(errorMessage);
    }


    private void checkLevelStructureInItem(DocumentRules.Rule rule, TableOfContentItemVO tableOfContentItemVOToCheck, CheckDocumentRulesVO checkDocumentRulesVO,
            TableOfContentItemVO sourceItem, TableOfContentItemVO targetTocItemVO, TocItemPosition position) {

        if (!checkDocumentRulesVO.isValidStructure()) {
            return;
        }

        String aknElementName = rule.getTocItem().value();
        List<String> exceptionElementsList = rule.getException().getTocItems().stream().map(element -> element.value()).collect(Collectors.toList());
        exceptionElementsList.add(aknElementName);

        if (!checkDocumentRulesVO.isFirstElementFound() && sourceItem.getTocItem().getAknTag().value().equals(aknElementName)
                && tableOfContentItemVOToCheck.getId().equals(targetTocItemVO.getId()) && position.equals(TocItemPosition.BEFORE)) {
            checkDocumentRulesVO.setFirstElementFound(true);
        }
        if (checkDocumentRulesVO.isFirstElementFound() && !exceptionElementsList.contains(sourceItem.getTocItem().getAknTag().value())
                && tableOfContentItemVOToCheck.getId().equals(targetTocItemVO.getId()) && position.equals(TocItemPosition.BEFORE)) {
            checkDocumentRulesVO.setNotAllowedElementFound(true);
        }
        if (checkDocumentRulesVO.isFirstElementFound() && checkDocumentRulesVO.isNotAllowedElementFound() && sourceItem.getTocItem().getAknTag().value().equals(aknElementName)
                && tableOfContentItemVOToCheck.getId().equals(targetTocItemVO.getId()) && position.equals(TocItemPosition.BEFORE)) {
            checkDocumentRulesVO.setValidStructure(false);
            checkDocumentRulesVO.getMessageKey().add(rule.getErrorMessage());
            return;
        }
        if (tableOfContentItemVOToCheck.getId().equals(targetTocItemVO.getId()) && position.equals(TocItemPosition.BEFORE)) {
            for (TableOfContentItemVO tableOfContentItemVO: sourceItem.getChildItems()) {
                this.checkLevelStructureInItem(rule, tableOfContentItemVO, checkDocumentRulesVO, sourceItem, targetTocItemVO, position);
            }
        }

        if (!checkDocumentRulesVO.isFirstElementFound() && tableOfContentItemVOToCheck.getTocItem().getAknTag().value().equals(aknElementName)) {
            checkDocumentRulesVO.setFirstElementFound(true);
        }
        if (checkDocumentRulesVO.isFirstElementFound() && !exceptionElementsList.contains(tableOfContentItemVOToCheck.getTocItem().getAknTag().value())) {
            checkDocumentRulesVO.setNotAllowedElementFound(true);
        }
        if (checkDocumentRulesVO.isFirstElementFound() && checkDocumentRulesVO.isNotAllowedElementFound()
                && tableOfContentItemVOToCheck.getTocItem().getAknTag().value().equals(aknElementName)) {
            checkDocumentRulesVO.setValidStructure(false);
            checkDocumentRulesVO.getMessageKey().add(rule.getErrorMessage());
            return;
        }

        for (TableOfContentItemVO tableOfContentItemVO: tableOfContentItemVOToCheck.getChildItems()) {
            this.checkLevelStructureInItem(rule, tableOfContentItemVO, checkDocumentRulesVO, sourceItem, targetTocItemVO, position);
        }

        boolean isAfter = position.equals(TocItemPosition.AFTER) || position.equals(TocItemPosition.AS_CHILDREN);
        if (!checkDocumentRulesVO.isFirstElementFound() && sourceItem.getTocItem().getAknTag().value().equals(aknElementName)
                && tableOfContentItemVOToCheck.getId().equals(targetTocItemVO.getId())
                && isAfter) {
            checkDocumentRulesVO.setFirstElementFound(true);
        }
        if (checkDocumentRulesVO.isFirstElementFound() && !exceptionElementsList.contains(sourceItem.getTocItem().getAknTag().value())
                && tableOfContentItemVOToCheck.getId().equals(targetTocItemVO.getId())
                && isAfter) {
            checkDocumentRulesVO.setNotAllowedElementFound(true);
        }
        if (checkDocumentRulesVO.isFirstElementFound() && checkDocumentRulesVO.isNotAllowedElementFound() && sourceItem.getTocItem().getAknTag().value().equals(aknElementName)
                && tableOfContentItemVOToCheck.getId().equals(targetTocItemVO.getId())
                && isAfter) {
            checkDocumentRulesVO.setValidStructure(false);
            checkDocumentRulesVO.getMessageKey().add(rule.getErrorMessage());
            return;
        }
        if (tableOfContentItemVOToCheck.getId().equals(targetTocItemVO.getId()) && position.equals(TocItemPosition.AFTER)) {
            for (TableOfContentItemVO tableOfContentItemVO: sourceItem.getChildItems()) {
                this.checkLevelStructureInItem(rule, tableOfContentItemVO, checkDocumentRulesVO, sourceItem, targetTocItemVO, position);
            }
        }
    }

    private static TableOfContentItemVO getTableOfContentItemVO(String nodeId, String nodeName, List<TocItem> tocItems,
            List<NumberingConfig> numberingConfigs, Document document, String language) {
        TableOfContentItemVO tableOfContentItemVO = null;
        if (nodeId != null) {
            Node node = getElementById(document, nodeId);
            if (node != null) {
                tableOfContentItemVO = buildTableOfContentsItemVO(numberingConfigs, tocItems, node, language);
            } else {
                TocItem draggedTocItem = StructureConfigUtils.getTocItemByName(tocItems, nodeName);
                tableOfContentItemVO = new TableOfContentItemVO(draggedTocItem, nodeId, null, null, null, null,
                        null, null);
            }
        }
        return tableOfContentItemVO;
    }

    private boolean isItemDroppedOnSameTarget(final TocDropResult result, final TableOfContentItemVO sourceItem,
                                              final TableOfContentItemVO targetItem) {
        if (sourceItem.equals(targetItem)) {
            result.setSuccess(false);
            result.setMessageKey("toc.edit.window.drop.error.same.item.message");
            result.setSourceItem(sourceItem);
            result.setTargetItem(targetItem);
            return true;
        }
        return false;
    }

    protected boolean validateAddingItemAsChildOrSibling(final TocDropResult result, final TableOfContentItemVO sourceItem,
            final TableOfContentItemVO targetItem,
            final Map<TocItem, List<TocItem>> tableOfContentRules,
            final TableOfContentItemVO parentItem, final TocItemPosition position, String language) {

        TocItem targetTocItem = targetItem.getTocItem();
        List<TocItem> targetTocItems = tableOfContentRules.get(targetTocItem);
        boolean isTocItemSibling;
        if (isSourceDivision(sourceItem) || isCrossheading(sourceItem) || isDroppedOnPointOrIndent(sourceItem, targetItem) || getTagValueFromTocItemVo(sourceItem).
                equals(getTagValueFromTocItemVo(targetItem))) {
            isTocItemSibling = true;
        } else if (CollectionUtils.isNotEmpty(targetTocItems) && targetTocItems.contains(sourceItem.getTocItem())) {
            //If target item type is root, source item will be added as child, else validate dropping item at dragged location
            if (targetTocItem.isRoot()) {
                return true;
            }
            isTocItemSibling = false;
        } else {
            // If child elements not allowed in target validate adding it to its parent
            isTocItemSibling = true;
        }
        TableOfContentItemVO actualTargetItem = getActualTargetItem(sourceItem, targetItem, parentItem, position, isTocItemSibling);
        return validateAddingToActualTargetItem(result, sourceItem, targetItem, tableOfContentRules, actualTargetItem, position, language);
    }

    protected TableOfContentItemVO getActualTargetItem(final TableOfContentItemVO sourceItem, final TableOfContentItemVO targetItem, final TableOfContentItemVO parentItem,
                                                       final TocItemPosition position, boolean isTocItemSibling) {
        switch (position) {
            case AS_CHILDREN:
                if ((isTocItemSibling && parentItem != null && !targetItem.getTocItem().isSameParentAsChild() && !isCrossheading(sourceItem)
                        || (targetItem.getTocItem().isSameParentAsChild() && targetItem.containsItem(LIST)))
                        || (targetItem.getId().equals(SOFT_MOVE_PLACEHOLDER_ID_PREFIX + sourceItem.getId()))
                        || (getTagValueFromTocItemVo(targetItem).equalsIgnoreCase(SUBPARAGRAPH) && isCrossheading(sourceItem))) {
                    return parentItem;
                } else if (!sourceItem.equals(targetItem)) {
                    return targetItem;
                }
                break;
            case BEFORE:
                return parentItem != null ? parentItem : targetItem;
            case AFTER:
                return isTocItemSibling ? parentItem : targetItem;
        }
        return null;
    }

    protected boolean isCrossheading(TableOfContentItemVO sourceItem) {
        String sourceTagValue = getTagValueFromTocItemVo(sourceItem);
        return sourceTagValue.equalsIgnoreCase(CROSSHEADING);
    }

    private boolean isDroppedOnPointOrIndent(TableOfContentItemVO sourceItem, TableOfContentItemVO targetItem) {
        String sourceTagValue = getTagValueFromTocItemVo(sourceItem);
        String targetTagValue = getTagValueFromTocItemVo(targetItem);
        return (sourceTagValue.equalsIgnoreCase(CROSSHEADING) || sourceTagValue.equals(POINT) || sourceTagValue.equals(INDENT)) && (targetTagValue.equals(POINT) || targetTagValue.equals(INDENT));
    }

    private boolean isSourceDivision(TableOfContentItemVO sourceItem) {
        String sourceTagValue = getTagValueFromTocItemVo(sourceItem);
        return sourceTagValue.equals(DIVISION);
    }

    protected boolean validateAddingToActualTargetItem(final TocDropResult result, final TableOfContentItemVO sourceItem, final TableOfContentItemVO targetItem,
            final Map<TocItem, List<TocItem>> tableOfContentRules, final TableOfContentItemVO actualTargetItem,
            final TocItemPosition position, String language) {

        TocItem parentTocItem = actualTargetItem != null ? actualTargetItem.getTocItem() : null;
        List<TocItem> parentTocItems = tableOfContentRules.get(parentTocItem);
        boolean parentAndSourceTypeCompatible = validateParentAndSourceTypeCompatibility(result, sourceItem, actualTargetItem, parentTocItem, parentTocItems);
        boolean validAddingToItem = validateAddingToItem(result, sourceItem, targetItem, actualTargetItem, position, language);
        boolean maxDepthNotReached = validateMaxDepth(result, sourceItem, targetItem);
        return parentAndSourceTypeCompatible && validAddingToItem && maxDepthNotReached;
    }

    protected abstract boolean validateAddingToItem(final TocDropResult result, final TableOfContentItemVO sourceItem, final TableOfContentItemVO targetItem,
            final TableOfContentItemVO actualTargetItem, final TocItemPosition position, String language);


    private boolean validateParentAndSourceTypeCompatibility(final TocDropResult result, final TableOfContentItemVO sourceItem, final TableOfContentItemVO parentItem,
                                                             final TocItem parentTocItem, final List<TocItem> parentTocItems) {

        if (CollectionUtils.isEmpty(parentTocItems) || !parentTocItems.stream().anyMatch(tocItem -> tocItem.getAknTag().equals(sourceItem.getTocItem().getAknTag()))
                || (!sourceItem.getTocItem().isSameParentAsChild() && parentTocItem.getAknTag().value().equals(sourceItem.getTocItem().getAknTag().value()))) {
            result.setSuccess(false);
            result.setMessageKey("toc.edit.window.drop.error.message");
            result.setSourceItem(sourceItem);
            result.setTargetItem(parentItem);
            return false;
        }
        return true;
    }

    protected boolean validateMaxDepth(final TocDropResult result, final TableOfContentItemVO sourceItem, final TableOfContentItemVO targetItem) {
        if (targetItem.getTocItem().getMaxDepth() != null) {
            int maxDepthRule = Integer.valueOf(targetItem.getTocItem().getMaxDepth());
            if (maxDepthRule > 0 && targetItem.getItemDepth() >= maxDepthRule) {
                result.setSuccess(false);
                result.setMessageKey("toc.edit.window.drop.error.same.item.message");
                result.setSourceItem(sourceItem);
                result.setTargetItem(targetItem);
                return false;
            }
        }
        return true;
    }

    private void setStructureContext(String docTemplate) {
        structureContextProvider.get().useDocumentTemplate(docTemplate);
    }

}
