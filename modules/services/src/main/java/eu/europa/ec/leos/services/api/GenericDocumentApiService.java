package eu.europa.ec.leos.services.api;

import com.sun.istack.NotNull;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMapHelper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.DocumentVOProvider;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.RefreshElementResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.exception.NotFoundException;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import eu.europa.ec.leos.services.processor.FinancialStatementProcessor;
import eu.europa.ec.leos.services.processor.content.TableOfContentProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.services.search.SearchService;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.support.VersionsUtil;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.services.template.TemplateConfigurationService;
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.services.user.UserHelper;
import eu.europa.ec.leos.services.validation.ValidationService;
import eu.europa.ec.leos.vo.toc.Attribute;
import eu.europa.ec.leos.vo.toc.NumberingConfig;
import eu.europa.ec.leos.vo.toc.StructureConfigUtils;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import eu.europa.ec.leos.vo.toc.TocItemType;
import io.atlassian.fugue.Maybe;
import io.atlassian.fugue.Option;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
public class GenericDocumentApiService {

    private static final Map<LeosCategory, String> DOCUMENT_TOC_STARTING_NODE = new HashMap<LeosCategory, String>() {{
        this.put(LeosCategory.BILL, "bill");
        this.put(LeosCategory.MEMORANDUM, "doc");
        this.put(LeosCategory.ANNEX, "doc");
        this.put(LeosCategory.PROPOSAL, "doc");
        this.put(LeosCategory.STAT_FINANC_LEGIS, "doc");
        this.put(LeosCategory.COUNCIL_EXPLANATORY, "doc");
        this.put(LeosCategory.COVERPAGE, "coverPage");
    }};

    private final LeosRepository leosRepository;
    private final TableOfContentProcessor tableOfContentProcessor;
    private final ElementProcessor elementProcessor;
    private final XmlContentProcessor xmlContentProcessor;
    private final FinancialStatementProcessor financialStatementProcessor;
    private final PackageService packageService;
    private final ProposalService proposalService;
    private final LegService legService;
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

    public GenericDocumentApiService(@NotNull LeosRepository leosRepository,
                                     @NotNull TableOfContentProcessor tableOfContentProcessor,
                                     @NotNull ElementProcessor elementProcessor,
                                     @NotNull XmlContentProcessor xmlContentProcessor,
                                     @NotNull FinancialStatementProcessor financialStatementProcessor,
                                     @NotNull PackageService packageService,
                                     @NotNull ProposalService proposalService,
                                     @NotNull LegService legService,
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
                                     @NotNull DocumentVOProvider documentVOProvider) {
        this.leosRepository = Objects.requireNonNull(leosRepository);
        this.tableOfContentProcessor = Objects.requireNonNull(tableOfContentProcessor);
        this.elementProcessor = Objects.requireNonNull(elementProcessor);
        this.xmlContentProcessor = Objects.requireNonNull(xmlContentProcessor);
        this.financialStatementProcessor = Objects.requireNonNull(financialStatementProcessor);
        this.packageService = Objects.requireNonNull(packageService);
        this.proposalService = Objects.requireNonNull(proposalService);
        this.legService = Objects.requireNonNull(legService);
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
    }

    private StructureContext getStructureContext() {
        return this.structureContextProvider.get();
    }

    private CloneContext getCloneContext() {
        return this.cloneContextProvider.get();
    }

    private Proposal getDocProposal(XmlDocument document) {
        return Optional.of(document)
                .map(XmlDocument::getId)
                .map(this.packageService::findPackageByDocumentId)
                .map(pack -> this.proposalService.findProposalByPackagePath(pack.getPath()))
                .orElseThrow(() -> new RuntimeException(String.format("Not found proposal for document %s", document.getId())));
    }

    private void populateCloneProposalMetadata(@NotNull XmlDocument document) {
        Proposal proposal = this.getDocProposal(document);
        if (proposal.isClonedProposal()) {
            byte[] xmlContent = this.getDocumentContent(proposal);
            CloneProposalMetadataVO cloneProposalMetadataVO = this.proposalService.getClonedProposalMetadata(xmlContent);
            this.getCloneContext().setCloneProposalMetadataVO(cloneProposalMetadataVO);
        }
    }

    // TODO refactor to a Util class
    private byte[] getDocumentContent(XmlDocument document) throws RuntimeException {
        return Optional.ofNullable(document.getContent())
                .map(Maybe::get)
                .map(Content::getSource)
                .map(Content.Source::getBytes)
                .orElseThrow(() -> new RuntimeException(String.format("Document %s is missing content", document.getId())));
    }

