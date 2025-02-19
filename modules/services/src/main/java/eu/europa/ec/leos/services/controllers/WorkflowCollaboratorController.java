package eu.europa.ec.leos.services.controllers;

import com.google.common.base.Strings;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.integration.ExternalSystemACLService;
import eu.europa.ec.leos.integration.dto.AccessDTO;
import eu.europa.ec.leos.model.user.Entity;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.services.collection.CollaboratorService;
import eu.europa.ec.leos.services.collection.WorkflowCollaboratorService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.dto.collaborator.CollaboratorDTO;
import eu.europa.ec.leos.services.dto.collaborator.WorkflowCollaboratorDTO;
import eu.europa.ec.leos.services.request.WorkflowCollaboratorAclRequest;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.support.url.CollectionUrlBuilder;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.services.utils.HttpUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;
import static eu.europa.ec.leos.services.utils.LogUtils.logDebug;
import static eu.europa.ec.leos.services.utils.LogUtils.logInfo;

@RestController
@RequestMapping("/secured/proposal")
@Slf4j
@RequiredArgsConstructor
public class WorkflowCollaboratorController {

    public static final String SYSTEM_CLIENT_ID_NOT_FOUND_ON_JWT_TOKEN = "systemClientId not found on jwt token";
    private final WorkflowCollaboratorService workflowCollaboratorService;
    private final ProposalService proposalService;
    private final PackageService packageService;
    private final ExternalSystemACLService externalSystemACLService;
    private final CollaboratorService collaboratorService;
    private final CollectionUrlBuilder urlBuilder;
    private final UserService userService;

