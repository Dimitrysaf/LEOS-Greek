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
package eu.europa.ec.leos.repository.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.leos.repository.common.VersionType;
import eu.europa.ec.leos.repository.common.CustomTemplateMilestoneStatus;
import eu.europa.ec.leos.repository.controllers.requests.QueryFilter;
import eu.europa.ec.leos.repository.entities.*;
import eu.europa.ec.leos.repository.entities.Document;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.Collaborator;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.repositories.*;
import eu.europa.ec.leos.repository.entities.CustomTemplateEntities;
import eu.europa.ec.leos.repository.utils.ConversionUtils;
import eu.europa.ec.leos.repository.utils.PropertiesMetadata;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.Validate;
import org.apache.tika.Tika;
import org.apache.tika.io.TikaInputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.w3c.dom.*;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayInputStream;
import java.io.StringWriter;

@Service
public class DocumentServiceImpl implements DocumentService {
    private static final Logger LOG = LoggerFactory.getLogger(DocumentServiceImpl.class);
    private static final int MAX_RESULT_DEFAULT = 100;
    private static final String XML_DOC_EXT = ".xml";
    private static final String CUSTOM_TEMPLATE_COMMENT = "Custom Template";

    private final DocumentRepository documentRepository;
    private final DocumentVRepository documentVRepository;
    private final DocumentVersionRepository documentVersionRepository;
    private final DocumentContentRepository documentContentRepository;
    private final DocumentCategoriesRepository documentCategoriesRepository;
    private final DocumentPropertiesRepository documentPropertiesRepository;
    private final DocumentPropertyValuesRepository documentPropertyValuesRepository;
    private final PackageRepository packageRepository;
    private final PackageService packageService;
    private final CollaboratorsService collaboratorsService;
    private final MilestoneDocumentService milestoneDocumentService;
    private final ConfigService configService;
    private final EntityManager entityManager;
    private final DocumentMilestoneRepository documentMilestoneRepository;

    private static final ObjectMapper mapper = new ObjectMapper();
    private final ConfigContentRepository configContentRepository;
    private final ConfigVersionRepository configVersionRepository;
    private final ConfigurationVRepository configurationVRepository;
    private final CustomTemplateEntitiesRepository customTemplateEntitiesRepository;
    private final CustomTemplateConfigRepository customTemplateConfigRepository;
    private final CustomTemplateConfigVersionRepository customTemplateConfigVersionRepository;
    private final CustomTemplateConfigContentRepository customTemplateConfigContentRepository;
    private final CustomTemplateConfigCategoryRepository customTemplateConfigCategoryRepository;
    private final ConfigCategoryRepository configCategoryRepository;

    @Autowired
    public DocumentServiceImpl(DocumentRepository documentRepository, DocumentVRepository documentVRepository,
                               DocumentVersionRepository documentVersionRepository, DocumentContentRepository documentContentRepository,
                               DocumentCategoriesRepository documentCategoriesRepository,
                               DocumentPropertiesRepository documentPropertiesRepository,
                               DocumentPropertyValuesRepository documentPropertyValuesRepository,
                               PackageRepository packageRepository, PackageService packageService,
                               CollaboratorsService collaboratorsService,
                               MilestoneDocumentService milestoneDocumentService,
                               ConfigService configService, EntityManager entityManager,
                               DocumentMilestoneRepository documentMilestoneRepository, ConfigContentRepository configContentRepository, ConfigVersionRepository configVersionRepository, ConfigurationVRepository configurationVRepository, CustomTemplateEntitiesRepository customTemplateEntitiesRepository, CustomTemplateConfigRepository customTemplateConfigRepository, CustomTemplateConfigVersionRepository customTemplateConfigVersionRepository, CustomTemplateConfigContentRepository customTemplateConfigContentRepository, CustomTemplateConfigCategoryRepository customTemplateConfigCategoryRepository, ConfigCategoryRepository configCategoryRepository) {
        this.documentRepository = documentRepository;
        this.documentVRepository = documentVRepository;
        this.documentVersionRepository = documentVersionRepository;
        this.documentContentRepository = documentContentRepository;
        this.documentCategoriesRepository = documentCategoriesRepository;
        this.documentPropertiesRepository = documentPropertiesRepository;
        this.documentPropertyValuesRepository = documentPropertyValuesRepository;
        this.packageRepository = packageRepository;
        this.packageService = packageService;
        this.collaboratorsService = collaboratorsService;
        this.milestoneDocumentService = milestoneDocumentService;
        this.configService = configService;
        this.entityManager = entityManager;
        this.documentMilestoneRepository = documentMilestoneRepository;
        this.configContentRepository = configContentRepository;
        this.configVersionRepository = configVersionRepository;
        this.configurationVRepository = configurationVRepository;
        this.customTemplateEntitiesRepository = customTemplateEntitiesRepository;
        this.customTemplateConfigRepository = customTemplateConfigRepository;
        this.customTemplateConfigVersionRepository = customTemplateConfigVersionRepository;
        this.customTemplateConfigContentRepository = customTemplateConfigContentRepository;
        this.customTemplateConfigCategoryRepository = customTemplateConfigCategoryRepository;
        this.configCategoryRepository = configCategoryRepository;
    }

