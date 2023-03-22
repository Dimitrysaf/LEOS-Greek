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
import eu.europa.ec.leos.domain.cmis.Content;
import eu.europa.ec.leos.domain.cmis.LeosPackage;
import eu.europa.ec.leos.domain.cmis.common.VersionType;
import eu.europa.ec.leos.domain.cmis.document.Memorandum;
import eu.europa.ec.leos.domain.cmis.document.Proposal;
import eu.europa.ec.leos.domain.cmis.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.VersionVO;
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
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.support.VersionsUtil;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.services.template.TemplateConfigurationService;
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.vo.toc.AlternateConfig;
import eu.europa.ec.leos.vo.toc.Attribute;
import eu.europa.ec.leos.vo.toc.NumberingConfig;
import eu.europa.ec.leos.vo.toc.StructureConfigUtils;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import eu.europa.ec.leos.vo.toc.TocItemType;
import org.apache.http.MethodNotSupportedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service("memorandum")
public class MemorandumApiServiceImpl implements MemorandumApiService {

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
    private Provider<BillContextService> context;

    private Provider<StructureContext> structureContext;

    private static final Logger LOG = LoggerFactory.getLogger(MemorandumApiServiceImpl.class);


    MemorandumApiServiceImpl(Provider<StructureContext> structureContext, Provider<BillContextService> context) {

        this.structureContext = structureContext;
        this.context = context;

    }

    @Override
    public DocumentViewResponse getDocument(String documentRef) {
        Memorandum memorandum = memorandumService.findMemorandumByRef(documentRef);
        return this.documentViewService.getDocumentView(memorandum);
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef, TocMode tocMode) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        this.setStructureContext(memorandum.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.memorandumService.getTableOfContent(memorandum, TocMode.SIMPLIFIED);
    }

    @Override
    public String getElement(String documentRef, String elementName, String elementId) {
        Memorandum bill = this.memorandumService.findMemorandumByRef(documentRef);
        return this.elementProcessor.getElement(bill, elementName, elementId);
    }