    private String getDocTemplate(XmlDocument document) {
        return Optional.of(document)
                .map(XmlDocument::getMetadata)
                .map(Maybe::get)
                .map(meta -> meta.getDocTemplate())
                .orElseThrow(() -> new RuntimeException(String.format("Document %s is missing docTemplate", document.getId())));
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

    // TODO This will be removed when the class extend the BaseDocumentService interface
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
                .orElseThrow(() -> new NotFoundException(String.format("Not found document with %s reference", docRef)));
    }

    private XmlDocument findDocumentByRef(@NotNull String docRef) throws NotFoundException {
        return this.findDocumentByRef(XmlDocument.class, docRef);
    }

    private XmlDocument findDocumentById(@NotNull String docId) throws NotFoundException {
        return Optional.ofNullable(this.leosRepository.findDocumentById(docId, XmlDocument.class, false))
                .map(leosDoc -> (XmlDocument) leosDoc)
                .orElseThrow(() -> new NotFoundException(String.format("Not found document with %s id", docId)));
    }

    public DocumentViewResponse getDocumentByRef(@NotNull String docRef) throws NotFoundException {
        return Optional.ofNullable(this.findDocumentByRef(XmlDocument.class, docRef))
                .map(doc -> this.documentViewService.getDocumentView(doc))
                .orElseThrow(() -> new NotFoundException(String.format("Not found document with %s reference", docRef)));
    }

    public List<VersionVO> saveDocument(String documentRef, VersionType versionType, String versionComment) {
        XmlDocument document = this.findDocumentByRef(documentRef);
        document = this.leosRepository.findDocumentById(document.getId(), XmlDocument.class, true);
        LeosMetadata metadata = this.getDocMetadata(document);
        byte[] content = this.getDocumentContent(document);
        document = this.leosRepository.updateDocument(document.getId(), metadata, content, versionType, versionComment, XmlDocument.class);
        return this.getVersionsData(documentRef);
    }

    public List<TableOfContentItemVO> getTableOfContent(@NotNull String docRef,
                                                        @NotNull TocMode mode) throws NotFoundException {
        XmlDocument document = this.findDocumentByRef(docRef);
        String docTemplate = this.getDocTemplate(document);
        byte[] content = this.getDocumentContent(document);
        String startingNode = Optional.ofNullable(DOCUMENT_TOC_STARTING_NODE.get(document.getCategory()))
                .orElseThrow(() -> new RuntimeException(String.format("Starting node not found for document %s", docRef)));

        this.getStructureContext().useDocumentTemplate(docTemplate);
        List<TableOfContentItemVO> toc = this.tableOfContentProcessor.buildTableOfContent(startingNode, content, mode);
        return toc;
    }

    public List<TocItem> getTocItems(@NotNull String docRef) {
        XmlDocument document = this.findDocumentByRef(docRef);
        String docTemplate = this.getDocTemplate(document);
        this.getStructureContext().useDocumentTemplate(docTemplate);
        return this.getStructureContext().getTocItems();
    }

    public DocumentConfigResponse getDocumentConfig(@NotNull String docRef) {
        XmlDocument document = this.findDocumentByRef(docRef);

        StructureContext structure = this.getStructureContext();
        structure.useDocumentTemplate(this.getDocTemplate(document));

        List<TocItem> tocItems = structure.getTocItems();
        List<NumberingConfig> numberConfigs = structure.getNumberingConfigs();
        Proposal proposal = this.getDocProposal(document);

        return new DocumentConfigResponse(
                packageService.getDocumentsMetadata(document.getId()),
                numberConfigs,
                tocItems,
                structure.getAlternateConfigs(),
                StructureConfigUtils.getNumberingConfigsFromTocItem(numberConfigs, tocItems, XmlHelper.POINT),
                getArticleTypesAttributes(tocItems),
                document.getMetadata().get().getRef(),
                proposal.getMetadata().getOrNull(),
                structure.getTocRules(),
                document.isTrackChangesEnabled(),
                true
        );
    }

    // ------------- VERSION METHODS
    // TODO Refactor to a documentVersioningService

    public DocumentViewResponse getVersion(@NotNull String versionId) {
        XmlDocument document = this.findDocumentById(versionId);
        List<LeosPermission> userPermissions = this.securityContext.getPermissions(document);
        String versionContent = this.documentContentService.getDocumentAsHtml(document, "", userPermissions);
        VersionInfoVO versionInfoVO = this.documentViewService.getVersionInfo(document);
        String reference = this.getDocReference(document);
        return new DocumentViewResponse(reference, versionContent, versionInfoVO);
    }

