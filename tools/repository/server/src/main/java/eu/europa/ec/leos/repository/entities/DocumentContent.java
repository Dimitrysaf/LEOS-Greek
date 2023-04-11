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
@Table(name = "DOCUMENT_CONTENT")
@NamedQueries({
    @NamedQuery(name = "DocumentContent.findAll", query = "SELECT d FROM DocumentContent d"),
    @NamedQuery(name = "DocumentContent.findById", query = "SELECT d FROM DocumentContent d WHERE d.id = :id"),
    @NamedQuery(name = "DocumentContent.findByContent", query = "SELECT d FROM DocumentContent d WHERE d.content = :content"),
    @NamedQuery(name = "DocumentContent.findByActType", query = "SELECT d FROM DocumentContent d WHERE d.actType = :actType"),
    @NamedQuery(name = "DocumentContent.findByCollaborators", query = "SELECT d FROM DocumentContent d WHERE d.collaborators = :collaborators"),
    @NamedQuery(name = "DocumentContent.findByDocPurpose", query = "SELECT d FROM DocumentContent d WHERE d.docPurpose = :docPurpose"),
    @NamedQuery(name = "DocumentContent.findByDocStage", query = "SELECT d FROM DocumentContent d WHERE d.docStage = :docStage"),
    @NamedQuery(name = "DocumentContent.findByDocTemplate", query = "SELECT d FROM DocumentContent d WHERE d.docTemplate = :docTemplate"),
    @NamedQuery(name = "DocumentContent.findByDocType", query = "SELECT d FROM DocumentContent d WHERE d.docType = :docType"),
    @NamedQuery(name = "DocumentContent.findByEeaRelevance", query = "SELECT d FROM DocumentContent d WHERE d.eeaRelevance = :eeaRelevance"),
    @NamedQuery(name = "DocumentContent.findByLanguage", query = "SELECT d FROM DocumentContent d WHERE d.language = :language"),
    @NamedQuery(name = "DocumentContent.findByProcedureType", query = "SELECT d FROM DocumentContent d WHERE d.procedureType = :procedureType"),
    @NamedQuery(name = "DocumentContent.findByRef", query = "SELECT d FROM DocumentContent d WHERE d.ref = :ref"),
    @NamedQuery(name = "DocumentContent.findByRefDoc", query = "SELECT d FROM DocumentContent d WHERE d.refDoc = :refDoc"),
    @NamedQuery(name = "DocumentContent.findByTemplate", query = "SELECT d FROM DocumentContent d WHERE d.template = :template"),
    @NamedQuery(name = "DocumentContent.findByTitle", query = "SELECT d FROM DocumentContent d WHERE d.title = :title"),
    @NamedQuery(name = "DocumentContent.findByAuditCBy", query = "SELECT d FROM DocumentContent d WHERE d.auditCBy = :auditCBy"),
    @NamedQuery(name = "DocumentContent.findByAuditCDate", query = "SELECT d FROM DocumentContent d WHERE d.auditCDate = :auditCDate"),
    @NamedQuery(name = "DocumentContent.findByAuditLastMBy", query = "SELECT d FROM DocumentContent d WHERE d.auditLastMBy = :auditLastMBy"),
    @NamedQuery(name = "DocumentContent.findByAuditLastMDate", query = "SELECT d FROM DocumentContent d WHERE d.auditLastMDate = :auditLastMDate")})
