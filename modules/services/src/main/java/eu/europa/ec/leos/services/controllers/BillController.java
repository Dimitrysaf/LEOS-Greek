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


import eu.europa.ec.leos.domain.cmis.document.Bill;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.services.api.BillApiService;
import eu.europa.ec.leos.services.dto.request.InsertElementRequest;
import eu.europa.ec.leos.services.dto.request.SaveIntermediateVersionRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.request.SaveTocRequestEvent;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

import java.util.List;

@RestController
@RequestMapping("/secured/bill/")
public class BillController {

    private static final Logger LOG = LoggerFactory.getLogger(BillController.class);
    @Autowired
    private BillApiService billApiService;

    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/save-element", produces = MediaType.APPLICATION_XML_VALUE )
    @ResponseBody
    public ResponseEntity<Object> saveBillElement(@PathVariable("documentRef") String documentRef,
                                                   @PathVariable("elementName") String elementName,
                                                   @PathVariable("elementId") String elementId,
                                                   @RequestBody String elementContent) {
        try {
            DocumentViewResponse bill = this.billApiService.saveElement(documentRef,elementId,elementName,elementContent);
            return  ResponseEntity.ok().body(bill);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill element - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occured while getting bill element",HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @DeleteMapping(value = "/{documentRef}/element/{elementName}/{elementId}", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> deleteBillElement(@PathVariable("documentRef") String documentRef,
                                                     @PathVariable("elementName") String elementName,
                                                     @PathVariable("elementId") String elementId) {
        try {
            DocumentViewResponse bill = this.billApiService.deleteBlock(documentRef,elementName,elementId);
            return  ResponseEntity.ok().body(bill);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill  element - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occurred while deleting bill element",HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }


    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/insert-element", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> insertBillElement(@PathVariable("documentRef") String documentRef,
                                                     @PathVariable("elementName") String elementName,
                                                     @PathVariable("elementId") String elementId,
                                                     @RequestBody InsertElementRequest request) {
        try {
            DocumentViewResponse bill = this.billApiService.insertElement(documentRef,elementName,elementId,request.getPosition());
            return  ResponseEntity.ok().body(bill);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill element - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occurred while inserting bill element",HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/merge-element", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> mergeBillElement(@PathVariable("documentRef") String documentRef,
                                                    @PathVariable("elementName") String elementTag,
                                                    @PathVariable("elementId") String elementId,
                                                    @RequestBody String  elementContent) {
        try {
            DocumentViewResponse bill = this.billApiService.mergeElement(documentRef,elementContent,elementTag,elementId);
            return  ResponseEntity.ok().body(bill);
        } catch (Exception e) {
            LOG.error("Error occurred while getting trying to merge on bill - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occurred while merging bill elements ",HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }



    @GetMapping(value = "/{documentRef}/recent-changes", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> getRecentChanges(@PathVariable("documentRef") String documentRef) {
        try {
            List<Bill> bills = this.billApiService.getRecentMinorVersions(documentRef);
            return  ResponseEntity.ok().body(bills);
        } catch (Exception e) {
            LOG.error("Error occurred while getting recent changes - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occurred while getting recent changes ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping(value = "/{documentRef}/save-version", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> saveBillVersion(@PathVariable("documentRef") String documentRef,
                                                   @RequestBody SaveIntermediateVersionRequest saveEvent
    ) {
        try {
            List<VersionVO> versions = this.billApiService.saveDocument(documentRef,saveEvent.getCheckinComment(), saveEvent.getVersionType());
            return  ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting recent changes - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occurred while getting recent changes ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping(value = "/{documentRef}/save-toc", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> saveToc(@PathVariable("documentRef") String documentRef,
                                                  @RequestBody SaveTocRequestEvent saveTocRequestEvent
    ) {
        try {
            List<TableOfContentItemVO> toc = this.billApiService.saveToC(documentRef,saveTocRequestEvent.getTableOfContentItemVOs());
            return  ResponseEntity.ok().body(toc);
        } catch (Exception e) {
            LOG.error("Error occurred while saving toc - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occurred while saving toc recent", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @GetMapping(value = "/{documentRef}/version-data", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> getVersionData(@PathVariable("documentRef") String documentRef) {
        try {
            List<VersionVO> versions = this.billApiService.getVersionsData(documentRef);
            return  ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill versioning data - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occurred while getting versioning data", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/getToc", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> getToc(@PathVariable("documentRef") String documentRef,
                                         @RequestParam("tocMode")TocMode tocMode
    ) {
        try {
            List<TableOfContentItemVO> toc = this.billApiService.getToc(documentRef,tocMode);
            return  ResponseEntity.ok().body(toc);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill toc items - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occurred while getting bill toc items", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/getTocItems", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> getTocItems(@PathVariable("documentRef") String documentRef) {
        try {
            List<TocItem> tocItems = this.billApiService.getTocItems(documentRef);
            return  ResponseEntity.ok().body(tocItems);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill toc items - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occurred while getting bill toc items", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }



    @GetMapping(value = "/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> getBill(@PathVariable("documentRef") String documentRef) {
        try {
            DocumentViewResponse bill = this.billApiService.getDocument(documentRef);
            return  ResponseEntity.ok().body(bill);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill document - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occurred while getting bill document", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/search-text", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> getSearchResults(@PathVariable("documentRef") String documentRef,
                                                   @RequestParam String searchText,
                                                   @RequestParam boolean matchCase,
                                                   @RequestParam boolean completeWords) {
        try {
            List<SearchMatchVO> bill = this.billApiService.searchTextInDocument(documentRef,searchText,matchCase,completeWords);
            return  ResponseEntity.ok().body(bill);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill search results - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occurred while fetching search results for bill ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{versionId}/show-version", produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> showBillVersion(@PathVariable("versionId") String versionId) {
        try {
            DocumentViewResponse contentHtml = this.billApiService.showVersion(versionId);
            return  ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill version {} , error {}: - ",versionId,e.getMessage());
            return  new ResponseEntity<>("Unexpected error while trying to get bill version as html ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{newVersionId}/compare/{oldVersionId}", produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> compareBillVersions(@PathVariable("newVersionId") String newVersionId,
                                                       @PathVariable("oldVersionId") String oldVersionId) {
        try {
            String  contentHtml = this.billApiService.compare(newVersionId, oldVersionId);
            return  ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            LOG.error("Error occurred while comparing old :{} with new {} versions ", oldVersionId , newVersionId);
            return  new ResponseEntity<>("Unexpected error while trying to get bill version as html ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/restore/{targetVersion}", produces = MediaType.APPLICATION_XML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> restoreBillVersion(@PathVariable("documentRef") String documentRef,
                                                      @PathVariable("targetVersion") String targetVersion) {
        try {
            DocumentViewResponse bill = this.billApiService.restoreToVersion(documentRef, targetVersion);
            return  ResponseEntity.ok().body(bill);
        } catch (Exception e) {
            LOG.error("Error occured while getting anex element - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error while trying to restore version ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/element/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getBillElement(@PathVariable("documentRef") String documentRef,
                                                  @PathVariable("elementId") String elementId,
                                                  @PathVariable("elementTagName") String elementTagName) {
        try {
            EditElementResponse response = this.billApiService.editElement(documentRef,elementId,elementTagName);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting bill element - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error while getting bill element ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
