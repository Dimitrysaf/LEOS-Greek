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
package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import eu.europa.ec.leos.repository.interfaces.PackagesRecentlyChanged;
import eu.europa.ec.leos.repository.interfaces.PackagesFavorites;

public interface PackageService {
    eu.europa.ec.leos.repository.model.Package createPackage(final String name, final Boolean isCloned, final String clonedPackageName
            , String language, Boolean isTranslated, final String userId);

    void createLinkedPackage(BigDecimal originPkgId, BigDecimal linkedPkgId);

    void deletePackage(final String packageName) throws RepositoryException;

    eu.europa.ec.leos.repository.model.Package getPackageByName(final String name) throws RepositoryException;

    eu.europa.ec.leos.repository.model.Package getPackageById(final String id) throws RepositoryException;

    List<LeosDocument> findDocumentsByPackageName(final String packageName, final Set<String> categories,
                                                  final boolean descendants, boolean fetchContent) throws RepositoryException;

    List<LeosDocument> findDocumentsByPackageId(final BigDecimal packageId, final Set<String> categories, final boolean allVersion, boolean fetchContent);

    long getDocumentCountByPackageName(final String packageName, Set<String> categories);

    eu.europa.ec.leos.repository.model.Package findPackageByDocumentRef(String documentRefId) throws RepositoryException;

    eu.europa.ec.leos.repository.model.Package findPackageByDocumentVersionId(String versionId) throws RepositoryException;

    List<PackagesRecentlyChanged> findRecentPackagesForUser(final String userName, final BigDecimal numberOfRecentPackages) throws RepositoryException;

    List<PackagesFavorites> findFavouritePackagesForUser(final String userName) throws RepositoryException;

    PackagesFavorites getFavouritePackage(final String userName, final String ref) throws RepositoryException;

    PackagesFavorites toggleFavouritePackage(final String userName, final String ref) throws RepositoryException;

}