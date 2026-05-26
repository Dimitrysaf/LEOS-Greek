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

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlTransient;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;

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
@Getter @Setter
@EqualsAndHashCode(of = {"id"})
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
    @JoinColumn(name = "LEOS_CLIENTS_ID", referencedColumnName = "ID")
    @ManyToOne(fetch = FetchType.LAZY)
    private LeosClients leosClients;
    @Column(name = "DISPLAY_NAME", length = 100)
    private String displayName;
    @Column(name = "AUDIT_C_BY", nullable = false, length = 30)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", nullable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_BY", length = 30)
    private String auditLastMBy;
    @Column(name = "AUDIT_LAST_M_DATE")
    private LocalDateTime auditLastMDate;
    @XmlTransient
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

    public Collaborators(BigDecimal id, String collaboratorName, String role, String organization, LeosClients leosClients, String displayName) {
        this.id = id;
        this.collaboratorName = collaboratorName;
        this.role = role;
        this.organization = organization;
        this.leosClients = leosClients;
        this.displayName = displayName;
    }

    @Override
    public String toString() {
        return "eu.europa.ec.leos.repository.entities.Collaborators[ id=" + id + " ]";
    }

}
