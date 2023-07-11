/*
 * Copyright 2023 European Commission
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
package eu.europa.ec.leos.rest.requests;

import eu.europa.ec.leos.domain.repository.common.VersionType;

import java.io.Serializable;
import java.util.Map;

public class CreateDocumentRequest implements Serializable {
    private String packageName;
    private String userId;
    private String name;
    private Map<String, ?> metadata;
    private String labelVersion;
    private VersionType versionType;
    private byte[] content;
    private String comments;
    private String sourceDocumentId;

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Map<String, ?> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, ?> metadata) {
        this.metadata = metadata;
    }

    public String getLabelVersion() {
        return labelVersion;
    }

    public void setLabelVersion(String labelVersion) {
        this.labelVersion = labelVersion;
    }

    public VersionType getVersionType() {
        return versionType;
    }

    public void setVersionType(VersionType versionType) {
        this.versionType = versionType;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }

    public String getSourceDocumentId() {
        return sourceDocumentId;
    }

    public void setSourceDocumentId(String sourceDocumentId) {
        this.sourceDocumentId = sourceDocumentId;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }
}
