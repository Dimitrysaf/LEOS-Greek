/*
 * Copyright 2025 European Union
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

package eu.europa.ec.leos.services.collection;

import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.model.user.ClientSystem;
import eu.europa.ec.leos.services.dto.collaborator.CollaboratorDTO;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

public interface CollaboratorService {

    @PreAuthorize("hasPermission(#proposal, 'CAN_ADD_REMOVE_COLLABORATOR')")
    void addCollaborator(Proposal proposal, String userId, String collaboratorId, String roleName, String connectedEntity, String proposalUrl, String clientSystemId, String displayName);

    @PreAuthorize("hasPermission(#proposal, 'CAN_ADD_REMOVE_COLLABORATOR')")
    void addCollaborator(Proposal proposal, String userId, String collaboratorId, String roleName, String connectedEntity, String proposalUrl, ClientSystem clientSystem, String displayName);

    @PreAuthorize("hasPermission(#proposal, 'CAN_ADD_REMOVE_COLLABORATOR')")
    void removeCollaborator(Proposal proposal, String userId, String roleName, String connectedEntity, String proposalUrl, String clientSystemId);

    @PreAuthorize("hasPermission(#proposal, 'CAN_ADD_REMOVE_COLLABORATOR')")
    void removeCollaborator(Proposal proposal, String userId, String roleName, String connectedEntity, String proposalUrl, ClientSystem clientSystem);

    @PreAuthorize("hasPermission(#proposal, 'CAN_ADD_REMOVE_COLLABORATOR')")
    void editCollaborator(Proposal proposal, String userId, String roleName, String connectedEntity, String proposalUrl);

    List<CollaboratorDTO> getCollaborators(Proposal proposal);

    void syncCollaborators(Proposal proposal);

    boolean isRoleOwner(String roleName);
}
