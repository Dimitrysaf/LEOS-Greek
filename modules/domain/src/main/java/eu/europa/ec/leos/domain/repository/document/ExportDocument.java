package eu.europa.ec.leos.domain.repository.document;

import java.time.Instant;
import java.util.List;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosExportStatus;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import io.atlassian.fugue.Option;

public final class ExportDocument extends LeosDocument {
    private final String initialCreatedBy;
    private final Instant initialCreationInstant;
    private final LeosExportStatus status;
    private final List<String> comments;
    private final String exportRef;

    public ExportDocument(String id, String name, String createdBy, Instant creationInstant, String lastModifiedBy,
                          Instant lastModificationInstant, String versionSeriesId, String cmisVersionLabel, String versionLabel, String versionComment,
                          VersionType versionType, boolean isLatestVersion, String initialCreatedBy, Instant initialCreationInstant, Option<Content> content,
                          LeosExportStatus status, List<String> comments, String exportRef) {

        super(LeosCategory.EXPORT, id, name, createdBy, creationInstant, lastModifiedBy, lastModificationInstant,
                versionSeriesId, cmisVersionLabel, versionLabel, versionComment, versionType, isLatestVersion, false, content);
        this.initialCreatedBy = initialCreatedBy;
        this.initialCreationInstant = initialCreationInstant;
        this.status = status;
        this.comments = comments;
        this.exportRef = exportRef;
    }

    public String getInitialCreatedBy() {
        return this.initialCreatedBy;
    }

    public Instant getInitialCreationInstant() {
        return this.initialCreationInstant;
    }

    public LeosExportStatus getStatus() { return status; }

    public List<String> getComments() { return comments; }

    public String getExportRef() {
        return exportRef;
    }
}
