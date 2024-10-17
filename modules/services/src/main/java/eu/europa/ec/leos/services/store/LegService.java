package eu.europa.ec.leos.services.store;

import eu.europa.ec.leos.domain.repository.LeosLegStatus;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.vo.LegDocumentVO;
import eu.europa.ec.leos.services.exception.XmlValidationException;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.LegPackage;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface LegService {
    
    LegDocument findLastLegByVersionedReference(String path, String versionedReference) throws Exception;

    LegDocument findLastContribution(String path, String legFileName);

    LegDocument findLastContributionByVersionedReference(String path, String versionedReference) throws Exception;

    LegDocument findLastContributionByVersionedReferenceAndName(String path, String legFileName, String versionedReference) throws Exception;

    LegPackage createLegPackage(String proposalId, ExportOptions exportOptions) throws IOException;

    LegPackage createLegPackageForClone(String proposalId, ExportOptions exportOptions) throws IOException;

    LegPackage createLegPackage(File legFile, ExportOptions exportOptions) throws IOException, XmlValidationException;
    
    List<LegDocumentVO> getLegDocumentDetailsByUserId(String userId, String proposalId, String legStatus);
    
    LegDocument createLegDocument(String proposalId, String jobId, LegPackage legPackage, LeosLegStatus status) throws IOException;

    LegDocument addLegDocument(String packageName, String legFileName, List<String> milestoneComments, byte[] content, LeosLegStatus status,
            List<String> containedDocuments) throws IOException;

    LegDocument updateLegDocument(String id, byte[] content, LeosLegStatus legStatus);

    LegDocument updateLegDocument(String ref, String id, LeosLegStatus status);

    LegDocument updateLegDocument(String ref, String id, List<String> containedDocuments);
    
    LegDocument updateLegDocument(String id, byte[] pdfJobZip, byte[] wordJobZip);

    LegDocument updateLegDocumentFeedbackAnnotations(String proposalRef, String legFileName, String documentRef, String contributionsVersionRef,
                                                     String documentName,
                                                     ExportOptions exportOptions) throws Exception;
    
    LegDocument findLegDocumentById(String id);
    
    /**
     * Finds the Leg document that has jobId and is in the same package with any document that has @documentId.
     *
     * @param documentId the id of a document that is located in the same package as the Leg file
     * @param jobId      the jobId of the Leg document
     * @return the Leg document if found, otherwise null
     */
    LegDocument findLegDocumentByAnyDocumentIdAndJobId(String documentId, String jobId);
    
    List<LegDocument> findLegDocumentByStatus(LeosLegStatus leosLegStatus);
    
    List<LegDocument> findLegDocumentByProposal(String proposalId);
    
    String doubleCompareXmlContents(XmlDocument originalVersion, XmlDocument intermediateMajor, XmlDocument current, boolean isDocuwrite);
    String simpleCompareXmlContents(XmlDocument versionToCompare, XmlDocument currentXmlContent, boolean isDocuwrite);
    
    byte[] updateLegPackageContentWithComments(byte[] legPackageContent, List<String> comments) throws IOException;

    void addFilteredAnnotationsToZipContent(Map<String, Object> contentToZip, String docName, ExportOptions exportOptions);

    String storeLegDocumentTemporary(final LegDocument legDocument);

    String storeLegDocumentTemporary(final byte[] bytes);

    String getFeedbackAnnotationsFromLeg(String legFileId, String documentRef, String proposalRef) throws IOException;

    String fetchFeedbackRepliesByID(String documentRef, String proposalRef, String legFileId, String storedAnnots);

    String fetchFeedbackRepliesByName(String documentRef, String proposalRef, String legFileName, String storedAnnots);

    String removePermissionsStoredAnnotationsFromId(String storedFeedbackAnnotations, String documentRef, String legFileId);

    String removePermissionsStoredAnnotations(String storedFeedbackAnnotations, String documentRef, String legFileName);

    int countFeedbacksToBeSentOnContribution(String versionedReference, String proposalRef, String legFileName);
}
