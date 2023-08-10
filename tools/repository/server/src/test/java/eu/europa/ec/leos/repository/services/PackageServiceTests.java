/*
 * Copyright 2023 European Commission
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

import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.repositories.PackageRepository;
import org.assertj.core.util.Sets;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class PackageServiceTests {

    private static Logger LOG = LoggerFactory.getLogger(PackageServiceTests.class);

    @Autowired
    private PackageService packageService;
    @Autowired
    private PackageRepository packageRepository;

    private final String REPO_ID = "leos_dev";

    @Test
    @Transactional
    public void test_createAndDeletePackage() throws RepositoryException {
        eu.europa.ec.leos.repository.model.Package pkg = packageService.createPackage("test", "leos_dev", false, null, "demo");
        Optional<Package> pkgO = packageRepository.findPackageByName(REPO_ID, "test");
        assertTrue(pkgO.isPresent());
        long count = packageRepository.count();
        assertEquals(2, count);
        packageService.deletePackage(REPO_ID, pkg.getName());
        pkgO = packageRepository.findPackageByName(REPO_ID, "test");
        assertFalse(pkgO.isPresent());
        count = packageRepository.count();
        assertEquals(1, count);
    }

    @Test
    @Transactional(readOnly = true)
    public void test_documentsByPackageId() {
        List<LeosDocument> docs = packageService.findDocumentsByPackageId("1", Sets.set("PROPOSAL", "BILL"), false, false);
        assertEquals(2, docs.size());
        docs = packageService.findDocumentsByPackageId("1", Sets.set("PROPOSAL", "ANNEX"), false, false);
        assertEquals(2, docs.size());
    }

    @Test
    @Transactional(readOnly = true)
    public void test_documentsByPackageName() throws RepositoryException {
        List<LeosDocument> docs = packageService.findDocumentsByPackageName(REPO_ID, "%",
                Sets.set(
                "PROPOSAL", "BILL"), true, false);
        assertEquals(2, docs.size());
        docs = packageService.findDocumentsByPackageName(REPO_ID, "%",
                Sets.set("PROPOSAL", "BILL"), false, false);
        assertEquals(0, docs.size());
        docs = packageService.findDocumentsByPackageName(REPO_ID, "package_leos", Sets.set("PROPOSAL", "ANNEX"), false, false);
        assertEquals(2, docs.size());
    }
}