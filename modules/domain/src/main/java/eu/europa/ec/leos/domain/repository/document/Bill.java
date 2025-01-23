package eu.europa.ec.leos.domain.repository.document;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.metadata.BillMetadata;
import eu.europa.ec.leos.model.user.Collaborator;
import io.atlassian.fugue.Option;

import java.time.Instant;
import java.util.List;

public final class Bill extends XmlDocument {
    private final Option<BillMetadata> metadata;
    private final String baseRevisionId;
    private final String contributionStatus;
    private final String clonedFrom;

    public Bill(String id, String name, String createdBy, Instant creationInstant, String lastModifiedBy, Instant lastModificationInstant,
                String versionSeriesId, String cmisVersionLabel, String versionLabel, String versionComment, VersionType versionType, boolean isLatestVersion,
                String title, List<Collaborator> collaborators, List<String> milestoneComments,
                String baseRevisionId, String contributionStatus, String clonedFrom,
                Option<Content> content, Option<BillMetadata> metadata, boolean trackChangesEnabled, boolean isVersionArchived) {

        super(LeosCategory.BILL, id, name, createdBy, creationInstant, lastModifiedBy, lastModificationInstant,
                versionSeriesId, cmisVersionLabel, versionLabel, versionComment, versionType, isLatestVersion, title, collaborators,
                milestoneComments, content, trackChangesEnabled, isVersionArchived);
        this.metadata = metadata;
        this.baseRevisionId = baseRevisionId;
        this.contributionStatus = contributionStatus;
        this.clonedFrom = clonedFrom;
    }

    public Option<BillMetadata> getMetadata() {
        return metadata;
    }

    public String getBaseRevisionId() { return baseRevisionId; }

    public String getContributionStatus() {
        return contributionStatus;
    }

    public String getClonedFrom() {
        return clonedFrom;
    }
}
