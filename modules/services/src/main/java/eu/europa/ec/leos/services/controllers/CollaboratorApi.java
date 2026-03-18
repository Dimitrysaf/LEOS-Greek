/*
 * Copyright 2025 European Union
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

import eu.europa.ec.leos.services.request.CollaboratorRequest;
import eu.europa.ec.leos.services.request.CollaboratorsRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Collaborator", description = "Proposal collaborator management API")
public interface CollaboratorApi {

    @Operation(summary = "Get all collaborators", description = "Retrieves all collaborators from a proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Collaborators retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @RequestMapping(value = "/{proposalRef}/collaborators", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getAllCollaboratorFromProposal(
            @Parameter(description = "Proposal reference", required = true) @PathVariable("proposalRef") String proposalRef);

    @Operation(summary = "Add collaborator", description = "Adds a collaborator to a proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Collaborator added successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @RequestMapping(value = "/{proposalRef}/collaborators", method = RequestMethod.POST)
    ResponseEntity<Object> addCollaboratorToProposal(
            @Parameter(description = "Proposal reference", required = true) @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Collaborator request", required = true) @RequestBody CollaboratorRequest collaboratorRequest);

    @Operation(summary = "Add bulk collaborators", description = "Adds multiple collaborators to a proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Collaborators added successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @RequestMapping(value = "/{proposalRef}/bulkCollaborators", method = RequestMethod.POST)
    ResponseEntity<Object> addBulkCollaboratorsToProposal(
            @Parameter(description = "Proposal reference", required = true) @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Collaborators request", required = true) @RequestBody CollaboratorsRequest collaboratorsRequest);

    @Operation(summary = "Edit collaborator", description = "Edits a collaborator in a proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Collaborator updated successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @RequestMapping(value = "/{proposalRef}/collaborators", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> editCollaboratorFromProposal(
            @Parameter(description = "Proposal reference", required = true) @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Collaborator request", required = true) @RequestBody CollaboratorRequest collaboratorRequest);

    @Operation(summary = "Edit bulk collaborators", description = "Edits multiple collaborators in a proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Collaborators updated successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @RequestMapping(value = "/{proposalRef}/bulkCollaborators", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> editBulkCollaboratorsFromProposal(
            @Parameter(description = "Proposal reference", required = true) @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Collaborators request", required = true) @RequestBody CollaboratorsRequest collaboratorsRequest);

    @Operation(summary = "Remove collaborator", description = "Removes a collaborator from a proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Collaborator removed successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @RequestMapping(value = "/{proposalRef}/collaborators", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> removeCollaboratorFromProposal(
            @Parameter(description = "Proposal reference", required = true) @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Collaborator request", required = true) @RequestBody CollaboratorRequest collaboratorRequest);

    @Operation(summary = "Remove bulk collaborators", description = "Removes multiple collaborators from a proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Collaborators removed successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @RequestMapping(value = "/{proposalRef}/bulkCollaborators", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> removeBulkCollaboratorsFromProposal(
            @Parameter(description = "Proposal reference", required = true) @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Collaborators request", required = true) @RequestBody CollaboratorsRequest collaboratorsRequest);
}
