package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.model.action.TrackChangeActionType;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.services.document.FinancialStatementService;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.RefreshElementResponse;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.apache.http.MethodNotSupportedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FinancialStatementApiServiceImpl implements FinancialStatementApiService{

    @Autowired
    FinancialStatementService financialStatementService;
    @Autowired
    RepositoryPropertiesMapper repositoryPropertiesMapper;
    @Autowired
    TrackChangesContext trackChangesContext;


    @Override
    public boolean toggleTrackChangeEnabled(boolean isTrackChangeEnabled, String documentRef) {
        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED), isTrackChangeEnabled);
        String documentId = financialStatementService.findFinancialStatementByRef(documentRef).getId();
        FinancialStatement financialStatement = financialStatementService.updateFinancialStatement(documentRef, documentId, properties, false);
        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return true;
    }

    @Override
    public String getElement(String documentRef, String elementName, String elementId) {
        return null;
    }

    @Override
    public DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) throws Exception {
        return null;
    }

    @Override
    public RefreshElementResponse saveElement(String documentRef, String elementId, String elementName, String elementFragment) throws Exception {
        return null;
    }

    @Override
    public DocumentViewResponse insertElement(String documentRef, String elementName, String elementId, Position position) {
        return null;
    }

    @Override
    public DocumentViewResponse mergeElement(String documentRef, String elementContent, String elementTag, String elementId) throws Exception {
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
    public List<TableOfContentItemVO> saveToC(String documentRef, List<TableOfContentItemVO> toc) throws MethodNotSupportedException {
        return null;
    }

    @Override
    public List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase, boolean completeWords, String tempUpdatedContentXML) throws Exception {
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
    public DocumentConfigResponse getDocumentConfig(String documentRef) {
        return null;
    }

    @Override
    public String fetchUserGuidance(String documentRef) {
        return null;
    }

    @Override
    public DocumentViewResponse acceptChange(String documentRef, String elementId, String elementTagName, TrackChangeActionType changeType) throws Exception {
        return null;
    }

    @Override
    public DocumentViewResponse rejectChange(String documentRef, String elementId, String elementTagName, TrackChangeActionType changeType) throws Exception {
        return null;
    }
}
