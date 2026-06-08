package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.exception.LeosErrorMessage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Tag(name = "LEOS API")
public interface LeosApi {

    @Operation(summary = "Get token", description = "Retrieves authentication token for the current session")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/token", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getToken(HttpServletRequest request, HttpServletResponse response);

    @Operation(summary = "Compare contents", description = "Compares two document contents and returns the differences")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contents compared successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/compare", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    ResponseEntity<Object> compareContents(
            HttpServletRequest request,
            @Parameter(description = "Mode") @RequestParam("mode") int mode,
            @Parameter(description = "First content") @RequestParam("firstContent") MultipartFile firstContent,
            @Parameter(description = "Second content") @RequestParam("secondContent") MultipartFile secondContent);

    @Operation(summary = "Get proposals for user", description = "Retrieves all proposals accessible by the specified user with optional filters")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Proposals retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/search/{userId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getProposalsForUser(
            @Parameter(description = "User ID") @PathVariable("userId") String userId,
            @Parameter(description = "Proposal ID") @RequestParam(value = "proposalId", defaultValue = "") String proposalId,
            @Parameter(description = "LEG file status") @RequestParam(value = "legFileStatus", defaultValue = "") String legFileStatus);

    @Operation(summary = "Get document for user", description = "Retrieves a specific document for the specified user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/search/{userId}/{documentRef}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getDocumentForUser(
            @Parameter(description = "User ID") @PathVariable("userId") String userId,
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Get LEG file", description = "Retrieves a LEG file by ID with optional download flag")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "LEG file retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/searchlegfile/{legFileId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    ResponseEntity<Object> getLegFile(
            @Parameter(description = "LEG file ID") @PathVariable("legFileId") String legFileId,
            @Parameter(description = "Is download") @RequestParam(required = false, defaultValue = "false") Boolean isDownload);

    @Operation(summary = "Get LEG file any status", description = "Retrieves a LEG file by ID regardless of its status")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "LEG file retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/searchlegfile/anystatus/{legFileId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    ResponseEntity<Object> getLegFileAnyStatus(
            @Parameter(description = "LEG file ID") @PathVariable("legFileId") String legFileId,
            @Parameter(description = "Is download") @RequestParam(required = false, defaultValue = "false") Boolean isDownload);

    @Operation(summary = "Get PDF from LEG file", description = "Generates and retrieves a PDF rendition from an uploaded LEG file")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "PDF retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/renditionfromleg", method = RequestMethod.POST, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    ResponseEntity<Object> getPdfFromLegFile(
            @Parameter(description = "LEG file") @RequestParam("legFile") MultipartFile legFile,
            @Parameter(description = "Type") @RequestParam("type") String type);

    @Operation(summary = "Get LEG files for proposal", description = "Retrieves all milestone LEG files associated with a proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "LEG files retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/milestones/{proposalRef}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getLegFilesForProposal(@Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef);

    @Operation(summary = "Create collection from LEG", description = "Creates a new document collection from an uploaded LEG file")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Collection created successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/collectionfromleg", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> createCollectionFromLeg(@Parameter(description = "File") @RequestParam("file") MultipartFile file);

    @Operation(summary = "Clone proposal from LEG", description = "Creates a cloned proposal from a LEG file for a target user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Proposal cloned successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/cloneProposal", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> cloneProposalFromLeg(
            @Parameter(description = "LEG file") @RequestParam("file") MultipartFile legFile,
            @Parameter(description = "Target user") @RequestParam("targetUser") String targetUser,
            @Parameter(description = "Connected entity") @RequestParam("connectedEntity") String connectedEntity,
            @Parameter(description = "ISC reference") @RequestParam("iscRef") String iscRef,
            @Parameter(description = "Proposal callback URL") @RequestParam(value = "originCallbackURL", required = false) String originCallbackURL);

    @Operation(summary = "Update cloned proposal revision status", description = "Updates the revision status of a cloned proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status updated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/revisionDone", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> updateClonedProposalRevisionStatus(
            @Parameter(description = "Clone proposal ID") @RequestParam("cloneProposalId") String cloneProposalId,
            @Parameter(description = "LEG file ID") @RequestParam("legFileId") String legFileId);

    @Operation(summary = "Get export package", description = "Downloads an export package for the specified proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Export package retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/export/{proposalRef}/{exportPackageId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    ResponseEntity<Object> getExportPackage(
            @Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Export package ID") @PathVariable("exportPackageId") String exportPackageId);

    @Operation(summary = "Get proposal details", description = "Retrieves detailed information about a specific proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Proposal details retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/proposals/{proposalRef}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getProposalDetails(@Parameter(description = "Proposal reference") @PathVariable String proposalRef);

    @Operation(summary = "Download proposal", description = "Downloads the complete proposal package")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Proposal downloaded successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/proposals/{proposalRef}/download", method = RequestMethod.GET, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    ResponseEntity<Object> downloadProposal(@Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef);

    @Operation(summary = "Create proposal annex", description = "Creates a new annex document for the specified proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Annex created successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/proposals/{proposalRef}/createAnnex", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> createProposalAnnex(@Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef);

    @Operation(summary = "Create foreign annex", description = "Create foreign annex for hybrid documents")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Annex created successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @LeosErrorMessage("Unexpected error occurred while creating new bill foreign annex")
    @RequestMapping(value = "/secured/proposals/{proposalRef}/createForeignAnnex", method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> createProposalForeignAnnex(@PathVariable("proposalRef") String proposalRef,
            @RequestParam("foreignAnnexFile") MultipartFile foreignAnnexFile) throws Exception;

    @Operation(summary = "Upload annex rendition", description = "Upload the annex rendition of a specific annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Title updated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/proposals/{proposalRef}/upload-annex-rendition/{annexId}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> uploadForeignAnnexRendition(
            @Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Annex ID") @PathVariable("annexId") String annexId,
            @Parameter(description = "Foreign Annex Rendition") @RequestParam("foreignAnnexRendition") MultipartFile foreignAnnexRendition) throws Exception;

    @Operation(summary = "Update annex title", description = "Updates the title of a specific annex document")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Title updated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/proposals/{proposalRef}/update-annex-title/{annexId}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> updateAnnexTitle(
            @Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Annex ID") @PathVariable("annexId") String annexId,
            @Parameter(description = "Title") @RequestParam("title") String title);

    @Operation(summary = "Update foreign annex", description = "Update foreign annex for hybrid documents")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Title updated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @LeosErrorMessage("Unexpected error occurred while updating new bill foreign annex")
    @RequestMapping(value = "/secured/proposals/{proposalRef}/updateForeignAnnex/{annexId}", method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> updateForeignAnnex(@PathVariable("proposalRef") String proposalRef,
            @PathVariable("annexId") String annexId,
            @RequestParam("foreignAnnexFile") MultipartFile foreignAnnexFile) throws Exception;

    @Operation(summary = "Update explanatory title", description = "Updates the title of a specific explanatory document")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Title updated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/proposals/{proposalRef}/update-explanatory-title/{docId}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> updateExplanatoryTitle(
            @Parameter(description = "Proposal reference") @PathVariable String proposalRef,
            @Parameter(description = "Document ID") @PathVariable String docId,
            @Parameter(description = "Title") @RequestParam String title);

    @Operation(summary = "Get proposal milestones", description = "Retrieves all milestones for a proposal with optional language filter")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Milestones retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/proposals/{proposalRef}/milestones", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getProposalMilestones(
            @Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Language") @RequestParam(value = "language", required = false) String language);

    @Operation(summary = "Delete annex", description = "Deletes a specific annex document from the proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Annex deleted successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/proposals/{proposalRef}/deleteAnnex/{annexRef}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> deleteAnnex(
            @Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Annex reference") @PathVariable("annexRef") String annexRef);

    @Operation(summary = "Update proposal annex order", description = "Changes the order of an annex within the proposal by moving it up or down")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Order updated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/updateAnnexOrder/{proposalRef}/annex/{annexRef}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> updateProposalAnnexOrder(
            @Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Annex reference") @PathVariable("annexRef") String annexRef,
            @Parameter(description = "Move direction") @RequestParam String moveDirection,
            @Parameter(description = "Times to move") @RequestParam Integer timesToMove);

    @Operation(summary = "Update proposal annex position", description = "Updates the position of an annex by specifying previous and next indices")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Position updated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/updateAnnexPosition/{proposalRef}/annex", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> updateProposalAnnexPosition(
            @Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Previous index") @RequestParam Integer previousIndex,
            @Parameter(description = "Next index") @RequestParam Integer nextIndex,
            HttpServletRequest request);

    @Operation(summary = "Create milestone", description = "Creates a new milestone for the proposal with a comment")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Milestone created successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/proposals/{proposalRef}/milestones", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> createMilestone(
            @Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Milestone comment") @RequestBody String milestoneComment) throws Exception;

    @Operation(summary = "Get current user", description = "Retrieves information about the currently authenticated user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/users/current", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getCurrentUser();

    @Operation(summary = "Get document", description = "Retrieves the XML content of a specific document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/document/{documentRef}", method = RequestMethod.GET, produces = MediaType.APPLICATION_XML_VALUE)
    @ResponseBody
    ResponseEntity<Object> getDocument(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Get config", description = "Retrieves application configuration settings")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Config retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/config", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getConfig(HttpServletRequest request);

    @Operation(summary = "Get list milestone document views", description = "Retrieves document views for all milestones using LEG file information")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Views retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/list-milestones-view/{documentRef}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getListMilestoneDocumentViews(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "LEG file name") @RequestParam("legFileName") String legFileName,
            @Parameter(description = "LEG file ID") @RequestParam("legFileId") String legFileId);

    @Operation(summary = "Get list milestone document views from document", description = "Retrieves document views for all milestones using versioned reference")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Views retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/list-milestones-view-version/{documentRef}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getListMilestoneDocumentViewsFromDoc(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Versioned reference") @RequestParam("versionedReference") String versionedReference);

    @Operation(summary = "Get milestone export PDF", description = "Exports milestone document views as a PDF using LEG file information")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "PDF exported successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/list-milestones-view/pdf-export/{documentRef}", method = RequestMethod.GET, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    ResponseEntity<Object> getMilestoneExportPDF(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "LEG file name") @RequestParam("legFileName") String legFileName,
            @Parameter(description = "LEG file ID") @RequestParam("legFileId") String legFileId);

    @Operation(summary = "Get milestone export PDF from version", description = "Exports milestone document views as a PDF using versioned reference")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "PDF exported successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/list-milestones-view-version/pdf-export/{documentRef}", method = RequestMethod.GET, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    ResponseEntity<Object> getMilestoneExportPDFFromVersion(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Versioned reference") @RequestParam("versionedReference") String versionedReference);

    @Operation(summary = "Get HTML renditions", description = "Generates HTML renditions from an uploaded document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Renditions retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/getHtmlRenditions", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getHtmlRenditions(@Parameter(description = "Document") @RequestParam("document") MultipartFile document);

    @Operation(summary = "CON validation", description = "Performs consilium validation on an uploaded ZIP file and sends results to email")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Validation completed successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/conValidation", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> conValidation(
            @Parameter(description = "ZIP file") @RequestParam("zipFile") MultipartFile zipFile,
            @Parameter(description = "Email") @RequestParam(name = "email", required = true) String email);

    @Operation(summary = "Get organizations", description = "Retrieves the list of all organizations")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Organizations retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/organizations", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getOrganizations();

    @Operation(summary = "Find document reference by package ID and category", description = "Retrieves document reference using package ID and category")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document reference retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/document-ref/{packageId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> findDocumentRefByPackageIdAndCategory(@Parameter(description = "Package ID") @PathVariable("packageId") String packageId);

    @Operation(summary = "Get proposals report", description = "Retrieves proposals report in CSV format from Report service")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Report retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/secured/proposals-report", method = RequestMethod.GET, produces = "text/csv")
    @ResponseBody
    ResponseEntity<String> getProposalsReport();
}
