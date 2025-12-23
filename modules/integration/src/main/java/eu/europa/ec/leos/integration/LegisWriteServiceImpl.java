package eu.europa.ec.leos.integration;

import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.repository.common.LeosFile;
import eu.europa.ec.leos.instance.Instance;
import org.springframework.stereotype.Service;

@Service
@Instance(InstanceType.OS)
public class LegisWriteServiceImpl implements LegisWriteService {

    @Override
    public byte[] convert(LeosFile legFile) throws Exception {
        return null;
    }
    
}
