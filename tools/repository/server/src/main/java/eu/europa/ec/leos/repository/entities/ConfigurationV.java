/*
 * Copyright 2021 European Commission
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
package eu.europa.ec.leos.repository.entities;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "CONFIGURATION_V")
@NamedQueries({
    @NamedQuery(name = "ConfigurationV.findAll", query = "SELECT c FROM ConfigurationV c"),
    @NamedQuery(name = "ConfigurationV.findById", query = "SELECT c FROM ConfigurationV c WHERE c.id = :id"),
    @NamedQuery(name = "ConfigurationV.findByName", query = "SELECT c FROM ConfigurationV c WHERE c.name = :name"),
    @NamedQuery(name = "ConfigurationV.findByObjectId", query = "SELECT c FROM ConfigurationV c WHERE c.objectId = :objectId"),
    @NamedQuery(name = "ConfigurationV.findByConfigId", query = "SELECT c FROM ConfigurationV c WHERE c.configId = :configId"),
    @NamedQuery(name = "ConfigurationV.findByConfigType", query = "SELECT c FROM ConfigurationV c WHERE c.configType = :configType"),
    @NamedQuery(name = "ConfigurationV.findByCategoryCode", query = "SELECT c FROM ConfigurationV c WHERE c.categoryCode = :categoryCode"),
    @NamedQuery(name = "ConfigurationV.findByCategoryDesc", query = "SELECT c FROM ConfigurationV c WHERE c.categoryDesc = :categoryDesc"),
    @NamedQuery(name = "ConfigurationV.findByVersionLabel", query = "SELECT c FROM ConfigurationV c WHERE c.versionLabel = :versionLabel"),
    @NamedQuery(name = "ConfigurationV.findByVersionSeriesId", query = "SELECT c FROM ConfigurationV c WHERE c.versionSeriesId = :versionSeriesId"),
    @NamedQuery(name = "ConfigurationV.findByVersionType", query = "SELECT c FROM ConfigurationV c WHERE c.versionType = :versionType"),
    @NamedQuery(name = "ConfigurationV.findByIsLatestMajorVersion", query = "SELECT c FROM ConfigurationV c WHERE c.isLatestMajorVersion = :isLatestMajorVersion"),
    @NamedQuery(name = "ConfigurationV.findByIsLatestVersion", query = "SELECT c FROM ConfigurationV c WHERE c.isLatestVersion = :isLatestVersion"),
    @NamedQuery(name = "ConfigurationV.findByIsMajorVersion", query = "SELECT c FROM ConfigurationV c WHERE c.isMajorVersion = :isMajorVersion"),
    @NamedQuery(name = "ConfigurationV.findByIsVersionSeriesCheckedOut", query = "SELECT c FROM ConfigurationV c WHERE c.isVersionSeriesCheckedOut = :isVersionSeriesCheckedOut"),
    @NamedQuery(name = "ConfigurationV.findByAuditCBy", query = "SELECT c FROM ConfigurationV c WHERE c.auditCBy = :auditCBy"),
    @NamedQuery(name = "ConfigurationV.findByAuditCDate", query = "SELECT c FROM ConfigurationV c WHERE c.auditCDate = :auditCDate"),
    @NamedQuery(name = "ConfigurationV.findByAuditLastMBy", query = "SELECT c FROM ConfigurationV c WHERE c.auditLastMBy = :auditLastMBy"),
    @NamedQuery(name = "ConfigurationV.findByAuditLastMDate", query = "SELECT c FROM ConfigurationV c WHERE c.auditLastMDate = :auditLastMDate"),
    @NamedQuery(name = "ConfigurationV.findByIsImmutable", query = "SELECT c FROM ConfigurationV c WHERE c.isImmutable = :isImmutable"),
    @NamedQuery(name = "ConfigurationV.findByContentStreamMimeType", query = "SELECT c FROM ConfigurationV c WHERE c.contentStreamMimeType = :contentStreamMimeType"),
    @NamedQuery(name = "ConfigurationV.findByContentStreamFilename", query = "SELECT c FROM ConfigurationV c WHERE c.contentStreamFilename = :contentStreamFilename"),
    @NamedQuery(name = "ConfigurationV.findByContentStreamId", query = "SELECT c FROM ConfigurationV c WHERE c.contentStreamId = :contentStreamId"),
    @NamedQuery(name = "ConfigurationV.findByContentStreamLength", query = "SELECT c FROM ConfigurationV c WHERE c.contentStreamLength = :contentStreamLength")})
public class ConfigurationV implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    private BigDecimal id;
    @Column(name = "NAME", nullable = false, updatable = false)
    private String name;
    @Column(name = "OBJECT_ID", updatable = false, precision = 22, scale = 0)
    private BigDecimal objectId;
    @Column(name = "CONFIG_ID", updatable = false, precision = 22, scale = 0)
    private BigDecimal configId;
    @Column(name = "CONFIG_TYPE", updatable = false, precision = 22, scale = 0)
    private BigDecimal configType;
    @Column(name = "CATEGORY_CODE", updatable = false)
    private String categoryCode;
    @Column(name = "CATEGORY_DESC", updatable = false)
    private String categoryDesc;
    @Column(name = "VERSION_LABEL", updatable = false)
    private String versionLabel;
    @Column(name = "VERSION_SERIES_ID", updatable = false)
    private String versionSeriesId;
    @Column(name = "VERSION_TYPE", updatable = false)
    private String versionType;
    @Column(name = "IS_LATEST_MAJOR_VERSION", updatable = false)
    private Boolean isLatestMajorVersion;
    @Column(name = "IS_LATEST_VERSION", updatable = false)
    private Boolean isLatestVersion;
    @Column(name = "IS_MAJOR_VERSION", updatable = false)
    private Boolean isMajorVersion;
    @Column(name = "IS_VERSION_SERIES_CHECKED_OUT", updatable = false)
    private Boolean isVersionSeriesCheckedOut;
    @Column(name = "AUDIT_C_BY", updatable = false, length = 30)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", updatable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_BY", updatable = false)
    private String auditLastMBy;
    @Column(name = "AUDIT_LAST_M_DATE", updatable = false)
    private LocalDateTime auditLastMDate;
    @Column(name = "IS_IMMUTABLE", updatable = false)
    private Boolean isImmutable;
    @Lob
    @Column(name = "CONTENT", updatable = false)
    private Serializable content;
    @Column(name = "CONTENT_STREAM_MIME_TYPE", updatable = false)
    private String contentStreamMimeType;
    @Column(name = "CONTENT_STREAM_FILENAME", updatable = false)
    private String contentStreamFilename;
    @Column(name = "CONTENT_STREAM_ID", updatable = false)
    private String contentStreamId;
    @Column(name = "CONTENT_STREAM_LENGTH", updatable = false)
    private String contentStreamLength;

    public ConfigurationV() {
    }

    public BigDecimal getId() {
        return id;
    }

    public void setId(BigDecimal id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getObjectId() {
        return objectId;
    }

    public void setObjectId(BigDecimal objectId) {
        this.objectId = objectId;
    }

    public BigDecimal getConfigId() {
        return configId;
    }

    public void setConfigId(BigDecimal configId) {
        this.configId = configId;
    }

    public BigDecimal getConfigType() {
        return configType;
    }

    public void setConfigType(BigDecimal configType) {
        this.configType = configType;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public String getCategoryDesc() {
        return categoryDesc;
    }

    public void setCategoryDesc(String categoryDesc) {
        this.categoryDesc = categoryDesc;
    }

    public String getVersionLabel() {
        return versionLabel;
    }

    public void setVersionLabel(String versionLabel) {
        this.versionLabel = versionLabel;
    }

    public String getVersionSeriesId() {
        return versionSeriesId;
    }

    public void setVersionSeriesId(String versionSeriesId) {
        this.versionSeriesId = versionSeriesId;
    }

    public String getVersionType() {
        return versionType;
    }

    public void setVersionType(String versionType) {
        this.versionType = versionType;
    }

    public Boolean getIsLatestMajorVersion() {
        return isLatestMajorVersion;
    }

    public void setIsLatestMajorVersion(Boolean isLatestMajorVersion) {
        this.isLatestMajorVersion = isLatestMajorVersion;
    }

    public Boolean getIsLatestVersion() {
        return isLatestVersion;
    }

    public void setIsLatestVersion(Boolean isLatestVersion) {
        this.isLatestVersion = isLatestVersion;
    }

    public Boolean getIsMajorVersion() {
        return isMajorVersion;
    }

    public void setIsMajorVersion(Boolean isMajorVersion) {
        this.isMajorVersion = isMajorVersion;
    }

    public Boolean getIsVersionSeriesCheckedOut() {
        return isVersionSeriesCheckedOut;
    }

    public void setIsVersionSeriesCheckedOut(Boolean isVersionSeriesCheckedOut) {
        this.isVersionSeriesCheckedOut = isVersionSeriesCheckedOut;
    }

    public String getAuditCBy() {
        return auditCBy;
    }

    public void setAuditCBy(String auditCBy) {
        this.auditCBy = auditCBy;
    }

    public LocalDateTime getAuditCDate() {
        return auditCDate;
    }

    public void setAuditCDate(LocalDateTime auditCDate) {
        this.auditCDate = auditCDate;
    }

    public String getAuditLastMBy() {
        return auditLastMBy;
    }

    public void setAuditLastMBy(String auditLastMBy) {
        this.auditLastMBy = auditLastMBy;
    }

    public LocalDateTime getAuditLastMDate() {
        return auditLastMDate;
    }

    public void setAuditLastMDate(LocalDateTime auditLastMDate) {
        this.auditLastMDate = auditLastMDate;
    }

    public Serializable getContent() {
        return content;
    }

    public void setContent(Serializable content) {
        this.content = content;
    }

}
