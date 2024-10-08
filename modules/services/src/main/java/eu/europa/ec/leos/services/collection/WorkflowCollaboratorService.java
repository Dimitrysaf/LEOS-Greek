package eu.europa.ec.leos.services.collection;

import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.services.dto.collaborator.WorkflowCollaboratorDTO;
import eu.europa.ec.leos.services.request.WorkflowCollaboratorAclRequest;

import java.util.List;
import java.util.Optional;

public interface WorkflowCollaboratorService {

    //Not pre-authorize check since it is done on behave of an client system and not a user
    Integer setWorkflowCollaboratorAcl(Proposal proposal, String clientSystemId, WorkflowCollaboratorAclRequest wcar);

    void deleteWorkflowCollaborator(String clientSystemId, Proposal proposal);

    List<WorkflowCollaboratorDTO> getCollaborators(Proposal proposal);

    Optional<WorkflowCollaboratorDTO> getCollaborators(String proposalName, String clientSystemId);
}
