package eu.europa.ec.leos.services.api;

import com.google.common.base.Stopwatch;
import com.sun.istack.NotNull;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.repository.LeosCategoryClass;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.clone.InternalRefMap;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.collection.CreateCollectionService;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.ContributionService;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.request.ApplyContributionsRequest;
import eu.europa.ec.leos.services.dto.request.MergeActionVO;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.exception.NotFoundException;
import eu.europa.ec.leos.services.export.ZipPackageUtil;
import eu.europa.ec.leos.services.numbering.NumberService;
import eu.europa.ec.leos.services.processor.AttachmentProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.vo.structure.TocItem;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static eu.europa.ec.leos.services.support.XmlHelper.validatePath;

@Service
public class ContributionApiServiceImpl implements ContributionApiService {
    private static final Logger LOG = LoggerFactory.getLogger(ContributionApiServiceImpl.class);

    private final CreateCollectionService createCollectionService;
    private final CloneContext cloneContext;
    private final ProposalService proposalService;
    private final UserService userService;
    private final PackageService packageService;
    private final LegService legService;
    private final SecurityContext securityContext;
    private final ContributionService contributionService;
    private final LeosRepository leosRepository;
    private final Provider<StructureContext> structureContextProvider;
    private final Provider<StructureContext> structureContext;
    private final AttachmentProcessor attachmentProcessor;
    private final MergeContributionHelperService mergeContributionHelperService;
    private final XmlContentProcessor xmlContentProcessor;
    private final NumberService numberService;
    private final MessageHelper messageHelper;

    private final DocumentContentService documentContentService;
    private final ComparisonDelegateAPI<XmlDocument> comparisonDelegateAPI;
    private final DocumentViewService<XmlDocument> documentViewService;
    private final RepositoryPropertiesMapper repositoryPropertiesMapper;


    @Value("${leos.clone.originRef}")
    private String cloneOriginRef;

    @Autowired
    public ContributionApiServiceImpl(CreateCollectionService createCollectionService,
                                      CloneContext cloneContext,
                                      ProposalService proposalService,
                                      UserService userService,
                                      PackageService packageService,
                                      LegService legService,
                                      SecurityContext securityContext,
                                      ContributionService contributionService,
                                      LeosRepository leosRepository,
                                      Provider<StructureContext> structureContextProvider,
                                      Provider<StructureContext> structureContext,
                                      AttachmentProcessor attachmentProcessor,
                                      MergeContributionHelperService mergeContributionHelperService,
                                      XmlContentProcessor xmlContentProcessor,
                                      NumberService numberService,
                                      MessageHelper messageHelper,
                                      DocumentContentService documentContentService,
                                      ComparisonDelegateAPI<XmlDocument> comparisonDelegateAPI,
                                      DocumentViewService<XmlDocument> documentViewService,
                                      RepositoryPropertiesMapper repositoryPropertiesMapper) {
        this.createCollectionService = createCollectionService;
        this.cloneContext = cloneContext;
        this.proposalService = proposalService;
        this.userService = userService;
        this.packageService = packageService;
        this.legService = legService;
        this.securityContext = securityContext;
        this.contributionService = contributionService;
        this.leosRepository = leosRepository;
        this.structureContextProvider = structureContextProvider;
        this.structureContext = structureContext;
        this.attachmentProcessor = attachmentProcessor;
        this.mergeContributionHelperService = mergeContributionHelperService;
        this.messageHelper = messageHelper;
        this.xmlContentProcessor = xmlContentProcessor;
        this.numberService = numberService;
        this.documentContentService = documentContentService;
        this.comparisonDelegateAPI = comparisonDelegateAPI;
        this.documentViewService = documentViewService;
        this.repositoryPropertiesMapper = repositoryPropertiesMapper;
    }

    private XmlDocument findDocumentByRef(String docRef) throws NotFoundException {
        return Optional.ofNullable(this.leosRepository.findDocumentByRef(docRef, XmlDocument.class))
                .orElseThrow(() -> new NotFoundException(String.format("Not found document %s", docRef)));
    }

