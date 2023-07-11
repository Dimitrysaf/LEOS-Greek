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
import eu.europa.ec.leos.domain.repository.LeosCategoryClass;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.services.api.AnnotateApiService;
import eu.europa.ec.leos.services.dto.request.AnnotateMergeSuggestionRequest;
import eu.europa.ec.leos.services.dto.request.AnnotateMergeSuggestionRequests;
import eu.europa.ec.leos.services.dto.response.AnnotateMergeSuggestionsResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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

    @GetMapping(value = "/requestUserPermissions/{documentType}/{documentRef}")
    @ResponseBody
    public ResponseEntity<Object> requestUserPermissions(@PathVariable("documentType") String documentType, @PathVariable("documentRef") String documentRef) {
        try {
            final LeosCategoryClass documentCategory = LeosCategoryClass.valueOf(documentType);

            List<LeosPermission> documentPermissions = annotateApiService.requestUserPermissions(documentRef, documentCategory);
            return new ResponseEntity<>(documentPermissions, HttpStatus.OK);
        } catch (Exception e) {
            String msg = "Error occurred while requesting Annotation User Permission";
            LOG.error(msg, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/requestSecurityToken")
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

    @GetMapping(value = "/requestDocumentMetadata/{documentType}/{documentRef}")
    @ResponseBody
    public ResponseEntity<Object> requestDocumentMetadata(@PathVariable("documentType") String documentType, @PathVariable("documentRef") String documentRef) {
        try {
            final LeosCategoryClass documentCategory = LeosCategoryClass.valueOf(documentType);

            AnnotateMetadata documentMetadata = annotateApiService.requestDocumentMetadata(documentRef, documentCategory);
            return new ResponseEntity<>(documentMetadata, HttpStatus.OK);
        } catch (Exception e) {
            String msg = "Error occurred while requesting Annotation DocumentMetadata ";
            LOG.error(msg, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/requestSearchMetadata")
    @ResponseBody
    public ResponseEntity<Object> requestSearchMetadata() {
        try {
            List<AnnotateMetadata> searchMetadata = annotateApiService.requestSearchMetadata();
            return new ResponseEntity<>(searchMetadata, HttpStatus.OK);
        } catch (Exception e) {
            String msg = "Error occurred while requesting Annotation DocumentMetadata ";
            LOG.error(msg, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/requestMergeSuggestion/{documentType}/{documentRef}")
    @ResponseBody
    public ResponseEntity<Object> requestMergeSuggestion(@PathVariable("documentType") String documentType, @PathVariable("documentRef") String documentRef,
                                                         @RequestBody AnnotateMergeSuggestionRequest mergeSuggestionRequest) {
        try {
            final LeosCategoryClass documentCategory = LeosCategoryClass.valueOf(documentType);
            final String origText = mergeSuggestionRequest.getOrigText();
            final String newText = mergeSuggestionRequest.getNewText();
            final String elementId = mergeSuggestionRequest.getElementId();
            final int startOffset = mergeSuggestionRequest.getStartOffset();
            final int endOffset = mergeSuggestionRequest.getEndOffset();
            if (origText == null || newText == null || elementId == null || startOffset < 0 || endOffset < 0 || startOffset == endOffset) {
                throw new Exception("Invalid request parameters");
            }
            annotateApiService.mergeSuggestion(documentCategory, documentRef, origText, newText, elementId, startOffset, endOffset);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            String msg = "Error occurred while requesting Annotation Merge Suggestion";
            LOG.error(msg, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/requestMergeSuggestions/{documentType}/{documentRef}")
    @ResponseBody
    public ResponseEntity<Object> requestMergeSuggestions(@PathVariable("documentType") String documentType, @PathVariable("documentRef") String documentRef,
                                                          @RequestBody AnnotateMergeSuggestionRequests mergeSuggestionRequests) {
        final LeosCategoryClass documentCategory = LeosCategoryClass.valueOf(documentType);
        List<AnnotateMergeSuggestionsResponse> results = new ArrayList<>();
        try {
            for (AnnotateMergeSuggestionRequest suggestionRequest : mergeSuggestionRequests.getMergeSuggestionRequests()) {
                this.mergeSuggestion(documentRef, documentCategory, results, suggestionRequest);
            }
            return new ResponseEntity<>(results, HttpStatus.OK);
        } catch (Exception e) {
            String msg = "Error occurred while requesting Annotation Merge Suggestion";
            LOG.error(msg, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void mergeSuggestion(String documentRef, LeosCategoryClass documentCategory, List<AnnotateMergeSuggestionsResponse> results, AnnotateMergeSuggestionRequest suggestionRequest) throws Exception {
        try {
            final String origText = suggestionRequest.getOrigText();
            final String newText = suggestionRequest.getNewText();
            final String elementId = suggestionRequest.getElementId();
            final int startOffset = suggestionRequest.getStartOffset();
            final int endOffset = suggestionRequest.getEndOffset();
            if (origText == null || newText == null || elementId == null || startOffset < 0 || endOffset < 0 || startOffset == endOffset) {
                throw new Exception("Invalid request parameters");
            }
            annotateApiService.mergeSuggestion(documentCategory, documentRef, origText, newText, elementId, startOffset, endOffset);
            results.add(new AnnotateMergeSuggestionsResponse(origText, newText, elementId, startOffset, endOffset, "SUCCESS"));
        } catch (Exception e) {
            LOG.error("Error in for suggestion: {}", suggestionRequest);
            throw e;
        }
    }

}
