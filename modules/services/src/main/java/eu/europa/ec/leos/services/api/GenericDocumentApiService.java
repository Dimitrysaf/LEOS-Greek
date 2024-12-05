package eu.europa.ec.leos.services.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.common.base.Stopwatch;
import com.sun.istack.NotNull;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.*;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.integration.rest.UserJSON;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMapHelper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.security.TokenService;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.DocumentVOProvider;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.SaveElementResponse;
import eu.europa.ec.leos.services.dto.response.TocAndAncestorsResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.exception.NotFoundException;
import eu.europa.ec.leos.services.export.ExportDW;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.export.ExportVersions;
import eu.europa.ec.leos.services.export.FileHelper;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.services.search.SearchService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.structure.lang.LanguageGroupService;
import eu.europa.ec.leos.services.structure.lang.LanguageMapHolder;
import eu.europa.ec.leos.services.structure.profile.ProfileService;
import eu.europa.ec.leos.services.support.VersionsUtil;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.services.template.TemplateConfigurationService;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import eu.europa.ec.leos.services.user.UserHelper;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.services.utils.LanguageMapUtils;
import eu.europa.ec.leos.services.utils.StructureConfigUtils;
import eu.europa.ec.leos.services.validation.ValidationService;
import eu.europa.ec.leos.vo.light.Profile;
import eu.europa.ec.leos.vo.response.FavouritePackageResponse;
import eu.europa.ec.leos.vo.response.RecentPackageResponse;
import eu.europa.ec.leos.vo.structure.AlternateConfig;
import eu.europa.ec.leos.vo.structure.Attribute;
import eu.europa.ec.leos.vo.structure.Level;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.vo.structure.RefConfig;
import eu.europa.ec.leos.vo.structure.TocItem;
import eu.europa.ec.leos.vo.structure.TocItemType;
import eu.europa.ec.leos.vo.structure.TocItemTypeName;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import io.atlassian.fugue.Maybe;
import io.atlassian.fugue.Option;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.inject.Provider;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Properties;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class GenericDocumentApiService {
    private static final Logger LOG = LoggerFactory.getLogger(GenericDocumentApiService.class);


    private static final String PROPOSAL = "Proposal_";
    private static final String METADATA_IS_REQUIRED = "Metadata is required!";

    private final LeosRepository leosRepository;
    private final ElementProcessor elementProcessor;
    private final XmlContentProcessor xmlContentProcessor;
    private final PackageService packageService;
    private final ProposalService proposalService;
    private final DocumentContentService documentContentService;
    private final ValidationService validationService;
    private final TemplateConfigurationService templateConfigurationService;
    private final SearchService searchService;
    private final DocumentViewService documentViewService;
    private final Provider<StructureContext> structureContextProvider;
    private final Provider<CloneContext> cloneContextProvider;
    private final SecurityContext securityContext;
    private final MessageHelper messageHelper;
    private final UserHelper userHelper;
    private final LeosPermissionAuthorityMapHelper leosPermissionAuthorityMapHelper;
    private final DocumentVOProvider documentVOProvider;
    private final ComparisonDelegateAPI<XmlDocument> comparisonDelegate;
    private final ExportService exportService;
    private final UserService userService;
    private final LanguageGroupService languageGroupService;
    private final DocumentLanguageContext documentLanguageContext;
    private final TokenService tokenService;
    private final ProfileService profileService;
    private Provider<StructureContext> structureContext;
    protected final TrackChangesContext trackChangesContext;

    private final Properties applicationProperties;
    @Autowired
    public GenericDocumentApiService(@NotNull LeosRepository leosRepository,
                                     @NotNull ElementProcessor elementProcessor,
                                     @NotNull XmlContentProcessor xmlContentProcessor,
                                     @NotNull PackageService packageService,
                                     @NotNull ProposalService proposalService,
                                     @NotNull DocumentContentService documentContentService,
                                     @NotNull ValidationService validationService,
                                     @NotNull TemplateConfigurationService templateConfigurationService,
                                     @NotNull SearchService searchService,
                                     @NotNull DocumentViewService documentViewService,
                                     @NotNull Provider<StructureContext> structureContextProvider,
                                     @NotNull Provider<CloneContext> cloneContextProvider,
                                     @NotNull SecurityContext securityContext,
                                     @NotNull MessageHelper messageHelper,
                                     @NotNull UserHelper userHelper,
                                     @NotNull LeosPermissionAuthorityMapHelper leosPermissionAuthorityMapHelper,
                                     @NotNull DocumentVOProvider documentVOProvider,
                                     @NotNull ComparisonDelegateAPI<XmlDocument> comparisonDelegate,
                                     @NotNull ExportService exportService,
                                     @NotNull UserService userService,
                                     @NotNull Properties applicationProperties,
                                     @NotNull LanguageGroupService languageGroupService,
                                     @NotNull DocumentLanguageContext documentLanguageContext,
                                     @NotNull TokenService tokenService,
                                     @NotNull ProfileService profileService,
                                     @NotNull Provider<StructureContext> structureContext,
                                     @NotNull TrackChangesContext trackChangesContext) {
        this.leosRepository = Objects.requireNonNull(leosRepository);
        this.elementProcessor = Objects.requireNonNull(elementProcessor);
        this.xmlContentProcessor = Objects.requireNonNull(xmlContentProcessor);
        this.packageService = Objects.requireNonNull(packageService);
        this.proposalService = Objects.requireNonNull(proposalService);
        this.documentContentService = Objects.requireNonNull(documentContentService);
        this.validationService = Objects.requireNonNull(validationService);
        this.templateConfigurationService = Objects.requireNonNull(templateConfigurationService);
        this.searchService = Objects.requireNonNull(searchService);
        this.documentViewService = Objects.requireNonNull(documentViewService);
        this.structureContextProvider = Objects.requireNonNull(structureContextProvider);
        this.cloneContextProvider = Objects.requireNonNull(cloneContextProvider);
        this.securityContext = Objects.requireNonNull(securityContext);
        this.messageHelper = Objects.requireNonNull(messageHelper);
        this.userHelper = Objects.requireNonNull(userHelper);
        this.leosPermissionAuthorityMapHelper = Objects.requireNonNull(leosPermissionAuthorityMapHelper);
        this.documentVOProvider = Objects.requireNonNull(documentVOProvider);
        this.comparisonDelegate = Objects.requireNonNull(comparisonDelegate);
        this.exportService = exportService;
        this.userService = userService;
        this.applicationProperties = applicationProperties;
        this.documentLanguageContext = documentLanguageContext;
        this.languageGroupService = languageGroupService;
        this.tokenService = tokenService;
        this.profileService = profileService;
        this.structureContext = structureContext;
        this.trackChangesContext = trackChangesContext;
    }

    public DocumentViewResponse getDocumentByRef(@NotNull String docRef) throws NotFoundException {
        return Optional.ofNullable(this.findDocumentByRef(XmlDocument.class, docRef))
                .map(doc -> this.documentViewService.getDocumentView(doc))
                .orElseThrow(
                        () -> new NotFoundException(String.format("Not found document with %s reference", docRef)));
    }

    public List<VersionVO> saveDocument(String documentRef, VersionType versionType, String versionComment) {
        XmlDocument document = this.findDocumentByRef(documentRef);
        document = this.leosRepository.findDocumentById(document.getId(), XmlDocument.class, true);
        LeosMetadata metadata = this.getDocMetadata(document);
        byte[] content = this.getDocumentContent(document);
        document = this.leosRepository.updateDocument(document.getId(), metadata, content, versionType, versionComment,
                XmlDocument.class);
        documentViewService.updateProposalAsync(document);
        return this.getMajorVersionsData(documentRef, 0, 1);
    }

    public boolean uploadDocument(String documentRef, VersionType versionType, String versionComment, byte[] updatedDocContent) {
        XmlDocument document = this.findDocumentByRef(documentRef);
        document = this.leosRepository.findDocumentById(document.getId(), XmlDocument.class, true);
        LeosMetadata metadata = this.getDocMetadata(document);
        document = this.leosRepository.updateDocument(document.getId(), metadata, updatedDocContent, versionType, versionComment,
                XmlDocument.class);
        documentViewService.updateProposalAsync(document);
        return true;
    }

    public List<TocItem> getTocItems(@NotNull String docRef) {
        XmlDocument document = this.findDocumentByRef(docRef);
        String docTemplate = this.getDocTemplate(document);
        this.getStructureContext().useDocumentTemplate(docTemplate);
        return this.getStructureContext().getTocItems();
    }

    public DocumentConfigResponse getDocumentConfig(@NotNull XmlDocument document, @NotNull StructureContext structure,
                                                    String clientContextToken) {
        structure.useDocumentTemplate(this.getDocTemplate(document));
        this.populateCloneProposalMetadata(document);
        LeosMetadata documentMetadata = document.getMetadata().get();
        List<LeosMetadata> documentsMetadataList = packageService.getDocumentsMetadata(documentMetadata.getRef());
        List<NumberingConfig> numberConfigs = structure.getNumberingConfigs();
        List<TocItem> tocItems = structure.getTocItems();
        List<AlternateConfig> alternateConfigs = structure.getAlternateConfigs();
        List<RefConfig> refConfigs = structure.getRefConfigs();
        Map<TocItemTypeName, List<Level>> listNumberConfigJsonArray = StructureConfigUtils.getNumberingConfigsFromTocItem(numberConfigs, tocItems, XmlHelper.POINT, documentMetadata.getLanguage());
        Map<String, Attribute> articleTypesConfig = getArticleTypesAttributes(tocItems);
        Proposal proposal = this.getDocProposal(document);
        // Note: proposal can be null in cases of leos light scenarios
        ProposalMetadata proposalMetadata = proposal != null ? proposal.getMetadata().getOrNull() : null;
        boolean isClonedProposal = proposal != null && proposal.isClonedProposal();
        languageGroupService.getLanguageMap();
        String langGroup = LanguageMapUtils.getLanguageGroup(LanguageMapHolder.getLanguageMap(), documentMetadata.getLanguage());
        String contextRole = null;
        Profile profile = null;
        if(org.apache.commons.lang3.StringUtils.isNotBlank(clientContextToken) && tokenService.validateClientContextToken(clientContextToken)) {
            contextRole = tokenService.extractUserRoleFromToken(clientContextToken);
            profile = profileService.getProfile(tokenService.extractUserSystemNameFromToken(clientContextToken),
                    documentMetadata.getLanguage());
        }

        return new DocumentConfigResponse(
                documentsMetadataList,
                numberConfigs,
                tocItems,
                alternateConfigs,
                refConfigs,
                listNumberConfigJsonArray,
                articleTypesConfig,
                documentMetadata.getRef(),
                proposalMetadata,
                structure.getTocRules(),
                document.isTrackChangesEnabled(),
                true,
                isClonedProposal,
                langGroup,
                documentMetadata.getLanguage(),
                profile,
                contextRole
        );
    }

    public DocumentConfigResponse getDocumentConfig(@NotNull String docRef) {
        XmlDocument document = this.findDocumentByRef(docRef);
        StructureContext structure = this.getStructureContext();
        return getDocumentConfig(document, structure, null);
    }

    // ------------- VERSION METHODS
    // TODO Refactor to a documentVersioningService

    public DocumentViewResponse getVersion(@NotNull String versionId) {
        XmlDocument document = this.findDocumentById(versionId);
        List<LeosPermission> userPermissions = this.securityContext.getPermissions(document);
        String versionContent = this.documentContentService.getDocumentAsHtml(document, "", userPermissions);
        VersionInfoVO versionInfoVO = this.documentViewService.getVersionInfo(document);
        String reference = this.getDocReference(document);
        return new DocumentViewResponse(reference, versionContent, versionInfoVO, null, null);
    }

    public byte[] getXmlContent(@NotNull String versionId) {
        XmlDocument document = this.findDocumentById(versionId);
        return document.getContent().get().getSource().getBytes();
    }


    public DocumentViewResponse showCleanVersion(String documentRef) {
        final XmlDocument document = this.findDocumentByRef(documentRef);
        final String versionContent = documentContentService.getCleanDocumentAsHtml(document, "",
                securityContext.getPermissions(document));
        VersionInfoVO versionInfoVO = this.documentViewService.getVersionInfo(document);
        return new DocumentViewResponse(versionContent, versionInfoVO);
    }

    public void finaliseDocument(String documentRef) throws Exception {
        final XmlDocument xmlDocument = this.findDocumentByRef(documentRef);
        byte[] xmlContent = xmlContentProcessor.cleanSoftActions(xmlDocument.getContent().get().getSource().getBytes());
        xmlContent = xmlContentProcessor.cleanTrackChanges(xmlContent);
        this.leosRepository.updateDocument(
                xmlDocument.getId(),
                xmlContent,
                VersionType.MINOR,
                messageHelper.getMessage("operation.document.finalised"),
                XmlDocument.class
        );
    }

    public byte[] downloadCleanVersion(String documentRef) {
        byte[] cleanVersion = new byte[0];
        FinancialStatement document = this.findDocumentByRef(FinancialStatement.class, documentRef);
        Stopwatch stopwatch = Stopwatch.createStarted();
        Proposal proposal = this.documentViewService.getProposalFromPackage(document);
        String proposalId = proposal.getId();
        if (proposal.isClonedProposal()) {
            try {
                final String jobFileName =
                        PROPOSAL + proposalId + "_AKN2LW_CLEAN_" + System.currentTimeMillis() + ".docx";
                ExportOptions exportOptions = new ExportLW(ExportOptions.Output.PDF, FinancialStatement.class, false,
                        true);
                exportOptions.setExportVersions(new ExportVersions(null, document));
                exportService.createDocumentPackage(jobFileName, proposalId, exportOptions, securityContext.getUser());
            } catch (Exception e) {
                LOG.error("Unexpected error occurred while using ExportService", e);
            }
        } else {
            try {
                final String jobFileName =
                        PROPOSAL + proposalId + "_AKN2DW_CLEAN_" + System.currentTimeMillis() + ".docx";
                ExportOptions exportOptions = new ExportDW(ExportOptions.Output.WORD, FinancialStatement.class, false,
                        true);
                exportOptions.setExportVersions(new ExportVersions<FinancialStatement>(null, document));
                cleanVersion = exportService.createDocuWritePackage(
                        FileHelper.getReplacedExtensionFilename(jobFileName, "zip"), proposalId, exportOptions);
            } catch (Exception e) {
                LOG.error("Unexpected error occurred while using ExportService", e);
            }
        }
        LOG.info(
                "The actual version of CLEANED FinancialStatement for proposal {}, downloaded in {} milliseconds ({} sec)",
                proposalId, stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        return cleanVersion;
    }

    public List<VersionVO> getMajorVersionsData(@NotNull String docRef, int pageIndex, int pageSize) {
        List<XmlDocument> majorVersions = this.leosRepository.findAllMajors(XmlDocument.class, docRef, pageIndex,
                pageSize);
        List<VersionVO> versions = VersionsUtil.buildVersionVO(majorVersions, messageHelper);

        for (VersionVO version : versions) {
            version.setCreatedBy(userHelper.convertToPresentation(version.getUsername()));
        }
        return versions;
    }

    public List<VersionVO> searchVersions(@NotNull String docRef, String authorKey, String versionType) {
        List<String> authorLogins = new ArrayList<>();
        if (StringUtils.hasText(authorKey)) {
            List<UserJSON> users = userService.searchUsersByKey(authorKey);
            authorLogins = users.stream().map(user -> user.getLogin()).collect(Collectors.toList());
        }
        List<XmlDocument> foundVersions = this.leosRepository.searchVersions(XmlDocument.class, docRef, authorLogins,
                versionType);
        List<VersionVO> versions = VersionsUtil.buildVersionVO(foundVersions, messageHelper);

        for (VersionVO version : versions) {
            version.setCreatedBy(userHelper.convertToPresentation(version.getUsername()));
        }
        return versions;
    }

    public int countMajorVersionsData(@NotNull String docRef) {
        return this.leosRepository.findAllMajorsCount(XmlDocument.class, docRef);
    }

    public List<VersionVO> getIntermediateVersionsData(String documentRef, String currIntVersion, int pageIndex,
                                                       int pageSize) {
        return VersionsUtil.buildVersionResponse(
                this.leosRepository.findAllMinorsForIntermediate(XmlDocument.class, documentRef,
                        currIntVersion, pageIndex, pageSize), messageHelper, userHelper);
    }

    public int countIntermediateVersionsData(String documentRef, String currIntVersion) {
        return this.leosRepository.findAllMinorsCountForIntermediate(XmlDocument.class, documentRef, currIntVersion);
    }

    public List<VersionVO> getRecentMinorVersions(@NotNull String docRef, int pageIndex, int pageSize) {
        XmlDocument document = this.findDocumentByRef(docRef);
        LeosDocument latestVersion = this.leosRepository.findLatestMajorVersionById(XmlDocument.class, document.getId(),
                docRef);
        List<XmlDocument> versionDocs = this.leosRepository.findRecentMinorVersions(XmlDocument.class, docRef,
                latestVersion.getCmisVersionLabel(), pageIndex,
                pageSize);
        return VersionsUtil.buildVersionResponse(versionDocs, messageHelper, userHelper);
    }

    public int countRecentMinorVersions(@NotNull String docRef) {
        XmlDocument document = this.findDocumentByRef(docRef);
        LeosDocument latestVersion = this.leosRepository.findLatestMajorVersionById(XmlDocument.class, document.getId(),
                docRef);
        return this.leosRepository.findRecentMinorVersionsCount(XmlDocument.class, docRef,
                latestVersion.getCmisVersionLabel());
    }

    public DocumentViewResponse restoreToVersion(@NotNull String docRef,
                                                 @NotNull String versionId) {
        XmlDocument document = this.findDocumentByRef(docRef);
        XmlDocument restoreVersion = this.findDocumentById(versionId);
        byte[] restoreContent = this.getDocumentContent(restoreVersion);
        document = this.leosRepository.updateDocument(
                document.getId(),
                this.getDocMetadata(document),
                restoreContent,
                VersionType.MINOR,
                messageHelper.getMessage("operation.restore.version", restoreVersion.getVersionLabel()),
                XmlDocument.class
        );
        //call validation on document with updated content
        this.validationService.validateDocumentAsync(
                this.documentVOProvider.createDocumentVO(document, restoreContent));

        return this.documentViewService.updateDocumentView(document);
    }

    public String compare(String newVersionId, String oldVersionId) {
        XmlDocument oldVersion = this.findDocumentById(oldVersionId);
        XmlDocument newVersion = this.findDocumentById(newVersionId);

        return this.comparisonDelegate.getMarkedContent(oldVersion, newVersion);
    }

    // -------------- ELEMENT METHODS
    // This will work only for Financial Statement
    public SaveElementResponse saveElement(String documentRef,
                                           String elementId,
                                           String elementName,
                                           String elementContent) throws Exception {
        XmlDocument document = this.findDocumentByRef(documentRef);
        this.populateCloneProposalMetadata(document);

        LeosMetadata metadata = this.getDocMetadata(document);
        documentLanguageContext.setDocumentLanguage(metadata.getLanguage());

        StructureContext structure = this.getStructureContext();
        structure.useDocumentTemplate(this.getDocTemplate(document));

        byte[] newXmlContent = this.elementProcessor.updateElement(document, elementContent, elementName, elementId,
                true);
        newXmlContent = this.xmlContentProcessor.doXMLPostProcessing(newXmlContent);

        document = this.leosRepository.updateDocument(
                document.getId(),
                newXmlContent,
                VersionType.MINOR,
                messageHelper.getMessage("operation.financial.statement.block.updated"),
                XmlDocument.class
        );
        documentViewService.updateProposalAsync(document);
        String newContent = this.elementProcessor.getElement(document, elementName, elementId);
        return new SaveElementResponse(elementId, elementName, newContent);
    }

    public EditElementResponse getElement(String documentRef, String elementId, String elementTagName) {
        FinancialStatement document = this.findDocumentByRef(FinancialStatement.class, documentRef);
        Proposal proposal = this.getDocProposal(document);
        boolean isClonedProposal = proposal != null ? proposal.isClonedProposal() : false;

        StructureContext structure = this.getStructureContext();
        structure.useDocumentTemplate(this.getDocTemplate(document));

        User user = securityContext.getUser();
        String element = this.elementProcessor.getElement(document, elementTagName, elementId);
        return new EditElementResponse(
                user,
                leosPermissionAuthorityMapHelper.getPermissionsForRoles(securityContext.getAuthorities()),
                elementId,
                elementTagName,
                element,
                "",
                isClonedProposal
        );
    }

    public String getUserGuidance(String docRef) {
        return Optional.of(docRef)
                .map(this::findDocumentByRef)
                .map(this::getDocTemplate)
                .map(template -> this.templateConfigurationService.getTemplateConfiguration(template, "guidance"))
                .orElse(null);
    }

    public List<SearchMatchVO> searchTextInDocument(@NotNull String documentRef,
                                                    @NotNull String searchText,
                                                    boolean matchCase,
                                                    boolean completeWords,
                                                    String tempUpdatedContentXML) throws Exception {
        byte[] targetAnnexBytes;

        if (null == tempUpdatedContentXML || tempUpdatedContentXML.isEmpty()) {
            targetAnnexBytes = getContent(this.findDocumentByRef(documentRef));
        } else {
            targetAnnexBytes = tempUpdatedContentXML.getBytes();
        }
        return this.searchService.searchTextForHighlight(targetAnnexBytes, searchText, matchCase, completeWords);
    }

    public byte[] replaceOneTextInDocument(ReplaceMatchRequest event) throws Exception {
        XmlDocument document = findDocumentByRef(event.getDocumentRef());

        byte[] contentForReplace = getContentForReplaceProcess(event.getTempUpdatedContentXML(), document);
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(contentForReplace, event.getSearchText(),
                event.isCaseSensitive(), event.isCompleteWords());
        return searchService.replaceText(
                contentForReplace,
                event.getSearchText(),
                event.getReplaceText(),
                Arrays.asList(searchMatchVOS.get(event.getMatchIndex())),
                document.isTrackChangesEnabled());
    }

    public byte[] replaceAllTextInDocument(ReplaceAllMatchRequest event) throws Exception {
        XmlDocument document = findDocumentByRef(event.getDocumentRef());
        byte[] contentForReplace = getContentForReplaceProcess(event.getTempUpdatedContentXML(), document);

        populateCloneProposalMetadata(document);

        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(contentForReplace, event.getSearchText(),
                event.isCaseSensitive(), event.isCompleteWords());
        return searchService.replaceText(
                contentForReplace,
                event.getSearchText(),
                event.getReplaceText(),
                searchMatchVOS,
                document.isTrackChangesEnabled());

    }

    public DocumentViewResponse saveAfterReplace(SaveAfterReplaceRequest event) {
        XmlDocument document = this.findDocumentByRef(event.getDocumentRef());
        populateCloneProposalMetadata(document);
        document = this.leosRepository.updateDocument(
                document.getId(),
                event.getUpdatedContent().getBytes(StandardCharsets.UTF_8),
                VersionType.MINOR,
                messageHelper.getMessage("operation.search.replace.updated"),
                XmlDocument.class
        );

        return this.documentViewService.updateDocumentView(document);
    }

    private byte[] getContentForReplaceProcess(String updatedContentXML, XmlDocument document) {
        if (updatedContentXML == null || updatedContentXML.isEmpty()) {
            return getContent(document);
        }
        return updatedContentXML.getBytes();
    }

    private byte[] getContent(XmlDocument document) {
        final Content content = document.getContent().getOrError(() -> "Document content is required!");
        return content.getSource().getBytes();
    }

    private StructureContext getStructureContext() {
        return this.structureContextProvider.get();
    }

    private CloneContext getCloneContext() {
        return this.cloneContextProvider.get();
    }

    private Proposal getDocProposal(XmlDocument document) {
        return Optional.of(document)
                .map(XmlDocument::getMetadata)
                .map(metadata -> this.packageService.findPackageByDocumentRef(metadata.get().getRef(),
                        XmlDocument.class))
                .map(pack -> this.proposalService.findProposalByPackagePath(pack.getPath()))
                .orElse(null);
    }

    private void populateCloneProposalMetadata(@NotNull XmlDocument document) {
        Proposal proposal = this.getDocProposal(document);
        if (proposal != null && proposal.isClonedProposal()) {
            byte[] xmlContent = this.getDocumentContent(proposal);
            CloneProposalMetadataVO cloneProposalMetadataVO = this.proposalService.getClonedProposalMetadata(
                    xmlContent);
            this.getCloneContext().setCloneProposalMetadataVO(cloneProposalMetadataVO);
        }
    }

    // TODO refactor to a Util class
    private byte[] getDocumentContent(XmlDocument document) throws RuntimeException {
        return Optional.ofNullable(document.getContent())
                .map(Maybe::get)
                .map(Content::getSource)
                .map(Content.Source::getBytes)
                .orElseThrow(
                        () -> new RuntimeException(String.format("Document %s is missing content", document.getId())));
    }

    private String getDocTemplate(XmlDocument document) {
        return Optional.of(document)
                .map(XmlDocument::getMetadata)
                .map(Maybe::get)
                .map(meta -> meta.getDocTemplate())
                .orElseThrow(() -> new RuntimeException(
                        String.format("Document %s is missing docTemplate", document.getId())));
    }

    private String getDocReference(XmlDocument document) {
        return Optional.of(this.getDocMetadata(document))
                .map(LeosMetadata::getRef)
                .orElse(null);
    }

    private LeosMetadata getDocMetadata(XmlDocument document) {
        return Optional.of(document)
                .map(XmlDocument::getMetadata)
                .map(Option::getOrNull)
                .orElse(null);
    }

    private Map<String, Attribute> getArticleTypesAttributes(List<TocItem> tocItems) {
        Map<String, Attribute> articleTypesAttributes = new HashMap<>();
        List<TocItemType> tocItemTypes = StructureConfigUtils.getTocItemTypesByTagName(tocItems, XmlHelper.ARTICLE);
        tocItemTypes.forEach(tocItemType -> {
            Attribute attribute = tocItemType.getAttribute();
            if (attribute == null) {
                attribute = new Attribute();
                attribute.setAttributeName("");
                attribute.setAttributeValue("");
            }
            articleTypesAttributes.put(tocItemType.getName().name(), attribute);
        });
        return articleTypesAttributes;
    }

    private <T extends XmlDocument> T findDocumentByRef(@NotNull Class<T> docClass,
                                                        @NotNull String docRef) throws NotFoundException {
        return Optional.ofNullable(this.leosRepository.findDocumentByRef(docRef, docClass))
                .orElseThrow(
                        () -> new NotFoundException(String.format("Not found document with %s reference", docRef)));
    }

    private XmlDocument findDocumentByRef(@NotNull String docRef) throws NotFoundException {
        return this.findDocumentByRef(XmlDocument.class, docRef);
    }

    private XmlDocument findDocumentById(@NotNull String docId) throws NotFoundException {
        return Optional.ofNullable(this.leosRepository.findDocumentById(docId, XmlDocument.class, false))
                .map(leosDoc -> (XmlDocument) leosDoc)
                .orElseThrow(() -> new NotFoundException(String.format("Not found document with %s id", docId)));
    }

    public List<RecentPackageResponse> findRecentPackagesForUser() {
        String userId = securityContext.getUser().getLogin();
        String numberOfResult = applicationProperties.getProperty("leos.home.page.result");
        return this.leosRepository.findRecentPackagesForUser(userId, numberOfResult);
    }

    public List<FavouritePackageResponse> findFavouritePackagesForUser() {
        String userId = securityContext.getUser().getLogin();
        return this.leosRepository.findFavouritePackagesForUser(userId);
    }

    public FavouritePackageResponse toggleFavouritePackage(String ref) {
        String userId = securityContext.getUser().getLogin();
        return this.leosRepository.toggleFavouritePackage(ref, userId);
    }

    public Object configNotificationsUpload(String content) throws JsonProcessingException {
        return this.leosRepository.configNotificationsUpload(content);
    }

    public String configNotificationsFetch() {
        return this.leosRepository.configNotificationsFetch();
    }

    public TocAndAncestorsResponse fetchTocAncestor(String documentRef, List<String> elementIds) {
        XmlDocument xmlDocument = this.findDocumentByRef(documentRef);
        trackChangesContext.setTrackChangesEnabled(xmlDocument.isTrackChangesEnabled());
        documentLanguageContext.setDocumentLanguage(xmlDocument.getMetadata().get().getLanguage());
        List<String> elementAncestorsIds = null;
        StructureContext context = structureContext.get();
        context.useDocumentTemplate(xmlDocument.getMetadata().getOrError(() -> METADATA_IS_REQUIRED).getDocTemplate());
        if (CollectionUtils.isNotEmpty(elementIds)) {
            try {
                elementAncestorsIds = this.getAncestorsIdsForElementId(xmlDocument, elementIds);
            } catch (Exception e) {
                LOG.warn("Could not get ancestors Ids", e);
            }
        }
        // we are combining two operations (get toc + get selected element ancestors)
        final Map<String, List<TableOfContentItemVO>> tocItemList = packageService.getTableOfContent(
                xmlDocument.getMetadata().get().getRef(), TocMode.SIMPLIFIED_CLEAN);
        return new TocAndAncestorsResponse(tocItemList, elementAncestorsIds, messageHelper,
                context.getNumberingConfigs(), xmlDocument.getMetadata().get().getLanguage());
    }

    private List<String> getAncestorsIdsForElementId(XmlDocument xmlDocument, List<String> elementIds) {
        Validate.notNull(xmlDocument, "XmlDocument is required");
        Validate.notNull(elementIds, "Element id is required");
        List<String> ancestorIds = new ArrayList<>();
        for(String elementId : elementIds) {
            ancestorIds.addAll(xmlContentProcessor.getAncestorsIdsForElementId(
                    getContent(xmlDocument),
                    elementId));
        }
        return ancestorIds;
    }
}
