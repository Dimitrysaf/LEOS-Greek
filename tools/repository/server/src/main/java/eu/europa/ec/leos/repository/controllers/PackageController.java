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
package eu.europa.ec.leos.repository.controllers;

import static com.sun.jndi.toolkit.url.UrlUtil.decode;

import java.math.BigDecimal;
import java.net.MalformedURLException;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import eu.europa.ec.leos.repository.controllers.requests.CreatePackageRequest;
import eu.europa.ec.leos.repository.controllers.requests.FindDocumentsRequest;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocumentList;
import eu.europa.ec.leos.repository.model.Package;
import eu.europa.ec.leos.repository.services.PackageService;
import eu.europa.ec.leos.repository.utils.RestPreconditions;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import eu.europa.ec.leos.repository.interfaces.PackagesRecentlyChanged;
import eu.europa.ec.leos.repository.interfaces.PackagesFavorites;


@RestController
@Tag(name = "Package API", description = "Package API")
@Validated
public class PackageController {
    private static final Logger LOG = LoggerFactory.getLogger(PackageController.class);

    @Autowired
    PackageService packageService;

    @PostMapping(path = "/package/create/{name}",
    consumes = {MediaType.APPLICATION_JSON_VALUE},
    produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "create a Package by name")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Package Created", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Package> createPackage(@PathVariable("name") String name,
                                                 @Valid @RequestBody CreatePackageRequest createPackageRequest) throws Exception
    {
        name = decode(name);
        String originRef = createPackageRequest.getOriginRef();
        Package originPkg;
        try {
            originPkg = packageService.findPackageByDocumentRef(originRef);
        } catch(RepositoryException ex) {
            originPkg = null;
        }
        boolean translated = originPkg != null ? createPackageRequest.getTranslated() : false;
        Package p = packageService.createPackage(name, createPackageRequest.getIsCloned(),
                createPackageRequest.getClonedPackageName(), createPackageRequest.getLanguage(), translated, createPackageRequest.getUserId());
        p =  RestPreconditions.checkFound(p, HttpStatus.NOT_FOUND ,"Error while creating package");
        if(p != null && originPkg != null) {
            packageService.createLinkedPackage(new BigDecimal(originPkg.getId()), new BigDecimal(p.getId()));
        }
        return ResponseEntity.ok(p);
    }

    @DeleteMapping(path = "/package/delete/{name}")
    @Operation(summary = "Delete a Package by name")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Package Deleted", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity deletePackage(@PathVariable("name") String packageName) throws Exception {
        packageName = decode(packageName);
        packageService.deletePackage(packageName);
        return ResponseEntity.ok().build();
    }

    @GetMapping(path = "/package/find-by-name/{name}")
    @Operation(summary = "Get a Package by name")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Package Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Object> getPackageByName(@PathVariable("name") String name) throws MalformedURLException, RepositoryException{
        name = decode(name);
        Package pkg = packageService.getPackageByName(name);
        pkg =  RestPreconditions.checkFound(pkg, HttpStatus.NOT_FOUND ,"Error while searching for a package");
        return ResponseEntity.ok(pkg);
    }

    @GetMapping(path = "/package/find-by-document-id/{id}")
    @Operation(summary = "Get a Package by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Package Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Object> getPackageByDocumentId(@PathVariable("id") String id) throws RepositoryException{
        Package pkg = packageService.findPackageByDocumentVersionId(id);
        pkg =  RestPreconditions.checkFound(pkg, HttpStatus.NOT_FOUND ,"Error while searching for a package");
        return ResponseEntity.ok(pkg);
    }


    @GetMapping(path = "/package/find-by-id/{id}")
    @Operation(summary = "Get a Package by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Package Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Object> getPackageById(@PathVariable("id") String id) throws RepositoryException{
        Package pkg = packageService.getPackageById(id);
        pkg =  RestPreconditions.checkFound(pkg, HttpStatus.NOT_FOUND ,"Error while searching for a package");
        return ResponseEntity.ok(pkg);
    }

    @PostMapping(path = "/package/find-by-name/{name}/documents",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Find documents by package name")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<LeosDocumentList> findDocumentsByPackageName(@PathVariable("name") String name,
                                                                   @RequestParam(value = "descendants", required = false, defaultValue = "false") Boolean descendants,
                                                                       @RequestParam(value = "fetchContent", required = false, defaultValue = "false") Boolean fetchContent,
                                                                  @Valid @RequestBody FindDocumentsRequest findDocumentsRequest) throws Exception {
        name = decode(name);
        LeosDocumentList xmlDocs = new LeosDocumentList(packageService.findDocumentsByPackageName(name, findDocumentsRequest.getCategories(),
                descendants, fetchContent));
        xmlDocs =  RestPreconditions.checkFound(xmlDocs, HttpStatus.NOT_FOUND ,"No documents found");
        return ResponseEntity.ok(xmlDocs);
    }

    @PostMapping(path = "/package/find-by-id/{id}/documents",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Find documents by package id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<LeosDocumentList> findDocumentsByPackageId(@PathVariable("id") BigDecimal id,
                                                           @RequestParam(value = "descendants", required = false, defaultValue = "false") Boolean descendants,
                                                                     @RequestParam(value = "fetchContent", required = false, defaultValue = "false") Boolean fetchContent,
                                                                @Valid @RequestBody FindDocumentsRequest findDocumentsRequest) {
        LeosDocumentList xmlDocs = new LeosDocumentList(packageService.findDocumentsByPackageId(id, findDocumentsRequest.getCategories(),
                descendants, fetchContent));
        xmlDocs =  RestPreconditions.checkFound(xmlDocs, HttpStatus.NOT_FOUND ,"No documents found");
        return ResponseEntity.ok(xmlDocs);
    }

    @GetMapping(path = "/package/find-by-id/{id}/documents")
    @Operation(summary = "Find documents by package id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<LeosDocumentList> findDocumentsByPackageId(@PathVariable("id") BigDecimal id, @RequestParam(value = "fetchContent", required = false,
            defaultValue = "false") Boolean fetchContent) {
        LeosDocumentList xmlDocs = new LeosDocumentList(packageService.findDocumentsByPackageId(id, null,  false, fetchContent));
        xmlDocs =  RestPreconditions.checkFound(xmlDocs, HttpStatus.NOT_FOUND ,"No documents found");
        return ResponseEntity.ok(xmlDocs);
    }

    @GetMapping(path = "/package/find-by-document-ref/{docRef}")
    @Operation(summary = "Get a Package by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Package Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Package> findPackageByDocumentRef(@PathVariable("docRef") String docRef) throws RepositoryException{
        Package pkg = packageService.findPackageByDocumentRef(docRef);
        pkg =  RestPreconditions.checkFound(pkg, HttpStatus.NOT_FOUND ,"No packages found");
        return ResponseEntity.ok(pkg);
    }

    @RequestMapping(value = {"/test"}, produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<?> test() {
        ObjectNode response = new ObjectMapper().createObjectNode();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            UserDetails userDetails = (UserDetails)authentication.getPrincipal();
            response.put("username", userDetails.getUsername());
            response.put("description", "Test RESTful service. User authenticated.");
        } else {
            response.put("description", "Test RESTful service. No user authenticated.");
        }
        response.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping(path = "/package/find-recent-packages-by-user/{userName}/{numberOfRecentPackages}")
    @Operation(summary = "Find recent number of packages for username")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Package Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<List<PackagesRecentlyChanged>> findRecentPackagesForUser(@PathVariable("userName") String userName, @PathVariable("numberOfRecentPackages") BigDecimal numberOfRecentPackages) throws RepositoryException{
        return new ResponseEntity<>(packageService.findRecentPackagesForUser(userName, numberOfRecentPackages), HttpStatus.OK);
    }

    @GetMapping(path = "/package/find-favourite-packages/{userName}")
    @Operation(summary = "Find favorite packages for username")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Package Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<List<PackagesFavorites>> findFavouritePackagesForUser(@PathVariable("userName") String userName) throws RepositoryException{
        return new ResponseEntity<>(packageService.findFavouritePackagesForUser(userName), HttpStatus.OK);
    }

    @GetMapping(path = "/package/{ref}/get-favourite-package/{userName}")
    @Operation(summary = "Get favourite package")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Package Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<PackagesFavorites> getFavouritePackage(@PathVariable("userName") String userName, @PathVariable("ref") String ref) throws RepositoryException{
        return new ResponseEntity<>(packageService.getFavouritePackage(userName, ref), HttpStatus.OK);
    }

    @PutMapping(path = "/package/{ref}/toggle-favourite-package/{userName}")
    @Operation(summary = "Toggle favourite package")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Package Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<PackagesFavorites> toggleFavouritePackage(@PathVariable("userName") String userName, @PathVariable("ref") String ref) throws RepositoryException{
        return new ResponseEntity<>(packageService.toggleFavouritePackage(userName, ref), HttpStatus.OK);
    }

}
