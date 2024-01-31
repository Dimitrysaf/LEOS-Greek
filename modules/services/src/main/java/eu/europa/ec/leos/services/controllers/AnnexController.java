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
import eu.europa.ec.leos.model.action.TrackChangeActionType;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.services.api.AnnexApiService;
import eu.europa.ec.leos.services.api.GenericDocumentApiService;
import eu.europa.ec.leos.services.dto.coedition.CoEditionContext;
import eu.europa.ec.leos.services.dto.request.InsertElementRequest;
import eu.europa.ec.leos.services.dto.request.SaveIntermediateVersionRequest;
import eu.europa.ec.leos.services.dto.request.ToggleTrackChangeEnabledRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.SaveElementResponse;
import eu.europa.ec.leos.services.dto.response.TocAndAncestorsResponse;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@RestController
@RequestMapping("/secured/annex/")
public class AnnexController {

    private static final Logger LOG = LoggerFactory.getLogger(AnnexController.class);
    private static final String ERROR_OCCURRED_WHILE_GETTING_DOWNLOADING_XML_VERSION = "Error occurred  while getting downloading xml version - ";
    private static final String ERROR_OCCURRED_WHILE_DOWNLOADING_XML_VERSION = "Error occurred  while  downloading xml version";
    private static final String ERROR_OCCURED_WHILE_GETTING_ANEX_ELEMENT = "Error occured while getting anex element - {}";
    @Autowired
    private AnnexApiService annexAPIService;
    @Autowired
    private GenericDocumentApiService genericDocumentApiService;
    @Autowired
    private CoEditionContext coEditionContext;

    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/save-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveAnnexElement(@PathVariable("documentRef") String documentRef,
                                                   @PathVariable("elementName") String elementName,
                                                   @PathVariable("elementId") String elementId,
                                                   @RequestParam(required = false) boolean isSplit,
                                                   @RequestHeader("presenterId") String presenterId,
                                                   @RequestBody String elementContent) {
        try {
            SaveElementResponse newElement = this.annexAPIService.saveElement(documentRef, elementId, elementName,
                    elementContent, isSplit);
            coEditionContext.sendUpdatedElements(documentRef, presenterId, newElement);
            return ResponseEntity.ok().body(newElement);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occured while getting annex element",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @DeleteMapping(value = "/{documentRef}/element/{elementName}/{elementId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> deleteAnnexElement(@PathVariable("documentRef") String documentRef,
                                                     @PathVariable("elementName") String elementName,
                                                     @PathVariable("elementId") String elementId) {
        try {
            DocumentViewResponse annexXml = this.annexAPIService.deleteBlock(documentRef, elementName, elementId);
            return ResponseEntity.ok().body(annexXml);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURED_WHILE_GETTING_ANEX_ELEMENT, e.getMessage());
            return new ResponseEntity<>("Unexpcted error occured while getting annex element",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }


    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/insert-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> insertAnnexElement(@PathVariable("documentRef") String documentRef,
                                                     @PathVariable("elementName") String elementName,
                                                     @PathVariable("elementId") String elementId,
                                                     @RequestBody InsertElementRequest request) {
        try {
            DocumentViewResponse annexXml = this.annexAPIService.insertElement(documentRef, elementName, elementId,
                    request.getPosition());
            return ResponseEntity.ok().body(annexXml);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURED_WHILE_GETTING_ANEX_ELEMENT, e.getMessage());
            return new ResponseEntity<>("Unexpcted error occured while getting annex element",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/merge-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> mergeAnnexElement(@PathVariable("documentRef") String documentRef,
                                                    @PathVariable("elementName") String elementTag,
                                                    @PathVariable("elementId") String elementId,
                                                    @RequestBody String elementContent) {
        try {
            DocumentViewResponse annexXml = this.annexAPIService.mergeElement(documentRef, elementContent, elementTag,
                    elementId);
            return ResponseEntity.ok().body(annexXml);
        } catch (Exception e) {
            LOG.error("Error occurred while getting trying to merge on bill - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while merging elements ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getRecentChanges(@PathVariable("documentRef") String documentRef,
                                                   @RequestParam int pageIndex, @RequestParam int pageSize) {
        try {
            List<VersionVO> recentMinorVersions = this.genericDocumentApiService.getRecentMinorVersions(documentRef,
                    pageIndex, pageSize);
            return ResponseEntity.ok().body(recentMinorVersions);
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
    public ResponseEntity<Object> saveAnnexVersion(@PathVariable("documentRef") String documentRef,
                                                   @RequestBody SaveIntermediateVersionRequest saveEvent
    ) {
        try {
            List<VersionVO> versions = this.annexAPIService.saveDocument(documentRef, saveEvent.getCheckinComment(),
                    saveEvent.getVersionType());
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while saving annex version - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while saving annex version ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping(value = "/{documentRef}/save-toc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveToc(@PathVariable("documentRef") String documentRef,
                                          @RequestBody SaveTocRequestEvent saveTocRequestEvent
    ) {
        try {
            List<TableOfContentItemVO> toc = this.annexAPIService.saveToC(documentRef,
                    saveTocRequestEvent.getTableOfContentItemVOs());
            return ResponseEntity.ok().body(toc);
        } catch (Exception e) {
            LOG.error("Error occurred while getting saving toc - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while saving toc ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getMajorVersionsData(@PathVariable("documentRef") String documentRef,
                                                       @RequestParam int pageIndex, @RequestParam int pageSize) {
        try {
            List<VersionVO> versions = this.genericDocumentApiService.getMajorVersionsData(documentRef, pageIndex,
                    pageSize);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/search-versions", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> searchVersionData(@PathVariable("documentRef") String documentRef,
                                                    @RequestParam String authorKey,
                                                    @RequestParam String type) {
        try {
            List<VersionVO> versions = this.genericDocumentApiService.searchVersions(documentRef, authorKey, type);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/count-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> countMajorVersionsData(@PathVariable("documentRef") String documentRef) {
        try {
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
            int count = this.genericDocumentApiService.countIntermediateVersionsData(documentRef, currIntVersion);
            return ResponseEntity.ok().body(count);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/getToc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getToc(@PathVariable("documentRef") String documentRef,
                                         @RequestParam("tocMode") TocMode tocMode
    ) {
        try {
            List<TableOfContentItemVO> toc = this.annexAPIService.getToc(documentRef, tocMode);
            return ResponseEntity.ok().body(toc);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex toc items - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting annex toc items",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/getTocItems", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getTocItems(@PathVariable("documentRef") String documentRef) {
        try {
            List<TocItem> tocItems = this.annexAPIService.getTocItems(documentRef);
            return ResponseEntity.ok().body(tocItems);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex toc items - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting annex toc items",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @GetMapping(value = "/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getAnnex(@PathVariable("documentRef") String documentRef) {
        try {
            DocumentViewResponse annex = this.annexAPIService.getDocument(documentRef);
            return ResponseEntity.ok().body(annex);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex document - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting annex document",
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
            List<SearchMatchVO> annex = this.annexAPIService.searchTextInDocument(documentRef, searchText, matchCase,
                    completeWords, tempUpdatedContentXML);
            return ResponseEntity.ok().body(annex);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex search results - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while fetching search results for annex ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{versionId}/show-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> showAnnexVersion(@PathVariable("versionId") String versionId) {
        try {
            DocumentViewResponse contentHtml = this.annexAPIService.showVersion(versionId);
            return ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex version {} , error {}: - ", versionId, e.getMessage());
            return new ResponseEntity<>("Unexpected error while trying to get annex version as html ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{newVersionId}/compare/{oldVersionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> compareAnnexVersions(@PathVariable("newVersionId") String newVersionId,
                                                       @PathVariable("oldVersionId") String oldVersionId) {
        try {
            String contentHtml = this.annexAPIService.compare(newVersionId, oldVersionId);
            return ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            LOG.error("Error occurred while comparing old :{} with new {} versions ", oldVersionId, newVersionId);
            return new ResponseEntity<>("Unexpected error while trying to get annex version as html ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/restore/{targetVersion}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> restoreAnnexVersion(@PathVariable("documentRef") String documentRef,
                                                      @PathVariable("targetVersion") String targetVersion) {
        try {
            DocumentViewResponse annex = this.annexAPIService.restoreToVersion(documentRef, targetVersion);
            return ResponseEntity.ok().body(annex);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURED_WHILE_GETTING_ANEX_ELEMENT, e.getMessage());
            return new ResponseEntity<>("Unexpected error while trying to restore version ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/element/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getAnnexElement(@PathVariable("documentRef") String documentRef,
                                                  @PathVariable("elementId") String elementId,
                                                  @PathVariable("elementTagName") String elementTagName) {
        try {
            EditElementResponse response = this.annexAPIService.editElement(documentRef, elementId, elementTagName);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting annex element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error while getting annex element ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/download-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> downloadCurrentVersion(@PathVariable("documentRef") String documentRef,
                                                         @RequestParam("isWithAnnotation") boolean isWithAnnotation) {
        try {
            byte[] response = this.annexAPIService.downloadVersion(documentRef, isWithAnnotation);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting downloading version - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while getting downloading version",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/download-xml-version", produces = MediaType.APPLICATION_XML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> downloadXmlVersion(@PathVariable("documentRef") String documentRef,
                                                     @RequestParam("versionId") String versionId) {
        try {
            byte[] response = this.annexAPIService.downloadXmlVersionFiles(documentRef, versionId);
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
            byte[] response = this.annexAPIService.replaceOneTextInDocument(request);
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
            byte[] response = this.annexAPIService.replaceAllTextInDocument(request);
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
            DocumentViewResponse view = this.annexAPIService.saveAfterReplace(request);
            return ResponseEntity.ok().body(view);
        } catch (Exception e) {
            LOG.error("Error occurred  while saving after replace all - " + e.getMessage());
            return new ResponseEntity<>("Error occurred while saving after replace all",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/document-config", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getDocumentConfig(@PathVariable("documentRef") String documentRef) {
        try {
            DocumentConfigResponse view = this.annexAPIService.getDocumentConfig(documentRef);
            return ResponseEntity.ok().body(view);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting document config  - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while getting document config ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/switch-annex-structure", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> switchAnnexStructure(@PathVariable("documentRef") String documentRef) {
        try {
            DocumentViewResponse view = this.annexAPIService.changeAnnexStructureType(documentRef);
            return ResponseEntity.ok().body(view);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to switch annex structure" + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to switch annex ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/renumber-document", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> renumberAnnex(@PathVariable("documentRef") String documentRef) {
        try {
            DocumentViewResponse view = this.annexAPIService.renumberAnnex(documentRef);
            return ResponseEntity.ok().body(view);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to renumber annex " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to renumber annex ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/userGuidance", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getUserGuidance(@PathVariable("documentRef") String documentRef) {
        try {
            String userGuidance = this.annexAPIService.fetchUserGuidance(documentRef);
            return ResponseEntity.ok().body(userGuidance);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get user guidance for annex " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get user guidance for annex",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/download-clean-version", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> downloadCleanVersion(@PathVariable("documentRef") String documentRef) {
        try {
            byte[] cleanVersion = this.annexAPIService.downloadCleanVersion(documentRef);
            final String jobFileName = documentRef + "_AKN2DW_CLEAN_" + System.currentTimeMillis() + ".docx";
            // create the HttpHeaders object and set the Content-Type header
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Disposition", "attachment; filename=\"" + jobFileName + "\"");
            return new ResponseEntity<>(cleanVersion, headers, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to download clean version for annex " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to download clean version for annex",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/clean-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> showCleanVersion(@PathVariable("documentRef") String documentRef) {
        try {
            DocumentViewResponse cleanVersion = this.annexAPIService.showCleanVersion(documentRef);
            return ResponseEntity.ok().body(cleanVersion);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get  clean version for annex " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get clean version for annex",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/fetch-toc-ancestors", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> fetchTocAndAncestors(@PathVariable(value = "documentRef") String documentRef,
                                                       @RequestParam(value = "elementIds", required = false) List<String> elementIds) {
        try {
            TocAndAncestorsResponse tocAncestors = this.annexAPIService.fetchTocAncestor(documentRef, elementIds);
            return ResponseEntity.ok().body(tocAncestors);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get toc ancestors for annex " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get toc ancestors for annex",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping(value = "/{documentRef}/accept-change/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> acceptChange(@PathVariable("documentRef") String documentRef,
                                               @PathVariable("elementId") String elementId,
                                               @PathVariable("elementTagName") String elementTagName,
                                               @RequestParam("trackChangeAction") String trackChangeAction,
                                               @RequestHeader("presenterId") String presenterId) {
        try {
            TrackChangeActionType trackChangeActionType = TrackChangeActionType.of(trackChangeAction);
            DocumentViewResponse response = this.annexAPIService.acceptChange(documentRef, elementId, elementTagName, trackChangeActionType, presenterId);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while accepting change - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error while accepting change ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/reject-change/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> rejectChange(@PathVariable("documentRef") String documentRef,
                                               @PathVariable("elementId") String elementId,
                                               @PathVariable("elementTagName") String elementTagName,
                                               @RequestParam("trackChangeAction") String trackChangeAction,
                                               @RequestHeader("presenterId") String presenterId) {
        try {
            TrackChangeActionType trackChangeActionType = TrackChangeActionType.of(trackChangeAction);
            DocumentViewResponse response = this.annexAPIService.rejectChange(documentRef, elementId, elementTagName, trackChangeActionType, presenterId);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while rejecting change - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error while rejecting change ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/{documentRef}/toggle-trackchange-enabled", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> toggleTrackChangeEnabled(@PathVariable("documentRef") String documentRef,
                                                           @RequestBody ToggleTrackChangeEnabledRequest toggleTrackChangeEnabledRequest
    ) {
        try {
            boolean isTrackChangesEnabled = toggleTrackChangeEnabledRequest.isTrackChangedEnabled();
            boolean response = this.annexAPIService.toggleTrackChangeEnabled(isTrackChangesEnabled, documentRef);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred while toggling Track change enabled- " + e);
            return new ResponseEntity<>("Unexpected error occurred while toggling Track change enabled",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
