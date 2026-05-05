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
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;

@Entity
@Table(name = "DOCUMENT_CONTENT")
@NamedQueries({
    @NamedQuery(name = "DocumentContent.findAll", query = "SELECT d FROM DocumentContent d"),
    @NamedQuery(name = "DocumentContent.findById", query = "SELECT d FROM DocumentContent d WHERE d.id = :id"),
    @NamedQuery(name = "DocumentContent.findByCategoryCode", query = "SELECT d FROM DocumentContent d WHERE d.categoryCode = :categoryCode"),
    @NamedQuery(name = "DocumentContent.findByContent", query = "SELECT d FROM DocumentContent d WHERE d.content = :content"),
    @NamedQuery(name = "DocumentContent.findByActType", query = "SELECT d FROM DocumentContent d WHERE d.actType = :actType"),
    @NamedQuery(name = "DocumentContent.findByDocPurpose", query = "SELECT d FROM DocumentContent d WHERE d.docPurpose = :docPurpose"),
    @NamedQuery(name = "DocumentContent.findByDocType", query = "SELECT d FROM DocumentContent d WHERE d.docType = :docType"),
    @NamedQuery(name = "DocumentContent.findByEeaRelevance", query = "SELECT d FROM DocumentContent d WHERE d.eeaRelevance = :eeaRelevance"),
    @NamedQuery(name = "DocumentContent.findByTemplate", query = "SELECT d FROM DocumentContent d WHERE d.template = :template"),
    @NamedQuery(name = "DocumentContent.findByTitle", query = "SELECT d FROM DocumentContent d WHERE d.title = :title"),
    @NamedQuery(name = "DocumentContent.findByAuditCBy", query = "SELECT d FROM DocumentContent d WHERE d.auditCBy = :auditCBy"),
    @NamedQuery(name = "DocumentContent.findByAuditCDate", query = "SELECT d FROM DocumentContent d WHERE d.auditCDate = :auditCDate"),
    @NamedQuery(name = "DocumentContent.findByAuditLastMBy", query = "SELECT d FROM DocumentContent d WHERE d.auditLastMBy = :auditLastMBy"),
    @NamedQuery(name = "DocumentContent.findByAuditLastMDate", query = "SELECT d FROM DocumentContent d WHERE d.auditLastMDate = :auditLastMDate")})
public class DocumentContent implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID", updatable = false, precision = 22, scale = 0)
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private BigDecimal id;
    @Column(name = "CATEGORY_CODE")
    private String categoryCode;
    @Lob
    @Column(name = "CONTENT", nullable = false)
    private String content;
    @Lob
    @Column(name = "BINARY_CONTENT", nullable = true)
    private byte[] binaryContent;
    @Column(name = "ORIGINAL_FILE_NAME", length = 255, nullable = true)
    private String originalFilename;
    @Column(name = "BINARY_CONTENT_SIZE", length = 30, nullable = true)
    private String binaryContentSize;
    @Lob
    @Column(name = "FOREIGN_RENDITION_CONTENT", nullable = true)
    private byte[] foreignRenditionContent;
    @Column(name = "FOREIGN_RENDITION_ORIGINAL_FILE_NAME", length = 255, nullable = true)
    private String foreignRenditionOriginalFilename;
    @Column(name = "ACT_TYPE", length = 100)
    private String actType;
    @Column(name = "DOC_PURPOSE", nullable = false, length = 400)
    private String docPurpose;
    @Column(name = "DOC_TYPE", nullable = false, length = 400)
    private String docType;
    @Column(name = "EEA_RELEVANCE")
    private Boolean eeaRelevance;
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
    private DocumentVersion version;

    public DocumentContent() {
    }

    public DocumentContent(BigDecimal id) {
        this.id = id;
    }

    public DocumentContent(BigDecimal id, String content, String docPurpose, String docType,
                           String template, String title, String auditCBy, LocalDateTime auditCDate) {
        this.id = id;
        this.content = content;
        this.docPurpose = docPurpose;
        this.docType = docType;
        this.template = template;
        this.title = title;
        this.auditCBy = auditCBy;
        this.auditCDate = auditCDate;
    }

    public BigDecimal getId() {
        return id;
    }

    public void setId(BigDecimal id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public String getActType() {
        return actType;
    }

    public void setActType(String actType) {
        this.actType = actType;
    }

    public String getDocPurpose() {
        return docPurpose;
    }

    public void setDocPurpose(String docPurpose) {
        this.docPurpose = docPurpose;
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

    public void setCreatedBy(String auditCBy) {
        this.auditCBy = auditCBy;
    }

    public LocalDateTime getCreationDate() {
        return auditCDate;
    }

    public void setCreationDate(LocalDateTime auditCDate) {
        this.auditCDate = auditCDate;
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

    public DocumentVersion getVersion() {
        return version;
    }

    public void setVersion(DocumentVersion version) {
        this.version = version;
    }

    public byte[] getBinaryContent() {
        return binaryContent;
    }

    public void setBinaryContent(byte[] binaryContent) {
        this.binaryContent = binaryContent;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public String getBinaryContentSize() {
        return binaryContentSize;
    }

    public void setBinaryContentSize(String binaryContentSize) {
        this.binaryContentSize = binaryContentSize;
    }

    public byte[] getForeignRenditionContent() {
        return this.foreignRenditionContent;
    }

    public void setForeignRenditionContent(final byte[] foreignRenditionContent) {
        this.foreignRenditionContent = foreignRenditionContent;
    }

    public String getForeignRenditionOriginalFilename() {
        return this.foreignRenditionOriginalFilename;
    }

    public void setForeignRenditionOriginalFilename(final String foreignRenditionOriginalFilename) {
        this.foreignRenditionOriginalFilename = foreignRenditionOriginalFilename;
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
