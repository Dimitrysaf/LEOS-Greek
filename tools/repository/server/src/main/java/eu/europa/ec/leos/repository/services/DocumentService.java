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
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;

import java.util.List;
import java.util.Map;

public interface DocumentService {
    LeosDocument createDocumentFromContent(final String repositoryId, final String packageName, final String name, Map<String, ?> metadata,
                                           final String labelVersion, int versionType, byte[] contentBytes, String comments) throws RepositoryException;

    LeosDocument createDocumentFromSource(final String repositoryId, final String sourceDocumentId, final String packageName, final String name, Map<String, ?> metadata,
                                        final String labelVersion, int versionType, String comments) throws RepositoryException;

    LeosDocument updateDocument(final String documentId, Map<String, ?> properties,
                            final String labelVersion, int versionType, byte[] contentBytes, String comments, String userId) throws Exception;

    LeosDocument updateDocument(final String documentId, Map<String, ?> properties, final String category,
                                final String labelVersion, int versionType, String comments, String userId) throws Exception;

    void deleteDocumentById(String id) throws RepositoryException;

    LeosDocument findDocumentById(final String id, final boolean latest);

    LeosDocument findLatestMajorVersionById(final String id);

    LeosDocument findFirstVersion(final String id, final String docRef);

    LeosDocument findDocumentByVersion(final String id, final String docRef, final String versionLabel);

    String getNextVersionLabel(final VersionType versionType, final String oldVersion);

    List<LeosDocument> findAllMinorsForIntermediate(final String docRef, final String currIntVersion, final int startIndex, final int maxResults);

    Integer getAllMinorsCountForIntermediate(final String docRef, final String currIntVersion);

    Integer getAllMajorsCount(final String docRef);

    List<LeosDocument> findAllMajors(final String docRef, final int startIndex, final int maxResult);

    List<LeosDocument> findRecentMinorVersions(final String docRef, String lastMajorVersion, final int startIndex, final int maxResults);

    Integer getRecentMinorVersionsCount(final String docRef, final String versionLabel);

    List<LeosDocument> findDocumentsByUserId(final String userId, final String primaryType, final String leosAuthority);

    List<LeosDocument> findDocumentsByRef(final String ref);

    List<LeosDocument> findDocumentsStatus(final String status);

    List<LeosDocument> findDocumentByPackageNameAndFileName(final String packageName, final String fileName, final String category) throws RepositoryException;
}
