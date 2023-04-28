/*
 * Copyright 2019 European Commission
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
package eu.europa.ec.leos.repository;

import eu.europa.ec.leos.repository.entities.Document;
import eu.europa.ec.leos.repository.entities.DocumentV;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.repositories.DocumentRepository;
import eu.europa.ec.leos.repository.repositories.DocumentVRepository;
import eu.europa.ec.leos.repository.repositories.PackageRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class ApplicationTests {

    private static Logger LOG = LoggerFactory.getLogger(ApplicationTests.class);

    @Autowired
    private PackageRepository packageRepository;
    @Autowired
    private DocumentRepository documentRepository;
    @Autowired
    private DocumentVRepository documentVRepository;

    @Test
    @Transactional(readOnly = true)
    public void test_findPackageByName() {
        Package pkg = packageRepository.findPackageByName("templates");
        assertNotNull(pkg);
    }

    @Test
    @Transactional(readOnly = true)
    public void test_findDocumentsByPackageName() {
        Package pkg = packageRepository.findPackageByName("package_ckk8202vl0000n070oin84afg");
        assertNotNull(pkg);
        List<Document> docs = documentRepository.findAllDocumentsByPackageId(pkg);
        assertEquals(docs.size(), 5);
    }

    @Test
    @Transactional(readOnly = true)
    public void test_findAllVersionsOfDocument() {
        List<DocumentV> docs = documentVRepository.findAllVersionsByDocumentId(new BigDecimal(1));
        assertEquals(docs.size(), 1);
    }

    @Test
    @Transactional(readOnly = true)
    public void test_findProposalByDocumentId() {
        List<DocumentV> docs = documentVRepository.findDocumentsByPackageIdAndCategory(new BigDecimal(1), "PROPOSAL");
        assertEquals(docs.size(), 1);
        docs = documentVRepository.findDocumentsByPackageIdAndCategory(new BigDecimal(1), "BILL");
        assertEquals(docs.size(), 1);
        docs = documentVRepository.findDocumentsByPackageIdAndCategory(new BigDecimal(1), "ANNEX");
        assertEquals(docs.size(), 1);
        docs = documentVRepository.findDocumentsByPackageIdAndCategory(new BigDecimal(1), "MEMORANDUM");
        assertEquals(docs.size(), 1);
        Package pkg = packageRepository.findPackageByName("package_ckk8202vl0000n070oin84afg");
        assertNotNull(pkg);
        docs = documentVRepository.findAllVersionsByPackageIdAndCategoryCode(pkg.getId(), "MEMORANDUM");
        assertEquals(docs.size(), 1);
    }
}