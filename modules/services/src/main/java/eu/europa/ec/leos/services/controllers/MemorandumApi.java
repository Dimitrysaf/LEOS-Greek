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
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Memorandum Management")
public interface MemorandumApi {

    @Operation(summary = "Get memorandum document", description = "Retrieves the memorandum document with its content and metadata")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Memorandum retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getMemorandum(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Get table of contents", description = "Retrieves the table of contents for the memorandum in the specified mode")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "TOC retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/getToc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getToc(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                  @Parameter(description = "TOC mode") @RequestParam("tocMode") TocMode tocMode,
                                  HttpServletRequest request);

    @Operation(summary = "Get TOC items", description = "Retrieves available table of contents item types for the memorandum")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "TOC items retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/getTocItems", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getTocItems(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Save memorandum element", description = "Saves changes to a specific element in the memorandum document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element saved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/save-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> saveMemorandumElement(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                                 @Parameter(description = "Element name") @PathVariable("elementName") String elementName,
                                                 @Parameter(description = "Element ID") @PathVariable("elementId") String elementId,
                                                 @Parameter(description = "Presenter ID") @RequestHeader("presenterId") String presenterId,
                                                 @Parameter(description = "Is split") @RequestParam(required = false) boolean isSplit,
                                                 @RequestBody String elementContent);

    @Operation(summary = "Delete memorandum element", description = "Deletes a specific element from the memorandum document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element deleted successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping(value = "/{documentRef}/element/{elementName}/{elementId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> deleteMemorandumElement(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                                   @Parameter(description = "Element name") @PathVariable("elementName") String elementName,
                                                   @Parameter(description = "Element ID") @PathVariable("elementId") String elementId);

    @Operation(summary = "Insert memorandum element", description = "Inserts a new element into the memorandum document at the specified position")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element inserted successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/insert-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> insertMemorandumElement(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                                   @Parameter(description = "Element name") @PathVariable("elementName") String elementName,
                                                   @Parameter(description = "Element ID") @PathVariable("elementId") String elementId,
                                                   @Parameter(description = "Insert element request") @RequestBody InsertElementRequest request);

    @Operation(summary = "Merge memorandum element", description = "Merges the specified element with adjacent elements in the memorandum")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element merged successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/{documentRef}/element/{elementName}/{elementId}/merge-element", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> mergeMemorandumElement(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                                  @Parameter(description = "Element tag") @PathVariable("elementName") String elementTag,
                                                  @Parameter(description = "Element ID") @PathVariable("elementId") String elementId,
                                                  @RequestBody String elementContent);

    @Operation(summary = "Get recent changes", description = "Retrieves recent minor version changes with pagination")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Recent changes retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getRecentChanges(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                            @Parameter(description = "Page index") @RequestParam int pageIndex,
                                            @Parameter(description = "Page size") @RequestParam int pageSize);

    @Operation(summary = "Count recent changes", description = "Returns the total count of recent minor version changes")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/count-recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> countRecentChanges(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Save memorandum version", description = "Creates a new version of the memorandum with a check-in comment")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version saved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/{documentRef}/save-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> saveMemorandumVersion(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                                 @Parameter(description = "Save version request") @RequestBody SaveIntermediateVersionRequest saveEvent);

    @Operation(summary = "Save table of contents", description = "Saves changes to the memorandum table of contents structure")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "TOC saved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/{documentRef}/save-toc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> saveMemorandumToc(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                             @Parameter(description = "Save TOC request") @RequestBody SaveTocRequestEvent saveTocRequestEvent,
                                             HttpServletRequest request);

    @Operation(summary = "Search versions", description = "Searches for versions by author and version type")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/search-versions", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> searchVersionData(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                             @Parameter(description = "Author key") @RequestParam String authorKey,
                                             @Parameter(description = "Version type") @RequestParam String type);

    @Operation(summary = "Get major versions data", description = "Retrieves major versions with pagination")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getMajorVersionsData(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                                @Parameter(description = "Page index") @RequestParam int pageIndex,
                                                @Parameter(description = "Page size") @RequestParam int pageSize);

    @Operation(summary = "Count major versions", description = "Returns the total count of major versions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/count-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> countMajorVersionsData(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Get intermediate version data", description = "Retrieves intermediate versions between major versions with pagination")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/intermediate-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getIntermediateVersionData(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                                      @Parameter(description = "Current intermediate version") @RequestParam String currIntVersion,
                                                      @Parameter(description = "Page index") @RequestParam int pageIndex,
                                                      @Parameter(description = "Page size") @RequestParam int pageSize);

    @Operation(summary = "Count intermediate versions", description = "Returns the total count of intermediate versions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/count-intermediate-version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> countIntermediateVersionData(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                                        @Parameter(description = "Current intermediate version") @RequestParam String currIntVersion);

    @Operation(summary = "Search text in document", description = "Searches for text matches in the memorandum document with specified criteria")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Search results retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/{documentRef}/search-text", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getSearchResults(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                            @Parameter(description = "Search text") @RequestParam String searchText,
                                            @Parameter(description = "Match case") @RequestParam boolean matchCase,
                                            @Parameter(description = "Complete words") @RequestParam boolean completeWords,
                                            @RequestBody(required = false) String tempUpdatedContentXML);

    @Operation(summary = "Show memorandum version", description = "Retrieves and displays a specific version of the memorandum")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{versionId}/show-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> showMemorandumVersion(@Parameter(description = "Version ID") @PathVariable("versionId") String versionId);

    @Operation(summary = "Compare memorandum versions", description = "Compares two versions of the memorandum and shows differences")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Comparison retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{newVersionId}/compare/{oldVersionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> compareMemorandumVersions(@Parameter(description = "New version ID") @PathVariable("newVersionId") String newVersionId,
                                                     @Parameter(description = "Old version ID") @PathVariable("oldVersionId") String oldVersionId);

    @Operation(summary = "Restore memorandum version", description = "Restores the memorandum to a specific previous version")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version restored successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/restore/{targetVersion}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> restoreMemorandumVersion(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                                    @Parameter(description = "Target version") @PathVariable("targetVersion") String targetVersion);

    @Operation(summary = "Get memorandum element", description = "Retrieves a specific element from the memorandum for editing")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/element/{elementId}/{elementTagName}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getMemorandumElement(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                                @Parameter(description = "Element ID") @PathVariable("elementId") String elementId,
                                                @Parameter(description = "Element tag name") @PathVariable("elementTagName") String elementTagName);

    @Operation(summary = "Download current version", description = "Downloads the current version of the memorandum with optional annotations")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version downloaded successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/download-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> downloadCurrentVersion(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                                  @Parameter(description = "Include annotations") @RequestParam("isWithAnnotation") boolean isWithAnnotation);

    @Operation(summary = "Download XML version", description = "Downloads the XML files for a specific version of the memorandum")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "XML version downloaded successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/download-xml-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> downloadXmlVersion(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                              @Parameter(description = "Version ID") @RequestParam("versionId") String versionId);

    @Operation(summary = "Replace one text occurrence", description = "Replaces a single text occurrence in the memorandum document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Text replaced successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/{documentRef}/replace-one", produces = MediaType.TEXT_XML_VALUE)
    @ResponseBody
    ResponseEntity<Object> replaceOneText(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                          @Parameter(description = "Replace request") @RequestBody ReplaceMatchRequest request);

    @Operation(summary = "Replace all text occurrences", description = "Replaces all occurrences of text in the memorandum document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Text replaced successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/{documentRef}/replace-all", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> replaceAllText(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                          @Parameter(description = "Replace all request") @RequestBody ReplaceAllMatchRequest request);

    @Operation(summary = "Save after replace", description = "Saves the memorandum document after text replacement operations")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document saved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/{documentRef}/save-after-replace", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> saveAllAfterReplace(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                               @Parameter(description = "Save after replace request") @RequestBody SaveAfterReplaceRequest request);

    @Operation(summary = "Get document configuration", description = "Retrieves configuration settings for the memorandum document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Configuration retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/document-config", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getDocumentConfig(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                             HttpServletRequest request);

    @Operation(summary = "Get user guidance", description = "Retrieves user guidance content for the memorandum document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User guidance retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/userGuidance", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getUserGuidance(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Download clean version", description = "Downloads a clean version of the memorandum without track changes")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Clean version downloaded successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/download-clean-version", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    ResponseEntity<Object> downloadCleanVersion(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Show clean version", description = "Displays a clean version of the memorandum without track changes")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Clean version retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/clean-version", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> showCleanVersion(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Toggle track change enabled", description = "Enables or disables track changes mode for the memorandum document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Track change toggled successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/{documentRef}/toggle-trackchange-enabled", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> toggleTrackChangeEnabled(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
                                                    @Parameter(description = "Toggle request") @RequestBody ToggleTrackChangeEnabledRequest toggleTrackChangeEnabledRequest);
}
