package eu.europa.ec.leos.domain.repository.document;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.metadata.FinancialStatementMetadata;
import eu.europa.ec.leos.model.user.Collaborator;
import io.atlassian.fugue.Option;

import java.time.Instant;
import java.util.List;

public final class FinancialStatement extends XmlDocument {
    private final Option<FinancialStatementMetadata> metadata;
    private final String baseRevisionId;
    private final String contributionStatus;
    private final String clonedFrom;

    public FinancialStatement(String id, String name, String createdBy, Instant creationInstant, String lastModifiedBy,
                              Instant lastModificationInstant, String versionSeriesId, String cmisVersionLabel, String versionLabel,
                              String versionComment, VersionType versionType, boolean isLatestVersion, String title,
                              List<Collaborator> collaborators, List<String> milestoneComments, Option<Content> content,
                              Option<FinancialStatementMetadata> metadata, String baseRevisionId, boolean trackChangesEnabled,
                                String contributionStatus, String clonedFrom) {

        super(LeosCategory.STAT_FINANC_LEGIS, id, name, createdBy, creationInstant, lastModifiedBy, lastModificationInstant,
                versionSeriesId, cmisVersionLabel, versionLabel, versionComment, versionType, isLatestVersion, title,
                collaborators, milestoneComments, content, trackChangesEnabled);
        this.metadata = metadata;
        this.baseRevisionId = baseRevisionId;
        this.contributionStatus = contributionStatus;
        this.clonedFrom = clonedFrom;
    }

    public final Option<FinancialStatementMetadata> getMetadata() {
        return this.metadata;
    }

    public String getBaseRevisionId() { return baseRevisionId; }

    public String getContributionStatus() {
        return contributionStatus;
    }

    public String getClonedFrom() {
        return clonedFrom;
    }
}
