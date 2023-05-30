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

import eu.europa.ec.leos.repository.entities.Collaborators;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.entities.PackageCollaborators;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface PackageCollaboratorsRepository extends JpaRepository<PackageCollaborators, BigDecimal> {
    List<PackageCollaborators> findPackageCollaboratorsByPackageId(Package packageId);

    @Query(value = "SELECT * FROM PACKAGE_COLLABORATORS c WHERE c.PACKAGE_ID = ?1", nativeQuery = true)
    List<PackageCollaborators> findCollaboratorsByPackageId(BigDecimal packageId);

    @Query(value = "SELECT p.PACKAGE_ID FROM PACKAGE_COLLABORATORS p WHERE p.COLLABORATOR_ID IN (SELECT ID FROM COLLABORATORS c WHERE c.COLLABORATOR_NAME = " +
            "?1 AND c.ROLE_ID = ?2)",
            nativeQuery = true)
    List<BigDecimal> findPackageIdByCollaboratorNameAndByRole(String collaboratorName, String role);
}