    @PostMapping(value = "/{proposalRef}/workflow-collaborators")
    public ResponseEntity<Object> addWorkflowCollaboratorAcl(
            @PathVariable("proposalRef") String proposalRef,
            @RequestBody WorkflowCollaboratorAclRequest workflowCollaboratorAclRequest,
            @RequestHeader("Authorization") String authorizationHeader) {
        final String proposalReference = encodeParam(proposalRef);
        Proposal proposal = proposalService.findProposalByRef(proposalReference);
        final Optional<String> systemClientId = HttpUtils.extractSystemClientIdFromAuthorizationHeader(authorizationHeader);
        logInfo(log, "workflow-collaborators: proposalRef:%s, payload:%s, systemClientId:%s", proposalReference, workflowCollaboratorAclRequest.toString(),systemClientId.orElse("System-client-id not found"));
        if (!systemClientId.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, SYSTEM_CLIENT_ID_NOT_FOUND_ON_JWT_TOKEN);
        }
        final String clientSystemId = systemClientId.get();
        deleteWorkflowCollaborators(proposal, proposalRef, clientSystemId);
        final Integer integer = workflowCollaboratorService.setWorkflowCollaboratorAcl(proposal, clientSystemId, workflowCollaboratorAclRequest);
        final List<AccessDTO> accessControlList = externalSystemACLService.getAccessControlList(workflowCollaboratorAclRequest.getAclCallbackUrl());
        accessControlList.stream().forEach(u->
            addWorkflowCollaborator(proposal, proposalReference, clientSystemId, u)
        );
        return new ResponseEntity<>(integer, HttpStatus.OK);
    }

    private void deleteWorkflowCollaborators(Proposal proposal, String proposalRef, String systemClientId) {
        // get list
        List<CollaboratorDTO> collaborators = collaboratorService.getCollaborators(proposal);
        collaborators.stream()
                .filter(u->u.getClientSystem()!=null && u.getClientSystem().getClientId().equals(systemClientId))
                .forEach(u-> deleteWorkflowCollaborator(proposal, proposalRef, u))
        ;
    }

    private void deleteWorkflowCollaborator(Proposal proposal, String proposalRef, CollaboratorDTO collaboratorDTO) {
        proposalRef = encodeParam(proposalRef);
        final String userId = !Strings.isNullOrEmpty(collaboratorDTO.getLogin())?collaboratorDTO.getLogin():collaboratorDTO.getEntity().getName();
        final String roleName = collaboratorDTO.getRole();
        final String connectedDG = collaboratorDTO.getEntity().getOrganizationName();
        String proposalUrl = urlBuilder.buildProposalViewUrl(proposalRef);
        collaboratorService.removeCollaborator(proposal, userId, roleName, connectedDG, proposalUrl);
    }

    private void addWorkflowCollaborator(Proposal proposal, String proposalRef, String systemClientId, AccessDTO accessDTO) {
        proposalRef = encodeParam(proposalRef);
        final String userId = !Strings.isNullOrEmpty(accessDTO.getUserId())?accessDTO.getUserId():accessDTO.getEntity();
        final String roleName = accessDTO.getRole();
        String connectedDG = accessDTO.getEntity();
        AccessDTO.AclType aclType = accessDTO.getAclType();
        if (aclType == AccessDTO.AclType.ENTITY) {
            // accessDTO.userId contains the entity but the accessDTO.entity is overwritten
            // The mapping towards the entity is done from the userId
            User user = userService.getUser(userId);
            // when a user is an entity should have only one entity in user.entities
            Optional<Entity> firstEntity = user.getEntities().stream().findFirst();
            if (firstEntity.isPresent()) {
                connectedDG = firstEntity.get().getOrganizationName();
            }
        }
        String proposalUrl = urlBuilder.buildProposalViewUrl(proposalRef);
        collaboratorService.addCollaborator(proposal, userId, roleName, connectedDG, proposalUrl, systemClientId);
    }

    /**
     * returns the WorkflowCollaboratorAcl of the connected client
     */
    @GetMapping(value = "/{proposalRef}/workflow-collaborators")
    public ResponseEntity<WorkflowCollaboratorDTO> getWorkflowCollaboratorAcl(
            @PathVariable("proposalRef") String proposalRef,
            @RequestHeader("Authorization") String authorizationHeader) {
        proposalRef = encodeParam(proposalRef);
        logDebug(log, "get workflow collaborator for %s ",proposalRef);
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposalRef, Proposal.class);
        Optional<String> systemClientId = HttpUtils.extractSystemClientIdFromAuthorizationHeader(authorizationHeader);
        if (!systemClientId.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, SYSTEM_CLIENT_ID_NOT_FOUND_ON_JWT_TOKEN);
        }
        final Optional<WorkflowCollaboratorDTO> collaborators = workflowCollaboratorService.getCollaborators(leosPackage.getName(),systemClientId.get());
        return collaborators.isPresent() ? new ResponseEntity<>(collaborators.get(), HttpStatus.OK) : new ResponseEntity("workflow-collaborators not found ", HttpStatus.NOT_FOUND);
    }

    /**
     * returns all WorkflowCollaboratorAcl (of all the clients)
     */
    @GetMapping(value = "/{proposalRef}/workflow-collaborators/all")
    public ResponseEntity<List<WorkflowCollaboratorDTO>> getWorkflowCollaboratorAcls(@PathVariable("proposalRef") String proposalRef) {
        proposalRef = encodeParam(proposalRef);
        logDebug(log,"get all workflow collaborators for %s ",proposalRef);
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        final List<WorkflowCollaboratorDTO> collaborators = workflowCollaboratorService.getCollaborators(proposal);
        return new ResponseEntity<>(collaborators, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{proposalRef}/workflow-collaborators")
    public ResponseEntity<Object> deleteWorkflowCollaboratorAcl(
            @PathVariable("proposalRef") String proposalRef,
            @RequestHeader("Authorization") String authorizationHeader) {
        proposalRef = encodeParam(proposalRef);
        logDebug(log, "Delete workflow collaborator %s", proposalRef);
        Optional<String> systemClientId = HttpUtils.extractSystemClientIdFromAuthorizationHeader(authorizationHeader);
        if (!systemClientId.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, SYSTEM_CLIENT_ID_NOT_FOUND_ON_JWT_TOKEN);
        }
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        workflowCollaboratorService.deleteWorkflowCollaboratorAcl(systemClientId.get(), proposal);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
