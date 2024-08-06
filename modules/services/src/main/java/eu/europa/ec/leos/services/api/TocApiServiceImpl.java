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
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.services.utils.StructureConfigUtils;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocDropResult;
import eu.europa.ec.leos.vo.structure.TocItem;
import eu.europa.ec.leos.vo.toc.TocItemPosition;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import javax.inject.Provider;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.services.processor.content.TableOfContentProcessor.getTagValueFromTocItemVo;
import static eu.europa.ec.leos.services.processor.content.XmlContentProcessorHelper.buildTableOfContentsItemVO;
import static eu.europa.ec.leos.services.support.XercesUtils.createXercesDocument;
import static eu.europa.ec.leos.services.support.XercesUtils.getElementById;
import static eu.europa.ec.leos.services.support.XmlHelper.CROSSHEADING;
import static eu.europa.ec.leos.services.support.XmlHelper.DIVISION;
import static eu.europa.ec.leos.services.support.XmlHelper.INDENT;
import static eu.europa.ec.leos.services.support.XmlHelper.LEVEL;
import static eu.europa.ec.leos.services.support.XmlHelper.LIST;
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

    @Autowired
    protected TocApiServiceImpl(Provider<StructureContext> structureContextProvider, BillService billService, AnnexService annexService,
                             MessageHelper messageHelper, ExplanatoryService explanatoryService, DocumentLanguageContext documentLanguageContext) {
        this.structureContextProvider = structureContextProvider;
        this.billService = billService;
        this.annexService = annexService;
        this.messageHelper = messageHelper;
        this.explanatoryService = explanatoryService;
        this.documentLanguageContext = documentLanguageContext;
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
        TocDropResult result = validateDrop(request, xmlContent);

        final String srcItemType = TableOfContentHelper.getDisplayableTocItem(result.getSourceItem().getTocItem(), language, messageHelper);
        if (result.getTargetItem() != null) {
            final String targetItemType = TableOfContentHelper.getDisplayableTocItem(result.getTargetItem().getTocItem(), language, messageHelper);
            result.setMessageKey(messageHelper.getMessage(result.getMessageKey(), srcItemType, targetItemType));
        } else {
            result.setMessageKey(messageHelper.getMessage("toc.edit.window.drop.error.root.message", srcItemType));
        }
        return new NodeValidationResponse(result);
    }

    private TocDropResult validateDrop(NodeDropValidationRequest request, byte[] xmlContent) {
        Map<TocItem, List<TocItem>> tableOfContentRules = structureContextProvider.get().getTocRules();
        Map<String, List<TocItem>> tableOfContentDocumentRules = structureContextProvider.get().getDocumentRules();
        List<TocItem> tocItems = structureContextProvider.get().getTocItems();
        List<NumberingConfig> numberingConfigs = structureContextProvider.get().getNumberingConfigs();

        Document document = createXercesDocument(xmlContent);
        String language = documentLanguageContext.getDocumentLanguage();

        TableOfContentItemVO draggedTocItemVO = getTableOfContentItemVO(request.getDraggedNodeId().get(0),
                request.getDraggedNodeTagName(), tocItems, numberingConfigs, document, language);
        TableOfContentItemVO targetTocItemVO = getTableOfContentItemVO(request.getTargetNodeId(),
                request.getTargetNodeTagName(), tocItems, numberingConfigs, document, language);
        TableOfContentItemVO parentTocItemVO = getTableOfContentItemVO(request.getParentNodeId(),
                request.getParentNodeTagName(), tocItems, numberingConfigs, document, language);

        TocDropResult result = new TocDropResult(true, "toc.edit.window.drop.success.message",
                draggedTocItemVO, targetTocItemVO);

        if (draggedTocItemVO != null && !isItemDroppedOnSameTarget(result, draggedTocItemVO, targetTocItemVO)) {
            validateAddingItemAsChildOrSibling(result, draggedTocItemVO, targetTocItemVO, tableOfContentRules,
                    parentTocItemVO, request.getPosition(), language);
        }
        if (tableOfContentDocumentRules != null && !tableOfContentDocumentRules.isEmpty()) {
            validateLevelStructure(result, tableOfContentDocumentRules, draggedTocItemVO, targetTocItemVO, xmlContent, request.getPosition());
        }

        return result;
    }

    private boolean validateLevelStructure(final TocDropResult result, final Map<String, List<TocItem>> tableOfContentDocumentRules,
            final TableOfContentItemVO sourceItem, final TableOfContentItemVO targetTocItemVO, final byte[] xmlContent, final TocItemPosition position) {
        // Only elements in exception list are accepted in between levels
        List<TocItem> exceptionRules = tableOfContentDocumentRules.get(LEVEL + "-exception");
        String stringContent = new String(xmlContent);
        int positionOfTargetItem = stringContent.indexOf(targetTocItemVO.getId());
        if (position.equals(TocItemPosition.BEFORE)) {
            positionOfTargetItem = stringContent.lastIndexOf("<" + targetTocItemVO.getTocItem().getAknTag().value(), positionOfTargetItem);
            positionOfTargetItem--;
        }
        int positionOfPreviousLevel = stringContent.lastIndexOf("<" + LEVEL, positionOfTargetItem);
        int positionOfNextLevel = stringContent.indexOf("<" + LEVEL, positionOfTargetItem);
        if (exceptionRules != null && !sourceItem.getTocItem().getAknTag().value().equals(LEVEL)) {
            boolean isException = false;
            for (TocItem rule: exceptionRules) {
                if (rule.getAknTag().value().equals(sourceItem.getTocItem().getAknTag().value())) {
                    isException = true;
                }
            }
            if (!isException) {
                if (positionOfPreviousLevel != -1 && positionOfNextLevel != -1) {
                    result.setSuccess(false);
                    result.setMessageKey("toc.paragraph.position.not.allowed.error.message");
                    return false;
                }
            }
        }
        // Should block when adding new levels and this would create a not allowed structure
        List<TocItem> notAlloweRules = tableOfContentDocumentRules.get(LEVEL + "-not-allowed");
        if (notAlloweRules != null && sourceItem.getTocItem().getAknTag().value().equals(LEVEL)) {
            String previousPieceToCheck = positionOfPreviousLevel != -1 ? stringContent.substring(positionOfPreviousLevel, positionOfTargetItem+1) : "";
            String nextPieceToCheck = positionOfNextLevel != -1 ? stringContent.substring(positionOfTargetItem, positionOfNextLevel+1) : "";
            for (TocItem rule: notAlloweRules) {
                if (previousPieceToCheck.contains("<" + rule.getAknTag().value()) || nextPieceToCheck.contains("<" + rule.getAknTag().value())) {
                    result.setSuccess(false);
                    result.setMessageKey("toc.level.position.not.allowed.error.message");
                    return false;
                }
            }
        }
        return true;
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
        if (isSourceDivision(sourceItem) || isCrossheading(sourceItem) || isDroppedOnPointOrIndent(sourceItem, targetItem) || getTagValueFromTocItemVo(sourceItem).
                equals(getTagValueFromTocItemVo(targetItem))) {
            TableOfContentItemVO actualTargetItem = getActualTargetItem(sourceItem, targetItem, parentItem, position, true);
            return validateAddingToActualTargetItem(result, sourceItem, targetItem, tableOfContentRules, actualTargetItem, position, language);
        } else if (CollectionUtils.isNotEmpty(targetTocItems) && targetTocItems.contains(sourceItem.getTocItem())) {
            //If target item type is root, source item will be added as child, else validate dropping item at dragged location
            TableOfContentItemVO actualTargetItem = getActualTargetItem(sourceItem, targetItem, parentItem, position, false);
            return targetTocItem.isRoot() || validateAddingToActualTargetItem(result, sourceItem, targetItem, tableOfContentRules, actualTargetItem, position, language);
        } else { // If child elements not allowed in target validate adding it to its parent
            return validateAddingItemAsSibling(result, sourceItem, targetItem, tableOfContentRules, parentItem, position, language);
        }
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

    protected boolean validateAddingItemAsSibling(final TocDropResult result, final TableOfContentItemVO sourceItem,
            final TableOfContentItemVO targetItem, final Map<TocItem, List<TocItem>> tableOfContentRules, final TableOfContentItemVO parentItem,
            final TocItemPosition position, String language) {
        TableOfContentItemVO actualTargetItem = getActualTargetItem(sourceItem, targetItem, parentItem, position, true);
        return validateAddingToActualTargetItem(result, sourceItem, targetItem, tableOfContentRules, actualTargetItem, position, language);
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
