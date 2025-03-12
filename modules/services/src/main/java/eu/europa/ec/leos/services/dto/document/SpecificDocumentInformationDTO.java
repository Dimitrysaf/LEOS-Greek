package eu.europa.ec.leos.services.dto.document;

public class SpecificDocumentInformationDTO {

    private  String refersToOfDocument;
    private String showAs;

    public SpecificDocumentInformationDTO(String refersToOfDocument, String showAs) {
        this.refersToOfDocument = refersToOfDocument;
        this.showAs = showAs;
    }

    public String getRefersToOfDocument() {
        return refersToOfDocument;
    }
    public void setRefersToOfDocument(String refersToOfDocument) {
        this.refersToOfDocument = refersToOfDocument;
    }
    public String getShowAs() {
        return showAs;
    }
    public void setShowAs(String showAs) {
        this.showAs = showAs;
    }

}
