package eu.europa.ec.leos.services.dto.request;

import eu.europa.ec.leos.model.action.ContributionVO;

public class MergeActionVO {
    MergeAction action;
    ElementState elementState;
    String elementId;
    String elementTagName;
    Boolean withTrackChanges = false;
    ContributionVO contributionVO;

    public enum MergeAction {ACCEPT, ACCEPT_TC, PROCESSED, UNDO, UNSELECT}

    public enum ElementState {DELETE, MOVE, CONTENT_CHANGE, ADD}

    public MergeAction getAction() {
        return action;
    }

    public void setAction(MergeAction action) {
        this.action = action;
    }

    public ElementState getElementState() {
        return elementState;
    }

    public void setElementState(ElementState elementState) {
        this.elementState = elementState;
    }

    public String getElementId() {
        return elementId;
    }

    public void setElementId(String elementId) {
        this.elementId = elementId;
    }

    public String getElementTagName() {
        return elementTagName;
    }

    public void setElementTagName(String elementTagName) {
        this.elementTagName = elementTagName;
    }

    public ContributionVO getContributionVO() {
        return contributionVO;
    }

    public void setContributionVO(ContributionVO contributionVO) {
        this.contributionVO = contributionVO;
    }

    public Boolean isWithTrackChanges() {
        return withTrackChanges;
    }

    public void setWithTrackChanges(Boolean withTrackChanges) {
        this.withTrackChanges = withTrackChanges;
    }
}
