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

import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosCategoryClass;
import eu.europa.ec.leos.domain.repository.LeosExportStatus;
import eu.europa.ec.leos.services.api.DocumentApiService;
import eu.europa.ec.leos.services.dto.request.DoubleCompareRequest;
import eu.europa.ec.leos.services.dto.request.DownloadComparedVersionRequest;
import eu.europa.ec.leos.services.dto.request.DownloadVersionRequest;
import eu.europa.ec.leos.services.dto.request.ExportToConsiliumRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.DownloadVersionResponse;
import eu.europa.ec.leos.services.dto.response.FetchElementResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;

@RestController
@RequestMapping("/secured/document")
public class DocumentController {

    private static final Logger LOG = LoggerFactory.getLogger(DocumentController.class);
    private static final String CONTENT_DISPOSITION = "Content-Disposition";
    private static final String ATTACHMENT_FILENAME = "attachment; filename=\"";
    private static final String ERROR_OCCURRED_WHILE_REQUESTING_DOUBLE_COMPARE = "Error occurred while requesting double compare";
    private static final String ERROR_OCCURRED_WHILE_REQUESTING_EXPORT_TO_E_CONSILIUM = "Error occurred while requesting export to eConsilium";

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
            documentType = encodeParam(documentType);
            documentRef = encodeParam(documentRef);
            final LeosCategoryClass documentCategory = LeosCategoryClass.caseInsensitiveValueOf(documentType);
            final boolean isWithAnnotations = downloadVersionRequest.isWithAnnotations();
            final String filteredAnnotations = downloadVersionRequest.getAnnotations();

            DownloadVersionResponse response = documentApiService.downloadVersion(documentCategory, documentRef, filteredAnnotations, isWithAnnotations);

