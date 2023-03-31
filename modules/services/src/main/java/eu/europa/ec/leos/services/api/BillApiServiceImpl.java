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
import com.google.common.eventbus.Subscribe;
import eu.europa.ec.leos.domain.cmis.Content;
import eu.europa.ec.leos.domain.cmis.LeosPackage;
import eu.europa.ec.leos.domain.cmis.common.VersionType;
import eu.europa.ec.leos.domain.cmis.document.Annex;
import eu.europa.ec.leos.domain.cmis.document.Bill;
import eu.europa.ec.leos.domain.cmis.document.Memorandum;
import eu.europa.ec.leos.domain.cmis.document.Proposal;
import eu.europa.ec.leos.domain.cmis.document.XmlDocument;
import eu.europa.ec.leos.domain.cmis.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.ActionType;
import eu.europa.ec.leos.model.action.CheckinCommentVO;
import eu.europa.ec.leos.model.action.CheckinElement;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.annex.AnnexStructureType;
import eu.europa.ec.leos.model.messaging.UpdateInternalReferencesMessage;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.model.xml.Element;
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
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.ShowCleanVersionResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
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
import eu.europa.ec.leos.services.user.UserHelperAPI;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.vo.toc.AlternateConfig;
import eu.europa.ec.leos.vo.toc.Attribute;
import eu.europa.ec.leos.vo.toc.NumberingConfig;
import eu.europa.ec.leos.vo.toc.StructureConfigUtils;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import eu.europa.ec.leos.vo.toc.TocItemType;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.inject.Provider;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class BillApiServiceImpl implements BillApiService {

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
    ComparisonDelegateAPI<Bill> comparisonDelegate;

    @Autowired
    UserHelperAPI userHelper;
    @Autowired
    UserService userService;
    @Autowired
    ElementProcessor<Bill> elementProcessor;
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

    private Provider<CloneContext> cloneContext;
    protected Provider<BillContextService> contex;
    private static final String LEOS_ALTERNATIVE_ATTR = "leos:alternative";
    private static final Logger LOG = LoggerFactory.getLogger(BillApiService.class);

    private final static DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(ZoneId.systemDefault());

    private Provider<StructureContext> structureContext;

    BillApiServiceImpl(Provider<StructureContext> structureContext, Provider<CloneContext> cloneContext, Provider<BillContextService> context) {
        this.structureContext = structureContext;
        this.cloneContext = cloneContext;
        this.contex = context;
    }

    @Override
    public DocumentViewResponse getDocument(String documentRef) {
        Bill bill = this.billService.findBillByRef(documentRef);
        return documentViewService.getDocumentView(bill);
    }

    @Override
    public List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType) {
        Bill annex = this.billService.findBillByRef(documentRef);
        Bill newVersion = this.billService.createVersion(annex.getId(), versionType, checkInComment);
        return this.getVersionsData(documentRef);
    }

    @Override
    public List<TableOfContentItemVO> saveToC(String documentRef, List<TableOfContentItemVO> toc) {
        Bill bill = this.billService.findBillByRef(documentRef);
        User user = securityContext.getUser();
        this.setStructureContext(bill.getMetadata().getOrError(() -> "Bill metadata is required!").getDocTemplate());
        Bill updatedBill = this.billService.saveTableOfContent(bill, toc, messageHelper.getMessage("operation.toc.updated"), user);
        return billService.getTableOfContent(updatedBill, TocMode.SIMPLIFIED);
    }

    @Override
    public List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase, boolean completeWords) throws Exception {
        Bill bill = this.billService.findBillByRef(documentRef);
        List<SearchMatchVO> matches = Collections.emptyList();
        matches = searchService.searchText(getContent(bill), searchText, matchCase, completeWords);
        return matches;
    }

    @Override
    public DocumentViewResponse showVersion(String versionId) {
        Bill bill = this.billService.findBillVersion(versionId);
        final String versionContent = documentContentService.getDocumentAsHtml(bill,
                "",
                securityContext.getPermissions(bill));
        VersionInfoVO versionInfoVO = this.documentViewService.getVersionInfo(bill);
        return new DocumentViewResponse(null, versionContent, versionInfoVO);
    }

    @Override
    public String compare(String newVersionId, String oldVersionId) {
        Bill oldVersion = billService.findBillVersion(oldVersionId);
        Bill newVersion = billService.findBillVersion(newVersionId);
        String comparedContent = comparisonDelegate.getMarkedContent(oldVersion, newVersion);
        return comparedContent;
    }

    @Override
    public DocumentViewResponse restoreToVersion(String documentRef, String versionId) {
        Bill targetVersion = billService.findBillVersion(versionId);
        Bill sourceVersion = billService.findBillByRef(documentRef);
        byte[] resultXmlContent = getContent(targetVersion);
        Bill updatedBill = billService.updateBill(sourceVersion, resultXmlContent, messageHelper.getMessage("operation.restore.version", targetVersion.getVersionLabel()));
        return this.documentViewService.getDocumentView(updatedBill);
    }

    @Override
    public EditElementResponse editElement(String documentRef, String elementId, String elementTagName) {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> "Bill metadata is required!").getDocTemplate());
        String jsonAlternatives = "";
        try {
            String element = this.elementProcessor.getElement(bill, elementTagName, elementId);
            String alternateAttrVal = elementProcessor.getElementAttributeValueByNameAndId(bill, LEOS_ALTERNATIVE_ATTR, elementTagName, elementId);
            if (alternateAttrVal != null && alternateAttrVal.equalsIgnoreCase("true")) {
                jsonAlternatives = templateConfigurationService.getTemplateConfiguration(bill.getMetadata().get().getDocTemplate(), "alternatives");
            }


            return new EditElementResponse(
                    elementId, elementTagName, element, jsonAlternatives);
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
        LeosPackage leosPackage = packageService.findPackageByDocumentId(bill.getId());
        contex.get().usePackage(leosPackage);
        Proposal proposal = this.documentViewService.getProposalFromPackage(bill);
        String proposalId = proposal.getId();
        if (isClonedProposal()) {
            try {
                final String jobFileName = "Proposal_" + proposalId + "_AKN2LW_CLEAN_" + System.currentTimeMillis() + ".zip";
                ExportOptions exportOptions = new ExportLW(ExportOptions.Output.PDF, Bill.class, false, true);
                exportOptions.setExportVersions(new ExportVersions(null, bill));
                exportService.createDocumentPackage(jobFileName, proposalId, exportOptions, securityContext.getUser());
            } catch (Exception e) {
                LOG.error("Unexpected error occurred while using ExportService", e);
            }
        } else {
            try {
                final String jobFileName = "Proposal_" + proposalId + "_AKN2DW_CLEAN_" + System.currentTimeMillis() + ".docx";
                ExportOptions exportOptions = new ExportDW(ExportOptions.Output.WORD, Bill.class, false, true);
                cleanVersion = exportService.createDocuWritePackage(FileHelper.getReplacedExtensionFilename(jobFileName, "zip"), proposalId, exportOptions);
            } catch (Exception e) {
                LOG.error("Unexpected error occurred while using ExportService", e);
            }
        }
        LOG.info("The actual version of CLEANED Bill for proposal {}, downloaded in {} milliseconds ({} sec)", proposalId, stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        return cleanVersion;
    }

    @Subscribe
    public ShowCleanVersionResponse showCleanVersion(String documentRef) {
        final Bill bill = billService.findBillByRef(documentRef);
        final String versionContent = documentContentService.getCleanDocumentAsHtml(bill, "", securityContext.getPermissions(bill));
        final String versionInfo = getVersionInfoAsString(bill);
        return new ShowCleanVersionResponse(versionContent, versionInfo);
    }

    @Override
    public byte[] downloadXmlVersionFiles(String documentRef, String versionId) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        final Bill chosenDocument = billService.findBillVersion(versionId);
        final String fileName = chosenDocument.getMetadata().get().getRef() + "_v" + chosenDocument.getVersionLabel() + ".xml";
        LOG.info("Downloaded file {}, in {} milliseconds ({} sec)", fileName, stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        return chosenDocument.getContent().get().getSource().getBytes();
//            LOG.error("Unexpected error occurred while downloadXmlVersion", e);

    }

    @Override
    public byte[] replaceAllTextInDocument(ReplaceAllMatchRequest event) throws Exception {
        Bill bill = this.billService.findBillByRef(event.getDocumentRef());
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(getContent(bill), event.getSearchText(), event.isCaseSensitive(), event.isCompleteWords());
        byte[] updatedContent = searchService.replaceText(
                getContent(bill),
                event.getSearchText(),
                event.getReplaceText(),
                searchMatchVOS);

        return updatedContent;
    }

    @Override
    public byte[] replaceOneTextInDocument(ReplaceMatchRequest event) throws Exception {
        Bill bill = this.billService.findBillByRef(event.getDocumentRef());
        List<SearchMatchVO> searchMatchVOS = this.searchService.searchText(getContent(bill), event.getSearchText(), event.isCaseSensitive(), event.isCompleteWords());
        byte[] updatedContent = searchService.replaceText(
                getContent(bill),
                event.getSearchText(),
                event.getReplaceText(),
                Arrays.asList(searchMatchVOS.get(event.getMatchIndex())));

        return updatedContent;
    }

    @Override
    public DocumentViewResponse saveAfterReplace(SaveAfterReplaceRequest event) {
        Bill bill = this.billService.findBillByRef(event.getDocumentRef());
        String comment = messageHelper.getMessage("operation.search.replace.updated");
        Bill updateBill = billService.updateBill(bill, event.getUpdatedContent().getBytes(), comment);
        return this.documentViewService.getDocumentView(updateBill);
    }

    @Override
    public DocumentConfigResponse getDocumentConfig(String documentRef) {
        Bill annex = this.billService.findBillByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> "Bill metadata is required!").getDocTemplate());
        List<TocItem> tocItems = this.structureContext.get().getTocItems();
        List<NumberingConfig> numberConfigs = this.structureContext.get().getNumberingConfigs();
        List<AlternateConfig> alternateConfigs = this.structureContext.get().getAlternateConfigs();
        List<LeosMetadata> documentsMetadata = packageService.getDocumentsMetadata(annex.getId());

        return new DocumentConfigResponse(
                documentsMetadata, numberConfigs, tocItems, alternateConfigs, StructureConfigUtils.getNumberingConfigsFromTocItem(numberConfigs, tocItems, XmlHelper.POINT),
                getArticleTypesAttributes(tocItems), annex.getMetadata().get().getRef()
        );
    }

    @Override
    public String fetchUserGuidance(String documentRef) {
        // KLUGE temporary hack for compatibility with new domain model
        Bill bill = this.billService.findBillByRef(documentRef);
        Proposal proposal = proposalService.findProposal(bill.getId(), true);
        return templateConfigurationService.getTemplateConfiguration(proposal.getMetadata().get().getDocTemplate(), "guidance");
    }

    @Override
    public String searchForImport(Integer number, Integer year, DocType type) {
        try {
            String aknDocument = importService.getAknDocument(type.getValue(), year, number);
            if (aknDocument != null) {
                String transformedAknDocument = getImportXml(aknDocument);
                return transformedAknDocument;
            } else {
                return null;
            }
        } catch (Exception e) {
            LOG.error("Unable to perform searchAct operation", e);
            return null;
        }
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef, TocMode tocMode) {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> "Bill metadata is required!").getDocTemplate());
        return this.billService.getTableOfContent(bill, tocMode);
    }

    @Override
    public String getElement(String documentRef, String elementName, String elementId) {
        Bill bill = this.billService.findBillByRef(documentRef);
        String element = this.elementProcessor.getElement(bill, elementName, elementId);
        return element;
    }

    @Override
    public DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) throws Exception {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> "Bill metadata is required!").getDocTemplate());
        final byte[] newXmlContent = billProcessor.deleteElement(bill, elementId, elementName, null);

        final String updatedLabel = generateLabel(elementId, bill);
        final String comment = messageHelper.getMessage("operation.element.deleted", updatedLabel);
        bill = billService.updateBill(bill, newXmlContent, comment);

        //leosApplicationEventBus.post(new DocumentUpdatedByCoEditorEvent(user, strDocumentVersionSeriesId, id));
        //updateInternalReferencesProducer.send(new UpdateInternalReferencesMessage(bill.getId(), bill.getMetadata().get().getRef(), id));
        return documentViewService.getDocumentView(bill);
    }

    @Override
    public DocumentViewResponse renumberBill(String documentRef) {

        Stopwatch stopwatch = Stopwatch.createStarted();
        final Bill bill = this.billService.findBillByRef(documentRef);

        final byte[] newXmlContent = billProcessor.renumberDocument(bill);

        final String title = messageHelper.getMessage("operation.element.document_renumbered");
        final String description = messageHelper.getMessage("operation.checkin.minor");
        final CheckinCommentVO checkinComment = new CheckinCommentVO(title, description, new CheckinElement(ActionType.DOCUMENT_RENUMBERED));
        final String checkinCommentJson = CheckinCommentUtil.getJsonObject(checkinComment);

        Bill updatedBill = billService.updateBill(bill, newXmlContent, checkinCommentJson);

//        updateInternalReferencesProducer.send(new UpdateInternalReferencesMessage(bill.getId(), bill.getMetadata().get().getRef(), id));
        LOG.info("Renumbering document executed, in {} milliseconds ({} sec)", stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        return this.documentViewService.getDocumentView(updatedBill);
    }

    private String generateLabel(String reference, XmlDocument sourceDocument) {
        final byte[] sourceXmlContent = sourceDocument.getContent().get().getSource().getBytes();
        Result<String> updatedLabel = referenceLabelService.generateLabelStringRef(Arrays.asList(reference), sourceDocument.getMetadata().get().getRef(), sourceXmlContent);
        return updatedLabel.get();
    }

    @Override
    public DocumentViewResponse saveElement(String documentRef, String elementId, String elementName, String elementFragment) throws Exception {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> "Bill metadata is required!").getDocTemplate());
        byte[] newXmlContent = billProcessor.updateElement(bill, elementName, elementId, elementFragment);

        final String title = messageHelper.getMessage("operation.element.updated", StringUtils.capitalize(elementName));
        final String description = messageHelper.getMessage("operation.checkin.minor");
        final String elementLabel = generateLabel(elementId, bill);
        final CheckinCommentVO checkinComment = new CheckinCommentVO(title, description, new CheckinElement(ActionType.UPDATED, elementId, elementName, elementLabel));

        final String checkinCommentJson = CheckinCommentUtil.getJsonObject(checkinComment);

        if (bill != null) {
            bill = billService.updateBill(bill, newXmlContent, checkinCommentJson);

//            Pair<byte[], Element> splittedContent = null;
//            if (event.isSplit() && checkIfCloseElementEditor(elementTagName, event.getElementContent())) {
//                splittedContent = billProcessor.getSplittedElement(newXmlContent, event.getElementContent(), elementTagName, elementId);
//                if (splittedContent != null) {
//                    elementToEditAfterClose = splittedContent.right();
//                    if (splittedContent.left() != null) {
//                        newXmlContent = splittedContent.left();
//                    }
//                    eventBus.post(new CloseElementEvent());
//                }
//            }
//            bill = billService.updateBill(bill, newXmlContent, checkinCommentJson);
//            if (splittedContent == null) {
//                String elementContent = elementProcessor.getElement(bill, elementTagName, elementId);
//                documentScreen.refreshElementEditor(elementId, elementTagName, elementContent);
//            }
//            eventBus.post(new DocumentUpdatedEvent());
//            documentScreen.scrollToMarkedChange(elementId);
//            leosApplicationEventBus.post(new DocumentUpdatedByCoEditorEvent(user, strDocumentVersionSeriesId, id));
        }
        return this.documentViewService.getDocumentView(bill);
    }

    @Override
    public DocumentViewResponse insertElement(String documentRef, String elementName, String elementId, Position position) {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        byte[] updatedXmlContent = this.billProcessor.insertNewElement(bill, elementId, position.equals(Position.BEFORE), elementName);
        final String title = messageHelper.getMessage("operation.element.inserted", StringUtils.capitalize(elementName));
        final String description = messageHelper.getMessage("operation.checkin.minor");
        final String elementLabel = "";
        final CheckinCommentVO checkinComment = new CheckinCommentVO(title, description, new CheckinElement(ActionType.INSERTED, elementId, elementName, elementLabel));
        final String checkinCommentJson = CheckinCommentUtil.getJsonObject(checkinComment);

        bill = billService.updateBill(bill, updatedXmlContent, checkinCommentJson);
        // TODO : to be added  DocumentUpdatedByCoEditorEvent
        return this.documentViewService.getDocumentView(bill);
    }

    @Override
    public DocumentViewResponse mergeElement(String documentRef, String elementContent, String elementTag, String elementId) throws Exception {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> "Bill metadata is required").getDocTemplate());
        Element mergeOnElement = billProcessor.getMergeOnElement(bill, elementContent, elementTag, elementId);
        byte[] updatedXmlContent = null;
        if (mergeOnElement != null) {
            updatedXmlContent = billProcessor.mergeElement(bill, elementContent, elementTag, elementId);
            bill = billService.updateBill(bill, updatedXmlContent, messageHelper.getMessage("operation.element.updated", org.apache.commons.lang3.StringUtils.capitalize(elementTag)));
            LOG.info("Element '{}' merged into '{}' in Bill {} id {})", elementId, mergeOnElement.getElementId(), bill.getName(), bill.getId());
            if (bill != null) {
                return this.documentViewService.getDocumentView(bill);
            }
        } else {
            LOG.info("Element '{}' merged into '{}' in Bill {} id {})", elementId, mergeOnElement.getElementId(), bill.getName(), bill.getId());
            throw new Exception();
        }
        return this.documentViewService.getDocumentView(bill);
    }

    @Override
    public List<VersionVO> getRecentMinorVersions(String documentRef) {
        Bill bill = this.billService.findBillByRef(documentRef);
        Integer recentCount = this.billService.findRecentMinorVersionsCount(bill.getId(), documentRef);
        List<Bill> bills = this.billService.findRecentMinorVersions(bill.getId(), documentRef, 0, recentCount);
        return VersionsUtil.buildVersionVO(bills, messageHelper);
    }

    @Override
    public List<VersionVO> getVersionsData(String documentRef) {
        Bill bill = this.billService.findBillByRef(documentRef);
        List<VersionVO> versions = this.billService.getAllVersions(bill.getId(), documentRef);
        for (VersionVO versionVO : versions) {
            Integer count = this.billService.findAllMinorsCountForIntermediate(documentRef, versionVO.getCmisVersionNumber());
            versionVO.setSubVersions(VersionsUtil.buildVersionVO(this.billService.findAllMinorsForIntermediate(documentRef, versionVO.getCmisVersionNumber(), 0, count), messageHelper));
        }
        return versions;
    }

    @Override
    public List<TocItem> getTocItems(String documentRef) {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.structureContext.get().getTocItems();
    }

    private String getImportXml(String content) {
        return transformationService.toImportXml(
                new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8)),
                "", securityContext.getPermissions(content));
    }


    private byte[] getContent(Bill bill) {
        final Content content = bill.getContent().getOrError(() -> "Annex content is required!");
        return content.getSource().getBytes();
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

    protected void populateCloneProposalMetadata(Proposal proposal) {
        if (proposal != null && proposal.isClonedProposal()) {
            byte[] xmlContent = proposal.getContent().get().getSource().getBytes();
            CloneProposalMetadataVO cloneProposalMetadataVO = proposalService.getClonedProposalMetadata(xmlContent);
            cloneContext.get().setCloneProposalMetadataVO(cloneProposalMetadataVO);
        }
    }

    private String getVersionInfoAsString(XmlDocument document) {
        final VersionInfoVO versionInfo = getVersionInfo(document);
        final String versionInfoString = messageHelper.getMessage(
                "document.version.caption",
                versionInfo.getDocumentVersion(),
                versionInfo.getLastModifiedBy(),
                versionInfo.getEntity(),
                versionInfo.getLastModificationInstant()
        );
        return versionInfoString;
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
