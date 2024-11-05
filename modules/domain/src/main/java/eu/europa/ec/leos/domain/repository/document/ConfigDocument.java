package eu.europa.ec.leos.domain.repository.document;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import io.atlassian.fugue.Option;

import java.time.Instant;

public final class ConfigDocument extends LeosDocument {
    public ConfigDocument(String id, String name, String createdBy, Instant creationInstant, String lastModifiedBy,
                          Instant lastModificationInstant, String versionSeriesId, String cmisVersionLabel, String versionLabel, String versionComment,
                          VersionType versionType, boolean isLatestVersion, Option<Content> content) {

        super(LeosCategory.CONFIG, id, name, createdBy, creationInstant, lastModifiedBy, lastModificationInstant,
                versionSeriesId, cmisVersionLabel, versionLabel, versionComment, versionType, isLatestVersion, content);
    }
}
