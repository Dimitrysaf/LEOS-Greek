package eu.europa.ec.leos.repository.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.leos.repository.entities.DocumentV;
import eu.europa.ec.leos.repository.repositories.DocumentVRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.repositories.PackageRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Arrays;
import java.util.List;

@RestController
@Tag(name = "Package API", description = "Package API")
public class PackageController {
    @Autowired
    PackageRepository packageRepository;

    @Autowired
    DocumentVRepository documentRepository;

    ObjectMapper mapper = new ObjectMapper();

    @GetMapping(path = "/package/name/{name}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get a Package by name")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found the Package", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Package.class)) }),
            @ApiResponse(responseCode = "404", description = "Package not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Package> getPackageByName(@PathVariable("name") String name) {
        try {
            Package p = packageRepository.findPackageByName(name);
            if (p != null) {
                return new ResponseEntity<>(p, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path="/package/documents/{name}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get all documents' last version inside a Package by name")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found the Documents", content = { @Content(mediaType = "application/json", schema =
            @Schema(implementation = List.class)) }),
            @ApiResponse(responseCode = "404", description = "Package not found or no documents found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<String> getDocumentsByPackageName(@PathVariable String name)
    {
        try {
            Package pkg = packageRepository.findPackageByName(name);
            List<DocumentV> docs = Arrays.asList();
            if (pkg != null) {
                docs = documentRepository.findDocumentsByPackageId(pkg.getId());
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
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
