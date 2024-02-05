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
package eu.europa.ec.leos.rest;

import eu.europa.ec.leos.domain.common.RepositoryProfileType;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosExportStatus;
import eu.europa.ec.leos.domain.repository.LeosLegStatus;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.ExportDocument;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.vo.CloneDocumentMetadataVO;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.model.filter.QueryFilter;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.repository.RepositoryProfile;
import eu.europa.ec.leos.repository.mapping.LeosMapper;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.rest.aop.annotation.PerformanceLogger;
import eu.europa.ec.leos.rest.extensions.LeosDocumentExtensions;
import eu.europa.ec.leos.rest.extensions.LeosMetadataExtensions;
import eu.europa.ec.leos.rest.extensions.LeosPackageExtensions;
import eu.europa.ec.leos.rest.support.model.LeosDocumentList;
import eu.europa.ec.leos.rest.support.model.Package;
import eu.europa.ec.leos.rest.support.util.ConversionUtils;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMapHelper;
import eu.europa.ec.leos.security.SecurityContext;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import static eu.europa.ec.leos.rest.support.RepositoryUtil.updateDocumentProperties;
import static eu.europa.ec.leos.rest.support.RepositoryUtil.updateMilestoneCommentsProperties;
import static java.util.Collections.emptyList;
import static java.util.Collections.singletonList;
import static java.util.stream.Collectors.toList;
import static org.springframework.util.StringUtils.isEmpty;

/**
 * LEOS Repository implementation.
 *
 * @constructor Creates a generic LEOS Repository, injected with a LEOS Repository and a Security Context.
 */
@Repository
@RepositoryProfile(RepositoryProfileType.REST)
public class LeosRestRepositoryImpl implements LeosRepository {

    private static final Logger logger = LoggerFactory.getLogger(LeosRestRepositoryImpl.class);

    private final String exportMimeType;
    private final String legMimeType;
    private final String leosDocMimeType;
    private final RestRepository repository;
    private final SecurityContext securityContext;
    private final RepositoryPropertiesMapper repositoryPropertiesMapper;
    private final LeosPermissionAuthorityMapHelper authorityMapHelper;

    private static String ADMIN_USER = "admin";
    @Value("${leos.workspaces.path}")
    private String workspacesPath;
    @Value("${leos.rest.cache.enable}")
    public Boolean cacheEnabled;

    @Autowired
    public LeosRestRepositoryImpl(RestRepository repository, SecurityContext securityContext,
                              LeosPermissionAuthorityMapHelper authorityMapHelper, RepositoryPropertiesMapper repositoryPropertiesMapper) {
        this.repository = repository;
        this.securityContext = securityContext;
        this.authorityMapHelper = authorityMapHelper;
        this.repositoryPropertiesMapper = repositoryPropertiesMapper;
        legMimeType = "application/octet-stream";
        leosDocMimeType = "application/akn+xml";
        exportMimeType = "application/octet-stream";
    }

