package eu.europa.ec.leos.services.template;

public interface TemplateStructureService {

    byte[] getStructure(String templateId);
    
    byte[] getStructure(String templateId, boolean translated);
}
