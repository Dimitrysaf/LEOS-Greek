package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.cmis.LeosCategoryClass;
import eu.europa.ec.leos.domain.cmis.document.LeosDocument;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;

import java.util.List;

public interface ContributionApiService {

    CreateCollectionResult createCloneProposal(String proposalRef, String userLogin, String legDocumentName);

    Result<?> updateClonedProposalRevisionStatus(String proposalRef, String legFilename);

    List<ContributionVO> listContributionsForDocument(String documentRef, Integer annexIndex, LeosCategoryClass documentType);

    LeosDocument declineRevision(String documentType, String documentRef, String versionLabel);
}
