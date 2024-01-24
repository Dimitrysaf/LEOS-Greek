package eu.europa.ec.leos.domain.repository.document;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.metadata.ProfileMetaData;
import eu.europa.ec.leos.domain.repository.metadata.StructureMetaData;
import io.atlassian.fugue.Option;

import java.time.Instant;

public final class Profile extends XmlDocument {

    private final Option<ProfileMetaData> metadata;

    public Profile(String id, String name, String createdBy, Instant creationInstant, String lastModifiedBy,
                     Instant lastModificationInstant, String versionSeriesId, String cmisVersionLabel, String versionLabel, String versionComment,
                     VersionType versionType, boolean isLatestVersion, Option<Content> content, Option<ProfileMetaData> metadata) {
        super(LeosCategory.LIGHT_PROFILE, id, name, createdBy, creationInstant, lastModifiedBy, lastModificationInstant,
                versionSeriesId, cmisVersionLabel, versionLabel, versionComment, versionType, isLatestVersion, content);
        this.metadata = metadata;
    }

    public Option<ProfileMetaData> getMetadata() {
        return this.metadata;
    }

    @Override
    public String getContributionStatus() {
        return null;
    }
}
