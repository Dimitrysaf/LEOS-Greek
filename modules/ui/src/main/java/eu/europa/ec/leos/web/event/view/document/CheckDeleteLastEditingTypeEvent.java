package eu.europa.ec.leos.web.event.view.document;

public class CheckDeleteLastEditingTypeEvent {

    private final String elementId;
    private final Runnable actionEvent;
    private final boolean isConfirmed;

    public CheckDeleteLastEditingTypeEvent(String elementId, Runnable actionEvent, boolean isConfirmed) {
        this.elementId = elementId;
        this.actionEvent = actionEvent;
        this.isConfirmed = isConfirmed;
    }

    public String getElementId() {
        return elementId;
    }

    public Runnable getActionEvent() {
        return actionEvent;
    }

	public boolean isConfirmed() {
		return isConfirmed;
	}

}
