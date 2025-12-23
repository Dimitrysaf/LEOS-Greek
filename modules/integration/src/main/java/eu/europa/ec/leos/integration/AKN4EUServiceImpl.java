package eu.europa.ec.leos.integration;

import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.repository.common.LeosFile;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.model.user.User;
import org.springframework.stereotype.Service;

@Service
@Instance(InstanceType.OS)
public class AKN4EUServiceImpl implements AKN4EUService {

    @Override
    public void convert(LeosFile legFile, User user, String outputDescriptor) throws Exception {
        // do nothing
    }

    @Override
    public byte[] applyMetadata(LeosFile legFile, User user) throws Exception {
        return null;
    }

}
