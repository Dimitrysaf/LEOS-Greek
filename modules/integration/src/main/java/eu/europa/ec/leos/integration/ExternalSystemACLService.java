package eu.europa.ec.leos.integration;

import eu.europa.ec.leos.integration.dto.AccessDTO;

import java.util.List;
import java.util.Optional;

public interface ExternalSystemACLService {

    List<AccessDTO> getAccessControlList(String url);

    Optional<AccessDTO> getAccess(String url, String userId);

}
