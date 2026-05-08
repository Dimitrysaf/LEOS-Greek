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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class DocumentPreviewCleanupService {

    private static final Logger LOG = LoggerFactory.getLogger(DocumentPreviewCleanupService.class);

    private final DocumentPreviewService documentPreviewService;

    @Value("${leos.documentPreview.cleanup.days:5}")
    private int cleanupDays;

    @Autowired
    public DocumentPreviewCleanupService(DocumentPreviewService documentPreviewService) {
        this.documentPreviewService = documentPreviewService;
    }

    @Scheduled(cron = "${leos.documentPreview.cleanup.cron:0 0 2 * * ?}")
    public void cleanupOldDocumentPreviews() {
        LOG.info("Starting scheduled cleanup of DocumentPreview records older than {} days", cleanupDays);
        try {
            documentPreviewService.deleteDocumentPreviewOlderThan(cleanupDays);
            LOG.info("Successfully completed cleanup of old DocumentPreview records");
        } catch (Exception ex) {
            LOG.error("Error occurred during DocumentPreview cleanup: {}", ex.getMessage(), ex);
        }
    }
}
