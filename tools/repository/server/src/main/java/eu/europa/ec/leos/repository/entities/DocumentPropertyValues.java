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
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "DOCUMENT_PROPERTY_VALUES")
@NamedQueries({
    @NamedQuery(name = "DocumentPropertyValues.findAll", query = "SELECT d FROM DocumentPropertyValues d"),
    @NamedQuery(name = "DocumentPropertyValues.findById", query = "SELECT d FROM DocumentPropertyValues d WHERE d.id = :id"),
    @NamedQuery(name = "DocumentPropertyValues.findByDocumentId", query = "SELECT d FROM DocumentPropertyValues d WHERE d.documentId = :documentId"),
    @NamedQuery(name = "DocumentPropertyValues.findByPropertyValue", query = "SELECT d FROM DocumentPropertyValues d WHERE d.propertyValue = :propertyValue"),
    @NamedQuery(name = "DocumentPropertyValues.findByAuditCBy", query = "SELECT d FROM DocumentPropertyValues d WHERE d.auditCBy = :auditCBy"),
    @NamedQuery(name = "DocumentPropertyValues.findByAuditCDate", query = "SELECT d FROM DocumentPropertyValues d WHERE d.auditCDate = :auditCDate"),
    @NamedQuery(name = "DocumentPropertyValues.findByAuditLastMBy", query = "SELECT d FROM DocumentPropertyValues d WHERE d.auditLastMBy = :auditLastMBy"),
    @NamedQuery(name = "DocumentPropertyValues.findByAuditLastMDate", query = "SELECT d FROM DocumentPropertyValues d WHERE d.auditLastMDate = :auditLastMDate")})
public class DocumentPropertyValues implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private BigDecimal id;
    @Column(name = "DOCUMENT_ID", nullable = false)
    private BigDecimal documentId;
    @Column(name = "PROPERTY_VALUE")
    private String propertyValue;
    @Column(name = "AUDIT_C_BY", nullable = false)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", nullable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_BY")
    private String auditLastMBy;
    @Column(name = "AUDIT_LAST_M_DATE")
    private LocalDateTime auditLastMDate;
    @JoinColumn(name = "VERSION_ID", referencedColumnName = "ID")
    @ManyToOne(fetch = FetchType.LAZY)
    private ConfigVersion versionId;
    @JoinColumn(name = "PROPERTY_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private DocumentProperties propertyId;

    public DocumentPropertyValues() {
    }

    public DocumentPropertyValues(BigDecimal id) {
        this.id = id;
    }

    public DocumentPropertyValues(BigDecimal id, BigDecimal documentId, String auditCBy, LocalDateTime auditCDate) {
        this.id = id;
        this.documentId = documentId;
        this.auditCBy = auditCBy;
        this.auditCDate = auditCDate;
    }

    public BigDecimal getId() {
        return id;
    }

    public void setId(BigDecimal id) {
        this.id = id;
    }

    public BigDecimal getDocumentId() {
        return documentId;
    }

    public void setDocumentId(BigDecimal documentId) {
        this.documentId = documentId;
    }

    public String getPropertyValue() {
        return propertyValue;
    }

    public void setPropertyValue(String propertyValue) {
        this.propertyValue = propertyValue;
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

    public ConfigVersion getVersionId() {
        return versionId;
    }

    public void setVersionId(ConfigVersion versionId) {
        this.versionId = versionId;
    }

    public DocumentProperties getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(DocumentProperties propertyId) {
        this.propertyId = propertyId;
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
        if (!(object instanceof DocumentPropertyValues)) {
            return false;
        }
        DocumentPropertyValues other = (DocumentPropertyValues) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "eu.europa.ec.leos.repository.DocumentPropertyValues[ id=" + id + " ]";
    }
    
}
