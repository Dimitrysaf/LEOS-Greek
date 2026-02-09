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
package eu.europa.ec.leos.services.template;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.document.ConfigDocument;
import eu.europa.ec.leos.repository.store.ConfigurationRepository;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.utils.LanguageMapUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
class TemplateConfigurationServiceImpl implements TemplateConfigurationService {

    private static final Logger LOG = LoggerFactory.getLogger(TemplateConfigurationServiceImpl.class);

    private final ConfigurationRepository configurationRepository;
    private final DocumentLanguageContext documentLanguageContext;

    // Templates and template configuration are related to so they are kept in same folder
    @Value("${leos.templates.path}")
    private String templatesPath;

    @Autowired
    TemplateConfigurationServiceImpl(ConfigurationRepository configurationRepository, DocumentLanguageContext documentLanguageContext) {
        this.configurationRepository = configurationRepository;
        this.documentLanguageContext = documentLanguageContext;
    }

    @Override
    public String getTemplateConfiguration(String templateId) {
        JsonNode confJson = getConfJson(templateId);
        return confJson != null ? confJson.toString() : null;
    }

    @Override
    public String getElementFromTemplateConfiguration(String templateId, String confElement) {
        JsonNode confElementJson = getConfElementJson(templateId, confElement);
        return confElementJson != null ? confElementJson.toString() : null;
    }

    @Override
    public JsonNode getElementJsonFromTemplateConfiguration(String templateId, String confElement) {
        return getConfElementJson(templateId, confElement);
    }

    private JsonNode getConfElementJson(String templateId, String confElement) {
        LOG.trace("Getting template configuration... [templateId={}] , [confElement={}]", templateId, confElement);

        JsonNode rootNode = getConfJson(templateId);
        JsonNode templateConfJson = rootNode.get(confElement);
        if (templateConfJson == null) {
            throw new IllegalArgumentException("Element '" + confElement + "' not present in the '" + templateId + "-CONF'");
        }

        LOG.trace("Retrieved template configuration... [templateId={}] , [confElement={}]", templateId, confElement);

        return templateConfJson;
    }

    private JsonNode getConfJson(String templateId) {
        LOG.trace("Getting template configuration... [templateId={}]", templateId);
        String conf;
        String documentLanguage = documentLanguageContext.getDocumentLanguage();
        String languageSuffix = LanguageMapUtils.getLanguageTemplateSuffix(documentLanguage);
        String confFile = templateId + "-CONF";

        try {
            ConfigDocument confDocument = getConfigDocument(confFile, languageSuffix);

            if (confDocument.getContent().isDefined()) {
                Content content = confDocument.getContent().get();
                conf = content.getSource().toString();
                ObjectMapper mapper = new ObjectMapper();

                JsonNode rootNode = mapper.readTree(conf);
                if (rootNode == null) {
                    throw new IllegalArgumentException(templateId + "-CONF" + languageSuffix + ".json is not present");
                }
                LOG.debug("Retrieved template configuration length {} for template {}", content.getLength(), templateId.concat(languageSuffix));
                return rootNode;
            }
        } catch (Exception exception) {
            if (exception instanceof IllegalArgumentException) {
                throw (IllegalArgumentException) exception;
            }
            LOG.error("Error occurred while fetching the conf for templateId: {}, Error: {} ", templateId, exception.getMessage());
            throw new IllegalArgumentException(
                    "Error occurred while fetching the conf for templateId: " + templateId + "-CONF" + languageSuffix + ".json, Error: " + exception.getMessage());
        }
        return null;
    }

    private ConfigDocument getConfigDocument(String confFile, String languageSuffix) {
        ConfigDocument confDocument;
        try {
            confDocument = configurationRepository.findConfiguration(templatesPath, confFile + languageSuffix);
        } catch (IllegalArgumentException e) {
            if (StringUtils.startsWith(e.getMessage(), "404 NOT_FOUND")) {
                confDocument = configurationRepository.findConfiguration(templatesPath, confFile);
            } else {
                throw e;
            }
        }
        return confDocument;
    }

}
