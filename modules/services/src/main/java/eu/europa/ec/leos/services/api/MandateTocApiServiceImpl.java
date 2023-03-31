package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.services.document.AnnexService;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.document.ExplanatoryService;
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocDropResult;
import eu.europa.ec.leos.vo.toc.TocItem;
import eu.europa.ec.leos.vo.toc.TocItemPosition;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.services.processor.content.TableOfContentProcessor.getTagValueFromTocItemVo;
import static eu.europa.ec.leos.services.support.XmlHelper.CROSSHEADING;
import static eu.europa.ec.leos.services.support.XmlHelper.DIVISION;
import static eu.europa.ec.leos.services.support.XmlHelper.INDENT;
import static eu.europa.ec.leos.services.support.XmlHelper.POINT;

@Service
@Instance(InstanceType.COUNCIL)
public class MandateTocApiServiceImpl extends TocApiServiceImpl {

    public MandateTocApiServiceImpl(Provider<StructureContext> structureContextProvider,
                                    BillService billService, AnnexService annexService, MessageHelper messageHelper, ExplanatoryService explanatoryService) {
        super(structureContextProvider, billService, annexService, messageHelper, explanatoryService);
    }

    @Override
    protected boolean validateAddingToItem(TocDropResult result, TableOfContentItemVO sourceItem, TableOfContentItemVO targetItem,
                                           TableOfContentItemVO actualTargetItem, TocItemPosition position) {
        return true;
    }
}
