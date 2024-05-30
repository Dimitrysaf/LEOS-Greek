package eu.europa.ec.leos.services.utils;
/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence")
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */

import org.apache.commons.lang3.Validate;

import java.util.List;
import java.util.Map;

public class LanguageMapUtils {

    public static String getLanguageGroup(Map<String, List<String>> languageMap, String language) {
        return languageMap.entrySet().stream()
                .filter(entry -> containsLanguage(entry.getValue(), language))
                .map(Map.Entry::getKey)
                .findFirst()
                .orElse(null);
    }

    private static boolean containsLanguage(List<String> languages, String language) {
        for (String lang : languages) {
            if (lang.equalsIgnoreCase(language)) {
                return true;
            }
        }
        return false;
    }

    public static String generateTranslatedProposalReference(String originalRef, String language) {
        Validate.notNull(originalRef, "Original reference should not be null");
        return originalRef.substring(0, originalRef.lastIndexOf("-")).concat("-").concat(language.toLowerCase());
    }
}
