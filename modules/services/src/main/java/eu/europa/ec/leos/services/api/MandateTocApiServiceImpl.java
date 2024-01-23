package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.model.action.SoftActionType;
import eu.europa.ec.leos.services.document.AnnexService;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.document.ExplanatoryService;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.vo.structure.NumberingType;
import eu.europa.ec.leos.vo.structure.OptionsType;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocDropResult;
import eu.europa.ec.leos.vo.toc.TocItemPosition;
import org.apache.commons.lang3.Validate;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.Arrays;
import java.util.List;
import java.util.stream.IntStream;

import static eu.europa.ec.leos.model.action.SoftActionType.DELETE;
import static eu.europa.ec.leos.model.action.SoftActionType.MOVE_TO;
import static eu.europa.ec.leos.services.processor.content.TableOfContentHelper.hasTocItemSoftAction;
import static eu.europa.ec.leos.services.processor.content.TableOfContentProcessor.getTagValueFromTocItemVo;
import static eu.europa.ec.leos.services.support.XmlHelper.CONCLUSIONS;
import static eu.europa.ec.leos.services.support.XmlHelper.INDENT;
import static eu.europa.ec.leos.services.support.XmlHelper.LEVEL;
import static eu.europa.ec.leos.services.support.XmlHelper.LIST;
import static eu.europa.ec.leos.services.support.XmlHelper.PARAGRAPH;
import static eu.europa.ec.leos.services.support.XmlHelper.POINT;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_MOVE_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.SUBPARAGRAPH;
import static eu.europa.ec.leos.vo.structure.NumberingType.BULLET_NUM;

@Service
@Instance(InstanceType.COUNCIL)
public class MandateTocApiServiceImpl extends TocApiServiceImpl {

    private static final int MAX_INDENT_LEVEL = 4;

    public MandateTocApiServiceImpl(Provider<StructureContext> structureContextProvider,
                                    BillService billService, AnnexService annexService, MessageHelper messageHelper, ExplanatoryService explanatoryService) {
        super(structureContextProvider, billService, annexService, messageHelper, explanatoryService);
    }

    @Override
    protected boolean validateAddingToItem(TocDropResult result, TableOfContentItemVO sourceItem, TableOfContentItemVO targetItem,
                                           TableOfContentItemVO actualTargetItem, TocItemPosition position) {
        Validate.notNull(targetItem, "Target item should not be null");
        if (actualTargetItem == null) {
            actualTargetItem = targetItem;
        }
        String droppedElementTagName = sourceItem.getTocItem().getAknTag().value();
        NumberingType droppedElementTagNumberingType = sourceItem.getTocItem().getNumberingType();

        String targetName = actualTargetItem.getTocItem().getAknTag().value();
        result.setSourceItem(sourceItem);
        result.setTargetItem(actualTargetItem);
        boolean indentAllowed;

        switch (droppedElementTagName) {
            case SUBPARAGRAPH:
                if (!isNumbered(actualTargetItem)) {
                    result.setSuccess(false);
                    result.setMessageKey("toc.edit.window.drop.error.subparagraph.unnumbered.message");
                    return false;
                }
                break;
            case POINT:
            case INDENT:
                indentAllowed = isIndentAllowed(actualTargetItem, MAX_INDENT_LEVEL - getIndentLevel(sourceItem));
                if (!indentAllowed
                        || !Arrays.asList(PARAGRAPH, LEVEL, LIST, POINT, INDENT).contains(targetName)
                        || (Arrays.asList(PARAGRAPH, LEVEL).contains(targetName)
                        && actualTargetItem.containsItem(droppedElementTagName)
                        && !droppedElementTagName.equals(POINT))
                        && !Arrays.asList(NumberingType.INDENT, BULLET_NUM).contains(droppedElementTagNumberingType)
                        || (Arrays.asList(PARAGRAPH, LEVEL).contains(targetName) && !TocItemPosition.AS_CHILDREN.equals(position)
                        && (actualTargetItem.containsItem(LIST) || !actualTargetItem.containsOnlySameIndentType(droppedElementTagNumberingType)))
                        || (targetName.equals(droppedElementTagName) && actualTargetItem.containsItem(LIST))
                        || !validateAgainstOtherIndentsInList(sourceItem, targetItem)) {
                    result.setSuccess(false);
                    if (!indentAllowed) {
                        result.setMessageKey("toc.edit.window.drop.error.indentation.message");
                    } else if (actualTargetItem.containsItem(LIST)) {
                        result.setMessageKey("toc.edit.window.drop.already.contains.list.error.message");
                    } else {
                        result.setMessageKey("toc.edit.window.drop.error.message");
                    }
                    return false;
                }
                break;
            case LIST:
                indentAllowed = isIndentAllowed(actualTargetItem, MAX_INDENT_LEVEL - getIndentLevel(sourceItem));
                if (!isPlaceholderForDroppedItem(targetItem, sourceItem) && (
                        !indentAllowed || (
                                (targetName.equals(PARAGRAPH) || targetName.equals(LEVEL)) && actualTargetItem.containsItem(LIST)
                        ) ||
                                ((targetName.equals(POINT) || targetName.equals(INDENT)) && actualTargetItem.containsItem(LIST)))) {
                    result.setSuccess(false);
                    result.setMessageKey(!indentAllowed ? "toc.edit.window.drop.error.indentation.message" : "toc.edit.window.drop.error.list.message");
                    return false;
                }
                break;
            default: // No item can be dropped after CONCLUSIONS item
                if (actualTargetItem.containsItem(CONCLUSIONS) && isDroppedAfterConclusion(targetItem, position)) {
                    result.setSuccess(false);
                    result.setMessageKey("toc.edit.window.drop.error.conclusion.message");
                    return false;
                }
                break;
        }
        return true;
    }

