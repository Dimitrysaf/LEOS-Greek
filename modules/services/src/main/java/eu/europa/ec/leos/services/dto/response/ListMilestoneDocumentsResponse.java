package eu.europa.ec.leos.services.dto.response;

import java.util.List;

public class ListMilestoneDocumentsResponse {
    private List<MilestoneDocumentView> listDocuments;

    public ListMilestoneDocumentsResponse(List<MilestoneDocumentView> listDocuments) {
        this.listDocuments = listDocuments;
    }

    public List<MilestoneDocumentView> getListDocuments() {
        return listDocuments;
    }

    public void setListDocuments(List<MilestoneDocumentView> listDocuments) {
        this.listDocuments = listDocuments;
    }
}
