package eu.europa.ec.leos.services.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.leos.integration.UsersProvider;
import eu.europa.ec.leos.integration.dto.EntityDTO;
import eu.europa.ec.leos.integration.dto.UserDTO;
import eu.europa.ec.leos.integration.dto.UserUpdateDTO;
import eu.europa.ec.leos.integration.rest.RestPageImpl;
import eu.europa.ec.leos.model.user.Entity;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.SecurityContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = MvcTestConfig.class)
@WebAppConfiguration
public class AdministrationControllerTest {

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private SecurityContext securityContext;

    @Autowired
    private UsersProvider usersClient;

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setup() {
        reset(securityContext, usersClient);
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    public void GIVEN_user_is_ADMIN_WHEN_createEntity_THEN_entity_created_with_no_prefix() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")), // user's default entity
                "a@b.com",
                Collections.singletonList("ADMIN"));
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_ENTITIES)).thenReturn(true);
        ArgumentCaptor<EntityDTO> captor = ArgumentCaptor.forClass(EntityDTO.class);
        EntityDTO response = new EntityDTO("2", "test", "Entity");
        when(usersClient.createEntity(captor.capture())).thenReturn(response);

        mockMvc.perform(post("/secured/administration/entities")
                            .content("{\"name\":\"test\"}")
                            .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(response)));
        assertEquals("test", captor.getValue().getName());
        assertEquals("Entity", captor.getValue().getOrganizationName());
    }

    @Test
    public void GIVEN_user_is_USER_MANAGER_WHEN_createEntity_THEN_entity_created_with_prefix() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")), // user's default entity
                "a@b.com",
                Collections.singletonList("USER_MANAGER"));
        when(securityContext.getUser()).thenReturn(user);
        ArgumentCaptor<EntityDTO> captor = ArgumentCaptor.forClass(EntityDTO.class);
        EntityDTO response = new EntityDTO("2", "test", "Entity");
        when(usersClient.createEntity(captor.capture())).thenReturn(response);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_OWN_ENTITIES)).thenReturn(true);

        mockMvc.perform(post("/secured/administration/entities")
                        .content("{\"name\":\"test\"}")
                        .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(response)));
        assertEquals("Entity.test", captor.getValue().getName());
        assertEquals("Entity", captor.getValue().getOrganizationName());
    }

    @Test
    public void GIVEN_user_is_USER_MANAGER_AND_no_default_entity_WHEN_createEntity_THEN_error() throws Exception {
        User user = new User(1L, "user", "User",
                new ArrayList<>(), // user's default entity
                "a@b.com",
                Collections.singletonList("USER_MANAGER"));
        when(securityContext.getUser()).thenReturn(user);
        ArgumentCaptor<EntityDTO> captor = ArgumentCaptor.forClass(EntityDTO.class);
        EntityDTO response = new EntityDTO("2", "test", "Entity");
        when(usersClient.createEntity(captor.capture())).thenReturn(response);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_OWN_ENTITIES)).thenReturn(true);

        mockMvc.perform(post("/secured/administration/entities")
                        .content("{\"name\":\"test\"}")
                        .contentType("application/json"))
                .andExpect(status().isPreconditionFailed());
    }

    @Test
    public void GIVEN_user_is_support_AND_search_term_empty_AND_page_size_10_WHEN_getUsers_THEN_userClient_invoked() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")), // user's default entity
                "a@b.com",
                Collections.singletonList("SUPPORT"));
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_USERS)).thenReturn(true);
        ArgumentCaptor<Pageable> captor = ArgumentCaptor.forClass(Pageable.class);

        UserDTO returnedUser = new UserDTO("login", null, null, null, null, null, null, null, null, null, null);

        Page<UserDTO> response = new RestPageImpl<>(Collections.singletonList(returnedUser), PageRequest.of(0, 10), 1);

        when(usersClient.searchSpecialUsers(eq(""), any(), captor.capture())).thenReturn(response);

        mockMvc.perform(get("/secured/administration/users")
                        .param("query", "")
                        .param("page", "0")
                        .param("size", "10")
                        .param("sort", "login,desc"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(response)));
        assertEquals(0, captor.getValue().getPageNumber());
        assertEquals(10, captor.getValue().getPageSize());
        assertEquals(Sort.Direction.DESC, captor.getValue().getSort().getOrderFor("login").getDirection());
    }

    @Test
    public void GIVEN_user_is_support_WHEN_addUser_THEN_userClient_invoked() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")), // user's default entity
                "a@b.com",
                Collections.singletonList("SUPPORT"));
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_USERS)).thenReturn(true);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_ENTITIES)).thenReturn(true);

        List<EntityDTO> entitiesForDto = Arrays.asList(
                new EntityDTO("1", "Entity", "Entity"));

        UserDTO dto = new UserDTO("login",null, null, null, null, null, null, null, entitiesForDto, null, null);

        when(usersClient.addSpecialUser(dto)).thenReturn(dto);

        mockMvc.perform(post("/secured/administration/users")
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(dto)));

        verify(usersClient, times(0)).specialEntities(any());
    }

    @Test
    public void GIVEN_user_is_user_manager_AND_entity_in_user_entities_WHEN_addUser_THEN_userClient_invoked() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Org1")), // user's default entity
                "a@b.com",
                Collections.singletonList("USER_MANAGER"));
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_USERS)).thenReturn(true);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_OWN_ENTITIES)).thenReturn(true);
        List<EntityDTO> entitiesForLoggedInUser = Arrays.asList(
                new EntityDTO("1", "Entity1", "Org1"),
                new EntityDTO("2", "Entity2", "Org1"));
        when(usersClient.specialEntities(eq("Org1"))).thenReturn(entitiesForLoggedInUser);

        List<EntityDTO> entitiesForDto = Arrays.asList(
                new EntityDTO("1", "Entity1", "Org1"));

        UserDTO dto = new UserDTO("login",null, null, null, null, null, null, null, entitiesForDto, null, null);

        when(usersClient.addSpecialUser(dto)).thenReturn(dto);

        mockMvc.perform(post("/secured/administration/users")
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(dto)));
    }

    @Test
    public void GIVEN_user_is_user_manager_AND_entity_not_in_user_entities_WHEN_addUser_THEN_forbidden() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")), // user's default entity
                "a@b.com",
                Collections.singletonList("USER_MANAGER"));
        when(securityContext.getUser()).thenReturn(user);

        List<EntityDTO> entitiesForLoggedInUser = Arrays.asList(
                new EntityDTO("2", "Entity", "Org1"));
        when(usersClient.specialEntities(eq("Org1"))).thenReturn(entitiesForLoggedInUser);

        List<EntityDTO> entitiesForDto = Arrays.asList(
                new EntityDTO("1", "Entity", "Entity"));

        UserDTO dto = new UserDTO("login",null, null, null, null, null, null, null, entitiesForDto, null, null);

        mockMvc.perform(post("/secured/administration/users")
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType("application/json"))
                .andExpect(status().isForbidden());

        verify(usersClient, times(0)).addSpecialUser(any());
    }

    @Test
    public void GIVEN_dto_contains_roles_AND_user_is_support_WHEN_addUser_THEN_userClient_invoked() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")), // user's default entity
                "a@b.com",
                Collections.singletonList("SUPPORT"));
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_USERS)).thenReturn(true);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_ENTITIES)).thenReturn(true);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_USERS_ROLES)).thenReturn(true);

        List<String> roles = Arrays.asList("ADMIN", "USER_MANAGER", "SUPPORT", "TEMPLATE_MANAGER");

        UserDTO dto = new UserDTO("login",null, null, null, null, null, roles, null, null, null, null);

        when(usersClient.addSpecialUser(dto)).thenReturn(dto);

        mockMvc.perform(post("/secured/administration/users")
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(dto)));

        verify(usersClient, times(0)).specialEntities(any());
    }

    @Test
    public void GIVEN_dto_contains_roles_AND_user_is_user_manager_WHEN_addUser_THEN_forbidden() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")), // user's default entity
                "a@b.com",
                Collections.singletonList("USER_MANAGER"));
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_USERS)).thenReturn(true);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_OWN_ENTITIES)).thenReturn(true);

        List<String> roles = Arrays.asList("ADMIN", "USER_MANAGER", "SUPPORT", "TEMPLATE_MANAGER");

        UserDTO dto = new UserDTO("login",null, null, null, null, null, roles, null, null, null, null);

        mockMvc.perform(post("/secured/administration/users")
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType("application/json"))
                .andExpect(status().isForbidden());

        verify(usersClient, times(0)).addSpecialUser(any());
    }

    @Test
    public void GIVEN_user_is_ADMIN_WHEN_updateEntity_THEN_entity_updated() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")),
                "a@b.com",
                Collections.singletonList("ADMIN"));
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_ENTITIES)).thenReturn(true);
        EntityDTO dto = new EntityDTO("1", "updatedName", "Entity");
        when(usersClient.updateEntity(dto)).thenReturn(dto);

        mockMvc.perform(patch("/secured/administration/entities")
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(dto)));
        verify(usersClient, times(1)).updateEntity(dto);
    }

    @Test
    public void GIVEN_user_is_USER_MANAGER_WHEN_updateEntity_THEN_entity_updated_with_prefix() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")),
                "a@b.com",
                Collections.singletonList("USER_MANAGER"));
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_OWN_ENTITIES)).thenReturn(true);
        ArgumentCaptor<EntityDTO> captor = ArgumentCaptor.forClass(EntityDTO.class);
        EntityDTO response = new EntityDTO("1", "Entity.updatedName", "Entity");
        when(usersClient.updateEntity(captor.capture())).thenReturn(response);
        when(usersClient.specialEntities(eq("Entity"))).thenReturn(Collections.singletonList(new EntityDTO("1", "Entity.updatedName", "Entity")));

        mockMvc.perform(patch("/secured/administration/entities")
                        .content("{\"id\":\"1\",\"name\":\"updatedName\"}")
                        .contentType("application/json"))
                .andExpect(status().isOk());
        assertEquals("Entity.updatedName", captor.getValue().getName());
    }

    @Test
    public void GIVEN_user_is_USER_MANAGER_AND_cannot_access_entity_WHEN_updateEntity_THEN_entity_updated_with_prefix() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")),
                "a@b.com",
                Collections.singletonList("USER_MANAGER"));
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_OWN_ENTITIES)).thenReturn(true);
        ArgumentCaptor<EntityDTO> captor = ArgumentCaptor.forClass(EntityDTO.class);
        EntityDTO response = new EntityDTO("1", "Entity.updatedName", "Entity");
        when(usersClient.updateEntity(captor.capture())).thenReturn(response);
        when(usersClient.specialEntities(eq("Entity"))).thenReturn(Collections.singletonList(new EntityDTO("2", "Entity.updatedName", "Entity")));

        mockMvc.perform(patch("/secured/administration/entities")
                        .content("{\"id\":\"1\",\"name\":\"updatedName\"}")
                        .contentType("application/json"))
                .andExpect(status().isForbidden());
        verify(usersClient, times(0)).deleteEntity(anyString());
    }

    @Test
    public void GIVEN_user_is_ADMIN_WHEN_deleteEntity_THEN_entity_deleted() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")),
                "a@b.com",
                Collections.singletonList("ADMIN"));
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_ENTITIES)).thenReturn(true);
        when(usersClient.deleteEntity("1")).thenReturn(ResponseEntity.ok().build());

        mockMvc.perform(delete("/secured/administration/entities/1"))
                .andExpect(status().isNoContent());
        verify(usersClient, times(1)).deleteEntity("1");
    }

    @Test
    public void GIVEN_user_is_USER_MANAGER_WHEN_deleteEntity_THEN_entity_deleted() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")),
                "a@b.com",
                Collections.singletonList("USER_MANAGER"));
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_OWN_ENTITIES)).thenReturn(true);
        when(usersClient.deleteEntity("1")).thenReturn(ResponseEntity.ok().build());
        when(usersClient.specialEntities(eq("Entity"))).thenReturn(Collections.singletonList(new EntityDTO("1", "Entity.updatedName", "Entity")));

        mockMvc.perform(delete("/secured/administration/entities/1"))
                .andExpect(status().isNoContent());
        verify(usersClient, times(1)).deleteEntity("1");
    }

    @Test
    public void GIVEN_user_is_USER_MANAGER_AND_cannot_access_entity_WHEN_deleteEntity_THEN_forbidden() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")),
                "a@b.com",
                Collections.singletonList("USER_MANAGER"));
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_OWN_ENTITIES)).thenReturn(true);
        when(usersClient.deleteEntity("1")).thenReturn(ResponseEntity.ok().build());
        when(usersClient.specialEntities(eq("Entity"))).thenReturn(Collections.singletonList(new EntityDTO("2", "Entity.updatedName", "Entity")));

        mockMvc.perform(delete("/secured/administration/entities/1"))
                .andExpect(status().isForbidden());
        verify(usersClient, times(0)).deleteEntity(anyString());
    }

    @Test
    public void GIVEN_user_CAN_MANAGE_ALL_USERS_WHEN_deleteUser_THEN_user_deleted() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")),
                "a@b.com",
                Collections.singletonList("ADMIN"));
        when(securityContext.getUser()).thenReturn(user);
        // CAN_MANAGE_ALL_USERS: TRUE
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_USERS)).thenReturn(true);
        when(usersClient.deleteSpecialUser("test")).thenReturn(ResponseEntity.ok().build());

        mockMvc.perform(delete("/secured/administration/users/test"))
                .andExpect(status().isNoContent());
        verify(usersClient, times(1)).deleteSpecialUser( "test");
    }

    @Test
    public void GIVEN_user_with_no_permission_WHEN_deleteUser_THEN_forbidden() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")),
                "a@b.com",
                Collections.singletonList("USER"));
        when(securityContext.getUser()).thenReturn(user);
        // CAN_MANAGE_ALL_USERS: FALSE
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_USERS)).thenReturn(false);

        mockMvc.perform(delete("/secured/administration/users/test"))
                .andExpect(status().isForbidden());

        verify(usersClient, times(0)).deleteSpecialUser(any());
    }

    @Test
    public void GIVEN_user_CAN_MANAGE_ALL_USERS_WHEN_getUserDetails_THEN_user_details_returned() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")),
                "a@b.com",
                Collections.singletonList("ADMIN"));
        when(securityContext.getUser()).thenReturn(user);
        // CAN_MANAGE_ALL_USERS: TRUE
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_USERS)).thenReturn(true);

        List<EntityDTO> entities = Arrays.asList(
                new EntityDTO("1", "Entity1", "Org1"),
                new EntityDTO("2", "Entity2", "Org1"));
        UserDTO dto = new UserDTO("test",null, "Last", "First", "a@b.c", "Boss", Collections.singletonList("USER"), "1", entities, null, null);
        when(usersClient.getUserDetails("test")).thenReturn(dto);

        mockMvc.perform(get("/secured/administration/users/test"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(dto)));
        verify(usersClient, times(1)).getUserDetails( "test");
    }

    @Test
    public void GIVEN_user_with_no_permission_WHEN_getUserDetails_THEN_forbidden() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")),
                "a@b.com",
                Collections.singletonList("USER"));
        when(securityContext.getUser()).thenReturn(user);
        // CAN_MANAGE_ALL_USERS: FALSE
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_USERS)).thenReturn(false);

        mockMvc.perform(get("/secured/administration/users/test"))
                .andExpect(status().isForbidden());

        verify(usersClient, times(0)).deleteSpecialUser(any());
    }

    @Test
    public void GIVEN_user_is_support_WHEN_updateUser_THEN_userClient_invoked() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")),
                "a@b.com",
                Collections.singletonList("SUPPORT"));
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_USERS)).thenReturn(true);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_ENTITIES)).thenReturn(true);

        UserUpdateDTO dto = new UserUpdateDTO("testUser", null, null, null, null, Set.of("e1"), null);
        List<EntityDTO> entities = Collections.singletonList(new EntityDTO("e1", "Entity1", "Org1"));
        UserDTO response = new UserDTO("testUser", null, null, null, null, null, null, null, entities, null, null);
        when(usersClient.updateSpecialUser(dto)).thenReturn(response);

        mockMvc.perform(patch("/secured/administration/users")
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(response)));
        verify(usersClient, times(1)).updateSpecialUser(dto);
        verify(usersClient, times(0)).specialEntities(any());
    }

    @Test
    public void GIVEN_user_is_user_manager_AND_addedEntities_in_user_entities_WHEN_updateUser_THEN_userClient_invoked() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Org1")),
                "a@b.com",
                Collections.singletonList("USER_MANAGER"));
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_USERS)).thenReturn(true);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_OWN_ENTITIES)).thenReturn(true);
        List<EntityDTO> allowedEntities = Arrays.asList(
                new EntityDTO("e1", "Entity1", "Org1"),
                new EntityDTO("e2", "Entity2", "Org1"));
        when(usersClient.specialEntities("Org1")).thenReturn(allowedEntities);

        UserUpdateDTO dto = new UserUpdateDTO("testUser", null, null, null, null, Set.of("e1"), null);
        UserDTO response = new UserDTO("testUser", null, null, null, null, null, null, null, null, null, null);
        when(usersClient.updateSpecialUser(dto)).thenReturn(response);

        mockMvc.perform(patch("/secured/administration/users")
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(response)));
        verify(usersClient, times(1)).updateSpecialUser(dto);
    }

    @Test
    public void GIVEN_user_is_user_manager_AND_addedEntities_not_in_user_entities_WHEN_updateUser_THEN_forbidden() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Org1")),
                "a@b.com",
                Collections.singletonList("USER_MANAGER"));
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_USERS)).thenReturn(true);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_OWN_ENTITIES)).thenReturn(true);
        List<EntityDTO> allowedEntities = Collections.singletonList(new EntityDTO("e1", "Entity1", "Org1"));
        when(usersClient.specialEntities("Org1")).thenReturn(allowedEntities);

        UserUpdateDTO dto = new UserUpdateDTO("testUser", null, null, null, null, Set.of("e99"), null);

        mockMvc.perform(patch("/secured/administration/users")
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType("application/json"))
                .andExpect(status().isForbidden());
        verify(usersClient, times(0)).updateSpecialUser(any());
    }

    @Test
    public void GIVEN_user_is_user_manager_AND_no_addedEntities_WHEN_updateUser_THEN_userClient_invoked() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Org1")),
                "a@b.com",
                Collections.singletonList("USER_MANAGER"));
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_USERS)).thenReturn(true);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_OWN_ENTITIES)).thenReturn(true);

        UserUpdateDTO dto = new UserUpdateDTO("testUser", "Smith", "John", "j.smith@test.com", null, null, Set.of("e1"));
        UserDTO response = new UserDTO("testUser", null, null, null, null, null, null, null, null, null, null);
        when(usersClient.updateSpecialUser(dto)).thenReturn(response);

        mockMvc.perform(patch("/secured/administration/users")
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(response)));
        verify(usersClient, times(1)).updateSpecialUser(dto);
        verify(usersClient, times(0)).specialEntities(any());
    }

    @Test
    public void GIVEN_user_with_no_permission_WHEN_updateUser_THEN_forbidden() throws Exception {
        User user = new User(1L, "user", "User",
                Collections.singletonList(new Entity("1", "Entity", "Entity")),
                "a@b.com",
                Collections.singletonList("USER"));
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_USERS)).thenReturn(false);

        UserUpdateDTO dto = new UserUpdateDTO("testUser", null, null, null, null, Set.of("e1"), null);

        mockMvc.perform(patch("/secured/administration/users")
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType("application/json"))
                .andExpect(status().isForbidden());
        verify(usersClient, times(0)).updateSpecialUser(any());
    }


}
