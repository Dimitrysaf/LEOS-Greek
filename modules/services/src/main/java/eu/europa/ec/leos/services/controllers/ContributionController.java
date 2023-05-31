package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.services.api.ApiService;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.dto.request.CloneProposalRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/secured/contribution")
public class ContributionController {

    private static final Logger LOG = LoggerFactory.getLogger(ContributionController.class);

    @Autowired
    ApiService apiService;

    @PostMapping(value = "/create-clone-proposal/{proposalRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> createCloneProposal(@PathVariable("proposalRef") String proposalRef, @RequestBody CloneProposalRequest cloneRequest) {
        try {
            CreateCollectionResult response = apiService.createCloneProposal(proposalRef, cloneRequest.getUserLogin(), cloneRequest.getLegDocumentName());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while requesting for clone proposal", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
