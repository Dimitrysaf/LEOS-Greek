package eu.europa.ec.leos.services.controllers;

import com.google.common.collect.ImmutableMap;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.model.action.TrackChangeActionType;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.services.api.FinancialStatementApiService;
import eu.europa.ec.leos.services.api.GenericDocumentApiService;
import eu.europa.ec.leos.services.api.GenericDocumentTocApiService;
import eu.europa.ec.leos.services.dto.coedition.CoEditionContext;
import eu.europa.ec.leos.services.dto.request.SaveIntermediateVersionRequest;
import eu.europa.ec.leos.services.dto.request.ToggleTrackChangeEnabledRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.SaveElementResponse;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.structure.TocItem;
import org.apache.chemistry.opencmis.commons.exceptions.CmisBaseException;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;

// This controller is going to be used as a Generic controller for all documents
// The 'financial-statement' request path will be replaced by any document category.
@RestController
@RequestMapping(value = "/secured/stat_financ_legis")
public class FinancialStatementController {
    private static final Logger LOG = LoggerFactory.getLogger(FinancialStatementController.class);

    private FinancialStatementApiService financialStatementApiService;

    private GenericDocumentApiService genericDocumentApiService;
    private GenericDocumentTocApiService genericDocumentTocApiService;
    @Autowired
    private CoEditionContext coEditionContext;

    public FinancialStatementController(GenericDocumentApiService genericDocumentApiService,
                                        GenericDocumentTocApiService genericDocumentTocApiService,
                                        FinancialStatementApiService financialStatementApiService) {
        this.genericDocumentTocApiService = Objects.requireNonNull(genericDocumentTocApiService);
        this.genericDocumentApiService = Objects.requireNonNull(genericDocumentApiService);
        this.financialStatementApiService = Objects.requireNonNull(financialStatementApiService);
    }

    @GetMapping(value = "/{reference}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public DocumentViewResponse getDocumentByRef(@PathVariable("reference") String reference) {
        // When the controller will be used as generic document controller the category will be part of the path.
        reference = encodeParam(reference);
        DocumentViewResponse response = this.genericDocumentApiService.getDocumentByRef(reference);
        return response;
    }

    @GetMapping(value = "/{documentRef}/getToc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<TableOfContentItemVO> getToc(@PathVariable("documentRef") String docRef,
                                             @RequestParam("tocMode") TocMode tocMode) {
        // When the controller will be used as generic document controller the category will be part of the path.
        docRef = encodeParam(docRef);
        List<TableOfContentItemVO> tableOfContent = this.genericDocumentTocApiService.getTableOfContent(docRef, tocMode);
        return tableOfContent;
    }

