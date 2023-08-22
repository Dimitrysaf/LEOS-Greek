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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.MalformedURLException;
import java.util.List;

import static com.sun.jndi.toolkit.url.UrlUtil.decode;

@RestController
@Tag(name = "Document API", description = "Document API")
public class DocumentController {

    @Autowired
    DocumentService documentService;

    @PutMapping(path = "/document/create-with-content",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "create a document (Xml or milestone) from content")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document Created", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
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
    @Operation(summary = "create a Xml document from source")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document Created", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Object> createDocumentFromSource(@Validated(OnCreateFromSource.class) @Valid @RequestBody CreateDocumentRequest createDocumentRequest)
            throws RepositoryException {
        LeosDocument xmlDoc = documentService.createDocumentFromSource(createDocumentRequest.getSourceDocumentId(),
                createDocumentRequest.getPackageName(),
                createDocumentRequest.getName(),
                createDocumentRequest.getMetadata(), createDocumentRequest.getLabelVersion(), createDocumentRequest.getVersionType().value(),
                createDocumentRequest.getComments(), createDocumentRequest.getUserId());

        return ResponseEntity.ok(RestPreconditions.checkFound(xmlDoc, HttpStatus.INTERNAL_SERVER_ERROR, "Error while creating document"));
    }

    @DeleteMapping(path = "/document/delete-by-id/{id}")
    @Operation(summary = "delete a Xml document from version id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document deleted", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity deleteDocumentById(@PathVariable("id") String id) throws RepositoryException {
        documentService.deleteDocumentById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping(path = "/document/delete-by-ref/{docRef}")
    @Operation(summary = "delete a document (Xml or milestone) by reference")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document deleted", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity deleteDocumentByRef(@PathVariable("docRef") String docRef) throws RepositoryException {
        documentService.deleteDocumentByRef(docRef);
        return ResponseEntity.ok().build();
    }

    @PutMapping(path = "/document/update-content/{docRef}",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "update a Xml document and its content")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document Updated", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Object> updateDocument(@PathVariable("docRef") String docRef,
                                                 @Validated(OnUpdateWithContent.class) @Valid @RequestBody UpdateDocumentRequest updateDocumentRequest)
            throws Exception {
        LeosDocument xmlDoc = documentService.updateDocument(docRef, updateDocumentRequest.getMetadata(), updateDocumentRequest.getVersionType(), updateDocumentRequest.getContent(),
                updateDocumentRequest.getComments(), updateDocumentRequest.getUserId());
        return ResponseEntity.ok(RestPreconditions.checkFound(xmlDoc, HttpStatus.NOT_FOUND, "No documents found"));
    }

    @PutMapping(path = "/document/update-metadata/{docRef}/{versionId}",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "update metadata of a document (Milestone or Xml Document)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document Updated", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Object> updateDocumentMetadata(@PathVariable("versionId") String versionId, @PathVariable("docRef") String docRef,
                                                         @Validated(OnUpdateWithoutContent.class) @Valid @RequestBody UpdateDocumentRequest updateDocumentRequest, @RequestParam("latest") Boolean latest)
            throws Exception {
        LeosDocument xmlDoc = documentService.updateDocument(docRef, versionId, updateDocumentRequest.getMetadata(), updateDocumentRequest.getUserId(), latest);
        return ResponseEntity.ok(RestPreconditions.checkFound(xmlDoc, HttpStatus.NOT_FOUND, "No documents found"));
    }

    @GetMapping(path = "/document/archive/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Archive a document (Milestone or Xml Document)r")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Moved", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Object> archiveDocument(@PathVariable("docRef") String docRef,
                                               @RequestParam("userId") String userId) throws Exception {
        LeosDocument xmlDoc = documentService.archiveDocument(docRef, userId);
        return ResponseEntity.ok(RestPreconditions.checkFound(xmlDoc, HttpStatus.NOT_FOUND, "No documents found"));
    }

