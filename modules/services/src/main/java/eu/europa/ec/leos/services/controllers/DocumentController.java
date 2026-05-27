/*
 * Copyright 2026 European Union
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
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.services.api.DocumentApiService;
import eu.europa.ec.leos.services.api.GenericDocumentApiService;
import eu.europa.ec.leos.services.dto.request.DoubleCompareRequest;
import eu.europa.ec.leos.services.dto.request.DownloadComparedVersionRequest;
import eu.europa.ec.leos.services.dto.request.DownloadVersionRequest;
import eu.europa.ec.leos.services.dto.request.ExportToConsiliumRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.DownloadPreviewResponse;
import eu.europa.ec.leos.services.dto.response.PreviewResponse;
import eu.europa.ec.leos.services.dto.response.DownloadVersionResponse;
import eu.europa.ec.leos.services.dto.response.FetchElementResponse;
import eu.europa.ec.leos.services.dto.response.TocAndAncestorsResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;

@RestController
@RequestMapping("/secured/document")
public class DocumentController implements DocumentApi {

    private static final Logger LOG = LoggerFactory.getLogger(DocumentController.class);
    private static final String CONTENT_DISPOSITION = "Content-Disposition";
    private static final String ATTACHMENT_FILENAME = "attachment; filename=\"";
    private static final String ERROR_OCCURRED_WHILE_REQUESTING_DOUBLE_COMPARE = "Error occurred while requesting double compare";
    private static final String ERROR_OCCURRED_WHILE_REQUESTING_EXPORT_TO_E_CONSILIUM = "Error occurred while requesting export to eConsilium";

    private final DocumentApiService documentApiService;
    private GenericDocumentApiService genericDocumentApiService;

    @Autowired
    public DocumentController(DocumentApiService documentApiService,
                              GenericDocumentApiService genericDocumentApiService) {
        this.documentApiService = documentApiService;
        this.genericDocumentApiService = genericDocumentApiService;
    }

    @Override
    public ResponseEntity<Object> uploadDocument(MultipartFile uploadedFile, String checkinComment,
                                                 VersionType versionType, String documentRef) {
        try {
            byte[] fileBytes = uploadedFile.getBytes();
            this.genericDocumentApiService.uploadDocument(documentRef, versionType, checkinComment, fileBytes);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception exception) {
            LOG.error("Error occurred while uploading document REF: " + documentRef, exception);
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> downloadVersion(String documentType, String documentRef,
                                                  DownloadVersionRequest downloadVersionRequest) {
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

    @Override
    public ResponseEntity<Object> exportToEconsilium(String documentType, String documentRef,
                                                     ExportToConsiliumRequest exportToConsiliumRequest) {
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

    @Override
    public ResponseEntity<Object> downloadComparedVersionXMLFile(String documentType, String documentRef,
                                                                 DownloadComparedVersionRequest downloadComparedVersionRequest) {
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

    @Override
    public ResponseEntity<Object> exportComparedVersionAsPDF(String documentType, String documentRef,
                                                             DownloadComparedVersionRequest downloadComparedVersionRequest) {
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

    @Override
    public ResponseEntity<Object> downloadComparedVersionAsDocuwrite(String documentType, String documentRef,
                                                                     DownloadComparedVersionRequest downloadComparedVersionRequest) {
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

    @Override
    public ResponseEntity<Object> doubleCompare(String documentType, String documentRef,
                                                DoubleCompareRequest doubleCompareRequest) {
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

    @Override
    public ResponseEntity<Object> fetchReferenceLabel(String documentRef, List<String> references,
                                                      String currentElementId, boolean capital) {
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

    @Override
    public ResponseEntity<Object> requestElement(String documentRef, String elementId, String elementTagName) {
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

    @Override
    public ResponseEntity<Object> changeBaseVersion(String documentType, String documentRef, String documentId,
                                                    String versionLabel, String versionComment) {
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

    @Override
    public ResponseEntity<Object> getStoredAnnotationsFromId(String documentRef, String proposalRef,
                                                             String legFileId, Boolean removeRevisionPrefix) {
        try {
            documentRef = encodeParam(documentRef);
            proposalRef = encodeParam(proposalRef);
            String annots = documentApiService.getFeedbackAnnotationsFromLeg(legFileId, documentRef, proposalRef, removeRevisionPrefix);
            return ResponseEntity.ok().body(annots);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annotations in LEG file for - " + legFileId, e);
            return new ResponseEntity<>("Unexpected error while trying to get annotations in LEG file ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> getStoredAnnotations(String legFileName, String documentRef, String proposalRef,
                                                       Boolean removeRevisionPrefix) {
        try {
            documentRef = encodeParam(documentRef);
            proposalRef = encodeParam(proposalRef);
            legFileName = encodeParam(legFileName);
            String annots = documentApiService.getFeedbackAnnotationsFromContribution(legFileName, documentRef, proposalRef, removeRevisionPrefix);
            return ResponseEntity.ok().body(annots);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annotations in LEG file for - " + legFileName, e);
            return new ResponseEntity<>("Unexpected error while trying to get annotations in LEG file ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> getStoredAnnotationsFromVersionedRef(String proposalRef, String legFileName,
                                                                       String versionedReference, Boolean removeRevisionPrefix) {
        try {
            proposalRef = encodeParam(proposalRef);
            String annots;
            if (legFileName != null) {
                legFileName = encodeParam(legFileName);
                annots = documentApiService.getFeedbackAnnotationsFromVersionedReference(versionedReference, legFileName, proposalRef, removeRevisionPrefix);
            } else {
                annots = documentApiService.getFeedbackAnnotationsFromVersionedReference(versionedReference, proposalRef, removeRevisionPrefix);
            }
            return ResponseEntity.ok().body(annots);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annotations in LEG file by versioned Reference - " + versionedReference, e);
            return new ResponseEntity<>("Unexpected error while trying to get annotations in LEG file ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> fetchTocAndAncestors(String documentRef, List<String> elementIds) {
        try {
            documentRef = encodeParam(documentRef);
            TocAndAncestorsResponse tocAncestors = this.genericDocumentApiService.fetchTocAncestor(documentRef, elementIds);
            return ResponseEntity.ok().body(tocAncestors);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get toc ancestors {} ", e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get toc ancestors ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> archiveVersion(String documentRef, String version) {
        try {
            documentRef = encodeParam(documentRef);
            version = encodeParam(version);
            this.genericDocumentApiService.archiveVersion(documentRef, version);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred archiving version ", e.getMessage());
            return new ResponseEntity<>("Error occurred archiving version", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> getDocumentVersion(String documentType, String documentRef, String version) {
        try {
            documentType = encodeParam(documentType);
            documentRef = encodeParam(documentRef);
            final LeosCategoryClass documentCategory = LeosCategoryClass.caseInsensitiveValueOf(documentType);
            VersionVO versionVO = genericDocumentApiService.getDocumentByVersion(documentCategory, documentRef, version);
            return new ResponseEntity<>(versionVO, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while getting document version: " + version, e);
            return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> getPreview(String documentType, String documentRef, Boolean forceRegenerate, Boolean statusOnly) {
        try {
            documentType = encodeParam(documentType);
            documentRef = encodeParam(documentRef);
            final LeosCategoryClass documentCategory = LeosCategoryClass.caseInsensitiveValueOf(documentType);
            boolean forceRegen = forceRegenerate != null && forceRegenerate;
            boolean statusOnlyFlag = statusOnly != null && statusOnly;

            DownloadPreviewResponse response = documentApiService.getDocumentPreview(documentCategory, documentRef, forceRegen, statusOnlyFlag);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // GENERATING - return 202
            if (response.getResponseData() == null && response.getMessage() != null) {
                PreviewResponse body = new PreviewResponse("GENERATING").withMessage(response.getMessage());
                if (response.getStaleContent() != null) {
                    body.withPreviewBlob(toBase64(response.getStaleContent()))
                        .withPreviewVersion(response.getPreviewVersion())
                        .withCurrentVersion(response.getCurrentVersion());
                } else if (response.getPreviewVersion() != null) {
                    body.withPreviewVersion(response.getPreviewVersion())
                        .withCurrentVersion(response.getCurrentVersion());
                }
                return new ResponseEntity<>(body, headers, HttpStatus.ACCEPTED);
            }

            // STALE - return 200 with stale info and base64 PDF (blob omitted for statusOnly)
            if (response.isStale()) {
                PreviewResponse body = new PreviewResponse("STALE")
                        .withPreviewVersion(response.getPreviewVersion())
                        .withCurrentVersion(response.getCurrentVersion())
                        .withMessageKey(response.getMessageKey());
                if (response.getResponseData() != null) {
                    body.withPreviewBlob(toBase64(response.getResponseData()));
                }
                return new ResponseEntity<>(body, headers, HttpStatus.OK);
            }

            // READY - return 200 with base64 PDF (or status only)
            PreviewResponse body = new PreviewResponse("READY");
            if (!statusOnlyFlag) {
                body.withPreviewBlob(toBase64(response.getResponseData()));
            }
            return new ResponseEntity<>(body, headers, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while viewing document preview", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String toBase64(byte[] data) {
        return java.util.Base64.getEncoder().encodeToString(data);
    }
}
