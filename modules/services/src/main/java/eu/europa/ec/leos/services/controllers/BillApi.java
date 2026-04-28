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
import eu.europa.ec.leos.services.dto.request.ImportElementRequest;
import eu.europa.ec.leos.services.dto.request.InsertElementRequest;
import eu.europa.ec.leos.services.dto.request.SaveIntermediateVersionRequest;
import eu.europa.ec.leos.services.dto.request.ToggleTrackChangeEnabledRequest;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
import eu.europa.ec.leos.services.request.SaveTocRequestEvent;
import eu.europa.ec.leos.services.request.SearchForImportCriteriaRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Bill", description = "Bill document management API")
public interface BillApi {

    @Operation(summary = "Save bill element", description = "Saves an element in the bill document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element saved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/save-element", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> saveBillElement(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element name", required = true) @PathVariable("elementName") String elementName,
            @Parameter(description = "Element ID", required = true) @PathVariable("elementId") String elementId,
            @Parameter(description = "Presenter ID", required = true) @RequestHeader("presenterId") String presenterId,
            @Parameter(description = "Is split operation") @RequestParam(required = false) boolean isSplit,
            @Parameter(description = "Alternate element ID") @RequestParam(required = false, defaultValue = "") String alternateElementId,
            @Parameter(description = "Element content", required = true) @RequestBody String elementContent,
            HttpServletRequest request);

    @Operation(summary = "Delete bill element", description = "Deletes an element from the bill document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element deleted successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @DeleteMapping(value = "/{documentRef}/element/{elementName}/{elementId}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> deleteBillElement(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element name", required = true) @PathVariable("elementName") String elementName,
            @Parameter(description = "Element ID", required = true) @PathVariable("elementId") String elementId);

    @Operation(summary = "Insert bill element", description = "Inserts a new element into the bill document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element inserted successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/insert-element", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> insertBillElement(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element name", required = true) @PathVariable("elementName") String elementName,
            @Parameter(description = "Element ID", required = true) @PathVariable("elementId") String elementId,
            @Parameter(description = "Insert element request", required = true) @RequestBody InsertElementRequest request);

    @Operation(summary = "Merge bill element", description = "Merges elements in the bill document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element merged successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/merge-element", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> mergeBillElement(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element tag", required = true) @PathVariable("elementName") String elementTag,
            @Parameter(description = "Element ID", required = true) @PathVariable("elementId") String elementId,
            @Parameter(description = "Element content", required = true) @RequestBody String elementContent);

    @Operation(summary = "Get recent changes", description = "Retrieves recent minor versions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Recent changes retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getRecentChanges(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Page index", required = true) @RequestParam int pageIndex,
            @Parameter(description = "Page size", required = true) @RequestParam int pageSize);

    @Operation(summary = "Count recent changes", description = "Counts recent minor versions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/count-recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> countRecentChanges(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Save bill version", description = "Saves a new version of the bill document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version saved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(value = "/{documentRef}/save-version", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> saveBillVersion(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Save version request", required = true) @RequestBody SaveIntermediateVersionRequest saveEvent);

    @Operation(summary = "Save table of contents", description = "Saves the table of contents")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "TOC saved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(value = "/{documentRef}/save-toc", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> saveToc(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Save TOC request", required = true) @RequestBody SaveTocRequestEvent saveTocRequestEvent,
            @Parameter(description = "Client context token") @RequestHeader(value = "Client-Context", required = false) String clientContextToken);

    @Operation(summary = "Get major versions data", description = "Retrieves major versions with pagination")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getMajorVersionsData(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Page index", required = true) @RequestParam int pageIndex,
            @Parameter(description = "Page size", required = true) @RequestParam int pageSize);

    @Operation(summary = "Count major versions", description = "Counts major versions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/count-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> countMajorVersionsData(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Get intermediate versions", description = "Retrieves intermediate versions with pagination")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/intermediate-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getIntermediateVersionData(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Current intermediate version", required = true) @RequestParam String currIntVersion,
            @Parameter(description = "Page index", required = true) @RequestParam int pageIndex,
            @Parameter(description = "Page size", required = true) @RequestParam int pageSize);

