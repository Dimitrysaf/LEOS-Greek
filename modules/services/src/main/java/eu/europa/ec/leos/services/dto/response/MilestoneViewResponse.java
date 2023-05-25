package eu.europa.ec.leos.services.dto.response;

import java.util.List;

public class MilestoneViewResponse {

    private final List<MilestoneDocumentView> documents;
    private final boolean isPdfRenditionsPresent;

    public MilestoneViewResponse(List<MilestoneDocumentView> documents, boolean isPdfRenditionsPresent) {
        this.documents = documents;
        this.isPdfRenditionsPresent = isPdfRenditionsPresent;
    }

    public List<MilestoneDocumentView> getDocuments() {
        return documents;
    }

    public boolean isPdfRenditionsPresent() {
        return isPdfRenditionsPresent;
    }
}
