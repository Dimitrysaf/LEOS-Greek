package eu.europa.ec.leos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ImportResource;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication(scanBasePackages = {}, exclude = {
        SecurityAutoConfiguration.class,
        UserDetailsServiceAutoConfiguration.class,
        SecurityFilterAutoConfiguration.class
})
@ImportResource("classpath:eu/europa/ec/leos/applicationContext.xml")
@PropertySource("classpath:application_leos.properties")
public class LeosApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        System.out.println("*** SpringBootServletInitializer.configure() called! ***");

        // Enable debug logging for Spring context loading
        System.setProperty("logging.level.org.springframework", "DEBUG");
        System.setProperty("logging.level.org.springframework.beans", "DEBUG");

        return application.sources(LeosApplication.class);
    }

    public static void main(String[] args) {
        System.out.println("*** Main method called ***");
        SpringApplication.run(LeosApplication.class, args);
    }
}