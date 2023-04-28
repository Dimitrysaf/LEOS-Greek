/*
 * Copyright 2023 European Commission
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
package eu.europa.ec.leos.rest.support.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Locale;

public class ConversionUtils {
    private static final Logger LOG = LoggerFactory.getLogger(ConversionUtils.class);

    public final static DateTimeFormatter LEOS_REPO_DATE_FORMAT = DateTimeFormatter.ofPattern("EEE MMM dd HH:mm:ss zzz yyyy", Locale.ENGLISH);

    public static String getLeosDateAsString(Date date, DateTimeFormatter formatter) {
        String dateAsStr = null;
        if (date != null) {
            dateAsStr = formatter.format(ZonedDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault()));
        }
        return dateAsStr;
    }

    public static Date getDateFromString(String dateStr, DateTimeFormatter formatter) {
        Date date = null;
        if (dateStr != null) {
            ZonedDateTime zdt = ZonedDateTime.parse(dateStr, formatter);
            date = new Date(zdt.toInstant().toEpochMilli());
        }
        return date;
    }
}
