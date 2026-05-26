package eu.europa.ec.leos.services.collection;

import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.ContributionVO;
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
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.test.support.LeosTest;
import io.atlassian.fugue.Option;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class CollaboratorServiceTest extends LeosTest {

    @Mock private MessageHelper messageHelper;
    @Mock private PackageService packageService;
    @Mock private SecurityService securityService;
    @Mock private UserService userService;
    @Mock private LeosPermissionAuthorityMap leosPermissionAuthorityMap;
    @Mock private LeosPermissionAuthorityMapHelper authorityMapHelper;
    @Mock private LeosClientService leosClientService;

    @InjectMocks
    private CollaboratorServiceImpl collaboratorService;

    // --- getCollaborators / getUser scenarios ---

    @Test
    void getCollaborators_whenUserFound_usesUserNameAndMatchedEntity() {
        Entity entity = new Entity("e1", "DG DIGIT", "DIGIT", false);
        User user = new User(1L, "jdoe", "John Doe", List.of(entity), "john@test.com", List.of());
        // entity matched via organizationName for non-entity user
        Collaborator collaborator = new Collaborator("jdoe", "CONTRIBUTOR", "DIGIT", null, "Stored Display Name");
        Proposal proposal = proposalWith(List.of(collaborator));

        when(userService.getUser("jdoe")).thenReturn(user);

        List<CollaboratorDTO> result = collaboratorService.getCollaborators(proposal);

        assertEquals(1, result.size());
        CollaboratorDTO dto = result.getFirst();
        assertEquals("jdoe", dto.getLogin());
        assertEquals("John Doe", dto.getFullName());
        assertEquals("CONTRIBUTOR", dto.getRole());
        assertEquals(entity, dto.getEntity());
    }

    @Test
    void getCollaborators_whenUserFound_entityUser_entityMatchedByName() {
        // isEntityUser() is true when email="entity@mail.com" and id=-1L
        Entity entity = new Entity("e1", "DG DIGIT", "DIGIT", false);
        User user = new User(-1L, "entity-login", "Entity Name", List.of(entity), "entity@mail.com", List.of());
        // entity matched via entity.getName() for entity users
        Collaborator collaborator = new Collaborator("entity-login", "OWNER", "DG DIGIT", null, "Stored Display Name");
        Proposal proposal = proposalWith(List.of(collaborator));

        when(userService.getUser("entity-login")).thenReturn(user);

        List<CollaboratorDTO> result = collaboratorService.getCollaborators(proposal);

        assertEquals(1, result.size());
        CollaboratorDTO dto = result.getFirst();
        assertEquals("Entity Name", dto.getFullName());
        assertEquals(entity, dto.getEntity());
    }

    @Test
    void getCollaborators_whenUserFound_entityNotInUserEntities_entityIsNull() {
        Entity entity = new Entity("e1", "DG DIGIT", "DIGIT", false);
        User user = new User(1L, "jdoe", "John Doe", List.of(entity), "john@test.com", List.of());
        Collaborator collaborator = new Collaborator("jdoe", "CONTRIBUTOR", "UNKNOWN_ENTITY", null, "Stored Display Name");
        Proposal proposal = proposalWith(List.of(collaborator));

        when(userService.getUser("jdoe")).thenReturn(user);

        List<CollaboratorDTO> result = collaboratorService.getCollaborators(proposal);

        assertEquals(1, result.size());
        assertNull(result.getFirst().getEntity());
    }

    @Test
    void getCollaborators_whenUserNotFound_usesDisplayNameAndPlaceholderEntity() {
        Collaborator collaborator = new Collaborator("ghost", "CONTRIBUTOR", "DIGIT", null, "Ghost Display Name");
        Proposal proposal = proposalWith(List.of(collaborator));

        when(userService.getUser("ghost")).thenReturn(null);

        List<CollaboratorDTO> result = collaboratorService.getCollaborators(proposal);

        assertEquals(1, result.size());
        CollaboratorDTO dto = result.getFirst();
        assertEquals("ghost", dto.getLogin());
        assertEquals("Ghost Display Name", dto.getFullName());
        assertEquals("CONTRIBUTOR", dto.getRole());
        // placeholder entity: id=null, name and organizationName both equal the collaborator's entity
        assertNotNull(dto.getEntity());
        assertNull(dto.getEntity().getId());
        assertEquals("DIGIT", dto.getEntity().getName());
        assertEquals("DIGIT", dto.getEntity().getOrganizationName());
    }

    @Test
    void getCollaborators_whenLoginIsEmpty_usesDisplayNameAndPlaceholderEntity() {
        Collaborator collaborator = new Collaborator("", "CONTRIBUTOR", "DIGIT", null, "Stored Display Name");
        Proposal proposal = proposalWith(List.of(collaborator));

        List<CollaboratorDTO> result = collaboratorService.getCollaborators(proposal);

        assertEquals(1, result.size());
        CollaboratorDTO dto = result.getFirst();
        assertEquals("Stored Display Name", dto.getFullName());
        assertEquals("DIGIT", dto.getEntity().getName());
    }

    @Test
    void getCollaborators_emptyCollaboratorList_returnsEmpty() {
        Proposal proposal = proposalWith(List.of());

        List<CollaboratorDTO> result = collaboratorService.getCollaborators(proposal);

        assertTrue(result.isEmpty());
    }

    @Test
    void getCollaborators_mixedFoundAndNotFound_allReturnedWithCorrectFallback() {
        Entity entity = new Entity("e1", "DG DIGIT", "DIGIT", false);
        User user = new User(1L, "jdoe", "John Doe", List.of(entity), "john@test.com", List.of());
        Collaborator found = new Collaborator("jdoe", "OWNER", "DIGIT", null, "John Doe");
        Collaborator notFound = new Collaborator("ghost", "CONTRIBUTOR", "OTHER", null, "Ghost User");
        Proposal proposal = proposalWith(List.of(found, notFound));

        when(userService.getUser("jdoe")).thenReturn(user);
        when(userService.getUser("ghost")).thenReturn(null);

        List<CollaboratorDTO> result = collaboratorService.getCollaborators(proposal);

        assertEquals(2, result.size());
        assertEquals("John Doe", result.get(0).getFullName());
        assertEquals("Ghost User", result.get(1).getFullName());
    }

    // --- removeCollaborator scenarios ---

    @Test
    void removeCollaborator_whenUserNotFound_stubUserCreated_collaboratorRemovedByLogin() {
        // getUser throws → stub User(login, emptyEntities) created; getEntity throws on empty list → entity = null
        ArrayList<Collaborator> collaborators = new ArrayList<>();
        collaborators.add(new Collaborator("ghost", "CONTRIBUTOR", "DIGIT", null));
        collaborators.add(new Collaborator("owner", "OWNER", "DIGIT", null));
        Proposal proposal = proposalWithMeta(collaborators, "prop-ref");

        when(userService.getUser("ghost")).thenReturn(null);
        setupRole("CONTRIBUTOR");
        setupPackageService("prop-ref", "pkg-1");

        collaboratorService.removeCollaborator(proposal, "ghost", "CONTRIBUTOR", "DIGIT", "http://url", (ClientSystem) null);

        // entity was null → removed by login only
        assertTrue(proposal.getCollaborators().stream().noneMatch(c -> c.getLogin().equals("ghost")));
        assertEquals(1, proposal.getCollaborators().size());
    }

    @Test
    void removeCollaborator_whenUserFoundButNoEntities_entityNull_collaboratorRemovedByLogin() {
        // getEntity throws because user.getEntities().isEmpty() → entity = null
        User user = new User(1L, "jdoe", "John Doe", new ArrayList<>(), "john@test.com", List.of());
        ArrayList<Collaborator> collaborators = new ArrayList<>();
        collaborators.add(new Collaborator("jdoe", "CONTRIBUTOR", "DIGIT", null));
        collaborators.add(new Collaborator("owner", "OWNER", "DIGIT", null));
        Proposal proposal = proposalWithMeta(collaborators, "prop-ref");

        when(userService.getUser("jdoe")).thenReturn(user);
        setupRole("CONTRIBUTOR");
        setupPackageService("prop-ref", "pkg-1");

        collaboratorService.removeCollaborator(proposal, "jdoe", "CONTRIBUTOR", "DIGIT", "http://url", (ClientSystem) null);

        assertTrue(proposal.getCollaborators().stream().noneMatch(c -> c.getLogin().equals("jdoe")));
        assertEquals(1, proposal.getCollaborators().size());
    }

    @Test
    void removeCollaborator_whenUserFoundWithEntity_collaboratorRemovedByLoginRoleAndEntity() {
        Entity entity = new Entity("e1", "DG DIGIT", "DIGIT", false);
        User user = new User(1L, "jdoe", "John Doe", List.of(entity), "john@test.com", List.of());
        ArrayList<Collaborator> collaborators = new ArrayList<>();
        collaborators.add(new Collaborator("jdoe", "CONTRIBUTOR", "DIGIT", null));
        collaborators.add(new Collaborator("owner", "OWNER", "DIGIT", null));
        Proposal proposal = proposalWithMeta(collaborators, "prop-ref");

        when(userService.getUser("jdoe")).thenReturn(user);
        setupRole("CONTRIBUTOR");
        setupPackageService("prop-ref", "pkg-1");

        collaboratorService.removeCollaborator(proposal, "jdoe", "CONTRIBUTOR", "DIGIT", "http://url", (ClientSystem) null);

        // entity was resolved (organizationName match) → Collaborator.equals uses (login, entity, role, leosClientId)
        assertTrue(proposal.getCollaborators().stream()
                .noneMatch(c -> "jdoe".equals(c.getLogin()) && "CONTRIBUTOR".equals(c.getRole())));
        assertEquals(1, proposal.getCollaborators().size());
    }

    @Test
    void removeCollaborator_whenCollaboratorNotPresentInProposal_throwsCollaboratorException() {
        ArrayList<Collaborator> collaborators = new ArrayList<>();
        collaborators.add(new Collaborator("owner", "OWNER", "DIGIT", null));
        Proposal proposal = proposalWithMeta(collaborators, "prop-ref");

        when(userService.getUser("ghost")).thenReturn(null);
        setupRole("CONTRIBUTOR");

        assertThrows(CollaboratorException.class, () ->
                collaboratorService.removeCollaborator(proposal, "ghost", "CONTRIBUTOR", "DIGIT", "http://url", (ClientSystem) null));
    }

    @Test
    void removeCollaborator_whenRemovingLastOwner_throwsCollaboratorException() {
        ArrayList<Collaborator> collaborators = new ArrayList<>();
        collaborators.add(new Collaborator("owner", "OWNER", "DIGIT", null));
        Proposal proposal = proposalWithMeta(collaborators, "prop-ref");

        when(userService.getUser("owner")).thenReturn(null); // user not found, stub created
        setupRole("OWNER");

        assertThrows(CollaboratorException.class, () ->
                collaboratorService.removeCollaborator(proposal, "owner", "OWNER", "DIGIT", "http://url", (ClientSystem) null));
    }

    // --- helpers ---

    private Proposal proposalWith(List<Collaborator> collaborators) {
        return new Proposal("id", "Proposal", "login", Instant.now(), "login", Instant.now(),
                "", "", "", "", VersionType.MAJOR, true, "title", collaborators,
                List.of(), "login", Instant.now(), Option.none(), Option.none(),
                false, "", "", "", null,
                ContributionVO.ContributionStatus.CONTRIBUTION_DONE.name(), false, null, null, null, null, null);
    }

    private Proposal proposalWithMeta(List<Collaborator> collaborators, String ref) {
        ProposalMetadata metadata = new ProposalMetadata(
                "stage", "type", "purpose", "template", "EN", "docTemplate",
                ref, "obj-id", "1.0", false, false, false);
        return new Proposal("id", "Proposal", "login", Instant.now(), "login", Instant.now(),
                "", "", "", "", VersionType.MAJOR, true, "title", collaborators,
                List.of(), "login", Instant.now(), Option.none(), Option.some(metadata),
                false, "", "", "", null,
                ContributionVO.ContributionStatus.CONTRIBUTION_DONE.name(), false, null, null, null, null, null);
    }

    private void setupRole(String roleName) {
        Role role = new Role();
        role.setName(roleName);
        role.setCollaborator(true);
        role.setMessageKey("role.message.key");
        when(leosPermissionAuthorityMap.getAllRoles()).thenReturn(List.of(role));
    }

    private void setupPackageService(String ref, String packageId) {
        LeosPackage leosPackage = new LeosPackage(packageId, "pkg-name", "/path", "EN", false);
        when(packageService.findPackageByDocumentRef(ref, Proposal.class)).thenReturn(leosPackage);
        when(packageService.findLinkedPackagesByPackageId(packageId)).thenReturn(List.of());
    }
}
