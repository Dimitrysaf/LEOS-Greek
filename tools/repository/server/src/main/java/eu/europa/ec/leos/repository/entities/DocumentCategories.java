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
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlTransient;

@Entity
@Table(name = "DOCUMENT_CATEGORIES")
@NamedQueries({
    @NamedQuery(name = "DocumentCategories.findAll", query = "SELECT d FROM DocumentCategories d"),
    @NamedQuery(name = "DocumentCategories.findById", query = "SELECT d FROM DocumentCategories d WHERE d.id = :id"),
    @NamedQuery(name = "DocumentCategories.findByCategoryCode", query = "SELECT d FROM DocumentCategories d WHERE d.categoryCode = :categoryCode"),
    @NamedQuery(name = "DocumentCategories.findByCategoryDesc", query = "SELECT d FROM DocumentCategories d WHERE d.categoryDesc = :categoryDesc"),
    @NamedQuery(name = "DocumentCategories.findByAuditCBy", query = "SELECT d FROM DocumentCategories d WHERE d.auditCBy = :auditCBy"),
    @NamedQuery(name = "DocumentCategories.findByAuditCDate", query = "SELECT d FROM DocumentCategories d WHERE d.auditCDate = :auditCDate"),
    @NamedQuery(name = "DocumentCategories.findByAuditLastMBy", query = "SELECT d FROM DocumentCategories d WHERE d.auditLastMBy = :auditLastMBy"),
    @NamedQuery(name = "DocumentCategories.findByAuditLastMDate", query = "SELECT d FROM DocumentCategories d WHERE d.auditLastMDate = :auditLastMDate")})
public class DocumentCategories implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private BigDecimal id;
    @Column(name = "CATEGORY_CODE", nullable = false, length = 30)
    private String categoryCode;
    @Column(name = "CATEGORY_DESC", nullable = false, length = 100)
    private String categoryDesc;
    @Column(name = "AUDIT_C_BY", nullable = false, length = 30)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", nullable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_DATE")
    private LocalDateTime auditLastMDate;
    @Column(name = "AUDIT_LAST_M_BY", length = 30)
    private String auditLastMBy;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "docCategoryId")
    private Collection<DocumentProperties> documentPropertiesCollection;

    public DocumentCategories() {
    }

    public DocumentCategories(BigDecimal id) {
        this.id = id;
    }

    public DocumentCategories(BigDecimal id, String categoryCode, String categoryDesc, String createdBy, LocalDateTime creationDate) {
        this.id = id;
        this.categoryCode = categoryCode;
        this.categoryDesc = categoryDesc;
        this.auditCBy = createdBy;
        this.auditCDate = creationDate;
    }

    public BigDecimal getId() {
        return id;
    }

    public void setId(BigDecimal id) {
        this.id = id;
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

    @XmlTransient
    public Collection<DocumentProperties> getDocumentPropertiesCollection() {
        return documentPropertiesCollection;
    }

    public void setDocumentPropertiesCollection(Collection<DocumentProperties> documentPropertiesCollection) {
        this.documentPropertiesCollection = documentPropertiesCollection;
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
        if (!(object instanceof DocumentCategories)) {
            return false;
        }
        DocumentCategories other = (DocumentCategories) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "eu.europa.ec.leos.repository.entity.DocumentCategories[ id=" + id + " ]";
    }
    
}
