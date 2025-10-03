package eu.europa.ec.leos.services.pagecounter;

import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.instance.Instance;
import org.springframework.stereotype.Service;

@Service
@Instance(instances = {InstanceType.OS})
public class LeosPageCounter implements PageCounter {

    public String countPages(byte[] xmlContent) {
        return null;
    }

}
