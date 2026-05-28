/*
 * Copyright 2024 European Union
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
package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.metadata.AnnexMetadata;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.CloneDocumentMetadataVO;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.annex.AnnexStructureType;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.services.document.models.AnnexType;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;

import java.util.List;
import java.util.Map;

public interface AnnexService {

    Annex createAnnex(String templateId, String path, AnnexMetadata metadata, String actionMessage, byte[] content, AnnexType annexType, byte[] binaryContent, String originalFilename);

    Annex createClonedAnnex(String templateId, String path, AnnexMetadata metadata, CloneDocumentMetadataVO cloneDocumentMetadataVO, String actionMessage, byte[] content);

    Annex createAnnexFromContent(String path, AnnexMetadata metadata, String actionMessage, byte[] content, String name);

    Annex createAnnexFromContent(String path, AnnexMetadata metadata, String actionMessage, DocumentVO annexDocument);

    Annex createClonedAnnexFromContent(String path, AnnexMetadata metadata, CloneDocumentMetadataVO cloneDocumentMetadataVO, String actionMessage, DocumentVO annexDocument);

    void deleteAnnex(Annex annex);

    Annex updateAnnex(Annex annex, AnnexMetadata metadata, VersionType versionType, String comment, boolean updateInternalRefs);

    Annex updateAnnex(Annex annex, AnnexMetadata metadata, VersionType versionType, String comment, boolean updateInternalRefs, byte[] binaryContent, String originalFilename);

    void updateAnnex(Annex annex, AnnexMetadata metadata, VersionType versionType, String comment, byte[] foreignAnnexRenditionContent, String foreignAnnexRenditionOriginalFilename);

    Annex updateAnnex(Annex annex, byte[] updatedAnnexContent, VersionType versionType, String comment);
    
    Annex updateAnnex(Annex annex, byte[] updatedAnnexContent, AnnexMetadata metadata, VersionType versionType, String comment, boolean updateInternalRefs);

    Annex updateAnnex(Annex annex, byte[] updatedAnnexContent, AnnexMetadata metadata, VersionType versionType, String comment, boolean updateInternalRefs, byte[] binaryContent, String originalFilename);

    Annex updateAnnex(Annex annex, byte[] updatedAnnexContent, String comment);

    Annex updateAnnex(String id, byte[] updatedAnnexContent, boolean updateInternalRefs, byte[] binaryContent, String originalFilename);

    /**
     * updates annex with the given content
     * @param id the ID of the annex
     * @param updatedAnnexContent new updated content of the annex
     * @param updateInternalRefs to update internal references or not
     * @param versionType new version type
     * @param comment new comment
     * @param binaryContent the binary content of the foreign annex.
     * @param originalFilename the original filename of the foreign annex.
     * @return annex object
     */
    Annex updateAnnex(String id, byte[] updatedAnnexContent, boolean updateInternalRefs, VersionType versionType, String comment, byte[] binaryContent, String originalFilename);

    Annex updateAnnex(String ref, String id, Map<String, Object> properties, boolean latest);
    
    Annex updateAnnexWithMilestoneComments(Annex annex, List<String> milestoneComments, VersionType versionType, String comment, byte[] binaryContent, String originalFilename);

    Annex updateAnnexWithMilestoneComments(String ref, String annexId, List<String> milestoneComments, byte[] binaryContent, String originalFilename);
    
    Annex findAnnex(String id, boolean latest);

    Annex findAnnexVersion(String id);

    List<Annex> findVersions(String id);

    Annex createVersion(String id, VersionType versionType, String comment);

    Annex createVersion(String id, VersionType versionType, String comment, byte[] binaryContent, String originalFilename);

    List<TableOfContentItemVO> getTableOfContent(Annex document, TocMode mode);
    
    Annex saveTableOfContent(Annex annex, List<TableOfContentItemVO> tocList, AnnexStructureType structureType, String actionMsg, User user);
    
    Annex findAnnexByRef(String ref);

    Annex getAnnexByRef(String ref);

    List<VersionVO> getAllVersions(String id, String documentId, int pageIndex, int pageSize);
    
    List<Annex> findAllMinorsForIntermediate(String docRef, String currIntVersion, int startIndex, int maxResults);
    
    int findAllMinorsCountForIntermediate(String docRef, String currIntVersion);
    
    Integer findAllMajorsCount(String docRef);
    
    List<Annex> findAllMajors(String docRef, int startIndex, int maxResults);
    
    List<Annex> findRecentMinorVersions(String documentId, String documentRef, int startIndex, int maxResults);
    
    Integer findRecentMinorVersionsCount(String documentId, String documentRef);

    List<String> getAncestorsIdsForElementId(Annex annex, List<String> elementIds);

    Annex findFirstVersion(String documentRef);

    String generateAnnexReference(byte[] content, String language);

    void updateReferencesAsync(Annex annex, Map<String, String> refsMatching, byte[] binaryContent, String originalFilename);
}
