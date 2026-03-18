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

import eu.europa.ec.leos.services.dto.collaborator.WorkflowCollaboratorDTO;
import eu.europa.ec.leos.services.request.WorkflowCollaboratorAclRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Workflow Collaborator Management")
public interface WorkflowCollaboratorApi {

    @Operation(summary = "Add workflow collaborator ACL", description = "Adds access control list permissions for a workflow collaborator to the proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Workflow collaborator ACL added successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/{proposalRef}/workflow-collaborators")
    ResponseEntity<Object> addWorkflowCollaboratorAcl(
            @Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Workflow collaborator ACL request") @RequestBody WorkflowCollaboratorAclRequest workflowCollaboratorAclRequest,
            @Parameter(description = "Authorization header") @RequestHeader("Authorization") String authorizationHeader);

    @Operation(summary = "Get workflow collaborator ACL", description = "Retrieves access control list permissions for the current workflow collaborator")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Workflow collaborator ACL retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{proposalRef}/workflow-collaborators")
    ResponseEntity<WorkflowCollaboratorDTO> getWorkflowCollaboratorAcl(
            @Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Authorization header") @RequestHeader("Authorization") String authorizationHeader);

    @Operation(summary = "Get all workflow collaborator ACLs", description = "Retrieves all workflow collaborator access control lists for the proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "All workflow collaborator ACLs retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{proposalRef}/workflow-collaborators/all")
    ResponseEntity<List<WorkflowCollaboratorDTO>> getWorkflowCollaboratorAcls(
            @Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef);

    @Operation(summary = "Delete workflow collaborator ACL", description = "Removes access control list permissions for a workflow collaborator from the proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Workflow collaborator ACL deleted successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping(value = "/{proposalRef}/workflow-collaborators")
    ResponseEntity<Object> deleteWorkflowCollaboratorAcl(
            @Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Authorization header") @RequestHeader("Authorization") String authorizationHeader);
}
