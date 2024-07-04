package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.services.api.ApiService;
import eu.europa.ec.leos.services.api.ContributionApiService;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.dto.request.ApplyContributionsRequest;
import eu.europa.ec.leos.services.dto.request.CloneProposalRequest;
import eu.europa.ec.leos.services.dto.request.SendFeedbackRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.MilestoneViewResponse;
import eu.europa.ec.leos.services.response.DeclineContributionResponse;
import eu.europa.ec.leos.services.response.MergeContributionResponse;
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
    ApiService apiService;

    @PostMapping(value = "/create-clone-proposal/{legFileId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> createCloneProposal(@PathVariable("legFileId") String legFileId, @RequestBody CloneProposalRequest cloneRequest) {
        legFileId = encodeParam(legFileId);
        try {
            CreateCollectionResult response = contributionApiService.createCloneProposal(cloneRequest.getUserLogin(), cloneRequest.getLegDocumentName(), legFileId);
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
    public ResponseEntity<MergeContributionResponse> mergeContribution(@PathVariable("documentRef") String documentRef,
                                                                       @RequestBody ApplyContributionsRequest applyContributionsRequest) throws IOException {
        documentRef = encodeParam(documentRef);
        MergeContributionResponse mergeResult = this.contributionApiService.mergeContribution(documentRef, applyContributionsRequest);
        return ResponseEntity.ok(mergeResult);
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
            contributionApiService.updateFeedbackAnnotations(sendFeedbackRequest.getProposalRef(), sendFeedbackRequest.getLegFileName(), sendFeedbackRequest.getContributionsVersionRef());
            contributionApiService.sendFeedback(sendFeedbackRequest.getProposalRef(), sendFeedbackRequest.getDocumentRef(), sendFeedbackRequest.getLegFileName());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            LOG.error(e.getMessage(), e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{legFileName}/{proposalRef}/count-feedbacks/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> countFeedbacks(@PathVariable("legFileName") String legFileName,
                                                  @PathVariable("documentRef") String documentRef,
                                                  @PathVariable("proposalRef") String proposalRef) {
        try {
            documentRef = encodeParam(documentRef);
            proposalRef = encodeParam(proposalRef);
            legFileName = encodeParam(legFileName);
            int nbFeedbacks = contributionApiService.countFeedbackAnnotationsFromLeg(legFileName, documentRef, proposalRef);
            return ResponseEntity.ok().body(nbFeedbacks);
        } catch (Exception e) {
            LOG.error("Error occurred while counting feedbacks for - " + legFileName, e);
            return new ResponseEntity<>("Unexpected error occurred while counting feedbacks for ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/milestones/accept-doc/{proposalRef}/{annexRef}/{legFileName}", produces =
            MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> milestoneAcceptAnnex(@PathVariable("proposalRef") String proposalRef,
                                                       @PathVariable("annexRef") String annexRef,
                                                       @PathVariable("legFileName") String legFileName,
                                                       @RequestParam("isAdded") boolean isAdded,
                                                       @RequestParam(value = "docCategory", required = false) String docCategory) {
        try {
            LeosCategory category = docCategory != null ? LeosCategory.valueOf(docCategory) : LeosCategory.ANNEX;
            annexRef = encodeParam(annexRef);
            proposalRef = encodeParam(proposalRef);
            legFileName = encodeParam(legFileName);
            contributionApiService.handleMilestoneAccept(
                    proposalRef,
                    legFileName,
                    isAdded,
                    annexRef,
                    category);
            return ResponseEntity.ok().body(apiService.listMilestoneDocuments(proposalRef, legFileName, null));
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while handling annex on milestone - " + proposalRef, e);
            return new ResponseEntity<>("Unexpected error occurred while handling annex on milestone", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/milestones/reject-doc/{proposalRef}/{docRef}/{milestoneLegFileName}", produces =
            MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> milestoneRejectAnnex(@PathVariable("proposalRef") String proposalRef,
                                                       @PathVariable("docRef") String docRef,
                                                       @PathVariable("milestoneLegFileName") String milestoneLegFileName,
                                                       @RequestParam("isAdded") boolean isAdded,
                                                       @RequestParam(value="parentLegFileName", required = false) String parentLegFileName) {
        try {
            if (parentLegFileName != null) {
                parentLegFileName = encodeParam(parentLegFileName);
            }
            docRef = encodeParam(docRef);
            proposalRef = encodeParam(proposalRef);
            milestoneLegFileName = encodeParam(milestoneLegFileName);
            contributionApiService.handleMilestoneReject(proposalRef,
                    isAdded ? milestoneLegFileName : parentLegFileName,
                    docRef, isAdded);
            return ResponseEntity.ok().body(apiService.listMilestoneDocuments(proposalRef, milestoneLegFileName, null));
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while handling annex on milestone - " + proposalRef, e);
            return new ResponseEntity<>("Unexpected error occurred while handling annex on milestone", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}