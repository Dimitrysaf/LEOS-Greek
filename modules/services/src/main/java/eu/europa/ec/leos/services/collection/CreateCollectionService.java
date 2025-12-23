package eu.europa.ec.leos.services.collection;

import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.services.exception.XmlValidationException;

import eu.europa.ec.leos.domain.repository.common.LeosFile;

public interface CreateCollectionService {

    /**
     * Create a collection from document vo
     *
     * @param documentVO
     * @return The collection creation result containing the proposal view url.
     */
    CreateCollectionResult createCollection(DocumentVO documentVO)throws CreateCollectionException;

    /**
     * Create a collection from a Leg document file
     *
     * @param legDocument
     * @param propDocument
     * @param language
     * @param isTranslated
     * @return The collection creation result containing the proposal view url and the bill view url
     */
    CreateCollectionResult createCollectionFromLeg(LeosFile legDocument, DocumentVO propDocument, String language, boolean isTranslated) throws CreateCollectionException;

    /**
     * Clone an existing collection from a Leg document file
     *
     * @param legDocument
     * @param originRef
     * @param connectedEntity
     * @return The collection cloned result containing the documents url and id
     */
    CreateCollectionResult cloneCollection(LeosFile legDocument, String originRef, String user, String connectedEntity) throws CreateCollectionException;

    Result<?> updateOriginalProposalAfterRevisionDone(String cloneProposalRef, String cloneLegFileId);

    DocumentVO createDocumentVOFromLegfile(LeosFile legDocument) throws XmlValidationException;

    DocumentVO getProposalDocumentFromLeg(LeosFile legDocument) throws CreateCollectionException;
}
