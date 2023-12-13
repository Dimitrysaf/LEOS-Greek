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
import eu.europa.ec.leos.services.dto.response.RefreshElementResponse;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
import eu.europa.ec.leos.services.request.SaveTocRequestEvent;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/secured/coverPage/")
public class CoverPageController {
    private static final Logger LOG = LoggerFactory.getLogger(CoverPageController.class);
    private static final String ERROR_OCCURED_WHILE_GETTING_ANEX_ELEMENT = "Error occured while getting anex element - ";
    private static final String ERROR_OCCURRED_WHILE_GETTING_DOWNLOADING_XML_VERSION = "Error occurred  while getting downloading xml version - ";
    private static final String ERROR_OCCURRED_WHILE_DOWNLOADING_XML_VERSION = "Error occurred  while  downloading xml version";

    @Autowired
    CoverPageApiService coverPageApiService;
    @Autowired
    private GenericDocumentApiService genericDocumentApiService;
    @Autowired
    private CoEditionContext coEditionContext;

    @GetMapping(value = "/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getCoverPage(@PathVariable("documentRef") String documentRef) {
        try {
            DocumentViewResponse coverPageDocument = this.coverPageApiService.getDocument(documentRef);
            return ResponseEntity.ok().body(coverPageDocument);
        } catch (Exception e) {
            LOG.error("Error occurred while getting coverPage document - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting coverPage document", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/getToc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getToc(@PathVariable("documentRef") String documentRef,
                                         @RequestParam("tocMode") TocMode tocMode
    ) {
        try {
            List<TableOfContentItemVO> toc = this.coverPageApiService.getToc(documentRef, tocMode);
            return ResponseEntity.ok().body(toc);
        } catch (Exception e) {
            LOG.error("Error occurred while getting coverPage toc items - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting cover page toc", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/getTocItems", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getTocItems(@PathVariable("documentRef") String documentRef) {
        try {
            List<TocItem> tocItems = this.coverPageApiService.getTocItems(documentRef);
            return ResponseEntity.ok().body(tocItems);
        } catch (Exception e) {
            LOG.error("Error occurred while getting coverpage toc items - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting cover page toc", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/save-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveCoverPageElement(@PathVariable("documentRef") String documentRef,
                                                       @PathVariable("elementName") String elementName,
                                                       @PathVariable("elementId") String elementId,
                                                       @RequestParam(required = false) boolean isSplit,
                                                       @RequestHeader("presenterId") String presenterId,
                                                       @RequestBody String elementContent) {
        try {
            RefreshElementResponse updatedElement = this.coverPageApiService.saveElement(documentRef, elementName, elementContent, elementId, isSplit);
            coEditionContext.sendUpdatedElements(documentRef, presenterId, updatedElement);
            return ResponseEntity.ok().body(updatedElement);
        } catch (Exception e) {
            LOG.error("Error occurred while getting coverPage element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occured while getting coverPage element", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @DeleteMapping(value = "/{documentRef}/element/{elementName}/{elementId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> deleteCoverPageElement(@PathVariable("documentRef") String documentRef,
                                                         @PathVariable("elementName") String elementName,
                                                         @PathVariable("elementId") String elementId) {
        try {
            DocumentViewResponse coverPage = this.coverPageApiService.deleteBlock(documentRef, elementName, elementId);
            return ResponseEntity.ok().body(coverPage);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURED_WHILE_GETTING_ANEX_ELEMENT + e.getMessage());
            return new ResponseEntity<>("Unexpcted error occured while getting coverPage element", HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }


    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/insert-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> insertCoverPageElement(@PathVariable("documentRef") String documentRef,
                                                         @PathVariable("elementName") String elementName,
                                                         @PathVariable("elementId") String elementId,
                                                         @RequestBody InsertElementRequest request) {
        try {
            DocumentViewResponse coverPage = this.coverPageApiService.insertElement(documentRef, elementName, elementId, request.getPosition());
            return ResponseEntity.ok().body(coverPage);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURED_WHILE_GETTING_ANEX_ELEMENT + e.getMessage());
            return new ResponseEntity<>("Unexpcted error occured while getting coverPage element", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/merge-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> mergeCoverPageElement(@PathVariable("documentRef") String documentRef,
                                                        @PathVariable("elementName") String elementTag,
                                                        @PathVariable("elementId") String elementId,
                                                        @RequestBody String elementContent) {
        try {
            DocumentViewResponse coverPage = this.coverPageApiService.mergeElement(documentRef, elementContent, elementTag, elementId);
            return ResponseEntity.ok().body(coverPage);
        } catch (Exception e) {
            LOG.error("Error occurred while getting trying to merge on coverpage - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while merging elements ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getRecentChanges(@PathVariable("documentRef") String documentRef, @RequestParam int pageIndex, @RequestParam int pageSize) {
        try {
            List<VersionVO> coverPagees = this.genericDocumentApiService.getRecentMinorVersions(documentRef, pageIndex, pageSize);
            return ResponseEntity.ok().body(coverPagees);
        } catch (Exception e) {
            LOG.error("Error occurred while getting recent changes - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting recent changes ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/count-recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> countRecentChanges(@PathVariable("documentRef") String documentRef) {
        try {
            int count = this.genericDocumentApiService.countRecentMinorVersions(documentRef);
            return ResponseEntity.ok().body(count);
        } catch (Exception e) {
            LOG.error("Error occurred while getting recent changes - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting recent changes ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping(value = "/{documentRef}/save-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveCoverPageVersion(@PathVariable("documentRef") String documentRef,
                                                       @RequestBody SaveIntermediateVersionRequest saveEvent
    ) {
        try {
            List<VersionVO> versions = this.coverPageApiService.saveDocument(documentRef, saveEvent.getCheckinComment(), saveEvent.getVersionType());
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while saving coverPage version - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while saving coverPage version ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping(value = "/{documentRef}/save-toc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveCoverPageVersion(@PathVariable("documentRef") String documentRef,
                                                       @RequestBody SaveTocRequestEvent saveTocRequestEvent
    ) {
        try {
            List<TableOfContentItemVO> toc = this.coverPageApiService.saveToC(documentRef, saveTocRequestEvent.getTableOfContentItemVOs());
            return ResponseEntity.ok().body(toc);
        } catch (Exception e) {
            LOG.error("Error occurred while getting saving toc - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while saving toc ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/search-versions", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> searchVersionData(@PathVariable("documentRef") String documentRef, @RequestParam String authorKey,
                                                    @RequestParam String type) {
        try {
            List<VersionVO> versions = this.genericDocumentApiService.searchVersions(documentRef, authorKey, type);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getMajorVersionsData(@PathVariable("documentRef") String documentRef, @RequestParam int pageIndex,
                                                       @RequestParam int pageSize) {
        try {
            List<VersionVO> versions = this.genericDocumentApiService.getMajorVersionsData(documentRef, pageIndex, pageSize);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting coverPage versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/count-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> countMajorVersionsData(@PathVariable("documentRef") String documentRef) {
        try {
            int versions = this.genericDocumentApiService.countMajorVersionsData(documentRef);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting cover page versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/intermediate-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getIntermediateVersionData(@PathVariable("documentRef") String documentRef, @RequestParam String currIntVersion, @RequestParam int pageIndex, @RequestParam int pageSize) {
        try {
            List<VersionVO> versions = this.genericDocumentApiService.getIntermediateVersionsData(documentRef, currIntVersion, pageIndex, pageSize);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/count-intermediate-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> countIntermediateVersionData(@PathVariable("documentRef") String documentRef, @RequestParam String currIntVersion) {
        try {
            int count = this.genericDocumentApiService.countIntermediateVersionsData(documentRef, currIntVersion);
            return ResponseEntity.ok().body(count);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data", HttpStatus.INTERNAL_SERVER_ERROR);
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
            List<SearchMatchVO> coverPage = this.coverPageApiService.searchTextInDocument(documentRef, searchText, matchCase, completeWords, tempUpdatedContentXML);
            return ResponseEntity.ok().body(coverPage);
        } catch (Exception e) {
            LOG.error("Error occurred while getting coverPage search results - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while fetching search results for coverPage ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{versionId}/show-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> showCoverPageVersion(@PathVariable("versionId") String versionId) {
        try {
            DocumentViewResponse contentHtml = this.coverPageApiService.showVersion(versionId);
            return ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            LOG.error("Error occurred while getting coverPage version {} , error {}: - ", versionId, e.getMessage());
            return new ResponseEntity<>("Unexpected error while trying to get coverPage version as html ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{newVersionId}/compare/{oldVersionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> compareCoverPageVersions(@PathVariable("newVersionId") String newVersionId,
                                                           @PathVariable("oldVersionId") String oldVersionId) {
        try {
            String contentHtml = this.coverPageApiService.compare(newVersionId, oldVersionId);
            return ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            LOG.error("Error occurred while comparing old :{} with new {} versions ", oldVersionId, newVersionId);
            return new ResponseEntity<>("Unexpected error while trying to get coverPage version as html ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/restore/{targetVersion}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> restoreCoverPageVersion(@PathVariable("documentRef") String documentRef,
                                                          @PathVariable("targetVersion") String targetVersion) {
        try {
            DocumentViewResponse coverPage = this.coverPageApiService.restoreToVersion(documentRef, targetVersion);
            return ResponseEntity.ok().body(coverPage);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURED_WHILE_GETTING_ANEX_ELEMENT + e.getMessage());
            return new ResponseEntity<>("Unexpected error while trying to restore version ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/element/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getCoverPageElement(@PathVariable("documentRef") String documentRef,
                                                      @PathVariable("elementId") String elementId,
                                                      @PathVariable("elementTagName") String elementTagName) {
        try {
            EditElementResponse response = this.coverPageApiService.editElement(documentRef, elementId, elementTagName);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting coverPage element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error while getting coverPage element ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/download-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> downloadCurrentVersion(@PathVariable("documentRef") String documentRef,
                                                         @RequestParam("isWithAnnotation") boolean isWithAnnotation) {
        try {
            byte[] response = this.coverPageApiService.downloadVersion(documentRef, isWithAnnotation);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting downloading version - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while getting downloading version", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/download-xml-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> downloadXmlVersion(@PathVariable("documentRef") String documentRef,
                                                     @RequestParam("versionId") String versionId) {
        try {
            byte[] response = this.coverPageApiService.downloadXmlVersionFiles(documentRef, versionId);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURRED_WHILE_GETTING_DOWNLOADING_XML_VERSION + e.getMessage());
            return new ResponseEntity<>(ERROR_OCCURRED_WHILE_DOWNLOADING_XML_VERSION, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/replace-one", produces = MediaType.TEXT_XML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> replaceOneText(@PathVariable("documentRef") String documentRef,
                                                 @RequestBody ReplaceMatchRequest request) {
        try {
            byte[] response = this.coverPageApiService.replaceOneTextInDocument(request);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURRED_WHILE_GETTING_DOWNLOADING_XML_VERSION + e.getMessage());
            return new ResponseEntity<>(ERROR_OCCURRED_WHILE_DOWNLOADING_XML_VERSION, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/replace-all", produces = MediaType.TEXT_XML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> replaceAllText(@PathVariable("documentRef") String documentRef,
                                                 @RequestBody ReplaceAllMatchRequest request) {
        try {
            byte[] response = this.coverPageApiService.replaceAllTextInDocument(request);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURRED_WHILE_GETTING_DOWNLOADING_XML_VERSION + e.getMessage());
            return new ResponseEntity<>(ERROR_OCCURRED_WHILE_DOWNLOADING_XML_VERSION, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/save-after-replace", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveAllAfterReplace(@PathVariable("documentRef") String documentRef,
                                                      @RequestBody SaveAfterReplaceRequest request) {
        try {
            DocumentViewResponse view = this.coverPageApiService.saveAfterReplace(request);
            return ResponseEntity.ok().body(view);
        } catch (Exception e) {
            LOG.error("Error occurred  while saving after replace all - " + e.getMessage());
            return new ResponseEntity<>("Error occurred while saving after replace all", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/document-config", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getDocumentConfig(@PathVariable("documentRef") String documentRef) {
        try {
            DocumentConfigResponse view = this.coverPageApiService.getDocumentConfig(documentRef);
            return ResponseEntity.ok().body(view);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting document config  - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while getting document config ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/userGuidance", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getUserGuidance(@PathVariable("documentRef") String documentRef) {
        try {
            String userGuidance = this.coverPageApiService.fetchUserGuidance(documentRef);
            return ResponseEntity.ok().body(userGuidance);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get user guidance for coverPage " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get user guidance for coverPage", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/download-clean-version", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> downloadCleanVersion(@PathVariable("documentRef") String documentRef) {
        try {
            byte[] cleanVersion = this.coverPageApiService.downloadCleanVersion(documentRef);
            final String jobFileName = documentRef + "_AKN2DW_CLEAN_" + System.currentTimeMillis() + ".docx";
            // create the HttpHeaders object and set the Content-Type header
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Disposition", "attachment; filename=\"" + jobFileName + "\"");
            return new ResponseEntity<>(cleanVersion, headers, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to download clean version for coverPage " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to download clean version for coverPage", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/clean-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> showCleanVersion(@PathVariable("documentRef") String documentRef) {
        try {
            DocumentViewResponse cleanVersion = this.coverPageApiService.showCleanVersion(documentRef);
            return ResponseEntity.ok().body(cleanVersion);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get  clean version for coverPage " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get clean version for coverPage", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/{documentRef}/toggle-trackchange-enabled", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> toggleTrackChangeEnabled(@PathVariable("documentRef") String documentRef,
                                                           @RequestBody() ToggleTrackChangeEnabledRequest toggleTrackChangeEnabledRequest
    ) {
        try {
            boolean isTrackChangesEnabled = toggleTrackChangeEnabledRequest.isTrackChangedEnabled();
            boolean response = coverPageApiService.toggleTrackChangeEnabled(isTrackChangesEnabled, documentRef);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred while toggling Track change enabled- " + e);
            return new ResponseEntity<>("Unexpected error occurred while toggling Track change enabled", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
