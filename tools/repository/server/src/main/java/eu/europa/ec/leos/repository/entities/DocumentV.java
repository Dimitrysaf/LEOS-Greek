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
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "DOCUMENT_V")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "DocumentV.findAll", query = "SELECT d FROM DocumentV d"),
    @NamedQuery(name = "DocumentV.findByUniqueId", query = "SELECT d FROM DocumentV d WHERE d.uniqueId = :uniqueId"),
    @NamedQuery(name = "DocumentV.findByDocumentId", query = "SELECT d FROM DocumentV d WHERE d.documentId = :documentId"),
    @NamedQuery(name = "DocumentV.findByPackageId", query = "SELECT d FROM DocumentV d WHERE d.packageId = :packageId"),
    @NamedQuery(name = "DocumentV.findByVersionId", query = "SELECT d FROM DocumentV d WHERE d.versionId = :versionId"),
    @NamedQuery(name = "DocumentV.findByDocObjectId", query = "SELECT d FROM DocumentV d WHERE d.docObjectId = :docObjectId"),
    @NamedQuery(name = "DocumentV.findByCategoryId", query = "SELECT d FROM DocumentV d WHERE d.categoryId = :categoryId"),
    @NamedQuery(name = "DocumentV.findByCategoryCode", query = "SELECT d FROM DocumentV d WHERE d.categoryCode = :categoryCode"),
    @NamedQuery(name = "DocumentV.findByCategoryDesc", query = "SELECT d FROM DocumentV d WHERE d.categoryDesc = :categoryDesc"),
    @NamedQuery(name = "DocumentV.findByName", query = "SELECT d FROM DocumentV d WHERE d.name = :name"),
    @NamedQuery(name = "DocumentV.findByClonedFrom", query = "SELECT d FROM DocumentV d WHERE d.clonedFrom = :clonedFrom"),
    @NamedQuery(name = "DocumentV.findByRevisionStatus", query = "SELECT d FROM DocumentV d WHERE d.revisionStatus = :revisionStatus"),
    @NamedQuery(name = "DocumentV.findByContributionStatus", query = "SELECT d FROM DocumentV d WHERE d.contributionStatus = :contributionStatus"),
    @NamedQuery(name = "DocumentV.findByOriginRef", query = "SELECT d FROM DocumentV d WHERE d.originRef = :originRef"),
    @NamedQuery(name = "DocumentV.findByBaseRevisionId", query = "SELECT d FROM DocumentV d WHERE d.baseRevisionId = :baseRevisionId"),
    @NamedQuery(name = "DocumentV.findByLiveDiffingRequired", query = "SELECT d FROM DocumentV d WHERE d.liveDiffingRequired = :liveDiffingRequired"),
    @NamedQuery(name = "DocumentV.findByRef", query = "SELECT d FROM DocumentV d WHERE d.ref = :ref"),
    @NamedQuery(name = "DocumentV.findByProcedureType", query = "SELECT d FROM DocumentV d WHERE d.procedureType = :procedureType"),
    @NamedQuery(name = "DocumentV.findByDocTemplate", query = "SELECT d FROM DocumentV d WHERE d.docTemplate = :docTemplate"),
    @NamedQuery(name = "DocumentV.findByLanguage", query = "SELECT d FROM DocumentV d WHERE d.language = :language"),
    @NamedQuery(name = "DocumentV.findByDocStage", query = "SELECT d FROM DocumentV d WHERE d.docStage = :docStage"),
    @NamedQuery(name = "DocumentV.findByCreatedBy", query = "SELECT d FROM DocumentV d WHERE d.createdBy = :createdBy"),
    @NamedQuery(name = "DocumentV.findByCreatedOn", query = "SELECT d FROM DocumentV d WHERE d.createdOn = :createdOn"),
    @NamedQuery(name = "DocumentV.findByUpdatedOn", query = "SELECT d FROM DocumentV d WHERE d.updatedOn = :updatedOn"),
    @NamedQuery(name = "DocumentV.findByUpdatedBy", query = "SELECT d FROM DocumentV d WHERE d.updatedBy = :updatedBy"),
    @NamedQuery(name = "DocumentV.findByVersionLabel", query = "SELECT d FROM DocumentV d WHERE d.versionLabel = :versionLabel"),
    @NamedQuery(name = "DocumentV.findByVersionSeriesId", query = "SELECT d FROM DocumentV d WHERE d.versionSeriesId = :versionSeriesId"),
    @NamedQuery(name = "DocumentV.findByVersionType", query = "SELECT d FROM DocumentV d WHERE d.versionType = :versionType"),
    @NamedQuery(name = "DocumentV.findByIsLatestMajorVersion", query = "SELECT d FROM DocumentV d WHERE d.isLatestMajorVersion = :isLatestMajorVersion"),
    @NamedQuery(name = "DocumentV.findByIsLatestVersion", query = "SELECT d FROM DocumentV d WHERE d.isLatestVersion = :isLatestVersion"),
    @NamedQuery(name = "DocumentV.findByIsMajorVersion", query = "SELECT d FROM DocumentV d WHERE d.isMajorVersion = :isMajorVersion"),
    @NamedQuery(name = "DocumentV.findByIsVersionSeriesCheckedOut", query = "SELECT d FROM DocumentV d WHERE d.isVersionSeriesCheckedOut = :isVersionSeriesCheckedOut"),
    @NamedQuery(name = "DocumentV.findByActType", query = "SELECT d FROM DocumentV d WHERE d.actType = :actType"),
    @NamedQuery(name = "DocumentV.findByDocPurpose", query = "SELECT d FROM DocumentV d WHERE d.docPurpose = :docPurpose"),
    @NamedQuery(name = "DocumentV.findByDocType", query = "SELECT d FROM DocumentV d WHERE d.docType = :docType"),
    @NamedQuery(name = "DocumentV.findByEeaRelevance", query = "SELECT d FROM DocumentV d WHERE d.eeaRelevance = :eeaRelevance"),
    @NamedQuery(name = "DocumentV.findByTemplate", query = "SELECT d FROM DocumentV d WHERE d.template = :template"),
    @NamedQuery(name = "DocumentV.findByTitle", query = "SELECT d FROM DocumentV d WHERE d.title = :title")})
