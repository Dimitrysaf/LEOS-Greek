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

import eu.europa.ec.leos.repository.entities.Collaborators;
import eu.europa.ec.leos.repository.entities.DocumentV;
import eu.europa.ec.leos.repository.entities.LinkedPackage;
import eu.europa.ec.leos.repository.entities.MilestoneV;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.entities.PackageCollaborators;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.interfaces.PackagesFavorites;
import eu.europa.ec.leos.repository.interfaces.PackagesRecentlyChanged;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.repositories.CollaboratorsRepository;
import eu.europa.ec.leos.repository.repositories.DocumentContentRepository;
import eu.europa.ec.leos.repository.repositories.DocumentMilestoneListRepository;
import eu.europa.ec.leos.repository.repositories.DocumentMilestoneRepository;
import eu.europa.ec.leos.repository.repositories.DocumentPropertyValuesRepository;
import eu.europa.ec.leos.repository.repositories.DocumentVRepository;
import eu.europa.ec.leos.repository.repositories.LinkedPackagedRepository;
import eu.europa.ec.leos.repository.repositories.PackageCollaboratorsRepository;
import eu.europa.ec.leos.repository.repositories.PackageRepository;
import eu.europa.ec.leos.repository.utils.ConversionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class PackageServiceImpl implements PackageService {

    private static final Logger LOG = LoggerFactory.getLogger(PackageServiceImpl.class);

    private final DocumentVRepository documentVRepository;
    private final PackageRepository packageRepository;
    private final LinkedPackagedRepository linkedPackagedRepository;
    private final CollaboratorsRepository collaboratorsRepository;
    private final PackageCollaboratorsRepository packageCollaboratorsRepository;
    private final DocumentPropertyValuesRepository documentPropertyValuesRepository;
    private final DocumentContentRepository documentContentRepository;
    private final CollaboratorsService collaboratorsService;
    private final DocumentMilestoneListRepository documentMilestoneListRepository;
    private final DocumentMilestoneRepository documentMilestoneRepository;
    private final DocumentService documentService;
    private final EntityManager entityManager;

    @Autowired
    public PackageServiceImpl(DocumentVRepository documentVRepository, PackageRepository packageRepository, LinkedPackagedRepository linkedPackagedRepository,
                              CollaboratorsRepository collaboratorsRepository, PackageCollaboratorsRepository packageCollaboratorsRepository,
                              DocumentPropertyValuesRepository documentPropertyValuesRepository,
                              DocumentContentRepository documentContentRepository, CollaboratorsService collaboratorsService,
                              DocumentMilestoneListRepository documentMilestoneListRepository, DocumentMilestoneRepository documentMilestoneRepository,
                              EntityManager entityManager,
                              @Lazy DocumentService documentService) {
        this.documentVRepository = documentVRepository;
        this.packageRepository = packageRepository;
        this.linkedPackagedRepository = linkedPackagedRepository;
        this.collaboratorsRepository = collaboratorsRepository;
        this.packageCollaboratorsRepository = packageCollaboratorsRepository;
        this.documentContentRepository = documentContentRepository;
        this.documentPropertyValuesRepository = documentPropertyValuesRepository;
        this.collaboratorsService = collaboratorsService;
        this.documentMilestoneListRepository = documentMilestoneListRepository;
        this.documentMilestoneRepository = documentMilestoneRepository;
        this.documentService = documentService;
        this.entityManager = entityManager;
    }

    @Transactional(rollbackFor = Exception.class)
    public eu.europa.ec.leos.repository.model.Package createPackage(final String name, final Boolean isCloned, final String clonedPackageName,
            String language, Boolean isTranslated, final String userId) {
        Package pkg = new Package();
        pkg.setObjectId(new BigDecimal(0));
        pkg.setName(name);
        pkg.setLanguage(language);
        pkg.setIsTranslated(isTranslated);
        pkg.setAuditCBy(userId);
        pkg.setAuditCDate(LocalDateTime.now());
        pkg.setAuditLastMBy(userId);
        pkg.setAuditLastMDate(LocalDateTime.now());
        return new eu.europa.ec.leos.repository.model.Package(packageRepository.save(pkg));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createLinkedPackage(BigDecimal originPkgId, BigDecimal linkedPkgId) {
        LinkedPackage pkg = new LinkedPackage();
        pkg.setPackageId(originPkgId);
        pkg.setLinkedPackageId(linkedPkgId);
        linkedPackagedRepository.save(pkg);
    }

    @Override
    @Cacheable(cacheNames = "getPackageByName", key = "{#name}")
    public eu.europa.ec.leos.repository.model.Package getPackageByName(final String name) throws RepositoryException {
        Package pkg =
                packageRepository.findPackageByName(name).orElse(null);
        return ConversionUtils.buildPackage(pkg, collaboratorsService);
    }

    @Override
    @Cacheable(cacheNames = "getPackageById", key = "#id")
    public eu.europa.ec.leos.repository.model.Package getPackageById(final String id) throws RepositoryException {
        try {
            Optional<Package> pkg = packageRepository.findById(new BigDecimal(id));
            return ConversionUtils.buildPackage(pkg.get(), collaboratorsService);
        } catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Package.class.getName());
        }
    }

    @Override
    public List<eu.europa.ec.leos.repository.model.LinkedPackage> getLinkedPackagesByPkgId(String pkgId) throws RepositoryException {
        List<LinkedPackage> pkgs = linkedPackagedRepository.findByPkgId(new BigDecimal(pkgId));
        return ConversionUtils.buildLinkedPackage(pkgs);
    }

    @Override
    public List<eu.europa.ec.leos.repository.model.LinkedPackage> getLinkedPackagesByLinkedPkgId(String linkedPkgId) throws RepositoryException {
        List<LinkedPackage> pkgs = linkedPackagedRepository.findByLinkedPkgId(new BigDecimal(linkedPkgId));
        return ConversionUtils.buildLinkedPackage(pkgs);
    }

    @Override
    public eu.europa.ec.leos.repository.model.Package findPackageByDocumentVersionId(String versionId) throws RepositoryException {
        try {
            Optional<Package> pkg = packageRepository.findPackageByDocumentVersionId(new BigDecimal(versionId));
            return ConversionUtils.buildPackage(pkg.get(), collaboratorsService);
        } catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Package.class.getName());
        }
    }

    @Transactional(rollbackFor = Exception.class)
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
        StringBuilder docQuery = new StringBuilder("SELECT d FROM DocumentV d WHERE (d.isArchived IS NULL OR d.isArchived = false) AND d.isLatestVersion = true");
        StringBuilder milestoneQuery = new StringBuilder("SELECT d FROM MilestoneV d WHERE 1 = 1");
        if (!descendants) {
            docQuery.append(" AND d.packageName = :packageName");
            milestoneQuery.append(" AND d.packageName = :packageName");
        }
        if (categories != null) {
            docQuery.append(" AND d.categoryCode IN (:categories)");
            milestoneQuery.append(" AND d.categoryCode IN (:categories)");
        }

        Query queryDocs = entityManager.createQuery(docQuery.toString());
        Query queryMilestone = entityManager.createQuery(milestoneQuery.toString());

        if (!descendants) {
            queryDocs.setParameter("packageName", packageName);
            queryMilestone.setParameter("packageName", packageName);
        }
        if (categories != null) {
            queryDocs.setParameter("categories", categories);
            queryMilestone.setParameter("categories", categories);
        }

        List<DocumentV> docs  = queryDocs.getResultList();
        List<MilestoneV> milestones = queryMilestone.getResultList();

        List<LeosDocument> xmlDocs = ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, docs.isEmpty() ?
                        Collections.emptyList() : ConversionUtils.fetchCollaborators(collaboratorsService, docs.get(0).getPackageId()), documentContentRepository, docs
                , fetchContent);
        xmlDocs.addAll(ConversionUtils.buildLegDocuments(milestones, documentMilestoneRepository, documentMilestoneListRepository, fetchContent));
        return xmlDocs;
    }

    public List<LeosDocument> findDocumentsByPackageId(final BigDecimal packageId, final Set<String> categories,
                                                       final boolean allVersion, boolean fetchContent) {
        StringBuilder docQuery = new StringBuilder("SELECT d FROM DocumentV d WHERE (d.isArchived IS NULL OR d.isArchived = false) AND d.packageId = :packageId");
        StringBuilder milestoneQuery = new StringBuilder("SELECT d FROM MilestoneV d WHERE d.packageId = :packageId");
        if (!allVersion && categories != null) {
            docQuery.append(" AND d.isLatestVersion = true");
        }
        if (categories != null) {
            docQuery.append(" AND d.categoryCode IN (:categories)");
            milestoneQuery.append(" AND d.categoryCode IN (:categories)");
        }

        Query queryDocs = entityManager.createQuery(docQuery.toString());
        Query queryMilestone = entityManager.createQuery(milestoneQuery.toString());

        queryDocs.setParameter("packageId", packageId);
        queryMilestone.setParameter("packageId", packageId);
        if (categories != null) {
            queryDocs.setParameter("categories", categories);
            queryMilestone.setParameter("categories", categories);
        }

        List<DocumentV> docs  = queryDocs.getResultList();
        List<MilestoneV> milestones = queryMilestone.getResultList();

        List<LeosDocument> xmlDocs = ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, docs.isEmpty() ?
                        Collections.emptyList() : ConversionUtils.fetchCollaborators(collaboratorsService, docs.get(0).getPackageId()),
                documentContentRepository, docs
                , fetchContent);
        xmlDocs.addAll(ConversionUtils.buildLegDocuments(milestones, documentMilestoneRepository, documentMilestoneListRepository, fetchContent));
        return xmlDocs;
    }

    public long getDocumentCountByPackageName(final String packageName, final Set<String> categories) {
        long documentCount = 0;
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

    public List<PackagesRecentlyChanged> findRecentPackagesForUser(final String userName, final BigDecimal numberOfRecentPackages) throws RepositoryException {
        try {
            return packageRepository.findRecentPackagesForUser(userName, numberOfRecentPackages);
        }
        catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, userName);
        }
    }

    public List<PackagesFavorites> findFavouritePackagesForUser(final String userName) throws RepositoryException {
        try {
            return packageRepository.findFavouritePackagesForUser(userName);
        }
        catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, userName);
        }
    }

    public PackagesFavorites getFavouritePackage(final String userName, final String ref) throws RepositoryException {
        try {
            return packageRepository.getFavouritePackage(userName, ref).orElse(createEmptyObject());
        }
        catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, ref);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public PackagesFavorites toggleFavouritePackage(final String userName, final String ref) throws RepositoryException {
        try {
            Optional<PackagesFavorites> pkg = packageRepository.getFavouritePackage(userName, ref);
            List<Collaborators> listCollaborators = collaboratorsRepository.findCollaboratorByName(userName);
            if (pkg.isPresent() && listCollaborators.size() > 0) {
                for (Collaborators collaborator: listCollaborators) {
                    Optional<PackageCollaborators> packageCollaborators = packageCollaboratorsRepository.findPackageCollaboratorsByPkgIdAndCollaboratorId(
                            pkg.get().getPackageId(), collaborator.getId());
                    if (packageCollaborators.isPresent()) {
                        packageCollaborators.get().setFavorite(new BigDecimal((packageCollaborators.get().getFavorite().intValue() + 1) % 2));
                        packageCollaboratorsRepository.save(packageCollaborators.get());
                    }
                }
            }
            return packageRepository.getFavouritePackage(userName, ref).orElse(createEmptyObject());
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, ref);
        }
    }

    private PackagesFavorites createEmptyObject() {
        return new PackagesFavorites() {
            @Override
            public String getCreationDate() {
                return "";
            }

            @Override
            public BigDecimal getPackageId() {
                return BigDecimal.ZERO;
            }

            @Override
            public BigDecimal getDocumentId() {
                return BigDecimal.ZERO;
            }

            @Override
            public String getRef() {
                return "";
            }

            @Override
            public String getTitle() {
                return "";
            }

            @Override
            public BigDecimal getFavorite() {
                return BigDecimal.ZERO;
            }
        };
    }

}
