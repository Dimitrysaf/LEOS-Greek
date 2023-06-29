/*
 * Copyright 2022 European Commission
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
package eu.europa.ec.leos.util;

import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Locale;

public class LeosDomainUtil {
    private LeosDomainUtil(){
    }
    public static final DateTimeFormatter LEOS_REPO_DATE_FORMAT = DateTimeFormatter.ofPattern("EEE MMM dd HH:mm:ss zzz yyyy", Locale.ENGLISH);

    public static final String CMIS_PROPERTY_SPLITTER = "::";

    private static final String WRAP_FRAGMENT_START = "<aknFragment xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\" " +
            "xmlns:leos=\"urn:eu:europa:ec:leos\" xmlns:xml=\"http://www.w3.org/XML/1998/namespace\">";

    private static final String WRAP_FRAGMENT_END = "</aknFragment>";

    private static final String WRAP_FRAGMENT_START_REGEX =  "<aknFragment(.*?)>";

    public static Date getLeosDateFromString(String dateStr) {
        return getDateFromString(dateStr, LEOS_REPO_DATE_FORMAT);
    }

    public static Date getDateFromString(String dateStr, DateTimeFormatter formatter) {
        Date date = null;
        if (dateStr != null) {
            ZonedDateTime zdt = ZonedDateTime.parse(dateStr, formatter);
            date = new Date(zdt.toInstant().toEpochMilli());
        }
        return date;
    }

    public static String getLeosDateAsString(Date date) {
        return getLeosDateAsString(date, LEOS_REPO_DATE_FORMAT);
    }

    public static String getLeosDateAsString(Date date, DateTimeFormatter formatter) {
        String dateAsStr = null;
        if (date != null) {
            dateAsStr = formatter.format(date.toInstant());
        }
        return dateAsStr;
    }

    public static String wrapXmlFragment(String xmlFragment) {
        return WRAP_FRAGMENT_START + xmlFragment + WRAP_FRAGMENT_END;
    }

    public static String unWrapXmlFragment(String xmlFragment) {
     return xmlFragment.replaceAll(WRAP_FRAGMENT_START_REGEX, "").replace(WRAP_FRAGMENT_END, "");
    }

    public static void addDateIfNotNull(String fieldName, GregorianCalendar calendar, String leftPad, String rightChar, StringBuilder sb) {
        if(calendar != null) {
            SimpleDateFormat dfDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ssZ");
            Date date = calendar.getTime();
            String dateAsString = dfDate.format(date);
            sb.append(leftPad).append(fieldName).append("=").append(dateAsString).append(rightChar);
        }
    }

    public static void addFieldIfNotNull(String fieldName, Object value, String leftPad, String rightChar, StringBuilder sb) {
        if(value != null) {
            sb.append(leftPad).append(fieldName).append("=").append(value).append(rightChar);
        }
    }

    public static void addListFieldIfNotNull(String fieldName, List<?> value, String leftPad, String rightChar, StringBuilder sb) {
        if(value != null && !value.isEmpty()) {
            sb.append(leftPad).append(fieldName).append("=").append(value).append(rightChar);
        }
    }

    public static String calculateLeftPadd(int deep, String leftChar) {
        return String.join("", Collections.nCopies(deep, leftChar));
    }
}
