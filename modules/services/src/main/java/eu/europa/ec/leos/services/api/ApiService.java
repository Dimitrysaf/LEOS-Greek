package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.cmis.document.LegDocument;
import eu.europa.ec.leos.domain.cmis.document.LeosDocument;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.domain.vo.MilestonesVO;
import eu.europa.ec.leos.integration.rest.UserJSON;
import eu.europa.ec.leos.services.collection.CreateCollectionException;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.dto.request.FilterProposalsRequest;
import eu.europa.ec.leos.services.dto.request.UpdateProposalRequest;
import eu.europa.ec.leos.services.dto.response.WorkspaceProposalResponse;
import eu.europa.ec.leos.vo.catalog.CatalogItem;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface ApiService {

    <T extends LeosDocument> WorkspaceProposalResponse listDocumentsWithFilter(FilterProposalsRequest request);

    List<CatalogItem> getTemplates() throws IOException;

    CreateCollectionResult createProposal(String templateId, String templateName, String langCode, String docPurpose,
                                          boolean eeaRelevance) throws CreateCollectionException;

    CreateCollectionResult uploadProposal(File legDocument) throws CreateCollectionException;
    void deleteAnnex(String proposalRef, String annexRef) throws Exception;

    DocumentVO updateProposalMetadata(String proposalRef, UpdateProposalRequest request);

    void deleteCollection(String proposalRef);

    List<UserJSON> searchUser(String searchKey);

    void createExplanatoryDocument(String proposalRef, String template);

    String exportProposal(String proposalRef, String outputType) throws Exception;

    Optional<DocumentVO> getProposalDetails(String proposalRef);

    byte[] downloadProposal(String proposalRef) throws Exception;

    void createProposalAnnex(String proposalRef) throws Exception;

    List<MilestonesVO> getProposalMilestones(String proposalRef) throws Exception;

    void updateAnnexOrder(String proposalRef, String annexRef, String moveDirection);

    void updateAnnexTitle(String proposalRef,String annexId, String annexTitle);

    LegDocument createMilestone(String proposalRef, String milestoneComment) throws Exception;
}
