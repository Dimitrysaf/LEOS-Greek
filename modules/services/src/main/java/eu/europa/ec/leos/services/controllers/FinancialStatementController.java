package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.services.api.GenericDocumentApiService;
import eu.europa.ec.leos.services.dto.request.SaveIntermediateVersionRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.RefreshElementResponse;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;

// This controller is going to be used as a Generic controller for all documents
// The 'financial-statement' request path will be replaced by any document category.
@RestController
@RequestMapping(value = "/secured/stat_financ_legis")
public class FinancialStatementController {

    private GenericDocumentApiService genericDocumentApiService;

    public FinancialStatementController(GenericDocumentApiService genericDocumentApiService) {
        this.genericDocumentApiService = Objects.requireNonNull(genericDocumentApiService);
    }

    @GetMapping(value = "/{reference}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public DocumentViewResponse getDocumentByRef(@PathVariable("reference") String reference) {
        // When the controller will be used as generic document controller the category will be part of the path.
        DocumentViewResponse response = this.genericDocumentApiService.getDocumentByRef(reference);
        return response;
    }

    @GetMapping(value = "/{documentRef}/getToc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<TableOfContentItemVO> getToc(@PathVariable("documentRef") String docRef,
                                             @RequestParam("tocMode") TocMode tocMode) {
        // When the controller will be used as generic document controller the category will be part of the path.
        List<TableOfContentItemVO> tableOfContent = this.genericDocumentApiService.getTableOfContent(docRef, tocMode);
        return tableOfContent;
    }

    @GetMapping(value = "/{documentRef}/getTocItems", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<TocItem> getTocItems(@PathVariable("documentRef") String documentRef) {
        List<TocItem> tocItems = this.genericDocumentApiService.getTocItems(documentRef);
        return tocItems;
    }

    @GetMapping(value = "/{documentRef}/version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<VersionVO> getVersionData(@PathVariable("documentRef") String documentRef) {
        List<VersionVO> versions = this.genericDocumentApiService.getVersionsData(documentRef);
        return versions;
    }

    @GetMapping(value = "/{documentRef}/document-config", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public DocumentConfigResponse getDocumentConfig(@PathVariable("documentRef") String documentRef) {
        DocumentConfigResponse config = this.genericDocumentApiService.getDocumentConfig(documentRef);
        return config;
    }

    @GetMapping(value = "/{documentRef}/recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<VersionVO> getRecentChanges(@PathVariable("documentRef") String documentRef) {
        List<VersionVO> recentMinorVersions = this.genericDocumentApiService.getRecentMinorVersions(documentRef);
        return recentMinorVersions;
    }

    // TODO when refactor: the endpoint path should be /version/{id} in order to follow the REST APIs resources naming.
    @GetMapping(value = "/{versionId}/show-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public DocumentViewResponse getVersion(@PathVariable("versionId") String versionId) {
        DocumentViewResponse version = this.genericDocumentApiService.getVersion(versionId);
        return version;
    }

    @PostMapping(value = "/{documentRef}/save-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<VersionVO> saveVersion(@PathVariable("documentRef") String documentRef,
                                       @RequestBody SaveIntermediateVersionRequest request) {
        List<VersionVO> versions = this.genericDocumentApiService.saveDocument(documentRef, request.getVersionType(), request.getCheckinComment());
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
        DocumentViewResponse response = this.genericDocumentApiService.restoreToVersion(documentRef, targetVersion);
        return response;
    }

    // TODO on Refactor set the path to /{documentRef/element/{elementId}/{elementName. The "/save-element" is not needed.
    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/save-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public RefreshElementResponse saveElement(@PathVariable("documentRef") String documentRef,
                                              @PathVariable("elementName") String elementName,
                                              @PathVariable("elementId") String elementId,
                                              @RequestBody String elementContent) throws Exception {
        RefreshElementResponse response = this.genericDocumentApiService.saveElement(documentRef, elementId, elementName, elementContent);
        return response;
    }


    @GetMapping(value = "/{documentRef}/element/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public EditElementResponse getElement(@PathVariable("documentRef") String documentRef,
                                          @PathVariable("elementId") String elementId,
                                          @PathVariable("elementTagName") String elementTagName) {
        EditElementResponse response = this.genericDocumentApiService.getElement(documentRef, elementId, elementTagName);
        return response;
    }

    @GetMapping(value = "/{documentRef}/userGuidance", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public String getUserGuidance(@PathVariable("documentRef") String documentRef) {
        String userGuidance = this.genericDocumentApiService.getUserGuidance(documentRef);
        return userGuidance;
    }

    @GetMapping(value = "/{documentRef}/search-text", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<SearchMatchVO> getSearchResults(@PathVariable("documentRef") String documentRef,
                                                   @RequestParam String searchText,
                                                   @RequestParam boolean matchCase,
                                                   @RequestParam boolean completeWords) throws Exception {
            List<SearchMatchVO> searchMatch = this.genericDocumentApiService.searchTextInDocument(documentRef, searchText, matchCase, completeWords);
            return searchMatch;
    }

    @GetMapping(value = "/{newVersionId}/compare/{oldVersionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> compareDocumentVersions(@PathVariable("newVersionId") String newVersionId,
                                                      @PathVariable("oldVersionId") String oldVersionId) {
        try {
            String contentHtml = this.genericDocumentApiService.compare(newVersionId, oldVersionId);
            return ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            return new ResponseEntity<>("Unexpected error while trying to get document version as html ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
