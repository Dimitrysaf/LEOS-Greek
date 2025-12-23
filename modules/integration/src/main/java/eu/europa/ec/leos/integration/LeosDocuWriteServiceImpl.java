package eu.europa.ec.leos.integration;

import eu.europa.ec.leos.domain.repository.common.LeosFile;
import org.springframework.stereotype.Service;

@Service
public class LeosDocuWriteServiceImpl implements DocuWriteService {
    @Override
    public byte[] convert(LeosFile legFile) throws Exception {
        throw new IllegalStateException("Feature not implemented for the running instance");
    }
}