    @Override
    public DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) throws Exception {
        throw new MethodNotSupportedException("Delete isn't supported");
    }

    @Override
    public DocumentViewResponse saveElement(String documentRef, String elementId, String elementName, String elementFragment) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        byte[] newXmlContent = elementProcessor.updateElement(memorandum, elementName, elementId, elementFragment, false);
        memorandum = memorandumService.updateMemorandum(memorandum, newXmlContent, VersionType.MINOR, messageHelper.getMessage("operation." + elementName + ".updated"));
        return this.documentViewService.getDocumentView(memorandum);
    }

    @Override
    public DocumentViewResponse insertElement(String documentRef, String elementName, String elementId, Position position) {
        throw new UnsupportedOperationException("Insert element isn't supported for memorandum");
    }

    @Override
    public DocumentViewResponse mergeElement(String documentRef, String elementContent, String elementTag, String elementId) throws Exception {
        throw new UnsupportedOperationException("Merge element isn't supported for memorandum");
    }

    @Override
    public List<VersionVO> getRecentMinorVersions(String documentRef) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        Integer recentCount = this.memorandumService.findRecentMinorVersionsCount(memorandum.getId(), documentRef);
        List<Memorandum> memorandums = this.memorandumService.findRecentMinorVersions(memorandum.getId(), documentRef, 0, recentCount);
        return VersionsUtil.buildVersionVO(memorandums, messageHelper);

    }

    @Override
    public List<VersionVO> getVersionsData(String documentRef) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        List<VersionVO> versions = this.memorandumService.getAllVersions(memorandum.getId(), documentRef);
        for (VersionVO versionVO : versions) {
            Integer count = this.memorandumService.findAllMinorsCountForIntermediate(documentRef, versionVO.getCmisVersionNumber());
            versionVO.setSubVersions(VersionsUtil.buildVersionVO(this.memorandumService.findAllMinorsForIntermediate(documentRef, versionVO.getCmisVersionNumber(), 0, count), messageHelper));
        }
        return versions;
    }

    @Override
    public List<TocItem> getTocItems(String documentRef) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        this.setStructureContext(memorandum.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.structureContext.get().getTocItems();
    }

    @Override
    public List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        Memorandum newVersion = this.memorandumService.createVersion(memorandum.getId(), versionType, checkInComment);
        return this.memorandumService.getAllVersions(memorandum.getId(), documentRef);
    }

    @Override
    public List<TableOfContentItemVO> saveToC(String documentRef, List<TableOfContentItemVO> toc) throws MethodNotSupportedException {
        throw new MethodNotSupportedException("Save toc method not allowed for Memorandum type document");
    }

    @Override
    public List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase, boolean completeWords) throws Exception {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        List<SearchMatchVO> matches = Collections.emptyList();
        matches = searchService.searchText(getContent(memorandum), searchText, matchCase, completeWords);
        return matches;
    }

    @Override
    public DocumentViewResponse showVersion(String versionId) {
        final Memorandum memorandum = memorandumService.findMemorandumVersion(versionId);
        final String versionContent = documentContentService.getDocumentAsHtml(memorandum, "", securityContext.getPermissions(memorandum));
        VersionInfoVO versionInfo = this.documentViewService.getVersionInfo(memorandum);
        return new DocumentViewResponse(null, versionContent, versionInfo);
    }

    @Override
    public String compare(String newVersionId, String oldVersionId) {
        Memorandum oldVersion = memorandumService.findMemorandumVersion(oldVersionId);
        Memorandum newVersion = memorandumService.findMemorandumVersion(newVersionId);
        return comparisonDelegate.getMarkedContent(oldVersion, newVersion);
    }

    @Override
    public DocumentViewResponse restoreToVersion(String documentRef, String versionId) {
        return null;
    }

    @Override
    public EditElementResponse editElement(String documentRef, String elementId, String elementTagName) {
        Memorandum bill = this.memorandumService.findMemorandumByRef(documentRef);
        String jsonAlternatives = "";
        try {
            String element = this.elementProcessor.getElement(bill, elementTagName, elementId);
            return new EditElementResponse(
                    elementId, elementTagName, element, jsonAlternatives);
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
    public byte[] downloadXmlVersionFiles(String documentRef, String versionId) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        final Memorandum chosenDocument = memorandumService.findMemorandumVersion(versionId);
        final String fileName = chosenDocument.getMetadata().get().getRef() + "_v" + chosenDocument.getVersionLabel() + ".xml";
        LOG.info("Downloaded file {}, in {} milliseconds ({} sec)", fileName, stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        return chosenDocument.getContent().get().getSource().getBytes();
    }

    @Override
    public byte[] replaceAllTextInDocument(ReplaceAllMatchRequest event) throws Exception {

        Memorandum memorandum = this.memorandumService.findMemorandumByRef(event.getDocumentRef());
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(getContent(memorandum), event.getSearchText(), event.isCaseSensitive(), event.isCompleteWords());
        byte[] updatedContent = searchService.replaceText(
                getContent(memorandum),
                event.getSearchText(),
                event.getReplaceText(),
                searchMatchVOS);

        return updatedContent;
    }

    @Override
    public byte[] replaceOneTextInDocument(ReplaceMatchRequest event) throws Exception {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(event.getDocumentRef());
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(getContent(memorandum), event.getSearchText(), event.isCaseSensitive(), event.isCompleteWords());
        byte[] updatedContent = searchService.replaceText(
                getContent(memorandum),
                event.getSearchText(),
                event.getReplaceText(),
                Arrays.asList(searchMatchVOS.get(event.getMatchIndex())));

        return updatedContent;
    }

    @Override
    public DocumentViewResponse saveAfterReplace(SaveAfterReplaceRequest event) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(event.getDocumentRef());
        Memorandum updateMemorandum = memorandumService.updateMemorandum(memorandum, event.getUpdatedContent().getBytes(),
                VersionType.MINOR, messageHelper.getMessage("operation.search.replace.updated"));
        return this.documentViewService.getDocumentView(updateMemorandum);
    }

    @Override
    public DocumentConfigResponse getDocumentConfig(String documentRef) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        this.setStructureContext(memorandum.getMetadata().getOrError(() -> "Memorandum metadata is required!").getDocTemplate());
        List<TocItem> tocItems = this.structureContext.get().getTocItems();
        List<LeosMetadata> documentsMetadata = packageService.getDocumentsMetadata(memorandum.getId());

        return new DocumentConfigResponse(
                documentsMetadata, null, tocItems, null, StructureConfigUtils.getNumberingConfigsFromTocItem(null, tocItems, XmlHelper.POINT),
                getArticleTypesAttributes(tocItems), memorandum.getMetadata().get().getRef()
        );
    }

    private byte[] doDownloadVersion(String documentRef, boolean isWithFilteredAnnotations, String annotations) throws Exception {
        try {
            Stopwatch stopwatch = Stopwatch.createStarted();
            final Memorandum currentDocument = memorandumService.findMemorandumByRef(documentRef);

            LeosPackage leosPackage = packageService.findPackageByDocumentId(currentDocument.getId());
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
                try {
                    this.createDocumentPackageForExport(exportOptions);
                } catch (Exception e) {
                    LOG.error("Unexpected error occurred while using ExportService", e);
                }
            }
            LOG.info("The actual version of Memorandum {} downloaded in {} milliseconds ({} sec)", currentDocument.getName(),
                    stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while using ExportService", e);
        }
        return null;
    }

    private byte[] getContent(Memorandum memorandum) {
        final Content content = memorandum.getContent().getOrError(() -> "Annex content is required!");
        return content.getSource().getBytes();
    }


    private void setStructureContext(String docTemplate) {
        this.structureContext.get().useDocumentTemplate(docTemplate);
    }

    private String getProposalRef(String documentId) {
        LeosPackage leosPackage = packageService.findPackageByDocumentId(documentId);
        Proposal proposal = this.proposalService.findProposalByPackagePath(leosPackage.getPath());
        return proposal.getMetadata().getOrNull().getRef();
    }

    private void populateCloneProposalMetadata(Proposal proposal) {
        if (proposal != null && proposal.isClonedProposal()) {
            byte[] xmlContent = proposal.getContent().get().getSource().getBytes();
            CloneProposalMetadataVO cloneProposalMetadataVO = proposalService.getClonedProposalMetadata(xmlContent);
            cloneContext.setCloneProposalMetadataVO(cloneProposalMetadataVO);
        }
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

}
