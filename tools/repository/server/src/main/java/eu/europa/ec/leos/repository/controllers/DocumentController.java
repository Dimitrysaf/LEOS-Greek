package eu.europa.ec.leos.repository.controllers;

import java.math.BigDecimal;
import java.util.List;

import eu.europa.ec.leos.repository.entities.DocumentV;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.repositories.DocumentVRepository;
import eu.europa.ec.leos.repository.repositories.PackageRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@Tag(name = "Document API", description = "Document API")
public class DocumentController {
    @Autowired
    PackageRepository packageRepository;

    @Autowired
    DocumentVRepository documentRepository;

    ObjectMapper mapper = new ObjectMapper();

    @GetMapping(path="/document/versions/{documentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get all documents' versions by document id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found the versions", content = { @Content(mediaType = "application/json", schema =
            @Schema(implementation = DocumentV[].class)) }),
            @ApiResponse(responseCode = "404", description = "No versions found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<String> getAllVersionsByDocumentId(@PathVariable String documentId)
    {
        try {
            List<DocumentV> docs = documentRepository.findAllVersionsByDocumentId(BigDecimal.valueOf(Long.valueOf(documentId)));
            if (docs.isEmpty()) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            } else {
                mapper.findAndRegisterModules();
                String jsonString = mapper.writeValueAsString(docs);
                return new ResponseEntity<>(jsonString, HttpStatus.OK);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
