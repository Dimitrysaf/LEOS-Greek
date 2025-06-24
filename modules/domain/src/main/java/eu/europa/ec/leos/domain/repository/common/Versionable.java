package eu.europa.ec.leos.domain.repository.common;

import java.io.Serializable;

public interface Versionable extends Serializable {
    String getVersionSeriesId();

    String getCmisVersionLabel();
    
    String getVersionLabel();

    String getVersionComment();

    VersionType getVersionType();

    boolean isLatestVersion();

    boolean isVersionArchived();
}
