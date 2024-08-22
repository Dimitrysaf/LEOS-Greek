package eu.europa.ec.leos.services.structure;

import eu.europa.ec.leos.vo.structure.AlternateConfig;
import eu.europa.ec.leos.vo.structure.DocumentRules;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.vo.structure.RefConfig;
import eu.europa.ec.leos.vo.structure.TocItem;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;
import java.util.Map;

@Component
@Scope(WebApplicationContext.SCOPE_REQUEST)
public class StructureContext {

    private static final Logger LOG = LoggerFactory.getLogger(StructureContext.class);

    private final StructureService structureService;
    private String docTemplate;

    StructureContext(StructureService structureService) {
        this.structureService = structureService;
    }

    public void useDocumentTemplate(String docTemplate) {
        LOG.trace("Using docTemplate... [docTemplate={}]", docTemplate);
        this.docTemplate = docTemplate;
    }

    public List<TocItem> getTocItems() {
        Validate.notNull(docTemplate, "Document template is required!");
        LOG.trace("Retrieving toc items configuration...");
        return structureService.getTocItems(docTemplate);
    }

    public Map<TocItem, List<TocItem>> getTocRules() {
        Validate.notNull(docTemplate, "Document template is required!");
        LOG.trace("Retrieving toc rules configuration...");
        return structureService.getTocRules(docTemplate);
    }

    public Map<String, DocumentRules.Rule> getDocumentRules() {
        Validate.notNull(docTemplate, "Document template is required!");
        LOG.trace("Retrieving document rules configuration...");
        return structureService.getDocumentRules(docTemplate);
    }

    public List<NumberingConfig> getNumberingConfigs() {
        Validate.notNull(docTemplate, "Document template is required!");
        LOG.trace("Retrieving numbering configuration...");
        return structureService.getNumberingConfigs(docTemplate);
    }
    
    public List<AlternateConfig> getAlternateConfigs() {
        Validate.notNull(docTemplate, "Document template is required!");
        LOG.trace("Retrieving alternate configuration...");
        return structureService.getAlternateConfigs(docTemplate);
    }

    public List<RefConfig> getRefConfigs() {
        Validate.notNull(docTemplate, "Document template is required!");
        LOG.trace("Retrieving reference configuration...");
        return structureService.getRefConfigs(docTemplate);
    }
}
