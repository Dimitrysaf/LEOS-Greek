package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.integration.ExternalSystemACLService;
import eu.europa.ec.leos.integration.dto.AccessDTO;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.collection.CollaboratorService;
import eu.europa.ec.leos.services.collection.LeosClientService;
import eu.europa.ec.leos.services.collection.WorkflowCollaboratorService;
import eu.europa.ec.leos.services.document.ProposalService;

import eu.europa.ec.leos.services.dto.collaborator.WorkflowCollaboratorDTO;
import eu.europa.ec.leos.services.exception.CollaboratorException;
import eu.europa.ec.leos.services.request.WorkflowCollaboratorAclRequest;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.support.url.CollectionUrlBuilder;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.services.utils.CollaboratorUtils;
import eu.europa.ec.leos.services.utils.HttpUtils;
import eu.europa.ec.leos.vo.response.LeosClientResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;
import static eu.europa.ec.leos.services.utils.LogUtils.logDebug;
import static eu.europa.ec.leos.services.utils.LogUtils.logInfo;

@RestController
@RequestMapping("/secured/proposal")
@Slf4j
@RequiredArgsConstructor
public class WorkflowCollaboratorController implements WorkflowCollaboratorApi {

    public static final String SYSTEM_CLIENT_ID_NOT_FOUND_ON_JWT_TOKEN = "systemClientId not found on jwt token";

    private final WorkflowCollaboratorService workflowCollaboratorService;
    private final ProposalService proposalService;
    private final PackageService packageService;
    private final ExternalSystemACLService externalSystemACLService;
    private final CollaboratorService collaboratorService;
    private final LeosClientService leosClientService;
    private final CollectionUrlBuilder urlBuilder;
    private final UserService userService;
    private final SecurityContext securityContext;

    @Override
    public ResponseEntity<Object> addWorkflowCollaboratorAcl(String proposalRef,
                                                             WorkflowCollaboratorAclRequest workflowCollaboratorAclRequest,
                                                             String authorizationHeader) {
        Optional<LeosClientResponse> leosClientResponse = getLeosClientResponse(authorizationHeader, securityContext);
        LeosClientResponse leosClient = leosClientResponse.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, SYSTEM_CLIENT_ID_NOT_FOUND_ON_JWT_TOKEN));
        final String clientSystemId = leosClient.getName();
        final String proposalReference = encodeParam(proposalRef);
        Proposal proposal = proposalService.getProposalByRef(proposalReference);
        final String proposalUrl = urlBuilder.buildProposalViewUrl(proposal.getDocumentRef());
        logInfo(log, "workflow-collaborators: proposalRef:%s, payload:%s, securityContext.user:%s",
                proposalReference,
                workflowCollaboratorAclRequest.toString(),
                securityContext.getUser().getLogin());

        final Integer workflowConfigId = workflowCollaboratorService.setWorkflowCollaboratorAcl(proposal, clientSystemId, workflowCollaboratorAclRequest);
        final List<AccessDTO> accessControlList = externalSystemACLService.getAccessControlList(workflowCollaboratorAclRequest.getAclCallbackUrl());
        accessControlList.stream()
                .sorted(Comparator.comparing(c -> !collaboratorService.isRoleOwner(c.getRole())))
                .forEach(c -> addWorkflowCollaborator(proposal, proposalUrl, c, clientSystemId));

        proposal.getCollaborators().stream()
                .filter(c -> CollaboratorUtils.matchLeosClientId(c, clientSystemId))
                .filter(c -> accessControlList.stream()
                        .noneMatch(acl -> c.getLogin().equalsIgnoreCase(StringUtils.defaultIfEmpty(acl.getUserId(), acl.getEntity()))))
                .forEach(c -> deleteWorkflowCollaborator(proposal, proposalUrl, c));

        return new ResponseEntity<>(workflowConfigId, HttpStatus.OK);
    }

    private Optional<LeosClientResponse> getLeosClientResponse(String authorizationHeader, SecurityContext securityContext) {
        final Optional<String> systemClientId = HttpUtils.extractSystemClientIdFromAuthorizationHeader(authorizationHeader);
        if (systemClientId.isPresent()) {
            return leosClientService.getLeosClient(systemClientId.get(), securityContext.getUser().getLogin());
        }
        return Optional.empty();
    }

    private void addWorkflowCollaborator(Proposal proposal, String proposalUrl, AccessDTO accessDTO, String clientSystemId) {
        final String userId = StringUtils.defaultIfEmpty(accessDTO.getUserId(), accessDTO.getEntity());
        final String roleName = accessDTO.getRole();
        final String connectedDG = !accessDTO.getAclType().equals(AccessDTO.AclType.ENTITY) ? accessDTO.getEntity() : null;
        try {
            getCollaborator(proposal, userId, clientSystemId).ifPresent(c -> {
                collaboratorService.removeCollaborator(proposal, userId, c.getRole(), connectedDG, proposalUrl, clientSystemId);
                proposal.getCollaborators().remove(c);
            });
            collaboratorService.addCollaborator(proposal, userId, userId, roleName, connectedDG, proposalUrl, clientSystemId);
        } catch (CollaboratorException e) {
            log.warn("Error adding workflow collaborator with userId '{}' and role '{}', skip addition!!!. Error: {}", userId, roleName, e.getMessage());
        }
    }

    private void deleteWorkflowCollaborator(Proposal proposal, String proposalUrl, Collaborator collaborator) {
        final String userId = collaborator.getLogin();
        final String roleName = collaborator.getRole();
        final String connectedDG = collaborator.getEntity();
        final String clientSystemId = collaborator.getLeosClientId();
        try {
            collaboratorService.removeCollaborator(proposal, userId, roleName, connectedDG, proposalUrl, clientSystemId);
        } catch (CollaboratorException e) {
            log.warn("Error removing workflow collaborator with userId '{}' and role '{}', skip removing!!!. Error: {}", userId, roleName, e.getMessage());
        }
    }

    private Optional<Collaborator> getCollaborator(Proposal proposal, String userId, String leosClientId) {
        return proposal.getCollaborators().stream()
                .filter(collaborator -> collaborator.getLogin().equals(userId)
                        && CollaboratorUtils.matchLeosClientId(collaborator, leosClientId))
                .findFirst();
    }

    /**
     * returns the WorkflowCollaboratorAcl of the connected client
     */
    @Override
    public ResponseEntity<WorkflowCollaboratorDTO> getWorkflowCollaboratorAcl(String proposalRef,
                                                                               String authorizationHeader) {
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
    @Override
    public ResponseEntity<List<WorkflowCollaboratorDTO>> getWorkflowCollaboratorAcls(String proposalRef) {
        proposalRef = encodeParam(proposalRef);
        logDebug(log,"get all workflow collaborators for %s ",proposalRef);
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        final List<WorkflowCollaboratorDTO> collaborators = workflowCollaboratorService.getCollaborators(proposal);
        return new ResponseEntity<>(collaborators, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Object> deleteWorkflowCollaboratorAcl(String proposalRef, String authorizationHeader) {
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
