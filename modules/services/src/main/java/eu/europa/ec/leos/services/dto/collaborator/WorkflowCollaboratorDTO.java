package eu.europa.ec.leos.services.dto.collaborator;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class WorkflowCollaboratorDTO {
    private String aclCallbackUrl;
    private String clientSystemId;
    private List<CollaboratorDTO> collaborators;
}
