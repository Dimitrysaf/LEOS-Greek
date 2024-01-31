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
package eu.europa.ec.leos.repository.controllers.requests;

import eu.europa.ec.leos.repository.common.VersionType;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.io.Serializable;
import java.util.Map;

public class CreateDocumentRequest implements Serializable {
    @NotBlank(message = "Package name cannot be blank")
    private String packageName;
    @NotBlank(message = "User Id cannot be blank")
    private String userId;
    @NotBlank(message = "Document name cannot be blank")
    private String name;
    @NotNull(message = "Document metadata cannot be empty")
    private Map<String, ?> metadata;
    @NotBlank(message = "Document version's label cannot be blank")
    private String labelVersion;
    @NotNull(message = "Document version's type cannot be null")
    private VersionType versionType;
    @Null(groups = OnCreateFromSource.class)
    @NotNull(groups = OnCreateFromContent.class)
    private byte[] content;
    @NotBlank(message = "Document comments' version cannot be blank")
    private String comments;
    @Null(groups = OnCreateFromContent.class)
    @NotNull(groups = OnCreateFromSource.class)
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
