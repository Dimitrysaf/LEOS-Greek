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

import com.google.common.base.Stopwatch;
import com.sun.istack.NotNull;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Memorandum;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.TrackChangeActionType;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMapHelper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.collection.document.BillContextService;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.MemorandumService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.SaveElementResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.export.ExportVersions;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.services.search.SearchService;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.services.template.TemplateConfigurationService;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import eu.europa.ec.leos.services.user.UserHelper;
import eu.europa.ec.leos.vo.toc.StructureConfigUtils;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.structure.TocItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service("memorandum")
public class MemorandumApiServiceImpl implements MemorandumApiService {

    private static final String MEMORANDUM_METADATA_IS_REQUIRED = "Memorandum metadata is required!";
    private static final String OCCURRED_WHILE_USING_EXPORT_SERVICE = "Unexpected error occurred while using ExportService";
    @Autowired
    MemorandumService memorandumService;
    @Autowired
    CloneContext cloneContext;
    @Autowired
    DocumentContentService documentContentService;
    @Autowired
    DocumentViewService<Memorandum> documentViewService;
    @Autowired
    PackageService packageService;
    @Autowired
    ProposalService proposalService;
    @Autowired
    ComparisonDelegateAPI<Memorandum> comparisonDelegate;
    @Autowired
    SecurityContext securityContext;
    @Autowired
    SearchService searchService;
    @Autowired
    ElementProcessor<Memorandum> elementProcessor;
    @Autowired
    MessageHelper messageHelper;
    @Autowired
    TemplateConfigurationService templateConfigurationService;
    @Autowired
    ExportService exportService;
    @Autowired
    UserHelper userHelper;
    @Autowired
    LegService legService;
    @Autowired
    GenericDocumentApiService genericDocumentApiService;
    @Autowired
    LeosPermissionAuthorityMapHelper leosPermissionAuthorityMapHelper;
    @Autowired
    RepositoryPropertiesMapper repositoryPropertiesMapper;
    @Autowired
    TrackChangesContext trackChangesContext;

    private Provider<BillContextService> context;

    private Provider<StructureContext> structureContext;

    private static final Logger LOG = LoggerFactory.getLogger(MemorandumApiServiceImpl.class);
    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
            .withZone(ZoneId.systemDefault());


    MemorandumApiServiceImpl(Provider<StructureContext> structureContext, Provider<BillContextService> context) {

        this.structureContext = structureContext;
        this.context = context;

    }

