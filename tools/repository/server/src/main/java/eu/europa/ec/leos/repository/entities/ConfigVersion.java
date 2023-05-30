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
package eu.europa.ec.leos.repository.entities;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlTransient;

@Entity
@Table(name = "CONFIG_VERSION")
@NamedQueries({
    @NamedQuery(name = "ConfigVersion.findAll", query = "SELECT c FROM ConfigVersion c"),
    @NamedQuery(name = "ConfigVersion.findById", query = "SELECT c FROM ConfigVersion c WHERE c.id = :id"),
    @NamedQuery(name = "ConfigVersion.findByVersionLabel", query = "SELECT c FROM ConfigVersion c WHERE c.versionLabel = :versionLabel"),
    @NamedQuery(name = "ConfigVersion.findByVersionSeriesId", query = "SELECT c FROM ConfigVersion c WHERE c.versionSeriesId = :versionSeriesId"),
    @NamedQuery(name = "ConfigVersion.findByVersionType", query = "SELECT c FROM ConfigVersion c WHERE c.versionType = :versionType"),
    @NamedQuery(name = "ConfigVersion.findByIsLatestMajorVersion", query = "SELECT c FROM ConfigVersion c WHERE c.isLatestMajorVersion = :isLatestMajorVersion"),
    @NamedQuery(name = "ConfigVersion.findByIsLatestVersion", query = "SELECT c FROM ConfigVersion c WHERE c.isLatestVersion = :isLatestVersion"),
    @NamedQuery(name = "ConfigVersion.findByIsMajorVersion", query = "SELECT c FROM ConfigVersion c WHERE c.isMajorVersion = :isMajorVersion"),
    @NamedQuery(name = "ConfigVersion.findByIsVersionSeriesCheckedOut", query = "SELECT c FROM ConfigVersion c WHERE c.isVersionSeriesCheckedOut = :isVersionSeriesCheckedOut"),
    @NamedQuery(name = "ConfigVersion.findByAuditCBy", query = "SELECT c FROM ConfigVersion c WHERE c.auditCBy = :auditCBy"),
    @NamedQuery(name = "ConfigVersion.findByAuditCDate", query = "SELECT c FROM ConfigVersion c WHERE c.auditCDate = :auditCDate"),
    @NamedQuery(name = "ConfigVersion.findByAuditLastMBy", query = "SELECT c FROM ConfigVersion c WHERE c.auditLastMBy = :auditLastMBy"),
    @NamedQuery(name = "ConfigVersion.findByAuditLastMDate", query = "SELECT c FROM ConfigVersion c WHERE c.auditLastMDate = :auditLastMDate"),
    @NamedQuery(name = "ConfigVersion.findByIsImmutable", query = "SELECT c FROM ConfigVersion c WHERE c.isImmutable = :isImmutable")})
public class ConfigVersion implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private BigDecimal id;
    @Column(name = "CONFIG_ID", nullable = false, precision = 22, scale = 0)
    private BigDecimal configId;
    @Column(name = "VERSION_LABEL")
    private String versionLabel;
    @Column(name = "VERSION_SERIES_ID", nullable = false)
    private String versionSeriesId;
    @Column(name = "VERSION_TYPE")
    private String versionType;
    @Column(name = "IS_LATEST_MAJOR_VERSION", nullable = false)
    private Boolean isLatestMajorVersion;
    @Column(name = "IS_LATEST_VERSION", nullable = false)
    private Boolean isLatestVersion;
    @Column(name = "IS_MAJOR_VERSION", nullable = false)
    private Boolean isMajorVersion;
    @Column(name = "IS_VERSION_SERIES_CHECKED_OUT", nullable = false)
    private Boolean isVersionSeriesCheckedOut;
    @Column(name = "AUDIT_C_BY", nullable = false)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", nullable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_BY")
    private String auditLastMBy;
    @Column(name = "AUDIT_LAST_M_DATE")
    private LocalDateTime auditLastMDate;
    @Column(name = "IS_IMMUTABLE")
    private Boolean isImmutable;
    @OneToMany(mappedBy = "versionId")
    private Collection<DocumentPropertyValues> documentPropertyValuesCollection;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "versionId")
    private Collection<ConfigContent> configContentCollection;

    public ConfigVersion() {
    }

    public ConfigVersion(BigDecimal id) {
        this.id = id;
    }

    public ConfigVersion(BigDecimal id, BigDecimal configId, String versionSeriesId, Boolean isLatestMajorVersion, Boolean isLatestVersion, Boolean isMajorVersion, Boolean isVersionSeriesCheckedOut, String auditCBy, LocalDateTime auditCDate) {
        this.id = id;
        this.configId = configId;
        this.versionSeriesId = versionSeriesId;
        this.isLatestMajorVersion = isLatestMajorVersion;
        this.isLatestVersion = isLatestVersion;
        this.isMajorVersion = isMajorVersion;
        this.isVersionSeriesCheckedOut = isVersionSeriesCheckedOut;
        this.auditCBy = auditCBy;
        this.auditCDate = auditCDate;
    }

    public BigDecimal getId() {
        return id;
    }

    public void setId(BigDecimal id) {
        this.id = id;
    }

    public BigDecimal getConfigId() {
        return configId;
    }

    public void setConfigId(BigDecimal configId) {
        this.configId = configId;
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

    @XmlTransient
    public Collection<DocumentPropertyValues> getDocumentPropertyValuesCollection() {
        return documentPropertyValuesCollection;
    }

    public void setDocumentPropertyValuesCollection(Collection<DocumentPropertyValues> documentPropertyValuesCollection) {
        this.documentPropertyValuesCollection = documentPropertyValuesCollection;
    }

    @XmlTransient
    public Collection<ConfigContent> getConfigContentCollection() {
        return configContentCollection;
    }

    public void setConfigContentCollection(Collection<ConfigContent> configContentCollection) {
        this.configContentCollection = configContentCollection;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof ConfigVersion)) {
            return false;
        }
        ConfigVersion other = (ConfigVersion) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "eu.europa.ec.leos.repository.entities.ConfigVersion[ id=" + id + " ]";
    }
    
}
