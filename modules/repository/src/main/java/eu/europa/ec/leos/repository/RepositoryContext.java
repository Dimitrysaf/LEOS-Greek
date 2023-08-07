package eu.europa.ec.leos.repository;

import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import java.util.Map;

public interface RepositoryContext {
    Map<String, String> getVersionsWithoutVersionLabel();
    
    <D extends LeosDocument> void populateVersionsWithoutVersionLabel(Class<? extends D> type, String documentRef);
}
