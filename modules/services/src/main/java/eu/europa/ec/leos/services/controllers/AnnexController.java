package eu.europa.ec.leos.services.controllers;


import eu.europa.ec.leos.domain.cmis.document.Annex;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.services.api.AnnexApiService;
import eu.europa.ec.leos.services.dto.request.InsertElementRequest;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/secured/annex/")
public class AnnexController {

    private static final Logger LOG = LoggerFactory.getLogger(AnnexController.class);
    @Autowired
    private AnnexApiService annexAPIService;

    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/save-element", produces = MediaType.APPLICATION_XML_VALUE )
    @ResponseBody
    public ResponseEntity<Object> saveAnnexElement(@PathVariable("documentRef") String documentRef,
                                                   @PathVariable("elementName") String elementName,
                                                   @PathVariable("elementId") String elementId,
                                                   @RequestBody String elementContent) {
        try {
            byte[] annexXml = this.annexAPIService.saveAnnexElement(documentRef,elementId,elementName,elementContent);
            return  ResponseEntity.ok().body(annexXml);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex element - " + e.getMessage());
            return   new ResponseEntity<>("Unexpected error occured while getting annex element",HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @DeleteMapping(value = "/{documentRef}/element/{elementName}/{elementId}", produces = MediaType.APPLICATION_XML_VALUE )
    @ResponseBody
    public ResponseEntity<Object> deleteAnnexElement(@PathVariable("documentRef") String documentRef,
                                                     @PathVariable("elementName") String elementName,
                                                     @PathVariable("elementId") String elementId) {
        try {
            byte[] annexXml = this.annexAPIService.deleteAnnexBlock(documentRef,elementName,elementId);
            return  ResponseEntity.ok().body(annexXml);
        } catch (Exception e) {
            LOG.error("Error occured while getting anex element - " + e.getMessage());
            return   new ResponseEntity<>("Unexpcted error occured while getting annex element",HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }


    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/insert-element", produces = MediaType.APPLICATION_XML_VALUE )
    @ResponseBody
    public ResponseEntity<Object> insertAnnexElement(@PathVariable("documentRef") String documentRef,
                                                     @PathVariable("elementName") String elementName,
                                                     @PathVariable("elementId") String elementId,
                                                     @RequestBody InsertElementRequest request) {
        try {
            byte[] annexXml = this.annexAPIService.insertAnnexElement(documentRef,elementName,elementId,request.getPosition());
            return  ResponseEntity.ok().body(annexXml);
        } catch (Exception e) {
            LOG.error("Error occured while getting anex element - " + e.getMessage());
            return   new ResponseEntity<>("Unexpcted error occured while getting annex element",HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/merge-element", produces = MediaType.APPLICATION_XML_VALUE )
    @ResponseBody
    public ResponseEntity<Object> mergeAnnexElement(@PathVariable("documentRef") String documentRef,
                                                    @PathVariable("elementName") String elementTag,
                                                    @PathVariable("elementId") String elementId,
                                                    @RequestBody String  elementContent) {
        try {
            byte[] annexXml = this.annexAPIService.mergeElement(documentRef,elementContent,elementTag,elementId);
            return  ResponseEntity.ok().body(annexXml);
        } catch (Exception e) {
            LOG.error("Error occurred while getting trying to merge on annex - " + e.getMessage());
            return   new ResponseEntity<>("Unexpected error occurred while merging elements ",HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }



    @GetMapping(value = "/{documentId}/{documentRef}/recent-changes", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> getRecentChanges(@PathVariable("documentId") String documentId,
                                                   @PathVariable("documentRef") String documentRef
    ) {
        try {
            List<Annex> annexes = this.annexAPIService.getRecentMinorVersions(documentId,documentRef);
            return  ResponseEntity.ok().body(annexes);
        } catch (Exception e) {
            LOG.error("Error occurred while getting recent changes - " + e.getMessage());
            return   new ResponseEntity<>("Unexpected error occurred while getting recent changes ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentId}/{documentRef}/version-data", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> getVersionData(@PathVariable("documentId") String documentId,
                                                 @PathVariable("documentRef") String documentRef
    ) {
        try {
            List<VersionVO> versions = this.annexAPIService.getVersionsData(documentId,documentRef);
            return  ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex versioning data - " + e.getMessage());
            return   new ResponseEntity<>("Unexpected error occurred while getting versioning data", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/getTocItems", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> getTocItems(@PathVariable("documentRef") String documentRef,
                                              @RequestParam("tocMode")TocMode tocMode
    ) {
        try {
            List<TableOfContentItemVO> tocItems = this.annexAPIService.getTocItems(documentRef,tocMode);
            return  ResponseEntity.ok().body(tocItems);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex toc items - " + e.getMessage());
            return   new ResponseEntity<>("Unexpected error occurred while getting annex toc items", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> getAnnex(@PathVariable("documentRef") String documentRef) {
        try {
            byte[] annex = this.annexAPIService.getAnnex(documentRef);
            return  ResponseEntity.ok().body(annex);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex document - " + e.getMessage());
            return   new ResponseEntity<>("Unexpected error occurred while getting annex document", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/search-text", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> getSearchResults(@PathVariable("documentRef") String documentRef,
                                                   @RequestParam String searchText,
                                                   @RequestParam boolean matchCase,
                                                   @RequestParam boolean completeWords) {
        try {
            List<SearchMatchVO> annex = this.annexAPIService.searchTextInDocument(documentRef,searchText,matchCase,completeWords);
            return  ResponseEntity.ok().body(annex);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex search results - " + e.getMessage());
            return   new ResponseEntity<>("Unexpected error occurred while fetching search results for annex ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{versionId}/show-version", produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> showAnnexVersion(@PathVariable("versionId") String versionId) {
        try {
            String  contentHtml = this.annexAPIService.showVersion(versionId);
            return  ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex version {} , error {}: - ",versionId,e.getMessage());
            return   new ResponseEntity<>("Unexpected error while trying to get annex version as html ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{newVersionId}/compare/{oldVersionId}", produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> compareAnnexVersions(@PathVariable("newVersionId") String newVersionId,
                                                       @PathVariable("oldVersionId") String oldVersionId) {
        try {
            String  contentHtml = this.annexAPIService.compare(newVersionId, oldVersionId);
            return  ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            LOG.error("Error occurred while comparing old :{} with new {} versions ", oldVersionId , newVersionId);
            return   new ResponseEntity<>("Unexpected error while trying to get annex version as html ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/restore/{targetVersion}", produces = MediaType.APPLICATION_XML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> restoreAnnexVersion(@PathVariable("documentRef") String documentRef,
                                                      @PathVariable("targetVersion") String targetVersion) {
        try {
            byte[]  annex = this.annexAPIService.restoreToVersion(documentRef, targetVersion);
            return  ResponseEntity.ok().body(annex);
        } catch (Exception e) {
            LOG.error("Error occured while getting anex element - " + e.getMessage());
            return   new ResponseEntity<>("Unexpected error while trying to restore version ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/element/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getAnnexElement(@PathVariable("documentRef") String documentRef,
                                                  @PathVariable("elementId") String elementId,
                                                  @PathVariable("elementTagName") String elementTagName) {
        try {
            EditElementResponse response = this.annexAPIService.editElement(documentRef,elementId,elementTagName);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting annex element - " + e.getMessage());
            return   new ResponseEntity<>("Unexpected error while getting annex element ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
