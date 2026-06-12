package eu.europa.ec.leos.services.template;

public interface TemplateStructureService {
    
    byte[] getStructure(String templateId, boolean translated);

    byte[] getStructure(String templateID, boolean translated, String documentLanguage);
}
