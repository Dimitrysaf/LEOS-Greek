package eu.europa.ec.leos.services.controllers;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/app-info", produces = "application/json;charset=utf-8")
@CrossOrigin(origins = "*")
@Slf4j
public class LeosAppInfoController {

    @GetMapping
    public Map<String, String> getAppInfo() {
        Properties properties = new Properties();
        try {
            properties.load(getClass().getClassLoader().getResourceAsStream("app-info.properties"));
        } catch (Exception e) {
            log.error("Error loading app-info.properties",e);
        }
        return properties.entrySet().stream()
                .collect(Collectors.toMap(
                        e -> String.valueOf(e.getKey()),
                        e -> String.valueOf(e.getValue())
                ));
    }

}
