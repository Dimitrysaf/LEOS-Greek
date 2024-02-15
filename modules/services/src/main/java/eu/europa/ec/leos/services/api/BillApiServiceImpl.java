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
import com.google.common.eventbus.Subscribe;
import com.sun.istack.NotNull;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.BillMetadata;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.ActionType;
import eu.europa.ec.leos.model.action.CheckinCommentVO;
import eu.europa.ec.leos.model.action.CheckinElement;
import eu.europa.ec.leos.model.action.TrackChangeActionType;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMapHelper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.collection.document.BillContextService;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.TransformationService;
import eu.europa.ec.leos.services.document.models.DocType;
import eu.europa.ec.leos.services.document.util.CheckinCommentUtil;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.request.ImportElementRequest;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.SaveElementResponse;
import eu.europa.ec.leos.services.dto.response.TocAndAncestorsResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.exception.ImportElementException;
import eu.europa.ec.leos.services.export.ExportDW;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.export.ExportVersions;
import eu.europa.ec.leos.services.export.FileHelper;
import eu.europa.ec.leos.services.importoj.ImportService;
import eu.europa.ec.leos.services.label.ReferenceLabelService;
import eu.europa.ec.leos.services.processor.BillProcessor;
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
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.services.template.TemplateConfigurationService;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import eu.europa.ec.leos.services.user.UserHelper;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.vo.structure.AlternateConfig;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.vo.structure.RefConfig;
import eu.europa.ec.leos.vo.structure.TocItem;
import eu.europa.ec.leos.vo.toc.StructureConfigUtils;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import io.atlassian.fugue.Pair;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.inject.Provider;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.rmi.UnexpectedException;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class BillApiServiceImpl implements BillApiService {

    private static final String BILL_METADATA_IS_REQUIRED = "Bill metadata is required!";
    private static final String PROPOSAL = "Proposal_";
    private static final String OPERATION_CHECKIN_MINOR = "operation.checkin.minor";
    @Autowired
    BillService billService;
    @Autowired
    DocumentViewService<Bill> documentViewService;
    @Autowired
    BillProcessor billProcessor;
    @Autowired
    MessageHelper messageHelper;
    @Autowired
    ReferenceLabelService referenceLabelService;
    @Autowired
    SearchService searchService;
    @Autowired
    DocumentContentService documentContentService;
    @Autowired
    SecurityContext securityContext;
    @Autowired
    TrackChangesContext trackChangesContext;
    @Autowired
    ComparisonDelegateAPI<Bill> comparisonDelegate;

    @Autowired
    UserHelper userHelper;
    @Autowired
    UserService userService;
    @Autowired
    ElementProcessor<Bill> elementProcessor;
    @Autowired
    TrackChangesProcessor<Bill> trackChangesProcessor;
    @Autowired
    TemplateConfigurationService templateConfigurationService;
    @Autowired
    PackageService packageService;
    @Autowired
    ProposalService proposalService;
    @Autowired
    ExportService exportService;
    @Autowired
    ImportService importService;
    @Autowired
    TransformationService transformationService;
    @Autowired
    LegService legService;
    @Autowired
    GenericDocumentApiService genericDocumentApiService;
    @Autowired
    LeosPermissionAuthorityMapHelper leosPermissionAuthorityMapHelper;
    @Autowired
    RepositoryPropertiesMapper repositoryPropertiesMapper;

    private Provider<CloneContext> cloneContext;
    protected Provider<BillContextService> contex;
    private static final String LEOS_ALTERNATIVE_ATTR = "leos:alternative";
    private static final Logger LOG = LoggerFactory.getLogger(BillApiServiceImpl.class);

    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
            .withZone(ZoneId.systemDefault());

    private Provider<StructureContext> structureContext;

    BillApiServiceImpl(Provider<StructureContext> structureContext, Provider<CloneContext> cloneContext,
                       Provider<BillContextService> context) {
        this.structureContext = structureContext;
        this.cloneContext = cloneContext;
        this.contex = context;
    }

    @Override
    public DocumentViewResponse getDocument(@NotNull String documentRef) {
        Bill bill = this.billService.findBillByRef(documentRef);
        return documentViewService.getDocumentView(bill);
    }

    @Override
    public List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType) {
        Bill bill = this.billService.findBillByRef(documentRef);
        billService.createVersion(bill.getId(), versionType, checkInComment);
        return this.genericDocumentApiService.getMajorVersionsData(documentRef, 0, 1);
    }

    @Override
    public List<TableOfContentItemVO> saveToC(String documentRef, List<TableOfContentItemVO> toc) {
        Bill bill = this.billService.findBillByRef(documentRef);
        User user = securityContext.getUser();
        this.setStructureContext(bill.getMetadata().getOrError(() -> BILL_METADATA_IS_REQUIRED).getDocTemplate());
        this.populateCloneProposalMetadata(bill);
        Bill updatedBill = this.billService.saveTableOfContent(bill, toc,
                messageHelper.getMessage("operation.toc.updated"), user);
        documentViewService.updateProposalAsync(bill);
        return billService.getTableOfContent(updatedBill, TocMode.SIMPLIFIED);
    }

    @Override
    public List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase,
                                                    boolean completeWords, String tempUpdatedContentXML)
            throws Exception {
        Bill bill = this.billService.findBillByRef(documentRef);
        byte[] contentForReplace = getContentForReplaceProcess(tempUpdatedContentXML, bill);

        return searchService.searchTextForHighlight(contentForReplace, searchText, matchCase, completeWords);
    }

    @Override
    public DocumentViewResponse showVersion(String versionId) {
        Bill bill = this.billService.findBillVersion(versionId);
        final String versionContent = documentContentService.getDocumentAsHtml(bill,
                "",
                securityContext.getPermissions(bill));
        VersionInfoVO versionInfoVO = this.documentViewService.getVersionInfo(bill);
        return new DocumentViewResponse(null, versionContent, versionInfoVO, null, null);
    }

    @Override
    public String compare(String newVersionId, String oldVersionId) {
        Bill oldVersion = billService.findBillVersion(oldVersionId);
        Bill newVersion = billService.findBillVersion(newVersionId);
        return comparisonDelegate.getMarkedContent(oldVersion, newVersion);
    }

    @Override
    public DocumentViewResponse restoreToVersion(String documentRef, String versionId) {
        Bill targetVersion = billService.findBillVersion(versionId);
        Bill sourceVersion = billService.findBillByRef(documentRef);
        byte[] resultXmlContent = getContent(targetVersion);
        Bill updatedBill = billService.updateBill(sourceVersion, resultXmlContent,
                messageHelper.getMessage("operation.restore.version", targetVersion.getVersionLabel()));
        return this.documentViewService.updateDocumentView(updatedBill);
    }

    @Override
    public EditElementResponse editElement(String documentRef, String elementId, String elementTagName) {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> BILL_METADATA_IS_REQUIRED).getDocTemplate());
        String jsonAlternatives = "";
        boolean isClonedProposal = !bill.getClonedFrom().isEmpty();
        try {
            String element = elementProcessor.getElement(bill, elementTagName, elementId);
            String alternateAttrVal = elementProcessor.getElementAttributeValueByNameAndId(bill, LEOS_ALTERNATIVE_ATTR,
                    elementTagName, elementId);
            if (alternateAttrVal != null && alternateAttrVal.equalsIgnoreCase("true")) {
                jsonAlternatives = templateConfigurationService.getTemplateConfiguration(
                        bill.getMetadata().get().getDocTemplate(), "alternatives");
            }

            String[] permissions = leosPermissionAuthorityMapHelper.getPermissionsForRoles(
                    securityContext.getUser().getRoles());
            User user = securityContext.getUser();
            return new EditElementResponse(user, permissions,
                    elementId, elementTagName, element, jsonAlternatives, isClonedProposal);
        } catch (Exception ex) {
            LOG.error("Exception while edit element operation for ", ex);
            throw new RuntimeException(ex);
        }
    }

    @Override
    public byte[] downloadVersion(String documentRef, boolean isWithAnnotations) throws Exception {
        //implemented on ProposalBillServiceImpl and MandateBillServiceImpl
        return null;
    }

    @Override
    public byte[] downloadCleanVersion(String documentRef) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        byte[] cleanVersion = new byte[0];
        Bill bill = this.billService.findBillByRef(documentRef);
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(bill.getMetadata().get().getRef(),
                Bill.class);
        contex.get().usePackage(leosPackage);
        Proposal proposal = this.documentViewService.getProposalFromPackage(bill);
        String proposalId = proposal.getId();
        if (isClonedProposal()) {
            try {
                final String jobFileName =
                        PROPOSAL + proposalId + "_AKN2LW_CLEAN_" + System.currentTimeMillis() + ".zip";
                ExportOptions exportOptions = new ExportLW(ExportOptions.Output.PDF, Bill.class, false, true);
                exportOptions.setExportVersions(new ExportVersions(null, bill));
                exportService.createDocumentPackage(jobFileName, proposalId, exportOptions, securityContext.getUser());
            } catch (Exception e) {
                LOG.error("Unexpected error occurred while using ExportService", e);
            }
        } else {
            try {
                final String jobFileName =
                        PROPOSAL + proposalId + "_AKN2DW_CLEAN_" + System.currentTimeMillis() + ".docx";
                ExportOptions exportOptions = new ExportDW(ExportOptions.Output.WORD, Bill.class, false, true);
                cleanVersion = exportService.createDocuWritePackage(
                        FileHelper.getReplacedExtensionFilename(jobFileName, "zip"), proposalId, exportOptions);
            } catch (Exception e) {
                LOG.error("Unexpected error occurred while using ExportService", e);
            }
        }
        LOG.info("The actual version of CLEANED Bill for proposal {}, downloaded in {} milliseconds ({} sec)",
                proposalId, stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        return cleanVersion;
    }

    @Subscribe
    public DocumentViewResponse showCleanVersion(String documentRef) {
        final Bill bill = billService.findBillByRef(documentRef);
        final String versionContent = documentContentService.getCleanDocumentAsHtml(bill, "",
                securityContext.getPermissions(bill));
        VersionInfoVO versionInfoVO = this.documentViewService.getVersionInfo(bill);
        return new DocumentViewResponse(versionContent, versionInfoVO);
    }

    @Override
    public byte[] downloadXmlVersionFiles(String documentRef, String versionId) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        final Bill chosenDocument = billService.findBillVersion(versionId);
        final String fileName =
                chosenDocument.getMetadata().get().getRef() + "_v" + chosenDocument.getVersionLabel() + ".xml";
        LOG.info("Downloaded file {}, in {} milliseconds ({} sec)", fileName, stopwatch.elapsed(TimeUnit.MILLISECONDS),
                stopwatch.elapsed(TimeUnit.SECONDS));
        return chosenDocument.getContent().get().getSource().getBytes();
    }

    @Override
    public byte[] replaceAllTextInDocument(ReplaceAllMatchRequest event) throws Exception {
        Bill bill = this.billService.findBillByRef(event.getDocumentRef());
        byte[] contentForReplace = getContentForReplaceProcess(event.getTempUpdatedContentXML(), bill);

        populateCloneProposalMetadata(bill);
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(contentForReplace, event.getSearchText(),
                event.isCaseSensitive(), event.isCompleteWords());
        return searchService.replaceText(
                contentForReplace,
                event.getSearchText(),
                event.getReplaceText(),
                searchMatchVOS,
                bill.isTrackChangesEnabled());

    }

    @Override
    public byte[] replaceOneTextInDocument(ReplaceMatchRequest event) throws Exception {
        Bill bill = this.billService.findBillByRef(event.getDocumentRef());

        byte[] contentForReplace = getContentForReplaceProcess(event.getTempUpdatedContentXML(), bill);
        populateCloneProposalMetadata(bill);
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(contentForReplace, event.getSearchText(),
                event.isCaseSensitive(), event.isCompleteWords());
        return searchService.replaceText(
                contentForReplace,
                event.getSearchText(),
                event.getReplaceText(),
                Arrays.asList(searchMatchVOS.get(event.getMatchIndex())),
                bill.isTrackChangesEnabled());
    }

    @Override
    public DocumentViewResponse saveAfterReplace(SaveAfterReplaceRequest event) {
        Bill bill = this.billService.findBillByRef(event.getDocumentRef());
        String comment = messageHelper.getMessage("operation.search.replace.updated");
        Bill updateBill = billService.updateBill(bill, event.getUpdatedContent().getBytes(StandardCharsets.UTF_8),
                comment);
        return this.documentViewService.updateDocumentView(updateBill);
    }

    @Override
    public DocumentConfigResponse getDocumentConfig(String documentRef) {
        Bill bill = this.billService.findBillByRef(documentRef);
        StructureContext structure = structureContext.get();
        structure.useDocumentTemplate(bill.getMetadata().getOrError(() -> BILL_METADATA_IS_REQUIRED).getDocTemplate());
        List<TocItem> tocItems = structure.getTocItems();
        List<NumberingConfig> numberConfigs = structure.getNumberingConfigs();
        List<AlternateConfig> alternateConfigs = structure.getAlternateConfigs();
        List<RefConfig> refConfigs = structure.getRefConfigs();
        List<LeosMetadata> documentsMetadata = packageService.getDocumentsMetadata(bill.getMetadata().get().getRef());
        Proposal proposal = this.documentViewService.getProposalFromPackage(bill);

        return new DocumentConfigResponse(
                documentsMetadata, numberConfigs, tocItems, alternateConfigs, refConfigs,
                StructureConfigUtils.getNumberingConfigsFromTocItem(numberConfigs, tocItems, XmlHelper.POINT),
                getArticleTypesAttributes(tocItems), bill.getMetadata().get().getRef(),
                proposal.getMetadata().getOrNull(), structure.getTocRules(),
                bill.isTrackChangesEnabled(), true, proposal.isClonedProposal()
        );
    }

    @Override
    public String fetchUserGuidance(String documentRef) {
        // KLUGE temporary hack for compatibility with new domain model
        Bill bill = this.billService.findBillByRef(documentRef);
        return templateConfigurationService.getTemplateConfiguration(bill.getMetadata().get().getDocTemplate(),
                "guidance");
    }

    @Override
    public DocumentViewResponse acceptChange(String documentRef, String elementId, String elementTagName, TrackChangeActionType trackChangeAction, String presenterId) throws Exception {
        String op = "accepted";
        String msg = "operation.element.track.change." + trackChangeAction.getTrackChangeAction() + "." + op;

        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> BILL_METADATA_IS_REQUIRED).getDocTemplate());
        this.populateCloneProposalMetadata(bill);

        byte[] newXmlContent = trackChangesProcessor.acceptChange(bill, elementId, trackChangeAction);
        newXmlContent = billProcessor.renumberingAndPostProcessing(newXmlContent);

        final String updatedLabel = generateLabel(elementId, bill);
        final String comment = messageHelper.getMessage(msg, updatedLabel);
        bill = billService.updateBill(bill, newXmlContent, comment);

        trackChangesProcessor.handleCoEdition(newXmlContent, documentRef, elementId, elementTagName, trackChangeAction, presenterId, true);
        return documentViewService.updateDocumentView(bill);
    }

    @Override
    public DocumentViewResponse rejectChange(String documentRef, String elementId, String elementTagName, TrackChangeActionType trackChangeAction, String presenterId) throws Exception {
        String op = "rejected";
        String msg = "operation.element.track.change." + trackChangeAction.getTrackChangeAction() + "." + op;

        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> BILL_METADATA_IS_REQUIRED).getDocTemplate());
        this.populateCloneProposalMetadata(bill);

        byte[] newXmlContent = trackChangesProcessor.rejectChange(bill, elementId, trackChangeAction);
        newXmlContent = billProcessor.renumberingAndPostProcessing(newXmlContent);

        final String updatedLabel = generateLabel(elementId, bill);
        final String comment = messageHelper.getMessage(msg, updatedLabel);
        bill = billService.updateBill(bill, newXmlContent, comment);

        trackChangesProcessor.handleCoEdition(newXmlContent, documentRef, elementId, elementTagName, trackChangeAction, presenterId, false);
        return documentViewService.updateDocumentView(bill);
    }

    @Override
    public boolean toggleTrackChangeEnabled(boolean isTrackChangeEnabled, String documentRef) {
        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED),
                isTrackChangeEnabled);
        String documentId = billService.findBillByRef(documentRef).getId();
        Bill bill = billService.updateBill(documentRef, documentId, properties, false);
        return true;
    }

    @Override
    public String searchForImport(Integer number, Integer year, DocType type) {
        try {
            String aknDocument = importService.getAknDocument(type.getValue(), year, number);
            if (aknDocument != null) {
                return getImportXml(aknDocument);
            } else {
                return null;
            }
        } catch (Exception e) {
            LOG.error("Unable to perform searchAct operation", e);
            throw new ImportElementException("Search returned with no result! Please modify the search parameters");
        }
    }

    @Override
    public DocumentViewResponse importElements(String documentRef, ImportElementRequest importElementRequest)
            throws ImportElementException {
        List<String> elementIds = importElementRequest.getElementIds();
        String aknDocument = importService.getAknDocument(importElementRequest.getType().getValue(),
                Integer.parseInt(importElementRequest.getYear()),
                Integer.parseInt(importElementRequest.getNumber()));
        if (aknDocument != null) {
            Bill bill = billService.findBillByRef(documentRef);
            this.setStructureContext(bill.getMetadata().getOrError(() -> BILL_METADATA_IS_REQUIRED).getDocTemplate());
            BillMetadata metadata = bill.getMetadata().getOrError(() -> "Bill metadata is required");
            byte[] newXmlContent = importService.insertSelectedElements(bill,
                    aknDocument.getBytes(StandardCharsets.UTF_8), elementIds,
                    metadata.getLanguage());
            String notificationMsg =
                    "document.import.element.inserted" + (elementIds.stream().anyMatch(s -> s.startsWith("rec_"))
                            ? ".recitals" : "") +
                            (elementIds.stream().anyMatch(s -> s.startsWith("art_")) ? ".articles" : "");
            String operationMessage = messageHelper.getMessage("operation.import.element.inserted");
            bill = billService.updateBill(bill, newXmlContent, operationMessage);
            return this.documentViewService.updateDocumentView(bill);
        } else {
            throw new ImportElementException("Search returned with no result! Please modify the search parameters");
        }
    }

    @Override
    public TocAndAncestorsResponse fetchTocAncestor(String documentRef, List<String> elementIds) {
        Bill bill = billService.findBillByRef(documentRef);
        List<String> elementAncestorsIds = null;
        StructureContext context = structureContext.get();
        context.useDocumentTemplate(bill.getMetadata().getOrError(() -> BILL_METADATA_IS_REQUIRED).getDocTemplate());
        if (CollectionUtils.isNotEmpty(elementIds)) {
            try {
                elementAncestorsIds = billService.getAncestorsIdsForElementId(bill, elementIds);
            } catch (Exception e) {
                LOG.warn("Could not get ancestors Ids", e);
            }
        }
        // we are combining two operations (get toc + get selected element ancestors)
        final Map<String, List<TableOfContentItemVO>> tocItemList = packageService.getTableOfContent(
                bill.getMetadata().get().getRef(), TocMode.SIMPLIFIED_CLEAN);
        return new TocAndAncestorsResponse(tocItemList, elementAncestorsIds, messageHelper,
                context.getNumberingConfigs());
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef, TocMode tocMode) {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> BILL_METADATA_IS_REQUIRED).getDocTemplate());
        return this.billService.getTableOfContent(bill, tocMode);
    }

    @Override
    public String getElement(String documentRef, String elementName, String elementId) {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> BILL_METADATA_IS_REQUIRED).getDocTemplate());
        this.populateCloneProposalMetadata(bill);
        return this.elementProcessor.getElement(bill, elementName, elementId);
    }

    @Override
    public DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) throws Exception {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> BILL_METADATA_IS_REQUIRED).getDocTemplate());
        this.populateCloneProposalMetadata(bill);
        final byte[] newXmlContent = billProcessor.deleteElement(bill, elementId, elementName, null);

        final String updatedLabel = generateLabel(elementId, bill);
        final String comment = messageHelper.getMessage("operation.element.deleted", updatedLabel);
        bill = billService.updateBill(bill, newXmlContent, comment);

        return documentViewService.updateDocumentView(bill);
    }

    @Override
    public DocumentViewResponse renumberBill(String documentRef) {

        Stopwatch stopwatch = Stopwatch.createStarted();
        final Bill bill = this.billService.findBillByRef(documentRef);

        this.setStructureContext(bill.getMetadata().getOrError(() -> BILL_METADATA_IS_REQUIRED).getDocTemplate());
        this.populateCloneProposalMetadata(bill);
        final byte[] newXmlContent = billProcessor.renumberDocument(bill);
        final String title = messageHelper.getMessage("operation.element.document_renumbered");
        final String description = messageHelper.getMessage(OPERATION_CHECKIN_MINOR);
        final CheckinCommentVO checkinComment = new CheckinCommentVO(title, description,
                new CheckinElement(ActionType.DOCUMENT_RENUMBERED));
        final String checkinCommentJson = CheckinCommentUtil.getJsonObject(checkinComment);

        Bill updatedBill = billService.updateBill(bill, newXmlContent, checkinCommentJson);

        LOG.info("Renumbering document executed, in {} milliseconds ({} sec)", stopwatch.elapsed(TimeUnit.MILLISECONDS),
                stopwatch.elapsed(TimeUnit.SECONDS));
        return this.documentViewService.updateDocumentView(updatedBill);
    }

    private String generateLabel(String reference, XmlDocument sourceDocument) {
        final byte[] sourceXmlContent = sourceDocument.getContent().get().getSource().getBytes();
        Result<String> updatedLabel = referenceLabelService.generateLabelStringRef(Arrays.asList(reference),
                sourceDocument.getMetadata().get().getRef(), sourceXmlContent);
        return updatedLabel.get();
    }

    @Override
    public SaveElementResponse saveElement(String documentRef, String elementId, String elementName,
                                           String elementFragment, boolean isSplit) throws Exception {
        Bill bill = this.billService.findBillByRef(documentRef);

        if (bill == null) {
            throw new UnexpectedException("Bill not found");
        }

        this.setStructureContext(bill.getMetadata().getOrError(() -> BILL_METADATA_IS_REQUIRED).getDocTemplate());
        this.populateCloneProposalMetadata(bill);
        byte[] newXmlContent = billProcessor.updateElement(bill, elementName, elementId, elementFragment);
        if (newXmlContent == null) {
            throw new UnexpectedException("Error updating bill");
        }

        boolean splittedContentIsEmpty = false;
        Element elementToEditAfterClose = null;

        newXmlContent = billProcessor.renumberingAndPostProcessing(newXmlContent, true);
        final String title = messageHelper.getMessage("operation.element.updated", StringUtils.capitalize(elementName));
        final String description = messageHelper.getMessage(OPERATION_CHECKIN_MINOR);
        final String elementLabel = generateLabel(elementId, bill);
        final CheckinCommentVO checkinComment = new CheckinCommentVO(title, description,
                new CheckinElement(ActionType.UPDATED, elementId, elementName, elementLabel));
        final String checkinCommentJson = CheckinCommentUtil.getJsonObject(checkinComment);
        Pair<byte[], Element> splittedContent = null;
        if (isSplit && checkIfCloseElementEditor(elementName, elementFragment)) {
            splittedContent = billProcessor.getSplittedElement(newXmlContent, elementFragment, elementName, elementId);
            if (splittedContent != null) {
                elementToEditAfterClose = splittedContent.right();
                if (splittedContent.left() != null) {
                    newXmlContent = splittedContent.left();
                }
            }
        }
        Bill updatedBill = billService.updateBill(bill, newXmlContent, checkinCommentJson);
        String newContent = elementProcessor.getElement(updatedBill, elementName, elementId);
        if (splittedContent == null) {
            splittedContentIsEmpty = true;
        }

        return new SaveElementResponse(elementId, elementName, newContent, elementToEditAfterClose, splittedContentIsEmpty);
    }

    @Override
    public DocumentViewResponse insertElement(String documentRef, String elementName, String elementId,
                                              Position position) {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> BILL_METADATA_IS_REQUIRED).getDocTemplate());
        this.populateCloneProposalMetadata(bill);
        byte[] updatedXmlContent = this.billProcessor.insertNewElement(bill, elementId,
                position.equals(Position.BEFORE), elementName);
        final String title = messageHelper.getMessage("operation.element.inserted",
                StringUtils.capitalize(elementName));
        final String description = messageHelper.getMessage(OPERATION_CHECKIN_MINOR);
        final String elementLabel = "";
        final CheckinCommentVO checkinComment = new CheckinCommentVO(title, description,
                new CheckinElement(ActionType.INSERTED, elementId, elementName, elementLabel));
        final String checkinCommentJson = CheckinCommentUtil.getJsonObject(checkinComment);
        bill = billService.updateBill(bill, updatedXmlContent, checkinCommentJson);
        // TODO : to be added  DocumentUpdatedByCoEditorEvent
        return this.documentViewService.updateDocumentView(bill);
    }

    @Override
    public DocumentViewResponse mergeElement(String documentRef, String elementContent, String elementTag,
                                             String elementId) throws Exception {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> "Bill metadata is required").getDocTemplate());
        Element mergeOnElement = billProcessor.getMergeOnElement(bill, elementContent, elementTag, elementId);
        byte[] updatedXmlContent = null;
        if (mergeOnElement != null) {
            updatedXmlContent = billProcessor.mergeElement(bill, elementContent, elementTag, elementId);
            bill = billService.updateBill(bill, updatedXmlContent, messageHelper.getMessage("operation.element.updated",
                    org.apache.commons.lang3.StringUtils.capitalize(elementTag)));
            if (bill != null) {
                LOG.info("Element '{}' merged into '{}' in Bill {} id {})", elementId, mergeOnElement.getElementId(),
                        bill.getName(), bill.getId());
                return this.documentViewService.updateDocumentView(bill);
            }
        } else {
            throw new Exception("mergeOnElement is null");
        }
        return this.documentViewService.updateDocumentView(bill);
    }

    @Override
    public List<TocItem> getTocItems(@NotNull String documentRef) {
        Bill bill = this.billService.findBillByRef(documentRef);
        StructureContext structureContext1 = structureContext.get();
        structureContext1.useDocumentTemplate(
                bill.getMetadata().getOrError(() -> BILL_METADATA_IS_REQUIRED).getDocTemplate());
        return structureContext1.getTocItems();
    }

    private String getImportXml(String content) {
        return transformationService.toImportXml(
                new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8)),
                "", securityContext.getPermissions(content));
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

    protected void populateCloneProposalMetadata(XmlDocument document) {
        CloneProposalMetadataVO cloneProposalMetadataVO = this.proposalService.getClonedProposalMetadata(
                this.getContent(document));
        this.cloneContext.get().setCloneProposalMetadataVO(cloneProposalMetadataVO);
        this.trackChangesContext.setTrackChangesEnabled(document.isTrackChangesEnabled());
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

    private VersionInfoVO getVersionInfo(XmlDocument document) {
        String userId = document.getLastModifiedBy();
        User user = userHelper.getUser(userId);

        return new VersionInfoVO(
                document.getVersionLabel(),
                user.getName(), user.getDefaultEntity() != null ? user.getDefaultEntity().getOrganizationName() : "",
                dateFormatter.format(document.getLastModificationInstant()),
                document.getVersionType());
    }


}
