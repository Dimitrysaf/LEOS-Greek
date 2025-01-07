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

import org.springframework.util.StringUtils;

import java.security.SecureRandom;
import java.util.Random;

/**
 * Origin: from eu.europa.ec.leos.services.support.IdGenerator
 *
 * If the leos-services module is added as a mvn dependency the AKN4EU service doesn't run properly.
 * Could be caused by a dependency of the services module.
 * */
public class IdGenerator {
    private static final String DEFAULT_PREFIX = "ec";
    private static final int DEFAULT_POSTFIX_LENGTH = 15;
    private static final Random RANDOM = new SecureRandom();
    private static final String ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWYZabcdefghijklmnopqrstuvwxyz01234567890";
    public static final String PREFIX_DELIMITER = "X";

    /**
     * Generates an id in format (generated id = DEFAULT_PREFIX + (DEFAULT_POSTFIX_LENGTH chars long String)
     * @return (generated id = DEFAULT_PREFIX + (DEFAULT_POSTFIX_LENGTH chars long String)
     */
    public static String generateId() {
        return DEFAULT_PREFIX + generateRandomString(DEFAULT_POSTFIX_LENGTH);
    }

    /**
     * Generates an id in format (generated id = prefix + PREFIX_DELIMITER + DEFAULT_PREFIX + (DEFAULT_POSTFIX_LENGTH chars long String))
     * @param prefix String to prefix with Random id
     * @return (generated id = prefix + PREFIX_DELIMITER + DEFAULT_PREFIX + (DEFAULT_POSTFIX_LENGTH chars long String))
     */
    public static String generateId(String prefix) {
        return (StringUtils.hasLength(prefix) ? prefix + PREFIX_DELIMITER : "") + generateId();
    }

    private static String generateRandomString(int length) {
        StringBuffer buffer = new StringBuffer(length);
        for (int i = 0; i < length; i++) {
            buffer.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
        }
        return buffer.toString();
    }

    public static String getPrefixId(String id) {
        String prefixId = "";
        if (StringUtils.hasLength(id)) {
            int indexOfPrefixDelimiter = id.lastIndexOf(PREFIX_DELIMITER);
            prefixId = indexOfPrefixDelimiter > 0 ? id.substring(0, indexOfPrefixDelimiter) : "";
        }
        return prefixId;
    }
}
