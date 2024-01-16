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
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.ActionType;
import eu.europa.ec.leos.model.action.CheckinCommentVO;
import eu.europa.ec.leos.model.action.CheckinElement;
import eu.europa.ec.leos.model.action.TrackChangeActionType;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.annex.AnnexStructureType;
import eu.europa.ec.leos.model.annex.LevelItemVO;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMapHelper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.collection.document.AnnexContextService;
import eu.europa.ec.leos.services.collection.document.BillContextService;
import eu.europa.ec.leos.services.collection.document.ContextActionService;
import eu.europa.ec.leos.services.compare.ContentComparatorService;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.AnnexService;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.CheckinCommentUtil;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.SaveElementResponse;
import eu.europa.ec.leos.services.dto.response.TocAndAncestorsResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.export.ExportDW;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.export.ExportVersions;
import eu.europa.ec.leos.services.export.FileHelper;
import eu.europa.ec.leos.services.processor.AnnexProcessor;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import eu.europa.ec.leos.services.processor.TrackChangesProcessor;
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
import eu.europa.ec.leos.services.user.UserHelper;
import eu.europa.ec.leos.vo.toc.NumberingConfig;
import eu.europa.ec.leos.vo.toc.StructureConfigUtils;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import io.atlassian.fugue.Pair;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import javax.inject.Provider;
import java.nio.charset.StandardCharsets;
import java.rmi.UnexpectedException;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static eu.europa.ec.leos.model.annex.AnnexStructureType.ARTICLE;
import static eu.europa.ec.leos.services.support.XmlHelper.NUM;

public class AnnexApiServiceImpl implements AnnexApiService {
    private static final Logger LOG = LoggerFactory.getLogger(AnnexApiServiceImpl.class);
    private static final String ANNEX_METADATA_IS_REQUIRED = "Annex metadata is required!";
    private static final String PROPOSAL = "Proposal_";
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
    TrackChangesProcessor<Annex> trackChangesProcessor;
    @Autowired
    GenericDocumentApiService genericDocumentApiService;
    @Autowired
    PackageService packageService;
    @Autowired
    ProposalService proposalService;
    @Autowired
    ComparisonDelegateAPI<Annex> comparisonDelegate;
    @Autowired
    ExportService exportService;
    @Autowired
    UserHelper userHelper;
    @Autowired
    LegService legService;
    @Autowired
    TemplateConfigurationService templateConfigurationService;
    @Autowired
    LeosPermissionAuthorityMapHelper leosPermissionAuthorityMapHelper;
    @Autowired
    RepositoryPropertiesMapper repositoryPropertiesMapper;
    @Autowired
    @Qualifier("applicationProperties")
    private Properties applicationProperties;
    private Provider<CloneContext> cloneContext;
    private Provider<AnnexContextService> annexContext;
    protected Provider<BillContextService> contex;
    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
            .withZone(ZoneId.systemDefault());


    AnnexApiServiceImpl(Provider<StructureContext> structureContext, Provider<CloneContext> cloneContext,
                        Provider<BillContextService> context, Provider<AnnexContextService> annexContext) {
        this.structureContext = structureContext;
        this.cloneContext = cloneContext;
        this.contex = context;
        this.annexContext = annexContext;
    }

