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

import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.LinkedPackage;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.notification.collaborators.AddCollaborator;
import eu.europa.ec.leos.model.notification.collaborators.CollaboratorEmailNotification;
import eu.europa.ec.leos.model.notification.collaborators.EditCollaborator;
import eu.europa.ec.leos.model.notification.collaborators.RemoveCollaborator;
import eu.europa.ec.leos.model.user.ClientSystem;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.model.user.Entity;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.permissions.Role;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMap;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMapHelper;
import eu.europa.ec.leos.services.document.SecurityService;
import eu.europa.ec.leos.services.dto.collaborator.CollaboratorDTO;
import eu.europa.ec.leos.services.exception.CollaboratorException;
import eu.europa.ec.leos.services.notification.NotificationService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.services.utils.CollaboratorUtils;
import eu.europa.ec.leos.vo.response.LeosClientResponse;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Service
@AllArgsConstructor
public class CollaboratorServiceImpl implements CollaboratorService {
    private static final Logger LOG = LoggerFactory.getLogger(CollaboratorServiceImpl.class);

    private final NotificationService notificationService;
    private final MessageHelper messageHelper;
    private final PackageService packageService;
    private final SecurityService securityService;
    private final UserService userService;
    private final LeosPermissionAuthorityMap leosPermissionAuthorityMap;
    private final LeosPermissionAuthorityMapHelper authorityMapHelper;
    private final LeosClientService leosClientService;

    private final static String ROLE_OWNER = "OWNER";

    @Override
    public List<CollaboratorDTO> getCollaborators(Proposal proposal) {
        LOG.trace("Getting collaborators for proposal {}", proposal);
        return proposal.getCollaborators().stream()
                .map(collaborator -> createCollaboratorDTO(collaborator, this::getUser))
                .filter(Optional::isPresent)
                .map(Optional::get).toList();
    }

    private Optional<CollaboratorDTO> createCollaboratorDTO(Collaborator collaborator, Function<String, User> converter) {
        String login = collaborator.getLogin();
        String roleName = collaborator.getRole();
        String entityName = collaborator.getEntity();
        String clientId = collaborator.getLeosClientId();
        try {
            User user = converter.apply(login);
            return Optional.of(new CollaboratorDTO(login, user.getName(), roleName, pickFromUserEntitiesByName(user, entityName), getLeosClientSystem(clientId)));
        } catch (Exception e) {
            return Optional.of(new CollaboratorDTO(login, collaborator.getDisplayName(), roleName, new Entity(null, entityName, entityName, false), getLeosClientSystem(clientId)));
        }
    }

    private Entity pickFromUserEntitiesByName(final User user, final String entityName) {
        if (user.isEntityUser()) {
            return user.getEntities().stream()
                    .filter(entity -> entity.getName().equalsIgnoreCase(entityName))
                    .findFirst()
                    .orElse(null);
        } else {
            return user.getEntities().stream()
                    .filter(entity -> entity.getOrganizationName().equalsIgnoreCase(entityName) ||
                            entity.getName().equalsIgnoreCase(entityName)) // Checked entity name for compatibility with old collaborators
                    .findFirst()
                    .orElse(null);
        }
    }

    @Override
    public void addCollaborator(Proposal proposal, String userId, String collaboratorId, String roleName, String connectedEntity,
                                String proposalUrl, String clientSystemId, String displayName) {
        final ClientSystem leosClient = this.getLeosClientSystem(clientSystemId);
        this.addCollaborator(proposal, userId, collaboratorId, roleName, connectedEntity, proposalUrl, leosClient, displayName);
    }

    @Override
    public void addCollaborator(Proposal proposal, String userId, String collaboratorId, String roleName, String connectedEntity,
                                String proposalUrl, ClientSystem clientSystem, String displayName) {
        final User user = getUser(userId);
        final User collaborator = getUser(collaboratorId);
        final Role role = getRole(roleName);
        final String entity = getEntity(connectedEntity, collaborator);
        final String leosClientId = (clientSystem != null) ? clientSystem.getClientId() : null;

        if (isCollaboratorPresent(proposal, collaborator)) {
            throw new CollaboratorException(messageHelper.getMessage("collaborator.message.user.present", collaborator.getLogin(), role.getName(), entity));
        }

        List<LeosPackage> packages = getLinkedPackagesForProposal(proposal);
        packages.forEach(p -> addCollaborator(user, collaborator, role, entity, leosClientId, p));

        proposal.getCollaborators().add(new Collaborator(collaboratorId, role.getName(), entity, leosClientId, displayName));
        if (StringUtils.isEmpty(leosClientId)) {
            sendNotification(new AddCollaborator(collaborator, entity, role.getName(), proposal.getId(), proposalUrl));
        }
        LOG.info("Collaborator '{}', role '{}', entity '{}' added to proposal {}", collaboratorId, role.getName(), entity, proposal.getOriginRef());
    }

