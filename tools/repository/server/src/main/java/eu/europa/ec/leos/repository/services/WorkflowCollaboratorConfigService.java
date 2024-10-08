package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.controllers.requests.WorkflowCollaboratorConfigRequest;
import eu.europa.ec.leos.repository.entities.WorkflowCollaboratorConfig;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface WorkflowCollaboratorConfigService {

    Optional<WorkflowCollaboratorConfig> getWorkflowCollaboratorConfig(BigDecimal id);

    Optional<WorkflowCollaboratorConfig> getWorkflowCollaboratorConfig(String packageName, String clientName);

    List<WorkflowCollaboratorConfig> getWorkflowCollaboratorConfigs(String packageName);

    Optional<WorkflowCollaboratorConfig> getWorkflowCollaboratorConfigById(BigDecimal configId);

    BigDecimal save(WorkflowCollaboratorConfig workflowCollaboratorConfig);

    BigDecimal save(WorkflowCollaboratorConfigRequest workflowCollaboratorConfigRequest);

    void delete(WorkflowCollaboratorConfig workflowCollaboratorConfig);

}
