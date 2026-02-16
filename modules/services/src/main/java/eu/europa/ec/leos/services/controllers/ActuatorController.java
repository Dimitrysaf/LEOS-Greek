package eu.europa.ec.leos.services.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.*;
import org.springframework.boot.actuate.jdbc.DataSourceHealthIndicator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/actuator")
public class ActuatorController {

    private final HealthContributorRegistry healthRegistry;
    private final StatusAggregator statusAggregator;

    public ActuatorController(@Autowired(required = false) DataSource dataSource) {
        this.healthRegistry = new DefaultHealthContributorRegistry();
        this.statusAggregator = new SimpleStatusAggregator();
        
        if (dataSource != null) {
            healthRegistry.registerContributor("db", new DataSourceHealthIndicator(dataSource, "select 1 from dual"));
        }

        healthRegistry.registerContributor("ping", new PingHealthIndicator());
        healthRegistry.registerContributor("livenessState", (HealthIndicator) () -> Health.up().build());
        healthRegistry.registerContributor("readinessState", (HealthIndicator) () -> Health.up().build());
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Health> healths = new LinkedHashMap<>();
        
        healthRegistry.stream().forEach(contributor -> {
            if (contributor.getContributor() instanceof HealthIndicator indicator) {
                healths.put(contributor.getName(), indicator.health());
            }
        });
        
        Status overallStatus = statusAggregator.getAggregateStatus(
            healths.values().stream().map(Health::getStatus).collect(Collectors.toSet())
        );
        
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", overallStatus.getCode());
        response.put("groups", new String[]{"liveness", "readiness"});
        
        Map<String, Object> components = new LinkedHashMap<>();
        healths.forEach((name, h) -> {
            Map<String, Object> component = new LinkedHashMap<>();
            component.put("status", h.getStatus().getCode());
            if (!h.getDetails().isEmpty()) {
                component.put("details", h.getDetails());
            }
            components.put(name, component);
        });
        response.put("components", components);
        
        HttpStatus httpStatus = overallStatus.equals(Status.DOWN) ? HttpStatus.SERVICE_UNAVAILABLE : HttpStatus.OK;
        return ResponseEntity.status(httpStatus).body(response);
    }
}
