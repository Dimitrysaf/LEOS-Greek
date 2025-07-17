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
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.DocumentVO;
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
import eu.europa.ec.leos.services.collection.document.BillContextService;
import eu.europa.ec.leos.services.collection.document.ContextActionService;
import eu.europa.ec.leos.services.collection.document.MemorandumContextService;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.request.UpdateProposalRequest;
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
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.services.template.TemplateConfigurationService;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import eu.europa.ec.leos.services.user.UserHelper;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.structure.TocItem;
import io.atlassian.fugue.Pair;
import org.apache.commons.lang3.StringEscapeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.inject.Provider;
import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static eu.europa.ec.leos.services.support.XercesUtils.createXercesDocument;

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
    GenericDocumentApiService genericDocumentApiService;
    XPathCatalog xPathCatalog;

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
            LeosPermissionAuthorityMapHelper leosPermissionAuthorityMapHelper, GenericDocumentApiService genericDocumentApiService,
            RepositoryPropertiesMapper repositoryPropertiesMapper, TrackChangesContext trackChangesContext,
            Provider<CloneContext> cloneContext, Provider<BillContextService> billContextServiceProvider,
            Provider<StructureContext> structureContext, Provider<CollectionContextService> proposalContextProvider,
            Provider<MemorandumContextService> memorandumContextServiceProvider, XPathCatalog xPathCatalog) {
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
        this.genericDocumentApiService = genericDocumentApiService;
        this.cloneContext = cloneContext;
        this.billContextServiceProvider = billContextServiceProvider;
        this.structureContext = structureContext;
        this.proposalContextProvider = proposalContextProvider;
        this.memorandumContextServiceProvider = memorandumContextServiceProvider;
        this.xPathCatalog = xPathCatalog;
    }

    @Override
    public DocumentViewResponse getDocument(@NotNull String documentRef) {
        Proposal proposal = this.proposalService.getProposalByRef(documentRef);
        VersionInfoVO versionInfoVO = getVersionInfo(proposal);
        String editableXml = getEditableXml(proposal);
        String proposalRef = proposal != null ? proposal.getMetadata().get().getRef() : null;
        return new DocumentViewResponse(proposalRef, editableXml, versionInfoVO, null, null);
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef, TocMode tocMode, String clientContextToken) {
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
                                           String elementFragment, boolean isSplit, String alternateElementId) {
        String docPurpose = proposalService.getPurposeFromXml(elementFragment.getBytes());

        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        this.populateCloneProposalMetadata(proposal);
        byte[] proposalContent = proposal.getContent().get().getSource().getBytes();
        List<Element> docPurposeElements = xmlContentProcessor.getElementsByTagName(proposalContent,
                Arrays.asList("docPurpose"), false);
        // Check if new doc purpose is not empty
        if (docPurpose != null && docPurpose.trim().replaceAll("(^\\h*)|(\\h*$)", "").length() > 0) {

            elementFragment = elementProcessor.updateReferences(elementFragment, proposal);
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
            context.useVersionType(VersionType.MINOR);
            context.executeUpdateDocumentsAssociatedToProposal();

            String newContent = elementProcessor.getElement(proposal, elementName, elementId);
            return new SaveCoverPageElementResponse(elementId, elementName, newContent, proposal.getTitle());
        }
        return null;
    }

    @Override
    public DocumentViewResponse insertGroup(String documentRef, String elementName, String elementId, Position position) {
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
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        proposalService.createVersion(proposal.getId(), versionType, checkInComment);
        return this.genericDocumentApiService.getMajorVersionsData(documentRef, 0, 1);
    }

    @Override
    public List<TableOfContentItemVO> saveToC(String documentRef, List<TableOfContentItemVO> toc, TocMode tocMode, String clientContextToken) {
        throw new RuntimeException("Save toc method not allowed for Memorandum type document");
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
        Proposal sourceVersion = proposalService.findProposalByRef(documentRef);
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
        String[] permissions = leosPermissionAuthorityMapHelper.getPermissionsForRoles(securityContext.getAuthorities());
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
    public Pair<byte[], Integer> replaceAllTextInDocument(ReplaceAllMatchRequest event) throws Exception {
        Proposal proposal = this.proposalService.findProposalByRef(event.getDocumentRef());
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(getContent(proposal), event.getSearchText(),
                event.isCaseSensitive(), event.isCompleteWords());
        return new Pair<>(searchService.replaceText(
                getContent(proposal),
                event.getSearchText(),
                event.getReplaceText(),
                searchMatchVOS,
                false), searchMatchVOS.size());
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
    public DocumentConfigResponse getDocumentConfig(String documentRef, String clientContextToken) {
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        StructureContext structure = structureContext.get();
        return genericDocumentApiService.getDocumentConfig(proposal, structure, clientContextToken);
    }

    @Override
    public String fetchUserGuidance(String documentRef) {
        // KLUGE temporary hack for compatibility with new domain model
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        return templateConfigurationService.getTemplateConfiguration(proposal.getMetadata().get().getDocTemplate());
    }

    @Override
    public DocumentViewResponse acceptChange(String documentRef, String elementId, String elementTagName, TrackChangeActionType changeType, String presenterId) throws Exception {
        throw new UnsupportedOperationException("Accept change isn't supported for cover page");
    }

    @Override
    public DocumentViewResponse rejectChange(String documentRef, String elementId, String elementTagName, TrackChangeActionType changeType, String presenterId) throws Exception {
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

    @Override
    public DocumentVO getCoverPageCorrigendumAddendumDetails(byte[] proposalXMLContent, DocumentVO documentVO) {

        Document document = createXercesDocument(proposalXMLContent);
        String xPathCorrigendum = xPathCatalog.getXPathCorrigendum();
        String xPathAddendum = xPathCatalog.getXPathAddendum();
        Node corrigendum = XercesUtils.getFirstElementByXPath(document, xPathCorrigendum);
        Node addendum = XercesUtils.getFirstElementByXPath(document, xPathAddendum);
        Node existingNode = corrigendum != null ? corrigendum : addendum != null ? addendum : null;
        NodeList nodeList = existingNode != null ? existingNode.getChildNodes() : null;

        if (nodeList != null) {
            String containerName = nodeList.item(0).getTextContent();
            Node docNumberNode = XercesUtils.getElementsByXPath(existingNode, "//akn:p/akn:affectedDocument/akn:docNumber", true).item(0);
            String docNumberText = getTextOfElement(docNumberNode);
            Node inlineVersionNode = XercesUtils.getElementsByXPath(existingNode, "//akn:p/akn:affectedDocument/akn:docNumber/akn:inline[@name=\"version\"]", true).item(0);
            String version = getTextOfElement(inlineVersionNode);
            Node dateNode = XercesUtils.getElementsByXPath(existingNode, "//akn:p/akn:affectedDocument/akn:date", true).item(0);
            String dateText = getTextOfElement(dateNode);
            Node correctionInfoNode = XercesUtils.getElementsByXPath(existingNode, "//akn:p/akn:inline[@name=\"correctionInfo\"]", true).item(0);
            String correctionInfoText = getTextOfElement(correctionInfoNode);
            Node targetLanguageNode = XercesUtils.getElementsByXPath(existingNode, "//akn:p[@name=\"targetLanguages\"]", true).item(0);

            documentVO.setProposalType(containerName.toLowerCase(Locale.ROOT));
            documentVO.setTargetProposalReference(docNumberText);
            documentVO.setFinalVersion("final".equals(version) ? true : false);
            documentVO.setTargetProposalDate(dateText);
            documentVO.setCorrectionInformation(correctionInfoText);
            documentVO.setShowCorrigendumAddendum(true);
            if (targetLanguageNode != null) {
                NodeList targetLangInlineNodes = XercesUtils.getElementsByName(targetLanguageNode, "inline");
                if (targetLangInlineNodes != null && targetLangInlineNodes.getLength() > 0) {
                    List<String> proposalTargetLang = new ArrayList<>();
                    for (int i = 0; i < targetLangInlineNodes.getLength(); i++) {
                        proposalTargetLang.add(targetLangInlineNodes.item(i).getTextContent());
                    }
                    documentVO.setProposalTargetLang(proposalTargetLang);
                } else {
                    documentVO.setAllTargetLangSelected(true);
                }
            }
        }
        return documentVO;
    }

    private String getTextOfElement(Node docNumberNode) {
        String directText = null;
        if (docNumberNode != null) {
            for (int i = 0; i < docNumberNode.getChildNodes().getLength(); i++) {
                Node child = docNumberNode.getChildNodes().item(i);
                if (child.getNodeType() == Node.TEXT_NODE) {
                    directText = child.getTextContent().trim();
                    break;
                }
            }
        }
        return directText;
    }

    @Override
    public void updateCorrigendumAddendum(String proposalRef, UpdateProposalRequest request) {
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        byte[] xmlContent = proposal.getContent().get().getSource().getBytes();
        Document document = createXercesDocument(xmlContent);

        Node corrigendumNode = XercesUtils.getFirstElementByXPath(document, xPathCatalog.getXPathCorrigendum());
        Node addendumNode = XercesUtils.getFirstElementByXPath(document, xPathCatalog.getXPathAddendum());

        if (corrigendumNode != null) {
            XercesUtils.deleteElement(corrigendumNode);
        }
        if (addendumNode != null) {
            XercesUtils.deleteElement(addendumNode);
        }

        if (Boolean.TRUE.equals(request.getShowCorrigendumAddendum()) && request.getProposalType() != null) {
            document = populateCorrigendumAddendumContainer(document, request);
        }

        proposalService.updateProposal(proposal.getId(), XercesUtils.nodeToByteArray(document));
    }


    private Document populateCorrigendumAddendumContainer(Document document, UpdateProposalRequest request) {
        Node longTitleNode = XercesUtils.getFirstElementByXPath(document, xPathCatalog.getXPathLongTitle());
        Node containerNode = XercesUtils.createElementWithAknNS(document, "container", "");
        XercesUtils.addAttribute(containerNode, "class", "template");
        XercesUtils.addAttribute(containerNode, "name", request.getProposalType());
        XercesUtils.addSibling(containerNode, longTitleNode, true);
        createCAContainerNameElement(document, containerNode, request.getProposalType().toUpperCase(Locale.ROOT));
        createCAContainerTargetDocumentDateAndReference(document, containerNode, request);
        createCAContainerTargetLanguages(document, containerNode, request.getProposalTargetLang());
        createCAContainerCorrectionInfo(document, containerNode, request);
        createCAContainerWrapperText(document, containerNode);
        return document;
    }

    private void createCAContainerNameElement(Document document, Node container, String content) {
        Node containerChildNode = createCAContainerChildElement(document, content, true);
        XercesUtils.addChild(containerChildNode, container);
    }

    private void createCAContainerTargetDocumentDateAndReference(Document document, Node container, UpdateProposalRequest request) {
        Node containerChildNode = createCAContainerChildElement(document, messageHelper.getMessage("details.affected.document.intro")+" ", false);
        Node affectedDocNode = XercesUtils.createElementWithAknNS(document, "affectedDocument", "");
        XercesUtils.addAttribute(affectedDocNode, "href", "");
        Node docNumberNode = XercesUtils.createElementWithAknNS(document, "docNumber", " " + request.getTargetProposalReference() + " ");
        Node inlineNode = XercesUtils.createElementWithAknNS(document, "inline", checkIfFinalVersion(request.getFinalVersion()));
        XercesUtils.addAttribute(inlineNode, "name", "version");
        Node dateNode = XercesUtils.createElementWithAknNS(document, "date", " " + request.getTargetProposalDate() + " ");
        XercesUtils.addAttribute(dateNode, "date", request.getTargetProposalDate());
        XercesUtils.addFirstChild(inlineNode, docNumberNode);
        XercesUtils.addFirstChild(docNumberNode, affectedDocNode);
        affectedDocNode = XercesUtils.appendContentToNode(affectedDocNode, " "+messageHelper.getMessage("details.affected.document.reference.date.separator")+" ");
        XercesUtils.addLastChild(dateNode, affectedDocNode);
        XercesUtils.addLastChild(affectedDocNode, containerChildNode);
        XercesUtils.addChild(containerChildNode, container);
    }

    private String checkIfFinalVersion(Boolean isFinalVersion ) {
       return isFinalVersion != null && isFinalVersion ? " "+messageHelper.getMessage("details.affected.document.reference.version") : "";
    }

    private void createCAContainerTargetLanguages(Document document, Node container, List<String> targetLanguages) {
        if(!targetLanguages.isEmpty() && !targetLanguages.get(0).equalsIgnoreCase("NONE")) {
            Node containerChildNode;
            if(targetLanguages.get(0).equalsIgnoreCase("ALL")) {
                containerChildNode = createCAContainerChildElement(document, messageHelper.getMessage("details.target.document.all.language"), true);
            } else {
                containerChildNode = createCAContainerChildElement(document, messageHelper.getMessage("details.target.document.selected.language")+" ", true);
                for(int i =0 ; i < targetLanguages.size(); i++) {
                    String lang = targetLanguages.get(i);
                    Node inline = XercesUtils.createElementWithAknNS(document, "inline", "");
                    XercesUtils.addAttribute(inline, "name", lang);
                    XercesUtils.addAttribute(inline, "refersTo", "~"+lang);
                    //XercesUtils.appendContentToNode(inline, lang);
                    inline.appendChild(document.createTextNode(lang));
                    XercesUtils.addLastChild(inline, containerChildNode);
                    if (i < targetLanguages.size() - 2) {
                        containerChildNode.appendChild(document.createTextNode(", "));
                    } else if (i == targetLanguages.size() - 2) {
                        containerChildNode.appendChild(document.createTextNode(" and "));
                    } else {
                        containerChildNode.appendChild(document.createTextNode("."));
                    }
                }
            }
            XercesUtils.addAttribute(containerChildNode, "name", "targetLanguages");
            XercesUtils.addChild(containerChildNode, container);
        }
    }

    private void createCAContainerCorrectionInfo(Document document, Node container, UpdateProposalRequest request) {
        Node containerChildNode = createCAContainerChildElement(document, "", true);
        Node inlineNode = XercesUtils.createElementWithAknNS(document, "inline", request.getCorrectionInformation());
        XercesUtils.addAttribute(inlineNode, "name", "correctionInfo");
        XercesUtils.addChild(inlineNode, containerChildNode);
        XercesUtils.addChild(containerChildNode, container);
    }

    private void createCAContainerWrapperText(Document document, Node container) {
        Node containerChildNode = createCAContainerChildElement(document, "The text should read as follows:", true);
        XercesUtils.addChild(containerChildNode, container);
    }

    private Node createCAContainerChildElement(Document document, String nodeContent, boolean addEditableDeletableAttrs) {
        Node containerChildNode = XercesUtils.createElementWithAknNS(document, "p", nodeContent);
        if (addEditableDeletableAttrs) {
            XercesUtils.addAttribute(containerChildNode, "leos:deletable", "false");
            XercesUtils.addAttribute(containerChildNode, "leos:editable", "false");
        }
        return containerChildNode;
    }

}
