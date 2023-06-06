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
import java.util.Optional;

@RestController
@Tag(name = "Package API", description = "Package API")
public class PackageController {
    @Autowired
    PackageRepository packageRepository;

    @Autowired
    DocumentVRepository documentRepository;

    ObjectMapper mapper = new ObjectMapper();

    @GetMapping(path = "/{repositoryId}/package/name/{name}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get a Package by name")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found the Package", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Package.class)) }),
            @ApiResponse(responseCode = "404", description = "Package not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Package> getPackageByName(@PathVariable("repositoryId") String repositoryId, @PathVariable("name") String name) {
        try {
            Optional<Package> p = packageRepository.findPackageByName(repositoryId, name);
            if (p.isPresent()) {
                return new ResponseEntity<>(p.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path="/{repositoryId}/package/documents/{name}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get all documents' last version inside a Package by name")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found the Documents", content = { @Content(mediaType = "application/json", schema =
            @Schema(implementation = List.class)) }),
            @ApiResponse(responseCode = "404", description = "Package not found or no documents found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<String> getDocumentsByPackageName(@PathVariable("repositoryId") String repositoryId, @PathVariable String name)
    {
        try {
            Optional<Package> pkg = packageRepository.findPackageByName(repositoryId, name);
            List<DocumentV> docs = Arrays.asList();
            if (pkg.isPresent()) {
                docs = documentRepository.findDocumentsByPackageId(pkg.get().getId());
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