    public List<VersionVO> getVersionsData(@NotNull String docRef) {
        XmlDocument document = this.findDocumentByRef(docRef);
        List<XmlDocument> majorVersions = this.leosRepository.findAllMajors(XmlDocument.class, docRef, 0, Integer.MAX_VALUE);
        List<VersionVO> versions = VersionsUtil.buildVersionVO(majorVersions, messageHelper);

        for (VersionVO version : versions) {
            this.leosRepository.findAllMinorsCountForIntermediate(XmlDocument.class, docRef, version.getCmisVersionNumber());

            version.setCreatedBy(this.userHelper.convertToPresentation(version.getUsername()));
            version.setSubVersions(
                    VersionsUtil.buildVersionResponse(
                            this.leosRepository.findAllMinorsForIntermediate(XmlDocument.class, docRef, version.getCmisVersionNumber(), 0, Integer.MAX_VALUE),
                            this.messageHelper,
                            this.userHelper
                    )
            );
            if (VersionType.MAJOR.equals(version.getVersionType())) {
                LeosPackage leosPackage = this.packageService.findPackageByDocumentId(document.getId());
                LegDocument legDocument = this.legService.findLastLegByVersionedReference(leosPackage.getPath(), version.getVersionedReference());
                version.setLegFileName(legDocument.getName());
            }
        }
        return versions;
    }

    public List<VersionVO> getRecentMinorVersions(@NotNull String docRef) {
        XmlDocument document = this.findDocumentByRef(docRef);
        LeosDocument latestVersion = this.leosRepository.findLatestMajorVersionById(XmlDocument.class, document.getId());
        List<XmlDocument> versionDocs = this.leosRepository.findRecentMinorVersions(XmlDocument.class, docRef, latestVersion.getCmisVersionLabel(), 0, Integer.MAX_VALUE);
        return VersionsUtil.buildVersionResponse(versionDocs, messageHelper, userHelper);
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
        this.validationService.validateDocumentAsync(this.documentVOProvider.createDocumentVO(document, restoreContent));

        return this.documentViewService.updateDocumentView(document);
    }

    // -------------- ELEMENT METHODS
    // This will work only for Financial Statement
    public RefreshElementResponse saveElement(String documentRef,
                                              String elementId,
                                              String elementName,
                                              String elementContent) throws Exception {
        XmlDocument document = this.findDocumentByRef(documentRef);
        this.populateCloneProposalMetadata(document);

        StructureContext structure = this.getStructureContext();
        structure.useDocumentTemplate(this.getDocTemplate(document));

        byte[] newXmlContent = this.elementProcessor.updateElement(document, elementContent, elementName, elementId, true);
        newXmlContent = Optional.ofNullable(this.xmlContentProcessor.doXMLPostProcessing(newXmlContent))
                .orElseThrow(()->new RuntimeException(String.format("Update element %s failed on document %s", elementId, documentRef)));

        document = this.leosRepository.updateDocument(
                document.getId(),
                newXmlContent,
                VersionType.MINOR,
                messageHelper.getMessage("operation.financial.statement.block.updated"),
                XmlDocument.class
        );
        String newContent = this.elementProcessor.getElement(document, elementName, elementId);
        return new RefreshElementResponse(elementId, elementName, newContent);
    }

    public EditElementResponse getElement(String documentRef, String elementId, String elementTagName) {
        FinancialStatement document = this.findDocumentByRef(FinancialStatement.class, documentRef);
        Proposal proposal = this.getDocProposal(document);

        StructureContext structure = this.getStructureContext();
        structure.useDocumentTemplate(this.getDocTemplate(document));

        User user = securityContext.getUser();
        String element = this.elementProcessor.getElement(document, elementTagName, elementId);
        return new EditElementResponse(
                user,
                leosPermissionAuthorityMapHelper.getPermissionsForRoles(user.getRoles()),
                elementId,
                elementTagName,
                element,
                "",
                proposal.isClonedProposal()
        );
    }

    public String getUserGuidance(String docRef){
        return Optional.of(docRef)
                .map(this::findDocumentByRef)
                .map(this::getDocTemplate)
                .map(template->this.templateConfigurationService.getTemplateConfiguration(template, "guidance"))
                .orElse(null);
    }

    public List<SearchMatchVO> searchTextInDocument(@NotNull String documentRef,
                                                    @NotNull String searchText,
                                                    boolean matchCase,
                                                    boolean completeWords) throws Exception {
        XmlDocument document = this.findDocumentByRef(documentRef);
        List<SearchMatchVO> searchResults = this.searchService.searchText(this.getDocumentContent(document), searchText, matchCase, completeWords);
        return searchResults;
    }
}
