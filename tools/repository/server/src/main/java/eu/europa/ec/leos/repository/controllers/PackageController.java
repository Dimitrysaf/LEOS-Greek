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
public class PackageController implements PackageApi {
    private static final Logger LOG = LoggerFactory.getLogger(PackageController.class);

    @Autowired
    PackageService packageService;

    @Autowired
    CollaboratorsService collaboratorsService;

    @Override
    public ResponseEntity<Package> createPackage(String name, CreatePackageRequest createPackageRequest) throws Exception {
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

    @Override
    public ResponseEntity deletePackage(String packageName) throws Exception {
        packageName = URLDecoder.decode(packageName, StandardCharsets.UTF_8);
        packageService.deletePackage(packageName);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Object> getPackageByName(String name) throws MalformedURLException, RepositoryException {
        name = URLDecoder.decode(name, StandardCharsets.UTF_8);
        Package pkg = packageService.getPackageByName(name);
        pkg =  RestPreconditions.checkFound(pkg, HttpStatus.NOT_FOUND ,"Error while searching for a package");
        return ResponseEntity.ok(pkg);
    }

    @Override
    public ResponseEntity<Object> getLinkedPackagesByPkgId(String pkgId) throws MalformedURLException, RepositoryException {
        pkgId = URLDecoder.decode(pkgId, StandardCharsets.UTF_8);
        List<LinkedPackage> linkedPackages = packageService.getLinkedPackagesByPkgId(pkgId);
        return ResponseEntity.ok(new LinkedPackageList(linkedPackages));
    }

    @Override
    public ResponseEntity<Object> getLinkedPackagesByLinkedPkgId(String linkedPkgId) throws MalformedURLException, RepositoryException {
        linkedPkgId = URLDecoder.decode(linkedPkgId, StandardCharsets.UTF_8);
        List<LinkedPackage> linkedPackages = packageService.getLinkedPackagesByLinkedPkgId(linkedPkgId);
        return ResponseEntity.ok(new LinkedPackageList(linkedPackages));
    }

    @Override
    public ResponseEntity<Object> getPackageByDocumentId(String id) throws RepositoryException {
        Package pkg = packageService.findPackageByDocumentVersionId(id);
        pkg =  RestPreconditions.checkFound(pkg, HttpStatus.NOT_FOUND ,"Error while searching for a package");
        return ResponseEntity.ok(pkg);
    }


    @Override
    public ResponseEntity<Object> getPackageById(String id) throws RepositoryException {
        Package pkg = packageService.getPackageById(id);
        pkg =  RestPreconditions.checkFound(pkg, HttpStatus.NOT_FOUND ,"Error while searching for a package");
        return ResponseEntity.ok(pkg);
    }

    @Override
    public ResponseEntity<LeosDocumentList> findDocumentsByPackageName(String name, Boolean descendants, Boolean fetchContent, FindDocumentsRequest findDocumentsRequest) throws Exception {
        name = URLDecoder.decode(name, StandardCharsets.UTF_8);
        LeosDocumentList xmlDocs = new LeosDocumentList(packageService.findDocumentsByPackageName(name, findDocumentsRequest.getCategories(),
                descendants, fetchContent));
        xmlDocs =  RestPreconditions.checkFound(xmlDocs, HttpStatus.NOT_FOUND ,"No documents found");
        return ResponseEntity.ok(xmlDocs);
    }

    @Override
    public ResponseEntity<LeosDocumentList> findDocumentsByPackageId(BigDecimal id, Boolean descendants, Boolean fetchContent, String versionLabel, FindDocumentsRequest findDocumentsRequest) {
        LeosDocumentList xmlDocs = new LeosDocumentList(packageService.findDocumentsByPackageId(id, findDocumentsRequest.getCategories(),
                descendants, fetchContent, versionLabel));
        xmlDocs =  RestPreconditions.checkFound(xmlDocs, HttpStatus.NOT_FOUND ,"No documents found");
        return ResponseEntity.ok(xmlDocs);
    }

    @Override
    public ResponseEntity<LeosDocumentList> findDocumentsByPackageId(BigDecimal id, Boolean fetchContent) {
        LeosDocumentList xmlDocs = new LeosDocumentList(packageService.findDocumentsByPackageId(id, null,  false, fetchContent, null));
        xmlDocs =  RestPreconditions.checkFound(xmlDocs, HttpStatus.NOT_FOUND ,"No documents found");
        return ResponseEntity.ok(xmlDocs);
    }

    @Override
    public ResponseEntity<Package> findPackageByDocumentRef(String docRef) throws RepositoryException {
        Package pkg = packageService.findPackageByDocumentRef(docRef);
        pkg =  RestPreconditions.checkFound(pkg, HttpStatus.NOT_FOUND ,"No packages found");
        return ResponseEntity.ok(pkg);
    }

    @Override
    public ResponseEntity<LeosDocumentList> findLegDocumentsByDocumentIds(List<String> documentIds) {
        LeosDocumentList docs = new LeosDocumentList(packageService.findLegDocumentsByDocumentIds(documentIds));
        return ResponseEntity.ok(docs);
    }

    @Override
    public ResponseEntity<List<PackagesRecentlyChanged>> findRecentPackagesForUser(String userName, BigDecimal numberOfRecentPackages) throws RepositoryException {
        return new ResponseEntity<>(packageService.findRecentPackagesForUser(userName, numberOfRecentPackages), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<PackagesFavorites>> findFavouritePackagesForUser(String userName) throws RepositoryException {
        return new ResponseEntity<>(packageService.findFavouritePackagesForUser(userName), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<PackagesFavorites> getFavouritePackage(String userName, String ref) throws RepositoryException {
        return new ResponseEntity<>(packageService.getFavouritePackage(userName, ref), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<PackagesFavorites> toggleFavouritePackage(String userName, String ref) throws RepositoryException {
        return new ResponseEntity<>(packageService.toggleFavouritePackage(userName, ref), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Object> getPackageCollaborators(BigDecimal packageId) throws RepositoryException {
        return new ResponseEntity<>(collaboratorsService.getCollaborators(packageId), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Object> addPackageCollaborators(BigDecimal packageId, String userName, List<Collaborator> collaborators) throws RepositoryException {
        collaboratorsService.addCollaborators(packageId, collaborators, userName);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Object> deletePackageCollaborators(BigDecimal packageId, List<Collaborator> collaborators) throws RepositoryException {
        collaboratorsService.deleteCollaborators(packageId, collaborators);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
