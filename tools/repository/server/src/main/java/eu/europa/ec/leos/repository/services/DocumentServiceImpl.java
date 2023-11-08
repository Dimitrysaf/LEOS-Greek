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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.leos.repository.common.VersionType;
import eu.europa.ec.leos.repository.controllers.requests.QueryFilter;
import eu.europa.ec.leos.repository.entities.Document;
import eu.europa.ec.leos.repository.entities.DocumentCategories;
import eu.europa.ec.leos.repository.entities.DocumentContent;
import eu.europa.ec.leos.repository.entities.DocumentProperties;
import eu.europa.ec.leos.repository.entities.DocumentPropertyValues;
import eu.europa.ec.leos.repository.entities.DocumentV;
import eu.europa.ec.leos.repository.entities.DocumentVersion;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.Collaborator;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.repositories.DocumentCategoriesRepository;
import eu.europa.ec.leos.repository.repositories.DocumentContentRepository;
import eu.europa.ec.leos.repository.repositories.DocumentPropertiesRepository;
import eu.europa.ec.leos.repository.repositories.DocumentPropertyValuesRepository;
import eu.europa.ec.leos.repository.repositories.DocumentRepository;
import eu.europa.ec.leos.repository.repositories.DocumentVRepository;
import eu.europa.ec.leos.repository.repositories.DocumentVersionRepository;
import eu.europa.ec.leos.repository.repositories.PackageRepository;
import eu.europa.ec.leos.repository.utils.ConversionUtils;
import eu.europa.ec.leos.repository.utils.PropertiesMetadata;
import javafx.util.Pair;
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

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.StringJoiner;

@Service
public class DocumentServiceImpl implements DocumentService {
    private static final Logger LOG = LoggerFactory.getLogger(DocumentServiceImpl.class);
    private static final int MAX_RESULT_DEFAULT = 100;
    private static final String XML_DOC_EXT = ".xml";

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

