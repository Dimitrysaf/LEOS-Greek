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

import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.interfaces.PackagesFavorites;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import eu.europa.ec.leos.repository.interfaces.PackagesRecentlyChanged;

public interface PackageRepository extends JpaRepository<Package, BigDecimal> {
    @Query(value = "SELECT * FROM PACKAGE p WHERE p.NAME = ?1", nativeQuery =
            true)
    Optional<Package> findPackageByName(String name);

    @Query(value = "SELECT * FROM PACKAGE p WHERE p.NAME LIKE ?1", nativeQuery =
            true)
    List<Package> findPackagesByPath(String path);

    @Query(value = "SELECT * FROM PACKAGE p WHERE p.ID IN (SELECT d.PACKAGE_ID FROM DOCUMENT d WHERE d.REF = ?1)", nativeQuery = true)
    Optional<Package> findPackageByDocumentRef(String documentRefId);

    @Query(value = "SELECT * FROM PACKAGE p WHERE p.ID IN (SELECT d.PACKAGE_ID FROM DOCUMENT d WHERE d.ID IN (SELECT v.document_id FROM DOCUMENT_VERSION v WHERE v.ID = ?1))", nativeQuery = true)
    Optional<Package> findPackageByDocumentVersionId(BigDecimal versionId);

    @Query(value = "SELECT rn as rank, last_pkg.package_id as packageId, to_char(greatest_last_date,'dd.mm.yyyy hh24:mi:ss') as greatestLastDate, last_pkg_meta.document_id as documentId, last_pkg_meta.ref as ref, last_pkg_meta.title as title \n" +
            "FROM (\n" +
            "SELECT package_id, greatest_last_date, rn\n" +
            "  FROM (SELECT package_id, row_number() OVER (ORDER BY greatest_last_date DESC) rn, greatest_last_date \n" +
            "\t\t  FROM (\n" +
            "SELECT package_id, max(greatest_last_date) greatest_last_date FROM (\n" +
            "SELECT package_id, id, \n" +
            "greatest(\n" +
            "nvl(audit_last_m_date,CURRENT_DATE-99999),\n" +
            "nvl(content.last_date, CURRENT_DATE-99999),\n" +
            "nvl(version.last_date,CURRENT_DATE-99999),\n" +
            "nvl(milestone.last_date,CURRENT_DATE-99999),\n" +
            "nvl(prop.last_date,CURRENT_DATE-99999)) greatest_last_date\n" +
            "  FROM (\n" +
            "SELECT package_id, id, max(audit_last_m_date) audit_last_m_date\n" +
            "  FROM DOCUMENT d \n" +
            " WHERE AUDIT_LAST_M_BY = ?1  \n" +
            " GROUP BY package_id, id) docs\n" +
            "LEFT OUTER JOIN (select document_id, max(dc.AUDIT_LAST_M_DATE) last_date\n" +
            "  from DOCUMENT_CONTENT dc, DOCUMENT_VERSION dv\n" +
            "  where dc.VERSION_ID = dv.id\n" +
            "    AND dc.AUDIT_LAST_M_BY = ?1  \n" +
            " group by document_id) content ON (docs.id = content.document_id)\n" +
            "LEFT OUTER JOIN\n" +
            "(select document_id, max(AUDIT_LAST_M_DATE) last_date\n" +
            "  from DOCUMENT_VERSION WHERE AUDIT_LAST_M_BY = ?1  \n" +
            " group by document_id) version on (docs.id = version.document_id)\n" +
            "LEFT OUTER JOIN (select document_id, max(AUDIT_LAST_M_DATE) last_date\n" +
            "  from DOCUMENT_MILESTONE WHERE AUDIT_LAST_M_BY = ?1  \n" +
            " group by document_id) milestone ON (docs.id = milestone.document_id)\n" +
            "LEFT OUTER JOIN (select document_id, max(AUDIT_LAST_M_DATE) last_date\n" +
            "  from DOCUMENT_PROPERTY_VALUES WHERE AUDIT_LAST_M_BY = ?1   \n" +
            " group by document_id) prop ON (docs.id = prop.document_id)\n" +
            ") group by package_id)\n" +
            "       ) \n" +
            " WHERE rn <= ?2 order by GREATEST_LAST_DATE desc) last_pkg\n" +
            " JOIN (SELECT PKGVER.PACKAGE_ID, PKGVER.DOCUMENT_ID, PKGVER.VERSION_ID, PKGVER.REF, DOCCON.TITLE \n" +
            "  FROM \n" +
            "(select package_id, d.id document_id, dcv.ID version_id, D.REF from document d join (select DOCUMENT_ID, MAX(ID) ID from document_version GROUP BY DOCUMENT_ID) dcv ON (d.id = dcv.DOCUMENT_ID)\n" +
            "WHERE d.CATEGORY_ID IN (SELECT id FROM DOCUMENT_CATEGORIES dc2 where category_code = 'PROPOSAL')) pkgver\n" +
            "JOIN (select version_id, title, category_code from DOCUMENT_CONTENT) doccon ON (pkgver.version_id = doccon.VERSION_ID)) LAST_PKG_META\n" +
            "ON (last_pkg.package_id = last_pkg_meta.package_id)\n" +
            "order by rn", nativeQuery = true)
    List<PackagesRecentlyChanged> findRecentPackagesForUser(String userName, BigDecimal numberOfRecentPackages);


