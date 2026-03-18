package eu.europa.ec.leos.repository.controllers;

import eu.europa.ec.leos.repository.controllers.requests.CreateDocumentRequest;
import eu.europa.ec.leos.repository.controllers.requests.FindDocumentsRequest;
import eu.europa.ec.leos.repository.controllers.requests.OnCreateFromContent;
import eu.europa.ec.leos.repository.controllers.requests.OnCreateFromSource;
import eu.europa.ec.leos.repository.controllers.requests.OnUpdateWithContent;
import eu.europa.ec.leos.repository.controllers.requests.OnUpdateWithoutContent;
import eu.europa.ec.leos.repository.controllers.requests.UpdateDocumentRequest;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.model.LeosDocumentList;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.util.List;

@Tag(name = "Document", description = "Document management API")
public interface DocumentApi {

    @Operation(summary = "Create document from content", description = "Creates a new document with provided content")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document created successfully", content = @Content(schema = @Schema(implementation = LeosDocument.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PutMapping(path = "/document/create-with-content", consumes = {MediaType.APPLICATION_JSON_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> createDocumentFromContent(@Validated(OnCreateFromContent.class) @Valid @RequestBody CreateDocumentRequest createDocumentRequest) throws RepositoryException;

    @Operation(summary = "Create document from source", description = "Creates a new document from an existing source document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document created successfully", content = @Content(schema = @Schema(implementation = LeosDocument.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PutMapping(path = "/document/create-with-source", consumes = {MediaType.APPLICATION_JSON_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> createDocumentFromSource(@Validated(OnCreateFromSource.class) @Valid @RequestBody CreateDocumentRequest createDocumentRequest) throws RepositoryException;

    @Operation(summary = "Delete document by version ID", description = "Deletes a document by its version ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Document not found", content = @Content)
    })
    @DeleteMapping(path = "/document/delete-by-id/{versionId}")
    ResponseEntity deleteDocumentById(@Parameter(description = "Version ID") @PathVariable("versionId") BigDecimal versionId) throws RepositoryException;

    @Operation(summary = "Delete document by reference", description = "Deletes a document by its reference")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Document not found", content = @Content)
    })
    @DeleteMapping(path = "/document/delete-by-ref/{docRef}")
    ResponseEntity deleteDocumentByRef(@Parameter(description = "Document reference") @PathVariable("docRef") String docRef) throws RepositoryException;

    @Operation(summary = "Update document content", description = "Updates document content and metadata")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document updated successfully", content = @Content(schema = @Schema(implementation = LeosDocument.class))),
            @ApiResponse(responseCode = "404", description = "Document not found", content = @Content)
    })
    @PutMapping(path = "/document/update-content/{versionId}", consumes = {MediaType.APPLICATION_JSON_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> updateDocument(@Parameter(description = "Version ID") @PathVariable("versionId") BigDecimal versionId,
                                          @Validated(OnUpdateWithContent.class) @Valid @RequestBody UpdateDocumentRequest updateDocumentRequest) throws Exception;

    @Operation(summary = "Update document metadata", description = "Updates only document metadata without content")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Metadata updated successfully", content = @Content(schema = @Schema(implementation = LeosDocument.class))),
            @ApiResponse(responseCode = "404", description = "Document not found", content = @Content)
    })
    @PutMapping(path = "/document/update-metadata/{docRef}/{versionId}", consumes = {MediaType.APPLICATION_JSON_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> updateDocumentMetadata(@Parameter(description = "Version ID") @PathVariable("versionId") BigDecimal versionId,
                                                  @Parameter(description = "Document reference") @PathVariable("docRef") String docRef,
                                                  @Validated(OnUpdateWithoutContent.class) @Valid @RequestBody UpdateDocumentRequest updateDocumentRequest,
                                                  @Parameter(description = "Latest version flag") @RequestParam("latest") Boolean latest) throws Exception;

    @Operation(summary = "Archive document", description = "Archives a document by its reference")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document archived successfully", content = @Content(schema = @Schema(implementation = LeosDocument.class))),
            @ApiResponse(responseCode = "404", description = "Document not found", content = @Content)
    })
    @GetMapping(path = "/document/archive/{docRef}", consumes = {}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> archiveDocument(@Parameter(description = "Document reference") @PathVariable("docRef") String docRef,
                                           @Parameter(description = "User ID") @RequestParam("userId") String userName) throws Exception;

    @Operation(summary = "Archive document version", description = "Archives a specific version of a document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version archived successfully", content = @Content(schema = @Schema(implementation = LeosDocument.class))),
            @ApiResponse(responseCode = "404", description = "Version not found", content = @Content)
    })
    @PutMapping(path = "/document/archive-version/{docRef}/{version}", consumes = {}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> archiveDocumentVersion(@Parameter(description = "Document reference") @PathVariable("docRef") String docRef,
                                                  @Parameter(description = "Version label") @PathVariable("version") String version) throws Exception;

    @Operation(summary = "Find documents by collaborator", description = "Retrieves documents for a specific user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Documents retrieved successfully", content = @Content(schema = @Schema(implementation = LeosDocumentList.class)))
    })
    @GetMapping(path = "/documents/find-by-collaborator/{userName}", consumes = {}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity findDocumentsByUserName(@Parameter(description = "User role") @RequestParam("role") String role,
                                          @Parameter(description = "Document category") @RequestParam(value = "category", defaultValue = "") String category,
                                          @Parameter(description = "User name") @PathVariable("userName") String userName);

    @Operation(summary = "Find documents by collaborator or entity", description = "Retrieves documents for a user or entity")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Documents retrieved successfully", content = @Content(schema = @Schema(implementation = LeosDocumentList.class)))
    })
    @GetMapping(path = "/documents/find-by-collaborator/{userName}/{entities}", consumes = {}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity findDocumentsByUserNameOrEntityName(@Parameter(description = "User role") @RequestParam("role") String role,
                                                       @Parameter(description = "Document category") @RequestParam(value = "category", defaultValue = "") String category,
                                                       @Parameter(description = "User name") @PathVariable("userName") String userName,
                                                       @Parameter(description = "Entity names") @PathVariable("entities") String entities);

    @Operation(summary = "Find document by version ID", description = "Retrieves a document by its version ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document found", content = @Content(schema = @Schema(implementation = LeosDocument.class))),
            @ApiResponse(responseCode = "404", description = "Document not found", content = @Content)
    })
    @GetMapping(path = "/document/find-version/{versionId}", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> findDocumentById(@Parameter(description = "Version ID") @PathVariable("versionId") BigDecimal versionId,
                                            @Parameter(description = "Document category") @RequestParam("category") String category,
                                            @Parameter(description = "Latest version flag") @RequestParam("latest") Boolean latest) throws RepositoryException;

    @Operation(summary = "Search document versions", description = "Searches for document versions by reference and user logins")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Versions found", content = @Content(schema = @Schema(implementation = LeosDocumentList.class)))
    })
    @PostMapping(path = "/document/search-versions/{ref}", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> searchVersions(@Parameter(description = "Document reference") @PathVariable("ref") String docRef,
                                          @Parameter(description = "Version type") @RequestParam("versionType") String versionType,
                                          @Parameter(description = "User logins") @RequestBody List<String> logins);

    @Operation(summary = "Find all versions", description = "Retrieves all versions of a document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully", content = @Content(schema = @Schema(implementation = LeosDocumentList.class)))
    })
    @GetMapping(path = "/document/all-versions/{docRef}")
    ResponseEntity<Object> findAllVersionsByDocumentRef(@Parameter(description = "Document reference") @PathVariable("docRef") String docRef);

    @Operation(summary = "Find document by reference", description = "Retrieves the latest version of a document by reference")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document found", content = @Content(schema = @Schema(implementation = LeosDocument.class)))
    })
    @GetMapping(path = "/documents/last-version/{docRef}", consumes = {}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<LeosDocument> findDocumentsByRef(@Parameter(description = "Document reference") @PathVariable("docRef") String ref,
                                                     @Parameter(description = "Document category") @RequestParam("category") String category,
                                                     @Parameter(description = "Include content") @RequestParam(value = "withContent", defaultValue = "true") boolean withContent);

    @Operation(summary = "Get next version label", description = "Calculates the next version label")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Next version label calculated")
    })
    @GetMapping(path = "/document/next-version-label", produces = MediaType.TEXT_PLAIN_VALUE)
    ResponseEntity<String> getNextVersionLabel(@Parameter(description = "Version type") @RequestParam("versionType") String versionType,
                                               @Parameter(description = "Old version") @RequestParam(name = "oldVersion", defaultValue = "") String oldVersion);

    @Operation(summary = "Find all minors for intermediate", description = "Retrieves minor versions for an intermediate version")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully", content = @Content(schema = @Schema(implementation = LeosDocumentList.class)))
    })
    @GetMapping(path = "/documents/all-minors-for-intermediate/{docRef}", consumes = {}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> findAllMinorsForIntermediate(@Parameter(description = "Document reference") @PathVariable("docRef") String docRef,
                                                        @Parameter(description = "Current intermediate version") @RequestParam("currIntVersion") String currIntVersion,
                                                        @Parameter(description = "Start index") @RequestParam("startIndex") Integer startIndex,
                                                        @Parameter(description = "Max results") @RequestParam("maxResults") Integer maxResults);

    @Operation(summary = "Find all major versions", description = "Retrieves all major versions of a document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully", content = @Content(schema = @Schema(implementation = LeosDocumentList.class)))
    })
    @GetMapping(path = "/documents/all-majors/{docRef}", consumes = {}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> findAllMajors(@Parameter(description = "Document reference") @PathVariable("docRef") String docRef,
                                         @Parameter(description = "Start index") @RequestParam("startIndex") Integer startIndex,
                                         @Parameter(description = "Max results") @RequestParam("maxResults") Integer maxResult);

    @Operation(summary = "Count all minors for intermediate", description = "Counts minor versions for an intermediate version")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully")
    })
    @GetMapping(path = "/documents/count-all-minors-for-intermediate/{docRef}", consumes = {}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Long> getAllMinorsCountForIntermediate(@Parameter(description = "Document reference") @PathVariable("docRef") String docRef,
                                                          @Parameter(description = "Current intermediate version") @RequestParam("currIntVersion") String currIntVersion);

    @Operation(summary = "Count all major versions", description = "Counts all major versions of a document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully")
    })
    @GetMapping(path = "/documents/count-all-majors/{docRef}", consumes = {}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Integer> getAllMajorsCount(@Parameter(description = "Document reference") @PathVariable("docRef") String docRef);

    @Operation(summary = "Find recent minor versions", description = "Retrieves recent minor versions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully", content = @Content(schema = @Schema(implementation = LeosDocumentList.class)))
    })
    @GetMapping(path = "/documents/recent-minor-versions/{docRef}", consumes = {}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> findRecentMinorVersions(@Parameter(description = "Document reference") @PathVariable("docRef") String docRef,
                                                   @Parameter(description = "Last major version") @RequestParam("lastMajorVersion") String lastMajorVersion,
                                                   @Parameter(description = "Start index") @RequestParam("startIndex") Integer startIndex,
                                                   @Parameter(description = "Max results") @RequestParam("maxResults") Integer maxResults);

    @Operation(summary = "Count recent minor versions", description = "Counts recent minor versions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully")
    })
    @GetMapping(path = "/documents/count-recent-minor-versions/{docRef}", consumes = {}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Long> getRecentMinorVersionsCount(@Parameter(description = "Document reference") @PathVariable("docRef") String docRef,
                                                     @Parameter(description = "Version label") @RequestParam("versionLabel") String versionLabel);

    @Operation(summary = "Find latest major version", description = "Retrieves the latest major version of a document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version found", content = @Content(schema = @Schema(implementation = LeosDocument.class))),
            @ApiResponse(responseCode = "404", description = "Version not found", content = @Content)
    })
    @GetMapping(path = "/documents/latest-major-version/{docRef}", consumes = {}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<LeosDocument> findLatestMajorVersionByRef(@Parameter(description = "Document reference") @PathVariable("docRef") String docRef);

    @Operation(summary = "Find first version", description = "Retrieves the first version of a document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version found", content = @Content(schema = @Schema(implementation = LeosDocument.class))),
            @ApiResponse(responseCode = "404", description = "Version not found", content = @Content)
    })
    @GetMapping(path = "/documents/first-version/{docRef}", consumes = {}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> findFirstVersion(@Parameter(description = "Document reference") @PathVariable("docRef") String docRef);

    @Operation(summary = "Find document by version label", description = "Retrieves a document by its version label")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document found", content = @Content(schema = @Schema(implementation = LeosDocument.class))),
            @ApiResponse(responseCode = "404", description = "Document not found", content = @Content)
    })
    @GetMapping(path = "/document/{docRef}/find-by-version/{versionLabel}", consumes = {}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> findDocumentByVersion(@Parameter(description = "Document reference") @PathVariable("docRef") String docRef,
                                                 @Parameter(description = "Version label") @PathVariable("versionLabel") String versionLabel);

    @Operation(summary = "Find document by name", description = "Retrieves a document by its name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document found", content = @Content(schema = @Schema(implementation = LeosDocument.class))),
            @ApiResponse(responseCode = "404", description = "Document not found", content = @Content)
    })
    @GetMapping(path = "/documents/find-by-name/{name}", consumes = {}, produces = {"application/json;charset=UTF-8"})
    ResponseEntity<LeosDocument> findDocumentByName(@Parameter(description = "Document name") @PathVariable("name") String name) throws RepositoryException;

    @Operation(summary = "Find documents by status", description = "Retrieves documents by their status")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Documents retrieved successfully", content = @Content(schema = @Schema(implementation = LeosDocumentList.class)))
    })
    @GetMapping(path = "/documents/find-by-status/{status}", consumes = {}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> findDocumentByStatus(@Parameter(description = "Document status") @PathVariable("status") String status);

    @Operation(summary = "Find documents using filter", description = "Retrieves documents using filter criteria")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Documents retrieved successfully", content = @Content(schema = @Schema(implementation = LeosDocumentList.class)))
    })
    @PostMapping(path = "/documents/find-by-filter", consumes = {MediaType.APPLICATION_JSON_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> findDocumentsUsingFilter(@Parameter(description = "Package name") @RequestParam(value = "packageName", required = false, defaultValue = "%25") String packageName,
                                                    @RequestBody FindDocumentsRequest findDocumentsRequest,
                                                    @Parameter(description = "Start index") @RequestParam("startIndex") Integer startIndex,
                                                    @Parameter(description = "Max results") @RequestParam("maxResults") Integer maxResults,
                                                    @Parameter(description = "Fetch content") @RequestParam(value = "fetchContent", required = false, defaultValue = "false") Boolean fetchContent) throws MalformedURLException;

    @Operation(summary = "Count documents using filter", description = "Counts documents matching filter criteria")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully")
    })
    @PostMapping(path = "/documents/count-by-filter", consumes = {MediaType.APPLICATION_JSON_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> countDocumentsUsingFilter(@Parameter(description = "Package name") @RequestParam(value = "packageName", required = false, defaultValue = "%25") String packageName,
                                                     @RequestBody FindDocumentsRequest findDocumentsRequest) throws MalformedURLException;

    @Operation(summary = "Find document reference by package ID", description = "Retrieves document reference by package ID and category")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reference found")
    })
    @GetMapping(path = "/documents/find-by-packageId/{packageId}", consumes = {}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> findDocumentRefByPackageIdAndCategory(@Parameter(description = "Package ID") @PathVariable("packageId") String packageId,
                                                                 @Parameter(description = "Category code") @RequestParam(value = "category", required = false, defaultValue = "%25") String categoryCode);

    @Operation(summary = "Find documents for validation", description = "Retrieves packages that need validation")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Packages retrieved successfully")
    })
    @GetMapping(path = "/documents/find-for-validation", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> findDocumentsPackagesForValidation();

    @Operation(summary = "Set documents validation status", description = "Updates validation status for documents")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status updated successfully")
    })
    @PutMapping(path = "/documents/set-docs-validation-status")
    ResponseEntity<Object> setDocumentsValidationStatus(@Parameter(description = "Version IDs") @RequestBody List<String> versionIDs) throws RepositoryException;

    @Operation(summary = "Search clones of original document", description = "Finds all clones of an original document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Clones found", content = @Content(schema = @Schema(implementation = LeosDocumentList.class)))
    })
    @GetMapping(path = "/documents/clones/find-by-original-ref/{proposalRef}", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> searchClonesOfOriginalDocument(@Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef) throws RepositoryException;
}
