package eu.europa.ec.leos.services.request;

public class SaveAfterReplaceRequest {
    private String documentRef;
    private byte[] updatedContent;

    public String getDocumentRef() {
        return documentRef;
    }

    public void setDocumentRef(String documentRef) {
        this.documentRef = documentRef;
    }

    public byte[] getUpdatedContent() {
        return updatedContent;
    }

    public void setUpdatedContent(byte[] updatedContent) {
        this.updatedContent = updatedContent;
    }


}
