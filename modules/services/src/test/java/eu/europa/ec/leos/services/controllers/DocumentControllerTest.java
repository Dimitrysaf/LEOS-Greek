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

import eu.europa.ec.leos.services.api.DocumentApiService;
import eu.europa.ec.leos.services.api.GenericDocumentApiService;
import eu.europa.ec.leos.services.dto.response.DownloadPreviewResponse;
import eu.europa.ec.leos.services.dto.response.PreviewResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class DocumentControllerTest {

    private static final String DOCUMENT_TYPE = "BILL";
    private static final String DOCUMENT_REF = "bill-ref-001";

    @Mock
    private DocumentApiService documentApiService;
    @Mock
    private GenericDocumentApiService genericDocumentApiService;

    @InjectMocks
    private DocumentController documentController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void getDocumentPreview_ready_returns200WithBase64Pdf() {
        byte[] pdfBytes = "pdf-content".getBytes();
        when(documentApiService.getDocumentPreview(any(), anyString(), anyBoolean(), anyBoolean()))
                .thenReturn(new DownloadPreviewResponse(pdfBytes));

        ResponseEntity<Object> response = documentController.getPreview(DOCUMENT_TYPE, DOCUMENT_REF, false, false);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(MediaType.APPLICATION_JSON, response.getHeaders().getContentType());
        PreviewResponse body = (PreviewResponse) response.getBody();
        assertNotNull(body);
        assertEquals("READY", body.getStatus());
        assertEquals(Base64.getEncoder().encodeToString(pdfBytes), body.getPreviewBlob());
    }

    @Test
    public void getDocumentPreview_generating_returns202WithMessageKey() {
        when(documentApiService.getDocumentPreview(any(), anyString(), anyBoolean(), anyBoolean()))
                .thenReturn(new DownloadPreviewResponse("page.editor.preview.generating"));

        ResponseEntity<Object> response = documentController.getPreview(DOCUMENT_TYPE, DOCUMENT_REF, false, false);

        assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());
        assertEquals(MediaType.APPLICATION_JSON, response.getHeaders().getContentType());
        PreviewResponse body = (PreviewResponse) response.getBody();
        assertNotNull(body);
        assertEquals("GENERATING", body.getStatus());
        assertEquals("page.editor.preview.generating", body.getMessage());
    }

    @Test
    public void getDocumentPreview_stale_returns200WithAllStaleFields() {
        byte[] stalePdfBytes = "stale-pdf".getBytes();
        when(documentApiService.getDocumentPreview(any(), anyString(), anyBoolean(), anyBoolean()))
                .thenReturn(new DownloadPreviewResponse(stalePdfBytes, true, "1.0.0", "1.1.0", "page.editor.preview.outdated"));

        ResponseEntity<Object> response = documentController.getPreview(DOCUMENT_TYPE, DOCUMENT_REF, false, false);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(MediaType.APPLICATION_JSON, response.getHeaders().getContentType());
        PreviewResponse body = (PreviewResponse) response.getBody();
        assertNotNull(body);
        assertEquals("STALE", body.getStatus());
        assertEquals("1.0.0", body.getPreviewVersion());
        assertEquals("1.1.0", body.getCurrentVersion());
        assertEquals("page.editor.preview.outdated", body.getMessageKey());
        assertEquals(Base64.getEncoder().encodeToString(stalePdfBytes), body.getPreviewBlob());
    }

    @Test
    public void getDocumentPreview_forceRegenerate_returns202WithLatestMessage() {
        when(documentApiService.getDocumentPreview(any(), anyString(), anyBoolean(), anyBoolean()))
                .thenReturn(new DownloadPreviewResponse("page.editor.preview.generating.latest"));

        ResponseEntity<Object> response = documentController.getPreview(DOCUMENT_TYPE, DOCUMENT_REF, true, false);

        assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());
        PreviewResponse body = (PreviewResponse) response.getBody();
        assertNotNull(body);
        assertEquals("GENERATING", body.getStatus());
        assertEquals("page.editor.preview.generating.latest", body.getMessage());
        // verify forceRegenerate=true is passed through to the service
        verify(documentApiService).getDocumentPreview(any(), eq(DOCUMENT_REF), eq(true), eq(false));
    }

    @Test
    public void getDocumentPreview_statusOnly_returns200WithoutBlob() {
        byte[] pdfBytes = "pdf-content".getBytes();
        when(documentApiService.getDocumentPreview(any(), anyString(), anyBoolean(), anyBoolean()))
                .thenReturn(new DownloadPreviewResponse(pdfBytes));

        ResponseEntity<Object> response = documentController.getPreview(DOCUMENT_TYPE, DOCUMENT_REF, false, true);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        PreviewResponse body = (PreviewResponse) response.getBody();
        assertNotNull(body);
        assertEquals("READY", body.getStatus());
        assertNull(body.getPreviewBlob());
    }

    @Test
    public void getDocumentPreview_forceRegenerateNull_treatedAsFalse() {
        when(documentApiService.getDocumentPreview(any(), anyString(), anyBoolean(), anyBoolean()))
                .thenReturn(new DownloadPreviewResponse("page.editor.preview.generating"));

        documentController.getPreview(DOCUMENT_TYPE, DOCUMENT_REF, null, null);

        // null forceRegenerate should be treated as false
        verify(documentApiService).getDocumentPreview(any(), eq(DOCUMENT_REF), eq(false), eq(false));
    }

    @Test
    public void getDocumentPreview_exception_returns500WithMessage() {
        when(documentApiService.getDocumentPreview(any(), anyString(), anyBoolean(), anyBoolean()))
                .thenThrow(new RuntimeException("unexpected error"));

        ResponseEntity<Object> response = documentController.getPreview(DOCUMENT_TYPE, DOCUMENT_REF, false, false);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("unexpected error", response.getBody());
    }
}
