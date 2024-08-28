package eu.europa.ec.leos.services.collection;

import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.model.user.Entity;
import eu.europa.ec.leos.services.dto.collaborator.CollaboratorDTO;
import eu.europa.ec.leos.services.dto.collaborator.WorkflowCollaboratorDTO;
import eu.europa.ec.leos.services.request.WorkflowCollaboratorAclRequest;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class WorkflowCollaboratorServiceImpl implements WorkflowCollaboratorService{
    @Override
    public String setWorkflowCollaboratorAcl(String clientSystemId, Proposal proposal, WorkflowCollaboratorAclRequest wcar) {
        return null;
    }

    @Override
    public String removeWorkflowCollaboratorAcl(String clientSystemId, Proposal proposal) {
        return null;
    }

    @Override
    public List<WorkflowCollaboratorDTO> getCollaborators(Proposal proposal) {
        WorkflowCollaboratorDTO wc = WorkflowCollaboratorDTO.builder()
                .aclCallbackUrl("http://callbackURL")
                .collaborators(fillCollaboratorList())
                .build();
        return Arrays.asList(wc);
    }

    private List<CollaboratorDTO> fillCollaboratorList() {
        CollaboratorDTO collaborator = new CollaboratorDTO("test", "test", "OWNER", new Entity("1","test","test"));
        return Arrays.asList(collaborator);
    }

    @Override
    public WorkflowCollaboratorDTO getCollaborators(Proposal proposal, String clientSystemId) {
        return null;
    }
}
