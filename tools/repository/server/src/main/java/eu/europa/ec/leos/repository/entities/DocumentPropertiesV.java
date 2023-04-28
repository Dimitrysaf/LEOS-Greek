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
@Table(name = "DOCUMENT_PROPERTIES_V")
@NamedQueries({
    @NamedQuery(name = "DocumentPropertiesV.findAll", query = "SELECT d FROM DocumentPropertiesV d"),
    @NamedQuery(name = "DocumentPropertiesV.findById", query = "SELECT d FROM DocumentPropertiesV d WHERE d.id = :id"),
    @NamedQuery(name = "DocumentPropertiesV.findByObjectId", query = "SELECT d FROM DocumentPropertiesV d WHERE d.objectId = :objectId"),
    @NamedQuery(name = "DocumentPropertiesV.findByPackageId", query = "SELECT d FROM DocumentPropertiesV d WHERE d.packageId = :packageId"),
    @NamedQuery(name = "DocumentPropertiesV.findByDocTypeId", query = "SELECT d FROM DocumentPropertiesV d WHERE d.docTypeId = :docTypeId"),
    @NamedQuery(name = "DocumentPropertiesV.findByCategoryId", query = "SELECT d FROM DocumentPropertiesV d WHERE d.categoryId = :categoryId"),
    @NamedQuery(name = "DocumentPropertiesV.findByCategoryCode", query = "SELECT d FROM DocumentPropertiesV d WHERE d.categoryCode = :categoryCode"),
    @NamedQuery(name = "DocumentPropertiesV.findByCategoryDesc", query = "SELECT d FROM DocumentPropertiesV d WHERE d.categoryDesc = :categoryDesc"),
    @NamedQuery(name = "DocumentPropertiesV.findByName", query = "SELECT d FROM DocumentPropertiesV d WHERE d.name = :name"),
    @NamedQuery(name = "DocumentPropertiesV.findByVersionId", query = "SELECT d FROM DocumentPropertiesV d WHERE d.versionId = :versionId"),
    @NamedQuery(name = "DocumentPropertiesV.findByVersionLabel", query = "SELECT d FROM DocumentPropertiesV d WHERE d.versionLabel = :versionLabel"),
    @NamedQuery(name = "DocumentPropertiesV.findByVersionSeriesId", query = "SELECT d FROM DocumentPropertiesV d WHERE d.versionSeriesId = :versionSeriesId"),
    @NamedQuery(name = "DocumentPropertiesV.findByVersionType", query = "SELECT d FROM DocumentPropertiesV d WHERE d.versionType = :versionType"),
    @NamedQuery(name = "DocumentPropertiesV.findByPropId", query = "SELECT d FROM DocumentPropertiesV d WHERE d.propId = :propId"),
    @NamedQuery(name = "DocumentPropertiesV.findByPropertyName", query = "SELECT d FROM DocumentPropertiesV d WHERE d.propertyName = :propertyName"),
    @NamedQuery(name = "DocumentPropertiesV.findByPropValueId", query = "SELECT d FROM DocumentPropertiesV d WHERE d.propValueId = :propValueId"),
    @NamedQuery(name = "DocumentPropertiesV.findByPropertyValue", query = "SELECT d FROM DocumentPropertiesV d WHERE d.propertyValue = :propertyValue"),
    @NamedQuery(name = "DocumentPropertiesV.findByAuditCBy", query = "SELECT d FROM DocumentPropertiesV d WHERE d.auditCBy = :auditCBy"),
    @NamedQuery(name = "DocumentPropertiesV.findByAuditCDate", query = "SELECT d FROM DocumentPropertiesV d WHERE d.auditCDate = :auditCDate"),
    @NamedQuery(name = "DocumentPropertiesV.findByAuditLastMBy", query = "SELECT d FROM DocumentPropertiesV d WHERE d.auditLastMBy = :auditLastMBy"),
    @NamedQuery(name = "DocumentPropertiesV.findByAuditLastMDate", query = "SELECT d FROM DocumentPropertiesV d WHERE d.auditLastMDate = :auditLastMDate")})
public class DocumentPropertiesV implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID", updatable = false, precision = 22, scale = 0)
    private BigDecimal id;
    @Column(name = "OBJECT_ID", updatable = false, precision = 22, scale = 0)
    private BigDecimal objectId;
    @Column(name = "PACKAGE_ID", updatable = false, precision = 22, scale = 0)
    private BigDecimal packageId;
    @Column(name = "DOC_TYPE_ID", updatable = false, precision = 22, scale = 0)
    private BigDecimal docTypeId;
    @Column(name = "CATEGORY_ID", updatable = false, precision = 22, scale = 0)
    private BigDecimal categoryId;
    @Column(name = "CATEGORY_CODE", updatable = false)
    private String categoryCode;
    @Column(name = "CATEGORY_DESC", updatable = false)
    private String categoryDesc;
    @Column(name = "NAME", updatable = false)
    private String name;
    @Column(name = "VERSION_ID", updatable = false, precision = 22, scale = 0)
    private BigDecimal versionId;
    @Column(name = "VERSION_LABEL", updatable = false)
    private String versionLabel;
    @Column(name = "VERSION_SERIES_ID", updatable = false)
    private String versionSeriesId;
    @Column(name = "VERSION_TYPE", updatable = false)
    private String versionType;
    @Column(name = "PROP_ID", updatable = false, precision = 22, scale = 0)
    private BigDecimal propId;
    @Column(name = "PROPERTY_NAME", updatable = false)
    private String propertyName;
    @Column(name = "PROP_VALUE_ID", updatable = false)
    private BigDecimal propValueId;
    @Column(name = "PROPERTY_VALUE", updatable = false, precision = 22, scale = 0)
    private String propertyValue;
    @Column(name = "AUDIT_C_BY", updatable = false)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", updatable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_BY", updatable = false)
    private String auditLastMBy;
    @Column(name = "AUDIT_LAST_M_DATE", updatable = false)
    private LocalDateTime auditLastMDate;

    public DocumentPropertiesV() {
    }

    public BigDecimal getId() {
        return id;
    }

    public void setId(BigDecimal id) {
        this.id = id;
    }

    public BigDecimal getObjectId() {
        return objectId;
    }

    public void setObjectId(BigDecimal objectId) {
        this.objectId = objectId;
    }

    public BigDecimal getPackageId() {
        return packageId;
    }

    public void setPackageId(BigDecimal packageId) {
        this.packageId = packageId;
    }

    public BigDecimal getDocTypeId() {
        return docTypeId;
    }

    public void setDocTypeId(BigDecimal docTypeId) {
        this.docTypeId = docTypeId;
    }

    public BigDecimal getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(BigDecimal categoryId) {
        this.categoryId = categoryId;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getVersionId() {
        return versionId;
    }

    public void setVersionId(BigDecimal versionId) {
        this.versionId = versionId;
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

    public BigDecimal getPropId() {
        return propId;
    }

    public void setPropId(BigDecimal propId) {
        this.propId = propId;
    }

    public String getPropertyName() {
        return propertyName;
    }

    public void setPropertyName(String propertyName) {
        this.propertyName = propertyName;
    }

    public BigDecimal getPropValueId() {
        return propValueId;
    }

    public void setPropValueId(BigDecimal propValueId) {
        this.propValueId = propValueId;
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
    
}
