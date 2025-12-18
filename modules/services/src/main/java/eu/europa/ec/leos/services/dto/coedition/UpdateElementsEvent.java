package eu.europa.ec.leos.services.dto.coedition;

import eu.europa.ec.leos.services.dto.response.SaveElementResponse;
import java.io.Serializable;

public class UpdateElementsEvent implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String documentRef;
    private String presenterId;
    private SaveElementResponse updatedElement;
    private String alternateElementId;

    public UpdateElementsEvent() {}

    public UpdateElementsEvent(String documentRef, String presenterId, SaveElementResponse updatedElement, String alternateElementId) {
        this.documentRef = documentRef;
        this.presenterId = presenterId;
        this.updatedElement = updatedElement;
        this.alternateElementId = alternateElementId;
    }

    public String getDocumentRef() { return documentRef; }
    public void setDocumentRef(String documentRef) { this.documentRef = documentRef; }
    
    public String getPresenterId() { return presenterId; }
    public void setPresenterId(String presenterId) { this.presenterId = presenterId; }
    
    public SaveElementResponse getUpdatedElement() { return updatedElement; }
    public void setUpdatedElement(SaveElementResponse updatedElement) { this.updatedElement = updatedElement; }
    
    public String getAlternateElementId() { return alternateElementId; }
    public void setAlternateElementId(String alternateElementId) { this.alternateElementId = alternateElementId; }
}
