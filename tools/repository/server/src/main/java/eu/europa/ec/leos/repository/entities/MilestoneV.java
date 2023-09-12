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
import javax.persistence.Lob;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "MILESTONE_V")
@NamedQueries({
    @NamedQuery(name = "MilestoneV.findAll", query = "SELECT m FROM MilestoneV m"),
    @NamedQuery(name = "MilestoneV.findByUniqueId", query = "SELECT m FROM MilestoneV m WHERE m.uniqueId = :uniqueId"),
    @NamedQuery(name = "MilestoneV.findByDocumentId", query = "SELECT m FROM MilestoneV m WHERE m.documentId = :documentId"),
    @NamedQuery(name = "MilestoneV.findByPackageId", query = "SELECT m FROM MilestoneV m WHERE m.packageId = :packageId"),
    @NamedQuery(name = "MilestoneV.findByDocObjectId", query = "SELECT m FROM MilestoneV m WHERE m.docObjectId = :docObjectId"),
    @NamedQuery(name = "MilestoneV.findByCategoryId", query = "SELECT m FROM MilestoneV m WHERE m.categoryId = :categoryId"),
    @NamedQuery(name = "MilestoneV.findByName", query = "SELECT m FROM MilestoneV m WHERE m.name = :name"),
    @NamedQuery(name = "MilestoneV.findByClonedFrom", query = "SELECT m FROM MilestoneV m WHERE m.clonedFrom = :clonedFrom"),
    @NamedQuery(name = "MilestoneV.findByRevisionStatus", query = "SELECT m FROM MilestoneV m WHERE m.revisionStatus = :revisionStatus"),
    @NamedQuery(name = "MilestoneV.findByContributionStatus", query = "SELECT m FROM MilestoneV m WHERE m.contributionStatus = :contributionStatus"),
    @NamedQuery(name = "MilestoneV.findByOriginRef", query = "SELECT m FROM MilestoneV m WHERE m.originRef = :originRef"),
    @NamedQuery(name = "MilestoneV.findByBaseRevisionId", query = "SELECT m FROM MilestoneV m WHERE m.baseRevisionId = :baseRevisionId"),
    @NamedQuery(name = "MilestoneV.findByLiveDiffingRequired", query = "SELECT m FROM MilestoneV m WHERE m.liveDiffingRequired = :liveDiffingRequired"),
    @NamedQuery(name = "MilestoneV.findByRef", query = "SELECT m FROM MilestoneV m WHERE m.ref = :ref"),
    @NamedQuery(name = "MilestoneV.findByProcedureType", query = "SELECT m FROM MilestoneV m WHERE m.procedureType = :procedureType"),
    @NamedQuery(name = "MilestoneV.findByDocTemplate", query = "SELECT m FROM MilestoneV m WHERE m.docTemplate = :docTemplate"),
    @NamedQuery(name = "MilestoneV.findByLanguage", query = "SELECT m FROM MilestoneV m WHERE m.language = :language"),
    @NamedQuery(name = "MilestoneV.findByDocStage", query = "SELECT m FROM MilestoneV m WHERE m.docStage = :docStage"),
    @NamedQuery(name = "MilestoneV.findByCreatedBy", query = "SELECT m FROM MilestoneV m WHERE m.createdBy = :createdBy"),
    @NamedQuery(name = "MilestoneV.findByCreatedOn", query = "SELECT m FROM MilestoneV m WHERE m.createdOn = :createdOn"),
    @NamedQuery(name = "MilestoneV.findByUpdatedOn", query = "SELECT m FROM MilestoneV m WHERE m.updatedOn = :updatedOn"),
    @NamedQuery(name = "MilestoneV.findByUpdatedBy", query = "SELECT m FROM MilestoneV m WHERE m.updatedBy = :updatedBy"),
    @NamedQuery(name = "MilestoneV.findByMilestoneId", query = "SELECT m FROM MilestoneV m WHERE m.milestoneId = :milestoneId"),
    @NamedQuery(name = "MilestoneV.findByJobDate", query = "SELECT m FROM MilestoneV m WHERE m.jobDate = :jobDate"),
    @NamedQuery(name = "MilestoneV.findByMilestoneComments", query = "SELECT m FROM MilestoneV m WHERE m.milestoneComments = :milestoneComments"),
    @NamedQuery(name = "MilestoneV.findByStatus", query = "SELECT m FROM MilestoneV m WHERE m.status = :status"),
    @NamedQuery(name = "MilestoneV.findByAuditCBy", query = "SELECT m FROM MilestoneV m WHERE m.auditCBy = :auditCBy"),
    @NamedQuery(name = "MilestoneV.findByAuditCDate", query = "SELECT m FROM MilestoneV m WHERE m.auditCDate = :auditCDate"),
    @NamedQuery(name = "MilestoneV.findByAuditLastMDate", query = "SELECT m FROM MilestoneV m WHERE m.auditLastMDate = :auditLastMDate"),
    @NamedQuery(name = "MilestoneV.findByAuditLastMBy", query = "SELECT m FROM MilestoneV m WHERE m.auditLastMBy = :auditLastMBy")})
