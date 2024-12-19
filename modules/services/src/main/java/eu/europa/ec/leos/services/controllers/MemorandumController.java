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
import eu.europa.ec.leos.services.api.GenericDocumentApiService;
import eu.europa.ec.leos.services.api.MemorandumApiService;
import eu.europa.ec.leos.services.dto.coedition.CoEditionContext;
import eu.europa.ec.leos.services.dto.request.InsertElementRequest;
import eu.europa.ec.leos.services.dto.request.SaveIntermediateVersionRequest;
import eu.europa.ec.leos.services.dto.request.ToggleTrackChangeEnabledRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.SaveElementResponse;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
import eu.europa.ec.leos.services.request.SaveTocRequestEvent;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.structure.TocItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;

@RestController
@RequestMapping("/secured/memorandum/")
public class MemorandumController {
    private static final Logger LOG = LoggerFactory.getLogger(MemorandumController.class);
    private static  final String CLIENT_CONTEXT_PARAMETER = "Client-Context";

    @Autowired
    MemorandumApiService memorandumApiService;
    @Autowired
    private GenericDocumentApiService genericDocumentApiService;
    @Autowired
    private CoEditionContext coEditionContext;

    @GetMapping(value = "/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getMemorandum(@PathVariable("documentRef") String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            DocumentViewResponse memorandumDocument = this.memorandumApiService.getDocument(documentRef);
            return ResponseEntity.ok().body(memorandumDocument);
        } catch (Exception e) {
            LOG.error("Error occurred while getting memorandum document - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting Memorandum document",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/getToc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getToc(@PathVariable("documentRef") String documentRef,
                                         @RequestParam("tocMode") TocMode tocMode
    ) {
        try {
            documentRef = encodeParam(documentRef);
            List<TableOfContentItemVO> toc = this.memorandumApiService.getToc(documentRef, tocMode);
            return ResponseEntity.ok().body(toc);
        } catch (Exception e) {
            LOG.error("Error occurred while getting Memorandum toc items - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting Memorandum toc items",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/getTocItems", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getTocItems(@PathVariable("documentRef") String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            List<TocItem> tocItems = this.memorandumApiService.getTocItems(documentRef);
            return ResponseEntity.ok().body(tocItems);
        } catch (Exception e) {
            LOG.error("Error occurred while getting memorandum toc items - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error memorandum while getting memorandum toc items",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/save-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveMemorandumElement(@PathVariable("documentRef") String documentRef,
                                                        @PathVariable("elementName") String elementName,
                                                        @PathVariable("elementId") String elementId,
                                                        @RequestHeader("presenterId") String presenterId,
                                                        @RequestParam(required = false) boolean isSplit,
                                                        @RequestBody String elementContent) {
        try {
            documentRef = encodeParam(documentRef);
            elementName = encodeParam(elementName);
            elementId = encodeParam(elementId);
            presenterId = encodeParam(presenterId);
            SaveElementResponse updatedElement = this.memorandumApiService.saveElement(documentRef, elementId,
                    elementName, elementContent, isSplit, null);
            coEditionContext.sendUpdatedElements(documentRef, presenterId, updatedElement, null);
            return ResponseEntity.ok().body(updatedElement);
        } catch (Exception e) {
            LOG.error("Error occurred while getting memorandum element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occured while getting memorandum element",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @DeleteMapping(value = "/{documentRef}/element/{elementName}/{elementId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> deleteMemorandumElement(@PathVariable("documentRef") String documentRef,
                                                          @PathVariable("elementName") String elementName,
                                                          @PathVariable("elementId") String elementId) {
        try {
            documentRef = encodeParam(documentRef);
            elementName = encodeParam(elementName);
            elementId = encodeParam(elementId);
            DocumentViewResponse memorandum = this.memorandumApiService.deleteBlock(documentRef, elementName,
                    elementId);
            return ResponseEntity.ok().body(memorandum);
        } catch (Exception e) {
            LOG.error("Error occured while getting anex element - " + e.getMessage());
            return new ResponseEntity<>("Unexpcted error occured while getting memorandum element",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }


    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/insert-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> insertMemorandumElement(@PathVariable("documentRef") String documentRef,
                                                          @PathVariable("elementName") String elementName,
                                                          @PathVariable("elementId") String elementId,
                                                          @RequestBody InsertElementRequest request) {
        try {
            documentRef = encodeParam(documentRef);
            elementName = encodeParam(elementName);
            elementId = encodeParam(elementId);
            DocumentViewResponse memorandum = this.memorandumApiService.insertElement(documentRef, elementName,
                    elementId, request.getPosition());
            return ResponseEntity.ok().body(memorandum);
        } catch (Exception e) {
            LOG.error("Error occured while getting anex element - " + e.getMessage());
            return new ResponseEntity<>("Unexpcted error occured while getting memorandum element",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/merge-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> mergeMemorandumElement(@PathVariable("documentRef") String documentRef,
                                                         @PathVariable("elementName") String elementTag,
                                                         @PathVariable("elementId") String elementId,
                                                         @RequestBody String elementContent) {
        try {
            documentRef = encodeParam(documentRef);
            elementTag = encodeParam(elementTag);
            elementId = encodeParam(elementId);
            DocumentViewResponse memorandum = this.memorandumApiService.mergeElement(documentRef, elementContent,
                    elementTag, elementId);
            return ResponseEntity.ok().body(memorandum);
        } catch (Exception e) {
            LOG.error("Error occurred while getting trying to merge on memorandum - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while merging elements ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getRecentChanges(@PathVariable("documentRef") String documentRef,
                                                   @RequestParam int pageIndex, @RequestParam int pageSize) {
        try {
            documentRef = encodeParam(documentRef);
            List<VersionVO> memorandumes = this.genericDocumentApiService.getRecentMinorVersions(documentRef, pageIndex,
                    pageSize);
            return ResponseEntity.ok().body(memorandumes);
        } catch (Exception e) {
            LOG.error("Error occurred while getting recent changes - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting recent changes ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/count-recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> countRecentChanges(@PathVariable("documentRef") String documentRef) {
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

    @PostMapping(value = "/{documentRef}/save-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveMemorandumVersion(@PathVariable("documentRef") String documentRef,
                                                        @RequestBody SaveIntermediateVersionRequest saveEvent
    ) {
        try {
            documentRef = encodeParam(documentRef);
            List<VersionVO> versions = this.memorandumApiService.saveDocument(documentRef,
                    saveEvent.getCheckinComment(), saveEvent.getVersionType());
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while saving memorandum version - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while saving memorandum version ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping(value = "/{documentRef}/save-toc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveMemorandumVersion(@PathVariable("documentRef") String documentRef,
                                                        @RequestBody SaveTocRequestEvent saveTocRequestEvent
    ) {
        try {
            documentRef = encodeParam(documentRef);
            List<TableOfContentItemVO> toc = this.memorandumApiService.saveToC(documentRef,
                    saveTocRequestEvent.getTableOfContentItemVOs(), TocMode.NOT_SIMPLIFIED);
            return ResponseEntity.ok().body(toc);
        } catch (Exception e) {
            LOG.error("Error occurred while getting saving toc - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while saving toc ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/search-versions", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> searchVersionData(@PathVariable("documentRef") String documentRef,
                                                    @RequestParam String authorKey,
                                                    @RequestParam String type) {
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

    @GetMapping(value = "/{documentRef}/version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getMajorVersionsData(@PathVariable("documentRef") String documentRef,
                                                       @RequestParam int pageIndex,
                                                       @RequestParam int pageSize) {
        try {
            documentRef = encodeParam(documentRef);
            List<VersionVO> versions = this.genericDocumentApiService.getMajorVersionsData(documentRef, pageIndex,
                    pageSize);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting memorandum versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/count-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> countMajorVersionsData(@PathVariable("documentRef") String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            int versions = this.genericDocumentApiService.countMajorVersionsData(documentRef);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/intermediate-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getIntermediateVersionData(@PathVariable("documentRef") String documentRef,
                                                             @RequestParam String currIntVersion,
                                                             @RequestParam int pageIndex, @RequestParam int pageSize) {
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

    @GetMapping(value = "/{documentRef}/count-intermediate-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> countIntermediateVersionData(@PathVariable("documentRef") String documentRef,
                                                               @RequestParam String currIntVersion) {
        try {
            documentRef = encodeParam(documentRef);
            currIntVersion = encodeParam(currIntVersion);
            int count = this.genericDocumentApiService.countIntermediateVersionsData(documentRef, currIntVersion);
            return ResponseEntity.ok().body(count);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping(value = "/{documentRef}/search-text", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getSearchResults(@PathVariable("documentRef") String documentRef,
                                                   @RequestParam String searchText,
                                                   @RequestParam boolean matchCase,
                                                   @RequestParam boolean completeWords,
                                                   @RequestBody(required = false) String tempUpdatedContentXML) {
        try {
            documentRef = encodeParam(documentRef);
            List<SearchMatchVO> memorandum = this.memorandumApiService.searchTextInDocument(documentRef, searchText,
                    matchCase, completeWords, tempUpdatedContentXML);
            return ResponseEntity.ok().body(memorandum);
        } catch (Exception e) {
            LOG.error("Error occurred while getting memorandum search results - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while fetching search results for memorandum ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{versionId}/show-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> showMemorandumVersion(@PathVariable("versionId") String versionId) {
        try {
            versionId = encodeParam(versionId);
            DocumentViewResponse contentHtml = this.memorandumApiService.showVersion(versionId);
            return ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            LOG.error("Error occurred while getting memorandum version {} , error {}: - ", versionId, e.getMessage());
            return new ResponseEntity<>("Unexpected error while trying to get memorandum version as html ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{newVersionId}/compare/{oldVersionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> compareMemorandumVersions(@PathVariable("newVersionId") String newVersionId,
                                                            @PathVariable("oldVersionId") String oldVersionId) {
        try {
            newVersionId = encodeParam(newVersionId);
            oldVersionId = encodeParam(oldVersionId);
            String contentHtml = this.memorandumApiService.compare(newVersionId, oldVersionId);
            return ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            LOG.error("Error occurred while comparing old :{} with new {} versions ", oldVersionId, newVersionId);
            return new ResponseEntity<>("Unexpected error while trying to get memorandum version as html ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/restore/{targetVersion}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> restoreMemorandumVersion(@PathVariable("documentRef") String documentRef,
                                                           @PathVariable("targetVersion") String targetVersion) {
        try {
            documentRef = encodeParam(documentRef);
            targetVersion = encodeParam(targetVersion);
            DocumentViewResponse memorandum = this.memorandumApiService.restoreToVersion(documentRef, targetVersion);
            return ResponseEntity.ok().body(memorandum);
        } catch (Exception e) {
            LOG.error("Error occured while getting anex element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error while trying to restore version ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/element/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getMemorandumElement(@PathVariable("documentRef") String documentRef,
                                                       @PathVariable("elementId") String elementId,
                                                       @PathVariable("elementTagName") String elementTagName) {
        try {
            documentRef = encodeParam(documentRef);
            elementId = encodeParam(elementId);
            elementTagName = encodeParam(elementTagName);
            EditElementResponse response = this.memorandumApiService.editElement(documentRef, elementId,
                    elementTagName);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting memorandum element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error while getting memorandum element ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/download-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> downloadCurrentVersion(@PathVariable("documentRef") String documentRef,
                                                         @RequestParam("isWithAnnotation") boolean isWithAnnotation) {
        try {
            documentRef = encodeParam(documentRef);
            byte[] response = this.memorandumApiService.downloadVersion(documentRef, isWithAnnotation);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting downloading version - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while getting downloading version",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/download-xml-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> downloadXmlVersion(@PathVariable("documentRef") String documentRef,
                                                     @RequestParam("versionId") String versionId) {
        try {
            documentRef = encodeParam(documentRef);
            versionId = encodeParam(versionId);
            byte[] response = this.memorandumApiService.downloadXmlVersionFiles(documentRef, versionId);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting downloading xml version - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while  downloading xml version",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/replace-one", produces = MediaType.TEXT_XML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> replaceOneText(@PathVariable("documentRef") String documentRef,
                                                 @RequestBody ReplaceMatchRequest request) {
        try {
            byte[] response = this.memorandumApiService.replaceOneTextInDocument(request);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting downloading xml version - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while  downloading xml version",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/replace-all", produces = MediaType.TEXT_XML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> replaceAllText(@PathVariable("documentRef") String documentRef,
                                                 @RequestBody ReplaceAllMatchRequest request) {
        try {
            byte[] response = this.memorandumApiService.replaceAllTextInDocument(request);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting downloading xml version - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while  downloading xml version",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/save-after-replace", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveAllAfterReplace(@PathVariable("documentRef") String documentRef,
                                                      @RequestBody SaveAfterReplaceRequest request) {
        try {
            DocumentViewResponse view = this.memorandumApiService.saveAfterReplace(request);
            return ResponseEntity.ok().body(view);
        } catch (Exception e) {
            LOG.error("Error occurred  while saving after replace all - " + e.getMessage());
            return new ResponseEntity<>("Error occurred while saving after replace all",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/document-config", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getDocumentConfig(@PathVariable("documentRef") String documentRef,
                                                    HttpServletRequest request) {
        try {
            documentRef = encodeParam(documentRef);
            String clientContextToken = request.getHeader(CLIENT_CONTEXT_PARAMETER);
            DocumentConfigResponse view = this.memorandumApiService.getDocumentConfig(documentRef, clientContextToken);
            return ResponseEntity.ok().body(view);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting document config  - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while getting document config ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/userGuidance", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getUserGuidance(@PathVariable("documentRef") String documentRef) {
        try {
            String userGuidance = this.memorandumApiService.fetchUserGuidance(documentRef);
            return ResponseEntity.ok().body(userGuidance);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get user guidance for memorandum " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get user guidance for memorandum",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/download-clean-version", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> downloadCleanVersion(@PathVariable("documentRef") String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            byte[] cleanVersion = this.memorandumApiService.downloadCleanVersion(documentRef);
            final String jobFileName = documentRef + "_AKN2DW_CLEAN_" + System.currentTimeMillis() + ".docx";
            // create the HttpHeaders object and set the Content-Type header
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Disposition", "attachment; filename=\"" + jobFileName + "\"");
            return new ResponseEntity<>(cleanVersion, headers, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to download clean version for memorandum " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to download clean version for memorandum",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/clean-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> showCleanVersion(@PathVariable("documentRef") String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            DocumentViewResponse cleanVersion = this.memorandumApiService.showCleanVersion(documentRef);
            return ResponseEntity.ok().body(cleanVersion);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get  clean version for memorandum " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get clean version for memorandum",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/{documentRef}/toggle-trackchange-enabled", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> toggleTrackChangeEnabled(@PathVariable("documentRef") String documentRef,
                                                           @RequestBody ToggleTrackChangeEnabledRequest toggleTrackChangeEnabledRequest
    ) {
        try {
            documentRef = encodeParam(documentRef);
            boolean isTrackChangesEnabled = toggleTrackChangeEnabledRequest.isTrackChangedEnabled();
            boolean response = memorandumApiService.toggleTrackChangeEnabled(isTrackChangesEnabled, documentRef);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred while toggling Track change enabled- " + e);
            return new ResponseEntity<>("Unexpected error occurred while toggling Track change enabled",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
