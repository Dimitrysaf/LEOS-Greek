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
import java.util.Collection;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlTransient;

@Entity
@Table(name = "DOCUMENT_VERSION")
@NamedQueries({
    @NamedQuery(name = "DocumentVersion.findAll", query = "SELECT d FROM DocumentVersion d"),
    @NamedQuery(name = "DocumentVersion.findById", query = "SELECT d FROM DocumentVersion d WHERE d.id = :id"),
    @NamedQuery(name = "DocumentVersion.findByVersionLabel", query = "SELECT d FROM DocumentVersion d WHERE d.versionLabel = :versionLabel"),
    @NamedQuery(name = "DocumentVersion.findByVersionSeriesId", query = "SELECT d FROM DocumentVersion d WHERE d.versionSeriesId = :versionSeriesId"),
    @NamedQuery(name = "DocumentVersion.findByVersionType", query = "SELECT d FROM DocumentVersion d WHERE d.versionType = :versionType"),
    @NamedQuery(name = "DocumentVersion.findByIsLatestMajorVersion", query = "SELECT d FROM DocumentVersion d WHERE d.isLatestMajorVersion = :isLatestMajorVersion"),
    @NamedQuery(name = "DocumentVersion.findByIsLatestVersion", query = "SELECT d FROM DocumentVersion d WHERE d.isLatestVersion = :isLatestVersion"),
    @NamedQuery(name = "DocumentVersion.findByIsMajorVersion", query = "SELECT d FROM DocumentVersion d WHERE d.isMajorVersion = :isMajorVersion"),
    @NamedQuery(name = "DocumentVersion.findByIsVersionSeriesCheckedOut", query = "SELECT d FROM DocumentVersion d WHERE d.isVersionSeriesCheckedOut = :isVersionSeriesCheckedOut"),
    @NamedQuery(name = "DocumentVersion.findByAuditCBy", query = "SELECT d FROM DocumentVersion d WHERE d.auditCBy = :auditCBy"),
    @NamedQuery(name = "DocumentVersion.findByAuditCDate", query = "SELECT d FROM DocumentVersion d WHERE d.auditCDate = :auditCDate"),
    @NamedQuery(name = "DocumentVersion.findByAuditLastMBy", query = "SELECT d FROM DocumentVersion d WHERE d.auditLastMBy = :auditLastMBy"),
    @NamedQuery(name = "DocumentVersion.findByAuditLastMDate", query = "SELECT d FROM DocumentVersion d WHERE d.auditLastMDate = :auditLastMDate"),
    @NamedQuery(name = "DocumentVersion.findByIsImmutable", query = "SELECT d FROM DocumentVersion d WHERE d.isImmutable = :isImmutable"),
    @NamedQuery(name = "DocumentVersion.findByDocumentId", query = "SELECT d FROM DocumentVersion d WHERE d.documentId = :documentId")})
public class DocumentVersion implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private BigDecimal id;
    @Column(name = "VERSION_LABEL", nullable = false)
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
    @Column(name = "COMMENTS")
    private String comments;
    @Column(name = "DOCUMENT_ID", precision = 22, scale = 0)
    private BigDecimal documentId;
    @Column(name = "IS_VERSION_ARCHIVED", nullable = false)
    private Boolean isVersionArchived;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "version")
    private Collection<DocumentContent> documentContentCollection;

    public DocumentVersion() {
    }

    public DocumentVersion(BigDecimal id) {
        this.id = id;
    }

    public DocumentVersion(BigDecimal id, String versionSeriesId, Boolean isLatestMajorVersion, Boolean isLatestVersion, Boolean isMajorVersion, Boolean isVersionSeriesCheckedOut, String auditCBy, LocalDateTime auditCDate) {
        this.id = id;
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

    public BigDecimal getDocumentId() {
        return documentId;
    }

    public void setDocumentId(BigDecimal documentId) {
        this.documentId = documentId;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public Boolean getVersionArchived() {
        return isVersionArchived;
    }

    public void setVersionArchived(Boolean versionArchived) {
        isVersionArchived = versionArchived;
    }

    @XmlTransient
    public Collection<DocumentContent> getDocumentContentCollection() {
        return documentContentCollection;
    }

    public void setDocumentContentCollection(Collection<DocumentContent> documentContentCollection) {
        this.documentContentCollection = documentContentCollection;
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
        if (!(object instanceof DocumentVersion)) {
            return false;
        }
        DocumentVersion other = (DocumentVersion) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "eu.europa.ec.leos.repository.entities.DocumentVersion[ id=" + id + " ]";
    }
    
}
