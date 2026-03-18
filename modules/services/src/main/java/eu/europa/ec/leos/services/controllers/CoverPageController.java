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

package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.services.api.CoverPageApiService;
import eu.europa.ec.leos.services.api.GenericDocumentApiService;
import eu.europa.ec.leos.services.dto.coedition.CoEditionContext;
import eu.europa.ec.leos.services.dto.request.InsertElementRequest;
import eu.europa.ec.leos.services.dto.request.SaveIntermediateVersionRequest;
import eu.europa.ec.leos.services.dto.request.ToggleTrackChangeEnabledRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.SaveCoverPageElementResponse;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
import eu.europa.ec.leos.services.request.SaveTocRequestEvent;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.services.response.SearchAndReplaceAllResponse;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.structure.TocItem;
import io.atlassian.fugue.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;


@RestController
@RequestMapping("/secured/coverPage/")
public class CoverPageController implements CoverPageApi {
    private static final Logger LOG = LoggerFactory.getLogger(CoverPageController.class);
    private static final String ERROR_OCCURED_WHILE_GETTING_ANEX_ELEMENT = "Error occured while getting anex element - ";
    private static final String ERROR_OCCURRED_WHILE_GETTING_DOWNLOADING_XML_VERSION = "Error occurred  while getting downloading xml version - ";
    private static final String ERROR_OCCURRED_WHILE_DOWNLOADING_XML_VERSION = "Error occurred  while  downloading xml version";
    private static  final String CLIENT_CONTEXT_PARAMETER = "Client-Context";

    @Autowired
    CoverPageApiService coverPageApiService;
    @Autowired
    private GenericDocumentApiService genericDocumentApiService;
    @Autowired
    private CoEditionContext coEditionContext;

