/*
 * Copyright 2026 European Commission
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
package eu.europa.ec.digit.leos.pilot.export.util;

import java.util.regex.Pattern;

public class StringUtil {

    public static final Pattern VALID_EMAIL_ADDRESS_REGEX = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$",
            Pattern.CASE_INSENSITIVE);

    public static boolean isEmpty(final String str) {
        return (str == null) || (str.trim().isEmpty());
    }

    public static boolean isEqual(final String str1, final String str2) {
        if (str1 == null) {
            return (str2 == null);
        }
        return str1.equals(str2);
    }

    public static boolean isInteger(final String str) {
        if (str == null) return false;
        try {
            Integer.parseInt(str);
            return true;
        } catch(NumberFormatException ex) {
            return false;
        }
    }

    public static boolean isEmailValid(String email) {
        return !isEmpty(email) && VALID_EMAIL_ADDRESS_REGEX.matcher(email).matches();
    }

}
