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
import java.util.Collection;
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
import javax.xml.bind.annotation.XmlTransient;

@Entity
@Table(name = "REPOSITORY")
@NamedQueries({
    @NamedQuery(name = "Repository.findAll", query = "SELECT r FROM Repository r"),
    @NamedQuery(name = "Repository.findById", query = "SELECT r FROM Repository r WHERE r.id = :id"),
    @NamedQuery(name = "Repository.findByCmisId", query = "SELECT r FROM Repository r WHERE r.cmisId = :cmisId"),
    @NamedQuery(name = "Repository.findByName", query = "SELECT r FROM Repository r WHERE r.name = :name"),
    @NamedQuery(name = "Repository.findByDescription", query = "SELECT r FROM Repository r WHERE r.description = :description"),
    @NamedQuery(name = "Repository.findByAllVersionsSearchable", query = "SELECT r FROM Repository r WHERE r.allVersionsSearchable = :allVersionsSearchable"),
    @NamedQuery(name = "Repository.findByAuditCBy", query = "SELECT r FROM Repository r WHERE r.auditCBy = :auditCBy"),
    @NamedQuery(name = "Repository.findByAuditCDate", query = "SELECT r FROM Repository r WHERE r.auditCDate = :auditCDate"),
    @NamedQuery(name = "Repository.findByAuditLastMDate", query = "SELECT r FROM Repository r WHERE r.auditLastMDate = :auditLastMDate"),
    @NamedQuery(name = "Repository.findByAuditLastMBy", query = "SELECT r FROM Repository r WHERE r.auditLastMBy = :auditLastMBy")})
public class Repository implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private BigDecimal id;
    @Column(name = "CMIS_ID", nullable = false)
    private String cmisId;
    @Column(name = "NAME", nullable = false)
    private String name;
    @Column(name = "DESCRIPTION", nullable = false)
    private String description;
    @Column(name = "ALL_VERSIONS_SEARCHABLE", nullable = false)
    private Boolean allVersionsSearchable;
    @Column(name = "AUDIT_C_BY")
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE")
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_DATE")
    private LocalDateTime auditLastMDate;
    @Column(name = "AUDIT_LAST_M_BY")
    private String auditLastMBy;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "repositoryId")
    private Collection<Permission> permissionCollection;

    public Repository() {
    }

    public Repository(BigDecimal id) {
        this.id = id;
    }

    public Repository(BigDecimal id, String cmisId, String name, String description) {
        this.id = id;
        this.cmisId = cmisId;
        this.name = name;
        this.description = description;
    }

    public BigDecimal getId() {
        return id;
    }

    public void setId(BigDecimal id) {
        this.id = id;
    }

    public String getCmisId() {
        return cmisId;
    }

    public void setCmisId(String cmisId) {
        this.cmisId = cmisId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getAllVersionsSearchable() {
        return allVersionsSearchable;
    }

    public void setAllVersionsSearchable(Boolean allVersionsSearchable) {
        this.allVersionsSearchable = allVersionsSearchable;
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

    @XmlTransient
    public Collection<Permission> getPermissionCollection() {
        return permissionCollection;
    }

    public void setPermissionCollection(Collection<Permission> permissionCollection) {
        this.permissionCollection = permissionCollection;
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
        if (!(object instanceof Repository)) {
            return false;
        }
        Repository other = (Repository) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "eu.europa.ec.leos.repository.entities.Repository[ id=" + id + " ]";
    }
    
}
