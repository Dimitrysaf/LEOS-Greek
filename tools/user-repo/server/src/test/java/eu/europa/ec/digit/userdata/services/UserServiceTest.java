package eu.europa.ec.digit.userdata.services;



import eu.europa.ec.digit.userdata.Application;
import eu.europa.ec.digit.userdata.dto.UserEntityDto;
import eu.europa.ec.digit.userdata.entities.SpecialEntity;
import eu.europa.ec.digit.userdata.entities.SpecialUser;
import eu.europa.ec.digit.userdata.entities.SpecialUserEntity;
import eu.europa.ec.digit.userdata.entities.User;
import eu.europa.ec.digit.userdata.exception.BadRequestException;
import eu.europa.ec.digit.userdata.repositories.SpecialUserRepository;
import eu.europa.ec.digit.userdata.repositories.UserRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@ActiveProfiles("test")
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private SpecialUserRepository specialUserRepository;
    @Autowired
    private UserRepository userRepository;

    @BeforeAll
    public static void initH2() {
        Application.initH2OracleMode();
    }

    @Test
    public void GIVEN_empty_search_term_AND_unpaged_WHEN_search_THEN_all_users_returned() {
        Page<User> pageOfUsers = userService.search("", Pageable.unpaged());
        long count = userRepository.findAll().stream().filter(u -> u.getPerId() != -1).count();
        assertEquals(count, pageOfUsers.getNumberOfElements());
    }

    @Test
    public void GIVEN_search_term_WHEN_search_THEN_filtered_users_returned() {
        Page<User> pageOfUsers = userService.search("c3po", Pageable.unpaged());
        assertEquals(1, pageOfUsers.getNumberOfElements());
    }

    @Test
    @Rollback
    public void GIVEN_new_user_WHEN_addSpecialUser_THEN_user_created() {
        long now = System.currentTimeMillis();
        SpecialUser specialUser = new SpecialUser("obiwan", 0L, "Kenobi", "Obi-Wan", "obiwan@deathstar.com");
        SpecialUser created = userService.addSpecialUser(specialUser);

        assertTrue(created.getDateCreated().getTime() >= now);
        SpecialUser repoUser = specialUserRepository.getByLogin("obiwan");
        assertEquals("Kenobi", repoUser.getLastName());
    }

    @Test
    @Rollback
    public void GIVEN_new_user_with_existing_entities_WHEN_addSpecialUser_THEN_user_created() {
        long now = System.currentTimeMillis();

        SpecialUser specialUser = new SpecialUser("chewbacca", 0L, "Kenobi", "Obi-Wan", "obiwan@deathstar.com",
                null, null, null);
        List<SpecialEntity> entities = Arrays.asList(
                new SpecialEntity("1", null, null, null),
                new SpecialEntity("2", null, null, null),
                new SpecialEntity("3", null, null, null)
        );
        List<SpecialUserEntity> userEntities = entities.stream().map(e -> new SpecialUserEntity(specialUser, e)).toList();
        specialUser.setEntities(userEntities);
        SpecialUser created = userService.addSpecialUser(specialUser);

        assertTrue(created.getDateCreated().getTime() >= now);
        SpecialUser repoUser = specialUserRepository.getByLogin("chewbacca");
        assertEquals("Kenobi", repoUser.getLastName());
        assertEquals(3, repoUser.getEntities().size());
    }

    @Test
    @Rollback
    public void GIVEN_new_user_with_NOT_existing_entities_WHEN_addSpecialUser_THEN_exception_thrown() {
        SpecialUser specialUser = new SpecialUser("lordvader", 0L, "Darth", "Vader", "vader@deathstar.com",
                null, null, null);
        List<SpecialEntity> entities = Arrays.asList(
                new SpecialEntity("1", null, null, null),
                new SpecialEntity("2", null, null, null),
                new SpecialEntity("3", null, null, null),
                new SpecialEntity("9999", null, null, null)
        );
        List<SpecialUserEntity> userEntities = entities.stream().map(e -> new SpecialUserEntity(specialUser, e)).toList();
        specialUser.setEntities(userEntities);
        BadRequestException e = assertThrows(BadRequestException.class, () -> userService.addSpecialUser(specialUser));
        assertEquals("page.workspace.administration.user-info.entity-not-found", e.getMessageKey());
    }

    @Test
    @Rollback
    public void GIVEN_user_login_exists_WHEN_addSpecialUser_THEN_exception_thrown() {
        SpecialUser specialUser = new SpecialUser("vader", 0L, "Darth", "Vader", "vader@deathstar.com");
        BadRequestException e = assertThrows(BadRequestException.class,
                () -> userService.addSpecialUser(specialUser));
        assertEquals("page.workspace.administration.user-info.user-login-conflict", e.getMessageKey());
    }

    @Test
    @Rollback
    public void GIVEN_user_login_exists_ignore_case_WHEN_addSpecialUser_THEN_exception_thrown() {
        SpecialUser specialUser = new SpecialUser("VADER", 0L, "Darth", "Vader", "vader@deathstar.com");
        BadRequestException e = assertThrows(BadRequestException.class,
                () -> userService.addSpecialUser(specialUser));
        assertEquals("page.workspace.administration.user-info.user-login-conflict", e.getMessageKey());
    }

    @Test
    @Rollback
    public void GIVEN_new_user_with_entity_AND_EXTENDED_VIEWER_role_WHEN_addSpecialUser_THEN_role_persisted() {
        SpecialUser specialUser = new SpecialUser("testrolex", 0L, "Last", "First", "test@mail.com", null, null, null);
        SpecialEntity entity = new SpecialEntity("3", null, null, null);
        SpecialUserEntity sue = new SpecialUserEntity(specialUser, entity);
        sue.setRole(roleService.getRoles().get("EXTENDED_VIEWER"));
        specialUser.setEntities(List.of(sue));

        userService.addSpecialUser(specialUser);

        SpecialUser created = specialUserRepository.getByLogin("testrolex");
        assertEquals(1, created.getEntities().size());
        assertNotNull(created.getEntities().get(0).getRole());
        assertEquals("EXTENDED_VIEWER", created.getEntities().get(0).getRole().getRole());
    }

    @Test
    @Rollback
    public void GIVEN_user_with_entity_WITHOUT_role_WHEN_updateSpecialUser_adding_EXTENDED_VIEWER_THEN_role_persisted() {
        // vader has entity 3 with no role in seed data
        SpecialUser vader = specialUserRepository.getByLogin("vader");
        Set<UserEntityDto> addedEntities = Set.of(new UserEntityDto("3", null, null, "EXTENDED_VIEWER"));

        userService.updateSpecialUser(vader, addedEntities, null);

        SpecialUser updated = specialUserRepository.getByLogin("vader");
        SpecialUserEntity entity3 = updated.getEntities().stream()
                .filter(e -> "3".equals(e.getEntity().getId()))
                .findFirst().orElseThrow();
        assertNotNull(entity3.getRole());
        assertEquals("EXTENDED_VIEWER", entity3.getRole().getRole());
    }

    @Test
    @Rollback
    public void GIVEN_user_with_entity_WITH_EXTENDED_VIEWER_role_WHEN_updateSpecialUser_clearing_role_THEN_role_is_null() {
        // iluser1 has entity 9 with EXTENDED_VIEWER in seed data
        SpecialUser iluser1 = specialUserRepository.getByLogin("iluser1");
        Set<UserEntityDto> addedEntities = Set.of(new UserEntityDto("9", null, null, null));

        userService.updateSpecialUser(iluser1, addedEntities, null);

        SpecialUser updated = specialUserRepository.getByLogin("iluser1");
        SpecialUserEntity entity9 = updated.getEntities().stream()
                .filter(e -> "9".equals(e.getEntity().getId()))
                .findFirst().orElseThrow();
        assertNull(entity9.getRole());
    }

    @Test
    @Rollback
    public void GIVEN_user_without_entity_WHEN_updateSpecialUser_adding_entity_with_role_THEN_entity_added_with_role() {
        // luke has entity 8; add entity 3 with EXTENDED_VIEWER
        SpecialUser luke = specialUserRepository.getByLogin("luke");
        Set<UserEntityDto> addedEntities = Set.of(new UserEntityDto("3", null, null, "EXTENDED_VIEWER"));

        userService.updateSpecialUser(luke, addedEntities, null);

        SpecialUser updated = specialUserRepository.getByLogin("luke");
        SpecialUserEntity entity3 = updated.getEntities().stream()
                .filter(e -> "3".equals(e.getEntity().getId()))
                .findFirst().orElseThrow();
        assertNotNull(entity3.getRole());
        assertEquals("EXTENDED_VIEWER", entity3.getRole().getRole());
        assertTrue(updated.getEntities().stream().anyMatch(e -> "8".equals(e.getEntity().getId())),
                "Original entity 8 should still be present");
    }
}
