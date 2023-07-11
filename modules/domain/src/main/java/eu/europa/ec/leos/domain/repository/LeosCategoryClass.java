package eu.europa.ec.leos.domain.repository;

import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.Explanatory;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.Memorandum;
import eu.europa.ec.leos.domain.repository.document.Proposal;

public enum LeosCategoryClass {

    PROPOSAL(Proposal.class),
    MEMORANDUM(Memorandum.class),
    BILL(Bill.class),
    ANNEX(Annex.class),
    COUNCIL_EXPLANATORY(Explanatory.class),
    COVERPAGE(Proposal.class),
    STAT_FINANC_LEGIS(FinancialStatement.class);

    private Class clazz;

    LeosCategoryClass(Class clazz) {
        this. clazz = clazz;
    }

    public Class getClazz() {
        return clazz;
    }

    public static LeosCategoryClass caseInsensitiveValueOf(String name) {
        for (LeosCategoryClass value : LeosCategoryClass.values()) {
            if (value.name().equalsIgnoreCase(name)) {
                return value;
            }
        }
        throw new IllegalArgumentException("No enum constant " + LeosCategoryClass.class + "." + name);
    }

}
