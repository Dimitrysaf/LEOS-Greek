package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.dto.request.ApplyContributionsRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;

import java.io.IOException;
import java.util.List;

public interface ContributionApiService {

    CreateCollectionResult createCloneProposal(String proposalRef, String userLogin, String legDocumentName);
    Result<?> updateClonedProposalRevisionStatus(String proposalRef, String legFilename);
    List<ContributionVO> listContributionsForDocument(String documentRef, Integer annexIndex);
    DocumentViewResponse compareAndShowRevision(String contextPath, String documentRef, String contributionsVersionRef, String legFileName) throws IOException;
    void declineContribution(String contributionVersionRef);
    void markContributionAsProcessed(String contributionVersionRef);
    byte[] mergeContribution(String documentRef, ApplyContributionsRequest request) throws IOException;
    void sendFeedback(String proposalRef, String documentRef, String legFileName);
    void updateFeedbackAnnotations(String cloneProposalRef, String cloneLegFileName, String contributionsVersionRef) throws IOException;
}
