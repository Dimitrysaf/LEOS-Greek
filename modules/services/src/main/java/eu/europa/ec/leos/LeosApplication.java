package eu.europa.ec.leos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ImportResource;

@SpringBootApplication(scanBasePackages = {})  // Disable component scanning - we use XML
@ImportResource("classpath:eu/europa/ec/leos/applicationContext.xml")
public class LeosApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(LeosApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(LeosApplication.class, args);
    }
}