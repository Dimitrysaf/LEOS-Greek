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
package eu.europa.ec.leos.services.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class PreviewResponse {

    private final String status;
    private String message;
    private String previewBlob;
    private String previewVersion;
    private String currentVersion;
    private String messageKey;

    public PreviewResponse(String status) {
        this.status = status;
    }

    public String getStatus() { return status; }
    public String getMessage() { return message; }
    public String getPreviewBlob() { return previewBlob; }
    public String getPreviewVersion() { return previewVersion; }
    public String getCurrentVersion() { return currentVersion; }
    public String getMessageKey() { return messageKey; }

    public PreviewResponse withMessage(String message) { this.message = message; return this; }
    public PreviewResponse withPreviewBlob(String previewBlob) { this.previewBlob = previewBlob; return this; }
    public PreviewResponse withPreviewVersion(String previewVersion) { this.previewVersion = previewVersion; return this; }
    public PreviewResponse withCurrentVersion(String currentVersion) { this.currentVersion = currentVersion; return this; }
    public PreviewResponse withMessageKey(String messageKey) { this.messageKey = messageKey; return this; }
}
