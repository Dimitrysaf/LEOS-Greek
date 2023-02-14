package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.cmis.Content;
import eu.europa.ec.leos.domain.cmis.LeosCategory;
import eu.europa.ec.leos.domain.cmis.document.Proposal;
import eu.europa.ec.leos.domain.cmis.document.XmlDocument;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.support.XmlHelper;
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
public class CoverPageApiServiceImpl implements CoverPageApiService {

    @Autowired
    ProposalService proposalService;

    @Autowired
    DocumentContentService documentContentService;
    @Autowired
    SecurityContext securityContext;
    @Autowired
    UserHelperAPI userHelper;
    private static final DateTimeFormatter dateFormatter =  DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(ZoneId.systemDefault());


    private Provider<StructureContext> structureContext;

    CoverPageApiServiceImpl(Provider<StructureContext> structureContext) {
        this.structureContext = structureContext;
    }

    @Override
    public DocumentViewResponse getCoverPageDocument(String documentRef) {
        Proposal proposal = this.proposalService.getProposalByRef(documentRef);
        VersionInfoVO versionInfoVO = getVersionInfo(proposal);
        String editableXml = getEditableXml(proposal);
        return new DocumentViewResponse(proposal.getOriginRef(),editableXml,versionInfoVO);
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef) {
        Proposal proposal = this.proposalService.getProposalByRef(documentRef);
        this.setStructureContext(proposal.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.proposalService.getCoverPageTableOfContent(proposal, TocMode.SIMPLIFIED);
    }

    @Override
    public List<TocItem> getTocItems(String documentRef) {
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        this.setStructureContext(proposal.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.structureContext.get().getTocItems();
    }

    private byte[] getContent(Proposal proposal) {
        final Content content = proposal.getContent().getOrError(() -> "Annex content is required!");
        return content.getSource().getBytes();
    }


    private void setStructureContext(String docTemplate) {
        this.structureContext.get().useDocumentTemplate(docTemplate);
    }

    private DocumentVO getCoverPageVO(DocumentVO proposalVO,String  proposalRef) {
        DocumentVO coverPageVO = new DocumentVO(proposalVO.getId(),
                proposalVO.getMetadata().getLanguage() != null ? proposalVO.getMetadata().getLanguage() : "EN",
                LeosCategory.COVERPAGE,
                proposalVO.getUpdatedBy(),
                proposalVO.getUpdatedOn());
        coverPageVO.getMetadata().setInternalRef(proposalRef);
        coverPageVO.setSource(documentContentService.getCoverPageContent(proposalVO.getSource()));
        return coverPageVO;
    }

    private String getEditableXml(Proposal proposal) {
        securityContext.getPermissions(proposal);
        byte[] coverPageContent = new byte[0];
        byte[] proposalContent = proposal.getContent().get().getSource().getBytes();
        boolean isCoverPageExists = documentContentService.isCoverPageExists(proposalContent);
        if(isCoverPageExists) {
            byte[] xmlContent = proposal.getContent().get().getSource().getBytes();
            coverPageContent = documentContentService.getCoverPageContent(xmlContent);
        }
        String editableXml = documentContentService.toEditableContent(proposal, "", securityContext, coverPageContent);
        editableXml = XmlHelper.removeSelfClosingElements(editableXml);
        return StringEscapeUtils.unescapeXml(editableXml);
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
