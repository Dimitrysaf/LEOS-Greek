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
import eu.europa.ec.leos.vo.toc.TocItemPosition;
import org.springframework.stereotype.Service;

import javax.inject.Provider;

@Service
@Instance(instances = {InstanceType.COMMISSION, InstanceType.OS})
public class ProposalTocApiServiceImpl extends TocApiServiceImpl {

    public ProposalTocApiServiceImpl(Provider<StructureContext> structureContextProvider,
                                     BillService billService, AnnexService annexService, MessageHelper messageHelper, ExplanatoryService explanatoryService) {
        super(structureContextProvider, billService, annexService, messageHelper, explanatoryService);
    }

    @Override
    protected boolean validateAddingToItem(TocDropResult result, TableOfContentItemVO sourceItem, TableOfContentItemVO targetItem,
                                           TableOfContentItemVO actualTargetItem, TocItemPosition position) {
        return true;
    }
}
