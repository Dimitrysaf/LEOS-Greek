/*
 * Copyright 2026 European Union
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

import eu.europa.ec.leos.repository.entities.DocumentPreview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface DocumentPreviewRepository extends JpaRepository<DocumentPreview, BigDecimal> {

    Optional<DocumentPreview> findByDocumentRefAndVersionLabel(String documentRef, String versionLabel);

    List<DocumentPreview> findByDocumentRef(String documentRef);

    @Modifying
    @Query("DELETE FROM DocumentPreview d WHERE d.documentRef = :documentRef AND d.id < :excludeId")
    void deleteOtherVersions(@Param("documentRef") String documentRef, @Param("excludeId") BigDecimal excludeId);
}
