package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.domain.common.ErrorCode;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosCategoryClass;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.support.url.CollectionIdsAndUrlsHolder;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.services.utils.LegUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

import static eu.europa.ec.leos.services.support.XmlHelper.BILL;
import static eu.europa.ec.leos.services.support.XmlHelper.DOC;
import static eu.europa.ec.leos.services.support.XmlHelper.EC;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ORIGIN_ATTR;

@Service
@Instance(instances = {InstanceType.COMMISSION, InstanceType.OS})
public class PostProcessingProposalServiceImpl extends PostProcessingDocumentService {
    private static final Logger LOG = LoggerFactory.getLogger(PostProcessingProposalServiceImpl.class);

    private ProposalService proposalService;
    private BillService billService;
    private AnnexService annexService;
    private MemorandumService memorandumService;
    private FinancialStatementService financialStatementService;
    private DocumentContentService documentContentService;
    private UserService userService;
    private SecurityContext securityContext;
    private MessageHelper messageHelper;
    private RepositoryPropertiesMapper repositoryPropertiesMapper;

    @Value("${leos.cmis.repository.sysadmin}")
    private String repositorySysadmin;

    @Autowired
    PostProcessingProposalServiceImpl(XmlContentProcessor xmlContentProcessor, ProposalService proposalService,
            BillService billService, AnnexService annexService, MemorandumService memorandumService,
            FinancialStatementService financialStatementService, DocumentContentService documentContentService,
            UserService userService, XPathCatalog xPathCatalog,
            SecurityContext securityContext, MessageHelper messageHelper, RepositoryPropertiesMapper repositoryPropertiesMapper) {
        super(xmlContentProcessor, xPathCatalog);
        this.proposalService = proposalService;
        this.billService = billService;
        this.annexService = annexService;
        this.memorandumService = memorandumService;
        this.financialStatementService = financialStatementService;
        this.documentContentService = documentContentService;
        this.userService = userService;
        this.securityContext = securityContext;
        this.messageHelper = messageHelper;
        this.repositoryPropertiesMapper = repositoryPropertiesMapper;
    }

    @Override
    public Result<?> processDocument(DocumentVO documentVO) {
        if (documentVO.getCategory().equals(LeosCategory.PROPOSAL)) {
            if(documentVO.getSource() != null) {
                byte[] updatedDocContent = preserveDocumentReference(documentVO.getSource());
                documentVO.setSource(updatedDocContent);
                for (DocumentVO doc : documentVO.getChildDocuments()) {
                    try {
                        if (!doc.getCategory().equals(LeosCategory.PROPOSAL)) {
                            byte[] docContent = doc.getSource();
                            if (doc.getCategory().equals(LeosCategory.BILL)) {
                                updatedDocContent = preserveDocumentReference(docContent);
                                doc.setSource(updatedDocContent);

                                for (DocumentVO annex : doc.getChildDocuments()) {
                                    byte[] annexContent = annex.getSource();
                                    byte[] updatedDocContentAnnex = preserveDocumentReference(annexContent);
                                    annex.setSource(updatedDocContentAnnex);
                                }
                            } else {
                                updatedDocContent = preserveDocumentReference(docContent);
                                doc.setSource(updatedDocContent);
                            }
                        }
                    } catch (Exception e) {
                        return new Result<>(e.getMessage(), ErrorCode.EXCEPTION);
                    }
                }
            } else {
                return new Result<>(messageHelper.getMessage("wizard.document.upload.error.document.proposal.not.found"), ErrorCode.EXCEPTION);
            }
        }
        return new Result<>("OK", null);
    }

    @Override
    public Result<?> saveOriginalProposalIdToClonedProposal(DocumentVO documentVO, String legFileName, String iscRef) {
        if (documentVO.getCategory().equals(LeosCategory.PROPOSAL)) {
            documentVO.getSource();

            for (DocumentVO doc : documentVO.getChildDocuments()) {
                byte[] updatedDocContent;
                try {
                    if (!doc.getCategory().equals(LeosCategory.PROPOSAL)) {
                        if (doc.getCategory().equals(LeosCategory.BILL)) {
                            updatedDocContent = xmlContentProcessor.setAttributeForAllChildren(doc.getSource(), BILL, Collections.emptyList(), LEOS_ORIGIN_ATTR, EC);
                            updatedDocContent = xmlContentProcessor.updateInitialNumberForArticles(updatedDocContent);
                            doc.setSource(updatedDocContent);

                            for (DocumentVO annex : doc.getChildDocuments()) {
                                byte[] updatedDocContentAnnex = annex.getSource();
                                updatedDocContentAnnex = xmlContentProcessor.setAttributeForAllChildren(updatedDocContentAnnex, DOC, Collections.emptyList(), LEOS_ORIGIN_ATTR, EC);
                                annex.setSource(updatedDocContentAnnex);
                            }
                        } else {
                            updatedDocContent = xmlContentProcessor.setAttributeForAllChildren(doc.getSource(), DOC, Collections.emptyList(), LEOS_ORIGIN_ATTR, EC);
                            doc.setSource(updatedDocContent);
                        }
                    }
                } catch (Exception e) {
                    LOG.error("Error occurred while saving metadata to cloned proposal", e);
                    return new Result<>(e.getMessage(), ErrorCode.EXCEPTION);
                }
            }
        }
        return new Result<>("OK", null);
    }

    @Override
    public Result<?> saveClonedProposalIdToOriginalProposal(DocumentVO documentVO, CollectionIdsAndUrlsHolder
            idsAndUrlsHolder, CloneProposalMetadataVO cloneProposalMetadataVO) {
        if (documentVO.getCategory().equals(LeosCategory.PROPOSAL)) {
            User loggedUser = securityContext.getUser();
            Collection<? extends GrantedAuthority> loggedInUserAuthorities = SecurityContextHolder.getContext().
                    getAuthentication().getAuthorities();
            try {
                //Switch user to sysadmin
                userService.switchUser(repositorySysadmin);
                Proposal originalProposal = proposalService.findProposal(documentVO.getId());
                byte[] xmlContent = originalProposal.getContent().getOrThrow(() ->
                        new IllegalArgumentException("Proposal not found")).getSource().getBytes();
                String docVersion = LegUtils.fetchMilestoneVersion(documentVO);
                //update original proposal with cloned metadata properties
                final String versionComment = messageHelper.getMessage("milestone.versionComment");
                // updating the version type to Major and also versionComment to fix issue #2987
                proposalService.updateProposal(originalProposal.getId(), xmlContent, VersionType.MAJOR, versionComment);
            } catch (Exception e) {
                LOG.error("Error occurred while saving cloned metadata to original proposal", e);
                return new Result<>(e.getMessage(), ErrorCode.EXCEPTION);
            } finally {
                //Switch back to logged-in user
                userService.switchUserWithAuthorities(loggedUser.getLogin(), loggedInUserAuthorities);
            }
        }
        return new Result<>("OK", null);
    }
}
