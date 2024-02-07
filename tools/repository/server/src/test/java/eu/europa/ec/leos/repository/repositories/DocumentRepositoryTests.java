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
package eu.europa.ec.leos.repository.repositories;

import eu.europa.ec.leos.repository.entities.DocumentV;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class DocumentRepositoryTests {
    private static Logger LOG = LoggerFactory.getLogger(DocumentRepositoryTests.class);

    @Autowired
    DocumentRepository documentRepository;
    @Autowired
    DocumentVRepository documentVRepository;
    @Autowired
    DocumentVersionRepository documentVersionRepository;
    @Autowired
    DocumentContentRepository documentContentRepository;
    @Autowired
    PackageRepository packageRepository;

    @Test
    public void test_findAllVersionsByDocumentId() {
        List<DocumentV> docs = documentVRepository.findAllVersionsByDocumentId(new BigDecimal(1));
        assertEquals(docs.size(), 1);
    }

    @Test
    public void test_findAllVersionsByPackageIdAndCategoryCode() {
        List<DocumentV> docs = documentVRepository.findAllVersionsByPackageIdAndCategoryCode(new BigDecimal(1), "BILL");
        assertEquals(docs.size(), 1);
        docs = documentVRepository.findAllVersionsByPackageIdAndCategoryCode(new BigDecimal(1), "ANNEX");
        assertEquals(docs.size(), 1);
    }

    @Test
    public void test_findVersionByVersionId() {
        Optional<DocumentV> doc = documentVRepository.findVersionByVersionId(new BigDecimal(1));
        assertTrue(doc.isPresent());
        assertEquals(doc.get().getVersionLabel(), "1.0.0");
        assertEquals(doc.get().getVersionId(), new BigDecimal(1));
    }

    @Test
    public void test_findLastVersionByDocumentId() {
        Optional<DocumentV> doc = documentVRepository.findLastVersionByDocumentId(new BigDecimal(1));
        assertTrue(doc.isPresent());
        assertEquals(doc.get().getVersionLabel(), "1.0.0");
        assertEquals(doc.get().getVersionId(), new BigDecimal(1));
    }

    @Test
    public void test_findLastVersionByPackageId() {
        List<DocumentV> docs = documentVRepository.findDocumentsByPackageId(new BigDecimal(1));
        assertEquals(docs.size(), 4);
    }
}