    @Override
    public void removeCollaborator(Proposal proposal, String userId, String roleName, String connectedEntity, String proposalUrl, String clientSystemId) {
        final ClientSystem leosClient = this.getLeosClientSystem(clientSystemId);
        this.removeCollaborator(proposal, userId, roleName, connectedEntity, proposalUrl, leosClient);
    }

    @Override
    public void removeCollaborator(Proposal proposal, String userId, String roleName, String connectedEntity, String proposalUrl, ClientSystem clientSystem) {
        LOG.trace("Removing collaborator...{}, with authority {}", userId, roleName);
        User u;
        try {
            u = getUser(userId);
        } catch (CollaboratorException ex) {
            u = new User(null, userId, null, new ArrayList<>(), null, new ArrayList<>());
        }
        final User user = u;
        final Role role = getRole(roleName);
        String e;
        try {
            e = getEntity(connectedEntity, user);
        } catch (CollaboratorException ex) {
            e = null;
        }
        final String entity = e;
        final String leosClientId = (clientSystem != null) ? clientSystem.getClientId() : null;

        if (!isCollaboratorPresent(proposal, user, leosClientId)) {
            throw new CollaboratorException(messageHelper.getMessage("collaborator.message.user.notPresent", user.getLogin(), messageHelper.getMessage(role.getMessageKey()), entity));
        }
        if (!hasCollaboratorDifferentRole(proposal, user, role)) {
            throw new CollaboratorException(messageHelper.getMessage("collaborator.message.role.different", user.getLogin(), messageHelper.getMessage(role.getMessageKey())));
        }
        if (isCollaboratorLastOwner(proposal, user)) {
            throw new CollaboratorException(messageHelper.getMessage("collaborator.message.last.owner.removed", messageHelper.getMessage(ROLE_OWNER)));
        }

        List<LeosPackage> packages = getLinkedPackagesForProposal(proposal);
        packages.forEach(p -> deleteCollaborator(user, role, entity, leosClientId, p));

        if (entity != null) {
            proposal.getCollaborators().remove(new Collaborator(user.getLogin(), role.getName(), entity, leosClientId));
        } else {
            proposal.getCollaborators().removeIf(c -> c.getLogin().equals(user.getLogin()));
        }
        if (StringUtils.isEmpty(leosClientId)) {
            sendNotification(new RemoveCollaborator(user, entity, role.getName(), proposal.getId(), proposalUrl));
        }
        LOG.info("Collaborator '{}', role '{}', entity '{}' removed from proposal {}", user.getLogin(), role.getName(), entity, proposal.getOriginRef());
    }

    @Override
    public void editCollaborator(Proposal proposal, String userId, String roleName, String connectedEntity, String proposalUrl) {
        final User user = getUser(userId);
        final Role newRole = getRole(roleName);
        final String entity = getEntity(connectedEntity, user);

        List<Proposal> documents = getLinkedProposalsForProposal(proposal);
        String collaboratorRole = documents.get(0).getCollaborators().stream()
                .filter(c -> user.getLogin().equals(c.getLogin()))
                .map(Collaborator::getRole)
                .findFirst()
                .orElse(null);
        if (collaboratorRole == null) {
            LOG.warn("User '{}' does not have any role for Entity '{}'", userId, entity);
            throw new CollaboratorException(messageHelper.getMessage("collaborator.message.role.notFoundForEntity", messageHelper.getMessage(roleName), messageHelper.getMessage(entity)));
        }
        if (isCollaboratorLastOwner(documents.get(0), user)) {
            LOG.warn("Should be at least one user with role {}", ROLE_OWNER);
            throw new CollaboratorException(messageHelper.getMessage("collaborator.message.last.owner.edited", messageHelper.getMessage(ROLE_OWNER)));
        }

        Role oldRole = authorityMapHelper.getRoleFromListOfRoles(collaboratorRole);
        LOG.trace("Updating collaborator {}, role {} with new role {}", userId, oldRole.getName(), roleName);
        documents.forEach(doc -> updateCollaborators(user, newRole, entity, null, doc, false));

        sendNotification(new EditCollaborator(user, entity, newRole.getName(), proposal.getId(), proposalUrl));
        LOG.info("Collaborator '{}', oldRole '{}', entity '{}' updated new role to '{}' for proposal {}", user.getLogin(), oldRole.getName(), entity, newRole.getName(), proposal.getOriginRef());
    }

