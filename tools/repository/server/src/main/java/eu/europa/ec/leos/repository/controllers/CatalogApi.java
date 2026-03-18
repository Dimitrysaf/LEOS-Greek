package eu.europa.ec.leos.repository.controllers;

import eu.europa.ec.leos.repository.model.CustomTemplateInfo;
import eu.europa.ec.leos.repository.exceptions.CatalogException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.List;

@Tag(name = "Catalog", description = "Template catalog management API")
public interface CatalogApi {

    @Operation(
            summary = "Publish custom template",
            description = "Publishes a new custom template to the catalog for specified DGs"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Template published successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(path = "/catalog/publish-template", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> publishCustomTemplate(
            @Parameter(description = "LEG file ID", required = true) @RequestParam String legFileId,
            @Parameter(description = "Template name", required = true) @RequestParam String templateName,
            @Parameter(description = "List of DG codes", required = true) @RequestParam List<String> dgs,
            @Parameter(description = "User ID", required = true) @RequestParam String userId,
            @Parameter(description = "Original DG code", required = true) @RequestParam String originalDg) throws CatalogException;

    @Operation(
            summary = "Update custom template",
            description = "Updates an existing custom template in the catalog"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Template updated successfully"),
            @ApiResponse(responseCode = "404", description = "Template not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(path = "/catalog/update-template", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> updateCustomTemplate(
            @Parameter(description = "Package ID", required = true) @RequestParam String packageId,
            @Parameter(description = "Template name", required = true) @RequestParam String templateName,
            @Parameter(description = "List of DG codes", required = true) @RequestParam List<String> dgs,
            @Parameter(description = "User ID", required = true) @RequestParam String userId,
            @Parameter(description = "Original DG code", required = true) @RequestParam String originalDg) throws CatalogException;

    @Operation(
            summary = "Unpublish custom template",
            description = "Removes a custom template from the catalog"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Template unpublished successfully"),
            @ApiResponse(responseCode = "404", description = "Template not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(path = "/catalog/un-publish-template", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Boolean> unpublishCustomTemplate(
            @Parameter(description = "Package ID", required = true) @RequestParam String packageId,
            @Parameter(description = "User ID", required = true) @RequestParam String userId) throws CatalogException;

    @Operation(
            summary = "Get template information",
            description = "Retrieves detailed information about a specific template"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Template information retrieved successfully",
                    content = @Content(schema = @Schema(implementation = CustomTemplateInfo.class))
            ),
            @ApiResponse(responseCode = "404", description = "Template not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(path = "/catalog/template/{packageId}", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<CustomTemplateInfo> getTemplateInfo(
            @Parameter(description = "Package ID", required = true) @PathVariable BigDecimal packageId) throws CatalogException;
}