            // create the HttpHeaders object and set the Content-Type header
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.set(CONTENT_DISPOSITION, ATTACHMENT_FILENAME + response.getJobFileName() + "\"");
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
            documentType = encodeParam(documentType);
            documentRef = encodeParam(documentRef);
            final LeosCategoryClass documentCategory = LeosCategoryClass.caseInsensitiveValueOf(documentType);
            LeosExportStatus processedStatus = documentApiService.exportToConsilium(documentCategory, documentRef, exportToConsiliumRequest);
            return new ResponseEntity<>(processedStatus, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURRED_WHILE_REQUESTING_EXPORT_TO_E_CONSILIUM, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/download-compared-version-XML/{documentType}/{documentRef}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> downloadComparedVersionXMLFile(@PathVariable("documentType") String documentType, @PathVariable("documentRef") String documentRef,
                                                                 @RequestBody DownloadComparedVersionRequest downloadComparedVersionRequest) {
        try {
            documentType = encodeParam(documentType);
            documentRef = encodeParam(documentRef);
            final LeosCategoryClass documentCategory = LeosCategoryClass.caseInsensitiveValueOf(documentType);
            DownloadVersionResponse response = documentApiService.downloadXMLComparisonFiles(documentCategory, documentRef, downloadComparedVersionRequest);

            // create the HttpHeaders object and set the Content-Type header
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.set(CONTENT_DISPOSITION, ATTACHMENT_FILENAME + response.getJobFileName() + "\"");
            return new ResponseEntity<>(response.getResponseData(), headers, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while requesting download of xml comparison files", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/export-compared-version-as-PDF/{documentType}/{documentRef}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> exportComparedVersionAsPDF(@PathVariable("documentType") String documentType, @PathVariable("documentRef") String documentRef,
                                                             @RequestBody DownloadComparedVersionRequest downloadComparedVersionRequest) {
        try {
            documentType = encodeParam(documentType);
            documentRef = encodeParam(documentRef);
            final LeosCategoryClass documentCategory = LeosCategoryClass.caseInsensitiveValueOf(documentType);
            LeosExportStatus processedStatus = documentApiService.exportComparedVersionAsPDF(documentCategory, documentRef, downloadComparedVersionRequest);
            return new ResponseEntity<>(processedStatus, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURRED_WHILE_REQUESTING_EXPORT_TO_E_CONSILIUM, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/download-compared-version-as-docuwrite/{documentType}/{documentRef}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> downloadComparedVersionAsDocuwrite(@PathVariable("documentType") String documentType,
                                                                     @PathVariable("documentRef") String documentRef,
                                                                     @RequestBody DownloadComparedVersionRequest downloadComparedVersionRequest) {
        try {
            documentType = encodeParam(documentType);
            documentRef = encodeParam(documentRef);
            final LeosCategoryClass documentCategory = LeosCategoryClass.caseInsensitiveValueOf(documentType);

            DownloadVersionResponse response = documentApiService.downloadComparedVersionAsDocuwrite(documentCategory, documentRef,
                    downloadComparedVersionRequest);

            // create the HttpHeaders object and set the Content-Type header
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.set(CONTENT_DISPOSITION, ATTACHMENT_FILENAME + response.getJobFileName() + "\"");
            return new ResponseEntity<>(response.getResponseData(), headers, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURRED_WHILE_REQUESTING_EXPORT_TO_E_CONSILIUM, e);
            return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/double-compare/{documentType}/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> doubleCompare(@PathVariable("documentType") String documentType,
                                                @PathVariable("documentRef") String documentRef,
                                                @RequestBody DoubleCompareRequest doubleCompareRequest) {
        try {
            documentType = encodeParam(documentType);
            documentRef = encodeParam(documentRef);
            final LeosCategoryClass documentCategory = LeosCategoryClass.caseInsensitiveValueOf(documentType);
            String response = documentApiService.doubleCompare(documentCategory, documentRef,
                    doubleCompareRequest.getOriginalProposalId(), doubleCompareRequest.getIntermediateMajorId(), doubleCompareRequest.getCurrentId());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURRED_WHILE_REQUESTING_DOUBLE_COMPARE, e);
            return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/fetch-reference-label/{documentRef}", produces = MediaType.TEXT_PLAIN_VALUE)
    @ResponseBody
    public ResponseEntity<Object> fetchReferenceLabel(@PathVariable("documentRef") String documentRef,
                                                      @RequestParam List<String> references,
                                                      @RequestParam String currentElementId, @RequestParam boolean capital) {
        try {
            documentRef = encodeParam(documentRef);
            currentElementId = encodeParam(currentElementId);
            String response = documentApiService.fetchReferenceLabel(documentRef, references, currentElementId, capital);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURRED_WHILE_REQUESTING_DOUBLE_COMPARE, e);
            return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/request-element/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> requestElement(@PathVariable("documentRef") String documentRef,
                                                 @RequestParam String elementId, @RequestParam String elementTagName) {
        try {
            documentRef = encodeParam(documentRef);
            elementId = encodeParam(elementId);
            elementTagName = encodeParam(elementTagName);
            FetchElementResponse response = documentApiService.fetchElement(elementId, elementTagName, documentRef);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error(ERROR_OCCURRED_WHILE_REQUESTING_DOUBLE_COMPARE, e);
            return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{documentType}/{documentRef}/baseVersion/{documentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> changeBaseVersion(@PathVariable("documentType") String documentType,
            @PathVariable("documentRef") String documentRef,
            @PathVariable("documentId") String documentId,
            @RequestParam String versionLabel, @RequestParam String versionComment) {
        try {
            documentRef = encodeParam(documentRef);
            documentId = encodeParam(documentId);
            versionLabel = encodeParam(versionLabel);
            versionComment = encodeParam(versionComment);
            final LeosCategory documentCategory = LeosCategory.caseInsensitiveValueOf(documentType);
            DocumentViewResponse response = documentApiService.changeBaseVersion(documentRef, documentCategory, documentId, versionLabel, versionComment);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred while changing baseVersion for - " + documentRef, e);
            return new ResponseEntity<>("Unexpected error while trying to restore version ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping(value = "/{legFileName}/{proposalRef}/stored-annotations/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getStoredAnnotations(@PathVariable("legFileName") String legFileName,
                                                       @PathVariable("documentRef") String documentRef,
                                                       @PathVariable("proposalRef") String proposalRef) {
        try {
            documentRef = encodeParam(documentRef);
            legFileName = encodeParam(legFileName);
            String annots = documentApiService.getStoredDocumentAnnotations(legFileName, documentRef, proposalRef);
            return ResponseEntity.ok().body(annots);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annotations in LEG file for - " + legFileName, e);
            return new ResponseEntity<>("Unexpected error while trying to get annotations in LEG file ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
