package eu.europa.ec.leos.services.config.web;

import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.SessionCookieConfig;

@Configuration
public class SessionConfig {

    @Bean
    public ServletContextInitializer servletContextInitializer() {
        return new ServletContextInitializer() {
            @Override
            public void onStartup(ServletContext servletContext) throws ServletException {
                // Session timeout (5 minutes)
                servletContext.getSessionCookieConfig().setMaxAge(5 * 60);

                // Heartbeat interval context parameter
                servletContext.setInitParameter("heartbeatInterval", "120");
            }
        };
    }
}