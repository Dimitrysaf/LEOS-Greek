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

import eu.europa.ec.leos.services.dto.request.ExportDocumentRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Tag(name = "LEOS Light API")
public interface LeosLightApi {

    @Operation(summary = "Import document to LEOS Light", description = "Imports a document into LEOS Light system with specified language and optional callback")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document imported successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/leos-light/import-document", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> importDocument(
            @Parameter(description = "Input file to import") @RequestParam MultipartFile inputFile,
            @Parameter(description = "Language code") @RequestParam String language,
            @Parameter(description = "Callback address") @RequestParam(required = false) String callbackAddress);

    @Operation(summary = "Export document from LEOS Light", description = "Exports a document from LEOS Light system in the requested format")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document exported successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/secured/leos-light/export-document", produces = {MediaType.APPLICATION_OCTET_STREAM_VALUE, MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    ResponseEntity<Object> exportDocument(
            @Parameter(description = "Export document request") @RequestBody ExportDocumentRequest request,
            HttpServletRequest httpRequest) throws IOException;

    @Operation(summary = "Get context token for LEOS Light", description = "Generates a context token for LEOS Light authentication with client and user information")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Context token retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/leos-light/context-token", method = RequestMethod.GET)
    String getContextToken(
            @Parameter(description = "Client ID") @RequestParam String clientId,
            @Parameter(description = "User name") @RequestParam String user,
            @Parameter(description = "User role") @RequestParam String role,
            @Parameter(description = "System name") @RequestParam String systemName);

    @Operation(summary = "Import proposal from LEG file", description = "Imports a proposal into LEOS Light from an uploaded LEG file")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Proposal imported successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/editlight/importProposal", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> importProposal(
            @Parameter(description = "LEG file to import") @RequestParam("legFile") MultipartFile file);

    @Operation(summary = "Test RESTful service", description = "Tests the availability and connectivity of the RESTful service")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Test successful"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/editlight/test", method = RequestMethod.GET)
    String test();

    @Operation(summary = "Test callback address", description = "Tests the callback address functionality by uploading a test file")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Callback address tested successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/leos-light/test-callback", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> testCallbackAddress(
            @Parameter(description = "Test file") @RequestParam MultipartFile file);
}
