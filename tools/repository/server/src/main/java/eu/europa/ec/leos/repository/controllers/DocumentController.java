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

import eu.europa.ec.leos.repository.common.VersionType;
import eu.europa.ec.leos.repository.controllers.requests.CreateDocumentRequest;
import eu.europa.ec.leos.repository.controllers.requests.FindDocumentsRequest;
import eu.europa.ec.leos.repository.controllers.requests.UpdateDocumentRequest;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.model.LeosDocumentList;
import eu.europa.ec.leos.repository.services.DocumentService;
import eu.europa.ec.leos.repository.utils.RestPreconditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
public class DocumentController implements DocumentApi {

    private static final Logger LOG = LoggerFactory.getLogger(DocumentController.class);

    @Autowired
    DocumentService documentService;

    @Override
    public ResponseEntity<Object> createDocumentFromContent(CreateDocumentRequest createDocumentRequest) throws RepositoryException {
        LeosDocument xmlDoc = documentService.createDocumentFromContent(createDocumentRequest.getPackageName(),
                createDocumentRequest.getName(),
                createDocumentRequest.getMetadata(), createDocumentRequest.getLabelVersion(), createDocumentRequest.getVersionType().value(),
                createDocumentRequest.getContent(), createDocumentRequest.getComments(), createDocumentRequest.getUserId());

        return ResponseEntity.ok(RestPreconditions.checkFound(xmlDoc, HttpStatus.INTERNAL_SERVER_ERROR, "Error while creating document"));
    }

    @Override
    public ResponseEntity<Object> createDocumentFromSource(CreateDocumentRequest createDocumentRequest) throws RepositoryException {
        LeosDocument xmlDoc = documentService.createDocumentFromSource(createDocumentRequest.getSourceDocumentId(),
                createDocumentRequest.getPackageName(),
                createDocumentRequest.getName(),
                createDocumentRequest.getMetadata(), createDocumentRequest.getLabelVersion(), createDocumentRequest.getVersionType().value(),
                createDocumentRequest.getComments(), createDocumentRequest.getUserId());

        return ResponseEntity.ok(RestPreconditions.checkFound(xmlDoc, HttpStatus.INTERNAL_SERVER_ERROR, "Error while creating document"));
    }

