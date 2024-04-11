package eu.europa.ec.leos.services.response;

public class MergeContributionResponse {

    private boolean mergeStatus;

    private byte[] mergedContent;

    public MergeContributionResponse(boolean mergeStatus, byte[] mergedContent) {
        this.mergeStatus = mergeStatus;
        this.mergedContent = mergedContent;
    }

    public byte[] getMergedContent() {
        return mergedContent;
    }

    public boolean isMergeStatus() {
        return mergeStatus;
    }

    public void setMergedContent(byte[] mergedContent) {
        this.mergedContent = mergedContent;
    }
}
