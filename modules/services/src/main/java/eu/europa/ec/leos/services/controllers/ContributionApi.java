package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.exception.LeosErrorMessage;
import eu.europa.ec.leos.services.dto.request.ApplyContributionsRequest;
import eu.europa.ec.leos.services.dto.request.CloneProposalRequest;
import eu.europa.ec.leos.services.dto.request.SendFeedbackRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.response.DeclineContributionResponse;
import eu.europa.ec.leos.services.response.MergeContributionResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Tag(name = "Contribution", description = "Contribution management API")
public interface ContributionApi {

    @Operation(summary = "Create clone proposal", description = "Creates a cloned proposal for contribution")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Clone proposal created successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(value = "/create-clone-proposal/{legFileId}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> createCloneProposal(
            @Parameter(description = "LEG file ID", required = true) @PathVariable("legFileId") String legFileId,
            @Parameter(description = "Clone proposal request", required = true) @RequestBody CloneProposalRequest cloneRequest);

    @Operation(summary = "Update revision status", description = "Updates cloned proposal revision status")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Revision status updated successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request", content = @Content)
    })
    @PostMapping(value = "/revision-done/{proposalRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> updateClonedProposalRevisionStatus(
            @Parameter(description = "Proposal reference", required = true) @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "LEG file ID", required = true) @RequestBody String legFileId);

    @Operation(summary = "List contributions", description = "Lists all contributions for a document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contributions retrieved successfully")
    })
    @GetMapping(value = "/list-contributions/{documentRef}/{documentType}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> listContributionsForDocument(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Document type", required = true) @PathVariable("documentType") String documentType);

    @Operation(summary = "View merge pane", description = "Views merge pane for contribution comparison")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Merge pane retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/view-merge-pane/{documentRef}/{documentType}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<DocumentViewResponse> viewMergePane(
            HttpServletRequest request,
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Document type", required = true) @PathVariable("documentType") String documentType,
            @Parameter(description = "Contribution version reference", required = true) @RequestParam String contributionVersionRef,
            @Parameter(description = "LEG file name", required = true) @RequestParam String legFileName) throws Exception;

    @Operation(summary = "Decline contribution", description = "Declines a contribution")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contribution declined successfully")
    })
    @PostMapping(value = "/decline-contributions/{documentVersionedRef}/{documentType}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<DeclineContributionResponse> declineContribution(
            @Parameter(description = "Document versioned reference", required = true) @PathVariable("documentVersionedRef") String documentVersionedRef,
            @Parameter(description = "Document type", required = true) @PathVariable("documentType") String documentType);

    @Operation(summary = "Merge contribution", description = "Merges a contribution into the document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contribution merged successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(value = "/merge-contributions/{documentRef}/{documentType}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<MergeContributionResponse> mergeContribution(
            @Parameter(description = "Document reference", required = true) @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Presenter ID", required = true) @RequestHeader("presenterId") String presenterId,
            @Parameter(description = "Apply contributions request", required = true) @RequestBody ApplyContributionsRequest applyContributionsRequest) throws Exception;

    @Operation(summary = "Mark as processed", description = "Marks a contribution as processed")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contribution marked as processed successfully")
    })
    @PostMapping(value = "/mark-as-processed/{contributionVersionRef}/{documentType}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> markAsProcessed(
            @Parameter(description = "Contribution version reference", required = true) @PathVariable("contributionVersionRef") String contributionVersionRef,
            @Parameter(description = "Document type", required = true) @PathVariable("documentType") String documentType);

    @Operation(summary = "Get milestone contribution", description = "Gets cloned milestone contribution")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Milestone contribution retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @RequestMapping(value = "/milestones/{proposalRef}/viewContribution/{legFileName}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> getClonedMilestoneContribution(
            @Parameter(description = "Proposal reference", required = true) @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "LEG file name", required = true) @PathVariable("legFileName") String clonedLegFileName,
            @Parameter(description = "Original LEG file ID", required = true) @RequestParam("legFileId") String originalLegFileId);

    @Operation(summary = "Send feedback", description = "Sends feedback for a contribution")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Feedback sent successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(value = "/milestones/sendFeedback", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> sendFeedback(
            @Parameter(description = "Send feedback request", required = true) @RequestBody SendFeedbackRequest sendFeedbackRequest);

    @Operation(summary = "Count feedbacks", description = "Counts feedback annotations")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Feedbacks counted successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(value = "/{legFileName}/{proposalRef}/count-feedbacks/{versionedReference}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> countFeedbacks(
            @Parameter(description = "LEG file name", required = true) @PathVariable("legFileName") String legFileName,
            @Parameter(description = "Versioned reference", required = true) @PathVariable("versionedReference") String versionedReference,
            @Parameter(description = "Proposal reference", required = true) @PathVariable("proposalRef") String proposalRef);

    @Operation(summary = "Accept milestone document", description = "Accepts a document in milestone")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document accepted successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @LeosErrorMessage("Unexpected error occurred while handling accept annex on milestone")
    @GetMapping(value = "/milestones/accept-doc/{proposalRef}/{annexRef}/{legFileName}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> milestoneAcceptAnnex(
            @Parameter(description = "Proposal reference", required = true) @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Annex reference", required = true) @PathVariable("annexRef") String annexRef,
            @Parameter(description = "LEG file name", required = true) @PathVariable("legFileName") String legFileName,
            @Parameter(description = "Original LEG file ID", required = true) @RequestParam(value = "originalLegFileId") String originalLegFileId,
            @Parameter(description = "Is added", required = true) @RequestParam("isAdded") boolean isAdded,
            @Parameter(description = "Document category") @RequestParam(value = "docCategory", required = false) String docCategory) throws IOException;

    @Operation(summary = "Reject milestone document", description = "Rejects a document in milestone")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document rejected successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @LeosErrorMessage("Unexpected error occurred while handling reject annex on milestone")
    @GetMapping(value = "/milestones/reject-doc/{proposalRef}/{docRef}/{milestoneLegFileName}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> milestoneRejectAnnex(
            @Parameter(description = "Proposal reference", required = true) @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Document reference", required = true) @PathVariable("docRef") String docRef,
            @Parameter(description = "Milestone LEG file name", required = true) @PathVariable("milestoneLegFileName") String milestoneLegFileName,
            @Parameter(description = "Is added", required = true) @RequestParam("isAdded") boolean isAdded,
            @Parameter(description = "Original LEG file ID", required = true) @RequestParam(value = "originalLegFileId") String originalLegFileId) throws IOException;
}
