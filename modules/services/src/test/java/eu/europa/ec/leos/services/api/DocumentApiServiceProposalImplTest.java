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
package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.repository.LeosCategoryClass;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.DocumentPreview;
import eu.europa.ec.leos.domain.repository.document.DocumentPreviewStatus;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.BillMetadata;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.AnnexService;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.PreviewGenerationService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.TransformationService;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.response.DownloadPreviewResponse;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.label.ReferenceLabelService;
import eu.europa.ec.leos.services.notification.NotificationService;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import eu.europa.ec.leos.services.store.ExportPackageService;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.store.WorkspaceService;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.security.SecurityContext;
import io.atlassian.fugue.Option;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.Instant;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class DocumentApiServiceProposalImplTest {

    private static final String DOC_REF = "bill-ref-001";
    private static final String VERSION_LABEL = "1.0.0";
    private static final String VERSION_ID = "42";

    @Mock private DocumentContentService documentContentService;
    @Mock private PackageService packageService;
    @Mock private ProposalService proposalService;
    @Mock private ExportService exportService;
    @Mock private LeosRepository leosRepository;
    @Mock private ExportPackageService exportPackageService;
    @Mock private NotificationService notificationService;
    @Mock private SecurityContext securityContext;
    @Mock private MessageHelper messageHelper;
    @Mock private ComparisonDelegateAPI comparisonDelegate;
    @Mock private LegService legService;
    @Mock private ReferenceLabelService referenceLabelService;
    @Mock private WorkspaceService workspaceService;
    @Mock private ElementProcessor elementProcessor;
    @Mock private TransformationService transformationService;
    @Mock private RepositoryPropertiesMapper repositoryPropertiesMapper;
    @Mock private DocumentViewService<XmlDocument> documentViewService;
    @Mock private BillService billService;
    @Mock private AnnexService annexService;
    @Mock private PreviewGenerationService previewGenerationService;
    @Mock private User user;

    private DocumentApiServiceProposalImpl service;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new DocumentApiServiceProposalImpl(
                documentContentService, packageService, proposalService, exportService, leosRepository,
                exportPackageService, notificationService, securityContext, messageHelper, comparisonDelegate,
                legService, referenceLabelService, workspaceService, elementProcessor, transformationService,
                repositoryPropertiesMapper, documentViewService, billService, annexService, previewGenerationService);
        when(securityContext.getUser()).thenReturn(user);
    }

    private Bill mockBill() {
        BillMetadata metadata = new BillMetadata("", "REGULATION", "", "SJ-023", "EN", "BL-023", DOC_REF, "", VERSION_LABEL, false, false, false, false);
        return new Bill(VERSION_ID, "bill", "login", Instant.now(), "login", Instant.now(),
                "", "", VERSION_LABEL, "", eu.europa.ec.leos.domain.repository.common.VersionType.MAJOR, true,
                "title", Collections.emptyList(), Collections.emptyList(), "", "", "",
                Option.none(), Option.some(metadata), false, false);
    }

    private void mockDocumentContent(Bill bill) {
        when(documentContentService.getDocumentByRef(eq(DOC_REF), any(LeosCategoryClass.class))).thenReturn(bill);
        when(documentContentService.getOriginalDocument(bill)).thenReturn(bill);
    }

    @Test
    public void getDocumentPreviewPdf_completed_returnsBytes() {
        Bill bill = mockBill();
        mockDocumentContent(bill);
        byte[] pdfBytes = "pdf-content".getBytes();
        DocumentPreview completedPdf = new DocumentPreview("1", VERSION_ID, DOC_REF, VERSION_LABEL, pdfBytes, DocumentPreviewStatus.COMPLETED, Instant.now(), null);
        when(leosRepository.findDocumentPreviewByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(completedPdf);

        DownloadPreviewResponse response = service.getDocumentPreview(LeosCategoryClass.BILL, DOC_REF, false, false);

        assertNotNull(response.getResponseData());
        assertNull(response.getMessage());
        verify(previewGenerationService, never()).generatePreviewAsync(any(), any());
    }

    @Test
    public void getDocumentPreview_inProgress_returnsInProgressMessage() {
        Bill bill = mockBill();
        mockDocumentContent(bill);
        DocumentPreview inProgressPdf = new DocumentPreview("1", VERSION_ID, DOC_REF, VERSION_LABEL, null, DocumentPreviewStatus.IN_PROGRESS, Instant.now(), null);
        when(leosRepository.findDocumentPreviewByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(inProgressPdf);

        DownloadPreviewResponse response = service.getDocumentPreview(LeosCategoryClass.BILL, DOC_REF, false, false);

        assertNull(response.getResponseData());
        assertEquals("page.editor.preview.generating.in.progress", response.getMessage());
        verify(previewGenerationService, never()).generatePreviewAsync(any(), any());
    }

    @Test
    public void getDocumentPreview_failedNoStale_deletesAndRetries() {
        Bill bill = mockBill();
        mockDocumentContent(bill);
        DocumentPreview failedPdf = new DocumentPreview("1", VERSION_ID, DOC_REF, VERSION_LABEL, null, DocumentPreviewStatus.FAILED, Instant.now(), null);
        when(leosRepository.findDocumentPreviewByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(failedPdf);
        when(leosRepository.findDocumentPreviewByDocumentRef(DOC_REF)).thenReturn(null);

        DownloadPreviewResponse response = service.getDocumentPreview(LeosCategoryClass.BILL, DOC_REF, false, false);

        assertNull(response.getResponseData());
        assertEquals("page.editor.preview.generating.after.failure", response.getMessage());
        verify(leosRepository).deleteDocumentPreview(DOC_REF, VERSION_LABEL);
        verify(leosRepository).createDocumentPreviewInProgress(anyString(), eq(DOC_REF), eq(VERSION_LABEL));
        verify(previewGenerationService).generatePreviewAsync(any(ExportOptions.class), eq(user));
    }

    @Test
    public void getDocumentPreview_failedWithStale_returnsStaleResponse() {
        Bill bill = mockBill();
        mockDocumentContent(bill);
        DocumentPreview failedPdf = new DocumentPreview("1", VERSION_ID, DOC_REF, VERSION_LABEL, null, DocumentPreviewStatus.FAILED, Instant.now(), null);
        byte[] staleBytes = "stale-pdf".getBytes();
        DocumentPreview stalePdf = new DocumentPreview("2", VERSION_ID, DOC_REF, "0.9.0", staleBytes, DocumentPreviewStatus.COMPLETED, Instant.now(), null);
        when(leosRepository.findDocumentPreviewByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(failedPdf);
        when(leosRepository.findDocumentPreviewByDocumentRef(DOC_REF)).thenReturn(stalePdf);

        DownloadPreviewResponse response = service.getDocumentPreview(LeosCategoryClass.BILL, DOC_REF, false, false);

        assertNotNull(response.getResponseData());
        assertTrue(response.isStale());
        assertEquals("0.9.0", response.getPreviewVersion());
        assertEquals(VERSION_LABEL, response.getCurrentVersion());
        verify(leosRepository, never()).deleteDocumentPreview(any(), any());
        verify(previewGenerationService, never()).generatePreviewAsync(any(), any());
    }

    @Test
    public void getDocumentPreview_failedStaleIsSameVersion_deletesAndRetries() {
        Bill bill = mockBill();
        mockDocumentContent(bill);
        DocumentPreview failedPdf = new DocumentPreview("1", VERSION_ID, DOC_REF, VERSION_LABEL, null, DocumentPreviewStatus.FAILED, Instant.now(), null);
        // stale has same version label — should NOT be treated as stale, falls through to delete+retry
        DocumentPreview samePdf = new DocumentPreview("1", VERSION_ID, DOC_REF, VERSION_LABEL, null, DocumentPreviewStatus.FAILED, Instant.now(), null);
        when(leosRepository.findDocumentPreviewByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(failedPdf);
        when(leosRepository.findDocumentPreviewByDocumentRef(DOC_REF)).thenReturn(samePdf);

        DownloadPreviewResponse response = service.getDocumentPreview(LeosCategoryClass.BILL, DOC_REF, false, false);

        assertNull(response.getResponseData());
        assertEquals("page.editor.preview.generating.after.failure", response.getMessage());
        verify(leosRepository).deleteDocumentPreview(DOC_REF, VERSION_LABEL);
        verify(previewGenerationService).generatePreviewAsync(any(ExportOptions.class), eq(user));
    }

    @Test
    public void getDocumentPreviewPdf_noExists_triggersGenerationAndReturnsGeneratingMessage() {
        Bill bill = mockBill();
        mockDocumentContent(bill);
        when(leosRepository.findDocumentPreviewByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(null);
        when(leosRepository.findDocumentPreviewByDocumentRef(DOC_REF)).thenReturn(null);

        DownloadPreviewResponse response = service.getDocumentPreview(LeosCategoryClass.BILL, DOC_REF, false, false);

        assertNull(response.getResponseData());
        assertEquals("page.editor.preview.generating", response.getMessage());
        verify(leosRepository).createDocumentPreviewInProgress(anyString(), eq(DOC_REF), eq(VERSION_LABEL));
        verify(previewGenerationService).generatePreviewAsync(any(ExportOptions.class), eq(user));
    }

    @Test
    public void getDocumentPreviewPdf_noExistsWithStale_returnsStaleResponse() {
        Bill bill = mockBill();
        mockDocumentContent(bill);
        byte[] staleBytes = "stale-pdf".getBytes();
        DocumentPreview stalePdf = new DocumentPreview("2", VERSION_ID, DOC_REF, "0.9.0", staleBytes, DocumentPreviewStatus.COMPLETED, Instant.now(), null);
        when(leosRepository.findDocumentPreviewByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(null);
        when(leosRepository.findDocumentPreviewByDocumentRef(DOC_REF)).thenReturn(stalePdf);

        DownloadPreviewResponse response = service.getDocumentPreview(LeosCategoryClass.BILL, DOC_REF, false, false);

        assertNotNull(response.getResponseData());
        assertTrue(response.isStale());
        assertEquals("0.9.0", response.getPreviewVersion());
        verify(previewGenerationService, never()).generatePreviewAsync(any(), any());
    }

    @Test
    public void getDocumentPreview_forceRegenerate_skipsExistingAndTriggersGeneration() {
        Bill bill = mockBill();
        mockDocumentContent(bill);
        // forceRegenerate=true skips the currentVersionPdf check entirely — mock returns null to reflect that
        when(leosRepository.findDocumentPreviewByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL)).thenReturn(null);

        DownloadPreviewResponse response = service.getDocumentPreview(LeosCategoryClass.BILL, DOC_REF, true, false);

        assertNull(response.getResponseData());
        assertEquals("page.editor.preview.generating.latest", response.getMessage());
        verify(leosRepository).createDocumentPreviewInProgress(anyString(), eq(DOC_REF), eq(VERSION_LABEL));
        verify(previewGenerationService).generatePreviewAsync(any(ExportOptions.class), eq(user));
    }
}
