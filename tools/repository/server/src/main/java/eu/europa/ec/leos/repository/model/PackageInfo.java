package eu.europa.ec.leos.repository.model;

import java.time.LocalDateTime;

public class PackageInfo {
    private LocalDateTime lastUpdatedOn;
    private String lastUpdatedBy;

    public PackageInfo(String lastUpdatedBy, LocalDateTime lastUpdatedOn) {
        this.lastUpdatedOn = lastUpdatedOn;
        this.lastUpdatedBy = lastUpdatedBy;
    }

    public LocalDateTime getLastUpdatedOn() {
        return lastUpdatedOn;
    }

    public String getLastUpdatedBy() {
        return lastUpdatedBy;
    }
}