    @Override
    public void syncCollaborators(Proposal proposal) {
        LOG.trace("Sync collaborators...");
        List<Collaborator> collaborators = proposal.getCollaborators();
        List<Proposal> documents = getLinkedProposalsForProposal(proposal);
        documents.forEach(doc -> {
            updateCollaborators(doc, collaborators);
        });
    }

    private User getUser(String userId) {
        if (StringUtils.isEmpty(userId)) {
            throw new CollaboratorException(messageHelper.getMessage("collaborator.message.user.noId"));
        }
        final String DOMAIN_SEPARATOR = "/";
        if (userId.contains(DOMAIN_SEPARATOR)) {
            userId = userId.substring(userId.lastIndexOf(DOMAIN_SEPARATOR) + 1);
        }
        User user = userService.getUser(userId);
        if (user == null) {
            LOG.warn("User '{}' not found on user repository!", userId);
            throw new CollaboratorException(messageHelper.getMessage("collaborator.message.user.notFound", userId));
        }
        return user;
    }

    private ClientSystem getLeosClientSystem(String clientSystemId) {
        ClientSystem clientSystem = null;
        if (!StringUtils.isEmpty(clientSystemId)) {
            final Optional<LeosClientResponse> leosClient = leosClientService.getLeosClient(clientSystemId);
            if (leosClient.isPresent()) {
                final LeosClientResponse leosClientResponse = leosClient.get();
                clientSystem = ClientSystem.builder().clientId(leosClientResponse.getName()).displayName(leosClientResponse.getDisplayName()).build();
            }
        }
        return clientSystem;
    }

    private String getEntity(String connectedDG, User user) {
        if ((user.getEntities() == null) || user.getEntities().isEmpty()) {
            LOG.error("User '{}' has no Entity associated", user.getLogin());
            throw new CollaboratorException(messageHelper.getMessage("collaborator.message.user.noEntity", user.getLogin()));
        }
        Entity userEntity = user.getEntities().stream()
                .filter(entity -> entity.getOrganizationName().equalsIgnoreCase(StringUtils.defaultIfEmpty(connectedDG, entity.getOrganizationName())) ||
                        entity.getName().equalsIgnoreCase(StringUtils.defaultIfEmpty(connectedDG, entity.getName())))
                .findFirst()
                .orElse(null);
        if (userEntity == null) {
            LOG.error("User '{}' has no Entity with name '{}'", user.getLogin(), connectedDG);
            throw new CollaboratorException(messageHelper.getMessage("collaborator.message.user.unknownEntity", user.getLogin(), connectedDG));
        }
        return user.isEntityUser() ? userEntity.getName() : userEntity.getOrganizationName();
    }

    private Role getRole(String roleName) {
        if (StringUtils.isEmpty(roleName)) {
            throw new CollaboratorException(messageHelper.getMessage("collaborator.message.role.null"));
        }
        Role role = leosPermissionAuthorityMap.getAllRoles()
                .stream()
                .filter(r -> roleName.equals(r.getName()))
                .findFirst()
                .orElse(null);
        if (role == null) {
            LOG.warn("Role '{}' not found", roleName);
            throw new CollaboratorException(messageHelper.getMessage("collaborator.message.role.notFound", roleName));
        }
        if (!role.isCollaborator()) {
            LOG.warn("Role {}, is not a contributor", roleName);
            throw new CollaboratorException(messageHelper.getMessage("collaborator.message.role.notContributor", roleName));
        }
        return role;
    }

