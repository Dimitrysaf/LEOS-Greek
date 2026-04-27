package eu.europa.ec.leos.services.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.Properties;
import java.util.function.Function;

/**
 * Inject this component instead of the applicationProperties bean for easier properties handling.
 */
@Component
public class AppProperties {

    private final Properties applicationProperties;

    public AppProperties(@Qualifier("applicationProperties") Properties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    /**
     * Get a property value with a default if missing and a value converter if needed.
     * @param name - required property key
     * @param converter - optional value converter to convert from String
     * @param defaultValue - optional default value if the property mapping is missing for the given key
     * @return Value (optionally converted) if present; Default value otherwise.
     * @param <T> Value type
     */
    public <T> T getProperty(final String name, final Function<String, T> converter, final T defaultValue) {
        final String value = applicationProperties.getProperty(name);
        if (value == null) {
            return defaultValue;
        }
        return converter != null ? converter.apply(value) : (T) value;
    }

    /**
     * Shorthand for getProperty(name, converter, null)
     * @param name - required property key
     * @param converter - optional value converter to convert from String
     * @return Value (optionally converted) if present; null otherwise.
     * @param <T> Value type
     */
    public <T> T getProperty(final String name, final Function<String, T> converter) {
        return getProperty(name, converter, null);
    }

    /**
     * Shorthand for getProperty(name, null, defaultValue)
     * @param name - required property key
     * @param defaultValue - optional default value if the property mapping is missing for the given key
     * @return Value if present; defaultValue otherwise.
     */
    public String getProperty(final String name, final String defaultValue) {
        return getProperty(name, null, defaultValue);
    }

    /**
     * Shorthand for getProperty(name, null, defaultValue)
     * @param name - required property key
     * @return Value if present; null otherwise.
     */
    public String getProperty(final String name) {
        return getProperty(name, null, null);
    }

    /**
     * The applicationProperties bean.
     * @return The undelying applicationProperties
     */
    public Properties getApplicationProperties() {
        return applicationProperties;
    }
}
