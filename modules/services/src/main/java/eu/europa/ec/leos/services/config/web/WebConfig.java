package eu.europa.ec.leos.services.config.web;

import eu.europa.ec.leos.services.filter.LeosCorsFilter;
import eu.europa.ec.leos.services.filter.ForwardSlashFilter;
import eu.europa.ec.leos.services.filter.MilestoneCssFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.support.XmlWebApplicationContext;
import org.springframework.web.filter.DelegatingFilterProxy;
import org.springframework.web.filter.RequestContextFilter;
import org.springframework.web.servlet.DispatcherServlet;
import ch.qos.logback.classic.ViewStatusMessagesServlet;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.Ordered;

import javax.servlet.DispatcherType;
import java.util.EnumSet;

@Configuration
public class WebConfig {

    // ========== Servlet Registrations ==========

    @Bean
    public ServletRegistrationBean<DispatcherServlet> apiDispatcherServlet() {
        // Create dispatcher servlet
        DispatcherServlet servlet = new DispatcherServlet();

        // Create XML context for dispatcher-servlet.xml
        XmlWebApplicationContext context = new XmlWebApplicationContext();
        context.setConfigLocation("/WEB-INF/dispatcher-servlet.xml");
        servlet.setApplicationContext(context);

        // Register servlet
        ServletRegistrationBean<DispatcherServlet> registration = new ServletRegistrationBean<>(servlet);
        registration.setName("dispatcher");
        registration.addUrlMappings("/api/*", "/secured-api/*", "/ui/api/*");
        registration.setLoadOnStartup(1);
        registration.setAsyncSupported(true);

        return registration;
    }

    @Bean
    public ServletRegistrationBean<DispatcherServlet> uiDispatcherServlet() {
        // Create dispatcher servlet
        DispatcherServlet servlet = new DispatcherServlet();

        // Create XML context for ui-dispatcher-servlet.xml
        XmlWebApplicationContext context = new XmlWebApplicationContext();
        context.setConfigLocation("/WEB-INF/ui-dispatcher-servlet.xml");
        servlet.setApplicationContext(context);

        // Register servlet
        ServletRegistrationBean<DispatcherServlet> registration = new ServletRegistrationBean<>(servlet);
        registration.setName("ui-dispatcher");
        registration.addUrlMappings("/ui/*");
        registration.setLoadOnStartup(1);
        registration.setAsyncSupported(true);

        return registration;
    }

    @Bean
    public ServletRegistrationBean<ViewStatusMessagesServlet> logbackStatusServlet() {
        ServletRegistrationBean<ViewStatusMessagesServlet> registration =
                new ServletRegistrationBean<>(new ViewStatusMessagesServlet());
        registration.setName("Logback Status Servlet");
        registration.addUrlMappings("/logStatus");
        return registration;
    }

    // ========== Filter Registrations ==========

    @Bean
    public FilterRegistrationBean<RequestContextFilter> requestContextFilter() {
        FilterRegistrationBean<RequestContextFilter> registration = new FilterRegistrationBean<>();
        RequestContextFilter filter = new RequestContextFilter();
        filter.setThreadContextInheritable(true);

        registration.setFilter(filter);
        registration.setName("requestContextFilter");
        registration.addUrlPatterns("/ws/*");
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 10);

        return registration;
    }

    @Bean
    public FilterRegistrationBean<MilestoneCssFilter> milestoneCssFilter() {
        FilterRegistrationBean<MilestoneCssFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new MilestoneCssFilter());
        registration.setName("milestoneCssFilter");
        registration.addUrlPatterns("/css/*");
        registration.setDispatcherTypes(EnumSet.of(DispatcherType.REQUEST, DispatcherType.ASYNC));
        registration.setAsyncSupported(true);
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 20);

        return registration;
    }

    @Bean
    public FilterRegistrationBean<LeosCorsFilter> leosCorsFilter() {
        FilterRegistrationBean<LeosCorsFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new LeosCorsFilter());
        registration.setName("LeosCorsFilter");
        registration.addUrlPatterns("/api/token");
        registration.setDispatcherTypes(EnumSet.of(DispatcherType.REQUEST, DispatcherType.ASYNC));
        registration.setAsyncSupported(true);
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 30);

        return registration;
    }

    @Bean
    public FilterRegistrationBean<ForwardSlashFilter> forwardSlashFilter() {
        FilterRegistrationBean<ForwardSlashFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new ForwardSlashFilter());
        registration.setName("ForwardSlashFilter");
        registration.addUrlPatterns("/ui");
        registration.setDispatcherTypes(EnumSet.of(DispatcherType.REQUEST, DispatcherType.ASYNC));
        registration.setAsyncSupported(true);
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 40);

        return registration;
    }

    // ========== Spring Security Filter ==========

    @Bean
    @ConditionalOnProperty(name = "saml", matchIfMissing = true, havingValue = "false")
    public FilterRegistrationBean<DelegatingFilterProxy> springSecurityFilterChainDefault() {
        FilterRegistrationBean<DelegatingFilterProxy> registration = new FilterRegistrationBean<>();
        registration.setFilter(new DelegatingFilterProxy("springSecurityFilterChain"));
        registration.setName("springSecurityFilterChain");
        // Default authentication: secure /api/secured/* and /ui/*
        registration.addUrlPatterns("/api/secured/*", "/ui/*");
        registration.setDispatcherTypes(EnumSet.of(DispatcherType.REQUEST, DispatcherType.ASYNC));
        registration.setAsyncSupported(true);
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 50);

        return registration;
    }

    @Bean
    @ConditionalOnProperty(name = "saml", havingValue = "true")
    public FilterRegistrationBean<DelegatingFilterProxy> springSecurityFilterChainSaml() {
        FilterRegistrationBean<DelegatingFilterProxy> registration = new FilterRegistrationBean<>();
        registration.setFilter(new DelegatingFilterProxy("springSecurityFilterChain"));
        registration.setName("springSecurityFilterChain");
        // SAML authentication: secure /api/secured/*, /saml/*, and /ui/*
        registration.addUrlPatterns("/api/secured/*", "/saml/*", "/ui/*");
        registration.setDispatcherTypes(EnumSet.of(DispatcherType.REQUEST, DispatcherType.ASYNC));
        registration.setAsyncSupported(true);
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 50);

        return registration;
    }
}