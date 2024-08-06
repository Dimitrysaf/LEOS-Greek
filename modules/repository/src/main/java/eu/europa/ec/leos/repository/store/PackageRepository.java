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
package eu.europa.ec.leos.repository.store;

import eu.europa.ec.leos.domain.repository.LeosExportStatus;
import eu.europa.ec.leos.domain.repository.LeosLegStatus;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.LinkedPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.ExportDocument;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.vo.response.FavouritePackageResponse;

import java.util.List;

/**
 * LEOS Package Repository interface.
 * <p>
 * Represents collections of *packages*, with specific methods to persist and retrieve.
 * Allows CRUD operations based on strongly typed Business Entities: [LeosPackage].
 */

public interface PackageRepository {

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
     * Finds Leg document with specified id.
     *
     * @param id     the leg document id.
     * @param latest true if the latest version is requested.
     */
    LegDocument findLegDocumentById(String id, boolean latest);

    /**
     * Updating Leg document status.
     *
     * @param ref
     * @param id     the leg document id.
     * @param status the updated status.
     */
    LegDocument updateLegDocument(String ref, String id, LeosLegStatus status);

    /**
     * Updating Leg document contained documents.
     *
     * @param ref
     * @param id     the leg document id.
     * @param containedDocuments the updated contained documents.
     */
    LegDocument updateLegDocument(String ref, String id, List<String> containedDocuments);

    /**
     * Updating Leg document status and content.
     *
     * @param id      the leg document id.
     * @param status  the updated status.
     * @param content the leg document content
     * @param versionType the version type to be created
     * @param comment the updated version comment
     */
    LegDocument updateLegDocument(String id, LeosLegStatus status, byte[] content, VersionType versionType, String comment);

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
     * Finds a [LinkedPackage] with the specified characteristics.
     *
     * @param pkgId the ID of the package.
     * @return the found package.
     */
    List<LinkedPackage> findLinkedPackageByPackageId(String pkgId);

    /**
     * Finds a [LinkedPackage] with the specified characteristics.
     *
     * @param linkedPkgId the ID of the package.
     * @return the found linked package.
     */
    LinkedPackage findLinkedPackageByLinkedPackageId(String linkedPkgId);

    /**
     * Finds a [LeosPackage] with the specified characteristics.
     *
     * @param documentRef the doc ref of a document inside the package.
     * @param type the type class of the document.
     * @return the found package.
     */
    <D extends LeosDocument> LeosPackage findPackageByDocumentRef(String documentRef, Class<? extends D> type);

    /**
     * Finds a [FavouritePackageResponse] from ref and userId.
     *
     * @param ref the doc ref of a document inside the package.
     * @param userId the userId of logged user.
     * @return the found FavouritePackageResponse.
     */
    FavouritePackageResponse getFavouritePackage(String ref, String userId);

    /**
     * Finds documents with the specified characteristics.
     *
     * @param path the path of the package where to find the documents.
     * @param type the type class of the documents.
     * @return the list of found documents or empty.
     */
    <D extends LeosDocument> List<D> findDocumentsByPackagePath(String path, Class<? extends D> type, boolean fetchContent);

    /**
     * Finds documents with the specified characteristics.
     *
     * @param path the path of the package where to find the documents
     * @param name the file name of the document to find.
     * @param type the type class of the documents.
     * @return the list of found documents or empty.
     */
    <D extends LeosDocument> D findDocumentByPackagePathAndName(String path, String name, Class<? extends D> type);

    /**
     * Finds leg most recent leg document that contains a specific version of a document.
     *
     * @param path the path of the package where to find the documents
     * @param versionedReference the document reference with the version.
     * @return A leg document that contains the reference
     */
    LegDocument findLastLegByVersionedReference(String path, String versionedReference) throws Exception;

    /**
     * Finds leg most recent leg document that contains a specific version of a document.
     *
     * @param path the path of the package where to find the documents
     * @param versionedReference the document reference with the version.
     * @return A list of leg documents that contain the reference
     */
    LegDocument findLastContributionByVersionedReference(String path, String versionedReference) throws Exception;

    /**
     * Finds leg most recent leg document that contains a specific version of a document.
     *
     * @param path the path of the package where to find the documents
     * @param legFileName the leg file name.
     * @param versionedReference the document reference with the version.
     * @return A list of leg documents that contain the reference
     */
    LegDocument findLastContributionByVersionedReferenceAndName(String path, String legFileName, String versionedReference) throws Exception;

    /**
     * Finds leg most recent contribtuion'leg document from name.
     *
     * @param path the path of the package where to find the documents
     * @param legFileName the document leg's file name.
     * @return A leg document that contains the reference
     */
    LegDocument findLastContribution(String path, String legFileName);

    /**
     * Finds documents with the specified characteristics.
     *
     * @param id   the id of the package where to find the documents.
     * @param type the type class of the documents.
     * @return the list of found documents or empty.
     */
    <D extends LeosDocument> List<D> findDocumentsByPackageId(String id, Class<? extends D> type, boolean allVersion, boolean fetchContent);

    /**
     * Finds documents with the specified characteristics.
     *
     * @param userId the userId of the user
     * @return the list of found documents or empty.
     */
    <D extends LeosDocument> List<D> findDocumentsByUserId(String userId, Class<? extends D> type, String leosAuthority);

    /**
     * Finds leg documents with the specified status.
     *
     * @param status the status of the document.
     * @param type   the type class of the document.
     * @return the list of found documents or empty.
     */
    <D extends LeosDocument> List<D> findDocumentsByStatus(LeosLegStatus status, Class<? extends D> type);

    /**
     * Creates an Export document from a given content and with the specified characteristics.
     *
     * @param path              the path where to create the export document.
     * @param name              the name of the export document.
     * @param comments          the comments of the export document.
     * @param contentBytes      the export document content.
     * @param status            the export document status.
     * @return the created export document.
     */
    ExportDocument createExportDocumentFromContent(String path, String name, List<String> comments, byte[] contentBytes, LeosExportStatus status);

    /**
     * Updating Export document status and content.
     *
     * @param id      the export document id.
     * @param status  the updated status.
     * @param contentBytes the export document content
     * @param versionType the version type to be created
     * @param comment the export version comment
     * @return the updated export document.
     */
    ExportDocument updateExportDocument(String id, LeosExportStatus status, byte[] contentBytes, VersionType versionType, String comment);

    /**
     * Updating Export document status.
     *
     * @param ref
     * @param id     the export document id.
     * @param status the updated status.
     */
    ExportDocument updateExportDocument(String ref, String id, LeosExportStatus status);

    /**
     * Updating Export document status.
     * @param ref
     * @param id     the export document id.
     * @param comments the updated comments.
     */
    ExportDocument updateExportDocument(String ref, String id, List<String> comments);

    /**
     * Deleting Export document.
     *
     * @param id     the export document id.
     */
    void deleteExportDocument(String id);

    /**
     * Finds Export document with specified id.
     *
     * @param id     the export document id.
     * @param latest true if the latest version is requested.
     * @return the requested export document.
     */
    ExportDocument findExportDocumentById(String id, boolean latest);
}
