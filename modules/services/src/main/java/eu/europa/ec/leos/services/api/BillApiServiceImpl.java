package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.cmis.Content;
import eu.europa.ec.leos.domain.cmis.LeosPackage;
import eu.europa.ec.leos.domain.cmis.document.Bill;
import eu.europa.ec.leos.domain.cmis.document.Proposal;
import eu.europa.ec.leos.domain.cmis.document.XmlDocument;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.services.user.UserHelperAPI;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static eu.europa.ec.leos.util.LeosDomainUtil.CMIS_PROPERTY_SPLITTER;

@Service
public class BillApiServiceImpl implements BillApiService{

    @Autowired
    BillService billService;
    @Autowired
    DocumentContentService documentContentService;
    @Autowired
    PackageService packageService;
    @Autowired
    ProposalService proposalService;
    @Autowired
    SecurityContext securityContext;

    private Provider<StructureContext> structureContext;
    @Autowired
    UserHelperAPI userHelper;
    private static final DateTimeFormatter dateFormatter =  DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(ZoneId.systemDefault());


    BillApiServiceImpl(Provider<StructureContext> structureContext) {
        this.structureContext = structureContext;
    }

    @Override
    public DocumentViewResponse getBillDocument(String documentRef) {
        Bill bill = this.billService.findBillByRef(documentRef);
        Proposal proposal = getProposalFromPackage(bill);
        String editableXml = getEditableXml(bill,proposal);
        VersionInfoVO versionInfoVO = getVersionInfo(bill);
        String baseRevisionId = bill.getBaseRevisionId();

        if(!StringUtils.isEmpty(baseRevisionId) && baseRevisionId.split(CMIS_PROPERTY_SPLITTER).length >= 3) {
            String versionLabel = baseRevisionId.split(CMIS_PROPERTY_SPLITTER)[1];
            String versionComment = baseRevisionId.split(CMIS_PROPERTY_SPLITTER)[2];
            versionInfoVO.setRevisedBaseVersion(versionLabel);
            versionInfoVO.setBaseVersionTitle(versionComment);
        }
        return new DocumentViewResponse(proposal.getOriginRef(),editableXml,versionInfoVO);
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef) {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.billService.getTableOfContent(bill, TocMode.SIMPLIFIED);
    }

    @Override
    public List<TocItem> getTocItems(String documentRef) {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.structureContext.get().getTocItems();
    }


    private byte[] getContent(Bill bill) {
        final Content content = bill.getContent().getOrError(() -> "Annex content is required!");
        return content.getSource().getBytes();
    }


    private void setStructureContext(String docTemplate) {
        this.structureContext.get().useDocumentTemplate(docTemplate);
    }

    private String getEditableXml(Bill document, Proposal proposal) {
        byte[] coverPageContent = new byte[0];
        byte[] documentContent = document.getContent().get().getSource().getBytes();
        boolean isCoverPageExists = documentContentService.isCoverPageExists(documentContent);
        if (!isCoverPageExists) {
            byte[] xmlContent = proposal.getContent().get().getSource().getBytes();
            coverPageContent = documentContentService.getCoverPageContent(xmlContent);
        }
        String editableXml = documentContentService.toEditableContent(document,
                "", securityContext, coverPageContent);
        return StringEscapeUtils.unescapeXml(editableXml);
    }

    private Proposal getProposalFromPackage(Bill bill) {
        Proposal proposal = null;
        if (bill != null) {
            LeosPackage leosPackage = packageService.findPackageByDocumentId(bill.getId());
            proposal = proposalService.findProposalByPackagePath(leosPackage.getPath());
        }
        return proposal;
    }

    private VersionInfoVO getVersionInfo(XmlDocument document) {
        String userId = document.getLastModifiedBy();
        User user = userHelper.getUser(userId);

        return new VersionInfoVO(
                document.getVersionLabel(),
                user.getName(), user.getDefaultEntity() != null ? user.getDefaultEntity().getOrganizationName() : "",
                dateFormatter.format(document.getLastModificationInstant()),
                document.getVersionType());
    }

}
