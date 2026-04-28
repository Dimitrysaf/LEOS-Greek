package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.services.dto.request.InsertElementRequest;
import eu.europa.ec.leos.services.dto.request.SaveIntermediateVersionRequest;
import eu.europa.ec.leos.services.dto.request.ToggleTrackChangeEnabledRequest;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
import eu.europa.ec.leos.services.request.SaveTocRequestEvent;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Tag(name = "Cover Page")
public interface CoverPageApi {

    @Operation(summary = "Get cover page document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getCoverPage(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Get table of contents")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "TOC retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/getToc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getToc(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "TOC mode") @RequestParam("tocMode") TocMode tocMode,
            HttpServletRequest request);

    @Operation(summary = "Get TOC items")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "TOC items retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/getTocItems", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getTocItems(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Save cover page element")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element saved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/save-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> saveCoverPageElement(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element name") @PathVariable("elementName") String elementName,
            @Parameter(description = "Element ID") @PathVariable("elementId") String elementId,
            @Parameter(description = "Is split") @RequestParam(required = false) boolean isSplit,
            @Parameter(description = "Presenter ID") @RequestHeader("presenterId") String presenterId,
            @Parameter(description = "Element content") @RequestBody String elementContent);

    @Operation(summary = "Delete cover page element")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element deleted successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping(value = "/{documentRef}/element/{elementName}/{elementId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> deleteCoverPageElement(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element name") @PathVariable("elementName") String elementName,
            @Parameter(description = "Element ID") @PathVariable("elementId") String elementId);

    @Operation(summary = "Insert cover page element")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element inserted successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/insert-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> insertCoverPageElement(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element name") @PathVariable("elementName") String elementName,
            @Parameter(description = "Element ID") @PathVariable("elementId") String elementId,
            @Parameter(description = "Insert element request") @RequestBody InsertElementRequest request);

    @Operation(summary = "Merge cover page element")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element merged successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/merge-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> mergeCoverPageElement(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element tag") @PathVariable("elementName") String elementTag,
            @Parameter(description = "Element ID") @PathVariable("elementId") String elementId,
            @Parameter(description = "Element content") @RequestBody String elementContent);

    @Operation(summary = "Get recent changes")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Recent changes retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getRecentChanges(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Page index") @RequestParam int pageIndex,
            @Parameter(description = "Page size") @RequestParam int pageSize);

    @Operation(summary = "Count recent changes")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/count-recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> countRecentChanges(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Save cover page version")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version saved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/{documentRef}/save-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> saveCoverPageVersion(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Save version request") @RequestBody SaveIntermediateVersionRequest saveEvent);

    @Operation(summary = "Save table of contents")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "TOC saved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/{documentRef}/save-toc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> saveToc(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Save TOC request") @RequestBody SaveTocRequestEvent saveTocRequestEvent,
            HttpServletRequest request);

    @Operation(summary = "Search version data")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/search-versions", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> searchVersionData(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Author key") @RequestParam String authorKey,
            @Parameter(description = "Version type") @RequestParam String type);

    @Operation(summary = "Get major versions data")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getMajorVersionsData(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Page index") @RequestParam int pageIndex,
            @Parameter(description = "Page size") @RequestParam int pageSize);

    @Operation(summary = "Count major versions data")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/count-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> countMajorVersionsData(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Get intermediate version data")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/intermediate-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getIntermediateVersionData(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Current intermediate version") @RequestParam String currIntVersion,
            @Parameter(description = "Page index") @RequestParam int pageIndex,
            @Parameter(description = "Page size") @RequestParam int pageSize);

    @Operation(summary = "Count intermediate version data")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/count-intermediate-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> countIntermediateVersionData(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Current intermediate version") @RequestParam String currIntVersion);

    @Operation(summary = "Get search results")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Search results retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/{documentRef}/search-text", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getSearchResults(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Search text") @RequestParam String searchText,
            @Parameter(description = "Match case") @RequestParam boolean matchCase,
            @Parameter(description = "Complete words") @RequestParam boolean completeWords,
            @Parameter(description = "Temporary updated content XML") @RequestBody(required = false) String tempUpdatedContentXML);

    @Operation(summary = "Show cover page version")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{versionId}/show-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> showCoverPageVersion(@Parameter(description = "Version ID") @PathVariable("versionId") String versionId);

    @Operation(summary = "Show original language version", description = "Shows the latest major version of the equivalent document in the original language")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/original-language-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> showOriginalLanguageVersion(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Compare cover page versions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Comparison retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{newVersionId}/compare/{oldVersionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> compareCoverPageVersions(
            @Parameter(description = "New version ID") @PathVariable("newVersionId") String newVersionId,
            @Parameter(description = "Old version ID") @PathVariable("oldVersionId") String oldVersionId);

    @Operation(summary = "Restore cover page version")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version restored successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/restore/{targetVersion}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> restoreCoverPageVersion(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Target version") @PathVariable("targetVersion") String targetVersion);

    @Operation(summary = "Get cover page element")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/element/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getCoverPageElement(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element ID") @PathVariable("elementId") String elementId,
            @Parameter(description = "Element tag name") @PathVariable("elementTagName") String elementTagName);

    @Operation(summary = "Download current version")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version downloaded successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/download-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> downloadCurrentVersion(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Is with annotation") @RequestParam("isWithAnnotation") boolean isWithAnnotation);

    @Operation(summary = "Download XML version")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "XML version downloaded successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/download-xml-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> downloadXmlVersion(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Version ID") @RequestParam("versionId") String versionId);

    @Operation(summary = "Replace one text")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Text replaced successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/{documentRef}/replace-one", produces = MediaType.TEXT_XML_VALUE)
    @ResponseBody
    ResponseEntity<Object> replaceOneText(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Replace match request") @RequestBody ReplaceMatchRequest request);

    @Operation(summary = "Replace all text")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Text replaced successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/{documentRef}/replace-all", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> replaceAllText(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Replace all match request") @RequestBody ReplaceAllMatchRequest request);

    @Operation(summary = "Save all after replace")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Saved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/{documentRef}/save-after-replace", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> saveAllAfterReplace(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Save after replace request") @RequestBody SaveAfterReplaceRequest request);

    @Operation(summary = "Get document config")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Config retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/document-config", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getDocumentConfig(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            HttpServletRequest request);

    @Operation(summary = "Get user guidance")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User guidance retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/userGuidance", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getUserGuidance(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Download clean version")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Clean version downloaded successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/download-clean-version", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    ResponseEntity<Object> downloadCleanVersion(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Show clean version")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Clean version retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/clean-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> showCleanVersion(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Toggle track change enabled")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Track change toggled successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/{documentRef}/toggle-trackchange-enabled", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> toggleTrackChangeEnabled(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Toggle track change request") @RequestBody ToggleTrackChangeEnabledRequest toggleTrackChangeEnabledRequest);
}
