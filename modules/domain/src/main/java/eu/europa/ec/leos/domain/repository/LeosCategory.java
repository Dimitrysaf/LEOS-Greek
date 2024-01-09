package eu.europa.ec.leos.domain.repository;

public enum LeosCategory {
    PROPOSAL,
    MEMORANDUM,
    BILL,
    ANNEX,
    COUNCIL_EXPLANATORY,
    MEDIA,
    CONFIG,
    LEG,
    STRUCTURE,
    EXPORT,
    COVERPAGE,
    SUPPORT_DOCUMENT,
    STAT_FINANC_LEGIS,
    TEMPLATE;

    public static LeosCategory caseInsensitiveValueOf(String name) {
        for (LeosCategory value : LeosCategory.values()) {
            if (value.name().equalsIgnoreCase(name)) {
                return value;
            }
        }
        throw new IllegalArgumentException("No enum constant " + LeosCategory.class + "." + name);
    }

}
