/*
 * Copyright 2017 European Commission
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
package eu.europa.ec.leos.cmis.authentication;

import java.io.IOException;
import java.io.InputStream;
import java.security.Principal;
import java.util.Properties;

import org.apache.chemistry.opencmis.client.bindings.spi.StandardAuthenticationProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import eu.europa.ec.leos.config.PasswordConfigurator;

public class LeosCmisAuthenticationProvider extends StandardAuthenticationProvider {

    private static final Logger LOG = LoggerFactory.getLogger(LeosCmisAuthenticationProvider.class);

    private PasswordConfigurator passwordConfigurator = new PasswordConfigurator();
    private Properties applicationProperties = new Properties();

    public LeosCmisAuthenticationProvider() {
        try {
            InputStream inputStream = getClass().getClassLoader().getResourceAsStream("application_leos.properties");
            applicationProperties.load(inputStream);
        } catch (Exception e) {
            LOG.error("Could not load property file 'application_leos.properties'. Error: {}", e.getMessage());
        }
    }

    @Override
    protected String getUser() {
        // NOTE when no username is configured, link the CMIS session to the LEOS User, through the user's login
        String name = getTechnicalUserName();
        if (name == null || name.isEmpty()) {
            Principal principal = getPrincipal();
            if (principal != null) {
                name = principal.getName();
            }
        }
        return name;
    }

    @Override
    protected String getPassword() {
        return passwordConfigurator.getProperty("leos.cmis.repository.password");
    }

   protected String getTechnicalUserName(){
        return applicationProperties.getProperty("leos.cmis.repository.username");
   }

    protected Authentication getPrincipal() {
        return SecurityContextHolder.getContext().getAuthentication();
    }
}
