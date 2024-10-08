package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.controllers.requests.WorkflowCollaboratorConfigRequest;
import eu.europa.ec.leos.repository.entities.LeosClients;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.entities.WorkflowCollaboratorConfig;
import eu.europa.ec.leos.repository.repositories.LeosClientsRepository;
import eu.europa.ec.leos.repository.repositories.PackageRepository;
import eu.europa.ec.leos.repository.repositories.WorkflowCollaboratorConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static eu.europa.ec.leos.repository.utils.RestPreconditions.assertFound;

@Service
public class WorkflowCollaboratorConfigServiceImpl implements WorkflowCollaboratorConfigService {

    WorkflowCollaboratorConfigRepository workflowCollaboratorConfigRepository;
    PackageRepository packageRepository;
    LeosClientsRepository clientsRepository;

    @Autowired
    public WorkflowCollaboratorConfigServiceImpl(
            WorkflowCollaboratorConfigRepository workflowCollaboratorConfigRepository,
            PackageRepository packageRepository,
            LeosClientsRepository clientsRepository
            ) {
        this.workflowCollaboratorConfigRepository = workflowCollaboratorConfigRepository;
        this.packageRepository = packageRepository;
        this.clientsRepository = clientsRepository;
    }

    @Override
    public Optional<WorkflowCollaboratorConfig> getWorkflowCollaboratorConfigById(BigDecimal id) {
        return workflowCollaboratorConfigRepository.findById(id);
    }

    @Override
    public Optional<WorkflowCollaboratorConfig> getWorkflowCollaboratorConfig(BigDecimal id) {
        return workflowCollaboratorConfigRepository.findById(id);
    }

    @Override
    public Optional<WorkflowCollaboratorConfig> getWorkflowCollaboratorConfig(String packageName, String clientName) {
        final List<WorkflowCollaboratorConfig> list = workflowCollaboratorConfigRepository.findByPackageNameAndClientName(packageName, clientName);
        return list.stream().findFirst();
    }

    @Override
    public List<WorkflowCollaboratorConfig> getWorkflowCollaboratorConfigs(String packageName) {
        return workflowCollaboratorConfigRepository.findByPackageNameAndClientName(packageName, null);
    }
    //create or replace a workflow config
    @Override
    public BigDecimal save(WorkflowCollaboratorConfig workflowCollaboratorConfig) {
        workflowCollaboratorConfigRepository.save(workflowCollaboratorConfig);
        return workflowCollaboratorConfig.getId();
    }

    @Override
    public BigDecimal save(WorkflowCollaboratorConfigRequest workflowCollaboratorConfigRequest) {
        final WorkflowCollaboratorConfig workflowCollaboratorConfig = convert(workflowCollaboratorConfigRequest);
        return save(workflowCollaboratorConfig);
    }

    private WorkflowCollaboratorConfig convert(WorkflowCollaboratorConfigRequest wccr) {
        Optional<Package> pkg = packageRepository.findPackageByName(wccr.getPackageName());
        Package pack = assertFound(pkg,"package "+wccr.getPackageName()+" not found");
        final Optional<LeosClients> leosClient = clientsRepository.findByName(wccr.getClientName());
        LeosClients client = assertFound(leosClient,"client "+wccr.getClientName()+" not found");
        final Optional<WorkflowCollaboratorConfig> workflowCollaboratorConfig = getWorkflowCollaboratorConfig(pkg.get().getName(), wccr.getClientName());
        assertFound(leosClient,"workflow collaborator config not found for package "+wccr.getPackageName()+"  and client "+wccr.getClientName());
        if (workflowCollaboratorConfig.isPresent()) {
            final WorkflowCollaboratorConfig wcc = workflowCollaboratorConfig.get();
            wcc.setAclCallbackUrl(wccr.getAclCallbackUrl());
            wcc.setUserCheckCallbackUrl(wccr.getUserCheckCallbackUrl());
            return wcc;
        }
        return WorkflowCollaboratorConfig
                        .builder()
                        .pkg(pack)
                        .leosClients(client)
                        .aclCallbackUrl(wccr.getAclCallbackUrl())
                        .userCheckCallbackUrl(wccr.getUserCheckCallbackUrl())
                        .build();
    }

    //delete a workflow config
    @Override
    public void delete(WorkflowCollaboratorConfig workflowCollaboratorConfig) {
        workflowCollaboratorConfigRepository.delete(workflowCollaboratorConfig);
    }

    //Advanced
    //to set in controller

}
