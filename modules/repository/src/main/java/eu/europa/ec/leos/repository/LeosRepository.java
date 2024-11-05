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
package eu.europa.ec.leos.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import eu.europa.ec.leos.domain.repository.LeosExportStatus;
import eu.europa.ec.leos.domain.repository.LeosLegStatus;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.LinkedPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.ExportDocument;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.vo.CloneDocumentMetadataVO;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.WorkflowCollaboratorConfigVO;
import eu.europa.ec.leos.model.filter.QueryFilter;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.vo.response.FavouritePackageResponse;
import eu.europa.ec.leos.vo.response.LeosClientResponse;
import eu.europa.ec.leos.vo.response.RecentPackageResponse;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

/**
 * LEOS Repository *generic* interface.
 * <p>
 * Represents collections of *generic* document or package entities, independently of how they are stored.
 * Provides *generic* methods to persist and retrieve entity related data to and from a storage system.
 * Allows CRUD operations based on strongly typed Business Entities: [LeosDocument], [LeosMetadata] and [LeosPackage].
 */
public interface LeosRepository {

    /**
     * Creates a document from a given template and with the specified characteristics.
     *
     * @param templateId the ID of the template for the document.
     * @param path       the path where to create the document.
     * @param name       the name of the document.
     * @param metadata   the metadata of the document.
     * @param type       the type class of the document.
     * @return the created document.
     */
    <D extends LeosDocument, M extends LeosMetadata> D createDocument(String templateId, String path, String name, M metadata, Class<? extends D> type);

    /**
     * Creates a document from a given template and with the specified characteristics.
     *
     * @param templateId the ID of the template for the document.
     * @param path       the path where to create the document.
     * @param name       the name of the document.
     * @param metadata   the metadata of the document.
     * @param cloneDocumentMetadataVO clone proposal metadata vo
     * @param type       the type class of the document.
     * @return the created document.
     */
    <D extends LeosDocument, M extends LeosMetadata> D createClonedDocument(String templateId, String path, String name, M metadata, CloneDocumentMetadataVO cloneDocumentMetadataVO, Class<? extends D> type);

    /**
     * Creates a document from a given template and with the specified characteristics.
     *
     * @param path     the path where to create the document.
     * @param name     the name of the document.
     * @param metadata the metadata of the document.
     * @param type     the type class of the document.
     * @return the created document.
     */
    <D extends LeosDocument, M extends LeosMetadata> D createDocumentFromContent(String path, String name, M metadata, Class<? extends D> type, String leosCategory, byte[] contentBytes);

    /**
     * Creates a document from a given template and with the specified characteristics.
     *
     * @param path     the path where to create the document.
     * @param name     the name of the document.
     * @param metadata the metadata of the document.
     * @param cloneProposalMetadataVO clone proposal metadata vo
     * @param type     the type class of the document.
     * @return the created document.
     */
    <D extends LeosDocument, M extends LeosMetadata> D createClonedDocumentFromContent(String path, String name, M metadata,
                                                                                 CloneProposalMetadataVO cloneProposalMetadataVO,
                                                                                 Class<? extends D> type, String leosCategory,
                                                                                 byte[] contentBytes);

    /**
     * Creates a document from a given template and with the specified characteristics.
     *
     * @param path     the path where to create the document.
     * @param name     the name of the document.
     * @param metadata the metadata of the document.
     * @param cloneDocumentMetadataVO clone document metadata vo
     * @param type     the type class of the document.
     * @return the created document.
     */
    <D extends LeosDocument, M extends LeosMetadata> D createClonedDocumentFromContent(String path, String name, M metadata,
                                                                                       CloneDocumentMetadataVO cloneDocumentMetadataVO,
                                                                                       Class<? extends D> type, String leosCategory,
                                                                                       byte[] contentBytes);

    /**
     * Creates a leg document from a given content and with the specified characteristics.
     *
     * @param path              the path where to create the leg document.
     * @param name              the name of the leg document.
     * @param jobId             the ToolBox Service jobId
     * @param milestoneComments the milestone comments list
     * @param contentBytes      the leg document content
     * @param status            the leg document status
     * @return the created leg document.
     */
    LegDocument createLegDocumentFromContent(String path, String name, String jobId, List<String> milestoneComments, byte[] contentBytes, LeosLegStatus status,
                                             List<String> containedDocuments);

    /**
     * Updating Leg document status and content.
     *
     * @param id           the leg document id.
     * @param status       the updated status.
     * @param contentBytes the leg document content
     * @param versionType  the version type to be created
     * @param comment      the updated version comment
     * @return the updated Leg document
     */
    LegDocument updateLegDocument(String id, LeosLegStatus status, byte[] contentBytes, VersionType versionType, String comment);

    /**
     * Updating Leg document status.
     *
     *
     * @param ref
     * @param id     the leg document id.
     * @param status the updated status.
     * @return the updated Leg document
     */
    LegDocument updateLegDocument(String ref, String id, LeosLegStatus status);

