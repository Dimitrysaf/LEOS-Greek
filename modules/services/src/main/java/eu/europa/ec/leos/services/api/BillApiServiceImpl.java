package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.cmis.Content;
import eu.europa.ec.leos.domain.cmis.document.Bill;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.List;

@Service
public class BillApiServiceImpl implements BillApiService{

    @Autowired
    BillService billService;

    private Provider<StructureContext> structureContext;


    BillApiServiceImpl(Provider<StructureContext> structureContext) {
        this.structureContext = structureContext;
    }

    @Override
    public byte[] getBillDocument(String documentRef) {
        return getContent(billService.findBillByRef(documentRef));
    }

    @Override
    public List<TableOfContentItemVO> getTocItems(String documentRef) {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.billService.getTableOfContent(bill, TocMode.SIMPLIFIED);
    }


    private byte[] getContent(Bill bill) {
        final Content content = bill.getContent().getOrError(() -> "Annex content is required!");
        return content.getSource().getBytes();
    }


    private void setStructureContext(String docTemplate) {
        this.structureContext.get().useDocumentTemplate(docTemplate);
    }
}
