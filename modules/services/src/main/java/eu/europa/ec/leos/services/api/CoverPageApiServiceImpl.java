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

import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.TrackChangeActionType;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMapHelper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.collection.CollectionContextService;
import eu.europa.ec.leos.services.collection.document.AnnexContextService;
import eu.europa.ec.leos.services.collection.document.BillContextService;
import eu.europa.ec.leos.services.collection.document.ContextActionService;
import eu.europa.ec.leos.services.collection.document.MemorandumContextService;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.SaveCoverPageElementResponse;
import eu.europa.ec.leos.services.dto.response.SaveElementResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.export.ExportVersions;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
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
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import eu.europa.ec.leos.services.user.UserHelper;
import eu.europa.ec.leos.vo.toc.StructureConfigUtils;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.http.MethodNotSupportedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.google.common.base.Stopwatch;
import com.sun.istack.NotNull;

import javax.inject.Provider;
import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service("coverPage")
public class CoverPageApiServiceImpl implements CoverPageApiService {
    private static final Logger LOG = LoggerFactory.getLogger(CoverPageApiServiceImpl.class);
    private static final String DELETE_ISN_T_SUPPORTED_FOR_COVER_PAGE = "Delete isn't supported for cover page";
    private static final String OCCURRED_WHILE_USING_EXPORT_SERVICE = "Unexpected error occurred while using ExportService";
    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(ZoneId.systemDefault());

    ProposalService proposalService;
    DocumentViewService<Proposal> documentViewService;
    DocumentContentService documentContentService;
    SecurityContext securityContext;
    UserHelper userHelper;
    ComparisonDelegateAPI<Proposal> comparisonDelegate;
    SearchService searchService;
    MessageHelper messageHelper;
    ElementProcessor elementProcessor;
    PackageService packageService;
    XmlContentProcessor xmlContentProcessor;
    ExportService exportService;
    TemplateConfigurationService templateConfigurationService;
    LegService legService;
    LeosPermissionAuthorityMapHelper leosPermissionAuthorityMapHelper;
    RepositoryPropertiesMapper repositoryPropertiesMapper;
    TrackChangesContext trackChangesContext;

    private Provider<CloneContext> cloneContext;
    private Provider<CollectionContextService> proposalContextProvider;
    private Provider<BillContextService> billContextServiceProvider;
    private Provider<MemorandumContextService> memorandumContextServiceProvider;
    private Provider<StructureContext> structureContext;

    @Autowired
    public CoverPageApiServiceImpl(ProposalService proposalService,
            DocumentViewService<Proposal> documentViewService, DocumentContentService documentContentService,
            SecurityContext securityContext, UserHelper userHelper,
            ComparisonDelegateAPI<Proposal> comparisonDelegate, SearchService searchService, MessageHelper messageHelper,
            ElementProcessor elementProcessor, PackageService packageService, XmlContentProcessor xmlContentProcessor,
            ExportService exportService, TemplateConfigurationService templateConfigurationService, LegService legService,
            LeosPermissionAuthorityMapHelper leosPermissionAuthorityMapHelper,
            RepositoryPropertiesMapper repositoryPropertiesMapper, TrackChangesContext trackChangesContext,
            Provider<CloneContext> cloneContext, Provider<BillContextService> billContextServiceProvider,
            Provider<StructureContext> structureContext, Provider<CollectionContextService> proposalContextProvider,
            Provider<MemorandumContextService> memorandumContextServiceProvider) {
        this.proposalService = proposalService;
        this.documentViewService = documentViewService;
        this.documentContentService = documentContentService;
        this.securityContext = securityContext;
        this.userHelper = userHelper;
        this.comparisonDelegate = comparisonDelegate;
        this.searchService = searchService;
        this.messageHelper = messageHelper;
        this.elementProcessor = elementProcessor;
        this.packageService = packageService;
        this.xmlContentProcessor = xmlContentProcessor;
        this.exportService = exportService;
        this.templateConfigurationService = templateConfigurationService;
        this.legService = legService;
        this.leosPermissionAuthorityMapHelper = leosPermissionAuthorityMapHelper;
        this.repositoryPropertiesMapper = repositoryPropertiesMapper;
        this.trackChangesContext = trackChangesContext;
        this.cloneContext = cloneContext;
        this.billContextServiceProvider = billContextServiceProvider;
        this.structureContext = structureContext;
        this.proposalContextProvider = proposalContextProvider;
        this.memorandumContextServiceProvider = memorandumContextServiceProvider;
    }

