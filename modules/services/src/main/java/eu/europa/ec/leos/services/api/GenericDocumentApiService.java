package eu.europa.ec.leos.services.api;

import com.sun.istack.NotNull;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.exception.NotFoundException;
import eu.europa.ec.leos.services.processor.content.TableOfContentProcessor;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.support.VersionsUtil;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.services.user.UserHelper;
import eu.europa.ec.leos.vo.toc.Attribute;
import eu.europa.ec.leos.vo.toc.NumberingConfig;
import eu.europa.ec.leos.vo.toc.StructureConfigUtils;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import eu.europa.ec.leos.vo.toc.TocItemType;
import io.atlassian.fugue.Maybe;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
public class GenericDocumentApiService {

    private static final Map<LeosCategory, String> DOCUMENT_TOC_STARTING_NODE = new HashMap<LeosCategory, String>(){{
        this.put(LeosCategory.BILL,"bill");
        this.put(LeosCategory.MEMORANDUM,"doc");
        this.put(LeosCategory.ANNEX,"doc");
        this.put(LeosCategory.PROPOSAL,"doc");
        this.put(LeosCategory.STAT_FINANC_LEGIS,"doc");
        this.put(LeosCategory.COUNCIL_EXPLANATORY,"doc");
        this.put(LeosCategory.COVERPAGE,"coverPage");
    }};

    private final LeosRepository leosRepository;
    private final TableOfContentProcessor tableOfContentProcessor;
    private final PackageService packageService;
    private final ProposalService proposalService;
    private final LegService legService;
    private final DocumentViewService documentViewService;
    private final Provider<StructureContext> structureContextProvider;
    private final MessageHelper messageHelper;
    private final UserHelper userHelper;

    public GenericDocumentApiService(@NotNull LeosRepository leosRepository,
                                     @NotNull TableOfContentProcessor tableOfContentProcessor,
                                     @NotNull PackageService packageService,
                                     @NotNull ProposalService proposalService,
                                     @NotNull LegService legService,
                                     @NotNull DocumentViewService documentViewService,
                                     @NotNull Provider<StructureContext> structureContextProvider,
                                     @NotNull MessageHelper messageHelper,
                                     @NotNull UserHelper userHelper) {
        this.leosRepository = Objects.requireNonNull(leosRepository);
        this.tableOfContentProcessor = Objects.requireNonNull(tableOfContentProcessor);
        this.packageService = Objects.requireNonNull(packageService);
        this.proposalService = Objects.requireNonNull(proposalService);
        this.legService = Objects.requireNonNull(legService);
        this.documentViewService = Objects.requireNonNull(documentViewService);
        this.structureContextProvider = Objects.requireNonNull(structureContextProvider);
        this.messageHelper = Objects.requireNonNull(messageHelper);
        this.userHelper = Objects.requireNonNull(userHelper);
    }

    private StructureContext getStructureContext(){
        return this.structureContextProvider.get();
    }

    private byte[] getDocumentContent(XmlDocument document) throws RuntimeException {
        return Optional.ofNullable(document.getContent())
                .map(Maybe::get)
                .map(Content::getSource)
                .map(Content.Source::getBytes)
                .orElseThrow(()->new RuntimeException(String.format("Document %s is missing content", document.getId())));
    }

    private String getDocTemplate(XmlDocument document){
        return Optional.of(document)
                .map(XmlDocument::getMetadata)
                .map(Maybe::get)
                .map(meta->meta.getDocTemplate())
                .orElseThrow(()->new RuntimeException(String.format("Document %s is missing docTemplate", document.getId())));
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

    private XmlDocument findDocumentByRef(@NotNull Class<? extends XmlDocument> docClass,
                                         @NotNull String docRef) throws NotFoundException {
        return Optional.ofNullable(this.leosRepository.findDocumentByRef(docRef, docClass))
                .map(leosDoc->(XmlDocument)leosDoc)
                .orElseThrow(()->new NotFoundException(String.format("Not found document with %s reference", docRef)));
    }

    private XmlDocument findDocumentByRef(@NotNull String docRef) throws NotFoundException {
        return this.findDocumentByRef(XmlDocument.class, docRef);
    }

    public DocumentViewResponse getDocumentByRef(@NotNull String docRef) throws NotFoundException {
        return Optional.ofNullable(this.findDocumentByRef(XmlDocument.class, docRef))
                .map(doc->this.documentViewService.getDocumentView(doc))
                .orElseThrow(()->new NotFoundException(String.format("Not found document with %s reference", docRef)));
    }

    public List<TableOfContentItemVO> getTableOfContent(@NotNull String docRef,
                                                        @NotNull TocMode mode) throws NotFoundException {
        XmlDocument document = this.findDocumentByRef(docRef);
        String docTemplate = this.getDocTemplate(document);
        byte[] content = this.getDocumentContent(document);
        String startingNode = Optional.ofNullable(DOCUMENT_TOC_STARTING_NODE.get(document.getCategory()))
                .orElseThrow(()->new RuntimeException(String.format("Starting node not found for document %s", docRef)));

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
            if ( VersionType.MAJOR.equals(version.getVersionType()) ) {
                LeosPackage leosPackage = this.packageService.findPackageByDocumentId(document.getId());
                LegDocument legDocument = this.legService.findLastLegByVersionedReference(leosPackage.getPath(), version.getVersionedReference());
                version.setLegFileName(legDocument.getName());
            }
        }
        return versions;
    }

    public DocumentConfigResponse getDocumentConfig(@NotNull String docRef) {
        XmlDocument document = this.findDocumentByRef(docRef);
        LeosPackage docPackage = this.packageService.findPackageByDocumentId(document.getId());
        String docTemplate = this.getDocTemplate(document);
        StructureContext structure = this.getStructureContext();

        structure.useDocumentTemplate(docTemplate);

        List<TocItem> tocItems = structure.getTocItems();
        List<NumberingConfig> numberConfigs = structure.getNumberingConfigs();
        Proposal proposal = this.proposalService.findProposalByPackagePath(docPackage.getPath());

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

    public List<VersionVO> getRecentMinorVersions(@NotNull String docRef) {
        XmlDocument document = this.findDocumentByRef(docRef);
        LeosDocument latestVersion = this.leosRepository.findLatestMajorVersionById(XmlDocument.class, document.getId());
        List<XmlDocument> versionDocs = this.leosRepository.findRecentMinorVersions(XmlDocument.class, docRef, latestVersion.getCmisVersionLabel(), 0, Integer.MAX_VALUE);
        return VersionsUtil.buildVersionResponse(versionDocs, messageHelper, userHelper);
    }
}
