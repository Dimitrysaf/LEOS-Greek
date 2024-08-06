package eu.europa.ec.leos.services.api;

import com.google.common.base.Stopwatch;
import com.sun.istack.NotNull;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosCategoryClass;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.Explanatory;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.Memorandum;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.AnnexMetadata;
import eu.europa.ec.leos.domain.repository.metadata.BillMetadata;
import eu.europa.ec.leos.domain.repository.metadata.ExplanatoryMetadata;
import eu.europa.ec.leos.domain.repository.metadata.FinancialStatementMetadata;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.domain.vo.MetadataVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.model.notification.trackChanges.SendFeedbackNotification;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.clone.InternalRefMap;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.collection.CreateCollectionService;
import eu.europa.ec.leos.services.collection.document.BillContextService;
import eu.europa.ec.leos.services.collection.document.ContextActionService;
import eu.europa.ec.leos.services.collection.document.FinancialStatementContextService;
import eu.europa.ec.leos.services.converter.ProposalConverterService;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.document.ContributionService;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.FinancialStatementService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.request.ApplyContributionsRequest;
import eu.europa.ec.leos.services.dto.request.MergeActionVO;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.exception.NotFoundException;
import eu.europa.ec.leos.services.exception.SendNotificationException;
import eu.europa.ec.leos.services.export.ExportLeos;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ZipPackageUtil;
import eu.europa.ec.leos.services.milestone.MilestoneService;
import eu.europa.ec.leos.services.notification.NotificationService;
import eu.europa.ec.leos.services.numbering.NumberService;
import eu.europa.ec.leos.services.processor.AttachmentProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.response.MergeContributionResponse;
import eu.europa.ec.leos.services.store.ArchiveService;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.support.url.CollectionIdsAndUrlsHolder;
import eu.europa.ec.leos.services.support.url.CollectionUrlBuilder;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.vo.structure.TocItem;
import org.apache.commons.io.FilenameUtils;
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
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

import static eu.europa.ec.leos.domain.repository.LeosCategory.STAT_FINANC_LEGIS;
import static eu.europa.ec.leos.services.support.XmlHelper.XML_DOC_EXT;
import static eu.europa.ec.leos.services.support.XmlHelper.validateBasePath;
import static eu.europa.ec.leos.services.support.XmlHelper.validatePath;

@Service
public class ContributionApiServiceImpl implements ContributionApiService {
    private static final Logger LOG = LoggerFactory.getLogger(ContributionApiServiceImpl.class);

    private final CreateCollectionService createCollectionService;
    private final CloneContext cloneContext;
    private final ProposalService proposalService;
    private final ProposalConverterService proposalConverterService;
    private final Provider<BillContextService> billContextProvider;
    private final Provider<FinancialStatementContextService> financialStatementContextProvider;
    private final ArchiveService archiveService;
    private final BillService billService;
    private final FinancialStatementService financialStatementService;
    private final UserService userService;
    private final PackageService packageService;
    private final LegService legService;
    private final SecurityContext securityContext;
    private final ContributionService contributionService;
    private final NotificationService notificationService;
    private final MilestoneService milestoneService;
    private final Properties applicationProperties;
    private final LeosRepository leosRepository;
    private final Provider<StructureContext> structureContextProvider;
    private final AttachmentProcessor attachmentProcessor;
    private final MergeContributionService mergeContributionService;
    private final XmlContentProcessor xmlContentProcessor;
    private final NumberService numberService;
    private final MessageHelper messageHelper;
    private final TrackChangesContext trackChangesContext;
    private final CollectionUrlBuilder urlBuilder;

    private final DocumentContentService documentContentService;
    private final ComparisonDelegateAPI<XmlDocument> comparisonDelegateAPI;
    private final DocumentViewService<XmlDocument> documentViewService;
    private final RepositoryPropertiesMapper repositoryPropertiesMapper;
    private final DocumentLanguageContext documentLanguageContext;

    @Value("${leos.clone.originRef}")
    private String cloneOriginRef;

