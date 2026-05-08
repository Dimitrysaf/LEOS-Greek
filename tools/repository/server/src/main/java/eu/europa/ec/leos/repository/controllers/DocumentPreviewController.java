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
package eu.europa.ec.leos.repository.controllers;

import eu.europa.ec.leos.repository.model.DocumentPreview;
import eu.europa.ec.leos.repository.services.DocumentPreviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/document-preview")
public class DocumentPreviewController {

    @Autowired
    private DocumentPreviewService documentPreviewService;

    @PostMapping("/save")
    public ResponseEntity<DocumentPreview> saveDocumentPreview(@RequestBody Map<String, Object> request) {
        String documentVersionId = (String) request.get("documentVersionId");
        String documentRef = (String) request.get("documentRef");
        String versionLabel = (String) request.get("versionLabel");
        Object contentObj = request.get("content");
        byte[] content = null;
        if (contentObj instanceof String) {
            content = java.util.Base64.getDecoder().decode((String) contentObj);
        } else if (contentObj instanceof byte[]) {
            content = (byte[]) contentObj;
        }
        String status = (String) request.get("status");
        DocumentPreview documentPreview = documentPreviewService.saveDocumentPreview(documentVersionId, documentRef, versionLabel, content, status);
        return ResponseEntity.ok(documentPreview);
    }

    @PostMapping("/create-in-progress")
    public ResponseEntity<DocumentPreview> createInProgress(@RequestBody Map<String, String> request) {
        DocumentPreview documentPreview = documentPreviewService.createInProgress(
                request.get("documentVersionId"),
                request.get("documentRef"),
                request.get("versionLabel"));
        return ResponseEntity.ok(documentPreview);
    }

    @PutMapping("/mark-completed")
    public ResponseEntity<Void> markCompleted(@RequestBody Map<String, Object> request) {
        String documentRef = (String) request.get("documentRef");
        String versionLabel = (String) request.get("versionLabel");
        Object contentObj = request.get("content");
        byte[] content = null;
        if (contentObj instanceof String) {
            content = java.util.Base64.getDecoder().decode((String) contentObj);
        }
        documentPreviewService.markCompleted(documentRef, versionLabel, content);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/mark-failed")
    public ResponseEntity<Void> markFailed(@RequestBody Map<String, String> request) {
        documentPreviewService.markFailed(request.get("documentRef"), request.get("versionLabel"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/find-by-ref/{documentRef}")
    public ResponseEntity<DocumentPreview> findDocumentPreviewByDocumentRef(@PathVariable String documentRef) {
        DocumentPreview documentPreview = documentPreviewService.findDocumentPreviewByDocumentRef(documentRef);
        if (documentPreview == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(documentPreview);
    }

    @DeleteMapping(value = "/delete-by-ref/{documentRef}", params = "versionLabel")
    public ResponseEntity<Void> deleteDocumentPreview(
            @PathVariable String documentRef,
            @RequestParam String versionLabel) {
        documentPreviewService.deleteDocumentPreview(documentRef, versionLabel);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/find-by-version/{documentRef}", params = "versionLabel")
    public ResponseEntity<DocumentPreview> findByDocumentRefAndVersionLabel(
            @PathVariable String documentRef,
            @RequestParam String versionLabel) {
        DocumentPreview documentPreview = documentPreviewService.findByDocumentRefAndVersionLabel(documentRef, versionLabel);
        if (documentPreview == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(documentPreview);
    }
}
