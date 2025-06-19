package eu.europa.ec.leos.services.config.web;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;

@Configuration
public class SecurityConfig {

    /**
     * Configure J2EE authentication for default (non-SAML) mode
     */
    @Bean
    @ConditionalOnProperty(name = "saml", matchIfMissing = true, havingValue = "false")
    public ServletContextInitializer defaultAuthenticationConfig() {
        return new ServletContextInitializer() {
            @Override
            public void onStartup(ServletContext servletContext) throws ServletException {
                // This would be equivalent to web.xml security-constraint
                // Note: J2EE security constraints are typically better handled
                // by the container or converted to Spring Security configuration

                // For now, this serves as a placeholder - the existing Spring Security
                // XML configuration will handle the actual authentication
            }
        };
    }

    /**
     * SAML mode doesn't need J2EE authentication - handled by Spring Security SAML
     */
    @Bean
    @ConditionalOnProperty(name = "saml", havingValue = "true")
    public ServletContextInitializer samlAuthenticationConfig() {
        return new ServletContextInitializer() {
            @Override
            public void onStartup(ServletContext servletContext) throws ServletException {
                // SAML authentication is handled entirely by Spring Security
                // No J2EE container authentication needed
            }
        };
    }
}