package eu.europa.ec.leos.services.dto.request;

import java.util.List;

public class UpdateProposalRequest {

    private String docPurpose;
    private Boolean eeaRelevance;
    private List<String> authenticLang;
    private String packageTitle;

    public String getDocPurpose() {
        return docPurpose;
    }

    public Boolean isEeaRelevance() {
        return eeaRelevance;
    }

    public void setDocPurpose(String docPurpose) {
        this.docPurpose = docPurpose;
    }

    public void setEeaRelevance(Boolean eeaRelevance) {
        this.eeaRelevance = eeaRelevance;
    }

    public List<String> getAuthenticLang() {
        return authenticLang;
    }

    public void setAuthenticLang(List<String> authenticLang) {
        this.authenticLang = authenticLang;
    }

    public String getPackageTitle() {
        return packageTitle;
    }

    public void setPackageTitle(String packageTitle) {
        this.packageTitle = packageTitle;
    }

    @Override
    public String toString() {
        return "UpdateProposalRequest{" +
                "docPurpose='" + docPurpose + '\'' +
                ", eeaRelevance=" + eeaRelevance +
                '}';
    }
}
