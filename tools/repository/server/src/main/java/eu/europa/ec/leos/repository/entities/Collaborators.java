/*
 * Copyright 2024 European Union
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
import java.util.Date;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

@Entity
@Table(name = "COLLABORATORS")
@XmlRootElement
@NamedQueries({
        @NamedQuery(name = "Collaborators.findAll", query = "SELECT c FROM Collaborators c"),
        @NamedQuery(name = "Collaborators.findById", query = "SELECT c FROM Collaborators c WHERE c.id = :id"),
        @NamedQuery(name = "Collaborators.findByCollaboratorName", query = "SELECT c FROM Collaborators c WHERE c.collaboratorName = :collaboratorName"),
        @NamedQuery(name = "Collaborators.findByRole", query = "SELECT c FROM Collaborators c WHERE c.role = :role"),
        @NamedQuery(name = "Collaborators.findByOrganization", query = "SELECT c FROM Collaborators c WHERE c.organization = :organization"),
        @NamedQuery(name = "Collaborators.findByAuditCBy", query = "SELECT c FROM Collaborators c WHERE c.auditCBy = :auditCBy"),
        @NamedQuery(name = "Collaborators.findByAuditCDate", query = "SELECT c FROM Collaborators c WHERE c.auditCDate = :auditCDate"),
        @NamedQuery(name = "Collaborators.findByAuditLastMBy", query = "SELECT c FROM Collaborators c WHERE c.auditLastMBy = :auditLastMBy"),
        @NamedQuery(name = "Collaborators.findByAuditLastMDate", query = "SELECT c FROM Collaborators c WHERE c.auditLastMDate = :auditLastMDate")})
public class Collaborators implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private BigDecimal id;
    @Column(name = "COLLABORATOR_NAME", nullable = false, length = 100)
    private String collaboratorName;
    @Column(name = "ROLE_ID", nullable = false, length = 100)
    private String role;
    @Column(name = "ORGANIZATION", nullable = false, length = 100)
    private String organization;
    @Column(name = "AUDIT_C_BY", nullable = false, length = 30)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", nullable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_BY", length = 30)
    private String auditLastMBy;
    @Column(name = "AUDIT_LAST_M_DATE")
    private LocalDateTime auditLastMDate;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "collaborator")
    private Collection<PackageCollaborators> packageCollaboratorsCollection;

    public Collaborators() {
    }

    public Collaborators(BigDecimal id) {
        this.id = id;
    }

    public Collaborators(BigDecimal id, String collaboratorName, String role, String organization) {
        this.id = id;
        this.collaboratorName = collaboratorName;
        this.role = role;
        this.organization = organization;
    }

    public BigDecimal getId() {
        return id;
    }

    public void setId(BigDecimal id) {
        this.id = id;
    }

    public String getCollaboratorName() {
        return collaboratorName;
    }

    public void setCollaboratorName(String collaboratorName) {
        this.collaboratorName = collaboratorName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
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

    @XmlTransient
    public Collection<PackageCollaborators> getPackageCollaboratorsCollection() {
        return packageCollaboratorsCollection;
    }

    public void setPackageCollaboratorsCollection(Collection<PackageCollaborators> packageCollaboratorsCollection) {
        this.packageCollaboratorsCollection = packageCollaboratorsCollection;
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
        if (!(object instanceof Collaborators)) {
            return false;
        }
        Collaborators other = (Collaborators) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "eu.europa.ec.leos.repository.entities.Collaborators[ id=" + id + " ]";
    }

}
