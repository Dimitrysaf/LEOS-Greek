package eu.europa.ec.leos.services.collection;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Map;

public class ExtPackageResult {

    private final String language;
    private final String proposalId;
    private final String proposalUrl;
    private final String billId;
    private final String memorandumId;
    private final String coverpageId;
    private final String financialStatementId;
    private final Map<String, String> annexIdUrl;
    private final String error;
    private final int httpStatus;

    public ExtPackageResult(CreateCollectionResult result, String language) {
        this.language = language;
        this.proposalId = result.getProposalId();
        this.proposalUrl = result.getProposalUrl();
        this.billId = result.getBillId();
        this.memorandumId = result.getMemorandumId();
        this.coverpageId = result.getCoverpageId();
        this.financialStatementId = result.getFinancialStatementId();
        this.annexIdUrl = result.getAnnexIdUrl();
        this.error = result.getError() != null ? result.getError().getMessage() : null;
        this.httpStatus = 200;
    }

    public ExtPackageResult(String errorMessage) {
        this.language = null;
        this.proposalId = null;
        this.proposalUrl = null;
        this.billId = null;
        this.memorandumId = null;
        this.coverpageId = null;
        this.financialStatementId = null;
        this.annexIdUrl = null;
        this.error = errorMessage;
        this.httpStatus = 500;
    }

    public ExtPackageResult(String errorMessage, int httpStatus) {
        this.language = null;
        this.proposalId = null;
        this.proposalUrl = null;
        this.billId = null;
        this.memorandumId = null;
        this.coverpageId = null;
        this.financialStatementId = null;
        this.annexIdUrl = null;
        this.error = errorMessage;
        this.httpStatus = httpStatus;
    }

    public String getLanguage() { return language; }
    public String getProposalId() { return proposalId; }
    public String getProposalUrl() { return proposalUrl; }
    public String getBillId() { return billId; }
    public String getMemorandumId() { return memorandumId; }
    public String getCoverpageId() { return coverpageId; }
    public String getFinancialStatementId() { return financialStatementId; }
    public Map<String, String> getAnnexIdUrl() { return annexIdUrl; }
    public String getError() { return error; }
    @JsonIgnore
    public int getHttpStatus() { return httpStatus; }
}