    private static final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    public DocumentServiceImpl(DocumentRepository documentRepository, DocumentVRepository documentVRepository,
                               DocumentVersionRepository documentVersionRepository, DocumentContentRepository documentContentRepository,
                               DocumentCategoriesRepository documentCategoriesRepository,
                               DocumentPropertiesRepository documentPropertiesRepository,
                               DocumentPropertyValuesRepository documentPropertyValuesRepository,
                               PackageRepository packageRepository, PackageService packageService,
                               CollaboratorsService collaboratorsService,
                               MilestoneDocumentService milestoneDocumentService,
                               ConfigService configService, EntityManager entityManager) {
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
                    ConversionUtils.convertToLocalDateTime(ConversionUtils.getDateFromString((String) metadata.get(PropertiesMetadata.CREATION_DATE.getLeosName())
                            , ConversionUtils.LEOS_REPO_DATE_FORMAT)) : LocalDateTime.now();

            // FIRST STEP: get package
            Package pkg = packageRepository.findPackageByName(packageName).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Package.class.getName()));
            DocumentCategories docCat
                    =
                    documentCategoriesRepository.findDocumentCategoriesByCategoryCode((String) metadata.get(PropertiesMetadata.CATEGORY.getLeosName())).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentCategories.class.getName()));

            Document doc = new Document();
            doc.setName(name);
            doc.setAuditCBy(createdBy);
            doc.setAuditCDate(creationDate);
            doc.setAuditLastMBy(userName);
            doc.setAuditLastMDate(LocalDateTime.now());
            doc.setPackageId(pkg);
            doc.setDocStage(metadata.get(PropertiesMetadata.DOC_STAGE.getLeosName()) == null ? "-" :
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
                        ConversionUtils.getLeosCollaboratorsFromLinkedHashMap((ArrayList<LinkedHashMap<String, Object>>) metadata.get(PropertiesMetadata.COLLABORATORS.getLeosName()));
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
            doc = documentRepository.save(doc);

            Tika tika = new Tika();
            String type = tika.detect(TikaInputStream.get(contentBytes));
            if (type.contains("zip")) {
                return milestoneDocumentService.createMilestoneFromContent(doc, metadata, contentBytes, userName);
            } else {
                Pair<DocumentContent, DocumentVersion> docs = createDocument(doc, metadata, labelVersion, versionType, contentBytes, comments, userName);
                updateDocumentProperties(doc, docs.getValue(), (Map<String, Object>) metadata, userName);
                return ConversionUtils.buildXmlDocument(doc, docs.getValue(), docs.getKey(), collaboratorsService, documentPropertyValuesRepository);
            }
        } catch (RepositoryException e) {
            throw e;
        } catch (Exception e) {
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
                Document legDoc = documentRepository.findDocumentByRef(leosDoc.get().getRef()).orElseThrow(() ->
                        new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Document.class.getName()));
                return milestoneDocumentService.updateMilestone(legDoc, contentBytes, metadata, userId);

            default:
                boolean isMajor = !versionType.equals(VersionType.MINOR);
                Optional<DocumentV> docView = documentVRepository.findVersionByVersionId(versionId);
                Document doc = documentRepository.findDocumentByRef(docView.get().getRef()).orElseThrow(() ->
                        new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Document.class.getName()));

                Optional<DocumentVersion> latestVersion = documentVersionRepository.findLastVersionByDocumentId(doc.getId());
                String labelVersion = getNextVersionLabel(versionType, latestVersion.get().getVersionLabel());
                Optional<DocumentVersion> latestMajorVersion = Optional.empty();
                if (isMajor) {
                    latestMajorVersion = documentVersionRepository.findLastMajorVersionByDocumentId(doc.getId());
                }

                Pair<DocumentContent, DocumentVersion> docs = updateDocument(doc, metadata, labelVersion, versionType.value(), contentBytes, comments, userId);
                doc = updateDocumentMetadata(doc, docs.getValue(), (Map<String, Object>) metadata, userId);

                if (latestVersion.isPresent()) {
                    latestVersion.get().setIsLatestVersion(false);
                    documentVersionRepository.save(latestVersion.get());
                }
                if (latestMajorVersion.isPresent()) {
                    latestMajorVersion.get().setIsLatestMajorVersion(false);
                    documentVersionRepository.save(latestMajorVersion.get());
                }

                return ConversionUtils.buildXmlDocument(doc, docs.getValue(), docs.getKey(), collaboratorsService, documentPropertyValuesRepository);
        }

    }

    @Transactional(rollbackFor = Exception.class)
    public LeosDocument updateDocument(String ref, final BigDecimal versionId, Map<String, ?> metadata, String userId, boolean latest) throws Exception {
        Optional<DocumentV> docV = documentVRepository.findVersionByRefAndVersionId(ref, versionId);
        if (docV.isPresent()) {
            DocumentVersion docVersion = documentVersionRepository.findById(versionId).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND,
                    DocumentVersion.class.getName()));
            if (latest) {
                docVersion = documentVersionRepository.findLastVersionByDocumentId(docVersion.getDocumentId()).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND,
                        DocumentVersion.class.getName()));
            }
            Document doc =
                    documentRepository.findById(docVersion.getDocumentId()).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND,
                            Document.class.getName()));
            Pair<DocumentContent, DocumentVersion> docs = updateDocumentContentMetadataAndVersionComments(docVersion, metadata, userId);
            doc = updateDocumentMetadata(doc, docs.getValue(), (Map<String, Object>) metadata, userId);

            return ConversionUtils.buildXmlDocument(doc, docs.getValue(), docs.getKey(), collaboratorsService, documentPropertyValuesRepository);
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
    public void deleteDocumentById(BigDecimal id) throws RepositoryException {
        DocumentV docView = documentVRepository.findVersionByVersionId(id).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentV.class.getName()));
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
    public void deleteDocumentByRef(String ref) throws RepositoryException {
        Document doc = documentRepository.findDocumentByRef(ref).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Document.class.getName()));
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

    public String getNextVersionLabel(VersionType versionType, String oldVersion) {
        if (StringUtils.isEmpty(oldVersion)) {
            if (versionType.equals(VersionType.MAJOR)) {
                return "1.0.0";
            } else if (versionType.equals(VersionType.INTERMEDIATE)) {
                return "0.1.0";
            } else {
                return "0.0.1";
            }
        }

        String[] newVersion = oldVersion.split("\\.");
        if (versionType.equals(VersionType.MAJOR)) {
            newVersion[0] = Integer.parseInt(newVersion[0]) + 1 + "";
            newVersion[1] = "0";
            newVersion[2] = "0";
        } else if (versionType.equals(VersionType.INTERMEDIATE)) {
            newVersion[1] = Integer.parseInt(newVersion[1]) + 1 + "";
            newVersion[2] = "0";
        } else {
            newVersion[2] = Integer.parseInt(newVersion[2]) + 1 + "";
        }
        return newVersion[0] + "." + newVersion[1] + "." + newVersion[2];
    }

    private Document updateDocumentMetadata(Document doc, DocumentVersion docVersion, Map<String, Object> metadata, String userId) throws Exception {
        if (metadata.get(PropertiesMetadata.COLLABORATORS.getLeosName()) != null) {
            List<Collaborator> collaborators =
                    ConversionUtils.getLeosCollaboratorsFromLinkedHashMap((ArrayList<LinkedHashMap<String, Object>>) metadata.get(PropertiesMetadata.COLLABORATORS.getLeosName()));
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

    private void updateDocumentProperties(Document doc, DocumentVersion docVersion, Map<String, Object> metadata, String userId) throws JsonProcessingException {
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
        } else if (!"0".equals(str.remove(str.size() - 1))) {
            throw new IllegalArgumentException("CMIS Version number should be in the format of a major version x...0");
        } else {
            return str;
        }
    }

    private String buildSearchVersionRegularExp(List<String> str, boolean allIntermediateVersions) {
        StringBuilder versionRegularExp = new StringBuilder();
        versionRegularExp.append(String.join(".", str));
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
        String prevMajorVersion = prevMajorVersionDoc.isPresent() ? prevMajorVersionDoc.get().getVersionLabel() : "0.0.0";

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
        List<BigDecimal> pkgIdsList = collaboratorsService.findDocumentsByCollaboratorName(userName, leosAuthority);
        for (BigDecimal pkgId : pkgIdsList) {
            List<LeosDocument> foundDocs = packageService.findDocumentsByPackageId(pkgId, categories, false, false);
            xmlDocs.addAll(foundDocs);
        }
        return xmlDocs;
    }

    public Optional<LeosDocument> findDocumentByRef(final String ref, String category) {
        Validate.notNull(category, "Method findDocumentByRef: document category should not be null");
        switch (category) {
            case "CONFIG":
            case "STRUCTURE":
            case "TEMPLATE":
                try {
                    return Optional.of(findTemplateByName(ref));
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
                    queryBuild.append(columnName + " IS NULL OR " + columnName + " = '-' ");
                }
                if ("IN".equalsIgnoreCase(filter.operator)) {
                    queryBuild.append(" OR ");
                    queryBuild.append(columnName + " IN ( ");
                    StringJoiner joiner = new StringJoiner(", ");
                    for (int j = 0; j < filter.value.length; j++) {
                        joiner.add(":val_" + j);
                    }
                    queryBuild.append(joiner + ")");
                } else {
                    queryBuild.append(" OR " + columnName + " :op_" + i + " :keyValue_" + i);
                }
                if (filter.nullCheck) {
                    queryBuild.append(")");
                }
            } catch (NoSuchFieldException e) {
                continue;
            }
            break;
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
                    for (int j = 0; j < filter.value.length; j++) {
                        query.setParameter("val_" + j, filter.value[j]);
                    }
                } else {
                    query.setParameter("op_" + i, filter.operator);
                    for (int j = 0; j < filter.value.length; j++) {
                        query.setParameter("val_" + j, filter.value[j]);
                    }
                }
            } catch (NoSuchFieldException e) {
                continue;
            }
            break;
        }
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
                    queryBuild.append("(p.collaborator.collaboratorName = :collaboratorName_" + i + ")");
                } else if (valueAttrs.length == 2) {
                    queryBuild.append("(p.collaborator.collaboratorName = :collaboratorName_" + i);
                    queryBuild.append(" AND p.collaborator.role = :collaboratorRole_" + i + ")");
                } else if (valueAttrs.length == 3) {
                    queryBuild.append("(p.collaborator.collaboratorName = :collaboratorName_" + i);
                    queryBuild.append(" AND p.collaborator.role = :collaboratorRole_" + i);
                    queryBuild.append(" AND p.collaborator.organization = :collaboratorOrganization_" + i + ")");
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
                    queryBuild.append(QueryFilter.FilterType.getColumnName(sortOrder.key) + " " + sortOrder.direction);
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
        List<LeosDocument> docs = configService.findConfigByName(name);
        if (docs.isEmpty()) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, "Template " + name + " not found");
        } else {
            return docs.get(0);
        }
    }

    private Pair<DocumentContent, DocumentVersion> createDocument(final Document doc, Map<String, ?> metadata, final String labelVersion,
                                                                  int versionType, byte[] contentBytes, String comments, String userId) throws RepositoryException {
        DocumentVersion docVersion = updateDocumentVersion(doc, userId, versionType, labelVersion, comments);
        DocumentContent docContent = updateDocumentContent(docVersion, null, userId, new String(contentBytes, StandardCharsets.UTF_8), metadata);
        return new Pair<>(docContent, docVersion);
    }

    private Pair<DocumentContent, DocumentVersion> updateDocument(final Document doc, Map<String, ?> metadata, final String labelVersion,
                                                                  int versionType, byte[] contentBytes, String comments, String userId) throws RepositoryException {
        Optional<DocumentV> docView = documentVRepository.findLastVersionByDocumentId(doc.getId());

        if (docView.isPresent()) {
            DocumentVersion docVersion = updateDocumentVersion(doc, userId, versionType, labelVersion, comments);
            DocumentContent docContent = updateDocumentContent(docVersion, docView.get(), userId, new String(contentBytes, StandardCharsets.UTF_8), metadata);
            return new Pair(docContent, docVersion);
        } else {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentV.class.getName());
        }
    }

    private Pair<DocumentContent, DocumentVersion> updateDocumentContentMetadataAndVersionComments(DocumentVersion version,
                                                                                                   Map<String, ?> metadata,
                                                                                                   String userId) throws Exception {
        version = updateDocumentVersionComments(version, userId, metadata);
        DocumentContent content =
                documentContentRepository.findDocumentContentByVersionId(version.getId()).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentContent.class.getName()));
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
        return new Pair(content, version);
    }

    private DocumentVersion updateDocumentVersionComments(DocumentVersion version, String updatedBy, Map<String, ?> metadata) throws Exception {
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
        docVersion.setAuditCBy(updatedBy);
        docVersion.setAuditCDate(LocalDateTime.now());
        docVersion.setAuditLastMBy(updatedBy);
        docVersion.setAuditLastMDate(LocalDateTime.now());
        docVersion.setVersionLabel(labelVersion);
        docVersion.setVersionType(String.valueOf(versionType));
        docVersion.setDocumentId(doc.getId());
        docVersion.setComments(comments);
        docVersion.setIsLatestVersion(true);
        docVersion.setIsLatestMajorVersion(versionType != VersionType.MINOR.value());
        docVersion.setIsMajorVersion(versionType != VersionType.MINOR.value());

        // These values are not used
        docVersion.setIsVersionSeriesCheckedOut(false);
        docVersion.setVersionSeriesId(labelVersion);

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
}
