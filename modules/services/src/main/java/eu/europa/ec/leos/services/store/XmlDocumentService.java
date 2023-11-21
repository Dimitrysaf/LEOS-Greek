package eu.europa.ec.leos.services.store;

import eu.europa.ec.leos.model.messaging.UpdateInternalReferencesMessage;

public interface XmlDocumentService {
    void updateInternalReferencesAsync(UpdateInternalReferencesMessage message) throws Exception;
}
