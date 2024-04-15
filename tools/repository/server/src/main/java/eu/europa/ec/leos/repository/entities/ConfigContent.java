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
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "CONFIG_CONTENT")
@NamedQueries({
    @NamedQuery(name = "ConfigContent.findAll", query = "SELECT c FROM ConfigContent c"),
    @NamedQuery(name = "ConfigContent.findByContentStreamMimeType", query = "SELECT c FROM ConfigContent c WHERE c.contentStreamMimeType = :contentStreamMimeType"),
    @NamedQuery(name = "ConfigContent.findByContentStreamFilename", query = "SELECT c FROM ConfigContent c WHERE c.contentStreamFilename = :contentStreamFilename"),
    @NamedQuery(name = "ConfigContent.findByContentStreamId", query = "SELECT c FROM ConfigContent c WHERE c.contentStreamId = :contentStreamId"),
    @NamedQuery(name = "ConfigContent.findByContentStreamLength", query = "SELECT c FROM ConfigContent c WHERE c.contentStreamLength = :contentStreamLength"),
    @NamedQuery(name = "ConfigContent.findByAuditCBy", query = "SELECT c FROM ConfigContent c WHERE c.auditCBy = :auditCBy"),
    @NamedQuery(name = "ConfigContent.findByAuditCDate", query = "SELECT c FROM ConfigContent c WHERE c.auditCDate = :auditCDate"),
    @NamedQuery(name = "ConfigContent.findByAuditLastMBy", query = "SELECT c FROM ConfigContent c WHERE c.auditLastMBy = :auditLastMBy"),
    @NamedQuery(name = "ConfigContent.findByAuditLastMDate", query = "SELECT c FROM ConfigContent c WHERE c.auditLastMDate = :auditLastMDate"),
    @NamedQuery(name = "ConfigContent.findById", query = "SELECT c FROM ConfigContent c WHERE c.id = :id")})
public class ConfigContent implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private BigDecimal id;
    @Lob
    @Column(name = "CONTENT")
    private String content;
    @Column(name = "CONTENT_STREAM_MIME_TYPE")
    private String contentStreamMimeType;
    @Column(name = "CONTENT_STREAM_FILENAME")
    private String contentStreamFilename;
    @Column(name = "CONTENT_STREAM_ID")
    private String contentStreamId;
    @Column(name = "CONTENT_STREAM_LENGTH")
    private String contentStreamLength;
    @Column(name = "AUDIT_C_BY", nullable = false, length = 30)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE")
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_BY", length = 30)
    private String auditLastMBy;
    @Column(name = "AUDIT_LAST_M_DATE")
    private LocalDateTime auditLastMDate;
    @JoinColumn(name = "VERSION_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private ConfigVersion versionId;

    public ConfigContent() {
    }

    public ConfigContent(BigDecimal id) {
        this.id = id;
    }

    public byte[] getContent() {
        return content.getBytes(StandardCharsets.UTF_8);
    }

    public void setContent(byte[] content) {
        this.content = new String(content, StandardCharsets.UTF_8);
    }

    public String getContentString() {
        return content;
    }

    public void setContentString(String content) { this.content = content; }

    public String getContentStreamMimeType() {
        return contentStreamMimeType;
    }

    public void setContentStreamMimeType(String contentStreamMimeType) {
        this.contentStreamMimeType = contentStreamMimeType;
    }

    public String getContentStreamFilename() {
        return contentStreamFilename;
    }

    public void setContentStreamFilename(String contentStreamFilename) {
        this.contentStreamFilename = contentStreamFilename;
    }

    public String getContentStreamId() {
        return contentStreamId;
    }

    public void setContentStreamId(String contentStreamId) {
        this.contentStreamId = contentStreamId;
    }

    public String getContentStreamLength() {
        return contentStreamLength;
    }

    public void setContentStreamLength(String contentStreamLength) {
        this.contentStreamLength = contentStreamLength;
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

    public BigDecimal getId() {
        return id;
    }

    public void setId(BigDecimal id) {
        this.id = id;
    }

    public ConfigVersion getVersionId() {
        return versionId;
    }

    public void setVersionId(ConfigVersion versionId) {
        this.versionId = versionId;
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
        if (!(object instanceof ConfigContent)) {
            return false;
        }
        ConfigContent other = (ConfigContent) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "eu.europa.ec.leos.repository.entities.ConfigContent[ id=" + id + " ]";
    }
    
}
