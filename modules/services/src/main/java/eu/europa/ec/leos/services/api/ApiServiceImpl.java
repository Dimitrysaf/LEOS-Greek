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

import eu.europa.ec.leos.domain.cmis.LeosCategory;
import eu.europa.ec.leos.domain.cmis.LeosLegStatus;
import eu.europa.ec.leos.domain.cmis.LeosPackage;
import eu.europa.ec.leos.domain.cmis.common.VersionType;
import eu.europa.ec.leos.domain.cmis.document.Annex;
import eu.europa.ec.leos.domain.cmis.document.Bill;
import eu.europa.ec.leos.domain.cmis.document.Explanatory;
import eu.europa.ec.leos.domain.cmis.document.LegDocument;
import eu.europa.ec.leos.domain.cmis.document.LeosDocument;
import eu.europa.ec.leos.domain.cmis.document.Memorandum;
import eu.europa.ec.leos.domain.cmis.document.Proposal;
import eu.europa.ec.leos.domain.cmis.document.XmlDocument;
import eu.europa.ec.leos.domain.cmis.metadata.AnnexMetadata;
import eu.europa.ec.leos.domain.cmis.metadata.BillMetadata;
import eu.europa.ec.leos.domain.cmis.metadata.ExplanatoryMetadata;
import eu.europa.ec.leos.domain.cmis.metadata.ProposalMetadata;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.vo.*;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.integration.rest.UserJSON;
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
import eu.europa.ec.leos.services.document.*;
import eu.europa.ec.leos.services.dto.request.FilterProposalsRequest;
import eu.europa.ec.leos.services.dto.request.UpdateProposalRequest;
import eu.europa.ec.leos.services.dto.response.AppConfigResponse;
import eu.europa.ec.leos.services.dto.response.LegFileValidation;
import eu.europa.ec.leos.services.dto.response.WorkspaceProposalResponse;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.milestone.MilestoneService;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.store.ArchiveService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.store.TemplateService;
import eu.europa.ec.leos.services.store.WorkspaceService;
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.services.validation.ValidationService;
import eu.europa.ec.leos.vo.catalog.CatalogItem;
import eu.europa.ec.leos.vo.toc.AlternateConfig;
import eu.europa.ec.leos.vo.toc.NumberingConfig;
import io.micrometer.core.instrument.util.StringUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.locks.StampedLock;

@Service
public class ApiServiceImpl implements ApiService {
    private static final Logger LOG = LoggerFactory.getLogger(ApiServiceImpl.class);

