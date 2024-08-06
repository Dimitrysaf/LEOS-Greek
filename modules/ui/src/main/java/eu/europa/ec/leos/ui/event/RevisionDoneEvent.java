package eu.europa.ec.leos.ui.event;

public class RevisionDoneEvent {
    private String legFileId;

    public RevisionDoneEvent(String legFileId) {
        this.legFileId = legFileId;
    }

    public String getLegFileId() {
        return legFileId;
    }
}
