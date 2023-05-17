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
package eu.europa.ec.leos.repository.repositories;

import eu.europa.ec.leos.repository.entities.DocumentV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface DocumentVRepository extends JpaRepository<DocumentV, BigDecimal> {

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE document_id = ?1", nativeQuery = true)
    List<DocumentV> findAllVersionsByDocumentId(BigDecimal documentId);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE package_id = ?1 AND category_code = ?2", nativeQuery = true)
    List<DocumentV> findAllVersionsByPackageIdAndCategoryCode(BigDecimal packageId, String categoryCode);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE version_id = ?1", nativeQuery = true)
    Optional<DocumentV> findVersionByVersionId(BigDecimal versionId);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.DOCUMENT_ID = ?1 AND d.IS_LATEST_VERSION = 1", nativeQuery = true)
    Optional<DocumentV> findLastVersionByDocumentId(BigDecimal documentId);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.PACKAGE_ID = ?1 AND d.CATEGORY_CODE = ?2 AND d.IS_LATEST_VERSION = 1", nativeQuery = true)
    List<DocumentV> findDocumentsByPackageIdAndCategory(BigDecimal packageId, String categoryCode);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.PACKAGE_ID = ?1 AND d.IS_LATEST_VERSION = 1", nativeQuery = true)
    List<DocumentV> findDocumentsByPackageId(BigDecimal packageId);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.version_id = ?1 AND d.IS_LATEST_MAJOR_VERSION = 1", nativeQuery = true)
    Optional<DocumentV> findLatestMajorVersionById(BigDecimal versionId);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE version_id IN (SELECT MIN(VERSION_ID) FROM DOCUMENT_V WHERE d.document_id = ?1 OR d.ref = ?2)",
            nativeQuery = true)
    Optional<DocumentV> findFirstVersion(BigDecimal documentId, String docRef);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.document_id = ?1 AND d.ref = ?2 AND d.version_label = ?3", nativeQuery = true)
    Optional<DocumentV> findDocumentByVersion(BigDecimal documentId, String docRef, String versionLabel);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE IS_MAJOR_VERSION = 0 and d.ref = ?1 AND d.version_label LIKE ?2 LIMIT ?4 OFFSET ?3",
            nativeQuery = true)
    List<DocumentV> findAllMinorsForIntermediate(String docRef, String currIntVersion, int startIndex, int maxResults);

    @Query(value = "SELECT COUNT(DISTINCT VERSION_ID) MINORS_COUNT FROM DOCUMENT_V d WHERE IS_MAJOR_VERSION = 0 and d.ref = ?1", nativeQuery = true)
    Integer getAllMinorsCountForIntermediate(String docRef, String currIntVersion);

    @Query(value = "SELECT COUNT(DISTINCT VERSION_ID) MINORS_COUNT FROM DOCUMENT_V d WHERE IS_MAJOR_VERSION = 1 and d.ref = ?1", nativeQuery = true)
    Integer getAllMajorsCount(String docRef);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.is_major_version = 1 AND d.ref = ?1 LIMIT ?3 OFFSET ?2", nativeQuery = true)
    List<DocumentV> findAllMajors(String docRef, int startIndex, int maxResults);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.is_major_version = 0 AND d.ref = ?1 AND d.version_label LIKE ?2 LIMIT ?4 OFFSET ?3", nativeQuery = true)
    List<DocumentV> findRecentMinorVersions(String docRef, String lastMajorId, int startIndex, int maxResults);

    @Query(value = "SELECT * FROM (SELECT COUNT(DISTINCT VERSION_ID) mvc FROM DOCUMENT_V d WHERE d.is_major_version = 0 and d.ref = ?1 and version_label LIKE" +
            " ?2) ", nativeQuery = true)
    Integer getRecentMinorVersionsCount(String docRef, String versionLabel);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.ref = ?1", nativeQuery = true)
    List<DocumentV> findDocumentsByRef(String ref);

    @Query(value = "SELECT COUNT(*) FROM DOCUMENT_V d WHERE d.package_id in (SELECT package_id from PACKAGE WHERE d.package_name = ?1) and category_code = " +
            "nvl(?2, category_code)", nativeQuery = true)
    Integer getDocumentCountByPackageName(String packageName, String categoryCode);


}
