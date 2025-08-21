package eu.europa.ec.leos.domain.repository.common;

import java.io.Serializable;

public enum VersionType implements Serializable {

    MAJOR(1), INTERMEDIATE(2), MINOR(3), TECHNICAL(4);
    private final int value;

    VersionType(int v) {
        value = v;
    }

    public int value() {
        return value;
    }

    public static VersionType fromValue(int v) {
        for (VersionType c : VersionType.values()) {
            if (c.value == v) {
                return c;
            }
        }
        throw new IllegalArgumentException(String.valueOf(v));
    }

}
