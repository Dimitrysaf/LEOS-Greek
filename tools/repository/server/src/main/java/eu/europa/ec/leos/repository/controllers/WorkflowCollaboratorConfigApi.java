package eu.europa.ec.leos.repository.controllers;

import eu.europa.ec.leos.repository.controllers.requests.WorkflowCollaboratorConfigRequest;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "WorkflowCollaboratorConfig", description = "Workflow collaborator configuration API")
public interface WorkflowCollaboratorConfigApi {

    @Operation(
            summary = "Set workflow configuration",
            description = "Creates or updates workflow collaborator configuration"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Configuration saved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(path = "/workflow-collaborator-config", consumes = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> setWorkflowConfiguration(@Valid @RequestBody WorkflowCollaboratorConfigRequest workflowCollaboratorConfigRequest);

    @Operation(
            summary = "Get workflow collaborator configuration",
            description = "Retrieves workflow collaborator configuration by package name and client name"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Configuration retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Configuration not found", content = @Content)
    })
    @GetMapping(path = "/workflow-collaborator-config")
    ResponseEntity<Object> getWorkflowCollaboratorConfig(
            @Parameter(description = "Package name", required = true) @RequestParam("packageName") String packageName,
            @Parameter(description = "Client name", required = true) @RequestParam("clientName") String clientName);

    @Operation(
            summary = "Get all workflow collaborator configurations",
            description = "Retrieves all workflow collaborator configurations for a package"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Configurations retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Package or configurations not found", content = @Content)
    })
    @GetMapping(path = "/workflow-collaborator-config/all")
    ResponseEntity<Object> getWorkflowCollaboratorConfigs(
            @Parameter(description = "Package name", required = true) @RequestParam("packageName") String packageName) throws RepositoryException;

    @Operation(
            summary = "Delete workflow collaborator configuration by ID",
            description = "Deletes a workflow collaborator configuration by its ID"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Configuration deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Configuration not found", content = @Content)
    })
    @DeleteMapping(path = "/workflow-collaborator-config/{id}")
    ResponseEntity<Object> deleteWorkflowCollaboratorConfig(
            @Parameter(description = "Configuration ID", required = true) @PathVariable("id") int id);

    @Operation(
            summary = "Delete workflow collaborator configuration",
            description = "Deletes a workflow collaborator configuration by package name and client name"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Configuration deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Configuration not found", content = @Content)
    })
    @DeleteMapping(path = "/workflow-collaborator-config")
    ResponseEntity<Object> deleteWorkflowCollaboratorConfig(
            @Parameter(description = "Package name", required = true) @RequestParam("packageName") String packageName,
            @Parameter(description = "Client name", required = true) @RequestParam("clientName") String clientName);
}
