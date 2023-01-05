package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.cmis.document.Annex;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;

import java.util.List;

public interface AnnexApiService {
    String getAnnexElement(String documentRef, String elementName, String elementId);
    byte[] deleteAnnexBlock(String documentRef, String elementName, String elementId) throws Exception;
    byte[] saveAnnexElement(String documentRef, String elementId, String elementName, String elementFragment);
    byte[] insertAnnexElement(String documentRef, String elementName, String elementId, Position position);
    byte[] mergeElement(String documentRef, String elementContent , String  elementTag , String elementId) throws  Exception;
    List<Annex> getRecentMinorVersions(String documentId, String  documentRef);
    List<VersionVO> getVersionsData(String documentId, String documentRef);
    List<TableOfContentItemVO> getTocItems(String documentRef, TocMode mode);
    byte[] getAnnex(String documentRef);
    List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase, boolean completeWords);
    String showVersion(String versionId);
    String compare(String newVersionId, String oldVersionId);
    byte[] restoreToVersion(String documentRef, String versionId);
}