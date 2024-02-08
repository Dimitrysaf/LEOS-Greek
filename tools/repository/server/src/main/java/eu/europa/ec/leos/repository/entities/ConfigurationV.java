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
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "CONFIGURATION_V")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "ConfigurationV.findAll", query = "SELECT d FROM ConfigurationV d"),
    @NamedQuery(name = "ConfigurationV.findByUniqueId", query = "SELECT d FROM ConfigurationV d WHERE d.uniqueId = :uniqueId"),
    @NamedQuery(name = "ConfigurationV.findById", query = "SELECT d FROM ConfigurationV d WHERE d.id = :id"),
    @NamedQuery(name = "ConfigurationV.findByConfigId", query = "SELECT d FROM ConfigurationV d WHERE d.configId = :configId"),
    @NamedQuery(name = "ConfigurationV.findByObjectId", query = "SELECT d FROM ConfigurationV d WHERE d.objectId = :docObjectId"),
    @NamedQuery(name = "ConfigurationV.findByCategoryCode", query = "SELECT d FROM ConfigurationV d WHERE d.categoryCode = :categoryCode"),
    @NamedQuery(name = "ConfigurationV.findByCategoryDesc", query = "SELECT d FROM ConfigurationV d WHERE d.categoryDesc = :categoryDesc"),
    @NamedQuery(name = "ConfigurationV.findByName", query = "SELECT d FROM ConfigurationV d WHERE d.name = :name"),
    @NamedQuery(name = "ConfigurationV.findByAuditCBy", query = "SELECT d FROM ConfigurationV d WHERE d.auditCBy = :auditCBy"),
    @NamedQuery(name = "ConfigurationV.findByAuditCDate", query = "SELECT d FROM ConfigurationV d WHERE d.auditCDate = :auditCDate"),
    @NamedQuery(name = "ConfigurationV.findByAuditLastMDate", query = "SELECT d FROM ConfigurationV d WHERE d.auditLastMDate = :auditLastMDate"),
    @NamedQuery(name = "ConfigurationV.findByAuditLastMBy", query = "SELECT d FROM ConfigurationV d WHERE d.auditLastMBy = :auditLastMBy"),
    @NamedQuery(name = "ConfigurationV.findByVersionLabel", query = "SELECT d FROM ConfigurationV d WHERE d.versionLabel = :versionLabel"),
    @NamedQuery(name = "ConfigurationV.findByVersionSeriesId", query = "SELECT d FROM ConfigurationV d WHERE d.versionSeriesId = :versionSeriesId"),
    @NamedQuery(name = "ConfigurationV.findByVersionType", query = "SELECT d FROM ConfigurationV d WHERE d.versionType = :versionType"),
    @NamedQuery(name = "ConfigurationV.findByIsLatestMajorVersion", query = "SELECT d FROM ConfigurationV d WHERE d.isLatestMajorVersion = :isLatestMajorVersion"),
    @NamedQuery(name = "ConfigurationV.findByIsLatestVersion", query = "SELECT d FROM ConfigurationV d WHERE d.isLatestVersion = :isLatestVersion"),
    @NamedQuery(name = "ConfigurationV.findByIsMajorVersion", query = "SELECT d FROM ConfigurationV d WHERE d.isMajorVersion = :isMajorVersion"),
    @NamedQuery(name = "ConfigurationV.findByIsVersionSeriesCheckedOut", query = "SELECT d FROM ConfigurationV d WHERE d.isVersionSeriesCheckedOut = :isVersionSeriesCheckedOut"),
    @NamedQuery(name = "ConfigurationV.findByContent", query = "SELECT d FROM ConfigurationV d WHERE d.content = :content")})
public class ConfigurationV implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "UNIQUE_ID", updatable = false)
    private String uniqueId;
    @Column(name = "ID", updatable = false)
    private BigDecimal id;
    @Column(name = "NAME", updatable = false)
    private String name;
    @Column(name = "OBJECT_ID", updatable = false)
    private BigDecimal objectId;
    @Column(name = "CONFIG_ID", updatable = false)
    private BigDecimal configId;
    @Column(name = "CATEGORY_CODE", updatable = false)
    private String categoryCode;
    @Column(name = "CATEGORY_DESC", updatable = false)
    private String categoryDesc;
    @Column(name = "AUDIT_C_BY", updatable = false)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", updatable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_DATE", updatable = false)
    private LocalDateTime auditLastMDate;
    @Column(name = "AUDIT_LAST_M_BY", updatable = false)
    private String auditLastMBy;
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
    @Lob
    @Column(name = "CONTENT", updatable = false)
    private byte[] content;

    public ConfigurationV() {
    }

    public String getUniqueId() {
        return uniqueId;
    }

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
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

    public LocalDateTime getAuditLastMDate() {
        return auditLastMDate;
    }

    public void setAuditLastMDate(LocalDateTime auditLastMDate) {
        this.auditLastMDate = auditLastMDate;
    }

    public String getAuditLastMBy() {
        return auditLastMBy;
    }

    public void setAuditLastMBy(String auditLastMBy) {
        this.auditLastMBy = auditLastMBy;
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

    public Boolean isLatestMajorVersion() {
        return isLatestMajorVersion;
    }

    public void setIsLatestMajorVersion(Boolean isLatestMajorVersion) {
        this.isLatestMajorVersion = isLatestMajorVersion;
    }

    public Boolean isLatestVersion() {
        return isLatestVersion;
    }

    public void setIsLatestVersion(Boolean isLatestVersion) {
        this.isLatestVersion = isLatestVersion;
    }

    public Boolean isMajorVersion() {
        return isMajorVersion;
    }

    public void setIsMajorVersion(Boolean isMajorVersion) {
        this.isMajorVersion = isMajorVersion;
    }

    public Boolean isVersionSeriesCheckedOut() {
        return isVersionSeriesCheckedOut;
    }

    public void setIsVersionSeriesCheckedOut(Boolean isVersionSeriesCheckedOut) {
        this.isVersionSeriesCheckedOut = isVersionSeriesCheckedOut;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }
}
