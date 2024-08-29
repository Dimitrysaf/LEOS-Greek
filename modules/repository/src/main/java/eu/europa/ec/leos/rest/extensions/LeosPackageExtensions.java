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
package eu.europa.ec.leos.rest.extensions;

import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.LinkedPackage;
import eu.europa.ec.leos.rest.support.model.Package;

public class LeosPackageExtensions {

    public static LeosPackage toLeosPackage(Package pkg) {
        String[] pathNames = pkg.getName().split("/");
        if (pkg.getTranslated() == null) {
            pkg.setTranslated(false);
        }
        return new LeosPackage(pkg.getId(), pathNames[pathNames.length - 1], pkg.getName(), pkg.getLanguage(), pkg.getTranslated());
    }

    public static LinkedPackage toLinkedPackage(eu.europa.ec.leos.rest.support.model.LinkedPackage pkg) {
        return new LinkedPackage(pkg.getId(), pkg.getPackageId(), pkg.getLinkedPackageId());
    }
}
