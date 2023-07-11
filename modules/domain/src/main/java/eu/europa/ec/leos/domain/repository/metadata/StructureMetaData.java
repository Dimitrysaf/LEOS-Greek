package eu.europa.ec.leos.domain.repository.metadata;

import eu.europa.ec.leos.domain.repository.LeosCategory;

public final class StructureMetaData extends LeosMetadata {

    public StructureMetaData(String stage, String type, String purpose, String template, String language, String docTemplate, String ref, String objectId, String docVersion, boolean eeaRelevance) {
        super(LeosCategory.STRUCTURE, stage, type, purpose, template, language, docTemplate, ref, objectId, docVersion, eeaRelevance);
    }
}
