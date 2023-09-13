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
import eu.europa.ec.leos.repository.utils.ConversionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class PackageServiceImpl implements PackageService {
    private final DocumentVRepository documentVRepository;
    private final MilestoneVRepository milestoneVRepository;
    private final PackageRepository packageRepository;
    private final DocumentPropertyValuesRepository documentPropertyValuesRepository;
    private final DocumentContentRepository documentContentRepository;
    private final CollaboratorsService collaboratorsService;
    private final DocumentMilestoneListRepository documentMilestoneListRepository;
    private final DocumentCategoriesRepository documentCategoriesRepository;
    private final DocumentService documentService;
    private final EntityManager entityManager;

    @Autowired
    public PackageServiceImpl(DocumentVRepository documentVRepository, MilestoneVRepository milestoneVRepository, PackageRepository packageRepository,
                              DocumentPropertyValuesRepository documentPropertyValuesRepository,
                              DocumentContentRepository documentContentRepository, CollaboratorsService collaboratorsService,
                              DocumentMilestoneListRepository documentMilestoneListRepository, DocumentCategoriesRepository documentCategoriesRepository,
                              EntityManager entityManager,
                              @Lazy DocumentService documentService) {
        this.documentVRepository = documentVRepository;
        this.milestoneVRepository = milestoneVRepository;
        this.packageRepository = packageRepository;
        this.documentContentRepository = documentContentRepository;
        this.documentPropertyValuesRepository = documentPropertyValuesRepository;
        this.collaboratorsService = collaboratorsService;
        this.documentMilestoneListRepository = documentMilestoneListRepository;
        this.documentCategoriesRepository = documentCategoriesRepository;
        this.documentService = documentService;
        this.entityManager = entityManager;
    }

    @Transactional(rollbackFor = Exception.class)
    @Caching(evict = {
            @CacheEvict(value = "getPackageByName", allEntries = true),
            @CacheEvict(value = "getPackageById", allEntries = true),
            @CacheEvict(value = "findPackageByDocumentRef", allEntries = true)
    })
    public eu.europa.ec.leos.repository.model.Package createPackage(final String name, final Boolean isCloned, final String clonedPackageName, final String userId) {
            Package pkg = new Package();
            pkg.setObjectId(new BigDecimal(0));
            pkg.setName(name);
            pkg.setAuditCBy(userId);
            pkg.setAuditCDate(LocalDateTime.now());
            pkg.setAuditLastMBy(userId);
            pkg.setAuditLastMDate(LocalDateTime.now());
            return new eu.europa.ec.leos.repository.model.Package(packageRepository.save(pkg));
    }

    @Cacheable(cacheNames = "getPackageByName", key = "{#name}")
    public eu.europa.ec.leos.repository.model.Package getPackageByName(final String name) throws RepositoryException {
        Package pkg =
                packageRepository.findPackageByName(name).orElse(null);
        return ConversionUtils.buildPackage(pkg, collaboratorsService);
    }

    @Cacheable(cacheNames = "getPackageById", key = "#id")
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
    @Caching(evict = {
            @CacheEvict(value = "getPackageByName", allEntries = true),
            @CacheEvict(value = "getPackageById", allEntries = true),
            @CacheEvict(value = "findPackageByDocumentRef", allEntries = true)
    })
    public void deletePackage(final String packageName) throws RepositoryException {
        try {
            Optional<Package> pkg = packageRepository.findPackageByName(packageName);
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

    public List<LeosDocument> findDocumentsByPackageName(String packageName, final Set<String> categories,
                                                         final boolean descendants, boolean fetchContent) {
        StringBuilder docQuery = new StringBuilder("SELECT d FROM DocumentV d WHERE d.isLatestVersion = true");
        StringBuilder milestoneQuery = new StringBuilder("SELECT d FROM MilestoneV d WHERE");
        if (!descendants) {
            docQuery.append(String.format(" AND d.packageName = '%s'", packageName));
            milestoneQuery.append(String.format(" d.packageName = '%s'", packageName));
        }
        docQuery.append(" AND");
        if (!descendants && categories != null) {
            milestoneQuery.append(" AND");
        }
        if (categories != null) {
            docQuery.append(" ").append(buildQueryFromCategories(categories));
            milestoneQuery.append(" ").append(buildQueryFromCategories(categories));
        }

        List<DocumentV> docs = entityManager.createQuery(docQuery.toString()).getResultList();
        List<MilestoneV> milestones = entityManager.createQuery(milestoneQuery.toString()).getResultList();
        List<LeosDocument> xmlDocs = ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, docs.isEmpty() ?
                Arrays.asList() : ConversionUtils.fetchCollaborators(collaboratorsService, docs.get(0).getPackageId()), documentContentRepository, docs
                , fetchContent);
        for (MilestoneV m : milestones) {
            xmlDocs.add(ConversionUtils.buildLegDocument(m, documentMilestoneListRepository, documentCategoriesRepository));
        }
        return xmlDocs;
    }

    public List<LeosDocument> findDocumentsByPackageId(final String packageId, final Set<String> categories,
                                                      final boolean allVersion, boolean fetchContent) {
        StringBuilder docQuery = new StringBuilder(String.format("SELECT d FROM DocumentV d WHERE d.packageId = %s", packageId));
        if (!allVersion && categories != null) {
            docQuery.append(" AND d.isLatestVersion = true");
        }
        StringBuilder milestoneQuery = new StringBuilder(String.format("SELECT d FROM MilestoneV d WHERE d.packageId = %s", packageId));
        if (categories!=null) {
            docQuery.append(" AND ").append(buildQueryFromCategories(categories));
            milestoneQuery.append(" AND ").append(buildQueryFromCategories(categories));
        }

        List<DocumentV> docs = entityManager.createQuery(docQuery.toString()).getResultList();
        List<MilestoneV> milestones = entityManager.createQuery(milestoneQuery.toString()).getResultList();
        List<LeosDocument> xmlDocs = ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, docs.isEmpty() ?
                        Arrays.asList() : ConversionUtils.fetchCollaborators(collaboratorsService, docs.get(0).getPackageId()),
                documentContentRepository, docs
                , fetchContent);
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

    public long getDocumentCountByPackageName(final String packageName, final Set<String> categories) {
        long documentCount = 0;
        for (String categoryCode : categories) {
            documentCount += documentVRepository.getDocumentCountByPackageName(packageName, categoryCode);
        }
        return documentCount;
    }

    @Override
    @Cacheable(cacheNames = "findPackageByDocumentRef", key = "#documentRefId")
    public eu.europa.ec.leos.repository.model.Package findPackageByDocumentRef(final String documentRefId) throws RepositoryException {
        Package pkg =
                packageRepository.findPackageByDocumentRef(documentRefId)
                        .orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Package.class.getName()));
        return ConversionUtils.buildPackage(pkg, collaboratorsService);
    }
}
