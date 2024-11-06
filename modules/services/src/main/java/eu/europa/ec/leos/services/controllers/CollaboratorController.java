/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */

package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.services.collection.CollaboratorService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.dto.collaborator.CollaboratorDTO;
import eu.europa.ec.leos.services.exception.CollaboratorException;
import eu.europa.ec.leos.services.exception.SendNotificationException;
import eu.europa.ec.leos.services.request.CollaboratorRequest;
import eu.europa.ec.leos.services.request.CollaboratorsRequest;
import eu.europa.ec.leos.services.support.url.CollectionUrlBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;

@RestController
@RequestMapping(path = "/secured/proposal")
public class CollaboratorController {

    private static final Logger LOG = LoggerFactory.getLogger(CollaboratorController.class);
    private static final String TO_PROPOSAL = "' to proposal '";
    private static final String FROM_PROPOSAL = "' from proposal '";

    private final CollaboratorService collaboratorService;
    private final ProposalService proposalService;
    private final CollectionUrlBuilder urlBuilder;

    @Autowired
    public CollaboratorController(CollaboratorService collaboratorService, ProposalService proposalService, CollectionUrlBuilder urlBuilder) {
        this.collaboratorService = collaboratorService;
        this.proposalService = proposalService;
        this.urlBuilder = urlBuilder;
    }