    @Autowired
    public ContributionApiServiceImpl(CreateCollectionService createCollectionService,
                                      CloneContext cloneContext,
                                      ProposalService proposalService,
                                      Provider<FinancialStatementContextService> financialStatementContextProvider, FinancialStatementService financialStatementService, UserService userService,
                                      PackageService packageService,
                                      LegService legService,
                                      SecurityContext securityContext,
                                      ContributionService contributionService,
                                      NotificationService notificationService,
                                      MilestoneService milestoneService, Properties applicationProperties,
                                      LeosRepository leosRepository,
                                      Provider<StructureContext> structureContextProvider,
                                      AttachmentProcessor attachmentProcessor,
                                      MergeContributionService mergeContributionService,
                                      XmlContentProcessor xmlContentProcessor,
                                      NumberService numberService,
                                      MessageHelper messageHelper,
                                      TrackChangesContext trackChangesContext, DocumentContentService documentContentService,
                                      ComparisonDelegateAPI<XmlDocument> comparisonDelegateAPI,
                                      DocumentViewService<XmlDocument> documentViewService,
                                      RepositoryPropertiesMapper repositoryPropertiesMapper,
                                      DocumentLanguageContext documentLanguageContext,
                                      ProposalConverterService proposalConverterService,
                                      BillService billService,
                                      Provider<BillContextService> billContextProvider,
                                      ArchiveService archiveService, CollectionUrlBuilder urlBuilder) {
        this.createCollectionService = createCollectionService;
        this.cloneContext = cloneContext;
        this.proposalService = proposalService;
        this.financialStatementContextProvider = financialStatementContextProvider;
        this.financialStatementService = financialStatementService;
        this.userService = userService;
        this.packageService = packageService;
        this.legService = legService;
        this.securityContext = securityContext;
        this.contributionService = contributionService;
        this.milestoneService = milestoneService;
        this.leosRepository = leosRepository;
        this.structureContextProvider = structureContextProvider;
        this.attachmentProcessor = attachmentProcessor;
        this.mergeContributionService = mergeContributionService;
        this.messageHelper = messageHelper;
        this.xmlContentProcessor = xmlContentProcessor;
        this.numberService = numberService;
        this.trackChangesContext = trackChangesContext;
        this.documentContentService = documentContentService;
        this.comparisonDelegateAPI = comparisonDelegateAPI;
        this.documentViewService = documentViewService;
        this.repositoryPropertiesMapper = repositoryPropertiesMapper;
        this.documentLanguageContext = documentLanguageContext;
        this.notificationService = notificationService;
        this.applicationProperties = applicationProperties;
        this.proposalConverterService = proposalConverterService;
        this.billService = billService;
        this.billContextProvider = billContextProvider;
        this.archiveService = archiveService;
        this.urlBuilder = urlBuilder;
    }

    private XmlDocument findDocumentByRef(String docRef) throws NotFoundException {
        return Optional.ofNullable(this.leosRepository.findDocumentByRef(docRef, XmlDocument.class))
                .orElseThrow(() -> new NotFoundException(String.format("Not found document %s", docRef)));
    }

    @Override
    public CreateCollectionResult createCloneProposal(String userLogin, String legDocumentName, String legFileId) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        User user = userService.getUser(userLogin);
        LegDocument legDocument = legService.findLegDocumentById(legFileId);
        String loggedInUser = securityContext.getUser().getLogin();
        CreateCollectionResult createCollectionResult = null;
        Collection<? extends GrantedAuthority> loggedInUserAuthorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
        try {
            validateBasePath(FilenameUtils.normalize(legDocumentName), "./");
            // Validate and normalize the upload directory path
            if (legDocumentName == null || legDocumentName.contains("..")) {
                throw new IllegalArgumentException("Invalid upload directory path: " + legDocumentName);
            }
            File content = new File(legDocumentName);
            writeContentToFile(legDocument, content);
            userService.switchUser(user.getLogin());
            createCollectionResult = createCollectionService.cloneCollection(content, cloneOriginRef, user.getLogin(),
                    user.getDefaultEntity().getName());
            if (createCollectionResult != null && createCollectionResult.getError() != null) {
                LOG.error("Error Occurred while cloning proposal from the Leg file: " + createCollectionResult.getError().getMessage());
            }
            LOG.info("Proposal legFileId '{}' sent for revision to user '{}' in {} milliseconds ({} sec)", legDocument.getId(), user.getLogin(), stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        } catch (Exception ex) {
            LOG.error("Error Occurred while cloning proposal from the Leg file: " + ex.getMessage(), ex);
        } finally {
            userService.switchUserWithAuthorities(loggedInUser, loggedInUserAuthorities);
        }
        return createCollectionResult;
    }

