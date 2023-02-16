package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.cmis.common.VersionType;
import eu.europa.ec.leos.domain.cmis.document.XmlDocument;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;

import java.util.List;

public interface BaseDocumentService<T extends XmlDocument> {
    String getElement(String documentRef, String elementName, String elementId);
    DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) throws Exception;
    DocumentViewResponse saveElement(String documentRef, String elementId, String elementName, String elementFragment) throws Exception;
    DocumentViewResponse insertElement(String documentRef, String elementName, String elementId, Position position);
    DocumentViewResponse mergeElement(String documentRef, String elementContent , String  elementTag , String elementId) throws  Exception;
    List<T> getRecentMinorVersions(String documentId, String  documentRef);
    List<VersionVO> getVersionsData(String documentId, String documentRef);
    List<TableOfContentItemVO> getToc(String documentRef, TocMode mode);
    List<TocItem> getTocItems(String documentRef);
    DocumentViewResponse getDocument(String documentRef);
    List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType);
    List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase, boolean completeWords) throws Exception;
    DocumentViewResponse showVersion(String versionId);
    String compare(String newVersionId, String oldVersionId);
    DocumentViewResponse restoreToVersion(String documentRef, String versionId);
    EditElementResponse editElement(String documentRef, String elementId, String  elementTagName);

}