    @Override
    public String getElement(String documentRef, String elementName, String elementId) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        populateCloneProposalMetadata(annex);
        return this.elementProcessor.getElement(annex, elementName, elementId);
    }

    @Override
    public DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) throws Exception {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> ANNEX_METADATA_IS_REQUIRED).getDocTemplate());
        populateCloneProposalMetadata(annex);
        byte[] updatedXmlContent = this.annexProcessor.deleteAnnexBlock(annex, elementId, elementName);
        annex = annexService.updateAnnex(annex, updatedXmlContent, VersionType.MINOR,
                messageHelper.getMessage("operation.annex.block.deleted"));
        // TO DO : to be added  DocumentUpdatedByCoEditorEvent
        return documentViewService.updateDocumentView(annex);

    }

    @Override
    public SaveElementResponse saveElement(String documentRef, String elementId, String elementName,
                                           String elementContent, boolean isSplit) throws Exception {
        Annex annex = this.annexService.findAnnexByRef(documentRef);

        if (annex == null) {
            throw new UnexpectedException("Annex not found");
        }

        this.setStructureContext(annex.getMetadata().getOrError(() -> ANNEX_METADATA_IS_REQUIRED).getDocTemplate());
        this.populateCloneProposalMetadata(annex);
        byte[] updatedXmlContent = annexProcessor.updateAnnexBlock(annex, elementId, elementName, elementContent);
        boolean splittedContentIsEmpty = false;
        Element elementToEditAfterClose = null;
        Pair<byte[], Element> splittedContent = null;

        if (isSplit && checkIfCloseElementEditor(elementName, elementContent)) {
            splittedContent = annexProcessor.getSplittedElement(updatedXmlContent, elementContent, elementName, elementId);
            if (splittedContent != null) {
                elementToEditAfterClose = splittedContent.right();
                if (splittedContent.left() != null) {
                    updatedXmlContent = splittedContent.left();
                }
            }
        }
        annex = annexService.updateAnnex(annex, updatedXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.annex.block.updated"));
        String newContent = elementProcessor.getElement(annex, elementName, elementId);
        if (splittedContent == null) {
            splittedContentIsEmpty = true;
        }
        return new SaveElementResponse(elementId, elementName, newContent, elementToEditAfterClose, splittedContentIsEmpty);
    }

    @Override
    public DocumentViewResponse insertElement(String documentRef, String elementName, String elementId,
                                              Position position) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> ANNEX_METADATA_IS_REQUIRED).getDocTemplate());
        populateCloneProposalMetadata(annex);
        byte[] updatedXmlContent = this.annexProcessor.insertAnnexBlock(annex, elementId, elementName,
                position.equals(Position.BEFORE));
        annex = annexService.updateAnnex(annex, updatedXmlContent, VersionType.MINOR,
                messageHelper.getMessage("operation.annex.block.inserted"));

        // TO DO : to be added  DocumentUpdatedByCoEditorEvent
        return documentViewService.updateDocumentView(annex);
    }

    @Override
    public DocumentViewResponse mergeElement(String documentRef, String elementContent, String elementTag,
                                             String elementId) throws Exception {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> ANNEX_METADATA_IS_REQUIRED).getDocTemplate());
        populateCloneProposalMetadata(annex);
        Element mergeOnElement = annexProcessor.getMergeOnElement(annex, elementContent, elementTag, elementId);
        byte[] updatedXmlContent = null;
        if (mergeOnElement != null) {
            updatedXmlContent = annexProcessor.mergeElement(annex, elementContent, elementTag, elementId);
            annex = annexService.updateAnnex(annex, updatedXmlContent, VersionType.MINOR,
                    messageHelper.getMessage("operation.element.updated",
                            org.apache.commons.lang3.StringUtils.capitalize(elementTag)));
            LOG.info("Element '{}' merged into '{}' in Annex {} id {})", elementId, mergeOnElement.getElementId(),
                    annex.getName(), annex.getId());
        }
        return documentViewService.updateDocumentView(annex);
    }

    @Override
    public List<TocItem> getTocItems(@NotNull String documentRef) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        StructureContext context = this.structureContext.get();
        context.useDocumentTemplate(annex.getMetadata().getOrError(() -> ANNEX_METADATA_IS_REQUIRED).getDocTemplate());
        populateCloneProposalMetadata(annex);
        return context.getTocItems();
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef, TocMode mode) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        populateCloneProposalMetadata(annex);
        this.setStructureContext(annex.getMetadata().getOrError(() -> ANNEX_METADATA_IS_REQUIRED).getDocTemplate());
        return this.annexService.getTableOfContent(annex, mode);
    }

    @Override
    public DocumentViewResponse getDocument(@NotNull String documentRef) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        return this.documentViewService.getDocumentView(annex);
    }

    @Override
    public List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        populateCloneProposalMetadata(annex);
        this.annexService.createVersion(annex.getId(), versionType, checkInComment);
        return this.genericDocumentApiService.getMajorVersionsData(documentRef, 0, 1);
    }

    @Override
    public List<TableOfContentItemVO> saveToC(String documentRef, List<TableOfContentItemVO> toc) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        StructureContext structureContext1 = structureContext.get();
        structureContext1.useDocumentTemplate(
                annex.getMetadata().getOrError(() -> ANNEX_METADATA_IS_REQUIRED).getDocTemplate());
        populateCloneProposalMetadata(annex);
        AnnexStructureType structureType = getStructureType(structureContext1);
        Annex updatedAnnex = annexService.saveTableOfContent(annex, toc, structureType,
                messageHelper.getMessage("operation.toc.updated"), securityContext.getUser());
        return this.annexService.getTableOfContent(updatedAnnex, TocMode.SIMPLIFIED);
    }

    @Override
    public DocumentViewResponse showVersion(String versionId) {
        Annex annex = this.annexService.findAnnexVersion(versionId);
        final String versionContent = documentContentService.getDocumentAsHtml(annex,
                "",
                securityContext.getPermissions(annex));
        VersionInfoVO versionInfoVO = this.documentViewService.getVersionInfo(annex);
        return new DocumentViewResponse(null, versionContent, versionInfoVO,
                null, null);
    }

    @Override
    public String compare(String newVersionId, String oldVersionId) {
        Annex oldVersion = annexService.findAnnexVersion(oldVersionId);
        Annex newVersion = annexService.findAnnexVersion(newVersionId);
        return comparisonDelegate.getMarkedContent(oldVersion, newVersion);
    }

    @Override
    public DocumentViewResponse restoreToVersion(String documentRef, String versionId) {
        Annex version = annexService.findAnnexVersion(versionId);
        Annex annex = annexService.findAnnexByRef(documentRef);
        byte[] resultXmlContent = getContent(version);
        Annex updatedAnnex = annexService.updateAnnex(annex, resultXmlContent, VersionType.MINOR,
                messageHelper.getMessage("operation.restore.version", version.getVersionLabel()));
        return this.documentViewService.updateDocumentView(updatedAnnex);
    }

    @Override
    public EditElementResponse editElement(String documentRef, String elementId, String elementTagName) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        populateCloneProposalMetadata(annex);
        try {
            LevelItemVO levelItemVO = new LevelItemVO();
            String element = elementProcessor.getElement(annex, elementTagName, elementId);
            if (AnnexStructureType.LEVEL.getType().equalsIgnoreCase(elementTagName)
                    || NUM.equalsIgnoreCase(elementTagName)) {
                levelItemVO = annexProcessor.getLevelItemVO(annex, elementId, elementTagName);
            }
            String[] permissions = leosPermissionAuthorityMapHelper.getPermissionsForRoles(
                    securityContext.getUser().getRoles());
            User user = securityContext.getUser();
            boolean isClonedProposal = !annex.getClonedFrom().isEmpty();
            return new EditElementResponse(user, permissions, elementId, elementTagName, element, levelItemVO,
                    isClonedProposal);
        } catch (Exception ex) {
            throw new RuntimeException("Exception while edit element operation for ", ex);
        }
    }

    @Override
    public byte[] downloadVersion(String documentRef, boolean isWithAnnotations) throws Exception {
        //implemented on ProposalAnnexServiceImpl & MandateAnnexServiceImpl
        return null;
    }

    @Override
    public byte[] downloadCleanVersion(String documentRef) {
        byte[] cleanVersion = new byte[0];
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        Stopwatch stopwatch = Stopwatch.createStarted();
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(annex.getMetadata().get().getRef(),
                Annex.class);
        contex.get().usePackage(leosPackage);
        Proposal proposal = this.documentViewService.getProposalFromPackage(annex);
        String proposalId = proposal.getId();
        if (isClonedProposal()) {
            try {
                final String jobFileName =
                        PROPOSAL + proposalId + "_AKN2LW_CLEAN_" + System.currentTimeMillis() + ".docx";
                ExportOptions exportOptions = new ExportLW(ExportOptions.Output.PDF, Annex.class, false, true);
                exportOptions.setExportVersions(new ExportVersions(null, annex));
                exportService.createDocumentPackage(jobFileName, proposalId, exportOptions, securityContext.getUser());
            } catch (Exception e) {
                LOG.error("Unexpected error occurred while using ExportService", e);
            }
        } else {
            try {
                final String jobFileName =
                        PROPOSAL + proposalId + "_AKN2DW_CLEAN_" + System.currentTimeMillis() + ".docx";
                ExportOptions exportOptions = new ExportDW(ExportOptions.Output.WORD, Annex.class, false, true);
                exportOptions.setExportVersions(new ExportVersions<Annex>(null, annex));
                cleanVersion = exportService.createDocuWritePackage(
                        FileHelper.getReplacedExtensionFilename(jobFileName, "zip"), proposalId, exportOptions);
            } catch (Exception e) {
                LOG.error("Unexpected error occurred while using ExportService", e);
            }
        }
        LOG.info("The actual version of CLEANED Annex for proposal {}, downloaded in {} milliseconds ({} sec)",
                proposalId, stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        return cleanVersion;
    }

    @Override
    public DocumentViewResponse showCleanVersion(String documentRef) {
        final Annex annex = this.annexService.findAnnexByRef(documentRef);
        final String versionContent = documentContentService.getCleanDocumentAsHtml(annex, "",
                securityContext.getPermissions(annex));
        VersionInfoVO versionInfoVO = this.documentViewService.getVersionInfo(annex);
        return new DocumentViewResponse(versionContent, versionInfoVO);
    }

    @Override
    public byte[] downloadXmlVersionFiles(String documentRef, String versionId) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        final Annex chosenDocument = annexService.findAnnexVersion(versionId);
        final String fileName =
                chosenDocument.getMetadata().get().getRef() + "_v" + chosenDocument.getVersionLabel() + ".xml";
        LOG.info("Downloaded file {}, in {} milliseconds ({} sec)", fileName, stopwatch.elapsed(TimeUnit.MILLISECONDS),
                stopwatch.elapsed(TimeUnit.SECONDS));
        return chosenDocument.getContent().get().getSource().getBytes();
    }

    @Override
    public List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase,
                                                    boolean completeWords, String tempUpdatedContentXML) {
        List<SearchMatchVO> matches = Collections.emptyList();
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        byte[] contentForReplace = getContentForReplaceProcess(tempUpdatedContentXML, annex);

        try {
            matches = searchService.searchTextForHighlight(contentForReplace, searchText, matchCase, completeWords);
        } catch (Exception e) {
            LOG.error("couldn't fetch results");
        }
        return matches;
    }

    @Override
    public byte[] replaceAllTextInDocument(ReplaceAllMatchRequest event) throws Exception {
        Annex annex = this.annexService.findAnnexByRef(event.getDocumentRef());
        byte[] contentForReplace = getContentForReplaceProcess(event.getTempUpdatedContentXML(), annex);
        populateCloneProposalMetadata(annex);

        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(contentForReplace, event.getSearchText(),
                event.isCaseSensitive(), event.isCompleteWords());
        return searchService.replaceText(
                contentForReplace,
                event.getSearchText(),
                event.getReplaceText(),
                searchMatchVOS,
                annex.isTrackChangesEnabled());
    }

    @Override
    public byte[] replaceOneTextInDocument(ReplaceMatchRequest event) throws Exception {
        Annex annex = this.annexService.findAnnexByRef(event.getDocumentRef());
        byte[] contentForReplace = getContentForReplaceProcess(event.getTempUpdatedContentXML(), annex);
        populateCloneProposalMetadata(annex);
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(contentForReplace, event.getSearchText(),
                event.isCaseSensitive(), event.isCompleteWords());
        return searchService.replaceText(
                contentForReplace,
                event.getSearchText(),
                event.getReplaceText(),
                Arrays.asList(searchMatchVOS.get(event.getMatchIndex())),
                annex.isTrackChangesEnabled());

    }

    @Override
    public DocumentViewResponse saveAfterReplace(SaveAfterReplaceRequest event) {
        Annex annex = this.annexService.findAnnexByRef(event.getDocumentRef());
        populateCloneProposalMetadata(annex);
        Annex updateAnnex = annexService.updateAnnex(annex, event.getUpdatedContent().getBytes(StandardCharsets.UTF_8),
                VersionType.MINOR, messageHelper.getMessage("operation.search.replace.updated"));
        return this.documentViewService.updateDocumentView(updateAnnex);
    }

    @Override
    public DocumentConfigResponse getDocumentConfig(String documentRef) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        StructureContext context = structureContext.get();
        context.useDocumentTemplate(annex.getMetadata().getOrError(() -> ANNEX_METADATA_IS_REQUIRED).getDocTemplate());
        populateCloneProposalMetadata(annex);
        List<TocItem> tocItems = context.getTocItems();
        List<NumberingConfig> numberConfigs = context.getNumberingConfigs();
        List<LeosMetadata> documentsMetadata = packageService.getDocumentsMetadata(annex.getMetadata().get().getRef());
        Proposal proposal = this.documentViewService.getProposalFromPackage(annex);

        return new DocumentConfigResponse(
                documentsMetadata, numberConfigs, tocItems, null,
                StructureConfigUtils.getNumberingConfigsFromTocItem(numberConfigs, tocItems, XmlHelper.POINT),
                getArticleTypesAttributes(tocItems), annex.getMetadata().get().getRef(),
                proposal.getMetadata().getOrNull(), context.getTocRules(),
                annex.isTrackChangesEnabled(), true, proposal.isClonedProposal()
        );
    }

    @Override
    public DocumentViewResponse changeAnnexStructureType(String documentRef) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        StructureContext structureContext1 = structureContext.get();
        structureContext1.useDocumentTemplate(
                annex.getMetadata().getOrError(() -> ANNEX_METADATA_IS_REQUIRED).getDocTemplate());
        AnnexStructureType currAnnexStructureType = getStructureType(structureContext1);
        AnnexStructureType newAnnexStructureType = (currAnnexStructureType.equals(AnnexStructureType.LEVEL))
                ? AnnexStructureType.ARTICLE
                : AnnexStructureType.LEVEL;
        String template = applicationProperties.getProperty(
                "leos.annex." + newAnnexStructureType.getType() + ".template");
        structureContext1.useDocumentTemplate(template);
        AnnexContextService service = annexContext.get();
        service.useTemplate(template);
        service.useAnnexId(annex.getId());
        service.useActionMessage(ContextActionService.ANNEX_STRUCTURE_UPDATED,
                messageHelper.getMessage("operation.annex.switch." + newAnnexStructureType.getType() + ".structure"));
        service.executeUpdateAnnexStructure();
        Annex updatedAnnex = this.annexService.findAnnexByRef(documentRef);
        return this.documentViewService.updateDocumentView(updatedAnnex);
    }

    @Override
    public DocumentViewResponse renumberAnnex(String documentRef) {

        Stopwatch stopwatch = Stopwatch.createStarted();
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        StructureContext context = structureContext.get();

        context.useDocumentTemplate(annex.getMetadata().getOrError(() -> ANNEX_METADATA_IS_REQUIRED).getDocTemplate());
        populateCloneProposalMetadata(annex);
        AnnexStructureType structureType = getStructureType(context);
        final byte[] newXmlContent = annexProcessor.renumberDocument(annex, structureType);

        final String title = messageHelper.getMessage("operation.element.document_renumbered");
        final String description = messageHelper.getMessage("operation.checkin.minor");
        final CheckinCommentVO checkinComment = new CheckinCommentVO(title, description,
                new CheckinElement(ActionType.DOCUMENT_RENUMBERED));
        final String checkinCommentJson = CheckinCommentUtil.getJsonObject(checkinComment);
        Annex updateAnnex = annexService.updateAnnex(annex, newXmlContent, checkinCommentJson);

        LOG.info("Renumbering document executed, in {} milliseconds ({} sec)", stopwatch.elapsed(TimeUnit.MILLISECONDS),
                stopwatch.elapsed(TimeUnit.SECONDS));
        return this.documentViewService.updateDocumentView(updateAnnex);
    }

    @Override
    public String fetchUserGuidance(String documentRef) {
        // KLUGE temporary hack for compatibility with new domain model
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        return templateConfigurationService.getTemplateConfiguration(annex.getMetadata().get().getDocTemplate(),
                "guidance");
    }

    @Override
    public DocumentViewResponse acceptChange(String documentRef, String elementId, String elementTagName, TrackChangeActionType trackChangeAction, String presenterId) throws Exception {
        String op = "accepted";
        String msg = "operation.element.annex.track.change." + trackChangeAction.getTrackChangeAction() + "." + op;

        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> ANNEX_METADATA_IS_REQUIRED).getDocTemplate());
        this.populateCloneProposalMetadata(annex);
        Proposal proposal = this.documentViewService.getProposalFromPackage(annex);
        populateCloneProposalMetadata(proposal);
        byte[] newXmlContent = trackChangesProcessor.acceptChange(annex, elementId, trackChangeAction);
        newXmlContent = annexProcessor.renumberingAndPostProcessing(newXmlContent);
        annex = annexService.updateAnnex(annex, newXmlContent, VersionType.MINOR, messageHelper.getMessage(msg));

        trackChangesProcessor.handleCoEdition(newXmlContent, documentRef, elementId, elementTagName, trackChangeAction, presenterId, true);
        return documentViewService.updateDocumentView(annex);
    }

    @Override
    public DocumentViewResponse rejectChange(String documentRef, String elementId, String elementTagName, TrackChangeActionType trackChangeAction, String presenterId) throws Exception {
        String op = "rejected";
        String msg = "operation.element.annex.track.change." + trackChangeAction.getTrackChangeAction() + "." + op;

        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> ANNEX_METADATA_IS_REQUIRED).getDocTemplate());
        this.populateCloneProposalMetadata(annex);

        byte[] newXmlContent = trackChangesProcessor.rejectChange(annex, elementId, trackChangeAction);
        newXmlContent = annexProcessor.renumberingAndPostProcessing(newXmlContent);
        annex = annexService.updateAnnex(annex, newXmlContent, VersionType.MINOR, messageHelper.getMessage(msg));

        trackChangesProcessor.handleCoEdition(newXmlContent, documentRef, elementId, elementTagName, trackChangeAction, presenterId, false);
        return documentViewService.updateDocumentView(annex);
    }

    @Override
    public TocAndAncestorsResponse fetchTocAncestor(String documentRef, List<String> elementIds) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        StructureContext context = structureContext.get();
        context.useDocumentTemplate(annex.getMetadata().getOrError(() -> ANNEX_METADATA_IS_REQUIRED).getDocTemplate());
        populateCloneProposalMetadata(annex);
        List<String> elementAncestorsIds = null;
        if (CollectionUtils.isNotEmpty(elementIds)) {
            try {
                elementAncestorsIds = annexService.getAncestorsIdsForElementId(annex, elementIds);
            } catch (Exception e) {
                LOG.warn("Could not get ancestors Ids", e);
            }
        }
        // we are combining two operations (get toc + get selected element ancestors)
        final Map<String, List<TableOfContentItemVO>> tocItemList = packageService.getTableOfContent(
                annex.getMetadata().get().getRef(),
                TocMode.SIMPLIFIED_CLEAN);
        return new TocAndAncestorsResponse(tocItemList, elementAncestorsIds, messageHelper,
                context.getNumberingConfigs());
    }

    @Override
    public boolean toggleTrackChangeEnabled(boolean isTrackChangeEnabled, String documentRef) {
        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED),
                isTrackChangeEnabled);
        String documentId = annexService.findAnnexByRef(documentRef).getId();
        Annex annex = annexService.updateAnnex(documentRef, documentId, properties, false);
        return true;
    }


    protected void populateCloneProposalMetadata(XmlDocument document) {
        CloneProposalMetadataVO cloneProposalMetadataVO = this.proposalService.getClonedProposalMetadata(
                this.getContent(document));
        this.cloneContext.get().setCloneProposalMetadataVO(cloneProposalMetadataVO);
    }

    private AnnexStructureType getStructureType(StructureContext context) {
        List<TocItem> tocItems = context.getTocItems().stream().
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
            final String jobFileName = PROPOSAL + proposalId + "_AKN2DW_" + System.currentTimeMillis() + ".zip";
            exportService.createDocumentPackage(jobFileName, proposalId, exportOptions, securityContext.getUser());
        }
    }

    private String getContextProposalId() {
        return contex.get().getProposalId();
    }

    protected boolean isClonedProposal() {
        return cloneContext != null && cloneContext.get().isClonedProposal();
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
