package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.integration.UsersProvider;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.api.exception.ResponseExceptionHandler;
import eu.europa.ec.leos.services.controllers.aspects.PermissionAspect;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import static org.mockito.Mockito.mock;

@Configuration
@EnableWebMvc
@EnableAspectJAutoProxy(proxyTargetClass = true)
class MvcTestConfig {
    @Bean
    public SecurityContext securityContext() {
        return mock(SecurityContext.class);
    }

    @Bean
    public UsersProvider usersClient() {
        return mock(UsersProvider.class);
    }

    @Bean
    public AdministrationController administrationController(SecurityContext securityContext, UsersProvider usersClient) {
        return new AdministrationController(securityContext, usersClient);
    }

    @Bean
    public PermissionAspect permissionAspect() {
        return new PermissionAspect();
    }

    @Bean
    public ResponseExceptionHandler responseExceptionHandler() {
        return new ResponseExceptionHandler();
    }
}
