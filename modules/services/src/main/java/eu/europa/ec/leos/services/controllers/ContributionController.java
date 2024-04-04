package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.services.api.ApiService;
import eu.europa.ec.leos.services.api.ContributionApiService;
import eu.europa.ec.leos.services.collection.CollaboratorService;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.dto.request.ApplyContributionsRequest;
import eu.europa.ec.leos.services.dto.request.CloneProposalRequest;
import eu.europa.ec.leos.services.dto.request.SendFeedbackRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.MilestoneViewResponse;
import eu.europa.ec.leos.services.response.DeclineContributionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;

@RestController
@RequestMapping(path = "/secured/contribution")
public class ContributionController {

    private static final Logger LOG = LoggerFactory.getLogger(ContributionController.class);

    @Autowired
    ContributionApiService contributionApiService;
    @Autowired
    CollaboratorService collaboratorService;

    @Autowired
    ApiService apiService;

    @PostMapping(value = "/create-clone-proposal/{proposalRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> createCloneProposal(@PathVariable("proposalRef") String proposalRef, @RequestBody CloneProposalRequest cloneRequest) {
        proposalRef = encodeParam(proposalRef);
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
        proposalRef = encodeParam(proposalRef);
        Result result = contributionApiService.updateClonedProposalRevisionStatus(proposalRef, legFilename);
        if (result.isOk()) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        LOG.error("Error occurred while requesting for clone proposal");
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping(value = "/list-contributions/{documentRef}/{documentType}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> listContributionsForDocument(@PathVariable("documentRef") String documentRef,
                                                               @PathVariable("documentType") String documentType,
                                                               @RequestParam Integer annexIndex) {
        documentRef = encodeParam(documentRef);
        List<ContributionVO> contributions = this.contributionApiService.listContributionsForDocument(documentRef, annexIndex);
        return new ResponseEntity<>(contributions, HttpStatus.OK);
    }

    @GetMapping(value = "/view-merge-pane/{documentRef}/{documentType}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<DocumentViewResponse> viewMergePane(HttpServletRequest request,
                                                              @PathVariable("documentRef") String documentRef,
                                                              @PathVariable("documentType") String documentType,
                                                              @RequestParam String contributionVersionRef,
                                                              @RequestParam String legFileName) throws IOException {
        documentRef = encodeParam(documentRef);
        contributionVersionRef = encodeParam(contributionVersionRef);
        legFileName = encodeParam(legFileName);
        DocumentViewResponse mergedContent = this.contributionApiService.compareAndShowRevision(
                request.getContextPath(),
                documentRef,
                contributionVersionRef, legFileName);
        return ResponseEntity.ok(mergedContent);
    }

    @PostMapping(value = "/decline-contributions/{documentVersionedRef}/{documentType}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<DeclineContributionResponse> declineContribution(@PathVariable("documentVersionedRef") String documentVersionedRef,
                                                                           @PathVariable("documentType") String documentType) {
        documentVersionedRef = encodeParam(documentVersionedRef);
        this.contributionApiService.declineContribution(documentVersionedRef);
        return ResponseEntity.ok(new DeclineContributionResponse(ContributionVO.ContributionStatus.CONTRIBUTION_DONE.getValue()));
    }

    @PostMapping(value = "/merge-contributions/{documentRef}/{documentType}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<byte[]> mergeContribution(@PathVariable("documentRef") String documentRef,
                                                    @RequestBody ApplyContributionsRequest applyContributionsRequest) throws IOException {
        documentRef = encodeParam(documentRef);
        byte[] mergedContent = this.contributionApiService.mergeContribution(documentRef, applyContributionsRequest);
        return ResponseEntity.ok(mergedContent);
    }

    @PostMapping(value = "/mark-as-processed/{contributionVersionRef}/{documentType}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> markAsProcessed(@PathVariable("contributionVersionRef") String contributionVersionRef,
                                                  @PathVariable("documentType") String documentType) {
        contributionVersionRef = encodeParam(contributionVersionRef);
        this.contributionApiService.markContributionAsProcessed(contributionVersionRef);
        return ResponseEntity.ok().build();
    }

    @RequestMapping(value = "/milestones/{proposalRef}/viewContribution/{legFileName}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> getClonedMilestoneContribution(@PathVariable("proposalRef") String proposalRef,
                                                                 @PathVariable("legFileName") String legFileName) {
        try {
            proposalRef = encodeParam(proposalRef);
            legFileName = encodeParam(legFileName);
            MilestoneViewResponse milestoneView = apiService.listContributionsView(proposalRef, legFileName);
            return new ResponseEntity<>(milestoneView, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while getting milestone contribution views - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while milestone contribution view", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/milestones/sendFeedback", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> sendFeedback(@RequestBody SendFeedbackRequest sendFeedbackRequest) {
        try {
            contributionApiService.updateContributionAnnotations(sendFeedbackRequest.getProposalRef(), sendFeedbackRequest.getLegFileName(), sendFeedbackRequest.getContributionsVersionRef());
            collaboratorService.sendFeedback(sendFeedbackRequest.getProposalRef(), sendFeedbackRequest.getDocumentRef(), sendFeedbackRequest.getLegFileName());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            LOG.error(e.getMessage(), e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}