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
import com.sun.istack.NotNull;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMapHelper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.collection.document.BillContextService;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.RefreshElementResponse;
import eu.europa.ec.leos.services.dto.response.ShowCleanVersionResponse;
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
import eu.europa.ec.leos.services.support.VersionsUtil;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.services.template.TemplateConfigurationService;
import eu.europa.ec.leos.services.toc.StructureContext;
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

import javax.inject.Provider;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service("coverPage")
public class CoverPageApiServiceImpl implements CoverPageApiService {
    private static final Logger LOG = LoggerFactory.getLogger(CoverPageApiServiceImpl.class);
    private static final String DELETE_ISN_T_SUPPORTED_FOR_COVER_PAGE = "Delete isn't supported for cover page";
    private static final String OCCURRED_WHILE_USING_EXPORT_SERVICE = "Unexpected error occurred while using ExportService";

    @Autowired
    ProposalService proposalService;
    @Autowired
    DocumentViewService<Proposal> documentViewService;
    @Autowired
    DocumentContentService documentContentService;
    @Autowired
    SecurityContext securityContext;
    @Autowired
    UserHelper userHelper;
    @Autowired
    ComparisonDelegateAPI<Proposal> comparisonDelegate;
    @Autowired
    SearchService searchService;
    @Autowired
    MessageHelper messageHelper;
    @Autowired
    ElementProcessor elementProcessor;
    @Autowired
    PackageService packageService;
    @Autowired
    XmlContentProcessor xmlContentProcessor;
    @Autowired
    ExportService exportService;
    @Autowired
    TemplateConfigurationService templateConfigurationService;
    @Autowired
    LegService legService;
    @Autowired
    LeosPermissionAuthorityMapHelper leosPermissionAuthorityMapHelper;

    private Provider<CloneContext> cloneContext;
    private Provider<BillContextService> context;
    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(ZoneId.systemDefault());


    private Provider<StructureContext> structureContext;

    CoverPageApiServiceImpl(Provider<StructureContext> structureContext, Provider<CloneContext> cloneContext, Provider<BillContextService> context) {
        this.structureContext = structureContext;
        this.cloneContext = cloneContext;
        this.context = context;
    }

    @Override
    public DocumentViewResponse getDocument(@NotNull String documentRef) {
        Proposal proposal = this.proposalService.getProposalByRef(documentRef);
        VersionInfoVO versionInfoVO = getVersionInfo(proposal);
        String editableXml = getEditableXml(proposal);
        String proposalRef = proposal.getMetadata().get().getRef();
        return new DocumentViewResponse(proposalRef, editableXml, versionInfoVO);
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef, TocMode tocMode) {
        Proposal proposal = this.proposalService.getProposalByRef(documentRef);
        this.setStructureContext(proposal.getMetadata().getOrError(() -> "Cover Page metadata is required!").getDocTemplate());
        return this.proposalService.getCoverPageTableOfContent(proposal, tocMode);
    }

    @Override
    public String getElement(String documentRef, String elementName, String elementId) {
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        return  elementProcessor.getElement(proposal, elementName, elementId);
    }

