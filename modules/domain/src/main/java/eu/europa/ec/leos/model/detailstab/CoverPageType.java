package eu.europa.ec.leos.model.detailstab;

public enum CoverPageType {
    STANDARD("STANDARD"),
    EUROPA_EURLEX("EUROPA_EURLEX"),
    COMMITEE_EXPERTS_GROUP("COMMITEE_EXPERTS_GROUP");

    private final String value;

    CoverPageType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
