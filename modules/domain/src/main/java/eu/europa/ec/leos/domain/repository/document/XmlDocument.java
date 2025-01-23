package eu.europa.ec.leos.domain.repository.document;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.common.Securable;
import eu.europa.ec.leos.domain.repository.common.SecurityData;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.model.user.Collaborator;
import io.atlassian.fugue.Option;

import java.time.Instant;
import java.util.List;

public abstract class XmlDocument extends LeosDocument implements Securable {
    private final String title;
    private final List<String> milestoneComments;
    private SecurityData securityData;
    private final boolean trackChangesEnabled;

    protected XmlDocument(LeosCategory category, String id, String name, String createdBy,
                          Instant creationInstant, String lastModifiedBy, Instant lastModificationInstant,
                          String versionSeriesId, String cmisVersionLabel, String versionLabel, String versionComment,
                          VersionType versionType, boolean isLatestVersion, String title,
                          List<Collaborator> collaborators, List<String> milestoneComments, Option<Content> content,
                          boolean trackChangesEnabled, boolean isVersionArchived) {
        super(category, id, name, createdBy, creationInstant, lastModifiedBy, lastModificationInstant, versionSeriesId,
                cmisVersionLabel, versionLabel, versionComment, versionType, isLatestVersion, isVersionArchived, content);
        this.securityData = new SecurityData(collaborators);
        this.title = title;
        this.milestoneComments = milestoneComments;
        this.trackChangesEnabled = trackChangesEnabled;
    }

    protected XmlDocument(LeosCategory category, String id, String name, String createdBy,
                          Instant creationInstant, String lastModifiedBy, Instant lastModificationInstant,
                          String versionSeriesId, String cmisVersionLabel, String versionLabel, String versionComment,
                          VersionType versionType, boolean isLatestVersion,  boolean isVersionArchived, Option<Content> content) {
        this(category, id, name, createdBy, creationInstant, lastModifiedBy, lastModificationInstant, versionSeriesId, cmisVersionLabel,
                versionLabel, versionComment, versionType, isLatestVersion, null, null, null, content, false, isVersionArchived);
        this.securityData = null;
    }

    public boolean isTrackChangesEnabled() {
        return trackChangesEnabled;
    }

    public final String getTitle() {
        return this.title;
    }

    public final List<String> getMilestoneComments() {
        return this.milestoneComments;
    }


    public List<Collaborator> getCollaborators() {
        return this.securityData.getCollaborators();
    }

    public abstract Option<? extends LeosMetadata> getMetadata();

    public String getVersionedReference() {
        return this.getMetadata().get().getRef() + "_" + this.getVersionLabel();
    }

    public abstract String getContributionStatus();
}