public class MilestoneV implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "UNIQUE_ID")
    private String uniqueId;
    @Column(name = "DOCUMENT_ID", updatable = false)
    private BigDecimal documentId;
    @Column(name = "PACKAGE_ID", updatable = false)
    private BigDecimal packageId;
    @Column(name = "PACKAGE_NAME", updatable = false)
    private String packageName;
    @Column(name = "DOC_OBJECT_ID", updatable = false)
    private BigDecimal docObjectId;
    @Column(name = "CATEGORY_ID", updatable = false)
    private BigDecimal categoryId;
    @Column(name = "CATEGORY_CODE", updatable = false)
    private String categoryCode;
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
    @Column(name = "MILESTONE_ID", updatable = false)
    private BigDecimal milestoneId;
    @Column(name = "JOB_ID", updatable = false)
    private String jobId;
    @Column(name = "JOB_DATE", updatable = false)
    private LocalDateTime jobDate;
    @Column(name = "EXPORT_STATUS", length = 30)
    private String exportStatus;
    @Column(name = "EXPORT_DATE")
    private LocalDateTime exportDate;
    @Column(name = "MILESTONE_COMMENTS", updatable = false)
    private String milestoneComments;
    @Lob
    @Column(name = "CONTENT", updatable = false)
    private byte[] content;
    @Column(name = "STATUS", updatable = false)
    private String status;
    @Column(name = "AUDIT_C_BY", updatable = false)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", updatable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_DATE", updatable = false)
    private LocalDateTime auditLastMDate;
    @Column(name = "AUDIT_LAST_M_BY", updatable = false)
    private String auditLastMBy;

    public MilestoneV() {
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

    public void setCreatedOn(LocalDateTime  docAuditCDate) {
        this.createdOn = docAuditCDate;
    }

    public LocalDateTime getUpdatedOn() {
        return updatedOn;
    }

    public void setUpdatedOn(LocalDateTime  docAuditLastMDate) {
        this.updatedOn = docAuditLastMDate;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String docAuditLastMBy) {
        this.updatedBy = docAuditLastMBy;
    }

    public String getJobId() {
        return jobId;
    }

    public LocalDateTime getJobDate() {
        return jobDate;
    }

    public BigDecimal getMilestoneId() {
        return milestoneId;
    }

    public String getMilestoneComments() {
        return milestoneComments;
    }

    public void setMilestoneComments(String milestoneComments) {
        this.milestoneComments = milestoneComments;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public void setAuditCDate(LocalDateTime  auditCDate) {
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

    public void setAuditLastMBy(String  auditLastMBy) {
        this.auditLastMBy = auditLastMBy;
    }

    public String getExportStatus() {
        return exportStatus;
    }

    public LocalDateTime getExportDate() {
        return exportDate;
    }

    public String getPackageName() {
        return packageName;
    }

    public String getCategoryCode() {
        return categoryCode;
    }
}
