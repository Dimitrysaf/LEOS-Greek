/*
 * Copyright 2025 European Union
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
import eu.europa.ec.leos.security.SecurityContext;
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
    private final SecurityContext securityContext;

    @Autowired
    public CollaboratorController(CollaboratorService collaboratorService, ProposalService proposalService, CollectionUrlBuilder urlBuilder,
                                  SecurityContext securityContext) {
        this.collaboratorService = collaboratorService;
        this.proposalService = proposalService;
        this.urlBuilder = urlBuilder;
        this.securityContext = securityContext;
    }

    @RequestMapping(value = "/{proposalRef}/collaborators", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> getAllCollaboratorFromProposal(@PathVariable("proposalRef") String proposalRef) {
        try {
            proposalRef = encodeParam(proposalRef);
            Proposal proposal = proposalService.findProposalByRef(proposalRef);
            List<CollaboratorDTO> collaborators = collaboratorService.getCollaborators(proposal);
            return new ResponseEntity<>(collaborators, HttpStatus.OK);
        } catch (CollaboratorException e) {
            LOG.error("Error occurred while getting collaborators for Proposal '" + proposalRef + "'");
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            LOG.error("General error occurred while getting collaborators for Proposal '" + proposalRef + "'", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{proposalRef}/collaborators", method = RequestMethod.POST)
    public ResponseEntity<Object> addCollaboratorToProposal(@PathVariable("proposalRef") String proposalRef, @RequestBody CollaboratorRequest collaboratorRequest) {
        try {
            proposalRef = encodeParam(proposalRef);
            Proposal proposal = proposalService.findProposalByRef(proposalRef);
            String proposalUrl = urlBuilder.buildProposalViewUrl(proposalRef);
            String userId = securityContext.getUser().getLogin();
            collaboratorService.addCollaborator(proposal, userId, collaboratorRequest.getUserId(), collaboratorRequest.getRoleName(),
                    collaboratorRequest.getConnectedDG(), proposalUrl, collaboratorRequest.getLeosClientId());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (CollaboratorException | SendNotificationException e) {
            LOG.error("Error occurred while adding collaborator '" + collaboratorRequest + TO_PROPOSAL + proposalRef + "'");
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            LOG.error("General error occurred while adding collaborator '" + proposalRef + "'", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{proposalRef}/bulkCollaborators", method = RequestMethod.POST)
    public ResponseEntity<Object> addBulkCollaboratorsToProposal(@PathVariable("proposalRef") String proposalRef, @RequestBody CollaboratorsRequest collaboratorsRequest) {
        try {
            proposalRef = encodeParam(proposalRef);
            Proposal proposal = proposalService.findProposalByRef(proposalRef);
            String proposalUrl = urlBuilder.buildProposalViewUrl(proposalRef);
            String userId = securityContext.getUser().getLogin();
            for (CollaboratorRequest collaborator : collaboratorsRequest.getCollaborators()) {
                collaboratorService.addCollaborator(proposal, userId, collaborator.getUserId(), collaborator.getRoleName(),
                        collaborator.getConnectedDG(), proposalUrl, collaborator.getLeosClientId());
            }
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (CollaboratorException | SendNotificationException e) {
            LOG.error("Error occurred while adding bulk collaborators '" + collaboratorsRequest + TO_PROPOSAL + proposalRef + "'");
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            LOG.error("General error occurred while adding bulk collaborators '" + collaboratorsRequest + TO_PROPOSAL + proposalRef + "'", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{proposalRef}/collaborators", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> editCollaboratorFromProposal(@PathVariable("proposalRef") String proposalRef, @RequestBody CollaboratorRequest collaboratorRequest) {
        try {
            proposalRef = encodeParam(proposalRef);
            Proposal proposal = proposalService.findProposalByRef(proposalRef);
            String proposalUrl = urlBuilder.buildProposalViewUrl(proposalRef);
            collaboratorService.editCollaborator(proposal, collaboratorRequest.getUserId(), collaboratorRequest.getRoleName(),
                    collaboratorRequest.getConnectedDG(), proposalUrl);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (CollaboratorException | SendNotificationException e) {
            LOG.error("Error occurred while updating collaborator '" + collaboratorRequest + TO_PROPOSAL + proposalRef + "'");
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            LOG.error("Generic error occurred while updating collaborator '" + proposalRef + "'", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{proposalRef}/bulkCollaborators", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> editBulkCollaboratorsFromProposal(@PathVariable("proposalRef") String proposalRef, @RequestBody CollaboratorsRequest collaboratorsRequest) {
        try {
            proposalRef = encodeParam(proposalRef);
            Proposal proposal = proposalService.findProposalByRef(proposalRef);
            String proposalUrl = urlBuilder.buildProposalViewUrl(proposalRef);
            for (CollaboratorRequest collaborators : collaboratorsRequest.getCollaborators()) {
                collaboratorService.editCollaborator(proposal, collaborators.getUserId(), collaborators.getRoleName(), collaborators.getConnectedDG(), proposalUrl);
            }
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (CollaboratorException | SendNotificationException e) {
            LOG.error("Error occurred while updating bulk collaborators '" + collaboratorsRequest + TO_PROPOSAL + proposalRef + "'");
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            LOG.error("General error occurred while updating bulk collaborators '" + collaboratorsRequest + TO_PROPOSAL + proposalRef + "'", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{proposalRef}/collaborators", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> removeCollaboratorFromProposal(@PathVariable("proposalRef") String proposalRef, @RequestBody CollaboratorRequest collaboratorRequest) {
        try {
            proposalRef = encodeParam(proposalRef);
            Proposal proposal = proposalService.findProposalByRef(proposalRef);
            String proposalUrl = urlBuilder.buildProposalViewUrl(proposalRef);
            collaboratorService.removeCollaborator(proposal, collaboratorRequest.getUserId(), collaboratorRequest.getRoleName(),
                    collaboratorRequest.getConnectedDG(), proposalUrl, collaboratorRequest.getLeosClientId());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (CollaboratorException | SendNotificationException e) {
            LOG.error("Error occurred while removing collaborator '" + collaboratorRequest + FROM_PROPOSAL + proposalRef + "'");
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            LOG.error("General Error occurred while removing collaborator '" + collaboratorRequest + FROM_PROPOSAL + proposalRef + "'", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{proposalRef}/bulkCollaborators", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> removeBulkCollaboratorsFromProposal(@PathVariable("proposalRef") String proposalRef, @RequestBody CollaboratorsRequest collaboratorsRequest) {
        try {
            proposalRef = encodeParam(proposalRef);
            Proposal proposal = proposalService.findProposalByRef(proposalRef);
            String proposalUrl = urlBuilder.buildProposalViewUrl(proposalRef);
            for (CollaboratorRequest collaborator : collaboratorsRequest.getCollaborators()) {
                collaboratorService.removeCollaborator(proposal, collaborator.getUserId(), collaborator.getRoleName(),
                        collaborator.getConnectedDG(), proposalUrl, collaborator.getLeosClientId());
            }
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (CollaboratorException | SendNotificationException e) {
            LOG.error("Error occurred while removing bulk collaborators '" + collaboratorsRequest + FROM_PROPOSAL + proposalRef + "'");
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            LOG.error("General error occurred while removing bulk collaborators '" + collaboratorsRequest + FROM_PROPOSAL + proposalRef + "'", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
