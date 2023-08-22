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
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "PACKAGE_V")
@XmlRootElement
@NamedQueries({
        @NamedQuery(name = "PackageV.findAll", query = "SELECT p FROM PackageV p"),
        @NamedQuery(name = "PackageV.findByUniqueId", query = "SELECT p FROM PackageV p WHERE p.uniqueId = :uniqueId"),
        @NamedQuery(name = "PackageV.findByPackageId", query = "SELECT p FROM PackageV p WHERE p.packageId = :packageId"),
        @NamedQuery(name = "PackageV.findByPkgObjectId", query = "SELECT p FROM PackageV p WHERE p.pkgObjectId = :pkgObjectId"),
        @NamedQuery(name = "PackageV.findByPackageName", query = "SELECT p FROM PackageV p WHERE p.packageName = :packageName"),
        @NamedQuery(name = "PackageV.findByAuditCDate", query = "SELECT p FROM PackageV p WHERE p.auditCDate = :auditCDate"),
        @NamedQuery(name = "PackageV.findByAuditCBy", query = "SELECT p FROM PackageV p WHERE p.auditCBy = :auditCBy"),
        @NamedQuery(name = "PackageV.findByAuditLastMDate", query = "SELECT p FROM PackageV p WHERE p.auditLastMDate = :auditLastMDate"),
        @NamedQuery(name = "PackageV.findByAuditLastMBy", query = "SELECT p FROM PackageV p WHERE p.auditLastMBy = :auditLastMBy"),
        @NamedQuery(name = "PackageV.findByDocumentId", query = "SELECT p FROM PackageV p WHERE p.documentId = :documentId"),
        @NamedQuery(name = "PackageV.findByDocObjectId", query = "SELECT p FROM PackageV p WHERE p.docObjectId = :docObjectId"),
        @NamedQuery(name = "PackageV.findByCategoryId", query = "SELECT p FROM PackageV p WHERE p.categoryId = :categoryId"),
        @NamedQuery(name = "PackageV.findByName", query = "SELECT p FROM PackageV p WHERE p.name = :name"),
        @NamedQuery(name = "PackageV.findByClonedFrom", query = "SELECT p FROM PackageV p WHERE p.clonedFrom = :clonedFrom"),
        @NamedQuery(name = "PackageV.findByRevisionStatus", query = "SELECT p FROM PackageV p WHERE p.revisionStatus = :revisionStatus"),
        @NamedQuery(name = "PackageV.findByContributionStatus", query = "SELECT p FROM PackageV p WHERE p.contributionStatus = :contributionStatus"),
        @NamedQuery(name = "PackageV.findByOriginRef", query = "SELECT p FROM PackageV p WHERE p.originRef = :originRef"),
        @NamedQuery(name = "PackageV.findByBaseRevisionId", query = "SELECT p FROM PackageV p WHERE p.baseRevisionId = :baseRevisionId"),
        @NamedQuery(name = "PackageV.findByLiveDiffingRequired", query = "SELECT p FROM PackageV p WHERE p.liveDiffingRequired = :liveDiffingRequired"),
        @NamedQuery(name = "PackageV.findByRef", query = "SELECT p FROM PackageV p WHERE p.ref = :ref"),
        @NamedQuery(name = "PackageV.findByProcedureType", query = "SELECT p FROM PackageV p WHERE p.procedureType = :procedureType"),
        @NamedQuery(name = "PackageV.findByDocTemplate", query = "SELECT p FROM PackageV p WHERE p.docTemplate = :docTemplate"),
        @NamedQuery(name = "PackageV.findByLanguage", query = "SELECT p FROM PackageV p WHERE p.language = :language"),
        @NamedQuery(name = "PackageV.findByDocStage", query = "SELECT p FROM PackageV p WHERE p.docStage = :docStage"),
        @NamedQuery(name = "PackageV.findByDocAuditCBy", query = "SELECT p FROM PackageV p WHERE p.docAuditCBy = :docAuditCBy"),
        @NamedQuery(name = "PackageV.findByDocAuditCDate", query = "SELECT p FROM PackageV p WHERE p.docAuditCDate = :docAuditCDate"),
        @NamedQuery(name = "PackageV.findByDocAuditLastMDate", query = "SELECT p FROM PackageV p WHERE p.docAuditLastMDate = :docAuditLastMDate"),
        @NamedQuery(name = "PackageV.findByDocAuditLastMBy", query = "SELECT p FROM PackageV p WHERE p.docAuditLastMBy = :docAuditLastMBy"),
        @NamedQuery(name = "PackageV.findByVersionLabel", query = "SELECT p FROM PackageV p WHERE p.versionLabel = :versionLabel"),
        @NamedQuery(name = "PackageV.findByVersionSeriesId", query = "SELECT p FROM PackageV p WHERE p.versionSeriesId = :versionSeriesId"),
        @NamedQuery(name = "PackageV.findByVersionType", query = "SELECT p FROM PackageV p WHERE p.versionType = :versionType"),
        @NamedQuery(name = "PackageV.findByIsLatestMajorVersion", query = "SELECT p FROM PackageV p WHERE p.isLatestMajorVersion = :isLatestMajorVersion"),
        @NamedQuery(name = "PackageV.findByIsLatestVersion", query = "SELECT p FROM PackageV p WHERE p.isLatestVersion = :isLatestVersion"),
        @NamedQuery(name = "PackageV.findByIsMajorVersion", query = "SELECT p FROM PackageV p WHERE p.isMajorVersion = :isMajorVersion"),
        @NamedQuery(name = "PackageV.findByIsVersionSeriesCheckedOut", query = "SELECT p FROM PackageV p WHERE p.isVersionSeriesCheckedOut = :isVersionSeriesCheckedOut"),
        @NamedQuery(name = "PackageV.findByActType", query = "SELECT p FROM PackageV p WHERE p.actType = :actType"),
        @NamedQuery(name = "PackageV.findByDocPurpose", query = "SELECT p FROM PackageV p WHERE p.docPurpose = :docPurpose"),
        @NamedQuery(name = "PackageV.findByDocType", query = "SELECT p FROM PackageV p WHERE p.docType = :docType"),
        @NamedQuery(name = "PackageV.findByEeaRelevance", query = "SELECT p FROM PackageV p WHERE p.eeaRelevance = :eeaRelevance"),
        @NamedQuery(name = "PackageV.findByTemplate", query = "SELECT p FROM PackageV p WHERE p.template = :template"),
        @NamedQuery(name = "PackageV.findByTitle", query = "SELECT p FROM PackageV p WHERE p.title = :title")})