    @Override
    public DocumentViewResponse getDocument(@NotNull String documentRef) {
        Memorandum memorandum = memorandumService.findMemorandumByRef(documentRef);
        return this.documentViewService.getDocumentView(memorandum);
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef, TocMode tocMode) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        StructureContext structureContext1 = structureContext.get();
        structureContext1.useDocumentTemplate(
                memorandum.getMetadata().getOrError(() -> MEMORANDUM_METADATA_IS_REQUIRED).getDocTemplate());
        return this.memorandumService.getTableOfContent(memorandum, tocMode);
    }

    @Override
    public String getElement(String documentRef, String elementName, String elementId) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        StructureContext structureContext1 = structureContext.get();
        structureContext1.useDocumentTemplate(
                memorandum.getMetadata().getOrError(() -> MEMORANDUM_METADATA_IS_REQUIRED).getDocTemplate());
        return this.elementProcessor.getElement(memorandum, elementName, elementId);
    }

    @Override
    public DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) {
        throw new RuntimeException("Delete isn't supported");
    }

    @Override
    public SaveElementResponse saveElement(String documentRef, String elementId, String elementName,
                                           String elementFragment, boolean isSplit) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        Proposal proposal = this.documentViewService.getProposalFromPackage(memorandum);
        StructureContext structureContext1 = structureContext.get();
        structureContext1.useDocumentTemplate(
                memorandum.getMetadata().getOrError(() -> MEMORANDUM_METADATA_IS_REQUIRED).getDocTemplate());
        populateCloneProposalMetadata(proposal);
        byte[] newXmlContent = elementProcessor.updateElement(memorandum, elementFragment, elementName, elementId,
                false);
        memorandum = memorandumService.updateMemorandum(memorandum, newXmlContent, VersionType.MINOR,
                messageHelper.getMessage("operation." + elementName + ".updated"));
        return new SaveElementResponse(elementId, elementName,
                elementProcessor.getElement(memorandum, elementName, elementId));
    }

    @Override
    public DocumentViewResponse insertElement(String documentRef, String elementName, String elementId,
                                              Position position) {
        throw new UnsupportedOperationException("Insert element isn't supported for memorandum");
    }

    @Override
    public DocumentViewResponse mergeElement(String documentRef, String elementContent, String elementTag,
                                             String elementId) throws Exception {
        throw new UnsupportedOperationException("Merge element isn't supported for memorandum");
    }

    @Override
    public List<TocItem> getTocItems(@NotNull String documentRef) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        StructureContext structureContext1 = structureContext.get();
        structureContext1.useDocumentTemplate(
                memorandum.getMetadata().getOrError(() -> "Memorandum metadata is required!").getDocTemplate());
        return structureContext1.getTocItems();
    }

    @Override
    public List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        this.memorandumService.createVersion(memorandum.getId(), versionType, checkInComment);
        return this.memorandumService.getAllVersions(memorandum.getId(), documentRef, 0, 10);
    }

    @Override
    public List<TableOfContentItemVO> saveToC(String documentRef, List<TableOfContentItemVO> toc) {
        throw new RuntimeException("Save toc method not allowed for Memorandum type document");
    }

    @Override
    public List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase,
                                                    boolean completeWords, String tempUpdatedContentXML)
            throws Exception {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        byte[] contentForReplace = getContentForReplaceProcess(tempUpdatedContentXML, memorandum);
        return searchService.searchTextForHighlight(contentForReplace, searchText, matchCase, completeWords);
    }

    @Override
    public DocumentViewResponse showVersion(String versionId) {
        final Memorandum memorandum = memorandumService.findMemorandumVersion(versionId);
        final String versionContent = documentContentService.getDocumentAsHtml(memorandum, "",
                securityContext.getPermissions(memorandum));
        VersionInfoVO versionInfo = this.documentViewService.getVersionInfo(memorandum);
        return new DocumentViewResponse(null, versionContent, versionInfo, null, null);
    }

    @Override
    public String compare(String newVersionId, String oldVersionId) {
        Memorandum oldVersion = memorandumService.findMemorandumVersion(oldVersionId);
        Memorandum newVersion = memorandumService.findMemorandumVersion(newVersionId);
        return comparisonDelegate.getMarkedContent(oldVersion, newVersion);
    }

    @Override
    public DocumentViewResponse restoreToVersion(String documentRef, String versionId) {
        Memorandum version = memorandumService.findMemorandumVersion(versionId);
        Memorandum memo = memorandumService.findMemorandumByRef(documentRef);
        byte[] resultXmlContent = getContent(version);
        Memorandum updatedMemo = memorandumService.updateMemorandum(memo, resultXmlContent, VersionType.MINOR,
                messageHelper.getMessage("operation.restore.version", version.getVersionLabel()));
        return this.documentViewService.updateDocumentView(updatedMemo);
    }

    @Override
    public EditElementResponse editElement(String documentRef, String elementId, String elementTagName) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        String jsonAlternatives = "";
        StructureContext structureContext1 = structureContext.get();
        structureContext1.useDocumentTemplate(
                memorandum.getMetadata().getOrError(() -> MEMORANDUM_METADATA_IS_REQUIRED).getDocTemplate());
        String[] permissions = leosPermissionAuthorityMapHelper.getPermissionsForRoles(
                securityContext.getUser().getRoles());
        User user = securityContext.getUser();
        boolean isClonedProposal = !memorandum.getClonedFrom().isEmpty();
        try {
            String element = this.elementProcessor.getElement(memorandum, elementTagName, elementId);
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
            //get filters
            return new byte[0];
        }
        return this.doDownloadVersion(documentRef, false, null);

    }

    @Override
    public byte[] downloadCleanVersion(String documentRef) {
        byte[] cleanVersion = new byte[0];
        Stopwatch stopwatch = Stopwatch.createStarted();
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(documentRef, Memorandum.class);
        context.get().usePackage(leosPackage);
        Proposal proposal = this.documentViewService.getProposalFromPackage(memorandum);
        String proposalId = proposal.getId();
        try {
            final String jobFileName =
                    "Proposal_" + proposalId + "_AKN2LW_CLEAN_" + System.currentTimeMillis() + ".zip";
            ExportOptions exportOptions = new ExportLW(ExportOptions.Output.PDF, Memorandum.class, false, true);
            exportOptions.setExportVersions(new ExportVersions(null, memorandum));
            exportOptions.setWithCoverPage(false);
            exportService.createDocumentPackage(jobFileName, proposalId, exportOptions, securityContext.getUser());
        } catch (Exception e) {
            LOG.error(OCCURRED_WHILE_USING_EXPORT_SERVICE, e);
        }
        LOG.info("The actual version of CLEANED Memorandum for proposal {}, downloaded in {} milliseconds ({} sec)",
                proposalId, stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        return cleanVersion;
    }

    @Override
    public DocumentViewResponse showCleanVersion(String documentRef) {
        final Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        final String versionContent = documentContentService.getCleanDocumentAsHtml(memorandum, "",
                securityContext.getPermissions(memorandum));
        VersionInfoVO versionInfoVO = this.documentViewService.getVersionInfo(memorandum);
        return new DocumentViewResponse(versionContent, versionInfoVO);
    }

    @Override
    public byte[] downloadXmlVersionFiles(String documentRef, String versionId) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        final Memorandum chosenDocument = memorandumService.findMemorandumVersion(versionId);
        final String fileName =
                chosenDocument.getMetadata().get().getRef() + "_v" + chosenDocument.getVersionLabel() + ".xml";
        LOG.info("Downloaded file {}, in {} milliseconds ({} sec)", fileName, stopwatch.elapsed(TimeUnit.MILLISECONDS),
                stopwatch.elapsed(TimeUnit.SECONDS));
        return chosenDocument.getContent().get().getSource().getBytes();
    }

    @Override
    public byte[] replaceAllTextInDocument(ReplaceAllMatchRequest event) throws Exception {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(event.getDocumentRef());

        byte[] contentForReplace = getContentForReplaceProcess(event.getTempUpdatedContentXML(), memorandum);
        populateCloneProposalMetadata(memorandum);

        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(contentForReplace, event.getSearchText(),
                event.isCaseSensitive(), event.isCompleteWords());
        return searchService.replaceText(
                contentForReplace,
                event.getSearchText(),
                event.getReplaceText(),
                searchMatchVOS,
                memorandum.isTrackChangesEnabled());
    }

    @Override
    public byte[] replaceOneTextInDocument(ReplaceMatchRequest event) throws Exception {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(event.getDocumentRef());

        byte[] contentForReplace = getContentForReplaceProcess(event.getTempUpdatedContentXML(), memorandum);
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(contentForReplace, event.getSearchText(),
                event.isCaseSensitive(), event.isCompleteWords());
        return searchService.replaceText(
                contentForReplace,
                event.getSearchText(),
                event.getReplaceText(),
                Arrays.asList(searchMatchVOS.get(event.getMatchIndex())),
                memorandum.isTrackChangesEnabled());
    }

    @Override
    public DocumentViewResponse saveAfterReplace(SaveAfterReplaceRequest event) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(event.getDocumentRef());
        Memorandum updateMemorandum = memorandumService.updateMemorandum(memorandum,
                event.getUpdatedContent().getBytes(StandardCharsets.UTF_8),
                VersionType.MINOR, messageHelper.getMessage("operation.search.replace.updated"));
        return this.documentViewService.updateDocumentView(updateMemorandum);
    }

    @Override
    public DocumentConfigResponse getDocumentConfig(String documentRef) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        StructureContext context1 = structureContext.get();
        context1.useDocumentTemplate(
                memorandum.getMetadata().getOrError(() -> MEMORANDUM_METADATA_IS_REQUIRED).getDocTemplate());
        List<TocItem> tocItems = context1.getTocItems();
        List<LeosMetadata> documentsMetadata = packageService.getDocumentsMetadata(
                memorandum.getMetadata().get().getRef());
        Proposal proposal = this.documentViewService.getProposalFromPackage(memorandum);

        return new DocumentConfigResponse(
                documentsMetadata, null, tocItems, null,
                StructureConfigUtils.getNumberingConfigsFromTocItem(null, tocItems, XmlHelper.POINT),
                getArticleTypesAttributes(tocItems), memorandum.getMetadata().get().getRef(),
                proposal.getMetadata().getOrNull(), context1.getTocRules(),
                memorandum.isTrackChangesEnabled(), true, proposal.isClonedProposal()
        );
    }

    @Override
    public String fetchUserGuidance(String documentRef) {
        // KLUGE temporary hack for compatibility with new domain model
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        return templateConfigurationService.getTemplateConfiguration(memorandum.getMetadata().get().getDocTemplate(),
                "guidance");
    }

    @Override
    public DocumentViewResponse acceptChange(String documentRef, String elementId, String elementTagName, TrackChangeActionType trackChangeAction, String presenterId) throws Exception {
        throw new UnsupportedOperationException("Accept change isn't supported for memorandum");
    }

    @Override
    public DocumentViewResponse rejectChange(String documentRef, String elementId, String elementTagName, TrackChangeActionType trackChangeAction, String presenterId) throws Exception {
        throw new UnsupportedOperationException("Accept change isn't supported for memorandum");
    }

    @Override
    public boolean toggleTrackChangeEnabled(boolean isTrackChangeEnabled, String documentRef) {
        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED),
                isTrackChangeEnabled);
        String documentId = memorandumService.findMemorandumByRef(documentRef).getId();
        Memorandum memorandum = memorandumService.updateMemorandum(documentRef, documentId, properties, false);
        trackChangesContext.setTrackChangesEnabled(memorandum.isTrackChangesEnabled());
        return true;
    }

    private byte[] doDownloadVersion(String documentRef, boolean isWithFilteredAnnotations, String annotations) {
        try {
            Stopwatch stopwatch = Stopwatch.createStarted();
            final Memorandum currentDocument = memorandumService.findMemorandumByRef(documentRef);

            LeosPackage leosPackage = packageService.findPackageByDocumentRef(
                    currentDocument.getMetadata().get().getRef(), Memorandum.class);
            context.get().usePackage(leosPackage);
            Proposal proposal = this.documentViewService.getProposalFromPackage(currentDocument);
            populateCloneProposalMetadata(proposal);

            ExportOptions exportOptions = new ExportLW(ExportOptions.Output.PDF, Memorandum.class, false);
            exportOptions.setExportVersions(new ExportVersions(isClonedProposal() ?
                    documentContentService.getOriginalMemorandum(currentDocument) : null, currentDocument));
            exportOptions.setWithFilteredAnnotations(isWithFilteredAnnotations);
            exportOptions.setFilteredAnnotations(annotations);

            String proposalId = proposal.getId();
            if (proposalId != null) {
                createPackageForExport(exportOptions);
            }
            LOG.info("The actual version of Memorandum {} downloaded in {} milliseconds ({} sec)",
                    currentDocument.getName(),
                    stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        } catch (Exception e) {
            LOG.error(OCCURRED_WHILE_USING_EXPORT_SERVICE, e);
        }
        return null;
    }

    private void createPackageForExport(ExportOptions exportOptions) {
        try {
            this.createDocumentPackageForExport(exportOptions);
        } catch (Exception e) {
            LOG.error(OCCURRED_WHILE_USING_EXPORT_SERVICE, e);
        }
    }

    private byte[] getContent(Memorandum memorandum) {
        final Content content = memorandum.getContent().getOrError(() -> "Memorandum content is required!");
        return content.getSource().getBytes();
    }

    protected void populateCloneProposalMetadata(XmlDocument document) {
        CloneProposalMetadataVO cloneProposalMetadataVO = this.proposalService.getClonedProposalMetadata(
                this.getContent(document));
        this.cloneContext.setCloneProposalMetadataVO(cloneProposalMetadataVO);
    }

    private void createDocumentPackageForExport(ExportOptions exportOptions) throws Exception {
        final String proposalId = this.getContextProposalId();

        if (proposalId != null) {
            final String jobFileName = "Proposal_" + proposalId + "_AKN2DW_" + System.currentTimeMillis() + ".zip";
            exportService.createDocumentPackage(jobFileName, proposalId, exportOptions, securityContext.getUser());
            LOG.info("Exported to LegisWrite and downloaded file {}", jobFileName);
        }
    }

    private String getContextProposalId() {
        return context.get().getProposalId();
    }

    private boolean isClonedProposal() {
        return cloneContext != null && cloneContext.isClonedProposal();
    }

    private VersionInfoVO getVersionInfo(XmlDocument document) {
        String userId = document.getLastModifiedBy();
        User user = userHelper.getUser(userId);

        return new VersionInfoVO(
                document.getVersionLabel(),
                user.getName(), user.getDefaultEntity() != null ? user.getDefaultEntity().getOrganizationName() : "",
                dateFormatter.format(document.getLastModificationInstant()),
                document.getVersionType());
    }

    private String getVersionInfoAsString(XmlDocument document) {
        final VersionInfoVO versionInfo = getVersionInfo(document);
        return messageHelper.getMessage(
                "document.version.caption",
                versionInfo.getDocumentVersion(),
                versionInfo.getLastModifiedBy(),
                versionInfo.getEntity(),
                versionInfo.getLastModificationInstant()
        );
    }

}
