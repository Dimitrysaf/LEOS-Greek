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
import eu.europa.ec.leos.repository.entities.Repository;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.XmlDocument;
import eu.europa.ec.leos.repository.repositories.DocumentPropertiesVRepository;
import eu.europa.ec.leos.repository.repositories.DocumentVRepository;
import eu.europa.ec.leos.repository.repositories.PackageRepository;
import eu.europa.ec.leos.repository.repositories.RepositoryRepository;
import eu.europa.ec.leos.repository.utils.ConversionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class PackageServiceImpl implements PackageService {
    private final DocumentVRepository documentVRepository;
    private final PackageRepository packageRepository;
    private final RepositoryRepository repositoryRepository;
    private final DocumentPropertiesVRepository documentPropertiesVRepository;
    private final CollaboratorsService collaboratorsService;

    @Autowired
    public PackageServiceImpl(DocumentVRepository documentVRepository, PackageRepository packageRepository, RepositoryRepository repositoryRepository, DocumentPropertiesVRepository documentPropertiesVRepository, CollaboratorsService collaboratorsService) {
        this.documentVRepository = documentVRepository;
        this.packageRepository = packageRepository;
        this.repositoryRepository = repositoryRepository;
        this.documentPropertiesVRepository = documentPropertiesVRepository;
        this.collaboratorsService = collaboratorsService;
    }

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
            return new eu.europa.ec.leos.repository.model.Package(packageRepository.save(pkg));
        } else {
            return null;
        }
    }

    public void deletePackage(final String packageId) {
        try {
            Optional<Package> pkg = packageRepository.findById(new BigDecimal(Long.valueOf(packageId)));
            if (pkg.isPresent()) {
                packageRepository.delete(pkg.get());
            }
        } catch (NumberFormatException e) {
            return;
        }
    }

    public List<XmlDocument> findDocumentsByPackageName(final String repositoryId, final String packageName, final Set<String> categories,
                                                    final boolean descendants) throws RepositoryException {
        List<DocumentV> docs = new ArrayList<>();
        Optional<Package> pkg = packageRepository.findPackageByName(repositoryId, packageName);
        if (!pkg.isPresent()) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Package.class.getName());
        }
        for (String categoryCode : categories) {
            docs.addAll(documentVRepository.findDocumentsByPackageIdAndCategory(pkg.get().getId(), categoryCode));
        }
        List<XmlDocument> xmlDocs = new ArrayList<>();
        for (DocumentV doc : docs) {
            xmlDocs.add(ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, doc));
        }
        return xmlDocs;
    }

    public List<XmlDocument> findDocumentsByPackageId(final String packageId, final Set<String> categories,
                                                      final boolean allVersion) {
        List<DocumentV> docs = new ArrayList<>();
        if (allVersion) {
            for (String categoryCode : categories) {
                docs.addAll(documentVRepository.findAllVersionsByPackageIdAndCategoryCode(new BigDecimal(Long.parseLong(packageId)), categoryCode));
            }
        } else {
            for (String categoryCode : categories) {
                docs.addAll(documentVRepository.findDocumentsByPackageIdAndCategory(new BigDecimal(Long.parseLong(packageId)), categoryCode));
            }
        }
        List<XmlDocument> xmlDocs = new ArrayList<>();
        for (DocumentV doc : docs) {
            xmlDocs.add(ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, doc));
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
}
