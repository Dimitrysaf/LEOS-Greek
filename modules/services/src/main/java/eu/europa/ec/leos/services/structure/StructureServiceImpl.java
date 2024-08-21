package eu.europa.ec.leos.services.structure;

import static eu.europa.ec.leos.services.utils.StructureConfigUtils.getTocItemsByName;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.XMLConstants;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;

import eu.europa.ec.leos.vo.structure.AknTag;
import eu.europa.ec.leos.vo.structure.AlternateConfig;
import eu.europa.ec.leos.vo.structure.DocumentRules;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.vo.structure.ObjectFactory;
import eu.europa.ec.leos.vo.structure.RefConfig;
import eu.europa.ec.leos.vo.structure.Structure;
import eu.europa.ec.leos.vo.structure.TocItem;
import eu.europa.ec.leos.vo.structure.TocRules;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import eu.europa.ec.leos.services.template.TemplateStructureService;

@Service
public class StructureServiceImpl implements StructureService {
    
    protected static final Logger LOG = LoggerFactory.getLogger(StructureServiceImpl.class);
    
    @Value("${leos.templates.structure.schema.path}")
    private String structureSchema;
    
    @Autowired
    private TemplateStructureService templateStructureService;
    
    protected Map<String, TocStructure> tocStructureMap = new HashMap<>();
    
    @Override
    @Cacheable(value = "tocStructureList")
    public List<TocItem> getTocItems(String docTemplate) {
        loadTocStructure(docTemplate);
        return tocStructureMap.get(docTemplate).getTocItems();
    }
    
    @Override
    @Cacheable(value = "tocStructureTocRulesMap")
    public Map<TocItem, List<TocItem>> getTocRules(String docTemplate) {
        loadTocStructure(docTemplate);
        return tocStructureMap.get(docTemplate).getTocRules();
    }

    @Override
    @Cacheable(value = "tocStructureDocumentRulesMap")
    public Map<String, DocumentRules.Rule> getDocumentRules(String docTemplate) {
        loadTocStructure(docTemplate);
        return tocStructureMap.get(docTemplate).getDocumentRules();
    }
    
    @Override
    @Cacheable(value = "tocStructureNumConfList")
    public List<NumberingConfig> getNumberingConfigs(String docTemplate) {
        loadTocStructure(docTemplate);
        return tocStructureMap.get(docTemplate).getNumberingConfigs();
    }

    @Override
    @Cacheable(value = "refConfigs")
    public List<RefConfig> getRefConfigs(String docTemplate) {
        loadTocStructure(docTemplate);
        return tocStructureMap.get(docTemplate).getRefConfigs();
    }
    
    @Override
    @Cacheable(value = "alternateConfList")
    public List<AlternateConfig> getAlternateConfigs(String docTemplate) {
        loadTocStructure(docTemplate);
        return tocStructureMap.get(docTemplate).getAlternateConfigs();
    }
    
    @Override
    public String getStructureName(String docTemplate) {
        loadTocStructure(docTemplate);
        return tocStructureMap.get(docTemplate).getStructureName();
    }
    
    @Override
    public String getStructureVersion(String docTemplate) {
        loadTocStructure(docTemplate);
        return tocStructureMap.get(docTemplate).getStructureVersion();
    }

    @Override
    public String getStructureDescription(String docTemplate) {
        loadTocStructure(docTemplate);
        return tocStructureMap.get(docTemplate).getStructureDescription();
    }
    
    /**
     * Load from CMIS only the first time for specific template.
     * The server needs to be restarted in case the cmis xml has been changed.
     */
    private void loadTocStructure(String docTemplate) {
        byte[] structureXmlFile = templateStructureService.getStructure(docTemplate);
        final Structure structure = loadRulesFromFile(structureXmlFile);

        TocStructure tocStructure = new TocStructure();
        tocStructure.setStructureName(structure.getName());
        tocStructure.setStructureVersion(structure.getVersion());
        tocStructure.setStructureDescription(structure.getDescription());
        tocStructure.setNumberingConfigs(structure.getNumberingConfigs().getNumberingConfigs());
        tocStructure.setAlternateConfigs(structure.getAlternateConfigs().getAlternateConfigs());
        if(structure.getReferenceConfig() != null) {
            tocStructure.setRefConfigs(structure.getReferenceConfig().getRefConfigs());
        }

        List<TocItem> tocItems = structure.getTocItems().getTocItems();
        tocStructure.setTocItems(tocItems);
        tocStructure.setTocRules(buildProposalTocRules(structure, tocItems));
        tocStructure.setDocumentRules(buildProposalDocumentRules(structure, tocItems));

        tocStructureMap.put(docTemplate, tocStructure); //cache it for the next call
    }
    
    private Structure loadRulesFromFile(byte[] fileBytes) {
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(ObjectFactory.class);
            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            
            SchemaFactory sf = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
            Schema tocSchema = sf.newSchema(new StreamSource(loadSchema()));
            jaxbUnmarshaller.setSchema(tocSchema);
            
            Structure structure = (Structure) jaxbUnmarshaller.unmarshal(new ByteArrayInputStream(fileBytes));
            return structure;
        } catch (Exception e) {
            LOG.debug("Error loadRulesFromFile", e);
            throw new IllegalStateException("Error loading xml configurations", e);
        }
    }
    
    private InputStream loadSchema() {
        return StructureServiceImpl.class.getClassLoader().getResourceAsStream(structureSchema);
    }
    
    private Map<TocItem, List<TocItem>> buildProposalTocRules(Structure structure, List<TocItem> tocItems) {
        Map<TocItem, List<TocItem>> tocRules = new HashMap<>();
        if(structure.getTocRules() != null) {
            for (TocRules.Entry entry : structure.getTocRules().getEntries()) {
                AknTag itemName = entry.getTocItem();
                List<TocItem> foundTocItems = getTocItemsByName(tocItems, itemName.value());
                for (TocItem tocItem : foundTocItems) {
                    List<TocItem> list = new ArrayList<>();
                    for (AknTag listTocName : entry.getList().getTocItems()) {
                        list.addAll(getTocItemsByName(tocItems, listTocName.value()));
                    }
                    tocRules.put(tocItem, list);
                }
            }

        }
        return tocRules;
    }

    private Map<String, DocumentRules.Rule> buildProposalDocumentRules(Structure structure, List<TocItem> tocItems) {
        Map<String, DocumentRules.Rule> documentRules = new HashMap<>();
        if(structure.getDocumentRules() != null) {
            for (DocumentRules.Rule rule : structure.getDocumentRules().getRules()) {
                String itemName = rule.getTocItem().value();
                documentRules.put(itemName, rule);
            }
        }
        return documentRules;
    }

}
