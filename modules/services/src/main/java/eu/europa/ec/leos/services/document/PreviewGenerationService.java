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

import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.export.ZipPackageUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class PreviewGenerationService {
    private static final Logger LOG = LoggerFactory.getLogger(PreviewGenerationService.class);
    private static final String PREVIEW_TOPIC = "/topic/preview/";

    private final LeosRepository leosRepository;
    private final ExportService exportService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public PreviewGenerationService(LeosRepository leosRepository, ExportService exportService,
                                    SimpMessagingTemplate simpMessagingTemplate) {
        this.leosRepository = leosRepository;
        this.exportService = exportService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Async
    public void generatePreviewAsync(ExportOptions exportOptions, User user) {
        String documentRef = "";
        String versionLabel = "";
        try {
            XmlDocument currentDocument = exportOptions.getExportVersions().getCurrent();
            if (currentDocument != null) {
                documentRef = currentDocument.getMetadata().get().getRef();
                versionLabel = currentDocument.getVersionLabel();
                LOG.info("Starting async preview generation for document: {}, version: {}", documentRef, versionLabel);

                byte[] responseData = ZipPackageUtil.extractPdfFromNestedZip(
                        exportService.createDocumentPackage(exportOptions, user));

                leosRepository.markDocumentPreviewCompleted(documentRef, versionLabel, responseData);
                LOG.info("Async preview generation completed for document: {}, version: {}", documentRef, versionLabel);
                simpMessagingTemplate.convertAndSend(PREVIEW_TOPIC + documentRef,
                        String.format("{\"status\":\"%s\",\"versionLabel\":\"%s\"}", PreviewWebSocketStatus.READY, versionLabel));
            }
        } catch (Exception ex) {
            LOG.error("Failed to generate preview for document: {}, version: {}", documentRef, versionLabel, ex);
            if (!documentRef.isEmpty() && !versionLabel.isEmpty()) {
                leosRepository.markDocumentPreviewFailed(documentRef, versionLabel);
                simpMessagingTemplate.convertAndSend(PREVIEW_TOPIC + documentRef,
                        String.format("{\"status\":\"%s\",\"versionLabel\":\"%s\"}", PreviewWebSocketStatus.FAILED, versionLabel));
            }
        }
    }
}
