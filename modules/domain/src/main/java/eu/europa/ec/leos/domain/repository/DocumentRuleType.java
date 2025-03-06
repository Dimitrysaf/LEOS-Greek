package eu.europa.ec.leos.domain.repository;

public enum DocumentRuleType {

    STRUCTURE_VALIDATION("structureValidation"),
    ONLY_ONE_OCCURENCE_ELEMENT("onlyOneOccurenceElement"),
    NOT_EMPTY("notEmpty"),
    HIERARCHY("hierarchy");

    private String ruleType;

    DocumentRuleType(String ruleTYpe) {
        this.ruleType = ruleTYpe;
    }

    public String getRuleType() {return ruleType;}

}