    @Override
    public DocumentViewResponse getDocument(@NotNull String documentRef) {
        Proposal proposal = this.proposalService.getProposalByRef(documentRef);
        VersionInfoVO versionInfoVO = getVersionInfo(proposal);
        String editableXml = getEditableXml(proposal);
        String proposalRef = proposal.getMetadata().get().getRef();
        return new DocumentViewResponse(proposalRef, editableXml, versionInfoVO, null, null);
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef, TocMode tocMode) {
        Proposal proposal = this.proposalService.getProposalByRef(documentRef);
        this.setStructureContext(
                proposal.getMetadata().getOrError(() -> "Cover Page metadata is required!").getDocTemplate());
        return this.proposalService.getCoverPageTableOfContent(proposal, tocMode);
    }

    @Override
    public String getElement(String documentRef, String elementName, String elementId) {
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        return elementProcessor.getElement(proposal, elementName, elementId);
    }

    @Override
    public DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) {
        throw new UnsupportedOperationException(DELETE_ISN_T_SUPPORTED_FOR_COVER_PAGE);
    }

    @Override
    public SaveElementResponse saveElement(String documentRef, String elementId, String elementName,
                                           String elementFragment) {
        String docPurpose = proposalService.getPurposeFromXml(elementFragment.getBytes());

        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        this.populateCloneProposalMetadata(proposal);
        byte[] proposalContent = proposal.getContent().get().getSource().getBytes();
        List<Element> docPurposeElements = xmlContentProcessor.getElementsByTagName(proposalContent,
                Arrays.asList("docPurpose"), false);
        // Check if new doc purpose is not empty
        if (docPurpose != null && docPurpose.trim().replaceAll("(^\\h*)|(\\h*$)", "").length() > 0) {

            byte[] newXmlContent =
                    !docPurposeElements.isEmpty() ? xmlContentProcessor.replaceElementById(proposalContent,
                            elementFragment,
                            docPurposeElements.get(0).getElementId()) : null;

            if (newXmlContent == null) {
                return null;
            }

            proposal = proposalService.updateProposal(proposal, newXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.docpurpose.updated"));

            CollectionContextService context = proposalContextProvider.get();
            context.useProposal(proposal);
            context.usePurpose(docPurpose);
            context.useEeaRelevance(proposal.getMetadata().get().getEeaRelevance());
            String comment = messageHelper.getMessage("operation.docpurpose.updated");
            context.useActionMessage(ContextActionService.METADATA_UPDATED, comment);
            context.useActionComment(comment);
            context.executeUpdateDocumentsAssociatedToProposal();

            String newContent = elementProcessor.getElement(proposal, elementName, elementId);
            return new SaveCoverPageElementResponse(elementId, elementName, newContent, proposal.getTitle());
        }
        return null;
    }

    @Override
    public DocumentViewResponse insertElement(String documentRef, String elementName, String elementId,
                                              Position position) {
        throw new UnsupportedOperationException(DELETE_ISN_T_SUPPORTED_FOR_COVER_PAGE);
    }

    @Override
    public DocumentViewResponse mergeElement(String documentRef, String elementContent, String elementTag,
                                             String elementId) throws Exception {
        throw new UnsupportedOperationException(DELETE_ISN_T_SUPPORTED_FOR_COVER_PAGE);
    }

    @Override
    public List<TocItem> getTocItems(@NotNull String documentRef) {
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        StructureContext structureContext1 = structureContext.get();
        structureContext1.useDocumentTemplate(
                proposal.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return structureContext1.getTocItems();
    }

    @Override
    public List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType) {
        return null;
    }

    @Override
    public List<TableOfContentItemVO> saveToC(String documentRef, List<TableOfContentItemVO> toc)
            throws MethodNotSupportedException {
        throw new MethodNotSupportedException("Save toc method not allowed for Memorandum type document");
    }

    @Override
    public List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase,
                                                    boolean completeWords, String tempUpdatedContentXML)
            throws Exception {
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        return searchService.searchTextForHighlight(getContentForReplaceProcess(tempUpdatedContentXML, proposal),
                searchText, matchCase, completeWords);
    }

    @Override
    public DocumentViewResponse showVersion(String versionId) {
        final Proposal version = proposalService.findProposalVersion(versionId);
        final String versionContent = documentContentService.getDocumentAsHtml(version, "",
                securityContext.getPermissions(version), true);
        final VersionInfoVO versionInfo = this.documentViewService.getVersionInfo(version);
        return new DocumentViewResponse(null, versionContent, versionInfo, null, null);
    }

    @Override
    public String compare(String newVersionId, String oldVersionId) {
        final Proposal oldVersion = proposalService.findProposalVersion(oldVersionId);
        final Proposal newVersion = proposalService.findProposalVersion(newVersionId);
        return comparisonDelegate.getMarkedContent(oldVersion, newVersion, true);
    }

    @Override
    public DocumentViewResponse restoreToVersion(String documentRef, String versionId) {
        Proposal targetVersion = proposalService.findProposalVersion(versionId);
        Proposal sourceVersion = proposalService.findProposalVersion(documentRef);
        byte[] resultXmlContent = getContent(targetVersion);
        Proposal updatedProposal = proposalService.updateProposal(sourceVersion, resultXmlContent, VersionType.MINOR,
                messageHelper.getMessage("operation.restore.version", targetVersion.getVersionLabel()));
        return this.documentViewService.updateDocumentView(updatedProposal);
    }

    @Override
    public EditElementResponse editElement(String documentRef, String elementId, String elementTagName) {
        Proposal proposal = this.proposalService.getProposalByRef(documentRef);
        String element = this.elementProcessor.getElement(proposal, elementTagName, elementId);
        String jsonAlternatives = "";
        String[] permissions = leosPermissionAuthorityMapHelper.getPermissionsForRoles(
                securityContext.getUser().getRoles());
        boolean isClonedProposal = !proposal.getClonedFrom().isEmpty();
        User user = securityContext.getUser();
        return new EditElementResponse(user, permissions,
                elementId, elementTagName, element, jsonAlternatives, isClonedProposal);
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
        Stopwatch stopwatch = Stopwatch.createStarted();
        byte[] cleanVersion = new byte[0];
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        billContextServiceProvider.get().usePackage(leosPackage);
        String proposalId = proposal.getId();
        try {
            final String jobFileName =
                    "Proposal_" + proposalId + "_AKN2LW_CLEAN_" + System.currentTimeMillis() + ".zip";
            ExportOptions exportOptions = new ExportLW(ExportOptions.Output.PDF, Proposal.class, false, true);
            exportOptions.setExportVersions(new ExportVersions(null, proposal));
            exportService.createDocumentPackage(jobFileName, proposalId, exportOptions, securityContext.getUser());
        } catch (Exception e) {
            LOG.error(OCCURRED_WHILE_USING_EXPORT_SERVICE, e);
        }
        LOG.info("The actual version of CLEANED Coverpage for proposal {}, downloaded in {} milliseconds ({} sec)",
                proposalId, stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        return cleanVersion;
    }

    @Override
    public DocumentViewResponse showCleanVersion(String documentRef) {
        final Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        final String versionContent = documentContentService.getCleanDocumentAsHtml(proposal, "",
                securityContext.getPermissions(proposal));
        VersionInfoVO versionInfoVO = this.documentViewService.getVersionInfo(proposal);
        return new DocumentViewResponse(versionContent, versionInfoVO);
    }

    @Override
    public byte[] downloadXmlVersionFiles(String documentRef, String versionId) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        final Proposal chosenDocument = proposalService.findProposalVersion(versionId);
        final String fileName =
                chosenDocument.getMetadata().get().getRef() + "_v" + chosenDocument.getVersionLabel() + ".xml";
        LOG.info("Downloaded file {}, in {} milliseconds ({} sec)", fileName, stopwatch.elapsed(TimeUnit.MILLISECONDS),
                stopwatch.elapsed(TimeUnit.SECONDS));
        return chosenDocument.getContent().get().getSource().getBytes();
    }

    @Override
    public byte[] replaceAllTextInDocument(ReplaceAllMatchRequest event) throws Exception {
        Proposal proposal = this.proposalService.findProposalByRef(event.getDocumentRef());
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(getContent(proposal), event.getSearchText(),
                event.isCaseSensitive(), event.isCompleteWords());
        return searchService.replaceText(
                getContent(proposal),
                event.getSearchText(),
                event.getReplaceText(),
                searchMatchVOS,
                false);
    }

    @Override
    public byte[] replaceOneTextInDocument(ReplaceMatchRequest event) throws Exception {
        Proposal proposal = this.proposalService.findProposalByRef(event.getDocumentRef());

        byte[] contentForReplace = getContentForReplaceProcess(event.getTempUpdatedContentXML(), proposal);
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(contentForReplace, event.getSearchText(),
                event.isCaseSensitive(), event.isCompleteWords());
        return searchService.replaceText(
                contentForReplace,
                event.getSearchText(),
                event.getReplaceText(),
                Arrays.asList(searchMatchVOS.get(event.getMatchIndex())),
                false);
    }

    @Override
    public DocumentViewResponse saveAfterReplace(SaveAfterReplaceRequest event) {
        Proposal proposal = this.proposalService.findProposalByRef(event.getDocumentRef());
        Proposal updateProposal = proposalService.updateProposal(proposal,
                event.getUpdatedContent().getBytes(StandardCharsets.UTF_8), VersionType.MINOR,
                messageHelper.getMessage("operation.search.replace.updated"));
        return documentViewService.updateDocumentView(updateProposal);
    }

    @Override
    public DocumentConfigResponse getDocumentConfig(String documentRef) {
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        StructureContext structureContext1 = structureContext.get();
        structureContext1.useDocumentTemplate(
                proposal.getMetadata().getOrError(() -> "Proposal metadata is required!").getDocTemplate());
        List<TocItem> tocItems = structureContext1.getTocItems();
        List<LeosMetadata> documentsMetadata = packageService.getDocumentsMetadata(
                proposal.getMetadata().get().getRef());

        return new DocumentConfigResponse(
                documentsMetadata, null, tocItems, null,
                StructureConfigUtils.getNumberingConfigsFromTocItem(null, tocItems, XmlHelper.POINT),
                getArticleTypesAttributes(tocItems), proposal.getMetadata().get().getRef(),
                proposal.getMetadata().getOrNull(), structureContext1.getTocRules(),
                proposal.isTrackChangesEnabled(), true, proposal.isClonedProposal()
        );
    }

    @Override
    public String fetchUserGuidance(String documentRef) {
        // KLUGE temporary hack for compatibility with new domain model
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        return templateConfigurationService.getTemplateConfiguration(proposal.getMetadata().get().getDocTemplate(),
                "guidance");
    }

    @Override
    public DocumentViewResponse acceptChange(String documentRef, String elementId, String elementTagName,
                                             TrackChangeActionType changeType) throws Exception {
        throw new UnsupportedOperationException("Accept change isn't supported for cover page");
    }

    @Override
    public DocumentViewResponse rejectChange(String documentRef, String elementId, String elementTagName,
                                             TrackChangeActionType changeType) throws Exception {
        throw new UnsupportedOperationException("Accept change isn't supported for cover page");
    }

    @Override
    public boolean toggleTrackChangeEnabled(boolean isTrackChangeEnabled, String documentRef) {
        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED),
                isTrackChangeEnabled);
        String documentId = this.proposalService.findProposalByRef(documentRef).getId();
        Proposal proposal = proposalService.updateProposal(documentRef, documentId, properties, false);
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return true;
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


    private byte[] doDownloadVersion(String documentRef, boolean isWithFilteredAnnotations, String annotations) {
        try {
            Stopwatch stopwatch = Stopwatch.createStarted();
            final Proposal currentDocument = this.proposalService.getProposalByRef(documentRef);

            LeosPackage leosPackage = packageService.findPackageByDocumentRef(currentDocument.getMetadata().get().getRef(), Proposal.class);
            billContextServiceProvider.get().usePackage(leosPackage);
            Proposal proposal = this.documentViewService.getProposalFromPackage(currentDocument);
            populateCloneProposalMetadata(proposal);

            ExportOptions exportOptions = new ExportLW(ExportOptions.Output.PDF, Proposal.class, false);

            exportOptions.setExportVersions(new ExportVersions(isClonedProposal() ?
                    proposalService.findFirstVersion(currentDocument.getMetadata().get().getRef()) : null,
                    currentDocument));
            exportOptions.setWithFilteredAnnotations(isWithFilteredAnnotations);
            exportOptions.setFilteredAnnotations(annotations);

            String proposalId = proposal.getId();
            if (proposalId != null) {
                createPackageForExport(exportOptions);
            }
            LOG.info("The actual version of Coverpage {} downloaded in {} milliseconds ({} sec)",
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

    private byte[] getContent(Proposal proposal) {
        final Content content = proposal.getContent().getOrError(() -> "Annex content is required!");
        return content.getSource().getBytes();
    }


    private void setStructureContext(String docTemplate) {
        this.structureContext.get().useDocumentTemplate(docTemplate);
    }

    private String getEditableXml(Proposal proposal) {
        securityContext.getPermissions(proposal);
        byte[] coverPageContent = new byte[0];
        byte[] proposalContent = proposal.getContent().get().getSource().getBytes();
        boolean isCoverPageExists = documentContentService.isCoverPageExists(proposalContent);
        if (isCoverPageExists) {
            byte[] xmlContent = proposal.getContent().get().getSource().getBytes();
            coverPageContent = documentContentService.getCoverPageContent(xmlContent);
        }
        String editableXml = documentContentService.toEditableContent(proposal, "", securityContext, coverPageContent);
        editableXml = XmlHelper.removeSelfClosingElements(editableXml);
        return StringEscapeUtils.unescapeXml(editableXml);
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

    private void createDocumentPackageForExport(ExportOptions exportOptions) throws Exception {
        Stopwatch stopwatch = Stopwatch.createStarted();
        final String proposalId = this.getContextProposalId();

        if (proposalId != null) {
            final String jobFileName = "Proposal_" + proposalId + "_AKN2DW_" + System.currentTimeMillis() + ".zip";
            exportService.createDocumentPackage(jobFileName, proposalId, exportOptions, securityContext.getUser());
            LOG.info("Exported to LegisWrite and downloaded file {}, in {} milliseconds ({} sec)", jobFileName,
                    stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        }
    }

    private String getContextProposalId() {
        return billContextServiceProvider.get().getProposalId();
    }

    private boolean isClonedProposal() {
        return cloneContext != null && cloneContext.get().isClonedProposal();
    }

    private void populateCloneProposalMetadata(Proposal proposal) {
        if (proposal != null && proposal.isClonedProposal()) {
            byte[] xmlContent = proposal.getContent().get().getSource().getBytes();
            CloneProposalMetadataVO cloneProposalMetadataVO = proposalService.getClonedProposalMetadata(xmlContent);
            cloneContext.get().setCloneProposalMetadataVO(cloneProposalMetadataVO);
        }
    }

}