    public boolean isRoleOwner(String roleName) {
        try {
            return this.getRole(roleName).getName().equalsIgnoreCase(ROLE_OWNER);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isCollaboratorPresent(XmlDocument document, User user, String leosClientId) {
        return document.getCollaborators().stream()
                .anyMatch(collaborator -> collaborator.getLogin().equals(user.getLogin())
                        && (CollaboratorUtils.matchLeosClientId(collaborator, leosClientId)));
    }

    private boolean isCollaboratorPresent(XmlDocument document, User user) {
        return document.getCollaborators().stream()
                .anyMatch(collaborator -> collaborator.getLogin().equals(user.getLogin()));
    }

    private boolean hasCollaboratorDifferentRole(XmlDocument document, User user, Role role) {
        List<Collaborator> collaborators = document.getCollaborators();
        return collaborators.stream()
                .filter(collaborator -> collaborator.getLogin().equals(user.getLogin()))
                .anyMatch(collaborator -> role.getName().equals(collaborator.getRole()));
    }

    private boolean isCollaboratorLastOwner(XmlDocument document, User user) {
        return document.getCollaborators().stream()
                .noneMatch(c -> c.getRole().equals("OWNER") && !c.getLogin().equals(user.getLogin()));
    }

    private void sendNotification(CollaboratorEmailNotification collaboratorEmailNotification) {
        try {
            LOG.trace("Sending email to updated collaborator user {}", collaboratorEmailNotification.getRecipient().getLogin());
            notificationService.sendNotification(collaboratorEmailNotification);
        } catch (Exception e) {
            LOG.warn("Unexpected error occurred while sending notification to user {}. Error: {}", collaboratorEmailNotification.getRecipient().getLogin(), e.getMessage(), e);
//            throw new SendNotificationException(
//                    "Unexpected error occurred while sending notification to user " + collaboratorEmailNotification.getRecipient().getLogin(), e);
        }
    }

    private List<Proposal> getLinkedProposalsForProposal(Proposal proposal) {
        List<Proposal> docsList = new ArrayList<>();
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        docsList.add(proposal);
        List<LinkedPackage> linkedPackages = packageService.findLinkedPackagesByPackageId(leosPackage.getId());
        for (LinkedPackage pkg : linkedPackages) {
            LeosPackage linkedPackage = packageService.findPackageByPackageId(pkg.getLinkedPackageId());
            if (linkedPackage.getTranslated()) {
                docsList.addAll(packageService.findDocumentsByPackagePath(linkedPackage.getPath(), Proposal.class, false));
            }
        }
        return docsList;
    }

    private List<LeosPackage> getLinkedPackagesForProposal(Proposal proposal) {
        List<LeosPackage> docsList = new ArrayList<>();
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        docsList.add(leosPackage);
        List<LinkedPackage> linkedPackages = packageService.findLinkedPackagesByPackageId(leosPackage.getId());
        for (LinkedPackage pkg : linkedPackages) {
            LeosPackage linkedPackage = packageService.findPackageByPackageId(pkg.getLinkedPackageId());
            if (linkedPackage.getTranslated()) {
                docsList.add(linkedPackage);
            }
        }
        return docsList;
    }

    private void updateCollaborators(User user, Role role, String selectedEntity, String systemClientId, XmlDocument doc, boolean isRemoveAction) {
        Validate.notNull(doc, "The document must not be null!");
        Validate.notNull(user, "The user must not be null!");
        List<Collaborator> collaborators = doc.getCollaborators();

        if (collaborators != null) {
            collaborators.removeIf(c->CollaboratorUtils.matchUserAndEntityAndLeosClientId(c, user, selectedEntity, systemClientId));
            if (!isRemoveAction) {
                //pick selectedEntity or first found entity if no selectedEntity defined
                String newEntity = selectedEntity;
                if (newEntity == null) {
                    newEntity = user.getEntities().get(0) != null ? user.getEntities().get(0).getName() : null;
                }
                collaborators.add(new Collaborator(user.getLogin(), role.getName(), newEntity, systemClientId));
            }
            securityService.updateCollaborators(doc.getMetadata().get().getRef(), doc.getId(), collaborators, doc.getClass());
        }
    }

    private void addCollaborator(User user, User collaborator, Role role, String entity, String systemClientId, LeosPackage leosPackage) {
        Validate.notNull(leosPackage, "The package must not be null!");
        Validate.notNull(user, "The user must not be null!");

        List<Collaborator> collaborators = Collections.singletonList(new Collaborator(collaborator.getLogin(), role.getName(), entity, systemClientId, collaborator.getName()));
        securityService.addCollaborators(leosPackage.getId(), user.getLogin(), collaborators);
    }

    private void deleteCollaborator(User user, Role role, String entity, String systemClientId, LeosPackage leosPackage) {
        Validate.notNull(leosPackage, "The package must not be null!");
        Validate.notNull(user, "The user must not be null!");

        List<Collaborator> collaborators = Collections.singletonList(new Collaborator(user.getLogin(), role.getName(), entity, systemClientId));
        securityService.deleteCollaborators(leosPackage.getId(), collaborators);
    }

    private void updateCollaborators(XmlDocument doc, List<Collaborator> collaborators) {
        Validate.notNull(doc, "The document must not be null!");
        Validate.notNull(collaborators, "The collaborators must not be null!");

        securityService.updateCollaborators(doc.getMetadata().get().getRef(), doc.getId(), collaborators, doc.getClass());
    }
}
