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

import eu.europa.ec.leos.services.dto.request.CreateProposalRequest;
import eu.europa.ec.leos.services.dto.request.FilterProposalsRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Tag(name = "Workspace Management")
public interface WorkspaceApi {

    @Operation(summary = "Filter proposals", description = "Filters and retrieves proposals based on specified criteria")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Proposals filtered successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/filterProposals", method = RequestMethod.POST)
    @ResponseBody
    ResponseEntity<Object> filterProposals(@Parameter(description = "Filter request") @RequestBody FilterProposalsRequest request);

    @Operation(summary = "Create package", description = "Creates a new proposal package with specified configuration")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Package created successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/createPackage", method = RequestMethod.POST)
    @ResponseBody
    ResponseEntity<Object> createPackage(@Parameter(description = "Create proposal request") @RequestBody CreateProposalRequest request);

    @Operation(summary = "Create package V2", description = "Creates a new proposal package with specified configuration")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Package created successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/v2/createPackage", method = RequestMethod.POST)
    @ResponseBody
    ResponseEntity<Object> createPackageV2(@Parameter(description = "Create proposal request") @RequestBody CreateProposalRequest request);

    @Operation(summary = "Get templates", description = "Retrieves all available document templates")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Templates retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/getTemplates", method = RequestMethod.GET)
    @ResponseBody
    ResponseEntity<Object> getTemplates();

    @Operation(summary = "Get custom templates", description = "Retrieves custom templates for a specific entity")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Custom templates retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/getCustomTemplates/{entityName}", method = RequestMethod.GET)
    @ResponseBody
    ResponseEntity<Object> getCustomTemplates(@Parameter(description = "Entity name") @PathVariable String entityName);
}
