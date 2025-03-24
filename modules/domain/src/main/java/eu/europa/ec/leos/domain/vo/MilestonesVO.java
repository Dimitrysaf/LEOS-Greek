package eu.europa.ec.leos.domain.vo;


import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Objects;

public class MilestonesVO {
    private String title;
    private String documentTitle;
    private String legFileId;
    private final String legDocumentName;
    private final String proposalRef;
    private final String createdDate;
    private String createdBy;
    private String updatedDate;
    private String legFileStatus;
    private List<MilestonesVO> clonedMilestones;
    private Boolean isClone;
    private boolean isContributionChanged;
    private static final DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss").withZone(ZoneId.systemDefault());
    private String versionLabel;

    public MilestonesVO(List<String> titles, Date createdDate, Date updatedDate, String status, String legDocumentName,
            String proposalRef, String documentTitle, String legFileId) {
        this.title = String.join(",", titles);
        this.updatedDate = updatedDate == null ? null : dateFormat.format(updatedDate.toInstant());
        this.createdDate = dateFormat.format(createdDate.toInstant());
        this.legFileStatus = status;
        this.legDocumentName = legDocumentName;
        this.proposalRef = proposalRef;
        this.documentTitle = documentTitle;
        this.legFileId = legFileId;
    }

    public String getTitle() {
        return title;
    }

    public String getDocumentTitle() {
        return documentTitle;
    }

    public void setDocumentTitle(String documentTitle) {
        this.documentTitle = documentTitle;
    }

    public String getLegFileId() {
        return legFileId;
    }

    public void setLegFileId(String legFileId) {
        this.legFileId = legFileId;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public String getLegFileStatus() {
        return legFileStatus;
    }

    public void setLegFileStatus(String legFileStatus) {
        this.legFileStatus = legFileStatus;
    }

    public String getUpdatedDate() {
        return updatedDate;
    }

    public Date getUpdatedDateAsDate() {
        try {
            return Date.from(LocalDateTime.parse(updatedDate, dateFormat).atZone(ZoneId.systemDefault()).toInstant());
        } catch (Exception e) {
            return null;
        }
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getLegDocumentName() {
        return legDocumentName;
    }

    public String getProposalRef() {
        return proposalRef;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCreatedBy() {
        return this.createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public List<MilestonesVO> getClonedMilestones() {
        return clonedMilestones;
    }

    public void setClonedMilestones(List<MilestonesVO> clonedMilestones) {
        this.clonedMilestones = clonedMilestones;
    }

    public Boolean isClone() {
        return isClone;
    }

    public void setClone(Boolean clone) {
        this.isClone = clone;
    }

    public boolean isContributionChanged() {
        return isContributionChanged;
    }

    public void setContributionChanged(boolean contributionChanged) {
        isContributionChanged = contributionChanged;
    }

    public String getVersionLabel() {
        return versionLabel;
    }

    public void setVersionLabel(String versionLabel) {
        this.versionLabel = versionLabel;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        MilestonesVO that = (MilestonesVO) o;
        return Objects.equals(title, that.title) &&
                Objects.equals(legFileStatus, that.legFileStatus) &&
                Objects.equals(createdDate, that.createdDate) &&
                Objects.equals(updatedDate, that.updatedDate) &&
                Objects.equals(legDocumentName, that.legDocumentName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, legFileStatus, createdDate, updatedDate, legDocumentName);
    }

    @Override
    public String toString() {
        return "MilestonesVO{" +
                "title='" + title + '\'' +
                ", status='" + legFileStatus + '\'' +
                ", createdDate='" + createdDate + '\'' +
                ", updatedDate=" + updatedDate +
                ", legDocumentName='" + legDocumentName + '\'' +
                '}';
    }
}
