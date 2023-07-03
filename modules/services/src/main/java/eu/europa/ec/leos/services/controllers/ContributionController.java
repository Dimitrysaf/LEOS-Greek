package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.cmis.LeosCategoryClass;
import eu.europa.ec.leos.domain.cmis.document.LeosDocument;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.services.api.ContributionApiService;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.dto.request.ApplyContributionsRequest;
import eu.europa.ec.leos.services.dto.request.CloneProposalRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.response.DeclineContributionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(path = "/secured/contribution")
public class ContributionController {

    private static final Logger LOG = LoggerFactory.getLogger(ContributionController.class);

    @Autowired
    ContributionApiService contributionApiService;

    @PostMapping(value = "/create-clone-proposal/{proposalRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> createCloneProposal(@PathVariable("proposalRef") String proposalRef, @RequestBody CloneProposalRequest cloneRequest) {
        try {
            CreateCollectionResult response = contributionApiService.createCloneProposal(proposalRef, cloneRequest.getUserLogin(), cloneRequest.getLegDocumentName());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while requesting for clone proposal", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/revision-done/{proposalRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> updateClonedProposalRevisionStatus(@PathVariable("proposalRef") String proposalRef, @RequestBody String legFilename) {
        Result result = contributionApiService.updateClonedProposalRevisionStatus(proposalRef, legFilename);
        if (result.isOk()) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        LOG.error("Error occurred while requesting for clone proposal");
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping(value = "/list-contributions/{documentRef}/{documentType}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> listContributionsForDocument(@PathVariable("documentRef") String documentRef, @PathVariable("documentType") String documentType,
                                                               @RequestParam Integer annexIndex) {
        final LeosCategoryClass documentCategory = LeosCategoryClass.caseInsensitiveValueOf(documentType);
        List<ContributionVO> contributions = contributionApiService.listContributionsForDocument(documentRef, annexIndex, documentCategory);
        return new ResponseEntity<>(contributions, HttpStatus.OK);
    }

    @PostMapping(value = "/decline-contributions/{documentVersionedRef}/{documentType}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<DeclineContributionResponse> declineContribution(@PathVariable("documentVersionedRef") String documentVersionedRef,
                                                                           @PathVariable("documentType") String documentType,
                                                                           @RequestParam String versionLabel) {
        this.contributionApiService.declineRevision(documentType, documentVersionedRef, versionLabel);
        return ResponseEntity.ok(new DeclineContributionResponse(ContributionVO.ContributionStatus.CONTRIBUTION_DONE.getValue()));
    }

    @PostMapping(value = "/merge-contributions/{documentRef}/{documentType}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<byte[]> mergeContribution(@PathVariable("documentRef") String documentRef,
                                                    @PathVariable("documentType") String documentType,
                                                    @RequestBody ApplyContributionsRequest applyContributionsRequest) throws IOException {
        byte[] mergedContent = this.contributionApiService.mergeContribution(documentType, documentRef, applyContributionsRequest);
        return ResponseEntity.ok(mergedContent);
    }
}
