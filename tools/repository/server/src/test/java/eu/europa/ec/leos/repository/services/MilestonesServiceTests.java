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

import eu.europa.ec.leos.repository.TestUtils;
import eu.europa.ec.leos.repository.controllers.requests.QueryFilter;
import eu.europa.ec.leos.repository.entities.DocumentMilestone;
import eu.europa.ec.leos.repository.entities.DocumentMilestoneList;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.repositories.DocumentMilestoneListRepository;
import eu.europa.ec.leos.repository.repositories.DocumentMilestoneRepository;
import eu.europa.ec.leos.repository.utils.ConversionUtils;
import org.assertj.core.util.Sets;
import org.junit.Before;
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
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class MilestonesServiceTests {
    private static final Logger LOG = LoggerFactory.getLogger(MilestonesServiceTests.class);

    @Autowired
    PackageService packageService;
    @Autowired
    DocumentService documentService;
    @Autowired
    DocumentMilestoneRepository documentMilestoneRepository;
    @Autowired
    DocumentMilestoneListRepository documentMilestoneListRepository;

    private LeosDocument milestone;
    private final String REPO_ID = "leos_dev";
    private final String PKG_NAME = "/leos/workspaces/testMilestone";
    private final String MILESTONE_NAME = "PROP_ACT-clilif9gy0000ro28zt8al0yh-en.leg";
    private final String CAT = "LEG";
    private eu.europa.ec.leos.repository.model.Package pkg;
    private byte[] content;

    @Before
    public void setup() throws RepositoryException {
        pkg = packageService.createPackage(PKG_NAME, REPO_ID, false, null, "demo");
        Map<String, ?> properties = new HashMap() {{
            put("status", "IN_PREPARATION");
            put("containedDocuments", Arrays.asList("ANNEX-clfwd4ig3000h9256za2lfv6x-en.xml", "DIR-clfwc8tt900099256foj1l39z-en.xml",
                    "EXPL_MEMORANDUM-clfwc8sc60008925620y1bsfl-en.xml", "main-clfwc8rhf00079256x6j3x0t9-en.xml", "STAT_FINANC_LEGIS-clfwcle7j000a9256o4cvc2p6-en.xml"));
            put("category", CAT);
            put("milestoneComments", Arrays.asList("For Interservice Consultation"));
            put("jobDate", ConversionUtils.getLeosDateAsString(new Date(), ConversionUtils.LEOS_REPO_DATE_FORMAT));
            put("initialCreationDate", ConversionUtils.getLeosDateAsString(new Date(), ConversionUtils.LEOS_REPO_DATE_FORMAT));
            put("initialCreatedBy", "jane");
            put ("name", MILESTONE_NAME);
            put("jobId", "230607113102710TBXAVVHGGP");
        }};
        content = TestUtils.getFileContent("/milestone/PROP_ACT-TEST-EN.leg");
        milestone = documentService.createDocumentFromContent(REPO_ID, PKG_NAME,
                MILESTONE_NAME, properties, "0.1.1", 3,
                content, "First version", "jane");
        assertNotNull(milestone);
        Optional<DocumentMilestone> docMilestone = documentMilestoneRepository.findById(new BigDecimal(Long.parseLong(milestone.getVersionId())));
        assertTrue(docMilestone.isPresent());
        List<DocumentMilestoneList> milestonesDocuments =
                documentMilestoneListRepository.findDocumentMilestoneListsByMilestone(docMilestone.get());
        assertFalse(milestonesDocuments.isEmpty());
        assertEquals(milestonesDocuments.size(), 5);
    }

    @Test
    @Transactional
    public void test_searchMilestone() throws RepositoryException {
        List<LeosDocument> milestones = documentService.findDocumentByName(MILESTONE_NAME);
        assertEquals(milestones.size(), 1);
        assertEquals(milestones.get(0).getName(), MILESTONE_NAME);
        assertTrue(Arrays.equals(milestones.get(0).getSource(), content));
        assertEquals(milestones.get(0).getRef(), MILESTONE_NAME.substring(0, MILESTONE_NAME.lastIndexOf('.')));
        assertEquals(milestones.get(0).getMetadata().get("containedDocuments"), milestone.getMetadata().get("containedDocuments"));
        assertEquals(milestones.get(0).getMetadata().get("milestoneComments"), milestone.getMetadata().get("milestoneComments"));
        assertEquals(milestones.get(0).getCategory(), CAT);
        assertEquals(pkg.getId(), milestones.get(0).getPackageId());
        assertEquals(milestones.get(0).getMetadata().get("status"), milestone.getMetadata().get("status"));
    }

    @Test
    @Transactional
    public void test_findMilestoneByStatus() throws RepositoryException {
        List<LeosDocument> milestones = documentService.findDocumentsByStatus("IN_PREPARATION");
        assertEquals(milestones.size(), 1);
        assertEquals(milestones.get(0).getName(), MILESTONE_NAME);
        assertTrue(Arrays.equals(milestones.get(0).getSource(), content));
        assertEquals(milestones.get(0).getRef(), MILESTONE_NAME.substring(0, MILESTONE_NAME.lastIndexOf('.')));
        assertEquals(milestones.get(0).getMetadata().get("containedDocuments"), milestone.getMetadata().get("containedDocuments"));
        assertEquals(milestones.get(0).getMetadata().get("milestoneComments"), milestone.getMetadata().get("milestoneComments"));
        assertEquals(milestones.get(0).getCategory(), CAT);
        assertEquals(pkg.getId(), milestones.get(0).getPackageId());
        assertEquals(milestones.get(0).getMetadata().get("status"), milestone.getMetadata().get("status"));
    }

    @Test
    @Transactional
    public void test_updateMilestone() throws Exception {
        Map<String, ?> properties = new HashMap() {
            {
                put("status", "FILE_READY");
            }};
        LeosDocument updatedMilestone = documentService.updateDocument(milestone.getRef(), properties, "0.1.1", 3,
                "Second Version", "test");
        assertEquals(updatedMilestone.getName(), MILESTONE_NAME);
        assertTrue(Arrays.equals(updatedMilestone.getSource(), content));
        assertEquals(updatedMilestone.getRef(), MILESTONE_NAME.substring(0, MILESTONE_NAME.lastIndexOf('.')));
        assertEquals(updatedMilestone.getMetadata().get("containedDocuments"), milestone.getMetadata().get("containedDocuments"));
        assertEquals(updatedMilestone.getMetadata().get("milestoneComments"), milestone.getMetadata().get("milestoneComments"));
        assertEquals(updatedMilestone.getCategory(), CAT);
        assertEquals(pkg.getId(), updatedMilestone.getPackageId());
        assertEquals(updatedMilestone.getMetadata().get("status"), "FILE_READY");
    }

    @Test
    @Transactional
    public void test_searchMilestonesWithFilter() {
        QueryFilter filter = new QueryFilter();
        filter.addFilter(new QueryFilter.Filter("containedDocuments", "IN", false, "ANNEX-clfwd4ig3000h9256za2lfv6x-en.xml", "DIR-clfwc8tt900099256foj1l39z" +
                "-en.xml"));
        Set<String> categories = Sets.set("LEG");
        List<LeosDocument> docs = documentService.findDocumentsUsingFilter("/leos/workspaces", categories, filter, 0, 5);
        assertEquals(docs.size(), 1);
        assertEquals(docs.get(0).getCategory(), "LEG");
    }

    @Test
    @Transactional(readOnly = true)
    public void test_documentsByPackageName() throws RepositoryException {
        List<LeosDocument> docs = packageService.findDocumentsByPackageName(REPO_ID, "/leos/workspaces",
                Sets.set("LEG"), true);
        assertEquals(1, docs.size());
    }
}
