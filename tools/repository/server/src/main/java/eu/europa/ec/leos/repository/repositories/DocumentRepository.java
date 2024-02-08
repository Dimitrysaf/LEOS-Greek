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

import eu.europa.ec.leos.repository.entities.Document;
import eu.europa.ec.leos.repository.entities.DocumentVersion;
import eu.europa.ec.leos.repository.entities.Package;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, BigDecimal> {
    List<Document> findAllDocumentsByPackageId(Package packageId);

    Optional<Document> findDocumentByRef(String ref);

    @Query(value = "SELECT * FROM DOCUMENT d WHERE d.ID IN (SELECT v.DOCUMENT_ID FROM DOCUMENT_VERSION v WHERE v.ID= ?1 AND v.IS_LATEST_VERSION = 1);", nativeQuery = true)
    Optional<Document> findDocumentByDocumentId(BigDecimal documentId);
}
