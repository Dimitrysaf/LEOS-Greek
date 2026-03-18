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

import eu.europa.ec.leos.services.dto.request.CreateExplanatoryDocumentRequest;
import eu.europa.ec.leos.services.dto.request.CreateProposalCopyRequest;
import eu.europa.ec.leos.services.dto.request.ExplanatoryRequest;
import eu.europa.ec.leos.services.dto.request.UpdateProposalRequest;
import eu.europa.ec.leos.services.dto.response.LegFileValidation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Tag(name = "Proposal Management")
public interface ProposalApi {

    @Operation(summary = "Copy act", description = "Creates a copy of an existing act with all its associated documents")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Act copied successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/copyAct", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> copyAct(@RequestBody CreateProposalCopyRequest request);

    @Operation(summary = "Create linguistic versions", description = "Creates linguistic versions from a milestone for the specified leg file")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Linguistic versions created successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/{legFileId}/linguistic-versions", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> createLinguisticVersions(@Parameter(description = "Leg file ID") @PathVariable String legFileId,
                                                     @RequestBody List<String> linguisticVersions);

    @Operation(summary = "Update proposal metadata", description = "Updates metadata information for the specified proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Metadata updated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/{proposalRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> updateProposalMetadata(@Parameter(description = "Proposal reference") @PathVariable String proposalRef,
                                                   @RequestBody UpdateProposalRequest request);

    @Operation(summary = "Update proposal document purpose", description = "Updates the document purpose and EEA relevance for the specified proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document purpose updated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/updateDocPurpose/{proposalRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> updateProposalDocPurpose(@Parameter(description = "Proposal reference") @PathVariable String proposalRef,
                                                     @RequestBody UpdateProposalRequest request);

    @Operation(summary = "Delete proposal", description = "Permanently deletes the specified proposal and all its associated documents")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Proposal deleted successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping(value = "/{proposalRef}")
    @ResponseBody
    ResponseEntity<Object> deleteProposal(@Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef);

    @Operation(summary = "Search user", description = "Searches for users in the repository by search key")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/searchUser", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> searchUser(@Parameter(description = "Search key") @RequestParam("searchKey") String searchKey);

    @Operation(summary = "Search users by job title", description = "Retrieves users from the repository filtered by job title")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/searchUsersByJobTitle", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> searchUsersByJobTitle(@Parameter(description = "Job title") @RequestParam("jobTitle") String jobTitle);

    @Operation(summary = "Create explanatory", description = "Creates an explanatory document for the specified proposal using a template")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Explanatory created successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/createExplanatory", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> createExplanatory(@RequestBody ExplanatoryRequest request);

    @Operation(summary = "Create explanatory document", description = "Creates a new explanatory document with specified template, purpose and EEA relevance")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Explanatory document created successfully"),
            @ApiResponse(responseCode = "400", description = "Method not supported"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/createExplanatoryDocument", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> createExplanatoryDocument(@RequestBody CreateExplanatoryDocumentRequest request);

    @Operation(summary = "Get exports", description = "Retrieves all export packages for the specified proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Exports retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{proposalRef}/getExports", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getExports(@Parameter(description = "Proposal reference") @PathVariable String proposalRef);

    @Operation(summary = "Update export", description = "Updates an export package with new comments")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Export updated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(value = "/{proposalRef}/updateExport/{exportId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> updateExport(@Parameter(description = "Proposal reference") @PathVariable String proposalRef,
                                        @Parameter(description = "Export ID") @PathVariable String exportId,
                                        @RequestBody List<String> comments);

    @Operation(summary = "Delete export", description = "Deletes the specified export package from the proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Export deleted successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping(value = "/{proposalRef}/deleteExport/{exportId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> deleteExport(@Parameter(description = "Proposal reference") @PathVariable String proposalRef,
                                        @Parameter(description = "Export ID") @PathVariable String exportId);

    @Operation(summary = "Notify export", description = "Sends notification for the specified export package")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Export notified successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{proposalRef}/notifyExport/{exportId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> notifyExport(@Parameter(description = "Proposal reference") @PathVariable String proposalRef,
                                        @Parameter(description = "Export ID") @PathVariable String exportId);

    @Operation(summary = "Preview export", description = "Downloads the specified export package for preview")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Export previewed successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{proposalRef}/previewExport/{exportId}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    ResponseEntity<Object> previewExport(@Parameter(description = "Proposal reference") @PathVariable String proposalRef,
                                         @Parameter(description = "Export ID") @PathVariable String exportId);

    @Operation(summary = "Delete explanatory", description = "Deletes the specified explanatory document from the proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Explanatory deleted successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping(value = "/{proposalRef}/deleteExplanatory/{explanatoryRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> deleteExplanatory(@Parameter(description = "Proposal reference") @PathVariable String proposalRef,
                                             @Parameter(description = "Explanatory reference") @PathVariable String explanatoryRef);

    @Operation(summary = "Export proposal", description = "Initiates export process for the proposal with specified output format")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Proposal exported successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{proposalRef}/export", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> exportProposal(@Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef,
                                          @Parameter(description = "Export output") @RequestParam String exportOutput);

    @Operation(summary = "Download export proposal", description = "Downloads the exported proposal in the specified output format")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Export downloaded successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{proposalRef}/export/download", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    ResponseEntity<Object> exportProposalDownload(@Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef,
                                                   @Parameter(description = "Export output") @RequestParam String exportOutput);

    @Operation(summary = "Upload proposal", description = "Uploads a leg file to create a new proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Proposal uploaded successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/upload", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> uploadProposal(@Parameter(description = "Leg file") @RequestParam("legFile") MultipartFile legFile);

    @Operation(summary = "Validate leg file", description = "Validates the structure and content of an uploaded leg file")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Leg file validated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/validateLegFile", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<LegFileValidation> validateLegFile(@Parameter(description = "Leg file") @RequestParam("legFile") MultipartFile legFile);

    @Operation(summary = "ConValidate leg file", description = "Performs consilium validation on the uploaded leg file")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Leg file validated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file name"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/conValidateLegFile", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<String> conValidateLegFile(@Parameter(description = "Leg file") @RequestParam("legFile") MultipartFile legFile) throws IOException;

    @Operation(summary = "Create financial statement", description = "Creates a financial statement document for the specified proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Financial statement created successfully")
    })
    @PostMapping(value = "{proposalRef}/create-financial-statement", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    void createFinancialStatement(@Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef);

    @Operation(summary = "Delete financial statement", description = "Deletes the specified financial statement from the proposal")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Financial statement deleted successfully")
    })
    @DeleteMapping(value = "{proposalRef}/delete-financial-statement/{financialStatementRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    void deleteFinancialStatement(@Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef,
                                  @Parameter(description = "Financial statement reference") @PathVariable("financialStatementRef") String financialStatementRef);

    @Operation(summary = "Validate proposal", description = "Validates the proposal structure and content")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Proposal validated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{proposalRef}/validate", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<String> validateProposal(@Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef);
}
