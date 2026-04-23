package eu.europa.ec.digit.userdata.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.digit.userdata.dto.EntityDto;
import eu.europa.ec.digit.userdata.dto.UserDto;
import eu.europa.ec.digit.userdata.dto.UserUpdateDto;
import eu.europa.ec.digit.userdata.entities.Entity;
import eu.europa.ec.digit.userdata.entities.SpecialEntity;
import eu.europa.ec.digit.userdata.entities.SpecialUser;
import eu.europa.ec.digit.userdata.entities.User;
import eu.europa.ec.digit.userdata.repositories.SpecialEntityRepository;
import eu.europa.ec.digit.userdata.repositories.SpecialUserRepository;
import eu.europa.ec.digit.userdata.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles({"test", "h2"})
@SpringBootTest
@AutoConfigureMockMvc
@Rollback
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private SpecialEntityRepository specialEntityRepo;

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private SpecialUserRepository specialUserRepository;

    @Test
    void GIVEN_no_term_AND_no_pagination_WHEN_search_THEN_all_users_returned() throws Exception {
        long count = userRepo.findAll().stream().filter(u -> u.getPerId() != -1).count();
        mockMvc.perform(get("/users/search"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(20))
                .andExpect(jsonPath("$.totalElements").value(count));
    }


    @Test
    void GIVEN_a_valid_term_AND_no_pagination_WHEN_search_THEN_filtered_users_returned() throws Exception {
        mockMvc.perform(get("/users/search").param("searchKey", "vader"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    void GIVEN_no_term_AND_sorted_by_valid_field_WHEN_search_THEN_sorted_users_returned() throws Exception {
        long count = userRepo.findAll().stream().filter(u -> u.getPerId() != -1).count();
        mockMvc.perform(get("/users/search")
                        .param("sort", "firstName")
                        .param("size", String.valueOf(count)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(count))
                .andExpect(jsonPath("$.content[0].firstName").value("ADMIN"))
                .andExpect(jsonPath("$.content[" + (count - 1) + "].firstName").value("émily-Claire"))
                .andExpect(jsonPath("$.totalElements").value(count));

        mockMvc.perform(get("/users/search")
                        .param("sort", "firstName,desc")
                        .param("size", String.valueOf(count)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(count))
                .andExpect(jsonPath("$.content[0].firstName").value("émily-Claire"))
                .andExpect(jsonPath("$.content[" + (count - 1) + "].firstName").value("ADMIN"))
                .andExpect(jsonPath("$.totalElements").value(count));
    }

    @Test
    void GIVEN_valid_dto_WHEN_create_THEN_user_persisted() throws Exception {
        Random random = new Random();
        String login = "login" + random.nextInt(10000);

        List<SpecialEntity> allEntities = specialEntityRepo.findAll();
        List<EntityDto> addedEntities = allEntities.stream()
                .map(e -> new EntityDto(e.getId(), e.getName(), e.getOrganizationName()))
                .limit(5)
                .toList();

        UserDto userDto = new UserDto(login, "O'Brien", "émily-Claire", "email@email", addedEntities, Arrays.asList("ADMIN", "SUPPORT"), null, true);
        mockMvc.perform(post("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(userDto))).andExpect(status().isOk());

        User user = userRepo.findFirstByLogin(login);
        assertEquals("émily-Claire", user.getFirstName());
        assertEquals("O'Brien", user.getLastName());
        assertEquals("email@email", user.getEmail());
        assertEquals(addedEntities.stream().map(EntityDto::getId).collect(Collectors.toSet()),
                     user.getEntities().stream().map(Entity::getId).collect(Collectors.toSet()));
        assertTrue(user.getRoles().containsAll(Arrays.asList("ADMIN", "SUPPORT", "USER")), "Expected user to have roles [ADMIN, SUPPORT, USER]");
    }

    @Test
    void GIVEN_entity_not_exists_WHEN_create_THEN_user_persisted() throws Exception {
        Random random = new Random();
        String login = "login" + random.nextInt(10000);

        List<EntityDto> addedEntities = List.of(new EntityDto("nonexistent", "name", "org"));


        UserDto userDto = new UserDto(login, "last", "first", "email@email", addedEntities, Arrays.asList("ADMIN", "SUPPORT"), null, true);
        mockMvc.perform(post("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isBadRequest());

        User user = userRepo.findFirstByLogin(login);
        assertNull(user);
    }

    @Test
    void GIVEN_roles_not_set_AND_dateCreated_set_WHEN_create_THEN_date_ignored_AND_user_role_present() throws Exception {
        Random random = new Random();
        String login = "login" + random.nextInt(10000);
        List<SpecialEntity> allEntities = specialEntityRepo.findAll();
        List<EntityDto> entities = allEntities.stream()
                .map(e -> new EntityDto(e.getId(), e.getName(), e.getOrganizationName()))
                .limit(3)
                .toList();
        UserDto userDto = new UserDto(login, "last", "first", "email@email", entities, null, new Date(0), true);
        mockMvc.perform(post("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(userDto))).andExpect(status().isOk());

        User user = userRepo.findFirstByLogin(login);
        assertTrue(user.getDateCreated().getTime() > userDto.getDateCreated().getTime(),
                "Expected user.DATE_CREATED " + user.getDateCreated() + " to be greater than the dto.dateCreated " + userDto.getDateCreated().getTime());
        assertArrayEquals(new String[]{"USER"}, user.getRoles().toArray());
        Set<String> expectedEntityIds = entities.stream().map(EntityDto::getId).collect(Collectors.toSet());
        Set<String> actualEntityIds = user.getEntities().stream().map(Entity::getId).collect(Collectors.toSet());
        assertEquals(expectedEntityIds.size(), actualEntityIds.size());
        assertTrue(expectedEntityIds.containsAll(actualEntityIds), "Expected user to have entities " + expectedEntityIds + " but found " + actualEntityIds);
    }

    @Test
    void GIVEN_entities_not_setWHEN_create_THEN_bad_request() throws Exception {
        Random random = new Random();
        String login = "login" + random.nextInt(10000);

        UserDto userDto = new UserDto(login, "last", "first", "email@email", null, null, null, true);
        mockMvc.perform(post("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void GIVEN_an_existing_login_WHEN_create_THEN_conflict() throws Exception {
        UserDto userDto = new UserDto("admin", "last", "first", "email@email", null, null, null, true);
        mockMvc.perform(post("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isBadRequest());
    }


    @Test
    void GIVEN_login_with_spaces_WHEN_create_THEN_bad_request() throws Exception {
        UserDto userDto = new UserDto("admin 123", "last", "first", "email@email", null, null, null, true);
        mockMvc.perform(post("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void GIVEN_fields_with_trailing_spaces_WHEN_create_THEN_strings_trimmed() throws Exception {
        Random random = new Random();
        String login = "login" + random.nextInt(10000);
        List<SpecialEntity> allEntities = specialEntityRepo.findAll();
        List<EntityDto> newEntities = allEntities.stream()
                .map(e -> new EntityDto(e.getId(), e.getName(), e.getOrganizationName()))
                .limit(3)
                .toList();

        UserDto userDto = new UserDto(login, "  la st", " fi rst ", "email@email", newEntities, null, null, true);
        mockMvc.perform(post("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(userDto))).andExpect(status().isOk());

        User user = userRepo.findFirstByLogin(login);
        assertEquals("fi rst", user.getFirstName());
        assertEquals("la st", user.getLastName());
    }

    @Test
    void GIVEN_login_exists_with_different_letter_case_WHEN_create_THEN_conflict() throws Exception {
        UserDto userDto = new UserDto("Admin", "last", "first", "email@email", null, null, null, true);
        mockMvc.perform(post("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void GIVEN_names_with_invalid_chars_WHEN_create_THEN_bad_request() throws Exception {
        char[] charsToAvoid = {'\\', '%', '"', '+', '[', ']', '*', '?', '^', '$', '@', '!', '#', '&', '/', '(', ')', '{', '}', '`', '~', '<', '>'};

        for (char c : charsToAvoid) {
            Random random = new Random();
            String login = "login" + random.nextInt(10000);
            UserDto userDto = new UserDto(login, "last" + c, "first", "email@email", null, null, null, true);
            mockMvc.perform(post("/users")
                            .contentType("application/json")
                            .content(objectMapper.writeValueAsString(userDto)))
                    .andExpect(result -> assertEquals(400, result.getResponse().getStatus(),
                        "Expected 400 for lastName with character: '" + c + "'"));
            userDto = new UserDto(login, "last", "first" + c, "email@email", null, null, null, true);
            mockMvc.perform(post("/users")
                            .contentType("application/json")
                            .content(objectMapper.writeValueAsString(userDto)))
                    .andExpect(result -> assertEquals(400, result.getResponse().getStatus(),
                            "Expected 400 for firstName with character: '" + c + "'"));
        }
    }

    @Test
    void GIVEN_valid_dto_WHEN_update_THEN_user_updated() throws Exception {
        UserUpdateDto userDto = new UserUpdateDto("gjuser17", "NewLast", "NewFirst", "newemail@email.com", List.of("SUPPORT"), null, null);

        mockMvc.perform(patch("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isOk());

        User updatedUser = userRepo.findFirstByLogin("gjuser17");
        assertEquals("NewFirst", updatedUser.getFirstName());
        assertEquals("NewLast", updatedUser.getLastName());
        assertEquals("newemail@email.com", updatedUser.getEmail());
        assertArrayEquals(new String[]{"SUPPORT", "USER"}, updatedUser.getRoles().toArray(new String[0]));
    }

    @Test
    void GIVEN_nonexistent_login_WHEN_update_THEN_not_found() throws Exception {
        UserUpdateDto userDto = new UserUpdateDto("nonexistent", "last", "first", "email@email", null, null, null);
        mockMvc.perform(patch("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void GIVEN_invalid_names_WHEN_update_THEN_bad_request() throws Exception {
        UserUpdateDto userDto = new UserUpdateDto("admin", "last@", "first", "email@email", null, null, null);
        mockMvc.perform(patch("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void GIVEN_entities_update_WHEN_update_THEN_entities_updated() throws Exception {
        Set<String> addedEntities = Set.of("7", "8", "9", "256");
        Set<String> removedEntities = Set.of("10", "11", "12", "512");

        // User a00012yl is connected to entities 10, 11, 12, 13
        UserUpdateDto userDto = new UserUpdateDto("a00012yl", "Last", "First", "email@email", List.of("USER_MANAGER"), addedEntities, removedEntities);

        mockMvc.perform(patch("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isOk());

        User updatedUser = userRepo.findFirstByLogin("a00012yl");
        assertEquals(Set.of("7", "8", "9", "13"), updatedUser.getEntities().stream().map(Entity::getId).collect(Collectors.toSet())) ;
        assertArrayEquals(new String[]{"USER_MANAGER", "USER"}, updatedUser.getRoles().toArray(new String[0]));
    }

    @Test
    void GIVEN_no_roles_WHEN_update_THEN_user_has_user_role() throws Exception {
        UserUpdateDto userDto = new UserUpdateDto("gjuser17", "Last", "First", "email@email", Collections.emptyList(), null, null);
        mockMvc.perform(patch("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isOk());

        User updatedUser = userRepo.findFirstByLogin("gjuser17");
        assertArrayEquals(new String[]{"USER"}, updatedUser.getRoles().toArray(new String[0]));
    }

    @Test
    void GIVEN_null_values_WHEN_update_THEN_old_values_kept() throws Exception {
        User oldUser = userRepo.findFirstByLogin("admin");
        UserUpdateDto userDto = new UserUpdateDto("admin", null, null, null, null, null, null);
        mockMvc.perform(patch("/users")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isOk());

        User updatedUser = userRepo.findFirstByLogin("admin");
        assertArrayEquals(oldUser.getRoles().toArray(), updatedUser.getRoles().toArray(new String[0]));
        assertEquals(oldUser.getFirstName(), updatedUser.getFirstName());
        assertEquals(oldUser.getLastName(), updatedUser.getLastName());
        assertEquals(oldUser.getEmail(), updatedUser.getEmail());
        assertArrayEquals(oldUser.getEntities().stream().map(Entity::getId).toArray(),
                          updatedUser.getEntities().stream().map(Entity::getId).toArray());
    }

    @Test
    void GIVEN_existing_user_without_entities_WHEN_delete_THEN_user_deleted() throws Exception {
        assertNotNull(userRepo.findFirstByLogin("cabinet03"));
        mockMvc.perform(delete("/users/cabinet03"))
                .andExpect(status().isNoContent());
        assertNull(userRepo.findFirstByLogin("cabinet03"));
    }

    @Test
    void GIVEN_existing_user_with_entities_WHEN_delete_THEN_user_not_deleted() throws Exception {
        assertNotNull(userRepo.findFirstByLogin("gjuser17"));
        mockMvc.perform(delete("/users/gjuser17"))
                .andExpect(status().isBadRequest());
        assertNotNull(userRepo.findFirstByLogin("gjuser17"));
    }

    @Test
    void GIVEN_nonexistent_user_WHEN_delete_THEN_not_found() throws Exception {
        mockMvc.perform(delete("/users/nonexistent"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void GIVEN_nonexistent_role_WHEN_update_THEN_role_ignored() throws Exception {
        User existingUser = userRepo.findFirstByLogin("gjuser17");

        UserUpdateDto userDto = new UserUpdateDto("gjuser17", "Last", "First", "email@email", List.of("USER_MANAGER", "XXX"), null, null);
        mockMvc.perform(patch("/users")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isOk());

        User updatedUser = userRepo.findFirstByLogin("gjuser17");
        assertEquals(existingUser.getEntities().stream().map(Entity::getId).collect(Collectors.toSet()),
                updatedUser.getEntities().stream().map(Entity::getId).collect(Collectors.toSet()));
        assertArrayEquals(new String[]{"USER_MANAGER", "USER"}, updatedUser.getRoles().toArray(new String[0]));
    }

    @Test
    void GIVEN_addedEntities_mix_existing_and_new_WHEN_update_THEN_success_AND_no_duplicates() throws Exception {
        Random random = new Random();
        String login = "login" + random.nextInt(10000);

        List<SpecialEntity> entities = specialEntityRepo.findByIdIn(Set.of("10","11", "12", "13"));
        SpecialUser user = new SpecialUser(login, 1L, "Last", "First", "a@b.c", null, entities, new Date());
        specialUserRepository.save(user);

        UserUpdateDto userDto = new UserUpdateDto(login, user.getLastName(), user.getLastName(), user.getEmail(), user.getRoles(), Set.of("10", "7"), null);
        mockMvc.perform(patch("/users")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isOk());

        User updatedUser = userRepo.findFirstByLogin(login);
        assertEquals(Stream.of("7", "10", "11", "12", "13").sorted().toList(),
                updatedUser.getEntities().stream().map(Entity::getId).sorted().toList());
    }

    @Test
    void GIVEN_nonexistent_role_WHEN_create_THEN_user_persisted_with_other_roles() throws Exception {
        Random random = new Random();
        String login = "login" + random.nextInt(10000);

        List<SpecialEntity> allEntities = specialEntityRepo.findAll();
        List<EntityDto> addedEntities = allEntities.stream()
                .map(e -> new EntityDto(e.getId(), e.getName(), e.getOrganizationName()))
                .limit(5)
                .toList();

        UserDto userDto = new UserDto(login, "O'Brien", "émily-Claire", "email@email", addedEntities, Arrays.asList("ADMIN", "SUPPORT", "XXX"), null, true);
        mockMvc.perform(post("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(userDto))).andExpect(status().isOk());

        User user = userRepo.findFirstByLogin(login);
        assertEquals("émily-Claire", user.getFirstName());
        assertEquals("O'Brien", user.getLastName());
        assertEquals("email@email", user.getEmail());
        assertEquals(addedEntities.stream().map(EntityDto::getId).collect(Collectors.toSet()),
                user.getEntities().stream().map(Entity::getId).collect(Collectors.toSet()));
        assertTrue(user.getRoles().containsAll(Arrays.asList("ADMIN", "SUPPORT", "USER")), "Expected user to have roles [ADMIN, SUPPORT, USER]");
    }
}