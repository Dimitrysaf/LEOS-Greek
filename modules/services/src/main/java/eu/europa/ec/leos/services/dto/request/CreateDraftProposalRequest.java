package eu.europa.ec.leos.services.dto.request;

public class CreateDraftProposalRequest {
    private String docPurpose;
    private String templateId;
    private boolean eeaRelevance;

    public String getDocPurpose() {
        return docPurpose;
    }

    public void setDocPurpose(String docPurpose) {
        this.docPurpose = docPurpose;
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public boolean isEeaRelevance() {
        return eeaRelevance;
    }

    public void setEeaRelevance(boolean eeaRelevance) {
        this.eeaRelevance = eeaRelevance;
    }

    @Override
    public String toString() {
        return "ProposalRequest{" +
                "templateId='" + templateId + '\'' +
                ", docPurpose='" + docPurpose + '\'' +
                ", eeaRelevance=" + eeaRelevance +
                '}';
    }
}