    @Transactional(rollbackFor = Exception.class)
    public LeosDocument createDocumentFromContent(final String packageName, final String name, Map<String, ?> metadata,
            final String labelVersion,
            int versionType, byte[] contentBytes, String comments, String userName) throws RepositoryException {
        try {
            checkMetadata(metadata);

            String createdBy = metadata.get(PropertiesMetadata.CREATED_BY.getLeosName()) != null ?
                    (String) metadata.get(PropertiesMetadata.CREATED_BY.getLeosName()) : userName;
            LocalDateTime creationDate = metadata.get(PropertiesMetadata.CREATION_DATE.getLeosName()) != null ?
                    ConversionUtils.convertToLocalDateTime(
                            ConversionUtils.getDateFromString((String) metadata.get(PropertiesMetadata.CREATION_DATE.getLeosName())
                                    , ConversionUtils.LEOS_REPO_DATE_FORMAT)) : LocalDateTime.now();

            // FIRST STEP: get package
            Package pkg = packageRepository.findPackageByName(packageName)
                    .orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Package.class.getName()));
            DocumentCategories docCat = documentCategoriesRepository.findDocumentCategoriesByCategoryCode(
                            (String) metadata.get(PropertiesMetadata.CATEGORY.getLeosName()))
                    .orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentCategories.class.getName()));

            Document doc = new Document();
            doc.setName(name);
            doc.setAuditCBy(createdBy);
            doc.setAuditCDate(creationDate);
            doc.setAuditLastMBy(userName);
            doc.setAuditLastMDate(LocalDateTime.now());
            doc.setPackageId(pkg);
            // TODO: Remove this line for docStage after the completion of ticket https://code.europa.eu/leos/core/-/issues/2359
            doc.setDocStage(metadata.get(PropertiesMetadata.DOC_STAGE.getLeosName()) == null ? " " :
                    (String) metadata.get(PropertiesMetadata.DOC_STAGE.getLeosName()));
            doc.setDocTemplate(metadata.get(PropertiesMetadata.DOC_TEMPLATE.getLeosName()) == null ? "-" :
                    (String) metadata.get(PropertiesMetadata.DOC_TEMPLATE.getLeosName()));
            doc.setLanguage(metadata.get(PropertiesMetadata.LANGUAGE.getLeosName()) == null ? "-" :
                    (String) metadata.get(PropertiesMetadata.LANGUAGE.getLeosName()));
            doc.setProcedureType(metadata.get(PropertiesMetadata.PROCEDURE_TYPE.getLeosName()) == null ? "-" :
                    (String) metadata.get(PropertiesMetadata.PROCEDURE_TYPE.getLeosName()));
            doc.setLiveDiffingRequired(metadata.get(PropertiesMetadata.LIVE_DIFFING_REQUIRED.getLeosName()) == null ? false :
                    (Boolean) metadata.get(PropertiesMetadata.LIVE_DIFFING_REQUIRED.getLeosName()));
            if (metadata.get(PropertiesMetadata.COLLABORATORS.getLeosName()) != null) {
                List<Collaborator> collaborators =
                        ConversionUtils.getLeosCollaboratorsFromLinkedHashMap(
                                (ArrayList<LinkedHashMap<String, Object>>) metadata.get(PropertiesMetadata.COLLABORATORS.getLeosName()));
                collaboratorsService.updateCollaborators(pkg, collaborators, userName);
            }
            if (metadata.get(PropertiesMetadata.REF.getLeosName()) != null) {
                doc.setRef((String) metadata.get(PropertiesMetadata.REF.getLeosName()));
            } else {
                if (name.lastIndexOf('.') > 0) {
                    doc.setRef(name.lastIndexOf('.') > 0 ? name.substring(0, name.lastIndexOf('.')) : name);
                }
            }
            doc.setCategoryId(docCat);
            doc.setCategoryCode(docCat.getCategoryCode());
            if (metadata.get(PropertiesMetadata.ORIGIN_REF.getLeosName()) != null) {
                doc.setOriginRef((String) metadata.get(PropertiesMetadata.ORIGIN_REF.getLeosName()));
            }
            if (metadata.get(PropertiesMetadata.CLONED_FROM.getLeosName()) != null) {
                doc.setClonedFrom((String) metadata.get(PropertiesMetadata.CLONED_FROM.getLeosName()));
            }
            if (metadata.get(PropertiesMetadata.REVISION_STATUS.getLeosName()) != null) {
                doc.setRevisionStatus((String) metadata.get(PropertiesMetadata.REVISION_STATUS.getLeosName()));
            }
            if (metadata.get(PropertiesMetadata.CONTRIBUTION_STATUS.getLeosName()) != null) {
                doc.setContributionStatus((String) metadata.get(PropertiesMetadata.CONTRIBUTION_STATUS.getLeosName()));
            }
            doc.setCustomTemplateAct((Boolean) metadata.get(PropertiesMetadata.CUSTOM_TEMPLATE_ACT.getLeosName()));
            doc = documentRepository.save(doc);

            Tika tika = new Tika();
            String type = tika.detect(TikaInputStream.get(contentBytes));
            if (type.contains("zip")) {
                return milestoneDocumentService.createMilestoneFromContent(doc, metadata, contentBytes, userName);
            } else {
                Map<DocumentContent, DocumentVersion> docs = createDocument(doc, metadata, labelVersion, versionType, contentBytes, comments, userName);
                DocumentVersion documentVersion = docs.values().stream().findFirst().get();
                updateDocumentProperties(doc, documentVersion, (Map<String, Object>) metadata, userName);
                return ConversionUtils.buildXmlDocument(doc, documentVersion, docs.keySet().stream().findFirst().get(), collaboratorsService,
                        documentPropertyValuesRepository);
            }
        } catch (RepositoryException e) {
            LOG.error("Error while creating document", e);
            throw e;
        } catch (Exception e) {
            LOG.error("Error while creating document", e);
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public LeosDocument createDocumentFromSource(final String sourceDocumentId, final String packageName, final String name, Map<String, ?> metadata,
            final String labelVersion, int versionType, String comments, String userId) throws RepositoryException {
        LeosDocument template = findTemplateByName((String) metadata.get("docTemplate"));
        metadata = mergeDocMetadataWithTemplateMetadata(metadata, template);
        return createDocumentFromContent(packageName, name, metadata, labelVersion, versionType, template.getSource(), comments, userId);
    }

    private Map<String, ?> mergeDocMetadataWithTemplateMetadata(Map<String, ?> metadata, LeosDocument template) {
        Map<String, Object> templateMetadata = template.getMetadata();
        templateMetadata.putAll(metadata);
        return templateMetadata;
    }

    @Transactional(rollbackFor = Exception.class)
    public LeosDocument updateDocument(final BigDecimal versionId, Map<String, ?> metadata,
            VersionType versionType, String category, byte[] contentBytes, String comments, String userId) throws Exception {

        switch (category) {
            case "LEG":
            case "EXPORT":
                Optional<LeosDocument> leosDoc = milestoneDocumentService.findMilestoneById(versionId);
                Document legDoc = documentRepository.findDocumentById(leosDoc.get().getDocumentId()).orElseThrow(() ->
                        new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Document.class.getName()));
                return milestoneDocumentService.updateMilestone(legDoc, contentBytes, metadata, userId);

            default:
                boolean isMajor = !versionType.equals(VersionType.MINOR) && !versionType.equals(VersionType.TECHNICAL);
                Optional<DocumentV> docView = documentVRepository.findVersionByVersionId(versionId);
                Document doc = documentRepository.findDocumentByRef(docView.get().getRef()).orElseThrow(() ->
                        new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Document.class.getName()));

                Optional<DocumentVersion> latestVersion = documentVersionRepository.findLastVersionByDocumentId(doc.getId());
                String labelVersion = getNextVersionLabel(docView.get().getRef(), versionType, latestVersion.get().getVersionLabel());
                Optional<DocumentVersion> latestMajorVersion = Optional.empty();
                if (isMajor) {
                    latestMajorVersion = documentVersionRepository.findLastMajorVersionByDocumentId(doc.getId());
                }

                Map<DocumentContent, DocumentVersion> docs = updateDocument(doc, metadata, labelVersion, versionType.value(), contentBytes, comments, userId);
                doc = updateDocumentMetadata(doc, docs.values().stream().findFirst().get(), (Map<String, Object>) metadata, userId);

                if (latestVersion.isPresent()) {
                    latestVersion.get().setIsLatestVersion(false);
                    documentVersionRepository.save(latestVersion.get());
                }
                if (latestMajorVersion.isPresent()) {
                    latestMajorVersion.get().setIsLatestMajorVersion(false);
                    documentVersionRepository.save(latestMajorVersion.get());
                }

                return ConversionUtils.buildXmlDocument(doc, docs.values().stream().findFirst().get(),
                        docs.keySet().stream().findFirst().get(), collaboratorsService, documentPropertyValuesRepository);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public LeosDocument updateDocument(String ref, final BigDecimal versionId, Map<String, ?> metadata, String userId, boolean latest) throws Exception {
        Optional<DocumentV> docV = documentVRepository.findVersionByRefAndVersionId(ref, versionId);
        if (docV.isPresent()) {
            DocumentVersion docVersion = documentVersionRepository.findById(versionId)
                    .orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND,
                            DocumentVersion.class.getName()));
            if (latest) {
                docVersion = documentVersionRepository.findLastVersionByDocumentId(docVersion.getDocumentId())
                        .orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND,
                                DocumentVersion.class.getName()));
            }
            Document doc =
                    documentRepository.findById(docVersion.getDocumentId())
                            .orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND,
                                    Document.class.getName()));
            Map<DocumentContent, DocumentVersion> docs = updateDocumentContentMetadataAndVersionComments(docVersion, metadata, userId);
            DocumentVersion documentVersion = docs.values().stream().findFirst().get();
            doc = updateDocumentMetadata(doc, documentVersion, (Map<String, Object>) metadata, userId);

            return ConversionUtils.buildXmlDocument(doc, documentVersion, docs.keySet().stream().findFirst().get(), collaboratorsService,
                    documentPropertyValuesRepository);
        } else {
            return milestoneDocumentService.updateMilestoneMetadata(versionId, metadata, userId);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public LeosDocument archiveDocument(final String ref, String userId) throws Exception {
        Document doc =
                documentRepository.findDocumentByRef(ref).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND,
                        Document.class.getName()));
        doc.setIsArchived(true);
        doc.setAuditLastMBy(userId);
        doc.setAuditLastMDate(LocalDateTime.now());
        documentRepository.save(doc);
        return ConversionUtils.buildXmlDocument(documentVRepository, documentContentRepository,
                ConversionUtils.fetchCollaborators(collaboratorsService, doc.getPackageId().getId()),
                documentPropertyValuesRepository, doc.getId());
    }

    @Transactional(rollbackFor = Exception.class)
    public LeosDocument archiveDocumentVersion(final String docRef, String version) throws Exception {
        DocumentV documentV = findDocumentVByVersion(docRef, version);
        if(documentV != null) {
            BigDecimal documentId = documentV.getDocumentId();
            DocumentVersion documentVersion = documentVersionRepository.findDocumentVersionByVersionLabelAndDocumentId(version, documentId).orElse(null);
            if(documentVersion != null) {
                documentVersion.setVersionArchived(true);
                documentVersion.setComments("Version archived");
                documentVersionRepository.save(documentVersion);
            }
        }
        return new LeosDocument();
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteDocumentByVersionId(BigDecimal id) throws RepositoryException {
        DocumentV docView = documentVRepository.findVersionByVersionId(id)
                .orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentV.class.getName()));
        Optional<Document> doc = documentRepository.findById(docView.getDocumentId());
        doc.ifPresent(documentRepository::delete);
        List<DocumentVersion> versions = documentVersionRepository.findAllVersionsByDocumentId(docView.getDocumentId());
        for (DocumentVersion v : versions) {
            Optional<DocumentContent> content = documentContentRepository.findDocumentContentByVersion(v);
            content.ifPresent(documentContentRepository::delete);
        }
        List<DocumentPropertyValues> propValues = documentPropertyValuesRepository.findDocumentPropertiesByDocumentId(docView.getDocumentId());
        documentPropertyValuesRepository.deleteAll(propValues);
        documentVersionRepository.deleteAll(versions);
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteDocumentById(BigDecimal id) throws RepositoryException {
        Document doc = documentRepository.findDocumentById(id)
                .orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Document.class.getName()));
        List<DocumentVersion> versions = documentVersionRepository.findAllVersionsByDocumentId(doc.getId());
        if (versions.isEmpty()) {
            milestoneDocumentService.deleteMilestoneByRef(doc);
            documentRepository.delete(doc);
            return;
        }
        documentRepository.delete(doc);
        for (DocumentVersion v : versions) {
            Optional<DocumentContent> content = documentContentRepository.findDocumentContentByVersion(v);
            content.ifPresent(documentContentRepository::delete);
        }
        List<DocumentPropertyValues> propValues = documentPropertyValuesRepository.findDocumentPropertiesByDocumentId(doc.getId());
        documentPropertyValuesRepository.deleteAll(propValues);
        documentVersionRepository.deleteAll(versions);
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteDocumentByRef(String ref) throws RepositoryException {
        Document doc = documentRepository.findDocumentByRef(ref)
                .orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Document.class.getName()));
        List<DocumentVersion> versions = documentVersionRepository.findAllVersionsByDocumentId(doc.getId());
        if (versions.isEmpty()) {
            milestoneDocumentService.deleteMilestoneByRef(doc);
            documentRepository.delete(doc);
            return;
        }
        documentRepository.delete(doc);
        for (DocumentVersion v : versions) {
            Optional<DocumentContent> content = documentContentRepository.findDocumentContentByVersion(v);
            content.ifPresent(documentContentRepository::delete);
        }
        List<DocumentPropertyValues> propValues = documentPropertyValuesRepository.findDocumentPropertiesByDocumentId(doc.getId());
        documentPropertyValuesRepository.deleteAll(propValues);
        documentVersionRepository.deleteAll(versions);
    }

    public List<LeosDocument> findAllVersionsByRef(final String ref) {
        List<DocumentV> docViews = documentVRepository.findAllVersionsByRef(ref);
        return ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, docViews.isEmpty() ?
                Arrays.asList() : ConversionUtils.fetchCollaborators(collaboratorsService,
                docViews.get(0).getPackageId()), documentContentRepository, docViews, false);
    }

    public List<LeosDocument> findVersionsBetween(String docRef, String fromVersion) {
        List<LeosDocument> allVersions = findAllVersionsByRef(docRef);
        return allVersions.stream()
            .filter(doc -> compareVersions(doc.getVersionLabel(), fromVersion) > 0)
            .collect(Collectors.toList());
    }

    private int compareVersions(String version1, String version2) {
        String[] v1Parts = version1.split("\\.");
        String[] v2Parts = version2.split("\\.");
        int maxLength = Math.max(v1Parts.length, v2Parts.length);
        
        for (int i = 0; i < maxLength; i++) {
            int v1Part = i < v1Parts.length ? Integer.parseInt(v1Parts[i]) : 0;
            int v2Part = i < v2Parts.length ? Integer.parseInt(v2Parts[i]) : 0;
            if (v1Part != v2Part) {
                return Integer.compare(v1Part, v2Part);
            }
        }
        return 0;
    }

    public List<LeosDocument> searchVersionsByRef(final String ref, final List<String> logins, final String versionType) {
        StringBuilder queryBuild = new StringBuilder("SELECT d FROM DocumentV d");
        queryBuild.append(" WHERE 1 = 1");
        queryBuild.append(" AND d.ref = :ref");
        if (!logins.isEmpty()) {
            queryBuild.append(" AND d.updatedBy IN (:loginsList)");
        }
        if (!StringUtils.isBlank(versionType)) {
            queryBuild.append(" AND d.versionType = :versionType");
        }
        queryBuild.append(" ORDER BY d.updatedOn DESC");

        Query query = entityManager.createQuery(queryBuild.toString());

        query.setParameter("ref", ref);
        if (!logins.isEmpty()) {
            query.setParameter("loginsList", logins);
        }
        if (!StringUtils.isBlank(versionType)) {
            query.setParameter("versionType", String.valueOf(VersionType.valueOf(versionType).value()));
        }

        List<DocumentV> docViews = query.getResultList();
        return ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, docViews.isEmpty() ?
                Arrays.asList() : ConversionUtils.fetchCollaborators(collaboratorsService,
                docViews.get(0).getPackageId()), documentContentRepository, docViews, false);
    }

    public LeosDocument findDocumentById(final BigDecimal versionId, String category, final boolean latest) throws RepositoryException {
        Validate.notNull(category, "Method findDocumentById: Document category should not be null");
        switch (category) {
            case "CONFIG":
            case "STRUCTURE":
            case "TEMPLATE":
                return configService.findConfigByVersionId(versionId);
            case "LEG":
            case "EXPORT":
                Optional<LeosDocument> leosDocument = milestoneDocumentService.findMilestoneById(versionId);
                if (!leosDocument.isPresent()) {
                    throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, "Document with id - " + versionId + " not found!");
                }
                return leosDocument.get();
            default:
                Optional<DocumentV> docView = documentVRepository.findVersionByVersionId(versionId);
                if (!docView.isPresent()) {
                    throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, "Document with id - " + versionId + " not found!");
                }
                if (latest && !docView.get().isLatestVersion()) {
                    docView = documentVRepository.findLastVersionByDocumentId(docView.get().getDocumentId());
                }
                return ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, ConversionUtils.fetchCollaborators(collaboratorsService,
                        docView.get().getPackageId()), documentContentRepository, docView.orElse(null), true);
        }
    }

    public LeosDocument findLatestMajorVersionByRef(final String docRef) {
        Optional<DocumentV> docView = documentVRepository.findLatestMajorVersionByRef(docRef);
        return ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, docView.isPresent() ? ConversionUtils.fetchCollaborators(collaboratorsService,
                docView.get().getPackageId()) : Arrays.asList(), documentContentRepository, docView.orElse(null), true);
    }

    public LeosDocument findLatestMajorMilestoneVersionByRef(final String docRef) {
        Optional<DocumentV> docView = documentVRepository.findLatestMajorMilestoneVersionByRef(docRef);
        return ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, docView.isPresent() ? ConversionUtils.fetchCollaborators(collaboratorsService,
                docView.get().getPackageId()) : Arrays.asList(), documentContentRepository, docView.orElse(null), true);
    }

    public LeosDocument findFirstVersion(final String docRef) {
        LOG.info("Find first version: docRef={}", docRef);
        Optional<DocumentV> docView = documentVRepository.findFirstVersion(docRef);
        return ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, docView.isPresent() ? ConversionUtils.fetchCollaborators(collaboratorsService,
                docView.get().getPackageId()) : Arrays.asList(), documentContentRepository, docView.orElse(null), true);
    }

    public LeosDocument findDocumentByVersion(final String docRef, final String versionLabel) {
        LOG.info("Find Document by version: docRef={}, versionLabel={}", docRef, versionLabel);
        Optional<DocumentV> docView = documentVRepository.findDocumentByVersion(docRef, versionLabel);
        return ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, docView.isPresent() ? ConversionUtils.fetchCollaborators(collaboratorsService,
                docView.get().getPackageId()) : Arrays.asList(), documentContentRepository, docView.orElse(null), true);
    }

    @Override
    public String getNextVersionLabel(VersionType versionType, String oldVersion) {
        return this.getNextVersionLabel(null, versionType, oldVersion);
    }

    public DocumentV findDocumentVByVersion(final String docRef, final String versionLabel) {
        LOG.info("Find Document by version: docRef={}, versionLabel={}", docRef, versionLabel);
        Optional<DocumentV> docView = documentVRepository.findDocumentByVersion(docRef, versionLabel);
        return docView.orElse(null);
    }

    @Override
    public Optional<LeosDocument> findDocumentByName(final String fileName) throws RepositoryException {
        List<LeosDocument> listDocs = new ArrayList<>();
        List<DocumentV> docs = documentVRepository.findDocumentsByName(fileName);
        listDocs.addAll(configService.findConfigByName(fileName));
        if (listDocs.isEmpty()) {
            listDocs.addAll(milestoneDocumentService.findMilestoneByName(fileName));
        }
        if (listDocs.isEmpty()) {
            listDocs.addAll(ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, docs.isEmpty() ?
                    Arrays.asList() : ConversionUtils.fetchCollaborators(collaboratorsService,
                    docs.get(0).getPackageId()), documentContentRepository, docs, true));
        }
        return listDocs.isEmpty() ? Optional.empty() : Optional.ofNullable(listDocs.get(0));
    }

    public List<LeosDocument> findAllDocumentsByPackageId(final String pkgId) throws RepositoryException {
        try {
            List<LeosDocument> listDocs = new ArrayList<>();
            List<DocumentV> docs = documentVRepository.findDocumentsByPackageId(new BigDecimal(Long.parseLong(pkgId)));
            listDocs.addAll(ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, docs.isEmpty() ?
                            Arrays.asList() : ConversionUtils.fetchCollaborators(collaboratorsService,
                            docs.get(0).getPackageId()), documentContentRepository, docs,
                    false));
            listDocs.addAll(milestoneDocumentService.findMilestoneByPackageId(pkgId, false));
            return listDocs;
        } catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, LeosDocument.class.getName());
        }
    }

    public String getNextVersionLabel(String docRef, VersionType versionType, String oldVersion) {
        if (StringUtils.isEmpty(oldVersion)) {
            if (versionType.equals(VersionType.MAJOR)) {
                return "1.0.0.0";
            } else if (versionType.equals(VersionType.INTERMEDIATE)) {
                return "0.1.0.0";
            } else if (versionType.equals(VersionType.MINOR)){
                return "0.0.1.0";
            }
            else {
                return "0.0.0.1";
            }
        }

        String[] newVersion = oldVersion.split("\\.");
        // Handle existing 3-part versions by adding .0
        if (newVersion.length == 3) {
            String[] temp = new String[4];
            System.arraycopy(newVersion, 0, temp, 0, 3);
            temp[3] = "0";
            newVersion = temp;
        }
        
        if (versionType.equals(VersionType.MAJOR)) {
            newVersion[0] = Integer.parseInt(newVersion[0]) + 1 + "";
            newVersion[1] = "0";
            newVersion[2] = "0";

            if (docRef != null && !newVersion[0].equals("1")){
                LeosDocument doc = findLatestMajorMilestoneVersionByRef(docRef);
                List<LeosDocument> versions = findVersionsBetween(docRef, doc.getVersionLabel());
                if (versions != null && !versions.isEmpty()) {
                    boolean allTechnical = versions.stream()
                        .allMatch(v -> v.getVersionType().equals(VersionType.TECHNICAL));
                    newVersion[3] = allTechnical ? "1" : "0";
                } else {
                    newVersion[3] = "0";
                }
            }
            else{
                newVersion[3] = "0";
            }
        } else if (versionType.equals(VersionType.INTERMEDIATE)) {
            newVersion[1] = Integer.parseInt(newVersion[1]) + 1 + "";
            newVersion[2] = "0";
            newVersion[3] = "0";
        } else if (versionType.equals(VersionType.MINOR)) {
            newVersion[2] = Integer.parseInt(newVersion[2]) + 1 + "";
            newVersion[3] = "0";
        } else {
            newVersion[3] = Integer.parseInt(newVersion[3]) + 1 + "";
        }
        return newVersion[0] + "." + newVersion[1] + "." + newVersion[2] + "." + newVersion[3];
    }

    private Document updateDocumentMetadata(Document doc, DocumentVersion docVersion, Map<String, Object> metadata, String userId) throws Exception {
        if (metadata.get(PropertiesMetadata.COLLABORATORS.getLeosName()) != null) {
            List<Collaborator> collaborators =
                    ConversionUtils.getLeosCollaboratorsFromLinkedHashMap(
                            (ArrayList<LinkedHashMap<String, Object>>) metadata.get(PropertiesMetadata.COLLABORATORS.getLeosName()));
            collaboratorsService.updateCollaborators(doc.getPackageId(), collaborators, userId);
        }
        doc.setDocStage(metadata.get(PropertiesMetadata.DOC_STAGE.getLeosName()) == null ? doc.getDocStage() :
                (String) metadata.get(PropertiesMetadata.DOC_STAGE.getLeosName()));
        doc.setDocTemplate(metadata.get(PropertiesMetadata.DOC_TEMPLATE.getLeosName()) == null ? doc.getDocTemplate() :
                (String) metadata.get(PropertiesMetadata.DOC_TEMPLATE.getLeosName()));
        doc.setLanguage(metadata.get(PropertiesMetadata.LANGUAGE.getLeosName()) == null ? doc.getLanguage() :
                (String) metadata.get(PropertiesMetadata.LANGUAGE.getLeosName()));
        doc.setProcedureType(metadata.get(PropertiesMetadata.PROCEDURE_TYPE.getLeosName()) == null ? doc.getProcedureType() :
                (String) metadata.get(PropertiesMetadata.PROCEDURE_TYPE.getLeosName()));
        doc.setLiveDiffingRequired(metadata.get(PropertiesMetadata.LIVE_DIFFING_REQUIRED.getLeosName()) == null ? doc.getLiveDiffingRequired() :
                (Boolean) metadata.get(PropertiesMetadata.LIVE_DIFFING_REQUIRED.getLeosName()));
        doc.setBaseRevisionId(metadata.get(PropertiesMetadata.BASE_REVISION_ID.getLeosName()) != null ?
                (String) metadata.get(PropertiesMetadata.BASE_REVISION_ID.getLeosName()) : doc.getBaseRevisionId());
        doc.setOriginRef(metadata.get(PropertiesMetadata.ORIGIN_REF.getLeosName()) != null ?
                (String) metadata.get(PropertiesMetadata.ORIGIN_REF.getLeosName()) : doc.getOriginRef());
        doc.setClonedFrom(metadata.get(PropertiesMetadata.CLONED_FROM.getLeosName()) != null ?
                (String) metadata.get(PropertiesMetadata.CLONED_FROM.getLeosName()) : doc.getClonedFrom());
        doc.setRevisionStatus(metadata.get(PropertiesMetadata.REVISION_STATUS.getLeosName()) != null ?
                (String) metadata.get(PropertiesMetadata.REVISION_STATUS.getLeosName()) : doc.getRevisionStatus());
        doc.setContributionStatus(metadata.get(PropertiesMetadata.CONTRIBUTION_STATUS.getLeosName()) != null ?
                (String) metadata.get(PropertiesMetadata.CONTRIBUTION_STATUS.getLeosName()) : doc.getContributionStatus());
        updateDocumentProperties(doc, docVersion, metadata, userId);
        return documentRepository.save(doc);
    }

    private void updateDocumentProperties(Document doc, DocumentVersion docVersion, Map<String, Object> metadata, String userId)
            throws JsonProcessingException {
        List<DocumentPropertyValues> currentProps =
                documentPropertyValuesRepository.findDocumentPropertiesByVersionId(docVersion.getId());
        if (currentProps.isEmpty()) {
            List<DocumentPropertyValues> oldProps =
                    documentPropertyValuesRepository.findDocumentPropertiesFromPreviousVersion(doc.getId());
            for (DocumentPropertyValues prop : oldProps) {
                DocumentPropertyValues value = new DocumentPropertyValues();
                value.setAuditCBy(prop.getAuditCBy());
                value.setAuditCDate(prop.getAuditCDate());
                value.setAuditLastMBy(prop.getAuditLastMBy());
                value.setAuditLastMDate(prop.getAuditLastMDate());
                value.setDocumentId(prop.getDocumentId());
                value.setVersion(docVersion);
                value.setPropertyId(prop.getPropertyId());
                value.setPropertyValue(prop.getPropertyValue());
                documentPropertyValuesRepository.save(value);
            }
        }
        List<DocumentProperties> props = documentPropertiesRepository.findDocumentPropertiesByDocCategoryId(doc.getCategoryId());
        if (props != null && !props.isEmpty()) {
            for (DocumentProperties prop : props) {
                Object newValue = metadata.get(prop.getPropertyName());
                if (newValue != null) {
                    List<DocumentPropertyValues> currentValues =
                            documentPropertyValuesRepository.findDocumentPropertyValuesByDocumentIdAndVersionAndPropertyId(doc.getId(), docVersion, prop);
                    documentPropertyValuesRepository.deleteAll(currentValues);
                    if (newValue instanceof List) {
                        for (Object v : ((List<?>) newValue)) {
                            createPropertyValue(userId, userId, doc.getId(), docVersion, prop, v);
                        }
                    } else {
                        createPropertyValue(userId, userId, doc.getId(), docVersion, prop, newValue);
                    }
                }
            }
        }
    }

    private void createPropertyValue(String createdBy, String updatedBy, BigDecimal docId,
            DocumentVersion version, DocumentProperties property, Object value) throws JsonProcessingException {
        DocumentPropertyValues propertyValue = new DocumentPropertyValues();
        if (propertyValue.getAuditCBy() == null || propertyValue.getAuditCDate() == null) {
            propertyValue.setAuditCBy(createdBy);
            propertyValue.setAuditCDate(LocalDateTime.now());
        }
        propertyValue.setAuditLastMBy(updatedBy);
        propertyValue.setAuditLastMDate(LocalDateTime.now());
        propertyValue.setDocumentId(docId);
        propertyValue.setVersion(version);
        propertyValue.setPropertyId(property);
        if (value instanceof String) {
            propertyValue.setPropertyValue((String) value);
        } else {
            propertyValue.setPropertyValue(mapper.writeValueAsString(value));
        }
        documentPropertyValuesRepository.save(propertyValue);
    }

    private List<String> parseMajorVersion(String majorVersionLabel) {
        List<String> str = new LinkedList(Arrays.asList(majorVersionLabel.split("[.]")));
        if (str.size() < 2) {
            throw new IllegalArgumentException("CMIS Version number should be in the format x...0");
        } else if (!str.stream().allMatch(StringUtils::isNumeric)) {
            throw new IllegalArgumentException("CMIS Version number should be in the format x...0");
        } else {
            String lastElement = str.remove(str.size() - 1);
            if (!"0".equals(lastElement) && !"1".equals(lastElement)) {
                throw new IllegalArgumentException("CMIS Version number should be in the format of a major version x...0");
            }
            if (str.size() > 2) {
                str.remove(str.size() - 1);
            }
            return str;
        }
    }


    private String buildSearchVersionRegularExp(List<String> str, boolean allIntermediateVersions) {
        StringBuilder versionRegularExp = new StringBuilder();
        // Only use first 3 levels, ignore 4th level
        List<String> first3Levels = str.size() > 3 ? str.subList(0, 2) : str;
        versionRegularExp.append(String.join(".", first3Levels));
        if (allIntermediateVersions) {
            versionRegularExp.append(".%");
        } else {
            versionRegularExp.append(".0");
        }

        return versionRegularExp.toString();
    }

    private String buildMinorVersionsGreaterThanMajorRegularExp(String majorVersionLabel, boolean allIntermediateVersions) {
        List<String> str = parseMajorVersion(majorVersionLabel);
        return buildSearchVersionRegularExp(str, allIntermediateVersions);
    }

    public List<LeosDocument> findAllMinorsForIntermediate(final String docRef, String currIntVersion, final int startIndex, final int maxResults) {
        PageRequest pageRequest =
                PageRequest.of(startIndex, maxResults < 1 ? MAX_RESULT_DEFAULT : maxResults, Sort.Direction.DESC, "updatedOn");
        Optional<DocumentV> prevMajorVersionDoc = documentVRepository.findPreviousMajorVersion(docRef, currIntVersion);
        String prevMajorVersion = prevMajorVersionDoc.isPresent() ? prevMajorVersionDoc.get().getVersionLabel() : "0.0.0.0";

        String lastMajorVersion = buildMinorVersionsGreaterThanMajorRegularExp(prevMajorVersion, true);
        Page<DocumentV> docViews = documentVRepository.findRecentMinorVersions(docRef, lastMajorVersion, pageRequest);
        return ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, docViews.isEmpty() ?
                Arrays.asList() : ConversionUtils.fetchCollaborators(collaboratorsService,
                docViews.getContent().get(0).getPackageId()), documentContentRepository, docViews.toList(), false);
    }

    public long getAllMinorsCountForIntermediate(final String docRef, String currIntVersion) {
        Optional<DocumentV> prevMajorVersionDoc = documentVRepository.findPreviousMajorVersion(docRef, currIntVersion);
        String prevMajorVersion = prevMajorVersionDoc.isPresent() ? prevMajorVersionDoc.get().getVersionLabel() : "0.0.0";
        currIntVersion = buildMinorVersionsGreaterThanMajorRegularExp(prevMajorVersion, true);
        return documentVRepository.getRecentMinorVersionsCount(docRef, currIntVersion);
    }

    public long getAllMajorsCount(final String docRef) {
        return documentVRepository.getAllMajorsCount(docRef);
    }

    public long getRecentMinorVersionsCount(final String docRef, String currIntVersion) {
        currIntVersion = buildMinorVersionsGreaterThanMajorRegularExp(currIntVersion, true);
        return documentVRepository.getRecentMinorVersionsCount(docRef, currIntVersion);
    }

    public List<LeosDocument> findAllMajors(final String docRef, final int startIndex, final int maxResults) {
        PageRequest pageRequest =
                PageRequest.of(startIndex, maxResults < 1 ? MAX_RESULT_DEFAULT : maxResults, Sort.Direction.DESC, "updatedOn");
        Page<DocumentV> docViews = documentVRepository.findAllMajors(docRef, pageRequest);
        return ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, docViews.isEmpty() ?
                Arrays.asList() : ConversionUtils.fetchCollaborators(collaboratorsService,
                docViews.getContent().get(0).getPackageId()), documentContentRepository, docViews.toList(), false);
    }

    public List<LeosDocument> findRecentMinorVersions(final String docRef, String lastMajorVersion, final int startIndex, final int maxResults) {
        lastMajorVersion = buildMinorVersionsGreaterThanMajorRegularExp(lastMajorVersion, true);
        PageRequest pageRequest =
                PageRequest.of(startIndex, maxResults < 1 ? MAX_RESULT_DEFAULT : maxResults, Sort.Direction.DESC, "updatedOn");
        Page<DocumentV> docs = documentVRepository.findRecentMinorVersions(docRef, lastMajorVersion, pageRequest);
        return ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, docs.isEmpty() ?
                Arrays.asList() : ConversionUtils.fetchCollaborators(collaboratorsService,
                docs.getContent().get(0).getPackageId()), documentContentRepository, docs.toList(), false);
    }

    public List<LeosDocument> findDocumentsByUserId(final String userName, final String leosAuthority, String category) {
        List<LeosDocument> xmlDocs = new ArrayList<>();
        Set<String> categories = new HashSet<>();
        categories.add(category);
        List<BigDecimal> pkgIdsList = collaboratorsService.findDocumentsByCollaboratorNameAndRole(userName, leosAuthority);
        for (BigDecimal pkgId : pkgIdsList) {
            List<LeosDocument> foundDocs = packageService.findDocumentsByPackageId(pkgId, categories, false, false);
            xmlDocs.addAll(foundDocs);
        }
        return xmlDocs;
    }

    @Override
    public List<LeosDocument> findDocumentsByUserIdOrEntity(String userName, String entities, String role, String category) {
        List<LeosDocument> xmlDocs = new ArrayList<>();
        Set<String> categories = new HashSet<>();
        categories.add(category);
        //Step 1: Find the package by collaborator name
        List<BigDecimal> pkgIdsList = collaboratorsService.findDocumentsByCollaboratorName(userName);
        //Step 2: Find the package by collaborator's entity name and add it to the list
        pkgIdsList.addAll(collaboratorsService.findDocumentsByCollaboratorNames(entities));
        for (BigDecimal pkgId : pkgIdsList) {
            List<LeosDocument> foundDocs = packageService.findDocumentsByPackageId(pkgId, categories, false, false);
            xmlDocs.addAll(foundDocs);
        }
        return xmlDocs;
    }

    public Optional<LeosDocument> findDocumentByRef(final String ref, String category, boolean withContent) {
        Validate.notNull(category, "Method findDocumentByRef: document category should not be null");
        switch (category) {
            case "CONFIG":
            case "STRUCTURE":
            case "TEMPLATE":
            case "LIGHT_PROFILE":
                try {
                    return Optional.of(findTemplateByName(ref, withContent));
                } catch (RepositoryException e) {
                    return Optional.empty();
                }
            case "LEG":
            case "EXPORT":
                return milestoneDocumentService.findMilestoneByRef(ref);
            default:
                Optional<DocumentV> doc = documentVRepository.findDocumentByRef(ref);
                return Optional.of(ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, ConversionUtils.fetchCollaborators(collaboratorsService,
                                doc.get().getPackageId()),
                        documentContentRepository, doc.get(), true));
        }
    }

    public List<LeosDocument> findDocumentsByStatus(final String status) {
        return milestoneDocumentService.findMilestonesByStatus(status);
    }

    public List<LeosDocument> findDocumentsUsingFilter(final String packageName, final Set<String> categories, final QueryFilter queryFilter,
            final int startIndex, final int maxResults, final boolean fetchContent) {
        StringBuilder queryBuild = new StringBuilder("SELECT d ");
        queryBuild.append(" FROM DocumentV d");
        Query query = createQuery(queryBuild, packageName, categories, queryFilter, true);

        List<DocumentV> docs = query.setFirstResult(startIndex).setMaxResults(maxResults).getResultList();

        List<LeosDocument> xmlDocs = ConversionUtils.buildXmlDocument(documentPropertyValuesRepository, collaboratorsService, documentContentRepository,
                docs,
                fetchContent);
        xmlDocs.addAll(milestoneDocumentService.findMilestonesUsingFilter(packageName, categories, queryFilter, startIndex, maxResults, fetchContent));
        return xmlDocs;
    }

    public long countDocumentsUsingFilter(final String packageName, final Set<String> categories, final QueryFilter queryFilter) {
        StringBuilder queryBuild = new StringBuilder("SELECT COUNT(d) ");
        queryBuild.append(" FROM DocumentV d");
        Query query = createQuery(queryBuild, packageName, categories, queryFilter, false);

        Long count = (Long) query.getSingleResult();

        count += milestoneDocumentService.countMilestonesUsingFilter(packageName, categories, queryFilter);
        return count;
    }

    private Query createQuery(StringBuilder queryBuild, String packageName, Set<String> categories, QueryFilter queryFilter, boolean orderBy) {
        final List<QueryFilter.Filter> filters = queryFilter.getFilters();
        final Class objectClass = DocumentV.class;
        queryBuild.append(" WHERE 1 = 1");
        queryBuild.append(" AND (d.isArchived IS NULL OR d.isArchived = false)");
        queryBuild.append(" AND d.isLatestVersion = true");
        if (!packageName.equals("%")) {
            queryBuild.append(" AND d.packageName = :packageName");
        }
        if (!categories.isEmpty()) {
            queryBuild.append(" AND d.categoryCode IN (:categoryList)");
        }
        enrichQueryWithPackage(queryBuild);
        enrichQueryWithProcedureTypeAndTemplate(queryBuild, filters, objectClass);
        Optional<QueryFilter.Filter> roleFilter = enrichQueryWithCollaborators(queryBuild, filters);
        if (orderBy) {
            enrichOrderBy(queryFilter, objectClass, queryBuild);
        }

        Query query = entityManager.createQuery(queryBuild.toString());

        if (!packageName.equals("%")) {
            query.setParameter("packageName", packageName);
        }
        if (!categories.isEmpty()) {
            query.setParameter("categoryList", categories);
        }
        setParametersForProcedureTypeAndTemplate(query, filters, objectClass);
        setParametersForRoles(query, roleFilter);
        return query;
    }

    private void enrichQueryWithProcedureTypeAndTemplate(StringBuilder queryBuild, List<QueryFilter.Filter> filters, Class objectClass) {
        for (int i = 0; i < filters.size(); i++) {
            QueryFilter.Filter filter = filters.get(i);
            try {
                final String columnName = QueryFilter.FilterType.getColumnName(filter.key);
                Field field = objectClass.getDeclaredField(columnName);
                if (QueryFilter.FilterType.isComplex(filter.key)) {
                    continue;
                }
                if (filter.nullCheck) {
                    queryBuild.append(" AND ( ");
                    queryBuild.append(columnName);
                    queryBuild.append(" IS NULL OR ");
                    queryBuild.append(columnName);
                    queryBuild.append(" = '-' ");
                }
                if ("IN".equalsIgnoreCase(filter.operator)) {
                    if (filter.nullCheck) {
                        queryBuild.append(" OR ");
                    }
                    else {
                        queryBuild.append(" AND ");
                    }
                    queryBuild.append(columnName);
                    queryBuild.append(" IN ( ");
                    queryBuild.append(":valueList_").append(i);
                    queryBuild.append(")");
                } else if (filter.isBoolean){
                    if (filter.nullCheck) {
                        queryBuild.append(" OR ");
                    }
                    else {
                        queryBuild.append(" AND ");
                    }
                    queryBuild.append(columnName);
                    queryBuild.append(" ").append(filter.operator).append(" ");
                    queryBuild.append(":keyValue_").append(i);
                } else {
                    if (filter.nullCheck) {
                        queryBuild.append(" OR ");
                    }
                    else {
                        queryBuild.append(" AND ");
                    }
                    queryBuild.append("LOWER(").append(columnName).append(")");
                    queryBuild.append(" ").append(filter.operator).append(" ");
                    queryBuild.append("LOWER(:keyValue_").append(i).append(")");
                }
                if (filter.nullCheck) {
                    queryBuild.append(")");
                }
            } catch (NoSuchFieldException e) {
                continue;
            }
        }
    }

    private void setParametersForProcedureTypeAndTemplate(Query query, List<QueryFilter.Filter> filters, Class objectClass) {
        for (int i = 0; i < filters.size(); i++) {
            QueryFilter.Filter filter = filters.get(i);
            try {
                objectClass.getDeclaredField(QueryFilter.FilterType.getColumnName(filter.key));//to fail if not present
                if (QueryFilter.FilterType.isComplex(filter.key)) {
                    continue;
                }
                if ("IN".equalsIgnoreCase(filter.operator)) {
                    query.setParameter("valueList_" + i, Arrays.asList(filter.value));
                } else if(filter.isBoolean) {
                    query.setParameter("keyValue_" + i, Boolean.parseBoolean(filter.value[0]));
                } else {
                    query.setParameter("keyValue_" + i, Arrays.asList(filter.value));
                }
            } catch (NoSuchFieldException e) {
                continue;
            }
        }
    }

    private void enrichQueryWithPackage(StringBuilder queryBuild) {
        queryBuild.append(" AND d.packageId IN (SELECT pk.id FROM Package pk WHERE pk.isTranslated IS NULL OR pk.isTranslated = false)");
    }

    private Optional<QueryFilter.Filter> enrichQueryWithCollaborators(StringBuilder queryBuild, List<QueryFilter.Filter> queryFilter) {
        Optional<QueryFilter.Filter> roleFilter = queryFilter.stream().filter(f -> f.key.equals("role")).findFirst();
        if (roleFilter.isPresent()) {
            String[] values = roleFilter.get().value;
            queryBuild.append(" AND d.packageId IN (SELECT p.pkg.id FROM PackageCollaborators p WHERE ");
            for (int i = 0; i < values.length; i++) {
                String value = values[i];
                String[] valueAttrs = value.split("::");
                if (valueAttrs.length == 1) {
                    queryBuild.append("(p.collaborator.collaboratorName = :collaboratorName_").append(i).append(")");
                } else if (valueAttrs.length == 2) {
                    queryBuild.append("(p.collaborator.collaboratorName = :collaboratorName_").append(i);
                    queryBuild.append(" AND p.collaborator.role = :collaboratorRole_").append(i).append(")");
                } else if (valueAttrs.length == 3) {
                    queryBuild.append("((p.collaborator.collaboratorName = :collaboratorName_").append(i);
                    queryBuild.append(" AND p.collaborator.role = :collaboratorRole_").append(i);
                    queryBuild.append(" AND p.collaborator.organization = :collaboratorOrganization_").append(i).append(")");
                    queryBuild.append(" OR (p.collaborator.collaboratorName = p.collaborator.organization");
                    queryBuild.append(" AND CONCAT(:collaboratorOrganization_").append(i).append(",'.') LIKE CONCAT(p.collaborator.organization,'.%')))");
                }
                if (i < values.length - 1) {
                    queryBuild.append(" OR ");
                }
            }
            queryBuild.append(")");
        }
        return roleFilter;
    }

    private void setParametersForRoles(Query query, Optional<QueryFilter.Filter> roleFilter) {
        if (roleFilter.isPresent()) {
            String[] values = roleFilter.get().value;
            for (int i = 0; i < values.length; i++) {
                String value = values[i];
                String[] valueAttrs = value.split("::");
                if (valueAttrs.length == 1) {
                    query.setParameter("collaboratorName_" + i, valueAttrs[0]);
                } else if (valueAttrs.length == 2) {
                    query.setParameter("collaboratorName_" + i, valueAttrs[0]);
                    query.setParameter("collaboratorRole_" + i, valueAttrs[1]);
                } else if (valueAttrs.length == 3) {
                    query.setParameter("collaboratorName_" + i, valueAttrs[0]);
                    query.setParameter("collaboratorRole_" + i, valueAttrs[1]);
                    query.setParameter("collaboratorOrganization_" + i, valueAttrs[2]);
                }
            }
        }
    }

    private void enrichOrderBy(QueryFilter queryFilter, Class objectClass, StringBuilder queryBuild) {
        if (queryFilter.getSortOrders().size() > 0) {
            queryBuild.append(" ORDER BY ");
            for (int i = 0; i < queryFilter.getSortOrders().size(); i++) {
                QueryFilter.SortOrder sortOrder = queryFilter.getSortOrders().get(i);
                try {
                    Field field = objectClass.getDeclaredField(QueryFilter.FilterType.getColumnName(sortOrder.key));
                    queryBuild.append(QueryFilter.FilterType.getColumnName(sortOrder.key));
                    queryBuild.append(" ");
                    queryBuild.append(sortOrder.direction);
                    if (i < queryFilter.getSortOrders().size() - 1) {
                        queryBuild.append(" ,");
                    }
                } catch (NoSuchFieldException e) {
                    continue;
                }
            }
        }
    }

    public LeosDocument findTemplateByName(String name) throws RepositoryException {
        LOG.info("Find template by name: name={}", name);
        return this.findTemplateByName(name, true);
    }

    public LeosDocument findTemplateByName(String name, boolean withContent) throws RepositoryException {
        LOG.info("Find template by name: name={}, withContent={}", name, withContent);
        List<LeosDocument> docs = configService.findConfigByName(name, withContent);
        if (docs.isEmpty()) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, "Template " + name + " not found");
        } else {
            return docs.get(0);
        }
    }

    private Map<DocumentContent, DocumentVersion> createDocument(final Document doc, Map<String, ?> metadata, final String labelVersion,
            int versionType, byte[] contentBytes, String comments, String userId) throws RepositoryException {
        DocumentVersion docVersion = updateDocumentVersion(doc, userId, versionType, labelVersion, comments);
        DocumentContent docContent = updateDocumentContent(docVersion, null, userId, new String(contentBytes, StandardCharsets.UTF_8), metadata);
        return Collections.singletonMap(docContent, docVersion);
    }

    private Map<DocumentContent, DocumentVersion> updateDocument(final Document doc, Map<String, ?> metadata, final String labelVersion,
            int versionType, byte[] contentBytes, String comments, String userId) throws RepositoryException {
        Optional<DocumentV> docView = documentVRepository.findLastVersionByDocumentId(doc.getId());

        if (docView.isPresent()) {
            DocumentVersion docVersion = updateDocumentVersion(doc, userId, versionType, labelVersion, comments);
            DocumentContent docContent = updateDocumentContent(docVersion, docView.get(), userId, new String(contentBytes, StandardCharsets.UTF_8), metadata);
            return Collections.singletonMap(docContent, docVersion);
        } else {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentV.class.getName());
        }
    }

    private Map<DocumentContent, DocumentVersion> updateDocumentContentMetadataAndVersionComments(DocumentVersion version,
            Map<String, ?> metadata,
            String userId) throws Exception {
        version = updateDocumentVersionComments(version, userId, metadata);
        DocumentContent content =
                documentContentRepository.findDocumentContentByVersionId(version.getId())
                        .orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentContent.class.getName()));
        content.setLastModifiedBy(userId);
        content.setLastModificationDate(LocalDateTime.now());

        Boolean eeaRelevance = ConversionUtils.convertBoolean(metadata.get(PropertiesMetadata.EEA_RELEVANCE.getLeosName()));
        if (eeaRelevance != null) {
            content.setEeaRelevance(eeaRelevance);
        }
        if (metadata.get(PropertiesMetadata.TEMPLATE.getLeosName()) != null) {
            content.setTemplate((String) metadata.get(PropertiesMetadata.TEMPLATE.getLeosName()));
        }
        if (metadata.get(PropertiesMetadata.DOC_PURPOSE.getLeosName()) != null) {
            content.setDocPurpose((String) metadata.get(PropertiesMetadata.DOC_PURPOSE.getLeosName()));
        }
        if (metadata.get(PropertiesMetadata.DOC_TYPE.getLeosName()) != null) {
            content.setDocType((String) metadata.get(PropertiesMetadata.DOC_TYPE.getLeosName()));
        }
        if (metadata.get(PropertiesMetadata.TITLE.getLeosName()) != null) {
            content.setTitle((String) metadata.get(PropertiesMetadata.TITLE.getLeosName()));
        }
        if (metadata.get(PropertiesMetadata.CATEGORY.getLeosName()) != null) {
            content.setCategoryCode((String) metadata.get(PropertiesMetadata.CATEGORY.getLeosName()));
        }
        content = documentContentRepository.save(content);
        return Collections.singletonMap(content, version);
    }

    private DocumentVersion updateDocumentVersionComments(DocumentVersion version, String updatedBy, Map<String, ?> metadata) {
        version.setAuditLastMBy(updatedBy);
        version.setAuditLastMDate(LocalDateTime.now());
        try {
            String metadataComment = metadata.get(PropertiesMetadata.COMMENTS.getLeosName()).toString();
            String[] metadataComments = metadataComment.split("::");
            if (metadataComments.length == 1) {
                String currentComments = version.getComments();
                if (StringUtils.isEmpty(currentComments)) {
                    version.setComments(metadataComment);
                } else {
                    String[] comments = currentComments.split("::");
                    if (comments.length >= 1) {
                        version.setComments(comments[0] + "::" + metadataComments[0]);
                    }
                }
            } else if (metadataComments.length > 1) {
                version.setComments(metadataComment);
            }
        } catch (Exception e) {
            LOG.debug("No need to updated comments");
        }
        return documentVersionRepository.save(version);
    }

    private String checkMetadataComments(Object metadataComments) throws Exception {
        if (metadataComments instanceof String) {
            return metadataComments.toString();
        } else {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(metadataComments);
        }
    }

    private DocumentVersion updateDocumentVersion(Document doc, String updatedBy, int versionType, String labelVersion,
            String comments) throws RepositoryException {
        DocumentVersion docVersion = new DocumentVersion();
        docVersion.setAuditCBy(doc.getAuditCBy());
        docVersion.setAuditCDate(LocalDateTime.now());
        docVersion.setAuditLastMBy(updatedBy);
        docVersion.setAuditLastMDate(LocalDateTime.now());
        docVersion.setVersionLabel(labelVersion);
        docVersion.setVersionType(String.valueOf(versionType));
        docVersion.setDocumentId(doc.getId());
        docVersion.setComments(comments);
        docVersion.setIsLatestVersion(true);
        docVersion.setIsLatestMajorVersion(versionType != VersionType.MINOR.value() && versionType != VersionType.TECHNICAL.value());
        docVersion.setIsMajorVersion(versionType != VersionType.MINOR.value() && versionType != VersionType.TECHNICAL.value());

        // These values are not used
        docVersion.setIsVersionSeriesCheckedOut(false);
        docVersion.setVersionSeriesId(labelVersion);
        docVersion.setVersionArchived(false);

        return documentVersionRepository.save(docVersion);
    }

    private DocumentContent updateDocumentContent(DocumentVersion docVersion, final DocumentV prevVersion, String userId,
            String contentString, Map<String, ?> metadata) {
        DocumentContent content = new DocumentContent();
        content.setContent(contentString);
        content.setCreatedBy(userId);
        content.setCreationDate(LocalDateTime.now());
        content.setLastModifiedBy(userId);
        content.setLastModificationDate(LocalDateTime.now());

        Boolean eeaRelevance = ConversionUtils.convertBoolean(metadata.get(PropertiesMetadata.EEA_RELEVANCE.getLeosName()));
        if (eeaRelevance != null) {
            content.setEeaRelevance(eeaRelevance);
        } else if (prevVersion != null) {
            content.setEeaRelevance(prevVersion.getEeaRelevance());
        } else {
            content.setEeaRelevance(false);
        }
        if (metadata.get(PropertiesMetadata.TEMPLATE.getLeosName()) != null) {
            content.setTemplate((String) metadata.get(PropertiesMetadata.TEMPLATE.getLeosName()));
        } else if (prevVersion != null) {
            content.setTemplate(prevVersion.getTemplate());
        }
        if (metadata.get(PropertiesMetadata.DOC_PURPOSE.getLeosName()) != null) {
            content.setDocPurpose((String) metadata.get(PropertiesMetadata.DOC_PURPOSE.getLeosName()));
        } else if (prevVersion != null) {
            content.setDocPurpose(prevVersion.getDocPurpose());
        }
        if (metadata.get(PropertiesMetadata.DOC_TYPE.getLeosName()) != null) {
            content.setDocType((String) metadata.get(PropertiesMetadata.DOC_TYPE.getLeosName()));
        } else if (prevVersion != null) {
            content.setDocType(prevVersion.getDocType());
        } else {
            content.setDocType("-");
        }
        content.setVersion(docVersion);
        if (metadata.get(PropertiesMetadata.TITLE.getLeosName()) != null) {
            content.setTitle((String) metadata.get(PropertiesMetadata.TITLE.getLeosName()));
        } else if (prevVersion != null) {
            content.setTitle(prevVersion.getTitle());
        }
        if (metadata.get(PropertiesMetadata.CATEGORY.getLeosName()) != null) {
            content.setCategoryCode((String) metadata.get(PropertiesMetadata.CATEGORY.getLeosName()));
        } else if (prevVersion != null) {
            content.setCategoryCode(prevVersion.getCategoryCode());
        }
        return documentContentRepository.save(content);
    }

    private void checkMetadata(Map<String, ?> metadata)
            throws RepositoryException {
        for (PropertiesMetadata prop : PropertiesMetadata.values()) {
            Object value = metadata.get(prop.getLeosName());
            if (value == null && prop.isMandatory()) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.PARA_NOT_FOUND, prop.name().toLowerCase());
            }
        }
    }

    // ========================================
    // PUBLISH CATALOG METHODS
    // ========================================

    @Override
    @Transactional
    public void publishCustomTemplate(String proposalRef, String legDocumentName, String templateName, List<String> dgs, String userId) throws RepositoryException {
        LOG.info("Publishing custom template: name={}, description={}, categories={}", templateName, legDocumentName, dgs);

        List<Document> legFile = documentRepository.findDocumentsByName(legDocumentName);

        if (legFile.isEmpty()){
            return;
        }

        // Get the package from the document
        Package pkg = legFile.get(0).getPackageId();
        
        // 1. Get custom template entities for this package
        List<String> existingEntities = getCustomTemplateEntitiesByPackage(pkg);
        
        // 2. Update custom template entities with new ones from dgs parameter
        updateCustomTemplateEntities(pkg, dgs, userId);

        // 3. Update milestone status for custom template
        updateCustomTemplateMilestones(pkg, legFile.get(0).getId(), userId);

        // 4. Handle catalog creation based on existing entities
        handleCatalog(existingEntities, dgs, userId, pkg);
    }

    private void updateCustomTemplateMilestones(Package pkg, BigDecimal currentDocumentId, String userId) {
        // Get all documents in the package
        List<Document> allDocuments = documentRepository.findAllDocumentsByPackageId(pkg);
        
        // Find all milestones for documents in the package
        List<DocumentMilestone> allMilestones = documentMilestoneRepository.findDocumentMilestonesByDocumentIn(allDocuments);
        
        // Unpublish previous custom template milestones
        for (DocumentMilestone milestone : allMilestones) {
            if (CustomTemplateMilestoneStatus.PUBLISHED.getValue().equals(milestone.getStatus()) && 
                CUSTOM_TEMPLATE_COMMENT.equals(milestone.getMilestoneComments())) {
                milestone.setStatus(CustomTemplateMilestoneStatus.UNPUBLISHED.getValue());
                milestone.setAuditLastMBy(userId);
                milestone.setAuditLastMDate(LocalDateTime.now());
                documentMilestoneRepository.save(milestone);
            }
        }

        // Update current milestone
        DocumentMilestone currentMilestone = documentMilestoneRepository.findByDocumentId(currentDocumentId);
        currentMilestone.setStatus(CustomTemplateMilestoneStatus.PUBLISHED.getValue());
        currentMilestone.setMilestoneComments(CUSTOM_TEMPLATE_COMMENT);
        currentMilestone.setAuditLastMBy(userId);
        currentMilestone.setAuditLastMDate(LocalDateTime.now());
        documentMilestoneRepository.save(currentMilestone);
    }


    // PRIVATE THINGS TO BE MOVED TO A DIFF FILE
    @Transactional(readOnly = true)
    public String createCatalogWithCategoriesOnly() throws RepositoryException {
        try {
            byte[] catalogContent = getCatalogFromDatabase();

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            org.w3c.dom.Document sourceDoc = builder.parse(new ByteArrayInputStream(catalogContent));

            org.w3c.dom.Document targetDoc = builder.newDocument();

            // Copy the root element with its attributes
            Element sourceRoot = sourceDoc.getDocumentElement();
            Element targetRoot = targetDoc.createElement(sourceRoot.getTagName());

            // Copy root attributes
            NamedNodeMap rootAttributes = sourceRoot.getAttributes();
            for (int i = 0; i < rootAttributes.getLength(); i++) {
                Node attr = rootAttributes.item(i);
                targetRoot.setAttribute(attr.getNodeName(), attr.getNodeValue());
            }

            targetDoc.appendChild(targetRoot);

            copyCategoriesOnly(sourceRoot, targetRoot, targetDoc);

            TransformerFactory transformerFactory = TransformerFactory.newInstance();
            Transformer transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

            StringWriter writer = new StringWriter();
            transformer.transform(new DOMSource(targetDoc), new StreamResult(writer));
            return writer.toString();

        } catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    protected byte[] getCatalogFromDatabase() throws RepositoryException {
        configService.findConfigByName("catalog");
        Optional<ConfigurationV> configurationV = configurationVRepository.findConfigurationByName("catalog");
        return configurationV.get().getContent();
    }

    private void copyCategoriesOnly(Element source, Element target, org.w3c.dom.Document targetDoc) {
        NodeList children = source.getChildNodes();

        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);

            if (child.getNodeType() == Node.ELEMENT_NODE) {
                Element childElement = (Element) child;

                if ("item".equals(childElement.getTagName())) {
                    String type = childElement.getAttribute("type");

                    // Only process CATEGORY items, skip TEMPLATE and DOCUMENT items
                    if ("CATEGORY".equals(type)) {
                        // Create the category item element
                        Element categoryItem = targetDoc.createElement("item");

                        // Copy all attributes
                        NamedNodeMap attributes = childElement.getAttributes();
                        for (int k = 0; k < attributes.getLength(); k++) {
                            Node attr = attributes.item(k);
                            categoryItem.setAttribute(attr.getNodeName(), attr.getNodeValue());
                        }

                        // Add to target
                        target.appendChild(categoryItem);

                        // Copy child elements that are not items (names, descriptions, languages, etc.)
                        NodeList categoryChildren = childElement.getChildNodes();
                        for (int j = 0; j < categoryChildren.getLength(); j++) {
                            Node categoryChild = categoryChildren.item(j);

                            if (categoryChild.getNodeType() == Node.ELEMENT_NODE) {
                                Element categoryChildElement = (Element) categoryChild;
                                if (!"item".equals(categoryChildElement.getTagName())) {
                                    // Import the entire subtree for non-item elements
                                    Node importedChild = targetDoc.importNode(categoryChild, true);
                                    categoryItem.appendChild(importedChild);
                                }
                            } else if (categoryChild.getNodeType() == Node.TEXT_NODE) {
                                // Only copy non-empty text nodes
                                String textContent = categoryChild.getNodeValue();
                                if (textContent != null && !textContent.trim().isEmpty()) {
                                    Node importedText = targetDoc.importNode(categoryChild, false);
                                    categoryItem.appendChild(importedText);
                                }
                            }
                        }

                        // Recursively process nested categories within this category
                        copyCategoriesOnly(childElement, categoryItem, targetDoc);
                    }
                    // Skip TEMPLATE and DOCUMENT items completely
                }
            } else if (child.getNodeType() == Node.TEXT_NODE) {
                // Only copy non-empty text nodes
                String textContent = child.getNodeValue();
                if (textContent != null && !textContent.trim().isEmpty()) {
                    Node importedText = targetDoc.importNode(child, false);
                    target.appendChild(importedText);
                }
            }
        }
    }




    // ========================================
    // CATALOG CREATION AND MANIPULATION METHODS
    // ========================================

    @Transactional(readOnly = true)
    public String insertTemplateIntoCatalog(String existingCatalogXml, String templateKey, String templateName, String packageId) throws RepositoryException {
        try {
            // Get the full catalog from DB to find the template
            byte[] fullCatalogContent = getCatalogFromDatabase();

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();

            // Parse both documents
            org.w3c.dom.Document existingCatalogDoc = builder.parse(new ByteArrayInputStream(existingCatalogXml.getBytes("UTF-8")));
            org.w3c.dom.Document fullCatalogDoc = builder.parse(new ByteArrayInputStream(fullCatalogContent));

            // Find the template in the full catalog
            Element templateElement = findTemplateByKey(fullCatalogDoc, templateKey);
            if (templateElement == null) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING,
                        "Template with key " + templateKey + " not found");
            }

            // Find the parent category path for this template in the full catalog
            String categoryPath = findTemplateCategoryPath(fullCatalogDoc, templateKey);
            if (categoryPath == null) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING,
                        "Parent category for template " + templateKey + " not found");
            }

            // Find or create the corresponding category in the existing catalog
            Element targetCategory = ensureCategoryPath(existingCatalogDoc, fullCatalogDoc, categoryPath);

            // Import and insert the template
            Node importedTemplate = existingCatalogDoc.importNode(templateElement, true);
            
            // Add custom attributes to the imported template and its children
            if (importedTemplate instanceof Element) {
                Element templateEl = (Element) importedTemplate;
                templateEl.setAttribute("custom-name", templateName);
                templateEl.setAttribute("custom-key", templateEl.getAttribute("key") + "/" + packageId);
                
                // Add custom-id to all child items
                NodeList childItems = templateEl.getElementsByTagName("item");
                for (int i = 0; i < childItems.getLength(); i++) {
                    Element childItem = (Element) childItems.item(i);
                    String id = childItem.getAttribute("id");
                    if (StringUtils.isNotBlank(id)) {
                        childItem.setAttribute("custom-id", id + "/" + packageId);
                    }
                }
            }
            
            targetCategory.appendChild(importedTemplate);

            // Convert back to string
            TransformerFactory transformerFactory = TransformerFactory.newInstance();
            Transformer transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

            StringWriter writer = new StringWriter();
            transformer.transform(new DOMSource(existingCatalogDoc), new StreamResult(writer));
            return writer.toString();

        } catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    // Simpler version if you know the target category key
    @Transactional(readOnly = true)
    public String insertTemplateIntoCatalogByCategory(String existingCatalogXml, String templateKey, String targetCategoryKey, String templateName, String packageId) throws RepositoryException {
        try {
            // Get the full catalog from DB to find the template
            byte[] fullCatalogContent = getCatalogFromDatabase();

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();

            // Parse both documents
            org.w3c.dom.Document existingCatalogDoc = builder.parse(new ByteArrayInputStream(existingCatalogXml.getBytes("UTF-8")));
            org.w3c.dom.Document fullCatalogDoc = builder.parse(new ByteArrayInputStream(fullCatalogContent));

            // Find the template in the full catalog
            Element templateElement = findTemplateByKey(fullCatalogDoc, templateKey);
            if (templateElement == null) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING,
                        "Template with key " + templateKey + " not found");
            }

            // Find the target category in the existing catalog
            Element targetCategory = findCategoryByKey(existingCatalogDoc, targetCategoryKey);
            if (targetCategory == null) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING,
                        "Target category with key " + targetCategoryKey + " not found in existing catalog");
            }

            // Import and insert the template
            Node importedTemplate = existingCatalogDoc.importNode(templateElement, true);
            
            // Add custom attributes to the imported template
            if (importedTemplate instanceof Element) {
                Element templateEl = (Element) importedTemplate;
                templateEl.setAttribute("custom-name", templateName);
                templateEl.setAttribute("custom-key", templateEl.getAttribute("key") + "/" + packageId);
            }
            
            targetCategory.appendChild(importedTemplate);

            // Convert back to string
            TransformerFactory transformerFactory = TransformerFactory.newInstance();
            Transformer transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

            StringWriter writer = new StringWriter();
            transformer.transform(new DOMSource(existingCatalogDoc), new StreamResult(writer));
            return writer.toString();

        } catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    private Element findTemplateByKey(org.w3c.dom.Document doc, String templateKey) {
        NodeList items = doc.getElementsByTagName("item");
        for (int i = 0; i < items.getLength(); i++) {
            Element item = (Element) items.item(i);
            if ("TEMPLATE".equals(item.getAttribute("type")) &&
                    templateKey.equals(item.getAttribute("key"))) {
                return item;
            }
        }
        return null;
    }

    private String findTemplateCategoryPath(org.w3c.dom.Document doc, String templateKey) {
        Element templateElement = findTemplateByKey(doc, templateKey);
        if (templateElement == null) {
            return null;
        }

        // Build the path from root to the parent category
        List<String> pathSegments = new ArrayList<>();
        Element current = (Element) templateElement.getParentNode();

        // Traverse up to build the path
        while (current != null && "item".equals(current.getTagName()) && "CATEGORY".equals(current.getAttribute("type"))) {
            String key = current.getAttribute("key");
            if (key != null && !key.isEmpty()) {
                pathSegments.add(key);
            }
            Node parent = current.getParentNode();
            if (parent instanceof Element && "item".equals(((Element) parent).getTagName())) {
                current = (Element) parent;
            } else {
                break;
            }
        }

        // Reverse the path (we built it from bottom up)
        Collections.reverse(pathSegments);

        return String.join("/", pathSegments);
    }

    private Element findCategoryByPath(org.w3c.dom.Document doc, String categoryPath) {
        String[] pathSegments = categoryPath.split("/");
        Element current = doc.getDocumentElement();

        for (String segment : pathSegments) {
            if (segment.isEmpty()) continue;

            Element found = null;
            NodeList children = current.getChildNodes();

            for (int i = 0; i < children.getLength(); i++) {
                Node child = children.item(i);
                if (child.getNodeType() == Node.ELEMENT_NODE) {
                    Element childElement = (Element) child;
                    if ("item".equals(childElement.getTagName()) &&
                            "CATEGORY".equals(childElement.getAttribute("type")) &&
                            segment.equals(childElement.getAttribute("key"))) {
                        found = childElement;
                        break;
                    }
                }
            }

            if (found == null) {
                return null; // Path not found
            }

            current = found;
        }

        return current;
    }

    private Element findCategoryByKey(org.w3c.dom.Document doc, String categoryKey) {
        return findCategoryByKey(doc.getDocumentElement(), categoryKey);
    }

    private Element findCategoryByKey(Element root, String categoryKey) {
        NodeList items = root.getElementsByTagName("item");
        for (int i = 0; i < items.getLength(); i++) {
            Element item = (Element) items.item(i);
            if ("CATEGORY".equals(item.getAttribute("type")) &&
                    categoryKey.equals(item.getAttribute("key"))) {
                return item;
            }
        }
        return null;
    }

    private Element ensureCategoryPath(org.w3c.dom.Document targetDoc, org.w3c.dom.Document sourceDoc, String categoryPath) throws RepositoryException {
        String[] pathSegments = categoryPath.split("/");
        Element current = targetDoc.getDocumentElement();

        for (String segment : pathSegments) {
            if (segment.isEmpty()) continue;

            Element found = findChildCategoryByKey(current, segment);
            if (found == null) {
                // Category doesn't exist, copy it from source
                Element sourceCategory = findCategoryByKey(sourceDoc, segment);
                if (sourceCategory == null) {
                    throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING,
                            "Category with key " + segment + " not found in source catalog");
                }
                
                // Create the category without its children (templates/subcategories)
                Element categoryItem = targetDoc.createElement("item");
                
                // Copy all attributes
                NamedNodeMap attributes = sourceCategory.getAttributes();
                for (int k = 0; k < attributes.getLength(); k++) {
                    Node attr = attributes.item(k);
                    categoryItem.setAttribute(attr.getNodeName(), attr.getNodeValue());
                }
                
                // Copy non-item child elements (names, descriptions, etc.)
                NodeList categoryChildren = sourceCategory.getChildNodes();
                for (int j = 0; j < categoryChildren.getLength(); j++) {
                    Node categoryChild = categoryChildren.item(j);
                    
                    if (categoryChild.getNodeType() == Node.ELEMENT_NODE) {
                        Element categoryChildElement = (Element) categoryChild;
                        if (!"item".equals(categoryChildElement.getTagName())) {
                            Node importedChild = targetDoc.importNode(categoryChild, true);
                            categoryItem.appendChild(importedChild);
                        }
                    } else if (categoryChild.getNodeType() == Node.TEXT_NODE) {
                        Node importedText = targetDoc.importNode(categoryChild, false);
                        categoryItem.appendChild(importedText);
                    }
                }
                
                current.appendChild(categoryItem);
                found = categoryItem;
            }
            
            current = found;
        }

        return current;
    }

    private Element findChildCategoryByKey(Element parent, String categoryKey) {
        NodeList children = parent.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);
            if (child.getNodeType() == Node.ELEMENT_NODE) {
                Element childElement = (Element) child;
                if ("item".equals(childElement.getTagName()) &&
                        "CATEGORY".equals(childElement.getAttribute("type")) &&
                        categoryKey.equals(childElement.getAttribute("key"))) {
                    return childElement;
                }
            }
        }
        return null;
    }

    public List<String> getCustomTemplateEntitiesByPackage(Package pkg) {
        Optional<CustomTemplateEntities> entities = customTemplateEntitiesRepository.findByPackageId(pkg);
        if (entities.isPresent() && entities.get().getEntities() != null) {
            return Arrays.asList(entities.get().getEntities().split(","));
        }
        return Collections.emptyList();
    }

    public void updateCustomTemplateEntities(Package pkg, List<String> newEntities, String userId) {
        Optional<CustomTemplateEntities> existing = customTemplateEntitiesRepository.findByPackageId(pkg);
        CustomTemplateEntities entities;
        
        if (existing.isPresent()) {
            entities = existing.get();
            entities.setAuditLastMBy(userId);
            entities.setAuditLastMDate(LocalDateTime.now());
        } else {
            entities = new CustomTemplateEntities();
            entities.setPackageId(pkg);
            entities.setAuditCBy(userId);
            entities.setAuditCDate(LocalDateTime.now());
        }
        
        entities.setEntities(String.join(",", newEntities));
        customTemplateEntitiesRepository.save(entities);
    }

    private void ensureEntityCatalogExists(String entityName, String userId, Package pkg) throws RepositoryException {
        String catalogName = "catalog-" + entityName;
        
        if (!customTemplateConfigRepository.findConfigByName(catalogName).isPresent()) {
            createEntityCatalog(catalogName, entityName, userId, pkg);
        }
    }

    private void createEntityCatalog(String catalogName, String entityName, String userId, Package pkg) throws RepositoryException {
        try {
            String baseCatalog = createCatalogWithCategoriesOnly();
            
            // Find the TEMPLATE_CATALOG category
            CustomTemplateConfigCategory templateCatalogCategory = customTemplateConfigCategoryRepository
                .findConfigCategoriesByCategoryCode("CONFIG")
                .orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, 
                    "TEMPLATE_CATALOG category not found"));
            
            // Step 1: Create config entry
            CustomTemplateConfig config = new CustomTemplateConfig();
            config.setName(catalogName);
            config.setAuditCBy(userId);
            config.setAuditCDate(LocalDateTime.now());
            config.setAuditLastMBy(userId);
            config.setAuditLastMDate(LocalDateTime.now());
            config.setLanguage("en");
            config.setConfigCategory(templateCatalogCategory);
            config = customTemplateConfigRepository.save(config);
            
            // Step 2: Create version entry
            CustomTemplateConfigVersion version = new CustomTemplateConfigVersion();
            version.setConfigId(config.getId());
            version.setVersionLabel("1.0.0");
            version.setVersionSeriesId(config.getId().toString());
            version.setVersionType("MAJOR");
            version.setIsLatestMajorVersion(true);
            version.setIsLatestVersion(true);
            version.setIsMajorVersion(true);
            version.setIsVersionSeriesCheckedOut(false);
            version.setAuditCBy(userId);
            version.setAuditCDate(LocalDateTime.now());
            version.setImmutable(false);
            version = customTemplateConfigVersionRepository.save(version);
            
            // Step 3: Create content entry
            CustomTemplateConfigContent content = new CustomTemplateConfigContent();
            content.setContentString(baseCatalog);
            content.setContentStreamMimeType("application/xml");
            content.setContentStreamFilename(catalogName + ".xml");
            content.setContentStreamId(config.getId().toString());
            content.setContentStreamLength(String.valueOf(baseCatalog.length()));
            content.setAuditCBy(userId);
            content.setAuditCDate(LocalDateTime.now());
            content.setVersionId(version);
            customTemplateConfigContentRepository.save(content);
            
            // Save catalog config file for this entity
            Optional<ConfigurationV> catalogConfigFile = configurationVRepository.findConfigurationByName("catalog-CONF");
            if (catalogConfigFile.isPresent()) {
                CustomTemplateConfigCategory configCategory = customTemplateConfigCategoryRepository
                    .findConfigCategoriesByCategoryCode("CONFIG")
                    .orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, "CONFIG category not found"));
                
                String customKey = "catalog-" + entityName + "-CONF/" + pkg.getId().toString();
                saveConfigAsCustomTemplate(catalogConfigFile.get(), customKey, configCategory, userId);
            }
            
            LOG.info("Successfully created entity catalog: {}", catalogName);
            
        } catch (Exception e) {
            LOG.error("Error creating entity catalog: {}", catalogName, e);
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    private String getTemplateNameFromProposal(Package pkg) {
        List<DocumentV> proposalDocs = documentVRepository.findAllVersionsByPackageIdAndCategoryCode(pkg.getId(), "PROPOSAL");
        if (!proposalDocs.isEmpty()) {
            return proposalDocs.get(0).getTemplate();
        }
        return null;
    }

    @Transactional
    public String removeTemplateFromCatalog(String catalogXml, String customKey) throws RepositoryException {
        if (StringUtils.isBlank(catalogXml)) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.PARA_NOT_FOUND, "catalogXml cannot be null or empty");
        }
        if (StringUtils.isBlank(customKey)) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.PARA_NOT_FOUND, "customKey cannot be null or empty");
        }
        
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            org.w3c.dom.Document catalogDoc = builder.parse(new ByteArrayInputStream(catalogXml.getBytes(StandardCharsets.UTF_8)));

            if (customKey.startsWith("*/")) {
                // Remove all templates with matching packageId
                String packageId = customKey.substring(2);
                removeTemplatesByPackageId(catalogDoc.getDocumentElement(), packageId);
            } else {
                // Remove specific template by custom-key
                Element templateToRemove = findTemplateByCustomKey(catalogDoc.getDocumentElement(), customKey);
                if (templateToRemove != null) {
                    templateToRemove.getParentNode().removeChild(templateToRemove);
                }
            }

            return documentToString(catalogDoc);
        } catch (Exception e) {
            LOG.error("Error removing template from catalog", e);
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    private Element findTemplateByCustomKey(Element root, String customKey) {
        NodeList items = root.getElementsByTagName("item");
        for (int i = 0; i < items.getLength(); i++) {
            Element item = (Element) items.item(i);
            if ("TEMPLATE".equals(item.getAttribute("type")) &&
                    customKey.equals(item.getAttribute("custom-key"))) {
                return item;
            }
        }
        return null;
    }

    private void removeTemplatesByPackageId(Element root, String packageId) {
        NodeList items = root.getElementsByTagName("item");
        List<Element> toRemove = new ArrayList<>();
        
        for (int i = 0; i < items.getLength(); i++) {
            Element item = (Element) items.item(i);
            if ("TEMPLATE".equals(item.getAttribute("type"))) {
                String customKey = item.getAttribute("custom-key");
                if (customKey != null && customKey.endsWith("/" + packageId)) {
                    toRemove.add(item);
                }
            }
        }
        
        for (Element item : toRemove) {
            item.getParentNode().removeChild(item);
        }
    }

    private String documentToString(org.w3c.dom.Document doc) throws Exception {
        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        transformer.setOutputProperty(OutputKeys.INDENT, "yes");
        transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

        StringWriter writer = new StringWriter();
        transformer.transform(new DOMSource(doc), new StreamResult(writer));
        return writer.toString();
    }

    private List<DocumentV> getLatestDocumentsByPackageId(BigDecimal packageId) {
        return documentVRepository.findDocumentsByPackageId(packageId);
    }

    
    private void saveCustomTemplateFileWithContent(String templateKey, byte[] content, String userId) throws RepositoryException {
        try {
            CustomTemplateConfigCategory templateCategory = customTemplateConfigCategoryRepository
                .findConfigCategoriesByCategoryCode("TEMPLATE")
                .orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, "TEMPLATE category not found"));
            
            CustomTemplateConfig config = new CustomTemplateConfig();
            config.setName(templateKey);
            config.setAuditCBy(userId);
            config.setAuditCDate(LocalDateTime.now());
            config.setAuditLastMBy(userId);
            config.setAuditLastMDate(LocalDateTime.now());
            config.setLanguage("en");
            config.setConfigCategory(templateCategory);
            config = customTemplateConfigRepository.save(config);
            
            CustomTemplateConfigVersion version = new CustomTemplateConfigVersion();
            version.setConfigId(config.getId());
            version.setVersionLabel("1.0.0");
            version.setVersionSeriesId(config.getId().toString());
            version.setVersionType("MAJOR");
            version.setIsLatestMajorVersion(true);
            version.setIsLatestVersion(true);
            version.setIsMajorVersion(true);
            version.setIsVersionSeriesCheckedOut(false);
            version.setAuditCBy(userId);
            version.setAuditCDate(LocalDateTime.now());
            version.setImmutable(false);
            version = customTemplateConfigVersionRepository.save(version);
            
            CustomTemplateConfigContent configContent = new CustomTemplateConfigContent();
            configContent.setContent(content);
            configContent.setContentStreamMimeType("application/xml");
            configContent.setContentStreamFilename(templateKey + ".xml");
            configContent.setContentStreamId(config.getId().toString());
            configContent.setContentStreamLength(String.valueOf(content.length));
            configContent.setAuditCBy(userId);
            configContent.setAuditCDate(LocalDateTime.now());
            configContent.setVersionId(version);
            customTemplateConfigContentRepository.save(configContent);
            
        } catch (Exception e) {
            LOG.error("Error saving custom template file: {}", templateKey, e);
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    private String insertTemplateIntoCatalogAndExtractKeys(String existingCatalogXml, String templateKey, String templateName, String packageId, Set<String> extractedKeys) throws RepositoryException {
        try {
            byte[] fullCatalogContent = getCatalogFromDatabase();
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            org.w3c.dom.Document fullCatalogDoc = builder.parse(new ByteArrayInputStream(fullCatalogContent));
            
            Element templateElement = findTemplateByKey(fullCatalogDoc, templateKey);
            if (templateElement != null) {
                // Add direct child items
                NodeList childItems = templateElement.getElementsByTagName("item");
                for (int i = 0; i < childItems.getLength(); i++) {
                    Node node = childItems.item(i);
                    if (node != null && node.getNodeType() == Node.ELEMENT_NODE) {
                        Element item = (Element) node;
                        String type = item.getAttribute("type");
                        String id = item.getAttribute("id");
                        if (("TEMPLATE".equals(type) || "DOCUMENT".equals(type)) && StringUtils.isNotBlank(id)) {
                            extractedKeys.add(id);
                        }
                    }
                }
            }
            
            return insertTemplateIntoCatalog(existingCatalogXml, templateKey, templateName, packageId);
        } catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }
    
    private List<ConfigurationV> getCategoryCodesFromTemplateKeys(Set<String> templateKeys) {
        List<ConfigurationV> configs = new ArrayList<>();
        for (String key : templateKeys) {
            Optional<ConfigurationV> config = configurationVRepository.findConfigurationByName(key);
            if (config.isPresent()) {
                configs.add(config.get());
            }
        }
        return configs;
    }
    
    private List<ConfigCategory> getConfigCategoriesByCodes(List<ConfigurationV> configV) {
        List<String> categoryCodes = configV.stream()
                .map(ConfigurationV::getCategoryCode)
                .collect(Collectors.toList());

        return configCategoryRepository.findConfigCategoriesByCategoryCodeIn(categoryCodes);
    }
    
    private void updateCustomTemplateConfigWithNewVersion(CustomTemplateConfig config, String newContent, String userId) throws RepositoryException {
        try {
            // Get current version
            CustomTemplateConfigVersion currentVersion = customTemplateConfigVersionRepository.findLastConfigVersionByConfigId(config.getId());
            
            // Mark current version as not latest
            currentVersion.setIsLatestVersion(false);
            customTemplateConfigVersionRepository.save(currentVersion);
            
            // Create new version
            CustomTemplateConfigVersion newVersion = new CustomTemplateConfigVersion();
            newVersion.setConfigId(config.getId());
            newVersion.setVersionLabel(getNextVersionLabel(VersionType.MINOR, currentVersion.getVersionLabel()));
            newVersion.setVersionSeriesId(config.getId().toString());
            newVersion.setVersionType("MINOR");
            newVersion.setIsLatestMajorVersion(false);
            newVersion.setIsLatestVersion(true);
            newVersion.setIsMajorVersion(false);
            newVersion.setIsVersionSeriesCheckedOut(false);
            newVersion.setAuditCBy(userId);
            newVersion.setAuditCDate(LocalDateTime.now());
            newVersion.setImmutable(false);
            newVersion = customTemplateConfigVersionRepository.save(newVersion);
            
            // Create new content
            CustomTemplateConfigContent newContentEntity = new CustomTemplateConfigContent();
            newContentEntity.setContentString(newContent);
            newContentEntity.setContentStreamMimeType("application/xml");
            newContentEntity.setContentStreamFilename(config.getName() + ".xml");
            newContentEntity.setContentStreamId(config.getId().toString());
            newContentEntity.setContentStreamLength(String.valueOf(newContent.length()));
            newContentEntity.setAuditCBy(userId);
            newContentEntity.setAuditCDate(LocalDateTime.now());
            newContentEntity.setVersionId(newVersion);
            customTemplateConfigContentRepository.save(newContentEntity);
            
        } catch (Exception e) {
            LOG.error("Error updating custom template config with new version", e);
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }
    
    private void saveDocumentsAsCustomTemplates(List<DocumentV> documents, List<ConfigurationV> configVList, List<ConfigCategory> configCategories, String packageId, String userId) throws RepositoryException {
        for (ConfigurationV configV : configVList) {
            Optional<ConfigCategory> matchingCategory = findMatchingConfigCategory(configV, configCategories);
            if (matchingCategory.isPresent()) {
                Optional<DocumentV> matchingDoc = documents.stream()
                    .filter(doc -> doc.getConfigCategoryId() != null && doc.getConfigCategoryId().equals(matchingCategory.get().getId()))
                    .findFirst();
                
                if (matchingDoc.isPresent()) {
                    String customKey = configV.getName() + "/" + packageId;
                    saveDocumentAsCustomTemplate(matchingDoc.get(), customKey, matchingCategory.get(), userId);
                }
            }
        }
    }
    
    private Optional<ConfigCategory> findMatchingConfigCategory(ConfigurationV configV, List<ConfigCategory> configCategories) {
        return configCategories.stream()
            .filter(category -> configV.getCategoryCode().equals(category.getCategoryCode()))
            .findFirst();
    }
    
    private void saveDocumentAsCustomTemplate(DocumentV document, String customKey, ConfigCategory configCategory, String userId) throws RepositoryException {
        try {
            Optional<DocumentContent> docContent = documentContentRepository.findDocumentContentByVersionId(document.getVersionId());
            if (!docContent.isPresent()) {
                return;
            }
            
            CustomTemplateConfigCategory templateCategory = customTemplateConfigCategoryRepository
                .findConfigCategoriesByCategoryCode(configCategory.getCategoryCode())
                .orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, "Config category not found: " + configCategory.getCategoryCode()));
            
            // Check if config already exists
            Optional<CustomTemplateConfig> existingConfig = customTemplateConfigRepository.findConfigByName(customKey);
            CustomTemplateConfig config;
            
            if (existingConfig.isPresent()) {
                config = existingConfig.get();
                // Mark previous version as not latest
                CustomTemplateConfigVersion currentVersion = customTemplateConfigVersionRepository.findLastConfigVersionByConfigId(config.getId());
                if (currentVersion != null) {
                    currentVersion.setIsLatestVersion(false);
                    customTemplateConfigVersionRepository.save(currentVersion);
                }
            } else {
                config = new CustomTemplateConfig();
                config.setName(customKey);
                config.setAuditCBy(userId);
                config.setAuditCDate(LocalDateTime.now());
                config.setAuditLastMBy(userId);
                config.setAuditLastMDate(LocalDateTime.now());
                config.setLanguage("en");
                config.setConfigCategory(templateCategory);
                config = customTemplateConfigRepository.save(config);
            }
            
            CustomTemplateConfigVersion version = new CustomTemplateConfigVersion();
            version.setConfigId(config.getId());
            version.setVersionLabel(existingConfig.isPresent() ? getNextVersionLabel(VersionType.MINOR, "1.0.0") : "1.0.0");
            version.setVersionSeriesId(config.getId().toString());
            version.setVersionType(existingConfig.isPresent() ? "MINOR" : "MAJOR");
            version.setIsLatestMajorVersion(!existingConfig.isPresent());
            version.setIsLatestVersion(true);
            version.setIsMajorVersion(!existingConfig.isPresent());
            version.setIsVersionSeriesCheckedOut(false);
            version.setAuditCBy(userId);
            version.setAuditCDate(LocalDateTime.now());
            version.setImmutable(false);
            version = customTemplateConfigVersionRepository.save(version);

            String cleanedContent = clearXmlIdAttributes(docContent.get().getContent());
            
            CustomTemplateConfigContent content = new CustomTemplateConfigContent();
            content.setContentString(cleanedContent);
            content.setContentStreamMimeType("application/xml");
            content.setContentStreamFilename(customKey + ".xml");
            content.setContentStreamId(config.getId().toString());
            content.setContentStreamLength(String.valueOf(cleanedContent.length()));
            content.setAuditCBy(userId);
            content.setAuditCDate(LocalDateTime.now());
            content.setVersionId(version);
            customTemplateConfigContentRepository.save(content);
            
        } catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    private String clearXmlIdAttributes(String xmlString) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        DocumentBuilder builder = factory.newDocumentBuilder();
        org.w3c.dom.Document doc = builder.parse(new ByteArrayInputStream(xmlString.getBytes(StandardCharsets.UTF_8)));

        clearXmlIdAttributes(doc.getDocumentElement());

        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
        StringWriter writer = new StringWriter();
        transformer.transform(new DOMSource(doc), new StreamResult(writer));

        return writer.toString();
    }

    private void clearXmlIdAttributes(Node node) {
        if (node.getNodeType() == Node.ELEMENT_NODE) {
            Element element = (Element) node;
            element.removeAttribute("xml:id");
        }

        NodeList children = node.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            clearXmlIdAttributes(children.item(i));
        }
    }

    private void extractTemplateKeysFromCatalog(String catalogXml, String packageId, Set<String> templateKeys) throws RepositoryException {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            org.w3c.dom.Document catalogDoc = builder.parse(new ByteArrayInputStream(catalogXml.getBytes(StandardCharsets.UTF_8)));
            
            NodeList items = catalogDoc.getElementsByTagName("item");
            for (int i = 0; i < items.getLength(); i++) {
                Element item = (Element) items.item(i);
                if ("TEMPLATE".equals(item.getAttribute("type"))) {
                    String customKey = item.getAttribute("custom-key");
                    if (customKey != null && customKey.endsWith("/" + packageId)) {
                        NodeList childItems = item.getElementsByTagName("item");
                        for (int j = 0; j < childItems.getLength(); j++) {
                            Element childItem = (Element) childItems.item(j);
                            String id = childItem.getAttribute("id");
                            if (StringUtils.isNotBlank(id)) {
                                templateKeys.add(id);
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    private void markPreviousCustomTemplateVersionsAsNotLatest(String packageId) {
        // Find all custom template configs with names ending with packageId
        List<CustomTemplateConfig> configs = customTemplateConfigRepository.findAll().stream()
            .filter(config -> config.getName().endsWith("/" + packageId))
            .collect(Collectors.toList());
        
        for (CustomTemplateConfig config : configs) {
            CustomTemplateConfigVersion currentVersion = customTemplateConfigVersionRepository.findLastConfigVersionByConfigId(config.getId());
            if (currentVersion != null && currentVersion.getIsLatestVersion()) {
                currentVersion.setIsLatestVersion(false);
                customTemplateConfigVersionRepository.save(currentVersion);
            }
        }
    }

    private void saveConfigFilesAsCustomTemplates(Set<String> templateKeys, String packageId, String userId) throws RepositoryException {
        try {
            CustomTemplateConfigCategory configCategory = customTemplateConfigCategoryRepository
                .findConfigCategoriesByCategoryCode("CONFIG")
                .orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, "CONFIG category not found"));
            
            for (String templateKey : templateKeys) {
                String configName = templateKey + "-CONF";
                Optional<ConfigurationV> configFile = configurationVRepository.findConfigurationByName(configName);
                
                if (configFile.isPresent()) {
                    String customKey = configName + "/" + packageId;
                    saveConfigAsCustomTemplate(configFile.get(), customKey, configCategory, userId);
                }
            }
        } catch (Exception e) {
            LOG.error("Error saving config files as custom templates", e);
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    private void saveConfigAsCustomTemplate(ConfigurationV configFile, String customKey, CustomTemplateConfigCategory templateCategory, String userId) throws RepositoryException {
        try {
            // Check if config already exists
            Optional<CustomTemplateConfig> existingConfig = customTemplateConfigRepository.findConfigByName(customKey);
            CustomTemplateConfig config;
            
            if (existingConfig.isPresent()) {
                config = existingConfig.get();
                // Mark previous version as not latest
                CustomTemplateConfigVersion currentVersion = customTemplateConfigVersionRepository.findLastConfigVersionByConfigId(config.getId());
                if (currentVersion != null) {
                    currentVersion.setIsLatestVersion(false);
                    customTemplateConfigVersionRepository.save(currentVersion);
                }
            } else {
                config = new CustomTemplateConfig();
                config.setName(customKey);
                config.setAuditCBy(userId);
                config.setAuditCDate(LocalDateTime.now());
                config.setAuditLastMBy(userId);
                config.setAuditLastMDate(LocalDateTime.now());
                config.setLanguage("en");
                config.setConfigCategory(templateCategory);
                config = customTemplateConfigRepository.save(config);
            }
            
            CustomTemplateConfigVersion version = new CustomTemplateConfigVersion();
            version.setConfigId(config.getId());
            version.setVersionLabel(existingConfig.isPresent() ? getNextVersionLabel(VersionType.MINOR, "1.0.0") : "1.0.0");
            version.setVersionSeriesId(config.getId().toString());
            version.setVersionType(existingConfig.isPresent() ? "MINOR" : "MAJOR");
            version.setIsLatestMajorVersion(!existingConfig.isPresent());
            version.setIsLatestVersion(true);
            version.setIsMajorVersion(!existingConfig.isPresent());
            version.setIsVersionSeriesCheckedOut(false);
            version.setAuditCBy(userId);
            version.setAuditCDate(LocalDateTime.now());
            version.setImmutable(false);
            version = customTemplateConfigVersionRepository.save(version);
            
            CustomTemplateConfigContent content = new CustomTemplateConfigContent();
            content.setContent(configFile.getContent());
            content.setContentStreamMimeType("application/json");
            content.setContentStreamFilename(customKey + ".json");
            content.setContentStreamId(config.getId().toString());
            content.setContentStreamLength(String.valueOf(configFile.getContent().length));
            content.setAuditCBy(userId);
            content.setAuditCDate(LocalDateTime.now());
            content.setVersionId(version);
            customTemplateConfigContentRepository.save(content);
            
        } catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    private void removeTemplateFromEntityCatalog(String entityName, String packageId, String userId) throws RepositoryException {
        String catalogName = "catalog-" + entityName;
        Optional<CustomTemplateConfig> config = customTemplateConfigRepository.findConfigByName(catalogName);
        
        if (config.isPresent()) {
            CustomTemplateConfigVersion version = customTemplateConfigVersionRepository.findLastConfigVersionByConfigId(config.get().getId());
            CustomTemplateConfigContent content = customTemplateConfigContentRepository.findConfigContentByVersionId(version);
            
            String customKey = "*/" + packageId; // Match any template with this packageId
            String updatedCatalog = removeTemplateFromCatalog(content.getContentString(), customKey);
            updateCustomTemplateConfigWithNewVersion(config.get(), updatedCatalog, userId);
        }
    }

    private void addTemplateToEntityCatalog(String entityName, String templateName, String packageId, String userId) throws RepositoryException {
        String catalogName = "catalog-" + entityName;
        Optional<CustomTemplateConfig> config = customTemplateConfigRepository.findConfigByName(catalogName);
        
        if (config.isPresent()) {
            CustomTemplateConfigVersion version = customTemplateConfigVersionRepository.findLastConfigVersionByConfigId(config.get().getId());
            CustomTemplateConfigContent content = customTemplateConfigContentRepository.findConfigContentByVersionId(version);
            
            String updatedCatalog = insertTemplateIntoCatalog(content.getContentString(), templateName, templateName, packageId);
            updateCustomTemplateConfigWithNewVersion(config.get(), updatedCatalog, userId);
        }
    }

    private void replaceTemplateInEntityCatalog(String entityName, String templateName, String packageId, String userId) throws RepositoryException {
        String catalogName = "catalog-" + entityName;
        Optional<CustomTemplateConfig> config = customTemplateConfigRepository.findConfigByName(catalogName);
        
        if (config.isPresent()) {
            CustomTemplateConfigVersion version = customTemplateConfigVersionRepository.findLastConfigVersionByConfigId(config.get().getId());
            CustomTemplateConfigContent content = customTemplateConfigContentRepository.findConfigContentByVersionId(version);
            
            // Remove existing templates for this package
            String customKey = "*/" + packageId;
            String catalogWithoutOldTemplate = removeTemplateFromCatalog(content.getContentString(), customKey);
            
            // Add the new template
            String updatedCatalog = insertTemplateIntoCatalog(catalogWithoutOldTemplate, templateName, templateName, packageId);
            updateCustomTemplateConfigWithNewVersion(config.get(), updatedCatalog, userId);
        }
    }



    private void handleCatalog(List<String> existingEntities, List<String> newEntities, String userId, Package pkg) throws RepositoryException {
        List<DocumentV> latestDocuments = getLatestDocumentsByPackageId(pkg.getId());
        
        if (existingEntities.isEmpty()) {
            // No existing entities - create catalogs for each new entity if needed
            for (String entity : newEntities) {
                ensureEntityCatalogExists(entity, userId, pkg);
            }
            
            // Get template name from PROPOSAL document and add to each catalog
            String templateName = getTemplateNameFromProposal(pkg);
            if (templateName != null) {
                Set<String> insertedTemplateKeys = new HashSet<>();

                for (String entity : newEntities) {
                    String catalogName = "catalog-" + entity;
                    Optional<CustomTemplateConfig> config = customTemplateConfigRepository.findConfigByName(catalogName);
                    if (config.isPresent()) {
                        CustomTemplateConfigVersion version = customTemplateConfigVersionRepository.findLastConfigVersionByConfigId(config.get().getId());
                        CustomTemplateConfigContent content = customTemplateConfigContentRepository.findConfigContentByVersionId(version);
                        String updatedCatalog = insertTemplateIntoCatalogAndExtractKeys(content.getContentString(), templateName, templateName, pkg.getId().toString(), insertedTemplateKeys);
                        updateCustomTemplateConfigWithNewVersion(config.get(), updatedCatalog, userId);
                    }
                }

                // Get category codes for the inserted template keys
                List<ConfigurationV> configurationVList = getCategoryCodesFromTemplateKeys(insertedTemplateKeys);
                // Get config categories by their codes
                List<ConfigCategory> configCategories = getConfigCategoriesByCodes(configurationVList);
                // Save document files matching the extracted template keys
                saveDocumentsAsCustomTemplates(latestDocuments, configurationVList, configCategories, pkg.getId().toString(), userId);
                // Save config files for each template
                saveConfigFilesAsCustomTemplates(insertedTemplateKeys, pkg.getId().toString(), userId);
            }
        } else {
            // Existing entities - handle scenarios
            
            // Scenario 1: Identify removed entities and delete templates from their catalogs
            List<String> removedEntities = existingEntities.stream()
                .filter(entity -> !newEntities.contains(entity))
                .collect(Collectors.toList());
            
            for (String removedEntity : removedEntities) {
                removeTemplateFromEntityCatalog(removedEntity, pkg.getId().toString(), userId);
            }
            
            // Scenario 2: Identify new entities and add templates to their catalogs
            List<String> newlyAddedEntities = newEntities.stream()
                .filter(entity -> !existingEntities.contains(entity))
                .collect(Collectors.toList());
            
            String templateName = getTemplateNameFromProposal(pkg);
            if (templateName != null) {
                for (String newEntity : newlyAddedEntities) {
                    ensureEntityCatalogExists(newEntity, userId, pkg);
                    addTemplateToEntityCatalog(newEntity, templateName, pkg.getId().toString(), userId);
                }
            }
            
            // Scenario 3: Identify common entities and replace templates in their catalogs
            List<String> commonEntities = existingEntities.stream()
                .filter(newEntities::contains)
                .collect(Collectors.toList());
            
            if (templateName != null) {
                for (String commonEntity : commonEntities) {
                    replaceTemplateInEntityCatalog(commonEntity, templateName, pkg.getId().toString(), userId);
                }
            }
            
            // Final step: Save documents as custom templates after all catalog operations
            if (templateName != null) {
                Set<String> allTemplateKeys = new HashSet<>();
                
                // Extract template keys from all updated catalogs
                for (String entity : newEntities) {
                    String catalogName = "catalog-" + entity;
                    Optional<CustomTemplateConfig> config = customTemplateConfigRepository.findConfigByName(catalogName);
                    if (config.isPresent()) {
                        CustomTemplateConfigVersion version = customTemplateConfigVersionRepository.findLastConfigVersionByConfigId(config.get().getId());
                        CustomTemplateConfigContent content = customTemplateConfigContentRepository.findConfigContentByVersionId(version);
                        extractTemplateKeysFromCatalog(content.getContentString(), pkg.getId().toString(), allTemplateKeys);
                    }
                }
                
                if (!allTemplateKeys.isEmpty()) {
                    // Mark previous custom template versions as not latest
                    markPreviousCustomTemplateVersionsAsNotLatest(pkg.getId().toString());
                    
                    // Save new custom templates
                    List<ConfigurationV> configurationVList = getCategoryCodesFromTemplateKeys(allTemplateKeys);
                    List<ConfigCategory> configCategories = getConfigCategoriesByCodes(configurationVList);
                    saveDocumentsAsCustomTemplates(latestDocuments, configurationVList, configCategories, pkg.getId().toString(), userId);
                    
                    // Save config files for each template key
                    saveConfigFilesAsCustomTemplates(allTemplateKeys, pkg.getId().toString(), userId);
                    

                }
            }
        }
    }

}