    /**
     * Updating Leg document contained documents.
     *
     *
     * @param ref
     * @param id     the leg document id.
     * @param containedDocuments the updated contained documents.
     * @return the updated Leg document
     */
    LegDocument updateLegDocument(String ref, String id, List<String> containedDocuments);

    /**
     * Updates a document with the given metadata.
     *
     *
     * @param ref
     * @param id       the ID of the document to update.
     * @param metadata the metadata of the document.
     * @param type     the type class of the document.
     * @return the updated document.
     */
    <D extends LeosDocument, M extends LeosMetadata> D updateDocument(String ref, String id, M metadata, Class<? extends D> type);

    /**
     * Updates a document with the given content.
     *
     * @param id      the ID of the document to update.
     * @param content the content of the document.
     * @param versionType the version type to be created
     * @param comment the comment of the update, optional.
     * @param type    the type class of the document.
     * @return the updated document.
     */
    <D extends LeosDocument> D updateDocument(String id, byte[] content, VersionType versionType, String comment, Class<? extends D> type);

    <D extends LeosDocument> D updateDocument(String id, byte[] content, Map<String, Object> properties,
                                              VersionType versionType, String comment, Class<? extends D> type);

    <D extends LeosDocument> D updateMilestoneComments(String id, byte[] content, List<String> milestoneComments,
                                                       VersionType versionType, String comment, Class<? extends D> type);

    <D extends LeosDocument> D updateMilestoneComments(String ref, String id, List<String> milestoneComments, Class<? extends D> type);

    /**
     * Updates a document with the given metadata and content.
     *
     * @param id       the ID of the document to update.
     * @param metadata the metadata of the document.
     * @param content  the content of the document.
     * @param versionType  the version type to be created
     * @param comment  the comment of the update, optional.
     * @param type     the type class of the document.
     * @return the updated document.
     */
    <D extends LeosDocument, M extends LeosMetadata> D updateDocument(String id, M metadata, byte[] content, VersionType versionType, String comment, Class<? extends D> type);

    /**
     * Updates a document with the given collaborators.
     *
     *
     * @param ref
     * @param id            the ID of the document to update.
     * @param collaborators the map of users to authorities.
     * @param type          the type class of the document.
     * @return the updated document.
     */
    <D extends LeosDocument> D updateDocument(String ref, String id, List<Collaborator> collaborators, Class<? extends D> type);

    /**
     * Moves a document in another package.
     *
     * @param id     the ID of the document to retrieve.
     * @param type   the type class of the document.
     * @return the moved document.
     */
    <D extends LeosDocument> D archiveDocument(String id, Class<? extends D> type);

    /**
     * Finds a document with the specified characteristics.
     *
     * @param id     the ID of the document to retrieve.
     * @param type   the type class of the document.
     * @param latest retrieves the *latest version* of the document, when *true*.
     * @return the found document.
     */
    <D extends LeosDocument> D findDocumentById(String id, Class<? extends D> type, boolean latest);

    /**
     * Finds a document with the specified characteristics.
     *
     * @param path the path where to find the document.
     * @param name the name of the document to retrieve.
     * @param type the type class of the document.
     * @return the found document.
     */
    <D extends LeosDocument> D findDocumentByParentPath(String path, String name, Class<? extends D> type);

    /**
     * Finds documents with the specified characteristics.
     *
     * @param path the path where to find the document.
     * @param type the type class of the document.
     * @return the list of found documents or empty.
     */
    <D extends LeosDocument> List<D> findDocumentsByParentPath(String path, Class<? extends D> type, boolean descendants, boolean fetchContent);

    /**
     * Finds all versions of a document with the specified characteristics.
     *
     * @param id   the ID of the document to retrieve.
     * @param type the type class of the document.
     * @return the list of found document versions or empty.
     */
    <D extends LeosDocument> List<D> findDocumentVersionsById(String id, Class<? extends D> type, boolean fetchContent);

    /**
     * Deletes a document with the specified characteristics.
     *
     * @param id the ID of the document to delete.
     */
    void deleteDocumentById(String id);

    /**
     * Creates a [LeosPackage] with the specified characteristics.
     *
     * @param path the path where to create the package.
     * @param name the name of the package.
     * @param originRef
     * @param language
     * @param isTranslated
     * @return the created package.
     */
    LeosPackage createPackage(String path, String name, String originRef, String language, Boolean isTranslated);

    /**
     * Deletes a [LeosPackage] with the specified characteristics.
     *
     * @param path the path of the package to be deleted.
     */
    void deletePackage(String path);

    /**
     * Finds a [LeosPackage] with the specified characteristics.
     *
     * @param documentId the ID of a document inside the package.
     * @return the found package.
     */
    LeosPackage findPackageByDocumentId(String documentId);

    /**
     * Finds a [LeosPackage] with the specified characteristics.
     *
     * @param packageId the ID of the package.
     * @return the found package.
     */
    LeosPackage findPackageByPackageId(String packageId);

