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

import eu.europa.ec.leos.repository.model.CustomTemplateInfo;
import eu.europa.ec.leos.repository.exceptions.CatalogException;
import eu.europa.ec.leos.repository.services.CatalogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
public class CatalogController {

    @Autowired
    CatalogService catalogService;

    @PostMapping(path = "/catalog/publish-template",
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> publishCustomTemplate(
            @RequestParam String legFileId,
            @RequestParam String templateName,
            @RequestParam List<String> dgs,
            @RequestParam String userId,
            @RequestParam String originalDg) throws CatalogException {
        catalogService.publishCustomTemplate(legFileId, templateName, dgs, userId, originalDg);
        return ResponseEntity.ok().build();
    }

    @PostMapping(path = "/catalog/update-template",
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> updateCustomTemplate(
            @RequestParam String packageId,
            @RequestParam String templateName,
            @RequestParam List<String> dgs,
            @RequestParam String userId,
            @RequestParam String originalDg) throws CatalogException {
        catalogService.updateCustomTemplate(packageId, templateName, dgs, userId, originalDg);
        return ResponseEntity.ok().build();
    }

    @PostMapping(path = "/catalog/un-publish-template",
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Boolean> updateCustomTemplate(
            @RequestParam String packageId,
            @RequestParam String userId) throws CatalogException {
        Boolean isUpdated = catalogService.unpublishCustomTemplate(packageId, userId);
        return ResponseEntity.ok(isUpdated);
    }

    @GetMapping(path = "/catalog/template/{packageId}",
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<CustomTemplateInfo> getTemplateInfo(@PathVariable BigDecimal packageId) throws CatalogException {
        CustomTemplateInfo templateInfo = catalogService.getTemplateInfo(packageId);
        return ResponseEntity.ok(templateInfo);
    }
}