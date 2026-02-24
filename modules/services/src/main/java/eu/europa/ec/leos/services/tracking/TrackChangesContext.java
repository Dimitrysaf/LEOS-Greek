package eu.europa.ec.leos.services.tracking;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
public class TrackChangesContext {
    private boolean trackChangesEnabled;

    public boolean isTrackChangesEnabled() {
        return trackChangesEnabled;
    }

    public void setTrackChangesEnabled(boolean trackChangesEnabled) {
        this.trackChangesEnabled = trackChangesEnabled;
    }
}
