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
import eu.europa.ec.leos.repository.controllers.requests.OnCreateFromContent;
import eu.europa.ec.leos.repository.controllers.requests.OnCreateFromSource;
import eu.europa.ec.leos.repository.controllers.requests.OnUpdateWithContent;
import eu.europa.ec.leos.repository.controllers.requests.OnUpdateWithoutContent;
import eu.europa.ec.leos.repository.controllers.requests.UpdateDocumentRequest;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.model.LeosDocumentList;
import eu.europa.ec.leos.repository.services.DocumentService;
import eu.europa.ec.leos.repository.utils.RestPreconditions;
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
public class DocumentController {
    private static final Logger LOG = LoggerFactory.getLogger(DocumentController.class);

    @Autowired
    DocumentService documentService;

    @PutMapping(path = "/document/create-with-content",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> createDocumentFromContent(@Validated(OnCreateFromContent.class)
                                                            @Valid @RequestBody CreateDocumentRequest createDocumentRequest)
            throws RepositoryException {
        LeosDocument xmlDoc = documentService.createDocumentFromContent(createDocumentRequest.getPackageName(),
                createDocumentRequest.getName(),
                createDocumentRequest.getMetadata(), createDocumentRequest.getLabelVersion(), createDocumentRequest.getVersionType().value(),
                createDocumentRequest.getContent(), createDocumentRequest.getComments(), createDocumentRequest.getUserId());

        return ResponseEntity.ok(RestPreconditions.checkFound(xmlDoc, HttpStatus.INTERNAL_SERVER_ERROR, "Error while creating document"));
    }

    @PutMapping(path = "/document/create-with-source",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> createDocumentFromSource(@Validated(OnCreateFromSource.class) @Valid @RequestBody CreateDocumentRequest createDocumentRequest)
            throws RepositoryException {
        LeosDocument xmlDoc = documentService.createDocumentFromSource(createDocumentRequest.getSourceDocumentId(),
                createDocumentRequest.getPackageName(),
                createDocumentRequest.getName(),
                createDocumentRequest.getMetadata(), createDocumentRequest.getLabelVersion(), createDocumentRequest.getVersionType().value(),
                createDocumentRequest.getComments(), createDocumentRequest.getUserId());

        return ResponseEntity.ok(RestPreconditions.checkFound(xmlDoc, HttpStatus.INTERNAL_SERVER_ERROR, "Error while creating document"));
    }

    @DeleteMapping(path = "/document/delete-by-id/{versionId}")
    public ResponseEntity deleteDocumentById(@PathVariable("versionId") BigDecimal versionId) throws RepositoryException {
        documentService.deleteDocumentByVersionId(versionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping(path = "/document/delete-by-ref/{docRef}")
    public ResponseEntity deleteDocumentByRef(@PathVariable("docRef") String docRef) throws RepositoryException {
        documentService.deleteDocumentByRef(docRef);
        return ResponseEntity.ok().build();
    }

    @PutMapping(path = "/document/update-content/{versionId}",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> updateDocument(@PathVariable("versionId") BigDecimal versionId,
                                                 @Validated(OnUpdateWithContent.class) @Valid @RequestBody UpdateDocumentRequest updateDocumentRequest)
            throws Exception {
        LeosDocument xmlDoc = documentService.updateDocument(versionId, updateDocumentRequest.getMetadata(), updateDocumentRequest.getVersionType(),
                updateDocumentRequest.getCategory(), updateDocumentRequest.getContent(), updateDocumentRequest.getComments(), updateDocumentRequest.getUserId());
        return ResponseEntity.ok(RestPreconditions.checkFound(xmlDoc, HttpStatus.NOT_FOUND, "No documents found"));
    }

    @PutMapping(path = "/document/update-metadata/{docRef}/{versionId}",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> updateDocumentMetadata(@PathVariable("versionId") BigDecimal versionId, @PathVariable("docRef") String docRef,
                                                         @Validated(OnUpdateWithoutContent.class) @Valid @RequestBody UpdateDocumentRequest updateDocumentRequest,
                                                            @RequestParam("latest") Boolean latest)
            throws Exception {
        LeosDocument xmlDoc = documentService.updateDocument(docRef, versionId, updateDocumentRequest.getMetadata(), updateDocumentRequest.getUserId(), latest);
        return ResponseEntity.ok(RestPreconditions.checkFound(xmlDoc, HttpStatus.NOT_FOUND, "No documents found"));
    }

    @GetMapping(path = "/document/archive/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    public ResponseEntity<Object> archiveDocument(@PathVariable("docRef") String docRef,
                                               @RequestParam("userId") String userName) throws Exception {
        LeosDocument xmlDoc = documentService.archiveDocument(docRef, userName);
        return ResponseEntity.ok(RestPreconditions.checkFound(xmlDoc, HttpStatus.NOT_FOUND, "No documents found"));
    }

    @PutMapping(path = "/document/archive-version/{docRef}/{version}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    public ResponseEntity<Object> archiveDocumentVersion(@PathVariable("docRef") String docRef,
                                                         @PathVariable("version") String version) throws Exception {
        LeosDocument leosDocument = documentService.archiveDocumentVersion(docRef, version);
        return ResponseEntity.ok(RestPreconditions.checkFound(leosDocument, HttpStatus.NOT_FOUND, "No version found"));
    }

    @GetMapping(path = "/documents/find-by-collaborator/{userName}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity findDocumentsByUserName(@RequestParam("role") String role, @RequestParam(value = "category", defaultValue = "") String category,
                                                  @PathVariable("userName") String userName) {
        List<LeosDocument> xmlDocs = documentService.findDocumentsByUserId(userName, role, category);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @GetMapping(path = "/documents/find-by-collaborator/{userName}/{entities}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity findDocumentsByUserNameOrEntityName(@RequestParam("role") String role, @RequestParam(value = "category", defaultValue = "") String category,
                                                              @PathVariable("userName") String userName, @PathVariable("entities") String entities) {
        List<LeosDocument> xmlDocs = documentService.findDocumentsByUserIdOrEntity(userName, entities, role, category);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @GetMapping(path = "/document/find-version/{versionId}",
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> findDocumentById(@PathVariable("versionId") BigDecimal versionId,
                                                    @RequestParam("category") String category,
                                                   @RequestParam("latest") Boolean latest)
            throws RepositoryException {
        LeosDocument xmlDoc = RestPreconditions.checkFound(documentService.findDocumentById(versionId, category, latest),
                HttpStatus.NOT_FOUND, "No documents found");
        return ResponseEntity.ok(xmlDoc);
    }

    @PostMapping(path = "/document/search-versions/{ref}",
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> searchVersions(@PathVariable("ref") String docRef,
                                                   @RequestParam("versionType") String versionType,
                                                   @RequestBody List<String> logins) {
        LOG.info("-- #1975 -- Parameters: docRef {}, logins {}, versionType {}",docRef, logins, versionType);
        List<LeosDocument> xmlDocs = documentService.searchVersionsByRef(docRef, logins, versionType);
        LOG.info("-- #1975 -- Result : xmlDocs size {}", (xmlDocs != null && !xmlDocs.isEmpty()) ? xmlDocs.size() : "is null or empty");
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @GetMapping(path = "/document/all-versions/{docRef}")
    public ResponseEntity<Object> findAllVersionsByDocumentRef(@PathVariable("docRef") String docRef) {
        List<LeosDocument> xmlDocs = documentService.findAllVersionsByRef(docRef);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @GetMapping(path = "/documents/last-version/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<LeosDocument> findDocumentsByRef(@PathVariable("docRef") String ref,
                                                            @RequestParam("category") String category,
                                                            @RequestParam(value = "withContent", defaultValue = "true") boolean withContent) {
        LeosDocument xmlDoc = documentService.findDocumentByRef(ref, category, withContent).orElse(null);
        return ResponseEntity.ok(xmlDoc);
    }

    @GetMapping(path = "/document/next-version-label", produces =  MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> getNextVersionLabel(@RequestParam("versionType") String versionType, @RequestParam(name = "oldVersion", defaultValue = "") String oldVersion) {
        String nextVersion = RestPreconditions.checkFound(documentService.getNextVersionLabel(VersionType.valueOf(versionType), oldVersion),
                HttpStatus.UNPROCESSABLE_ENTITY, "Error while counting");
        return ResponseEntity.ok(nextVersion);
    }

    @GetMapping(path = "/documents/all-minors-for-intermediate/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> findAllMinorsForIntermediate(@PathVariable("docRef") String docRef, @RequestParam("currIntVersion") String currIntVersion,
                                                               @RequestParam("startIndex") Integer startIndex, @RequestParam("maxResults") Integer maxResults) {
        List<LeosDocument> xmlDocs = documentService.findAllMinorsForIntermediate(docRef, currIntVersion, startIndex, maxResults);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @GetMapping(path = "/documents/all-majors/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> findAllMajors(@PathVariable("docRef") String docRef,
                                                @RequestParam("startIndex") Integer startIndex, @RequestParam("maxResults") Integer maxResult) {
        List<LeosDocument> xmlDocs = documentService.findAllMajors(docRef, startIndex, maxResult);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @GetMapping(path = "/documents/count-all-minors-for-intermediate/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Long> getAllMinorsCountForIntermediate(@PathVariable("docRef") String docRef,
                                                                 @RequestParam("currIntVersion") String currIntVersion) {
        long result = documentService.getAllMinorsCountForIntermediate(docRef, currIntVersion);
        return ResponseEntity.ok(result);
    }

    @GetMapping(path = "/documents/count-all-majors/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Integer> getAllMajorsCount(@PathVariable("docRef") String docRef) {
        long result = documentService.getAllMajorsCount(docRef);
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @GetMapping(path = "/documents/recent-minor-versions/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> findRecentMinorVersions(@PathVariable("docRef") String docRef, @RequestParam("lastMajorVersion") String lastMajorVersion,
                                                          @RequestParam("startIndex") Integer startIndex, @RequestParam("maxResults") Integer maxResults) {
        List<LeosDocument> xmlDocs = documentService.findRecentMinorVersions(docRef, lastMajorVersion, startIndex, maxResults);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @GetMapping(path = "/documents/count-recent-minor-versions/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Long> getRecentMinorVersionsCount(@PathVariable("docRef") String docRef, @RequestParam("versionLabel") String versionLabel) {
        long result = documentService.getRecentMinorVersionsCount(docRef, versionLabel);
        return ResponseEntity.ok(result);
    }

    @GetMapping(path = "/documents/latest-major-version/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<LeosDocument> findLatestMajorVersionByRef(@PathVariable("docRef") String docRef) {
        LeosDocument xmlDoc = RestPreconditions.checkFound(documentService.findLatestMajorVersionByRef(docRef),
                HttpStatus.NOT_FOUND, "No documents found");
        return ResponseEntity.ok(xmlDoc);

    }

    @GetMapping(path = "/documents/first-version/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> findFirstVersion(@PathVariable("docRef") String docRef) {
        LeosDocument xmlDoc = RestPreconditions.checkFound(documentService.findFirstVersion(docRef),
                HttpStatus.NOT_FOUND, "No documents found");
        return ResponseEntity.ok(xmlDoc);
    }

    @GetMapping(path = "/document/{docRef}/find-by-version/{versionLabel}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> findDocumentByVersion(@PathVariable("docRef") String docRef,
                                                        @PathVariable("versionLabel") String versionLabel) {
        LeosDocument xmlDoc = RestPreconditions.checkFound(documentService.findDocumentByVersion(docRef, versionLabel),
                HttpStatus.NOT_FOUND, "No documents found");
        return ResponseEntity.ok(xmlDoc);
    }

    @GetMapping(path = "/documents/find-by-name/{name}",
            consumes = {},
            produces = {"application/json;charset=UTF-8"})
    public ResponseEntity<LeosDocument> findDocumentByName(@PathVariable("name") String name) throws RepositoryException {
        LeosDocument xmlDoc = RestPreconditions.checkFound(documentService.findDocumentByName(name).orElse(null),
                HttpStatus.NOT_FOUND, "No documents found");
        return ResponseEntity.ok(xmlDoc);
    }

    @GetMapping(path = "/documents/find-by-status/{status}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> findDocumentByStatus(@PathVariable("status") String status) {
        List<LeosDocument> xmlDocs = documentService.findDocumentsByStatus(status);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @PostMapping(path = "/documents/find-by-filter",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> findDocumentsUsingFilter(@RequestParam(value="packageName", required=false, defaultValue="%25") String packageName,
                                                                     @RequestBody FindDocumentsRequest findDocumentsRequest,
                                                                     @RequestParam("startIndex") Integer startIndex, @RequestParam("maxResults") Integer maxResults,
                                                                     @RequestParam(value = "fetchContent", required = false, defaultValue = "false") Boolean fetchContent)
            throws MalformedURLException {
        packageName = URLDecoder.decode(packageName, StandardCharsets.UTF_8);
        List<LeosDocument> xmlDocs = documentService.findDocumentsUsingFilter(packageName, findDocumentsRequest.getCategories(),
                findDocumentsRequest.getQueryFilter(), startIndex, maxResults, fetchContent);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @PostMapping(path = "/documents/count-by-filter",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> countDocumentsUsingFilter(@RequestParam(value="packageName", required=false, defaultValue="%25") String packageName,
                                                            @RequestBody FindDocumentsRequest findDocumentsRequest) throws MalformedURLException {
        packageName = URLDecoder.decode(packageName, StandardCharsets.UTF_8);
        Long count = documentService.countDocumentsUsingFilter(packageName, findDocumentsRequest.getCategories(), findDocumentsRequest.getQueryFilter());
        return ResponseEntity.ok(RestPreconditions.checkFound(count, HttpStatus.UNPROCESSABLE_ENTITY, "Error while counting"));
    }


    @GetMapping(path = "/documents/find-for-validation",
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Find documents for validation")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Object> findDocumentsPackagesForValidation() {
        List<String> packageNames = documentService.findPackagesForValidation();
        return ResponseEntity.ok(packageNames);
    }

    @PutMapping(path = "/documents/set-docs-validation-status")
    @Operation(summary = "Set documents validation status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Object> setDocumentsValidationStatus(@RequestBody List<String> versionIDs) throws RepositoryException {
        return ResponseEntity.ok(documentService.setDocumentValidationStatus(versionIDs));
    }

}