    @RequestMapping(value = "/{proposalRef}/collaborators", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> getAllCollaboratorFromProposal(@PathVariable("proposalRef") String proposalRef) {
        try {
            proposalRef = encodeParam(proposalRef);
            Proposal proposal = proposalService.findProposalByRef(proposalRef);
            List<CollaboratorDTO> collaborators = collaboratorService.getCollaborators(proposal);
            return new ResponseEntity<>(collaborators, HttpStatus.OK);
        } catch (CollaboratorException e) {
            String msg = "Error occurred while getting collaborators for Proposal '" + proposalRef + "'";
            LOG.error(msg);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            String msg = "Error occurred while getting collaborators for Proposal '" + proposalRef + "'";
            LOG.error(msg, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String addCollaborator(String proposalRef, CollaboratorRequest collaboratorRequest) {
        proposalRef = encodeParam(proposalRef);
        final String userId = collaboratorRequest.getUserId();
        final String roleName = collaboratorRequest.getRoleName();
        final String connectedDG = collaboratorRequest.getConnectedDG();
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        String proposalUrl = urlBuilder.buildProposalViewUrl(proposalRef);
        return collaboratorService.addCollaborator(proposal, userId, roleName, connectedDG, proposalUrl, null);
    }

    @RequestMapping(value = "/{proposalRef}/collaborators", method = RequestMethod.POST)
    public ResponseEntity<Object> addCollaboratorToProposal(@PathVariable("proposalRef") String proposalRef, @RequestBody CollaboratorRequest collaboratorRequest) {
        try {
            proposalRef = encodeParam(proposalRef);
            addCollaborator(proposalRef, collaboratorRequest);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (CollaboratorException | SendNotificationException e) {
            String msg = "Error occurred while adding User '" + collaboratorRequest + TO_PROPOSAL + proposalRef + "'";
            LOG.error(msg);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            String msg = "User added successfully to document '" + proposalRef + "'";
            LOG.error(msg, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{proposalRef}/bulkCollaborators", method = RequestMethod.POST)
    public ResponseEntity<Object> addBulkCollaboratorsToProposal(@PathVariable("proposalRef") String proposalRef, @RequestBody CollaboratorsRequest collaboratorsRequest) {
        try {
            proposalRef = encodeParam(proposalRef);
            for (CollaboratorRequest collaborators : collaboratorsRequest.getCollaborators()) {
                addCollaborator(proposalRef, collaborators);
            }
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (CollaboratorException | SendNotificationException e) {
            String msg = "Error occurred while adding BULK Users '" + collaboratorsRequest + TO_PROPOSAL + proposalRef + "'";
            LOG.error(msg);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            String msg = "General Error occurred while adding BULK Users '" + collaboratorsRequest + TO_PROPOSAL + proposalRef + "'";
            LOG.error(msg, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String editCollaborator(String proposalRef, CollaboratorRequest collaboratorRequest) {
        proposalRef = encodeParam(proposalRef);
        final String userId = collaboratorRequest.getUserId();
        final String roleName = collaboratorRequest.getRoleName();
        final String connectedDG = collaboratorRequest.getConnectedDG();
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        String proposalUrl = urlBuilder.buildProposalViewUrl(proposalRef);
        return collaboratorService.editCollaborator(proposal, userId, roleName, connectedDG, proposalUrl);
    }

    @RequestMapping(value = "/{proposalRef}/collaborators", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> editCollaboratorFromProposal(@PathVariable("proposalRef") String proposalRef, @RequestBody CollaboratorRequest collaboratorRequest) {
        try {
            proposalRef = encodeParam(proposalRef);
            editCollaborator(proposalRef, collaboratorRequest);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (CollaboratorException | SendNotificationException e) {
            String msg = "Error occurred while updating new Roles '" + collaboratorRequest + TO_PROPOSAL + proposalRef + "'";
            LOG.error(msg);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            String msg = "Generic Error occurred while updating new Roles '" + proposalRef + "'";
            LOG.error(msg, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{proposalRef}/bulkCollaborators", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> editBulkCollaboratorsFromProposal(@PathVariable("proposalRef") String proposalRef, @RequestBody CollaboratorsRequest collaboratorsRequest) {
        try {
            proposalRef = encodeParam(proposalRef);
            for (CollaboratorRequest collaborators : collaboratorsRequest.getCollaborators()) {
                editCollaborator(proposalRef, collaborators);
            }
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (CollaboratorException | SendNotificationException e) {
            String msg = "Error occurred while updating Bulk Users '" + collaboratorsRequest + TO_PROPOSAL + proposalRef + "'";
            LOG.error(msg);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            String msg = "General Error occurred while updating Bulk Users '" + collaboratorsRequest + TO_PROPOSAL + proposalRef + "'";
            LOG.error(msg, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String removeCollaborator(String proposalRef, CollaboratorRequest collaboratorRequest) {
        final String userId = collaboratorRequest.getUserId();
        final String roleName = collaboratorRequest.getRoleName();
        final String connectedDG = collaboratorRequest.getConnectedDG();
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        String proposalUrl = urlBuilder.buildProposalViewUrl(proposalRef);
        return collaboratorService.removeCollaborator(proposal, userId, roleName, connectedDG, proposalUrl);
    }

    @RequestMapping(value = "/{proposalRef}/collaborators", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> removeCollaboratorFromProposal(@PathVariable("proposalRef") String proposalRef, @RequestBody CollaboratorRequest collaboratorRequest) {
        try {
            proposalRef = encodeParam(proposalRef);
            removeCollaborator(proposalRef, collaboratorRequest);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (CollaboratorException | SendNotificationException e) {
            String msg = "Error occurred while removing Collaborator '" + collaboratorRequest + FROM_PROPOSAL + proposalRef + "'";
            LOG.error(msg);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            String msg = "General Error occurred while removing Collaborator '" + collaboratorRequest + FROM_PROPOSAL + proposalRef + "'";
            LOG.error(msg, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{proposalRef}/bulkCollaborators", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> removeBulkCollaboratorsFromProposal(@PathVariable("proposalRef") String proposalRef, @RequestBody CollaboratorsRequest collaboratorsRequest) {
        try {
            proposalRef = encodeParam(proposalRef);
            for (CollaboratorRequest collaborator : collaboratorsRequest.getCollaborators()) {
                removeCollaborator(proposalRef, collaborator);
            }
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (CollaboratorException | SendNotificationException e) {
            String msg = "Error occurred while removing BULK Collaborators '" + collaboratorsRequest + FROM_PROPOSAL + proposalRef + "'";
            LOG.error(msg);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            String msg = "General Error occurred while removing BULK Collaborators '" + collaboratorsRequest + FROM_PROPOSAL + proposalRef + "'";
            LOG.error(msg, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
