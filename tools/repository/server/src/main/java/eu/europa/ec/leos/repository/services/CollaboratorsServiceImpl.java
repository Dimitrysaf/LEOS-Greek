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
import eu.europa.ec.leos.repository.entities.LeosClients;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.entities.PackageCollaborators;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.Collaborator;
import eu.europa.ec.leos.repository.repositories.CollaboratorsRepository;
import eu.europa.ec.leos.repository.repositories.LeosClientsRepository;
import eu.europa.ec.leos.repository.repositories.PackageCollaboratorsRepository;
import eu.europa.ec.leos.repository.repositories.PackageRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CollaboratorsServiceImpl implements CollaboratorsService {
    private final CollaboratorsRepository collaboratorsRepository;
    private final PackageCollaboratorsRepository packageCollaboratorsRepository;
    private final PackageRepository packageRepository;
    private final LeosClientsRepository leosClientsRepository;

    private static final Logger LOG = LoggerFactory.getLogger(CollaboratorsServiceImpl.class);

    public List<Collaborator> getCollaborators(Package pkg) {
        List<Collaborator> collaboratorList = new ArrayList<>();
        List<PackageCollaborators> pkgCollaborators = packageCollaboratorsRepository.findPackageCollaboratorsByPkg(pkg);
        for (PackageCollaborators pkgCollaborator : pkgCollaborators) {
            collaboratorList.add(
                    new Collaborator(
                            pkgCollaborator.getCollaborator().getCollaboratorName(),
                            pkgCollaborator.getCollaborator().getRole(),
                            pkgCollaborator.getCollaborator().getOrganization(),
                            pkgCollaborator.getCollaborator().getLeosClients()!=null?pkgCollaborator.getCollaborator().getLeosClients().getName():null
                    )
            );
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
                Optional<Collaborators> collaborator = findCollaborator(c);
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

    private Optional<Collaborators> findCollaborator(Collaborator c) {
        return  (c.getLeosClientId() != null) ?
                collaboratorsRepository.findCollaboratorByNameRoleAndOrganizationAndLeosClient(
                c.getLogin(),
                c.getRole(),
                c.getEntity(),
                c.getLeosClientId()):
                collaboratorsRepository.findCollaboratorByNameRoleAndOrganization(
                        c.getLogin(),
                        c.getRole(),
                        c.getEntity())
        ;
    }


    public List<BigDecimal> findDocumentsByCollaboratorName(final String userId, final String role) {
        List<BigDecimal> packageIdsList = new ArrayList<>();
        List<BigDecimal> packageIdsListBD = packageCollaboratorsRepository.findPackageIdByCollaboratorNameAndRole(userId, role);
        for (BigDecimal packageIdBD : packageIdsListBD) {
            packageIdsList.add(packageIdBD);
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
        //Extend the search to wor
        final Optional<LeosClients> leosClient = (c.getLeosClientId()!=null)?leosClientsRepository.findByName(c.getLeosClientId()):Optional.empty();
        Optional<Collaborators> collaborator = findCollaborator(c);
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
            if (leosClient.isPresent()) {
                collaborators.setLeosClients(leosClient.get());
            }
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
            Optional<Collaborators> prevCollaborators = findCollaborator(previousC);
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
        savePackageCollaborator(pkgCollaborator);
    }

    public void savePackageCollaborator(PackageCollaborators pkgCollaborator) {
        Optional<PackageCollaborators> pkgC =
                packageCollaboratorsRepository.findPackageCollaboratorsByPkgIdAndCollaboratorId(pkgCollaborator.getPackage().getId(),
                        pkgCollaborator.getCollaborator().getId());
        if (!pkgC.isPresent() || pkgCollaborator.getId() != null) {
            LOG.info(pkgCollaborator.getId() != null ? "Updating" : "Creating" + " package collaborator {} for package {}",
                    pkgCollaborator.getCollaborator().getCollaboratorName(), pkgCollaborator.getPackage().getName());
            packageCollaboratorsRepository.save(pkgCollaborator);
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
