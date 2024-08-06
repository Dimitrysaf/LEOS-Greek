package eu.europa.ec.leos.services.structure;

import eu.europa.ec.leos.vo.structure.AlternateConfig;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.vo.structure.RefConfig;
import eu.europa.ec.leos.vo.structure.TocItem;

import java.util.List;
import java.util.Map;

public interface StructureService {
    
    List<TocItem> getTocItems(String docTemplate);
    
    Map<TocItem, List<TocItem>> getTocRules(String docTemplate);

    Map<String, List<TocItem>> getDocumentRules(String docTemplate);
    
    List<NumberingConfig> getNumberingConfigs(String docTemplate);

    List<RefConfig> getRefConfigs(String docTemplate);
    
    String getStructureName(String docTemplate);
    
    String getStructureVersion(String docTemplate);

    String getStructureDescription(String docTemplate);
    
    List<AlternateConfig> getAlternateConfigs(String docTemplate);
    
}
