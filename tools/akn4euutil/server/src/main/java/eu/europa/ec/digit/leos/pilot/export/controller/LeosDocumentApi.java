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
package eu.europa.ec.digit.leos.pilot.export.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Tag(name = "LEOS Document", description = "LEOS document conversion and processing API")
public interface LeosDocumentApi {

    @Operation(summary = "Get document renditions", description = "Converts LEOS document to various output formats")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Renditions generated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @RequestMapping(value = "/getRenditions", method = RequestMethod.POST)
    ResponseEntity<Object> getRenditions(
            @Parameter(description = "Input document file") @RequestParam MultipartFile inputFile,
            @Parameter(description = "Main document file") @RequestParam(required = false) MultipartFile main,
            @Parameter(description = "Include annotations") @RequestParam(required = false, defaultValue = "false") boolean isWithAnnotations
    );

    @Operation(summary = "Update document with translations", description = "Updates LEOS document with translation files")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid translations file"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @RequestMapping(value = "/updateWithTranslations", method = RequestMethod.POST)
    ResponseEntity<Object> updateWithTranslations(
            @Parameter(description = "Input document file") @RequestParam MultipartFile inputFile,
            @Parameter(description = "Translations zip file") @RequestParam MultipartFile translationsFile
    );

    @Operation(summary = "Apply metadata to document", description = "Applies metadata to LEOS document and validates")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Metadata applied successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @RequestMapping(value = "/applyMetadata", method = RequestMethod.POST)
    ResponseEntity<Object> applyMetadata(
            @Parameter(description = "Input document file") @RequestParam MultipartFile inputFile,
            @Parameter(description = "User email") @RequestParam(name = "email", required = false) String email
    );

    @Operation(summary = "Apply metadata asynchronously", description = "Applies metadata to LEOS document asynchronously with callback")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Async process started successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @RequestMapping(value = "/applyMetadataAsync", method = RequestMethod.POST)
    ResponseEntity<Object> applyMetadataAsync(
            @Parameter(description = "Input document file") @RequestParam("inputFile") MultipartFile inputFile,
            @Parameter(description = "Callback URL") @RequestParam("callbackUrl") String callbackUrl,
            @Parameter(description = "User email") @RequestParam(name = "email", required = false) String email
    );

    @Operation(summary = "Test endpoint", description = "Simple test endpoint to verify service availability")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Service is available")
    })
    @RequestMapping(value = "/test", method = RequestMethod.GET)
    String test();

    @Operation(summary = "Handle OPTIONS requests", description = "Handles CORS preflight requests")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OPTIONS request handled")
    })
    @RequestMapping(value = "/**", method = RequestMethod.OPTIONS)
    ResponseEntity<?> handleOptionsRequest();

    @Operation(summary = "Prefinalization callback", description = "Callback endpoint for prefinalization process")
    @ApiResponses({
            @ApiResponse(responseCode = "202", description = "Callback accepted"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(value = "/prefinalization-callback")
    void processPrefinalization(
            @Parameter(description = "Authentication token") @RequestParam(name = "token") String token,
            @Parameter(description = "Input document file") @RequestParam MultipartFile inputFile
    ) throws IOException;
}
