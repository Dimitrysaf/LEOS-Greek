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
package eu.europa.ec.leos.repository.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import eu.europa.ec.leos.repository.common.VersionType;
import eu.europa.ec.leos.repository.entities.ConfigurationV;
import eu.europa.ec.leos.repository.entities.DocumentV;
import eu.europa.ec.leos.repository.utils.DateDesSerializer;
import eu.europa.ec.leos.repository.utils.DateSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.util.Date;

public class LeosDocument {
    private static final Logger LOG = LoggerFactory.getLogger(LeosDocument.class);

    private String id;
    private String name;
    private String createdBy;
    private Date createdOn;
    private String updatedBy;
    private Date updatedOn;
    private byte[] source;

    private VersionType versionType;
    private Boolean isLatestVersion = false;
    private String versionLabel;
    private String comments;

    public LeosDocument() {}

    public LeosDocument(DocumentV doc) {
        if (doc != null) {
            this.id = doc.getVersionId().toString();
            this.name = doc.getName();
            this.createdBy = doc.getDocAuditCBy();
            this.createdOn = Date.from(doc.getDocAuditCDate().atZone(ZoneId.systemDefault()).toInstant());
            this.updatedBy = doc.getDocAuditLastMBy();
            this.updatedOn = doc.getDocAuditLastMDate() != null ? Date.from(doc.getDocAuditLastMDate().atZone(ZoneId.systemDefault()).toInstant()) : null;
            this.source = doc.getContent().getBytes(StandardCharsets.UTF_8);

            this.isLatestVersion = doc.isLatestVersion();
            this.versionLabel = doc.getVersionLabel();
            this.versionType = VersionType.fromValue(Integer.parseInt(doc.getVersionType()));
            this.comments = doc.getComments();
        }
    }

    public LeosDocument(ConfigurationV config) {
        if (config != null) {
            this.id = config.getId().toString();
            this.name = config.getName();
            this.createdBy = config.getAuditCBy();
            this.createdOn = Date.from(config.getAuditCDate().atZone(ZoneId.systemDefault()).toInstant());
            this.updatedBy = config.getAuditLastMBy();
            this.updatedOn = config.getAuditLastMDate() != null ? Date.from(config.getAuditLastMDate().atZone(ZoneId.systemDefault()).toInstant()) : null;
            this.source = config.getContent();

            this.isLatestVersion = config.isLatestVersion();
            this.versionLabel = config.getVersionLabel();
            this.versionType = config.getVersionType() != null ? VersionType.fromValue(Integer.parseInt(config.getVersionType())) : null;
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    @JsonSerialize(using = DateSerializer.class)
    @JsonDeserialize(using = DateDesSerializer.class)
    public Date getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(Date createdOn) {
        this.createdOn = createdOn;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    @JsonSerialize(using = DateSerializer.class)
    @JsonDeserialize(using = DateDesSerializer.class)
    public Date getUpdatedOn() {
        return updatedOn;
    }

    public void setUpdatedOn(Date updatedOn) {
        this.updatedOn = updatedOn;
    }

    public byte[] getSource() {
        return source;
    }

    public void setSource(byte[] source) {
        this.source = source;
    }

    public String getVersionLabel() {
        return versionLabel;
    }

    public void setVersionLabel(String versionLabel) {
        this.versionLabel = versionLabel;
    }

    public VersionType getVersionType() {
        return versionType;
    }

    public void setVersionType(VersionType versionType) {
        this.versionType = versionType;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public Boolean isLatestVersion() {
        return isLatestVersion;
    }

    public void setLatestVersion(Boolean latestVersion) {
        isLatestVersion = latestVersion;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        LeosDocument that = (LeosDocument) o;

        if (!getId().equals(that.getId())) return false;
        if (getCreatedBy() != null ? !getCreatedBy().equals(that.getCreatedBy()) : that.getCreatedBy() != null) return false;
        if (getCreatedOn() != null ? !getCreatedOn().equals(that.getCreatedOn()) : that.getCreatedOn() != null) return false;
        if (getUpdatedBy() != null ? !getUpdatedBy().equals(that.getUpdatedBy()) : that.getUpdatedBy() != null) return false;
        if (getUpdatedOn() != null ? !getUpdatedOn().equals(that.getUpdatedOn()) : that.getUpdatedOn() != null) return false;
        return true;
    }

    @Override
    public int hashCode() {
        int result = getId().hashCode();
        result = 31 * result + (getCreatedBy() != null ? getCreatedBy().hashCode() : 0);
        result = 31 * result + (getCreatedOn() != null ? getCreatedOn().hashCode() : 0);
        result = 31 * result + (getUpdatedBy() != null ? getUpdatedBy().hashCode() : 0);
        result = 31 * result + (getUpdatedOn() != null ? getUpdatedOn().hashCode() : 0);
        return result;
    }

    protected void clean() {
        this.setId(null);
        this.setSource(null);
        this.setCreatedBy(null);
        this.setCreatedOn(null);
        this.setUpdatedBy(null);
        this.setUpdatedOn(null);
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
