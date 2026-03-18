package eu.europa.ec.digit.userdata.controllers;

import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/app-info", produces = "application/json;charset=utf-8")
@CrossOrigin(origins = "*")
public class UserRepoAppInfoController implements UserRepoAppInfoApi {

    private static final Logger log = LoggerFactory.getLogger(UserRepoAppInfoController.class);

    @Override
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