    @Override
    public ResponseEntity deleteDocumentById(BigDecimal versionId) throws RepositoryException {
        documentService.deleteDocumentByVersionId(versionId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity deleteDocumentByRef(String docRef) throws RepositoryException {
        documentService.deleteDocumentByRef(docRef);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Object> updateDocument(BigDecimal versionId, UpdateDocumentRequest updateDocumentRequest) throws Exception {
        LeosDocument xmlDoc = documentService.updateDocument(versionId, updateDocumentRequest.getMetadata(), updateDocumentRequest.getVersionType(),
                updateDocumentRequest.getCategory(), updateDocumentRequest.getContent(), updateDocumentRequest.getComments(), updateDocumentRequest.getUserId(),
                updateDocumentRequest.getBinaryContent(), updateDocumentRequest.getOriginalFilename(),
                updateDocumentRequest.getForeignRenditionContent(), updateDocumentRequest.getForeignRenditionOriginalFilename());
        return ResponseEntity.ok(RestPreconditions.checkFound(xmlDoc, HttpStatus.NOT_FOUND, "No documents found"));
    }

    @Override
    public ResponseEntity<Object> updateDocumentMetadata(BigDecimal versionId, String docRef, UpdateDocumentRequest updateDocumentRequest, Boolean latest) throws Exception {
        LeosDocument xmlDoc = documentService.updateDocument(docRef, versionId, updateDocumentRequest.getMetadata(), updateDocumentRequest.getUserId(), latest);
        return ResponseEntity.ok(RestPreconditions.checkFound(xmlDoc, HttpStatus.NOT_FOUND, "No documents found"));
    }

    @Override
    public ResponseEntity<Object> archiveDocument(String docRef, String userName) throws Exception {
        LeosDocument xmlDoc = documentService.archiveDocument(docRef, userName);
        return ResponseEntity.ok(RestPreconditions.checkFound(xmlDoc, HttpStatus.NOT_FOUND, "No documents found"));
    }

    @Override
    public ResponseEntity<Object> archiveDocumentVersion(String docRef, String version) throws Exception {
        LeosDocument leosDocument = documentService.archiveDocumentVersion(docRef, version);
        return ResponseEntity.ok(RestPreconditions.checkFound(leosDocument, HttpStatus.NOT_FOUND, "No version found"));
    }

    @Override
    public ResponseEntity findDocumentsByUserName(String role, String category, String userName) {
        List<LeosDocument> xmlDocs = documentService.findDocumentsByUserId(userName, role, category);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @Override
    public ResponseEntity findDocumentsByUserNameOrEntityName(String role, String category, String userName, String entities) {
        List<LeosDocument> xmlDocs = documentService.findDocumentsByUserIdOrEntity(userName, entities, role, category);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @Override
    public ResponseEntity<Object> findDocumentById(BigDecimal versionId, String category, Boolean latest) throws RepositoryException {
        LeosDocument xmlDoc = RestPreconditions.checkFound(documentService.findDocumentById(versionId, category, latest),
                HttpStatus.NOT_FOUND, "No documents found");
        return ResponseEntity.ok(xmlDoc);
    }

    @Override
    public ResponseEntity<Object> searchVersions(String docRef, String versionType, List<String> logins) {
        List<LeosDocument> xmlDocs = documentService.searchVersionsByRef(docRef, logins, versionType);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @Override
    public ResponseEntity<Object> findAllVersionsByDocumentRef(String docRef) {
        List<LeosDocument> xmlDocs = documentService.findAllVersionsByRef(docRef);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @Override
    public ResponseEntity<LeosDocument> findDocumentsByRef(String ref, String category, boolean withContent) {
        LeosDocument xmlDoc = documentService.findDocumentByRef(ref, category, withContent).orElse(null);
        return ResponseEntity.ok(xmlDoc);
    }

    @Override
    public ResponseEntity<String> getNextVersionLabel(String versionType, String oldVersion) {
        String nextVersion = RestPreconditions.checkFound(documentService.getNextVersionLabel(VersionType.valueOf(versionType), oldVersion),
                HttpStatus.UNPROCESSABLE_ENTITY, "Error while counting");
        return ResponseEntity.ok(nextVersion);
    }

    @Override
    public ResponseEntity<Object> findAllMinorsForIntermediate(String docRef, String currIntVersion, Integer startIndex, Integer maxResults) {
        List<LeosDocument> xmlDocs = documentService.findAllMinorsForIntermediate(docRef, currIntVersion, startIndex, maxResults);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @Override
    public ResponseEntity<Object> findAllMajors(String docRef, Integer startIndex, Integer maxResult) {
        List<LeosDocument> xmlDocs = documentService.findAllMajors(docRef, startIndex, maxResult);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @Override
    public ResponseEntity<Long> getAllMinorsCountForIntermediate(String docRef, String currIntVersion) {
        long result = documentService.getAllMinorsCountForIntermediate(docRef, currIntVersion);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<Integer> getAllMajorsCount(String docRef) {
        long result = documentService.getAllMajorsCount(docRef);
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Object> findRecentMinorVersions(String docRef, String lastMajorVersion, Integer startIndex, Integer maxResults) {
        List<LeosDocument> xmlDocs = documentService.findRecentMinorVersions(docRef, lastMajorVersion, startIndex, maxResults);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @Override
    public ResponseEntity<Long> getRecentMinorVersionsCount(String docRef, String versionLabel) {
        long result = documentService.getRecentMinorVersionsCount(docRef, versionLabel);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<LeosDocument> findLatestMajorVersionByRef(String docRef) {
        LeosDocument xmlDoc = RestPreconditions.checkFound(documentService.findLatestMajorVersionByRef(docRef),
                HttpStatus.NOT_FOUND, "No documents found");
        return ResponseEntity.ok(xmlDoc);

    }

    @Override
    public ResponseEntity<Object> findFirstVersion(String docRef) {
        LeosDocument xmlDoc = RestPreconditions.checkFound(documentService.findFirstVersion(docRef),
                HttpStatus.NOT_FOUND, "No documents found");
        return ResponseEntity.ok(xmlDoc);
    }

    @Override
    public ResponseEntity<Object> findDocumentByVersion(String docRef, String versionLabel) {
        LeosDocument xmlDoc = RestPreconditions.checkFound(documentService.findDocumentByVersion(docRef, versionLabel),
                HttpStatus.NOT_FOUND, "No documents found");
        return ResponseEntity.ok(xmlDoc);
    }

    @Override
    public ResponseEntity<LeosDocument> findDocumentByName(String name) throws RepositoryException {
        LeosDocument xmlDoc = RestPreconditions.checkFound(documentService.findDocumentByName(name).orElse(null),
                HttpStatus.NOT_FOUND, "No documents found");
        return ResponseEntity.ok(xmlDoc);
    }

    @Override
    public ResponseEntity<Object> findDocumentByStatus(String status) {
        List<LeosDocument> xmlDocs = documentService.findDocumentsByStatus(status);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @Override
    public ResponseEntity<Object> findDocumentsUsingFilter(String packageName, FindDocumentsRequest findDocumentsRequest, Integer startIndex, Integer maxResults, Boolean fetchContent) throws MalformedURLException {
        packageName = URLDecoder.decode(packageName, StandardCharsets.UTF_8);
        List<LeosDocument> xmlDocs = documentService.findDocumentsUsingFilter(packageName, findDocumentsRequest.getCategories(),
                findDocumentsRequest.getQueryFilter(), startIndex, maxResults, fetchContent);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @Override
    public ResponseEntity<Object> countDocumentsUsingFilter(String packageName, FindDocumentsRequest findDocumentsRequest) throws MalformedURLException {
        packageName = URLDecoder.decode(packageName, StandardCharsets.UTF_8);
        Long count = documentService.countDocumentsUsingFilter(packageName, findDocumentsRequest.getCategories(), findDocumentsRequest.getQueryFilter());
        return ResponseEntity.ok(RestPreconditions.checkFound(count, HttpStatus.UNPROCESSABLE_ENTITY, "Error while counting"));
    }

    @Override
    public ResponseEntity<Object> findDocumentRefByPackageIdAndCategory(String packageId, String categoryCode) {
        String documentRef = documentService.findDocumentRefByPackageIdAndCategory(packageId, categoryCode);
        return ResponseEntity.ok(documentRef);
    }

    @Override
    public ResponseEntity<Object> findDocumentsPackagesForValidation() {
        List<String> packageNames = documentService.findPackagesForValidation();
        return ResponseEntity.ok(packageNames);
    }

    @Override
    public ResponseEntity<Object> setDocumentsValidationStatus(List<String> versionIDs) throws RepositoryException {
        return ResponseEntity.ok(documentService.setDocumentValidationStatus(versionIDs));
    }


    @Override
    public ResponseEntity<Object> searchClonesOfOriginalDocument(String proposalRef) throws RepositoryException {
        List<LeosDocument> clonedProposals =  documentService.searchClonesOfOriginalDocument(proposalRef);
        return ResponseEntity.ok(new LeosDocumentList(clonedProposals));
    }

}
