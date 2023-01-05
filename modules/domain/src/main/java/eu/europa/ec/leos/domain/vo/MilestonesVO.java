package eu.europa.ec.leos.domain.vo;



import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;

public class MilestonesVO {
    private String title;
    private final String legDocumentName;
    private final String proposalRef;
    private final String createdDate;
    private Date updatedDate;
    private String status;
    private List<MilestonesVO> clonedMilestones;
    private Boolean isClone ;
    private boolean isContributionChanged;

    private static final DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

    public MilestonesVO(List<String> titles, Date createdDate, Date updatedDate, String status, String legDocumentName,
                        String proposalRef) {
        this.title = String.join(",", titles);
        this.updatedDate = updatedDate;
        this.createdDate = dateFormat.format(createdDate);
        this.status = status;
        this.legDocumentName = legDocumentName;
        this.proposalRef = proposalRef;
    }

    public String getTitle() {
        return title;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getLegDocumentName() {
        return legDocumentName;
    }

    public String getProposalRef() {
        return proposalRef;
    }

    public void setTitle(String title){this.title = title;}

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

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        MilestonesVO that = (MilestonesVO) o;
        return Objects.equals(title, that.title) &&
                Objects.equals(status, that.status) &&
                Objects.equals(createdDate, that.createdDate) &&
                Objects.equals(updatedDate, that.updatedDate) &&
                Objects.equals(legDocumentName, that.legDocumentName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, status, createdDate, updatedDate, legDocumentName);
    }

    @Override public String toString() {
        return "MilestonesVO{" +
                "title='" + title + '\'' +
                ", status='" + status + '\'' +
                ", createdDate='" + createdDate + '\'' +
                ", updatedDate=" + updatedDate +
                ", legDocumentName='" + legDocumentName + '\'' +
                '}';
    }
}
