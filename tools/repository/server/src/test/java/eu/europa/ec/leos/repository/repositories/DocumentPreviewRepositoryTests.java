/*
 * Copyright 2026 European Union
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

import eu.europa.ec.leos.repository.H2TestBase;
import eu.europa.ec.leos.repository.entities.Document;
import eu.europa.ec.leos.repository.entities.DocumentPreview;
import eu.europa.ec.leos.repository.entities.DocumentPreviewStatus;
import eu.europa.ec.leos.repository.entities.DocumentVersion;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@ActiveProfiles("test")
class DocumentPreviewRepositoryTests extends H2TestBase {

    private static final String DOC_REF = "bill-ref-test-001";
    private static final String VERSION_LABEL = "1.0.0";
    private static final String VERSION_LABEL_2 = "1.1.0";

    @Autowired
    private DocumentPreviewRepository documentPreviewRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private DocumentVersionRepository documentVersionRepository;

    @Autowired
    private EntityManager entityManager;

    // Resolved dynamically from seeded data to avoid fragile hardcoded IDs
    private BigDecimal versionId1;
    private BigDecimal versionId2;

    @BeforeEach
    void setUp() {
        documentPreviewRepository.deleteAll();
        // Resolve version IDs from seeded documents - bill.xml and annex_1.xml are seeded in data-content-h2.sql
        versionId1 = resolveVersionId("bill.xml");
        versionId2 = resolveVersionId("annex_1.xml");
    }

    @AfterEach
    void tearDown() {
        documentPreviewRepository.deleteAll();
    }

    private BigDecimal resolveVersionId(String documentName) {
        List<Document> docs = documentRepository.findDocumentsByName(documentName);
        assertFalse(docs.isEmpty(), "Seeded document not found: " + documentName);
        List<DocumentVersion> versions = documentVersionRepository.findAllVersionsByDocumentId(docs.get(0).getId());
        assertFalse(versions.isEmpty(), "No versions found for document: " + documentName);
        return versions.get(0).getId();
    }

    private DocumentPreview save(BigDecimal versionId, String docRef, String versionLabel, byte[] content, DocumentPreviewStatus status) {
        DocumentPreview entity = new DocumentPreview(versionId, docRef, versionLabel, content, status);
        return documentPreviewRepository.save(entity);
    }

    @Test
    void findByDocumentRefAndVersionLabel_found_returnsEntity() {
        save(versionId1, DOC_REF, VERSION_LABEL, "pdf".getBytes(), DocumentPreviewStatus.COMPLETED);

        Optional<DocumentPreview> result = documentPreviewRepository.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL);

        assertTrue(result.isPresent());
        assertEquals(DOC_REF, result.get().getDocumentRef());
        assertEquals(VERSION_LABEL, result.get().getVersionLabel());
        assertEquals(DocumentPreviewStatus.COMPLETED, result.get().getStatus());
    }

    @Test
    void findByDocumentRefAndVersionLabel_notFound_returnsEmpty() {
        Optional<DocumentPreview> result = documentPreviewRepository.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL);

        assertFalse(result.isPresent());
    }

    @Test
    void findByDocumentRefAndVersionLabel_wrongVersionLabel_returnsEmpty() {
        save(versionId1, DOC_REF, VERSION_LABEL, null, DocumentPreviewStatus.IN_PROGRESS);

        Optional<DocumentPreview> result = documentPreviewRepository.findByDocumentRefAndVersionLabel(DOC_REF, "9.9.9");

        assertFalse(result.isPresent());
    }

    @Test
    void findByDocumentRef_multipleStatuses_returnsAll() {
        save(versionId1, DOC_REF, VERSION_LABEL, "pdf".getBytes(), DocumentPreviewStatus.COMPLETED);
        save(versionId2, DOC_REF, VERSION_LABEL_2, null, DocumentPreviewStatus.IN_PROGRESS);

        List<DocumentPreview> results = documentPreviewRepository.findByDocumentRef(DOC_REF);

        assertEquals(2, results.size());
    }

    @Test
    void findByDocumentRef_noMatch_returnsEmpty() {
        save(versionId1, DOC_REF, VERSION_LABEL, "pdf".getBytes(), DocumentPreviewStatus.COMPLETED);

        List<DocumentPreview> results = documentPreviewRepository.findByDocumentRef("non-existent-ref");

        assertTrue(results.isEmpty());
    }

    @Test
    @Transactional
    void deleteOtherVersions_deletesOlderExceptGivenId() {
        save(versionId1, DOC_REF, VERSION_LABEL, "pdf".getBytes(), DocumentPreviewStatus.COMPLETED);
        DocumentPreview keep = save(versionId2, DOC_REF, VERSION_LABEL_2, "pdf".getBytes(), DocumentPreviewStatus.COMPLETED);

        documentPreviewRepository.deleteOtherVersions(DOC_REF, keep.getId());
        entityManager.flush();
        entityManager.clear();

        List<DocumentPreview> remaining = documentPreviewRepository.findByDocumentRef(DOC_REF);
        assertEquals(1, remaining.size());
        assertEquals(keep.getId(), remaining.get(0).getId());
        assertFalse(documentPreviewRepository.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL).isPresent());
    }

    @Test
    @Transactional
    void deleteOtherVersions_doesNotDeleteNewerCompletedRecord() {
        save(versionId1, DOC_REF, VERSION_LABEL, "pdf".getBytes(), DocumentPreviewStatus.COMPLETED);
        DocumentPreview newer = save(versionId2, DOC_REF, VERSION_LABEL_2, "pdf".getBytes(), DocumentPreviewStatus.COMPLETED);

        // older record completes last - should NOT delete newer (higher ID)
        documentPreviewRepository.deleteOtherVersions(DOC_REF, documentPreviewRepository.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL).get().getId());
        entityManager.flush();
        entityManager.clear();

        assertTrue(documentPreviewRepository.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL_2).isPresent());
    }

    @Test
    @Transactional
    void deleteOtherVersions_onlySingleRecord_nothingDeleted() {
        DocumentPreview only = save(versionId1, DOC_REF, VERSION_LABEL, "pdf".getBytes(), DocumentPreviewStatus.COMPLETED);

        documentPreviewRepository.deleteOtherVersions(DOC_REF, only.getId());
        entityManager.flush();
        entityManager.clear();

        List<DocumentPreview> remaining = documentPreviewRepository.findByDocumentRef(DOC_REF);
        assertEquals(1, remaining.size());
    }

    @Test
    void save_persistsAllFields() {
        byte[] content = "pdf-bytes".getBytes();
        DocumentPreview saved = save(versionId1, DOC_REF, VERSION_LABEL, content, DocumentPreviewStatus.IN_PROGRESS);

        // reload from DB to verify persistence
        Optional<DocumentPreview> reloaded = documentPreviewRepository.findByDocumentRefAndVersionLabel(DOC_REF, VERSION_LABEL);

        assertTrue(reloaded.isPresent());
        assertNotNull(reloaded.get().getId());
        assertEquals(versionId1, reloaded.get().getDocumentVersionId());
        assertEquals(DOC_REF, reloaded.get().getDocumentRef());
        assertEquals(VERSION_LABEL, reloaded.get().getVersionLabel());
        assertEquals(DocumentPreviewStatus.IN_PROGRESS, reloaded.get().getStatus());
        assertArrayEquals(content, reloaded.get().getContent());
        assertNotNull(reloaded.get().getAuditCDate());
    }
}
