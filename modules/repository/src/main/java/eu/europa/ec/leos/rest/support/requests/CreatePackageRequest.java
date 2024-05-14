package eu.europa.ec.leos.rest.support.requests;

public class CreatePackageRequest {
    private Boolean isCloned;
    private String clonedPackageName;
    private String language;
    private Boolean isTranslated;
    private String userId;
    private String originRef;

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

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Boolean getTranslated() {
        return isTranslated;
    }

    public void setTranslated(Boolean translated) {
        isTranslated = translated;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getOriginRef() {
        return originRef;
    }

    public void setOriginRef(String originRef) {
        this.originRef = originRef;
    }
}
