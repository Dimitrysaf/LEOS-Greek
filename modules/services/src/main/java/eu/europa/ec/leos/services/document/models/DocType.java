package eu.europa.ec.leos.services.document.models;

public enum DocType {
    REGULATION("reg"), DIRECTIVE("dir"), DECISION("dec");

    String type;

    DocType(String type) {
        this.type = type;
    }

    public String getValue() {
        return type;
    }
}
