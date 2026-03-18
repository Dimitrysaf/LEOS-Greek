package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.services.api.ApiService;
import eu.europa.ec.leos.services.api.ContributionApiService;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.dto.coedition.CoEditionContext;
import eu.europa.ec.leos.services.dto.request.ApplyContributionsRequest;
import eu.europa.ec.leos.services.dto.request.CloneProposalRequest;
import eu.europa.ec.leos.services.dto.request.MergeActionVO;
import eu.europa.ec.leos.services.dto.request.SendFeedbackRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.MilestoneViewResponse;
import eu.europa.ec.leos.services.response.DeclineContributionResponse;
import eu.europa.ec.leos.services.response.MergeContributionResponse;
import eu.europa.ec.leos.vo.coedition.InfoType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;

@RestController
@RequestMapping(path = "/secured/contribution")
public class ContributionController implements ContributionApi {

    private static final Logger LOG = LoggerFactory.getLogger(ContributionController.class);

    @Autowired
    ContributionApiService contributionApiService;
    @Autowired
    private CoEditionContext coEditionContext;
    @Autowired
    ApiService apiService;

    @Override
    public ResponseEntity<Object> createCloneProposal(String legFileId, CloneProposalRequest cloneRequest) {
        legFileId = encodeParam(legFileId);
        try {
            CreateCollectionResult response = contributionApiService.createCloneProposal(cloneRequest.getUserLogin(), cloneRequest.getLegDocumentName(), legFileId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while requesting for clone proposal", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> updateClonedProposalRevisionStatus(String proposalRef, String legFileId) {
        proposalRef = encodeParam(proposalRef);
        Result result = contributionApiService.updateClonedProposalRevisionStatus(proposalRef, legFileId);
        if (result.isOk()) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        LOG.error("Error occurred while requesting for clone proposal");
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @Override
    public ResponseEntity<Object> listContributionsForDocument(String documentRef, String documentType) {
        documentRef = encodeParam(documentRef);
        List<ContributionVO> contributions = this.contributionApiService.listContributionsForDocument(documentRef);
        return new ResponseEntity<>(contributions, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<DocumentViewResponse> viewMergePane(HttpServletRequest request, String documentRef,
                                                              String documentType, String contributionVersionRef,
                                                              String legFileName) throws Exception {
        documentRef = encodeParam(documentRef);
        contributionVersionRef = encodeParam(contributionVersionRef);
        legFileName = encodeParam(legFileName);
        DocumentViewResponse mergedContent = this.contributionApiService.compareAndShowRevision(
                request.getContextPath(),
                documentRef,
                contributionVersionRef, legFileName);
        return ResponseEntity.ok(mergedContent);
    }

    @Override
    public ResponseEntity<DeclineContributionResponse> declineContribution(String documentVersionedRef,
                                                                           String documentType) {
        documentVersionedRef = encodeParam(documentVersionedRef);
        this.contributionApiService.declineContribution(documentVersionedRef);
        return ResponseEntity.ok(new DeclineContributionResponse(ContributionVO.ContributionStatus.CONTRIBUTION_DONE.getValue()));
    }

    @Override
    public ResponseEntity<MergeContributionResponse> mergeContribution(String documentRef, String presenterId,
                                                                       ApplyContributionsRequest applyContributionsRequest) throws Exception {
        documentRef = encodeParam(documentRef);
        MergeContributionResponse mergeResult = this.contributionApiService.mergeContribution(documentRef, applyContributionsRequest);

        coEditionContext.setUpdatedElements(contributionApiService.extractElementsFromMergeActions(mergeResult.getMergedContent(), applyContributionsRequest.getMergeActions()));
        coEditionContext.sendUpdatedElements(documentRef, presenterId, InfoType.DOCUMENT_CONTRIBUTION_UPDATED);
        return ResponseEntity.ok(mergeResult);
    }

    @Override
    public ResponseEntity<Object> markAsProcessed(String contributionVersionRef, String documentType) {
        contributionVersionRef = encodeParam(contributionVersionRef);
        this.contributionApiService.markContributionAsProcessed(contributionVersionRef);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Object> getClonedMilestoneContribution(String proposalRef, String clonedLegFileName,
                                                                 String originalLegFileId) {
        try {
            proposalRef = encodeParam(proposalRef);
            clonedLegFileName = encodeParam(clonedLegFileName);
            originalLegFileId = encodeParam(originalLegFileId);
            MilestoneViewResponse milestoneView = apiService.listContributionsView(proposalRef, clonedLegFileName, originalLegFileId);
            return new ResponseEntity<>(milestoneView, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while getting milestone contribution views - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while milestone contribution view", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> sendFeedback(SendFeedbackRequest sendFeedbackRequest) {
        try {
            contributionApiService.updateFeedbackAnnotations(sendFeedbackRequest.getProposalRef(), sendFeedbackRequest.getLegFileName(), sendFeedbackRequest.getContributionsVersionRef());
        } catch (Exception e) {
            LOG.error(e.getMessage(), e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try {
            contributionApiService.sendFeedback(sendFeedbackRequest.getProposalRef(), sendFeedbackRequest.getDocumentRef(), sendFeedbackRequest.getLegFileName());
        } catch (Exception e) {
            LOG.error(e.getMessage(), e);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Object> countFeedbacks(String legFileName, String versionedReference, String proposalRef) {
        try {
            versionedReference = encodeParam(versionedReference);
            proposalRef = encodeParam(proposalRef);
            legFileName = encodeParam(legFileName);
            int nbFeedbacks = contributionApiService.countFeedbackAnnotationsFromLeg(legFileName, versionedReference, proposalRef);
            return ResponseEntity.ok().body(nbFeedbacks);
        } catch (Exception e) {
            LOG.error("Error occurred while counting feedbacks for - " + legFileName, e);
            return new ResponseEntity<>("Unexpected error occurred while counting feedbacks for ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> milestoneAcceptAnnex(String proposalRef, String annexRef, String legFileName,
                                                       String originalLegFileId, boolean isAdded, String docCategory) {
        try {
            LeosCategory category = docCategory != null ? LeosCategory.valueOf(docCategory) : LeosCategory.ANNEX;
            originalLegFileId = encodeParam(originalLegFileId);
            annexRef = encodeParam(annexRef);
            proposalRef = encodeParam(proposalRef);
            legFileName = encodeParam(legFileName);
            contributionApiService.handleMilestoneAccept(
                    proposalRef,
                    legFileName,
                    isAdded,
                    annexRef,
                    category);
            return ResponseEntity.ok().body(apiService.listContributionsView(proposalRef, legFileName, originalLegFileId));
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while handling annex on milestone - " + proposalRef, e);
            return new ResponseEntity<>("Unexpected error occurred while handling annex on milestone", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> milestoneRejectAnnex(String proposalRef, String docRef, String milestoneLegFileName,
                                                       boolean isAdded, String originalLegFileId) {
        try {
            originalLegFileId = encodeParam(originalLegFileId);
            docRef = encodeParam(docRef);
            proposalRef = encodeParam(proposalRef);
            milestoneLegFileName = encodeParam(milestoneLegFileName);
            contributionApiService.handleMilestoneReject(proposalRef,
                    milestoneLegFileName, originalLegFileId,
                    docRef, isAdded);
            return ResponseEntity.ok().body(apiService.listContributionsView(proposalRef, milestoneLegFileName, originalLegFileId));
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while handling annex on milestone - " + proposalRef, e);
            return new ResponseEntity<>("Unexpected error occurred while handling annex on milestone", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
