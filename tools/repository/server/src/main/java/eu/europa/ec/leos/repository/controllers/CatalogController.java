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

import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.services.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Tag(name = "Catalog API", description = "Catalog API")
public class CatalogController {

    @Autowired
    CatalogService catalogService;

    @PostMapping(path = "/catalog/publish-template",
            produces = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Publish a custom template")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Template published successfully", content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content)})
    public ResponseEntity<Object> publishCustomTemplate(
            @RequestParam String legFileId,
            @RequestParam String templateName,
            @RequestParam List<String> dgs,
            @RequestParam String userId) throws RepositoryException {
        catalogService.publishCustomTemplate(legFileId, templateName, dgs, userId);
        return ResponseEntity.ok().build();
    }
}