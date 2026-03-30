package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.services.dto.request.InsertElementRequest;
import eu.europa.ec.leos.services.dto.request.SaveIntermediateVersionRequest;
import eu.europa.ec.leos.services.dto.request.ToggleTrackChangeEnabledRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.vo.structure.TocItem;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
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

import java.util.List;

@Tag(name = "Financial Statement")
public interface FinancialStatementApi {

    @Operation(summary = "Get document by reference", description = "Retrieves the financial statement document with its content and metadata")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{reference}", produces = MediaType.APPLICATION_JSON_VALUE)
    DocumentViewResponse getDocumentByRef(@Parameter(description = "Reference") @PathVariable("reference") String reference);

    @Operation(summary = "Get table of contents", description = "Retrieves the table of contents for the financial statement in the specified mode")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "TOC retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/getToc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    List<TableOfContentItemVO> getToc(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String docRef,
            @Parameter(description = "TOC mode") @RequestParam("tocMode") TocMode tocMode);

    @Operation(summary = "Get TOC items", description = "Retrieves available table of contents item types for the financial statement")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "TOC items retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/getTocItems", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    List<TocItem> getTocItems(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Search version data", description = "Searches for versions by author and version type")
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

    @Operation(summary = "Get major versions data", description = "Retrieves major versions with pagination")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    List<VersionVO> getMajorVersionsData(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Page index") @RequestParam int pageIndex,
            @Parameter(description = "Page size") @RequestParam int pageSize);

    @Operation(summary = "Count major versions data", description = "Returns the total count of major versions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/count-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> countMajorVersionsData(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Get document config", description = "Retrieves configuration settings for the financial statement document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Config retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/document-config", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    DocumentConfigResponse getDocumentConfig(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            HttpServletRequest request);

    @Operation(summary = "Get recent changes", description = "Retrieves recent minor version changes with pagination")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Recent changes retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    List<VersionVO> getRecentChanges(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Page index") @RequestParam int pageIndex,
            @Parameter(description = "Page size") @RequestParam int pageSize);

    @Operation(summary = "Count recent changes", description = "Returns the total count of recent minor version changes")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/count-recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    int countRecentChanges(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Get intermediate version data", description = "Retrieves intermediate versions between major versions with pagination")
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

    @Operation(summary = "Count intermediate version data", description = "Returns the total count of intermediate versions")
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

    @Operation(summary = "Get version", description = "Retrieves and displays a specific version of the financial statement")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{versionId}/show-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    DocumentViewResponse getVersion(@Parameter(description = "Version ID") @PathVariable("versionId") String versionId);

    @Operation(summary = "Save version", description = "Creates a new version of the financial statement with a check-in comment")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version saved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/{documentRef}/save-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    List<VersionVO> saveVersion(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Save version request") @RequestBody SaveIntermediateVersionRequest request);

    @Operation(summary = "Download version", description = "Downloads the XML files for a specific version of the financial statement")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version downloaded successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/download-xml-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    byte[] downloadVersion(@Parameter(description = "Version ID") @RequestParam("versionId") String versionId);

    @Operation(summary = "Restore version", description = "Restores the financial statement to a specific previous version")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version restored successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/restore/{targetVersion}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    DocumentViewResponse restoreVersion(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Target version") @PathVariable("targetVersion") String targetVersion);

    @Operation(summary = "Save element", description = "Saves changes to a specific element in the financial statement document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element saved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/save-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> saveElement(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element name") @PathVariable("elementName") String elementName,
            @Parameter(description = "Element ID") @PathVariable("elementId") String elementId,
            @Parameter(description = "Presenter ID") @RequestHeader("presenterId") String presenterId,
            @Parameter(description = "Element content") @RequestBody String elementContent) throws Exception;

    @Operation(summary = "Get element", description = "Retrieves a specific element from the financial statement for editing")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/element/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    EditElementResponse getElement(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element ID") @PathVariable("elementId") String elementId,
            @Parameter(description = "Element tag name") @PathVariable("elementTagName") String elementTagName);

    @Operation(summary = "Get user guidance", description = "Retrieves user guidance content for the financial statement document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User guidance retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/userGuidance", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getUserGuidance(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Get search results", description = "Searches for text matches in the financial statement document with specified criteria")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Search results retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/{documentRef}/search-text", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    List<SearchMatchVO> getSearchResults(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Search text") @RequestParam String searchText,
            @Parameter(description = "Match case") @RequestParam boolean matchCase,
            @Parameter(description = "Complete words") @RequestParam boolean completeWords,
            @Parameter(description = "Temporary updated content XML") @RequestBody(required = false) String tempUpdatedContentXML) throws Exception;

    @Operation(summary = "Compare document versions", description = "Compares two versions of the financial statement and shows differences")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Comparison retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{newVersionId}/compare/{oldVersionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> compareDocumentVersions(
            @Parameter(description = "New version ID") @PathVariable("newVersionId") String newVersionId,
            @Parameter(description = "Old version ID") @PathVariable("oldVersionId") String oldVersionId);

    @Operation(summary = "Delete document element", description = "Deletes a specific element from the financial statement document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element deleted successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping(value = "/{documentRef}/element/{elementName}/{elementId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> deleteDocumentElement(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element name") @PathVariable("elementName") String elementName,
            @Parameter(description = "Element ID") @PathVariable("elementId") String elementId);

    @Operation(summary = "Insert group", description = "Inserts a new group element into the financial statement document at the specified position")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Group inserted successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/insert-group", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> insertGroup(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element name") @PathVariable("elementName") String elementName,
            @Parameter(description = "Element ID") @PathVariable("elementId") String elementId,
            @Parameter(description = "Insert element request") @RequestBody InsertElementRequest request);

    @Operation(summary = "Insert element", description = "Inserts a new element into the financial statement document at the specified position")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element inserted successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/insert-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> insertElement(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element name") @PathVariable("elementName") String elementName,
            @Parameter(description = "Element ID") @PathVariable("elementId") String elementId,
            @Parameter(description = "Insert element request") @RequestBody InsertElementRequest request);

    @Operation(summary = "Replace one text", description = "Replaces a single text occurrence in the financial statement document")
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

    @Operation(summary = "Replace all text", description = "Replaces all occurrences of text in the financial statement document")
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

    @Operation(summary = "Save all after replace", description = "Saves the financial statement document after text replacement operations")
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

    @Operation(summary = "Download clean version", description = "Downloads a clean version of the financial statement without track changes")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Clean version downloaded successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/download-clean-version", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    ResponseEntity<Object> downloadCleanVersion(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Show clean version", description = "Displays a clean version of the financial statement without track changes")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Clean version retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/clean-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> showCleanVersion(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Toggle track change enabled", description = "Enables or disables track changes mode for the financial statement document")
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

    @Operation(summary = "Reject change", description = "Rejects a specific track change in the financial statement document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Change rejected successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/reject-change/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> rejectChange(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element ID") @PathVariable("elementId") String elementId,
            @Parameter(description = "Element tag name") @PathVariable("elementTagName") String elementTagName,
            @Parameter(description = "Track change action") @RequestParam("trackChangeAction") String trackChangeAction,
            @Parameter(description = "Presenter ID") @RequestHeader("presenterId") String presenterId);

    @Operation(summary = "Finalise document", description = "Finalises the financial statement document by accepting all track changes")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document finalised successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/{documentRef}/finalise-document", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> finaliseDocument(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);
}
