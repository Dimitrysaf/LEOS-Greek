package eu.europa.ec.leos.services.dto.response;

import java.util.List;

public class MilestoneViewResponse {

    private final List<MilestoneDocumentView> documents;
    private final boolean isPdfRenditionsPresent;

    private final boolean isContributionChanged;

    public MilestoneViewResponse(List<MilestoneDocumentView> documents, boolean isPdfRenditionsPresent, boolean isContributionChanged) {
        this.documents = documents;
        this.isPdfRenditionsPresent = isPdfRenditionsPresent;
        this.isContributionChanged = isContributionChanged;
    }

    public List<MilestoneDocumentView> getDocuments() {
        return documents;
    }

    public boolean isPdfRenditionsPresent() {
        return isPdfRenditionsPresent;
    }

    public boolean isContributionChanged() {
        return isContributionChanged;
    }
}
