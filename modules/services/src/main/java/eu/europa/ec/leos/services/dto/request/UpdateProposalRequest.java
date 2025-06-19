package eu.europa.ec.leos.services.dto.request;

import eu.europa.ec.leos.domain.repository.metadata.LeosAuthenticLanguage;

import java.util.List;

public class UpdateProposalRequest {

    private String docPurpose;
    private Boolean eeaRelevance;
    private String packageTitle;
    private String internalRef;
    private LeosAuthenticLanguage isAuthenticLang;
    private List<String> authenticLang;

    public String getDocPurpose() {
        return docPurpose;
    }

    public Boolean isEeaRelevance() {
        return eeaRelevance;
    }

    public String getPackageTitle() {
        return packageTitle;
    }

    public LeosAuthenticLanguage getIsAuthenticLang() {
        return isAuthenticLang;
    }

    public String getInternalRef() { return internalRef; }

    public List<String> getAuthenticLang() { return authenticLang; }

    public void setDocPurpose(String docPurpose) {
        this.docPurpose = docPurpose;
    }

    public void setEeaRelevance(Boolean eeaRelevance) {
        this.eeaRelevance = eeaRelevance;
    }

    public void setAuthenticLang(List<String> authenticLang) {
        this.authenticLang = authenticLang;
    }

    public void setIsAuthenticLang(LeosAuthenticLanguage isAuthenticLang) {
        this.isAuthenticLang = isAuthenticLang;
    }

    public void setPackageTitle(String packageTitle) {
        this.packageTitle = packageTitle;
    }

    public void setInternalRef(String internalRef) { this.internalRef = internalRef; }

    @Override
    public String toString() {
        return "UpdateProposalRequest{" +
                "docPurpose='" + docPurpose + '\'' +
                ", eeaRelevance=" + eeaRelevance +
                '}';
    }
}
