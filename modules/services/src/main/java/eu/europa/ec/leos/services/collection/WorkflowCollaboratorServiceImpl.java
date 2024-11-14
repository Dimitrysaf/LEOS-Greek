package eu.europa.ec.leos.services.collection;

import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.vo.WorkflowCollaboratorConfigVO;
import eu.europa.ec.leos.model.user.Entity;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.services.dto.collaborator.CollaboratorDTO;
import eu.europa.ec.leos.services.dto.collaborator.WorkflowCollaboratorDTO;
import eu.europa.ec.leos.services.request.WorkflowCollaboratorAclRequest;
import eu.europa.ec.leos.services.store.PackageService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class WorkflowCollaboratorServiceImpl implements WorkflowCollaboratorService{

    private final LeosRepository leosRepository;
    private final PackageService packageService;

    @Override
    public Integer setWorkflowCollaboratorAcl(Proposal proposal, String clientSystemId, WorkflowCollaboratorAclRequest wcar) {
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        return this.leosRepository.createOrUpdateWorkflowCollaboratorConfig(clientSystemId,leosPackage.getName(), wcar.getAclCallbackUrl(), wcar.getUserCheckCallbackUrl());
    }

    public void deleteWorkflowCollaboratorAcl(String clientSystemId, Proposal proposal) {
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        final Optional<WorkflowCollaboratorDTO> wc = getCollaborators(leosPackage.getName(), clientSystemId);
        if (wc.isPresent()) {
            this.leosRepository.deleteWorkflowCollaborator(wc.get().getId());
        }
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
    public Optional<WorkflowCollaboratorDTO> getCollaborators(String packageName, String clientSystemId) {
        final Optional<WorkflowCollaboratorConfigVO> workflowCollaboratorConfigOpt = this.leosRepository.getWorkflowCollaboratorConfig(packageName, clientSystemId);
        if (workflowCollaboratorConfigOpt.isPresent()) {
            final WorkflowCollaboratorConfigVO workflowCollaboratorConfig = workflowCollaboratorConfigOpt.get();
            WorkflowCollaboratorDTO wc = WorkflowCollaboratorDTO.builder()
                    .aclCallbackUrl(workflowCollaboratorConfig.getAclCallBackUrl())
                    .userCheckCallbackUrl(workflowCollaboratorConfig.getUserCheckCallbackUrl())
                    .clientSystemId(clientSystemId)
                    .collaborators(fillCollaboratorList())
                    .id(workflowCollaboratorConfig.getId())
                    .build();
            return Optional.of(wc);
        }
        return Optional.empty();
    }

}
