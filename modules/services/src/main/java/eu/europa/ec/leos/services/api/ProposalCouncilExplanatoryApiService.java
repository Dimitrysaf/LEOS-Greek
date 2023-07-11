package eu.europa.ec.leos.services.api;

import com.sun.istack.NotNull;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.instance.Instance;
import org.springframework.stereotype.Service;

@Service("proposalExplanatory")
@Instance(instances = {InstanceType.COMMISSION, InstanceType.OS})
public abstract class ProposalCouncilExplanatoryApiService implements CouncilExplanatoryApiService {
    
}
