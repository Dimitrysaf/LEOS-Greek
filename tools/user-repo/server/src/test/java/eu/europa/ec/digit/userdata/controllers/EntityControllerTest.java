package eu.europa.ec.digit.userdata.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.digit.userdata.dto.EntityDto;
import eu.europa.ec.digit.userdata.entities.Entity;
import eu.europa.ec.digit.userdata.entities.SpecialEntity;
import eu.europa.ec.digit.userdata.repositories.EntityRepository;
import eu.europa.ec.digit.userdata.repositories.SpecialEntityRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;


import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles({"test", "h2"})
@SpringBootTest
@AutoConfigureMockMvc
public class EntityControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SpecialEntityRepository specialEntityRepo;

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private EntityRepository entityRepository;

    @Test
    void GIVEN_no_orgName_WHEN_special_THEN_all_special_entities_returned() throws Exception {
        long count = specialEntityRepo.count();
        mockMvc.perform(get("/entities/special")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(count));
    }

    @Test
    void GIVEN_orgName_WHEN_special_THEN_filtered_special_entities_returned() throws Exception {
        Collection<SpecialEntity> cnectEntities = specialEntityRepo.findAllByOrganizationName("CNECT");
        assertTrue(cnectEntities.size() > 1);
        Entity cnectOrg = entityRepository.findFirstByNameAndOrganizationNameAndParentIdIsNull("CNECT", "CNECT").get();
        Set<String> uniqueIds = Stream.concat(cnectEntities.stream().map(SpecialEntity::getId), Stream.of(cnectOrg.getId())).collect(Collectors.toSet());
        long countUniqueIds = uniqueIds.size();
        mockMvc.perform(get("/entities/special").param("orgName", "CNECT")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(countUniqueIds))
                .andDo(r -> {
                    List<EntityDto> returnedEntities = objectMapper.readValue(r.getResponse().getContentAsString(), new TypeReference<>(){});
                    assertEquals(countUniqueIds, returnedEntities.size());
                    assertEquals(uniqueIds, returnedEntities.stream().map(EntityDto::getId).collect(Collectors.toSet()));
                });
    }

    @Test
    void GIVEN_valid_dto_WHEN_create_THEN_entity_persisted_and_returned() throws Exception {
        EntityDto entityDto = new EntityDto(null, "TEST.123", "CNECT");
        String entityAsJson = objectMapper.writeValueAsString(entityDto);
        mockMvc.perform(post("/entities")
                .contentType(MediaType.APPLICATION_JSON)
                .content(entityAsJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value(entityDto.getName()))
                .andExpect(jsonPath("$.organizationName").value(entityDto.getOrganizationName()));
        SpecialEntity createdEntity = specialEntityRepo.findByName(entityDto.getName());
        assertNotNull(createdEntity);
        assertEquals(entityDto.getName(), createdEntity.getName());
        assertEquals(entityDto.getOrganizationName(), createdEntity.getOrganizationName());
    }

    @Test
    void GIVEN_name_with_spaces_WHEN_create_THEN_bad_request() throws Exception {
        EntityDto entityDto = new EntityDto(null, "TEST 123", "CNECT");
        String entityAsJson = objectMapper.writeValueAsString(entityDto);
        mockMvc.perform(post("/entities")
                .contentType(MediaType.APPLICATION_JSON)
                .content(entityAsJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void GIVEN_id_not_null_WHEN_create_THEN_bad_request() throws Exception {
        EntityDto entityDto = new EntityDto("1234567", "TEST.234", "CNECT");
        String entityAsJson = objectMapper.writeValueAsString(entityDto);
        mockMvc.perform(post("/entities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(entityAsJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void GIVEN_name_exists_with_different_letter_case_WHEN_create_THEN_conflict() throws Exception {
        EntityDto entityDto = new EntityDto(null, "cnect", "CNECT");
        String entityAsJson = objectMapper.writeValueAsString(entityDto);
        mockMvc.perform(post("/entities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(entityAsJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void GIVEN_valid_dto_WHEN_update_THEN_entity_updated_and_returned() throws Exception {
        SpecialEntity entity = specialEntityRepo.findByName("CNECT.DDG2");
        assertNotNull(entity);
        EntityDto entityDto = new EntityDto(entity.getId(), "CNECT.DDG2.Updated", "DGT");
        String entityAsJson = objectMapper.writeValueAsString(entityDto);
        mockMvc.perform(patch("/entities")
                .contentType(MediaType.APPLICATION_JSON)
                .content(entityAsJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(entity.getId()))
                // only name is updated
                .andExpect(jsonPath("$.name").value(entityDto.getName()))
                // organizationName is ignored
                .andExpect(jsonPath("$.organizationName").value(entity.getOrganizationName()));
        SpecialEntity updatedEntity = specialEntityRepo.findById(entity.getId()).get();
        // only name is updated
        assertEquals(entityDto.getName(), updatedEntity.getName());
        // organizationName is preserved
        assertEquals(entity.getOrganizationName(), updatedEntity.getOrganizationName());
        // parentId is preserved
        assertEquals(entity.getParentId(), updatedEntity.getParentId());
    }

    @Test
    void GIVEN_non_existent_id_WHEN_update_THEN_not_found() throws Exception {
        EntityDto entityDto = new EntityDto("non-existent-id", "TEST.999", "CNECT");
        String entityAsJson = objectMapper.writeValueAsString(entityDto);
        mockMvc.perform(patch("/entities")
                .contentType(MediaType.APPLICATION_JSON)
                .content(entityAsJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void GIVEN_invalid_name_WHEN_update_THEN_not_bad_request() throws Exception {
        EntityDto entityDto = new EntityDto("CNECT.DDG2", "CNECT.DDG2 1", "CNECT");
        String entityAsJson = objectMapper.writeValueAsString(entityDto);
        mockMvc.perform(patch("/entities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(entityAsJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void GIVEN_valid_id_WHEN_delete_THEN_entity_deleted() throws Exception {
        SpecialEntity entity = specialEntityRepo.save(new SpecialEntity(null, "TEST.ToDelete", null, "CNECT"));
        String entityId = entity.getId();
        mockMvc.perform(delete("/entities/" + entityId))
                .andExpect(status().isOk());
        assertFalse(specialEntityRepo.findById(entityId).isPresent());
    }

    @Test
    void GIVEN_non_existent_id_WHEN_delete_THEN_not_found() throws Exception {
        mockMvc.perform(delete("/entities/non-existent-id"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void GIVEN_entity_with_users_WHEN_delete_THEN_conflict() throws Exception {
        // luke and demo are members of DGT.R.3.002T (id = 8)
        SpecialEntity entity = specialEntityRepo.findById("8").get();
        assertNotNull(entity);
        mockMvc.perform(delete("/entities/" + entity.getId()))
                .andExpect(status().isBadRequest());
    }


}
