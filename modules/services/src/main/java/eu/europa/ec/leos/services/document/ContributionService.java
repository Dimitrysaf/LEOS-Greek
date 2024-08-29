package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.model.action.ContributionVO;

import java.io.IOException;
import java.util.List;

public interface ContributionService {

    <T extends XmlDocument> List<ContributionVO> getDocumentContributions(String documentId, int annexIndex, Class<T> filterType);

    Result<?> updateContributionStatusAfterContributionDone(String cloneProposalRef, String cloneLegFileId,
                                                            CloneProposalMetadataVO cloneProposalMetadataVO);

    void updateContributionMergeActions(String cloneDocumentId, String legFileName, String documentName, String versionedReference,
                                        byte[] xmlContent) throws Exception;

    <T extends LeosDocument> T findVersionByVersionedReference(String versionedReference, Class<T> filterType);
}
