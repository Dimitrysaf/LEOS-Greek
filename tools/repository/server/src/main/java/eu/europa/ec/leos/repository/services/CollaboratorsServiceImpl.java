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

import eu.europa.ec.leos.repository.entities.Collaborators;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.entities.PackageCollaborators;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.Collaborator;
import eu.europa.ec.leos.repository.repositories.CollaboratorsRepository;
import eu.europa.ec.leos.repository.repositories.PackageCollaboratorsRepository;
import eu.europa.ec.leos.repository.repositories.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class CollaboratorsServiceImpl implements CollaboratorsService {
    private final CollaboratorsRepository collaboratorsRepository;
    private final PackageCollaboratorsRepository packageCollaboratorsRepository;
    private final PackageRepository packageRepository;

    @Autowired
    public CollaboratorsServiceImpl(CollaboratorsRepository collaboratorsRepository, PackageCollaboratorsRepository packageCollaboratorsRepository, PackageRepository packageRepository) {
        this.collaboratorsRepository = collaboratorsRepository;
        this.packageCollaboratorsRepository = packageCollaboratorsRepository;
        this.packageRepository = packageRepository;
    }

    public List<Collaborator> getCollaborators(Package pkg) {
        List<Collaborator> collaboratorList = new ArrayList<>();
        List<PackageCollaborators> pkgCollaborators = packageCollaboratorsRepository.findPackageCollaboratorsByPkg(pkg);
        for (PackageCollaborators pkgCollaborator : pkgCollaborators) {
            collaboratorList.add(new Collaborator(pkgCollaborator.getCollaborator().getCollaboratorName(),
                    pkgCollaborator.getCollaborator().getRole(), pkgCollaborator.getCollaborator().getOrganization()));
        }
        return collaboratorList;
    }

    public List<Collaborator> getCollaborators(BigDecimal pkgId) {
        Optional<Package> pkg = packageRepository.findById(pkgId);
        if (pkg.isPresent()) {
            return getCollaborators(pkg.get());
        }
        return Arrays.asList();
    }

    public void updateCollaborators(Package pkg, List<Collaborator> collaboratorList, String userId) {
        List<Collaborator> currentCollaboratorList = getCollaborators(pkg);
        for (Collaborator c : collaboratorList) {
            if (currentCollaboratorList.contains(c)) {
                Collaborator foundC = currentCollaboratorList.get(currentCollaboratorList.indexOf(c));
                if (!foundC.getRole().equals(c.getRole())) {
                    updateCollaborator(pkg, c, foundC, userId);
                }
            } else {
                updateCollaborator(pkg, c, null, userId);
            }
        }
        for (Collaborator c : currentCollaboratorList) {
            if (!collaboratorList.contains(c)) {
                Optional<Collaborators> collaborator = collaboratorsRepository.findCollaboratorByNameRoleAndOrganization(c.getLogin(), c.getRole(),
                        c.getEntity());
                if (collaborator.isPresent()) {
                    Optional<PackageCollaborators> pkgCollaborators =
                            packageCollaboratorsRepository.findPackageCollaboratorsByPkgAndCollaborator(pkg, collaborator.get());
                    if (pkgCollaborators.isPresent()) {
                        packageCollaboratorsRepository.delete(pkgCollaborators.get());
                    }
                }
            }
        }
    }

    public List<String> findDocumentsByUserId(final String userId, final String role) {
        List<String> packageIdsList = new ArrayList<>();
        List<BigDecimal> packageIdsListBD = packageCollaboratorsRepository.findPackageIdByCollaboratorNameAndRole(userId, role);
        for (BigDecimal packageIdBD : packageIdsListBD) {
            packageIdsList.add(packageIdBD.toString());
        }
        return packageIdsList;
    }

    public void updateCollaborators(String pkgId, List<Collaborator> collaboratorList, String userId) {
        Optional<Package> pkg = packageRepository.findById(BigDecimal.valueOf(Long.parseLong(pkgId)));
        if (pkg.isPresent()) {
            updateCollaborators(pkg.get(), collaboratorList, userId);
        }
    }

    private void updateCollaborator(Package pkg, Collaborator c, Collaborator previousC, String userId) {
        LocalDateTime creationDate = LocalDateTime.now();
        Optional<Collaborators> collaborator = collaboratorsRepository.findCollaboratorByNameRoleAndOrganization(c.getLogin(), c.getRole(),
                c.getEntity());
        Collaborators updatedCollaborators;
        if (!collaborator.isPresent()) {
            Collaborators collaborators = new Collaborators();
            collaborators.setAuditCBy(userId);
            collaborators.setAuditCDate(creationDate);
            collaborators.setAuditLastMBy(userId);
            collaborators.setAuditLastMDate(creationDate);
            collaborators.setCollaboratorName(c.getLogin());
            collaborators.setOrganization(c.getEntity());
            collaborators.setRole(c.getRole());
            updatedCollaborators = collaboratorsRepository.save(collaborators);
        } else {
            updatedCollaborators = collaborator.get();
        }
        PackageCollaborators pkgCollaborator = new PackageCollaborators();
        pkgCollaborator.setAuditCBy(userId);
        pkgCollaborator.setAuditCDate(creationDate);
        pkgCollaborator.setAuditLastMBy(userId);
        pkgCollaborator.setAuditLastMDate(creationDate);
        if (previousC != null) {
            Optional<Collaborators> prevCollaborators = collaboratorsRepository.findCollaboratorByNameRoleAndOrganization(previousC.getLogin(),
                    previousC.getRole(), previousC.getEntity());
            if (prevCollaborators.isPresent()) {
                Optional<PackageCollaborators> pkgCollaborators =
                        packageCollaboratorsRepository.findPackageCollaboratorsByPkgAndCollaborator(pkg, prevCollaborators.get());
                if (pkgCollaborators.isPresent()) {
                    pkgCollaborator.setId(pkgCollaborators.get().getId());
                    pkgCollaborator.setAuditCBy(pkgCollaborators.get().getAuditCBy());
                    pkgCollaborator.setAuditCDate(pkgCollaborators.get().getAuditCDate());
                }
            }
        }
        pkgCollaborator.setPackage(pkg);
        pkgCollaborator.setCollaborator(updatedCollaborators);
        packageCollaboratorsRepository.save(pkgCollaborator);
    }

    public void removeCollaborator(final String userId, final String entity, final String role) throws RepositoryException {
        Optional<Collaborators> collaborators = collaboratorsRepository.findCollaboratorByNameRoleAndOrganization(userId, role, entity);
        if (collaborators.isPresent()) {
            List<PackageCollaborators> pkgCollaborators = packageCollaboratorsRepository.findPackageCollaboratorsByCollaborator(collaborators.get());
            if (pkgCollaborators.isEmpty()) {
                collaboratorsRepository.delete(collaborators.get());
            } else {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_DELETING, "Still linked packages to this collaborator");
            }
        } else {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_DELETING, "Such Collaborator doesn't exist");
        }
    }

    public void removeCollaborator(final String id) throws RepositoryException {
        Optional<Collaborators> collaborators = collaboratorsRepository.findById(new BigDecimal(Long.parseLong(id)));
        if (collaborators.isPresent()) {
            List<PackageCollaborators> pkgCollaborators = packageCollaboratorsRepository.findPackageCollaboratorsByCollaborator(collaborators.get());
            if (pkgCollaborators.isEmpty()) {
                collaboratorsRepository.delete(collaborators.get());
            } else {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_DELETING, "Still linked packages to this collaborator");
            }
        } else {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_DELETING, "Such Collaborator doesn't exist");
        }
    }

    public void removeCollaborators(final Package pkg) throws RepositoryException {
        try {
            List<PackageCollaborators> pkgCollaborators = packageCollaboratorsRepository.findPackageCollaboratorsByPkg(pkg);
            packageCollaboratorsRepository.deleteAll(pkgCollaborators);
        } catch(Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_DELETING, "Such Collaborator doesn't exist");
        }
    }
}
