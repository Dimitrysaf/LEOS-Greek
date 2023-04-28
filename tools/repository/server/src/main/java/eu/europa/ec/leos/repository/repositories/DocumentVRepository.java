/*
 * Copyright 2021 European Commission
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

public interface DocumentVRepository extends JpaRepository<DocumentV, BigDecimal> {

    List<DocumentV> findAllVersionsByDocumentId(BigDecimal documentId);

    List<DocumentV> findAllVersionsByPackageIdAndCategoryCode(BigDecimal packageId, String categoryCode);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.PACKAGE_ID = ?1 AND d.CATEGORY_CODE = ?2 AND d.IS_LATEST_VERSION = 1", nativeQuery = true)
    List<DocumentV> findDocumentsByPackageIdAndCategory(BigDecimal packageId, String categoryCode);

    @Query(value = "SELECT * FROM DOCUMENT_V d WHERE d.PACKAGE_ID = ?1 AND d.IS_LATEST_VERSION = 1", nativeQuery = true)
    List<DocumentV> findDocumentsByPackageId(BigDecimal packageId);
}
