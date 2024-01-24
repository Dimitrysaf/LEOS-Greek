package eu.europa.ec.leos.domain.repository.metadata;

import eu.europa.ec.leos.domain.repository.LeosCategory;

public final class ProfileMetaData extends LeosMetadata {

    public ProfileMetaData(String stage, String type, String purpose, String template, String language, String docTemplate, String ref, String objectId, String docVersion, boolean eeaRelevance) {
        super(LeosCategory.LIGHT_PROFILE, stage, type, purpose, template, language, docTemplate, ref, objectId, docVersion, eeaRelevance);
    }
}
