package eu.europa.ec.leos.services.structure.lang;
/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence")
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */

import eu.europa.ec.leos.domain.repository.document.ConfigDocument;
import eu.europa.ec.leos.repository.store.ConfigurationRepository;
import eu.europa.ec.leos.vo.lang.LanguageGroup;
import eu.europa.ec.leos.vo.lang.ObjectFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.xml.XMLConstants;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class LanguageGroupServiceImpl {

    private static final Logger LOG = LoggerFactory.getLogger(LanguageGroupServiceImpl.class);

    @Value("${leos.light.lang.group.schema.path}")
    private String langGroupSchema;

    @Value("${leos.templates.path}")
    private String langGroupPath;

    @Value("${leos.light.lang.group.name}")
    private String langGroupName;

    ConfigurationRepository configurationRepository;
    LanguageMapHolder languageMapHolder;

    @Autowired
    public LanguageGroupServiceImpl(ConfigurationRepository configurationRepository, LanguageMapHolder languageMapHolder) {
        this.configurationRepository = configurationRepository;
        this.languageMapHolder = languageMapHolder;
    }

    @PostConstruct
    public void getLanguageMap() {
        byte[] languageDocument = getLangGroupDocument();
        final LanguageGroup languageGroup = loadLanguageGroupFromFile(languageDocument);
        Map<String, List<String>> languageMap = new HashMap<>();
        languageGroup.getGroups().getGroups().forEach(group -> {
            languageMap.put(group.getName(), group.getLangs());
        });
        languageMapHolder.loadLanguageMap(languageMap);
        System.out.println("Language Map: "+ LanguageMapHolder.getLanguageMap());
    }

    public byte[] getLangGroupDocument() {
        ConfigDocument langDocument = configurationRepository.findConfiguration(langGroupPath, langGroupName);
        return langDocument.getContent().get().getSource().getBytes();
    }

    private LanguageGroup loadLanguageGroupFromFile(byte[] fileBytes) {
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(ObjectFactory.class);
            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();

            SchemaFactory sf = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
            Schema langSchema = sf.newSchema(new StreamSource(loadSchema()));
            jaxbUnmarshaller.setSchema(langSchema);

            LanguageGroup languageGroup = (LanguageGroup) jaxbUnmarshaller.unmarshal(new ByteArrayInputStream(fileBytes));
            return languageGroup;
        } catch (Exception e) {
            LOG.debug("Error in loadLanguageGroupFromFile", e);
            throw new IllegalStateException("Error loading language group configurations", e);
        }
    }

    private InputStream loadSchema() {
        return LanguageGroupServiceImpl.class.getClassLoader().getResourceAsStream(langGroupSchema);
    }
}