public class PackageV implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "UNIQUE_ID", updatable = false)
    private String uniqueId;
    @Column(name = "PACKAGE_ID", updatable = false)
    private BigDecimal packageId;
    @Column(name = "PKG_OBJECT_ID", updatable = false)
    private BigDecimal pkgObjectId;
    @Column(name = "PACKAGE_NAME", updatable = false)
    private String packageName;
    @Column(name = "AUDIT_C_DATE", updatable = false)
    private LocalDateTime auditCDate;
    @Column(name = "AUDIT_C_BY", updatable = false)
    private String auditCBy;
    @Column(name = "AUDIT_LAST_M_DATE", updatable = false)
    private LocalDateTime auditLastMDate;
    @Column(name = "AUDIT_LAST_M_BY", updatable = false)
    private String auditLastMBy;
    @Column(name = "DOCUMENT_ID", updatable = false)
    private BigDecimal documentId;
    @Column(name = "DOC_OBJECT_ID", updatable = false)
    private BigDecimal docObjectId;
    @Column(name = "CATEGORY_ID", updatable = false)
    private BigDecimal categoryId;
    @Column(name = "NAME", updatable = false)
    private String name;
    @Column(name = "CLONED_FROM", updatable = false)
    private String clonedFrom;
    @Column(name = "REVISION_STATUS", updatable = false)
    private String revisionStatus;
    @Column(name = "CONTRIBUTION_STATUS", updatable = false)
    private String contributionStatus;
    @Column(name = "ORIGIN_REF", updatable = false)
    private String originRef;
    @Column(name = "BASE_REVISION_ID", updatable = false)
    private BigInteger baseRevisionId;
    @Column(name = "LIVE_DIFFING_REQUIRED", updatable = false)
    private Short liveDiffingRequired;
    @Column(name = "REF", updatable = false)
    private String ref;
    @Column(name = "PROCEDURE_TYPE", updatable = false)
    private String procedureType;
    @Column(name = "DOC_TEMPLATE", updatable = false)
    private String docTemplate;
    @Column(name = "LANGUAGE", updatable = false)
    private String language;
    @Column(name = "DOC_STAGE", updatable = false)
    private String docStage;
    @Column(name = "DOC_AUDIT_C_BY", updatable = false)
    private String docAuditCBy;
    @Column(name = "DOC_AUDIT_C_DATE", updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date docAuditCDate;
    @Column(name = "DOC_AUDIT_LAST_M_DATE", updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date docAuditLastMDate;
    @Column(name = "DOC_AUDIT_LAST_M_BY", updatable = false)
    private String docAuditLastMBy;
    @Column(name = "VERSION_LABEL", updatable = false)
    private String versionLabel;
    @Column(name = "VERSION_SERIES_ID", updatable = false)
    private String versionSeriesId;
    @Column(name = "VERSION_TYPE", updatable = false)
    private String versionType;
    @Column(name = "IS_LATEST_MAJOR_VERSION", updatable = false)
    private short isLatestMajorVersion;
    @Column(name = "IS_LATEST_VERSION", updatable = false)
    private short isLatestVersion;
    @Column(name = "IS_MAJOR_VERSION", updatable = false)
    private short isMajorVersion;
    @Column(name = "IS_VERSION_SERIES_CHECKED_OUT", updatable = false)
    private short isVersionSeriesCheckedOut;
    @Lob
    @Column(name = "CONTENT", updatable = false)
    private String content;
    @Column(name = "ACT_TYPE", updatable = false)
    private String actType;
    @Column(name = "DOC_PURPOSE", updatable = false)
    private String docPurpose;
    @Column(name = "DOC_TYPE", updatable = false)
    private String docType;
    @Column(name = "EEA_RELEVANCE", updatable = false)
    private Short eeaRelevance;
    @Column(name = "TEMPLATE", updatable = false)
    private String template;
    @Column(name = "TITLE", updatable = false)
    private String title;

    public PackageV() {
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

    public BigDecimal getPkgObjectId() {
        return pkgObjectId;
    }

    public void setPkgObjectId(BigDecimal pkgObjectId) {
        this.pkgObjectId = pkgObjectId;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public LocalDateTime getAuditCDate() {
        return auditCDate;
    }

    public void setAuditCDate(LocalDateTime auditCDate) {
        this.auditCDate = auditCDate;
    }

    public String getAuditCBy() {
        return auditCBy;
    }

    public void setAuditCBy(String auditCBy) {
        this.auditCBy = auditCBy;
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

    public BigDecimal getDocumentId() {
        return documentId;
    }

    public void setDocumentId(BigDecimal documentId) {
        this.documentId = documentId;
    }

    public BigDecimal getDocObjectId() {
        return docObjectId;
    }

    public void setDocObjectId(BigDecimal docObjectId) {
        this.docObjectId = docObjectId;
    }

    public BigDecimal getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(BigDecimal categoryId) {
        this.categoryId = categoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getClonedFrom() {
        return clonedFrom;
    }

    public void setClonedFrom(String clonedFrom) {
        this.clonedFrom = clonedFrom;
    }

    public String getRevisionStatus() {
        return revisionStatus;
    }

    public void setRevisionStatus(String revisionStatus) {
        this.revisionStatus = revisionStatus;
    }

    public String getContributionStatus() {
        return contributionStatus;
    }

    public void setContributionStatus(String contributionStatus) {
        this.contributionStatus = contributionStatus;
    }

    public String getOriginRef() {
        return originRef;
    }

    public void setOriginRef(String originRef) {
        this.originRef = originRef;
    }

    public BigInteger getBaseRevisionId() {
        return baseRevisionId;
    }

    public void setBaseRevisionId(BigInteger baseRevisionId) {
        this.baseRevisionId = baseRevisionId;
    }

    public Short getLiveDiffingRequired() {
        return liveDiffingRequired;
    }

    public void setLiveDiffingRequired(Short liveDiffingRequired) {
        this.liveDiffingRequired = liveDiffingRequired;
    }

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public String getProcedureType() {
        return procedureType;
    }

    public void setProcedureType(String procedureType) {
        this.procedureType = procedureType;
    }

    public String getDocTemplate() {
        return docTemplate;
    }

    public void setDocTemplate(String docTemplate) {
        this.docTemplate = docTemplate;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getDocStage() {
        return docStage;
    }

    public void setDocStage(String docStage) {
        this.docStage = docStage;
    }

    public String getDocAuditCBy() {
        return docAuditCBy;
    }

    public void setDocAuditCBy(String docAuditCBy) {
        this.docAuditCBy = docAuditCBy;
    }

    public Date getDocAuditCDate() {
        return docAuditCDate;
    }

    public void setDocAuditCDate(Date docAuditCDate) {
        this.docAuditCDate = docAuditCDate;
    }

    public Date getDocAuditLastMDate() {
        return docAuditLastMDate;
    }

    public void setDocAuditLastMDate(Date docAuditLastMDate) {
        this.docAuditLastMDate = docAuditLastMDate;
    }

    public String getDocAuditLastMBy() {
        return docAuditLastMBy;
    }

    public void setDocAuditLastMBy(String docAuditLastMBy) {
        this.docAuditLastMBy = docAuditLastMBy;
    }

    public String getVersionLabel() {
        return versionLabel;
    }

    public void setVersionLabel(String versionLabel) {
        this.versionLabel = versionLabel;
    }

    public String getVersionSeriesId() {
        return versionSeriesId;
    }

    public void setVersionSeriesId(String versionSeriesId) {
        this.versionSeriesId = versionSeriesId;
    }

    public String getVersionType() {
        return versionType;
    }

    public void setVersionType(String versionType) {
        this.versionType = versionType;
    }

    public short getIsLatestMajorVersion() {
        return isLatestMajorVersion;
    }

    public void setIsLatestMajorVersion(short isLatestMajorVersion) {
        this.isLatestMajorVersion = isLatestMajorVersion;
    }

    public short getIsLatestVersion() {
        return isLatestVersion;
    }

    public void setIsLatestVersion(short isLatestVersion) {
        this.isLatestVersion = isLatestVersion;
    }

    public short getIsMajorVersion() {
        return isMajorVersion;
    }

    public void setIsMajorVersion(short isMajorVersion) {
        this.isMajorVersion = isMajorVersion;
    }

    public short getIsVersionSeriesCheckedOut() {
        return isVersionSeriesCheckedOut;
    }

    public void setIsVersionSeriesCheckedOut(short isVersionSeriesCheckedOut) {
        this.isVersionSeriesCheckedOut = isVersionSeriesCheckedOut;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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

    public Short getEeaRelevance() {
        return eeaRelevance;
    }

    public void setEeaRelevance(Short eeaRelevance) {
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

}
