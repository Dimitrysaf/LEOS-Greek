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
    private String archiveFolder = "archive";

    @Autowired
    public ArchiveServiceRestImpl(LeosRepository leosRepository) {
        this.leosRepository = leosRepository;
    }

    @Override
    public <D extends LeosDocument> void archiveDocument(DocumentVO documentVO, Class<? extends D> type, String packagePath) {
        String path = packagePath + "/" + archiveFolder;
        try {
            leosRepository.findFolderByPath(path);
        } catch (Exception exception) {
            leosRepository.createFolder(packagePath, archiveFolder);
        }
        leosRepository.moveDocument(documentVO.getId(), path, type);
    }
}