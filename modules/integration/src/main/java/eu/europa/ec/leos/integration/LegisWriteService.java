package eu.europa.ec.leos.integration;

import eu.europa.ec.leos.domain.repository.common.LeosFile;

public interface LegisWriteService {
    
    byte[] convert(LeosFile legFile) throws Exception;
}
