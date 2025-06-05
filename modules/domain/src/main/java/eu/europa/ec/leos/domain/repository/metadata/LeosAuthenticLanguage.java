package eu.europa.ec.leos.domain.repository.metadata;

public enum LeosAuthenticLanguage {
    ALL,
    PROPOSAL_LANGUAGE,
    NON_PROPOSAL_LANGUAGE,
    FALSE;

    public static LeosAuthenticLanguage caseInsensitiveValueOf(String name) {
        if (name == null) {
            return null;
        }
        for (LeosAuthenticLanguage value : LeosAuthenticLanguage.values()) {
            if (value.name().equalsIgnoreCase(name)) {
                return value;
            }
        }
        return null;
    }

}
