package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.model.action.ContributionVO;
import io.atlassian.fugue.Pair;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@Instance(InstanceType.COUNCIL)
public class ContributionServiceMandateImpl implements ContributionService {

    @Override
    public <T extends XmlDocument> List<ContributionVO> getDocumentContributions(String documentId, Class<T> filterType) {
        return Arrays.asList();
    }

    @Override
    public Result<?> updateContributionStatusAfterContributionDone(String cloneProposalRef, String cloneLegFileId,
                                                                   CloneProposalMetadataVO cloneProposalMetadataVO) {
        return new Result<>(new Pair(null, null), null);
    }

    @Override
    public void updateContributionMergeActions(String cloneDocumentId, String legFileName, String documentName, String versionedReference, byte[] xmlContent)  throws Exception {
    }

    @Override
    public <T extends LeosDocument> T findVersionByVersionedReference(String versionedReference, Class<T> filterType) {
        return null;
    }
}
