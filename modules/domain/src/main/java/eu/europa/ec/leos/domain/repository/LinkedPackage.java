package eu.europa.ec.leos.domain.repository;

import java.io.Serializable;

public class LinkedPackage implements Serializable {

    private String id;
    private String packageId;
    private String linkedPackageId;

    public LinkedPackage(String id, String packageId, String linkedPackageId) {
        this.id = id;
        this.packageId = packageId;
        this.linkedPackageId = linkedPackageId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPackageId() {
        return packageId;
    }

    public void setPackageId(String packageId) {
        this.packageId = packageId;
    }

    public String getLinkedPackageId() {
        return linkedPackageId;
    }

    public void setLinkedPackageId(String linkedPackageId) {
        this.linkedPackageId = linkedPackageId;
    }
}
