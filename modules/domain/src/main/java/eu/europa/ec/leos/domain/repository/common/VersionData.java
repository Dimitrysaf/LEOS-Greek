package eu.europa.ec.leos.domain.repository.common;

import java.util.Objects;

public class VersionData implements Versionable {

    private final String versionSeriesId;
    private final String versionLabel;
    private final String versionComment;
    private final VersionType versionType;
    private final boolean isLatestVersion;
    private final String cmisVersionLabel;
    private final boolean isVersionArchived;

    public VersionData(String versionSeriesId, String cmisVersionLabel, String versionLabel, String versionComment
            , VersionType versionType, boolean isLatestVersion, boolean isVersionArchived) {
        this.versionSeriesId = versionSeriesId;
        this.cmisVersionLabel = cmisVersionLabel;
        this.versionLabel = versionLabel;
        this.versionComment = versionComment;
        this.versionType = versionType;
        this.isLatestVersion = isLatestVersion;
        this.isVersionArchived = isVersionArchived;
    }

    @Override
    public String getVersionSeriesId() {
        return versionSeriesId;
    }
    
    @Override
    public String getCmisVersionLabel() {
        return cmisVersionLabel;
    }
    
    @Override
    public String getVersionLabel() {
        return versionLabel;
    }

    @Override
    public String getVersionComment() {
        return versionComment;
    }

    @Override
    public VersionType getVersionType() {
        return versionType;
    }

    @Override
    public boolean isLatestVersion() {
        return isLatestVersion;
    }

    @Override
    public boolean isVersionArchived() { return isVersionArchived; }

    @Override
    public String toString() {
        return "VersionData{" +
                "versionSeriesId='" + versionSeriesId + '\'' +
                ", cmisVersionLabel='" + cmisVersionLabel + '\'' +
                ", versionLabel='" + versionLabel + '\'' +
                ", versionComment='" + versionComment + '\'' +
                ", versionType=" + versionType +
                ", isLatestVersion=" + isLatestVersion +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VersionData that = (VersionData) o;
        return Objects.equals(versionType, that.versionType) &&
                isLatestVersion == that.isLatestVersion &&
                Objects.equals(versionSeriesId, that.versionSeriesId) &&
                Objects.equals(cmisVersionLabel, that.cmisVersionLabel) &&
                Objects.equals(versionLabel, that.versionLabel) &&
                Objects.equals(versionComment, that.versionComment);
    }

    @Override
    public int hashCode() {
        return Objects.hash(versionSeriesId, cmisVersionLabel, versionLabel, versionComment, versionType, isLatestVersion);
    }
}
