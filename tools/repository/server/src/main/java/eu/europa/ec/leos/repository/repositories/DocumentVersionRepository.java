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

import eu.europa.ec.leos.repository.entities.DocumentVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface DocumentVersionRepository extends JpaRepository<DocumentVersion, BigDecimal> {
    Optional<DocumentVersion> findDocumentVersionByVersionLabelAndDocumentId(String versionLabel, BigDecimal documentId);

    List<DocumentVersion> findAllVersionsByDocumentId(BigDecimal documentId);

    @Query(value = "SELECT * FROM DOCUMENT_VERSION d WHERE d.DOCUMENT_ID = ?1 AND d.IS_LATEST_VERSION = 1", nativeQuery = true)
    Optional<DocumentVersion> findLastVersionByDocumentId(BigDecimal documentId);

    @Query(value = "SELECT * FROM (SELECT * FROM DOCUMENT_VERSION d WHERE d.IS_LATEST_MAJOR_VERSION = 1 and d.DOCUMENT_ID = ?1 ORDER BY d.AUDIT_C_DATE DESC) " +
            "WHERE ROWNUM <= 1", nativeQuery = true)
    Optional<DocumentVersion> findLastMajorVersionByDocumentId(BigDecimal documentId);
}
