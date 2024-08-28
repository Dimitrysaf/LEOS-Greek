package eu.europa.ec.leos.services.collection;

import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.services.dto.collaborator.WorkflowCollaboratorDTO;
import eu.europa.ec.leos.services.request.WorkflowCollaboratorAclRequest;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

public interface WorkflowCollaboratorService {

    @PreAuthorize("hasPermission(#proposal, 'CAN_ADD_REMOVE_COLLABORATOR')")
    String setWorkflowCollaboratorAcl(String clientSystemId, Proposal proposal, WorkflowCollaboratorAclRequest wcar);

    @PreAuthorize("hasPermission(#proposal, 'CAN_ADD_REMOVE_COLLABORATOR')")
    String removeWorkflowCollaboratorAcl(String clientSystemId, Proposal proposal);

    List<WorkflowCollaboratorDTO> getCollaborators(Proposal proposal);

    WorkflowCollaboratorDTO getCollaborators(Proposal proposal, String clientSystemId);
}
