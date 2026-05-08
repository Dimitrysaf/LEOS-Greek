package eu.europa.ec.leos.services.dto.request;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum SectionType {
    CITATIONS,
    RECITALS,
    ENACTING_TERMS;

    @JsonCreator
    public static SectionType fromString(String value) {
        if (value == null) return null;
        try {
            return SectionType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid sectionType: '" + value + "'. Accepted values: " + java.util.Arrays.toString(SectionType.values()));
        }
    }
}
