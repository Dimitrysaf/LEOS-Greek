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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface DocumentVRepository extends JpaRepository<DocumentV, String> {

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.document_id = ?1 ORDER BY d.DOC_AUDIT_LAST_M_DATE DESC", nativeQuery = true)
    List<DocumentV> findAllVersionsByDocumentId(BigDecimal documentId);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.ref = ?1 ORDER BY d.DOC_AUDIT_LAST_M_DATE DESC", nativeQuery = true)
    List<DocumentV> findAllVersionsByRef(String ref);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE package_id = ?1 AND category_code = ?2 ORDER BY d.DOC_AUDIT_LAST_M_DATE DESC", nativeQuery = true)
    List<DocumentV> findAllVersionsByPackageIdAndCategoryCode(BigDecimal packageId, String categoryCode);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE version_id = ?1", nativeQuery = true)
    Optional<DocumentV> findVersionByVersionId(BigDecimal versionId);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE ref = ?1 AND version_id = ?2", nativeQuery = true)
    Optional<DocumentV> findVersionByRefAndVersionId(String ref, BigDecimal versionId);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.REF = ?1 AND d.IS_LATEST_VERSION = 1", nativeQuery = true)
    Optional<DocumentV> findDocumentByRef(String ref);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.DOCUMENT_ID = ?1 AND d.IS_LATEST_VERSION = 1", nativeQuery = true)
    Optional<DocumentV> findLastVersionByDocumentId(BigDecimal documentId);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.PACKAGE_ID = ?1 AND d.CATEGORY_CODE = ?2 AND d" +
            ".IS_LATEST_VERSION = 1 ORDER BY d.DOC_AUDIT_LAST_M_DATE DESC", nativeQuery = true)
    List<DocumentV> findDocumentsByPackageIdAndCategory(BigDecimal packageId, String categoryCode);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.IS_LATEST_VERSION = 1 AND d.NAME = ?1 ORDER BY d" +
            ".DOC_AUDIT_LAST_M_DATE DESC", nativeQuery = true)
    List<DocumentV> findDocumentsByName(String name);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.PACKAGE_ID = ?1 AND d.IS_LATEST_VERSION = 1 ORDER BY d.DOC_AUDIT_LAST_M_DATE DESC", nativeQuery = true)
    List<DocumentV> findDocumentsByPackageId(BigDecimal packageId);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.REF = ?1 AND d.IS_LATEST_MAJOR_VERSION = 1", nativeQuery = true)
    Optional<DocumentV> findLatestMajorVersionByRef(String ref);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.VERSION_ID IN (SELECT MIN(VERSION_ID) FROM DOCUMENT_V WHERE REF = ?1)",
            nativeQuery = true)
    Optional<DocumentV> findFirstVersion(String docRef);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.ref = ?1 AND d.version_label = ?2", nativeQuery = true)
    Optional<DocumentV> findDocumentByVersion(String docRef, String versionLabel);

    @Query(value = "SELECT d FROM DocumentV d WHERE d.isMajorVersion = false AND d.ref = ?1 AND d.versionLabel < ?2 AND d.versionLabel > ?3 ORDER BY d" +
            ".createdOn DESC")
    Page<DocumentV> findAllMinorsForIntermediate(String docRef, String currIntVersion, String previousMajorVersion, Pageable pageable);

    @Query(value = "SELECT * FROM (SELECT * FROM DOCUMENT_V d WHERE d.IS_MAJOR_VERSION = 1 and d.REF = ?1 AND d.VERSION_LABEL < ?2 ORDER BY d" +
            ".DOC_AUDIT_LAST_M_DATE DESC) WHERE ROWNUM <= 1", nativeQuery = true)
    Optional<DocumentV> findPreviousMajorVersion(String docRef, String currIntVersion);

    @Query(value = "SELECT COUNT(d) FROM DocumentV d WHERE d.isMajorVersion = false AND d.ref = ?1 AND d.versionLabel < ?2 AND d.versionLabel > ?3")
    long getAllMinorsCountForIntermediate(String docRef, String currIntVersion, String previousMajorVersion);

    @Query(value = "SELECT COUNT(DISTINCT VERSION_ID) MINORS_COUNT FROM DOCUMENT_V d WHERE IS_MAJOR_VERSION = 1 and d.ref = ?1", nativeQuery = true)
    long getAllMajorsCount(String docRef);

    @Query(value = "SELECT d FROM DocumentV d WHERE d.isMajorVersion = true AND d.ref = ?1")
    Page<DocumentV> findAllMajors(String docRef, Pageable pageable);

    @Query(value = "SELECT d FROM DocumentV d WHERE d.isMajorVersion = false AND d.ref = ?1 AND d.versionLabel LIKE ?2")
    Page<DocumentV> findRecentMinorVersions(String docRef, String lastMajorId, Pageable pageable);

    @Query(value = "SELECT * FROM (SELECT COUNT(DISTINCT VERSION_ID) mvc FROM DOCUMENT_V d WHERE d.is_major_version = 0 and d.ref = ?1 and version_label LIKE" +
            " ?2) ", nativeQuery = true)
    long getRecentMinorVersionsCount(String docRef, String versionLabel);

    @Query(value = "SELECT COUNT(*) FROM DOCUMENT_V d WHERE d.PACKAGE_ID in (SELECT p.ID from PACKAGE p " +
            "WHERE p.NAME = ?1) and d" +
            ".CATEGORY_CODE =" +
            " nvl(?2, category_code)", nativeQuery = true)
    long getDocumentCountByPackageName(String packageName, String categoryCode);
}
