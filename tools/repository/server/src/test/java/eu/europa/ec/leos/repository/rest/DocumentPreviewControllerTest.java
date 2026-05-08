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
package eu.europa.ec.leos.repository.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.leos.repository.H2TestBase;
import eu.europa.ec.leos.repository.controllers.DocumentPreviewController;
import eu.europa.ec.leos.repository.entities.DocumentPreviewStatus;
import eu.europa.ec.leos.repository.model.DocumentPreview;
import eu.europa.ec.leos.repository.services.DocumentPreviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(value = DocumentPreviewController.class)
@ActiveProfiles("test")
class DocumentPreviewControllerTest extends H2TestBase {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DocumentPreviewService documentPreviewService;

    @Autowired
    private ObjectMapper mapper;

    private static final String DOC_REF = "bill-ref-001";
    private static final String VERSION_LABEL = "1.0.0";
    private static final String VERSION_ID = "42";

    private DocumentPreview documentPreview;

    @BeforeEach
    void setUp() {
        documentPreview = new DocumentPreview("1", VERSION_ID, DOC_REF, VERSION_LABEL, "pdf".getBytes(), DocumentPreviewStatus.COMPLETED, LocalDateTime.now(), null);
    }

    @WithMockUser
    @Test
    void createInProgress_returns200WithDocumentPreview() throws Exception {
        when(documentPreviewService.createInProgress(VERSION_ID, DOC_REF, VERSION_LABEL)).thenReturn(documentPreview);

        Map<String, String> request = new HashMap<>();
        request.put("documentVersionId", VERSION_ID);
        request.put("documentRef", DOC_REF);
        request.put("versionLabel", VERSION_LABEL);

        mockMvc.perform(post("/document-preview/create-in-progress")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(request))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.documentRef", is(DOC_REF)))
                .andExpect(jsonPath("$.versionLabel", is(VERSION_LABEL)))
                .andDo(print());

        verify(documentPreviewService).createInProgress(VERSION_ID, DOC_REF, VERSION_LABEL);
    }

    @WithMockUser
    @Test
    void markCompleted_returns200() throws Exception {
        byte[] pdfBytes = "pdf-content".getBytes();
        String base64Content = Base64.getEncoder().encodeToString(pdfBytes);

        Map<String, Object> request = new HashMap<>();
        request.put("documentRef", DOC_REF);
        request.put("versionLabel", VERSION_LABEL);
        request.put("content", base64Content);

        mockMvc.perform(put("/document-preview/mark-completed")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(request))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andDo(print());

        byte[] expectedDecoded = Base64.getDecoder().decode(base64Content);
        verify(documentPreviewService).markCompleted(eq(DOC_REF), eq(VERSION_LABEL), eq(expectedDecoded));
    }

    @WithMockUser
    @Test
    void markFailed_returns200() throws Exception {
        Map<String, String> request = new HashMap<>();
        request.put("documentRef", DOC_REF);
        request.put("versionLabel", VERSION_LABEL);

        mockMvc.perform(put("/document-preview/mark-failed")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(request))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andDo(print());

        verify(documentPreviewService).markFailed(DOC_REF, VERSION_LABEL);
    }

    @WithMockUser
    @Test
    void saveDocumentPreview_withBase64Content_returns200() throws Exception {
        byte[] pdfBytes = "pdf-content".getBytes();
        String base64Content = Base64.getEncoder().encodeToString(pdfBytes);
        when(documentPreviewService.saveDocumentPreview(VERSION_ID, DOC_REF, VERSION_LABEL, Base64.getDecoder().decode(base64Content), "COMPLETED"))
                .thenReturn(documentPreview);

        Map<String, Object> request = new HashMap<>();
        request.put("documentVersionId", VERSION_ID);
        request.put("documentRef", DOC_REF);
        request.put("versionLabel", VERSION_LABEL);
        request.put("content", base64Content);
        request.put("status", "COMPLETED");

        mockMvc.perform(post("/document-preview/save")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(request))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.documentRef", is(DOC_REF)))
                .andExpect(jsonPath("$.status", is("COMPLETED")))
                .andDo(print());
    }

    @WithMockUser
    @Test
    void markCompleted_nullContent_callsServiceWithNull() throws Exception {
        Map<String, Object> request = new HashMap<>();
        request.put("documentRef", DOC_REF);
        request.put("versionLabel", VERSION_LABEL);
        // no content key

        mockMvc.perform(put("/document-preview/mark-completed")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(request))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andDo(print());

        verify(documentPreviewService).markCompleted(DOC_REF, VERSION_LABEL, null);
    }

    @WithMockUser
    @Test
    void findDocumentPreviewByDocumentRef_found_returns200() throws Exception {
        when(documentPreviewService.findDocumentPreviewByDocumentRef(DOC_REF)).thenReturn(documentPreview);

        mockMvc.perform(get("/document-preview/find-by-ref/{documentRef}", DOC_REF))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.documentRef", is(DOC_REF)))
                .andExpect(jsonPath("$.versionLabel", is(VERSION_LABEL)))
                .andExpect(jsonPath("$.status", is("COMPLETED")))
                .andDo(print());

        verify(documentPreviewService, never()).findByDocumentRefAndVersionLabel(any(), any());
    }

    @WithMockUser
    @Test
    void findDocumentPreviewByDocumentRef_notFound_returns404() throws Exception {
        when(documentPreviewService.findDocumentPreviewByDocumentRef(DOC_REF)).thenReturn(null);

        mockMvc.perform(get("/document-preview/find-by-ref/{documentRef}", DOC_REF))
                .andExpect(status().isNotFound())
                .andDo(print());
    }

    @WithMockUser
    @Test
    void findByDocumentRefAndVersionLabel_found_returns200() throws Exception {
        when(documentPreviewService.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(documentPreview);

        mockMvc.perform(get("/document-preview/find-by-version/{documentRef}", DOC_REF)
                        .param("versionLabel", VERSION_LABEL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.documentRef", is(DOC_REF)))
                .andExpect(jsonPath("$.versionLabel", is(VERSION_LABEL)))
                .andDo(print());
    }

    @WithMockUser
    @Test
    void findByDocumentRefAndVersionLabel_notFound_returns404() throws Exception {
        when(documentPreviewService.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(null);

        mockMvc.perform(get("/document-preview/find-by-version/{documentRef}", DOC_REF)
                        .param("versionLabel", VERSION_LABEL))
                .andExpect(status().isNotFound())
                .andDo(print());
    }

    @WithMockUser
    @Test
    void deleteDocumentPreview_returns200() throws Exception {
        mockMvc.perform(delete("/document-preview/delete-by-ref/{documentRef}", DOC_REF)
                        .param("versionLabel", VERSION_LABEL)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andDo(print());

        verify(documentPreviewService).deleteDocumentPreview(DOC_REF, VERSION_LABEL);
    }
}
