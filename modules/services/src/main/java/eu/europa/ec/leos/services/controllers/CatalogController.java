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

package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.services.api.exception.PendingTranslationException;
import eu.europa.ec.leos.services.dto.request.PublishTemplateRequest;
import eu.europa.ec.leos.services.dto.response.CustomTemplateInfoResponse;
import eu.europa.ec.leos.services.template.CustomTemplateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;

@RestController
@RequestMapping(path = "/secured/catalog")
public class CatalogController {

    private static final Logger LOG = LoggerFactory.getLogger(CatalogController.class);

    @Autowired
    private CustomTemplateService customTemplateService;

    @RequestMapping(value = "/publish-template/{legFileId}", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> publishTemplateToCatalog(@PathVariable("legFileId") String legFileId, @RequestBody PublishTemplateRequest request)
            throws PendingTranslationException {
        try {
            legFileId = encodeParam(legFileId);
            if (request.isCleanPendingTranslations()) {
                customTemplateService.cleanPendingTranslations(legFileId);
            }
            customTemplateService.publishTemplate(
                    legFileId,
                    request.getTemplateName(),
                    request.getDgCodes()
            );
            return new ResponseEntity<>(Collections.singletonMap("message", "Template published successfully"), HttpStatus.OK);
        } catch (PendingTranslationException e) {
            throw e;
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while publishing template - " + e.getMessage(), e);
            return new ResponseEntity<>(
                    Collections.singletonMap("error", "Unexpected error occurred while publishing template"),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @RequestMapping(value = "/update-template/{packageId}", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> updateTemplate(@PathVariable("packageId") String packageId, @RequestBody PublishTemplateRequest request) {
        try {
            packageId = encodeParam(packageId);
            customTemplateService.updateTemplate(
                    packageId,
                    request.getTemplateName(),
                    request.getDgCodes()
            );
            return new ResponseEntity<>(Collections.singletonMap("message", "Template updated successfully"), HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while updating template - " + e.getMessage(), e);
            return new ResponseEntity<>(
                    Collections.singletonMap("error", "Unexpected error occurred while updating template"),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @RequestMapping(value = "/un-publish-template/{catalogKey}", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> unPublishTemplate(@PathVariable("catalogKey") String catalogKey) {
        try {
            catalogKey = encodeParam(catalogKey);
            Boolean isUpdated = customTemplateService.unPublishTemplate(catalogKey);
            return new ResponseEntity<>(isUpdated, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while un published template - " + e.getMessage(), e);
            return new ResponseEntity<>(
                    Collections.singletonMap("error", "Unexpected error occurred while un published template"),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @GetMapping(value = "/template/{proposalRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getTemplateInfo(@PathVariable("proposalRef") String proposalRef) {
        try {
            proposalRef = encodeParam(proposalRef);
            CustomTemplateInfoResponse response = customTemplateService.getTemplateInfo(proposalRef);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while getting template info - " + e.getMessage(), e);
            return new ResponseEntity<>(
                    Collections.singletonMap("error", "Unexpected error occurred while getting template info"),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}