package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.entities.Collaborators;
import eu.europa.ec.leos.repository.entities.PackageCollaborators;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.Collaborator;
import eu.europa.ec.leos.repository.repositories.CollaboratorsRepository;
import eu.europa.ec.leos.repository.repositories.PackageCollaboratorsRepository;
import eu.europa.ec.leos.repository.repositories.PackageRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.util.AssertionErrors.fail;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class CollaboratorServiceTests {
    @Autowired
    private CollaboratorsService collaboratorsService;
    @Autowired
    private PackageRepository packageRepository;
    @Autowired
    private PackageCollaboratorsRepository packageCollaboratorsRepository;
    @Autowired
    private CollaboratorsRepository collaboratorsRepository;

    private Collaborator existingCollaborator = new Collaborator();
    private Collaborators linkedCollaborators;
    private eu.europa.ec.leos.repository.entities.Package linkedPackage;

    @Before
    public void setup() {
        existingCollaborator.setRole("OWNER");
        existingCollaborator.setEntity("TEST");
        existingCollaborator.setLogin("test");
        List<Collaborator> existingCollaborators = collaboratorsService.getCollaborators(new BigDecimal(1));
        existingCollaborators.add(existingCollaborator);
        collaboratorsService.updateCollaborators("1", existingCollaborators, "demo");
        Optional<Collaborators> linkedCollaboratorsOpt = collaboratorsRepository.findCollaboratorByNameRoleAndOrganization(existingCollaborator.getLogin(),
                existingCollaborator.getRole(), existingCollaborator.getEntity());
        if (linkedCollaboratorsOpt.isPresent()) {
            linkedCollaborators = linkedCollaboratorsOpt.get();
        }

        linkedPackage = packageRepository.getById(new BigDecimal(1));
    }

    @Test
    public void test_removeCollaboratorsWithLinkToPackage() {
        assertThrows(RepositoryException.class,
                ()-> collaboratorsService.removeCollaborator(existingCollaborator.getLogin(), existingCollaborator.getEntity(), existingCollaborator.getRole()));
    }

    @Test
    public void test_removeCollaborators() {
        Optional<PackageCollaborators> pkgCollaborators = packageCollaboratorsRepository.findPackageCollaboratorsByPkgIdAndCollaboratorId(linkedPackage.getId(),
                linkedCollaborators.getId());
        assertTrue(pkgCollaborators.isPresent());
        packageCollaboratorsRepository.delete(pkgCollaborators.get());
        try {
            collaboratorsService.removeCollaborator(existingCollaborator.getLogin(), existingCollaborator.getEntity(), existingCollaborator.getRole());
        } catch (Exception e) {
            fail("Should not throw exception");
        }
    }
}