    @Override
    public CreateCollectionResult createCloneProposal(String proposalRef, String userLogin, String legDocumentName) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        User user = userService.getUser(userLogin);
        Proposal proposal = proposalService.getProposalByRef(proposalRef);
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        LegDocument legDocument = packageService.findDocumentByPackagePathAndName(leosPackage.getPath(), legDocumentName, LegDocument.class);
        String loggedInUser = securityContext.getUser().getLogin();
        CreateCollectionResult createCollectionResult = null;
        Collection<? extends GrantedAuthority> loggedInUserAuthorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
        try {
            validatePath(legDocumentName);
            File content = new File(legDocumentName);
            writeContentToFile(legDocument, content);
            userService.switchUser(user.getLogin());
            createCollectionResult = createCollectionService.cloneCollection(content, cloneOriginRef, user.getLogin(),
                    user.getDefaultEntity().getName());
            if (createCollectionResult != null && createCollectionResult.getError() != null) {
                LOG.error("Error Occurred while cloning proposal from the Leg file: " + createCollectionResult.getError().getMessage());
            }
            LOG.info("Proposal id '{}' name '{}' sent for revision to user '{}' in {} milliseconds ({} sec)", proposal.getId(), leosPackage.getName(), user.getLogin(), stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        }
        catch (Exception ex) {
            LOG.error("Error Occurred while cloning proposal from the Leg file: " + ex.getMessage(), ex);
        }
        finally {
            userService.switchUserWithAuthorities(loggedInUser, loggedInUserAuthorities);
        }
        return createCollectionResult;
    }

    private static void writeContentToFile(LegDocument legDocument, File content) {
        try (FileOutputStream fos = new FileOutputStream(content)) {
            fos.write(legDocument.getContent().get().getSource().getBytes());
        }
        catch (IOException ioe) {
            LOG.error("Error Occurred while reading the Leg file: " + ioe.getMessage(), ioe);
        }
    }

    @Override
    public Result<?> updateClonedProposalRevisionStatus(String proposalRef, String legFilename) {
        Proposal proposal = proposalService.getProposalByRef(proposalRef);
        this.populateCloneProposalMetadata(proposal);
        return createCollectionService.updateOriginalProposalAfterRevisionDone(proposalRef, legFilename);
    }

    @Override
    public List<ContributionVO> listContributionsForDocument(String documentRef, Integer annexIndex) {
        Class docClass = LeosCategoryClass.getClass(this.findDocumentByRef(documentRef).getCategory());
        return this.contributionService.getDocumentContributions(documentRef, annexIndex, docClass);
    }

    @Override
    public DocumentViewResponse compareAndShowRevision(String contextPath,
                                                       String documentRef,
                                                       String contributionsVersionRef, String legFileName) throws IOException {
        XmlDocument document = this.findDocumentByRef(documentRef);
        Class<? extends XmlDocument> docClass = LeosCategoryClass.getClass(document.getCategory());
        XmlDocument contributionVersion = Optional.ofNullable(this.contributionService.findVersionByVersionedReference(contributionsVersionRef, docClass))
                .orElseThrow(() -> new RuntimeException(String.format("Contribution version not found for %s", contributionsVersionRef)));
        XmlDocument originalVersion = Optional.ofNullable(this.leosRepository.findFirstVersion(docClass, contributionVersion.getMetadata().get().getRef()))
                .orElseThrow(() -> new RuntimeException(String.format("First version not found for document %s", documentRef)));
        LeosPackage leosPackage = this.leosRepository.findPackageByDocumentId(originalVersion.getId());
        LegDocument legDocument = packageService.findDocumentByPackagePathAndName(leosPackage.getPath(), legFileName, LegDocument.class);
        Map<String, Object> legContent = ZipPackageUtil.unzipByteArray(legDocument.getContent().get().
                getSource().getBytes());
        byte[] contributionContent = (byte[]) legContent.get(contributionVersion.getName());
        Proposal proposal = this.proposalService.findProposalByPackagePath(leosPackage.getPath());

        String contributionHtml = documentContentService.getDocumentForContributionAsHtml(
                contributionContent, contextPath,
                securityContext.getPermissions(contributionVersion));


        cloneContext.setContribution(Boolean.TRUE);
        final String temporaryAnnotationsId = this.storeRevisionAnnotationsTemporary(contributionVersion.getMetadata().get().getRef(), legFileName, contributionsVersionRef);
        final String temporaryDocument = contributionVersion.getName().replace(".xml", "");
        return new DocumentViewResponse(
                proposal.getMetadata().get().getRef(),
                contributionHtml,
                documentViewService.getVersionInfo(contributionVersion),
                temporaryAnnotationsId, temporaryDocument);
    }

    private String storeRevisionAnnotationsTemporary(final String documentRef, final String legFileName, final String versionedReference) {
        try {
            final LeosPackage leosPackage = this.packageService.findPackageByDocumentRef(documentRef, XmlDocument.class);
            final LegDocument legDocument = this.packageService.findDocumentByPackagePathAndName(leosPackage.getPath(), legFileName, LegDocument.class);
            return this.legService.storeLegDocumentTemporary(legDocument);
        } catch(Exception e) {
            LOG.error("Error fetching temporary annotations ", e);
        }
        return null;
    }

