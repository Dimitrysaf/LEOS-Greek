package eu.europa.ec.leos.repository.utils;

public enum PropertiesMetadata {
    CATEGORY("category", true),
    COLLABORATORS("collaborators", true),
    DOC_PURPOSE("docPurpose", true),
    DOC_STAGE("docStage", true),
    DOC_TEMPLATE("docTemplate", true),
    TEMPLATE("template", true),
    DOC_TYPE("docType", true),
    EEA_RELEVANCE("eeaRelevance", false),
    CREATED_BY("initialCreatedBy", false),
    CREATION_DATE("initialCreationDate", false),
    LANGUAGE("language", true),
    REF("ref", true),
    TITLE("title", true),
    CLONED_PROPOSAL("clonedProposal", false),
    ORIGIN_REF("originRef", false),
    CLONED_FROM("clonedFrom", false),
    REVISION_STATUS("revisionStatus", false),
    CONTRIBUTION_STATUS("contributionStatus", false),
    BASE_REVISION_ID("baseRevisionId", false);

    private Boolean isMandatory = false;
    private String leosName;

    private PropertiesMetadata(String leosName, Boolean isMandatory) {
        this.leosName = leosName;
        this.isMandatory = isMandatory;
    }

    public Boolean isMandatory() {
        return this.isMandatory;
    }

    public String getLeosName() {
        return this.leosName;
    }
}
