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
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "DOCUMENT_CATEGORIES_V")
@NamedQueries({
    @NamedQuery(name = "DocumentCategoriesV.findAll", query = "SELECT d FROM DocumentCategoriesV d"),
    @NamedQuery(name = "DocumentCategoriesV.findById", query = "SELECT d FROM DocumentCategoriesV d WHERE d.id = :id"),
    @NamedQuery(name = "DocumentCategoriesV.findByCategoryCode", query = "SELECT d FROM DocumentCategoriesV d WHERE d.categoryCode = :categoryCode"),
    @NamedQuery(name = "DocumentCategoriesV.findByCategoryDesc", query = "SELECT d FROM DocumentCategoriesV d WHERE d.categoryDesc = :categoryDesc"),
    @NamedQuery(name = "DocumentCategoriesV.findByAuditCBy", query = "SELECT d FROM DocumentCategoriesV d WHERE d.auditCBy = :auditCBy"),
    @NamedQuery(name = "DocumentCategoriesV.findByAuditCDate", query = "SELECT d FROM DocumentCategoriesV d WHERE d.auditCDate = :auditCDate"),
    @NamedQuery(name = "DocumentCategoriesV.findByAuditLastMBy", query = "SELECT d FROM DocumentCategoriesV d WHERE d.auditLastMBy = :auditLastMBy"),
    @NamedQuery(name = "DocumentCategoriesV.findByAuditLastMDate", query = "SELECT d FROM DocumentCategoriesV d WHERE d.auditLastMDate = :auditLastMDate")})
public class DocumentCategoriesV implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID", updatable = false)
    private BigDecimal id;
    @Column(name = "CATEGORY_CODE", updatable = false)
    private String categoryCode;
    @Column(name = "CATEGORY_DESC", updatable = false)
    private String categoryDesc;
    @Column(name = "AUDIT_C_BY", updatable = false, length = 30)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", updatable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_BY", updatable = false, length = 30)
    private String auditLastMBy;
    @Column(name = "AUDIT_LAST_M_DATE", updatable = false)
    private LocalDateTime auditLastMDate;

    public DocumentCategoriesV() {
    }

    public DocumentCategoriesV(BigDecimal id) {
        this.id = id;
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

}
