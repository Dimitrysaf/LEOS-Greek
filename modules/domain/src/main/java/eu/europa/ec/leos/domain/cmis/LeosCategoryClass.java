package eu.europa.ec.leos.domain.cmis;

import eu.europa.ec.leos.domain.cmis.document.Annex;
import eu.europa.ec.leos.domain.cmis.document.Bill;
import eu.europa.ec.leos.domain.cmis.document.Explanatory;
import eu.europa.ec.leos.domain.cmis.document.FinancialStatement;
import eu.europa.ec.leos.domain.cmis.document.Memorandum;
import eu.europa.ec.leos.domain.cmis.document.Proposal;

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

}
