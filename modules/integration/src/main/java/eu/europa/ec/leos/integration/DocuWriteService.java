package eu.europa.ec.leos.integration;

import eu.europa.ec.leos.domain.repository.common.LeosFile;

public interface DocuWriteService {
    
    byte[] convert(LeosFile legFile) throws Exception;
}
