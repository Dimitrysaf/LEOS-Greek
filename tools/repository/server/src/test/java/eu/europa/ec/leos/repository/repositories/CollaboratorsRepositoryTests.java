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
package eu.europa.ec.leos.repository.repositories;

import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.entities.PackageCollaborators;
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
public class CollaboratorsRepositoryTests {
    private static Logger LOG = LoggerFactory.getLogger(CollaboratorsRepositoryTests.class);

    @Autowired
    PackageCollaboratorsRepository packageCollaboratorsRepository;
    @Autowired
    PackageRepository packageRepository;

    @Test
    public void test_getCollaboratorsFromPackageId() {
        List<PackageCollaborators> collaboratorsList = packageCollaboratorsRepository.findCollaboratorsByPackageId(new BigDecimal(1));
        assertEquals(collaboratorsList.size(), 1);
        assertEquals(collaboratorsList.get(0).getCollaborator().getCollaboratorName(), "demo");
        assertEquals(collaboratorsList.get(0).getCollaborator().getRole(), "OWNER");
    }

    @Test
    public void test_getCollaboratorsFromPackage() {
        Optional<Package> pkg = packageRepository.findPackageByName("package_leos");
        assertTrue(pkg.isPresent());
        List<PackageCollaborators> collaboratorsList = packageCollaboratorsRepository.findPackageCollaboratorsByPkg(pkg.get());
        assertEquals(collaboratorsList.size(), 1);
        assertEquals(collaboratorsList.get(0).getCollaborator().getCollaboratorName(), "demo");
        assertEquals(collaboratorsList.get(0).getCollaborator().getRole(), "OWNER");
    }

    @Test
    public void test_findPackageIdByCollaboratorNameAndByRole() {
        List<BigDecimal> packagesList = packageCollaboratorsRepository.findPackageIdByCollaboratorNameAndRole("demo", "OWNER");
        assertEquals(packagesList.size(), 1);
        assertEquals(packagesList.get(0), new BigDecimal(1));
    }
}
