package eu.europa.ec.leos.integration;

import eu.europa.ec.leos.domain.repository.common.LeosFile;
import eu.europa.ec.leos.model.user.User;

import java.util.Map;

public interface AKN4EUService {

    void convert(LeosFile legFile, User user, String outputDescriptor) throws Exception;

    byte[] applyMetadata(LeosFile legFile, User user) throws Exception;

    Map<String, byte[]> getHtmlRenditions(LeosFile legFile, User user) throws Exception;
}