    /**
     * Finds a [LeosPackage] with the specified characteristics.
     *
     * @param documentRef the doc ref of a document inside the package.
     * @param type the type class of the document.
     * @return the found package.
     */
    <D extends LeosDocument> LeosPackage findPackageByDocumentRef(String documentRef, Class<? extends D> type);

    /**
     * Finds leg documents with the specified characteristics.
     *
     * @param id   the path where to find the document.
     * @param type the type class of the document.
     * @return the list of found documents or empty.
     */
    <D extends LeosDocument> List<D> findDocumentsByPackageId(String id, Class<? extends D> type, boolean allVersion, boolean fetchContent);

    /**
     * Finds leg documents with the specified status.
     *
     * @param status the status of the document.
     * @param type   the type class of the document.
     * @return the list of found documents or empty.
     */
    <D extends LeosDocument> List<D> findDocumentsByStatus(LeosLegStatus status, Class<? extends D> type);

    /**
     * Finds a document with the specified characteristics.
     *
     * @param userId the ID of the User.
     * @param type   the type class of the document.
     * @return the found document.
     */
    <D extends LeosDocument> List<D> findDocumentsByUserId(String userId, Class<? extends D> type, String leosAuthority);

    <D extends LeosDocument> Stream<D> findPagedDocumentsByParentPath(String path, Class<? extends D> type, boolean descendants, boolean fetchContent,
                                                                      int startIndex, int maxResults, QueryFilter workspaceFilter);

    <D extends LeosDocument> int findDocumentCountByParentPath(String path, Class<? extends D> type, boolean descendants, QueryFilter workspaceFilter);

    /**
     * Finds a document with the specified metadata reference.
     *
     * @param ref the metadata reference of the document.
     * @param type the type class of the document.
     * @return the found document.
     */
    <D extends LeosDocument> D findDocumentByRef(String ref, Class<? extends D> type);

    Map<String, Object> findDocumentMetadataByRef(String ref, Class type);

    <D extends LeosDocument> List<D> findAllMinorsForIntermediate(Class<? extends D> type, String docRef, String currIntVersion, int startIndex, int maxResults);
    
    <D extends LeosDocument> int findAllMinorsCountForIntermediate(Class<? extends D> type, String docRef, String currIntVersion);

    <D extends LeosDocument> Integer findAllMajorsCount(Class<? extends D> type, String docRef);

    <D extends LeosDocument> List<D> findAllMajors(Class<? extends D> type, String docRef, int startIndex, int maxResult);
    
    <D extends LeosDocument> D findLatestMajorVersionById(Class<? extends D> type, String documentId, String documentRef);

    <D extends LeosDocument> List<D> findRecentMinorVersions(Class<? extends D> type, String documentRef, String versionLabel, int startIndex, int maxResults);

    <D extends LeosDocument> Integer findRecentMinorVersionsCount(Class<? extends D> type, String documentRef, String versionLabel);

    <D extends LeosDocument> D findFirstVersion(Class<? extends D> type, String documentRef);

    <D extends LeosDocument> D findDocumentByVersion(Class<? extends D> type, String documentRef, String versionLabel);

    ExportDocument createExportDocumentFromContent(String path, String name, List<String> comments, byte[] contentBytes, LeosExportStatus status);

    ExportDocument updateExportDocument(String id, LeosExportStatus status, byte[] contentBytes, VersionType versionType, String comment);

    ExportDocument updateExportDocument(String ref, String id, LeosExportStatus status);

    ExportDocument updateExportDocument(String ref, String id, List<String> comments);

    <D extends LeosDocument> D updateDocument(String ref, String id, Map<String, Object> properties, Class<? extends D> type, boolean latest);

    Object createFolder(String path, String name);

    Object findFolderByPath(String path);

    List<eu.europa.ec.leos.domain.repository.LinkedPackage> findLinkedPackageByPkgId(String pkgId);

    LinkedPackage findLinkedPackageByLinkedPkgId(String linkedPkgId);

    <D extends LeosDocument> List<D> searchVersions(Class<? extends D> type, String docRef, List<String> logins, String versionType);

    List<RecentPackageResponse> findRecentPackagesForUser(String userId, String numberOfResult);

    List<FavouritePackageResponse> findFavouritePackagesForUser(String userId);

    FavouritePackageResponse getFavouritePackage(String ref, String userId);

    FavouritePackageResponse toggleFavouritePackage(String ref, String userId);

    Object configNotificationsUpload(String content) throws JsonProcessingException;

    String configNotificationsFetch();

    LeosDocument findConfigByName(String name);

    Optional<WorkflowCollaboratorConfigVO> getWorkflowCollaboratorConfig(String packageName, String clientName);

    Optional<LeosClientResponse> getLeosClient(String clientName);

    Integer createOrUpdateWorkflowCollaboratorConfig(String clientSystemId, String packageName, String aclCallbackUrl, String userCheckCallbackUrl);

    void deleteWorkflowCollaborator(BigInteger id);
}
