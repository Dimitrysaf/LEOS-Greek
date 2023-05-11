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
import eu.europa.ec.leos.domain.cmis.LeosExportStatus;
import eu.europa.ec.leos.services.api.DocumentApiService;
import eu.europa.ec.leos.services.dto.request.DoubleCompareRequest;
import eu.europa.ec.leos.services.dto.request.DownloadComparedVersionRequest;
import eu.europa.ec.leos.services.dto.request.DownloadVersionRequest;
import eu.europa.ec.leos.services.dto.request.ExportComparedVersionRequest;
import eu.europa.ec.leos.services.dto.request.ExportToConsiliumRequest;
import eu.europa.ec.leos.services.dto.response.DownloadVersionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

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

            DownloadVersionResponse response = documentApiService.downloadVersion(documentCategory, documentRef, filteredAnnotations, isWithAnnotations);

            // create the HttpHeaders object and set the Content-Type header
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.set("Content-Disposition", "attachment; filename=" + response.getJobFileName());
            return new ResponseEntity<>(response.getResponseData(), headers, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while requesting Annotation filtering", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/export-to-econsilium/{documentType}/{documentRef}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> exportToEconsilium(@PathVariable("documentType") String documentType, @PathVariable("documentRef") String documentRef,
                                                     @RequestBody ExportToConsiliumRequest exportToConsiliumRequest) {
        try {
            final LeosCategoryClass documentCategory = LeosCategoryClass.valueOf(documentType);
            LeosExportStatus processedStatus = documentApiService.exportToConsilium(documentCategory, documentRef, exportToConsiliumRequest);
            return new ResponseEntity<>(processedStatus, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while requesting export to eConsilium", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/download-compared-version-XML/{documentType}/{documentRef}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> downloadComparedVersionXMLFile(@PathVariable("documentType") String documentType, @PathVariable("documentRef") String documentRef,
                                                                 @RequestBody DownloadComparedVersionRequest downloadComparedVersionRequest) {
        try {
            final LeosCategoryClass documentCategory = LeosCategoryClass.valueOf(documentType);
            DownloadVersionResponse response = documentApiService.downloadXMLComparisonFiles(documentCategory, documentRef, downloadComparedVersionRequest);

            // create the HttpHeaders object and set the Content-Type header
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.set("Content-Disposition", "attachment; filename=" + response.getJobFileName());
            return new ResponseEntity<>(response.getResponseData(), headers, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while requesting Annotation filtering", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/export-compared-version-as-PDF/{documentType}/{documentRef}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> exportComparedVersionAsPDF(@PathVariable("documentType") String documentType, @PathVariable("documentRef") String documentRef,
                                                             @RequestBody DownloadComparedVersionRequest downloadComparedVersionRequest) {
        try {
            final LeosCategoryClass documentCategory = LeosCategoryClass.valueOf(documentType);
            LeosExportStatus processedStatus = documentApiService.exportComparedVersionAsPDF(documentCategory, documentRef, downloadComparedVersionRequest);
            return new ResponseEntity<>(processedStatus, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while requesting export to eConsilium", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/download-compared-version-as-docuwrite/{documentType}/{documentRef}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> downloadComparedVersionAsDocuwrite(@PathVariable("documentType") String documentType,
                                                                     @PathVariable("documentRef") String documentRef,
                                                                     @RequestBody DownloadComparedVersionRequest downloadComparedVersionRequest) {
        try {
            final LeosCategoryClass documentCategory = LeosCategoryClass.valueOf(documentType);

            DownloadVersionResponse response = documentApiService.downloadComparedVersionAsDocuwrite(documentCategory, documentRef,
                    downloadComparedVersionRequest);

            // create the HttpHeaders object and set the Content-Type header
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.set("Content-Disposition", "attachment; filename=" + response.getJobFileName());
            return new ResponseEntity<>(response.getResponseData(), headers, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while requesting export to eConsilium", e);
            return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/double-compare/{documentType}/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> doubleCompare(@PathVariable("documentType") String documentType,
                                                @PathVariable("documentRef") String documentRef,
                                                @RequestBody DoubleCompareRequest doubleCompareRequest) {
        try {
            final LeosCategoryClass documentCategory = LeosCategoryClass.valueOf(documentType);
            String response = documentApiService.doubleCompare(documentCategory, documentRef,
                    doubleCompareRequest.getOriginalProposalId(), doubleCompareRequest.getIntermediateMajorId(), doubleCompareRequest.getCurrentId());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while requesting double compare", e);
            return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
