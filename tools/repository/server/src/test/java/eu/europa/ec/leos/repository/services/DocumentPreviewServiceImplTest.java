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
package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.entities.DocumentPreview;
import eu.europa.ec.leos.repository.entities.DocumentPreviewStatus;
import eu.europa.ec.leos.repository.repositories.DocumentPreviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class DocumentPreviewServiceImplTest {

    private static final String DOC_REF = "bill-ref-001";
    private static final String VERSION_LABEL = "1.0.0";
    private static final String VERSION_ID = "42";

    @Mock
    private DocumentPreviewRepository documentPreviewRepository;

    @InjectMocks
    private DocumentPreviewServiceImpl documentPreviewService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private DocumentPreview buildEntity(DocumentPreviewStatus status, byte[] content) {
        DocumentPreview entity = new DocumentPreview(new BigDecimal(VERSION_ID), DOC_REF, VERSION_LABEL, content, status);
        entity.setId(new BigDecimal(1));
        return entity;
    }

    @Test
    public void createInProgress_newRecord_savesWithInProgressStatus() {
        when(documentPreviewRepository.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(Optional.empty());
        DocumentPreview saved = buildEntity(DocumentPreviewStatus.IN_PROGRESS, null);
        when(documentPreviewRepository.save(any())).thenReturn(saved);

        eu.europa.ec.leos.repository.model.DocumentPreview result = documentPreviewService.createInProgress(VERSION_ID, DOC_REF, VERSION_LABEL);

        assertNotNull(result);
        assertEquals(DocumentPreviewStatus.IN_PROGRESS, result.getStatus());
        assertNull(result.getContent());
        verify(documentPreviewRepository).save(any());
    }

    @Test
    public void createInProgress_existingRecord_updatesStatusToInProgress() {
        DocumentPreview existing = buildEntity(DocumentPreviewStatus.FAILED, null);
        when(documentPreviewRepository.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(Optional.of(existing));
        when(documentPreviewRepository.save(any())).thenReturn(existing);

        documentPreviewService.createInProgress(VERSION_ID, DOC_REF, VERSION_LABEL);

        assertEquals(DocumentPreviewStatus.IN_PROGRESS, existing.getStatus());
        assertNull(existing.getContent());
        verify(documentPreviewRepository).save(existing);
    }

    @Test
    public void markCompleted_existingRecord_setsCompletedAndDeletesOtherVersions() {
        byte[] pdfBytes = "pdf".getBytes();
        DocumentPreview existing = buildEntity(DocumentPreviewStatus.IN_PROGRESS, null);
        when(documentPreviewRepository.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(Optional.of(existing));
        when(documentPreviewRepository.save(any())).thenReturn(existing);

        documentPreviewService.markCompleted(DOC_REF, VERSION_LABEL, pdfBytes);

        assertEquals(DocumentPreviewStatus.COMPLETED, existing.getStatus());
        assertEquals(pdfBytes, existing.getContent());
        verify(documentPreviewRepository).save(existing);
        verify(documentPreviewRepository).deleteOtherVersions(DOC_REF, existing.getId());
    }

    @Test
    public void markCompleted_noRecord_doesNothing() {
        when(documentPreviewRepository.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(Optional.empty());

        documentPreviewService.markCompleted(DOC_REF, VERSION_LABEL, "pdf".getBytes());

        verify(documentPreviewRepository, org.mockito.Mockito.never()).save(any());
    }

    @Test
    public void markFailed_existingRecord_setsFailedStatusAndNullContent() {
        DocumentPreview existing = buildEntity(DocumentPreviewStatus.IN_PROGRESS, null);
        when(documentPreviewRepository.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(Optional.of(existing));
        when(documentPreviewRepository.save(any())).thenReturn(existing);

        documentPreviewService.markFailed(DOC_REF, VERSION_LABEL);

        assertEquals(DocumentPreviewStatus.FAILED, existing.getStatus());
        assertNull(existing.getContent());
        verify(documentPreviewRepository).save(existing);
    }

    @Test
    public void findByDocumentRefAndVersionLabel_found_returnsModel() {
        DocumentPreview entity = buildEntity(DocumentPreviewStatus.COMPLETED, "pdf".getBytes());
        when(documentPreviewRepository.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(Optional.of(entity));

        eu.europa.ec.leos.repository.model.DocumentPreview result = documentPreviewService.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL);

        assertNotNull(result);
        assertEquals(DOC_REF, result.getDocumentRef());
        assertEquals(VERSION_LABEL, result.getVersionLabel());
        assertEquals(DocumentPreviewStatus.COMPLETED, result.getStatus());
    }

    @Test
    public void findByDocumentRefAndVersionLabel_notFound_returnsNull() {
        when(documentPreviewRepository.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(Optional.empty());

        eu.europa.ec.leos.repository.model.DocumentPreview result = documentPreviewService.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL);

        assertNull(result);
    }

    @Test
    public void findDocumentPreviewByDocumentRef_completedExists_returnsIt() {
        DocumentPreview completed = buildEntity(DocumentPreviewStatus.COMPLETED, "pdf".getBytes());
        DocumentPreview inProgress = buildEntity(DocumentPreviewStatus.IN_PROGRESS, null);
        when(documentPreviewRepository.findByDocumentRef(DOC_REF)).thenReturn(Arrays.asList(inProgress, completed));

        eu.europa.ec.leos.repository.model.DocumentPreview result = documentPreviewService.findDocumentPreviewByDocumentRef(DOC_REF);

        assertNotNull(result);
        assertEquals(DocumentPreviewStatus.COMPLETED, result.getStatus());
    }

    @Test
    public void findDocumentPreviewByDocumentRef_noCompleted_returnsNull() {
        DocumentPreview inProgress = buildEntity(DocumentPreviewStatus.IN_PROGRESS, null);
        when(documentPreviewRepository.findByDocumentRef(DOC_REF)).thenReturn(Collections.singletonList(inProgress));

        eu.europa.ec.leos.repository.model.DocumentPreview result = documentPreviewService.findDocumentPreviewByDocumentRef(DOC_REF);

        assertNull(result);
    }

    @Test
    public void deleteDocumentPreview_existingRecord_deletesIt() {
        DocumentPreview entity = buildEntity(DocumentPreviewStatus.FAILED, null);
        when(documentPreviewRepository.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(Optional.of(entity));

        documentPreviewService.deleteDocumentPreview(DOC_REF, VERSION_LABEL);

        verify(documentPreviewRepository).delete(entity);
    }
}
