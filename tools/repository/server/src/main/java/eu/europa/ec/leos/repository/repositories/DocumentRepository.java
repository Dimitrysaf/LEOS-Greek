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
import eu.europa.ec.leos.repository.entities.Package;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, BigDecimal> {
    List<Document> findAllDocumentsByPackageId(Package packageId);

    Optional<Document> findDocumentByRef(String ref);

    List<Document> findDocumentsByName(String name);

    @Query(value = "SELECT * FROM DOCUMENT d WHERE d.ID IN (SELECT v.DOCUMENT_ID FROM DOCUMENT_VERSION v WHERE v.ID= ?1 AND v.IS_LATEST_VERSION = 1);", nativeQuery = true)
    Optional<Document> findDocumentByDocumentId(BigDecimal documentId);

    Optional<Document> findDocumentById(BigDecimal documentId);

    List<Document> findByClonedFrom(String clonedFrom);

    String reportQuery ="WITH category_ids AS (\n" + "    SELECT\n" + "        MAX(CASE WHEN category_code = 'PROPOSAL' THEN id END) AS proposal_id,\n" + "        MAX(CASE WHEN category_code = 'ANNEX' THEN id END) AS annex_id,\n" + "        MAX(CASE WHEN category_code = 'STAT_DIGIT_FINANC_LEGIS' THEN id END) AS lfd_id\n" + "    FROM document_categories\n" + "),\n" + "annex_flags AS (\n" + "    SELECT\n" + "        d.package_id,\n" + "        MAX(CASE WHEN dc.original_file_name IS NULL THEN 1 ELSE 0 END) AS contains_annexes,\n" + "        MAX(CASE WHEN dc.original_file_name IS NOT NULL THEN 1 ELSE 0 END) AS contains_foreign_annexes\n" + "    FROM document d\n" + "    JOIN document_version dv ON dv.document_id = d.id AND dv.is_latest_version = 1 \n" + "    JOIN document_content dc ON dc.version_id = dv.id\n" + "    CROSS JOIN category_ids\n" + "    WHERE d.category_id = category_ids.annex_id\n" + "      AND d.is_archived IS NULL\n" + "    GROUP BY d.package_id\n" + "),\n" + "lfds_flags AS (\n" + "    SELECT DISTINCT package_id, 1 AS contains_lfds\n" + "    FROM document\n" + "    CROSS JOIN category_ids\n" + "    WHERE category_id = category_ids.lfd_id\n" + "),\n" + "\n" + "lead_dg_cte AS (\n" + "    SELECT\n" + "        p.package_id,\n" + "        MAX(c.organization) AS lead_dg\n" + "    FROM package_collaborators p\n" + "    JOIN collaborators c ON c.id = p.collaborator_id\n" + "    JOIN document d ON d.package_id = p.package_id\n" + "\tWHERE c.collaborator_name = p.audit_c_by\n" + "    GROUP BY p.package_id\n" + "),\n" + "other_dg_cte AS (\n" + "    SELECT\n" + "        p.package_id,\n" + "        LISTAGG(DISTINCT c.organization, ',') WITHIN GROUP (ORDER BY c.organization) AS other_dg\n" + "    FROM package_collaborators p\n" + "    JOIN collaborators c ON c.id = p.collaborator_id\n" + "    JOIN document d ON d.package_id = p.package_id\n" + "    LEFT JOIN lead_dg_cte ld ON ld.package_id = p.package_id\n" + "    WHERE c.organization != ld.lead_dg\n" + "    GROUP BY p.package_id\n" + "),\n" + "doc_milestone AS (SELECT\n" + "    \n" + "    d.package_id as package_id,  \n" + "\n" + "    MAX(CASE WHEN dm.status = 'EXPORTED' THEN 'Y' END) AS exported,\n" + "    \n" + "    MAX(CASE WHEN dm.milestone_comments = 'For Interservice Consultation' THEN 'Y' END) AS isc,\n" + "\n" + "    MAX(CASE WHEN dm.milestone_comments = 'For Interservice Consultation' THEN dm.audit_c_date END) AS isc_date,\n" + "    MAX(CASE WHEN dm.milestone_comments = 'Revision after Interservice Consultation' THEN 'Y' END) AS revision_isc,\n" + "    MAX(CASE WHEN dm.milestone_comments = 'Revision after Interservice Consultation' THEN dm.audit_c_date END) AS revision_isc_date,\n" + "    MAX(CASE WHEN dm.milestone_comments = 'For Decision' THEN 'Y' END) AS decision,\n" + "    MAX(CASE WHEN dm.milestone_comments = 'For Decision' THEN dm.audit_c_date END) AS decision_date,\n" + "    \n" + "   MAX(CASE WHEN dm.milestone_comments NOT IN (\n" + "                'For Decision',\n" + "                'For Interservice Consultation',\n" + "                'Revision after Interservice Consultation',\n" + "                'Contribution from Legal Service',\n" + "                'Custom Template'\n" + "            ) THEN 'Y' END) AS others,\n" + "\n" + "    MAX(CASE WHEN dm.milestone_comments NOT IN (\n" + "                'For Decision',\n" + "                'For Interservice Consultation',\n" + "                'Revision after Interservice Consultation',\n" + "                'Contribution from Legal Service',\n" + "                'Custom Template'\n" + "            ) THEN dm.audit_c_date END) AS others_date\n" + "FROM document_milestone dm\n" + "JOIN document d ON d.id = dm.document_id \n" + "GROUP BY d.package_id)\n" + "SELECT \n" + "    dc.title,\n" + "    dc.template,\n" + "    d.ref,\n" + "    d.audit_c_date AS creation_date,\n" + "    COALESCE(ld.lead_dg, '') AS lead_dg,\n" + "    COALESCE(od.other_dg, '') AS other_dg,\n" + "\tCOALESCE(dm.exported, '') AS exported_milestone,\n" + "\tCOALESCE(dm.isc, '') AS milestone_isc,\n" + "\tdm.isc_date AS milestone_isc_date,\n" + "\tCOALESCE(dm.revision_isc, '') AS milestone_revision_isc,\n" + "\tdm.revision_isc_date AS milestone_revision_isc_date,\n" + "\tCOALESCE(dm.others, '') AS milestone_others,\n" + "\tdm.others_date AS milestone_others_date,\n" + "\tCOALESCE(dm.decision, '') AS milestone_decision,\n" + "\tdm.decision_date AS milestone_decision_date,\n" + "\t'' as isc_number,\n" + "\t'' as isc_link,\n" + "\t'' as decision_link,\n" + "\t'Standard' as Confidentiality,\n" + "    CASE WHEN af.contains_annexes = 1 THEN 'Yes' ELSE 'No' END AS contains_annexes,\n" + "    CASE WHEN af.contains_foreign_annexes = 1 THEN 'Yes' ELSE 'No' END AS contains_foreign_annexes,\n" + "    CASE WHEN lf.contains_lfds = 1 THEN 'Yes' ELSE 'No' END AS contains_lfds,\n" + "    d.language\n" + "FROM document d\n" + "JOIN document_version dv ON dv.document_id = d.id AND dv.is_latest_version = 1\n" + "JOIN document_content dc ON dc.version_id = dv.id\n" + "CROSS JOIN category_ids\n" + "LEFT JOIN annex_flags af ON af.package_id = d.package_id\n" + "LEFT JOIN lfds_flags lf ON lf.package_id = d.package_id\n" + "LEFT JOIN lead_dg_cte ld ON ld.package_id = d.package_id\n" + "LEFT JOIN other_dg_cte od ON od.package_id = d.package_id\n" + "LEFT JOIN doc_milestone dm ON dm.package_id = d.package_id\n" + "WHERE d.category_id = category_ids.proposal_id";
    @Query(value = reportQuery, nativeQuery = true)
    List<Object[]> fetchProposalsReport();
}
