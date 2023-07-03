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
import eu.europa.ec.leos.repository.controllers.response.ExceptionResponse;
import eu.europa.ec.leos.repository.controllers.requests.OnCreateFromContent;
import eu.europa.ec.leos.repository.controllers.requests.OnCreateFromSource;
import eu.europa.ec.leos.repository.controllers.requests.OnUpdateWithContent;
import eu.europa.ec.leos.repository.controllers.requests.OnUpdateWithoutContent;
import eu.europa.ec.leos.repository.controllers.requests.UpdateDocumentRequest;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.services.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.validation.Valid;
import java.util.List;

@RestController
@Tag(name = "Document API", description = "Document API")
public class DocumentController {
    private static final Logger LOG = LoggerFactory.getLogger(DocumentController.class);

    @Autowired
    DocumentService documentService;

    @Autowired
    ObjectMapper mapper;

    @Value("${repository.default.id}")
    private String repositoryId;

    @PutMapping(path = "/document/create-with-content",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "create a document (Xml or milestone) from content")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document Created", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> createDocumentFromContent(@Validated(OnCreateFromContent.class) @Valid @RequestBody CreateDocumentRequest createDocumentRequest) {
        try {

            LeosDocument xmlDoc = documentService.createDocumentFromContent(repositoryId, createDocumentRequest.getPackageName(),
                    createDocumentRequest.getName(),
                    createDocumentRequest.getMetadata(), createDocumentRequest.getLabelVersion(), createDocumentRequest.getVersionType().value(),
                    createDocumentRequest.getContent(), createDocumentRequest.getComments(), createDocumentRequest.getUserId());
            if (xmlDoc != null) {
                return new ResponseEntity<>(xmlDoc, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("Error while creating document", ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            LOG.error("Error while creating a document with content and name {0} : {1}", createDocumentRequest.getName(), e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(path = "/document/create-with-source",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "create a Xml document from source")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document Created", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> createDocumentFromSource(@Validated(OnCreateFromSource.class) @Valid @RequestBody CreateDocumentRequest createDocumentRequest) {
        try {
            LeosDocument xmlDoc = documentService.createDocumentFromSource(repositoryId, createDocumentRequest.getSourceDocumentId(),
                    createDocumentRequest.getPackageName(),
                    createDocumentRequest.getName(),
                    createDocumentRequest.getMetadata(), createDocumentRequest.getLabelVersion(), createDocumentRequest.getVersionType().value(),
                    createDocumentRequest.getComments(), createDocumentRequest.getUserId());
            if (xmlDoc != null) {
                return new ResponseEntity<>(xmlDoc, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("Error while creating document", ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            LOG.error("Error while creating a Xml document using template {0} : {1}", createDocumentRequest.getSourceDocumentId(), e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(path = "/document/delete-by-id/{id}")
    @Operation(summary = "delete a Xml document from version id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document deleted", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity deleteDocumentById(@PathVariable("id") String id) {
        try {
            documentService.deleteDocumentById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error while deleting a Xml document by version id {0} : {1}", id, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(path = "/document/delete-by-ref/{docRef}")
    @Operation(summary = "delete a document (Xml or milestone) by reference")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document deleted", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity deleteDocumentByRef(@PathVariable("docRef") String docRef) {
        try {
            documentService.deleteDocumentByRef(docRef);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error while deleting document with ref {0}: {1}", docRef, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(path = "/document/update-content/{docRef}",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "update a Xml document and its content")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document Updated", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> updateDocument(@PathVariable("docRef") String docRef,
                                                                 @Validated(OnUpdateWithContent.class) @Valid @RequestBody UpdateDocumentRequest updateDocumentRequest) {
        try {
            LeosDocument xmlDoc = documentService.updateDocument(docRef, updateDocumentRequest.getMetadata(),
                    updateDocumentRequest.getLabelVersion(), updateDocumentRequest.getVersionType().value(), updateDocumentRequest.getContent(),
                    updateDocumentRequest.getComments(), updateDocumentRequest.getUserId());
            if (xmlDoc != null) {
                return new ResponseEntity<>(xmlDoc, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("No documents found", ExceptionResponse.ExceptionType.WARNING), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while updating document with ref {0}: {1}", docRef, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(path = "/document/update-metadata/{docRef}",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "update metadata of a document (Milestone or Xml Document)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document Updated", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> updateDocumentMetadata(@PathVariable("docRef") String docRef,
                                                                 @Validated(OnUpdateWithoutContent.class) @Valid @RequestBody UpdateDocumentRequest updateDocumentRequest) {
        try {
            LeosDocument xmlDoc = documentService.updateDocument(docRef, updateDocumentRequest.getMetadata(),
                    updateDocumentRequest.getLabelVersion(), updateDocumentRequest.getVersionType().value(),
                    updateDocumentRequest.getComments(), updateDocumentRequest.getUserId());
            if (xmlDoc != null) {
                return new ResponseEntity<>(xmlDoc, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("No documents found", ExceptionResponse.ExceptionType.WARNING), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while updating document with ref {0}: {1}", docRef, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/documents/find-by-collaborator/{userId}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Find Xml documents by collaborator")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity findDocumentsByUserId(@RequestParam("role") String role,
                                                @PathVariable("userId") String userId) {
        try {
            List<LeosDocument> xmlDocs = documentService.findDocumentsByUserId(userId, role);
            if (!xmlDocs.isEmpty()) {
                return new ResponseEntity(mapper.writeValueAsString(xmlDocs), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("No documents found", ExceptionResponse.ExceptionType.WARNING), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while searching document by collaborator {0}: {1}", userId, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/document/find-version/{versionId}",
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Find a Xml document by version id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> findDocumentById(@PathVariable("versionId") String versionId,
                                                         @RequestParam("latest") Boolean latest) {
        try {
            LeosDocument xmlDoc = documentService.findDocumentById(versionId, latest);
            if (xmlDoc != null) {
                return new ResponseEntity<>(xmlDoc, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("No documents found", ExceptionResponse.ExceptionType.WARNING), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while searching document by version id with collaborator {0}: {1}", versionId, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/document/all-versions/{docRef}")
    @Operation(summary = "Find all versions of Xml Document by reference")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Versions of the Document Found", content = { @Content(mediaType =
                    MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> findAllVersionsByDocumentRef(@PathVariable("docRef") String docRef) {
        try {
            List<LeosDocument> xmlDocs = documentService.findAllVersionsByRef(docRef);
            if (!xmlDocs.isEmpty()) {
                return new ResponseEntity<>(mapper.writeValueAsString(xmlDocs), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("No documents found", ExceptionResponse.ExceptionType.WARNING), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while searching document by reference {0}: {1}", docRef, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/documents/last-version/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Find Xml document's versions by reference")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> findDocumentsByRef( @PathVariable("docRef") String ref) {
        try {
            Optional<LeosDocument> xmlDoc = documentService.findDocumentByRef(ref);
            if (xmlDoc.isPresent()) {
                return new ResponseEntity(xmlDoc.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("No documents found", ExceptionResponse.ExceptionType.WARNING), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while searching Xml document's versions by reference {0}: {1}", ref, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/document/next-version-label")
    @Operation(summary = "Get next version label")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Next version label issued", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> getNextVersionLabel(@RequestParam("versionType") String versionType, @RequestParam("oldVersion") String oldVersion) {
        try {
            String nextVersion = documentService.getNextVersionLabel(VersionType.valueOf(versionType), oldVersion);
            if (nextVersion != null) {
                return new ResponseEntity<>(nextVersion, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("Error while counting", ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            LOG.error("Error while getting next version {0}: {1}", oldVersion, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/documents/all-minors-for-intermediate/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Find All minors for intermediate  (Xml Documents)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> findAllMinorsForIntermediate(@PathVariable("docRef") String docRef, @RequestParam("currIntVersion") String currIntVersion,
                                                       @RequestParam("startIndex") Integer startIndex, @RequestParam("maxResults") Integer maxResults
    ) {
        try {
            List<LeosDocument> xmlDocs = documentService.findAllMinorsForIntermediate(docRef, currIntVersion, startIndex, maxResults);
            if (!xmlDocs.isEmpty()) {
                return new ResponseEntity(mapper.writeValueAsString(xmlDocs), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("No documents found", ExceptionResponse.ExceptionType.WARNING), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while searching document's minor versions by reference {0}: {1}", docRef, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping(path = "/documents/all-majors/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Find All Majors")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> findAllMajors(@PathVariable("docRef") String docRef,
                                                       @RequestParam("startIndex") Integer startIndex, @RequestParam("maxResults") Integer maxResult) {
        try {
            List<LeosDocument> xmlDocs = documentService.findAllMajors( docRef, startIndex, maxResult);
            if (!xmlDocs.isEmpty()) {
                return new ResponseEntity(mapper.writeValueAsString(xmlDocs), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("No documents found", ExceptionResponse.ExceptionType.WARNING), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while searching Xml document's major versions by reference {0}: {1}", docRef, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/documents/count-all-minors-for-intermediate/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Get all minors Count for Intermediate (Xml Documents)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> getAllMinorsCountForIntermediate(@PathVariable("docRef") String docRef,
                                                                  @RequestParam("currIntVersion") String currIntVersion) {
        try {
            Integer result = documentService.getAllMinorsCountForIntermediate(docRef, currIntVersion);
            if (result != null) {
                return new ResponseEntity(result, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("Error while counting", ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            LOG.error("Error while counting Xml document's minor versions by reference {0}: {1}", docRef, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping(path = "/documents/count-all-majors/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Get all majors Count  (Xml Documents)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> getAllMajorsCount(@PathVariable("docRef") String docRef) {
        try {
            Integer result = documentService.getAllMajorsCount(docRef);
            if (result != null) {
                return new ResponseEntity(result, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("Error while counting", ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            LOG.error("Error while counting Xml document's major versions by reference {0}: {1}", docRef, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping(path = "/documents/recent-minor-versions/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Find Recent minor Versions  (Xml Documents)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> findRecentMinorVersions(@PathVariable("docRef") String docRef, @RequestParam("lastMajorVersion") String lastMajorVersion,
                                                       @RequestParam("startIndex") Integer startIndex, @RequestParam("maxResults") Integer maxResults
    ) {
        try {
            List<LeosDocument> xmlDocs = documentService.findRecentMinorVersions(docRef, lastMajorVersion, startIndex, maxResults);
            if (!xmlDocs.isEmpty()) {
                return new ResponseEntity(mapper.writeValueAsString(xmlDocs), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("No documents found", ExceptionResponse.ExceptionType.WARNING), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while searching Xml document's recent minor versions by reference {0}: {1}", docRef, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/documents/count-recent-minor-versions/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Get recent minor versions Count  (Xml Documents)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> getRecentMinorVersionsCount(@PathVariable("docRef") String docRef, @RequestParam("versionLabel") String versionLabel) {
        try {
            Integer result = documentService.getRecentMinorVersionsCount(docRef, versionLabel);
            if (result != null) {
                return new ResponseEntity(result, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("Error while counting", ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            LOG.error("Error while counting Xml document's recent minor versions by reference {0}: {1}", docRef, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping(path = "/documents/latest-major-version/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Find latest Major Version by reference (Xml Documents)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> findLatestMajorVersionByRef(@PathVariable("docRef") String docRef)
            {
        try {
            LeosDocument xmlDocs = documentService.findLatestMajorVersionByRef(docRef);
            if (xmlDocs != null) {
                return new ResponseEntity(xmlDocs, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("No documents found", ExceptionResponse.ExceptionType.WARNING), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while searching for Xml document's latest major version by reference {0}: {1}", docRef, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping(path = "/documents/first-version/{docRef}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Find first version of a Xml Document by docRef")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> findFirstVersion(@PathVariable("docRef") String docRef)
    {
        try {
            LeosDocument xmlDocs = documentService.findFirstVersion(docRef);
            if (xmlDocs != null) {
                return new ResponseEntity(xmlDocs, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("No documents found", ExceptionResponse.ExceptionType.WARNING), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while searching for Xml document's first version by reference {0}: {1}", docRef, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping(path = "/document/{docRef}/find-by-version/{versionLabel}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Find a Xml Document by version label and ref")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> findDocumentByVersion(@PathVariable("docRef") String docRef,
                                                    @PathVariable("versionLabel") String versionLabel)
    {
        try {
            LeosDocument xmlDocs = documentService.findDocumentByVersion(docRef, versionLabel);
            if (xmlDocs != null) {
                return new ResponseEntity(xmlDocs, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("No documents found", ExceptionResponse.ExceptionType.WARNING), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while searching for Xml document's version by reference {0} - version label - {1} : {2}", docRef, versionLabel, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/documents/find-by-name/{name}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Find Xml document, configuration or milestone by name")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> findDocumentByName(@PathVariable("name") String name)
    {
        try {
            List<LeosDocument> xmlDocs = documentService.findDocumentByName(name);
            if (!xmlDocs.isEmpty()) {
                return new ResponseEntity(mapper.writeValueAsString(xmlDocs), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("No documents found", ExceptionResponse.ExceptionType.WARNING), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while searching for document by name {0}: {1}", name, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/documents/find-by-status/{status}",
            consumes = {},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Find a milestone document by status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "LEG Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> findDocumentByStatus(@PathVariable("status") String status)
    {
        try {
            List<LeosDocument> xmlDocs = documentService.findDocumentsByStatus(status);
            if (!xmlDocs.isEmpty()) {
                return new ResponseEntity(mapper.writeValueAsString(xmlDocs), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("No documents found", ExceptionResponse.ExceptionType.WARNING), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while searching for Leg documents by sattus {0} : {1}", status, e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(path = "/documents/find-by-filter",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "Find documents using filter")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> findDocumentsUsingFilter(@RequestBody FindDocumentsRequest findDocumentsRequest, @RequestParam("startIndex") Integer startIndex,
                                                      @RequestParam("maxResults") Integer maxResults) {
        try {
            List<LeosDocument> xmlDocs = documentService.findDocumentsUsingFilter(findDocumentsRequest.getCategories(), findDocumentsRequest.getQueryFilter()
                    , startIndex, maxResults);
            if (!xmlDocs.isEmpty()) {
                return new ResponseEntity(mapper.writeValueAsString(xmlDocs), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ExceptionResponse("No documents found", ExceptionResponse.ExceptionType.WARNING), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.error("Error while searching for documents using filter : {0}", e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(path = "/documents/count-by-filter",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE} )
    @Operation(summary = "count documents using filter")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documents Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<?> countDocumentsUsingFilter(@RequestBody FindDocumentsRequest findDocumentsRequest) {
        try {
            Long count = documentService.countDocumentsUsingFilter(findDocumentsRequest.getCategories(), findDocumentsRequest.getQueryFilter());
            return new ResponseEntity(count, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error while searching for documents using filter : {0}", e.getMessage());
            return new ResponseEntity<>(new ExceptionResponse(e.getMessage(), ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
