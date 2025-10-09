package eu.europa.ec.leos.services.pagecounter;

import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.instance.Instance;
import org.springframework.stereotype.Service;

@Service
public class LeosPageCounter implements PageCounter {

    public int charCount(byte[] xmlContent) {
        return 0;
    }

    public String countPages(int charCount) {
        return null;
    }

}
