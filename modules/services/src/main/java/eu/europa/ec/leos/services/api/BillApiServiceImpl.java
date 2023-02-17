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

import eu.europa.ec.leos.domain.cmis.Content;
import eu.europa.ec.leos.domain.cmis.common.VersionType;
import eu.europa.ec.leos.domain.cmis.document.Bill;
import eu.europa.ec.leos.domain.cmis.document.XmlDocument;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.ActionType;
import eu.europa.ec.leos.model.action.CheckinCommentVO;
import eu.europa.ec.leos.model.action.CheckinElement;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.delegates.ComparisonDisplayMode;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.util.CheckinCommentUtil;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.label.ReferenceLabelService;
import eu.europa.ec.leos.services.processor.BillProcessor;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.services.search.SearchService;
import eu.europa.ec.leos.services.template.TemplateConfigurationService;
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.services.user.UserHelperAPI;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

@Service("bill")
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
    ElementProcessor<Bill> elementProcessor;
    @Autowired
    TemplateConfigurationService templateConfigurationService;
    private static final String LEOS_ALTERNATIVE_ATTR = "leos:alternative";
    private static final Logger LOG = LoggerFactory.getLogger(BillApiService.class);



    private Provider<StructureContext> structureContext;
    BillApiServiceImpl(Provider<StructureContext> structureContext) {
        this.structureContext = structureContext;
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
        return this.billService.getAllVersions(annex.getId(), documentRef);
    }

    @Override
    public List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase, boolean completeWords) throws Exception {
        Bill bill = this.billService.findBillByRef(documentRef);
        List<SearchMatchVO> matches = Collections.emptyList();
        matches = searchService.searchText(getContent(bill), searchText, matchCase, completeWords);
        return  matches;
    }

    @Override
    public DocumentViewResponse showVersion(String versionId) {
        Bill bill = this.billService.findBillVersion(versionId);
        final String versionContent = documentContentService.getDocumentAsHtml(bill,
                "",
                securityContext.getPermissions(bill));
        VersionInfoVO versionInfoVO = this.documentViewService.getVersionInfo(bill);
        return new DocumentViewResponse(null,versionContent,versionInfoVO);
    }

    @Override
    public String compare(String newVersionId, String oldVersionId) {
        final Bill oldVersion = billService.findBillVersion(oldVersionId);
        final Bill newVersion = billService.findBillVersion(newVersionId);
//        final ComparisonDisplayMode displayMode = event.getDisplayMode();
        HashMap<ComparisonDisplayMode, Object> result = comparisonDelegate.versionCompare(oldVersion, newVersion, ComparisonDisplayMode.SINGLE_COLUMN_MODE);
        return "";
    }

    @Override
    public DocumentViewResponse restoreToVersion(String documentRef, String versionId) {
        Bill targetVersion = billService.findBillVersion(versionId);
        Bill sourceVersion = billService.findBillByRef(documentRef);
        byte[] resultXmlContent = getContent(targetVersion);
        Bill updatedBill = billService.updateBill(sourceVersion,resultXmlContent,messageHelper.getMessage("operation.restore.version", targetVersion.getVersionLabel()));
        return this.documentViewService.getDocumentView(updatedBill);
    }

    @Override
    public EditElementResponse editElement(String documentRef, String elementId, String elementTagName) {
        Bill bill = this.billService.findBillByRef(documentRef);
        String jsonAlternatives = "";
        try {
            String element = this.elementProcessor.getElement(bill,elementTagName,elementId);
            String alternateAttrVal = elementProcessor.getElementAttributeValueByNameAndId(bill, LEOS_ALTERNATIVE_ATTR, elementTagName, elementId);
            if (alternateAttrVal != null && alternateAttrVal.equalsIgnoreCase("true")) {
                jsonAlternatives = templateConfigurationService.getTemplateConfiguration(bill.getMetadata().get().getDocTemplate(), "alternatives");
            }


            return new EditElementResponse(
                    elementId,elementTagName,element,jsonAlternatives);
        } catch (Exception ex) {
            LOG.error("Exception while edit element operation for ", ex);
            throw new RuntimeException(ex);
        }
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef, TocMode tocMode) {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> "Bill metadata is required!").getDocTemplate());
        return this.billService.getTableOfContent(bill, TocMode.SIMPLIFIED);
    }

    @Override
    public String getElement(String documentRef, String elementName, String elementId) {
        Bill bill = this.billService.findBillByRef(documentRef);
        String element = this.elementProcessor.getElement(bill,elementName,elementId);
        return element;
    }

    @Override
    public DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) throws Exception {
        Bill bill = this.billService.findBillByRef(documentRef);
        final byte[] newXmlContent = billProcessor.deleteElement(bill, elementId, elementName, null);

        final String updatedLabel = generateLabel(elementId, bill);
        final String comment = messageHelper.getMessage("operation.element.deleted", updatedLabel);

        bill = billService.updateBill(bill, newXmlContent, comment);

        //leosApplicationEventBus.post(new DocumentUpdatedByCoEditorEvent(user, strDocumentVersionSeriesId, id));
        //updateInternalReferencesProducer.send(new UpdateInternalReferencesMessage(bill.getId(), bill.getMetadata().get().getRef(), id));
        return documentViewService.getDocumentView(bill);
    }

    private String generateLabel(String reference, XmlDocument sourceDocument) {
        final byte[] sourceXmlContent = sourceDocument.getContent().get().getSource().getBytes();
        Result<String> updatedLabel = referenceLabelService.generateLabelStringRef(Arrays.asList(reference), sourceDocument.getMetadata().get().getRef(), sourceXmlContent);
        return updatedLabel.get();
    }

    @Override
    public DocumentViewResponse saveElement(String documentRef, String elementId, String elementName, String elementFragment) throws Exception {
        Bill bill = this.billService.findBillByRef(documentRef);
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
        Element mergeOnElement = billProcessor.getMergeOnElement(bill,elementContent,elementTag,elementId);
        byte[] updatedXmlContent = null;
        if(mergeOnElement != null) {
            updatedXmlContent = billProcessor.mergeElement(bill,elementContent,elementTag,elementId);
            bill = billService.updateBill(bill,updatedXmlContent,messageHelper.getMessage("operation.element.updated", org.apache.commons.lang3.StringUtils.capitalize(elementTag)));
            LOG.info("Element '{}' merged into '{}' in Bill {} id {})", elementId, mergeOnElement.getElementId(), bill.getName(), bill.getId());
            if(bill != null) {
                return this.documentViewService.getDocumentView(bill);
            }
        }
        else {
            LOG.info("Element '{}' merged into '{}' in Bill {} id {})", elementId, mergeOnElement.getElementId(), bill.getName(), bill.getId());
            throw new Exception();
        }
        return this.documentViewService.getDocumentView(bill);
    }

    @Override
    public List<Bill> getRecentMinorVersions(String documentRef) {
        Bill bill = this.billService.findBillByRef(documentRef);
        Integer recentCount = this.billService.findRecentMinorVersionsCount(bill.getId(), documentRef);
        return this.billService.findRecentMinorVersions(bill.getId(), documentRef, 0, recentCount);
    }

    @Override
    public List<VersionVO> getVersionsData(String documentRef) {
        Bill bill = this.billService.findBillByRef(documentRef);
        return this.billService.getAllVersions(bill.getId(),documentRef);
    }

    @Override
    public List<TocItem> getTocItems(String documentRef) {
        Bill bill = this.billService.findBillByRef(documentRef);
        this.setStructureContext(bill.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.structureContext.get().getTocItems();
    }


    private byte[] getContent(Bill bill) {
        final Content content = bill.getContent().getOrError(() -> "Annex content is required!");
        return content.getSource().getBytes();
    }


    private void setStructureContext(String docTemplate) {
        this.structureContext.get().useDocumentTemplate(docTemplate);
    }

}
