package eu.europa.ec.digit.userdata.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Slf4j
@Profile("h2")
public class H2DbConfig {

    @Value("${h2.expose.port:}")
    private String exposePort;

    @PostConstruct
    public void exposeH2() {
        try {
            if (StringUtils.isNotBlank(exposePort)) {
                final Class<?> serverClass = Class.forName("org.h2.tools.Server");
                Object server = serverClass
                        .getMethod("createTcpServer", String[].class)
                        .invoke(null, (Object) new String[]{"-tcp", "-tcpAllowOthers", "-tcpPort", exposePort});
                serverClass.getMethod("start").invoke(server);
            }
        } catch (Exception e) {
            log.info("Failed to expose h2 at port " + exposePort, e);
        }
    }
}
