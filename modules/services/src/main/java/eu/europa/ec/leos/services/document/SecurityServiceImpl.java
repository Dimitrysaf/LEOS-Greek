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
package eu.europa.ec.leos.services.document;


import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.repository.store.WorkspaceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

// REFACTOR SecurityService API should probably be moved into WorkspaceService

@Service
class SecurityServiceImpl implements SecurityService {
    private static final Logger LOG = LoggerFactory.getLogger(SecurityServiceImpl.class);

    private final WorkspaceRepository workspaceRepository;

    SecurityServiceImpl(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    @Override
    public <T extends XmlDocument> T addOrUpdateCollaborator(String id, String userLogin, String userEntity, String authority, String systemClientId, Class<T> type) {
        T document = workspaceRepository.findDocumentById(id, type, true);
        List<Collaborator> collaborators = document.getCollaborators();
        collaborators.add(new Collaborator(userLogin, authority, userEntity, systemClientId));
        return updateCollaborators(document.getMetadata().get().getRef(), id, collaborators, type);
    }

    @Override
    public <T extends XmlDocument> T updateCollaborators(String ref, String id, List<Collaborator> collaborators, Class<T> type) {
        return workspaceRepository.updateDocumentCollaborators(ref, id, collaborators, type);
    }

    @Override
    public <T extends XmlDocument> T removeCollaborator(String id, String userLogin, Class<T> type) {
        T document = workspaceRepository.findDocumentById(id, type, true);
        List<Collaborator> collaborators = document.getCollaborators();
        collaborators.removeIf(c -> userLogin.equals(c.getLogin()));
        return workspaceRepository.updateDocumentCollaborators(document.getMetadata().get().getRef(), id, collaborators, type);
    }
}
