package eu.europa.ec.leos.repository.controllers;

import eu.europa.ec.leos.repository.controllers.requests.CreatePackageRequest;
import eu.europa.ec.leos.repository.controllers.requests.FindDocumentsRequest;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.interfaces.PackagesFavorites;
import eu.europa.ec.leos.repository.interfaces.PackagesRecentlyChanged;
import eu.europa.ec.leos.repository.model.*;
import eu.europa.ec.leos.repository.model.Package;
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

@Tag(name = "Package", description = "Package management API")
@Validated
public interface PackageApi {

    @Operation(summary = "Create package", description = "Creates a new package with specified configuration")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Package created successfully", content = @Content(schema = @Schema(implementation = Package.class))),
            @ApiResponse(responseCode = "404", description = "Error creating package", content = @Content)
    })
    @PostMapping(path = "/package/create/{name}", consumes = {MediaType.APPLICATION_JSON_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Package> createPackage(@Parameter(description = "Package name", required = true) @PathVariable("name") String name,
                                         @Valid @RequestBody CreatePackageRequest createPackageRequest) throws Exception;

    @Operation(summary = "Delete package", description = "Deletes a package by name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Package deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Package not found", content = @Content)
    })
    @DeleteMapping(path = "/package/delete/{name}")
    ResponseEntity deletePackage(@Parameter(description = "Package name", required = true) @PathVariable("name") String packageName) throws Exception;

    @Operation(summary = "Get package by name", description = "Retrieves a package by its name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Package found", content = @Content(schema = @Schema(implementation = Package.class))),
            @ApiResponse(responseCode = "404", description = "Package not found", content = @Content)
    })
    @GetMapping(path = "/package/find-by-name/{name}")
    ResponseEntity<Object> getPackageByName(@Parameter(description = "Package name", required = true) @PathVariable("name") String name) throws MalformedURLException, RepositoryException;

    @Operation(summary = "Get linked packages by package ID", description = "Retrieves linked packages for a given package ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Linked packages retrieved successfully", content = @Content(schema = @Schema(implementation = LinkedPackageList.class)))
    })
    @GetMapping(path = "/package/find-by-pkg-id/{pkgId}")
    ResponseEntity<Object> getLinkedPackagesByPkgId(@Parameter(description = "Package ID", required = true) @PathVariable("pkgId") String pkgId) throws MalformedURLException, RepositoryException;

    @Operation(summary = "Get linked packages by linked package ID", description = "Retrieves packages linked to a specific package")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Linked packages retrieved successfully", content = @Content(schema = @Schema(implementation = LinkedPackageList.class)))
    })
    @GetMapping(path = "/package/find-by-linked-pkg-id/{linkedPkgId}")
    ResponseEntity<Object> getLinkedPackagesByLinkedPkgId(@Parameter(description = "Linked package ID", required = true) @PathVariable("linkedPkgId") String linkedPkgId) throws MalformedURLException, RepositoryException;

    @Operation(summary = "Get package by document ID", description = "Retrieves a package by document version ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Package found", content = @Content(schema = @Schema(implementation = Package.class))),
            @ApiResponse(responseCode = "404", description = "Package not found", content = @Content)
    })
    @GetMapping(path = "/package/find-by-document-id/{id}")
    ResponseEntity<Object> getPackageByDocumentId(@Parameter(description = "Document ID", required = true) @PathVariable("id") String id) throws RepositoryException;

    @Operation(summary = "Get package by ID", description = "Retrieves a package by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Package found", content = @Content(schema = @Schema(implementation = Package.class))),
            @ApiResponse(responseCode = "404", description = "Package not found", content = @Content)
    })
    @GetMapping(path = "/package/find-by-id/{id}")
    ResponseEntity<Object> getPackageById(@Parameter(description = "Package ID", required = true) @PathVariable("id") String id) throws RepositoryException;

    @Operation(summary = "Find documents by package name", description = "Retrieves documents within a package by name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Documents retrieved successfully", content = @Content(schema = @Schema(implementation = LeosDocumentList.class))),
            @ApiResponse(responseCode = "404", description = "No documents found", content = @Content)
    })
    @PostMapping(path = "/package/find-by-name/documents", consumes = {MediaType.APPLICATION_JSON_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<LeosDocumentList> findDocumentsByPackageName(@Parameter(description = "Package name") @RequestParam(value = "name", required = false, defaultValue = "%25") String name,
                                                                @Parameter(description = "Include descendants") @RequestParam(value = "descendants", required = false, defaultValue = "false") Boolean descendants,
                                                                @Parameter(description = "Fetch content") @RequestParam(value = "fetchContent", required = false, defaultValue = "false") Boolean fetchContent,
                                                                @Valid @RequestBody FindDocumentsRequest findDocumentsRequest) throws Exception;

    @Operation(summary = "Find documents by package ID", description = "Retrieves documents within a package by ID with filter")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Documents retrieved successfully", content = @Content(schema = @Schema(implementation = LeosDocumentList.class))),
            @ApiResponse(responseCode = "404", description = "No documents found", content = @Content)
    })
    @PostMapping(path = "/package/find-by-id/{id}/documents", consumes = {MediaType.APPLICATION_JSON_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<LeosDocumentList> findDocumentsByPackageId(@Parameter(description = "Package ID", required = true) @PathVariable("id") BigDecimal id,
                                                              @Parameter(description = "Include descendants") @RequestParam(value = "descendants", required = false, defaultValue = "false") Boolean descendants,
                                                              @Parameter(description = "Fetch content") @RequestParam(value = "fetchContent", required = false, defaultValue = "false") Boolean fetchContent,
                                                              @Valid @RequestBody FindDocumentsRequest findDocumentsRequest);

    @Operation(summary = "Find documents by package ID (simple)", description = "Retrieves all documents within a package by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Documents retrieved successfully", content = @Content(schema = @Schema(implementation = LeosDocumentList.class))),
            @ApiResponse(responseCode = "404", description = "No documents found", content = @Content)
    })
    @GetMapping(path = "/package/find-by-id/{id}/documents")
    ResponseEntity<LeosDocumentList> findDocumentsByPackageId(@Parameter(description = "Package ID", required = true) @PathVariable("id") BigDecimal id,
                                                              @Parameter(description = "Fetch content") @RequestParam(value = "fetchContent", required = false, defaultValue = "false") Boolean fetchContent);

    @Operation(summary = "Find package by document reference", description = "Retrieves a package by document reference")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Package found", content = @Content(schema = @Schema(implementation = Package.class))),
            @ApiResponse(responseCode = "404", description = "Package not found", content = @Content)
    })
    @GetMapping(path = "/package/find-by-document-ref/{docRef}")
    ResponseEntity<Package> findPackageByDocumentRef(@Parameter(description = "Document reference", required = true) @PathVariable("docRef") String docRef) throws RepositoryException;

    @Operation(summary = "Find recent packages for user", description = "Retrieves recently changed packages for a user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Recent packages retrieved successfully")
    })
    @GetMapping(path = "/package/find-recent-packages-by-user/{userName}/{numberOfRecentPackages}")
    ResponseEntity<List<PackagesRecentlyChanged>> findRecentPackagesForUser(@Parameter(description = "User name", required = true) @PathVariable("userName") String userName,
                                                                            @Parameter(description = "Number of recent packages", required = true) @PathVariable("numberOfRecentPackages") BigDecimal numberOfRecentPackages) throws RepositoryException;

    @Operation(summary = "Find favourite packages", description = "Retrieves favourite packages for a user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Favourite packages retrieved successfully")
    })
    @GetMapping(path = "/package/find-favourite-packages/{userName}")
    ResponseEntity<List<PackagesFavorites>> findFavouritePackagesForUser(@Parameter(description = "User name", required = true) @PathVariable("userName") String userName) throws RepositoryException;

    @Operation(summary = "Get favourite package", description = "Retrieves a specific favourite package for a user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Favourite package retrieved successfully")
    })
    @GetMapping(path = "/package/{ref}/get-favourite-package/{userName}")
    ResponseEntity<PackagesFavorites> getFavouritePackage(@Parameter(description = "User name", required = true) @PathVariable("userName") String userName,
                                                          @Parameter(description = "Package reference", required = true) @PathVariable("ref") String ref) throws RepositoryException;

    @Operation(summary = "Toggle favourite package", description = "Adds or removes a package from user's favourites")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Favourite status toggled successfully")
    })
    @PutMapping(path = "/package/{ref}/toggle-favourite-package/{userName}")
    ResponseEntity<PackagesFavorites> toggleFavouritePackage(@Parameter(description = "User name", required = true) @PathVariable("userName") String userName,
                                                             @Parameter(description = "Package reference", required = true) @PathVariable("ref") String ref) throws RepositoryException;

    @Operation(summary = "Get package collaborators", description = "Retrieves all collaborators for a package")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Collaborators retrieved successfully")
    })
    @GetMapping(path = "/package/package-collaborators/{packageId}")
    ResponseEntity<Object> getPackageCollaborators(@Parameter(description = "Package ID", required = true) @PathVariable("packageId") BigDecimal packageId) throws RepositoryException;

    @Operation(summary = "Add package collaborators", description = "Adds collaborators to a package")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Collaborators added successfully")
    })
    @PostMapping(path = "/package/package-collaborators/{packageId}/{userName}")
    ResponseEntity<Object> addPackageCollaborators(@Parameter(description = "Package ID", required = true) @PathVariable("packageId") BigDecimal packageId,
                                                   @Parameter(description = "User name", required = true) @PathVariable("userName") String userName,
                                                   @Valid @RequestBody List<Collaborator> collaborators) throws RepositoryException;

    @Operation(summary = "Delete package collaborators", description = "Removes collaborators from a package")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Collaborators deleted successfully")
    })
    @PostMapping(path = "/package/package-collaborators/{packageId}")
    ResponseEntity<Object> deletePackageCollaborators(@Parameter(description = "Package ID", required = true) @PathVariable("packageId") BigDecimal packageId,
                                                      @Valid @RequestBody List<Collaborator> collaborators) throws RepositoryException;
}