public class DocumentV implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "UNIQUE_ID", updatable = false)
    private String uniqueId;
    @Column(name = "DOCUMENT_ID", updatable = false)
    private BigDecimal documentId;
    @Column(name = "PACKAGE_ID", updatable = false)
    private BigDecimal packageId;
    @Column(name = "DOC_OBJECT_ID", updatable = false)
    private BigDecimal docObjectId;
    @Column(name = "CATEGORY_ID", updatable = false)
    private BigDecimal categoryId;
    @Column(name = "CATEGORY_CODE", updatable = false)
    private String categoryCode;
    @Column(name = "CATEGORY_DESC", updatable = false)
    private String categoryDesc;
    @Column(name = "NAME", updatable = false)
    private String name;
    @Column(name = "CLONED_FROM", updatable = false)
    private String clonedFrom;
    @Column(name = "REVISION_STATUS", updatable = false)
    private String revisionStatus;
    @Column(name = "CONTRIBUTION_STATUS", updatable = false)
    private String contributionStatus;
    @Column(name = "ORIGIN_REF", updatable = false)
    private String originRef;
    @Column(name = "BASE_REVISION_ID", updatable = false)
    private BigDecimal baseRevisionId;
    @Column(name = "LIVE_DIFFING_REQUIRED", updatable = false)
    private Boolean liveDiffingRequired;
    @Column(name = "REF", updatable = false)
    private String ref;
    @Column(name = "PROCEDURE_TYPE", updatable = false)
    private String procedureType;
    @Column(name = "DOC_TEMPLATE", updatable = false)
    private String docTemplate;
    @Column(name = "LANGUAGE", updatable = false)
    private String language;
    @Column(name = "DOC_STAGE", updatable = false)
    private String docStage;
    @Column(name = "DOC_AUDIT_C_BY", updatable = false)
    private String createdBy;
    @Column(name = "DOC_AUDIT_C_DATE", updatable = false)
    private LocalDateTime createdOn;
    @Column(name = "DOC_AUDIT_LAST_M_DATE", updatable = false)
    private LocalDateTime updatedOn;
    @Column(name = "DOC_AUDIT_LAST_M_BY", updatable = false)
    private String updatedBy;
    @Column(name = "VERSION_ID", updatable = false)
    private BigDecimal versionId;
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
    @Column(name = "IS_ARCHIVED", updatable = false)
    private Boolean isArchived;
    @Column(name = "COMMENTS", updatable = false)
    private String comments;
    @Column(name = "ACT_TYPE", updatable = false)
    private String actType;
    @Column(name = "DOC_PURPOSE", updatable = false)
    private String docPurpose;
    @Column(name = "DOC_TYPE", updatable = false)
    private String docType;
    @Column(name = "EEA_RELEVANCE", updatable = false)
    private Boolean eeaRelevance;
    @Column(name = "TEMPLATE", updatable = false)
    private String template;
    @Column(name = "TITLE", updatable = false)
    private String title;

    public DocumentV() {
    }

    public String getUniqueId() {
        return uniqueId;
    }

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
    }

    public BigDecimal getDocumentId() {
        return documentId;
    }

    public void setDocumentId(BigDecimal documentId) {
        this.documentId = documentId;
    }

    public BigDecimal getPackageId() {
        return packageId;
    }

    public void setPackageId(BigDecimal packageId) {
        this.packageId = packageId;
    }

    public BigDecimal getVersionId() {
        return versionId;
    }

    public void setVersionId(BigDecimal versionId) {
        this.versionId = versionId;
    }

    public BigDecimal getDocObjectId() {
        return docObjectId;
    }

    public void setDocObjectId(BigDecimal docObjectId) {
        this.docObjectId = docObjectId;
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

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getClonedFrom() {
        return clonedFrom;
    }

    public void setClonedFrom(String clonedFrom) {
        this.clonedFrom = clonedFrom;
    }

    public String getRevisionStatus() {
        return revisionStatus;
    }

    public void setRevisionStatus(String revisionStatus) {
        this.revisionStatus = revisionStatus;
    }

    public String getContributionStatus() {
        return contributionStatus;
    }

    public void setContributionStatus(String contributionStatus) {
        this.contributionStatus = contributionStatus;
    }

    public String getOriginRef() {
        return originRef;
    }

    public void setOriginRef(String originRef) {
        this.originRef = originRef;
    }

    public BigDecimal getBaseRevisionId() {
        return baseRevisionId;
    }

    public void setBaseRevisionId(BigDecimal baseRevisionId) {
        this.baseRevisionId = baseRevisionId;
    }

    public Boolean isLiveDiffingRequired() {
        return liveDiffingRequired;
    }

    public void setLiveDiffingRequired(Boolean liveDiffingRequired) {
        this.liveDiffingRequired = liveDiffingRequired;
    }

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public String getProcedureType() {
        return procedureType;
    }

    public void setProcedureType(String procedureType) {
        this.procedureType = procedureType;
    }

    public String getDocTemplate() {
        return docTemplate;
    }

    public void setDocTemplate(String docTemplate) {
        this.docTemplate = docTemplate;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getDocStage() {
        return docStage;
    }

    public void setDocStage(String docStage) {
        this.docStage = docStage;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String docAuditCBy) {
        this.createdBy = docAuditCBy;
    }

    public LocalDateTime getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(LocalDateTime docAuditCDate) {
        this.createdOn = docAuditCDate;
    }

    public LocalDateTime getUpdatedOn() {
        return updatedOn;
    }

    public void setUpdatedOn(LocalDateTime docAuditLastMDate) {
        this.updatedOn = docAuditLastMDate;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String docAuditLastMBy) {
        this.updatedBy = docAuditLastMBy;
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

    public Boolean isArchived() {
        return isArchived;
    }
    public String getActType() {
        return actType;
    }

    public void setActType(String actType) {
        this.actType = actType;
    }

    public String getDocPurpose() {
        return docPurpose;
    }

    public void setDocPurpose(String docPurpose) {
        this.docPurpose = docPurpose;
    }

    public String getDocType() {
        return docType;
    }

    public void setDocType(String docType) {
        this.docType = docType;
    }

    public Boolean getEeaRelevance() {
        return eeaRelevance;
    }

    public void setEeaRelevance(Boolean eeaRelevance) {
        this.eeaRelevance = eeaRelevance;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
