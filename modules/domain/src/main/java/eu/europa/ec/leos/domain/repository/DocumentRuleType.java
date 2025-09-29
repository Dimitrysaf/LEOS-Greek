package eu.europa.ec.leos.domain.repository;

import java.io.Serializable;

public enum DocumentRuleType implements Serializable {

    STRUCTURE_VALIDATION("structureValidation"),
    ONLY_ONE_OCCURENCE_ELEMENT("onlyOneOccurenceElement"),
    NOT_EMPTY_HIGHER_DIVISION("notEmptyHigherDivision"),
    NOT_EMPTY_ELEMENT("notEmptyElement"),
    HIERARCHY("hierarchy");

    private String ruleType;

    DocumentRuleType(String ruleTYpe) {
        this.ruleType = ruleTYpe;
    }

    public String getRuleType() {return ruleType;}

}
