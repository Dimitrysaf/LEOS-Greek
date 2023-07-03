package eu.europa.ec.leos.services.dto.request;

import java.util.List;

public class ApplyContributionsRequest {

    List<MergeActionVO> mergeActions;
    boolean acceptAllContributions;

    public List<MergeActionVO> getMergeActions() {
        return mergeActions;
    }

    public void setMergeActions(List<MergeActionVO> mergeActions) {
        this.mergeActions = mergeActions;
    }

    public boolean isAcceptAllContributions() {
        return acceptAllContributions;
    }

    public void setAcceptAllContributions(boolean acceptAllContributions) {
        this.acceptAllContributions = acceptAllContributions;
    }
}
