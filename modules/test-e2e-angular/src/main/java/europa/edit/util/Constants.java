package europa.edit.util;

import java.io.File;

public class Constants {
    public static final String CHROME = "chrome";
    public static final String FIREFOX = "firefox";
    public static final String EDGE = "edge";
    public static final int TIMEOUT_DELAY = 180;
    public static final int POLLING_TIME = 1;
    public static final int BUFFER_SIZE = 4096;
    public static final String FILE_SEPARATOR = "\\";
    public static final String MAIN_CONFIG_PROPERTIES_FILE_PATH = "./src/test/resources/config/config.properties";
    public static final String USERS_PROPERTIES_FILE_PATH = "./src/test/resources/config/users.properties";
    public static final String ENVIRONMENT_PROPERTIES_FILE_PATH = "./src/test/resources/config/env/";
    public static final String RESULTS_LOCATION = "target" + File.separator + "results";
    public static final String FILE_FULL_PATH = "FILE_FULL_PATH";
    public static final String FILE_NAME = "FILE_NAME";
    public final static String EXCEPTION_MESSGAE_ON_FAILURE = "The exception occured during test execution";
    public final static String SCROLL_ELEMENT = "arguments[0].scrollIntoView(true);";
    public final static String CLICK_ELEMENT = "arguments[0].click();";
    public final static String selectJsScript = "function selectText(element, start, end) {\n" +
            "    selection = window.getSelection();        \n" +
            "    range = new Range();\n" +
            "    range.setStart(element.firstChild, start);\n" +
            "    range.setEnd(element.firstChild, end);\n" +
            "    selection.removeAllRanges();\n" +
            "    selection.addRange(range);\n" +
            "}\n" +
            "\n" +
            "selectText(arguments[0], arguments[1], arguments[2]);";
}
