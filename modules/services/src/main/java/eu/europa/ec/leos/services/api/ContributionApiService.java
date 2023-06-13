package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;

public interface ContributionApiService {

    CreateCollectionResult createCloneProposal(String proposalRef, String userLogin, String legDocumentName);

    Result<?> updateClonedProposalRevisionStatus(String proposalRef, String legFilename);

}
