package eu.europa.ec.leos.domain.repository;

import java.io.Serializable;

public enum LeosCategory implements Serializable {
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
    STAT_DIGIT_FINANC_LEGIS,
    TEMPLATE,
    LIGHT_PROFILE;

    public static LeosCategory caseInsensitiveValueOf(String name) {
        for (LeosCategory value : LeosCategory.values()) {
            if (value.name().equalsIgnoreCase(name)) {
                return value;
            }
        }
        throw new IllegalArgumentException("No enum constant " + LeosCategory.class + "." + name);
    }

}
