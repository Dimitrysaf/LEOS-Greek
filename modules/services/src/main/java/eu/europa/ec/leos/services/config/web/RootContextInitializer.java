package eu.europa.ec.leos.services.config.web;

import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.ServletContext;

//@Configuration
//public class RootContextInitializer implements ServletContextInitializer, ApplicationContextAware {
//
//    private ApplicationContext applicationContext;
//
//    @Override
//    public void setApplicationContext(ApplicationContext applicationContext) {
//        this.applicationContext = applicationContext;
//    }
//
//    @Override
//    public void onStartup(ServletContext servletContext) {
//        // Only set root context if it doesn't already exist (for WebLogic)
//        if (servletContext.getAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE) == null) {
//            servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, applicationContext);
//        }
//    }
//}
