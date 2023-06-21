package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.cmis.LeosCategoryClass;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import org.apache.chemistry.opencmis.client.api.Document;

import java.util.List;

public interface ContributionApiService {

    CreateCollectionResult createCloneProposal(String proposalRef, String userLogin, String legDocumentName);

    Result<?> updateClonedProposalRevisionStatus(String proposalRef, String legFilename);

    List<ContributionVO> listContributionsForDocument(String documentRef, Integer annexIndex, LeosCategoryClass documentType);

    Document declineRevision(String documentType, String documentRef, String versionLabel);
}
