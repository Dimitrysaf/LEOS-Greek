package eu.europa.ec.leos.services.template;

import eu.europa.ec.leos.services.dto.response.CustomTemplateInfoResponse;
import eu.europa.ec.leos.vo.catalog.CatalogItem;

import java.io.IOException;
import java.util.List;

public interface CustomTemplateService {

    List<CatalogItem> getCustomTemplatesCatalog() throws IOException;

    void publishTemplate(String legFileId, String templateName, List<String> dgCodes);

    CustomTemplateInfoResponse getTemplateInfo(String packageId);

    void updateTemplate(String packageId,String templateName, List<String> dgCodes);

    Boolean unPublishTemplate(String catalogKey);
}
