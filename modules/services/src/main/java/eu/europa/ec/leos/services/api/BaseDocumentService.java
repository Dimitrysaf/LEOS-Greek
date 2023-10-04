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

import com.sun.istack.NotNull;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.RefreshElementResponse;
import eu.europa.ec.leos.services.dto.response.ShowCleanVersionResponse;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.vo.toc.Attribute;
import eu.europa.ec.leos.vo.toc.StructureConfigUtils;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import eu.europa.ec.leos.vo.toc.TocItemType;
import org.apache.http.MethodNotSupportedException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface BaseDocumentService<T extends XmlDocument> {
    String getElement(String documentRef, String elementName, String elementId);

    DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) throws Exception;

    RefreshElementResponse saveElement(String documentRef, String elementId, String elementName, String elementFragment) throws Exception;

    DocumentViewResponse insertElement(String documentRef, String elementName, String elementId, Position position);

    DocumentViewResponse mergeElement(String documentRef, String elementContent, String elementTag, String elementId) throws Exception;

    List<VersionVO> getRecentMinorVersions(String documentRef);

    List<VersionVO> getVersionsData(String documentRef);

    List<VersionVO> getIntermediateVersionsData(String documentRef, String currIntVersion);

    List<TableOfContentItemVO> getToc(String documentRef, TocMode mode);

    List<TocItem> getTocItems(@NotNull String documentRef);

    DocumentViewResponse getDocument(@NotNull String documentRef);

    List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType);

    List<TableOfContentItemVO> saveToC(String documentRef, List<TableOfContentItemVO> toc) throws MethodNotSupportedException;

    List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase, boolean completeWords, String tempUpdatedContentXML) throws Exception;

    DocumentViewResponse showVersion(String versionId);

    String compare(String newVersionId, String oldVersionId);

    DocumentViewResponse restoreToVersion(String documentRef, String versionId);

    EditElementResponse editElement(String documentRef, String elementId, String elementTagName);

    byte[] downloadVersion(String documentRef, boolean isWithAnnotations) throws Exception;

    byte[] downloadCleanVersion(String documentRef);

    ShowCleanVersionResponse showCleanVersion(String documentRef);

    byte[] downloadXmlVersionFiles(String documentRef, String versionId);

    byte[] replaceAllTextInDocument(ReplaceAllMatchRequest event) throws Exception;

    byte[] replaceOneTextInDocument(ReplaceMatchRequest event) throws Exception;

    DocumentViewResponse saveAfterReplace(SaveAfterReplaceRequest event);

    DocumentConfigResponse getDocumentConfig(String documentRef);

    String fetchUserGuidance(String documentRef);

    default Map<String, Attribute> getArticleTypesAttributes(List<TocItem> tocItems) {
        Map<String, Attribute> articleTypesAttributes = new HashMap<>();
        List<TocItemType> tocItemTypes = StructureConfigUtils.getTocItemTypesByTagName(tocItems, XmlHelper.ARTICLE);
        tocItemTypes.forEach(tocItemType -> {
            Attribute attribute = tocItemType.getAttribute();
            if (attribute == null) {
                attribute = new Attribute();
                attribute.setAttributeName("");
                attribute.setAttributeValue("");
            }
            articleTypesAttributes.put(tocItemType.getName().name(), attribute);
        });
        return articleTypesAttributes;
    }

    default byte[] getContentForReplaceProcess(String updatedContentXML, XmlDocument document) {
        if (updatedContentXML == null || updatedContentXML.isEmpty()) {
            return getContent(document);
        }
        return updatedContentXML.getBytes();
    }

    default byte[] getContent(XmlDocument document) {
        final Content content = document.getContent().getOrError(() -> "Document content is required!");
        return content.getSource().getBytes();
    }


}
