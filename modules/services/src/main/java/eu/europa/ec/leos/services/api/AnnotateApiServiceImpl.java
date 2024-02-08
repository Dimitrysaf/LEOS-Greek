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

package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.annotation.AnnotateMetadata;
import eu.europa.ec.leos.domain.annotation.AnnotationStatus;
import eu.europa.ec.leos.domain.repository.LeosCategoryClass;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.exception.AnnotateException;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AnnotateApiServiceImpl implements AnnotateApiService {
    private static final Logger LOG = LoggerFactory.getLogger(AnnotateApiServiceImpl.class);

    @Value("${annotate.client.url}")
    private String annotateClientUrl;

    private final DocumentContentService documentContentService;
    private final SecurityContext securityContext;
    private final ElementProcessor<XmlDocument> elementProcessor;
    private final MessageHelper messageHelper;

    public AnnotateApiServiceImpl(DocumentContentService documentContentService, SecurityContext securityContext, ElementProcessor<XmlDocument> elementProcessor, MessageHelper messageHelper) {
        this.documentContentService = documentContentService;
        this.securityContext = securityContext;
        this.elementProcessor = elementProcessor;
        this.messageHelper = messageHelper;
    }

    @Override
    public List<LeosPermission> requestUserPermissions(String documentRef, LeosCategoryClass category) {
        XmlDocument document = documentContentService.getDocumentByRef(documentRef, category);
        return securityContext.getPermissions(document);
    }

    @Override
    public String getAnnotationToken() {
        return securityContext.getAnnotateToken(annotateClientUrl);
    }

    @Override
    public AnnotateMetadata requestDocumentMetadata(String documentRef, LeosCategoryClass category) {
        AnnotateMetadata metadata = new AnnotateMetadata();
        XmlDocument document = documentContentService.getDocumentByRef(documentRef, category);
        metadata.setVersion(document.getVersionLabel());
        metadata.setId(document.getId());
        metadata.setTitle(document.getTitle());
        return metadata;
    }

    @Override
    public List<AnnotateMetadata> requestSearchMetadata() {
        List<AnnotateMetadata> metadataList = new ArrayList<>();
        AnnotateMetadata metadata = new AnnotateMetadata();
        List<String> statusList = new ArrayList<>();
        statusList.add(AnnotationStatus.ALL.name());
        metadata.setStatus(statusList);
        metadataList.add(metadata);
        return metadataList;
    }

    @Override
    public void mergeSuggestion(LeosCategoryClass documentType, String documentRef, String origText, String newText, String elementId, int startOffset, int endOffset) {
        XmlDocument document = documentContentService.getDocumentByRef(documentRef, documentType);
        byte[] resultXmlContent = elementProcessor.replaceTextInElement(document, origText, newText, elementId, startOffset, endOffset, false);
        if (resultXmlContent == null) {
            throw new AnnotateException(messageHelper.getMessage("document.merge.suggestion.failed"));
        }
        document = documentContentService.updateDocument(document, resultXmlContent, messageHelper.getMessage("operation.merge.suggestion"));
        if (document == null) {
            throw new AnnotateException(messageHelper.getMessage("document.merge.suggestion.failed"));
        }
        LOG.info("Merged suggestion in document {}, elementId {}, startOffset {}, endOffset {}", documentRef, elementId, startOffset, endOffset);
    }

}
