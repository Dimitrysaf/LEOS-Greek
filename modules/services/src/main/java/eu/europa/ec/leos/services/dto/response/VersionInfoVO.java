package eu.europa.ec.leos.services.dto.response;

import eu.europa.ec.leos.domain.repository.common.VersionType;

public class VersionInfoVO {

    String documentVersion;
    String lastModifiedBy;
    String entity;
    String lastModificationInstant;
    VersionType versionType;
    String revisedBaseVersion;
    String baseVersionTitle;

    public VersionInfoVO(String documentVersion, String lastModifiedBy, String entity, String lastModificationInstant, VersionType versionType) {
        super();
        this.documentVersion = documentVersion;
        this.lastModifiedBy = lastModifiedBy;
        this.entity = entity;
        this.lastModificationInstant = lastModificationInstant;
        this.versionType = versionType;
    }

    public VersionInfoVO(String documentVersion, String lastModifiedBy, String entity, String lastModificationInstant, VersionType versionType, String revisedBaseVersion, String baseVersionTitle) {
        super();
        this.documentVersion = documentVersion;
        this.lastModifiedBy = lastModifiedBy;
        this.entity = entity;
        this.lastModificationInstant = lastModificationInstant;
        this.versionType = versionType;
        this.revisedBaseVersion = revisedBaseVersion;
        this.baseVersionTitle = baseVersionTitle;
    }

    public String getDocumentVersion() {
        return documentVersion;
    }

    public void setDocumentVersion(String documentVersion) {
        this.documentVersion = documentVersion;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public String getEntity() {
        return entity;
    }

    public void setEntity(String entity) {
        this.entity = entity;
    }

    public String getLastModificationInstant() {
        return lastModificationInstant;
    }

    public void setLastModificationInstant(String lastModificationInstant) {
        this.lastModificationInstant = lastModificationInstant;
    }

    public VersionType getVersionType() {
        return versionType;
    }

    public void setVersionType(VersionType versionType) {
        this.versionType = versionType;
    }

    public String getRevisedBaseVersion() {
        return revisedBaseVersion;
    }

    public void setRevisedBaseVersion(String revisedBaseVersion) {
        this.revisedBaseVersion = revisedBaseVersion;
    }

    public String getBaseVersionTitle() { return baseVersionTitle; }

    public void setBaseVersionTitle(String baseVersionTitle) { this.baseVersionTitle = baseVersionTitle; }
}
