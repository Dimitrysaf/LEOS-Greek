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

import lombok.Getter;

import java.io.Serial;
import java.io.Serializable;

@Getter
public class DownloadPreviewResponse implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private final byte[] responseData;
    private final String message;
    private final boolean isStale;
    private final String previewVersion;
    private final String currentVersion;
    private final String messageKey;
    private final byte[] staleContent;

    public DownloadPreviewResponse(byte[] responseData) {
        this.responseData = responseData;
        this.message = null;
        this.isStale = false;
        this.previewVersion = null;
        this.currentVersion = null;
        this.messageKey = null;
        this.staleContent = null;
    }

    public DownloadPreviewResponse(String message) {
        this.responseData = null;
        this.message = message;
        this.isStale = false;
        this.previewVersion = null;
        this.currentVersion = null;
        this.messageKey = null;
        this.staleContent = null;
    }

    public DownloadPreviewResponse(byte[] responseData, boolean isStale, String previewVersion, String currentVersion, String messageKey) {
        this.responseData = responseData;
        this.message = null;
        this.isStale = isStale;
        this.previewVersion = previewVersion;
        this.currentVersion = currentVersion;
        this.messageKey = messageKey;
        this.staleContent = null;
    }

    public DownloadPreviewResponse(String message, byte[] staleContent, String previewVersion, String currentVersion) {
        this.responseData = null;
        this.message = message;
        this.isStale = false;
        this.previewVersion = previewVersion;
        this.currentVersion = currentVersion;
        this.messageKey = null;
        this.staleContent = staleContent;
    }

}
