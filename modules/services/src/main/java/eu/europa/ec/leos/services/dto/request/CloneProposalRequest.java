package eu.europa.ec.leos.services.dto.request;

public class CloneProposalRequest {
    private String legDocumentName;
    private String userLogin;

    public String getLegDocumentName() {
        return legDocumentName;
    }

    public void setLegDocumentName(String legDocumentName) {
        this.legDocumentName = legDocumentName;
    }

    public String getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(String userLogin) {
        this.userLogin = userLogin;
    }
}
