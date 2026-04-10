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
package eu.europa.ec.digit.userdata.repositories;

import eu.europa.ec.digit.userdata.entities.SpecialEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface SpecialEntityRepository extends JpaRepository<SpecialEntity, String> {

    // language=SQL
    String QUERY_UPDATE_PARENTS = """
            UPDATE LEOS_SPECIAL_ENTITY
                SET ENTITY_PARENT_ID = :newParentId
                WHERE ENTITY_PARENT_ID = :oldParentId""";

    SpecialEntity findByName(String entity);

    Collection<SpecialEntity> findAllByOrganizationName(String organizationName);

    @Modifying
    @Query(value = QUERY_UPDATE_PARENTS, nativeQuery = true)
    void replaceParents(String oldParentId, String newParentId);

    List<SpecialEntity> findByParentId(String parentId);
}
