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

import eu.europa.ec.leos.repository.entities.DocumentMilestone;
import eu.europa.ec.leos.repository.entities.DocumentMilestoneList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;


public interface DocumentMilestoneListRepository extends JpaRepository<DocumentMilestoneList, BigDecimal> {
    List<DocumentMilestoneList> findDocumentMilestoneListsByMilestone(DocumentMilestone documsntMilestone);

    @Query(value = "SELECT * FROM DOCUMENT_MILESTONE_LIST m WHERE m.MILESTONE_ID = ?1", nativeQuery = true)
    List<DocumentMilestoneList> findDocumentMilestoneListsByMilestoneId(BigDecimal milestoneId);
}
