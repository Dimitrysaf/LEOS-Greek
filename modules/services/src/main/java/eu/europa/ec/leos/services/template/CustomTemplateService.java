package eu.europa.ec.leos.services.template;

import eu.europa.ec.leos.domain.repository.LinkedPackage;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.services.api.exception.PendingTranslationException;
import eu.europa.ec.leos.services.dto.response.CustomTemplateInfoResponse;
import eu.europa.ec.leos.vo.catalog.CatalogItem;

import java.io.IOException;
import java.util.List;

public interface CustomTemplateService {

    List<CatalogItem> getCustomTemplatesCatalog(String entityName) throws IOException;

    void publishTemplate(String legFileId, String templateName, List<String> dgCodes) throws Exception;

    CustomTemplateInfoResponse getTemplateInfo(String proposalRef);

    void updateTemplate(String packageId,String templateName, List<String> dgCodes);

    Boolean unPublishTemplate(String catalogKey);

    List<String> createMilestonesForLanguagePackages(List<LinkedPackage> languagePackages) throws Exception;

    void alignDocumentsFromBaseVersion(List<? extends XmlDocument> sourceXmlDocs, List<? extends XmlDocument> targetXmlDocs, DocumentVO documentVO);

    void alignDocument(DocumentVO sourceBaseDocument, DocumentVO sourceDocument, List<XmlDocument> targetXmlDocs);
}
