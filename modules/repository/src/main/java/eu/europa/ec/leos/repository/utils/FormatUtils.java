/*
 * Copyright 2026 European Union
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
package eu.europa.ec.leos.repository.utils;

import java.util.Optional;
import org.apache.commons.text.StringEscapeUtils;

public class FormatUtils {

    private static final String[] HTML_FORMATTING_ELEMENTS_KEEP_SUB_SUP = { "b", "strong", "i", "em", "mark", "small" };
    private static final String HTML_TAGS_KEEP_SUB_SUP = String.join("|", HTML_FORMATTING_ELEMENTS_KEEP_SUB_SUP);
    private static final String HTML_TAGS = "sup|sub|" + HTML_TAGS_KEEP_SUB_SUP;

    public static String cleanHtmlFormattingElements(String s) {
        return Optional.ofNullable(StringEscapeUtils.unescapeXml(s))
                .map(str -> str.replaceAll("(?i)</?(" + HTML_TAGS + ")\\b[^>]*>", ""))
                .orElse(s);
    }

    public static String cleanHtmlFormattingElementsKeepSubSup(String s) {
        return Optional.ofNullable(StringEscapeUtils.unescapeXml(s))
                .map(str -> str.replaceAll("(?i)</?(" + HTML_TAGS_KEEP_SUB_SUP + ")\\b[^>]*>", ""))
                .orElse(s);
    }

    public static String cleanTrackChanges(String s) {
        return Optional.ofNullable(StringEscapeUtils.unescapeXml(s))
                .map(str -> str.replaceAll("<del[^>]*?>[\\s\\S]*?<\\/del>", ""))
                .map(str -> str.replaceAll("<\\/?ins[^>]*?>", ""))
                .orElse(s);
    }

    public static String cleanNonBreakingSpace(String s) {
        return Optional.ofNullable(StringEscapeUtils.unescapeXml(s))
                .map(str -> str.replaceAll("&nbsp;|\u00a0", " "))
                .orElse(null);
    }

}