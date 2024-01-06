/*
 * Copyright 2023 European Commission
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */

package eu.europa.ec.leos.services.api;

import com.google.common.base.Stopwatch;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosExportStatus;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.Explanatory;
import eu.europa.ec.leos.domain.repository.document.ExportDocument;
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
import eu.europa.ec.leos.domain.vo.ErrorVO;
import eu.europa.ec.leos.domain.vo.MetadataVO;
import eu.europa.ec.leos.domain.vo.MilestonesVO;
import eu.europa.ec.leos.domain.vo.ValidationVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.integration.rest.UserJSON;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMap;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.collection.CollectionContextService;
import eu.europa.ec.leos.services.collection.CreateCollectionException;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.collection.CreateCollectionService;
import eu.europa.ec.leos.services.collection.document.BillContextService;
import eu.europa.ec.leos.services.collection.document.ContextActionService;
import eu.europa.ec.leos.services.collection.milestone.helpers.MilestoneHelper;
import eu.europa.ec.leos.services.converter.ProposalConverterService;
import eu.europa.ec.leos.services.document.AnnexService;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ExplanatoryService;
import eu.europa.ec.leos.services.document.PostProcessingDocumentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.dto.request.FilterProposalsRequest;
import eu.europa.ec.leos.services.dto.request.UpdateProposalRequest;
import eu.europa.ec.leos.services.dto.response.LegFileValidation;
import eu.europa.ec.leos.services.dto.response.MilestoneDocumentView;
import eu.europa.ec.leos.services.dto.response.MilestonePDFDownloadResponse;
import eu.europa.ec.leos.services.dto.response.MilestoneViewResponse;
import eu.europa.ec.leos.services.dto.response.WorkspaceProposalResponse;
import eu.europa.ec.leos.services.exception.XmlValidationException;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportPackageVO;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.milestone.MilestoneService;
import eu.europa.ec.leos.services.notification.NotificationService;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.store.ArchiveService;
import eu.europa.ec.leos.services.store.ExportPackageService;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.store.TemplateService;
import eu.europa.ec.leos.services.store.WorkspaceService;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import eu.europa.ec.leos.services.user.UserHelper;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.services.validation.ValidationService;
import eu.europa.ec.leos.util.LeosDomainUtil;
import eu.europa.ec.leos.vo.catalog.CatalogItem;
import org.apache.commons.lang.Validate;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.StampedLock;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public abstract class ApiServiceImpl implements ApiService {
    private static final String DOC = "doc";
    private static final String HTML = ".html";
    private static final String TOC_JS = "_toc.js";
    private static final String XML = ".xml";
    private static final String PDF = ".pdf";
    private static final String MAIN_DOCUMENT_FILE_NAME = "main";
    private static final String COVER_PAGE_CONTENT_FILE_NAME = "coverPage";
    private static final String DOC_VERSION_START_TAG_REG = "<leos:docVersion\\b[^>]*>";
    private static final String DOC_VERSION_END_TAG = "</leos:docVersion>";
    private static final String DOC_NUMBER_START_TAG_REG = "<leos:annexIndex\\b[^>]*>";
    private static final String DOC_NUMBER_END_TAG = "</leos:annexIndex>";
    private static final Logger LOG = LoggerFactory.getLogger(ApiServiceImpl.class);
    private static final String COLLECTION_BLOCK_ANNEX_METADATA_UPDATED = "collection.block.annex.metadata.updated";
    private static final String MILESTONE = "milestone";

    private final TemplateService templateService;
    private final WorkspaceService workspaceService;
    private final UserService userService;
    private final CreateCollectionService createCollectionService;
    private final SecurityContext securityContext;
    private final LeosPermissionAuthorityMap authorityMap;
    protected final ProposalService proposalService;
    private final PackageService packageService;
    protected final ExportService exportService;
    private final Provider<CollectionContextService> collectionContextProvider;
    private final MessageHelper messageHelper;
    private final Provider<BillContextService> billContextProvider;
    private final BillService billService;
    private final DocumentContentService documentContentService;
    private final XmlContentProcessor xmlContentProcessor;
    private final ArchiveService archiveService;
    private final AnnexService annexService;
    private final MilestoneService milestoneService;
    private final CloneContext cloneContext;
    private CloneProposalMetadataVO cloneProposalMetadataVO;
    private ProposalConverterService proposalConverterService;
    private PostProcessingDocumentService postProcessingDocumentService;
    private ValidationService validationService;
    private ExplanatoryService explanatoryService;
    private ExportPackageService exportPackageService;
    private NotificationService notificationService;
    private LegService legService;
    private final UserHelper userHelper;
    private LeosRepository leosRepository;
    private TrackChangesContext trackChangesContext;

    @Value("${leos.clone.originRef}")
    private String cloneOriginRef;

    @Autowired
    public ApiServiceImpl(TemplateService templateService,
            WorkspaceService workspaceService,
            UserService userService,
            CreateCollectionService createCollectionService,
            ProposalService proposalService,
            SecurityContext securityContext,
            LeosPermissionAuthorityMap authorityMap,
            ExportService exportService,
            Provider<CollectionContextService> collectionContextProvider,
            DocumentContentService documentContentService,
            MessageHelper messageHelper,
            Provider<BillContextService> billContextProvider,
            PackageService packageService,
            BillService billService,
            XmlContentProcessor xmlContentProcessor,
            ArchiveService archiveService,
            AnnexService annexService,
            CloneContext cloneContext,
            MilestoneService milestoneService,
            ProposalConverterService proposalConverterService,
            PostProcessingDocumentService postProcessingDocumentService,
            ValidationService validationService, Properties applicationProperties,
            ExplanatoryService explanatoryService,
            ExportPackageService exportPackageService, NotificationService notificationService, LegService legService,
            UserHelper userHelper, LeosRepository leosRepository, TrackChangesContext trackChangesContext) {
        this.templateService = templateService;
        this.workspaceService = workspaceService;
        this.userService = userService;
        this.proposalService = proposalService;
        this.createCollectionService = createCollectionService;
        this.securityContext = securityContext;
        this.authorityMap = authorityMap;
        this.exportService = exportService;
        this.collectionContextProvider = collectionContextProvider;
        this.messageHelper = messageHelper;
        this.packageService = packageService;
        this.documentContentService = documentContentService;
        this.billContextProvider = billContextProvider;
        this.billService = billService;
        this.xmlContentProcessor = xmlContentProcessor;
        this.archiveService = archiveService;
        this.annexService = annexService;
        this.cloneContext = cloneContext;
        this.milestoneService = milestoneService;
        this.proposalConverterService = proposalConverterService;
        this.postProcessingDocumentService = postProcessingDocumentService;
        this.validationService = validationService;
        this.userHelper = userHelper;
        this.explanatoryService = explanatoryService;
        this.exportPackageService = exportPackageService;
        this.notificationService = notificationService;
        this.legService = legService;
        this.leosRepository = leosRepository;
        this.trackChangesContext = trackChangesContext;
    }

    @Override
    public <T extends LeosDocument> WorkspaceProposalResponse listDocumentsWithFilter(FilterProposalsRequest request) {
        return workspaceService.listDocumentsWithFilter(request, securityContext, authorityMap);
    }

    @Override
    public List<CatalogItem> getTemplates() throws IOException {
        return templateService.getTemplatesCatalog();
    }

    @Override
    public CreateCollectionResult createProposal(String templateId, String templateName, String langCode,
                                                 String docPurpose, boolean eeaRelevance) throws CreateCollectionException {
        DocumentVO documentVO = new DocumentVO(LeosCategory.PROPOSAL);
        documentVO.getMetadata().setDocTemplate(templateId);
        documentVO.getMetadata().setTemplateName(templateName);
        documentVO.getMetadata().setLanguage(langCode);
        documentVO.getMetadata().setDocPurpose(docPurpose);
        documentVO.getMetadata().setEeaRelevance(eeaRelevance);
        return createCollectionService.createCollection(documentVO);
    }

    @Override
    public CreateCollectionResult uploadProposal(File legDocument) throws CreateCollectionException {
        return createCollectionService.createCollectionFromLeg(legDocument);
    }

    @Override
    public LegFileValidation validateLegFile(File legDocument) {
        LegFileValidation legFileValidation = new LegFileValidation();
        DocumentVO proposal = new DocumentVO(LeosCategory.PROPOSAL);
        DocumentVO updatedDocumentVO = null;
        try {
            updatedDocumentVO = proposalConverterService.createProposalFromLegFile(legDocument, proposal, true);
            Result result = postProcessingDocumentService.processDocument(updatedDocumentVO);
            if (result.isOk()) {
                legFileValidation.setDocumentToBeCreated(updatedDocumentVO);
                ValidationVO validation = new ValidationVO();
                validation.addErrors(validationService.validateDocument(updatedDocumentVO));
                if (validation.hasErrors()) {
                    legFileValidation.setErrors(validation.getErrors());
                }
            }
        } catch (XmlValidationException e) {
            LOG.error("Xml validation error occurred while creating proposal from leg file: {}", e);
            legFileValidation.setDocumentToBeCreated(null);
            final List<ErrorVO> errorList = new ArrayList<>();
            errorList.add(new ErrorVO(e.getErrorCode(), e.getMessage()));
            legFileValidation.setErrors(errorList);
        }
        return legFileValidation;
    }

    @Override
    public DocumentVO updateProposalMetadata(String proposalRef, UpdateProposalRequest request) {
        LOG.trace("Saving proposal metadata...");
        try {
            CollectionContextService context = collectionContextProvider.get();
            Proposal proposal = proposalService.findProposalByRef(proposalRef);
            context.useProposal(proposal);
            if (request.getDocPurpose() != null) {
                context.usePurpose(request.getDocPurpose());
            } else {
                context.usePurpose(proposal.getMetadata().get().getPurpose());
            }
            if (request.isEeaRelevance() != null) {
                context.useEeaRelevance(request.isEeaRelevance());
            } else {
                context.useEeaRelevance(proposal.getMetadata().get().getEeaRelevance());
            }
            String comment = messageHelper.getMessage("operation.metadata.updated");
            context.useActionMessage(ContextActionService.METADATA_UPDATED, comment);
            context.useActionComment(comment);
            return new DocumentVO(context.executeUpdateProposal());
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while updating proposal metadata ", e);
            throw e;
        }
    }

    protected String getJobFileName(String proposalRef) {
        StringBuilder strBuilder = new StringBuilder();
        strBuilder.append("Proposal_");
        strBuilder.append(proposalRef);
        strBuilder.append(".zip");
        return strBuilder.toString();
    }

    @Override
    public void deleteCollection(String proposalRef) {
        CollectionContextService context = collectionContextProvider.get();
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        populateCloneProposalMetadataVO(proposal.getContent().get().getSource().getBytes());
        context.useProposal(proposal);
        context.executeDeleteProposal();
        if (cloneContext != null && cloneContext.isClonedProposal()) {
            CloneProposalMetadataVO cloneProposalMetadataVO = cloneContext.getCloneProposalMetadataVO();
            String originalProposalId = cloneProposalMetadataVO.getClonedFromObjectId();
            proposalService.removeClonedProposalMetadata(originalProposalId, proposalRef, cloneProposalMetadataVO);
            LOG.info("Cloned proposal metadata with proposal ref {} is cleaned up from original proposal with id {}", proposalRef, originalProposalId);
        }
    }

    @Override
    public List<UserJSON> searchUser(String searchKey) {
        return userService.searchUsersByKey(searchKey);
    }

    @Override
    public void createExplanatoryDocument(String proposalRef, String template) {
        try {
            Proposal proposal = proposalService.findProposalByRef(proposalRef);
            ProposalMetadata metadata = proposal.getMetadata().getOrError(() -> "Proposal metadata is required!");

            CollectionContextService context = collectionContextProvider.get();
            String selectedTemplate = !StringUtils.isEmpty(template) ? template : "CE-003";

            context.useTemplate(selectedTemplate);
            context.usePurpose(metadata.getPurpose());
            context.useProposal(proposal);
            context.useActionMessage(ContextActionService.EXPLANATORY_ADDED, messageHelper.getMessage("collection.block.explanatory.added"));
            context.executeCreateExplanatory();
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while creating the explanatory", e);
            throw e;
        }
    }

    @Override
    public ProposalMetadata createExplanatoryDocument(String templateId, String docPurpose, boolean eeaRelevance) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        if(LOG.isDebugEnabled()) LOG.debug("Handling create document request event... [category={}]", LeosCategory.COUNCIL_EXPLANATORY.toString());
        String[] templates = (templateId != null) ? templateId.split(";") : new String[0];

        CollectionContextService context = collectionContextProvider.get();
        for (String name : templates) {
            context.useTemplate(name);
        }
        context.usePurpose(docPurpose);
        context.useEeaRelevance(eeaRelevance);
        context.useActionMessage(ContextActionService.METADATA_UPDATED, messageHelper.getMessage("operation.metadata.updated"));
        context.useActionMessage(ContextActionService.DOCUMENT_CREATED, messageHelper.getMessage("operation.document.created"));
        Proposal proposal = context.executeCreateExplanatoryDocument();
        ProposalMetadata result =  proposal.getMetadata().getOrNull();
        if(LOG.isInfoEnabled()) {
            LOG.info("New document of type {} created in {} milliseconds ({} sec)", LeosCategory.PROPOSAL.toString(), stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        }
        return result;
    }

    @Override
    public void deleteExplanatoryDocument(String proposalRef, String explanatoryRef) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);
        Explanatory explanatory = this.explanatoryService.findExplanatoryByRef(explanatoryRef);
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        CollectionContextService collectionContext = collectionContextProvider.get();
        collectionContext.useExplanatoryId(explanatory.getId());
        collectionContext.usePackage(leosPackage);
        collectionContext.useActionMessage(ContextActionService.EXPLANATORY_METADATA_UPDATED, messageHelper.getMessage("collection.block.explanatory.metadata.updated"));
        collectionContext.useActionMessage(ContextActionService.EXPLANATORY_DELETED, messageHelper.getMessage("collection.block.explanatory.removed"));
        collectionContext.executeRemoveExplanatory();
        LOG.info("Deleted explanatory {} id {}, in {} milliseconds ({} sec)", explanatory.getMetadata().get().getRef(), explanatory.getId(), stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
    }

    @Override
    public List<ExportPackageVO> updateExportDocument(String proposalRef, String id, List<String> comments) {
        try {
            Stopwatch stopwatch = Stopwatch.createStarted();
            ExportDocument exportDocument = this.exportPackageService.updateExportDocument(proposalRef, id, comments);
            LOG.info("Export Package {} for proposal {} comments updated in {} milliseconds ({} sec)", id, proposalRef, stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while updating comments for Export Package", e);
        }
        return this.getExportDocuments(proposalRef);

    }

    @Override
    public List<ExportPackageVO> deleteExportDocument(String proposalRef, String id) {
        try {
            Stopwatch stopwatch = Stopwatch.createStarted();
            exportPackageService.deleteExportDocument(id);
            LOG.info("Export Package {} for proposal {} deleted in {} milliseconds ({} sec)", id, proposalRef, stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while deleting Export Package", e);
        }
        return this.getExportDocuments(proposalRef);
    }

    @Override
    public void notifyExportPackage(String proposalRef, String exportId) {
        ExportDocument exportDocument = null;
        LeosExportStatus processedStatus = LeosExportStatus.PROCESSED_ERROR;
        try {
            Stopwatch stopwatch = Stopwatch.createStarted();
            byte[] updatedContent = exportService.updateExportPackageWithComments(exportId);
            exportDocument = exportPackageService.updateExportDocument(exportId, updatedContent);
            exportPackageService.updateExportDocument(exportDocument.getExportRef(), exportDocument.getId(), LeosExportStatus.NOTIFIED);
            notificationService.sendNotification(proposalRef, exportDocument.getId());
            processedStatus = LeosExportStatus.PROCESSED_OK;
            LOG.info("Export Package {} for proposal {} notified in {} milliseconds ({} sec)", exportDocument.getId(), proposalRef, stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while notifiying Export Package", e);
        } finally {
            if (exportDocument != null) {
                exportDocument = exportPackageService.findExportDocumentById(exportDocument.getId(), true);
                if ((exportDocument != null) && (!exportDocument.getStatus().equals(LeosExportStatus.FILE_READY))) {
                    exportDocument = exportPackageService.updateExportDocument(exportDocument.getExportRef(), exportDocument.getId(), processedStatus);
                }
            }
        }
    }

    @Override
    public List<ExportPackageVO> getExportDocuments(String proposalRef) {
        Proposal proposal = this.proposalService.getProposalByRef(proposalRef);
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        List<ExportDocument> exportDocuments = packageService.findDocumentsByPackageId(leosPackage.getId(), ExportDocument.class, false, false);
        List<ExportPackageVO> exportDocumentsVO = new ArrayList<>();
        exportDocuments.forEach(exportDocument -> exportDocumentsVO.add(getExportPackageVO(exportDocument)));
        return exportDocumentsVO;
    }

    @Override
    public byte[] downloadExportPackage(String proposalRef, String exportId) throws Exception {
        byte[] result = null;
        try {
            Stopwatch stopwatch = Stopwatch.createStarted();
            final Map<String, byte[]> exportPackageContent = exportService.getExportPackageContent(exportId, ".docx");
            Optional<Map.Entry<String, byte[]>> first = exportPackageContent.entrySet().stream().findFirst();
            if (first.isPresent()) {
                result = first.get().getValue();
                LOG.info("Export Package {} for proposal {} downloaded in {} milliseconds ({} sec)", exportId, proposalRef, stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
            }
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while downloading Export Package", e);
        }
        if (result == null) throw new Exception("Error when download export document with id");
        return result;
    }

    @Override
    public String exportProposal(String proposalRef, String outputType) throws Exception {
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        ExportOptions.Output output;
        switch (outputType) {
            case "PDF":
                output = ExportOptions.Output.PDF;
                break;
            case "WORD":
                output = ExportOptions.Output.WORD;
                break;
            default:
                throw new RuntimeException("Invalid output type provided");
        }
        ExportOptions exportOptions = new ExportLW(output);
        return exportService.exportToToolboxCoDe(proposal.getId(), exportOptions);
    }

    @Override
    public Optional<DocumentVO> getProposalDetails(String proposalRef) {
        LOG.trace(proposalRef);
        Set<MilestonesVO> milestonesVOs = new TreeSet<>(Comparator.comparing(MilestonesVO::getUpdatedDate).reversed());
        Proposal proposal = null;
        byte[] proposalXmlContent = new byte[0];
        boolean isClonedProposal = false;
        Set<String> docVersionSeriesIds = new HashSet<>();
        String proposalVersionSeriesId = null;
        if (proposalRef != null) {
            proposal = this.proposalService.findProposalByRef(proposalRef);
            if(LOG.isTraceEnabled())
                LOG.trace(proposal.toString());
        }
        if (proposal != null) {
            String proposalId = proposal.getId();
            proposalXmlContent = proposal.getContent().exists(c -> c.getSource() != null)
                    ? proposal.getContent().get().getSource().getBytes()
                    : new byte[0];

            LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposalRef, Proposal.class);
            List<XmlDocument> documents = packageService.findDocumentsByPackagePath(leosPackage.getPath(), XmlDocument.class, false);
            List<LegDocument> legDocuments = packageService.findDocumentsByPackageId(leosPackage.getId(), LegDocument.class, false, false);
            legDocuments.sort(Comparator.comparing(LegDocument::getLastModificationInstant).reversed());
            DocumentVO proposalVO = this.createViewObject(documents, proposalXmlContent, proposalVersionSeriesId, docVersionSeriesIds);
            if (proposal.isClonedProposal()) {
                populateCloneProposalMetadataVO(proposalXmlContent);
                proposalVO.setCloneProposalMetadataVO(cloneContext.getCloneProposalMetadataVO());
            }
            StampedLock milestonesVOsLock = new StampedLock();
            long stamp = milestonesVOsLock.writeLock();
            try {
                milestonesVOs.clear();
                legDocuments.forEach(document -> milestonesVOs.add(getMilestonesVO(document, proposalId, proposalRef)));
            } finally {
                milestonesVOsLock.unlockWrite(stamp);
            }
            return Optional.of(proposalVO);
        }
        //TODO : handle case no proposal
        return Optional.of(null);
    }

    private ExportPackageVO getExportPackageVO(ExportDocument exportDocument) {
        return new ExportPackageVO(exportDocument.getId(), exportDocument.getVersionSeriesId(),
                exportDocument.getCmisVersionLabel(), exportDocument.getComments(),
                Date.from(exportDocument.getLastModificationInstant()),
                messageHelper.getMessage("collection.block.export.package.column.status.value." + exportDocument.getStatus().name()));
    }

    private DocumentVO createViewObject(List<XmlDocument> documents, byte[] proposalXmlContent, String proposalVersionSeriesId, Set<String> docVersionSeriesIds) {
        DocumentVO proposalVO = new DocumentVO(LeosCategory.PROPOSAL);
        List<DocumentVO> annexVOList = new ArrayList<>();
        Set<String> docVerSeriesIds = new HashSet<>();
        //We have the latest version of the document, no need to search for them again
        for (XmlDocument document : documents) {
            switch (document.getCategory()) {
                case PROPOSAL: {
                    Proposal proposal = (Proposal) document;
                    MetadataVO metadataVO = createMetadataVO(proposal);
                    proposalVO.setMetaData(metadataVO);
                    proposalVO.addCollaborators(proposal.getCollaborators());
                    proposalVO.setUpdatedBy(userHelper.convertToPresentation(proposal.getLastModifiedBy()));
                    proposalVO.setCreatedBy(userHelper.convertToPresentation(proposal.getCreatedBy()));
                    proposalVO.setCreatedOn(Date.from(proposal.getInitialCreationInstant()));
                    proposalVO.setUpdatedOn(Date.from(proposal.getLastModificationInstant()));
                    proposalVO.setLanguage(metadataVO.getLanguage());
                    proposalVO.setSource(proposalXmlContent);
                    proposalVO.setRef(proposal.getMetadata().get().getRef());
                    if (proposalXmlContent != null && documentContentService.isCoverPageExists(proposalXmlContent)) {
                        proposalVO.addChildDocument(getCoverPageVO(proposalVO, proposal.getOriginRef()));
                    }
                    break;
                }
                case COUNCIL_EXPLANATORY: {
                    Explanatory explanatory = (Explanatory) document;
                    DocumentVO explanatoryVO = getExplanatroyVO(explanatory);
                    explanatoryVO.addCollaborators(explanatory.getCollaborators());
                    explanatoryVO.getMetadata().setInternalRef(explanatory.getMetadata().getOrError(() -> "Explanatory metadata is not available!").getRef());
                    explanatoryVO.setVersionSeriesId(explanatory.getVersionSeriesId());
                    explanatoryVO.setTemplate(explanatory.getMetadata().getOrError(() -> "Explanatory metadata is not available!").getTemplate());
                    explanatoryVO.setUpdatedBy(userHelper.convertToPresentation(explanatoryVO.getUpdatedBy()));
                    explanatoryVO.setCreatedBy(userHelper.convertToPresentation(explanatoryVO.getCreatedBy()));
                    proposalVO.addChildDocument(explanatoryVO);
                    docVerSeriesIds.add(explanatory.getVersionSeriesId());
                    break;
                }
                case MEMORANDUM: {
                    Memorandum memorandum = (Memorandum) document;
                    DocumentVO memorandumVO = getMemorandumVO(memorandum);
                    memorandumVO.setRef(memorandum.getMetadata().get().getRef());
                    proposalVO.addChildDocument(memorandumVO);
                    memorandumVO.addCollaborators(memorandum.getCollaborators());
                    memorandumVO.getMetadata().setInternalRef(memorandum.getMetadata().getOrError(() -> "Memorandum metadata is not available!").getRef());
                    memorandumVO.setVersionSeriesId(memorandum.getVersionSeriesId());
                    memorandumVO.setUpdatedBy(userHelper.convertToPresentation(memorandumVO.getUpdatedBy()));
                    memorandumVO.setCreatedBy(userHelper.convertToPresentation(memorandumVO.getCreatedBy()));
                    docVerSeriesIds.add(memorandum.getVersionSeriesId());
                    break;
                }
                case BILL: {
                    Bill bill = (Bill) document;
                    DocumentVO billVO = getLegalTextVO(bill);
                    billVO.setRef(bill.getMetadata().get().getRef());
                    proposalVO.addChildDocument(billVO);
                    billVO.addCollaborators(bill.getCollaborators());
                    billVO.getMetadata().setInternalRef(bill.getMetadata().getOrError(() -> "Legal text metadata is not available!").getRef());
                    billVO.setVersionSeriesId(bill.getVersionSeriesId());
                    billVO.setUpdatedBy(userHelper.convertToPresentation(billVO.getUpdatedBy()));
                    billVO.setCreatedBy(userHelper.convertToPresentation(billVO.getCreatedBy()));
                    docVerSeriesIds.add(bill.getVersionSeriesId());
                    break;
                }
                case ANNEX: {
                    Annex annex = (Annex) document;
                    DocumentVO annexVO = createAnnexVO(annex);
                    annexVO.addCollaborators(annex.getCollaborators());
                    annexVO.getMetadata().setInternalRef(annex.getMetadata().getOrError(() -> "Annex metadata is not available!").getRef());
                    annexVOList.add(annexVO);
                    annexVO.setVersionSeriesId(annex.getVersionSeriesId());
                    annexVO.setUpdatedBy(userHelper.convertToPresentation(annexVO.getUpdatedBy()));
                    annexVO.setCreatedBy(userHelper.convertToPresentation(annexVO.getCreatedBy()));
                    docVerSeriesIds.add(annex.getVersionSeriesId());
                    break;
                }
                case STAT_FINANC_LEGIS: {
                    FinancialStatement financialStatement = (FinancialStatement) document;
                    DocumentVO financialStatementVO = createFinancialStatementVO(financialStatement);
                    proposalVO.addChildDocument(financialStatementVO);
                    financialStatementVO.addCollaborators(financialStatement.getCollaborators());
                    financialStatementVO.getMetadata()
                            .setInternalRef(financialStatement.getMetadata().getOrError(() -> "financialStatement metadata is not available!").getRef());
                    financialStatementVO.setVersionSeriesId(financialStatement.getVersionSeriesId());
                    financialStatementVO.setUpdatedBy(userHelper.convertToPresentation(financialStatementVO.getUpdatedBy()));
                    financialStatementVO.setCreatedBy(userHelper.convertToPresentation(financialStatementVO.getCreatedBy()));
                    docVersionSeriesIds.add(financialStatement.getVersionSeriesId());
                    break;
                }
                default:
                    LOG.debug("Do nothing for rest of the categories like MEDIA, CONFIG & LEG");
                    break;
            }
        }
        annexVOList.sort(Comparator.comparingInt(DocumentVO::getDocNumber));
        DocumentVO legalText = proposalVO.getChildDocument(LeosCategory.BILL);
        if (legalText != null) {
            for (DocumentVO annexVO : annexVOList) {
                legalText.addChildDocument(annexVO);
            }
        }
        return proposalVO;
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

    private DocumentVO getExplanatroyVO(Explanatory explanatory) {
        DocumentVO explanatoryVO = new DocumentVO(explanatory.getId(),
                explanatory.getMetadata().exists(e -> e.getLanguage() != null) ? explanatory.getMetadata().get().getLanguage() : "EN",
                LeosCategory.COUNCIL_EXPLANATORY,
                explanatory.getLastModifiedBy(),
                Date.from(explanatory.getLastModificationInstant()), explanatory.isTrackChangesEnabled());

        if (explanatory.getMetadata().isDefined()) {
            ExplanatoryMetadata metadata = explanatory.getMetadata().get();
            explanatoryVO.setTitle(metadata.getTitle());
            explanatoryVO.setRef(explanatory.getMetadata().get().getRef());
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

    private MetadataVO createMetadataVO(Proposal proposal) {
        ProposalMetadata metadata = proposal.getMetadata().getOrError(() -> "Proposal metadata is not available!");
        return new MetadataVO(metadata.getStage(), metadata.getType(), metadata.getPurpose(), metadata.getTemplate(), metadata.getLanguage(), metadata.getEeaRelevance());
    }

    private LegDocument getLegDocument(String legFileName, LeosPackage leosPackage) {
        return packageService.findDocumentByPackagePathAndName(leosPackage.getPath(), legFileName, LegDocument.class);
    }

    private List<Annex> getAnnexes(LeosPackage leosPackage) {
        return packageService.findDocumentsByPackagePath(leosPackage.getPath(), Annex.class, false);
    }

    @Override
    public void createProposalAnnex(String proposalRef) throws IOException {
        LOG.trace("Creating annex...");
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);
        if (proposal != null) {
            boolean isClonedProposal = proposal.isClonedProposal();
            try {
                populateTrackChangesContext(proposal);
                LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposalRef, Proposal.class);
                Bill bill = billService.findBillByPackagePath(leosPackage.getPath());
                BillMetadata metadata = bill.getMetadata().getOrError(() -> "Bill metadata is required!");
                BillContextService billContext = billContextProvider.get();
                billContext.usePackage(leosPackage);
                billContext.useTemplate(bill);
                billContext.usePurpose(metadata.getPurpose());
                billContext.useActionMessage(ContextActionService.ANNEX_METADATA_UPDATED, messageHelper.getMessage(COLLECTION_BLOCK_ANNEX_METADATA_UPDATED));
                billContext.useActionMessage(ContextActionService.ANNEX_ADDED, messageHelper.getMessage("collection.block.annex.added"));
                billContext.useActionMessage(ContextActionService.DOCUMENT_CREATED, messageHelper.getMessage("operation.document.created"));

                CatalogItem templateItem = templateService.getTemplateItem(metadata.getDocTemplate());
                String annexTemplate = templateItem.getItems().get(0).getId();
                billContext.useAnnexTemplate(annexTemplate);
                billContext.useCloneProposal(isClonedProposal);
                billContext.useOriginRef(cloneOriginRef);
                billContext.executeCreateBillAnnex();
            } catch (Exception e) {
                LOG.error("Unexpected error occurred while creating new annex", e);
                throw e;
            }
        }
    }

    private boolean identifyContributionChanges(String clonedProposalRef, String clonedLegFileName) {
        Validate.notNull(clonedProposalRef, "Cloned proposal ref should not be null");
        Validate.notNull(clonedLegFileName, "Cloned leg file name should not be null");
        Proposal proposal = proposalService.getProposalByRef(clonedProposalRef);
        LeosPackage clonedLeosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        LegDocument clonedLegDocument = getLegDocument(clonedLegFileName, clonedLeosPackage);
        LeosPackage originalLeosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        String originalLegName = proposalService.getOriginalMilestoneName(proposal.getName(), proposal.getContent().get().getSource().getBytes());
        LegDocument originalLegDocument = getLegDocument(originalLegName, originalLeosPackage);
        boolean contributionChanged = false;
        if (clonedLegDocument != null && originalLegDocument != null) {
            File legFileTemp = null;
            File originalLegFileTemp = null;
            try {
                legFileTemp = File.createTempFile(MILESTONE, ".leg");
                Map<String, Object> contributionFiles = MilestoneHelper.getMilestoneFiles(legFileTemp, clonedLegDocument);
                Map<String, Object> annexAddedMap = MilestoneHelper.populateAnnexAddedMap(contributionFiles, clonedLegDocument, getAnnexes(originalLeosPackage),
                        xmlContentProcessor);
                if (annexAddedMap != null && annexAddedMap.size() > 0) {
                    contributionChanged = true;
                } else {
                    originalLegFileTemp = File.createTempFile("milestoneOriginal", ".leg");
                    Map<String, Object> originalDocumentFiles = MilestoneHelper.getMilestoneFiles(originalLegFileTemp, originalLegDocument);
                    Map<String, Object> annexDeletedMap = MilestoneHelper.populateAnnexDeletedMap(originalDocumentFiles,
                            contributionFiles, originalLegDocument, getAnnexes(originalLeosPackage), xmlContentProcessor);
                    if (annexDeletedMap != null && annexDeletedMap.size() > 0) {
                        contributionChanged = true;
                    }
                }
            } catch (IOException e) {
                LOG.error("Exception occurred while deleting the file from file system" + e);
            } finally {
                try {
                    MilestoneHelper.deleteTempFilesIfExists(legFileTemp);
                } catch (IOException e) {
                    LOG.error("Exception occurred while deleting the file from file system" + e);
                }
            }
        }
        return contributionChanged;
    }

    @Override
    public List<MilestonesVO> getProposalMilestones(String proposalRef) {
        List<MilestonesVO> milestonesVOS = new ArrayList<>();
        String proposalId = null;
        byte[] proposalXmlContent = new byte[0];
        boolean isClonedProposal = false;
        if (proposalRef != null) {
            Proposal proposal = proposalService.findProposalByRef(proposalRef);
            if (proposal != null) {
                proposalId = proposal.getId();
                proposalXmlContent = proposal.getContent().exists(c -> c.getSource() != null) ?
                        proposal.getContent().get().getSource().getBytes() :
                        new byte[0];
                isClonedProposal = proposal.isClonedProposal();
            }
        }
        if (isClonedProposal) {
            populateCloneProposalMetadataVO(proposalXmlContent);
        }
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposalRef, Proposal.class);
        List<XmlDocument> documents = packageService.findDocumentsByPackagePath(leosPackage.getPath(), XmlDocument.class, false);
        List<LegDocument> legDocuments = packageService.findDocumentsByPackageId(leosPackage.getId(), LegDocument.class, false, false);
        legDocuments.sort(Comparator.comparing(LegDocument::getLastModificationInstant).reversed());
        try {
            String finalProposalId = proposalId;
            legDocuments.forEach(document -> milestonesVOS.add(getMilestonesVO(document, finalProposalId, proposalRef)));
        } catch (Exception e) {
            LOG.error("Error while getting milestones for proposal " + e);
            throw e;
        }
        return milestonesVOS;
    }


    private MilestonesVO getMilestonesVO(LegDocument legDocument, String proposalId, String proposalRef) {
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        List<CloneProposalMetadataVO> cloneProposalMetadataVOs = proposalService.getClonedProposalMetadataVOs(proposalId, legDocument.getName());
        MilestonesVO milestonesVO = new MilestonesVO(legDocument.getMilestoneComments(),
                Date.from(legDocument.getCreationInstant()),
                Date.from(legDocument.getLastModificationInstant()),
                legDocument.getStatus().name(),
                legDocument.getName(), proposalRef, proposal.getTitle(), legDocument.getId());
        milestonesVO.setCreatedBy(userHelper.convertToPresentation(legDocument.getInitialCreatedBy()));
        if (cloneProposalMetadataVOs != null && !cloneProposalMetadataVOs.isEmpty()) {
            List<MilestonesVO> clonedMilestonesVOS = new ArrayList<>();
            cloneProposalMetadataVOs.forEach(cpmVo -> {
                List<String> titles = new ArrayList<>();
                titles.add(messageHelper.getMessage("clone.proposal.contribution.sent").concat(" ").
                        concat(userService.getUser(cpmVo.getTargetUser()).getName()));
                MilestonesVO milestoneVO = new MilestonesVO(titles, cpmVo.getCreationDate(),
                        null, cpmVo.getRevisionStatus(),
                        cpmVo.getLegFileName(), cpmVo.getCloneProposalRef(), proposal.getTitle(), legDocument.getId());
                milestoneVO.setClone(true);
                if (cpmVo.getRevisionStatus().equalsIgnoreCase(
                        messageHelper.getMessage("clone.proposal.status.contribution.done")) &&
                        identifyContributionChanges(cpmVo.getCloneProposalRef(), cpmVo.getLegFileName())) {
                    milestoneVO.setContributionChanged(true);
                }
                clonedMilestonesVOS.add(milestoneVO);
            });
            milestonesVO.setClonedMilestones(clonedMilestonesVOS);
        }
        return milestonesVO;
    }

    @Override
    public void deleteAnnex(String proposalRef, String annexRef) {
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);
        Annex annex = this.annexService.findAnnexByRef(annexRef);
        DocumentVO annexVO = createAnnexVO(annexService.findAnnexByRef(annexRef));

        if (proposal != null) {
            LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
            BillContextService billContext = billContextProvider.get();
            billContext.useAnnexwithRef(annexRef);
            billContext.useAnnex(annex.getId());
            billContext.usePackage(leosPackage);
            billContext.useActionMessage(ContextActionService.ANNEX_METADATA_UPDATED, messageHelper.getMessage(COLLECTION_BLOCK_ANNEX_METADATA_UPDATED));
            billContext.useActionMessage(ContextActionService.ANNEX_DELETED, messageHelper.getMessage("collection.block.annex.removed"));
            try {
                archiveService.archiveDocument(annexVO, Annex.class, leosPackage.getPath());
            } catch (Exception e) {
                LOG.error("Error while using archive service {}", e.getMessage());
            }
            billContext.executeRemoveBillAnnex();
        }
    }

    @Override
    public void updateAnnexOrder(String proposalRef, String annexRef, String moveDirection, Integer timesToMove) {
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);
        if (proposal != null) {
            for (int i = 0; i < timesToMove; i++) {
                LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
                BillContextService billContext = billContextProvider.get();
                billContext.useAnnexwithRef(annexRef);
                billContext.usePackage(leosPackage);
                billContext.useMoveDirection(moveDirection);
                billContext.useActionMessage(ContextActionService.ANNEX_METADATA_UPDATED, messageHelper.getMessage(COLLECTION_BLOCK_ANNEX_METADATA_UPDATED));
                billContext.executeMoveAnnex();
            }

        }
    }

    @Override
    public void updateAnnexTitle(String proposalRef, String annexId, String annexTitle) {
        Annex annex = annexService.findAnnex(annexId, true);
        AnnexMetadata metadata = annex.getMetadata().getOrError(() -> "Annex metadata not found!");
        AnnexMetadata updatedMetadata = metadata.builder().withTitle(annexTitle).build();
        annexService.updateAnnex(annex, updatedMetadata, VersionType.MINOR, messageHelper.getMessage(COLLECTION_BLOCK_ANNEX_METADATA_UPDATED));
    }

    @Override
    public void updateExplanatoryTitle(String proposalRef, String docId, String title) {
        Explanatory explanatory = explanatoryService.findExplanatory(docId);
        ExplanatoryMetadata metadata = explanatory.getMetadata().getOrError(() -> "Explanatory metadata not found!");
        ExplanatoryMetadata updatedMetadata = metadata.builder().withTitle(title).build();
        explanatoryService.updateExplanatory(explanatory, updatedMetadata, VersionType.MINOR, messageHelper.getMessage("collection.block.explanatory.metadata.updated"));
    }

    private void createMajorVersions(String proposalRef, String milestoneComment, String versionComment, CollectionContextService context) {
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);
        context.useProposal(proposal);
        context.useMilestoneComment(milestoneComment);
        context.useVersionComment(versionComment);
        context.executeCreateMilestone();
    }

    @Override
    public LegDocument createMilestone(String proposalRef, String milestoneComment) throws Exception {
        LOG.trace(("Creating new milestone..."));
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);
        if (proposal != null) {
            String proposalId = proposal.getId();
            byte[] proposalXmlContent = proposal.getContent().exists(c -> c.getSource() != null) ?
                    proposal.getContent().get().getSource().getBytes() : new byte[0];
            boolean isClonedProposal = proposal.isClonedProposal();
            try {
                final String versionComment = messageHelper.getMessage("milestone.versionComment");
                createMajorVersions(proposalRef, milestoneComment, versionComment, collectionContextProvider.get());
                LegDocument newLegDocument = milestoneService.createMilestone(proposalId, milestoneComment);
            } catch (Exception e) {
                LOG.error("Unexpected error occurred while creating new milestone ", e);
                throw e;
            }
        }
        return null;
    }

    @Override
    public MilestoneViewResponse listMilestoneDocuments(String proposalRef, String legFileName) throws IOException {
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);

        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        LegDocument legDocument = getLegDocument(legFileName, leosPackage);
        return doListMilestoneDocuments(legDocument);
    }

    @Override
    public MilestoneViewResponse listMilestoneDocumentsFromVersionRef(String proposalRef, String versionedReference) throws IOException {
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);

        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        LegDocument legDocument = this.legService.findLastLegByVersionedReference(leosPackage.getPath(), versionedReference);
        return doListMilestoneDocuments(legDocument);
    }

    @Override
    public MilestoneViewResponse listContributionsView(String proposalRef, String legFilename) throws IOException {
        Proposal proposal = this.proposalService.getProposalByRef(proposalRef);

        LeosPackage clonedLeosPackage = packageService.findPackageByDocumentId(proposal.getId());
        LegDocument clonedLegDocument = getLegDocument(legFilename, clonedLeosPackage);
        return doListMilestoneDocuments(clonedLegDocument);
    }

    private MilestoneViewResponse doListMilestoneDocuments(LegDocument legDocument) throws IOException {
        File legFileTemp = File.createTempFile(MILESTONE, ".leg");
        Map<String, Object> unzippedFiles = MilestoneHelper.getMilestoneFiles(legFileTemp, legDocument);
        Map<String, Object> contentFiles = MilestoneHelper.filterAndSortFiles(unzippedFiles, HTML);
        Map<String, Object> annexAddedMap = new HashMap<>();
        Map<String, Object> annexDeletedMap = new HashMap<>();

        String milestoneDir = MilestoneHelper.getMilestoneDir(legFileTemp);
        Map<String, Object> jsFiles = MilestoneHelper.filterAndSortFiles(unzippedFiles, TOC_JS);
        Map<String, Map> versionAndAnnexNumberMap = populateVersionAndAnnexNumberMap(unzippedFiles);
        Map<String, String> docVersionMap = versionAndAnnexNumberMap.get("docVersionMap");
        Map<Integer, String> annexIndexesMap = versionAndAnnexNumberMap.get("annexIndexesMap");
        Map<String, Integer> annexKeyMap = versionAndAnnexNumberMap.get("annexKeyMap");
        Map<String, Object> pdfRenditions = MilestoneHelper.filterAndSortFiles(unzippedFiles, PDF);

        List<MilestoneDocumentView> listDocuments = new ArrayList<>();
        HashMap<String, Boolean> annexesComparaison = new HashMap();
        for (Map.Entry<String, Object> entry : contentFiles.entrySet()) {
            String key = entry.getKey();
            String mainFileName = docVersionMap.keySet().stream().filter(value -> value.startsWith(MAIN_DOCUMENT_FILE_NAME)).findFirst().orElse("");
            String contentFileName = key.startsWith(COVER_PAGE_CONTENT_FILE_NAME) ? mainFileName : key.substring(0, key.indexOf(HTML));
            String version = docVersionMap.get(contentFileName);
            boolean isCoverPage = key.startsWith(COVER_PAGE_CONTENT_FILE_NAME);
            boolean isCompared = false;
            try {
                byte[] xmlBytes = Files.readAllBytes(((File) entry.getValue()).toPath());
                String xmlContent = LeosDomainUtil.wrapXmlFragment(new String(xmlBytes));
                String tocFile = null;
                MilestoneDocumentView milestoneView = new MilestoneDocumentView(xmlContent, version, contentFileName, isCoverPage);
                if (isCoverPage) {
                    milestoneView.setLeosCategory(LeosCategory.COVERPAGE);
                    tocFile = "coverPage_toc.js";
                } else {
                    tocFile = contentFileName + TOC_JS;
                    LeosCategory category = xmlContentProcessor.identifyCategory(key,
                            xmlContent.getBytes(StandardCharsets.UTF_8));
                    milestoneView.setLeosCategory(category);
                    if (category.equals(LeosCategory.ANNEX)) {
                        milestoneView.setOrder(annexKeyMap.get(contentFileName));
                        annexesComparaison.put((entry.getKey()), isCompared);
                    }
                }
                File toc = (File) unzippedFiles.get(tocFile);
                if (toc.exists()) {
                    milestoneView.setTocData(this.buildTocTree(toc));
                }
                listDocuments.add(milestoneView);
            } catch (Exception e) {
                LOG.error("Error when trying to get milestone view {}", e.getMessage(), e.getMessage());
            }
        }
        return new MilestoneViewResponse(listDocuments, !pdfRenditions.isEmpty());
    }

    @Override
    public MilestonePDFDownloadResponse downloadMilestonePDF(String proposalRef, String legFileName) throws IOException {
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        LegDocument legDocument = getLegDocument(legFileName, leosPackage);
        return doDownloadMilestonePDF(legDocument);
    }

    @Override
    public MilestonePDFDownloadResponse downloadMilestonePDFFromVersion(String proposalRef, String versionedReference) throws IOException {
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        LegDocument legDocument = this.legService.findLastLegByVersionedReference(leosPackage.getPath(), versionedReference);
        return doDownloadMilestonePDF(legDocument);
    }

    private MilestonePDFDownloadResponse doDownloadMilestonePDF(LegDocument legDocument) throws IOException {
        byte[] content = null;
        File legFileTemp = File.createTempFile(MILESTONE, ".leg");
        Map<String, Object> unzippedFiles = MilestoneHelper.getMilestoneFiles(legFileTemp, legDocument);
        Map<String, Object> pdfRenditions = MilestoneHelper.filterAndSortFiles(unzippedFiles, PDF);
        String fileName = null;
        if (!pdfRenditions.isEmpty()) {
            Map.Entry<String, Object> entry = pdfRenditions.entrySet().iterator().next();
            content = Files.readAllBytes(((File) entry.getValue()).toPath());
            fileName = ((File) entry.getValue()).getName();
        }
        return new MilestonePDFDownloadResponse(content, fileName);
    }

    private static String readFileToString(File file) throws IOException {
        return new String(Files.readAllBytes(file.toPath()), StandardCharsets.UTF_8);
    }

    private Map<String, Map> populateVersionAndAnnexNumberMap(Map<String, Object> files) {
        Map<String, Map> docVersionAndAnnexNumberMap = new HashMap<>();
        Map<String, String> docVersionMap = new HashMap<>();
        Map<Integer, String> annexIndexesMap = new HashMap<>();
        Map<String, Integer> annexKeyMap = new HashMap<>();
        Map<String, Object> xmlFiles = MilestoneHelper.filterAndSortFiles(files, XML);
        xmlFiles.forEach((key, value) -> {
            try {
                String xmlContent = readFileToString(((File) value));
                Pattern pattern = Pattern.compile(DOC_VERSION_START_TAG_REG);
                Matcher matcher = pattern.matcher(xmlContent);
                String selectedKey = key.substring(0, key.indexOf(XML));
                while (matcher.find()) {
                    int endIndex = xmlContent.indexOf(DOC_VERSION_END_TAG);
                    String docVersion = xmlContent.substring(matcher.end(), endIndex);
                    docVersionMap.put(selectedKey, docVersion);
                }
                Pattern patternForAnnexIndex = Pattern.compile(DOC_NUMBER_START_TAG_REG);
                Matcher matcherForAnnexIndex = patternForAnnexIndex.matcher(xmlContent);
                if (matcherForAnnexIndex.find()) {
                    int endAnnexIndex = xmlContent.indexOf(DOC_NUMBER_END_TAG);
                    String annexIndex = xmlContent.substring(matcherForAnnexIndex.end(), endAnnexIndex);
                    annexIndexesMap.put(new Integer(annexIndex), selectedKey);
                    annexKeyMap.put(selectedKey, new Integer(annexIndex));
                }
            } catch (IOException e) {
                LOG.error("Exception occurred while reading the .leg file " + e);
            }
        });
        docVersionAndAnnexNumberMap.put("docVersionMap", docVersionMap);
        docVersionAndAnnexNumberMap.put("annexIndexesMap", annexIndexesMap);
        docVersionAndAnnexNumberMap.put("annexKeyMap", annexKeyMap);
        return docVersionAndAnnexNumberMap;
    }

    private String buildTocTree(File file) {
        String fileData = "";
        try {
            fileData = readFileToString(file);
            fileData = fileData.substring(fileData.indexOf("["), fileData.length() - 1);
            return fileData;
        } catch (IOException e) {
            LOG.error("Exception occurred while reading the file", e);
        }
        return fileData;
    }

    private void populateTrackChangesContext(XmlDocument document) {
        this.trackChangesContext.setTrackChangesEnabled(document.isTrackChangesEnabled());
    }

    private void populateCloneProposalMetadataVO(byte[] xmlContent) {
        CloneProposalMetadataVO cloneProposalMetadataVO = proposalService.getClonedProposalMetadata(xmlContent);
        cloneContext.setCloneProposalMetadataVO(cloneProposalMetadataVO);
    }
}
