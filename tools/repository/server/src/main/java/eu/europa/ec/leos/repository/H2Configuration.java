package eu.europa.ec.leos.repository;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(name = "spring.jpa.properties.hibernate.dialect", havingValue = "org.hibernate.dialect.H2Dialect")
public class H2Configuration {

    @PostConstruct
    public void configureH2Mode() {
        org.h2.engine.Mode mode = org.h2.engine.Mode.getInstance("Oracle");
        mode.numericWithBooleanComparison = true;
    }
}


