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
package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.entities.DocumentPreview;
import eu.europa.ec.leos.repository.entities.DocumentPreviewStatus;
import eu.europa.ec.leos.repository.repositories.DocumentPreviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentPreviewServiceImpl implements DocumentPreviewService {

    @Autowired
    private DocumentPreviewRepository documentPreviewRepository;

    @Override
    @Transactional
    public eu.europa.ec.leos.repository.model.DocumentPreview saveDocumentPreview(String documentVersionId, String documentRef, String versionLabel, byte[] content, String status) {
        BigDecimal docVersionId = new BigDecimal(documentVersionId);
        Optional<DocumentPreview> existing = documentPreviewRepository.findByDocumentRefAndVersionLabel(documentRef, versionLabel);

        DocumentPreview entity;
        if (existing.isPresent()) {
            entity = existing.get();
            entity.setDocumentVersionId(docVersionId);
            entity.setContent(content);
            entity.setStatus(DocumentPreviewStatus.valueOf(status));
            entity.setAuditCDate(LocalDateTime.now());
        } else {
            entity = new DocumentPreview(docVersionId, documentRef, versionLabel, content, DocumentPreviewStatus.valueOf(status));
        }
        entity = documentPreviewRepository.save(entity);
        return toModel(entity);
    }

    @Override
    @Transactional
    public eu.europa.ec.leos.repository.model.DocumentPreview createInProgress(String documentVersionId, String documentRef, String versionLabel) {
        BigDecimal docVersionId = new BigDecimal(documentVersionId);
        Optional<DocumentPreview> existing = documentPreviewRepository.findByDocumentRefAndVersionLabel(documentRef, versionLabel);

        DocumentPreview entity;
        if (existing.isPresent()) {
            entity = existing.get();
            entity.setDocumentVersionId(docVersionId);
            entity.setContent(null);
            entity.setStatus(DocumentPreviewStatus.IN_PROGRESS);
            entity.setAuditCDate(LocalDateTime.now());
        } else {
            entity = new DocumentPreview(docVersionId, documentRef, versionLabel, null, DocumentPreviewStatus.IN_PROGRESS);
        }
        entity = documentPreviewRepository.save(entity);
        return toModel(entity);
    }

    @Override
    @Transactional
    public void markCompleted(String documentRef, String versionLabel, byte[] content) {
        Optional<DocumentPreview> existing = documentPreviewRepository.findByDocumentRefAndVersionLabel(documentRef, versionLabel);
        if (existing.isPresent()) {
            DocumentPreview entity = existing.get();
            entity.setContent(content);
            entity.setStatus(DocumentPreviewStatus.COMPLETED);
            entity.setAuditMDate(LocalDateTime.now());
            documentPreviewRepository.save(entity);
            documentPreviewRepository.deleteOtherVersions(documentRef, entity.getId());
        }
    }

    @Override
    @Transactional
    public void markFailed(String documentRef, String versionLabel) {
        Optional<DocumentPreview> existing = documentPreviewRepository.findByDocumentRefAndVersionLabel(documentRef, versionLabel);
        if (existing.isPresent()) {
            DocumentPreview entity = existing.get();
            entity.setContent(null);
            entity.setStatus(DocumentPreviewStatus.FAILED);
            entity.setAuditMDate(LocalDateTime.now());
            documentPreviewRepository.save(entity);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public eu.europa.ec.leos.repository.model.DocumentPreview findDocumentPreviewByDocumentRef(String documentRef) {
        List<DocumentPreview> entities = documentPreviewRepository.findByDocumentRef(documentRef);
        return entities.stream()
                .filter(e -> DocumentPreviewStatus.COMPLETED == e.getStatus())
                .findFirst()
                .map(this::toModel)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public eu.europa.ec.leos.repository.model.DocumentPreview findByDocumentRefAndVersionLabel(String documentRef, String versionLabel) {
        return documentPreviewRepository.findByDocumentRefAndVersionLabel(documentRef, versionLabel)
                .map(this::toModel)
                .orElse(null);
    }

    @Override
    @Transactional
    public void deleteDocumentPreview(String documentRef, String versionLabel) {
        documentPreviewRepository.findByDocumentRefAndVersionLabel(documentRef, versionLabel)
                .ifPresent(entity -> documentPreviewRepository.delete(entity));
    }

    private eu.europa.ec.leos.repository.model.DocumentPreview toModel(DocumentPreview entity) {
        return new eu.europa.ec.leos.repository.model.DocumentPreview(
                entity.getId().toString(),
                entity.getDocumentVersionId().toString(),
                entity.getDocumentRef(),
                entity.getVersionLabel(),
                entity.getContent(),
                entity.getStatus(),
                entity.getAuditCDate(),
                entity.getAuditMDate()
        );
    }
}
