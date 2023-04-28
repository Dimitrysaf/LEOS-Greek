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
@Table(name = "MILESTONE_LIST_V")
@NamedQueries({
        @NamedQuery(name = "MilestoneListV.findAll", query = "SELECT m FROM MilestoneListV m"),
        @NamedQuery(name = "MilestoneListV.findByUniqueId", query = "SELECT m FROM MilestoneListV m WHERE m.uniqueId = :uniqueId"),
        @NamedQuery(name = "MilestoneListV.findByPackageId", query = "SELECT m FROM MilestoneListV m WHERE m.packageId = :packageId"),
        @NamedQuery(name = "MilestoneListV.findByDocumentId", query = "SELECT m FROM MilestoneListV m WHERE m.documentId = :documentId"),
        @NamedQuery(name = "MilestoneListV.findByMilestoneId", query = "SELECT m FROM MilestoneListV m WHERE m.milestoneId = :milestoneId"),
        @NamedQuery(name = "MilestoneListV.findByContainedDocuments", query = "SELECT m FROM MilestoneListV m WHERE m.containedDocuments = :containedDocuments"),
        @NamedQuery(name = "MilestoneListV.findByAuditCBy", query = "SELECT m FROM MilestoneListV m WHERE m.auditCBy = :auditCBy"),
        @NamedQuery(name = "MilestoneListV.findByAuditCDate", query = "SELECT m FROM MilestoneListV m WHERE m.auditCDate = :auditCDate"),
        @NamedQuery(name = "MilestoneListV.findByAuditLastMDate", query = "SELECT m FROM MilestoneListV m WHERE m.auditLastMDate = :auditLastMDate"),
        @NamedQuery(name = "MilestoneListV.findByAuditLastMBy", query = "SELECT m FROM MilestoneListV m WHERE m.auditLastMBy = :auditLastMBy")})
public class MilestoneListV implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "UNIQUE_ID", updatable = false)
    private String uniqueId;
    @Column(name = "PACKAGE_ID", updatable = false)
    private BigDecimal packageId;
    @Column(name = "DOCUMENT_ID", updatable = false)
    private BigDecimal documentId;
    @Column(name = "MILESTONE_ID", updatable = false)
    private BigDecimal milestoneId;
    @Column(name = "CONTAINED_DOCUMENTS", updatable = false)
    private String containedDocuments;
    @Column(name = "AUDIT_C_BY", updatable = false)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", updatable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_DATE", updatable = false)
    private LocalDateTime auditLastMDate;
    @Column(name = "AUDIT_LAST_M_BY", updatable = false)
    private String auditLastMBy;

    public MilestoneListV() {
    }

    public String getUniqueId() {
        return uniqueId;
    }

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
    }

    public BigDecimal getPackageId() {
        return packageId;
    }

    public void setPackageId(BigDecimal packageId) {
        this.packageId = packageId;
    }

    public BigDecimal getDocumentId() {
        return documentId;
    }

    public void setDocumentId(BigDecimal documentId) {
        this.documentId = documentId;
    }

    public BigDecimal getMilestoneId() {
        return milestoneId;
    }

    public void setMilestoneId(BigDecimal milestoneId) {
        this.milestoneId = milestoneId;
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

}
