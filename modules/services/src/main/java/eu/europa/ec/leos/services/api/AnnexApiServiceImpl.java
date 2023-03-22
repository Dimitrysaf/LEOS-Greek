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
import eu.europa.ec.leos.domain.cmis.common.VersionType;
import eu.europa.ec.leos.domain.cmis.document.Annex;
import eu.europa.ec.leos.domain.cmis.document.Proposal;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.annex.AnnexStructureType;
import eu.europa.ec.leos.model.annex.LevelItemVO;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.collection.document.BillContextService;
import eu.europa.ec.leos.services.compare.ContentComparatorService;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.AnnexService;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.processor.AnnexProcessor;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.services.search.SearchService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.support.VersionsUtil;
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.inject.Provider;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static eu.europa.ec.leos.model.annex.AnnexStructureType.ARTICLE;
import static eu.europa.ec.leos.services.support.XmlHelper.NUM;

public class AnnexApiServiceImpl implements AnnexApiService {
    private static final Logger LOG = LoggerFactory.getLogger(ApiServiceImpl.class);
    private Provider<StructureContext> structureContext;
    @Autowired
    AnnexService annexService;
    @Autowired
    AnnexProcessor annexProcessor;
    @Autowired
    ElementProcessor<Annex> elementProcessor;
    @Autowired
    SearchService searchService;
    @Autowired
    MessageHelper messageHelper;
    @Autowired
    DocumentContentService documentContentService;
    @Autowired
    SecurityContext securityContext;
    @Autowired
    ContentComparatorService compareService;
    @Autowired
    DocumentViewService<Annex> documentViewService;
    @Autowired
    PackageService packageService;
    @Autowired
    ProposalService proposalService;
    @Autowired
    ComparisonDelegateAPI<Annex> comparisonDelegate;
    @Autowired
    ExportService exportService;
    private Provider<CloneContext> cloneContext;
    protected Provider<BillContextService> contex;


    AnnexApiServiceImpl(Provider<StructureContext> structureContext, Provider<CloneContext> cloneContext, Provider<BillContextService> context) {
        this.structureContext = structureContext;
        this.cloneContext = cloneContext;
        this.contex = context;
    }

