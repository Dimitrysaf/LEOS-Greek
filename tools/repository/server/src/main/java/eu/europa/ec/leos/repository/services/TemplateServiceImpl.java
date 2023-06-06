/*
 * Copyright 2023 European Commission
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
package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.entities.Config;
import eu.europa.ec.leos.repository.entities.ConfigContent;
import eu.europa.ec.leos.repository.entities.ConfigVersion;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.Template;
import eu.europa.ec.leos.repository.repositories.ConfigContentRepository;
import eu.europa.ec.leos.repository.repositories.ConfigRepository;
import eu.europa.ec.leos.repository.repositories.ConfigVersionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class TemplateServiceImpl implements TemplateService {
    private final ConfigRepository configRepository;
    private final ConfigVersionRepository configVersionRepository;
    private final ConfigContentRepository configContentRepository;

    @Autowired
    public TemplateServiceImpl(ConfigRepository configRepository, ConfigVersionRepository configVersionRepository, ConfigContentRepository configContentRepository) {
        this.configRepository = configRepository;
        this.configVersionRepository = configVersionRepository;
        this.configContentRepository = configContentRepository;
    }

    public Template findTemplateByName(String name, Map<String, ?> metadata) throws RepositoryException {
        Config doc = configRepository.findConfigByName(name);
        if (doc != null) {
            ConfigVersion version = configVersionRepository.findLastConfigVersionByConfigId(doc.getId());
            if (version == null) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, ConfigVersion.class.getName());
            }
            ConfigContent content = configContentRepository.findConfigContentByVersionId(version);
            if (content == null) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, ConfigContent.class.getName());
            }
            return new Template(doc, version, content, (Map<String, Object>) metadata);
        } else {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Config.class.getName());
        }
    }
}
