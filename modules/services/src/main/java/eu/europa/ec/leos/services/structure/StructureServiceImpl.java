package eu.europa.ec.leos.services.structure;

import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.services.template.TemplateStructureService;
import eu.europa.ec.leos.vo.structure.AknTag;
import eu.europa.ec.leos.vo.structure.AlternateConfig;
import eu.europa.ec.leos.vo.structure.DocumentRules;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.vo.structure.ObjectFactory;
import eu.europa.ec.leos.vo.structure.RefConfig;
import eu.europa.ec.leos.vo.structure.Structure;
import eu.europa.ec.leos.vo.structure.TocIdList;
import eu.europa.ec.leos.vo.structure.TocItem;
import eu.europa.ec.leos.vo.structure.TocRules;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.services.utils.StructureConfigUtils.getTocItemsByName;

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
        return getTocItems(docTemplate, false);
    }
    
    @Override
    @Cacheable(value = "tocStructureList")
    public List<TocItem> getTocItems(String docTemplate, boolean translated) {
        loadTocStructure(docTemplate, translated);
        String mapKey = translated ? docTemplate + "_translated" : docTemplate;
        return tocStructureMap.get(mapKey).getTocItems();
    }
    
    @Override
    @Cacheable(value = "tocStructureTocRulesMap")
    public Map<TocItem, List<TocItem>> getTocRules(String docTemplate) {
        loadTocStructure(docTemplate, false);
        return tocStructureMap.get(docTemplate).getTocRules();
    }
    @Override
    @Cacheable(value = "tocStructureTocRulesOrdersMap")
    public Map<TocItem, List<List<TocItem>>> getTocRulesOrders(String docTemplate) {
        loadTocStructure(docTemplate, false);
        return tocStructureMap.get(docTemplate).getTocRulesOrders();
    }

    @Override
    @Cacheable(value = "tocStructureDocumentRulesMap")
    public Map<String, DocumentRules.Rule> getDocumentRules(String docTemplate) {
        loadTocStructure(docTemplate, false);
        return tocStructureMap.get(docTemplate).getDocumentRules();
    }
    
    @Override
    @Cacheable(value = "tocStructureNumConfList")
    public List<NumberingConfig> getNumberingConfigs(String docTemplate) {
        loadTocStructure(docTemplate, false);
        return tocStructureMap.get(docTemplate).getNumberingConfigs();
    }

    @Override
    @Cacheable(value = "refConfigs")
    public List<RefConfig> getRefConfigs(String docTemplate) {
        loadTocStructure(docTemplate, false);
        return tocStructureMap.get(docTemplate).getRefConfigs();
    }

    @Override
    @Cacheable(value = "refConfigs")
    public List<RefConfig> getRefConfigs(String docTemplate, String documentLanguage) {
        loadTocStructure(docTemplate, false, documentLanguage);
        return tocStructureMap.get(docTemplate).getRefConfigs();
    }
    
    @Override
    @Cacheable(value = "alternateConfList")
    public List<AlternateConfig> getAlternateConfigs(String docTemplate) {
        loadTocStructure(docTemplate, false);
        return tocStructureMap.get(docTemplate).getAlternateConfigs();
    }
    
    @Override
    public String getStructureName(String docTemplate) {
        loadTocStructure(docTemplate, false);
        return tocStructureMap.get(docTemplate).getStructureName();
    }
    
    @Override
    public String getStructureVersion(String docTemplate) {
        loadTocStructure(docTemplate, false);
        return tocStructureMap.get(docTemplate).getStructureVersion();
    }

    @Override
    public String getStructureDescription(String docTemplate) {
        loadTocStructure(docTemplate, false);
        return tocStructureMap.get(docTemplate).getStructureDescription();
    }

    private void loadTocStructure(String docTemplate, boolean translated) {
        this.buildTocStructureMap(docTemplate, translated, templateStructureService.getStructure(docTemplate, translated));
    }

    private void loadTocStructure(String docTemplate, boolean translated, String documentLanguage) {
        this.buildTocStructureMap(docTemplate, translated, templateStructureService.getStructure(docTemplate, translated, documentLanguage));
    }

    private void buildTocStructureMap(String docTemplate, boolean translated, byte[] structureXmlFile) {
        final Structure structure = loadRulesFromFile(structureXmlFile);

        TocStructure tocStructure = new TocStructure();
        tocStructure.setStructureName(structure.getName());
        tocStructure.setStructureVersion(structure.getVersion());
        tocStructure.setStructureDescription(structure.getDescription());
        tocStructure.setNumberingConfigs(structure.getNumberingConfigs().getNumberingConfigs());
        tocStructure.setAlternateConfigs(structure.getAlternateConfigs().getAlternateConfigs());
        if (structure.getReferenceConfig() != null) {
            tocStructure.setRefConfigs(structure.getReferenceConfig().getRefConfigs());
        }

        List<TocItem> tocItems = structure.getTocItems().getTocItems();
        tocStructure.setTocItems(tocItems);
        tocStructure.setTocRules(buildProposalTocRules(structure, tocItems));
        tocStructure.setTocRulesOrders(buildProposalTocRulesOrders(structure, tocItems));
        tocStructure.setDocumentRules(buildProposalDocumentRules(structure, tocItems));

        String mapKey = translated ? docTemplate + "_translated" : docTemplate;
        tocStructureMap.put(mapKey, tocStructure); //cache it for the next call
    }
    
    private Structure loadRulesFromFile(byte[] fileBytes) {
        try {
            return XmlHelper.loadFromFile(fileBytes, Structure.class, ObjectFactory.class, structureSchema);
        } catch (Exception e) {
            LOG.debug("Error loadRulesFromFile", e);
            throw new IllegalStateException("Error loading xml configurations", e);
        }
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

    private Map<TocItem, List<List<TocItem>>> buildProposalTocRulesOrders(Structure structure, List<TocItem> tocItems) {
        Map<TocItem, List<List<TocItem>>> tocRulesOrders = new HashMap<>();
        if(structure.getTocRules() != null) {
            for (TocRules.Entry entry : structure.getTocRules().getEntries()) {
                AknTag itemName = entry.getTocItem();
                List<TocItem> foundTocItems = getTocItemsByName(tocItems, itemName.value());
                for (TocItem tocItem : foundTocItems) {
                    List<List<TocItem>> order = new ArrayList<>();
                    if (entry.getOrder() != null) {
                        for (TocIdList listToc : entry.getOrder().getLists()) {
                            List<TocItem> list = new ArrayList<>();
                            for (AknTag listTocName : listToc.getTocItems()) {
                                list.addAll(getTocItemsByName(tocItems, listTocName.value()));
                            }
                            order.add(list);
                        }
                    }
                    tocRulesOrders.put(tocItem, order);
                }
            }

        }
        return tocRulesOrders;
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
