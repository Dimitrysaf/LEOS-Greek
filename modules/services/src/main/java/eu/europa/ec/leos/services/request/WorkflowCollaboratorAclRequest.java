package eu.europa.ec.leos.services.request;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class WorkflowCollaboratorAclRequest {

    private String aclCallbackUrl;
    private List<String> entities;

}
