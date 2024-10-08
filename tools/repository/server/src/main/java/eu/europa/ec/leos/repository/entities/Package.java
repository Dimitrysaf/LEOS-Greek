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

import lombok.Getter;
import lombok.Setter;

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
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "PACKAGE")
@NamedQueries({
    @NamedQuery(name = "Package.findAll", query = "SELECT p FROM Package p"),
    @NamedQuery(name = "Package.findById", query = "SELECT p FROM Package p WHERE p.id = :id"),
    @NamedQuery(name = "Package.findByObjectId", query = "SELECT p FROM Package p WHERE p.objectId = :objectId"),
    @NamedQuery(name = "Package.findByName", query = "SELECT p FROM Package p WHERE p.name = :name"),
    @NamedQuery(name = "Package.findByAuditCBy", query = "SELECT p FROM Package p WHERE p.auditCBy = :auditCBy"),
    @NamedQuery(name = "Package.findByAuditCDate", query = "SELECT p FROM Package p WHERE p.auditCDate = :auditCDate"),
    @NamedQuery(name = "Package.findByAuditLastMBy", query = "SELECT p FROM Package p WHERE p.auditLastMBy = :auditLastMBy"),
    @NamedQuery(name = "Package.findByAuditLastMDate", query = "SELECT p FROM Package p WHERE p.auditLastMDate = :auditLastMDate")})
public class Package implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private BigDecimal id;
    @Column(name = "OBJECT_ID", nullable = false, precision = 22, scale = 0)
    private BigDecimal objectId;
    @Column(name = "NAME", nullable = false)
    private String name;
    @Column(name = "AUDIT_C_BY", nullable = false)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", nullable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_BY")
    private String auditLastMBy;
    @Column(name = "AUDIT_LAST_M_DATE")
    private LocalDateTime auditLastMDate;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "pkg")
    private Collection<PackageCollaborators> packageCollaboratorsCollection;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "packageId")
    private Collection<Document> documentCollection;
    @Column(name = "LANGUAGE")
    private String language;
    @Column(name = "IS_TRANSLATED")
    private Boolean isTranslated;

    @Getter
    @Setter
    @OneToMany(mappedBy = "pkg", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkflowCollaboratorConfig> workflowCollaboratorConfigs;

    public Package() {
    }

    public Package(BigDecimal id) {
        this.id = id;
    }

    public Package(BigDecimal id, BigDecimal objectId, String name, String auditCBy, LocalDateTime auditCDate) {
        this.id = id;
        this.objectId = objectId;
        this.name = name;
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

    @XmlTransient
    public Collection<Document> getDocumentCollection() {
        return documentCollection;
    }

    public void setDocumentCollection(Collection<Document> documentCollection) {
        this.documentCollection = documentCollection;
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
        if (!(object instanceof Package)) {
            return false;
        }
        Package other = (Package) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "eu.europa.ec.leos.repository.entities.Package[ id=" + id + " ]";
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Boolean getIsTranslated() {
        return isTranslated;
    }

    public void setIsTranslated(Boolean isTranslated) {
        this.isTranslated = isTranslated;
    }
}
