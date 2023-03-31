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


import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.services.api.CouncilExplanatoryApiService;
import eu.europa.ec.leos.services.dto.request.InsertElementRequest;
import eu.europa.ec.leos.services.dto.request.SaveIntermediateVersionRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.ShowCleanVersionResponse;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/secured/council_explanatory/")
@Instance(InstanceType.COUNCIL)
public class CouncilExplanatoryController {

    private static final Logger LOG = LoggerFactory.getLogger(CouncilExplanatoryController.class);
    @Autowired
    private CouncilExplanatoryApiService explanatoryApiService;

    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/save-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveExplanatoryElement(@PathVariable("documentRef") String documentRef,
                                                         @PathVariable("elementName") String elementName,
                                                         @PathVariable("elementId") String elementId,
                                                         @RequestBody String elementContent) {
        try {
            DocumentViewResponse explanatory = this.explanatoryApiService.saveElement(documentRef, elementId, elementName, elementContent);
            return ResponseEntity.ok().body(explanatory);
        } catch (Exception e) {
            LOG.error("Error occurred while getting explanatory element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occured while getting explanatory element", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @DeleteMapping(value = "/{documentRef}/element/{elementName}/{elementId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> deleteExplanatoryElement(@PathVariable("documentRef") String documentRef,
                                                           @PathVariable("elementName") String elementName,
                                                           @PathVariable("elementId") String elementId) {
        try {
            DocumentViewResponse explanatory = this.explanatoryApiService.deleteBlock(documentRef, elementName, elementId);
            return ResponseEntity.ok().body(explanatory);
        } catch (Exception e) {
            LOG.error("Error occured while getting anex element - " + e.getMessage());
            return new ResponseEntity<>("Unexpcted error occured while getting explanatory element", HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }


    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/insert-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> insertExplanatoryElement(@PathVariable("documentRef") String documentRef,
                                                           @PathVariable("elementName") String elementName,
                                                           @PathVariable("elementId") String elementId,
                                                           @RequestBody InsertElementRequest request) {
        try {
            DocumentViewResponse explanatory = this.explanatoryApiService.insertElement(documentRef, elementName, elementId, request.getPosition());
            return ResponseEntity.ok().body(explanatory);
        } catch (Exception e) {
            LOG.error("Error occured while getting anex element - " + e.getMessage());
            return new ResponseEntity<>("Unexpcted error occured while getting explanatory element", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/merge-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> mergeExplanatoryElement(@PathVariable("documentRef") String documentRef,
                                                          @PathVariable("elementName") String elementTag,
                                                          @PathVariable("elementId") String elementId,
                                                          @RequestBody String elementContent) {
        try {
            DocumentViewResponse explanatory = this.explanatoryApiService.mergeElement(documentRef, elementContent, elementTag, elementId);
            return ResponseEntity.ok().body(explanatory);
        } catch (Exception e) {
            LOG.error("Error occurred while getting trying to merge on explanatory - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while merging elements ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @GetMapping(value = "/{documentRef}/recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getRecentChanges(@PathVariable("documentRef") String documentRef) {
        try {
            List<VersionVO> recentMinorVersions = this.explanatoryApiService.getRecentMinorVersions(documentRef);
            return ResponseEntity.ok().body(recentMinorVersions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting recent changes - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting recent changes ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping(value = "/{documentRef}/save-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveExplanatoryVersion(@PathVariable("documentRef") String documentRef,
                                                         @RequestBody SaveIntermediateVersionRequest saveEvent
    ) {
        try {
            List<VersionVO> versions = this.explanatoryApiService.saveDocument(documentRef, saveEvent.getCheckinComment(), saveEvent.getVersionType());
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while saving explanatory version - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while saving explanatory version ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping(value = "/{documentRef}/save-toc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveToc(@PathVariable("documentRef") String documentRef,
                                          @RequestBody SaveTocRequestEvent saveTocRequestEvent
    ) {
        try {
            List<TableOfContentItemVO> toc = this.explanatoryApiService.saveToC(documentRef, saveTocRequestEvent.getTableOfContentItemVOs());
            return ResponseEntity.ok().body(toc);
        } catch (Exception e) {
            LOG.error("Error occurred while getting saving toc - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while saving toc ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getVersionData(@PathVariable("documentRef") String documentRef) {
        try {
            List<VersionVO> versions = this.explanatoryApiService.getVersionsData(documentRef);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting explanatory versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/getToc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getToc(@PathVariable("documentRef") String documentRef,
                                         @RequestParam("tocMode") TocMode tocMode
    ) {
        try {
            List<TableOfContentItemVO> toc = this.explanatoryApiService.getToc(documentRef, tocMode);
            return ResponseEntity.ok().body(toc);
        } catch (Exception e) {
            LOG.error("Error occurred while getting explanatory toc items - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting explanatory toc items", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/getTocItems", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getTocItems(@PathVariable("documentRef") String documentRef) {
        try {
            List<TocItem> tocItems = this.explanatoryApiService.getTocItems(documentRef);
            return ResponseEntity.ok().body(tocItems);
        } catch (Exception e) {
            LOG.error("Error occurred while getting explanatory toc items - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting explanatory toc items", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @GetMapping(value = "/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getExplanatory(@PathVariable("documentRef") String documentRef) {
        try {
            DocumentViewResponse explanatory = this.explanatoryApiService.getDocument(documentRef);
            return ResponseEntity.ok().body(explanatory);
        } catch (Exception e) {
            LOG.error("Error occurred while getting explanatory document - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting explanatory document", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/search-text", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getSearchResults(@PathVariable("documentRef") String documentRef,
                                                   @RequestParam String searchText,
                                                   @RequestParam boolean matchCase,
                                                   @RequestParam boolean completeWords) {
        try {
            List<SearchMatchVO> explanatory = this.explanatoryApiService.searchTextInDocument(documentRef, searchText, matchCase, completeWords);
            return ResponseEntity.ok().body(explanatory);
        } catch (Exception e) {
            LOG.error("Error occurred while getting explanatory search results - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while fetching search results for explanatory ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{versionId}/show-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> showExplanatoryVersion(@PathVariable("versionId") String versionId) {
        try {
            DocumentViewResponse contentHtml = this.explanatoryApiService.showVersion(versionId);
            return ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            LOG.error("Error occurred while getting explanatory version {} , error {}: - ", versionId, e.getMessage());
            return new ResponseEntity<>("Unexpected error while trying to get explanatory version as html ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{newVersionId}/compare/{oldVersionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> compareExplanatoryVersions(@PathVariable("newVersionId") String newVersionId,
                                                             @PathVariable("oldVersionId") String oldVersionId) {
        try {
            String contentHtml = this.explanatoryApiService.compare(newVersionId, oldVersionId);
            return ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            LOG.error("Error occurred while comparing old :{} with new {} versions ", oldVersionId, newVersionId);
            return new ResponseEntity<>("Unexpected error while trying to get explanatory version as html ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/restore/{targetVersion}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> restoreExplanatoryVersion(@PathVariable("documentRef") String documentRef,
                                                            @PathVariable("targetVersion") String targetVersion) {
        try {
            DocumentViewResponse explanatory = this.explanatoryApiService.restoreToVersion(documentRef, targetVersion);
            return ResponseEntity.ok().body(explanatory);
        } catch (Exception e) {
            LOG.error("Error occured while getting anex element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error while trying to restore version ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/element/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getExplanatoryElement(@PathVariable("documentRef") String documentRef,
                                                        @PathVariable("elementId") String elementId,
                                                        @PathVariable("elementTagName") String elementTagName) {
        try {
            EditElementResponse response = this.explanatoryApiService.editElement(documentRef, elementId, elementTagName);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting explanatory element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error while getting explanatory element ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/download-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> downloadCurrentVersion(@PathVariable("documentRef") String documentRef,
                                                         @RequestParam("isWithAnnotation") boolean isWithAnnotation) {
        try {
            byte[] response = this.explanatoryApiService.downloadVersion(documentRef, isWithAnnotation);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting downloading version - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while getting downloading version", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/download-xml-version", produces = MediaType.APPLICATION_XML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> downloadXmlVersion(@PathVariable("documentRef") String documentRef,
                                                     @RequestParam("versionId") String versionId) {
        try {
            byte[] response = this.explanatoryApiService.downloadXmlVersionFiles(documentRef, versionId);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting downloading xml version - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while  downloading xml version", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/replace-one", produces = MediaType.TEXT_XML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> replaceOneText(@PathVariable("documentRef") String documentRef,
                                                 @RequestBody ReplaceMatchRequest request) {
        try {
            byte[] response = this.explanatoryApiService.replaceOneTextInDocument(request);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting downloading xml version - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while  downloading xml version", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/replace-all", produces = MediaType.TEXT_XML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> replaceAllText(@PathVariable("documentRef") String documentRef,
                                                 @RequestBody ReplaceAllMatchRequest request) {
        try {
            byte[] response = this.explanatoryApiService.replaceAllTextInDocument(request);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting downloading xml version - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while  downloading xml version", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/save-after-replace", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveAllAfterReplace(@PathVariable("documentRef") String documentRef,
                                                      @RequestBody SaveAfterReplaceRequest request) {
        try {
            DocumentViewResponse view = this.explanatoryApiService.saveAfterReplace(request);
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
            DocumentConfigResponse view = this.explanatoryApiService.getDocumentConfig(documentRef);
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
            String userGuidance = this.explanatoryApiService.fetchUserGuidance(documentRef);
            return ResponseEntity.ok().body(userGuidance);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get user guidance for council_explanatory " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get user guidance for council_explanatory", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/download-clean-version", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> downloadCleanVersion(@PathVariable("documentRef") String documentRef) {
        try {
            byte[] cleanVersion = this.explanatoryApiService.downloadCleanVersion(documentRef);
            return ResponseEntity.ok().body(cleanVersion);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get download clean version for council_explanatory " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get download clean version for council_explanatory", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/clean-version", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> showCleanVersion(@PathVariable("documentRef") String documentRef) {
        try {
            ShowCleanVersionResponse cleanVersion = this.explanatoryApiService.showCleanVersion(documentRef);
            return ResponseEntity.ok().body(cleanVersion);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get  clean version for council_explanatory " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get clean version for explanatory", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
