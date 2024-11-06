package eu.europa.ec.leos.services.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class WorkflowCollaboratorAclRequest {
    private String aclCallbackUrl;
    private String userCheckCallbackUrl;
}
