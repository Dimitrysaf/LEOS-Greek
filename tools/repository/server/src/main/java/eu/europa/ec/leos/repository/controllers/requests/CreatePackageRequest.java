/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.leos.repository.controllers.requests;

import javax.validation.constraints.NotBlank;

public class CreatePackageRequest {
    private Boolean isCloned;
    private String clonedPackageName;
    private String language;
    private Boolean isTranslated = Boolean.FALSE;
    @NotBlank(message = "User Id cannot be blank")
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

    public void setTranslated(Boolean isTranslated) {
        this.isTranslated = isTranslated;
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