package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.services.collection.WorkflowCollaboratorService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.dto.collaborator.WorkflowCollaboratorDTO;
import eu.europa.ec.leos.services.request.WorkflowCollaboratorAclRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;

@RestController
@RequestMapping("/secured/proposal")
@Slf4j
@AllArgsConstructor
public class WorkflowCollaboratorController {

    private final WorkflowCollaboratorService workflowCollaboratorService;
    private final ProposalService proposalService;

    @PostMapping(value = "/{proposalRef}/workflow-collaborators")
    @ResponseBody
    public ResponseEntity<Object> addWorkflowCollaboratorAcl(@PathVariable("proposalRef") String proposalRef, @RequestBody WorkflowCollaboratorAclRequest workflowCollaboratorAclRequest) {
        proposalRef = encodeParam(proposalRef);
        final String info = String.format("proposalRef:%s, payload:%s", proposalRef, workflowCollaboratorAclRequest);
        log.debug(info);
        return new ResponseEntity<>(info, HttpStatus.OK);
    }

    /**
     * returns the WorkflowCollaboratorAcl of the connected client
     */
    @GetMapping(value = "/{proposalRef}/workflow-collaborators")
    @ResponseBody
    public ResponseEntity<WorkflowCollaboratorDTO> getWorkflowCollaboratorAcl(@PathVariable("proposalRef") String proposalRef) {
        proposalRef = encodeParam(proposalRef);
        logProposalInput(proposalRef);
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        String clientSystemId = "todo";
        final WorkflowCollaboratorDTO collaborators = workflowCollaboratorService.getCollaborators(proposal,clientSystemId);
        return new ResponseEntity<>(collaborators, HttpStatus.OK);
    }

    /**
     * returns all WorkflowCollaboratorAcl (of all the clients)
     */
    @GetMapping(value = "/{proposalRef}/workflow-collaborators/all")
    @ResponseBody
    public ResponseEntity<List<WorkflowCollaboratorDTO>> getWorkflowCollaboratorAcls(@PathVariable("proposalRef") String proposalRef) {
        proposalRef = encodeParam(proposalRef);
        logProposalInput(proposalRef);
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        final List<WorkflowCollaboratorDTO> collaborators = workflowCollaboratorService.getCollaborators(proposal);
        return new ResponseEntity<>(collaborators, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{proposalRef}/workflow-collaborators")
    @ResponseBody
    public ResponseEntity<Object> deleteWorkflowCollaboratorAcl(@PathVariable("proposalRef") String proposalRef) {
        proposalRef = encodeParam(proposalRef);
        final String info = logProposalInput(proposalRef);
        return new ResponseEntity<>(info, HttpStatus.OK);
    }

    private String logProposalInput(String proposalRef) {
        final String info = String.format("proposalRef:%s", proposalRef);
        if (log.isDebugEnabled()) {
            log.debug(info);
        }
        return info;
    }

}
