package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.cmis.Content;
import eu.europa.ec.leos.domain.cmis.LeosPackage;
import eu.europa.ec.leos.domain.cmis.document.Memorandum;
import eu.europa.ec.leos.domain.cmis.document.Proposal;
import eu.europa.ec.leos.domain.cmis.document.XmlDocument;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.MemorandumService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.services.user.UserHelperAPI;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.apache.commons.lang3.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class MemorandumApiServiceImpl implements MemorandumApiService{

    @Autowired
    MemorandumService memorandumService;
    @Autowired
    CloneContext cloneContext;
    @Autowired
    DocumentContentService documentContentService;
    @Autowired
    PackageService packageService;
    @Autowired
    ProposalService proposalService;
    @Autowired
    SecurityContext securityContext;
    @Autowired
    UserHelperAPI userHelper;
    private static final DateTimeFormatter dateFormatter =  DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(ZoneId.systemDefault());

    private Provider<StructureContext> structureContext;

    MemorandumApiServiceImpl(Provider<StructureContext> structureContext) {
        this.structureContext = structureContext;
    }

    @Override
    public DocumentViewResponse getMemorandumDocument(String documentRef) {
        Memorandum memorandum = memorandumService.findMemorandumByRef(documentRef);
        Proposal proposal = this.getProposalFromPackage(memorandum);
        VersionInfoVO versionInfoVO = this.getVersionInfo(memorandum);
        String editableXml = getEditableXml(memorandum,proposal);
        return new DocumentViewResponse(proposal.getOriginRef(),editableXml,versionInfoVO);
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        this.setStructureContext(memorandum.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return  this.memorandumService.getTableOfContent(memorandum, TocMode.SIMPLIFIED);
    }

    @Override
    public List<TocItem> getTocItems(String documentRef) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        this.setStructureContext(memorandum.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.structureContext.get().getTocItems();
    }

    private byte[] getContent(Memorandum memorandum) {
        final Content content = memorandum.getContent().getOrError(() -> "Annex content is required!");
        return content.getSource().getBytes();
    }


    private void setStructureContext(String docTemplate) {
        this.structureContext.get().useDocumentTemplate(docTemplate);
    }

    private String getEditableXml(Memorandum memorandum, Proposal proposal) {
        securityContext.getPermissions(memorandum);
        byte[] coverPageContent = new byte[0];
        byte[] memorandumContent = memorandum.getContent().get().getSource().getBytes();
        boolean isCoverPageExists = documentContentService.isCoverPageExists(memorandumContent);
        if(!isCoverPageExists) {
            byte[] xmlContent = proposal.getContent().get().getSource().getBytes();
            coverPageContent = documentContentService.getCoverPageContent(xmlContent);
        }
        String editableXml = documentContentService.toEditableContent(memorandum,
                "", securityContext, coverPageContent);
        return StringEscapeUtils.unescapeXml(editableXml);
    }
    private Proposal getProposalFromPackage(Memorandum memorandum) {
        Proposal proposal = null;
        if (memorandum != null) {
            LeosPackage leosPackage = packageService.findPackageByDocumentId(memorandum.getId());
            proposal = proposalService.findProposalByPackagePath(leosPackage.getPath());
        }
        return proposal;
    }

    private VersionInfoVO getVersionInfo(XmlDocument document){
        String userId = document.getLastModifiedBy();
        User user = userHelper.getUser(userId);

        return new VersionInfoVO(
                document.getVersionLabel(),
                user.getName(), user.getDefaultEntity() != null ? user.getDefaultEntity().getOrganizationName(): "",
                dateFormatter.format(document.getLastModificationInstant()),
                document.getVersionType());
    }
}
