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
import eu.europa.ec.leos.repository.repositories.DocumentMilestoneListRepository;
import eu.europa.ec.leos.repository.repositories.DocumentPropertyValuesRepository;
import eu.europa.ec.leos.repository.repositories.DocumentVRepository;
import eu.europa.ec.leos.repository.repositories.MilestoneVRepository;
import eu.europa.ec.leos.repository.repositories.PackageRepository;
import eu.europa.ec.leos.repository.repositories.RepositoryRepository;
import eu.europa.ec.leos.repository.utils.ConversionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private final CollaboratorsService collaboratorsService;
    private final DocumentMilestoneListRepository documentMilestoneListRepository;
    private final DocumentCategoriesRepository documentCategoriesRepository;
    private final DocumentService documentService;

    @Autowired
    public PackageServiceImpl(DocumentVRepository documentVRepository, MilestoneVRepository milestoneVRepository, PackageRepository packageRepository,
                              RepositoryRepository repositoryRepository, DocumentPropertyValuesRepository documentPropertyValuesRepository,
                              CollaboratorsService collaboratorsService,
                              DocumentMilestoneListRepository documentMilestoneListRepository, DocumentCategoriesRepository documentCategoriesRepository,
                              @Lazy DocumentService documentService) {
        this.documentVRepository = documentVRepository;
        this.milestoneVRepository = milestoneVRepository;
        this.packageRepository = packageRepository;
        this.repositoryRepository = repositoryRepository;
        this.documentPropertyValuesRepository = documentPropertyValuesRepository;
        this.collaboratorsService = collaboratorsService;
        this.documentMilestoneListRepository = documentMilestoneListRepository;
        this.documentCategoriesRepository = documentCategoriesRepository;
        this.documentService = documentService;
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
            pkg.setIsCloned(isCloned);
            pkg.setClonedPackageName(clonedPackageName);
            pkg.setAuditCBy(userId);
            pkg.setAuditCDate(LocalDateTime.now());
            pkg.setAuditLastMBy(userId);
            pkg.setAuditLastMDate(LocalDateTime.now());
            return new eu.europa.ec.leos.repository.model.Package(packageRepository.save(pkg));
        } else {
            return null;
        }
    }


    public eu.europa.ec.leos.repository.model.Package getPackageByName(final String repositoryId, final String name) throws RepositoryException {
        Package pkg =
                packageRepository.findPackageByName(repositoryId, name).orElse(null);
        return ConversionUtils.buildPackage(pkg, collaboratorsService);
    }

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

    public List<LeosDocument> findDocumentsByPackageName(final String repositoryId, final String packageName, final Set<String> categories,
                                                         final boolean descendants) throws RepositoryException {
        List<DocumentV> docs = new ArrayList<>();
        List<MilestoneV> milestones = new ArrayList<>();
        for (String categoryCode : categories) {
            if (descendants) {
                docs.addAll(documentVRepository.findDocumentsByPackagePathAndCategory(packageName, categoryCode));
                milestones.addAll(milestoneVRepository.findMilestonesByPackagePathAndCategory(packageName, categoryCode));
            } else {
                docs.addAll(documentVRepository.findDocumentsByPackageNameAndCategory(packageName, categoryCode));
                milestones.addAll(milestoneVRepository.findMilestonesByPackageNameAndCategory(packageName, categoryCode));
            }
        }
        List<LeosDocument> xmlDocs = new ArrayList<>();
        for (DocumentV doc : docs) {
            xmlDocs.add(ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, collaboratorsService, doc));
        }
        for (MilestoneV m : milestones) {
            xmlDocs.add(ConversionUtils.buildLegDocument(m, documentMilestoneListRepository, documentCategoriesRepository));
        }
        return xmlDocs;
    }

    public List<LeosDocument> findDocumentsByPackageId(final String packageId, final Set<String> categories,
                                                      final boolean allVersion) {
        List<DocumentV> docs = new ArrayList<>();
        List<MilestoneV> milestones = new ArrayList<>();
        if (categories == null) {
            docs.addAll(documentVRepository.findDocumentsByPackageId(new BigDecimal(Long.parseLong(packageId))));
            milestones.addAll(milestoneVRepository.findMilestonesByPackageId(new BigDecimal(Long.parseLong(packageId))));
        } else {
            if (allVersion) {
                for (String categoryCode : categories) {
                    docs.addAll(documentVRepository.findAllVersionsByPackageIdAndCategoryCode(new BigDecimal(Long.parseLong(packageId)), categoryCode));
                }
            } else {
                for (String categoryCode : categories) {
                    docs.addAll(documentVRepository.findDocumentsByPackageIdAndCategory(new BigDecimal(Long.parseLong(packageId)), categoryCode));
                }
            }
            for (String categoryCode : categories) {
                milestones.addAll(milestoneVRepository.findMilestonesByPackageIdAndCategory(new BigDecimal(Long.parseLong(packageId)), categoryCode));
            }
        }
        List<LeosDocument> xmlDocs = new ArrayList<>();
        for (DocumentV doc : docs) {
            xmlDocs.add(ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, collaboratorsService, doc));
        }
        for (MilestoneV m : milestones) {
            xmlDocs.add(ConversionUtils.buildLegDocument(m, documentMilestoneListRepository, documentCategoriesRepository));
        }
        return xmlDocs;
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
