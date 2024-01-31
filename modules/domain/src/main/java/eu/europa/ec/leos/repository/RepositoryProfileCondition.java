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
package eu.europa.ec.leos.repository;

import eu.europa.ec.leos.domain.common.RepositoryProfileType;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.context.annotation.ConfigurationCondition;
import org.springframework.core.type.AnnotatedTypeMetadata;
import org.springframework.util.MultiValueMap;

import java.util.Arrays;
import java.util.Properties;

public class RepositoryProfileCondition implements ConfigurationCondition {

    @Override
    public boolean matches(ConditionContext conditionContext, AnnotatedTypeMetadata annotatedTypeMetadata) {
        ConfigurableListableBeanFactory beanFactory = conditionContext.getBeanFactory();
        if (beanFactory == null) {
            throw new IllegalStateException("Not able to retrieve BeanFactory from ConditionContext");
        }
        Object applicationProperties = beanFactory.getBean("applicationProperties");
        String leosRepositoryProfile = ((Properties) applicationProperties).getProperty("leos.repository.profile");
        RepositoryProfileType currentRepositoryProfile = RepositoryProfileType.valueOf(leosRepositoryProfile);
        MultiValueMap<String, Object> attributes = annotatedTypeMetadata.getAllAnnotationAttributes(RepositoryProfile.class.getName());
        if (attributes == null) {
            throw new IllegalStateException("No classes annotated with @RepositoryProfile were found");
        }

        RepositoryProfileType value = (RepositoryProfileType) attributes.getFirst("value");
        RepositoryProfileType[] repositoryProfiles = (RepositoryProfileType[]) attributes.getFirst("repositoryProfiles");

        if(RepositoryProfileType.DEFAULT == value && repositoryProfiles != null && repositoryProfiles.length == 0){
            return true;
        } else if(value != null && RepositoryProfileType.DEFAULT != value){
            return value == currentRepositoryProfile;
        } else if(repositoryProfiles != null && repositoryProfiles.length != 0){
            return Arrays.stream(repositoryProfiles).anyMatch(repositoryProfileType -> repositoryProfileType == currentRepositoryProfile);
        }
        return false;
    }

    @Override
    public ConfigurationPhase getConfigurationPhase() {
        return ConfigurationPhase.REGISTER_BEAN;
    }
}
