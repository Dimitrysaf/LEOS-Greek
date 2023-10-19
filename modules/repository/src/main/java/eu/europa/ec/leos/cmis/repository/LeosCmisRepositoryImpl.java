/*
 * Copyright 2018 European Commission
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
package eu.europa.ec.leos.cmis.repository;

import eu.europa.ec.leos.cmis.extensions.CmisDocumentExtensions;
import eu.europa.ec.leos.cmis.extensions.CmisFolderExtensions;
import eu.europa.ec.leos.cmis.extensions.LeosMetadataExtensions;
import eu.europa.ec.leos.domain.common.RepositoryProfileType;
import eu.europa.ec.leos.domain.vo.CloneDocumentMetadataVO;
import eu.europa.ec.leos.repository.RepositoryProfile;
import eu.europa.ec.leos.repository.mapping.LeosMapper;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosExportStatus;
import eu.europa.ec.leos.domain.repository.LeosLegStatus;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.ExportDocument;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.model.filter.QueryFilter;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.cmis.CmisRepositoryContext;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMapHelper;
import eu.europa.ec.leos.security.SecurityContext;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.inject.Provider;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static eu.europa.ec.leos.cmis.support.RepositoryUtil.updateDocumentProperties;
import static eu.europa.ec.leos.cmis.support.RepositoryUtil.updateMilestoneCommentsProperties;
import static java.util.Collections.emptyList;
import static java.util.Collections.singletonList;
import static java.util.stream.Collectors.toList;
import static org.springframework.util.StringUtils.isEmpty;

/**
 * LEOS Repository implementation.
 *
 * @constructor Creates a generic LEOS Repository, injected with a CMIS Repository and a Security Context.
 */
@Repository
@RepositoryProfile(repositoryProfiles = {RepositoryProfileType.DEFAULT, RepositoryProfileType.CMIS})
public class LeosCmisRepositoryImpl implements LeosRepository {

    private static final Logger logger = LoggerFactory.getLogger(LeosCmisRepositoryImpl.class);

    private final String exportMimeType;
    private final String legMimeType;
    private final String leosDocMimeType;
    private final CmisRepository repository;
    private final SecurityContext securityContext;
    private final LeosPermissionAuthorityMapHelper authorityMapHelper;
    private final Provider<CmisRepositoryContext> repositoryContextProvider;
    private final RepositoryPropertiesMapper repositoryPropertiesMapper;

    @Autowired
    public LeosCmisRepositoryImpl(CmisRepository cmisRepository, RepositoryPropertiesMapper repositoryPropertiesMapper, SecurityContext securityContext,
                                  LeosPermissionAuthorityMapHelper authorityMapHelper, Provider<CmisRepositoryContext> repositoryContextProvider) {
        this.repository = cmisRepository;
        this.securityContext = securityContext;
        this.authorityMapHelper = authorityMapHelper;
        this.repositoryContextProvider = repositoryContextProvider;
        this.repositoryPropertiesMapper = repositoryPropertiesMapper;
        legMimeType = "application/octet-stream";
        leosDocMimeType = "application/akn+xml";
        exportMimeType = "application/octet-stream";
    }

