package eu.europa.ec.leos.domain.repository.common;

public interface Versionable {
    String getVersionSeriesId();

    String getCmisVersionLabel();
    
    String getVersionLabel();

    String getVersionComment();

    VersionType getVersionType();

    boolean isLatestVersion();

    boolean isVersionArchived();
}
