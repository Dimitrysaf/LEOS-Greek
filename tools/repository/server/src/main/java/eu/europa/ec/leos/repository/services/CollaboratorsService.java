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

import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.Collaborator;

import java.math.BigDecimal;
import java.util.List;

public interface CollaboratorsService {
    List<Collaborator> getCollaborators(Package pkg);

    List<Collaborator> getCollaborators(BigDecimal pkgId);

    void updateCollaborators(Package pkg, List<Collaborator> collaboratorList, String userId);

    void updateCollaborators(String pkgId, List<Collaborator> collaboratorList, String userId);

    List<BigDecimal> findDocumentsByCollaboratorName(final String userId, final String role);

    void removeCollaborator(final String userId, final String entity, final String role) throws RepositoryException;

    void removeCollaborator(final String id) throws RepositoryException;

    void removeCollaborators(Package pkg) throws RepositoryException;
}