    @GetMapping(path = "/documents/find-by-collaborator/{userId}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Find Xml documents by collaborator")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity findDocumentsByUserId(@RequestParam("role") String role,
                                                @PathVariable("userId") String userId) {
        List<LeosDocument> xmlDocs = documentService.findDocumentsByUserId(userId, role);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @GetMapping(path = "/document/find-version/{versionId}",
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Find a Xml document by version id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document Found", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Object> findDocumentById(@PathVariable("versionId") String versionId,
                                                   @RequestParam("latest") Boolean latest)
            throws RepositoryException {
        LeosDocument xmlDoc = RestPreconditions.checkFound(documentService.findDocumentById(versionId, latest),
                HttpStatus.NOT_FOUND, "No documents found");
        return ResponseEntity.ok(xmlDoc);
    }

    @GetMapping(path = "/document/all-versions/{docRef}")
    @Operation(summary = "Find all versions of Xml Document by reference")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Versions of the Document Found", content = {@Content(mediaType =
                    MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Object> findAllVersionsByDocumentRef(@PathVariable("docRef") String docRef) {
        List<LeosDocument> xmlDocs = documentService.findAllVersionsByRef(docRef);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @GetMapping(path = "/documents/last-version/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Find Xml document's versions by reference")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<LeosDocument> findDocumentsByRef(@PathVariable("docRef") String ref)  {
        LeosDocument xmlDoc = documentService.findDocumentByRef(ref).orElse(null);
        return ResponseEntity.ok(xmlDoc);
    }

    @GetMapping(path = "/document/next-version-label", produces =  MediaType.TEXT_PLAIN_VALUE)
    @Operation(summary = "Get next version label")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Next version label issued", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<String> getNextVersionLabel(@RequestParam("versionType") String versionType, @RequestParam("oldVersion") String oldVersion) {
        String nextVersion = RestPreconditions.checkFound(documentService.getNextVersionLabel(VersionType.valueOf(versionType), oldVersion),
                HttpStatus.UNPROCESSABLE_ENTITY, "Error while counting");
        return ResponseEntity.ok(nextVersion);
    }

    @GetMapping(path = "/documents/all-minors-for-intermediate/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Find All minors for intermediate  (Xml Documents)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Object> findAllMinorsForIntermediate(@PathVariable("docRef") String docRef, @RequestParam("currIntVersion") String currIntVersion,
                                                               @RequestParam("startIndex") Integer startIndex, @RequestParam("maxResults") Integer maxResults) {
        List<LeosDocument> xmlDocs = documentService.findAllMinorsForIntermediate(docRef, currIntVersion, startIndex, maxResults);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }


    @GetMapping(path = "/documents/all-majors/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Find All Majors")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Object> findAllMajors(@PathVariable("docRef") String docRef,
                                                @RequestParam("startIndex") Integer startIndex, @RequestParam("maxResults") Integer maxResult) {
        List<LeosDocument> xmlDocs = documentService.findAllMajors(docRef, startIndex, maxResult);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @GetMapping(path = "/documents/count-all-minors-for-intermediate/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Get all minors Count for Intermediate (Xml Documents)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Long> getAllMinorsCountForIntermediate(@PathVariable("docRef") String docRef,
                                                                 @RequestParam("currIntVersion") String currIntVersion) {
        long result = documentService.getAllMinorsCountForIntermediate(docRef, currIntVersion);
        return ResponseEntity.ok(result);
    }


    @GetMapping(path = "/documents/count-all-majors/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Get all majors Count  (Xml Documents)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Integer> getAllMajorsCount(@PathVariable("docRef") String docRef) {
        long result = documentService.getAllMajorsCount(docRef);
        return new ResponseEntity(result, HttpStatus.OK);
    }


    @GetMapping(path = "/documents/recent-minor-versions/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Find Recent minor Versions  (Xml Documents)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Object> findRecentMinorVersions(@PathVariable("docRef") String docRef, @RequestParam("lastMajorVersion") String lastMajorVersion,
                                                          @RequestParam("startIndex") Integer startIndex, @RequestParam("maxResults") Integer maxResults) {
        List<LeosDocument> xmlDocs = documentService.findRecentMinorVersions(docRef, lastMajorVersion, startIndex, maxResults);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @GetMapping(path = "/documents/count-recent-minor-versions/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Get recent minor versions Count  (Xml Documents)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Long> getRecentMinorVersionsCount(@PathVariable("docRef") String docRef, @RequestParam("versionLabel") String versionLabel) {
        long result = documentService.getRecentMinorVersionsCount(docRef, versionLabel);
        return ResponseEntity.ok(result);
    }


    @GetMapping(path = "/documents/latest-major-version/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Find latest Major Version by reference (Xml Documents)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<LeosDocument> findLatestMajorVersionByRef(@PathVariable("docRef") String docRef) {
        LeosDocument xmlDoc = RestPreconditions.checkFound(documentService.findLatestMajorVersionByRef(docRef),
                HttpStatus.NOT_FOUND, "No documents found");
        return ResponseEntity.ok(xmlDoc);

    }


    @GetMapping(path = "/documents/first-version/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Find first version of a Xml Document by docRef")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Object> findFirstVersion(@PathVariable("docRef") String docRef) {
        LeosDocument xmlDoc = RestPreconditions.checkFound(documentService.findFirstVersion(docRef),
                HttpStatus.NOT_FOUND, "No documents found");
        return ResponseEntity.ok(xmlDoc);
    }


    @GetMapping(path = "/document/{docRef}/find-by-version/{versionLabel}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Find a Xml Document by version label and ref")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Object> findDocumentByVersion(@PathVariable("docRef") String docRef,
                                                        @PathVariable("versionLabel") String versionLabel) {
        LeosDocument xmlDoc = RestPreconditions.checkFound(documentService.findDocumentByVersion(docRef, versionLabel),
                HttpStatus.NOT_FOUND, "No documents found");
        return ResponseEntity.ok(xmlDoc);
    }

    @GetMapping(path = "/documents/find-by-name/{name}",
            consumes = {},
            produces = {"application/json;charset=UTF-8"})
    @Operation(summary = "Find Xml document, configuration or milestone by name")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = {@Content(mediaType = "application/json;charset=UTF-8")}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<LeosDocument> findDocumentByName(@PathVariable("name") String name) throws RepositoryException {
        LeosDocument xmlDoc = RestPreconditions.checkFound(documentService.findDocumentByName(name).orElse(null),
                HttpStatus.NOT_FOUND, "No documents found");
        return ResponseEntity.ok(xmlDoc);
    }

    @GetMapping(path = "/documents/find-by-status/{status}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Find a milestone document by status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "LEG Documents Found", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Object> findDocumentByStatus(@PathVariable("status") String status) {
        List<LeosDocument> xmlDocs = documentService.findDocumentsByStatus(status);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @PostMapping(path = "/documents/find-by-filter/{packageName}",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Find documents using filter")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Object> findDocumentsUsingFilter(@PathVariable("packageName") String packageName, @RequestBody FindDocumentsRequest findDocumentsRequest,
                                                               @RequestParam("startIndex") Integer startIndex, @RequestParam("maxResults") Integer maxResults,
                                                           @RequestParam(value = "fetchContent", required = false, defaultValue = "false") Boolean fetchContent)
            throws MalformedURLException {
        packageName = decode(packageName);
        List<LeosDocument> xmlDocs = documentService.findDocumentsUsingFilter(packageName, findDocumentsRequest.getCategories(),
                findDocumentsRequest.getQueryFilter(), startIndex, maxResults, fetchContent);
        return ResponseEntity.ok(new LeosDocumentList(xmlDocs));
    }

    @PostMapping(path = "/documents/count-by-filter/{packageName}",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "count documents using filter")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Object> countDocumentsUsingFilter(@PathVariable("packageName") String packageName,
                                                            @RequestBody FindDocumentsRequest findDocumentsRequest) throws MalformedURLException {
        packageName = decode(packageName);
        Long count = documentService.countDocumentsUsingFilter(packageName, findDocumentsRequest.getCategories(), findDocumentsRequest.getQueryFilter());
        return ResponseEntity.ok(RestPreconditions.checkFound(count, HttpStatus.UNPROCESSABLE_ENTITY, "Error while counting"));
    }
}
