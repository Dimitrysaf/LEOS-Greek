package eu.europa.ec.digit.leos.pilot.export;

import eu.europa.ec.digit.leos.pilot.export.config.Akn4euCorsConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
@EnableWebMvc
@EnableConfigurationProperties
public class CorsConfigurer extends WebMvcConfigurerAdapter {
    private final Akn4euCorsConfiguration corsConfiguration;

    @Autowired
    public CorsConfigurer(final Akn4euCorsConfiguration corsConfiguration) {
        this.corsConfiguration = corsConfiguration;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if (!this.corsConfiguration.isCorsEnabled()) return;
        registry.addMapping("/**")
                .allowedOrigins(this.corsConfiguration.getAllowedOriginsArray())
                .allowedMethods("GET","POST","OPTIONS")
                .allowedHeaders(this.corsConfiguration.getAllowedHeadersArray())
                .allowCredentials(this.corsConfiguration.isAllowCredentials())
                .maxAge(3600);
    }
}