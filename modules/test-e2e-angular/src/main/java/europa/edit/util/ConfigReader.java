package europa.edit.util;

import java.io.*;
import java.util.Properties;

/* 	Author: Satyabrata Das
 * 	Functionality: Configuration class to access the configuration properties file values
 */
public class ConfigReader {

    private final Properties properties;
    public ConfigReader() {
        try {
            FileInputStream configBaseFile = new FileInputStream(Constants.MAIN_CONFIG_PROPERTIES_FILE_PATH);
            FileInputStream configUserFile = new FileInputStream(Constants.USERS_PROPERTIES_FILE_PATH);
            FileInputStream environmentConfigFile = new FileInputStream(Constants.ENVIRONMENT_PROPERTIES_FILE_PATH + TestParameters.getInstance().getEnvironment() + ".properties");
            properties = new Properties();
            properties.load(configBaseFile);
            properties.load(configUserFile);
            properties.load(environmentConfigFile);
        } catch (Exception e) {
            throw new RuntimeException("The config file format is not as expected", e);
        }
    }

    public String getProperty(String value) {
        String propertyValue = getProperty(value, null);
        if (propertyValue != null) {
            return propertyValue;
        } else {
            throw new RuntimeException(value + " not specified in the config.properties file.");
        }
    }

    public String getProperty(String value, String defaultValue) {
        return properties.getProperty(value, defaultValue);
    }
}