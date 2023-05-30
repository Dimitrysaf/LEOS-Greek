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
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlTransient;

@Entity
@Table(name = "DOCUMENT_MILESTONE")
@NamedQueries({
        @NamedQuery(name = "DocumentMilestone.findAll", query = "SELECT d FROM DocumentMilestone d"),
        @NamedQuery(name = "DocumentMilestone.findById", query = "SELECT d FROM DocumentMilestone d WHERE d.id = :id"),
        @NamedQuery(name = "DocumentMilestone.findByDocumentId", query = "SELECT d FROM DocumentMilestone d WHERE d.documentId = :documentId"),
        @NamedQuery(name = "DocumentMilestone.findByJobDate", query = "SELECT d FROM DocumentMilestone d WHERE d.jobDate = :jobDate"),
        @NamedQuery(name = "DocumentMilestone.findByClonedMilestoneId", query = "SELECT d FROM DocumentMilestone d WHERE d.clonedMilestoneId = :clonedMilestoneId"),
        @NamedQuery(name = "DocumentMilestone.findByMilestoneComments", query = "SELECT d FROM DocumentMilestone d WHERE d.milestoneComments = :milestoneComments"),
        @NamedQuery(name = "DocumentMilestone.findByStatus", query = "SELECT d FROM DocumentMilestone d WHERE d.status = :status"),
        @NamedQuery(name = "DocumentMilestone.findByAuditCBy", query = "SELECT d FROM DocumentMilestone d WHERE d.auditCBy = :auditCBy"),
        @NamedQuery(name = "DocumentMilestone.findByAuditCDate", query = "SELECT d FROM DocumentMilestone d WHERE d.auditCDate = :auditCDate"),
        @NamedQuery(name = "DocumentMilestone.findByAuditLastMBy", query = "SELECT d FROM DocumentMilestone d WHERE d.auditLastMBy = :auditLastMBy"),
        @NamedQuery(name = "DocumentMilestone.findByAuditLastMDate", query = "SELECT d FROM DocumentMilestone d WHERE d.auditLastMDate = :auditLastMDate"),
        @NamedQuery(name = "DocumentMilestone.findByMilestoneId", query = "SELECT d FROM DocumentMilestone d WHERE d.milestoneId = :milestoneId"),
        @NamedQuery(name = "DocumentMilestone.findByExportStatus", query = "SELECT d FROM DocumentMilestone d WHERE d.exportStatus = :exportStatus"),
        @NamedQuery(name = "DocumentMilestone.findByExportDate", query = "SELECT d FROM DocumentMilestone d WHERE d.exportDate = :exportDate")})
public class DocumentMilestone implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private BigDecimal id;
    @Column(name = "JOB_DATE", nullable = false)
    private LocalDateTime jobDate;
    @Column(name = "CLONED_MILESTONE_ID", precision = 22, scale = 0)
    private BigDecimal clonedMilestoneId;
    @Column(name = "MILESTONE_COMMENTS", length = 4000)
    private String milestoneComments;
    @Lob
    @Column(name = "CONTENT")
    private byte[] content;
    @Column(name = "STATUS", nullable = false, length = 30)
    private String status;
    @Column(name = "AUDIT_C_BY", nullable = false, length = 30)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", nullable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_DATE")
    private LocalDateTime auditLastMDate;
    @Column(name = "AUDIT_LAST_M_BY", length = 30)
    private String auditLastMBy;
    @Column(name = "EXPORT_STATUS", length = 30)
    private String exportStatus;
    @Column(name = "EXPORT_DATE")
    private LocalDateTime exportDate;
    @Column(name = "MILESTONE_ID", nullable = false, precision = 22, scale = 0)
    private BigDecimal milestoneId;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "milestoneId")
    private Collection<DocumentMilestoneComments> documentMilestoneCommentsCollection;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "milestoneId")
    private Collection<DocumentMilestoneList> documentMilestoneListCollection;
    @JoinColumn(name = "DOCUMENT_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Document documentId;

    public DocumentMilestone() {
    }

    public DocumentMilestone(BigDecimal id) {
        this.id = id;
    }

    public DocumentMilestone(BigDecimal id, LocalDateTime jobDate, String status, String auditCBy, LocalDateTime auditCDate, BigDecimal milestoneId) {
        this.id = id;
        this.jobDate = jobDate;
        this.status = status;
        this.auditCBy = auditCBy;
        this.auditCDate = auditCDate;
        this.milestoneId = milestoneId;
    }

    public BigDecimal getId() {
        return id;
    }

    public void setId(BigDecimal id) {
        this.id = id;
    }

    public LocalDateTime getJobDate() {
        return jobDate;
    }

    public void setJobDate(LocalDateTime jobDate) {
        this.jobDate = jobDate;
    }

    public BigDecimal getClonedMilestoneId() {
        return clonedMilestoneId;
    }

    public void setClonedMilestoneId(BigDecimal clonedMilestoneId) {
        this.clonedMilestoneId = clonedMilestoneId;
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

    public BigDecimal getMilestoneId() {
        return milestoneId;
    }

    public void setMilestoneId(BigDecimal milestoneId) {
        this.milestoneId = milestoneId;
    }

    public String getExportStatus() {
        return exportStatus;
    }

    public void setExportStatus(String exportStatus) {
        this.exportStatus = exportStatus;
    }

    public LocalDateTime getExportDate() {
        return exportDate;
    }

    public void setExportDate(LocalDateTime exportDate) {
        this.exportDate = exportDate;
    }

    @XmlTransient
    public Collection<DocumentMilestoneComments> getDocumentMilestoneCommentsCollection() {
        return documentMilestoneCommentsCollection;
    }

    public void setDocumentMilestoneCommentsCollection(Collection<DocumentMilestoneComments> documentMilestoneCommentsCollection) {
        this.documentMilestoneCommentsCollection = documentMilestoneCommentsCollection;
    }

    @XmlTransient
    public Collection<DocumentMilestoneList> getDocumentMilestoneListCollection() {
        return documentMilestoneListCollection;
    }

    public void setDocumentMilestoneListCollection(Collection<DocumentMilestoneList> documentMilestoneListCollection) {
        this.documentMilestoneListCollection = documentMilestoneListCollection;
    }

    public Document getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Document documentId) {
        this.documentId = documentId;
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
        if (!(object instanceof DocumentMilestone)) {
            return false;
        }
        DocumentMilestone other = (DocumentMilestone) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "eu.europa.ec.leos.repository.domain.DocumentMilestone[ id=" + id + " ]";
    }
    
}
