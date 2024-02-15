package eu.europa.ec.leos.domain.repository.metadata;

import eu.europa.ec.leos.domain.repository.LeosCategory;

import java.util.Objects;

public abstract class LeosMetadata {

    private final LeosCategory category;
    protected final String stage;
    protected final String type;
    protected final String purpose;
    protected final String template;
    protected final String language;
    protected final String docTemplate;
    protected final String ref;
    protected final String objectId;
    protected final String docVersion;
    protected final boolean eeaRelevance;
    private String procedureType;
    private String actType;
    private String callbackAddress;
    protected boolean imported;

    protected LeosMetadata(LeosCategory category, String stage, String type, String purpose, String template,
                           String language, String docTemplate, String ref, String objectId, String docVersion,
                           boolean eeaRelevance) {
        this.category = category;
        this.stage = stage;
        this.type = type;
        this.purpose = purpose;
        this.template = template;
        this.language = language;
        this.docTemplate = docTemplate;
        this.ref = ref;
        this.objectId = objectId;
        this.docVersion = docVersion;
        this.eeaRelevance = eeaRelevance;
    }

    public String getStage() {
        return stage;
    }

    public String getType() {
        return type;
    }

    public String getPurpose() {
        return purpose;
    }

    public String getTemplate() {
        return template;
    }

    public String getLanguage() {
        return language;
    }

    public String getDocTemplate() {
        return docTemplate;
    }

    public String getRef() {
        return ref;
    }

    public String getObjectId() {
        return objectId;
    }

    public final LeosCategory getCategory() {
        return category;
    }

    public String getDocVersion() {
        return docVersion;
    }

    public boolean getEeaRelevance() {
        return eeaRelevance;
    }

    public String getCallbackAddress() {
        return callbackAddress;
    }

    public void setCallbackAddress(String callbackAddress) {
        this.callbackAddress = callbackAddress;
    }

    public String getProcedureType() {
        return procedureType;
    }

    public void setProcedureType(String procedureType) {
        this.procedureType = procedureType;
    }

    public String getActType() {
        return actType;
    }

    public void setActType(String actType) {
        this.actType = actType;
    }

    public boolean isImported() {
        return imported;
    }

    public void setImported(boolean imported) {
        this.imported = imported;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LeosMetadata that = (LeosMetadata) o;
        return category == that.category &&
                Objects.equals(stage, that.stage) &&
                Objects.equals(type, that.type) &&
                Objects.equals(purpose, that.purpose) &&
                Objects.equals(template, that.template) &&
                Objects.equals(language, that.language) &&
                Objects.equals(docTemplate, that.docTemplate) &&
                Objects.equals(ref, that.ref) &&
                Objects.equals(objectId, that.objectId) &&
                Objects.equals(eeaRelevance, that.eeaRelevance) &&
                Objects.equals(docVersion, that.docVersion);
    }

    @Override
    public int hashCode() {
        return Objects.hash(category, stage, type, purpose, template, language, docTemplate, ref, objectId, docVersion, eeaRelevance);
    }

    @Override
    public String toString() {
        return "LeosMetadata{" +
                "category=" + category +
                ", stage='" + stage + '\'' +
                ", type='" + type + '\'' +
                ", purpose='" + purpose + '\'' +
                ", template='" + template + '\'' +
                ", language='" + language + '\'' +
                ", docTemplate='" + docTemplate + '\'' +
                ", ref='" + ref + '\'' +
                ", objectId='" + objectId + '\'' +
                ", docVersion='" + docVersion + '\'' +
                ", eeaRelevance ='" + eeaRelevance + '\'' +
                '}';
    }
}
