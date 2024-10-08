package eu.europa.ec.leos.services.dto.collaborator;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.math.BigInteger;

@Data
@Builder
public class WorkflowCollaboratorDTO {
    private BigInteger id;
    private String aclCallbackUrl;
    private String userCheckCallbackUrl;
    private String clientSystemId;
    private List<CollaboratorDTO> collaborators;
}
