package eu.europa.ec.leos.rest.support.requests;

public class CreatePackageRequest {
    private Boolean isCloned;
    private String clonedPackageName;
    private String userId;

    public Boolean getIsCloned() {
        return isCloned;
    }

    public void setIsCloned(Boolean isCloned) {
        this.isCloned = isCloned;
    }

    public String getClonedPackageName() {
        return clonedPackageName;
    }

    public void setClonedPackageName(String clonedPackageName) {
        this.clonedPackageName = clonedPackageName;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
