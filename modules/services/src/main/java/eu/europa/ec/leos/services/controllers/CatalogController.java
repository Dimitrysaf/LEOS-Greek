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

import eu.europa.ec.leos.services.dto.request.PublishTemplateRequest;
import eu.europa.ec.leos.services.dto.response.CustomTemplateInfoResponse;
import eu.europa.ec.leos.services.template.CustomTemplateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;

@RestController
@RequestMapping(path = "/secured/catalog")
public class CatalogController implements CatalogApi {

    private static final Logger LOG = LoggerFactory.getLogger(CatalogController.class);

    @Autowired
    private CustomTemplateService customTemplateService;

    @Override
    public ResponseEntity<Object> publishTemplateToCatalog(String legFileId, PublishTemplateRequest request) throws Exception {
        legFileId = encodeParam(legFileId);
        customTemplateService.publishTemplate(
                legFileId,
                request.getTemplateName(),
                request.getDgCodes()
        );
        return new ResponseEntity<>(Collections.singletonMap("message", "Template published successfully"), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Object> updateTemplate(String packageId, PublishTemplateRequest request) {
        packageId = encodeParam(packageId);
        customTemplateService.updateTemplate(
                packageId,
                request.getTemplateName(),
                request.getDgCodes()
        );
        return new ResponseEntity<>(Collections.singletonMap("message", "Template updated successfully"), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Object> unPublishTemplate(String catalogKey) {
        catalogKey = encodeParam(catalogKey);
        Boolean isUpdated = customTemplateService.unPublishTemplate(catalogKey);
        return new ResponseEntity<>(isUpdated, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Object> getTemplateInfo(String proposalRef) {
        proposalRef = encodeParam(proposalRef);
        CustomTemplateInfoResponse response = customTemplateService.getTemplateInfo(proposalRef);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}