package eu.europa.ec.leos.services.store;

import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.vo.DocumentVO;

public interface ArchiveService {

    <D extends LeosDocument> void archiveDocument(DocumentVO documentVO, Class<? extends D> type, String packagePath);
}
