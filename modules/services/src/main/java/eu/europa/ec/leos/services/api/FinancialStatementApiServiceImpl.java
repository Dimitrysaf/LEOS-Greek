package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.ActionType;
import eu.europa.ec.leos.model.action.CheckinCommentVO;
import eu.europa.ec.leos.model.action.CheckinElement;
import eu.europa.ec.leos.model.action.TrackChangeActionType;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.services.document.FinancialStatementService;
import eu.europa.ec.leos.services.document.util.CheckinCommentUtil;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.SaveElementResponse;
import eu.europa.ec.leos.services.label.ReferenceLabelService;
import eu.europa.ec.leos.services.processor.FinancialStatementProcessor;
import eu.europa.ec.leos.services.processor.TrackChangesProcessor;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.structure.TocItem;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FinancialStatementApiServiceImpl implements FinancialStatementApiService {

    private static final String FINANCIAL_STATEMENT_METADATA_IS_REQUIRED = "Financial statement metadata is required!";
    private static final String OPERATION_CHECKIN_MINOR = "operation.checkin.minor";

    @Autowired
    FinancialStatementService financialStatementService;
    @Autowired
    RepositoryPropertiesMapper repositoryPropertiesMapper;
    @Autowired
    DocumentViewService documentViewService;
    @Autowired
    FinancialStatementProcessor financialStatementProcessor;
    @Autowired
    MessageHelper messageHelper;
    @Autowired
    ReferenceLabelService referenceLabelService;
    @Autowired
    Provider<StructureContext> structureContext;
    @Autowired
    DocumentLanguageContext documentLanguageContext;
    @Autowired
    TrackChangesProcessor<FinancialStatement> trackChangesProcessor;

    @Override
    public boolean toggleTrackChangeEnabled(boolean isTrackChangeEnabled, String documentRef) {
        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED),
                isTrackChangeEnabled);
        String documentId = financialStatementService.findFinancialStatementByRef(documentRef).getId();
        FinancialStatement financialStatement = financialStatementService.updateFinancialStatement(documentRef,
                documentId, properties, false);
        documentViewService.updateProposalAsync(financialStatement);
        return true;
    }

    @Override
    public String getElement(String documentRef, String elementName, String elementId) {
        return null;
    }

    @Override
    public DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) throws Exception {
        FinancialStatement financialStatement = this.financialStatementService.findFinancialStatementByRef(documentRef);
        this.setStructureContext(financialStatement.getMetadata().getOrError(() -> FINANCIAL_STATEMENT_METADATA_IS_REQUIRED).getDocTemplate());
        final byte[] newXmlContent = financialStatementProcessor.deleteElement(financialStatement, elementId, elementName);
        final String updatedLabel = generateLabel(elementId, financialStatement);
        final String comment = messageHelper.getMessage("operation.element.deleted", updatedLabel);
        financialStatement = financialStatementService.updateFinancialStatement(financialStatement, newXmlContent, comment);
        return documentViewService.updateDocumentView(financialStatement);
    }

    private String generateLabel(String reference, XmlDocument sourceDocument) {
        final byte[] sourceXmlContent = sourceDocument.getContent().get().getSource().getBytes();
        Result<String> updatedLabel = referenceLabelService.generateLabelStringRef(Arrays.asList(reference),
                sourceDocument.getMetadata().get().getRef(), sourceXmlContent);
        return updatedLabel.get();
    }

    @Override
    public SaveElementResponse saveElement(String documentRef, String elementId, String elementName,
                                           String elementFragment, boolean isSplit, String alternateElementId) throws Exception {
        return null;
    }

    @Override
    public DocumentViewResponse insertElement(String documentRef, String elementName, String elementId, Position position) {
        FinancialStatement financialStatement = this.financialStatementService.findFinancialStatementByRef(documentRef);
        this.setStructureContext(financialStatement.getMetadata().getOrError(() -> FINANCIAL_STATEMENT_METADATA_IS_REQUIRED).getDocTemplate());
        documentLanguageContext.setDocumentLanguage(financialStatement.getMetadata().get().getLanguage());

        byte[] updatedXmlContent = financialStatementProcessor.repeatElement(financialStatement, elementId, position.equals(Position.BEFORE));

        final String title = messageHelper.getMessage("operation.element.inserted", StringUtils.capitalize(elementName));
        final String description = messageHelper.getMessage(OPERATION_CHECKIN_MINOR);
        final String elementLabel = "";
        final CheckinCommentVO checkinComment = new CheckinCommentVO(title, description, new CheckinElement(ActionType.INSERTED, elementId, elementName, elementLabel));
        final String checkinCommentJson = CheckinCommentUtil.getJsonObject(checkinComment);
        financialStatement = financialStatementService.updateFinancialStatement(financialStatement, updatedXmlContent, checkinCommentJson);
        return this.documentViewService.updateDocumentView(financialStatement);
    }

    @Override
    public DocumentViewResponse mergeElement(String documentRef, String elementContent, String elementTag,
                                             String elementId) throws Exception {
        return null;
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef, TocMode mode) {
        return null;
    }

    @Override
    public List<TocItem> getTocItems(String documentRef) {
        return null;
    }

    @Override
    public DocumentViewResponse getDocument(String documentRef) {
        return null;
    }

    @Override
    public List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType) {
        return null;
    }

    @Override
    public List<TableOfContentItemVO> saveToC(String documentRef, List<TableOfContentItemVO> toc) {
        return null;
    }

    @Override
    public List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase,
                                                    boolean completeWords, String tempUpdatedContentXML)
            throws Exception {
        return null;
    }

    @Override
    public DocumentViewResponse showVersion(String versionId) {
        return null;
    }

    @Override
    public String compare(String newVersionId, String oldVersionId) {
        return null;
    }

    @Override
    public DocumentViewResponse restoreToVersion(String documentRef, String versionId) {
        return null;
    }

    @Override
    public EditElementResponse editElement(String documentRef, String elementId, String elementTagName) {
        return null;
    }

    @Override
    public byte[] downloadVersion(String documentRef, boolean isWithAnnotations) throws Exception {
        return new byte[0];
    }

    @Override
    public byte[] downloadCleanVersion(String documentRef) {
        return new byte[0];
    }

    @Override
    public DocumentViewResponse showCleanVersion(String documentRef) {
        return null;
    }

    @Override
    public byte[] downloadXmlVersionFiles(String documentRef, String versionId) {
        return new byte[0];
    }

    @Override
    public byte[] replaceAllTextInDocument(ReplaceAllMatchRequest event) throws Exception {
        return new byte[0];
    }

    @Override
    public byte[] replaceOneTextInDocument(ReplaceMatchRequest event) throws Exception {
        return new byte[0];
    }

    @Override
    public DocumentViewResponse saveAfterReplace(SaveAfterReplaceRequest event) {
        return null;
    }

    @Override
    public DocumentConfigResponse getDocumentConfig(String documentRef, String clientContextToken) {
        return null;
    }

    @Override
    public String fetchUserGuidance(String documentRef) {
        return null;
    }

    @Override
    public DocumentViewResponse acceptChange(String documentRef, String elementId, String elementTagName, TrackChangeActionType changeType, String presenterId) throws Exception {
        return null;
    }

    @Override
    public DocumentViewResponse rejectChange(String documentRef, String elementId, String elementTagName, TrackChangeActionType trackChangeAction, String presenterId) throws Exception {
        String op = "rejected";
        String msg = "operation.element.track.change." + trackChangeAction.getTrackChangeAction() + "." + op;

        FinancialStatement financialStatement = this.financialStatementService.findFinancialStatementByRef(documentRef);
        this.setStructureContext(financialStatement.getMetadata().getOrError(() -> FINANCIAL_STATEMENT_METADATA_IS_REQUIRED).getDocTemplate());
        documentLanguageContext.setDocumentLanguage(financialStatement.getMetadata().get().getLanguage());
        byte[] newXmlContent = trackChangesProcessor.rejectChange(financialStatement, elementId, trackChangeAction);
        this.structureContext.get().useDocumentTemplate(financialStatement.getMetadata().getOrError(() -> "Document metadata is required!").getDocTemplate());

        final String updatedLabel = generateLabel(elementId, financialStatement);
        final String comment = messageHelper.getMessage(msg, updatedLabel);
        financialStatement = financialStatementService.updateFinancialStatement(financialStatement, newXmlContent, comment);

        trackChangesProcessor.handleCoEdition(newXmlContent, documentRef, elementId, elementTagName, trackChangeAction, presenterId, false);
        return documentViewService.updateDocumentView(financialStatement);
    }

    private void setStructureContext(String docTemplate) {
        this.structureContext.get().useDocumentTemplate(docTemplate);
    }

}
