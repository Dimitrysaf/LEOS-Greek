package eu.europa.ec.leos.services.config.web;

import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.ErrorPageRegistrar;
import org.springframework.boot.web.server.ErrorPageRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

@Configuration
public class ErrorPageConfig {

    @Bean
    public ErrorPageRegistrar errorPageRegistrar() {
        return new ErrorPageRegistrar() {
            @Override
            public void registerErrorPages(ErrorPageRegistry registry) {
                registry.addErrorPages(
                        new ErrorPage(HttpStatus.UNAUTHORIZED, "/WEB-INF/html/401.html"),
                        new ErrorPage(HttpStatus.FORBIDDEN, "/WEB-INF/html/403.html"),
                        new ErrorPage(HttpStatus.NOT_FOUND, "/WEB-INF/html/404.html"),
                        new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/WEB-INF/html/500.html")
                );
            }
        };
    }
}