    @Override
    public ResponseEntity<Object> getCoverPage(String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            DocumentViewResponse coverPageDocument = this.coverPageApiService.getDocument(documentRef);
            return ResponseEntity.ok().body(coverPageDocument);
        } catch (Exception e) {
            LOG.error("Error occurred while getting coverPage document - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting coverPage document",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> getToc(String documentRef, TocMode tocMode, HttpServletRequest request) {
        try {
            documentRef = encodeParam(documentRef);
            String clientContextToken = request.getHeader(CLIENT_CONTEXT_PARAMETER);
            List<TableOfContentItemVO> toc = this.coverPageApiService.getToc(documentRef, tocMode, clientContextToken);
            return ResponseEntity.ok().body(toc);
        } catch (Exception e) {
            LOG.error("Error occurred while getting coverPage toc items - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting cover page toc",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> getTocItems(String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            List<TocItem> tocItems = this.coverPageApiService.getTocItems(documentRef);
            return ResponseEntity.ok().body(tocItems);
        } catch (Exception e) {
            LOG.error("Error occurred while getting coverpage toc items - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting cover page toc",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> saveCoverPageElement(String documentRef, String elementName, String elementId,
                                                       boolean isSplit, String presenterId, String elementContent) {
        try {
            documentRef = encodeParam(documentRef);
            elementName = encodeParam(elementName);
            elementId = encodeParam(elementId);
            presenterId = encodeParam(presenterId);
            SaveCoverPageElementResponse updatedElement = (SaveCoverPageElementResponse) this.coverPageApiService.saveElement(
                    documentRef, elementId, elementName, elementContent, isSplit, null);
            coEditionContext.sendUpdatedElements(documentRef, presenterId, updatedElement, null);
            return ResponseEntity.ok().body(updatedElement);
        } catch (Exception e) {
            LOG.error("Error occurred while getting coverPage element - " + e.getMessage());
            LOG.error("Error occurred while getting coverPage element", e);
            return new ResponseEntity<>("Unexpected error occured while getting coverPage element",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> deleteCoverPageElement(String documentRef, String elementName, String elementId) {
        try {
            documentRef = encodeParam(documentRef);
            elementName = encodeParam(elementName);
            elementId = encodeParam(elementId);
            DocumentViewResponse coverPage = this.coverPageApiService.deleteBlock(documentRef, elementName, elementId);
            return ResponseEntity.ok().body(coverPage);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURED_WHILE_GETTING_ANEX_ELEMENT + e.getMessage());
            return new ResponseEntity<>("Unexpcted error occured while getting coverPage element",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }


    @Override
    public ResponseEntity<Object> insertCoverPageElement(String documentRef, String elementName, String elementId,
                                                         InsertElementRequest request) {
        try {
            documentRef = encodeParam(documentRef);
            elementName = encodeParam(elementName);
            elementId = encodeParam(elementId);
            DocumentViewResponse coverPage = this.coverPageApiService.insertElement(documentRef, elementName, elementId,
                    request.getPosition());
            return ResponseEntity.ok().body(coverPage);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURED_WHILE_GETTING_ANEX_ELEMENT + e.getMessage());
            return new ResponseEntity<>("Unexpcted error occured while getting coverPage element",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> mergeCoverPageElement(String documentRef, String elementTag, String elementId,
                                                        String elementContent) {
        try {
            documentRef = encodeParam(documentRef);
            elementTag = encodeParam(elementTag);
            elementId = encodeParam(elementId);
            DocumentViewResponse coverPage = this.coverPageApiService.mergeElement(documentRef, elementContent,
                    elementTag, elementId);
            return ResponseEntity.ok().body(coverPage);
        } catch (Exception e) {
            LOG.error("Error occurred while getting trying to merge on coverpage - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while merging elements ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> getRecentChanges(String documentRef, int pageIndex, int pageSize) {
        try {
            documentRef = encodeParam(documentRef);
            List<VersionVO> coverPagees = this.genericDocumentApiService.getRecentMinorVersions(documentRef, pageIndex,
                    pageSize);
            return ResponseEntity.ok().body(coverPagees);
        } catch (Exception e) {
            LOG.error("Error occurred while getting recent changes - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting recent changes ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> countRecentChanges(String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            int count = this.genericDocumentApiService.countRecentMinorVersions(documentRef);
            return ResponseEntity.ok().body(count);
        } catch (Exception e) {
            LOG.error("Error occurred while getting recent changes - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting recent changes ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> saveCoverPageVersion(String documentRef, SaveIntermediateVersionRequest saveEvent) {
        try {
            documentRef = encodeParam(documentRef);
            List<VersionVO> versions = this.coverPageApiService.saveDocument(documentRef, saveEvent.getCheckinComment(),
                    saveEvent.getVersionType());
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while saving coverPage version - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while saving coverPage version ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> saveToc(String documentRef, SaveTocRequestEvent saveTocRequestEvent,
                                          HttpServletRequest request) {
        try {
            documentRef = encodeParam(documentRef);
            String clientContextToken = request.getHeader(CLIENT_CONTEXT_PARAMETER);
            List<TableOfContentItemVO> toc = this.coverPageApiService.saveToC(documentRef,
                    saveTocRequestEvent.getTableOfContentItemVOs(), TocMode.NOT_SIMPLIFIED, clientContextToken);
            return ResponseEntity.ok().body(toc);
        } catch (Exception e) {
            LOG.error("Error occurred while getting saving toc - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while saving toc ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> searchVersionData(String documentRef, String authorKey, String type) {
        try {
            documentRef = encodeParam(documentRef);
            List<VersionVO> versions = this.genericDocumentApiService.searchVersions(documentRef, authorKey, type);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> getMajorVersionsData(String documentRef, int pageIndex, int pageSize) {
        try {
            documentRef = encodeParam(documentRef);
            List<VersionVO> versions = this.genericDocumentApiService.getMajorVersionsData(documentRef, pageIndex,
                    pageSize);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting coverPage versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> countMajorVersionsData(String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            int versions = this.genericDocumentApiService.countMajorVersionsData(documentRef);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting cover page versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> getIntermediateVersionData(String documentRef, String currIntVersion,
                                                             int pageIndex, int pageSize) {
        try {
            documentRef = encodeParam(documentRef);
            currIntVersion = encodeParam(currIntVersion);
            List<VersionVO> versions = this.genericDocumentApiService.getIntermediateVersionsData(documentRef,
                    currIntVersion, pageIndex, pageSize);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> countIntermediateVersionData(String documentRef, String currIntVersion) {
        try {
            documentRef = encodeParam(documentRef);
            int count = this.genericDocumentApiService.countIntermediateVersionsData(documentRef, currIntVersion);
            return ResponseEntity.ok().body(count);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> getSearchResults(String documentRef, String searchText, boolean matchCase,
                                                   boolean completeWords, String tempUpdatedContentXML) {
        try {
            documentRef = encodeParam(documentRef);
            List<SearchMatchVO> coverPage = this.coverPageApiService.searchTextInDocument(documentRef, searchText,
                    matchCase, completeWords, tempUpdatedContentXML);
            return ResponseEntity.ok().body(coverPage);
        } catch (Exception e) {
            LOG.error("Error occurred while getting coverPage search results - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while fetching search results for coverPage ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> showCoverPageVersion(String versionId) {
        try {
            versionId = encodeParam(versionId);
            DocumentViewResponse contentHtml = this.coverPageApiService.showVersion(versionId);
            return ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            LOG.error("Error occurred while getting coverPage version {} , error {}: - ", versionId, e.getMessage());
            return new ResponseEntity<>("Unexpected error while trying to get coverPage version as html ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> compareCoverPageVersions(String newVersionId, String oldVersionId) {
        try {
            newVersionId = encodeParam(newVersionId);
            oldVersionId = encodeParam(oldVersionId);
            String contentHtml = this.coverPageApiService.compare(newVersionId, oldVersionId);
            return ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            LOG.error("Error occurred while comparing old :{} with new {} versions ", oldVersionId, newVersionId);
            return new ResponseEntity<>("Unexpected error while trying to get coverPage version as html ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> restoreCoverPageVersion(String documentRef, String targetVersion) {
        try {
            documentRef = encodeParam(documentRef);
            targetVersion = encodeParam(targetVersion);
            DocumentViewResponse coverPage = this.coverPageApiService.restoreToVersion(documentRef, targetVersion);
            return ResponseEntity.ok().body(coverPage);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURED_WHILE_GETTING_ANEX_ELEMENT + e.getMessage());
            return new ResponseEntity<>("Unexpected error while trying to restore version ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> getCoverPageElement(String documentRef, String elementId, String elementTagName) {
        try {
            documentRef = encodeParam(documentRef);
            elementId = encodeParam(elementId);
            elementTagName = encodeParam(elementTagName);
            EditElementResponse response = this.coverPageApiService.editElement(documentRef, elementId, elementTagName);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting coverPage element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error while getting coverPage element ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> downloadCurrentVersion(String documentRef, boolean isWithAnnotation) {
        try {
            documentRef = encodeParam(documentRef);
            byte[] response = this.coverPageApiService.downloadVersion(documentRef, isWithAnnotation);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting downloading version - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while getting downloading version",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> downloadXmlVersion(String documentRef, String versionId) {
        try {
            documentRef = encodeParam(documentRef);
            versionId = encodeParam(versionId);
            byte[] response = this.coverPageApiService.downloadXmlVersionFiles(documentRef, versionId);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURRED_WHILE_GETTING_DOWNLOADING_XML_VERSION + e.getMessage());
            return new ResponseEntity<>(ERROR_OCCURRED_WHILE_DOWNLOADING_XML_VERSION, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> replaceOneText(String documentRef, ReplaceMatchRequest request) {
        try {
            byte[] response = this.coverPageApiService.replaceOneTextInDocument(request);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURRED_WHILE_GETTING_DOWNLOADING_XML_VERSION + e.getMessage());
            return new ResponseEntity<>(ERROR_OCCURRED_WHILE_DOWNLOADING_XML_VERSION, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> replaceAllText(String documentRef, ReplaceAllMatchRequest request) {
        try {
            Pair<byte[], Integer> response = this.coverPageApiService.replaceAllTextInDocument(request);
            SearchAndReplaceAllResponse searchAndReplaceAllResponse = new SearchAndReplaceAllResponse(new String(response.left(), StandardCharsets.UTF_8), response.right());
            return ResponseEntity.ok().body(searchAndReplaceAllResponse);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURRED_WHILE_GETTING_DOWNLOADING_XML_VERSION + e.getMessage());
            return new ResponseEntity<>(ERROR_OCCURRED_WHILE_DOWNLOADING_XML_VERSION, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> saveAllAfterReplace(String documentRef, SaveAfterReplaceRequest request) {
        try {
            DocumentViewResponse view = this.coverPageApiService.saveAfterReplace(request);
            return ResponseEntity.ok().body(view);
        } catch (Exception e) {
            LOG.error("Error occurred  while saving after replace all - " + e.getMessage());
            return new ResponseEntity<>("Error occurred while saving after replace all",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> getDocumentConfig(String documentRef, HttpServletRequest request) {
        try {
            documentRef = encodeParam(documentRef);
            String clientContextToken = request.getHeader(CLIENT_CONTEXT_PARAMETER);
            DocumentConfigResponse view = this.coverPageApiService.getDocumentConfig(documentRef, clientContextToken);
            return ResponseEntity.ok().body(view);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting document config  - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while getting document config ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> getUserGuidance(String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            String userGuidance = this.coverPageApiService.fetchUserGuidance(documentRef);
            return ResponseEntity.ok().body(userGuidance);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get user guidance for coverPage " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get user guidance for coverPage",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> downloadCleanVersion(String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            byte[] cleanVersion = this.coverPageApiService.downloadCleanVersion(documentRef);
            final String jobFileName = documentRef + "_AKN2DW_CLEAN_" + System.currentTimeMillis() + ".docx";
            // create the HttpHeaders object and set the Content-Type header
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Disposition", "attachment; filename=\"" + jobFileName + "\"");
            return new ResponseEntity<>(cleanVersion, headers, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to download clean version for coverPage " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to download clean version for coverPage",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> showCleanVersion(String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            DocumentViewResponse cleanVersion = this.coverPageApiService.showCleanVersion(documentRef);
            return ResponseEntity.ok().body(cleanVersion);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get  clean version for coverPage " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get clean version for coverPage",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> toggleTrackChangeEnabled(String documentRef,
                                                           ToggleTrackChangeEnabledRequest toggleTrackChangeEnabledRequest) {
        try {
            documentRef = encodeParam(documentRef);
            boolean isTrackChangesEnabled = toggleTrackChangeEnabledRequest.isTrackChangedEnabled();
            boolean response = coverPageApiService.toggleTrackChangeEnabled(isTrackChangesEnabled, documentRef);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred while toggling Track change enabled- " + e);
            return new ResponseEntity<>("Unexpected error occurred while toggling Track change enabled",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
