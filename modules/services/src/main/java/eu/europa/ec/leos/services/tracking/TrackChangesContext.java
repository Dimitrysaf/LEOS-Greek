package eu.europa.ec.leos.services.tracking;

import org.springframework.stereotype.Component;

@Component
public class TrackChangesContext {
    private static final ThreadLocal<Boolean> trackChanges = new ThreadLocal<>();

    public boolean isTrackChangesEnabled() {
        return Boolean.TRUE.equals(trackChanges.get());
    }

    public void setTrackChangesEnabled(boolean enabled) {
        trackChanges.set(enabled);
    }

    public void clear() {
        trackChanges.remove();
    }
}
