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
@Table(name = "DOCUMENT_MILESTONE_LIST")
@NamedQueries({
    @NamedQuery(name = "DocumentMilestoneList.findAll", query = "SELECT d FROM DocumentMilestoneList d"),
    @NamedQuery(name = "DocumentMilestoneList.findById", query = "SELECT d FROM DocumentMilestoneList d WHERE d.id = :id"),
    @NamedQuery(name = "DocumentMilestoneList.findByContainedDocuments", query = "SELECT d FROM DocumentMilestoneList d WHERE d.containedDocuments = :containedDocuments"),
    @NamedQuery(name = "DocumentMilestoneList.findByAuditCBy", query = "SELECT d FROM DocumentMilestoneList d WHERE d.auditCBy = :auditCBy"),
    @NamedQuery(name = "DocumentMilestoneList.findByAuditCDate", query = "SELECT d FROM DocumentMilestoneList d WHERE d.auditCDate = :auditCDate"),
    @NamedQuery(name = "DocumentMilestoneList.findByAuditLastMBy", query = "SELECT d FROM DocumentMilestoneList d WHERE d.auditLastMBy = :auditLastMBy"),
    @NamedQuery(name = "DocumentMilestoneList.findByAuditLastMDate", query = "SELECT d FROM DocumentMilestoneList d WHERE d.auditLastMDate = :auditLastMDate")})
public class DocumentMilestoneList implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private BigDecimal id;
    @Column(name = "CONTAINED_DOCUMENTS", nullable = false)
    private String containedDocuments;
    @Column(name = "AUDIT_C_BY", nullable = false, length = 30)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", nullable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_BY")
    private String auditLastMBy;
    @Column(name = "AUDIT_LAST_M_DATE")
    private LocalDateTime auditLastMDate;
    @JoinColumn(name = "MILESTONE_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private DocumentMilestone milestoneId;

    public DocumentMilestoneList() {
    }

    public DocumentMilestoneList(BigDecimal id) {
        this.id = id;
    }

    public DocumentMilestoneList(BigDecimal id, String containedDocuments, String auditCBy, LocalDateTime auditCDate) {
        this.id = id;
        this.containedDocuments = containedDocuments;
        this.auditCBy = auditCBy;
        this.auditCDate = auditCDate;
    }

    public BigDecimal getId() {
        return id;
    }

    public void setId(BigDecimal id) {
        this.id = id;
    }

    public String getContainedDocuments() {
        return containedDocuments;
    }

    public void setContainedDocuments(String containedDocuments) {
        this.containedDocuments = containedDocuments;
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

    public DocumentMilestone getMilestoneId() {
        return milestoneId;
    }

    public void setMilestoneId(DocumentMilestone milestoneId) {
        this.milestoneId = milestoneId;
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
        if (!(object instanceof DocumentMilestoneList)) {
            return false;
        }
        DocumentMilestoneList other = (DocumentMilestoneList) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "eu.europa.ec.leos.repository.entities.DocumentMilestoneList[ id=" + id + " ]";
    }
    
}
