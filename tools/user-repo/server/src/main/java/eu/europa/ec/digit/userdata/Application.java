/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.digit.userdata;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.web.WebApplicationInitializer;

@SpringBootApplication
@Slf4j
public class Application extends SpringBootServletInitializer implements WebApplicationInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }

    public static void main(String[] args) {
        initH2OracleMode();
        SpringApplication.run(Application.class, args);
    }

    /**
     * Set the limit mode for H2 database for local execution only.
     * We do not import H2 classes here, as we want to keep H2 as a runtime dependency.
     */
    public static void initH2OracleMode() {
        try {
            final Class<?> h2Mode = Class.forName("org.h2.engine.Mode");
            final Object oracleMode = h2Mode.getMethod("getInstance", String.class).invoke(null, "ORACLE");
            oracleMode.getClass().getField("limit").set(oracleMode, true);
        } catch (Exception e) {
            log.info("Not in H2 Oracle mode", e);
        }
    }
}