    public void declineContribution(String contributionVersionRef) {
        XmlDocument document = contributionService.findVersionByVersionedReference(contributionVersionRef, XmlDocument.class);
        Map<String, Object> properties = new HashMap<>();
        properties.put(
                repositoryPropertiesMapper.getId(RepositoryProperties.CONTRIBUTION_STATUS),
                ContributionVO.ContributionStatus.CONTRIBUTION_DONE.getValue()
        );
        this.leosRepository.updateDocument(document.getMetadata().get().getRef(), document.getId(), properties, XmlDocument.class, true);
    }

    protected void populateCloneProposalMetadata(Proposal proposal) {
        if (proposal != null && proposal.isClonedProposal()) {
            byte[] xmlContent = proposal.getContent().get().getSource().getBytes();
            CloneProposalMetadataVO cloneProposalMetadataVO = proposalService.getClonedProposalMetadata(xmlContent);
            cloneContext.setCloneProposalMetadataVO(cloneProposalMetadataVO);
        }
    }

    public byte[] mergeContribution(@NotNull String documentRef,
                                    @NotNull ApplyContributionsRequest request) throws NotFoundException, IOException {
        XmlDocument document = this.findDocumentByRef(documentRef);
        Class docClass = LeosCategoryClass.getClass(document.getCategory());
        final LeosPackage pack = this.leosRepository.findPackageByDocumentRef(documentRef, docClass);
        final Proposal proposal = this.proposalService.findProposalByPackagePath(pack.getPath());
        this.populateCloneProposalMetadata(Validate.notNull(proposal));
        String language = proposal.getMetadata().get().getLanguage();

        final List<MergeActionVO> mergeActions = Optional.ofNullable(request.getMergeActions()).orElse(new ArrayList<>());
        final ContributionVO contribution = Optional.ofNullable(mergeActions)
                .filter(list -> Boolean.FALSE.equals(list.isEmpty()))
                .map(list -> list.get(0))
                .map(MergeActionVO::getContributionVO)
                .orElse(null);

        if (Boolean.FALSE.equals(mergeActions.isEmpty())) {
            structureContextProvider.get().useDocumentTemplate(document.getMetadata().getOrError(() -> "Document metadata is required!").getDocTemplate());
            List<TocItem> tocItemList = this.structureContext.get().getTocItems();
            byte[] xmlClonedContent = contribution.getXmlContent();
            List<InternalRefMap> intRefMap = getInternalRefMaps(request, document, xmlClonedContent);
            byte[] xmlContent = mergeContributionHelperService.updateDocumentWithContributions(request, document, tocItemList, intRefMap);
            xmlContent = this.numberService.renumberArticles(xmlContent, true);
            xmlContent = this.numberService.renumberRecitals(xmlContent);
            xmlContent = this.xmlContentProcessor.doXMLPostProcessing(xmlContent);
            document = this.leosRepository.updateDocument(
                    document.getId(),
                    xmlContent,
                    document.getVersionType(),
                    this.messageHelper.getMessage("contribution.merge.operation.message"),
                    XmlDocument.class
            );
        }
        if (request.isAcceptAllContributions() && Objects.nonNull(contribution)) {
            this.markContributionAsProcessed(contribution.getVersionedReference());
        }
        return document.getContent().get().getSource().getBytes();
    }

    @Override
    public void markContributionAsProcessed(String contributionVersionRef) {
        final XmlDocument contribution = this.contributionService.findVersionByVersionedReference(contributionVersionRef, XmlDocument.class);
        Map<String, Object> properties = new HashMap<>();
        properties.put(
                this.repositoryPropertiesMapper.getId(RepositoryProperties.CONTRIBUTION_STATUS),
                ContributionVO.ContributionStatus.CONTRIBUTION_DONE.getValue()
        );
        this.leosRepository.updateDocument(contribution.getMetadata().get().getRef(), contribution.getId(), properties,
                XmlDocument.class,false);
    }

    private List<InternalRefMap> getInternalRefMaps(ApplyContributionsRequest event, LeosDocument document, byte[] xmlClonedContent) {
        byte[] xmlContent = document.getContent().get().getSource().getBytes();
        Map<String, String> attachmentsClonedContent = this.attachmentProcessor.getAttachmentsHrefFromBill(xmlClonedContent);
        List<InternalRefMap> map = new ArrayList<>();
        String ref = document.getName().replace(".xml", "");
        String clonedRef = event.getMergeActions().get(0).getContributionVO().getDocumentName().replace(".xml", "");
        map.add(new InternalRefMap("BILL", ref, clonedRef));
        Map<String, String> attachments = attachmentProcessor.getAttachmentsHrefFromBill(xmlContent);
        attachments.forEach((docType, href) -> {
            if (docType.equals("ANNEX")) {
                docType = docType + " I";
            }
            String cloned = attachmentsClonedContent.get(docType);
            map.add(new InternalRefMap(docType, href, cloned));
        });
        return map;
    }
}