    @Operation(summary = "Count intermediate versions", description = "Counts intermediate versions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/count-intermediate-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> countIntermediateVersionData(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Current intermediate version", required = true) @RequestParam String currIntVersion);

    @Operation(summary = "Search versions", description = "Searches versions by author and type")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/search-versions", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> searchVersionData(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Author key") @RequestParam(required = false, defaultValue = "") String authorKey,
            @Parameter(description = "Version type") @RequestParam(required = false, defaultValue = "") String type);

    @Operation(summary = "Get table of contents", description = "Retrieves the table of contents")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "TOC retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/getToc", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getToc(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "TOC mode", required = true) @RequestParam("tocMode") TocMode tocMode,
            @Parameter(description = "Client context token") @RequestHeader(value = "Client-Context", required = false) String clientContextToken);

    @Operation(summary = "Get TOC items", description = "Retrieves TOC items configuration")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "TOC items retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/getTocItems", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getTocItems(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Client context token") @RequestHeader(value = "Client-Context", required = false) String clientContextToken);

    @Operation(summary = "Get bill document", description = "Retrieves the bill document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getBill(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Search text in document", description = "Searches for text in the bill document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Search results retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(value = "/{documentRef}/search-text", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getSearchResults(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Search text", required = true) @RequestParam String searchText,
            @Parameter(description = "Match case", required = true) @RequestParam boolean matchCase,
            @Parameter(description = "Complete words", required = true) @RequestParam boolean completeWords,
            @Parameter(description = "Temporary updated content XML") @RequestBody(required = false) String tempUpdatedContentXML);

    @Operation(summary = "Show bill version", description = "Shows a specific version")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{versionId}/show-version", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> showBillVersion(
            @Parameter(description = "Version ID", required = true) @PathVariable("versionId") String versionId);

    @Operation(summary = "Show original language version", description = "Shows the latest major version of the equivalent document in the original language")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/original-language-version", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> showOriginalLanguageVersion(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Compare bill versions", description = "Compares two versions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Comparison completed successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{newVersionId}/compare/{oldVersionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> compareBillVersions(
            @Parameter(description = "New version ID", required = true) @PathVariable("newVersionId") String newVersionId,
            @Parameter(description = "Old version ID", required = true) @PathVariable("oldVersionId") String oldVersionId);

    @Operation(summary = "Restore bill version", description = "Restores to a specific version")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version restored successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/restore/{targetVersion}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> restoreBillVersion(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Target version", required = true) @PathVariable("targetVersion") String targetVersion);

    @Operation(summary = "Get bill element", description = "Retrieves a specific element")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/element/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getBillElement(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element ID", required = true) @PathVariable("elementId") String elementId,
            @Parameter(description = "Element tag name", required = true) @PathVariable("elementTagName") String elementTagName);

    @Operation(summary = "Accept change", description = "Accepts a track change")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Change accepted successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/accept-change/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> acceptChange(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element ID", required = true) @PathVariable("elementId") String elementId,
            @Parameter(description = "Element tag name", required = true) @PathVariable("elementTagName") String elementTagName,
            @Parameter(description = "Track change action", required = true) @RequestParam("trackChangeAction") String trackChangeAction,
            @Parameter(description = "Presenter ID", required = true) @RequestHeader("presenterId") String presenterId);

    @Operation(summary = "Reject change", description = "Rejects a track change")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Change rejected successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/reject-change/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> rejectChange(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element ID", required = true) @PathVariable("elementId") String elementId,
            @Parameter(description = "Element tag name", required = true) @PathVariable("elementTagName") String elementTagName,
            @Parameter(description = "Track change action", required = true) @RequestParam("trackChangeAction") String trackChangeAction,
            @Parameter(description = "Presenter ID", required = true) @RequestHeader("presenterId") String presenterId);

    @Operation(summary = "Download current version", description = "Downloads the current version")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version downloaded successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/download-version", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> downloadCurrentVersion(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Include annotations", required = true) @RequestParam("isWithAnnotation") boolean isWithAnnotation);

    @Operation(summary = "Download XML version", description = "Downloads XML version files")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "XML version downloaded successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/download-xml-version", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> downloadXmlVersion(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Version ID", required = true) @RequestParam("versionId") String versionId);

    @Operation(summary = "Replace one text", description = "Replaces one occurrence of text")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Text replaced successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PutMapping(value = "/{documentRef}/replace-one", produces = MediaType.TEXT_XML_VALUE)
    ResponseEntity<Object> replaceOneText(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Replace match request", required = true) @RequestBody ReplaceMatchRequest request);

    @Operation(summary = "Replace all text", description = "Replaces all occurrences of text")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Text replaced successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PutMapping(value = "/{documentRef}/replace-all", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> replaceAllText(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Replace all match request", required = true) @RequestBody ReplaceAllMatchRequest request);

    @Operation(summary = "Save after replace", description = "Saves the document after replace operations")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document saved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PutMapping(value = "/{documentRef}/save-after-replace", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> saveAllAfterReplace(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Save after replace request", required = true) @RequestBody SaveAfterReplaceRequest request);

    @Operation(summary = "Get document config", description = "Retrieves document configuration")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Config retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/document-config", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getDocumentConfig(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            HttpServletRequest request);

    @Operation(summary = "Search for import", description = "Searches for import from journal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Search completed successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PutMapping(value = "/{documentRef}/search-for-import", produces = MediaType.TEXT_HTML_VALUE)
    ResponseEntity<Object> searchForImportFromJournal(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Search criteria", required = true) @RequestBody SearchForImportCriteriaRequest searchForImportCriteriaRequest);

    @Operation(summary = "Renumber bill", description = "Renumbers the bill document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bill renumbered successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PutMapping(value = "/{documentRef}/renumber-document", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> renumberBill(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Get user guidance", description = "Retrieves user guidance")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User guidance retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/userGuidance", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getUserGuidance(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Download clean version", description = "Downloads clean version")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Clean version downloaded successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/download-clean-version", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    ResponseEntity<Object> downloadCleanVersion(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Show clean version", description = "Shows clean version")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Clean version retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/clean-version", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> showCleanVersion(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Toggle track change enabled", description = "Toggles track change feature")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Track change toggled successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(value = "/{documentRef}/toggle-trackchange-enabled", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> toggleTrackChangeEnabled(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Toggle track change request", required = true) @RequestBody ToggleTrackChangeEnabledRequest toggleTrackChangeEnabledRequest);

    @Operation(summary = "Import elements", description = "Imports elements into the bill document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Elements imported successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PutMapping(value = "/{documentRef}/import-elements", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> importElements(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Import element request", required = true) @RequestBody ImportElementRequest request);
}