    @GetMapping(value = "/{documentRef}/getTocItems", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<TocItem> getTocItems(@PathVariable("documentRef") String documentRef) {
        documentRef = encodeParam(documentRef);
        List<TocItem> tocItems = this.genericDocumentApiService.getTocItems(documentRef);
        return tocItems;
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
    @ResponseStatus(HttpStatus.OK)
    public List<VersionVO> getMajorVersionsData(@PathVariable("documentRef") String documentRef,
                                                @RequestParam int pageIndex, @RequestParam int pageSize) {
        documentRef = encodeParam(documentRef);
        return this.genericDocumentApiService.getMajorVersionsData(documentRef, pageIndex, pageSize);
    }

    @GetMapping(value = "/{documentRef}/count-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> countMajorVersionsData(@PathVariable("documentRef") String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            int versions = this.genericDocumentApiService.countMajorVersionsData(documentRef);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting document versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/document-config", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public DocumentConfigResponse getDocumentConfig(@PathVariable("documentRef") String documentRef) {
        documentRef = encodeParam(documentRef);
        DocumentConfigResponse config = this.genericDocumentApiService.getDocumentConfig(documentRef);
        return config;
    }

    @GetMapping(value = "/{documentRef}/recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<VersionVO> getRecentChanges(@PathVariable("documentRef") String documentRef,
                                            @RequestParam int pageIndex, @RequestParam int pageSize) {
        documentRef = encodeParam(documentRef);
        List<VersionVO> recentMinorVersions = this.genericDocumentApiService.getRecentMinorVersions(documentRef,
                pageIndex, pageSize);
        return recentMinorVersions;
    }

    @GetMapping(value = "/{documentRef}/count-recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public int countRecentChanges(@PathVariable("documentRef") String documentRef) {
        documentRef = encodeParam(documentRef);
        return this.genericDocumentApiService.countRecentMinorVersions(documentRef);
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
    public ResponseEntity<Object> getIntermediateVersionData(@PathVariable("documentRef") String documentRef,
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

    // TODO when refactor: the endpoint path should be /version/{id} in order to follow the REST APIs resources naming.
    @GetMapping(value = "/{versionId}/show-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public DocumentViewResponse getVersion(@PathVariable("versionId") String versionId) {
        versionId = encodeParam(versionId);
        DocumentViewResponse version = this.genericDocumentApiService.getVersion(versionId);
        return version;
    }

    @PostMapping(value = "/{documentRef}/save-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<VersionVO> saveVersion(@PathVariable("documentRef") String documentRef,
                                       @RequestBody SaveIntermediateVersionRequest request) {
        documentRef = encodeParam(documentRef);
        List<VersionVO> versions = this.genericDocumentApiService.saveDocument(documentRef, request.getVersionType(),
                request.getCheckinComment());
        return versions;
    }

    // TODO when refactor: This API call is redundant. Its the same as getVersion. Then the FE should only parse the XML.
    @GetMapping(value = "/{documentRef}/download-xml-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public byte[] downloadVersion(@PathVariable("documentRef") String documentRef,
                                  @RequestParam("versionId") String versionId) {
        DocumentViewResponse version = this.genericDocumentApiService.getVersion(versionId);
        return version.getEditableXml().getBytes(StandardCharsets.UTF_8);
    }

    @GetMapping(value = "/{documentRef}/restore/{targetVersion}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public DocumentViewResponse restoreVersion(@PathVariable("documentRef") String documentRef,
                                               @PathVariable("targetVersion") String targetVersion) {
        documentRef = encodeParam(documentRef);
        targetVersion = encodeParam(targetVersion);
        DocumentViewResponse response = this.genericDocumentApiService.restoreToVersion(documentRef, targetVersion);
        return response;
    }

    // TODO on Refactor set the path to /{documentRef/element/{elementId}/{elementName. The "/save-element" is not needed.
    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/save-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Object> saveElement(@PathVariable("documentRef") String documentRef,
                                              @PathVariable("elementName") String elementName,
                                              @PathVariable("elementId") String elementId,
                                              @RequestHeader("presenterId") String presenterId,
                                              @RequestBody String elementContent) throws Exception {
        try {
            documentRef = encodeParam(documentRef);
            elementName = encodeParam(elementName);
            elementId = encodeParam(elementId);
            presenterId = encodeParam(presenterId);
            SaveElementResponse response = this.genericDocumentApiService.saveElement(documentRef, elementId,
                    elementName, elementContent);
            coEditionContext.sendUpdatedElements(documentRef, presenterId, response, null);
            return ResponseEntity.ok(response);
        } catch (CmisBaseException cmisBaseException) {
            LOG.error("---[FINANCIAL STATEMENT] [CMIS EXCEPTION] --- Error saving element : {} ",
                    cmisBaseException.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }


    @GetMapping(value = "/{documentRef}/element/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public EditElementResponse getElement(@PathVariable("documentRef") String documentRef,
                                          @PathVariable("elementId") String elementId,
                                          @PathVariable("elementTagName") String elementTagName) {
        documentRef = encodeParam(documentRef);
        elementId = encodeParam(elementId);
        elementTagName = encodeParam(elementTagName);
        EditElementResponse response = this.genericDocumentApiService.getElement(documentRef, elementId,
                elementTagName);
        return response;
    }

    @GetMapping(value = "/{documentRef}/userGuidance", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public String getUserGuidance(@PathVariable("documentRef") String documentRef) {
        documentRef = encodeParam(documentRef);
        String userGuidance = this.genericDocumentApiService.getUserGuidance(documentRef);
        return userGuidance;
    }

    @PostMapping(value = "/{documentRef}/search-text", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<SearchMatchVO> getSearchResults(@PathVariable("documentRef") String documentRef,
                                                @RequestParam String searchText,
                                                @RequestParam boolean matchCase,
                                                @RequestParam boolean completeWords,
                                                @RequestBody(required = false) String tempUpdatedContentXML)
            throws Exception {
        documentRef = encodeParam(documentRef);
        return this.genericDocumentApiService.searchTextInDocument(documentRef, searchText, matchCase, completeWords,
                tempUpdatedContentXML);
    }

    @GetMapping(value = "/{newVersionId}/compare/{oldVersionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> compareDocumentVersions(@PathVariable("newVersionId") String newVersionId,
                                                          @PathVariable("oldVersionId") String oldVersionId) {
        try {
            newVersionId = encodeParam(newVersionId);
            oldVersionId = encodeParam(oldVersionId);
            String contentHtml = this.genericDocumentApiService.compare(newVersionId, oldVersionId);
            return ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            return new ResponseEntity<>("Unexpected error while trying to get document version as html ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @DeleteMapping(value = "/{documentRef}/element/{elementName}/{elementId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> deleteDocumentElement(@PathVariable("documentRef") String documentRef,
            @PathVariable("elementName") String elementName,
            @PathVariable("elementId") String elementId) {
        try {
            documentRef = encodeParam(documentRef);
            elementName = encodeParam(elementName);
            elementId = encodeParam(elementId);
            DocumentViewResponse bill = this.financialStatementApiService.deleteBlock(documentRef, elementName, elementId);
            return ResponseEntity.ok().body(bill);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill  element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while deleting bill element", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{documentRef}/replace-one", produces = MediaType.TEXT_XML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> replaceOneText(@PathVariable("documentRef") String documentRef,
                                                 @RequestBody ReplaceMatchRequest request) {
        try {
            byte[] response = this.genericDocumentApiService.replaceOneTextInDocument(request);
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
            byte[] response = this.genericDocumentApiService.replaceAllTextInDocument(request);
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
            DocumentViewResponse view = this.genericDocumentApiService.saveAfterReplace(request);
            return ResponseEntity.ok().body(view);
        } catch (Exception e) {
            LOG.error("Error occurred  while saving after replace all - " + e.getMessage());
            return new ResponseEntity<>("Error occurred while saving after replace all",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping(value = "/{documentRef}/download-clean-version", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> downloadCleanVersion(@PathVariable("documentRef") String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            byte[] cleanVersion = this.genericDocumentApiService.downloadCleanVersion(documentRef);
            final String jobFileName = documentRef + "_AKN2DW_CLEAN_" + System.currentTimeMillis() + ".docx";
            // create the HttpHeaders object and set the Content-Type header
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Disposition", "attachment; filename=\"" + jobFileName + "\"");
            return new ResponseEntity<>(cleanVersion, headers, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error(
                    "Error occurred  while trying to download clean version for financial statement " + e.getMessage());
            return new ResponseEntity<>(
                    "Error occurred  while trying to download clean version for financial statement",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentRef}/clean-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> showCleanVersion(@PathVariable("documentRef") String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            DocumentViewResponse cleanVersion = this.genericDocumentApiService.showCleanVersion(documentRef);
            return ResponseEntity.ok().body(cleanVersion);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get  clean version for financial statement " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get clean version for financial statement",
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
            boolean response = financialStatementApiService.toggleTrackChangeEnabled(isTrackChangesEnabled,
                    documentRef);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred while toggling Track change enabled- " + e);
            return new ResponseEntity<>("Unexpected error occurred while toggling Track change enabled",
                    HttpStatus.INTERNAL_SERVER_ERROR);
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
            DocumentViewResponse response = this.financialStatementApiService.rejectChange(documentRef, elementId, elementTagName, trackChangeActionType, presenterId);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while rejecting change - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error while rejecting change ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/{documentRef}/finalise-document", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> finaliseDocument(@PathVariable("documentRef") String documentRef) {
        documentRef = encodeParam(documentRef);
        try {
            this.genericDocumentApiService.finaliseDocument(documentRef);
            return ResponseEntity.ok().body(ImmutableMap.of("result", "Document successfully finalised!"));
        } catch (Exception e) {
            return new ResponseEntity<>("Unexpected error while finalising document", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
