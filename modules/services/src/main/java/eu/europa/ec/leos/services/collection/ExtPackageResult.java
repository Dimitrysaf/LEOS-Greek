package eu.europa.ec.leos.services.collection;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

public class ExtPackageResult {

    private final String proposalId;
    private final String proposalUrl;
    private final boolean collectionCreated;
    private final String error;
    private final int httpStatus;

    public ExtPackageResult(CreateCollectionResult result) {
        this.proposalId = result.getProposalId();
        this.proposalUrl = result.getProposalUrl();
        this.collectionCreated = result.isCollectionCreated();
        this.error = result.getError() != null ? result.getError().getMessage() : null;
        this.httpStatus = 200;
    }

    public ExtPackageResult(String errorMessage) {
        this.proposalId = null;
        this.proposalUrl = null;
        this.collectionCreated = false;
        this.error = errorMessage;
        this.httpStatus = 500;
    }

    public ExtPackageResult(String errorMessage, int httpStatus) {
        this.proposalId = null;
        this.proposalUrl = null;
        this.collectionCreated = false;
        this.error = errorMessage;
        this.httpStatus = httpStatus;
    }

    public String getProposalId() { return proposalId; }
    public String getProposalUrl() { return proposalUrl; }
    public boolean isCollectionCreated() { return collectionCreated; }
    public String getError() { return error; }
    @JsonIgnore
    public int getHttpStatus() { return httpStatus; }
}
