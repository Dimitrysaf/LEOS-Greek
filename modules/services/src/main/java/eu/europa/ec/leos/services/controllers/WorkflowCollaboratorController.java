package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.services.collection.WorkflowCollaboratorService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.dto.collaborator.WorkflowCollaboratorDTO;
import eu.europa.ec.leos.services.request.WorkflowCollaboratorAclRequest;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.utils.HttpUtils;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;

@RestController
@RequestMapping("/secured/proposal")
@Slf4j
@AllArgsConstructor
public class WorkflowCollaboratorController {

    public static final String SYSTEM_CLIENT_ID_NOT_FOUND_ON_JWT_TOKEN = "systemClientId not found on jwt token";
    private final WorkflowCollaboratorService workflowCollaboratorService;
    private final ProposalService proposalService;
    private final PackageService packageService;

    @PostMapping(value = "/{proposalRef}/workflow-collaborators")
    @ResponseBody
    public ResponseEntity<Object> addWorkflowCollaboratorAcl(
            @PathVariable("proposalRef") String proposalRef,
            @RequestBody WorkflowCollaboratorAclRequest workflowCollaboratorAclRequest,
            @RequestHeader("Authorization") String authorizationHeader) {
        proposalRef = encodeParam(proposalRef);
        logDebug("proposalRef:%s, payload:%s", proposalRef, workflowCollaboratorAclRequest.toString());
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        Optional<String> systemClientId = HttpUtils.extractSystemClientIdFromAuthorizationHeader(authorizationHeader);
        if (!systemClientId.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, SYSTEM_CLIENT_ID_NOT_FOUND_ON_JWT_TOKEN);
        }
        final Integer integer = workflowCollaboratorService.setWorkflowCollaboratorAcl(proposal, systemClientId.get(), workflowCollaboratorAclRequest);
        return new ResponseEntity<>(integer, HttpStatus.OK);

    }

    /**
     * returns the WorkflowCollaboratorAcl of the connected client
     */
    @GetMapping(value = "/{proposalRef}/workflow-collaborators")
    @ResponseBody
    public ResponseEntity<WorkflowCollaboratorDTO> getWorkflowCollaboratorAcl(
            @PathVariable("proposalRef") String proposalRef,
            @RequestHeader("Authorization") String authorizationHeader) {
        proposalRef = encodeParam(proposalRef);
        logDebug("get workflow collaborator for %s ",proposalRef);
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposalRef, Proposal.class);
        Optional<String> systemClientId = HttpUtils.extractSystemClientIdFromAuthorizationHeader(authorizationHeader);
        if (!systemClientId.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "systemClientId not found on jwt token");
        }
        final Optional<WorkflowCollaboratorDTO> collaborators = workflowCollaboratorService.getCollaborators(leosPackage.getName(),systemClientId.get());
        return collaborators.isPresent() ? new ResponseEntity<>(collaborators.get(), HttpStatus.OK) : new ResponseEntity("workflow-collaborators not found ", HttpStatus.NOT_FOUND);
    }

    /**
     * returns all WorkflowCollaboratorAcl (of all the clients)
     */
    @GetMapping(value = "/{proposalRef}/workflow-collaborators/all")
    @ResponseBody
    public ResponseEntity<List<WorkflowCollaboratorDTO>> getWorkflowCollaboratorAcls(@PathVariable("proposalRef") String proposalRef) {
        proposalRef = encodeParam(proposalRef);
        logDebug("get all workflow collaborators for %s ",proposalRef);
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        final List<WorkflowCollaboratorDTO> collaborators = workflowCollaboratorService.getCollaborators(proposal);
        return new ResponseEntity<>(collaborators, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{proposalRef}/workflow-collaborators")
    @ResponseBody
    public ResponseEntity<Object> deleteWorkflowCollaboratorAcl(
            @PathVariable("proposalRef") String proposalRef,
            @RequestHeader("Authorization") String authorizationHeader) {
        proposalRef = encodeParam(proposalRef);
        logDebug("Delete workflow collaborator %s", proposalRef);
        Optional<String> systemClientId = HttpUtils.extractSystemClientIdFromAuthorizationHeader(authorizationHeader);
        if (!systemClientId.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "systemClientId not found on jwt token");
        }
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        workflowCollaboratorService.deleteWorkflowCollaborator(systemClientId.get(), proposal);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private String logDebug(String text, String ... stringArgs) {
        final String info = String.format(text, stringArgs);
        if (log.isDebugEnabled()) {
            log.debug(info);
        }
        return info;
    }

}
