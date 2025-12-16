/*
 * Copyright 2024 European Union
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

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Stopwatch;
import eu.europa.ec.leos.domain.common.ErrorCode;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosExportStatus;
import eu.europa.ec.leos.domain.repository.LeosLegStatus;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.LinkedPackage;
import eu.europa.ec.leos.domain.repository.common.LeosFile;
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
import eu.europa.ec.leos.domain.repository.metadata.LeosAuthenticLanguage;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.domain.vo.ErrorVO;
import eu.europa.ec.leos.domain.vo.MetadataVO;
import eu.europa.ec.leos.domain.vo.MilestonesVO;
import eu.europa.ec.leos.domain.vo.ProposalDetailsVO;
import eu.europa.ec.leos.domain.vo.ValidationVO;
import eu.europa.ec.leos.i18n.LanguageHelper;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.integration.rest.UserJSON;
import eu.europa.ec.leos.model.detailstab.DetailsTabExclusions;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.repository.document.ProposalRepository;
import eu.europa.ec.leos.repository.store.PackageRepository;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMap;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.api.exception.CreateMilestoneException;
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
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.request.CreateProposalCopyRequest;
import eu.europa.ec.leos.services.dto.request.FilterProposalsRequest;
import eu.europa.ec.leos.services.dto.request.UpdateProposalRequest;
import eu.europa.ec.leos.services.dto.response.LegFileValidation;
import eu.europa.ec.leos.services.dto.response.MilestoneDocumentView;
import eu.europa.ec.leos.services.dto.response.MilestonePDFDownloadResponse;
import eu.europa.ec.leos.services.dto.response.MilestoneViewResponse;
import eu.europa.ec.leos.services.dto.response.WorkspaceProposalResponse;
import eu.europa.ec.leos.services.exception.NotFoundException;
import eu.europa.ec.leos.services.exception.XmlValidationException;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportLeos;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportPackageVO;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.export.LegPackage;
import eu.europa.ec.leos.services.milestone.MilestoneService;
import eu.europa.ec.leos.services.notification.NotificationService;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.store.ArchiveService;
import eu.europa.ec.leos.services.store.ExportPackageService;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.store.TemplateService;
import eu.europa.ec.leos.services.store.WorkspaceService;
import eu.europa.ec.leos.model.proposal.ProposalDetailsLists;
import eu.europa.ec.leos.services.structure.details.ProposalDetailsService;
import eu.europa.ec.leos.services.template.CustomTemplateService;
import eu.europa.ec.leos.services.template.TemplateConfigurationService;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import eu.europa.ec.leos.services.user.UserHelper;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.services.utils.LanguageMapUtils;
import eu.europa.ec.leos.services.validation.ValidationService;
import eu.europa.ec.leos.util.LeosDomainUtil;
import eu.europa.ec.leos.vo.catalog.CatalogItem;
import eu.europa.ec.leos.vo.response.FavouritePackageResponse;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.Validate;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.StampedLock;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static eu.europa.ec.leos.services.collection.milestone.helpers.MilestoneHelper.ACCEPTED_ADDED;
import static eu.europa.ec.leos.services.collection.milestone.helpers.MilestoneHelper.ACCEPTED_DELETED;
import static eu.europa.ec.leos.services.collection.milestone.helpers.MilestoneHelper.PROCESSED;
import static eu.europa.ec.leos.services.converter.ProposalConverterServiceImpl.createFileFromXmlSource;
import static eu.europa.ec.leos.services.support.LeosXercesUtils.getTitleValue;
import static eu.europa.ec.leos.services.support.XmlHelper.PREFACE;
import static eu.europa.ec.leos.services.support.XmlHelper.UTF_8;
import static org.apache.commons.lang3.StringEscapeUtils.escapeXml10;
import static org.apache.commons.lang3.StringUtils.normalizeSpace;

@Service
public abstract class ApiServiceImpl implements ApiService {
    private static final String HTML = ".html";
    private static final String TOC_JS = "_toc.js";
    private static final String XML = ".xml";
    private static final String PDF = ".pdf";
    private static final String MAIN_DOCUMENT_FILE_NAME = "main";
    private static final String COVER_PAGE_CONTENT_FILE_NAME = "coverPage";
    private static final String DOC_NUMBER_START_TAG_REG = "<leos:annexIndex\\b[^>]*>";
    private static final String DOC_NUMBER_END_TAG = "</leos:annexIndex>";
    public static final String  DOC_VERSION_SEPARATOR = "_";
    private static final Logger LOG = LoggerFactory.getLogger(ApiServiceImpl.class);
    private static final String COLLECTION_BLOCK_ANNEX_METADATA_UPDATED = "collection.block.annex.metadata.updated";
    protected final ProposalService proposalService;
    protected final ExportService exportService;
    private final CustomTemplateService customTemplateService;
    private final TemplateService templateService;
    private final WorkspaceService workspaceService;
    private final UserService userService;
    private final CreateCollectionService createCollectionService;
    protected final SecurityContext securityContext;
    private final LeosPermissionAuthorityMap authorityMap;
    private final PackageService packageService;
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
    private final UserHelper userHelper;
    protected final GenericDocumentTocApiService genericDocumentTocApiService;
    private CloneProposalMetadataVO cloneProposalMetadataVO;
    private ProposalConverterService proposalConverterService;
    private PostProcessingDocumentService postProcessingDocumentService;
    private ValidationService validationService;
    private ExplanatoryService explanatoryService;
    private ExportPackageService exportPackageService;
    protected NotificationService notificationService;
    protected LegService legService;
    private final CoverPageApiService coverPageApiService;
    private final ProposalDetailsService proposalDetailsService;
    protected LeosRepository leosRepository;
    private TrackChangesContext trackChangesContext;
    protected final TemplateConfigurationService templateConfigurationService;
    private final LanguageHelper languageHelper;
    protected PackageRepository packageRepository;

    protected DocumentViewService documentViewService;
    @Value("${leos.clone.originRef}")
    private String cloneOriginRef;

    @Autowired
    public ApiServiceImpl(CustomTemplateService customTemplateService,
                          TemplateService templateService,
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
                          ValidationService validationService,
                          Properties applicationProperties,
                          ExplanatoryService explanatoryService,
                          ExportPackageService exportPackageService, NotificationService notificationService,
                          LegService legService, UserHelper userHelper, LeosRepository leosRepository,
                          TrackChangesContext trackChangesContext, DocumentViewService documentViewService,
                          GenericDocumentTocApiService genericDocumentTocApiService, CoverPageApiService coverPageApiService,
                          ProposalDetailsService proposalDetailsService,
                          TemplateConfigurationService templateConfigurationService, LanguageHelper languageHelper, PackageRepository packageRepository, ProposalRepository proposalRepository) {
        this.customTemplateService = customTemplateService;
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
        this.documentViewService = documentViewService;
        this.genericDocumentTocApiService = genericDocumentTocApiService;
        this.coverPageApiService = coverPageApiService;
        this.proposalDetailsService = proposalDetailsService;
        this.templateConfigurationService = templateConfigurationService;
        this.languageHelper = languageHelper;
        this.packageRepository = packageRepository;
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
    public List<CatalogItem> getCustomTemplates(String entityName) throws IOException {
        return customTemplateService.getCustomTemplatesCatalog(entityName);
    }

    @Override
    public CreateCollectionResult copyAct(CreateProposalCopyRequest request) throws CreateCollectionException {
        List<XmlDocument> documents = getAllDocuments(request.getProposalRef());
        return createProposalFromExisting(request.getTemplateId(), request.getTemplateName(),
                    request.getLangCode(), request.getDocPurpose(), request.isEeaRelevance(), request.isCustomTemplateAct(), request.getKey(), documents);
    }

    private CreateCollectionResult createProposalFromExisting(String templateId, String templateName, String langCode,
                                                 String docPurpose, boolean eeaRelevance, boolean customTemplate, String templateKey, List<XmlDocument> documents) throws CreateCollectionException {
        DocumentVO documentVO = new DocumentVO(LeosCategory.PROPOSAL);
        documentVO.getMetadata().setDocTemplate(templateId);
        documentVO.getMetadata().setTemplateName(templateName);
        documentVO.getMetadata().setLanguage(langCode);
        documentVO.getMetadata().setDocPurpose(docPurpose);
        documentVO.getMetadata().setEeaRelevance(eeaRelevance);
        documentVO.getMetadata().setTemplate(templateKey);
        documentVO.getMetadata().setCustomTemplateAct(customTemplate);
        return createCollectionService.createCollectionFromExisting(documentVO, documents);
    }

    private List<XmlDocument> getAllDocuments(String proposalRef) {
        return getAllDocuments(proposalRef, false, true);
    }

    private List<XmlDocument> getAllDocuments(String proposalRef, boolean allVersions, boolean fetchContent) {
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposalRef, Proposal.class);
        return packageService.findDocumentsByPackageId(leosPackage.getId(), XmlDocument.class, allVersions, fetchContent);
    }

    @Override
    public CreateCollectionResult createProposal(String templateId, String templateName, String langCode,
                                                 String docPurpose, boolean eeaRelevance, boolean customTemplateAct,
                                                 String templateKey) throws CreateCollectionException {
        if (customTemplateAct) {
            userHelper.validateTemplateManager("This user is not allowed to create custom templates.");
        }

        DocumentVO documentVO = new DocumentVO(LeosCategory.PROPOSAL);
        documentVO.getMetadata().setDocTemplate(templateId);
        documentVO.getMetadata().setTemplateName(templateName);
        documentVO.getMetadata().setLanguage(langCode);
        documentVO.getMetadata().setDocPurpose(docPurpose);
        documentVO.getMetadata().setEeaRelevance(eeaRelevance);
        documentVO.getMetadata().setTemplate(templateKey);
        documentVO.getMetadata().setCustomTemplateAct(customTemplateAct);
        return createCollectionService.createCollection(documentVO, false);
    }

    @Override
    public List<String> createLinguisticVersionsFromMilestone(String legFileId, List<String> linguisticVersions) throws CreateCollectionException {
        try {
            LegDocument legDocument = legService.findLegDocumentById(legFileId);
            validateCustomTemplate(legDocument);
            LeosFile legFile = createFileFromXmlSource(legDocument.getContent().get().getSource().getBytes(), "lastMilestone.leg");
            DocumentVO documentVO = proposalConverterService.createProposalFromLegFile(legFile, false);
            documentVO.getMetadata().setCustomTemplateAct(true);
            linguisticVersions = linguisticVersions.stream().map(StringUtils::upperCase).collect(Collectors.toList());
            validateLinguisticVersionsExist(documentVO.getRef(), linguisticVersions);
            return this.createLinguisticVersions(linguisticVersions, documentVO);
        } catch (XmlValidationException e) {
            LOG.error("Xml validation error occurred while creating proposal from leg file: ", e);
            throw new CreateCollectionException("Languages are not aligned. An error occurred obtaining the act file of the main language");
        } catch (Exception e) {
            throw new CreateCollectionException(e.getMessage());
        }
    }

    private void validateCustomTemplate(LegDocument legDocument) {
        if (legDocument.isCustomTemplateAct()) {
            userHelper.validateTemplateManager("This user is not allowed to create linguistic versions in custom templates.");
        } else {
            throw new IllegalStateException("This is not a custom template. Linguistic versions are not allowed in this proposal.");
        }
    }

    private void validateLinguisticVersionsExist(String proposalRef, List<String> linguisticVersions) {
        List<String> existingLinguisticVersions = new ArrayList<>();;
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);
        linguisticVersions.forEach(version -> {
            if (StringUtils.contains(proposal.getMetadata().get().getAvailableLangs(), version)) {
                existingLinguisticVersions.add(version);
            }
        });
        if (CollectionUtils.isNotEmpty(existingLinguisticVersions)) {
            throw new IllegalStateException(
                    "The following linguistic versions are already present in this proposal: " + String.join(", ", existingLinguisticVersions));
        }
    }

    private List<String> createLinguisticVersions(List<String> linguisticVersions, DocumentVO documentVO) throws Exception {
        List<String> notFoundLinguisticVersions = new ArrayList<>();
        List<String> createdProposalRefs = new ArrayList<>();
        for (String language : linguisticVersions) {
            String newLinguisticProposalRef = createLinguisticVersion(documentVO, language, notFoundLinguisticVersions);
            if (newLinguisticProposalRef != null) {
                createdProposalRefs.add(newLinguisticProposalRef);
            }
        }
        alignIds(documentVO, createdProposalRefs);
        return notFoundLinguisticVersions;
    }

    private String createLinguisticVersion(DocumentVO documentVO, String language, List<String> notFoundLinguisticVersions) throws Exception {
        documentVO.getMetadata().setLanguage(language);
        try {
            CreateCollectionResult createCollectionResult = createCollectionService.createCollection(documentVO, true);
            String proposalRef = createCollectionResult.getProposalId();
            createLinguisticAnnexIfExistsInMainLanguage(documentVO, proposalRef);
            return proposalRef;
        } catch (IllegalArgumentException e) {
            if (StringUtils.startsWith(e.getMessage(), "404 NOT_FOUND")) {
                notFoundLinguisticVersions.add(language);
            }
        }
        return null;
    }

    private void createLinguisticAnnexIfExistsInMainLanguage(DocumentVO documentVO, String proposalRef) throws IOException {
        DocumentVO mainLanguageAnnex = documentVO.getChildDocument(LeosCategory.BILL).getChildDocument(LeosCategory.ANNEX);
        if (mainLanguageAnnex != null) {
            createProposalAnnex(proposalRef, mainLanguageAnnex.getRef());
        }
    }

    private void alignIds(DocumentVO documentVO, List<String> linguisticRefs) {
        if (CollectionUtils.isNotEmpty(linguisticRefs)) {
            List<XmlDocument> originalXmlDocs = getAllDocuments(documentVO.getRef(), true, false);
            for (String linguisticRef : linguisticRefs) {
                List<XmlDocument> linguisticXmlDocs = getAllDocuments(linguisticRef);
                this.customTemplateService.alignDocumentsFromBaseVersion(originalXmlDocs, linguisticXmlDocs, documentVO, linguisticRef);
            }
        }
    }

    @Override
    public CreateCollectionResult uploadProposal(LeosFile legDocument) throws CreateCollectionException {
        DocumentVO propDocument = createCollectionService.getProposalDocumentFromLeg(legDocument);
        return createCollectionService.createCollectionFromLeg(legDocument, propDocument, "EN", false);
    }

    @Override
    public LegFileValidation validateLegFile(LeosFile legDocument) {
        LegFileValidation legFileValidation = new LegFileValidation();
        DocumentVO proposalVO = null;
        try {
            proposalVO = proposalConverterService.createProposalFromLegFile(legDocument, true);
            Result result = postProcessingDocumentService.processDocument(proposalVO);
            if (result.isOk()) {
                legFileValidation.setDocumentToBeCreated(proposalVO);
                ValidationVO validation = new ValidationVO();
                validation.addErrors(validationService.validateDocument(proposalVO));
                List<ErrorVO> errors = validation.getErrors();
                //FIXME: The skipping of validation needs to be removed
                if (validation.hasErrors() && !errors.get(0).getErrorCode().name()
                        .equalsIgnoreCase(ErrorCode.DOCUMENT_PROPOSAL_TEMPLATE_NOT_FOUND.name())) {
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
    public DocumentVO updateProposalTitleAndEEaRelevance(String proposalRef, String docPurpose, Boolean eeaRelevance) throws Exception {
        LOG.trace("Saving proposal metadata...");
        try {
            CollectionContextService context = collectionContextProvider.get();
            Proposal proposal = proposalService.findProposalByRef(proposalRef);
            context.useProposal(proposal);
            if (docPurpose != null) {
                context.usePurpose(docPurpose);
            } else {
                context.usePurpose(proposal.getMetadata().get().getPurpose());
            }
            if (eeaRelevance != null) {
                context.useEeaRelevance(eeaRelevance);
            } else {
                context.useEeaRelevance(proposal.getMetadata().get().getEeaRelevance());
            }
            context.useAiValues(proposal.getMetadata().get().getAiValues());
            String comment = messageHelper.getMessage("operation.metadata.updated");
            context.useActionMessage(ContextActionService.METADATA_UPDATED, comment);
            context.useActionComment(comment);
            return new DocumentVO(context.executeUpdateProposal());
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while updating proposal metadata ", e);
            throw e;
        }
    }

    @Override
    public DocumentVO updateProposalMetadata(String proposalRef, UpdateProposalRequest request) throws Exception {
        LOG.trace("Saving proposal metadata...");
        LegPackage legPackage = null;
        try {
            CollectionContextService context = collectionContextProvider.get();
            LeosPackage leosPackage = getLeosPackage(proposalRef);
            Proposal proposal = proposalService.findProposalByPackagePath(leosPackage.getPath());
            proposal = proposalService.populateProposalMetadataFromXml(proposal);
            String proposalComment = generateProposalComment(request);
            if (request.getCrossReferences() == null) {
                request.setCrossReferences(proposal.getMetadata().get().getCrossReferences());
            }
            if (request.getEeaRelevance() == null) {
                context.useEeaRelevance(proposal.getMetadata().get().getEeaRelevance());
            } else {
                context.useEeaRelevance(request.getEeaRelevance());
            }
            if (request.getPackageTitle() != null) {
                context.usePackageTitle(request.getPackageTitle());
            } else {
                context.usePackageTitle(proposal.getMetadata().get().getPackageTitle());
            }
            if (request.getCoverPageType() != null) {
                context.useCoverPageType(request.getCoverPageType());
            } else {
                context.useCoverPageType(proposal.getMetadata().get().getCoverPageType());
            }
            context.useActionMessage(ContextActionService.METADATA_UPDATED, proposalComment);
            context.useActionComment(proposalComment);
            List<LinkedPackage> linkedPackages =  packageService.findLinkedPackagesByPackageId(leosPackage.getId());
            List<Proposal> proposalsToUpdate = new ArrayList<>();
            proposalsToUpdate.add(proposal);
            for (LinkedPackage linkedPackage : linkedPackages) {
                leosPackage = packageService.findPackageByPackageId(linkedPackage.getLinkedPackageId());
                proposalsToUpdate.add(proposalService.findProposalByPackagePath(leosPackage.getPath()));
            }
            for (int i = 0; i < proposalsToUpdate.size(); i++) {
                Proposal proposalToUpdate = proposalsToUpdate.get(i);
                if (request.getDocPurpose() != null) {
                    context.usePurpose(request.getDocPurpose());
                } else {
                    context.usePurpose(proposalToUpdate.getMetadata().get().getPurpose());
                }
                if (request.getIsAuthenticLang() != null) {
                    if (request.getIsAuthenticLang().equals(LeosAuthenticLanguage.NON_PROPOSAL_LANGUAGE) || request.getIsAuthenticLang().equals(LeosAuthenticLanguage.PROPOSAL_LANGUAGE)) {
                        String currentLang = proposalToUpdate.getMetadata().get().getLanguage();
                        boolean isContainingLang = request.getAuthenticLang() != null && request.getAuthenticLang().contains(currentLang.toLowerCase());
                        context.useIsAuthenticLang(isContainingLang ? LeosAuthenticLanguage.PROPOSAL_LANGUAGE : LeosAuthenticLanguage.NON_PROPOSAL_LANGUAGE);
                    } else {
                        context.useIsAuthenticLang(request.getIsAuthenticLang());
                    }
                } else {
                    context.useIsAuthenticLang(proposalToUpdate.getMetadata().get().getIsAuthenticLang());
                }
                if (proposal.isClonedProposal()) {
                    legPackage = legService.createLegPackageForClone(proposalToUpdate.getId(), new ExportLeos());
                } else {
                    legPackage = legService.createLegPackage(proposalToUpdate.getId(), new ExportLeos());
                }

                Map<String, byte[]> updatedDocuments = proposalService.applyMetadata(legPackage, proposalToUpdate, request);
                if (!updatedDocuments.containsKey(LeosCategory.PROPOSAL.name())) {
                    throw new Exception("Unexpected error occurred while updating proposal metadata");
                } else {
                    context.useProposal(proposalToUpdate);
                    context.useProposalContent(updatedDocuments.get(LeosCategory.PROPOSAL.name()));
                    if (updatedDocuments.containsKey(LeosCategory.BILL.name())) {
                        leosPackage = packageService.findPackageByDocumentRef(proposalToUpdate.getMetadata().get().getRef(), Proposal.class);
                        Bill bill = billService.findBillByPackagePath(leosPackage.getPath());
                        if (!new String(bill.getContent().get().getSource().getBytes(), StandardCharsets.UTF_8).equals(new String(updatedDocuments.get(LeosCategory.BILL.name()), StandardCharsets.UTF_8))) {
                            context.useBillContent(updatedDocuments.get(LeosCategory.BILL.name()));
                        }
                    }
                    proposalToUpdate = context.executeUpdateMetadataProposal();
                    proposalsToUpdate.set(i, proposalService.populateProposalMetadataFromXml(proposalToUpdate));
                }
            }
            return new DocumentVO(proposalsToUpdate.get(0));
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while updating proposal metadata ", e);
            throw e;
        }
    }

    private LeosPackage getLeosPackage(String proposalRef) {
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposalRef, Proposal.class);
        if (leosPackage.getTranslated() != null && leosPackage.getTranslated()) {
            LinkedPackage linkedPackage = packageService.findLinkedPackageByLinkedPkgId(leosPackage.getId());
            leosPackage = packageService.findPackageByPackageId(linkedPackage.getPackageId());
        }
        return leosPackage;
    }

    private String generateProposalComment(UpdateProposalRequest request) throws Exception {
        List<String> metadata = new ArrayList<>();
        for (Field field: request.getClass().getDeclaredFields()) {
            if (request.getClass().getMethod("get" + StringUtils.capitalize(field.getName())).invoke(request) != null) {
                String key = "operation.details.element." + String.join(".", field.getName().split("(?=\\p{Lu})")).toLowerCase();
                String message = messageHelper.getMessage(key);
                if (!message.equals(key)) {
                    metadata.add(message);
                }
            }
        }
        return messageHelper.getMessage("operation.details.updated",
                String.join(", ", metadata));
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
    public List<String> searchUserByJobTitle(String jobTitle) {
        List<UserJSON> results = userService.searchUsersByJobTitle(jobTitle);
        return results.stream()
                .map(user -> user.getFirstName() + " " + user.getLastName())
                .collect(Collectors.toList());
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
        if (LOG.isDebugEnabled())
            LOG.debug("Handling create document request event... [category={}]", LeosCategory.COUNCIL_EXPLANATORY.toString());
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
        ProposalMetadata result = proposal.getMetadata().getOrNull();
        if (LOG.isInfoEnabled()) {
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

    private ExportOptions getExportOptions(String outputType) {
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
        return new ExportLW(output);
    }

    @Override
    public String exportProposal(String proposalRef, String outputType) throws Exception {
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        return exportService.exportToToolboxCoDe(proposal.getId(), getExportOptions(outputType));
    }

    @Override
    public byte[] exportProposalDownload(String proposalRef, String outputType) throws Exception {
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        return exportService.exportToToolboxCoDeDownload(proposal.getId(), getExportOptions(outputType));
    }

    @Override
    public Optional<ProposalDetailsVO> getProposalDetails(String proposalRef, String userId) {
        LOG.trace(proposalRef);
        ProposalDetailsVO proposalDetails = new ProposalDetailsVO();
        ProposalDetailsLists proposalDetailsLists = proposalDetailsService.getProposalDetailsLists();
        Set<MilestonesVO> milestonesVOs = new TreeSet<>(Comparator.comparing(MilestonesVO::getUpdatedDateAsDate).reversed());
        Proposal proposal = null;
        byte[] proposalXmlContent = new byte[0];
        if (proposalRef != null) {
            proposal = this.proposalService.findProposalByRef(proposalRef);
            if (LOG.isTraceEnabled())
                LOG.trace(proposal.toString());
            proposal = proposalService.populateProposalMetadataFromXml(proposal);
        }
        if (proposal != null) {
            String language = proposal.getMetadata().get().getLanguage();
            languageHelper.setProposalLanguageTag(language.toLowerCase());
            String proposalId = proposal.getId();
            proposalXmlContent = proposal.getContent().exists(c -> c.getSource() != null)
                    ? proposal.getContent().get().getSource().getBytes()
                    : new byte[0];

            try {
                LeosPackage leosPackage = getLeosPackage(proposalRef);
                List<XmlDocument> documents = packageService.findDocumentsByPackagePath(leosPackage.getPath(), XmlDocument.class, false);
                proposalDetailsLists = proposalDetailsService.populateTemplateSignatures(proposalDetailsLists, documents);
                List<LegDocument> legDocuments = packageService.findDocumentsByPackageId(leosPackage.getId(), LegDocument.class, false, true);
                FavouritePackageResponse favouritePackageResponse = packageService.getFavouritePackage(proposalRef, userId);
                legDocuments.sort(Comparator.comparing(LegDocument::getLastModificationInstant).reversed());
                DocumentVO proposalVO = this.createViewObject(documents, proposalXmlContent, favouritePackageResponse.isFavourite());
                proposalVO.getMetadata().setDocumentCollectionName(proposal.getMetadata().get().getDocumentCollectionName());
                proposalVO.setCreationOptions(documents.stream().filter(doc -> doc.getCategory().name().equals("PROPOSAL")).findFirst().get().getMetadata().get().getCreationOptions());
                List<LinkedPackage> linkedPackageList = packageService.findLinkedPackagesByPackageId(leosPackage.getId());
                if (linkedPackageList != null && linkedPackageList.size() > 0) {
                    List<DocumentVO> translatedDocList = new ArrayList<>();
                    linkedPackageList.forEach(linkedPackage -> {
                        LeosPackage importedPackage = packageService.findPackageByPackageId(linkedPackage.getLinkedPackageId());
                        if (importedPackage.getTranslated()) {
                            List<XmlDocument> translatedDocuments = packageService.findDocumentsByPackagePath(importedPackage.getPath(),
                                    XmlDocument.class, false);
                            DocumentVO translatedProposalVO = createViewObject(translatedDocuments, null, false);
                            translatedProposalVO.setCreationOptions(translatedDocuments.stream().filter(doc -> doc.getCategory().name().equals("PROPOSAL")).findFirst().get().getMetadata().get().getCreationOptions());
                            translatedDocList.add(translatedProposalVO);
                        }
                    });
                    proposalVO.setTranslatedProposal(translatedDocList);
                }

                if (proposal.isClonedProposal()) {
                    populateCloneProposalMetadataVO(proposalXmlContent);
                    proposalVO.setCloneProposalMetadataVO(cloneContext.getCloneProposalMetadataVO());
                }
                StampedLock milestonesVOsLock = new StampedLock();
                long stamp = milestonesVOsLock.writeLock();
                try {
                    milestonesVOs.clear();
                    legDocuments.forEach(document -> {
                        milestonesVOs.add(getMilestonesVO(document, proposalId, proposalRef));
                    });
                } finally {
                    milestonesVOsLock.unlockWrite(stamp);
                }
                proposalVO.setDetailsTabExclusions(getDetailsTabExclusions(proposal));
                proposalDetails.setProposalDetailsLists(proposalDetailsLists);
                proposalDetails.setDocument(proposalVO);
                return Optional.of(proposalDetails);
            } catch (Exception e) {
                LOG.error("Unexpected error occoured while fetching proposal", e);
                return Optional.empty();
            }
        }
        return Optional.empty();
    }

    private DetailsTabExclusions getDetailsTabExclusions(Proposal proposal) {
        String detailsConf;

        try {
            detailsConf = templateConfigurationService.getElementFromTemplateConfiguration(
                    proposal.getMetadata().get().getDocTemplate(), "detailsTabExclusions");
        }
        catch(IllegalArgumentException e){
            return null;
        }

        if (detailsConf == null || detailsConf.trim().isEmpty()) {
            return null;
        }

        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);

        try {
            return mapper.readValue(detailsConf, DetailsTabExclusions.class);
        } catch (Exception e) {
            LOG.warn("Failed to parse JSON: {}", detailsConf, e);
            return null;
        }
    }

    private ExportPackageVO getExportPackageVO(ExportDocument exportDocument) {
        return new ExportPackageVO(exportDocument.getId(), exportDocument.getVersionSeriesId(),
                exportDocument.getCmisVersionLabel(), exportDocument.getComments(),
                Date.from(exportDocument.getLastModificationInstant()),
                messageHelper.getMessage("collection.block.export.package.column.status.value." + exportDocument.getStatus().name()));
    }

    private DocumentVO createViewObject(List<XmlDocument> documents, byte[] proposalXmlContent, Boolean isFavourite) {
        DocumentVO proposalVO = new DocumentVO(LeosCategory.PROPOSAL);
        List<DocumentVO> annexVOList = new ArrayList<>();
        Set<String> docVerSeriesIds = new HashSet<>();
        //We have the latest version of the document, no need to search for them again
        for (XmlDocument document : documents) {
            switch (document.getCategory()) {
                case PROPOSAL: {
                    Proposal proposal = (Proposal) document;
                    if (proposalXmlContent == null) {
                        proposal = this.proposalService.getProposalByRef(proposal.getMetadata().get().getRef());
                        proposalXmlContent = proposal.getContent().exists(c -> c.getSource() != null)
                                ? proposal.getContent().get().getSource().getBytes()
                                : new byte[0];
                    }
                    MetadataVO metadataVO = createMetadataVO(proposal);
                    Optional<XmlDocument> bill = documents.stream().filter((d) -> d.getCategory().equals(LeosCategory.BILL)).findAny();
                    proposalVO.setMetaData(proposalService.populateProposalMetadataFromXml(proposalXmlContent,
                            bill.map(xmlDocument -> billService.findBillByRef(xmlDocument.getMetadata().get().getRef()).getContent().get().getSource().getBytes()).orElse(null), metadataVO));
                    proposalVO.addCollaborators(proposal.getCollaborators());
                    proposalVO.setUpdatedBy(userHelper.convertToPresentation(proposal.getLastModifiedBy()));
                    proposalVO.setCreatedBy(userHelper.convertToPresentation(proposal.getCreatedBy()));
                    proposalVO.setCreatedOn(Date.from(proposal.getInitialCreationInstant()));
                    proposalVO.setUpdatedOn(Date.from(proposal.getLastModificationInstant()));
                    proposalVO.setLanguage(metadataVO.getLanguage());
                    proposalVO.setSource(proposalXmlContent);
                    proposalVO.setRef(proposal.getMetadata().get().getRef());
                    proposalVO.setFavourite(isFavourite);
                    proposalVO = coverPageApiService.getCoverPageCorrigendumAddendumDetails(proposalXmlContent, proposalVO);
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
                case STAT_DIGIT_FINANC_LEGIS: {
                    FinancialStatement financialStatement = (FinancialStatement) document;
                    DocumentVO financialStatementVO = createFinancialStatementVO(financialStatement);
                    proposalVO.addChildDocument(financialStatementVO);
                    financialStatementVO.addCollaborators(financialStatement.getCollaborators());
                    financialStatementVO.getMetadata()
                            .setInternalRef(financialStatement.getMetadata().getOrError(() -> "financialStatement metadata is not available!").getRef());
                    financialStatementVO.setVersionSeriesId(financialStatement.getVersionSeriesId());
                    financialStatementVO.setUpdatedBy(userHelper.convertToPresentation(financialStatementVO.getUpdatedBy()));
                    financialStatementVO.setCreatedBy(userHelper.convertToPresentation(financialStatementVO.getCreatedBy()));
                    docVerSeriesIds.add(financialStatement.getVersionSeriesId());
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
                        LeosCategory.STAT_DIGIT_FINANC_LEGIS,
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
        MetadataVO metadataVO = new MetadataVO(metadata.getStage(), metadata.getType(), metadata.getPurpose(), metadata.getTemplate(), metadata.getLanguage(),
            metadata.getEeaRelevance(), metadata.isCustomTemplateAct());
        metadataVO.setAuthenticLang(proposal.getMetadata().get().getAuthenticLang());
        metadataVO.setIsAuthenticLang(proposal.getMetadata().get().getIsAuthenticLang());
        metadataVO.setPackageTitle(proposal.getMetadata().get().getPackageTitle());
        metadataVO.setInternalRef(proposal.getMetadata().get().getInternalRef());
        metadataVO.setCoverPageType(proposal.getMetadata().get().getCoverPageType());
        metadataVO.setCrossReferences(proposal.getMetadata().get().getCrossReferences());
        return metadataVO;
    }

    private LegDocument getLegDocument(String legFileName, LeosPackage leosPackage) {
        return packageService.findDocumentByPackagePathAndName(leosPackage.getPath(), legFileName, LegDocument.class);
    }

    private List<Annex> getAnnexes(LeosPackage leosPackage) {
        return packageService.findDocumentsByPackagePath(leosPackage.getPath(), Annex.class, false);
    }

    private List<FinancialStatement> getFinancialStatements(LeosPackage leosPackage) {
        if (leosPackage == null) {
            return new ArrayList<FinancialStatement>();
        }
        return packageService.findDocumentsByPackagePath(leosPackage.getPath(), FinancialStatement.class, false);
    }

    @Override
    public void createProposalAnnex(String proposalRef) throws IOException {
        createProposalAnnex(proposalRef, null);
    }

    public void createProposalAnnex(String proposalRef, String originRef) throws IOException {
        LOG.trace("Creating annex...");
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);
        if (proposal != null) {
            boolean isClonedProposal = proposal.isClonedProposal();
            try {
                populateTrackChangesContext(proposal);
                LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposalRef, Proposal.class);

                if (proposal.getMetadata() != null && proposal.getMetadata().get().isCustomTemplateAct()){
                    List<XmlDocument> documents = packageService.findDocumentsByPackagePath(leosPackage.getPath(), XmlDocument.class, false);
                    documents.forEach(document -> {
                        if (document.getCategory().equals(LeosCategory.ANNEX)){
                            throw new RuntimeException("You cannot add more than one Annex to a Custom Template.");
                        }
                    });
                }

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
                String language = metadata.getLanguage();
                billContext.useAnnexTemplate(annexTemplate + LanguageMapUtils.getLanguageTemplateSuffix(language));
                billContext.useLanguage(metadata.getLanguage());
                billContext.useCustomTemplateAct(metadata.isCustomTemplateAct());
                billContext.useCloneProposal(isClonedProposal);
                billContext.useOriginRef(isClonedProposal ? cloneOriginRef : originRef);
                billContext.usePackageRef(proposalRef);
                billContext.executeCreateBillAnnex();
                billService.updateExternalReferencesAsync(leosPackage);
            } catch (Exception e) {
                LOG.error("Unexpected error occurred while creating new annex", e);
                throw e;
            }
        }
    }

    private boolean identifyContributionChanges(String clonedProposalRef, LeosPackage originalLeosPackage, LegDocument originalLegDocument,
                                                String clonedLegName) {
        Validate.notNull(clonedProposalRef, "Cloned proposal ref should not be null");
        Validate.notNull(originalLegDocument, "Original leg file should not be null");
        Validate.notNull(clonedLegName, "Cloned leg file name should not be null");
        LeosPackage clonedPackage = packageService.findPackageByDocumentRef(clonedProposalRef, Proposal.class);
        LegDocument clonedLegDocument = legService.findLastContribution(clonedPackage.getPath(), clonedLegName);
        boolean contributionChanged = false;
        if (clonedLegDocument != null && originalLegDocument != null) {
            try {
                Map<String, Object> contributionFiles = MilestoneHelper.getMilestoneFiles(clonedLegDocument);
                Map<String, Object> originalDocumentFiles = MilestoneHelper.getMilestoneFiles(originalLegDocument);

                Map<String, Object> docsAddedMap = MilestoneHelper.populateDocsAddedMap(contributionFiles, originalDocumentFiles, clonedLegDocument,
                        getAnnexes(originalLeosPackage),
                        xmlContentProcessor);
                List<String> docsAddedList = docsAddedMap.keySet().stream().filter((n) ->
                    !n.contains(PROCESSED) && !n.contains(ACCEPTED_ADDED)
                ).collect(Collectors.toList());
                if (docsAddedList.size() > 0) {
                    contributionChanged = true;
                }
                Map<String, Object> docsDeletedMap = MilestoneHelper.populateDocsDeletedMap(originalDocumentFiles,
                            contributionFiles, originalLegDocument, getAnnexes(originalLeosPackage), xmlContentProcessor);
                List<String> docsDeletedList = docsDeletedMap.keySet().stream().filter((n) ->
                        !n.contains(PROCESSED) && !n.contains(ACCEPTED_DELETED)).collect(Collectors.toList());
                if (docsDeletedList.size() > 0) {
                    contributionChanged = true;
                }
            } catch (IOException e) {
                LOG.error("Exception occurred while deleting the file from file system" + e);
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
        List<LegDocument> legDocuments = packageService.findDocumentsByPackageId(leosPackage.getId(), LegDocument.class, false, true);
        legDocuments.sort(Comparator.comparing(LegDocument::getLastModificationInstant).reversed());
        try {
            String finalProposalId = proposalId;
            legDocuments.forEach(document -> {
                if (!document.getStatus().equals(LeosLegStatus.IMPORTED)) {
                    milestonesVOS.add(getMilestonesVO(document, finalProposalId, proposalRef));
                }
            });
        } catch (Exception e) {
            LOG.error("Error while getting milestones for proposal " + e);
            throw e;
        }
        return milestonesVOS;
    }

    @Override
    public List<MilestonesVO> getProposalMilestones(String proposalRef, String language) throws Exception {
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
        LeosPackage leosPackage = getLeosPackage(proposalRef);
        List<LegDocument> legDocuments = new ArrayList<>();
        String translatedProposalRef = proposalRef;
        if (leosPackage.getLanguage().equalsIgnoreCase(language)) {
            legDocuments = packageService.findDocumentsByPackageId(leosPackage.getId(), LegDocument.class, false, true);
        } else {
            List<LinkedPackage> linkedPackageList = packageService.findLinkedPackagesByPackageId(leosPackage.getId());

            if (linkedPackageList != null && linkedPackageList.size() > 0) {
                Optional<LinkedPackage> languagePackage = linkedPackageList.stream().filter(linkedPackage -> {
                    LeosPackage importedPackage = packageService.findPackageByPackageId(linkedPackage.getLinkedPackageId());
                    return (importedPackage.getLanguage().equalsIgnoreCase(language));
                }).findAny();
                if (languagePackage.isPresent()) {
                    LeosPackage translatedPackage = packageService.findPackageByPackageId(languagePackage.get().getLinkedPackageId());
                    legDocuments = packageService.findDocumentsByPackageId(languagePackage.get().getLinkedPackageId(), LegDocument.class, false, true);
                    Proposal translatedProposal = proposalService.findProposalByPackagePath(translatedPackage.getPath());
                    if (translatedProposal != null) {
                        translatedProposalRef = translatedProposal.getMetadata().get().getRef();
                    }
                } else {
                    LOG.debug("The linguistic version for the required language does not exists");
                    throw new NotFoundException("The linguistic version for the required language does not exists");
                }
            }
        }

        legDocuments.sort(Comparator.comparing(LegDocument::getLastModificationInstant).reversed());
        try {
            String finalProposalId = proposalId;
            String finalTranslatedProposalRef = translatedProposalRef;
            legDocuments.forEach(document -> {
                if (!document.getStatus().equals(LeosLegStatus.FILE_ERROR)
                        && !document.getStatus().equals(LeosLegStatus.IMPORTED)) {
                    milestonesVOS.add(getMilestonesVO(document, finalProposalId, finalTranslatedProposalRef));
                }
            });
        } catch (Exception e) {
            LOG.error("Error while getting milestones for proposal " + e);
            throw e;
        }

        return milestonesVOS;
    }

    private MilestonesVO getMilestonesVO(LegDocument legDocument, String proposalId, String proposalRef) {
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposalRef, Proposal.class);
        String docVersion = userHelper.fetchMilestoneVersion(legDocument);
        List<CloneProposalMetadataVO> cloneProposalMetadataVOs = proposalService.getClonedProposalMetadataVOs(proposalId, legDocument.getName(), docVersion);
        MilestonesVO milestonesVO = new MilestonesVO(legDocument.getMilestoneComments(),
                Date.from(legDocument.getCreationInstant()),
                Date.from(legDocument.getLastModificationInstant()),
                legDocument.getStatus().name(),
                legDocument.getName(), proposalRef, proposal.getTitle(), legDocument.getId());
        milestonesVO.setCreatedBy(userHelper.convertToPresentation(legDocument.getInitialCreatedBy()));
        milestonesVO.setVersionLabel(docVersion);
        milestonesVO.setLanguage(leosPackage.getLanguage());
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
                milestoneVO.setCreatedBy(cpmVo.getTargetUser());
                milestoneVO.setLanguage(leosPackage.getLanguage());
                if (cpmVo.getRevisionStatus().equalsIgnoreCase(
                        messageHelper.getMessage("clone.proposal.status.contribution.done")) &&
                        identifyContributionChanges(cpmVo.getCloneProposalRef(), leosPackage, legDocument, cpmVo.getLegFileName())) {
                    milestoneVO.setContributionChanged(true);
                }
                clonedMilestonesVOS.add(milestoneVO);
            });
            milestonesVO.setClonedMilestones(clonedMilestonesVOS);
        }
        try {
            String title = java.net.URLDecoder.decode(milestonesVO.getTitle(), StandardCharsets.UTF_8.toString());
            milestonesVO.setTitle(title);
        } catch (UnsupportedEncodingException e) {
            LOG.error("Encoding error occurred while retrieving the milestone", e);
            throw new RuntimeException(e);
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
            billService.updateExternalReferencesAsync(leosPackage);
        }
    }

    @Override
    public void updateAnnexOrder(String proposalRef, String annexRef, String moveDirection, Integer timesToMove) {
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);
        if (proposal != null) {
            LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
            for (int i = 0; i < timesToMove; i++) {
                BillContextService billContext = billContextProvider.get();
                billContext.useAnnexwithRef(annexRef);
                billContext.usePackage(leosPackage);
                billContext.useMoveDirection(moveDirection);
                billContext.useActionMessage(ContextActionService.ANNEX_METADATA_UPDATED, messageHelper.getMessage(COLLECTION_BLOCK_ANNEX_METADATA_UPDATED));
                billContext.executeMoveAnnex();
            }
            this.billService.updateExternalReferencesAsync(leosPackage);
        }
    }

    @Override
    public void updateAnnexPosition(String proposalRef, Integer previousIndex, Integer nextIndex) {
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);
        if (proposal != null) {
            LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
            BillContextService billContext = billContextProvider.get();
            billContext.useAnnexPreviousIndex(previousIndex);
            billContext.useAnnexNextIndex(nextIndex);
            billContext.usePackage(leosPackage);
            billContext.useActionMessage(ContextActionService.ANNEX_METADATA_UPDATED, messageHelper.getMessage(COLLECTION_BLOCK_ANNEX_METADATA_UPDATED));
            billContext.executeChangePositionAnnex();
            this.billService.updateExternalReferencesAsync(leosPackage);
        }
    }

    @Override
    public void updateAnnexTitle(String proposalRef, String annexId, String annexTitle) {
        Annex annex = annexService.findAnnex(annexId, true);
        AnnexMetadata metadata = annex.getMetadata().getOrError(() -> "Annex metadata not found!");

        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);
        if (proposal != null && proposal.isClonedProposal() && this.securityContext != null) {
            String metadataTitle = StringUtils.isEmpty(metadata.getTitle()) ? "Annex" : metadata.getTitle();
            if(metadataTitle.contains("<del") || metadataTitle.contains("<ins")){
                metadataTitle = metadataTitle.replaceAll("<ins[^>]*?>[\\s\\S]*?</ins>|</?del[^>]*?>", "");
            }
            annexTitle = generateTrackChangesText(metadataTitle, annexTitle);
        }

        AnnexMetadata updatedMetadata = metadata.builder().withTitle(annexTitle).build();
        annexService.updateAnnex(annex, updatedMetadata, VersionType.MINOR, messageHelper.getMessage(COLLECTION_BLOCK_ANNEX_METADATA_UPDATED), false);
        documentViewService.updateDocumentView(annex);
    }

    public String generateTrackChangesText(String origText, String newText) {

        final String LEOS_UID_PREFIX = " leos:uid=\"";
        final String LEOS_TITLE_PREFIX = " leos:title=\"";
        final String INS_END_TAG = "</ins>";
        final String INS_START_TAG = "<ins ";
        final String DEL_END_TAG = "</del>";
        final String DEL_START_TAG = "<del ";
        final String BACKSLASH_QUOTE = "\"";

        String userLogin = null;
        String userName = null;
        User user = securityContext != null && securityContext.hasAuthenticationInContext() ? securityContext.getUser() : null;
        if (user != null){
            userLogin = user.getLogin();
            userName = user.getName();
        }

        String uid = "";
        String title = "";
        if(userLogin != null && userName!= null) {
            uid =  new StringBuilder(LEOS_UID_PREFIX).append(userLogin).append(BACKSLASH_QUOTE).toString();
            title =   new StringBuilder(LEOS_TITLE_PREFIX).append(getTitleValue(securityContext)).append(BACKSLASH_QUOTE).toString();
        }

        String elementToAdd = new StringBuilder(DEL_START_TAG) //delete tag added
                .append(uid)
                .append(" ")
                .append(title)
                .append(">")
                .append(escapeXml10(normalizeSpace(origText)))
                .append(DEL_END_TAG)
                // insert tag added
                .append(INS_START_TAG)
                .append(uid)
                .append(" ")
                .append(title)
                .append(">")
                .append(escapeXml10(normalizeSpace(newText)))
                .append(INS_END_TAG).toString();
        LOG.info("Element to add {}", elementToAdd);
        return elementToAdd;
    }

    @Override
    public void updateExplanatoryTitle(String proposalRef, String docId, String title) {
        Explanatory explanatory = explanatoryService.findExplanatory(docId);
        ExplanatoryMetadata metadata = explanatory.getMetadata().getOrError(() -> "Explanatory metadata not found!");
        ExplanatoryMetadata updatedMetadata = metadata.builder().withTitle(title).build();
        explanatoryService.updateExplanatory(explanatory, updatedMetadata, VersionType.MINOR, messageHelper.getMessage("collection.block.explanatory.metadata.updated"));
        documentViewService.updateDocumentView(explanatory);
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
            if (proposal.getMetadata().get().isCustomTemplateAct()) {
                userHelper.validateTemplateManager("This user is not allowed to create milestones in custom templates.");
            }
            String correctedMilestone = new String(milestoneComment.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
            String proposalId = proposal.getId();
            byte[] proposalXmlContent = proposal.getContent().exists(c -> c.getSource() != null) ?
                    proposal.getContent().get().getSource().getBytes() : new byte[0];
            boolean isClonedProposal = proposal.isClonedProposal();
            if (isClonedProposal) {
                populateCloneProposalMetadataVO(proposalXmlContent);
            }
            if (hasNotChanged(proposal)) {
                throw new CreateMilestoneException();
            }
            LegDocument previousLegDocument = null;
            String packageId = getPackageIdForCustomTemplateMainLanguage(proposal);
            if (packageId != null) {
                previousLegDocument = packageService.findDocumentsByPackageId(packageId, LegDocument.class, false, true).stream()
                        .max(Comparator.comparing(LegDocument::getInitialCreationInstant)).orElse(null);
            }
            final String versionComment = messageHelper.getMessage("milestone.versionComment");
            createMajorVersions(proposalRef, correctedMilestone, versionComment, collectionContextProvider.get());
            LegDocument legDocument = milestoneService.createMilestone(proposalId, correctedMilestone);
            alignLinguisticVersionsForCustomTemplateMainLanguage(previousLegDocument, legDocument, packageId);
        }
        return null;
    }

    private String getPackageIdForCustomTemplateMainLanguage(Proposal proposal) {
        ProposalMetadata proposalMetadata = proposal.getMetadata().getOrError(() -> "Proposal metadata not found!");
        if (proposalMetadata.isCustomTemplateAct() && StringUtils.isNotBlank(proposalMetadata.getAvailableLangs()) && !proposal.isClonedProposal()) {
            LeosPackage leosPackage = packageService.findPackageByDocumentId(proposal.getId());
            return leosPackage.getTranslated() ? null : leosPackage.getId();
        }
        return null;
    }

    private void alignLinguisticVersionsForCustomTemplateMainLanguage(LegDocument previousLegDocument, LegDocument newLegDocument, String packageId)
            throws Exception {
        try {
            if (previousLegDocument != null) {
                LeosFile newLegFile = createFileFromXmlSource(newLegDocument.getContent().get().getSource().getBytes(), "newMilestone.leg");
                LeosFile previousLegFile = createFileFromXmlSource(previousLegDocument.getContent().get().getSource().getBytes(), "lastMilestone.leg");
                DocumentVO newDocumentVO = proposalConverterService.createProposalFromLegFile(newLegFile, false);
                DocumentVO previousDocumentVO = proposalConverterService.createProposalFromLegFile(previousLegFile, false);
                List<LinkedPackage> linkedPackages = packageService.findLinkedPackagesByPackageId(packageId);
                for (LinkedPackage linkedPackage : linkedPackages) {
                    String linguisticPackageId = linkedPackage.getLinkedPackageId();
                    List<XmlDocument> linguisticDocuments = packageService.findDocumentsByPackageId(linguisticPackageId, XmlDocument.class, false, true);
                    linguisticDocuments = handleAnnexCreationDeletion(previousDocumentVO, newDocumentVO, linguisticDocuments, linguisticPackageId);
                    customTemplateService.alignDocument(previousDocumentVO, newDocumentVO, linguisticDocuments);
                }
            }
        } catch (XmlValidationException e) {
            LOG.error("Xml validation error occurred while creating proposal from leg file: ", e);
            throw new Exception("Languages are not aligned. An error occurred obtaining the act file of the main language");
        }
    }

    private List<XmlDocument> handleAnnexCreationDeletion(DocumentVO baseSourceDoc, DocumentVO finalSourceDoc, List<XmlDocument> linguisticDocuments,
            String linguisticPackageId) throws IOException {
        boolean linguisticBillAttachmentsUpdated = false;
        DocumentVO baseSourceAnnex = baseSourceDoc != null ? baseSourceDoc.getChildDocument(LeosCategory.BILL).getChildDocument(LeosCategory.ANNEX) : null;
        DocumentVO finalSourceAnnex = finalSourceDoc.getChildDocument(LeosCategory.BILL).getChildDocument(LeosCategory.ANNEX);
        String linguisticProposalRef = getProposalRef(linguisticDocuments);
        if (hasDeletedAnnex(baseSourceAnnex, finalSourceAnnex)) {
            XmlDocument linguisticAnnex = getLinguisticAnnex(linguisticDocuments);
            deleteAnnex(linguisticProposalRef, linguisticAnnex.getMetadata().get().getRef());
            linguisticBillAttachmentsUpdated = true;
        }
        if (hasAddedAnnex(baseSourceAnnex, finalSourceAnnex)) {
            String finalSourceAnnexRef = finalSourceAnnex.getRef();
            createProposalAnnex(linguisticProposalRef, finalSourceAnnexRef);
            linguisticBillAttachmentsUpdated = true;
            String language = linguisticDocuments.get(0).getMetadata().get().getLanguage();
            String newLinguisticAnnexRef = LanguageMapUtils.getTranslatedProposalReference(finalSourceAnnexRef, language);
            List<Annex> linguisticAnnexDoc = Collections.singletonList(annexService.findAnnexByRef(newLinguisticAnnexRef));
            List<Annex> sourceAnnexDocs = annexService.findVersions(finalSourceAnnexRef);
            customTemplateService.alignDocumentsFromBaseVersion(sourceAnnexDocs, linguisticAnnexDoc, finalSourceDoc, newLinguisticAnnexRef);
        }
        return linguisticBillAttachmentsUpdated ?
                packageService.findDocumentsByPackageId(linguisticPackageId, XmlDocument.class, false, true) :
                linguisticDocuments;
    }

    private static String getProposalRef(List<XmlDocument> linguisticDocuments) {
        return linguisticDocuments.stream().filter(doc -> LeosCategory.PROPOSAL.equals(doc.getCategory()))
                .map(doc -> doc.getMetadata().get().getRef()).findAny()
                .orElseThrow(() -> new IllegalStateException(LeosCategory.PROPOSAL + " not found for some of the linguistic version/s."));
    }

    private static XmlDocument getLinguisticAnnex(List<XmlDocument> linguisticDocuments) {
        return linguisticDocuments.stream().filter(doc -> LeosCategory.ANNEX.equals(doc.getCategory())).findAny()
                .orElseThrow(() -> new IllegalStateException(LeosCategory.ANNEX + " not found for some of the linguistic version/s."));
    }

    private boolean hasDeletedAnnex(DocumentVO baseAnnex, DocumentVO finalAnnex) {
        return baseAnnex != null && (finalAnnex == null || !baseAnnex.getRef().equals(finalAnnex.getRef()));
    }

    private boolean hasAddedAnnex(DocumentVO baseAnnex, DocumentVO finalAnnex) {
        return finalAnnex != null && (baseAnnex == null || !baseAnnex.getRef().equals(finalAnnex.getRef()));
    }

    private boolean hasNotChanged(Proposal proposal) {
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        List<XmlDocument> proposalDocs = packageService.findDocumentsByPackageId(leosPackage.getId(), XmlDocument.class, false, false);
        final String versionComment = messageHelper.getMessage("milestone.versionComment");
        for (XmlDocument doc: proposalDocs) {
            if (!doc.getVersionType().equals(VersionType.MAJOR) || !doc.getVersionComment().equals(versionComment)) {
                return false;
            }
        }
        return true;
    }

    @Override
    public void addLegDocument(String packageName, String legFileName, List<String> milestoneComments, byte[] content, LeosLegStatus status,
            List<String> containedDocuments, boolean isCustomTemplate) {
        legService.addLegDocument(packageName, legFileName, milestoneComments, content, status, containedDocuments, isCustomTemplate);
    }

    @Override
    public MilestoneViewResponse listMilestoneDocuments(String proposalRef, String legFileName, String legFileId) throws Exception {
        LegDocument legDocument = legService.findLegDocumentById(legFileId);
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        if (proposal.isClonedProposal()) {
            return doListMilestoneDocumentsFromClonedProposal(legDocument, proposal, proposalRef);
        } else {
            return doListMilestoneDocuments(legDocument, null, null);
        }
    }

    @Override
    public MilestoneViewResponse listMilestoneDocumentsFromVersionRef(String proposalRef, String versionedReference) throws Exception {
        Proposal proposal = this.proposalService.getProposalByRef(proposalRef);

        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        LegDocument legDocument = this.legService.findLastLegByVersionedReference(leosPackage.getPath(), versionedReference);
        return doListMilestoneDocuments(legDocument, null, null);
    }

    @Override
    public MilestoneViewResponse listContributionsView(String proposalRef, String clonedLegFileName, String originalLegFileId) throws IOException {
        LegDocument originalLegDocument = legService.findLegDocumentById(originalLegFileId);
        return doListMilestoneDocuments(originalLegDocument, clonedLegFileName, proposalRef);
    }

    private boolean isModifiedXmlContent(String xmlContent) {
        List<Element> preface = xmlContentProcessor.getElementsByTagName(xmlContent.getBytes(StandardCharsets.UTF_8), Arrays.asList(PREFACE), true);
        String xmlContentWithoutPreface = xmlContent;
        if (!preface.isEmpty()) {
            xmlContentWithoutPreface = new String(xmlContentProcessor.removeElementById(xmlContent.getBytes(StandardCharsets.UTF_8),
                preface.get(0).getElementId(), false), UTF_8);
        }
        Pattern pattern = Pattern.compile("leos:action=\"|leos:softaction=\"|</ins>|</del>",
                Pattern.CASE_INSENSITIVE | Pattern.MULTILINE);
        Matcher matcher = pattern.matcher(xmlContentWithoutPreface);
        return matcher.find();
    }

    private MilestoneViewResponse doListMilestoneDocumentsFromClonedProposal(LegDocument clonedLegDoc, Proposal clonedProposal, String clonedProposalRef) throws Exception {
        populateCloneProposalMetadataVO(clonedProposal.getContent().get().getSource().getBytes());
        Proposal originalProposal = proposalService.findProposal(this.cloneContext.getCloneProposalMetadataVO().getClonedFromObjectId(), false);
        LeosPackage originalPackage = packageService.findPackageByDocumentRef(originalProposal.getMetadata().get().getRef(), Proposal.class);
        LegDocument legDocument =  this.legService.findLastLegByVersionedReference(originalPackage.getPath(), originalProposal.getVersionedReference());
        return listMilestoneDocuments(legDocument, clonedLegDoc, clonedProposalRef, true);
    }

    private MilestoneViewResponse doListMilestoneDocuments(LegDocument legDocument, String clonedLegFileName, String clonedProposalRef) throws IOException {
        LegDocument clonedLegDoc = null;
        if (clonedProposalRef != null) {
            LeosPackage clonedPackage = packageService.findPackageByDocumentRef(clonedProposalRef, Proposal.class);
            clonedLegDoc = legService.findLastContribution(clonedPackage.getPath(), clonedLegFileName);
        }
        return listMilestoneDocuments(legDocument, clonedLegDoc, clonedProposalRef, clonedProposalRef != null);
    }

    private MilestoneViewResponse listMilestoneDocuments(LegDocument legDocument, LegDocument clonedLegDoc, String clonedProposalRef, boolean isToBeCompared) throws IOException {
        Map<String, Object> unzippedFiles = MilestoneHelper.getMilestoneFiles(legDocument);
        Map<String, Object> contentFiles = MilestoneHelper.filterAndSortFiles(unzippedFiles, HTML);
        Map<String, Map> versionAndAnnexNumberMap = populateVersionAndAnnexNumberMap(unzippedFiles, legDocument.getContainedDocuments());
        Map<String, String> docVersionMap = versionAndAnnexNumberMap.get("docVersionMap");
        Map<String, Integer> annexKeyMap = versionAndAnnexNumberMap.get("annexKeyMap");
        Map<String, Object> pdfRenditions = MilestoneHelper.filterAndSortFiles(unzippedFiles, PDF);
        List<MilestoneDocumentView> listDocuments = new ArrayList<>();
        boolean isContributionChanged = false;
        Map<String, Object> annexAddedMap = new HashMap<>();
        LeosPackage originalPackage = packageService.findPackageByDocumentRef(legDocument.getName().replace(".leg",""), LegDocument.class);

        if (isToBeCompared) {
            try {
                Map<String, Object> contributionFiles = MilestoneHelper.getMilestoneFiles(clonedLegDoc);
                Map<String, Object> clonedContentFiles = MilestoneHelper.filterAndSortFiles(contributionFiles, HTML);
                Map<String, String> docVersionOriginalMap = versionAndAnnexNumberMap.get("docVersionMap");
                Map<String, Integer> annexKeyOriginalMap = versionAndAnnexNumberMap.get("annexKeyMap");
                annexAddedMap = MilestoneHelper.populateAnnexAddedMap(contributionFiles, clonedLegDoc, getAnnexes(originalPackage), xmlContentProcessor);
                Map<String, Object> annexDeletedMap = MilestoneHelper.populateAnnexDeletedMap(unzippedFiles,
                        contributionFiles, legDocument, getAnnexes(originalPackage), xmlContentProcessor);
                try {
                    isContributionChanged = identifyContributionChanges(clonedProposalRef, originalPackage, legDocument, clonedLegDoc.getName());
                } catch (Exception e) {
                    isContributionChanged = false;
                }

                for (Map.Entry<String, Object> entry : annexDeletedMap.entrySet()) {
                    String contentFileName = entry.getKey().replace(PROCESSED, "").replace(ACCEPTED_ADDED, "").replace(ACCEPTED_DELETED, "");
                    String version = docVersionOriginalMap.get(contentFileName);
                    byte[] xmlBytes = ((LeosFile) entry.getValue()).getBytes();
                    String htmlContent = new String(xmlBytes, StandardCharsets.UTF_8);
                    MilestoneDocumentView milestoneView = new MilestoneDocumentView(htmlContent, version, contentFileName, false, null);
                    milestoneView.setVersion(version);
                    milestoneView.setLeosCategory(LeosCategory.ANNEX);
                    milestoneView.setOrder(annexKeyOriginalMap.get(contentFileName));
                    milestoneView.setContentStatus("Deleted");
                    if (entry.getKey().contains(PROCESSED)) {
                        milestoneView.setContentStatus("Rejected_Deleted");
                    } else if (entry.getKey().contains(ACCEPTED_DELETED)) {
                        milestoneView.setContentStatus("Accepted_Deleted");
                    }
                    String tocFile = contentFileName + TOC_JS;
                    LeosFile toc = (LeosFile) unzippedFiles.get(tocFile);
                    if (toc!=null) {
                        milestoneView.setTocData(this.buildTocTree(toc));
                    }
                    listDocuments.add(milestoneView);
                }

                Optional<String> financialStatementName =
                        contentFiles.keySet().stream().filter((n) -> n.startsWith(String.valueOf(LeosCategory.STAT_DIGIT_FINANC_LEGIS))).findFirst();
                if (financialStatementName.isPresent()) {
                    boolean existsStatFinancial =
                            clonedContentFiles.keySet().stream().filter((n) -> n.startsWith(String.valueOf(LeosCategory.STAT_DIGIT_FINANC_LEGIS))).count() > 0;
                    if (!existsStatFinancial) {
                        byte[] htmlBytes = ((LeosFile) contentFiles.get(financialStatementName.get())).getBytes();
                        String contentFileName = financialStatementName.get();
                        String contentFileNameWithoutHtml = contentFileName.substring(0,
                                contentFileName.indexOf(HTML));
                        String version = null;
                        String htmlContent = new String(htmlBytes, StandardCharsets.UTF_8);
                        MilestoneDocumentView milestoneView = new MilestoneDocumentView(htmlContent, version, contentFileNameWithoutHtml, false, null);
                        for (String key : docVersionOriginalMap.keySet()) {
                            if (key.startsWith(String.valueOf(LeosCategory.STAT_DIGIT_FINANC_LEGIS))) {
                                version = docVersionOriginalMap.get(key);
                                break;
                            }
                        }
                        milestoneView.setVersion(version);
                        milestoneView.setLeosCategory(LeosCategory.STAT_DIGIT_FINANC_LEGIS);
                        milestoneView.setOrder(1);
                        milestoneView.setContentStatus("Deleted");
                        // Checks if this is rejected
                        if (legDocument != null) {
                            Optional<String> originalFS =
                                    legDocument.getContainedDocuments().stream().filter((d) -> d.contains(contentFileNameWithoutHtml)).findFirst();
                            if (originalFS.isPresent() && originalFS.get().contains(PROCESSED)) {
                                milestoneView.setContentStatus("Rejected_Deleted");
                            }
                        }
                        // Checks if this is accepted
                        boolean accepted =
                                !getFinancialStatements(originalPackage).stream().filter((fs) -> contentFileNameWithoutHtml.equalsIgnoreCase(fs.getMetadata().get().getRef())).findFirst().isPresent();

                        if (accepted) {
                            milestoneView.setContentStatus("Accepted_Deleted");
                        }
                        String tocFile = contentFileName.replace(".html", "") + TOC_JS;
                        LeosFile toc = (LeosFile) unzippedFiles.get(tocFile);
                        if (toc != null) {
                            milestoneView.setTocData(this.buildTocTree(toc));
                        }
                        listDocuments.add(milestoneView);
                    }
                }
                contentFiles = clonedContentFiles;
                unzippedFiles = contributionFiles;
                versionAndAnnexNumberMap = populateVersionAndAnnexNumberMap(contributionFiles, clonedLegDoc.getContainedDocuments());
                docVersionMap = versionAndAnnexNumberMap.get("docVersionMap");
                annexKeyMap = versionAndAnnexNumberMap.get("annexKeyMap");
                pdfRenditions = MilestoneHelper.filterAndSortFiles(contributionFiles, PDF);
                legDocument = clonedLegDoc;
            } catch (Exception e) {
                LOG.debug("Couldn't get contribution's leg document");
            }
        }

        for (Map.Entry<String, Object> entry : contentFiles.entrySet()) {
            String key = entry.getKey();
            String mainFileName = docVersionMap.keySet().stream().filter(value -> value.startsWith(MAIN_DOCUMENT_FILE_NAME)).findFirst().orElse("");
            String contentFileName = key.startsWith(COVER_PAGE_CONTENT_FILE_NAME) ? mainFileName : key.substring(0, key.indexOf(HTML));
            String version = docVersionMap.get(contentFileName);
            boolean isCoverPage = key.startsWith(COVER_PAGE_CONTENT_FILE_NAME);
            try {
                byte[] htmlBytes = ((LeosFile) entry.getValue()).getBytes();
                String xmlContent = LeosDomainUtil.wrapXmlFragment(new String(htmlBytes));
                String htmlContent = new String(htmlBytes, UTF_8);
                String tocFile = null;
                MilestoneDocumentView milestoneView = new MilestoneDocumentView(htmlContent,
                        version, contentFileName, isCoverPage, null);
                if (isCoverPage) {
                    milestoneView.setLeosCategory(LeosCategory.COVERPAGE);
                    tocFile = "coverPage_toc.js";
                    if (isModifiedXmlContent(xmlContent) && milestoneView.getContentStatus() == null) {
                        milestoneView.setContentStatus("Modified");
                    }
                } else {
                    tocFile = contentFileName + TOC_JS;
                    LeosCategory category = xmlContentProcessor.identifyCategory(xmlContent.getBytes(StandardCharsets.UTF_8));
                    milestoneView.setLeosCategory(category);
                    if (category.equals(LeosCategory.ANNEX)) {
                        milestoneView.setOrder(annexKeyMap.get(contentFileName));
                        if (annexAddedMap.containsKey(contentFileName)) {
                            milestoneView.setContentStatus("Added");
                        } else if (annexAddedMap.containsKey(contentFileName.concat(PROCESSED))) {
                            milestoneView.setContentStatus("Rejected_Added");
                        } else if (annexAddedMap.containsKey(contentFileName.concat(ACCEPTED_ADDED))) {
                            milestoneView.setContentStatus("Accepted_Added");
                        }
                    } else if (category.equals(LeosCategory.STAT_DIGIT_FINANC_LEGIS)) {
                        milestoneView.setOrder(1);
                        Boolean existsStatFinancial = false;
                        if (isToBeCompared) {
                            for (String x : unzippedFiles.keySet()) {
                                if (x.startsWith(String.valueOf(LeosCategory.STAT_DIGIT_FINANC_LEGIS))) {
                                    existsStatFinancial = true;
                                    break;
                                }
                            }
                            if (existsStatFinancial) {
                                Optional<String> clonedFS =
                                        legDocument.getContainedDocuments().stream().filter((d) -> d.contains(contentFileName)).findFirst();
                                if (clonedFS.isPresent() && clonedFS.get().contains(PROCESSED)) {
                                    milestoneView.setContentStatus("Rejected_Added");
                                }
                                byte[] xmlBytes = ((LeosFile) unzippedFiles.get(contentFileName + XML)).getBytes();
                                populateCloneProposalMetadataVO(xmlBytes);
                                List<FinancialStatement> fs = getFinancialStatements(originalPackage);
                                if (!fs.isEmpty() && !fs.get(0).getMetadata().get().getRef().equals(cloneContext.getCloneProposalMetadataVO().getClonedFromRef())) {
                                    milestoneView.setContentStatus("Accepted_Added");
                                } else if (fs.isEmpty()) {
                                    milestoneView.setContentStatus("Added");
                                }
                            }
                        }
                    }
                    if (isModifiedXmlContent(xmlContent) && milestoneView.getContentStatus() == null) {
                        milestoneView.setContentStatus("Modified");
                    }
                }
                LeosFile toc = (LeosFile) unzippedFiles.get(tocFile);
                if (toc != null) {
                    milestoneView.setTocData(this.buildTocTree(toc));
                }
                listDocuments.add(milestoneView);
            } catch (Exception e) {
                LOG.error("Error when trying to get milestone view {}", e.getMessage(), e.getMessage());
            }
        }

        return new MilestoneViewResponse(listDocuments, !pdfRenditions.isEmpty(), isContributionChanged);
    }

    @Override
    public MilestonePDFDownloadResponse downloadMilestonePDF(String proposalRef, String legFileName, String legFileId) throws IOException {
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);
        LegDocument legDocument;
        if (proposal.isClonedProposal()) {
            LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
            legDocument = getLegDocument(legFileName, leosPackage);
        } else {
            legDocument = legService.findLegDocumentById(legFileId);
        }
        return doDownloadMilestonePDF(legDocument);
    }

    @Override
    public MilestonePDFDownloadResponse downloadMilestonePDFFromVersion(String proposalRef, String versionedReference) throws Exception {
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        LegDocument legDocument = this.legService.findLastLegByVersionedReference(leosPackage.getPath(), versionedReference);
        return doDownloadMilestonePDF(legDocument);
    }

    private MilestonePDFDownloadResponse doDownloadMilestonePDF(LegDocument legDocument) throws IOException {
        byte[] content = null;
        Map<String, Object> unzippedFiles = MilestoneHelper.getMilestoneFiles(legDocument);
        Map<String, Object> pdfRenditions = MilestoneHelper.filterAndSortFiles(unzippedFiles, PDF);
        String fileName = null;
        if (!pdfRenditions.isEmpty()) {
            Map.Entry<String, Object> entry = pdfRenditions.entrySet().iterator().next();
            content = ((LeosFile) entry.getValue()).getBytes();
            fileName = ((LeosFile) entry.getValue()).getName();
        }
        return new MilestonePDFDownloadResponse(content, fileName);
    }

    private Map<String, Map> populateVersionAndAnnexNumberMap(Map<String, Object> files, List<String> containedDocuments) {
        Map<String, Map> docVersionAndAnnexNumberMap = new HashMap<>();
        Map<String, String> docVersionMap = new HashMap<>();
        Map<Integer, String> annexIndexesMap = new HashMap<>();
        Map<String, Integer> annexKeyMap = new HashMap<>();

        containedDocuments.forEach(doc -> {
            int index = doc.lastIndexOf(DOC_VERSION_SEPARATOR);
            docVersionMap.put(doc.substring(0, index).replace(PROCESSED, ""), doc.substring(index + 1, doc.length()));
        });

        Map<String, Object> xmlFiles = MilestoneHelper.filterAndSortFiles(files, XML);
        xmlFiles.forEach((key, value) -> {
            String xmlContent = new String(((LeosFile) value).getBytes(), StandardCharsets.UTF_8);
            String selectedKey = key.substring(0, key.indexOf(XML));

            Pattern patternForAnnexIndex = Pattern.compile(DOC_NUMBER_START_TAG_REG);
            Matcher matcherForAnnexIndex = patternForAnnexIndex.matcher(xmlContent);
            if (matcherForAnnexIndex.find()) {
                int endAnnexIndex = xmlContent.indexOf(DOC_NUMBER_END_TAG);
                String annexIndex = xmlContent.substring(matcherForAnnexIndex.end(), endAnnexIndex);
                annexIndexesMap.put(new Integer(annexIndex), selectedKey);
                annexKeyMap.put(selectedKey, new Integer(annexIndex));
            }
        });
        docVersionAndAnnexNumberMap.put("docVersionMap", docVersionMap);
        docVersionAndAnnexNumberMap.put("annexIndexesMap", annexIndexesMap);
        docVersionAndAnnexNumberMap.put("annexKeyMap", annexKeyMap);
        return docVersionAndAnnexNumberMap;
    }

    private String buildTocTree(LeosFile file) {
        String fileData = "";
        fileData = new String(file.getBytes(), StandardCharsets.UTF_8);
        fileData = fileData.substring(fileData.indexOf("["), fileData.length() - 1);
        return fileData;
    }

    private void populateTrackChangesContext(XmlDocument document) {
        this.trackChangesContext.setTrackChangesEnabled(document.isTrackChangesEnabled());
    }

    private void populateCloneProposalMetadataVO(byte[] xmlContent) {
        CloneProposalMetadataVO cloneProposalMetadataVO = proposalService.getClonedProposalMetadata(xmlContent);
        cloneContext.setCloneProposalMetadataVO(cloneProposalMetadataVO);
    }

    @Override
    public String findDocumentRefByPackageIdAndCategory(String packageId, String category) {
        return proposalService.findDocumentRefByPackageIdAndCategory(packageId, category);
    }
}
