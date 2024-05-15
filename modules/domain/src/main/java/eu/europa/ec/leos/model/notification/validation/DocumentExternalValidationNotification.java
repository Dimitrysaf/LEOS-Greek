/*
 * Copyright 2024 European Union
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
package eu.europa.ec.leos.model.notification.validation;

import java.util.Date;

public class DocumentExternalValidationNotification extends ValidationEmailNotification {

    private byte[] attachmentContent;

    public DocumentExternalValidationNotification(String recipient, String requestedBy, Date requestedOn, String title, byte[] attachmentContent) {
        super(recipient, null, requestedBy, requestedOn, title);
        this.attachmentContent = attachmentContent;
    }

    @Override
    public String getEmailSubjectKey() {
        return "notification.external.validation.document.subject";
    }

    @Override
    public String getAttachmentName() {
        return "validation.zip";
    }

    @Override
    public String getMimeType() {
        return "application/zip";
    }

    @Override
    public boolean withAttachment() {
        return true;
    }

    public byte[] getAttachmentContent() {
        return attachmentContent;
    }
}
