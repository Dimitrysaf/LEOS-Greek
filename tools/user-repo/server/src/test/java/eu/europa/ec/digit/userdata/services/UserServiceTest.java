package eu.europa.ec.digit.userdata.services;



import eu.europa.ec.digit.userdata.Application;
import eu.europa.ec.digit.userdata.entities.SpecialEntity;
import eu.europa.ec.digit.userdata.entities.SpecialUser;
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

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@ActiveProfiles("test")
public class UserServiceTest {

    @Autowired
    private UserService userService;

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

        List<SpecialEntity> entities = Arrays.asList(
                new SpecialEntity("1", null, null, null),
                new SpecialEntity("2", null, null, null),
                new SpecialEntity("3", null, null, null)
        );

        SpecialUser specialUser = new SpecialUser("chewbacca", 0L, "Kenobi", "Obi-Wan", "obiwan@deathstar.com",
                null, entities, null);
        SpecialUser created = userService.addSpecialUser(specialUser);

        assertTrue(created.getDateCreated().getTime() >= now);
        SpecialUser repoUser = specialUserRepository.getByLogin("chewbacca");
        assertEquals("Kenobi", repoUser.getLastName());
        assertEquals(3, repoUser.getEntities().size());
    }

    @Test
    @Rollback
    public void GIVEN_new_user_with_NOT_existing_entities_WHEN_addSpecialUser_THEN_exception_thrown() {
        List<SpecialEntity> entities = Arrays.asList(
                new SpecialEntity("1", null, null, null),
                new SpecialEntity("2", null, null, null),
                new SpecialEntity("3", null, null, null),
                new SpecialEntity("9999", null, null, null)
        );

        SpecialUser specialUser = new SpecialUser("lordvader", 0L, "Darth", "Vader", "vader@deathstar.com",
                null, entities, null);
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
}
