package eu.europa.ec.leos.services.request;

public class SaveAfterReplaceRequest {
    private String documentRef;
    private String updatedContent;

    public String getDocumentRef() {
        return documentRef;
    }

    public void setDocumentRef(String documentRef) {
        this.documentRef = documentRef;
    }

    public String getUpdatedContent() {
        return updatedContent;
    }

    public void setUpdatedContent(String updatedContent) {
        this.updatedContent = updatedContent;
    }


}
