package eu.europa.ec.leos.services.processor.node;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class XmlNodeConfigTest {

    private final String REGULAR_EXPRESSION = "(.+?)([a-zA-Z]+?)\\[@(.+?)='(.+?)'\\](.*?)";
    private final String X_PATH_1 = "//akn:coverPage/akn:container[@name='language']/akn:p";
    private final String X_PATH_2 = "//akn:coverPage/akn:container[@name='language']";

    @Test
    void testDifferentXPathValues() {

        assertTrue(X_PATH_1.matches(REGULAR_EXPRESSION));
        assertTrue(X_PATH_2.matches(REGULAR_EXPRESSION));

    }

}