    @Override
    public <D extends LeosDocument, M extends LeosMetadata> D createDocument(String templateId, String path, String name,
                                                                              M metadata, Class<? extends D> type) {
        logger.trace("Creating document... [template=" + templateId + ", path=" + path + ", name=" + name + ']');

        checkSecurityContextEnsureUserIsPresent();

        long startTimeNanos = System.nanoTime();
        Map<String, Object> properties = new HashMap<>();
        properties.put(PropertyIds.NAME, name);
        setDocumentCollaboratorProperties(metadata, properties);

        Document doc = repository.createDocumentFromSource(templateId, path, properties);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document creation took " + time + " milliseconds.");

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to create document! [template=" + templateId + ", path=" + path + ", name=" + name + ']'));
    }

    @Override
    public <D extends LeosDocument, M extends LeosMetadata> D createClonedDocument(String templateId, String path, String name,
                                                                             M metadata, CloneDocumentMetadataVO cloneDocumentMetadataVO, Class<? extends D> type) {
        logger.trace("Creating cloned document... [template=" + templateId + ", path=" + path + ", name=" + name + ']');

        checkSecurityContextEnsureUserIsPresent();

        long startTimeNanos = System.nanoTime();
        Map<String, Object> properties = new HashMap<>();
        properties.put(PropertyIds.NAME, name);
        setDocumentCollaboratorProperties(metadata, properties);

        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.ORIGIN_REF), cloneDocumentMetadataVO.getOriginRef());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_FROM), cloneDocumentMetadataVO.getClonedFromRef());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_PROPOSAL), true);
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED), true);

        Document doc = repository.createDocumentFromSource(templateId, path, properties);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document creation took " + time + " milliseconds.");

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to create document! [template=" + templateId + ", path=" + path + ", name=" + name + ']'));
    }

    @Override
    public <D extends LeosDocument, M extends LeosMetadata> D createDocumentFromContent(String path, String name, M metadata, Class<? extends D> type, String leosCategory, byte[] contentBytes) {
        logger.trace("Creating document From Content... [path=" + path + ", name=" + name + ']');

        checkSecurityContextEnsureUserIsPresent();

        long startTimeNanos = System.nanoTime();

        Map<String, Object> properties = getCustomPropertiesMap(name, metadata, leosCategory);

        Document doc = repository.createDocumentFromContent(path, name, properties, leosDocMimeType, contentBytes);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document creation took " + time + " milliseconds.");

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to create document! [path=" + path + ", name=" + name + ']'));
    }

    @Override
    public <D extends LeosDocument, M extends LeosMetadata> D createClonedDocumentFromContent(String path, String name,
                                                                                        M metadata,
                                                                                        CloneProposalMetadataVO cloneProposalMetadataVO,
                                                                                        Class<? extends D> type,
                                                                                        String leosCategory,
                                                                                        byte[] contentBytes) {
        logger.trace("Creating document From Content... [path=" + path + ", name=" + name + ']');

        checkSecurityContextEnsureUserIsPresent();

        long startTimeNanos = System.nanoTime();

        Map<String, Object> properties = getCustomPropertiesMap(name, metadata, leosCategory);
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_PROPOSAL), cloneProposalMetadataVO.isClonedProposal());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.ORIGIN_REF), cloneProposalMetadataVO.getOriginRef());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_FROM), cloneProposalMetadataVO.getClonedFromRef());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.REVISION_STATUS), cloneProposalMetadataVO.getRevisionStatus());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED), cloneProposalMetadataVO.isClonedProposal());

        Document doc = repository.createDocumentFromContent(path, name, properties, leosDocMimeType, contentBytes);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.info("Created cloned document {} in {} milliseconds.", name,  time);

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to create document! [path=" + path + ", name=" + name + ']'));
    }

    @Override
    public <D extends LeosDocument, M extends LeosMetadata> D createClonedDocumentFromContent(String path, String name,
                                                                                              M metadata,
                                                                                              CloneDocumentMetadataVO cloneDocumentMetadataVO,
                                                                                              Class<? extends D> type,
                                                                                              String leosCategory,
                                                                                              byte[] contentBytes) {
        logger.trace("Creating document From Content... [path=" + path + ", name=" + name + ']');

        checkSecurityContextEnsureUserIsPresent();

        long startTimeNanos = System.nanoTime();

        Map<String, Object> properties = getCustomPropertiesMap(name, metadata, leosCategory);
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.ORIGIN_REF), cloneDocumentMetadataVO.getOriginRef());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_FROM), cloneDocumentMetadataVO.getClonedFromRef());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_PROPOSAL), true);
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED), true);

        Document doc = repository.createDocumentFromContent(path, name, properties, leosDocMimeType, contentBytes);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.info("Created cloned document {} in {} milliseconds.", name,  time);

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to create document! [path=" + path + ", name=" + name + ']'));
    }

    private <M extends LeosMetadata> void setDocumentCollaboratorProperties(M metadata, Map<String, Object> properties) {
        properties.putAll(LeosMetadataExtensions.toCmisProperties(metadata));
        User user = securityContext.getUser();
        String userDefaultEntity = user.getDefaultEntity() != null ? user.getDefaultEntity().getName() : "";
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.COLLABORATORS), singletonList(getAccessRecord(user.getLogin(), authorityMapHelper.getRoleForDocCreation(), userDefaultEntity)));
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.INITIAL_CREATED_BY), securityContext.getUser().getLogin());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.INITIAL_CREATION_DATE), Date.from(Instant.now()));
    }


    private <M extends LeosMetadata> Map<String, Object> getCustomPropertiesMap(String name, M metadata, String leosCategory) {
        Map<String, Object> properties = new HashMap<>();
        properties.put(PropertyIds.NAME, name);
        properties.put(PropertyIds.BASE_TYPE_ID, BaseTypeId.CMIS_DOCUMENT.value());
        properties.put(PropertyIds.OBJECT_TYPE_ID, LeosMapper.leosPrimaryType(XmlDocument.class));
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_CATEGORY), leosCategory);
        setDocumentCollaboratorProperties(metadata, properties);
        return properties;
    }

    @Override
    public LegDocument createLegDocumentFromContent(String path, String name, String jobId, List<String> milestoneComments, byte[] contentBytes, LeosLegStatus status,
                                                    List<String> containedDocuments) {
        logger.trace("Creating leg document from content... [path=" + path + ", name=" + name + ']');

        checkSecurityContextEnsureUserIsPresent();

        long startTimeNanos = System.nanoTime();

        Map<String, Object> properties = new HashMap<>();
        properties.put(PropertyIds.NAME, name);
        properties.put(PropertyIds.BASE_TYPE_ID, BaseTypeId.CMIS_DOCUMENT.value());
        properties.put(PropertyIds.OBJECT_TYPE_ID, LeosMapper.leosPrimaryType(LegDocument.class));
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_CATEGORY), LeosCategory.LEG.name());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.JOB_ID), jobId);
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.JOB_DATE), Date.from(Instant.now()));
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.MILESTONE_COMMENTS), milestoneComments);
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS), status.name());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.INITIAL_CREATED_BY), securityContext.getUser().getLogin());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.INITIAL_CREATION_DATE), Date.from(Instant.now()));
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CONTAINED_DOCUMENTS), containedDocuments);

        Document doc = repository.createDocumentFromContent(path, name, properties, legMimeType, contentBytes);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository Leg document creation from content took " + time + " milliseconds.");

        return toLeosDocument(doc, LegDocument.class, true)
                .orElseThrow(() -> new IllegalStateException("Unable to create leg document from content! [path=" + path + ", name=" + name + ']'));
    }

    @Override
    public LegDocument updateLegDocument(String ref, String id, LeosLegStatus status) {
        logger.trace("Updating Leg document status... [id=" + id + ", status=" + status.name() + ']');
        long startTimeNanos = System.nanoTime();

        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS), status.name());

        Document doc = repository.updateDocument(id, properties);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository Leg document status update took " + time + " milliseconds.");

        return toLeosDocument(doc, LegDocument.class, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update leg document status! [id=" + id + ", status=" + status.name() + ']'));
    }

    @Override
    public LegDocument updateLegDocument(String ref, String id, List<String> containedDocuments) {
        logger.trace("Updating Leg document contained files... [id=" + id + "]");
        long startTimeNanos = System.nanoTime();

        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CONTAINED_DOCUMENTS), containedDocuments);

        Document doc = repository.updateDocument(id, properties);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository Leg document contained files update took " + time + " milliseconds.");

        return toLeosDocument(doc, LegDocument.class, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update leg contained files! [id=" + id + "]"));
    }

    @Override
    public LegDocument updateLegDocument(String id, LeosLegStatus status, byte[] contentBytes, VersionType versionType, String comment) {
        logger.debug("Updating Leg document status and content... [id=" + id + ", status=" + status.name() + ", content size=" + contentBytes.length + ", versionType=" + versionType + ", comment=" + comment + ']');
        long startTimeNanos = System.nanoTime();

        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS), status.name());

        Document doc = repository.updateDocument(id, properties, contentBytes, versionType, comment);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository Leg document status and content update took " + time + " milliseconds.");

        return toLeosDocument(doc, LegDocument.class, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update leg document! [id=" + id + ", status=" + status.name() + ']'));
    }

    @Override
    public <D extends LeosDocument, M extends LeosMetadata> D updateDocument(String ref, String id, M metadata, Class<? extends D> type) {
        logger.trace("Updating document metadata... [id=" + id + ']');

        long startTimeNanos = System.nanoTime();
        Document doc = repository.updateDocument(id, updateDocumentProperties(metadata));
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document update took " + time + " milliseconds.");

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update document! [id=" + id + ']'));
    }

    @Override
    public <D extends LeosDocument, M extends LeosMetadata> D updateDocument(String id, M metadata, byte[] content, VersionType versionType, String comment, Class<? extends D> type) {
        logger.trace("Updating document metadata and content... [id=" + id + ", comment=" + comment + ']');

        long startTimeNanos = System.nanoTime();

        Document doc = repository.updateDocument(id, updateDocumentProperties(metadata), content, versionType, comment);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document update took " + time + " milliseconds.");

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update document! [id=" + id + ", comment=" + comment + ']'));
    }

    @Override
    public <D extends LeosDocument> D updateDocument(String id, byte[] content, VersionType versionType, String comment,
                                                     Class<? extends D> type) {
        logger.trace("Updating document content... [id=" + id + ", comment=" + comment + ']');

        long startTimeNanos = System.nanoTime();

        Document doc = repository.updateDocument(id, updateMilestoneCommentsProperties(emptyList()), content, versionType, comment);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document update took " + time + " milliseconds.");

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update document! [id=" + id + ", comment=" + comment + ']'));
    }

    @Override
    public <D extends LeosDocument> D updateDocument(String id, byte[] content, Map<String, Object> properties,
                                                     VersionType versionType, String comment, Class<? extends D> type) {
        logger.trace("Updating document content and properties... [id=" + id + ", comment=" + comment + ']');

        long startTimeNanos = System.nanoTime();

        Document doc = repository.updateDocument(id, properties, content, versionType, comment);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document update took " + time + " milliseconds.");

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update document! [id=" + id + ", comment=" + comment + ']'));
    }

    @Override
    public <D extends LeosDocument> D updateDocument(String ref, String id, Map<String, Object> properties, Class<? extends D> type, boolean latest) {
        logger.trace("Updating document collaborators... [id=" + id + ']');
        long startTimeNanos = System.nanoTime();

        Document doc = repository.updateDocument(id, properties, latest);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document update took " + time + " milliseconds.");

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update document! [id=" + id + ']'));
    }

    @Override
    public <D extends LeosDocument> D updateDocument(String ref, String id, List<Collaborator> collaborators, Class<? extends D> type) {
        logger.trace("Updating document collaborators... [id=" + id + ']');
        long startTimeNanos = System.nanoTime();

        Map<String, Object> properties = new HashMap<>(updateMilestoneCommentsProperties(emptyList()));

        List<String> collaboratorUsers = collaborators
                .stream()
                .map(collaborator -> getAccessRecord(collaborator.getLogin(),  collaborator.getRole(), collaborator.getEntity()))
                .collect(toList());

        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.COLLABORATORS), collaboratorUsers);

        Document doc = repository.updateDocument(id, properties);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document update took " + time + " milliseconds.");

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update document! [id=" + id + ']'));
    }

    @Override
    public <D extends LeosDocument> D archiveDocument(String id, Class<? extends D> type) {
        return null;
    }

    @Override
    public <D extends LeosDocument> D updateMilestoneComments(String id, byte[] content, List<String> milestoneComments, VersionType versionType, String comment, Class<? extends D> type) {
        logger.trace("Updating document metadata and content... [id=" + id + ", comment=" + comment + ']');

        long startTimeNanos = System.nanoTime();
        Map<String, List<String>> properties = updateMilestoneCommentsProperties(milestoneComments);

        Document doc = repository.updateDocument(id, properties, content, versionType, comment);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document update took " + time + " milliseconds.");

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update document! [id=" + id + ", comment=" + comment + ']'));
    }

    @Override
    public <D extends LeosDocument> D updateMilestoneComments(String ref, String id, List<String> milestoneComments, Class<? extends D> type) {
        logger.trace("Updating document metadata... [id=" + id + ']');
        long startTimeNanos = System.nanoTime();

        Map<String, List<String>> properties = updateMilestoneCommentsProperties(milestoneComments);

        Document doc = repository.updateDocument(id, properties);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document update took " + time + " milliseconds.");

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update document! [id=" + id + ']'));
    }

    @Override
    public <D extends LeosDocument> D findDocumentById(String id, Class<? extends D> type, boolean latest) {
        logger.trace("Finding document by ID... [id=" + id + ", latest=" + latest + ']');

        long startTimeNanos = System.nanoTime();
        Document doc = repository.findDocumentById(id, latest);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document search took " + time + " milliseconds.");

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalArgumentException("Document not found! [id=" + id + ", latest=" + latest + ']'));
    }

    @Override
    public <D extends LeosDocument> List<D> findDocumentsByUserId(String userId, Class<? extends D> type, String leosAuthority) {
        logger.trace("Finding documents for user... userId=" + userId + ']');

        long startTimeNanos = System.nanoTime();
        String primaryType = LeosMapper.leosPrimaryType(type);
        List<Document> docs = repository.findDocumentsByUserId(userId, primaryType, leosAuthority);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document search took " + time + " milliseconds.");

        return toLeosDocuments(docs, type, false);
    }

    @Override
    public <D extends LeosDocument> D findDocumentByParentPath(String path, String name, Class<? extends D> type) {
        logger.trace("Finding document by parent path... [path=" + path + ", name=" + name + ']');

        long startTimeNanos = System.nanoTime();
        String primaryType = LeosMapper.leosPrimaryType(type);
        Document document = repository.findDocumentByParentPath(path, name, primaryType)
                .findFirst().orElseThrow(() -> new IllegalArgumentException("Document not found! [path=" + path + ", name=" + name + ']'));
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document search took " + time + " milliseconds.");

        return toLeosDocument(document, type, true).get();
    }

    @Override
    public <D extends LeosDocument> List<D> findDocumentsByParentPath(String path, Class<? extends D> type, boolean descendants, boolean fetchContent) {
        logger.trace("Finding documents by parent path... [path=" + path + ", type=" + type.getSimpleName() + ']');

        long startTimeNanos = System.nanoTime();
        String primaryType = LeosMapper.leosPrimaryType(type);
        Set<LeosCategory> categories = LeosMapper.leosCategories(type);

        List<Document> docs = repository.findDocumentsByParentPath(path, primaryType, categories, descendants);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document search took " + time + " milliseconds.");

        return toLeosDocuments(docs, type, fetchContent);
    }

    @Override
    public <D extends LeosDocument> List<D> findDocumentVersionsById(String id, Class<? extends D> type, boolean fetchContent) {
        logger.trace("Finding document versions by ID... [id=" + id + ']');

        long startTimeNanos = System.nanoTime();
        List<Document> docs = repository.findAllVersions(id);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository versions search took " + time + " milliseconds.");

        return toLeosDocuments(docs, type, fetchContent);
    }

    @Override
    public void deleteDocumentById(String id) {
        logger.trace("Deleting Document... [id=" + id + ']');
        long startTimeNanos = System.nanoTime();
        repository.deleteDocumentById(id);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document deletion took " + time + " milliseconds.");
    }

    @Override
    public LeosPackage createPackage(String path, String name) {
        logger.trace("Creating package... [path=" + path + ", name=" + name + ']');

        long startTimeNanos = System.nanoTime();
        Folder folder = repository.createFolder(path, name);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository package creation took " + time + " milliseconds.");
        if (folder != null) {
            return CmisFolderExtensions.toLeosPackage(folder);
        }

        throw new IllegalStateException("Unable to create Package! [path=" + path + ", name=" + name + ']');
    }

    @Override
    public void deletePackage(String path) {
        logger.trace("Deleting package... [path=" + path + ']');
        long startTimeNanos = System.nanoTime();
        repository.deleteFolder(path);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository package deletion took " + time + " milliseconds.");
    }

    @Override
    public LeosPackage findPackageByDocumentId(String documentId) {
        logger.trace("Finding package by document ID... [documentId=" + documentId + ']');

        long startTimeNanos = System.nanoTime();
        Document doc = repository.findDocumentById(documentId, false);
        Folder folder = doc.getParents().stream().findFirst().orElse(null);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository package search took " + time + " milliseconds.");
        if (folder != null) {
            return CmisFolderExtensions.toLeosPackage(folder);
        }

        throw new IllegalStateException("Package not found! [documentId=" + documentId + ']');
    }

    public LeosPackage findPackageByPackageId(String packageId) {
        return null;
    }

    @Override
    public <D extends LeosDocument> LeosPackage findPackageByDocumentRef(String documentRef, Class<? extends D> type) {
        logger.trace("Finding package by document ref... [documentRef=" + documentRef + ']');

        long startTimeNanos = System.nanoTime();
        String primaryType = LeosMapper.leosPrimaryType(type);
        List<Document> docs = repository.findDocumentsByRef(documentRef, primaryType);
        if(!docs.isEmpty()) {
            Folder folder = docs.get(0).getParents().stream().findFirst().orElse(null);
            long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
            logger.trace("CMIS Repository package search took " + time + " milliseconds.");
            if (folder != null) {
                return CmisFolderExtensions.toLeosPackage(folder);
            }
        }
        throw new IllegalStateException("Package not found! [documentRef=" + documentRef + ']');
    }

    @Override
    public <D extends LeosDocument> List<D> findDocumentsByPackageId(String id, Class<? extends D> type, boolean allVersion, boolean fetchContent) {
        logger.trace("Finding documents by parent id... [pkgId=" + id + ", type=" + type.getSimpleName() + ']');

        long startTimeNanos = System.nanoTime();
        String primaryType = LeosMapper.leosPrimaryType(type);
        Set<LeosCategory> categories = LeosMapper.leosCategories(type);
        List<Document> docs = repository.findDocumentsByPackageId(id, primaryType, categories, allVersion);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document search took " + time + " milliseconds.");

        return toLeosDocuments(docs, type, fetchContent);
    }

    @Override
    public <D extends LeosDocument> List<D> findDocumentsByStatus(LeosLegStatus status, Class<? extends D> type) {
        logger.trace("Finding documents for status... status=" + status + ']');

        long startTimeNanos = System.nanoTime();
        String primaryType = LeosMapper.leosPrimaryType(type);
        List<Document> docs = repository.findDocumentsByStatus(status, primaryType);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document search took " + time + " milliseconds.");

        return toLeosDocuments(docs, type, false);
    }

    private String getAccessRecord(String userLogin, String authority, String userEntity) {
        return userLogin + "::" + authority + (userEntity != null ? "::" + userEntity : "");
    }

    public <D extends LeosDocument> Optional<D> toLeosDocument(Document doc, Class<? extends D> type, boolean fetchContent) {
        D leosDocument = null;
        if (doc != null) {
            Map<String, String> oldVersions = repositoryContextProvider.get().getVersionsWithoutVersionLabel();
            leosDocument = CmisDocumentExtensions.toLeosDocument(doc, type, fetchContent, oldVersions);
        }
        return Optional.ofNullable(leosDocument);
    }

    private <D extends LeosDocument> List<D> toLeosDocuments(List<Document> docs, Class<? extends D> type, boolean fetchContent) {
        List<D> leosDocuments = emptyList();
        if (docs != null) {
            Map<String, String> oldVersions = repositoryContextProvider.get().getVersionsWithoutVersionLabel();
            leosDocuments = docs.stream()
                    .map(doc -> CmisDocumentExtensions.toLeosDocument(doc, type, fetchContent, oldVersions))
                    .collect(toList());
        }
        return leosDocuments;
    }

    @Override
    public <D extends LeosDocument> Stream<D> findPagedDocumentsByParentPath(String path, Class<? extends D> type, boolean descendants, boolean fetchContent,
                                                                             int startIndex, int maxResults, QueryFilter workspaceFilter) {
        logger.trace("Finding documents by parent path... [path=$path, type=${type.simpleName}]");
        String primaryType = LeosMapper.leosPrimaryType(type);
        Set<LeosCategory> categories = LeosMapper.leosCategories(type);
        Stream<Document> docs = repository.findPagedDocumentsByParentPath(path, primaryType, categories, descendants, startIndex, maxResults, workspaceFilter);
        logger.trace("CMIS Repository document search took $time milliseconds.");

        Map<String, String> oldVersions = repositoryContextProvider.get().getVersionsWithoutVersionLabel();
        return docs.map(doc -> CmisDocumentExtensions.toLeosDocument(doc, type, fetchContent, oldVersions));
    }

    @Override
    public <D extends LeosDocument> int findDocumentCountByParentPath(String path, Class<? extends D> type, boolean descendants, QueryFilter workspaceFilter) {
        logger.trace("Finding documents by parent path... [path=$path, type=${type.simpleName}]");
        int docCount = 0;
        String primaryType = LeosMapper.leosPrimaryType(type);
        Set<LeosCategory> categories = LeosMapper.leosCategories(type);
        docCount = repository.findDocumentCountByParentPath(path, primaryType, categories, descendants, workspaceFilter);

        logger.trace("CMIS Repository document search took $time milliseconds.");
        return docCount;
    }

    @Override
    public <D extends LeosDocument> D findDocumentByRef(String ref, Class<? extends D> type) {
        logger.trace("Finding document with ref... [ref=" + ref + ']');

        long startTimeNanos = System.nanoTime();
        String primaryType = LeosMapper.leosPrimaryType(type);
        List<Document> docs = repository.findDocumentsByRef(ref, primaryType);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository document search took " + time + " milliseconds.");

        if (docs.size() != 1) {
            throw new IllegalStateException("Error occurred retrieving document! [=" + ref + ']');
        } else {
            return toLeosDocument(docs.get(0), type, true)
                .orElseThrow(() -> new IllegalStateException("Error occurred retrieving document! [=" + ref + ']'));
        }
    }

    @Override
    public <D extends LeosDocument> List<D> findAllMinorsForIntermediate(Class<? extends D> type, String docRef, String currIntVersion, int startIndex, int maxResults) {
        String primaryType = LeosMapper.leosPrimaryType(type);
        Stream<Document> documents = repository.findAllMinorsForIntermediate(primaryType, docRef, currIntVersion, startIndex, maxResults);
        Map<String, String> oldVersions = repositoryContextProvider.get().getVersionsWithoutVersionLabel();
        return documents.map(doc -> CmisDocumentExtensions.toLeosDocument(doc, type, false, oldVersions))
                .collect(Collectors.toList());
    }

    @Override
    public <D extends LeosDocument> int findAllMinorsCountForIntermediate(Class<? extends D> type, String docRef, String currIntVersion) {
     String primaryType = LeosMapper.leosPrimaryType(type);
     return repository.findAllMinorsCountForIntermediate(primaryType, docRef, currIntVersion);
    }

    @Override
    public <D extends LeosDocument> Integer findAllMajorsCount(Class<? extends D> type, String docRef) {
        String primaryType = LeosMapper.leosPrimaryType(type);
        return repository.findAllMajorsCount(primaryType, docRef);
    }

    @Override
    public <D extends LeosDocument> List<D> findAllMajors(Class<? extends D> type, String docRef, int startIndex, int maxResult) {
        String primaryType = LeosMapper.leosPrimaryType(type);
        Stream<Document> documents = repository.findAllMajors(primaryType, docRef, startIndex, maxResult);
        Map<String, String> oldVersions = repositoryContextProvider.get().getVersionsWithoutVersionLabel();
        return documents.map(doc -> CmisDocumentExtensions.toLeosDocument(doc, type, false, oldVersions))
                .collect(Collectors.toList());
    }

    @Override
    public <D extends LeosDocument> D findLatestMajorVersionById(Class<? extends D> type, String documentId, String documentRef) {
        Document doc = repository.findLatestMajorVersionById(documentId);
        Map<String, String> oldVersions = repositoryContextProvider.get().getVersionsWithoutVersionLabel();
        return CmisDocumentExtensions.toLeosDocument(doc, type, false, oldVersions);
    }

    @Override
    public <D extends LeosDocument> List<D> findRecentMinorVersions(Class<? extends D> type, String documentRef, String lastMajorId, int startIndex, int maxResults) {
        String primaryType = LeosMapper.leosPrimaryType(type);
        Stream<Document> documents = repository.findRecentMinorVersions(primaryType, documentRef, lastMajorId, startIndex, maxResults);
        Map<String, String> oldVersions = repositoryContextProvider.get().getVersionsWithoutVersionLabel();
        return documents.map(doc -> CmisDocumentExtensions.toLeosDocument(doc, type, false, oldVersions))
                .collect(Collectors.toList());
    }

    @Override
    public <D extends LeosDocument> Integer findRecentMinorVersionsCount(Class<? extends D> type, String documentRef, String versionLabel) {
        String primaryType = LeosMapper.leosPrimaryType(type);
        return repository.findRecentMinorVersionsCount(primaryType, documentRef, versionLabel);
    }

    private void checkSecurityContextEnsureUserIsPresent() {
        if(isEmpty(securityContext.getUser())) {
            throw new IllegalStateException("Missing user in security context");
        }
    }

    @Override
    public <D extends LeosDocument> D findFirstVersion(Class<? extends D> type, String documentRef) {
        String primaryType = LeosMapper.leosPrimaryType(type);
        Optional<Document> document = repository.findFirstVersion(primaryType, documentRef).findFirst();
        if (document.isPresent()) {
            return toLeosDocument(document.get(), type, true)
                    .orElseThrow(() -> new IllegalStateException("Error occurred retrieving first document version! [=" + documentRef + ']'));
        } else {
            return null;
        }
    }

    @Override
    public <D extends LeosDocument> D findDocumentByVersion(Class<? extends D> type, String documentRef, String versionLabel) {
        String primaryType = LeosMapper.leosPrimaryType(type);
        Optional<Document> document = repository.findDocumentByVersion(primaryType, documentRef, versionLabel).findFirst();
        if (document.isPresent()) {
            return toLeosDocument(document.get(), type, true)
                    .orElseThrow(() -> new IllegalStateException("Error occurred retrieving document version! [=" + documentRef + ']'));
        } else {
            return null;
        }
    }

    @Override
    public ExportDocument createExportDocumentFromContent(String path, String name, List<String> comments, byte[] contentBytes, LeosExportStatus status) {
        logger.trace("Creating export document from content... [path=" + path + ", name=" + name + ']');

        checkSecurityContextEnsureUserIsPresent();

        long startTimeNanos = System.nanoTime();

        Map<String, Object> properties = new HashMap<>();
        properties.put(PropertyIds.NAME, name);
        properties.put(PropertyIds.BASE_TYPE_ID, BaseTypeId.CMIS_DOCUMENT.value());
        properties.put(PropertyIds.OBJECT_TYPE_ID, LeosMapper.leosPrimaryType(ExportDocument.class));
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_CATEGORY), LeosCategory.EXPORT.name());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.INITIAL_CREATED_BY), securityContext.getUser().getLogin());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.INITIAL_CREATION_DATE), Date.from(Instant.now()));
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS), status.name());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS), comments);

        Document doc = repository.createDocumentFromContent(path, name, properties, exportMimeType, contentBytes);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository export document creation from content took " + time + " milliseconds.");

        return toLeosDocument(doc, ExportDocument.class, true)
                .orElseThrow(() -> new IllegalStateException("Unable to create export document from content! [path=" + path + ", name=" + name + ']'));
    }

    @Override
    public ExportDocument updateExportDocument(String id, LeosExportStatus status, byte[] contentBytes, VersionType versionType, String comment) {
        logger.debug("Updating export document status and content... [id=" + id + ", status=" + status.name() + ", content size=" + contentBytes.length + ", versionType=" + versionType + ", comment=" + comment + ']');
        long startTimeNanos = System.nanoTime();

        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS), status.name());

        Document doc = repository.updateDocument(id, properties, contentBytes, versionType, comment);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository export document status and content update took " + time + " milliseconds.");

        return toLeosDocument(doc, ExportDocument.class, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update export document! [id=" + id + ", status=" + status.name() + ']'));
    }

    @Override
    public ExportDocument updateExportDocument(String ref, String id, LeosExportStatus status) {
        logger.trace("Updating Export document status... [id=" + id + ", status=" + status.name() + ']');
        long startTimeNanos = System.nanoTime();

        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS), status.name());

        Document doc = repository.updateDocument(id, properties, false);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository Export document status update took " + time + " milliseconds.");

        return toLeosDocument(doc, ExportDocument.class, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update export document status! [id=" + id + ", status=" + status.name() + ']'));
    }

    @Override
    public ExportDocument updateExportDocument(String ref, String id, List<String> comments) {
        logger.trace("Updating Export document comments... [id=" + id + ", comments=" + comments + ']');
        long startTimeNanos = System.nanoTime();

        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS), LeosExportStatus.FILE_READY.name());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS), comments);

        Document doc = repository.updateDocument(id, properties);
        long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
        logger.trace("CMIS Repository Export document comments update took " + time + " milliseconds.");

        return toLeosDocument(doc, ExportDocument.class, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update export document comments! [id=" + id + ", comments=" + comments + ']'));
    }

    @Override
    public Folder createFolder(String path, String name) {
        return repository.createFolder(path, name);
    }

    @Override
    public Folder findFolderByPath(String path) {
        return repository.findFolderByPath(path);
    }

}
