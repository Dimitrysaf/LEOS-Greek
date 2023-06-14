package eu.europa.ec.leos.repository.utils;

public enum PropertiesMetadata {
    CATEGORY("category", true),
    COLLABORATORS("collaborators", false),
    DOC_PURPOSE("docPurpose", false),
    DOC_STAGE("docStage", false),
    DOC_TEMPLATE("docTemplate", false),
    TEMPLATE("template", false),
    DOC_TYPE("docType", false),
    EEA_RELEVANCE("eeaRelevance", false),
    CREATED_BY("initialCreatedBy", false),
    CREATION_DATE("initialCreationDate", false),
    LANGUAGE("language", false),
    REF("ref", false),
    NAME("name", false),
    TITLE("title", false),
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
