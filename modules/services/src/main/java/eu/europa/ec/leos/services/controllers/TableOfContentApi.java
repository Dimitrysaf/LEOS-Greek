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

import eu.europa.ec.leos.services.dto.request.NodeDropValidationRequest;
import eu.europa.ec.leos.services.dto.request.TocValidationRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Tag(name = "Table of Content Management")
public interface TableOfContentApi {

    @Operation(summary = "Validate node drop", description = "Validates whether a node can be dropped at a specific position in the table of contents")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Node drop validated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/validate-node-drop", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> validateNodeDrop(@Parameter(description = "Node validation request") @RequestBody() NodeDropValidationRequest nodeValidationRequest);

    @Operation(summary = "Validate table of contents", description = "Validates the structure and integrity of the table of contents")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "TOC validated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/validate-toc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> validateToc(@Parameter(description = "TOC validation request") @RequestBody() TocValidationRequest tocValidationRequest);
}
