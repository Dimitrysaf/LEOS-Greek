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
package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.metadata.BillMetadata;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.export.ExportVersions;
import eu.europa.ec.leos.services.export.ZipPackageUtil;
import io.atlassian.fugue.Option;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.Instant;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class PreviewGenerationServiceTest {

    private static final String DOC_REF = "bill-ref-001";
    private static final String VERSION_LABEL = "1.0.0";
    private static final String VERSION_ID = "42";
    private static final String PREVIEW_TOPIC = "/topic/preview/" + DOC_REF;

    @Mock private LeosRepository leosRepository;
    @Mock private ExportService exportService;
    @Mock private SimpMessagingTemplate simpMessagingTemplate;
    @Mock private User user;

    private PreviewGenerationService previewGenerationService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        previewGenerationService = new PreviewGenerationService(leosRepository, exportService, simpMessagingTemplate);
    }

    private ExportOptions buildExportOptions() {
        BillMetadata metadata = new BillMetadata("", "REGULATION", "", "SJ-023", "EN", "BL-023", DOC_REF, "", VERSION_LABEL, false, false, false, false);
        Bill bill = new Bill(VERSION_ID, "bill", "login", Instant.now(), "login", Instant.now(),
                "", "", VERSION_LABEL, "", VersionType.MAJOR, true,
                "title", Collections.emptyList(), Collections.emptyList(), "", "", "",
                Option.none(), Option.some(metadata), false, false);
        ExportOptions exportOptions = new ExportLW(ExportOptions.Output.PDF, (Class) Bill.class, false);
        exportOptions.setExportVersions(new ExportVersions<>(null, bill));
        return exportOptions;
    }

    private ExportOptions buildExportOptionsWithNullDocument() {
        ExportOptions exportOptions = new ExportLW(ExportOptions.Output.PDF, (Class) Bill.class, false);
        exportOptions.setExportVersions(new ExportVersions<>(null, null));
        return exportOptions;
    }

    @Test
    public void generatePreviewAsync_success_marksCompletedAndSendsReadyMessage() throws Exception {
        byte[] zipBytes = "zip-content".getBytes();
        byte[] pdfBytes = "pdf-content".getBytes();
        ExportOptions exportOptions = buildExportOptions();
        when(exportService.createDocumentPackage(exportOptions, user)).thenReturn(zipBytes);

        try (MockedStatic<ZipPackageUtil> zipUtil = mockStatic(ZipPackageUtil.class)) {
            zipUtil.when(() -> ZipPackageUtil.extractPdfFromNestedZip(zipBytes)).thenReturn(pdfBytes);

            previewGenerationService.generatePreviewAsync(exportOptions, user);

            verify(leosRepository).markDocumentPreviewCompleted(DOC_REF, VERSION_LABEL, pdfBytes);
            verify(simpMessagingTemplate).convertAndSend(PREVIEW_TOPIC, String.format("{\"status\":\"%s\",\"versionLabel\":\"%s\"}", PreviewWebSocketStatus.READY, VERSION_LABEL));
            verify(leosRepository, never()).markDocumentPreviewFailed(anyString(), anyString());
        }
    }

    @Test
    public void generatePreviewAsync_exportServiceThrows_marksFailedAndSendsFailedMessage() throws Exception {
        ExportOptions exportOptions = buildExportOptions();
        when(exportService.createDocumentPackage(exportOptions, user)).thenThrow(new RuntimeException("export failed"));

        previewGenerationService.generatePreviewAsync(exportOptions, user);

        verify(leosRepository).markDocumentPreviewFailed(DOC_REF, VERSION_LABEL);
        verify(simpMessagingTemplate).convertAndSend(PREVIEW_TOPIC, String.format("{\"status\":\"%s\",\"versionLabel\":\"%s\"}", PreviewWebSocketStatus.FAILED, VERSION_LABEL));
        verify(leosRepository, never()).markDocumentPreviewCompleted(anyString(), anyString(), any());
    }

    @Test
    public void generatePreviewAsync_zipExtractionFails_marksFailedAndSendsFailedMessage() throws Exception {
        byte[] zipBytes = "zip-content".getBytes();
        ExportOptions exportOptions = buildExportOptions();
        when(exportService.createDocumentPackage(exportOptions, user)).thenReturn(zipBytes);

        try (MockedStatic<ZipPackageUtil> zipUtil = mockStatic(ZipPackageUtil.class)) {
            zipUtil.when(() -> ZipPackageUtil.extractPdfFromNestedZip(zipBytes))
                    .thenThrow(new java.io.IOException("PDF not found in zip"));

            previewGenerationService.generatePreviewAsync(exportOptions, user);

            verify(leosRepository).markDocumentPreviewFailed(DOC_REF, VERSION_LABEL);
            verify(simpMessagingTemplate).convertAndSend(PREVIEW_TOPIC, String.format("{\"status\":\"%s\",\"versionLabel\":\"%s\"}", PreviewWebSocketStatus.FAILED, VERSION_LABEL));
            verify(leosRepository, never()).markDocumentPreviewCompleted(anyString(), anyString(), any());
        }
    }

    @Test
    public void generatePreviewAsync_nullCurrentDocument_doesNothing() throws Exception {
        ExportOptions exportOptions = buildExportOptionsWithNullDocument();

        previewGenerationService.generatePreviewAsync(exportOptions, user);

        verify(exportService, never()).createDocumentPackage(any(ExportOptions.class), any());
        verify(leosRepository, never()).markDocumentPreviewCompleted(anyString(), anyString(), any());
        verify(leosRepository, never()).markDocumentPreviewFailed(anyString(), anyString());
        verify(simpMessagingTemplate, never()).convertAndSend(anyString(), anyString());
    }
}
