package eu.europa.ec.leos.repository.repositories;

import eu.europa.ec.leos.repository.entities.ConfigurationV;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class ConfigurationRepositoryTests {
    private static Logger LOG = LoggerFactory.getLogger(ConfigurationRepositoryTests.class);

    @Autowired
    ConfigurationVRepository configurationVRepository;

    @Test
    @Transactional
    public void test_getConfigurationByName() {
        Optional<ConfigurationV> config = configurationVRepository.findConfigurationByName("structure_04");
        assertTrue(config.isPresent());
    }
}
