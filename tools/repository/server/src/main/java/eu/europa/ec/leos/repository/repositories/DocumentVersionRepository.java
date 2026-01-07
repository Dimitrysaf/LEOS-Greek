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

    @Query("SELECT d FROM DocumentVersion d WHERE d.documentId = ?1 AND d.isLatestVersion = true")
    Optional<DocumentVersion> findLastVersionByDocumentId(BigDecimal documentId);

    @Query("SELECT d FROM DocumentVersion d WHERE d.isLatestMajorVersion = true AND d.documentId = ?1 ORDER BY d.auditCDate DESC LIMIT 1")
    Optional<DocumentVersion> findLastMajorVersionByDocumentId(BigDecimal documentId);

}
