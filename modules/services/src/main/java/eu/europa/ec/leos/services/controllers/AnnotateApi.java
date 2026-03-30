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

import eu.europa.ec.leos.services.dto.request.AnnotateMergeSuggestionRequest;
import eu.europa.ec.leos.services.dto.request.AnnotateMergeSuggestionRequests;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Annotation", description = "Annotation management API")
public interface AnnotateApi {

    @Operation(summary = "Request user permissions", description = "Retrieves user permissions for a document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Permissions retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/requestUserPermissions/{documentType}/{documentRef}")
    ResponseEntity<Object> requestUserPermissions(
            @Parameter(description = "Document type", required = true) @PathVariable("documentType") String documentType,
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Request security token", description = "Retrieves annotation security token")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/requestSecurityToken")
    ResponseEntity<Object> requestSecurityToken();

    @Operation(summary = "Request document metadata", description = "Retrieves document metadata for annotations")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Metadata retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/requestDocumentMetadata/{documentType}/{documentRef}")
    ResponseEntity<Object> requestDocumentMetadata(
            @Parameter(description = "Document type", required = true) @PathVariable("documentType") String documentType,
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Request search metadata", description = "Retrieves search metadata for annotations")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Metadata retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/requestSearchMetadata")
    ResponseEntity<Object> requestSearchMetadata();

    @Operation(summary = "Request merge suggestion", description = "Merges a single annotation suggestion")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Suggestion merged successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(value = "/requestMergeSuggestion/{documentType}/{documentRef}")
    ResponseEntity<Object> requestMergeSuggestion(
            @Parameter(description = "Document type", required = true) @PathVariable("documentType") String documentType,
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Merge suggestion request", required = true) @RequestBody AnnotateMergeSuggestionRequest mergeSuggestionRequest);

    @Operation(summary = "Request merge suggestions", description = "Merges multiple annotation suggestions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Suggestions merged successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(value = "/requestMergeSuggestions/{documentType}/{documentRef}")
    ResponseEntity<Object> requestMergeSuggestions(
            @Parameter(description = "Document type", required = true) @PathVariable("documentType") String documentType,
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Merge suggestions request", required = true) @RequestBody AnnotateMergeSuggestionRequests mergeSuggestionRequests);
}
