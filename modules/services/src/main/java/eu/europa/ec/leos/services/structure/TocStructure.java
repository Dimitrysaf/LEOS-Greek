package eu.europa.ec.leos.services.structure;

import eu.europa.ec.leos.vo.structure.AlternateConfig;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.vo.structure.RefConfig;
import eu.europa.ec.leos.vo.structure.TocItem;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * POJO to wrap java objects configured in TOC XML.
 */
public class TocStructure {
    
    private List<TocItem> tocItems;
    private Map<TocItem, List<TocItem>> tocRules = new HashMap<>();
    private Map<String, List<TocItem>> documentRules = new HashMap<>();
    private List<NumberingConfig> numberingConfigs;
    private List<AlternateConfig> alternateConfigs;
    private List<RefConfig> refConfigs;
    private String structureName;
    private String structureVersion;
    private String structureDescription;
    
    public List<TocItem> getTocItems() {
        return tocItems;
    }
    
    public void setTocItems(List<TocItem> tocItems) {
        this.tocItems = tocItems;
    }
    
    public Map<TocItem, List<TocItem>> getTocRules() {
        return tocRules;
    }

    public Map<String, List<TocItem>> getDocumentRules() {
        return documentRules;
    }

    public void setDocumentRules(Map<String, List<TocItem>> documentRules) {
        this.documentRules = documentRules;
    }
    
    public void setTocRules(Map<TocItem, List<TocItem>> tocRules) {
        this.tocRules = tocRules;
    }
    
    public List<NumberingConfig> getNumberingConfigs() {
        return numberingConfigs;
    }
    
    public void setNumberingConfigs(List<NumberingConfig> numberingConfigs) {
        this.numberingConfigs = numberingConfigs;
    }
    
    public List<AlternateConfig> getAlternateConfigs() {
        return alternateConfigs;
    }

    public void setAlternateConfigs(List<AlternateConfig> alternateConfigs) {
        this.alternateConfigs = alternateConfigs;
    }

    public List<RefConfig> getRefConfigs() {
        return refConfigs;
    }

    public void setRefConfigs(List<RefConfig> refConfigs) {
        this.refConfigs = refConfigs;
    }

    public String getStructureName() {
        return structureName;
    }
    
    public void setStructureName(String structureName) {
        this.structureName = structureName;
    }
    
    public String getStructureVersion() {
        return structureVersion;
    }
    
    public void setStructureVersion(String structureVersion) {
        this.structureVersion = structureVersion;
    }

    public void setStructureDescription(String structureDescription) {
        this.structureDescription = structureDescription;
    }

    public String getStructureDescription() {
        return structureDescription;
    }
}