    @Override
    public DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) {
        throw new UnsupportedOperationException(DELETE_ISN_T_SUPPORTED_FOR_COVER_PAGE);
    }

    @Override
    public RefreshElementResponse saveElement(String documentRef, String elementId, String elementName, String elementFragment) {
        String docPurpose = proposalService.getPurposeFromXml(elementFragment.getBytes());

        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        this.populateCloneProposalMetadata(proposal);
        byte[] proposalContent = proposal.getContent().get().getSource().getBytes();
        List<Element> docPurposeElements = xmlContentProcessor.getElementsByTagName(proposalContent, Arrays.asList("docPurpose"), false);
        // Check if new doc purpose is not empty
        if (docPurpose != null && docPurpose.trim().replaceAll("(^\\h*)|(\\h*$)", "").length() > 0) {

            byte[] newXmlContent = !docPurposeElements.isEmpty() ? xmlContentProcessor.replaceElementById(proposalContent, elementFragment,
                    docPurposeElements.get(0).getElementId()) : null;

            if (newXmlContent == null) {
                return null;
            }

            proposal = proposalService.updateProposal(proposal, newXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.docpurpose.updated"));
            String newContent = elementProcessor.getElement(proposal, elementName, elementId);
            return new RefreshElementResponse(elementId, elementName, newContent);
        }
        return null;
    }

    @Override
    public DocumentViewResponse insertElement(String documentRef, String elementName, String elementId, Position position) {
        throw new UnsupportedOperationException(DELETE_ISN_T_SUPPORTED_FOR_COVER_PAGE);
    }

    @Override
    public DocumentViewResponse mergeElement(String documentRef, String elementContent, String elementTag, String elementId) throws Exception {
        throw new UnsupportedOperationException(DELETE_ISN_T_SUPPORTED_FOR_COVER_PAGE);
    }

    @Override
    public List<VersionVO> getRecentMinorVersions(String documentRef) {
/*
        Proposal proposal = this.proposalService.findProposalByRef(documentRef)
        Integer recentCount = this.proposalService.findRecentMinorVersionsCount(proposal.getId(), documentRef)
*/
        //        return this.proposalService.findRecentMinorVersions(proposal.getId(), documentRef, 0, recentCount)
        return null;
    }

    @Override
    public List<VersionVO> getVersionsData(String documentRef) {
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        List<VersionVO> versions = this.proposalService.getAllVersions(proposal.getId(), documentRef);
        for (VersionVO versionVO : versions) {
            Integer count = this.proposalService.findAllMinorsCountForIntermediate(documentRef, versionVO.getCmisVersionNumber());
            if (versionVO.getVersionType().equals(VersionType.MAJOR)) {
                LeosPackage leosPackage = packageService.findPackageByDocumentId(proposal.getId());
                LegDocument legDocument = this.legService.findLastLegByVersionedReference(leosPackage.getPath(), versionVO.getVersionedReference());
                versionVO.setLegFileName(legDocument.getName());
            }
            versionVO.setCreatedBy(userHelper.convertToPresentation(versionVO.getUsername()));
            versionVO.setSubVersions(VersionsUtil.buildVersionResponse(this.proposalService.findAllMinorsForIntermediate(documentRef, versionVO.getCmisVersionNumber(), 0, count), messageHelper, userHelper));
        }
        return versions;
    }

    @Override
    public List<TocItem> getTocItems(@NotNull String documentRef) {
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        StructureContext structureContext1 = structureContext.get();
        structureContext1.useDocumentTemplate(proposal.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return structureContext1.getTocItems();
    }

    @Override
    public List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType) {
        return null;
    }

    @Override
    public List<TableOfContentItemVO> saveToC(String documentRef, List<TableOfContentItemVO> toc) throws MethodNotSupportedException {
        throw new MethodNotSupportedException("Save toc method not allowed for Memorandum type document");
    }

    @Override
    public List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase, boolean completeWords) throws Exception {
        Proposal coverpage = this.proposalService.getProposalByRef(documentRef);
        return  searchService.searchText(getContent(coverpage), searchText, matchCase, completeWords);
    }

    @Override
    public DocumentViewResponse showVersion(String versionId) {
        final Proposal version = proposalService.findProposalVersion(versionId);
        final String versionContent = documentContentService.getDocumentAsHtml(version, "", securityContext.getPermissions(version), true);
        final VersionInfoVO versionInfo = this.documentViewService.getVersionInfo(version);
        return new DocumentViewResponse(null, versionContent, versionInfo);
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
        Proposal updatedProposal = proposalService.updateProposal(sourceVersion, resultXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.restore.version", targetVersion.getVersionLabel()));
        return this.documentViewService.updateDocumentView(updatedProposal);
    }

    @Override
    public EditElementResponse editElement(String documentRef, String elementId, String elementTagName) {
        Proposal proposal = this.proposalService.getProposalByRef(documentRef);
        String element = this.elementProcessor.getElement(proposal, elementTagName, elementId);
        String jsonAlternatives = "";
        String[] permissions = leosPermissionAuthorityMapHelper.getPermissionsForRoles(securityContext.getUser().getRoles());
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
        LeosPackage leosPackage = packageService.findPackageByDocumentId(proposal.getId());
        context.get().usePackage(leosPackage);
        String proposalId = proposal.getId();
        try {
            final String jobFileName = "Proposal_" + proposalId + "_AKN2LW_CLEAN_" + System.currentTimeMillis() + ".zip";
            ExportOptions exportOptions = new ExportLW(ExportOptions.Output.PDF, Proposal.class, false, true);
            exportOptions.setExportVersions(new ExportVersions(null, proposal));
            exportService.createDocumentPackage(jobFileName, proposalId, exportOptions, securityContext.getUser());
        } catch (Exception e) {
            LOG.error(OCCURRED_WHILE_USING_EXPORT_SERVICE, e);
        }
        LOG.info("The actual version of CLEANED Coverpage for proposal {}, downloaded in {} milliseconds ({} sec)", proposalId, stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        return cleanVersion;
    }

    @Override
    public ShowCleanVersionResponse showCleanVersion(String documentRef) {
        final Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        final String versionContent = documentContentService.getCleanDocumentAsHtml(proposal, "", securityContext.getPermissions(proposal));
        final String versionInfo = getVersionInfoAsString(proposal);
        return new ShowCleanVersionResponse(versionContent, versionInfo);
    }

    @Override
    public byte[] downloadXmlVersionFiles(String documentRef, String versionId) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        final Proposal chosenDocument = proposalService.findProposalVersion(versionId);
        final String fileName = chosenDocument.getMetadata().get().getRef() + "_v" + chosenDocument.getVersionLabel() + ".xml";
        LOG.info("Downloaded file {}, in {} milliseconds ({} sec)", fileName, stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        return chosenDocument.getContent().get().getSource().getBytes();
    }

    @Override
    public byte[] replaceAllTextInDocument(ReplaceAllMatchRequest event) throws Exception {
        Proposal proposal = this.proposalService.findProposalByRef(event.getDocumentRef());
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(getContent(proposal), event.getSearchText(), event.isCaseSensitive(), event.isCompleteWords());
        return searchService.replaceText(
                getContent(proposal),
                event.getSearchText(),
                event.getReplaceText(),
                searchMatchVOS);
    }

    @Override
    public byte[] replaceOneTextInDocument(ReplaceMatchRequest event) throws Exception {
        Proposal proposal = this.proposalService.findProposalByRef(event.getDocumentRef());
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(getContent(proposal), event.getSearchText(), event.isCaseSensitive(), event.isCompleteWords());
        return searchService.replaceText(
                getContent(proposal),
                event.getSearchText(),
                event.getReplaceText(),
                Arrays.asList(searchMatchVOS.get(event.getMatchIndex())));
    }

    @Override
    public DocumentViewResponse saveAfterReplace(SaveAfterReplaceRequest event) {
        Proposal proposal = this.proposalService.findProposalByRef(event.getDocumentRef());
        Proposal updateProposal = proposalService.updateProposal(proposal, event.getUpdatedContent().getBytes(), VersionType.MINOR,
                messageHelper.getMessage("operation.search.replace.updated"));
        return documentViewService.updateDocumentView(updateProposal);
    }

    @Override
    public DocumentConfigResponse getDocumentConfig(String documentRef) {
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        StructureContext structureContext1 = structureContext.get();
        structureContext1.useDocumentTemplate(proposal.getMetadata().getOrError(() -> "Proposal metadata is required!").getDocTemplate());
        List<TocItem> tocItems = structureContext1.getTocItems();
        List<LeosMetadata> documentsMetadata = packageService.getDocumentsMetadata(proposal.getId());

        return new DocumentConfigResponse(
                documentsMetadata, null, tocItems, null, StructureConfigUtils.getNumberingConfigsFromTocItem(null, tocItems, XmlHelper.POINT),
                getArticleTypesAttributes(tocItems), proposal.getMetadata().get().getRef(), proposal.getMetadata().getOrNull(), structureContext1.getTocRules(), proposal.isTrackChangesEnabled(), true
        );
    }

    @Override
    public String fetchUserGuidance(String documentRef) {
        // KLUGE temporary hack for compatibility with new domain model
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        return templateConfigurationService.getTemplateConfiguration(proposal.getMetadata().get().getDocTemplate(), "guidance");
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

            LeosPackage leosPackage = packageService.findPackageByDocumentId(currentDocument.getId());
            context.get().usePackage(leosPackage);
            Proposal proposal = this.documentViewService.getProposalFromPackage(currentDocument);
            populateCloneProposalMetadata(proposal);

            ExportOptions exportOptions = new ExportLW(ExportOptions.Output.PDF, Proposal.class, false);

            exportOptions.setExportVersions(new ExportVersions(isClonedProposal() ?
                    proposalService.findFirstVersion(currentDocument.getMetadata().get().getRef()) : null, currentDocument));
            exportOptions.setWithFilteredAnnotations(isWithFilteredAnnotations);
            exportOptions.setFilteredAnnotations(annotations);

            String proposalId = proposal.getId();
            if (proposalId != null) {
                createPackageForExport(exportOptions);
            }
            LOG.info("The actual version of Coverpage {} downloaded in {} milliseconds ({} sec)", currentDocument.getName(),
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
        return context.get().getProposalId();
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
