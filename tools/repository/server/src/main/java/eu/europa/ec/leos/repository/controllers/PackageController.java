/*
 * Copyright 2023 European Commission
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
package eu.europa.ec.leos.repository.controllers;

import eu.europa.ec.leos.repository.controllers.requests.CreatePackageRequest;
import eu.europa.ec.leos.repository.controllers.response.ExceptionResponse;
import eu.europa.ec.leos.repository.controllers.requests.FindDocumentsRequest;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.services.PackageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import eu.europa.ec.leos.repository.model.Package;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import javax.validation.Valid;
import java.util.List;

import static com.sun.jndi.toolkit.url.UrlUtil.decode;

@RestController
@Tag(name = "Package API", description = "Package API")
@Validated
public class PackageController {
    private static final Logger LOG = LoggerFactory.getLogger(PackageController.class);

    @Autowired
    PackageService packageService;

    @Value("${repository.default.id}")
    private String repositoryId;

    @PutMapping(path = "/package/create/{name}",
    consumes = {MediaType.APPLICATION_JSON_VALUE},
    produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "create a Package by name")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Package Created", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Object> createPackage(@PathVariable("name") String name,
                                                 @Valid @RequestBody CreatePackageRequest createPackageRequest) {
        try {
            name = decode(name);
            Package p = packageService.createPackage(name, repositoryId, createPackageRequest.getIsCloned(),
                    createPackageRequest.getClonedPackageName(), createPackageRequest.getUserId());
            if (p != null) {
                return new ResponseEntity<>(p, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("Error while creating package", ExceptionResponse.ExceptionType.ERROR), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while creating a package with name {0} : {1}", name, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(path = "/package/delete/{name}")
    @Operation(summary = "Delete a Package by name")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Package Deleted", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity deletePackage(@PathVariable("name") String packageName) {
        try {
            packageName = decode(packageName);
            packageService.deletePackage(repositoryId, packageName);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error while deleting a package with name {0} : {1}", packageName, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/package/find-by-name/{name}")
    @Operation(summary = "Get a Package by name")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Package Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Object> getPackageByName(@PathVariable("name") String name) {
        try {
            name = decode(name);
            Package pkg = packageService.getPackageByName(repositoryId, name);
            return new ResponseEntity<>(pkg, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error while searching for a package with name {0} : {1}", name, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/package/find-by-id/{id}")
    @Operation(summary = "Get a Package by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Package Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Object> getPackageById(@PathVariable("id") String id) {
        try {
            Package pkg = packageService.getPackageById(id);
            return new ResponseEntity<>(pkg, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error while searching for a package with id {0} : {1}", id, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(path = "/package/find-by-name/{name}/documents",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Find documents by package name")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Object> findDocumentsByPackageName(@PathVariable("name") String name,
                                                                   @RequestParam(value = "descendants", required = false, defaultValue = "false") Boolean descendants,
                                                                  @Valid @RequestBody FindDocumentsRequest findDocumentsRequest) {
        try {
            name = decode(name);
            List<LeosDocument> xmlDocs = packageService.findDocumentsByPackageName(repositoryId, name, findDocumentsRequest.getCategories(),
                    descendants);
            if (!xmlDocs.isEmpty()) {
                return new ResponseEntity(xmlDocs, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("No documents found", ExceptionResponse.ExceptionType.WARNING), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while searching for documents in a package with name {0} : {1}", name, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(path = "/package/find-by-id/{id}/documents",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Find documents by package id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Object> findDocumentsByPackageId(@PathVariable("id") String id,
                                                           @RequestParam(value = "descendants", required = false, defaultValue = "false") Boolean descendants,
                                                                @Valid @RequestBody FindDocumentsRequest findDocumentsRequest) {
        try {
            List<LeosDocument> xmlDocs = packageService.findDocumentsByPackageId(id, findDocumentsRequest.getCategories(),
                    descendants);
            if (!xmlDocs.isEmpty()) {
                return new ResponseEntity(xmlDocs, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("No documents found", ExceptionResponse.ExceptionType.WARNING), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while searching for documents in a package with id {0} : {1}", id, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/package/find-by-id/{id}/documents")
    @Operation(summary = "Find documents by package id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Object> findDocumentsByPackageId(@PathVariable("id") String id) {
        try {
            List<LeosDocument> xmlDocs = packageService.findDocumentsByPackageId(id, null,  false);
            if (!xmlDocs.isEmpty()) {
                return new ResponseEntity(xmlDocs, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while searching for documents in a package with id {0} : {1}", id, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
