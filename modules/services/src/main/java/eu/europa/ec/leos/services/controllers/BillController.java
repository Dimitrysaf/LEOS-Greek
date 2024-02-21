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
import eu.europa.ec.leos.services.api.BillApiService;
import eu.europa.ec.leos.services.api.GenericDocumentApiService;
import eu.europa.ec.leos.services.dto.coedition.CoEditionContext;
import eu.europa.ec.leos.services.dto.request.ImportElementRequest;
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
import eu.europa.ec.leos.services.request.SearchForImportCriteriaRequest;
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

import java.util.List;

import static eu.europa.ec.leos.services.support.XercesUtils.encodeParam;

@RestController
@RequestMapping("/secured/bill/")
public class BillController {

    private static final Logger LOG = LoggerFactory.getLogger(BillController.class);
    private static final String ERROR_OCCURRED_WHILE_GETTING_DOWNLOADING_XML_VERSION = "Error occurred  while getting downloading xml version - {}";
    private static final String ERROR_OCCURRED_WHILE_DOWNLOADING_XML_VERSION = "Error occurred  while  downloading xml version";
    @Autowired
    private BillApiService billApiService;
    @Autowired
    private GenericDocumentApiService genericDocumentApiService;
    @Autowired
    private CoEditionContext coEditionContext;

    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/save-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveBillElement(@PathVariable("documentRef") String documentRef,
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
            elementContent = encodeParam(elementContent);
            SaveElementResponse updatedElement = this.billApiService.saveElement(documentRef, elementId, elementName, elementContent, isSplit);
            coEditionContext.sendUpdatedElements(documentRef, presenterId, updatedElement);
            return ResponseEntity.ok().body(updatedElement);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occured while getting bill element", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(value = "/{documentRef}/element/{elementName}/{elementId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> deleteBillElement(@PathVariable("documentRef") String documentRef,
                                                    @PathVariable("elementName") String elementName,
                                                    @PathVariable("elementId") String elementId) {
        try {
            documentRef = encodeParam(documentRef);
            elementName = encodeParam(elementName);
            elementId = encodeParam(elementId);
            DocumentViewResponse bill = this.billApiService.deleteBlock(documentRef, elementName, elementId);
            return ResponseEntity.ok().body(bill);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill  element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while deleting bill element", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/insert-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> insertBillElement(@PathVariable("documentRef") String documentRef,
                                                    @PathVariable("elementName") String elementName,
                                                    @PathVariable("elementId") String elementId,
                                                    @RequestBody InsertElementRequest request) {
        try {
            documentRef = encodeParam(documentRef);
            elementName = encodeParam(elementName);
            elementId = encodeParam(elementId);
            DocumentViewResponse bill = this.billApiService.insertElement(documentRef, elementName, elementId, request.getPosition());
            return ResponseEntity.ok().body(bill);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while inserting bill element", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/merge-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> mergeBillElement(@PathVariable("documentRef") String documentRef,
                                                   @PathVariable("elementName") String elementTag,
                                                   @PathVariable("elementId") String elementId,
                                                   @RequestBody String elementContent) {
        try {
            documentRef = encodeParam(documentRef);
            elementTag = encodeParam(elementTag);
            elementId = encodeParam(elementId);
            elementContent = encodeParam(elementContent);
            DocumentViewResponse bill = this.billApiService.mergeElement(documentRef, elementContent, elementTag, elementId);
            return ResponseEntity.ok().body(bill);
        } catch (Exception e) {
            LOG.error("Error occurred while getting trying to merge on bill - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while merging bill elements ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getRecentChanges(@PathVariable("documentRef") String documentRef,
                                                   @RequestParam int pageIndex, @RequestParam int pageSize) {
        try {
            documentRef = encodeParam(documentRef);
            List<VersionVO> recentMinorVersions = this.genericDocumentApiService.getRecentMinorVersions(documentRef,
                    pageIndex, pageSize);
            return ResponseEntity.ok().body(recentMinorVersions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting recent changes - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting recent changes ", HttpStatus.INTERNAL_SERVER_ERROR);
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
            return new ResponseEntity<>("Unexpected error occurred while getting recent changes ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/{documentRef}/save-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveBillVersion(@PathVariable("documentRef") String documentRef,
                                                  @RequestBody SaveIntermediateVersionRequest saveEvent
    ) {
        try {
            documentRef = encodeParam(documentRef);
            saveEvent.setCheckinComment(encodeParam(saveEvent.getCheckinComment()));
            List<VersionVO> versions = this.billApiService.saveDocument(documentRef, saveEvent.getCheckinComment(),
                    saveEvent.getVersionType());
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting recent changes - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting recent changes ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/{documentRef}/save-toc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveToc(@PathVariable("documentRef") String documentRef,
                                          @RequestBody SaveTocRequestEvent saveTocRequestEvent
    ) {
        try {
            documentRef = encodeParam(documentRef);
            List<TableOfContentItemVO> toc = this.billApiService.saveToC(documentRef,
                    saveTocRequestEvent.getTableOfContentItemVOs());
            return ResponseEntity.ok().body(toc);
        } catch (Exception e) {
            LOG.error("Error occurred while saving toc - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while saving toc recent", HttpStatus.INTERNAL_SERVER_ERROR);
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
            LOG.error("Error occurred while getting bill versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data", HttpStatus.INTERNAL_SERVER_ERROR);
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
            LOG.error("Error occurred while getting bill versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data", HttpStatus.INTERNAL_SERVER_ERROR);
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
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/count-intermediate-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getIntermediateVersionData(@PathVariable("documentRef") String documentRef,
                                                             @RequestParam String currIntVersion) {
        try {
            documentRef = encodeParam(documentRef);
            currIntVersion = encodeParam(currIntVersion);
            int count = this.genericDocumentApiService.countIntermediateVersionsData(documentRef, currIntVersion);
            return ResponseEntity.ok().body(count);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/search-versions", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> searchVersionData(@PathVariable("documentRef") String documentRef,
                                                    @RequestParam(required = false, defaultValue = "") String authorKey,
                                                    @RequestParam(required = false, defaultValue = "") String type) {
        try {
            documentRef = encodeParam(documentRef);
            authorKey = encodeParam(authorKey);
            type = encodeParam(type);
            List<VersionVO> versions = this.genericDocumentApiService.searchVersions(documentRef, authorKey, type);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/getToc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getToc(@PathVariable("documentRef") String documentRef,
                                         @RequestParam("tocMode") TocMode tocMode
    ) {
        try {
            documentRef = encodeParam(documentRef);
            List<TableOfContentItemVO> toc = this.billApiService.getToc(documentRef, tocMode);
            return ResponseEntity.ok().body(toc);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill toc items - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting bill toc items", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/getTocItems", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getTocItems(@PathVariable("documentRef") String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            List<TocItem> tocItems = this.billApiService.getTocItems(documentRef);
            return ResponseEntity.ok().body(tocItems);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill toc items - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting bill toc items", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getBill(@PathVariable("documentRef") String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            DocumentViewResponse bill = this.billApiService.getDocument(documentRef);
            return ResponseEntity.ok().body(bill);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill document - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting bill document", HttpStatus.INTERNAL_SERVER_ERROR);
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
            searchText = encodeParam(searchText);
            tempUpdatedContentXML = encodeParam(tempUpdatedContentXML);
            List<SearchMatchVO> bill = this.billApiService.searchTextInDocument(documentRef, searchText, matchCase,
                    completeWords, tempUpdatedContentXML);
            return ResponseEntity.ok().body(bill);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill search results - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while fetching search results for bill ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{versionId}/show-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> showBillVersion(@PathVariable("versionId") String versionId) {
        try {
            versionId = encodeParam(versionId);
            DocumentViewResponse contentHtml = this.billApiService.showVersion(versionId);
            return ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill version {} , error {}: - ", versionId, e.getMessage());
            return new ResponseEntity<>("Unexpected error while trying to get bill version as html ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{newVersionId}/compare/{oldVersionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> compareBillVersions(@PathVariable("newVersionId") String newVersionId,
                                                      @PathVariable("oldVersionId") String oldVersionId) {
        try {
            newVersionId = encodeParam(newVersionId);
            oldVersionId = encodeParam(oldVersionId);
            String contentHtml = this.billApiService.compare(newVersionId, oldVersionId);
            return ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            LOG.error("Error occurred while comparing old :{} with new {} versions ", oldVersionId, newVersionId);
            return new ResponseEntity<>("Unexpected error while trying to get bill version as html ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/restore/{targetVersion}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> restoreBillVersion(@PathVariable("documentRef") String documentRef,
                                                     @PathVariable("targetVersion") String targetVersion) {
        try {
            documentRef = encodeParam(documentRef);
            targetVersion = encodeParam(targetVersion);
            DocumentViewResponse bill = this.billApiService.restoreToVersion(documentRef, targetVersion);
            return ResponseEntity.ok().body(bill);
        } catch (Exception e) {
            LOG.error("Error occured while getting anex element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error while trying to restore version ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/element/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getBillElement(@PathVariable("documentRef") String documentRef,
                                                 @PathVariable("elementId") String elementId,
                                                 @PathVariable("elementTagName") String elementTagName) {
        try {
            documentRef = encodeParam(documentRef);
            elementId = encodeParam(elementId);
            elementTagName = encodeParam(elementTagName);
            EditElementResponse response = this.billApiService.editElement(documentRef, elementId, elementTagName);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting bill element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error while getting bill element ", HttpStatus.INTERNAL_SERVER_ERROR);
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
            documentRef = encodeParam(documentRef);
            elementId = encodeParam(elementId);
            elementTagName = encodeParam(elementTagName);
            trackChangeAction = encodeParam(trackChangeAction);
            presenterId = encodeParam(presenterId);
            TrackChangeActionType trackChangeActionType = TrackChangeActionType.of(trackChangeAction);
            DocumentViewResponse response = this.billApiService.acceptChange(documentRef, elementId, elementTagName, trackChangeActionType, presenterId);
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
            documentRef = encodeParam(documentRef);
            elementId = encodeParam(elementId);
            elementTagName = encodeParam(elementTagName);
            trackChangeAction = encodeParam(trackChangeAction);
            presenterId = encodeParam(presenterId);
            TrackChangeActionType trackChangeActionType = TrackChangeActionType.of(trackChangeAction);
            DocumentViewResponse response = this.billApiService.rejectChange(documentRef, elementId, elementTagName, trackChangeActionType, presenterId);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while rejecting change - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error while rejecting change ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/download-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> downloadCurrentVersion(@PathVariable("documentRef") String documentRef,
                                                         @RequestParam("isWithAnnotation") boolean isWithAnnotation) {
        try {
            documentRef = encodeParam(documentRef);
            byte[] response = this.billApiService.downloadVersion(documentRef, isWithAnnotation);
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
            documentRef = encodeParam(documentRef);
            versionId = encodeParam(versionId);
            byte[] response = this.billApiService.downloadXmlVersionFiles(documentRef, versionId);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURRED_WHILE_GETTING_DOWNLOADING_XML_VERSION, e.getMessage());
            return new ResponseEntity<>(ERROR_OCCURRED_WHILE_DOWNLOADING_XML_VERSION, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/replace-one", produces = MediaType.TEXT_XML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> replaceOneText(@PathVariable("documentRef") String documentRef,
                                                 @RequestBody ReplaceMatchRequest request) {
        try {
            request.setReplaceText(encodeParam(request.getReplaceText()));
            request.setSearchText(encodeParam(request.getSearchText()));
            request.setDocumentRef(encodeParam(request.getDocumentRef()));
            request.setTempUpdatedContentXML(encodeParam(request.getTempUpdatedContentXML()));
            byte[] response = this.billApiService.replaceOneTextInDocument(request);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURRED_WHILE_GETTING_DOWNLOADING_XML_VERSION, e.getMessage());
            return new ResponseEntity<>(ERROR_OCCURRED_WHILE_DOWNLOADING_XML_VERSION, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/replace-all", produces = MediaType.TEXT_XML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> replaceAllText(@PathVariable("documentRef") String documentRef,
                                                 @RequestBody ReplaceAllMatchRequest request) {
        try {
            request.setReplaceText(encodeParam(request.getReplaceText()));
            request.setSearchText(encodeParam(request.getSearchText()));
            request.setDocumentRef(encodeParam(request.getDocumentRef()));
            request.setTempUpdatedContentXML(encodeParam(request.getTempUpdatedContentXML()));
            byte[] response = this.billApiService.replaceAllTextInDocument(request);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURRED_WHILE_GETTING_DOWNLOADING_XML_VERSION, e.getMessage());
            return new ResponseEntity<>(ERROR_OCCURRED_WHILE_DOWNLOADING_XML_VERSION, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/save-after-replace", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> saveAllAfterReplace(@PathVariable("documentRef") String documentRef,
                                                      @RequestBody SaveAfterReplaceRequest request) {
        try {
            DocumentViewResponse view = this.billApiService.saveAfterReplace(request);
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
            documentRef = encodeParam(documentRef);
            DocumentConfigResponse view = this.billApiService.getDocumentConfig(documentRef);
            return ResponseEntity.ok().body(view);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting document config  - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while getting document config ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/search-for-import", produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> searchForImportFromJournal(@PathVariable("documentRef") String documentRef,
                                                             @RequestBody SearchForImportCriteriaRequest searchForImportCriteriaRequest) {
        try {
            String view = this.billApiService.searchForImport(searchForImportCriteriaRequest.getNumber(),
                    searchForImportCriteriaRequest.getYear(), searchForImportCriteriaRequest.getType());
            return ResponseEntity.ok().body(view);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to search from journal bill " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to search from journal bill",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/renumber-document", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> renumberBill(@PathVariable("documentRef") String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            DocumentViewResponse view = this.billApiService.renumberBill(documentRef);
            return ResponseEntity.ok().body(view);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to renumber bill " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to renumber bill ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/userGuidance", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getUserGuidance(@PathVariable("documentRef") String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            String userGuidance = this.billApiService.fetchUserGuidance(documentRef);
            return ResponseEntity.ok().body(userGuidance);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get user guidance for annex " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get user guidance for annex", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/download-clean-version", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> downloadCleanVersion(@PathVariable("documentRef") String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            byte[] cleanVersion = this.billApiService.downloadCleanVersion(documentRef);
            final String jobFileName = documentRef + "_AKN2DW_CLEAN_" + System.currentTimeMillis() + ".docx";
            // create the HttpHeaders object and set the Content-Type header
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Disposition", "attachment; filename=\"" + jobFileName + "\"");
            return new ResponseEntity<>(cleanVersion, headers, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to download clean version for bill " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to download clean version for bill ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/clean-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> showCleanVersion(@PathVariable("documentRef") String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            DocumentViewResponse cleanVersion = this.billApiService.showCleanVersion(documentRef);
            return ResponseEntity.ok().body(cleanVersion);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get  clean version for bill " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get clean version for bill", HttpStatus.INTERNAL_SERVER_ERROR);
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
            boolean response = billApiService.toggleTrackChangeEnabled(isTrackChangesEnabled, documentRef);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred while toggling Track change enabled- " + e);
            return new ResponseEntity<>("Unexpected error occurred while toggling Track change enabled", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/import-elements", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> importElements(@PathVariable("documentRef") String documentRef,
                                                 @RequestBody ImportElementRequest request) {
        documentRef = encodeParam(documentRef);
        DocumentViewResponse view = this.billApiService.importElements(documentRef, request);
        return ResponseEntity.ok().body(view);
    }

    @GetMapping(value = "/{documentRef}/fetch-toc-ancestors", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> fetchTocAndAncestors(@PathVariable("documentRef") String documentRef,
                                                       @RequestParam(value = "elementIds", required = false) List<String> elementIds) {
        try {
            documentRef = encodeParam(documentRef);
            TocAndAncestorsResponse tocAncestors = this.billApiService.fetchTocAncestor(documentRef, elementIds);
            return ResponseEntity.ok().body(tocAncestors);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get toc ancestors for bill " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get toc ancestors for bill", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
