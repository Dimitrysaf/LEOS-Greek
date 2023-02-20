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
import org.apache.http.MethodNotSupportedException;

import java.util.List;

public interface BaseDocumentService<T extends XmlDocument> {
    String getElement(String documentRef, String elementName, String elementId);
    DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) throws Exception;
    DocumentViewResponse saveElement(String documentRef, String elementId, String elementName, String elementFragment) throws Exception;
    DocumentViewResponse insertElement(String documentRef, String elementName, String elementId, Position position);
    DocumentViewResponse mergeElement(String documentRef, String elementContent , String  elementTag , String elementId) throws  Exception;
    List<VersionVO> getRecentMinorVersions(String  documentRef);
    List<VersionVO> getVersionsData(String documentRef);
    List<TableOfContentItemVO> getToc(String documentRef, TocMode mode);
    List<TocItem> getTocItems(String documentRef);
    DocumentViewResponse getDocument(String documentRef);
    List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType);
    List<TableOfContentItemVO> saveToC(String documentRef,List<TableOfContentItemVO> toc) throws MethodNotSupportedException;
    List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase, boolean completeWords) throws Exception;
    DocumentViewResponse showVersion(String versionId);
    String compare(String newVersionId, String oldVersionId);
    DocumentViewResponse restoreToVersion(String documentRef, String versionId);
    EditElementResponse editElement(String documentRef, String elementId, String  elementTagName);

}
