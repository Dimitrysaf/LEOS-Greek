package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.services.dto.request.MergeActionVO;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import io.atlassian.fugue.Pair;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@Instance(InstanceType.COUNCIL)
public class ContributionServiceMandateImpl implements ContributionService {

    private final XmlContentProcessor xmlContentProcessor;

    public ContributionServiceMandateImpl(XmlContentProcessor xmlContentProcessor) {
        this.xmlContentProcessor = xmlContentProcessor;
    }


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

    @Override
    public List<Element> extractElementsFromMergeActions(byte[] xmlContent, List<MergeActionVO> mergeActions) {
        List<Element> updatedElements = new ArrayList<>();
        for (MergeActionVO mergeAction : mergeActions) {
            String id = mergeAction.getElementId();
            Element element = xmlContentProcessor.getElementById(xmlContent, id);
            if (element != null) {
                updatedElements.add(element);
            }
        }
        return updatedElements;
    }
}
