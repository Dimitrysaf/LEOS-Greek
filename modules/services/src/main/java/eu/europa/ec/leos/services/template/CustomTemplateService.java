package eu.europa.ec.leos.services.template;

import java.util.List;

public interface CustomTemplateService {

    void publishTemplate(String legFileId, String templateName, List<String> dgCodes);
}
