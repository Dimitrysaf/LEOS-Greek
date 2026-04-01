package eu.europa.ec.digit.userdata.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.digit.userdata.dto.EntityDto;
import eu.europa.ec.digit.userdata.entities.Entity;
import eu.europa.ec.digit.userdata.entities.SpecialEntity;
import eu.europa.ec.digit.userdata.entities.User;
import eu.europa.ec.digit.userdata.mappers.EntityMapper;
import eu.europa.ec.digit.userdata.services.EntityService;
import eu.europa.ec.digit.userdata.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EntityController.class)
class EntityControllerUTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EntityService entityService;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private EntityMapper entityMapper;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAllOrganizations_ShouldReturnOrganizations() throws Exception {
        List<String> organizations = Arrays.asList("Org1", "Org2");
        when(entityService.getAllOrganizations()).thenReturn(organizations);

        mockMvc.perform(get("/entities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void searchUsersByOrganizationAndKey_ShouldReturnUsers() throws Exception {
        List<User> users = Arrays.asList(
                new User("1", 1L, "first", "last", "a@b.com", "job", new ArrayList<>(), new ArrayList<>()),
                new User("2", 2L, "first", "last", "XXXXXXX", "job", new ArrayList<>(), new ArrayList<>()));
        when(userService.search(anyString(), anyString(), any(Long.class))).thenReturn(users);

        mockMvc.perform(get("/entities/testOrg/users")
                        .param("searchKey", "test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void getAllFullPathEntitiesForUser_ShouldReturnEntities() throws Exception {
        User user = new User();
        List<Entity> entities = Arrays.asList(new Entity(), new Entity());
        when(userService.getUser(anyString())).thenReturn(user);
        when(entityService.getEntitiesForUser(any(User.class))).thenReturn(entities);

        mockMvc.perform(get("/entities/userId123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void createEntity_ShouldReturnCreatedEntity() throws Exception {
        EntityDto inputDto = new EntityDto();
        inputDto.setName("TestEntity");
        
        SpecialEntity entity = new SpecialEntity();
        SpecialEntity savedEntity = new SpecialEntity();
        EntityDto outputDto = new EntityDto();
        outputDto.setId("123");
        outputDto.setName("TestEntity");

        when(entityMapper.toSpecialEntity(any(EntityDto.class))).thenReturn(entity);
        when(entityService.createEntity(any(SpecialEntity.class))).thenReturn(savedEntity);
        when(entityMapper.toDto(any(SpecialEntity.class))).thenReturn(outputDto);

        mockMvc.perform(post("/entities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("123"))
                .andExpect(jsonPath("$.name").value("TestEntity"));
    }

    @Test
    void GIVEN_entity_name_empty_WHEN_createEntity_THEN_validation_error() throws Exception {
        EntityDto inputDto = new EntityDto();

        SpecialEntity entity = new SpecialEntity();
        SpecialEntity savedEntity = new SpecialEntity();
        EntityDto outputDto = new EntityDto();
        outputDto.setId("123");
        outputDto.setName("Test Entity");

        when(entityMapper.toSpecialEntity(any(EntityDto.class))).thenReturn(entity);
        when(entityService.createEntity(any(SpecialEntity.class))).thenReturn(savedEntity);
        when(entityMapper.toDto(any(SpecialEntity.class))).thenReturn(outputDto);

        mockMvc.perform(post("/entities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void GIVEN_entity_id_NOT_empty_WHEN_createEntity_THEN_validation_error() throws Exception {
        EntityDto inputDto = new EntityDto();
        inputDto.setId("123");
        inputDto.setName("Test Entity");

        SpecialEntity entity = new SpecialEntity();
        SpecialEntity savedEntity = new SpecialEntity();
        EntityDto outputDto = new EntityDto();
        outputDto.setId("123");
        outputDto.setName("Test Entity");

        when(entityMapper.toSpecialEntity(any(EntityDto.class))).thenReturn(entity);
        when(entityService.createEntity(any(SpecialEntity.class))).thenReturn(savedEntity);
        when(entityMapper.toDto(any(SpecialEntity.class))).thenReturn(outputDto);

        mockMvc.perform(post("/entities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void GIVEN_orgName_null_WHEN_special_THEN_all_entities_listed() throws Exception {
        SpecialEntity[] entities = {
                new SpecialEntity("1", "ONE", null, null),
                new SpecialEntity("2", "TWO", null, null),
                new SpecialEntity("3", "THREE", null, null)
        };

        when(entityService.getAllSpecial()).thenReturn(Arrays.asList(entities));
        for(SpecialEntity e : entities) {
            when(entityMapper.toDto(e)).thenReturn(new EntityDto(e.getId(), e.getName(), e.getOrganizationName()));
        }
        mockMvc.perform(get("/entities/special"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3));

        verify(entityService, never()).getOrganization(anyString());
        verify(entityService, never()).getSpecialForOrganization(anyString());
    }

    @Test
    void GIVEN_orgName_blank_WHEN_special_THEN_all_entities_listed() throws Exception {
        SpecialEntity[] entities = {
                new SpecialEntity("1", "ONE", null, null),
                new SpecialEntity("2", "TWO", null, null),
                new SpecialEntity("3", "THREE", null, null)
        };

        when(entityService.getAllSpecial()).thenReturn(Arrays.asList(entities));
        for(SpecialEntity e : entities) {
            when(entityMapper.toDto(e)).thenReturn(new EntityDto(e.getId(), e.getName(), e.getOrganizationName()));
        }
        mockMvc.perform(get("/entities/special").param("orgName", "  "))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3));

        verify(entityService, never()).getOrganization(anyString());
        verify(entityService, never()).getSpecialForOrganization(anyString());
    }


    @Test
    void GIVEN_orgName_not_blank_WHEN_special_THEN_entities_for_org_listed() throws Exception {
        SpecialEntity[] entities = {
                new SpecialEntity("1", "ONE", null, null),
                new SpecialEntity("2", "TWO", null, null),
                new SpecialEntity("3", "THREE", null, null)
        };
        Entity org = new Entity("ORG_ID", "ORG", null, "ORG");

        when(entityService.getSpecialForOrganization("ORG")).thenReturn(Arrays.asList(entities));
        for(SpecialEntity e : entities) {
            when(entityMapper.toDto(e)).thenReturn(new EntityDto(e.getId(), e.getName(), e.getOrganizationName()));
        }
        when(entityService.getOrganization("ORG")).thenReturn(Optional.of(org));
        when(entityMapper.toDto(org)).thenReturn(new EntityDto(org.getId(), org.getName(), org.getOrganizationName()));
        mockMvc.perform(get("/entities/special").param("orgName", "ORG"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0].id").value("ORG_ID"))
                .andExpect(jsonPath("$[1].id").value("1"))
                .andExpect(jsonPath("$[2].id").value("2"))
                .andExpect(jsonPath("$[3].id").value("3"));

        verify(entityService, never()).getAllSpecial();
    }
}