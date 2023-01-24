package eu.europa.ec.leos.web.event.view.document;

public class CheckDeleteLastEditingChildTypeEvent {

    private final String elementId;
    private final Object actionEvent;

    public CheckDeleteLastEditingChildTypeEvent(String elementId, Object actionEvent) {
        this.elementId = elementId;
        this.actionEvent = actionEvent;
    }

    public String getElementId() {
        return elementId;
    }

    public Object getActionEvent() {
        return actionEvent;
    }

}
