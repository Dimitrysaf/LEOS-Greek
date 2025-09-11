package eu.europa.ec.leos.services.template;

import eu.europa.ec.leos.vo.catalog.CatalogItem;

import java.io.IOException;
import java.util.List;

public interface CustomTemplateService {

    List<CatalogItem> getCustomTemplatesCatalog() throws IOException;

    void publishTemplate(String legFileId, String templateName, List<String> dgCodes);
}
