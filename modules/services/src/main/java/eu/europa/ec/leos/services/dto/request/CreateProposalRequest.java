package eu.europa.ec.leos.services.dto.request;

public class CreateProposalRequest {

    private String templateId;
    private String templateName;
    private String langCode;
    private String docPurpose;
    private boolean eeaRelevance;
    private String key;

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public String getLangCode() {
        return langCode;
    }

    public void setLangCode(String langCode) {
        this.langCode = langCode;
    }

    public String getDocPurpose() {
        return docPurpose;
    }

    public void setDocPurpose(String docPurpose) {
        this.docPurpose = docPurpose;
    }

    public boolean isEeaRelevance() {
        return eeaRelevance;
    }

    public void setEeaRelevance(boolean eeaRelevance) {
        this.eeaRelevance = eeaRelevance;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    @Override
    public String toString() {
        return "ProposalRequest{" +
                "templateId='" + templateId + '\'' +
                ", templateName='" + templateName + '\'' +
                ", langCode='" + langCode + '\'' +
                ", docPurpose='" + docPurpose + '\'' +
                ", eeaRelevance=" + eeaRelevance +
                ", key=" + key +
                '}';
    }

}
