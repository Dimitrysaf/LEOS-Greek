package eu.europa.ec.leos.services.document;

import com.google.common.base.Strings;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.support.url.CollectionIdsAndUrlsHolder;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

public abstract class PostProcessingDocumentService {

    private static final Logger LOG = LoggerFactory.getLogger(PostProcessingDocumentService.class);
    protected final XmlContentProcessor xmlContentProcessor;
    protected final XPathCatalog xPathCatalog;

    @Autowired
    protected PostProcessingDocumentService(XmlContentProcessor xmlContentProcessor, XPathCatalog xPathCatalog) {
        this.xmlContentProcessor = xmlContentProcessor;
        this.xPathCatalog = xPathCatalog;
    }

    public abstract Result<?> processDocument(DocumentVO documentVO);
    public abstract Result<?> saveOriginalProposalIdToClonedProposal(DocumentVO documentVO, String legFileName, String iscRef);

    public byte[] preserveDocumentReference(byte[] xmlContent) {
        byte[] updatedDocContent = xmlContentProcessor.removeElement(xmlContent, xPathCatalog.getXPathRefOrigin(), true);
        String documentReference = Strings.nullToEmpty(xmlContentProcessor.getElementValue(updatedDocContent, xPathCatalog.getXPathRef(), true));
        updatedDocContent = xmlContentProcessor.replaceElement(updatedDocContent, xPathCatalog.getXPathRef(), true, "<leos:ref></leos:ref>");
        updatedDocContent = xmlContentProcessor.replaceElement(updatedDocContent, xPathCatalog.getXPathRef(), true, "<leos:refOrigin>" + documentReference + "</leos:refOrigin>");
        updatedDocContent = xmlContentProcessor.removeDuplicateIds(updatedDocContent,true);
        LOG.info("Moved value '{}' of the filed <leos:ref> to <leos:refOrigin>", documentReference);
        return updatedDocContent;
    }

    private String getNewClonedRef(String clonedDocumentId, CloneProposalMetadataVO cloneProposalMetadataVO, String legFileName, String docVersion) {
        StringBuilder newClonedRefBuilder = new StringBuilder();
        if (StringUtils.isEmpty(docVersion)) {
            return newClonedRefBuilder.append("<leos:milestoneRef name=\"").append(legFileName).append("\">")
                    .append(addClonedProposalRef(clonedDocumentId, cloneProposalMetadataVO))
                    .append("</leos:milestoneRef>").toString();
        } else {
            return newClonedRefBuilder.append("<leos:milestoneRef docVersion=\"").append(docVersion).append("\" ").append("name=\"").append(legFileName).append("\">")
                    .append(addClonedProposalRef(clonedDocumentId, cloneProposalMetadataVO))
                    .append("</leos:milestoneRef>").toString();
        }
    }

    private String addClonedProposalRef(String clonedDocumentId, CloneProposalMetadataVO cloneProposalMetadataVO) {
        StringBuilder clonedProposalRef = new StringBuilder();
        return clonedProposalRef.append("<clonedProposalRef ref=\"").append(clonedDocumentId).append("\">")
                .append("<creationDate>").append(cloneProposalMetadataVO.getCreationDate()).append("</creationDate>")
                .append("<status>").append(cloneProposalMetadataVO.getRevisionStatus()).append("</status>")
                .append("</clonedProposalRef>").toString();
    }

    public byte[] updateRevisionStatus(byte[] xmlContent, String clonedDocumentId, String revisionStatus) {
        StringBuilder newStatusBuilder = new StringBuilder("<status>");
        newStatusBuilder.append(revisionStatus).append("</status>");
        return xmlContentProcessor.replaceElement(xmlContent,
                xPathCatalog.getXPathStatusByClonedProposalRefAttr(clonedDocumentId),true,
                newStatusBuilder.toString());
    }

    public Result<?> updateOriginalProposalAfterRevisionDone(String cloneProposalRef, String cloneLegFileId,
                                                        CloneProposalMetadataVO cloneProposalMetadataVO) {
        return null;
    }
}
