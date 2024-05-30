package eu.europa.ec.leos.rest.support.model;

public class LinkedPackage {

    private String id;
    private String packageId;
    private String linkedPackageId;

    public LinkedPackage(){
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
