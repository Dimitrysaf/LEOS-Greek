package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.dto.request.ApplyContributionsRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.response.MergeContributionResponse;

import java.io.IOException;
import java.util.List;

public interface ContributionApiService {

    CreateCollectionResult createCloneProposal(String proposalRef, String userLogin, String legDocumentName);

    Result<?> updateClonedProposalRevisionStatus(String proposalRef, String legFilename);

    List<ContributionVO> listContributionsForDocument(String documentRef, Integer annexIndex);

    DocumentViewResponse compareAndShowRevision(String contextPath, String documentRef, String contributionsVersionRef, String legFileName) throws IOException;

    void declineContribution(String contributionVersionRef);

    void markContributionAsProcessed(String contributionVersionRef);

    MergeContributionResponse mergeContribution(String documentRef, ApplyContributionsRequest request) throws IOException;

    void sendFeedback(String proposalRef, String documentRef, String legFileName);
    
    void updateFeedbackAnnotations(String cloneProposalRef, String cloneLegFileName, String contributionsVersionRef) throws IOException;

    int countFeedbackAnnotationsFromLeg(String legFileName, String documentRef, String proposalRef);

    void handleMilestoneAccept(String proposalRef, String legFileName, Boolean isAddedElseDeleted, String annexRef, LeosCategory category) throws IOException;

    void handleMilestoneReject(String proposalRef, String legFileName, String annexRef, boolean isAdded);
}
