package eu.europa.ec.leos.services.controllers.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

/**
 * {@link org.springframework.web.servlet.DispatcherServlet}-specific configuration.
 * This configuration is loaded in the context of the dispatcher servlet, separate from the global application context.
 * @see "modules/web/src/main/webapp/WEB-INF/dispatcher-servlet.xml"
 */
@Configuration
@EnableAspectJAutoProxy
public class DispatcherServletConfig {
}
