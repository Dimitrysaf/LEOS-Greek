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

import eu.europa.ec.leos.services.api.exception.PendingTranslationException;
import eu.europa.ec.leos.services.dto.request.PublishTemplateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Catalog", description = "Template catalog management API")
public interface CatalogApi {

    @Operation(summary = "Publish template to catalog", description = "Publishes a template to the catalog for specified DGs")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Template published successfully"),
            @ApiResponse(responseCode = "400", description = "Pending translations exist", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @RequestMapping(value = "/publish-template/{legFileId}", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> publishTemplateToCatalog(
            @Parameter(description = "LEG file ID", required = true) @PathVariable("legFileId") String legFileId,
            @Parameter(description = "Publish template request", required = true) @RequestBody PublishTemplateRequest request)
            throws PendingTranslationException;

    @Operation(summary = "Update template", description = "Updates an existing template in the catalog")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Template updated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @RequestMapping(value = "/update-template/{packageId}", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> updateTemplate(
            @Parameter(description = "Package ID", required = true) @PathVariable("packageId") String packageId,
            @Parameter(description = "Publish template request", required = true) @RequestBody PublishTemplateRequest request);

    @Operation(summary = "Unpublish template", description = "Unpublishes a template from the catalog")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Template unpublished successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @RequestMapping(value = "/un-publish-template/{catalogKey}", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> unPublishTemplate(
            @Parameter(description = "Catalog key", required = true) @PathVariable("catalogKey") String catalogKey);

    @Operation(summary = "Get template info", description = "Retrieves template information for a proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Template info retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/template/{proposalRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getTemplateInfo(
            @Parameter(description = "Proposal reference", required = true) @PathVariable("proposalRef") String proposalRef);
}
