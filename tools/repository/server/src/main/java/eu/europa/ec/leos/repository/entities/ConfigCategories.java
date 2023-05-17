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
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "CONFIG_CATEGORIES")
@NamedQueries({
    @NamedQuery(name = "ConfigCategories.findAll", query = "SELECT c FROM ConfigCategories c"),
    @NamedQuery(name = "ConfigCategories.findById", query = "SELECT c FROM ConfigCategories c WHERE c.id = :id"),
    @NamedQuery(name = "ConfigCategories.findByCategoryCode", query = "SELECT c FROM ConfigCategories c WHERE c.categoryCode = :categoryCode"),
    @NamedQuery(name = "ConfigCategories.findByCategoryDesc", query = "SELECT c FROM ConfigCategories c WHERE c.categoryDesc = :categoryDesc"),
    @NamedQuery(name = "ConfigCategories.findByAuditCBy", query = "SELECT c FROM ConfigCategories c WHERE c.auditCBy = :auditCBy"),
    @NamedQuery(name = "ConfigCategories.findByAuditCDate", query = "SELECT c FROM ConfigCategories c WHERE c.auditCDate = :auditCDate"),
    @NamedQuery(name = "ConfigCategories.findByAuditLastMBy", query = "SELECT c FROM ConfigCategories c WHERE c.auditLastMBy = :auditLastMBy"),
    @NamedQuery(name = "ConfigCategories.findByAuditLastMDate", query = "SELECT c FROM ConfigCategories c WHERE c.auditLastMDate = :auditLastMDate")})
public class ConfigCategories implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    private BigDecimal id;
    @Column(name = "CATEGORY_CODE", nullable = false, length = 30)
    private String categoryCode;
    @Column(name = "CATEGORY_DESC", nullable = false, length = 100)
    private String categoryDesc;
    @Column(name = "AUDIT_C_BY", nullable = false, length = 30)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", nullable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_BY", length = 30)
    private String auditLastMBy;
    @Column(name = "AUDIT_LAST_M_DATE")
    private LocalDateTime auditLastMDate;

    public ConfigCategories() {
    }

    public ConfigCategories(BigDecimal id) {
        this.id = id;
    }

    public ConfigCategories(BigDecimal id, String categoryCode, String categoryDesc, String auditCBy, LocalDateTime auditCDate) {
        this.id = id;
        this.categoryCode = categoryCode;
        this.categoryDesc = categoryDesc;
        this.auditCBy = auditCBy;
        this.auditCDate = auditCDate;
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

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof ConfigCategories)) {
            return false;
        }
        ConfigCategories other = (ConfigCategories) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "eu.europa.ec.leos.repository.entities.ConfigCategories[ id=" + id + " ]";
    }
    
}
