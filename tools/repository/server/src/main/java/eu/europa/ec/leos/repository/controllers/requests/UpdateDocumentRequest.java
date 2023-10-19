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
package eu.europa.ec.leos.repository.controllers.requests;

import eu.europa.ec.leos.repository.common.VersionType;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.io.Serializable;
import java.util.Map;

public class UpdateDocumentRequest implements Serializable {
    @NotBlank(message = "User Id cannot be blank")
    private String userId;
    @NotNull(message = "Document metadata cannot be empty")
    private Map<String, ?> metadata;
    @NotNull(message = "Document version's type cannot be null")
    private VersionType versionType;
    @NotNull(message = "Document category cannot be null")
    private String category;
    @Null(groups = OnUpdateWithoutContent.class)
    @NotNull(groups = OnUpdateWithContent.class)
    private byte[] content;
    @NotBlank(message = "Document comments' version cannot be blank")
    private String comments;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Map<String, ?> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, ?> metadata) {
        this.metadata = metadata;
    }

    public VersionType getVersionType() {
        return versionType;
    }

    public void setVersionType(VersionType versionType) {
        this.versionType = versionType;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }
}