    private final TemplateService templateService;
    private final WorkspaceService workspaceService;
    private final UserService userService;
    private final CreateCollectionService createCollectionService;
    private final SecurityContext securityContext;
    private final LeosPermissionAuthorityMap authorityMap;
    private final ProposalService proposalService;
    private final PackageService packageService;
    private final ExportService exportService;
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
                          ValidationService validationService, Properties applicationProperties) {
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
    public LegFileValidation validateLegFile(File legDocument)  {
        LegFileValidation legFileValidation = new LegFileValidation();
        DocumentVO proposal = new DocumentVO(LeosCategory.PROPOSAL);
        DocumentVO updatedDocumentVO = proposalConverterService.createProposalFromLegFile(legDocument, proposal, true);
        Result result = postProcessingDocumentService.processDocument(updatedDocumentVO);
        if(result.isOk()) {
                legFileValidation.setDocumentToBeCreated(updatedDocumentVO);
                ValidationVO validation = new ValidationVO();
                validation.addErrors(validationService.validateDocument(updatedDocumentVO));
                if(validation.hasErrors()) {
                    legFileValidation.setErrors(validation.getErrors());
                }
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
    private String getJobFileName(String proposalRef) {
        StringBuilder strBuilder = new StringBuilder();
        strBuilder.append("Proposal_");
        strBuilder.append(proposalRef);
        strBuilder.append(".zip");
        return strBuilder.toString();
    }
    @Override
    public byte[] downloadProposal(String proposalRef) throws Exception {
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        String jobFileName = getJobFileName(proposalRef);
        File packageFile;
        try {
            packageFile = exportService.createCollectionPackage(jobFileName, proposal.getId(), new ExportLW(ExportOptions.Output.WORD));
            return FileUtils.readFileToByteArray(packageFile);
        }catch( Exception e){
            LOG.error("Unexpected error occurred while downloading proposal - ", e.getMessage());
            throw e;
        }
    }
    @Override
    public void deleteCollection(String proposalRef) {
        CollectionContextService context = collectionContextProvider.get();
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        context.useProposal(proposal);
        context.executeDeleteProposal();
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
        } catch(Exception e) {
            LOG.error("Unexpected error occurred while creating the explanatory", e);
            throw e;
        }
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
        String jobId = exportService.exportToToolboxCoDe(proposal.getId(), exportOptions);
        return jobId;
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
        CloneProposalMetadataVO cloneProposalMetadataVO = new CloneProposalMetadataVO();
        if(proposalRef != null) {
            proposal = this.proposalService.findProposalByRef(proposalRef);
            LOG.trace(proposal.toString());
        }
        if(proposal !=null) {
            String proposalId = proposal.getId();
            proposalXmlContent = proposal.getContent().exists(c -> c.getSource() !=null)
                    ? proposal.getContent().get().getSource().getBytes()
                    : new byte[0];
            isClonedProposal = proposal.isClonedProposal();
            if(isClonedProposal) {
                cloneProposalMetadataVO = proposalService.getClonedProposalMetadata(proposalXmlContent);
                cloneContext.setCloneProposalMetadataVO(cloneProposalMetadataVO);
            }
            LeosPackage leosPackage = packageService.findPackageByDocumentId(proposalId);
            List<XmlDocument> documents = packageService.findDocumentsByPackagePath(leosPackage.getPath(), XmlDocument.class, false);
            List<LegDocument> legDocuments = packageService.findDocumentsByPackageId(leosPackage.getId(), LegDocument.class, false, false);
            legDocuments.sort(Comparator.comparing(LegDocument::getLastModificationInstant).reversed());
            DocumentVO proposalVO =   this.createViewObject(documents,proposalXmlContent,proposalVersionSeriesId,docVersionSeriesIds);
            proposalVO.setCloneProposalMetadataVO(cloneProposalMetadataVO);
            StampedLock milestonesVOsLock = new StampedLock();
            long stamp = milestonesVOsLock.writeLock();
            try {
                milestonesVOs.clear();
                legDocuments.forEach(document -> milestonesVOs.add(getMilestonesVO(document,proposalId,proposalRef)));
            } finally {
                milestonesVOsLock.unlockWrite(stamp);
            }
            return  Optional.of(proposalVO);
        }
        //TODO : handle case no proposal
        return Optional.of(null);
    }
    //TODO : probably this code should be moved somewhere else
    private DocumentVO createViewObject(List<XmlDocument> documents, byte[] proposalXmlContent,String proposalVersionSeriesId,Set<String> docVersionSeriesIds) {
        DocumentVO proposalVO = new DocumentVO(LeosCategory.PROPOSAL);
        List<DocumentVO> annexVOList = new ArrayList<>();
        docVersionSeriesIds = new HashSet<>();
        //We have the latest version of the document, no need to search for them again
        for (XmlDocument document : documents) {
            switch (document.getCategory()) {
                case PROPOSAL: {
                    Proposal proposal = (Proposal) document;
                    MetadataVO metadataVO = createMetadataVO(proposal);
                    proposalVO.setMetaData(metadataVO);
                    proposalVO.addCollaborators(proposal.getCollaborators());
                    proposalVersionSeriesId = proposal.getVersionSeriesId();
                    proposalVO.setUpdatedBy(proposal.getLastModifiedBy());
                    proposalVO.setUpdatedOn(Date.from(proposal.getLastModificationInstant()));
                    proposalVO.setLanguage(metadataVO.getLanguage());
                    proposalVO.setSource(proposalXmlContent);
                    if (proposalXmlContent != null && documentContentService.isCoverPageExists(proposalXmlContent)) {
                        proposalVO.addChildDocument(getCoverPageVO(proposalVO,proposal.getOriginRef()));
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
                    proposalVO.addChildDocument(explanatoryVO);
                    docVersionSeriesIds.add(explanatory.getVersionSeriesId());
                    break;
                }
                case MEMORANDUM: {
                    Memorandum memorandum = (Memorandum) document;
                    DocumentVO memorandumVO = getMemorandumVO(memorandum);
                    proposalVO.addChildDocument(memorandumVO);
                    memorandumVO.addCollaborators(memorandum.getCollaborators());
                    memorandumVO.getMetadata().setInternalRef(memorandum.getMetadata().getOrError(() -> "Memorandum metadata is not available!").getRef());
                    memorandumVO.setVersionSeriesId(memorandum.getVersionSeriesId());
                    docVersionSeriesIds.add(memorandum.getVersionSeriesId());
                    break;
                }
                case BILL: {
                    Bill bill = (Bill) document;
                    DocumentVO billVO = getLegalTextVO(bill);
                    proposalVO.addChildDocument(billVO);
                    billVO.addCollaborators(bill.getCollaborators());
                    billVO.getMetadata().setInternalRef(bill.getMetadata().getOrError(() -> "Legal text metadata is not available!").getRef());
                    billVO.setVersionSeriesId(bill.getVersionSeriesId());
                    docVersionSeriesIds.add(bill.getVersionSeriesId());
                    break;
                }
                case ANNEX: {
                    Annex annex = (Annex) document;
                    DocumentVO annexVO = createAnnexVO(annex);
                    annexVO.addCollaborators(annex.getCollaborators());
                    annexVO.getMetadata().setInternalRef(annex.getMetadata().getOrError(() -> "Annex metadata is not available!").getRef());
                    annexVOList.add(annexVO);
                    annexVO.setVersionSeriesId(annex.getVersionSeriesId());
                    docVersionSeriesIds.add(annex.getVersionSeriesId());
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

    // FIXME refine
    private DocumentVO getExplanatroyVO(Explanatory explanatory) {
        DocumentVO explanatoryVO = new DocumentVO(explanatory.getId(),
                explanatory.getMetadata().exists(e -> e.getLanguage() != null) ? explanatory.getMetadata().get().getLanguage() : "EN",
                LeosCategory.COUNCIL_EXPLANATORY,
                explanatory.getLastModifiedBy(),
                Date.from(explanatory.getLastModificationInstant()));

        if (explanatory.getMetadata().isDefined()) {
            ExplanatoryMetadata metadata = explanatory.getMetadata().get();
            explanatoryVO.setTitle(metadata.getTitle());
        }

        return explanatoryVO;
    }

    // FIXME refine
    private DocumentVO getMemorandumVO(Memorandum memorandum) {
        return new DocumentVO(memorandum.getId(),
                memorandum.getMetadata().exists(m -> m.getLanguage() != null) ? memorandum.getMetadata().get().getLanguage() : "EN",
                LeosCategory.MEMORANDUM,
                memorandum.getLastModifiedBy(),
                Date.from(memorandum.getLastModificationInstant()));
    }

    // FIXME refine
    private DocumentVO getLegalTextVO(Bill bill) {
        return new DocumentVO(bill.getId(),
                bill.getMetadata().exists(m -> m.getLanguage() != null) ? bill.getMetadata().get().getLanguage() : "EN",
                LeosCategory.BILL,
                bill.getLastModifiedBy(),
                Date.from(bill.getLastModificationInstant()));
    }

    // FIXME refine
    private DocumentVO createAnnexVO(Annex annex) {
        DocumentVO annexVO =
                new DocumentVO(annex.getId(),
                        annex.getMetadata().exists(m -> m.getLanguage() != null) ? annex.getMetadata().get().getLanguage() : "EN",
                        LeosCategory.ANNEX,
                        annex.getLastModifiedBy(),
                        Date.from(annex.getLastModificationInstant()));

        if (annex.getMetadata().isDefined()) {
            AnnexMetadata metadata = annex.getMetadata().get();
            annexVO.setDocNumber(metadata.getIndex());
            annexVO.setTitle(metadata.getTitle());
            annexVO.getMetadata().setNumber(metadata.getNumber());
        }

        return annexVO;
    }

    // FIXME refine
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
            String proposalId = proposal.getId();
            try {
                LeosPackage leosPackage = packageService.findPackageByDocumentId(proposalId);
                Bill bill = billService.findBillByPackagePath(leosPackage.getPath());
                BillMetadata metadata = bill.getMetadata().getOrError(() -> "Bill metadata is required!");
                BillContextService billContext = billContextProvider.get();
                billContext.usePackage(leosPackage);
                billContext.useTemplate(bill);
                billContext.usePurpose(metadata.getPurpose());
                billContext.useActionMessage(ContextActionService.ANNEX_METADATA_UPDATED, messageHelper.getMessage("collection.block.annex.metadata.updated"));
                billContext.useActionMessage(ContextActionService.ANNEX_ADDED, messageHelper.getMessage("collection.block.annex.added"));
                billContext.useActionMessage(ContextActionService.DOCUMENT_CREATED, messageHelper.getMessage("operation.document.created"));

                CatalogItem templateItem = templateService.getTemplateItem(metadata.getDocTemplate());
                String annexTemplate = templateItem.getItems().get(0).getId();
                billContext.useAnnexTemplate(annexTemplate);
                billContext.executeCreateBillAnnex();
            } catch (Exception e) {
                LOG.error("Unexpected error occurred while creating new annex", e);
                throw e;
            }
        }
    }

    private boolean identifyContributionChanges(String clonedProposalRef, String clonedLegFileName, String proposalId) {
        Validate.notNull(clonedProposalRef, "Cloned proposal ref should not be null");
        Validate.notNull(clonedLegFileName, "Cloned leg file name should not be null");
        Proposal proposal = proposalService.getProposalByRef(clonedProposalRef);
        LeosPackage clonedLeosPackage = packageService.findPackageByDocumentId(proposal.getId());
        LegDocument clonedLegDocument = getLegDocument(clonedLegFileName, clonedLeosPackage);
        LeosPackage originalLeosPackage = packageService.findPackageByDocumentId(proposalId);
        String originalLegName = proposalService.getOriginalMilestoneName(proposal.getName(), proposal.getContent().get().getSource().getBytes());
        LegDocument originalLegDocument = getLegDocument(originalLegName, originalLeosPackage);
        boolean contributionChanged = false;
        if (clonedLegDocument != null && originalLegDocument != null) {
            File legFileTemp = null, originalLegFileTemp = null;
            try {
                legFileTemp = File.createTempFile("milestone", ".leg");
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
    public List<MilestonesVO> getProposalMilestones(String proposalRef){
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
            cloneProposalMetadataVO = proposalService.getClonedProposalMetadata(proposalXmlContent);
            cloneContext.setCloneProposalMetadataVO(cloneProposalMetadataVO);
        }
        LeosPackage leosPackage = packageService.findPackageByDocumentId(proposalId);
        List<XmlDocument> documents = packageService.findDocumentsByPackagePath(leosPackage.getPath(), XmlDocument.class, false);
        List<LegDocument> legDocuments = packageService.findDocumentsByPackageId(leosPackage.getId(), LegDocument.class, false, false);
        legDocuments.sort(Comparator.comparing(LegDocument::getLastModificationInstant).reversed());

        try {
            String finalProposalId = proposalId;
            legDocuments.forEach(document -> milestonesVOS.add(getMilestonesVO(document, finalProposalId,proposalRef)));
            milestonesVOS.forEach(milestone -> milestone.setStatus(messageHelper.getMessage("milestones.column.status.value." + LeosLegStatus.FILE_READY.name())));
        }
        catch(Exception e) {
            LOG.error("Error while getting milestones for proposal " + e);
            throw e;
        }
        return milestonesVOS;
    }


    private MilestonesVO getMilestonesVO(LegDocument legDocument,String proposalId,String proposalRef) {
        List<CloneProposalMetadataVO> cloneProposalMetadataVOs = proposalService.getClonedProposalMetadataVOs(proposalId, legDocument.getName());
        MilestonesVO milestonesVO = new MilestonesVO(legDocument.getMilestoneComments(),
                Date.from(legDocument.getCreationInstant()),
                Date.from(legDocument.getLastModificationInstant()),
                legDocument.getStatus().name(),
                legDocument.getName(), proposalRef);

        if (cloneProposalMetadataVOs != null && !cloneProposalMetadataVOs.isEmpty()) {
            List<MilestonesVO> clonedMilestonesVOS = new ArrayList<>();
            cloneProposalMetadataVOs.forEach(cpmVo -> {
                List<String> titles = new ArrayList<>();
                titles.add(messageHelper.getMessage("clone.proposal.contribution.sent").concat(" ").
                        concat(userService.getUser(cpmVo.getTargetUser()).getName()));
                MilestonesVO milestoneVO = new MilestonesVO(titles, cpmVo.getCreationDate(),
                        null, cpmVo.getRevisionStatus(),
                        cpmVo.getLegFileName(), cpmVo.getCloneProposalRef());
                milestoneVO.setClone(true);
                if(cpmVo.getRevisionStatus().equalsIgnoreCase(
                        messageHelper.getMessage("clone.proposal.status.contribution.done")) &&
                        identifyContributionChanges(cpmVo.getCloneProposalRef(), cpmVo.getLegFileName(),proposalId)) {
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
            String proposalId = proposal.getId();
            LeosPackage leosPackage = packageService.findPackageByDocumentId(proposalId);
            BillContextService billContext = billContextProvider.get();
            billContext.useAnnexwithRef(annexRef);
            billContext.useAnnex(annex.getId());
            billContext.usePackage(leosPackage);
            billContext.useActionMessage(ContextActionService.ANNEX_METADATA_UPDATED, messageHelper.getMessage("collection.block.annex.metadata.updated"));
            billContext.useActionMessage(ContextActionService.ANNEX_DELETED, messageHelper.getMessage("collection.block.annex.removed"));
            try {
                archiveService.archiveDocument(annexVO, Annex.class, leosPackage.getPath());
            } catch (Exception e) {
                LOG.error("Error while using archive service {}",e.getMessage());
            }
            billContext.executeRemoveBillAnnex();
        }
    }

    @Override
    public void updateAnnexOrder(String proposalRef, String annexRef, String moveDirection, Integer timesToMove){
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);
        if (proposal != null) {
            for (int i = 0; i < timesToMove; i++) {
                String proposalId = proposal.getId();
                LeosPackage leosPackage = packageService.findPackageByDocumentId(proposalId);
                BillContextService billContext = billContextProvider.get();
                billContext.useAnnexwithRef(annexRef);
                billContext.usePackage(leosPackage);
                billContext.useMoveDirection(moveDirection);
                billContext.useActionMessage(ContextActionService.ANNEX_METADATA_UPDATED, messageHelper.getMessage("collection.block.annex.metadata.updated"));
                billContext.executeMoveAnnex();
            }

        }
    }

    @Override
    public void updateAnnexTitle(String proposalRef, String annexId, String annexTitle) {
        Annex annex = annexService.findAnnex(annexId,true);
        AnnexMetadata metadata = annex.getMetadata().getOrError(() -> "Annex metadata not found!");
        AnnexMetadata updatedMetadata = metadata.builder().withTitle(annexTitle).build();
        annexService.updateAnnex(annex, updatedMetadata, VersionType.MINOR, messageHelper.getMessage("collection.block.annex.metadata.updated"));
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
                cloneContext.setCloneProposalMetadataVO(cloneProposalMetadataVO);
                LegDocument newLegDocument = milestoneService.createMilestone(proposalId, milestoneComment);
            } catch (Exception e) {
                LOG.error("Unexpected error occurred while creating new milestone ", e);
                throw e;
            }
        }
        return null;
    }
}
