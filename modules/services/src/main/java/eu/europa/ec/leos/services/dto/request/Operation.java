package eu.europa.ec.leos.services.dto.request;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Operation {
    CLEAN,
    OVERWRITE,
    INSERT_BEFORE,
    INSERT_AFTER,
    APPEND;

    @JsonCreator
    public static Operation fromString(String value) {
        if (value == null) return null;
        try {
            return Operation.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid operation: '" + value + "'. Accepted values: " + java.util.Arrays.toString(Operation.values()));
        }
    }
}
