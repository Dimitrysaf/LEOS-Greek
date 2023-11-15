package eu.europa.ec.leos.services.store;

import eu.europa.ec.leos.domain.repository.document.XmlDocument;

public interface XmlDocumentService {
    
    XmlDocument updateInternalReferences(XmlDocument xmlDocument) throws Exception;
    
}
