package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.repository.document.LeosDocument;
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
    DocumentViewResponse compareAndShowRevision(String contextPath, String documentType, String documentRef, String versionLabel);
    LeosDocument declineRevision(String documentType, String documentVersionedRef, String versionLabel);
    void markRevisionAsProcessed(String docVersionRef);
    byte[] mergeContribution(String documentRef, ApplyContributionsRequest request) throws IOException;
}
