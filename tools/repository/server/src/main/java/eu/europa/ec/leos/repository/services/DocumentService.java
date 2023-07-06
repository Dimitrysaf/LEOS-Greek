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
package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.common.VersionType;
import eu.europa.ec.leos.repository.controllers.requests.QueryFilter;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

public interface DocumentService {
    LeosDocument createDocumentFromContent(final String repositoryId, final String packageName, final String name, Map<String, ?> metadata,
                                           final String labelVersion, int versionType, byte[] contentBytes, String comments, String userId) throws RepositoryException;

    LeosDocument createDocumentFromSource(final String repositoryId, final String sourceDocumentId, final String packageName, final String name, Map<String, ?> metadata,
                                        final String labelVersion, int versionType, String comments, String userId) throws RepositoryException;

    LeosDocument updateDocument(final String ref, Map<String, ?> properties,
                            VersionType versionType, byte[] contentBytes, String comments, String userId) throws Exception;

    LeosDocument updateDocument(final String ref, Map<String, ?> properties,
                                VersionType versionType, String comments, String userId) throws Exception;

    LeosDocument moveDocument(final String ref, final String newPackageName, String userId) throws Exception;

    void deleteDocumentById(String id) throws RepositoryException;

    void deleteDocumentByRef(String ref) throws RepositoryException;

    LeosDocument findDocumentById(final String id, final boolean latest) throws RepositoryException;

    LeosDocument findLatestMajorVersionByRef(final String docRef);

    LeosDocument findFirstVersion(final String docRef);

    LeosDocument findDocumentByVersion(final String docRef, final String versionLabel);

    String getNextVersionLabel(final VersionType versionType, final String oldVersion);

    List<LeosDocument> findAllMinorsForIntermediate(final String docRef, final String currIntVersion, final int startIndex, final int maxResults);

    Integer getAllMinorsCountForIntermediate(final String docRef, final String currIntVersion);

    Integer getAllMajorsCount(final String docRef);

    List<LeosDocument> findAllMajors(final String docRef, final int startIndex, final int maxResult);

    List<LeosDocument> findRecentMinorVersions(final String docRef, String lastMajorVersion, final int startIndex, final int maxResults);

    Integer getRecentMinorVersionsCount(final String docRef, final String versionLabel);

    List<LeosDocument> findDocumentsByUserId(final String userId, final String role);

    Optional<LeosDocument> findDocumentByRef(final String ref);

    List<LeosDocument> findDocumentsByStatus(final String status);

    Optional<LeosDocument> findDocumentByName(final String fileName) throws RepositoryException;

    List<LeosDocument> findAllDocumentsByPackageId(final String packageId) throws RepositoryException;

    List<LeosDocument> findAllVersionsByRef(final String ref);

    List<LeosDocument> findDocumentsUsingFilter(final String packageName, final Set<String> categories, final QueryFilter queryFilter, final int startIndex, final int maxResults);

    Long countDocumentsUsingFilter(final String packageName, final Set<String> categories, final QueryFilter queryFilter);

    LeosDocument findTemplateByName(String ref) throws RepositoryException;
}
