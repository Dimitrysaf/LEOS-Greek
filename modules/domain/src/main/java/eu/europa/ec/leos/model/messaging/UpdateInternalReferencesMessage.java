package eu.europa.ec.leos.model.messaging;

public class UpdateInternalReferencesMessage {

    private String documentId;
    private String documentRef;

    public UpdateInternalReferencesMessage() {//json deserialized need the empty constructor
    }

    public UpdateInternalReferencesMessage(String documentId, String documentRef) {
        this.documentId = documentId;
        this.documentRef = documentRef;
    }

    public String getDocumentId() {
        return documentId;
    }

    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    public String getDocumentRef() {
        return documentRef;
    }

    public void setDocumentRef(String documentRef) {
        this.documentRef = documentRef;
    }

    @Override
    public String toString() {
        return "UpdateInternalReferencesMessage{" +
                "documentId='" + documentId + '\'' +
                ", documentRef='" + documentRef + '\'' +
                '}';
    }
}
