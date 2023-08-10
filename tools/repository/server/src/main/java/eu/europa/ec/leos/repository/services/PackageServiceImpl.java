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
package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.entities.DocumentV;
import eu.europa.ec.leos.repository.entities.MilestoneV;
import eu.europa.ec.leos.repository.entities.Repository;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.repositories.DocumentCategoriesRepository;
import eu.europa.ec.leos.repository.repositories.DocumentContentRepository;
import eu.europa.ec.leos.repository.repositories.DocumentMilestoneListRepository;
import eu.europa.ec.leos.repository.repositories.DocumentPropertyValuesRepository;
import eu.europa.ec.leos.repository.repositories.DocumentVRepository;
import eu.europa.ec.leos.repository.repositories.MilestoneVRepository;
import eu.europa.ec.leos.repository.repositories.PackageRepository;
import eu.europa.ec.leos.repository.repositories.RepositoryRepository;
import eu.europa.ec.leos.repository.utils.ConversionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class PackageServiceImpl implements PackageService {
    private final DocumentVRepository documentVRepository;
    private final MilestoneVRepository milestoneVRepository;
    private final PackageRepository packageRepository;
    private final RepositoryRepository repositoryRepository;
    private final DocumentPropertyValuesRepository documentPropertyValuesRepository;
    private final DocumentContentRepository documentContentRepository;
    private final CollaboratorsService collaboratorsService;
    private final DocumentMilestoneListRepository documentMilestoneListRepository;
    private final DocumentCategoriesRepository documentCategoriesRepository;
    private final DocumentService documentService;
    private final EntityManager entityManager;

    @Autowired
    public PackageServiceImpl(DocumentVRepository documentVRepository, MilestoneVRepository milestoneVRepository, PackageRepository packageRepository,
                              RepositoryRepository repositoryRepository, DocumentPropertyValuesRepository documentPropertyValuesRepository,
                              DocumentContentRepository documentContentRepository, CollaboratorsService collaboratorsService,
                              DocumentMilestoneListRepository documentMilestoneListRepository, DocumentCategoriesRepository documentCategoriesRepository,
                              EntityManager entityManager,
                              @Lazy DocumentService documentService) {
        this.documentVRepository = documentVRepository;
        this.milestoneVRepository = milestoneVRepository;
        this.packageRepository = packageRepository;
        this.repositoryRepository = repositoryRepository;
        this.documentContentRepository = documentContentRepository;
        this.documentPropertyValuesRepository = documentPropertyValuesRepository;
        this.collaboratorsService = collaboratorsService;
        this.documentMilestoneListRepository = documentMilestoneListRepository;
        this.documentCategoriesRepository = documentCategoriesRepository;
        this.documentService = documentService;
        this.entityManager = entityManager;
    }

    @Transactional(rollbackFor = Exception.class)
    public eu.europa.ec.leos.repository.model.Package createPackage(final String name, final String repository, final Boolean isCloned, final String clonedPackageName
            , final String userId) {
        Repository repo = repositoryRepository.findRepositoryByCmisId(repository);
        if (repo != null) {
            Package pkg = new Package();
            pkg.setObjectId(new BigDecimal(0));
            pkg.setName(name);
            pkg.setRepositoryId(repo.getId());
            pkg.setAuditCBy(userId);
            pkg.setAuditCDate(LocalDateTime.now());
            pkg.setAuditLastMBy(userId);
            pkg.setAuditLastMDate(LocalDateTime.now());
            return new eu.europa.ec.leos.repository.model.Package(packageRepository.save(pkg));
        } else {
            return null;
        }
    }

    @Cacheable(cacheNames = "getPackageByName")
    public eu.europa.ec.leos.repository.model.Package getPackageByName(final String repositoryId, final String name) throws RepositoryException {
        Package pkg =
                packageRepository.findPackageByName(repositoryId, name).orElse(null);
        return ConversionUtils.buildPackage(pkg, collaboratorsService);
    }

    @Cacheable(cacheNames = "getPackageById")
    public eu.europa.ec.leos.repository.model.Package getPackageById(final String id) throws RepositoryException {
        try {
            Package pkg =
                    packageRepository.getById(new BigDecimal(Long.parseLong(id)));
            return ConversionUtils.buildPackage(pkg, collaboratorsService);
        } catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Package.class.getName());
        }
    }


    @Transactional(rollbackFor = Exception.class)
    public void deletePackage(final String repositoryId, final String packageName) throws RepositoryException {
        try {
            Optional<Package> pkg = packageRepository.findPackageByName(repositoryId, packageName);
            if (pkg.isPresent()) {
                // Remove all docs inside package
                List<LeosDocument> docs = documentService.findAllDocumentsByPackageId(pkg.get().getId().toString());
                for (LeosDocument d : docs) {
                    try {
                        documentService.deleteDocumentByRef(d.getRef());
                    } catch (RepositoryException e) {
                        throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_DELETING, "Error while deleting a document with" +
                                " id : " + d.getVersionId());
                    }
                }
                // Remove all links to collaborators
                collaboratorsService.removeCollaborators(pkg.get());
            }

            pkg.ifPresent(packageRepository::delete);
        } catch (NumberFormatException e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Package.class.getName());
        }
    }

    public List<LeosDocument> findDocumentsByPackageName(final String repositoryId, String packageName, final Set<String> categories,
                                                         final boolean descendants, boolean fetchContent) {
        StringBuilder docQuery = new StringBuilder("SELECT d FROM DocumentV d WHERE (d.isArchived IS NULL OR d.isArchived = false) AND d.isLatestVersion = " +
                "true");
        StringBuilder milestoneQuery = new StringBuilder("SELECT d FROM MilestoneV d WHERE");
        if (!descendants) {
            docQuery.append(String.format(" AND d.packageId IN (SELECT p.id FROM Package p WHERE p.repositoryId IN (SELECT r.id FROM Repository r WHERE r" +
                    ".cmisId = '%s') AND p.name = '%s')", repositoryId, packageName));
            milestoneQuery.append(String.format(" d.packageId IN (SELECT p.id FROM Package p WHERE p.repositoryId IN (SELECT r.id FROM Repository r WHERE r" +
                            ".cmisId = '%s') AND p.name = '%s')", repositoryId, packageName));
        }
        docQuery.append(" AND");
        if (!descendants && categories != null) {
            milestoneQuery.append(" AND");
        }
        if (categories != null) {
            docQuery.append(" ").append(buildQueryFromCategories(categories));
            milestoneQuery.append(" ").append(buildQueryFromCategoriesUsingId(categories));
        }

        List<DocumentV> docs = entityManager.createQuery(docQuery.toString()).getResultList();
        List<MilestoneV> milestones = entityManager.createQuery(milestoneQuery.toString()).getResultList();
        List<LeosDocument> xmlDocs = ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, collaboratorsService, documentContentRepository, docs, false);
        for (MilestoneV m : milestones) {
            xmlDocs.add(ConversionUtils.buildLegDocument(m, documentMilestoneListRepository, documentCategoriesRepository));
        }
        return xmlDocs;
    }

    public List<LeosDocument> findDocumentsByPackageId(final String packageId, final Set<String> categories,
                                                      final boolean allVersion, boolean fetchContent) {
        StringBuilder docQuery = new StringBuilder(String.format("SELECT d FROM DocumentV d WHERE (d.isArchived IS NULL OR d.isArchived = false) AND d.packageId=%s", packageId));
        if (!allVersion && categories != null) {
            docQuery.append(" AND d.isLatestVersion = true");
        }
        StringBuilder milestoneQuery = new StringBuilder(String.format("SELECT d FROM MilestoneV d WHERE d.packageId=%s", packageId));
        if (categories!=null) {
            docQuery.append(" AND ").append(buildQueryFromCategories(categories));
            milestoneQuery.append(" AND ").append(buildQueryFromCategoriesUsingId(categories));
        }

        List<DocumentV> docs = entityManager.createQuery(docQuery.toString()).getResultList();
        List<MilestoneV> milestones = entityManager.createQuery(milestoneQuery.toString()).getResultList();
        List<LeosDocument> xmlDocs = ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, collaboratorsService, documentContentRepository, docs, false);
        for (MilestoneV m : milestones) {
            xmlDocs.add(ConversionUtils.buildLegDocument(m, documentMilestoneListRepository, documentCategoriesRepository));
        }
        return xmlDocs;
    }

    private StringBuilder buildQueryFromCategories(final Set<String> categories) {
        StringBuilder query = new StringBuilder("d.categoryCode IN (");
        Iterator<String> iterator = categories.iterator();
        while (iterator.hasNext()) {
            String categoryCode = iterator.next();
            query.append("'" + categoryCode + "'");
            if (iterator.hasNext()) {
                query.append(",");
            }
        }
        return query.append(")");
    }

    private StringBuilder buildQueryFromCategoriesUsingId(final Set<String> categories) {
        StringBuilder query = new StringBuilder("d.categoryId IN (SELECT c.id FROM DocumentCategories c WHERE c.categoryCode IN (");
        Iterator<String> iterator = categories.iterator();
        while (iterator.hasNext()) {
            String categoryCode = iterator.next();
            query.append("'" + categoryCode + "'");
            if (iterator.hasNext()) {
                query.append(",");
            }
        }
        return query.append("))");
    }

    public Integer getDocumentCountByPackageName(final String packageName, final Set<String> categories) {
        Integer documentCount = 0;
        for (String categoryCode : categories) {
            documentCount += documentVRepository.getDocumentCountByPackageName(packageName, categoryCode);
        }
        return documentCount;
    }

    @Override
    public eu.europa.ec.leos.repository.model.Package findPackageByDocumentRef(final String documentRefId) throws RepositoryException {
        Package pkg =
                packageRepository.findPackageByDocumentRef(documentRefId)
                        .orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Package.class.getName()));
        return ConversionUtils.buildPackage(pkg, collaboratorsService);
    }
}
