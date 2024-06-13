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

import eu.europa.ec.leos.repository.entities.MilestoneV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface MilestoneVRepository extends JpaRepository<MilestoneV, String> {
    @Query(value = "SELECT * FROM MILESTONE_V m WHERE m.NAME = ?1", nativeQuery = true)
    List<MilestoneV> findMilestonesByName(String Name);

    @Query(value = "SELECT * FROM MILESTONE_V m WHERE m.REF = ?1 ORDER BY AUDIT_C_DATE DESC", nativeQuery = true)
    List<MilestoneV> findMilestonesByRef(String ref);

    @Query(value = "SELECT * FROM MILESTONE_V m WHERE m.MILESTONE_ID = ?1", nativeQuery = true)
    Optional<MilestoneV> findMilestonesById(BigDecimal id);

    @Query(value = "SELECT * FROM MILESTONE_V m WHERE m.PACKAGE_ID = ?1", nativeQuery = true)
    List<MilestoneV> findMilestonesByPackageId(BigDecimal packageId);

    @Query(value = "SELECT * FROM MILESTONE_V m WHERE m.PACKAGE_ID = ?1 AND m.CATEGORY_ID IN (SELECT id FROM DOCUMENT_CATEGORIES c WHERE c.CATEGORY_CODE = ?2)",
            nativeQuery = true)
    List<MilestoneV> findMilestonesByPackageIdAndCategory(BigDecimal packageId, String category);

    @Query(value = "SELECT * FROM MILESTONE_V m WHERE m.PACKAGE_ID IN (SELECT p.ID FROM PACKAGE p WHERE p.NAME = ?1) AND m.CATEGORY_ID IN (SELECT id FROM DOCUMENT_CATEGORIES c WHERE c.CATEGORY_CODE = ?2)",
            nativeQuery = true)
    List<MilestoneV> findMilestonesByPackageNameAndCategory(String packageName, String category);

    @Query(value = "SELECT * FROM MILESTONE_V m WHERE m.CATEGORY_ID IN (SELECT c.id FROM DOCUMENT_CATEGORIES c WHERE c.CATEGORY_CODE = ?1)", nativeQuery = true)
    List<MilestoneV> findMilestonesByCategory(String categoryCode);

    @Query(value = "SELECT * FROM MILESTONE_V m WHERE m.STATUS = ?1", nativeQuery = true)
    List<MilestoneV> findMilestonesByStatus(String Status);
}
