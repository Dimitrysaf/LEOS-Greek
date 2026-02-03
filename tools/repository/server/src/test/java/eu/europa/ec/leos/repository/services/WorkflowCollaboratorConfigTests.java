package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.H2TestBase;
import eu.europa.ec.leos.repository.TestConstants;
import eu.europa.ec.leos.repository.controllers.requests.WorkflowCollaboratorConfigRequest;
import eu.europa.ec.leos.repository.entities.WorkflowCollaboratorConfig;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@ActiveProfiles("test")
class WorkflowCollaboratorConfigTests extends H2TestBase {

    @Autowired
    private WorkflowCollaboratorConfigService workflowCollaboratorConfigService;

    @Test
    @Transactional
    void test_saveConfig() {
        WorkflowCollaboratorConfigRequest request = TestConstants.getMockWorkflowCollaboratoRequestrConfig();
        final BigDecimal id = workflowCollaboratorConfigService.save(request);
        final Optional<WorkflowCollaboratorConfig> wcc = workflowCollaboratorConfigService.getWorkflowCollaboratorConfigById(id);
        assertThat(wcc.isPresent(), is(true));
    }

    @Test
    void test_mutipleSavings() {
        WorkflowCollaboratorConfigRequest request = TestConstants.getMockWorkflowCollaboratoRequestrConfig();
        workflowCollaboratorConfigService.save(request);
        workflowCollaboratorConfigService.save(request);

        final Optional<WorkflowCollaboratorConfig> workflowCollaboratorConfig = workflowCollaboratorConfigService.getWorkflowCollaboratorConfig(TestConstants.PACKAGE_LEOS, TestConstants.ISCCLIENTID);
        assertTrue(workflowCollaboratorConfig.isPresent(), "workflow collaborator config exists");

        final List<WorkflowCollaboratorConfig> workflowCollaboratorConfigs = workflowCollaboratorConfigService.getWorkflowCollaboratorConfigs(TestConstants.PACKAGE_LEOS);
        assertThat(workflowCollaboratorConfigs, hasSize(1));

    }

    @Test
    @Transactional
    void test_saveConfigTwice() {
        WorkflowCollaboratorConfigRequest request = TestConstants.getMockWorkflowCollaboratoRequestrConfig();
        final BigDecimal id = workflowCollaboratorConfigService.save(request);
        final Optional<WorkflowCollaboratorConfig> wcc = workflowCollaboratorConfigService.getWorkflowCollaboratorConfigById(id);
        assertThat(wcc.isPresent(), is(true));
        request.setAclCallbackUrl(TestConstants.SAMPLE_ACL_CALLBACK_URL2);
        final BigDecimal id2 = workflowCollaboratorConfigService.save(request);
        assertThat(id2, is(equalTo(id)));
        final Optional<WorkflowCollaboratorConfig> wcc2 = workflowCollaboratorConfigService.getWorkflowCollaboratorConfigById(id2);
        assertThat(wcc2.isPresent(), is(true));
        assertThat(wcc2.get().getAclCallbackUrl(),is(equalTo(TestConstants.SAMPLE_ACL_CALLBACK_URL2)));
    }

}
