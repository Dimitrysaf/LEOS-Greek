package eu.europa.ec.leos.services.template;

import com.fasterxml.jackson.databind.JsonNode;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.repository.store.ConfigurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TemplateStructureServiceImpl implements TemplateStructureService {

    @Value("${leos.templates.path}")
    private String templatesStructurePath;

    @Value("${leos.templates.structure}")
    private String structure;

    @Autowired
    TemplateConfigurationService templateConfigurationService;

    @Autowired
    ConfigurationRepository configurationRepository;

    @Override
    public byte[] getStructure(String templateID, boolean translated) {
        return this.getStructureXMLDocument(templateConfigurationService.getElementJsonFromTemplateConfiguration(templateID, structure), translated);
    }

    @Override
    public byte[] getStructure(String templateID, boolean translated, String documentLanguage) {
        return this.getStructureXMLDocument(templateConfigurationService.getElementJsonFromTemplateConfiguration(templateID, structure, documentLanguage), translated);
    }

    private byte[] getStructureXMLDocument(JsonNode structureJson, boolean translated) {
        String structureName = getStructureName(structureJson, translated);
        XmlDocument structureXmlDocument = configurationRepository.findTemplate(templatesStructurePath, structureName);
        return structureXmlDocument.getContent().get().getSource().getBytes();
    }

    private static String getStructureName(JsonNode structureJson, boolean translated) {
        for (JsonNode node : structureJson) {
            String mode = node.path("mode").asText();
            if (translated && "translated".equals(mode)) {
                return node.get("name").asText();
            } else if (!translated && "main".equals(mode)) {
                return node.get("name").asText();
            }
        }
        return structureJson.get(0).get("name").asText();
    }
}
