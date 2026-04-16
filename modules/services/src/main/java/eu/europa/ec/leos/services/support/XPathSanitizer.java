package eu.europa.ec.leos.services.support;

import java.util.regex.Pattern;

class XPathSanitizer {

    // Define a pattern for allowed characters in
    // The following provided is not compiling but gives an hint
    //private static final Pattern VALID_XPATH_PATTERN = Pattern.compile("\"^(/|(\\.\\./)|(\\./)|\\.\\.//)?([a-zA-Z_][a-zA-Z0-9_\\-]*|\\\\*)(/([a-zA-Z_][a-zA-Z0-9_\\-]*|\\\\*))*((\\\\[@?[a-zA-Z_][a-zA-Z0-9_\\-]*\\\\s*(=|!=|<|>|<=|>=|\\\\s*contains\\\\(|\\\\s*starts-with\\\\()\\\\s*('[^']*'|\\\"[^\\\"]*\\\")\\\\s*\\\\])|\\\\s*::\\\\s*[a-zA-Z_][a-zA-Z0-9_\\-]*\\\\s*)*)*$\"");

    //TODO The current pattern is mundane and needs to be replaced by a more restrictive one since any string is accpted
    private static String XPATH_PATTERN_STRING = "^(/|(\\.\\./)|(\\./)|\\.\\.//)?.*";
    private static final Pattern VALID_XPATH_PATTERN = Pattern.compile(XPATH_PATTERN_STRING);

    public static String sanitizeXPath(String xPath) throws IllegalArgumentException {
        if (xPath == null) {
            throw new IllegalArgumentException("XPath cannot be null");
        }

        // Validate against the allowed pattern
        if (!VALID_XPATH_PATTERN.matcher(xPath).matches()) {
            throw new IllegalArgumentException("XPath contains invalid characters " + xPath);
        }

        return xPath;
    }

}
