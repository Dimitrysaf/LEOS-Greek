package eu.europa.ec.leos.services.store;

import eu.europa.ec.leos.domain.common.RepositoryProfileType;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.repository.RepositoryProfile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RepositoryProfile(RepositoryProfileType.REST)
public class ArchiveServiceRestImpl implements ArchiveService {

    private final LeosRepository leosRepository;

    @Autowired
    public ArchiveServiceRestImpl(LeosRepository leosRepository) {
        this.leosRepository = leosRepository;
    }

    @Override
    public <D extends LeosDocument> void archiveDocument(DocumentVO documentVO, Class<? extends D> type, String packagePath) {
        leosRepository.archiveDocument(documentVO.getRef(), type);
    }
}