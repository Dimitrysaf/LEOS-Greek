/*
 * Copyright 2021 European Commission
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
package eu.europa.ec.leos.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanInitializationException;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

import java.io.IOException;
import java.util.Properties;

public class PasswordConfigurator extends PropertySourcesPlaceholderConfigurer implements BeanFactoryPostProcessor {

    private static final Properties PROPERTIES = new Properties();
    private static final Logger LOG = LoggerFactory.getLogger(PasswordConfigurator.class);

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        try {
            this.loadProperties(PROPERTIES);
        } catch (IOException e) {
            LOG.error("Could not load property file. Error: {}", e.getMessage());
            throw new BeanInitializationException("Could not load property file", e);
        }
        this.convertProperties(PROPERTIES);
        this.setProperties(PROPERTIES);
        this.setLocalOverride(true);

        super.postProcessBeanFactory(beanFactory);
    }

    @Override
    protected String convertProperty(String propertyName, String propertyValue) {
        return propertyValue;
    }

    public String getProperty(String propertyName) {
        return PROPERTIES.getProperty(propertyName);
    }
}