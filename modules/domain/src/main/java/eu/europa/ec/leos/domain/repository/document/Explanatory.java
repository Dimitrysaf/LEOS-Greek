package eu.europa.ec.leos.domain.repository.document;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.metadata.ExplanatoryMetadata;
import eu.europa.ec.leos.model.user.Collaborator;
import io.atlassian.fugue.Option;

import java.time.Instant;
import java.util.List;

public final class Explanatory extends XmlDocument {
	private final String baseRevisionId;
	private final boolean liveDiffingRequired;
    private final Option<ExplanatoryMetadata> metadata;

    public Explanatory(String id, String name, String createdBy, Instant creationInstant, String lastModifiedBy,
                       Instant lastModificationInstant, String versionSeriesId, String cmisVersionLabel, String versionLabel,
                       String versionComment, VersionType versionType, boolean isLatestVersion, String title,
                       List<Collaborator> collaborators, List<String> milestoneComments, Option<Content> content,
                       String baseRevisionId, boolean liveDiffingRequired, Option<ExplanatoryMetadata> metadata, boolean trackChangesEnabled) {

        super(LeosCategory.COUNCIL_EXPLANATORY, id, name, createdBy, creationInstant, lastModifiedBy, lastModificationInstant,
                versionSeriesId, cmisVersionLabel, versionLabel, versionComment, versionType, isLatestVersion, title,
                collaborators, milestoneComments, content, trackChangesEnabled, false);
        this.baseRevisionId = baseRevisionId;
        this.liveDiffingRequired = liveDiffingRequired;
        this.metadata = metadata;
    }

    public String getBaseRevisionId() {
		return baseRevisionId;
	}

	public boolean isLiveDiffingRequired() {
		return liveDiffingRequired;
	}

	public final Option<ExplanatoryMetadata> getMetadata() {
        return this.metadata;
    }

    @Override
    public String getContributionStatus() {
        return null;
    }
}