    private static void writeContentToFile(LegDocument legDocument, File content) {
        try (FileOutputStream fos = new FileOutputStream(content)) {
            fos.write(legDocument.getContent().get().getSource().getBytes());
        } catch (IOException ioe) {
            LOG.error("Error Occurred while reading the Leg file: " + ioe.getMessage(), ioe);
        }
    }

    @Override
    public Result<?> updateClonedProposalRevisionStatus(String proposalRef, String legFileId) {
        Proposal proposal = proposalService.getProposalByRef(proposalRef);
        this.populateCloneProposalMetadata(proposal);
        return createCollectionService.updateOriginalProposalAfterRevisionDone(proposalRef, legFileId);
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

    @Override
    public void updateFeedbackAnnotations(String cloneProposalRef, String cloneLegFileName, String contributionsVersionRef) throws Exception {
        XmlDocument contributionVersion = Optional.ofNullable(this.contributionService.findVersionByVersionedReference(contributionsVersionRef, XmlDocument.class))
                .orElseThrow(() -> new RuntimeException(String.format("Contribution version not found for %s", contributionsVersionRef)));
        String documentRef = contributionVersion.getMetadata().get().getRef();
        ExportLeos exportOptions = new ExportLeos(ExportOptions.Output.PDF);
        exportOptions.setWithSuggestions(false);
        exportOptions.setWithAnonymization(true);
        exportOptions.setWithAnnotations(true);
        exportOptions.setWithFeedbackAnnotations(true);
        legService.updateLegDocumentFeedbackAnnotations(cloneProposalRef, cloneLegFileName, documentRef, contributionsVersionRef,
                contributionVersion.getName(),
                exportOptions);
    }

    private String storeRevisionAnnotationsTemporary(final String documentRef, final String legFileName, final String versionedReference) {
        try {
            final LeosPackage leosPackage = this.packageService.findPackageByDocumentRef(documentRef, XmlDocument.class);
            final LegDocument legDocument = this.packageService.findDocumentByPackagePathAndName(leosPackage.getPath(), legFileName, LegDocument.class);
            return this.legService.storeLegDocumentTemporary(legDocument);
        } catch (Exception e) {
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

    public MergeContributionResponse mergeContribution(@NotNull String documentRef,
                                                       @NotNull ApplyContributionsRequest request) throws NotFoundException, IOException {
        XmlDocument document = this.findDocumentByRef(documentRef);
        MergeContributionResponse mergeResult = new MergeContributionResponse(true, document.getContent().get().getSource().getBytes());
        Class docClass = LeosCategoryClass.getClass(document.getCategory());
        final LeosPackage pack = this.leosRepository.findPackageByDocumentRef(documentRef, docClass);
        final Proposal proposal = this.proposalService.findProposalByPackagePath(pack.getPath());
        this.populateCloneProposalMetadata(Validate.notNull(proposal));
        documentLanguageContext.setDocumentLanguage(proposal.getMetadata().get().getLanguage());

        final List<MergeActionVO> mergeActions = Optional.ofNullable(request.getMergeActions()).orElse(new ArrayList<>());
        final ContributionVO contribution = Optional.ofNullable(mergeActions)
                .filter(list -> Boolean.FALSE.equals(list.isEmpty()))
                .map(list -> list.get(0))
                .map(MergeActionVO::getContributionVO)
                .orElse(null);

        if (Boolean.FALSE.equals(mergeActions.isEmpty())) {
            trackChangesContext.setTrackChangesEnabled(!request.getMergeActions().get(0).getAction().equals(MergeActionVO.MergeAction.UNDO) && request.getMergeActions().get(0).isWithTrackChanges());
            structureContextProvider.get().useDocumentTemplate(document.getMetadata().getOrError(() -> "Document metadata is required!").getDocTemplate());
            List<TocItem> tocItemList = this.structureContextProvider.get().getTocItems();
            byte[] xmlClonedContent = contribution.getXmlContent();
            List<InternalRefMap> intRefMap = getInternalRefMaps(request, document, xmlClonedContent);
            mergeResult = mergeContributionService.updateDocumentWithContributions(request, document, tocItemList, intRefMap);
            byte[] xmlContent = mergeResult.getMergedContent();
            xmlContent = this.numberService.renumberArticles(xmlContent, false);
            xmlContent = this.numberService.renumberRecitals(xmlContent);
            xmlContent = this.numberService.renumberLevel(xmlContent);
            xmlContent = this.numberService.renumberParagraph(xmlContent);
            xmlContent = this.numberService.renumberDivisions(xmlContent);
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
        mergeResult.setMergedContent(document.getContent().get().getSource().getBytes());
        return mergeResult;
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
                XmlDocument.class, false);
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

    public void sendFeedback(String proposalRef, String documentRef, String legFileName) {
        try {
            LOG.trace("Sending email feedback to all collaborators for proposalRef {}", proposalRef);
            SendFeedbackNotification sendFeedbackNotification = new SendFeedbackNotification();
            String milestoneUrl = applicationProperties.getProperty("leos.mapping.url") + "/ui/collection/" + proposalRef + "?legFileName=" + legFileName;
            Proposal proposal = leosRepository.findDocumentByRef(proposalRef, Proposal.class);
            XmlDocument document = this.findDocumentByRef(documentRef);
            sendFeedbackNotification.setRecipients(buildCollaboratorList(proposal));
            sendFeedbackNotification.setTitle(getProposalTitle(proposal));
            sendFeedbackNotification.setNamePart(document.getCategory().toString());
            sendFeedbackNotification.setLink(milestoneUrl);
            sendFeedbackNotification.setEmailSubject(messageHelper.getMessage(sendFeedbackNotification.getEmailSubjectKey()));
            notificationService.sendNotification(sendFeedbackNotification);
        } catch (Exception e) {
            LOG.warn(e.getMessage(), e);
            throw new SendNotificationException(e.getMessage(), e);
        }
    }

    private List<String> buildCollaboratorList(Proposal proposal) {
        List<String> collaborators = new ArrayList<>();
        proposal.getCollaborators().forEach((collaborator) -> {
            User user = userService.getUser(collaborator.getLogin());
            if (user == null) {
                throw new IllegalStateException("User '" + collaborator.getLogin() + "' not found in the database!");
            }
            collaborators.add(user.getEmail());
        });
        return collaborators;
    }

    private String getProposalTitle(Proposal proposal) {
        ProposalMetadata proposalMetadata = proposal.getMetadata().get();
        StringBuilder proposalTitle = new StringBuilder(proposalMetadata.getStage()).append(" ");
        proposalTitle.append(proposalMetadata.getType()).append(" ");
        proposalTitle.append(proposalMetadata.getPurpose()).append(" ");
        return proposalTitle.toString();
    }

    @Override
    public int countFeedbackAnnotationsFromLeg(String legFileName, String versionedReference, String proposalRef) {
        return legService.countFeedbacksToBeSentOnContribution(versionedReference, proposalRef, legFileName);
    }
    
    private void populateTrackChangesContext(Proposal proposal) {
        this.trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
    }

    private MetadataVO createMetadataVO(Proposal proposal) {
        ProposalMetadata metadata = proposal.getMetadata().getOrError(() -> "Proposal metadata is not available!");
        return new MetadataVO(metadata.getStage(), metadata.getType(), metadata.getPurpose(), metadata.getTemplate(), metadata.getLanguage(), metadata.getEeaRelevance());
    }

    private DocumentVO getCoverPageVO(DocumentVO proposalVO, String proposalRef) {
        DocumentVO coverPageVO = new DocumentVO(proposalVO.getId(),
                proposalVO.getMetadata().getLanguage() != null ? proposalVO.getMetadata().getLanguage() : "EN",
                LeosCategory.COVERPAGE,
                proposalVO.getUpdatedBy(),
                proposalVO.getUpdatedOn(), proposalVO.isTrackChangesEnabled());
        coverPageVO.getMetadata().setInternalRef(proposalRef);
        coverPageVO.setSource(documentContentService.getCoverPageContent(proposalVO.getSource()));
        return coverPageVO;
    }

    private DocumentVO getExplanatroyVO(Explanatory explanatory) {
        DocumentVO explanatoryVO = new DocumentVO(explanatory.getId(),
                explanatory.getMetadata().exists(e -> e.getLanguage() != null) ? explanatory.getMetadata().get().getLanguage() : "EN",
                LeosCategory.COUNCIL_EXPLANATORY,
                explanatory.getLastModifiedBy(),
                Date.from(explanatory.getLastModificationInstant()), explanatory.isTrackChangesEnabled());

        if (explanatory.getMetadata().isDefined()) {
            ExplanatoryMetadata metadata = explanatory.getMetadata().get();
            explanatoryVO.setTitle(metadata.getTitle());
        }

        return explanatoryVO;
    }

    private DocumentVO getMemorandumVO(Memorandum memorandum) {
        return new DocumentVO(memorandum.getId(),
                memorandum.getMetadata().exists(m -> m.getLanguage() != null) ? memorandum.getMetadata().get().getLanguage() : "EN",
                LeosCategory.MEMORANDUM,
                memorandum.getLastModifiedBy(),
                Date.from(memorandum.getLastModificationInstant()), memorandum.isTrackChangesEnabled());
    }

    private DocumentVO getLegalTextVO(Bill bill) {
        return new DocumentVO(bill.getId(),
                bill.getMetadata().exists(m -> m.getLanguage() != null) ? bill.getMetadata().get().getLanguage() : "EN",
                LeosCategory.BILL,
                bill.getLastModifiedBy(),
                Date.from(bill.getLastModificationInstant()), bill.isTrackChangesEnabled());
    }

    private DocumentVO getFinancialStatementVO(FinancialStatement fs) {
        return new DocumentVO(fs.getId(),
                fs.getMetadata().exists(m -> m.getLanguage() != null) ? fs.getMetadata().get().getLanguage() : "EN",
                STAT_FINANC_LEGIS,
                fs.getLastModifiedBy(),
                Date.from(fs.getLastModificationInstant()), fs.isTrackChangesEnabled());
    }

    private DocumentVO createAnnexVO(Annex annex) {
        DocumentVO annexVO =
                new DocumentVO(annex.getId(),
                        annex.getMetadata().exists(m -> m.getLanguage() != null) ? annex.getMetadata().get().getLanguage() : "EN",
                        LeosCategory.ANNEX,
                        annex.getLastModifiedBy(),
                        Date.from(annex.getLastModificationInstant()), annex.isTrackChangesEnabled());

        if (annex.getMetadata().isDefined()) {
            AnnexMetadata metadata = annex.getMetadata().get();
            annexVO.setDocNumber(metadata.getIndex());
            annexVO.setTitle(metadata.getTitle());
            annexVO.getMetadata().setNumber(metadata.getNumber());
            annexVO.setRef(annex.getMetadata().get().getRef());
        }

        return annexVO;
    }

    private DocumentVO createFinancialStatementVO(FinancialStatement financialStatement) {
        DocumentVO financialDocumentVO =
                new DocumentVO(financialStatement.getId(),
                        financialStatement.getMetadata().exists(m -> m.getLanguage() != null) ? financialStatement.getMetadata().get().getLanguage() : "EN",
                        LeosCategory.STAT_FINANC_LEGIS,
                        financialStatement.getLastModifiedBy(),
                        Date.from(financialStatement.getLastModificationInstant()), financialStatement.isTrackChangesEnabled());

        if (financialStatement.getMetadata().isDefined()) {
            FinancialStatementMetadata metadata = financialStatement.getMetadata().get();
            financialDocumentVO.setTitle(metadata.getTitle());
            financialDocumentVO.setRef(financialStatement.getMetadata().get().getRef());
        }
        return financialDocumentVO;
    }

    public File createFileFromXmlSource(byte[] xmlSource, String docName) throws IOException {
        File file = new File(docName);
        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(xmlSource);
            fos.flush();
        } catch (IOException e) {
            throw new IOException("Failed to create file from xmlSource", e);
        }
        return file;
    }

    @Override
    public void handleMilestoneReject(String proposalRef, String clonedLegFileName, String originalLegFileId, String docRef, boolean isAdded) {
        LeosPackage leosClonedPackage = packageService.findPackageByDocumentRef(proposalRef, Proposal.class);
        LegDocument legDocument =
                legService.findLastContribution(leosClonedPackage.getPath(), clonedLegFileName);
        if (!isAdded) {
            legDocument = legService.findLegDocumentById(originalLegFileId);
        }
        final String docName = docRef;
        List<String> updatedDocuments = new ArrayList<>();
        legDocument.getContainedDocuments().forEach(fileName -> {
            int separatorIndex = fileName.indexOf("-");
            int versionIndex = separatorIndex != -1 ? fileName.substring(separatorIndex).lastIndexOf("_") + separatorIndex : fileName.lastIndexOf("_");
            String name = "", version = "";
            if (versionIndex != -1) {
                name = fileName.substring(0, versionIndex);
                version = fileName.substring(versionIndex);
            } else {
                name = fileName;
            }
            if (name.equalsIgnoreCase(docName)) {
                updatedDocuments.add(name.concat("_processed").concat(version));
            } else {
                updatedDocuments.add(fileName);
            }
        });
        milestoneService.updateMilestone(legDocument.getMilestoneRef(), legDocument.getId(), updatedDocuments);
    }

    @Override
    public void handleMilestoneAccept(String proposalRef, String legFileName, Boolean isAdded, String docRef, LeosCategory category) throws IOException {
        LeosPackage leosClonedPackage = packageService.findPackageByDocumentRef(proposalRef, Proposal.class);
        LegDocument legDocument = legService.findLastContribution(leosClonedPackage.getPath(), legFileName);
        Map<String, Object> legContent = ZipPackageUtil.unzipByteArray(legDocument.getContent().get().
                getSource().getBytes());
        String docName = docRef;
        if (docName.indexOf(XML_DOC_EXT) == -1) {
            docName = docName.concat(XML_DOC_EXT);
        }
        File docFile = null;
        if (isAdded) {
            byte[] xmlSource = (byte[]) legContent.get(docName);
            try {
                docFile = createFileFromXmlSource(xmlSource, docName);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        if (category.equals(LeosCategory.ANNEX)) {
            Bill clonedBill = billService.findBillByPackagePath(leosClonedPackage.getPath());
            Bill bill = billService.findBillByRef(clonedBill.getClonedFrom());
            LeosPackage leosPackage = packageService.findPackageByDocumentRef(clonedBill.getClonedFrom(), Bill.class);
            Proposal proposal = this.proposalService.findProposalByPackagePath(leosPackage.getPath());
            if (isAdded) {
                DocumentVO annexVO = proposalConverterService.createDocument(docName, docFile, true);
                annexVO.getMetadata().setIndex(null);
                BillMetadata metadata = bill.getMetadata().getOrError(() -> "Bill metadata is required!");
                BillContextService billContext = billContextProvider.get();
                billContext.usePackage(leosPackage);
                billContext.useActionMessage(ContextActionService.ANNEX_BLOCK_UPDATED, messageHelper.getMessage("collection.block.annex.metadata.updated"));
                billContext.useAnnexDocument(annexVO);
                billContext.usePurpose(metadata.getPurpose());
                billContext.createRefForAnnex(metadata);
                annexVO.getMetadata().setIndex(Integer.toString(((AnnexMetadata) annexVO.getMetadataDocument()).getIndex()));
                CollectionIdsAndUrlsHolder idsAndUrlsHolder = new CollectionIdsAndUrlsHolder();
                idsAndUrlsHolder.setBillId(metadata.getRef());
                idsAndUrlsHolder.setBillUrl(urlBuilder.buildBillViewUrl(metadata.getRef()));
                billContext.useIdsAndUrlsHolder(idsAndUrlsHolder);
                billContext.executeImportContributionAnnex();
            } else {
                Annex annex = packageService.findDocumentByPackagePathAndName(leosPackage.getPath(), docName, Annex.class);
                DocumentVO annexVO = createAnnexVO(annex);
                BillContextService billContext = billContextProvider.get();
                billContext.useAnnexwithRef(docRef);
                billContext.usePackage(leosPackage);
                billContext.useAnnex(annex.getId());
                billContext.useActionMessage(ContextActionService.ANNEX_METADATA_UPDATED, messageHelper.getMessage("collection.block.annex.metadata.updated"));
                billContext.useActionMessage(ContextActionService.ANNEX_DELETED, messageHelper.getMessage("collection.block.annex.removed"));

                try {
                    archiveService.archiveDocument(annexVO, Annex.class, leosPackage.getPath());
                } catch (Exception e) {
                    LOG.error("Error while using archive service {}", e.getMessage());
                }
                billContext.executeRemoveBillAnnex();
            }
            documentViewService.contextExecuteUpdateProposalAsync(proposal);
        } else if (category.equals(LeosCategory.STAT_FINANC_LEGIS)) {
            Proposal clonedProposal = this.proposalService.findProposalByPackagePath(leosClonedPackage.getPath());
            LeosPackage leosPackage = packageService.findPackageByDocumentRef(clonedProposal.getClonedFrom(), Proposal.class);
            Proposal proposal = proposalService.findProposalByPackagePath(leosPackage.getPath());
            if (isAdded) {
                DocumentVO financialStatementVO = proposalConverterService.createDocument(docName, docFile, true);
                FinancialStatementContextService financialStatementContext = financialStatementContextProvider.get();
                MetadataVO metadata = financialStatementVO.getMetadata();
                financialStatementContext.useDocument(financialStatementVO);
                financialStatementContext.usePackage(leosPackage);
                String template = metadata.getTemplate();
                financialStatementContext.useTemplate(template);
                financialStatementContext.useDocTemplate(metadata.getDocTemplate());
                financialStatementContext.usePurpose(proposal.getMetadata().get().getPurpose());
                financialStatementContext.useTitle(messageHelper.getMessage("document.default.financial.statement.title.default." + template));
                financialStatementContext.useEeaRelevance(proposal.getMetadata().get().getEeaRelevance());
                financialStatementContext.useType(proposal.getMetadata().get().getType());
                String actionMessage = messageHelper.getMessage("collection.block.financial.statement.added");
                financialStatementContext.useActionMessage(ContextActionService.STAT_FINANC_LEGIS_ADDED, actionMessage);
                financialStatementContext.useCollaborators(proposal.getCollaborators());
                financialStatementContext.useCloneProposal(proposal.isClonedProposal());
                financialStatementContext.useOriginRef(proposal.getOriginRef());
                financialStatementContext.useLanguage(metadata.getLanguage());
                financialStatementContext.useTranslated(false);
                FinancialStatement financialStatement = financialStatementContext.executeImportFinancialStatement();
                proposal = proposalService.addComponentRef(proposal, financialStatement.getName(), STAT_FINANC_LEGIS);
            } else {
                List<FinancialStatement> financialStatementList = financialStatementService.findFinancialStatementByPackagePath(leosPackage.getPath());
                if (!financialStatementList.isEmpty()) {
                    FinancialStatement financialStatement = financialStatementList.get(0);
                    DocumentVO fsVO = createFinancialStatementVO(financialStatement);
                    archiveService.archiveDocument(fsVO, FinancialStatement.class, leosPackage.getPath());
                    proposal = proposalService.removeComponentRef(proposal, financialStatement.getName());
                }
            }
            documentViewService.contextExecuteUpdateProposalAsync(proposal);
        }

    }
}
