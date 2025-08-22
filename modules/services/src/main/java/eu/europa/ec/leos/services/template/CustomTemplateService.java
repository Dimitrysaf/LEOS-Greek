package eu.europa.ec.leos.services.template;

import java.util.List;

public interface CustomTemplateService {

    void publishTemplate(String proposalRef, String legDocumentName, String templateName, List<String> dgCodes);
}
