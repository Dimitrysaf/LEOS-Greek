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
import eu.europa.ec.leos.services.dto.request.InsertElementRequest;
import eu.europa.ec.leos.services.dto.request.SaveIntermediateVersionRequest;
import eu.europa.ec.leos.services.dto.request.ToggleTrackChangeEnabledRequest;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
import eu.europa.ec.leos.services.request.SaveTocRequestEvent;
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

@Tag(name = "Annex", description = "Annex document management API")
public interface AnnexApi {

    @Operation(summary = "Save annex element", description = "Saves an element in the annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element saved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/save-element", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> saveAnnexElement(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element name", required = true) @PathVariable("elementName") String elementName,
            @Parameter(description = "Element ID", required = true) @PathVariable("elementId") String elementId,
            @Parameter(description = "Is split operation") @RequestParam(required = false) boolean isSplit,
            @Parameter(description = "Presenter ID", required = true) @RequestHeader("presenterId") String presenterId,
            @Parameter(description = "Alternate element ID") @RequestParam(required = false, defaultValue = "") String alternateElementId,
            @Parameter(description = "Element content", required = true) @RequestBody String elementContent);

    @Operation(summary = "Delete annex element", description = "Deletes an element from the annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element deleted successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @DeleteMapping(value = "/{documentRef}/element/{elementName}/{elementId}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> deleteAnnexElement(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element name", required = true) @PathVariable("elementName") String elementName,
            @Parameter(description = "Element ID", required = true) @PathVariable("elementId") String elementId);

    @Operation(summary = "Insert annex element", description = "Inserts a new element into the annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element inserted successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/insert-element", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> insertAnnexElement(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element name", required = true) @PathVariable("elementName") String elementName,
            @Parameter(description = "Element ID", required = true) @PathVariable("elementId") String elementId,
            @Parameter(description = "Insert element request", required = true) @RequestBody InsertElementRequest request);

    @Operation(summary = "Merge annex element", description = "Merges elements in the annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element merged successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/merge-element", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> mergeAnnexElement(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element tag", required = true) @PathVariable("elementName") String elementTag,
            @Parameter(description = "Element ID", required = true) @PathVariable("elementId") String elementId,
            @Parameter(description = "Element content", required = true) @RequestBody String elementContent);

    @Operation(summary = "Get recent changes", description = "Retrieves recent minor versions of the annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Recent changes retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getRecentChanges(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Page index", required = true) @RequestParam int pageIndex,
            @Parameter(description = "Page size", required = true) @RequestParam int pageSize);

    @Operation(summary = "Count recent changes", description = "Counts recent minor versions of the annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/count-recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> countRecentChanges(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Save annex version", description = "Saves a new version of the annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version saved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(value = "/{documentRef}/save-version", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> saveAnnexVersion(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Save version request", required = true) @RequestBody SaveIntermediateVersionRequest saveEvent);

    @Operation(summary = "Save table of contents", description = "Saves the table of contents for the annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "TOC saved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(value = "/{documentRef}/save-toc", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> saveToc(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Save TOC request", required = true) @RequestBody SaveTocRequestEvent saveTocRequestEvent,
            HttpServletRequest request);

    @Operation(summary = "Get major versions data", description = "Retrieves major versions data with pagination")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getMajorVersionsData(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Page index", required = true) @RequestParam int pageIndex,
            @Parameter(description = "Page size", required = true) @RequestParam int pageSize);

    @Operation(summary = "Search versions", description = "Searches versions by author and type")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/search-versions", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> searchVersionData(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Author key", required = true) @RequestParam String authorKey,
            @Parameter(description = "Version type", required = true) @RequestParam String type);

    @Operation(summary = "Count major versions", description = "Counts major versions of the document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/count-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> countMajorVersionsData(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Get intermediate versions", description = "Retrieves intermediate versions data with pagination")
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

    @Operation(summary = "Count intermediate versions", description = "Counts intermediate versions of the document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/count-intermediate-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> countIntermediateVersionData(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Current intermediate version", required = true) @RequestParam String currIntVersion);

    @Operation(summary = "Get table of contents", description = "Retrieves the table of contents for the annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "TOC retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/getToc", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getToc(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "TOC mode", required = true) @RequestParam("tocMode") TocMode tocMode,
            HttpServletRequest request);

    @Operation(summary = "Get TOC items", description = "Retrieves TOC items configuration")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "TOC items retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/getTocItems", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getTocItems(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Get annex document", description = "Retrieves the annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getAnnex(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Search text in document", description = "Searches for text in the annex document")
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

    @Operation(summary = "Show annex version", description = "Shows a specific version of the annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{versionId}/show-version", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> showAnnexVersion(
            @Parameter(description = "Version ID", required = true) @PathVariable("versionId") String versionId);

    @Operation(summary = "Show original language version", description = "Shows the latest major version of the equivalent document in the original language")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/original-language-version", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> showOriginalLanguageVersion(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Compare annex versions", description = "Compares two versions of the annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Comparison completed successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{newVersionId}/compare/{oldVersionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> compareAnnexVersions(
            @Parameter(description = "New version ID", required = true) @PathVariable("newVersionId") String newVersionId,
            @Parameter(description = "Old version ID", required = true) @PathVariable("oldVersionId") String oldVersionId);

    @Operation(summary = "Restore annex version", description = "Restores the annex document to a specific version")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version restored successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/restore/{targetVersion}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> restoreAnnexVersion(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Target version", required = true) @PathVariable("targetVersion") String targetVersion);

    @Operation(summary = "Get annex element", description = "Retrieves a specific element from the annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/element/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getAnnexElement(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element ID", required = true) @PathVariable("elementId") String elementId,
            @Parameter(description = "Element tag name", required = true) @PathVariable("elementTagName") String elementTagName);

    @Operation(summary = "Download current version", description = "Downloads the current version of the annex document")
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
    @GetMapping(value = "/{documentRef}/download-xml-version", produces = MediaType.APPLICATION_XML_VALUE)
    ResponseEntity<Object> downloadXmlVersion(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Version ID", required = true) @RequestParam("versionId") String versionId);

    @Operation(summary = "Replace one text", description = "Replaces one occurrence of text in the document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Text replaced successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PutMapping(value = "/{documentRef}/replace-one", produces = MediaType.TEXT_XML_VALUE)
    ResponseEntity<Object> replaceOneText(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Replace match request", required = true) @RequestBody ReplaceMatchRequest request);

    @Operation(summary = "Replace all text", description = "Replaces all occurrences of text in the document")
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

    @Operation(summary = "Switch annex structure", description = "Switches the annex structure type")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Structure switched successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/switch-annex-structure", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> switchAnnexStructure(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Renumber annex", description = "Renumbers the annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Annex renumbered successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PutMapping(value = "/{documentRef}/renumber-document", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> renumberAnnex(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Get user guidance", description = "Retrieves user guidance for the annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User guidance retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/userGuidance", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getUserGuidance(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Download clean version", description = "Downloads clean version of the annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Clean version downloaded successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/download-clean-version", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    ResponseEntity<Object> downloadCleanVersion(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Show clean version", description = "Shows clean version of the annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Clean version retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{documentRef}/clean-version", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> showCleanVersion(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Accept change", description = "Accepts a track change in the document")
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

    @Operation(summary = "Reject change", description = "Rejects a track change in the document")
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

    @Operation(summary = "Toggle track change enabled", description = "Toggles track change feature on/off")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Track change toggled successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(value = "/{documentRef}/toggle-trackchange-enabled", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> toggleTrackChangeEnabled(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Toggle track change request", required = true) @RequestBody ToggleTrackChangeEnabledRequest toggleTrackChangeEnabledRequest);
}
