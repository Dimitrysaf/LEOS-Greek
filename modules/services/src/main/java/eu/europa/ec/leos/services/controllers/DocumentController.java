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

import eu.europa.ec.leos.domain.cmis.LeosCategoryClass;
import eu.europa.ec.leos.services.api.DocumentApiService;
import eu.europa.ec.leos.services.dto.request.DownloadVersionRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/secured/document")
public class DocumentController {

    private static final Logger LOG = LoggerFactory.getLogger(DocumentController.class);

    private final DocumentApiService documentApiService;

    @Autowired
    public DocumentController(DocumentApiService documentApiService) {
        this.documentApiService = documentApiService;
    }

    @RequestMapping(value = "/downloadVersion/{documentType}/{documentRef}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> downloadVersion(@PathVariable("documentType") String documentType, @PathVariable("documentRef") String documentRef,
                                                         @RequestBody DownloadVersionRequest downloadVersionRequest) {
        try {
            final LeosCategoryClass documentCategory = LeosCategoryClass.valueOf(documentType);
            final boolean isWithAnnotations = downloadVersionRequest.isWithAnnotations();
            final String filteredAnnotations = downloadVersionRequest.getAnnotations();
            byte[] response = documentApiService.downloadVersion(documentCategory, documentRef, filteredAnnotations, isWithAnnotations);
            // in case of sent to email we should notify it, not return a byte
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            String msg = "Error occurred while requesting Annotation filtering";
            LOG.error(msg, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
