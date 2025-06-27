package eu.europa.ec.leos.domain.repository.metadata;

public enum LeosCoverPageType {
    STANDARD,
    EUROPA_EURLEX,
    COMMITEE_EXPERTS_GROUP;

    public static LeosCoverPageType caseInsensitiveValueOf(String name) {
        if (name == null) {
            return null;
        }
        for (LeosCoverPageType value : LeosCoverPageType.values()) {
            if (value.name().equalsIgnoreCase(name)) {
                return value;
            }
        }
        return null;
    }

}
