package eu.europa.ec.leos.services.api;

import com.google.common.base.Stopwatch;
import eu.europa.ec.leos.domain.cmis.LeosCategoryClass;
import eu.europa.ec.leos.domain.cmis.LeosPackage;
import eu.europa.ec.leos.domain.cmis.document.Annex;
import eu.europa.ec.leos.domain.cmis.document.Bill;
import eu.europa.ec.leos.domain.cmis.document.LegDocument;
import eu.europa.ec.leos.domain.cmis.document.Memorandum;
import eu.europa.ec.leos.domain.cmis.document.Proposal;
import eu.europa.ec.leos.domain.cmis.document.XmlDocument;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.collection.CreateCollectionService;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.document.ContributionService;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class ContributionApiServiceImpl implements ContributionApiService {
    private static final Logger LOG = LoggerFactory.getLogger(ContributionApiServiceImpl.class);

    @Autowired
    CreateCollectionService createCollectionService;
    @Autowired
    CloneContext cloneContext;
    @Autowired
    ProposalService proposalService;
    @Autowired
    UserService userService;
    @Autowired
    PackageService packageService;
    @Autowired
    SecurityContext securityContext;
    @Autowired
    ContributionService contributionService;
    @Autowired
    LeosRepository leosRepository;
    @Autowired
    DocumentContentService documentContentService;
    @Autowired
    ComparisonDelegateAPI<XmlDocument> comparisonDelegateAPI;
    @Autowired
    BillService billService;
    @Value("${leos.clone.originRef}")
    private String cloneOriginRef;


    @Override
    public CreateCollectionResult createCloneProposal(String proposalRef, String userLogin, String legDocumentName) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        User user = userService.getUser(userLogin);
        Proposal proposal = proposalService.getProposalByRef(proposalRef);
        LeosPackage leosPackage = packageService.findPackageByDocumentId(proposal.getId());
        LegDocument legDocument = packageService.findDocumentByPackagePathAndName(leosPackage.getPath(), legDocumentName, LegDocument.class);
        String loggedInUser = securityContext.getUser().getLogin();
        CreateCollectionResult createCollectionResult = null;
        Collection<? extends GrantedAuthority> loggedInUserAuthorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
        try {
            File content = new File(legDocumentName);
            try (FileOutputStream fos = new FileOutputStream(content)) {
                fos.write(legDocument.getContent().get().getSource().getBytes());
            } catch (IOException ioe) {
                LOG.error("Error Occurred while reading the Leg file: " + ioe.getMessage(), ioe);
            }
            userService.switchUser(user.getLogin());
            createCollectionResult = createCollectionService.cloneCollection(content, cloneOriginRef, user.getLogin(),
                    user.getDefaultEntity().getName());
            if (createCollectionResult != null && createCollectionResult.getError() != null) {
                LOG.error("Error Occurred while cloning proposal from the Leg file: " + createCollectionResult.getError().getMessage());
            } else {
            }
            LOG.info("Proposal id '{}' name '{}' sent for revision to user '{}' in {} milliseconds ({} sec)", proposal.getId(), leosPackage.getName(), user.getLogin(), stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        } catch (Exception ex) {
            LOG.error("Error Occurred while cloning proposal from the Leg file: " + ex.getMessage(), ex);
        } finally {
            userService.switchUserWithAuthorities(loggedInUser, loggedInUserAuthorities);
        }
        return createCollectionResult;
    }

    @Override
    public Result<?> updateClonedProposalRevisionStatus(String proposalRef, String legFilename) {
        Proposal proposal = proposalService.getProposalByRef(proposalRef);
        this.populateCloneProposalMetadata(proposal);
        Result<?> result = createCollectionService.updateOriginalProposalAfterRevisionDone(proposalRef, legFilename);
        return result;
    }

    @Override
    public List<ContributionVO> listContributionsForDocument(String documentRef, Integer annexIndex, LeosCategoryClass documentType) {
        Class<XmlDocument> clazz = LeosCategoryClass.valueOf(documentType.name()).getClazz();
        return this.contributionService.getDocumentContributions(documentRef, annexIndex, clazz);
    }

    @Override
    public String compareAndShowRevision(String contextPath,
                                        String documentRef,
                                        String documentType,
                                        String versionLabel) {
        LeosCategoryClass documentClass = LeosCategoryClass.valueOf(documentType.toUpperCase());
        final LeosPackage pack = this.leosRepository.findPackageByDocumentRef(documentRef, documentClass.getClazz());
        final Proposal proposal = this.proposalService.findProposalByPackagePath(pack.getPath());
        this.populateCloneProposalMetadata(proposal);

        XmlDocument contributionVersion = null;
        XmlDocument originalVersion = null;
        switch (documentClass){
            case ANNEX:{
                contributionVersion = this.leosRepository.findDocumentByRef(documentRef, Annex.class);
                originalVersion = this.leosRepository.findFirstVersion(Annex.class, documentRef);
                break;
            }
            case COVERPAGE:{
                contributionVersion = this.leosRepository.findDocumentByRef(documentRef,Proposal.class);
                originalVersion = this.leosRepository.findFirstVersion(Proposal.class, documentRef);
                break;
            }
            case BILL:{
                contributionVersion = this.leosRepository.findDocumentByRef(documentRef,Bill.class);
                originalVersion = this.leosRepository.findFirstVersion(Bill.class, documentRef);
                break;
            }
            case MEMORANDUM:{
                contributionVersion = this.leosRepository.findDocumentByRef(documentRef, Memorandum.class);
                originalVersion = this.leosRepository.findFirstVersion(Memorandum.class, documentRef);
                break;
            }
            default:{
                throw new RuntimeException("Not supported document type for compare and show revision");
            }
        }

        final String contributionHtml = documentContentService.getCleanDocumentAsHtml(
                contributionVersion,
                contextPath,
                securityContext.getPermissions(contributionVersion)
        );
        // Get the original version submitted to LS from the metadata of the document
        final String originalVersionHtml = documentContentService.getCleanDocumentAsHtml(
                originalVersion,
                contextPath,
                securityContext.getPermissions(originalVersion)
        );

        cloneContext.setContribution(Boolean.TRUE);
        return this.comparisonDelegateAPI.getContributionComparedContent(originalVersionHtml, contributionHtml);
    }

    protected void populateCloneProposalMetadata(Proposal proposal) {
        if (proposal != null && proposal.isClonedProposal()) {
            byte[] xmlContent = proposal.getContent().get().getSource().getBytes();
            CloneProposalMetadataVO cloneProposalMetadataVO = proposalService.getClonedProposalMetadata(xmlContent);
            cloneContext.setCloneProposalMetadataVO(cloneProposalMetadataVO);
        }
    }

}