    @Override
    public String getElement(String documentRef, String elementName, String elementId) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        String element = this.elementProcessor.getElement(annex, elementName, elementId);
        return element;
    }

    @Override
    public DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) throws Exception {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        byte[] updatedXmlContent = this.annexProcessor.deleteAnnexBlock(annex, elementId, elementName);
        annex = annexService.updateAnnex(annex, updatedXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.annex.block.deleted"));
        // TODO : to be added  DocumentUpdatedByCoEditorEvent
        return documentViewService.getDocumentView(annex);

    }

    @Override
    public DocumentViewResponse saveElement(String documentRef, String elementId, String elementName, String elementContent) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        byte[] updatedXmlContent = annexProcessor.updateAnnexBlock(annex, elementId, elementName, elementContent);

        //TODO add splitted content functionality since
        annex = annexService.updateAnnex(annex, updatedXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.annex.block.updated"));
        return documentViewService.getDocumentView(annex);
    }

    @Override
    public DocumentViewResponse insertElement(String documentRef, String elementName, String elementId, Position position) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        byte[] updatedXmlContent = this.annexProcessor.insertAnnexBlock(annex, elementId, elementName, position.equals(Position.BEFORE));
        annex = annexService.updateAnnex(annex, updatedXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.annex.block.inserted"));

        // TODO : to be added  DocumentUpdatedByCoEditorEvent
        return documentViewService.getDocumentView(annex);
    }

    @Override
    public DocumentViewResponse mergeElement(String documentRef, String elementContent, String elementTag, String elementId) throws Exception {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        Element mergeOnElement = annexProcessor.getMergeOnElement(annex, elementContent, elementTag, elementId);
        byte[] updatedXmlContent = null;
        if (mergeOnElement != null) {
            updatedXmlContent = annexProcessor.mergeElement(annex, elementContent, elementTag, elementId);
            annex = annexService.updateAnnex(annex, updatedXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.element.updated", org.apache.commons.lang3.StringUtils.capitalize(elementTag)));
            LOG.info("Element '{}' merged into '{}' in Annex {} id {})", elementId, mergeOnElement.getElementId(), annex.getName(), annex.getId());
        }
        return documentViewService.getDocumentView(annex);
    }

    @Override
    public List<VersionVO> getRecentMinorVersions(String documentRef) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        Integer recentCount = this.annexService.findRecentMinorVersionsCount(annex.getId(), documentRef);
        List<Annex> annexes = this.annexService.findRecentMinorVersions(annex.getId(), documentRef, 0, recentCount);
        List<VersionVO> recentChanges = VersionsUtil.buildVersionVO(annexes, messageHelper);
        return recentChanges;

    }

    @Override
    public List<VersionVO> getVersionsData(String documentRef) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        List<VersionVO> versions = this.annexService.getAllVersions(annex.getId(), documentRef);
        for (VersionVO versionVO : versions) {
            int count = this.annexService.findAllMinorsCountForIntermediate(documentRef, versionVO.getCmisVersionNumber());
            versionVO.setSubVersions(VersionsUtil.buildVersionVO(this.annexService.findAllMinorsForIntermediate(documentRef, versionVO.getCmisVersionNumber(), 0, count), messageHelper));
        }
        return versions;
    }

    @Override
    public List<TocItem> getTocItems(String documentRef) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.structureContext.get().getTocItems();
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef, TocMode mode) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.annexService.getTableOfContent(annex, mode);
    }

    @Override
    public DocumentViewResponse getDocument(String documentRef) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        return this.documentViewService.getDocumentView(annex);
    }

    @Override
    public List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        Annex newVersion = this.annexService.createVersion(annex.getId(), versionType, checkInComment);
        return this.getVersionsData(documentRef);
    }

    @Override
    public List<TableOfContentItemVO> saveToC(String documentRef, List<TableOfContentItemVO> toc) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        AnnexStructureType structureType = getStructureType();
        Annex updatedAnnex = annexService.saveTableOfContent(annex, toc, structureType, messageHelper.getMessage("operation.toc.updated"), securityContext.getUser());
        return this.annexService.getTableOfContent(updatedAnnex, TocMode.SIMPLIFIED);
    }

    @Override
    public List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase, boolean completeWords) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        List<SearchMatchVO> matches = Collections.emptyList();
        try {
            matches = searchService.searchText(getContent(annex), searchText, matchCase, completeWords);
        } catch (Exception e) {
            LOG.error("couldn't fetch results");
        }
        return matches;
    }

    @Override
    public DocumentViewResponse showVersion(String versionId) {
        Annex annex = this.annexService.findAnnexVersion(versionId);
        final String versionContent = documentContentService.getDocumentAsHtml(annex,
                "",
                securityContext.getPermissions(annex));
        VersionInfoVO versionInfoVO = this.documentViewService.getVersionInfo(annex);
        return new DocumentViewResponse(null, versionContent, versionInfoVO);
    }

    @Override
    public String compare(String newVersionId, String oldVersionId) {
        Annex oldVersion = annexService.findAnnexVersion(oldVersionId);
        Annex newVersion = annexService.findAnnexVersion(newVersionId);
        String comparedContent = comparisonDelegate.getMarkedContent(oldVersion, newVersion);
        return comparedContent;
    }

    @Override
    public DocumentViewResponse restoreToVersion(String documentRef, String versionId) {
        Annex version = annexService.findAnnexVersion(versionId);
        Annex annex = annexService.findAnnexByRef(documentRef);
        byte[] resultXmlContent = getContent(version);
        Annex updatedAnnex = annexService.updateAnnex(annex, resultXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.restore.version", version.getVersionLabel()));
        return this.documentViewService.getDocumentView(updatedAnnex);
    }

    @Override
    public EditElementResponse editElement(String documentRef, String elementId, String elementTagName) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        try {
            LevelItemVO levelItemVO = new LevelItemVO();
            String element = elementProcessor.getElement(annex, elementTagName, elementId);
            if (AnnexStructureType.LEVEL.getType().equalsIgnoreCase(elementTagName)
                    || NUM.equalsIgnoreCase(elementTagName)) {
                levelItemVO = annexProcessor.getLevelItemVO(annex, elementId, elementTagName);
            }
            return new EditElementResponse(elementId, elementTagName, element, levelItemVO);
        } catch (Exception ex) {
            LOG.error("Exception while edit element operation for ", ex);
            throw new RuntimeException(ex);
        }
    }

    @Override
    public byte[] downloadVersion(String documentRef, boolean isWithAnnotations) throws Exception {
        return null;
    }

    @Override
    public byte[] downloadXmlVersionFiles(String documentRef, String versionId) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        final Annex chosenDocument = annexService.findAnnexVersion(versionId);
        final String fileName = chosenDocument.getMetadata().get().getRef() + "_v" + chosenDocument.getVersionLabel() + ".xml";
        LOG.info("Downloaded file {}, in {} milliseconds ({} sec)", fileName, stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        return chosenDocument.getContent().get().getSource().getBytes();
    }

    @Override
    public byte[] replaceAllTextInDocument(ReplaceAllMatchRequest event) throws Exception {
        Annex annex = annexService.findAnnexByRef(event.getDocumentRef());
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(getContent(annex), event.getSearchText(), event.isCaseSensitive(), event.isCompleteWords());
        byte[] updatedContent = searchService.replaceText(
                getContent(annex),
                event.getSearchText(),
                event.getReplaceText(),
                searchMatchVOS);
        return updatedContent;
    }

    @Override
    public byte[] replaceOneTextInDocument(ReplaceMatchRequest event) throws Exception {
        Annex annex = this.annexService.findAnnexByRef(event.getDocumentRef());
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(getContent(annex), event.getSearchText(), event.isCaseSensitive(), event.isCompleteWords());
        byte[] updatedContent = searchService.replaceText(
                getContent(annex),
                event.getSearchText(),
                event.getReplaceText(),
                Arrays.asList(searchMatchVOS.get(event.getMatchIndex())));

        return updatedContent;
    }

    @Override
    public DocumentViewResponse saveAfterReplace(SaveAfterReplaceRequest event) {
        Annex annex = this.annexService.findAnnexByRef(event.getDocumentRef());

        Annex updateAnnex = annexService.updateAnnex(annex, event.getUpdatedContent().getBytes(),
                VersionType.MINOR, messageHelper.getMessage("operation.search.replace.updated"));
        return this.documentViewService.getDocumentView(updateAnnex);
    }

    protected void populateCloneProposalMetadata(Proposal proposal) {
        if (proposal != null && proposal.isClonedProposal()) {
            byte[] xmlContent = proposal.getContent().get().getSource().getBytes();
            CloneProposalMetadataVO cloneProposalMetadataVO = proposalService.getClonedProposalMetadata(xmlContent);
            cloneContext.get().setCloneProposalMetadataVO(cloneProposalMetadataVO);
        }
    }

    private byte[] getContent(Annex annex) {
        final Content content = annex.getContent().getOrError(() -> "Annex content is required!");
        return content.getSource().getBytes();
    }

    private AnnexStructureType getStructureType() {
        List<TocItem> tocItems = structureContext.get().getTocItems().stream().
                filter(tocItem -> (tocItem.getAknTag().value().equalsIgnoreCase(AnnexStructureType.LEVEL.getType()) ||
                        tocItem.getAknTag().value().equalsIgnoreCase(ARTICLE.getType()))).collect(Collectors.toList());
        return AnnexStructureType.valueOf(tocItems.get(0).getAknTag().value().toUpperCase());
    }

    private void setStructureContext(String docTemplate) {
        this.structureContext.get().useDocumentTemplate(docTemplate);
    }

    protected void createDocumentPackageForExport(ExportOptions exportOptions) throws Exception {
        final String proposalId = this.getContextProposalId();
        if (proposalId != null) {
            final String jobFileName = "Proposal_" + proposalId + "_AKN2DW_" + System.currentTimeMillis() + ".zip";
            exportService.createDocumentPackage(jobFileName, proposalId, exportOptions, securityContext.getUser());
        }
    }

    private String getContextProposalId() {
        return contex.get().getProposalId();
    }

    protected boolean isClonedProposal() {
        return cloneContext != null && cloneContext.get().isClonedProposal();
    }

}
