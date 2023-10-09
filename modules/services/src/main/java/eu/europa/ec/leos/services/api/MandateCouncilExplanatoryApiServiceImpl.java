package eu.europa.ec.leos.services.api;

import com.google.common.base.Stopwatch;
import com.sun.istack.NotNull;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.Explanatory;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.model.action.ActionType;
import eu.europa.ec.leos.model.action.CheckinCommentVO;
import eu.europa.ec.leos.model.action.CheckinElement;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.annex.AnnexStructureType;
import eu.europa.ec.leos.model.explanatory.ExplanatoryStructureType;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMapHelper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.collection.document.BillContextService;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ExplanatoryService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.CheckinCommentUtil;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.RefreshElementResponse;
import eu.europa.ec.leos.services.dto.response.ShowCleanVersionResponse;
import eu.europa.ec.leos.services.dto.response.TocAndAncestorsResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.export.ExportDW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.export.ExportVersions;
import eu.europa.ec.leos.services.export.FileHelper;
import eu.europa.ec.leos.services.label.ReferenceLabelService;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import eu.europa.ec.leos.services.processor.ExplanatoryProcessor;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
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
import eu.europa.ec.leos.vo.toc.NumberingConfig;
import eu.europa.ec.leos.vo.toc.StructureConfigUtils;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.NotImplementedException;
import org.apache.commons.lang.StringUtils;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;
import org.apache.http.MethodNotSupportedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static eu.europa.ec.leos.model.annex.AnnexStructureType.ARTICLE;

@Service("mandateExplanatoryService")
@Instance(InstanceType.COUNCIL)
public class MandateCouncilExplanatoryApiServiceImpl implements CouncilExplanatoryApiService {
    private static final Logger LOG = LoggerFactory.getLogger(MandateCouncilExplanatoryApiServiceImpl.class);
    private static final String EXPLANATORY_METADATA_IS_REQUIRED = "Explanatory metadata is required!";

    @Autowired
    MessageHelper messageHelper;
    @Autowired
    ExplanatoryService explanatoryService;
    @Autowired
    ElementProcessor<Explanatory> elementProcessor;
    @Autowired
    DocumentContentService documentContentService;
    @Autowired
    SecurityContext securityContext;
    @Autowired
    SearchService searchService;
    @Autowired
    DocumentViewService<Explanatory> documentViewService;
    @Autowired
    ComparisonDelegateAPI<Explanatory> comparisonDelegate;
    @Autowired
    PackageService packageService;
    @Autowired
    ExplanatoryProcessor explanatoryProcessor;
    @Autowired
    ReferenceLabelService referenceLabelService;
    @Autowired
    ExportService exportService;
    @Autowired
    TemplateConfigurationService templateConfigurationService;
    @Autowired
    ProposalService proposalService;
    @Autowired
    LegService legService;
    @Autowired
    UserHelper userHelper;
    @Autowired
    LeosPermissionAuthorityMapHelper leosPermissionAuthorityMapHelper;

    private Provider<StructureContext> structureContext;
    private Provider<BillContextService> context;

    MandateCouncilExplanatoryApiServiceImpl(Provider<StructureContext> structureContext, Provider<BillContextService> context) {

        this.structureContext = structureContext;
        this.context = context;

    }

    @Override
    public String getElement(String documentRef, String elementName, String elementId) {
        Explanatory bill = this.explanatoryService.findExplanatoryByRef(documentRef);
        return this.elementProcessor.getElement(bill, elementName, elementId);
    }

