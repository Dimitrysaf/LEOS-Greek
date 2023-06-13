/*
 * Copyright 2023 European Commission
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */

package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.cmis.document.LegDocument;
import eu.europa.ec.leos.domain.cmis.document.LeosDocument;
import eu.europa.ec.leos.domain.cmis.metadata.ProposalMetadata;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.domain.vo.MilestonesVO;
import eu.europa.ec.leos.integration.rest.UserJSON;
import eu.europa.ec.leos.services.collection.CreateCollectionException;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.dto.request.FilterProposalsRequest;
import eu.europa.ec.leos.services.dto.request.UpdateProposalRequest;
import eu.europa.ec.leos.services.dto.response.LegFileValidation;
import eu.europa.ec.leos.services.dto.response.MilestonePDFDownloadResponse;
import eu.europa.ec.leos.services.dto.response.MilestoneViewResponse;
import eu.europa.ec.leos.services.dto.response.WorkspaceProposalResponse;
import eu.europa.ec.leos.services.export.ExportPackageVO;
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

    LegFileValidation validateLegFile(File legDocument);

    void deleteAnnex(String proposalRef, String annexRef) throws Exception;

    DocumentVO updateProposalMetadata(String proposalRef, UpdateProposalRequest request);

    void deleteCollection(String proposalRef);

    List<UserJSON> searchUser(String searchKey);

    void createExplanatoryDocument(String proposalRef, String template);

    ProposalMetadata createExplanatoryDocument(String templateId, String docPurpose, boolean eeaRelevance);

    void deleteExplanatoryDocument(String proposalRef, String template);

    List<ExportPackageVO> updateExportDocument(String proposalRef, String id, List<String> comments);

    List<ExportPackageVO> deleteExportDocument(String proposalRef, String id);

    void notifyExportPackage(String proposalRef, String exportId);

    List<ExportPackageVO> getExportDocuments(String proposalRef);

    byte[] downloadExportPackage(String proposalRef, String exportId) throws Exception;

    String exportProposal(String proposalRef, String outputType) throws Exception;

    Optional<DocumentVO> getProposalDetails(String proposalRef);

    byte[] downloadProposal(String proposalRef) throws Exception;

    void createProposalAnnex(String proposalRef) throws Exception;

    List<MilestonesVO> getProposalMilestones(String proposalRef) throws Exception;

    void updateAnnexOrder(String proposalRef, String annexRef, String moveDirection, Integer timesToMove);

    void updateAnnexTitle(String proposalRef, String annexId, String annexTitle);

    void updateExplanatoryTitle(String proposalRef, String docId, String title);

    LegDocument createMilestone(String proposalRef, String milestoneComment) throws Exception;

    MilestoneViewResponse listMilestoneDocuments(String proposalRef, String legFileName) throws IOException;

    MilestonePDFDownloadResponse downloadMilestonePDF(String proposalRef, String legFileName) throws IOException;
}
