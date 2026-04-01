/*
 * Copyright 2024 European Union
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
package eu.europa.ec.digit.userdata;

import eu.europa.ec.digit.userdata.entities.Entity;
import eu.europa.ec.digit.userdata.entities.SpecialEntity;
import eu.europa.ec.digit.userdata.entities.User;
import eu.europa.ec.digit.userdata.repositories.EntityRepository;
import eu.europa.ec.digit.userdata.repositories.SpecialEntityRepository;
import eu.europa.ec.digit.userdata.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@ActiveProfiles("test")
class ApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityRepository entityRepository;
    @Autowired
    private SpecialEntityRepository specialEntityRepository;

    @Test
    @Transactional(readOnly = true)
    void test_findBylogin() {
        User user = userRepository.findByLogin("jane");
        assertNotNull(user);
        assertEquals("jane", user.getLogin());
        assertEquals("SUPPORT", user.getRoles().getFirst());
        assertEquals(user.getPerId(), Long.valueOf(3)); // from data-h2.sql
        assertEquals("DGT.R.3", user.getEntities().getFirst().getName());
    }

    @Test
    @Transactional(readOnly = true)
    void test_findAllOrganizations() {
        Stream<String> organizations = entityRepository.findAllOrganizations();
        assertEquals(24, organizations.count()); // unique dgs and cabinets from data-h2.sql
    }

    @Test
    @Transactional(readOnly = true)
    void test_findAllFullPathEntities() {
        Stream<Entity> entities = entityRepository
                .findAllFullPathEntities(Arrays.asList("4", "8"));
        List<Entity> test = entities.toList();
        assertFalse(test.isEmpty());
    }
    @Test
    @Transactional
    public void test_insertSpecialEntity() {
        long initialCount = specialEntityRepository.count();

        SpecialEntity entity1 = new SpecialEntity(null, "DIGIT-EDIT", null, "DIGIT-EDIT");
        SpecialEntity entity2 = new SpecialEntity(null, "DGT-EDIT", null, "DGT-EDIT");

        specialEntityRepository.save(entity1);
        specialEntityRepository.save(entity2);

        Iterable<SpecialEntity> organizations = specialEntityRepository.findAll();
        assertEquals(initialCount + 2, StreamSupport.stream(organizations.spliterator(), false).count());
    }
}
