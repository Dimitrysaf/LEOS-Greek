package eu.europa.ec.leos.repository.health;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
@ConditionalOnProperty(name = "leos.health.master.enabled", havingValue = "true")
public class MasterHealthIndicator implements HealthIndicator {

    @Value("${leos.health.akn4euutil.url:}")
    private String akn4euUtilUrl;

    @Value("${leos.health.user-repo.url:}")
    private String userRepoUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public Health health() {
        Map<String, Object> details = new HashMap<>();
        boolean allHealthy = true;

        if (!akn4euUtilUrl.isEmpty()) {
            allHealthy &= checkApp("akn4euutil", akn4euUtilUrl, details);
        }

        if (!userRepoUrl.isEmpty()) {
            allHealthy &= checkApp("user-repo", userRepoUrl, details);
        }

        return allHealthy ? Health.up().withDetails(details).build() 
                          : Health.down().withDetails(details).build();
    }

    private boolean checkApp(String appName, String url, Map<String, Object> details) {
        try {
            restTemplate.getForObject(url + "/actuator/health", String.class);
            details.put(appName, "UP");
            return true;
        } catch (Exception e) {
            details.put(appName, "DOWN: " + e.getMessage());
            return false;
        }
    }
}
