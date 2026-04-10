package eu.europa.ec.digit.userdata.services;

import eu.europa.ec.digit.userdata.entities.SpecialEntity;
import eu.europa.ec.digit.userdata.exception.BadRequestException;
import eu.europa.ec.digit.userdata.repositories.SpecialEntityRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class EntityServiceTest {
    @Autowired
    private EntityService entityService;

    @Autowired
    private SpecialEntityRepository specialEntityRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    @Transactional
    @Rollback
    public void GIVEN_id_NOT_set_AND_name_unique_WHEN_createEntity_THEN_entityCreated() {
        SpecialEntity entity = new SpecialEntity();
        entity.setName("test");
        SpecialEntity created = entityService.createEntity(entity);
        assertNotNull(created.getId());
        assertEquals("test", created.getName());

        Long currSeqVal = jdbcTemplate.queryForObject("select LEOS_SPECIAL_ENTITY_SEQ.CURRVAL FROM DUAL", Long.class);
        assertEquals(String.valueOf(currSeqVal), created.getId());

        Optional<SpecialEntity> fromRepo = specialEntityRepository.findById(created.getId());
        assertTrue(fromRepo.isPresent());
        assertEquals("test", fromRepo.get().getName());
    }

    @Test
    @Transactional
    @Rollback
    public void GIVEN_name_NOT_unique_WHEN_createEntity_THEN_IllegalArgumentException() {
        List<SpecialEntity> page = specialEntityRepository.findAll();
        SpecialEntity any = page.getFirst();

        SpecialEntity entity = new SpecialEntity();
        entity.setName(any.getName());
        assertThrows(BadRequestException.class,
                () -> entityService.createEntity(entity),
                "page.workspace.administration.entity-info.entity-name-conflict");
    }

    @Test
    @Transactional
    @Rollback
    public void GIVEN_id_set_WHEN_createEntity_THEN_IllegalArgumentException() {
        SpecialEntity entity = new SpecialEntity();
        entity.setId("123");
        entity.setName("test");
        BadRequestException badRequestException = assertThrows(BadRequestException.class,
                () -> entityService.createEntity(entity));
        assertEquals("page.workspace.administration.entity-info.invalid-request", badRequestException.getMessageKey());
    }

    @Test
    @Transactional
    @Rollback
    public void GIVEN_same_name_different_case_WHEN_createEntity_THEN_IllegalArgumentException() {
        List<SpecialEntity> page = specialEntityRepository.findAll();
        SpecialEntity any = page.getFirst();

        SpecialEntity entity = new SpecialEntity();
        int firstLetter = any.getName().chars().filter(Character::isLetter).findFirst().getAsInt();
        entity.setName(Character.isUpperCase(firstLetter)
                        ? any.getName().toLowerCase()
                        : any.getName().toUpperCase());
        BadRequestException badRequestException = assertThrows(BadRequestException.class,
                () -> entityService.createEntity(entity));
        assertEquals("page.workspace.administration.entity-info.entity-name-conflict", badRequestException.getMessageKey());
    }

    @Test
    @Rollback
    public void GIVEN_children_entities_exist_WHEN_deleteEntity_THEN_children_parentId_updated_to_grandparent() {
        SpecialEntity dgtR = specialEntityRepository.findByName("DGT.R");
        assertNotNull(dgtR);
        
        String dgtRId = dgtR.getId();
        String grandparentId = dgtR.getParentId();

        jdbcTemplate.update("DELETE FROM LEOS_SPECIAL_USER_ENTITY WHERE ENTITY_ID = ? ", dgtRId);
        
        List<SpecialEntity> children = specialEntityRepository.findByParentId(dgtRId);
        assertFalse(children.isEmpty());
        
        entityService.deleteEntity(dgtRId);

        for (SpecialEntity child : children) {
            Optional<SpecialEntity> updated = specialEntityRepository.findById(child.getId());
            assertTrue(updated.isPresent());
            assertEquals(grandparentId, updated.get().getParentId());
        }
    }

    @Test
    @Rollback
    public void GIVEN_users_associated_WHEN_deleteEntity_THEN_error() {
        SpecialEntity dgtR = specialEntityRepository.findByName("DGT.R");
        assertNotNull(dgtR);

        String dgtRId = dgtR.getId();
        String grandparentId = dgtR.getParentId();

        List<SpecialEntity> children = specialEntityRepository.findByParentId(dgtRId);
        assertFalse(children.isEmpty());

        BadRequestException exception = assertThrows(BadRequestException.class, () -> entityService.deleteEntity(dgtRId));
        assertEquals("page.workspace.administration.entity-info.entity-has-users", exception.getMessageKey());
    }
}
