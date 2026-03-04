package eu.europa.ec.leos.services.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Value("${app.version:Unknown}")
    private String projectVersion;

    @Bean
    public OpenAPI leosOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("LEOS Service API")
                        .version(projectVersion)
                        .description("LEOS Service API Documentation"));
    }
}
