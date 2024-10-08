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

import eu.europa.ec.leos.repository.TestConstants;
import eu.europa.ec.leos.repository.entities.LeosClients;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.entities.WorkflowCollaboratorConfig;
import lombok.extern.slf4j.Slf4j;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
@Slf4j
public class WorkflowCollaboratorConfigRepositoryTests {

    @Autowired
    WorkflowCollaboratorConfigRepository workflowCollaboratorConfigRepository;
    @Autowired
    LeosClientsRepository leosClientsRepository;
    @Autowired
    PackageRepository packageRepository;

    @Ignore
    @Test
    public void test_saveWorkflowCollaboratorConfig() {

        Optional<Package> pkg = packageRepository.findPackageByName(TestConstants.PACKAGE_LEOS);
        assertTrue(pkg.isPresent());
        final Optional<LeosClients> leosClient = leosClientsRepository.findByName(TestConstants.ISCCLIENTID);
        assertTrue(leosClient.isPresent());
        WorkflowCollaboratorConfig workflowCollaboratorConfig = saveWorkflowCollaboratorConfig(pkg, leosClient);
        assertThat(workflowCollaboratorConfig.getId(), is(notNullValue()));
        workflowCollaboratorConfigRepository.delete(workflowCollaboratorConfig);

    }

    private WorkflowCollaboratorConfig saveWorkflowCollaboratorConfig(Optional<Package> pkg, Optional<LeosClients> leosClient) {
        WorkflowCollaboratorConfig workflowCollaboratorConfig =
                WorkflowCollaboratorConfig
                        .builder()
                        .pkg(pkg.get())
                        .leosClients(leosClient.get())
                        .aclCallbackUrl(TestConstants.SAMPLE_ACL_CALLBACK_URL)
                        .userCheckCallbackUrl(TestConstants.SAMPLE_USER_CHECK_CALLBACK_URL)
                        .build();
        workflowCollaboratorConfigRepository.save(workflowCollaboratorConfig);
        return workflowCollaboratorConfig;
    }

    @Ignore
    @Test
    public void test_deleteWorkflowCollaboratorConfigByPackageIdAndClientName() {
        Optional<Package> pkg = packageRepository.findPackageByName("package_leos");
        final Optional<LeosClients> leosClient = leosClientsRepository.findByName(TestConstants.DECISIONCLIENTID);
        final WorkflowCollaboratorConfig workflowCollaboratorConfig = saveWorkflowCollaboratorConfig(pkg, leosClient);
        workflowCollaboratorConfigRepository.delete(workflowCollaboratorConfig);
        final List<WorkflowCollaboratorConfig> list = workflowCollaboratorConfigRepository.findByPackageNameAndClientName(pkg.get().getName(), TestConstants.ISCCLIENTID);
        assertThat(list, hasSize(0));
    }

    @Ignore
    @Test
    public void test_getWorkflowCollaboratorConfigByPackageIdAndClientName() {
        Optional<Package> pkg = packageRepository.findPackageByName("package_leos");
        final Optional<LeosClients> leosClient = leosClientsRepository.findByName(TestConstants.ISCCLIENTID);
        final WorkflowCollaboratorConfig workflowCollaboratorConfig = saveWorkflowCollaboratorConfig(pkg, leosClient);
        final List<WorkflowCollaboratorConfig> list = workflowCollaboratorConfigRepository.findByPackageNameAndClientName(pkg.get().getName(), TestConstants.ISCCLIENTID);
        assertThat(list, hasSize(1));
        workflowCollaboratorConfigRepository.delete(list.get(0));
        final List<WorkflowCollaboratorConfig> list2 = workflowCollaboratorConfigRepository.findByPackageNameAndClientName(pkg.get().getName(), TestConstants.ISCCLIENTID);
        assertThat(list2, hasSize(0));
    }


}
