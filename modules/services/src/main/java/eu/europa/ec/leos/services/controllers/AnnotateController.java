/*
 * Copyright 2022 European Commission
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

import eu.europa.ec.leos.domain.annotation.AnnotateMetadata;
import eu.europa.ec.leos.domain.cmis.LeosCategory;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.services.api.AnnotateApiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/secured/annotation")
public class AnnotateController {

    private static final Logger LOG = LoggerFactory.getLogger(AnnotateController.class);

    private final AnnotateApiService annotateApiService;

    @Autowired
    public AnnotateController(AnnotateApiService annotateApiService) {
        this.annotateApiService = annotateApiService;
    }

    @RequestMapping(value = "/requestUserPermissions/{documentType}/{documentRef}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> requestUserPermissions(@PathVariable("documentType") String documentType, @PathVariable("documentRef") String documentRef) {
        try {
            final LeosCategory documentCategory = LeosCategory.valueOf(documentType);

            List<LeosPermission> documentPermissions = annotateApiService.requestUserPermissions(documentRef, documentCategory);
            return new ResponseEntity<>(documentPermissions, HttpStatus.OK);
        } catch (Exception e) {
            String msg = "Error occurred while requesting Annotation User Permission";
            LOG.error(msg, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/requestSecurityToken", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> requestSecurityToken() {
        try {
            String annotationToken = annotateApiService.getAnnotationToken();
            return new ResponseEntity<>(annotationToken, HttpStatus.OK);
        } catch (Exception e) {
            String msg = "Error occurred while getting Annotation Security Token";
            LOG.error(msg, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/requestDocumentMetadata/{documentRef}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> requestDocumentMetadata(@PathVariable("documentType") String documentType, @PathVariable("documentRef") String documentRef) {
        try {
            final LeosCategory documentCategory = LeosCategory.valueOf(documentType);

            AnnotateMetadata documentMetadata = annotateApiService.requestDocumentMetadata(documentRef, documentCategory);
            return new ResponseEntity<>(documentMetadata, HttpStatus.OK);
        } catch (Exception e) {
            String msg = "Error occurred while requesting Annotation DocumentMetadata ";
            LOG.error(msg, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