public class DocumentContent implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private BigDecimal id;
    @Column(name = "CONTENT", nullable = false)
    private Serializable content;
    @Column(name = "ACT_TYPE", length = 100)
    private String actType;
    @Column(name = "COLLABORATORS", nullable = false, length = 400)
    private String collaborators;
    @Column(name = "DOC_PURPOSE", nullable = false, length = 400)
    private String docPurpose;
    @Column(name = "DOC_STAGE", nullable = false, length = 400)
    private String docStage;
    @Column(name = "DOC_TEMPLATE", nullable = false, length = 400)
    private String docTemplate;
    @Column(name = "DOC_TYPE", nullable = false, length = 400)
    private String docType;
    @Column(name = "EEA_RELEVANCE")
    private Boolean eeaRelevance;
    @Column(name = "LANGUAGE", nullable = false, length = 10)
    private String language;
    @Column(name = "PROCEDURE_TYPE")
    private String procedureType;
    @Column(name = "REF", nullable = false, length = 400)
    private String ref;
    @Column(name = "REF_DOC")
    private String refDoc;
    @Column(name = "TEMPLATE", nullable = false, length = 400)
    private String template;
    @Column(name = "TITLE", nullable = false, length = 400)
    private String title;
    @Column(name = "AUDIT_C_BY", nullable = false, length = 30)
    private String auditCBy;
    @Column(name = "AUDIT_C_DATE", nullable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_LAST_M_DATE")
    private LocalDateTime auditLastMDate;
    @Column(name = "AUDIT_LAST_M_BY", length = 30)
    private String auditLastMBy;
    @JoinColumn(name = "VERSION_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private DocumentVersion versionId;

    public DocumentContent() {
    }

    public DocumentContent(BigDecimal id) {
        this.id = id;
    }

    public DocumentContent(BigDecimal id, Serializable content, String collaborators, String docPurpose, String docStage, String docTemplate, String docType,
                           String language, String ref, String template, String title, String createdBy, LocalDateTime creationDate) {
        this.id = id;
        this.content = content;
        this.collaborators = collaborators;
        this.docPurpose = docPurpose;
        this.docStage = docStage;
        this.docTemplate = docTemplate;
        this.docType = docType;
        this.language = language;
        this.ref = ref;
        this.template = template;
        this.title = title;
        this.auditCBy = createdBy;
        this.auditCDate = creationDate;
    }

    public BigDecimal getId() {
        return id;
    }

    public void setId(BigDecimal id) {
        this.id = id;
    }

    public Serializable getContent() {
        return content;
    }

    public void setContent(Serializable content) {
        this.content = content;
    }

    public String getActType() {
        return actType;
    }

    public void setActType(String actType) {
        this.actType = actType;
    }

    public String getCollaborators() {
        return collaborators;
    }

    public void setCollaborators(String collaborators) {
        this.collaborators = collaborators;
    }

    public String getDocPurpose() {
        return docPurpose;
    }

    public void setDocPurpose(String docPurpose) {
        this.docPurpose = docPurpose;
    }

    public String getDocStage() {
        return docStage;
    }

    public void setDocStage(String docStage) {
        this.docStage = docStage;
    }

    public String getDocTemplate() {
        return docTemplate;
    }

    public void setDocTemplate(String docTemplate) {
        this.docTemplate = docTemplate;
    }

    public String getDocType() {
        return docType;
    }

    public void setDocType(String docType) {
        this.docType = docType;
    }

    public Boolean getEeaRelevance() {
        return eeaRelevance;
    }

    public void setEeaRelevance(Boolean eeaRelevance) {
        this.eeaRelevance = eeaRelevance;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getProcedureType() {
        return procedureType;
    }

    public void setProcedureType(String procedureType) {
        this.procedureType = procedureType;
    }

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public String getRefDoc() {
        return refDoc;
    }

    public void setRefDoc(String refDoc) {
        this.refDoc = refDoc;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCreatedBy() {
        return auditCBy;
    }

    public void setCreatedBy(String createdBy) {
        this.auditCBy = createdBy;
    }

    public LocalDateTime getCreationDate() {
        return auditCDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.auditCDate = creationDate;
    }

    public LocalDateTime getLastModificationDate() {
        return auditLastMDate;
    }

    public void setLastModificationDate(LocalDateTime lastModificationDate) {
        this.auditLastMDate = lastModificationDate;
    }

    public String getLastModifiedBy() {
        return auditLastMBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.auditLastMBy = lastModifiedBy;
    }

    public DocumentVersion getVersionId() {
        return versionId;
    }

    public void setVersionId(DocumentVersion versionId) {
        this.versionId = versionId;
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
        if (!(object instanceof DocumentContent)) {
            return false;
        }
        DocumentContent other = (DocumentContent) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "eu.europa.ec.leos.repository.entity.DocumentContent[ id=" + id + " ]";
    }
    
}
