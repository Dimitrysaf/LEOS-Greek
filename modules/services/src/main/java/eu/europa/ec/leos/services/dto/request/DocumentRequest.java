package eu.europa.ec.leos.services.dto.request;

import eu.europa.ec.leos.domain.cmis.LeosCategory;

import java.io.Serializable;

public class DocumentRequest implements Serializable {
    private LeosCategory documentType;
    private String documentRef;

    public LeosCategory getDocumentType() {
        return documentType;
    }

    public void setDocumentType(LeosCategory documentType) {
        this.documentType = documentType;
    }

    public String getDocumentRef() {
        return documentRef;
    }

    public void setDocumentRef(String documentRef) {
        this.documentRef = documentRef;
    }
}