    private boolean isNumbered(TableOfContentItemVO element) {
        boolean isNumbered = true;
        if (OptionsType.NONE.equals(element.getTocItem().getItemNumber())) {
            isNumbered = false;
        } else if (OptionsType.OPTIONAL.equals(element.getTocItem().getItemNumber())
                && ((element.getNumber() == null || element.getNumber().isEmpty()) || isNumSoftDeleted(element.getNumSoftActionAttr()))) {
            isNumbered = false;
        }
        return isNumbered;
    }

    private boolean isNumSoftDeleted(final SoftActionType numsoftActionAttr) {
        return DELETE.equals(numsoftActionAttr);
    }

    private boolean isIndentAllowed(TableOfContentItemVO targetElement, int indentLevel) {
        boolean isAllowed = true;
        if (indentLevel < 0) {
            isAllowed = false;
        } else if (targetElement != null) {
            String tagValue = getTagValueFromTocItemVo(targetElement);
            isAllowed = isIndentAllowed(targetElement.getParentItem(),
                    tagValue.equals(POINT) || tagValue.equals(INDENT) ? indentLevel - 1 : indentLevel);
        }
        return isAllowed;
    }

    private int getIndentLevel(TableOfContentItemVO element) {
        int identLevel = 0;
        for (TableOfContentItemVO child : element.getChildItems()) {
            identLevel = Math.max(identLevel, getIndentLevel(child));
        }
        String tagValue = getTagValueFromTocItemVo(element);
        return (tagValue.equals(POINT) || tagValue.equals(INDENT)) ? identLevel + 1 : identLevel;
    }

    private boolean validateAgainstOtherIndentsInList(TableOfContentItemVO sourceItem, TableOfContentItemVO targetItem) {
        if (!getTagValueFromTocItemVo(targetItem).equals(INDENT)
                && !getTagValueFromTocItemVo(targetItem).equals(POINT)
                && targetItem != null && !targetItem.getChildItems().isEmpty()) {
            for (TableOfContentItemVO child : targetItem.getChildItems()) {
                if (!validateAgainstOtherIndent(sourceItem, child)) {
                    return false;
                }
            }
        } else if (getTagValueFromTocItemVo(targetItem).equals(POINT)
                || getTagValueFromTocItemVo(targetItem).equals(INDENT)) {
            return validateAgainstOtherIndent(sourceItem, targetItem);
        } else if (getTagValueFromTocItemVo(targetItem).equals(LIST) && targetItem.getChildItems().isEmpty()) {
            return validateAgainstOtherIndentsInList(sourceItem, targetItem.getParentItem());
        } else if (targetItem == null) {
            return false;
        }
        return true;
    }

    private boolean validateAgainstOtherIndent(TableOfContentItemVO sourceItem, TableOfContentItemVO targetItem) {
        NumberingType targetNumberingType = targetItem.getTocItem().getNumberingType();
        NumberingType sourceNumberingType = sourceItem.getTocItem().getNumberingType();
        return targetNumberingType.equals(sourceNumberingType);
    }

    private Boolean isPlaceholderForDroppedItem(TableOfContentItemVO candidate, TableOfContentItemVO droppedItem) {
        if (candidate != null && hasTocItemSoftAction(candidate.getParentItem(), MOVE_TO)) {
            return false;
        }
        return candidate != null && candidate.getId().equals(SOFT_MOVE_PLACEHOLDER_ID_PREFIX + droppedItem.getId());
    }

    private boolean isDroppedAfterConclusion(TableOfContentItemVO targetItem, TocItemPosition position) {
        List<TableOfContentItemVO> siblingsOfTargetItem = targetItem.getParentItem().getChildItems();
        int targetItemIndex = siblingsOfTargetItem.indexOf(targetItem);
        int clauseItemIndex = IntStream.range(0, siblingsOfTargetItem.size())
                .filter(i -> siblingsOfTargetItem.get(i).getTocItem().getAknTag().value().equals(CONCLUSIONS))
                .findFirst().orElse(-1);
        return (targetItemIndex > clauseItemIndex) ||
                ((targetItemIndex == clauseItemIndex) && !position.equals(TocItemPosition.BEFORE));
    }
}
