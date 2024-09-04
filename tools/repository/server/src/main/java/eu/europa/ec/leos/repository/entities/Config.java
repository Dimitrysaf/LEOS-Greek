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
@Table(name = "CONFIG")
@NamedQueries({
        @NamedQuery(name = "Config.findAll", query = "SELECT c FROM Config c"),
        @NamedQuery(name = "Config.findById", query = "SELECT c FROM Config c WHERE c.id = :id"),
        @NamedQuery(name = "Config.findByName", query = "SELECT c FROM Config c WHERE c.name = :name"),
        @NamedQuery(name = "Config.findByObjectId", query = "SELECT c FROM Config c WHERE c.objectId = :objectId"),
        @NamedQuery(name = "Config.findByAuditCBy", query = "SELECT c FROM Config c WHERE c.auditCBy = :auditCBy"),
        @NamedQuery(name = "Config.findByAuditCDate", query = "SELECT c FROM Config c WHERE c.auditCDate = :auditCDate"),
        @NamedQuery(name = "Config.findByAuditLastMBy", query = "SELECT c FROM Config c WHERE c.auditLastMBy = :auditLastMBy"),
        @NamedQuery(name = "Config.findByAuditLastMDate", query = "SELECT c FROM Config c WHERE c.auditLastMDate = :auditLastMDate"),
        @NamedQuery(name = "Config.findByLanguage", query = "SELECT c FROM Config c WHERE c.language = :language")})
public class Config implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private BigDecimal id;
    @Column(name = "NAME", nullable = false, length = 100)
    private String name;
    @Column(name = "OBJECT_ID", nullable = false, precision = 22, scale = 0)
    private BigDecimal objectId;
    @Column(name = "AUDIT_C_BY", nullable = false, length = 30)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", nullable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_DATE")
    private LocalDateTime auditLastMDate;
    @Column(name = "AUDIT_LAST_M_BY", length = 30)
    private String auditLastMBy;
    @Column(name = "LANGUAGE")
    private String language;
    @JoinColumn(name = "CATEGORY_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private ConfigCategory configCategory;
    @Column(name = "LFDS")
    private String lfds;

    public Config() {
    }

    public Config(BigDecimal id) {
        this.id = id;
    }

    public Config(BigDecimal id, String name, BigDecimal objectId, String auditCBy, LocalDateTime auditCDate) {
        this.id = id;
        this.name = name;
        this.objectId = objectId;
        this.auditCBy = auditCBy;
        this.auditCDate = auditCDate;
    }

    public BigDecimal getId() {
        return id;
    }

    public void setId(BigDecimal id) {
        this.id = id;
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

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getLfds() {
        return lfds;
    }

    public void setLfds(String lfds) {
        this.lfds = lfds;
    }

    public ConfigCategory getConfigCategory() {
        return configCategory;
    }

    public void setConfigCategory(ConfigCategory category) {
        this.configCategory = category;
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
        if (!(object instanceof Config)) {
            return false;
        }
        Config other = (Config) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "eu.europa.ec.leos.repository.entities.Config[ id=" + id + " ]";
    }

}
