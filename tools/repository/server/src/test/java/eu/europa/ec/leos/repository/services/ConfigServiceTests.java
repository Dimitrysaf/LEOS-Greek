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
package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ConfigServiceTests {
    @Autowired
    DocumentService documentService;

    @Test
    public void test_getConfigStructure() throws RepositoryException {
        Optional<LeosDocument> structure = documentService.findDocumentByName("structure_01");
        assertTrue(structure.isPresent());
        assertEquals(structure.get().getName(), "structure_01");
        assertEquals(structure.get().getRef(), "structure_01");
        assertEquals(structure.get().getCategory(), "STRUCTURE");
        Optional<LeosDocument> config = documentService.findDocumentByName("BL-019-CONF");
        assertTrue(structure.isPresent());
        assertEquals(config.get().getName(), "BL-019-CONF");
        assertEquals(config.get().getRef(), "BL-019-CONF");
        assertEquals(config.get().getCategory(), "CONFIG");
        config = documentService.findDocumentByName("catalog");
        assertTrue(structure.isPresent());
        assertEquals(config.get().getName(), "catalog");
        assertEquals(config.get().getRef(), "catalog");
        assertEquals(config.get().getCategory(), "CONFIG");
        Optional<LeosDocument> template = documentService.findDocumentByName("BL-019");
        assertTrue(template.isPresent());
        assertEquals(template.get().getName(), "BL-019");
        assertEquals(template.get().getRef(), "BL-019");
        assertEquals(template.get().getCategory(), "TEMPLATE_BILL");
    }
}
