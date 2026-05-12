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

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePackageRequest {
    private Boolean isCloned;
    private String clonedPackageName;
    private String language;
    private Boolean isTranslated = Boolean.FALSE;
    @NotBlank(message = "User Id cannot be blank")
    private String userId;
    private String originRef;
    private String creatorOrganization;

    public Boolean getTranslated() {
        return isTranslated;
    }

    public void setTranslated(Boolean isTranslated) {
        this.isTranslated = isTranslated;
    }

}
