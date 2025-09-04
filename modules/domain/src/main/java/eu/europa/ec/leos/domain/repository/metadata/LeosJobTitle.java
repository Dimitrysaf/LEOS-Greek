package eu.europa.ec.leos.domain.repository.metadata;

public enum LeosJobTitle {
    PRESID("President"),
    PRESID_VICE("Vice-President"),
    MEMBER_COM("Member of the Commission"),
    DIR_GEN("Director-General");

    private String title;

    LeosJobTitle(String title) {
        this.title = title;
    }

    public String getTitle() {return this.title; }

    public static LeosJobTitle caseInsensitiveValueOf(String name) {
        if (name == null) {
            return null;
        }
        for (LeosJobTitle value : LeosJobTitle.values()) {
            if (value.name().equalsIgnoreCase(name)) {
                return value;
            }
        }
        return null;
    }

    public static LeosJobTitle valueFromTitle(String title) {
        if (title == null) {
            return null;
        }
        for (LeosJobTitle value : LeosJobTitle.values()) {
            if (title.equalsIgnoreCase(value.getTitle())) {
                return value;
            }
        }
        return null;
    }
}
