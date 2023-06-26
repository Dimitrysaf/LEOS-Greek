package eu.europa.ec.leos.services.response;

public class DeclineContributionResponse {

    String contributionStatus;

    public DeclineContributionResponse(String contributionStatus) {
        this.contributionStatus = contributionStatus;
    }

    public String getContributionStatus() {
        return contributionStatus;
    }
}
