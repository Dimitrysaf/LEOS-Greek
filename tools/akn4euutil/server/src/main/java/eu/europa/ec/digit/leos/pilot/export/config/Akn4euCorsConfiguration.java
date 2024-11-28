package eu.europa.ec.digit.leos.pilot.export.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;

@Configuration
public class Akn4euCorsConfiguration {
    @Value("${server.cors.enabled}")
    private Boolean corsEnabled;

    @Value("${server.cors.allowedOrigins}")
    private String corsAllowedOrigins;

    @Value("${server.cors.allowedHeaders}")
    private String corsAllowedHeaders;

    @Value("${server.cors.allowCredentials}")
    private Boolean corsAllowCredentials;

    public Akn4euCorsConfiguration() {}

    public boolean isCorsEnabled() {
        if (this.corsEnabled == null) {
            return false;
        }
        return this.corsEnabled;
    }

    public String getAllowedOrigins() {
        if (!StringUtils.hasLength(this.corsAllowedOrigins)) {
            return "*";
        }
        return this.corsAllowedOrigins;
    }

    public String[] getAllowedOriginsArray() {
        if (!StringUtils.hasLength(this.corsAllowedOrigins) || this.corsAllowedOrigins.equals("*")) {
            return new String[]{"*"};
        }
        if (!this.corsAllowedOrigins.contains(",")) {
            return new String[]{this.corsAllowedOrigins};
        }
        return this.corsAllowedOrigins.split(",");
    }

    public List<String> getAllowedOriginsList() {
        return Arrays.asList(this.getAllowedOriginsArray());
    }

    public String getAllowedHeaders() {
        return this.corsAllowedHeaders;
    }

    public String[] getAllowedHeadersArray() {
        if (!StringUtils.hasText(this.corsAllowedHeaders)) return new String[0];
        if (!this.corsAllowedHeaders.contains(",")) {
            return new String[]{this.corsAllowedOrigins};
        }
        return this.corsAllowedHeaders.split(",");
    }

    public List<String> getAllowedHeadersList() {
        return Arrays.asList(this.getAllowedHeadersArray());
    }

    public Boolean isAllowCredentials() {
        if (this.corsAllowCredentials == null) {
            return false;
        }
        return this.corsAllowCredentials;
    }

    @Override
    public String toString() {
        return String.format("CORS configuration: Enabled - %s / Allowed origins - %s / Allowed headers - %s / Allow credentials - %s",
                this.corsEnabled, this.corsAllowedOrigins, this.corsAllowedHeaders, this.corsAllowCredentials);
    }
}