    @Query(value="select distinct to_char(pkgfav.audit_c_date,'dd.mm.yyyy hh24:mi:ss') as creationDate, pkgfav_meta.package_id as packageId, pkgfav_meta.document_id as documentId, " +
            "pkgfav_meta.ref as ref, pkgfav_meta.title as title, pkgfav.IS_FAVORITE as favorite\n" +
            "from (\n" +
            "select pc.package_id, p.AUDIT_C_DATE, pc.IS_FAVORITE\n" +
            "  from PACKAGE_COLLABORATORS pc JOIN COLLABORATORS c ON (pc.COLLABORATOR_ID = c.ID) join \"PACKAGE\" p on (pc.package_id = p.id)\n" +
            " WHERE c.COLLABORATOR_NAME = ?1 AND pc.is_favorite = 1\n" +
            " ) pkgfav JOIN (SELECT PKGVER.PACKAGE_ID, PKGVER.DOCUMENT_ID, PKGVER.VERSION_ID, PKGVER.REF, DOCCON.TITLE \n" +
            "  FROM \n" +
            "(select package_id, d.id document_id, dcv.ID version_id, D.REF from document d join (select DOCUMENT_ID, MAX(ID) ID from document_version GROUP BY DOCUMENT_ID) dcv ON (d.id = dcv.DOCUMENT_ID)\n" +
            "WHERE d.CATEGORY_ID IN (SELECT id FROM DOCUMENT_CATEGORIES dc2 where category_code = 'PROPOSAL')) pkgver\n" +
            "JOIN (select version_id, title, category_code from DOCUMENT_CONTENT) doccon ON (pkgver.version_id = doccon.VERSION_ID)) pkgfav_meta\n" +
            "ON (pkgfav.package_id = pkgfav_meta.package_id)", nativeQuery=true)
    List<PackagesFavorites> findFavouritePackagesForUser(String userName);

    @Query(value="select distinct to_char(pkgfav.audit_c_date,'dd.mm.yyyy hh24:mi:ss') as creationDate, pkgfav_meta.package_id as packageId, pkgfav_meta.document_id as documentId, " +
            "pkgfav_meta.ref as ref, pkgfav_meta.title as title, pkgfav.IS_FAVORITE as favorite\n" +
            "from (\n" +
            "select pc.package_id, p.AUDIT_C_DATE, pc.IS_FAVORITE\n" +
            "  from PACKAGE_COLLABORATORS pc JOIN COLLABORATORS c ON (pc.COLLABORATOR_ID = c.ID) join \"PACKAGE\" p on (pc.package_id = p.id)\n" +
            "WHERE c.COLLABORATOR_NAME = ?1" +
            " ) pkgfav JOIN (SELECT PKGVER.PACKAGE_ID, PKGVER.DOCUMENT_ID, PKGVER.VERSION_ID, PKGVER.REF, DOCCON.TITLE \n" +
            "  FROM \n" +
            "(select package_id, d.id document_id, dcv.ID version_id, D.REF from document d join (select DOCUMENT_ID, MAX(ID) ID from document_version GROUP BY DOCUMENT_ID) dcv ON (d.id = dcv.DOCUMENT_ID)\n" +
            "WHERE d.CATEGORY_ID IN (SELECT id FROM DOCUMENT_CATEGORIES dc2 where category_code = 'PROPOSAL') and ref = ?2) pkgver\n" +
            "JOIN (select version_id, title, category_code from DOCUMENT_CONTENT) doccon ON (pkgver.version_id = doccon.VERSION_ID)) pkgfav_meta\n" +
            "ON (pkgfav.package_id = pkgfav_meta.package_id)", nativeQuery=true)
    Optional<PackagesFavorites> getFavouritePackage(String userName, String ref);

}
