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
package eu.europa.ec.digit.leos.pilot.export.util;

import org.springframework.web.multipart.MultipartFile;

public class ConvertUtil {

    private static final String DOT = ".";
    public static final String COVER_PAGE= "coverPage";
    public static final String PROPOSAL_FILE_PREFIX = "main";
    public static final String HTML_RENDITION_PATH = "renditions/html/";
    public static final String HTML_RENDITION_CSS_PATH = "renditions/html/css/";
    public static final String HTML_JS_PATH = "renditions/html/js/";
    public static final String HTML_RENDITION_PDF_PATH = "renditions/pdf/";
    public static final String HTML_RENDITION_WORD_PATH = "renditions/word/";
    public static final String LEGISWRITE_PREFIX = "LW_";
    public static final String PDF_PREFIX = "PDF_";
    public static final String ZIP_EXT = ".zip";
    public static final String PDF_EXT = ".pdf";
    public static final String DOC_EXT = ".docx";
    public static final String XML_EXT = ".xml";
    public static final String HTML_EXT = ".html";
    public static final String JS_EXT = ".js";
    public static final String HTML_TOC = "_toc";

    public static String replaceSuffix(String inputString, String suffix) {
        if (inputString == null) {
            throw new IllegalArgumentException("inputString is null");
        }
        if (suffix == null) {
            if (inputString.contains(DOT)) {
                return inputString.substring(0, inputString.lastIndexOf(DOT));
            } else {
                return inputString;
            }
        }
        if (inputString.contains(DOT)) {
            return inputString.substring(0, inputString.lastIndexOf(DOT)) + DOT + suffix;
        } else {
            return inputString + DOT + suffix;
        }
    }

    public static String getFilename(MultipartFile file, String suffix) {
        String s = file.getOriginalFilename();
        if (s != null) {
            s = s.startsWith(PROPOSAL_FILE_PREFIX) ? COVER_PAGE : s;
            return replaceSuffix(s, suffix);
        } else {
            return "noname";
        }
    }
}