    @Override
    public DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) throws Exception {
        Explanatory explanatory = explanatoryService.findExplanatoryByRef(documentRef);
        this.setStructureContext(explanatory.getMetadata().getOrError(() -> EXPLANATORY_METADATA_IS_REQUIRED).getDocTemplate());
        byte[] updatedXmlContent = explanatoryProcessor.deleteElement(explanatory, elementId, elementName);

        final String updatedLabel = generateLabel(elementId, explanatory);
        final String comment = messageHelper.getMessage("operation.element.deleted", updatedLabel);

        explanatory = explanatoryService.updateExplanatory(explanatory, updatedXmlContent, VersionType.MINOR, comment);
        return this.documentViewService.updateDocumentView(explanatory);
    }

    @Override
    public RefreshElementResponse saveElement(String documentRef, String elementId, String elementName, String elementFragment) throws Exception {
        Explanatory explanatory = this.explanatoryService.findExplanatoryByRef(documentRef);
        this.setStructureContext(explanatory.getMetadata().getOrError(() -> EXPLANATORY_METADATA_IS_REQUIRED).getDocTemplate());
        byte[] updatedXmlContent = explanatoryProcessor.updateElement(explanatory, elementId, elementName, elementFragment);

        final String title = messageHelper.getMessage("operation.element.updated", StringUtils.capitalize(elementName));
        final String description = messageHelper.getMessage("operation.checkin.minor");
        final String updatedLabel = generateLabel(elementId, explanatory);
        final CheckinCommentVO checkinComment = new CheckinCommentVO(title, description,
                new CheckinElement(ActionType.UPDATED, elementId, elementName, updatedLabel));
        final String checkinCommentJson = CheckinCommentUtil.getJsonObject(checkinComment);
        explanatory = explanatoryService.updateExplanatory(explanatory, updatedXmlContent, VersionType.MINOR, checkinCommentJson);
        String newContent = elementProcessor.getElement(explanatory, elementName, elementId);
        return new RefreshElementResponse(elementId, elementName, newContent);
    }

    @Override
    public DocumentViewResponse insertElement(String documentRef, String elementName, String elementId, Position position) {
        Explanatory explanatory = this.explanatoryService.findExplanatoryByRef(documentRef);
        this.setStructureContext(explanatory.getMetadata().getOrError(() -> EXPLANATORY_METADATA_IS_REQUIRED).getDocTemplate());
        byte[] updatedXmlContent = this.explanatoryProcessor.insertNewElement(explanatory, elementId, elementName, position.equals(Position.BEFORE));

        final String title = messageHelper.getMessage("operation.element.inserted", StringUtils.capitalize(elementName));
        final String description = messageHelper.getMessage("operation.checkin.minor");
        final String elementLabel = "";
        final CheckinCommentVO checkinComment = new CheckinCommentVO(title, description,
                new CheckinElement(ActionType.INSERTED, elementId, elementName, elementLabel));
        final String checkinCommentJson = CheckinCommentUtil.getJsonObject(checkinComment);
        explanatory = explanatoryService.updateExplanatory(explanatory, updatedXmlContent, VersionType.MINOR, checkinCommentJson);

        // TO DO : to be added  DocumentUpdatedByCoEditorEvent
        return documentViewService.updateDocumentView(explanatory);
    }

    @Override
    public DocumentViewResponse mergeElement(String documentRef, String elementContent, String elementTag, String elementId) throws Exception {
        Explanatory explanatory = this.explanatoryService.findExplanatoryByRef(documentRef);
        this.setStructureContext(explanatory.getMetadata().getOrError(() -> EXPLANATORY_METADATA_IS_REQUIRED).getDocTemplate());
        Element mergeOnElement = explanatoryProcessor.getMergeOnElement(explanatory, elementContent, elementTag, elementId);
        byte[] updatedXmlContent = null;
        if (mergeOnElement != null) {
            updatedXmlContent = explanatoryProcessor.mergeElement(explanatory, elementContent, elementTag, elementId);
            explanatory = explanatoryService.updateExplanatory(explanatory, updatedXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.element.updated", org.apache.commons.lang3.StringUtils.capitalize(elementTag)));
            LOG.info("Element '{}' merged into '{}' in Explanatory {} id {})", elementId, mergeOnElement.getElementId(), explanatory.getName(), explanatory.getId());
        }
        return documentViewService.updateDocumentView(explanatory);
    }

    @Override
    public List<VersionVO> getRecentMinorVersions(String documentRef) {
        Explanatory explanatory = this.explanatoryService.findExplanatoryByRef(documentRef);
        Integer recentCount = this.explanatoryService.findRecentMinorVersionsCount(explanatory.getId(), documentRef);
        List<Explanatory> explanatories = this.explanatoryService.findRecentMinorVersions(explanatory.getId(), documentRef, 0, recentCount);
        return VersionsUtil.buildVersionResponse(explanatories, messageHelper, userHelper);
    }

    @Override
    public List<VersionVO> getVersionsData(String documentRef) {
        Explanatory explanatory = this.explanatoryService.findExplanatoryByRef(documentRef);
        List<VersionVO> versions = this.explanatoryService.getAllVersions(explanatory.getId(), documentRef);
        for (VersionVO versionVO : versions) {
            if (versionVO.getVersionType().equals(VersionType.MAJOR)) {
                LeosPackage leosPackage = packageService.findPackageByDocumentId(explanatory.getId());
                LegDocument legDocument = this.legService.findLastLegByVersionedReference(leosPackage.getPath(), versionVO.getVersionedReference());
                versionVO.setLegFileName(legDocument.getName());
            }
            versionVO.setCreatedBy(userHelper.convertToPresentation(versionVO.getUsername()));
        }
        return versions;
    }

    @Override
    public List<VersionVO> getIntermediateVersionsData(String documentRef, String currIntVersion) {
        int count = this.explanatoryService.findAllMinorsCountForIntermediate(documentRef, currIntVersion);
        return VersionsUtil.buildVersionResponse(this.explanatoryService.findAllMinorsForIntermediate(documentRef,
                currIntVersion, 0, count), messageHelper, userHelper);
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef, TocMode mode) {
        Explanatory memorandum = this.explanatoryService.findExplanatoryByRef(documentRef);
        this.setStructureContext(memorandum.getMetadata().getOrError(() -> EXPLANATORY_METADATA_IS_REQUIRED).getDocTemplate());
        return this.explanatoryService.getTableOfContent(memorandum, mode);
    }

    @Override
    public List<TocItem> getTocItems(@NotNull String documentRef) {
        Explanatory explanatory = this.explanatoryService.findExplanatoryByRef(documentRef);
        StructureContext structureContext1 = structureContext.get();
        structureContext1.useDocumentTemplate(explanatory.getMetadata().getOrError(() -> EXPLANATORY_METADATA_IS_REQUIRED).getDocTemplate());
        return structureContext1.getTocItems();
    }

    @Override
    public DocumentViewResponse getDocument(@NotNull String documentRef) {
        Explanatory explanatory = this.explanatoryService.findExplanatoryByRef(documentRef);
        return this.documentViewService.getDocumentView(explanatory);
    }

    @Override
    public List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType) {
        Explanatory explanatory = this.explanatoryService.findExplanatoryByRef(documentRef);
        this.explanatoryService.createVersion(explanatory.getId(), versionType, checkInComment);
        return this.getVersionsData(documentRef);
    }

    @Override
    public List<TableOfContentItemVO> saveToC(String documentRef, List<TableOfContentItemVO> toc) throws MethodNotSupportedException {
        Explanatory explanatory = this.explanatoryService.findExplanatoryByRef(documentRef);
        StructureContext structureContext1 = structureContext.get();
        structureContext1.useDocumentTemplate(explanatory.getMetadata().getOrError(() -> EXPLANATORY_METADATA_IS_REQUIRED).getDocTemplate());
        ExplanatoryStructureType structureType = getStructureType(structureContext1);
        Explanatory updatedAnnex = explanatoryService.saveTableOfContent(explanatory, toc, structureType, messageHelper.getMessage("operation.toc.updated"), securityContext.getUser());
        return this.explanatoryService.getTableOfContent(updatedAnnex, TocMode.SIMPLIFIED);
    }

    @Override
    public List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase, boolean completeWords, String tempUpdatedContentXML) throws Exception {
        List<SearchMatchVO> matches = Collections.emptyList();
        Explanatory explanatory = this.explanatoryService.findExplanatoryByRef(documentRef);
        byte[] contentForReplace = getContentForReplaceProcess(tempUpdatedContentXML, explanatory);
        try {
            matches = searchService.searchText(contentForReplace, searchText, matchCase, completeWords);
        } catch (Exception e) {
            LOG.error("couldn't fetch results");
        }
        return matches;
    }

    @Override
    public DocumentViewResponse showVersion(String versionId) {
        Explanatory explanatory = this.explanatoryService.findExplanatoryVersion(versionId);
        final String versionContent = documentContentService.getDocumentAsHtml(explanatory,
                "",
                securityContext.getPermissions(explanatory));
        VersionInfoVO versionInfoVO = this.documentViewService.getVersionInfo(explanatory);
        return new DocumentViewResponse(null, versionContent, versionInfoVO, null, null);
    }

    @Override
    public String compare(String newVersionId, String oldVersionId) {
        Explanatory oldVersion = explanatoryService.findExplanatoryVersion(oldVersionId);
        Explanatory newVersion = explanatoryService.findExplanatoryVersion(newVersionId);
        return comparisonDelegate.getMarkedContent(oldVersion, newVersion);
    }

    @Override
    public DocumentViewResponse restoreToVersion(String documentRef, String versionId) {
        Explanatory version = explanatoryService.findExplanatoryVersion(versionId);
        Explanatory annex = explanatoryService.findExplanatoryByRef(documentRef);
        byte[] resultXmlContent = getContent(version);
        Explanatory updatedAnnex = explanatoryService.updateExplanatory(annex, resultXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.restore.version", version.getVersionLabel()));
        return this.documentViewService.updateDocumentView(updatedAnnex);
    }

    @Override
    public EditElementResponse editElement(String documentRef, String elementId, String elementTagName) {
        Explanatory explanatory = this.explanatoryService.findExplanatoryByRef(documentRef);
        String jsonAlternatives = "";
        String[] permissions = leosPermissionAuthorityMapHelper.getPermissionsForRoles(securityContext.getUser().getRoles());
        User user = securityContext.getUser();
        Proposal proposal = this.documentViewService.getProposalFromPackage(explanatory);
        boolean isClonedProposal = proposal.isClonedProposal();

        try {
            String element = this.elementProcessor.getElement(explanatory, elementTagName, elementId);
            return new EditElementResponse(user, permissions,
                    elementId, elementTagName, element, jsonAlternatives, isClonedProposal);
        } catch (Exception ex) {
            LOG.error("Exception while edit element operation for ", ex);
            throw new RuntimeException(ex);
        }
    }

    @Override
    public byte[] downloadVersion(String documentRef, boolean isWithAnnotations) throws Exception {
        if (isWithAnnotations) {
            // do nothing for the moment
        }
        return this.doDownloadVersion(documentRef, false, null);
    }

    @Override
    public byte[] downloadCleanVersion(String documentRef) {
        byte[] cleanVersion = new byte[0];
        try {
            Explanatory explanatory = this.explanatoryService.findExplanatoryByRef(documentRef);
            Stopwatch stopwatch = Stopwatch.createStarted();
            LeosPackage leosPackage = packageService.findPackageByDocumentId(explanatory.getId());
            context.get().usePackage(leosPackage);
            Proposal proposal = this.documentViewService.getProposalFromPackage(explanatory);
            String proposalId = proposal.getId();
            final String jobFileName = "Proposal_" + proposalId + "_AKN2DW_CLEAN_" + System.currentTimeMillis() + ".docx";
            ExportOptions exportOptions = new ExportDW(ExportOptions.Output.WORD, Explanatory.class, false, true);
            exportOptions.setExportVersions(new ExportVersions<Explanatory>(null, explanatory));
            cleanVersion = exportService.createDocuWritePackage(FileHelper.getReplacedExtensionFilename(jobFileName, "zip"), proposalId, exportOptions);
            LOG.info("The actual version of CLEANED Bill for proposal {}, downloaded in {} milliseconds ({} sec)", proposalId,
                    stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while using ExportService", e);
        }
        return cleanVersion;
    }

    @Override
    public ShowCleanVersionResponse showCleanVersion(String documentRef) {
        //not supported
        throw new NotImplementedException();
    }

    @Override
    public byte[] downloadXmlVersionFiles(String documentRef, String versionId) {
        return new byte[0];
    }

    @Override
    public byte[] replaceAllTextInDocument(ReplaceAllMatchRequest event) throws Exception {
        Explanatory explanatory = explanatoryService.findExplanatoryByRef(event.getDocumentRef());
        byte[] contentForReplace = getContentForReplaceProcess(event.getTempUpdatedContentXML(), explanatory);
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(contentForReplace, event.getSearchText(), event.isCaseSensitive(), event.isCompleteWords());
        return searchService.replaceText(
                contentForReplace,
                event.getSearchText(),
                event.getReplaceText(),
                searchMatchVOS);
    }

    @Override
    public byte[] replaceOneTextInDocument(ReplaceMatchRequest event) throws Exception {
        Explanatory explanatory = this.explanatoryService.findExplanatoryByRef(event.getDocumentRef());
        byte[] contentForReplace = getContentForReplaceProcess(event.getTempUpdatedContentXML(), explanatory);
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(contentForReplace, event.getSearchText(), event.isCaseSensitive(), event.isCompleteWords());
        return searchService.replaceText(
                contentForReplace,
                event.getSearchText(),
                event.getReplaceText(),
                Arrays.asList(searchMatchVOS.get(event.getMatchIndex())));
    }

    @Override
    public DocumentViewResponse saveAfterReplace(SaveAfterReplaceRequest event) {
        Explanatory explanatory = this.explanatoryService.findExplanatoryByRef(event.getDocumentRef());

        Explanatory updateAnnex = explanatoryService.updateExplanatory(explanatory, event.getUpdatedContent().getBytes(),
                VersionType.MINOR, messageHelper.getMessage("operation.search.replace.updated"));
        return this.documentViewService.updateDocumentView(updateAnnex);
    }

    @Override
    public DocumentConfigResponse getDocumentConfig(String documentRef) {
        Explanatory explanatory = this.explanatoryService.findExplanatoryByRef(documentRef);
        StructureContext structureContext1 = structureContext.get();

        structureContext1.useDocumentTemplate(explanatory.getMetadata().getOrError(() -> EXPLANATORY_METADATA_IS_REQUIRED).getDocTemplate());
        List<TocItem> tocItems = structureContext1.getTocItems();
        List<NumberingConfig> numberConfigs = structureContext1.getNumberingConfigs();
        List<LeosMetadata> documentsMetadata = packageService.getDocumentsMetadata(explanatory.getId());
        Proposal proposal = this.documentViewService.getProposalFromPackage(explanatory);

        return new DocumentConfigResponse(
                documentsMetadata, numberConfigs, tocItems, null, StructureConfigUtils.getNumberingConfigsFromTocItem(numberConfigs, tocItems, XmlHelper.POINT),
                getArticleTypesAttributes(tocItems), explanatory.getMetadata().get().getRef(), proposal.getMetadata().getOrNull(), structureContext1.getTocRules(),
                explanatory.isTrackChangesEnabled(), true, proposal.isClonedProposal()
        );
    }

    @Override
    public String fetchUserGuidance(String documentRef) {
        // KLUGE temporary hack for compatibility with new domain model
        Explanatory explanatory = this.explanatoryService.findExplanatoryByRef(documentRef);
        return templateConfigurationService.getTemplateConfiguration(explanatory.getMetadata().get().getDocTemplate(), "guidance");
    }

    private void setStructureContext(String docTemplate) {
        this.structureContext.get().useDocumentTemplate(docTemplate);
    }

    private ExplanatoryStructureType getStructureType(StructureContext context) {
        List<TocItem> tocItems = context.getTocItems().stream().
                filter(tocItem -> (tocItem.getAknTag().value().equalsIgnoreCase(AnnexStructureType.LEVEL.getType()) ||
                        tocItem.getAknTag().value().equalsIgnoreCase(ARTICLE.getType()))).collect(Collectors.toList());
        return ExplanatoryStructureType.valueOf(tocItems.get(0).getAknTag().value().toUpperCase());
    }

    private byte[] getContent(Explanatory explanatory) {
        final Content content = explanatory.getContent().getOrError(() -> "Explanatory content is required!");
        return content.getSource().getBytes();
    }

    private String generateLabel(String reference, XmlDocument sourceDocument) {
        final byte[] sourceXmlContent = sourceDocument.getContent().get().getSource().getBytes();
        Result<String> updatedLabel = referenceLabelService.generateLabelStringRef(Arrays.asList(reference), sourceDocument.getMetadata().get().getRef(),
                sourceXmlContent);
        return updatedLabel.get();
    }

    private byte[] doDownloadVersion(String documentRef, boolean isWithAnnotations, String annotations) throws Exception {
        try {
            final Explanatory currentDocument = this.explanatoryService.findExplanatoryByRef(documentRef);

            LeosPackage leosPackage = packageService.findPackageByDocumentId(currentDocument.getId());
            context.get().usePackage(leosPackage);
            Proposal proposal = this.documentViewService.getProposalFromPackage(currentDocument);

            ExportOptions exportOptions;
            XmlDocument original = documentContentService.getOriginalExplanatory(currentDocument);
            exportOptions = new ExportDW(ExportOptions.Output.WORD, Bill.class, false);
            exportOptions.setExportVersions(new ExportVersions(original, currentDocument));

            exportOptions.setWithFilteredAnnotations(isWithAnnotations);
            exportOptions.setFilteredAnnotations(annotations);
            exportOptions.setWithCoverPage(false);

            String proposalId = proposal.getId();
            if (proposalId != null) {
                final String jobFileName = "Proposal_" + proposalId + "_AKN2DW_" + System.currentTimeMillis() + ".docx";
                return exportService.createDocuWritePackage(jobFileName, proposalId, exportOptions);
            }
            LOG.info("The actual version of Explanatory {} downloaded in {} milliseconds ({} sec)", currentDocument.getName());
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while using ExportService", e);
        }
        return null;
    }

    @Override
    public TocAndAncestorsResponse fetchTocAncestor(String documentRef, List<String> elementIds) {
        Explanatory explanatory = explanatoryService.findExplanatoryByRef(documentRef);
        List<String> elementAncestorsIds = null;
        StructureContext ctxt = structureContext.get();
        ctxt.useDocumentTemplate(explanatory.getMetadata().getOrError(() -> "Bill metadata is required!").getDocTemplate());
        if (CollectionUtils.isNotEmpty(elementIds)) {
            try {
                elementAncestorsIds = explanatoryService.getAncestorsIdsForElementId(explanatory, elementIds);
            } catch (Exception e) {
                LOG.warn("Could not get ancestors Ids", e);
            }
        }
        // we are combining two operations (get toc + get selected element ancestors)
        final Map<String, List<TableOfContentItemVO>> tocItemList = packageService.getTableOfContent(explanatory.getId(), TocMode.SIMPLIFIED_CLEAN);
        return new TocAndAncestorsResponse(tocItemList, elementAncestorsIds, messageHelper, ctxt.getNumberingConfigs());
    }
}
