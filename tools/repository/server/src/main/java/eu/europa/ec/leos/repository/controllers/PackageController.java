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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import eu.europa.ec.leos.repository.controllers.requests.CreatePackageRequest;
import eu.europa.ec.leos.repository.controllers.requests.FindDocumentsRequest;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.interfaces.PackagesFavorites;
import eu.europa.ec.leos.repository.interfaces.PackagesRecentlyChanged;
import eu.europa.ec.leos.repository.model.*;
import eu.europa.ec.leos.repository.model.Package;
import eu.europa.ec.leos.repository.services.CollaboratorsService;
import eu.europa.ec.leos.repository.services.PackageService;
import eu.europa.ec.leos.repository.utils.RestPreconditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;


@RestController
@Validated
public class PackageController {
    private static final Logger LOG = LoggerFactory.getLogger(PackageController.class);

    @Autowired
    PackageService packageService;

    @Autowired
    CollaboratorsService collaboratorsService;

    @PostMapping(path = "/package/create/{name}",
    consumes = {MediaType.APPLICATION_JSON_VALUE},
    produces = {MediaType.APPLICATION_JSON_VALUE} )
    public ResponseEntity<Package> createPackage(@PathVariable("name") String name,
                                                 @Valid @RequestBody CreatePackageRequest createPackageRequest) throws Exception
    {
        name = URLDecoder.decode(name, StandardCharsets.UTF_8);
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
    public ResponseEntity deletePackage(@PathVariable("name") String packageName) throws Exception {
        packageName = URLDecoder.decode(packageName, StandardCharsets.UTF_8);
        packageService.deletePackage(packageName);
        return ResponseEntity.ok().build();
    }

    @GetMapping(path = "/package/find-by-name/{name}")
    public ResponseEntity<Object> getPackageByName(@PathVariable("name") String name) throws MalformedURLException, RepositoryException{
        name = URLDecoder.decode(name, StandardCharsets.UTF_8);
        Package pkg = packageService.getPackageByName(name);
        pkg =  RestPreconditions.checkFound(pkg, HttpStatus.NOT_FOUND ,"Error while searching for a package");
        return ResponseEntity.ok(pkg);
    }

    @GetMapping(path = "/package/find-by-pkg-id/{pkgId}")
    public ResponseEntity<Object> getLinkedPackagesByPkgId(@PathVariable("pkgId") String pkgId) throws MalformedURLException, RepositoryException{
        pkgId = URLDecoder.decode(pkgId, StandardCharsets.UTF_8);
        List<LinkedPackage> linkedPackages = packageService.getLinkedPackagesByPkgId(pkgId);
        return ResponseEntity.ok(new LinkedPackageList(linkedPackages));
    }

    @GetMapping(path = "/package/find-by-linked-pkg-id/{linkedPkgId}")
    public ResponseEntity<Object> getLinkedPackagesByLinkedPkgId(@PathVariable("linkedPkgId") String linkedPkgId) throws MalformedURLException, RepositoryException{
        linkedPkgId = URLDecoder.decode(linkedPkgId, StandardCharsets.UTF_8);
        List<LinkedPackage> linkedPackages = packageService.getLinkedPackagesByLinkedPkgId(linkedPkgId);
        return ResponseEntity.ok(new LinkedPackageList(linkedPackages));
    }

    @GetMapping(path = "/package/find-by-document-id/{id}")
    public ResponseEntity<Object> getPackageByDocumentId(@PathVariable("id") String id) throws RepositoryException{
        Package pkg = packageService.findPackageByDocumentVersionId(id);
        pkg =  RestPreconditions.checkFound(pkg, HttpStatus.NOT_FOUND ,"Error while searching for a package");
        return ResponseEntity.ok(pkg);
    }


    @GetMapping(path = "/package/find-by-id/{id}")
    public ResponseEntity<Object> getPackageById(@PathVariable("id") String id) throws RepositoryException{
        Package pkg = packageService.getPackageById(id);
        pkg =  RestPreconditions.checkFound(pkg, HttpStatus.NOT_FOUND ,"Error while searching for a package");
        return ResponseEntity.ok(pkg);
    }

    @PostMapping(path = "/package/find-by-name/documents",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    public ResponseEntity<LeosDocumentList> findDocumentsByPackageName(@RequestParam(value="name", required=false, defaultValue="%25") String name,
                                                                   @RequestParam(value = "descendants", required = false, defaultValue = "false") Boolean descendants,
                                                                       @RequestParam(value = "fetchContent", required = false, defaultValue = "false") Boolean fetchContent,
                                                                  @Valid @RequestBody FindDocumentsRequest findDocumentsRequest) throws Exception {
        name = URLDecoder.decode(name, StandardCharsets.UTF_8);
        LeosDocumentList xmlDocs = new LeosDocumentList(packageService.findDocumentsByPackageName(name, findDocumentsRequest.getCategories(),
                descendants, fetchContent));
        xmlDocs =  RestPreconditions.checkFound(xmlDocs, HttpStatus.NOT_FOUND ,"No documents found");
        return ResponseEntity.ok(xmlDocs);
    }

    @PostMapping(path = "/package/find-by-id/{id}/documents",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
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
    public ResponseEntity<LeosDocumentList> findDocumentsByPackageId(@PathVariable("id") BigDecimal id, @RequestParam(value = "fetchContent", required = false,
            defaultValue = "false") Boolean fetchContent) {
        LeosDocumentList xmlDocs = new LeosDocumentList(packageService.findDocumentsByPackageId(id, null,  false, fetchContent));
        xmlDocs =  RestPreconditions.checkFound(xmlDocs, HttpStatus.NOT_FOUND ,"No documents found");
        return ResponseEntity.ok(xmlDocs);
    }

    @GetMapping(path = "/package/find-by-document-ref/{docRef}")
    public ResponseEntity<Package> findPackageByDocumentRef(@PathVariable("docRef") String docRef) throws RepositoryException{
        Package pkg = packageService.findPackageByDocumentRef(docRef);
        pkg =  RestPreconditions.checkFound(pkg, HttpStatus.NOT_FOUND ,"No packages found");
        return ResponseEntity.ok(pkg);
    }

    @GetMapping(path = "/package/find-recent-packages-by-user/{userName}/{numberOfRecentPackages}")
    public ResponseEntity<List<PackagesRecentlyChanged>> findRecentPackagesForUser(@PathVariable("userName") String userName, @PathVariable("numberOfRecentPackages") BigDecimal numberOfRecentPackages) throws RepositoryException{
        return new ResponseEntity<>(packageService.findRecentPackagesForUser(userName, numberOfRecentPackages), HttpStatus.OK);
    }

    @GetMapping(path = "/package/find-favourite-packages/{userName}")
    public ResponseEntity<List<PackagesFavorites>> findFavouritePackagesForUser(@PathVariable("userName") String userName) throws RepositoryException{
        return new ResponseEntity<>(packageService.findFavouritePackagesForUser(userName), HttpStatus.OK);
    }

    @GetMapping(path = "/package/{ref}/get-favourite-package/{userName}")
    public ResponseEntity<PackagesFavorites> getFavouritePackage(@PathVariable("userName") String userName, @PathVariable("ref") String ref) throws RepositoryException{
        return new ResponseEntity<>(packageService.getFavouritePackage(userName, ref), HttpStatus.OK);
    }

    @PutMapping(path = "/package/{ref}/toggle-favourite-package/{userName}")
    public ResponseEntity<PackagesFavorites> toggleFavouritePackage(@PathVariable("userName") String userName, @PathVariable("ref") String ref) throws RepositoryException{
        return new ResponseEntity<>(packageService.toggleFavouritePackage(userName, ref), HttpStatus.OK);
    }

    @GetMapping(path = "/package/package-collaborators/{packageId}")
    public ResponseEntity<Object> getPackageCollaborators(@PathVariable("packageId") BigDecimal packageId) throws RepositoryException{
        return new ResponseEntity<>(collaboratorsService.getCollaborators(packageId), HttpStatus.OK);
    }

    @PostMapping(path = "/package/package-collaborators/{packageId}/{userName}")
    public ResponseEntity<Object> addPackageCollaborators(@PathVariable("packageId") BigDecimal packageId,
                                                          @PathVariable("userName") String userName,
                                                          @Valid @RequestBody List<Collaborator> collaborators) throws RepositoryException{
        collaboratorsService.addCollaborators(packageId, collaborators, userName);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "/package/package-collaborators/{packageId}")
    public ResponseEntity<Object> deletePackageCollaborators(@PathVariable("packageId") BigDecimal packageId,
                                                             @Valid @RequestBody List<Collaborator> collaborators) throws RepositoryException{
        collaboratorsService.deleteCollaborators(packageId, collaborators);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
