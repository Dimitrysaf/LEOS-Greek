package eu.europa.ec.leos.rest.support.requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePackageRequest {
    private Boolean isCloned;
    private String clonedPackageName;
    private String language;
    private Boolean isTranslated;
    private String userId;
    private String originRef;
    private String creatorOrganization;

    public Boolean getTranslated() {
        return isTranslated;
    }

    public void setTranslated(Boolean translated) {
        isTranslated = translated;
    }
}