    private void populateTemplateMetadataFromContent(eu.europa.ec.leos.rest.support.model.LeosDocument doc) throws ParserConfigurationException, IOException, SAXException {
        DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
        builderFactory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        builderFactory.setFeature("http://xml.org/sax/features/external-general-entities", false);
        builderFactory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
        builderFactory.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
        builderFactory.setNamespaceAware(true);
        DocumentBuilder builder = builderFactory.newDocumentBuilder();

        Document xmlDoc = builder.parse(new ByteArrayInputStream(doc.getSource()));
        xmlDoc.getDocumentElement().normalize();
        setMetadataFromXml(xmlDoc, "docVersion", doc);
        setMetadataFromXml(xmlDoc, repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_STAGE), doc);
        setMetadataFromXml(xmlDoc, repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_TYPE), doc);
        setMetadataFromXml(xmlDoc, repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_DOCTEMPLATE), doc);
        setMetadataFromXml(xmlDoc, repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_TEMPLATE), doc);
        setMetadataFromXml(xmlDoc, repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_PURPOSE), doc);
    }

    private String getMetadataFromXml(Document xmlDoc, String property) {
        final String leosPref = "leos:";
        NodeList docNodes = xmlDoc.getDocumentElement().getElementsByTagName(property);
        if (docNodes.getLength() == 0) {
            docNodes = xmlDoc.getDocumentElement().getElementsByTagName(leosPref + property);
        }
        return docNodes.getLength() > 0 ? docNodes.item(0).getTextContent() : null;
    }

    private void setMetadataFromXml(Document xmlDoc, String property, eu.europa.ec.leos.rest.support.model.LeosDocument doc) {
        doc.getMetadata().put(property, getMetadataFromXml(xmlDoc, property));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", allEntries = true) })
    public <D extends LeosDocument, M extends LeosMetadata> D createDocument(String templateId, String path, String name,
                                                                              M metadata, Class<? extends D> type) {
        logger.trace("Creating document... [template=" + templateId + ", path=" + path + ", name=" + name + ']');

        checkSecurityContextEnsureUserIsPresent();

        Map<String, Object> properties = new HashMap<>();
        setDocumentCollaboratorProperties(metadata, properties);
        Set<LeosCategory> cats = LeosMapper.leosCategories(type);
        if (!cats.isEmpty()) {
            properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_CATEGORY), cats.iterator().next());
            properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED), false);
        }

        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.createDocumentFromSource(templateId, path, name, properties,
                securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to create document! [template=" + templateId + ", path=" + path + ", name=" + name + ']'));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", allEntries = true) })
    public <D extends LeosDocument, M extends LeosMetadata> D createClonedDocument(String templateId, String path, String name,
                                                                             M metadata, CloneDocumentMetadataVO cloneDocumentMetadataVO, Class<? extends D> type) {
        logger.trace("Creating document... [template=" + templateId + ", path=" + path + ", name=" + name + ']');

        checkSecurityContextEnsureUserIsPresent();

        Map<String, Object> properties = new HashMap<>();
        setDocumentCollaboratorProperties(metadata, properties);
        Set<LeosCategory> cats = LeosMapper.leosCategories(type);
        if (!cats.isEmpty()) {
            properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_CATEGORY), cats.iterator().next());
        }

        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.ORIGIN_REF), cloneDocumentMetadataVO.getOriginRef());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_FROM), cloneDocumentMetadataVO.getClonedFromRef());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_PROPOSAL), true);
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED), true);

        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.createDocumentFromSource(templateId, path, name, properties,
                securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to create document! [template=" + templateId + ", path=" + path + ", name=" + name + ']'));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", allEntries = true) })
    public <D extends LeosDocument, M extends LeosMetadata> D createDocumentFromContent(String path, String name, M metadata, Class<? extends D> type, String leosCategory, byte[] contentBytes) {
        logger.trace("Creating document From Content... [path=" + path + ", name=" + name + ']');

        checkSecurityContextEnsureUserIsPresent();

        Map<String, Object> properties = getCustomPropertiesMap(name, metadata, leosCategory);
        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.createDocumentFromContent(path, name, properties, leosDocMimeType, contentBytes,
                securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to create document! [path=" + path + ", name=" + name + ']'));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", allEntries = true) })
    public <D extends LeosDocument, M extends LeosMetadata> D createClonedDocumentFromContent(String path, String name,
                                                                                        M metadata,
                                                                                        CloneProposalMetadataVO cloneProposalMetadataVO,
                                                                                        Class<? extends D> type,
                                                                                        String leosCategory,
                                                                                        byte[] contentBytes) {
        logger.trace("Creating document From Content... [path=" + path + ", name=" + name + ']');

        checkSecurityContextEnsureUserIsPresent();

        Map<String, Object> properties = getCustomPropertiesMap(name, metadata, leosCategory);
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_PROPOSAL), cloneProposalMetadataVO.isClonedProposal());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.ORIGIN_REF), cloneProposalMetadataVO.getOriginRef());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_FROM), cloneProposalMetadataVO.getClonedFromRef());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.REVISION_STATUS), cloneProposalMetadataVO.getRevisionStatus());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED), cloneProposalMetadataVO.isClonedProposal());

        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.createDocumentFromContent(path, name, properties, leosDocMimeType, contentBytes,
                securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to create document! [path=" + path + ", name=" + name + ']'));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", allEntries = true) })
    public <D extends LeosDocument, M extends LeosMetadata> D createClonedDocumentFromContent(String path, String name,
                                                                                              M metadata,
                                                                                              CloneDocumentMetadataVO cloneDocumentMetadataVO,
                                                                                              Class<? extends D> type,
                                                                                              String leosCategory,
                                                                                              byte[] contentBytes) {
        logger.trace("Creating cloned document From Content... [path=" + path + ", name=" + name + ']');

        checkSecurityContextEnsureUserIsPresent();

        Map<String, Object> properties = getCustomPropertiesMap(name, metadata, leosCategory);
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.ORIGIN_REF), cloneDocumentMetadataVO.getOriginRef());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_FROM), cloneDocumentMetadataVO.getClonedFromRef());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_PROPOSAL), true);
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED), true);

        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.createDocumentFromContent(path, name, properties, leosDocMimeType, contentBytes,
                securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to create document! [path=" + path + ", name=" + name + ']'));
    }

    private <M extends LeosMetadata> void setDocumentCollaboratorProperties(M metadata, Map<String, Object> properties) {
        properties.putAll(LeosMetadataExtensions.toLeosRepositoryProperties(metadata));
        User user = securityContext.getUser();
        String userDefaultEntity = user.getDefaultEntity() != null ? user.getDefaultEntity().getName() : "";
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.COLLABORATORS), singletonList(new Collaborator(user.getLogin(),
                authorityMapHelper.getRoleForDocCreation(), userDefaultEntity)));
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.INITIAL_CREATED_BY), securityContext.getUser().getLogin());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.INITIAL_CREATION_DATE), ConversionUtils.getLeosDateAsString(new Date(), ConversionUtils.LEOS_REPO_DATE_FORMAT));
    }

    private <M extends LeosMetadata> Map<String, Object> getCustomPropertiesMap(String name, M metadata, String leosCategory) {
        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_CATEGORY), leosCategory);
        setDocumentCollaboratorProperties(metadata, properties);
        return properties;
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", allEntries = true) })
    public LegDocument createLegDocumentFromContent(String path, String name, String jobId, List<String> milestoneComments, byte[] contentBytes, LeosLegStatus status,
                                                    List<String> containedDocuments) {
        logger.trace("Creating leg document from content... [path=" + path + ", name=" + name + ']');

        checkSecurityContextEnsureUserIsPresent();

        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_CATEGORY), LeosCategory.LEG.name());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.JOB_ID), jobId);
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.JOB_DATE),ConversionUtils.getLeosDateAsString(new Date(), ConversionUtils.LEOS_REPO_DATE_FORMAT));
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.MILESTONE_COMMENTS), milestoneComments);
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS), status.name());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.INITIAL_CREATED_BY), securityContext.getUser().getLogin());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.INITIAL_CREATION_DATE), ConversionUtils.getLeosDateAsString(new Date(), ConversionUtils.LEOS_REPO_DATE_FORMAT));
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CONTAINED_DOCUMENTS), containedDocuments);

        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.createDocumentFromContent(path, name, properties, legMimeType, contentBytes, securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, LegDocument.class, true)
                .orElseThrow(() -> new IllegalStateException("Unable to create leg document from content! [path=" + path + ", name=" + name + ']'));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", keyGenerator = "referenceFromIdKeyGenerator") })
    public LegDocument updateLegDocument(String ref, String id, LeosLegStatus status) {
        logger.trace("Updating Leg document status... [id=" + id + ", status=" + status.name() + ']');
        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS), status.name());

        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.updateDocument(ref, id, properties,
                securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, LegDocument.class, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update leg document status! [id=" + id + ", status=" + status.name() + ']'));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", keyGenerator = "referenceFromIdKeyGenerator") })
    public LegDocument updateLegDocument(String ref, String id, List<String> containedDocuments) {
        logger.trace("Updating Leg document contained files... [id=" + id + "]");

        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CONTAINED_DOCUMENTS), containedDocuments);

        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.updateDocument(ref, id, properties,
                securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, LegDocument.class, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update leg contained files! [id=" + id + "]"));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", keyGenerator = "referenceFromIdKeyGenerator") })
    public LegDocument updateLegDocument(String id, LeosLegStatus status, byte[] contentBytes, VersionType versionType, String comment) {
        logger.debug("Updating Leg document status and content... [id=" + id + ", status=" + status.name() + ", content size=" + contentBytes.length + ", versionType=" + versionType + ", comment=" + comment + ']');
        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS), status.name());
        String category = String.valueOf(LeosCategory.LEG);
        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.updateDocument(id, properties, contentBytes, versionType, category, comment,
                securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);
        return toLeosDocument(doc, LegDocument.class, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update leg document! [id=" + id + ", status=" + status.name() + ']'));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", keyGenerator = "referenceFromIdKeyGenerator") })
    public <D extends LeosDocument, M extends LeosMetadata> D updateDocument(String ref, String id, M metadata, Class<? extends D> type) {
        logger.trace("Updating document metadata... [id=" + id + ']');

        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.updateDocument(ref, id, updateDocumentProperties(metadata),
                securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update document! [id=" + id + ']'));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", keyGenerator = "referenceFromIdKeyGenerator") })
    public <D extends LeosDocument, M extends LeosMetadata> D updateDocument(String id, M metadata, byte[] content, VersionType versionType, String comment, Class<? extends D> type) {
        logger.trace("Updating document metadata and content... [id=" + id + ", comment=" + comment + ']');
        Set<LeosCategory> categories = LeosMapper.leosCategories(type);
        LeosCategory category = (LeosCategory) CollectionUtils.get(categories, 0);
        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.updateDocument(id, updateDocumentProperties(metadata), content, versionType,
                String.valueOf(category), comment, securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update document! [id=" + id + ", comment=" + comment + ']'));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", keyGenerator = "referenceFromIdKeyGenerator") })
    public <D extends LeosDocument> D updateDocument(String id, byte[] content, VersionType versionType, String comment,
                                                     Class<? extends D> type) {
        logger.trace("Updating document content... [id=" + id + ", comment=" + comment + ']');
        Set<LeosCategory> categories = LeosMapper.leosCategories(type);
        LeosCategory category = (LeosCategory) CollectionUtils.get(categories, 0);
        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.updateDocument(id,
                updateMilestoneCommentsProperties(emptyList()), content, versionType, String.valueOf(category), comment,
                securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update document! [id=" + id + ", comment=" + comment + ']'));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", keyGenerator = "referenceFromIdKeyGenerator") })
    public <D extends LeosDocument> D archiveDocument(String id, Class<? extends D> type) {
        logger.trace("Moving document ... [id=" + id + ']');

        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.archiveDocument(id, securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update document! [id=" + id + ']'));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", keyGenerator = "referenceFromIdKeyGenerator") })
    public <D extends LeosDocument> D updateDocument(String id, byte[] content, Map<String, Object> properties,
                                                     VersionType versionType, String comment, Class<? extends D> type) {
        logger.trace("Updating document content and properties... [id=" + id + ", comment=" + comment + ']');
        Set<LeosCategory> categories = LeosMapper.leosCategories(type);
        LeosCategory category = (LeosCategory) CollectionUtils.get(categories, 0);
        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.updateDocument(id, properties, content, versionType, String.valueOf(category),
                comment, securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update document! [id=" + id + ", comment=" + comment + ']'));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", keyGenerator = "referenceFromIdKeyGenerator") })
    public <D extends LeosDocument> D updateDocument(String ref, String id, Map<String, Object> properties, Class<? extends D> type, boolean latest) {
        logger.trace("Updating document collaborators... [id=" + id + ']');

        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.updateDocument(ref, id, properties, latest,
                securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update document! [id=" + id + ']'));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", keyGenerator = "referenceFromIdKeyGenerator") })
    public <D extends LeosDocument> D updateDocument(String ref, String id, List<Collaborator> collaborators, Class<? extends D> type) {
        logger.trace("Updating document collaborators... [id=" + id + ']');
        Map<String, Object> properties = new HashMap<>(updateMilestoneCommentsProperties(emptyList()));

        List<Collaborator> collaboratorUsers = collaborators
                .stream()
                .map(collaborator -> new Collaborator(collaborator.getLogin(),  collaborator.getRole(), collaborator.getEntity()))
                .collect(toList());

        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.COLLABORATORS), collaboratorUsers);

        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.updateDocument(ref, id, properties,
                securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update document! [id=" + id + ']'));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", keyGenerator = "referenceFromIdKeyGenerator") })
    public <D extends LeosDocument> D updateMilestoneComments(String id, byte[] content, List<String> milestoneComments, VersionType versionType, String comment, Class<? extends D> type) {
        logger.trace("Updating document metadata and content... [id=" + id + ", comment=" + comment + ']');

        Map<String, ?> properties = updateMilestoneCommentsProperties(milestoneComments);
        Set<LeosCategory> categories = LeosMapper.leosCategories(type);
        LeosCategory category = (LeosCategory) CollectionUtils.get(categories, 0);
        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.updateDocument(id, properties, content, versionType, String.valueOf(category),
                comment, securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update document! [id=" + id + "]"));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", keyGenerator = "referenceFromIdKeyGenerator") })
    public <D extends LeosDocument> D updateMilestoneComments(String ref, String id, List<String> milestoneComments, Class<? extends D> type) {
        logger.trace("Updating document metadata... [id=" + id + ']');

        Map<String, ?> properties = updateMilestoneCommentsProperties(milestoneComments);

        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.updateDocument(ref, id, properties, securityContext!=null &&
                securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update document! [id=" + id + ']'));
    }

    @Override
    @PerformanceLogger
    @Cacheable(value = "documentCache", keyGenerator ="documentByIdKeyGenerator", condition = "#root.target.cacheEnabled")
    public <D extends LeosDocument> D findDocumentById(String id, Class<? extends D> type, boolean latest) {
        logger.trace("Finding document by ID... [id=" + id + ", latest=" + latest + ']');
        Set<LeosCategory> categories = LeosMapper.leosCategories(type);
        LeosCategory category = (LeosCategory) CollectionUtils.get(categories, 0);
        eu.europa.ec.leos.rest.support.model.LeosDocument doc;
        doc = repository.findDocumentById(id, String.valueOf(category), latest);
        category = getCategory(doc);
        type = (Class<? extends D>) LeosMapper.leosType(category);
        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalArgumentException("Document not found! [id=" + id + ", latest=" + latest + ']'));
    }

    @Override
    @PerformanceLogger
    public <D extends LeosDocument> List<D> findDocumentsByUserId(String userId, Class<? extends D> type, String leosAuthority) {
        logger.trace("Finding document by userId... [userId=" + userId + ", role=" + leosAuthority + ']');

        String category = type != null ? type.getSimpleName().toUpperCase() : null;
        LeosDocumentList docs = repository.findDocumentsByUserId(userId, leosAuthority, category);

        return toLeosDocuments(docs.getLeosDocumentList(), type, false);
    }

    @Override
    @PerformanceLogger
    @Cacheable(value = "documentByNameCache", key="#name", condition = "#root.target.cacheEnabled")
    public <D extends LeosDocument> D findDocumentByParentPath(String path, String name, Class<? extends D> type) {
        logger.trace("Finding document by parent path... [path=" + path + ", name=" + name + ']');

        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.findDocumentByName(name).orElseThrow(() -> new IllegalArgumentException("Document not found! [path=" + path +
                    ", name=" + name + ']'));
        if (doc.getCategory().contains("TEMPLATE")) {
            try {
                populateTemplateMetadataFromContent(doc);
            } catch (Exception e) {
                logger.debug("Error while getting metadata from template " + name);
            }
        }

        return toLeosDocument(doc, type, true).get();
    }

    @Override
    @PerformanceLogger
    public <D extends LeosDocument> List<D> findDocumentsByParentPath(String path, Class<? extends D> type, boolean descendants, boolean fetchContent) {
        logger.trace("Finding documents by parent path... [path=" + path + ", type=" + type.getSimpleName() + ']');

        Set<LeosCategory> categories = LeosMapper.leosCategories(type);

        LeosDocumentList docs = repository.findDocumentsByPackagePath(extractPackageNameFromPath(path), categories, descendants, fetchContent);

        return toLeosDocuments(docs.getLeosDocumentList(), type, fetchContent);
    }

    @Override
    @PerformanceLogger
    public <D extends LeosDocument> List<D> findDocumentVersionsById(String id, Class<? extends D> type, boolean fetchContent) {
        logger.trace("Finding document versions by ID... [id=" + id + ']');

        LeosDocumentList docs = repository.findAllVersions(id, fetchContent);

        return toLeosDocuments(docs.getLeosDocumentList(), type, fetchContent);
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", keyGenerator = "referenceFromIdKeyGenerator") })
    public void deleteDocumentById(String id) {
        logger.trace("Deleting Document... [id=" + id + ']');
        repository.deleteDocumentById(id);
    }

    @Override
    @PerformanceLogger
    @CacheEvict(value = "restRepositoryFolderCache", key = "#name")
    public LeosPackage createPackage(String path, String name) {
        logger.trace("Creating package... [path=" + path + ", name=" + name + ']');

        Package pkg = repository.createPackage(name, securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);
        if (pkg != null) {
            return LeosPackageExtensions.toLeosPackage(pkg);
        }

        throw new IllegalStateException("Unable to create Package! [path=" + path + ", name=" + name + ']');
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", allEntries = true),
            @CacheEvict(value = "restRepositoryFolderCache", key = "#path") })
    public void deletePackage(String path) {
        logger.trace("Deleting package... [path=" + path + ']');
        repository.deletePackage(extractPackageNameFromPath(path));
    }

    @Override
    @PerformanceLogger
    @Cacheable(value="restRepositoryFolderCache", key="#documentId", condition = "#root.target.cacheEnabled")
    public LeosPackage findPackageByDocumentId(String documentId) {
        Package pkg =  repository.findPackageByDocumentId(documentId);
        if (pkg != null) {
            return LeosPackageExtensions.toLeosPackage(pkg);
        }
        throw new IllegalStateException("Unable to read Package! [documentId=" + documentId + ']');
    }

    @Override
    @PerformanceLogger
    @Cacheable(value="restRepositoryFolderCache", key="#packageId", condition = "#root.target.cacheEnabled")
    public LeosPackage findPackageByPackageId(String packageId) {
        Package pkg =  repository.findPackageByPackageId(packageId);
        if (pkg != null) {
            return LeosPackageExtensions.toLeosPackage(pkg);
        }
        throw new IllegalStateException("Unable to read Package! [documentId=" + packageId + ']');
    }

    @Override
    @PerformanceLogger
    @Cacheable(value="restRepositoryFolderCache", key="#documentRef", condition = "#root.target.cacheEnabled")
    public <D extends LeosDocument> LeosPackage findPackageByDocumentRef(String documentRef, Class<? extends D> type) {
        Package pkg =  repository.findPackageByDocumentRef(documentRef);
        if (pkg != null) {
            return LeosPackageExtensions.toLeosPackage(pkg);
        }
        throw new IllegalStateException("Unable to read Package! [documentId=" + documentRef + ']');
    }

    @Override
    @PerformanceLogger
    public <D extends LeosDocument> List<D> findDocumentsByPackageId(String id, Class<? extends D> type, boolean allVersion, boolean fetchContent) {
        logger.trace("Finding documents by parent id... [pkgId=" + id + ", type=" + type.getSimpleName() + ']');
        Set<LeosCategory> categories = LeosMapper.leosCategories(type);

        LeosDocumentList docs = repository.findDocumentsByPackageId(id, categories, allVersion, fetchContent);

        return toLeosDocuments(docs.getLeosDocumentList(), type, fetchContent);
    }

    @Override
    @PerformanceLogger
    public <D extends LeosDocument> List<D> findDocumentsByStatus(LeosLegStatus status, Class<? extends D> type) {
        logger.trace("Finding documents for status... status=" + status + ']');

        LeosDocumentList docs = repository.findDocumentsByStatus(status);

        return toLeosDocuments(docs.getLeosDocumentList(), type, false);
    }

    private String getAccessRecord(String userLogin, String authority, String userEntity) {
        return userLogin + "::" + authority + (userEntity != null ? "::" + userEntity : "");
    }

    public <D extends LeosDocument> Optional<D> toLeosDocument(eu.europa.ec.leos.rest.support.model.LeosDocument doc, Class<? extends D> type, boolean fetchContent) {
        D leosDocument = null;
        if (doc != null) {
            leosDocument = LeosDocumentExtensions.toLeosDocument(doc, type, fetchContent);
        }
        return Optional.ofNullable(leosDocument);
    }

    private <D extends LeosDocument> List<D> toLeosDocuments(List<eu.europa.ec.leos.rest.support.model.LeosDocument> docs, Class<? extends D> type, boolean fetchContent) {
        List<D> leosDocuments = emptyList();
        if (docs != null) {
            leosDocuments = docs.stream()
                    .map(doc -> LeosDocumentExtensions.toLeosDocument(doc, type, fetchContent))
                    .collect(toList());
        }
        return leosDocuments;
    }

    @Override
    @PerformanceLogger
    public <D extends LeosDocument> Stream<D> findPagedDocumentsByParentPath(String path, Class<? extends D> type, boolean descendants, boolean fetchContent,
                                                                             int startIndex, int maxResults, QueryFilter workspaceFilter) {
        logger.trace("Finding documents by parent path... [path=$path, type=${type.simpleName}]");
        Set<LeosCategory> categories = LeosMapper.leosCategories(type);
        LeosDocumentList docs = repository.findPagedDocuments(extractPackageNameFromPath(path), categories, startIndex, maxResults,
                workspaceFilter, fetchContent);

        return docs.getLeosDocumentList().stream().map(doc -> LeosDocumentExtensions.toLeosDocument(doc, type, fetchContent));
    }

    @Override
    @PerformanceLogger
    public <D extends LeosDocument> int findDocumentCountByParentPath(String path, Class<? extends D> type, boolean descendants, QueryFilter workspaceFilter) {
        logger.trace("Finding documents by parent path... [path=$path, type=${type.simpleName}]");
        int docCount = 0;
        Set<LeosCategory> categories = LeosMapper.leosCategories(type);
        docCount = repository.countDocuments(extractPackageNameFromPath(path), categories, workspaceFilter);

        return docCount;
    }

    @Override
    @PerformanceLogger
    @Cacheable(value = "documentCache", keyGenerator ="documentByIdKeyGenerator", condition = "#root.target.cacheEnabled")
    public <D extends LeosDocument> D findDocumentByRef(String ref, Class<? extends D> type) {
        logger.trace("Finding document with ref... [ref=" + ref + ']');
        Set<LeosCategory> categories = LeosMapper.leosCategories(type);
        LeosCategory category = (LeosCategory) CollectionUtils.get(categories, 0);
        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.findDocumentByRef(ref, String.valueOf(category));

        return toLeosDocument(doc, type, true)
            .orElseThrow(() -> new IllegalStateException("Error occurred retrieving document! [=" + ref + ']'));
    }

    @Override
    @PerformanceLogger
    public <D extends LeosDocument> List<D> searchVersions(Class<? extends D> type, String docRef, List<String> logins, String versionType) {
        logger.trace("Finding versions. [docRef={}, versionType={}]", docRef, versionType);
        LeosDocumentList docs = repository.searchVersions(docRef, logins, versionType);
        return toLeosDocuments(docs.getLeosDocumentList(), type, false);
    }

    @Override
    @PerformanceLogger
    public <D extends LeosDocument> List<D> findAllMinorsForIntermediate(Class<? extends D> type, String docRef, String currIntVersion, int startIndex, int maxResults) {
        logger.trace("Finding all minors for intermediate. [docRef={}, currIntVersion={}, startIndex={}, maxResults={}]",docRef, currIntVersion, startIndex, maxResults);

        LeosDocumentList docs = repository.findAllMinorsForIntermediate(docRef, currIntVersion,
                startIndex,
                maxResults);
        return toLeosDocuments(docs.getLeosDocumentList(), type, false);
    }

    @Override
    @PerformanceLogger
    public <D extends LeosDocument> int findAllMinorsCountForIntermediate(Class<? extends D> type, String docRef, String currIntVersion) {
        return repository.getAllMinorsCountForIntermediate(docRef, currIntVersion);
    }

    @Override
    @PerformanceLogger
    public <D extends LeosDocument> Integer findAllMajorsCount(Class<? extends D> type, String docRef) {
        return repository.getAllMajorsCount(docRef);
    }

    @Override
    @PerformanceLogger
    public <D extends LeosDocument> List<D> findAllMajors(Class<? extends D> type, String docRef, int startIndex, int maxResult) {
        logger.trace("Finding all minors for intermediate. [docRef={}, currIntVersion={}, startIndex={}, maxResults={}]",docRef, startIndex, maxResult);
        LeosDocumentList docs = repository.findAllMajors(docRef, startIndex, maxResult);
        return toLeosDocuments(docs.getLeosDocumentList(), type, false);
    }

    @Override
    @PerformanceLogger
    public <D extends LeosDocument> D findLatestMajorVersionById(Class<? extends D> type, String documentId, String documentRef) {
        logger.trace("Finding latest major version by id with documentId... [documentId=" + documentId + ']');
        //TODO: Rename this method once CMIS is deprecated to findLatestMajorVersionByRef
        eu.europa.ec.leos.rest.support.model.LeosDocument doc = this.repository.findLatestMajorVersionByRef(documentRef);
        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalArgumentException("Document not found! [id=" + documentId +']'));
    }

    @Override
    @PerformanceLogger
    public <D extends LeosDocument> List<D> findRecentMinorVersions(Class<? extends D> type, String documentRef, String lastMajorId, int startIndex, int maxResults) {
        logger.trace("Finding recent minor versions for intermediate. [docRef={}, lastMajorId={}, startIndex={}, maxResults={}]",documentRef, lastMajorId, startIndex, maxResults);
        LeosDocumentList docs = repository.findRecentMinorVersions( documentRef,  lastMajorId,  startIndex,  maxResults);
        return toLeosDocuments(docs.getLeosDocumentList(), type, false);
    }

    @Override
    @PerformanceLogger
    public <D extends LeosDocument> Integer findRecentMinorVersionsCount(Class<? extends D> type, String documentRef, String versionLabel) {
        Integer recentMinorVersionsCountCount = repository.getRecentMinorVersionsCount(documentRef, versionLabel);
        return recentMinorVersionsCountCount;
    }

    private void checkSecurityContextEnsureUserIsPresent() {
        if(isEmpty(securityContext.getUser())) {
            throw new IllegalStateException("Missing user in security context");
        }
    }

    @Override
    @PerformanceLogger
    @Cacheable(value = "documentFirstVersionCache", key = "#documentRef", condition = "#root.target.cacheEnabled")
    public <D extends LeosDocument> D findFirstVersion(Class<? extends D> type, String documentRef) {
        logger.trace("Finding document with ref... [ref=" + documentRef + ']');

        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.findFirstVersion(documentRef);
        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Error occurred retrieving document! [=" + documentRef + ']'));
    }

    @Override
    @PerformanceLogger
    @Cacheable(value = "documentByVersionCache", key = "{#documentRef, #versionLabel}", condition = "#root.target.cacheEnabled")
    public <D extends LeosDocument> D findDocumentByVersion(Class<? extends D> type, String documentRef, String versionLabel) {
        logger.trace("Finding document with ref... [ref=" + documentRef + ']');
        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.findDocumentByVersion(documentRef, versionLabel);
        return toLeosDocument(doc, type, true)
                .orElseThrow(() -> new IllegalStateException("Error occurred retrieving document! [=" + documentRef + ']'));
    }

    @Override
    @PerformanceLogger
    public ExportDocument createExportDocumentFromContent(String path, String name, List<String> comments, byte[] contentBytes, LeosExportStatus status) {
        logger.trace("Creating export document from content... [path=" + path + ", name=" + name + ']');

        checkSecurityContextEnsureUserIsPresent();

        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_CATEGORY), LeosCategory.EXPORT.name());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.INITIAL_CREATED_BY), securityContext.getUser().getLogin());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.INITIAL_CREATION_DATE), ConversionUtils.getLeosDateAsString(new Date(), ConversionUtils.LEOS_REPO_DATE_FORMAT));
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS), status.name());
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS), comments);

        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.createDocumentFromContent(path, name, properties, exportMimeType, contentBytes,
                securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, ExportDocument.class, true)
                .orElseThrow(() -> new IllegalStateException("Unable to create export document from content! [path=" + path + ", name=" + name + ']'));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", keyGenerator = "referenceFromIdKeyGenerator") })
    public ExportDocument updateExportDocument(String id, LeosExportStatus status, byte[] contentBytes, VersionType versionType, String comment) {
        logger.debug("Updating export document status and content... [id=" + id + ", status=" + status.name() + ", content size=" + contentBytes.length + ", versionType=" + versionType + ", comment=" + comment + ']');

        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS), status.name());
        String category = String.valueOf(LeosCategory.EXPORT);
        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.updateDocument(id, properties, contentBytes,
                versionType, category, comment, securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, ExportDocument.class, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update export document  [id=" + id + ']'));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", keyGenerator = "referenceFromIdKeyGenerator") })
    public ExportDocument updateExportDocument(String ref, String id, LeosExportStatus status) {
        logger.trace("Updating Export document status... [id=" + id + ", status=" + status.name() + ']');

        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS), status.name());

        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.updateDocument(ref, id, properties,
                securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, ExportDocument.class, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update export document  [id=" + id + ']'));
    }

    @Override
    @PerformanceLogger
    @Caching(evict = {
            @CacheEvict(value = "documentByIdCache", allEntries = true),
            @CacheEvict(value = "documentByNameCache", allEntries = true),
            @CacheEvict(value = "documentByVersionCache", allEntries = true),
            @CacheEvict(value = "documentCache", keyGenerator = "referenceFromIdKeyGenerator") })
    public ExportDocument updateExportDocument(String ref, String id, List<String> comments) {
        logger.trace("Updating Export document status... [id=" + id + ", status=" + comments + ']');

        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS), comments);

        eu.europa.ec.leos.rest.support.model.LeosDocument doc = repository.updateDocument(ref, id, properties,
                securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);

        return toLeosDocument(doc, ExportDocument.class, true)
                .orElseThrow(() -> new IllegalStateException("Unable to update export document comments! [id=" + id + ", comments=" + comments + ']'));
    }

    @Override
    @PerformanceLogger
    @CacheEvict(value = "restRepositoryFolderCache", key = "#name")
    public Object createFolder(String path, String name) {
        return repository.createPackage(name, securityContext!=null && securityContext.hasAuthenticationInContext() ? securityContext.getUserName() : ADMIN_USER);
    }

    @Override
    @PerformanceLogger
    @Cacheable(value = "restRepositoryFolderCache", key = "#path", condition = "#root.target.cacheEnabled")
    public Object findFolderByPath(String path) {
        return repository.findPackageByName(extractPackageNameFromPath(path));
    }

    private String extractPackageNameFromPath(String path) {
        path = path.replace(workspacesPath, "");
        if (!StringUtils.hasText(path) || path.equals("/")) {
            return "%";
        } else if (path.startsWith("/")) {
            path = path.substring(1);
        }
        if (path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }
        if (path.contains("/")) {
            path = path.substring(path.lastIndexOf("/") + 1);
        }
        return path;
    }

    private static LeosCategory getCategory(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        String leosCategory = document.getCategory();
        leosCategory = (leosCategory.startsWith("TEMPLATE_")) ? leosCategory.substring("TEMPLATE_".length()) : leosCategory;
        return LeosCategory.valueOf(leosCategory);
    }
}
