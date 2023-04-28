/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package eu.europa.ec.leos.repository.entities;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import javax.persistence.Basic;
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
@Table(name = "DOCUMENT")
@NamedQueries({
        @NamedQuery(name = "Document.findAll", query = "SELECT d FROM Document d"),
        @NamedQuery(name = "Document.findById", query = "SELECT d FROM Document d WHERE d.id = :id"),
        @NamedQuery(name = "Document.findByObjectId", query = "SELECT d FROM Document d WHERE d.objectId = :objectId"),
        @NamedQuery(name = "Document.findByName", query = "SELECT d FROM Document d WHERE d.name = :name"),
        @NamedQuery(name = "Document.findByClonedFrom", query = "SELECT d FROM Document d WHERE d.clonedFrom = :clonedFrom"),
        @NamedQuery(name = "Document.findByCollaborators", query = "SELECT d FROM Document d WHERE d.collaborators = :collaborators"),
        @NamedQuery(name = "Document.findByRevisionStatus", query = "SELECT d FROM Document d WHERE d.revisionStatus = :revisionStatus"),
        @NamedQuery(name = "Document.findByContributionStatus", query = "SELECT d FROM Document d WHERE d.contributionStatus = :contributionStatus"),
        @NamedQuery(name = "Document.findByOriginalRef", query = "SELECT d FROM Document d WHERE d.originalRef = :originalRef"),
        @NamedQuery(name = "Document.findByBaseRevisionId", query = "SELECT d FROM Document d WHERE d.baseRevisionId = :baseRevisionId"),
        @NamedQuery(name = "Document.findByLiveDiffingRequired", query = "SELECT d FROM Document d WHERE d.liveDiffingRequired = :liveDiffingRequired"),
        @NamedQuery(name = "Document.findByRef", query = "SELECT d FROM Document d WHERE d.ref = :ref"),
        @NamedQuery(name = "Document.findByProcedureType", query = "SELECT d FROM Document d WHERE d.procedureType = :procedureType"),
        @NamedQuery(name = "Document.findByDocTemplate", query = "SELECT d FROM Document d WHERE d.docTemplate = :docTemplate"),
        @NamedQuery(name = "Document.findByLanguage", query = "SELECT d FROM Document d WHERE d.language = :language"),
        @NamedQuery(name = "Document.findByDocStage", query = "SELECT d FROM Document d WHERE d.docStage = :docStage"),
        @NamedQuery(name = "Document.findByIsPrivateWorkingCopy", query = "SELECT d FROM Document d WHERE d.isPrivateWorkingCopy = :isPrivateWorkingCopy"),
        @NamedQuery(name = "Document.findByAuditCBy", query = "SELECT d FROM Document d WHERE d.auditCBy = :auditCBy"),
        @NamedQuery(name = "Document.findByAuditCDate", query = "SELECT d FROM Document d WHERE d.auditCDate = :auditCDate"),
        @NamedQuery(name = "Document.findByAuditLastMDate", query = "SELECT d FROM Document d WHERE d.auditLastMDate = :auditLastMDate"),
        @NamedQuery(name = "Document.findByAuditLastMBy", query = "SELECT d FROM Document d WHERE d.auditLastMBy = :auditLastMBy")})
public class Document implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private BigDecimal id;
    @Column(name = "OBJECT_ID", precision = 22, scale = 0)
    private BigDecimal objectId;
    @Column(name = "NAME", nullable = false, length = 400)
    private String name;
    @Column(name = "CLONED_FROM", precision = 22, scale = 0)
    private BigDecimal clonedFrom;
    @Column(name = "COLLABORATORS", nullable = false, length = 400)
    private String collaborators;
    @Column(name = "REVISION_STATUS", length = 30)
    private String revisionStatus;
    @Column(name = "CONTRIBUTION_STATUS", length = 30)
    private String contributionStatus;
    @Column(name = "ORIGINAL_REF", precision = 22, scale = 0)
    private BigDecimal originalRef;
    @Column(name = "BASE_REVISION_ID", precision = 22, scale = 0)
    private BigDecimal baseRevisionId;
    @Column(name = "LIVE_DIFFING_REQUIRED")
    private Boolean liveDiffingRequired;
    @Column(name = "REF", nullable = false, length = 400)
    private String ref;
    @Column(name = "PROCEDURE_TYPE", length = 100)
    private String procedureType;
    @Column(name = "DOC_TEMPLATE", nullable = false, length = 400)
    private String docTemplate;
    @Column(name = "LANGUAGE", nullable = false, length = 10)
    private String language;
    @Column(name = "DOC_STAGE", nullable = false, length = 400)
    private String docStage;
    @Column(name = "IS_PRIVATE_WORKING_COPY")
    private Boolean isPrivateWorkingCopy;
    @Basic(optional = false)
    @Column(name = "AUDIT_C_BY", nullable = false, length = 30)
    private String auditCBy;
    @Basic(optional = false)
    @Column(name = "AUDIT_C_DATE")
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_DATE")
    private LocalDateTime auditLastMDate;
    @Column(name = "AUDIT_LAST_M_BY", length = 30)
    private String auditLastMBy;
    @JoinColumn(name = "PACKAGE_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Package packageId;

    public Document() {
    }

    public Document(BigDecimal id) {
        this.id = id;
    }

    public Document(BigDecimal id, String name, String collaborators, String ref, String docTemplate, String language, String docStage,
                    String auditCBy, LocalDateTime auditCDate) {
        this.id = id;
        this.name = name;
        this.collaborators = collaborators;
        this.ref = ref;
        this.docTemplate = docTemplate;
        this.language = language;
        this.docStage = docStage;
        this.auditCBy = auditCBy;
        this.auditCDate = auditCDate;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getClonedFrom() {
        return clonedFrom;
    }

    public void setClonedFrom(BigDecimal clonedFrom) {
        this.clonedFrom = clonedFrom;
    }

    public String getCollaborators() {
        return collaborators;
    }

    public void setCollaborators(String collaborators) {
        this.collaborators = collaborators;
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

    public BigDecimal getOriginalRef() {
        return originalRef;
    }

    public void setOriginalRef(BigDecimal originalRef) {
        this.originalRef = originalRef;
    }

    public BigDecimal getBaseRevisionId() {
        return baseRevisionId;
    }

    public void setBaseRevisionId(BigDecimal baseRevisionId) {
        this.baseRevisionId = baseRevisionId;
    }

    public Boolean getLiveDiffingRequired() {
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

    public Boolean getIsPrivateWorkingCopy() {
        return isPrivateWorkingCopy;
    }

    public void setIsPrivateWorkingCopy(Boolean isPrivateWorkingCopy) {
        this.isPrivateWorkingCopy = isPrivateWorkingCopy;
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

    public Package getPackageId() {
        return packageId;
    }

    public void setPackageId(Package packageId) {
        this.packageId = packageId;
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
        if (!(object instanceof Document)) {
            return false;
        }
        Document other = (Document) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "eu.europa.ec.leos.repository.entities.Document[ id=" + id + " ]";
    }

}
