package eu.europa.ec.leos.services.dto.request;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum AknType {
    CITATION,
    RECITAL,
    RECITALS,
    PART,
    TITLE,
    CHAPTER,
    SECTION,
    NUMBERED_ARTICLE,
    UNNUMBERED_ARTICLE,
    ARTICLE_HEADING,
    PARAGRAPH,
    NUMBERED_PARAGRAPH,
    UNNUMBERED_PARAGRAPH,
    LIST,
    POINT,
    AUTHORIAL_NOTE;

    @JsonCreator
    public static AknType fromString(String value) {
        if (value == null) return null;
        try {
            return AknType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid AknType: '" + value + "'. Accepted values: " + java.util.Arrays.toString(AknType.values()));
        }
    }
}
