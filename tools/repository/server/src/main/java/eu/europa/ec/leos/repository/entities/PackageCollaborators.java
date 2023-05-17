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
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "PACKAGE_COLLABORATORS")
@XmlRootElement
@NamedQueries({
        @NamedQuery(name = "PackageCollaborators.findAll", query = "SELECT p FROM PackageCollaborators p"),
        @NamedQuery(name = "PackageCollaborators.findById", query = "SELECT p FROM PackageCollaborators p WHERE p.id = :id"),
        @NamedQuery(name = "PackageCollaborators.findByAuditCBy", query = "SELECT p FROM PackageCollaborators p WHERE p.auditCBy = :auditCBy"),
        @NamedQuery(name = "PackageCollaborators.findByAuditCDate", query = "SELECT p FROM PackageCollaborators p WHERE p.auditCDate = :auditCDate"),
        @NamedQuery(name = "PackageCollaborators.findByAuditLastMBy", query = "SELECT p FROM PackageCollaborators p WHERE p.auditLastMBy = :auditLastMBy"),
        @NamedQuery(name = "PackageCollaborators.findByAuditLastMDate", query = "SELECT p FROM PackageCollaborators p WHERE p.auditLastMDate = :auditLastMDate")})
public class PackageCollaborators implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private BigDecimal id;
    @Column(name = "AUDIT_C_BY")
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE")
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_BY")
    private String auditLastMBy;
    @Column(name = "AUDIT_LAST_M_DATE")
    private LocalDateTime auditLastMDate;
    @JoinColumn(name = "COLLABORATOR_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Collaborators collaboratorId;
    @JoinColumn(name = "PACKAGE_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Package packageId;

    public PackageCollaborators() {
    }

    public PackageCollaborators(BigDecimal id) {
        this.id = id;
    }

    public BigDecimal getId() {
        return id;
    }

    public void setId(BigDecimal id) {
        this.id = id;
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

    public Collaborators getCollaboratorId() {
        return collaboratorId;
    }

    public void setCollaboratorId(Collaborators collaboratorId) {
        this.collaboratorId = collaboratorId;
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
        if (!(object instanceof PackageCollaborators)) {
            return false;
        }
        PackageCollaborators other = (PackageCollaborators) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "eu.europa.ec.leos.repository.entities.PackageCollaborators[ id=" + id + " ]";
    }

}
