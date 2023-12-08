package eu.europa.ec.leos.services.dto.request;

public class ToggleTrackChangeEnabledRequest {

    boolean trackChangedEnabled;

    public boolean isTrackChangedEnabled() {
        return trackChangedEnabled;
    }

    public void setTrackChangedEnabled(boolean trackChangedEnabled) {
        this.trackChangedEnabled = trackChangedEnabled;
    }

}
