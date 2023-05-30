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
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlTransient;

@Entity
@Table(name = "PACKAGE")
@NamedQueries({
    @NamedQuery(name = "Package.findAll", query = "SELECT p FROM Package p"),
    @NamedQuery(name = "Package.findById", query = "SELECT p FROM Package p WHERE p.id = :id"),
    @NamedQuery(name = "Package.findByObjectId", query = "SELECT p FROM Package p WHERE p.objectId = :objectId"),
    @NamedQuery(name = "Package.findByName", query = "SELECT p FROM Package p WHERE p.name = :name"),
    @NamedQuery(name = "Package.findByRepositoryId", query = "SELECT p FROM Package p WHERE p.repositoryId = :repositoryId"),
    @NamedQuery(name = "Package.findByAuditCBy", query = "SELECT p FROM Package p WHERE p.auditCBy = :auditCBy"),
    @NamedQuery(name = "Package.findByAuditCDate", query = "SELECT p FROM Package p WHERE p.auditCDate = :auditCDate"),
    @NamedQuery(name = "Package.findByAuditLastMBy", query = "SELECT p FROM Package p WHERE p.auditLastMBy = :auditLastMBy"),
    @NamedQuery(name = "Package.findByAuditLastMDate", query = "SELECT p FROM Package p WHERE p.auditLastMDate = :auditLastMDate"),
    @NamedQuery(name = "Package.findByOriginalId", query = "SELECT p FROM Package p WHERE p.originalId = :originalId"),
    @NamedQuery(name = "Package.findByIsCloned", query = "SELECT p FROM Package p WHERE p.isCloned = :isCloned"),
    @NamedQuery(name = "Package.findByClonedPackageName", query = "SELECT p FROM Package p WHERE p.clonedPackageName = :clonedPackageName")})
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
    @Column(name = "REPOSITORY_ID", nullable = false, precision = 22, scale = 0)
    private BigDecimal repositoryId;
    @Column(name = "AUDIT_C_BY", nullable = false)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", nullable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_BY")
    private String auditLastMBy;
    @Column(name = "AUDIT_LAST_M_DATE")
    private LocalDateTime auditLastMDate;
    @Column(name = "ORIGINAL_ID", precision = 22, scale = 0)
    private BigDecimal originalId;
    @Column(name = "IS_CLONED")
    private Boolean isCloned;
    @Column(name = "CLONED_PACKAGE_NAME")
    private String clonedPackageName;
    @OneToMany(mappedBy = "clonedPackageId")
    private Collection<Package> packageCollection;
    @JoinColumn(name = "CLONED_PACKAGE_ID", referencedColumnName = "ID")
    @ManyToOne
    private Package clonedPackageId;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "packageId")
    private Collection<PackageCollaborators> packageCollaboratorsCollection;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "packageId")
    private Collection<Document> documentCollection;

    public Package() {
    }

    public Package(BigDecimal id) {
        this.id = id;
    }

    public Package(BigDecimal id, BigDecimal objectId, String name, BigDecimal repositoryId, String auditCBy, LocalDateTime auditCDate) {
        this.id = id;
        this.objectId = objectId;
        this.name = name;
        this.repositoryId = repositoryId;
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

    public BigDecimal getRepositoryId() {
        return repositoryId;
    }

    public void setRepositoryId(BigDecimal repositoryId) {
        this.repositoryId = repositoryId;
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

    public BigDecimal getOriginalId() {
        return originalId;
    }

    public void setOriginalId(BigDecimal originalId) {
        this.originalId = originalId;
    }

    public Boolean getIsCloned() {
        return isCloned;
    }

    public void setIsCloned(Boolean isCloned) {
        this.isCloned = isCloned;
    }

    public String getClonedPackageName() {
        return clonedPackageName;
    }

    public void setClonedPackageName(String clonedPackageName) {
        this.clonedPackageName = clonedPackageName;
    }

    @XmlTransient
    public Collection<Package> getPackageCollection() {
        return packageCollection;
    }

    public void setPackageCollection(Collection<Package> packageCollection) {
        this.packageCollection = packageCollection;
    }

    public Package getClonedPackageId() {
        return clonedPackageId;
    }

    public void setClonedPackageId(Package clonedPackageId) {
        this.clonedPackageId = clonedPackageId;
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
    
}
