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

import eu.europa.ec.leos.repository.model.DocumentPreview;

public interface DocumentPreviewService {
    DocumentPreview saveDocumentPreview(String documentVersionId, String documentRef, String versionLabel, byte[] content, String status);
    DocumentPreview findDocumentPreviewByDocumentRef(String documentRef);
    DocumentPreview findByDocumentRefAndVersionLabel(String documentRef, String versionLabel);
    DocumentPreview createInProgress(String documentVersionId, String documentRef, String versionLabel);
    void markCompleted(String documentRef, String versionLabel, byte[] content);
    void markFailed(String documentRef, String versionLabel);
    void deleteDocumentPreview(String documentRef, String versionLabel);
}
