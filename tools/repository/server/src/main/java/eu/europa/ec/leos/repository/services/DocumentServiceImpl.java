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
import eu.europa.ec.leos.repository.entities.DocumentCategories;
import eu.europa.ec.leos.repository.entities.DocumentContent;
import eu.europa.ec.leos.repository.entities.DocumentProperties;
import eu.europa.ec.leos.repository.entities.DocumentPropertyValues;
import eu.europa.ec.leos.repository.entities.DocumentV;
import eu.europa.ec.leos.repository.entities.Document;
import eu.europa.ec.leos.repository.entities.DocumentVersion;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.Collaborator;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.repositories.DocumentCategoriesRepository;
import eu.europa.ec.leos.repository.repositories.DocumentContentRepository;
import eu.europa.ec.leos.repository.repositories.DocumentPropertiesRepository;
import eu.europa.ec.leos.repository.repositories.DocumentPropertyValuesRepository;
import eu.europa.ec.leos.repository.repositories.DocumentPropertiesVRepository;
import eu.europa.ec.leos.repository.repositories.DocumentRepository;
import eu.europa.ec.leos.repository.repositories.DocumentVRepository;
import eu.europa.ec.leos.repository.repositories.DocumentVersionRepository;
import eu.europa.ec.leos.repository.repositories.PackageRepository;
import eu.europa.ec.leos.repository.utils.ConversionUtils;
import eu.europa.ec.leos.repository.utils.PropertiesMetadata;
import org.apache.commons.lang3.StringUtils;
import org.apache.tika.Tika;
import org.apache.tika.io.TikaInputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static eu.europa.ec.leos.repository.controllers.requests.QueryFilter.formSortClause;
import static eu.europa.ec.leos.repository.controllers.requests.QueryFilter.getWhereClauseFromQueryFilter;

@Service
public class DocumentServiceImpl implements DocumentService {
    private final DocumentRepository documentRepository;
    private final DocumentVRepository documentVRepository;
    private final DocumentVersionRepository documentVersionRepository;
    private final DocumentContentRepository documentContentRepository;
    private final DocumentCategoriesRepository documentCategoriesRepository;
    private final DocumentPropertiesVRepository documentPropertiesVRepository;
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
                               DocumentCategoriesRepository documentCategoriesRepository, DocumentPropertiesVRepository documentPropertiesVRepository,
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
        this.documentPropertiesVRepository = documentPropertiesVRepository;
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
    public LeosDocument createDocumentFromContent(final String repositoryId, final String packageName, final String name, Map<String, ?> metadata,
                                                  final String labelVersion,
                                                  int versionType, byte[] contentBytes, String comments, String userId) throws RepositoryException {
        try {
            checkMetadata(metadata);

            String createdBy = metadata.get(PropertiesMetadata.CREATED_BY.getLeosName()) != null ?
                    (String) metadata.get(PropertiesMetadata.CREATED_BY.getLeosName()) : userId;
            LocalDateTime creationDate = metadata.get(PropertiesMetadata.CREATION_DATE.getLeosName()) != null ?
                    ConversionUtils.convertToLocalDateTime(ConversionUtils.getDateFromString((String) metadata.get(PropertiesMetadata.CREATION_DATE.getLeosName())
                            , ConversionUtils.LEOS_REPO_DATE_FORMAT)) : LocalDateTime.now();

            // FIRST STEP: get package
            Package pkg = packageRepository.findPackageByName(repositoryId, packageName).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Package.class.getName()));
            DocumentCategories docCat
                    =
                    documentCategoriesRepository.findDocumentCategoriesByCategoryCode((String) metadata.get(PropertiesMetadata.CATEGORY.getLeosName())).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentCategories.class.getName()));

            Document doc = new Document();
            doc.setName(name);
            doc.setAuditCBy(createdBy);
            doc.setAuditCDate(creationDate);
            doc.setAuditLastMBy(userId);
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
            if (metadata.get(PropertiesMetadata.COLLABORATORS.getLeosName()) != null) {
                List<Collaborator> collaborators =
                        ConversionUtils.getLeosCollaboratorsFromLinkedHashMap((ArrayList<LinkedHashMap<String, Object>>) metadata.get(PropertiesMetadata.COLLABORATORS.getLeosName()));
                collaboratorsService.updateCollaborators(pkg, collaborators, userId);
            }
            if (metadata.get(PropertiesMetadata.REF.getLeosName()) != null) {
                doc.setRef((String) metadata.get(PropertiesMetadata.REF.getLeosName()));
            } else {
                if (name.lastIndexOf('.') > 0) {
                    doc.setRef(name.lastIndexOf('.') > 0 ? name.substring(0, name.lastIndexOf('.')) : name);
                }
            }
            doc.setCategoryId(docCat);
            if (metadata.get(PropertiesMetadata.CLONED_PROPOSAL.getLeosName()) != null) {
                doc.setOriginalRef(new BigDecimal(Long.parseLong((String) metadata.get(PropertiesMetadata.ORIGIN_REF.getLeosName()))));
                doc.setClonedFrom(new BigDecimal(Long.parseLong((String) metadata.get(PropertiesMetadata.CLONED_FROM.getLeosName()))));
                doc.setRevisionStatus((String) metadata.get(PropertiesMetadata.REVISION_STATUS.getLeosName()));
            }
            doc = documentRepository.save(doc);

            Tika tika = new Tika();
            String type = tika.detect(TikaInputStream.get(contentBytes));
            if (type.contains("text")) {
                createDocument(doc, metadata, labelVersion, versionType, contentBytes, comments, userId);
                return ConversionUtils.buildXmlDocument(documentVRepository, collaboratorsService, documentPropertiesVRepository, doc.getId());
            } else if (type.contains("zip")) {
                return milestoneDocumentService.createMilestoneFromContent(doc, metadata, contentBytes, userId);
            } else {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Bad content");
            }
        }
        catch(RepositoryException e) {
            throw e;
        }
        catch(Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public LeosDocument createDocumentFromSource(final String repositoryId, final String sourceDocumentName, final String packageName, final String name, Map<String, ?> metadata,
                                       final String labelVersion, int versionType, String comments, String userId)  throws RepositoryException {
        LeosDocument template = findTemplateByName(sourceDocumentName);
        metadata = mergeDocMetadataWithTemplateMetadata(metadata, template);
        return createDocumentFromContent(repositoryId, packageName, name, metadata, labelVersion, versionType, template.getSource(), comments, userId);
    }

    private Map<String, ?> mergeDocMetadataWithTemplateMetadata(Map<String, ?> metadata, LeosDocument template) {
        Map<String, Object> templateMetadata = template.getMetadata();
        templateMetadata.putAll(metadata);
        return templateMetadata;
    }

    @Transactional(rollbackFor = Exception.class)
    public LeosDocument updateDocument(final String ref, Map<String, ?> metadata, final String labelVersion,
                                    int versionType, byte[] contentBytes, String comments, String userId) throws Exception {
        boolean isMajor = versionType != VersionType.MINOR.value();

        Document doc =
                documentRepository.findDocumentByRef(ref).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND,
                        Document.class.getName()));

        Optional<DocumentV> docView =
                documentVRepository.findDocumentByRef(ref);
        if (!docView.isPresent()) {
            return milestoneDocumentService.updateMilestone(doc, contentBytes, metadata, userId);
        }

        Optional<DocumentVersion> latestVersion = documentVersionRepository.findLastVersionByDocumentId(doc.getId());
        Optional<DocumentVersion> latestMajorVersion = Optional.empty();
        if (isMajor) {
            latestMajorVersion = documentVersionRepository.findLastMajorVersionByDocumentId(doc.getId());
        }

        doc = updateDocumentMetadata(doc, (Map<String, Object>) metadata, userId);
        DocumentContent content = updateDocument(doc, metadata, labelVersion, versionType, contentBytes, comments, userId);

        if (latestVersion.isPresent()) {
            latestVersion.get().setIsLatestVersion(false);
            documentVersionRepository.save(latestVersion.get());
        }
        if (latestMajorVersion.isPresent()) {
            latestMajorVersion.get().setIsLatestMajorVersion(false);
            documentVersionRepository.save(latestMajorVersion.get());
        }

        return ConversionUtils.buildXmlDocument(documentVRepository, collaboratorsService, documentPropertiesVRepository, doc.getId());
    }

    @Transactional(rollbackFor = Exception.class)
    public LeosDocument updateDocument(final String ref, Map<String, ?> metadata, final String labelVersion,
                                      int versionType, String comments, String userId) throws Exception {
        boolean isMajor = versionType != VersionType.MINOR.value();

        Document doc =
                documentRepository.findDocumentByRef(ref).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND,
                        Document.class.getName()));

        Optional<DocumentV> docView =
                documentVRepository.findDocumentByRef(ref);
        if (!docView.isPresent()) {
            return milestoneDocumentService.updateMilestoneMetadata(doc, metadata, userId);
        }

        Optional<DocumentVersion> latestVersion = documentVersionRepository.findLastVersionByDocumentId(doc.getId());
        Optional<DocumentVersion> latestMajorVersion = Optional.empty();
        if (isMajor) {
            latestMajorVersion = documentVersionRepository.findLastMajorVersionByDocumentId(doc.getId());
        }

        doc = updateDocumentMetadata(doc, (Map<String, Object>) metadata, userId);
        DocumentContent docContent = updateDocumentMetadata(doc, metadata, labelVersion, versionType, comments, userId);

        if (latestVersion.isPresent()) {
            latestVersion.get().setIsLatestVersion(false);
            documentVersionRepository.save(latestVersion.get());
        }
        if (latestMajorVersion.isPresent()) {
            latestMajorVersion.get().setIsLatestMajorVersion(false);
            documentVersionRepository.save(latestMajorVersion.get());
        }

        return ConversionUtils.buildXmlDocument(documentVRepository, collaboratorsService, documentPropertiesVRepository, doc.getId());
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteDocumentById(String id) throws RepositoryException {
        DocumentV docView = documentVRepository.findVersionByVersionId(new BigDecimal(Long.parseLong(id))).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentV.class.getName()));
        Optional<Document> doc = documentRepository.findById(docView.getDocumentId());
        doc.ifPresent(documentRepository::delete);
        List<DocumentVersion> versions = documentVersionRepository.findAllVersionsByDocumentId(docView.getDocumentId());
        for (DocumentVersion v : versions) {
            Optional<DocumentContent> content = documentContentRepository.findDocumentContentByVersion(v);
            content.ifPresent(documentContentRepository::delete);
        }
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
        documentVersionRepository.deleteAll(versions);
    }

    public List<LeosDocument> findAllVersionsByRef(final String ref) {
        List<DocumentV> docViews = documentVRepository.findAllVersionsByRef(ref);
        List<LeosDocument> docs = new ArrayList<>();
        for (DocumentV doc : docViews) {
            docs.add(ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, doc));
        }
        return docs;
    }

    public LeosDocument findDocumentById(final String versionId, final boolean latest) {
        Optional<DocumentV> docView = documentVRepository.findVersionByVersionId(new BigDecimal(Long.parseLong(versionId)));
        if (docView.isPresent() && latest && !docView.get().isLatestVersion()) {
            docView = documentVRepository.findLastVersionByDocumentId(docView.get().getDocumentId());
        }
        return ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, docView.orElse(null));
    }

    public LeosDocument findLatestMajorVersionByRef(final String docRef) {
        Optional<DocumentV> docView = documentVRepository.findLatestMajorVersionByRef(docRef);
        return ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, docView.orElse(null));
    }

    public LeosDocument findFirstVersion(final String docRef) {
        Optional<DocumentV> docView = documentVRepository.findFirstVersion(docRef);
         return ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, docView.orElse(null));
    }

    public LeosDocument findDocumentByVersion(final String docRef, final String versionLabel) {
        Optional<DocumentV> docView = documentVRepository.findDocumentByVersion(docRef, versionLabel);
        return ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, docView.orElse(null));
    }

    public List<LeosDocument> findDocumentByName(final String fileName) throws RepositoryException {
        List<LeosDocument> listDocs = new ArrayList<>();
        List<DocumentV> docs = documentVRepository.findDocumentsByName(fileName);
        for (DocumentV doc : docs) {
            listDocs.add(ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, doc));
        }
        listDocs.addAll(milestoneDocumentService.findMilestoneByName(fileName));
        listDocs.addAll(configService.findConfigByName(fileName));
        return listDocs;
    }

    public List<LeosDocument> findAllDocumentsByPackageId(final String pkgId) throws RepositoryException {
        try {
            List<LeosDocument> listDocs = new ArrayList<>();
            List<DocumentV> docs = documentVRepository.findDocumentsByPackageId(new BigDecimal(Long.parseLong(pkgId)));
            for (DocumentV doc : docs) {
                listDocs.add(ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, doc));
            }
            listDocs.addAll(milestoneDocumentService.findMilestoneByPackageId(pkgId));
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

    private Document updateDocumentMetadata(Document doc, Map<String, Object> metadata, String userId) throws Exception {
        if (metadata.get(PropertiesMetadata.COLLABORATORS.getLeosName()) != null) {
            List<Collaborator> collaborators =
                    ConversionUtils.getLeosCollaboratorsFromLinkedHashMap((ArrayList<LinkedHashMap<String, Object>>) metadata.get(PropertiesMetadata.COLLABORATORS.getLeosName()));
            collaboratorsService.updateCollaborators(doc.getPackageId(), collaborators, userId);
        }
        doc.setBaseRevisionId(metadata.get(PropertiesMetadata.BASE_REVISION_ID.getLeosName()) != null ?
                new BigDecimal(Long.parseLong((String) metadata.get(PropertiesMetadata.BASE_REVISION_ID.getLeosName()))) : doc.getBaseRevisionId());
        if (metadata.get(PropertiesMetadata.CLONED_PROPOSAL.getLeosName()) != null) {
            doc.setOriginalRef(metadata.get(PropertiesMetadata.ORIGIN_REF.getLeosName()) != null ?
                    new BigDecimal(Long.parseLong((String) metadata.get(PropertiesMetadata.ORIGIN_REF.getLeosName()))) : doc.getOriginalRef());
            doc.setClonedFrom(metadata.get(PropertiesMetadata.CLONED_FROM.getLeosName()) != null ?
                    new BigDecimal(Long.parseLong((String) metadata.get(PropertiesMetadata.CLONED_FROM.getLeosName()))) : doc.getClonedFrom());
            doc.setRevisionStatus(metadata.get(PropertiesMetadata.REVISION_STATUS.getLeosName()) != null ?
                    (String) metadata.get(PropertiesMetadata.REVISION_STATUS.getLeosName()) : doc.getRevisionStatus());
            doc.setContributionStatus(metadata.get(PropertiesMetadata.CONTRIBUTION_STATUS.getLeosName()) != null ?
                    (String) metadata.get(PropertiesMetadata.CONTRIBUTION_STATUS.getLeosName()): doc.getContributionStatus());
        }
        updateDocumentProperties(doc, metadata, userId);
        return documentRepository.save(doc);
    }

    private void updateDocumentProperties(Document doc, Map<String, Object> metadata, String userId) throws JsonProcessingException {
        List<DocumentProperties> props = documentPropertiesRepository.findDocumentPropertiesByDocCategoryId(doc.getCategoryId());
        if (props != null && !props.isEmpty()) {
            for (DocumentProperties prop: props) {
                if (metadata.get(prop.getPropertyName()) != null) {
                    Optional<DocumentPropertyValues> hasValue = documentPropertyValuesRepository.findDocumentPropertyValuesByDocumentIdAndPropertyId(doc.getId()
                            , prop);
                    DocumentPropertyValues value = hasValue.orElse(new  DocumentPropertyValues());
                    if (value.getAuditCBy() == null && value.getAuditCDate() == null) {
                        value.setAuditCBy(userId);
                        value.setAuditCDate(LocalDateTime.now());
                    }
                    value.setAuditLastMBy(userId);
                    value.setAuditLastMDate(LocalDateTime.now());
                    value.setDocumentId(doc.getId());
                    value.setPropertyId(prop);
                    value.setPropertyValue(mapper.writeValueAsString(metadata.get(prop.getPropertyName())));
                }
            }
        }
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

    private String buildMinorVersionsLowerThanMajorRegularExp(String majorVersionLabel, boolean allIntermediateVersions) {
        List<String> str = parseMajorVersion(majorVersionLabel);
        ListIterator listIterator = str.listIterator(str.size());

        String lastDigit;
        do {
            if (!listIterator.hasPrevious()) {
                return "";
            }

            lastDigit = (String)listIterator.previous();
        } while("0".equals(lastDigit));

        listIterator.set(String.valueOf(Integer.parseInt(lastDigit) - 1));
        return buildSearchVersionRegularExp(str, allIntermediateVersions);
    }

    private String buildMinorVersionsGreaterThanMajorRegularExp(String majorVersionLabel, boolean allIntermediateVersions) {
        List<String> str = parseMajorVersion(majorVersionLabel);
        return buildSearchVersionRegularExp(str, allIntermediateVersions);
    }

    public List<LeosDocument> findAllMinorsForIntermediate(final String docRef, String currIntVersion, final int startIndex, final int maxResults) {
        List<LeosDocument> docs = new ArrayList<>();
        currIntVersion = buildMinorVersionsLowerThanMajorRegularExp(currIntVersion, true);
        PageRequest pageRequest =
                PageRequest.of(startIndex, maxResults, Sort.Direction.DESC, "updatedOn");

        Page<DocumentV> docViews = documentVRepository.findAllMinorsForIntermediate(docRef, currIntVersion,
                pageRequest);
        for (DocumentV doc : docViews) {
            docs.add(ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, doc));
        }
        return docs;
    }

    public Integer getAllMinorsCountForIntermediate(final String docRef, String currIntVersion) {
        currIntVersion = buildMinorVersionsGreaterThanMajorRegularExp(currIntVersion, true);
        return documentVRepository.getAllMinorsCountForIntermediate(docRef, currIntVersion);
    }

    public Integer getAllMajorsCount(final String docRef) {
        return documentVRepository.getAllMajorsCount(docRef);
    }

    public Integer getRecentMinorVersionsCount(final String docRef, String currIntVersion) {
        currIntVersion = buildMinorVersionsGreaterThanMajorRegularExp(currIntVersion, true);
        return documentVRepository.getRecentMinorVersionsCount(docRef, currIntVersion);
    }

    public List<LeosDocument> findAllMajors(final String docRef, final int startIndex, final int maxResult)  {
        PageRequest pageRequest =
                PageRequest.of(startIndex, maxResult, Sort.Direction.DESC, "updatedOn");
        Page<DocumentV> docViews = documentVRepository.findAllMajors(docRef, pageRequest);
        List<LeosDocument> docs = new ArrayList<>();
        for (DocumentV doc : docViews) {
            docs.add(ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, doc));
        }
        return docs;
    }

    public List<LeosDocument> findRecentMinorVersions(final String docRef, String lastMajorVersion, final int startIndex, final int maxResults) {
        List<LeosDocument> xmlDocs = new ArrayList<>();
        lastMajorVersion = buildMinorVersionsGreaterThanMajorRegularExp(lastMajorVersion, true);
        PageRequest pageRequest =
                PageRequest.of(startIndex, maxResults, Sort.Direction.DESC, "updatedOn");
        Page<DocumentV> docs = documentVRepository.findRecentMinorVersions(docRef, lastMajorVersion, pageRequest);
        for (DocumentV doc : docs) {
            xmlDocs.add(ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, doc));
        }
        return xmlDocs;
    }

    public List<LeosDocument> findDocumentsByUserId(final String userId, final String leosAuthority) {
        List<LeosDocument> xmlDocs = new ArrayList<>();
        List<String> pkgIdsList = collaboratorsService.findDocumentsByUserId(userId, leosAuthority);
        for (String pkgId : pkgIdsList) {
            List<LeosDocument> foundDocs = packageService.findDocumentsByPackageId(pkgId,
                    null, false);
            xmlDocs.addAll(foundDocs);
        }
        return xmlDocs;
    }

    public Optional<LeosDocument> findDocumentByRef(final String ref) {
        Optional<DocumentV> doc = documentVRepository.findDocumentByRef(ref);
        return doc.isPresent() ? Optional.of(ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, doc.get())) :
                Optional.empty();
    }

    public List<LeosDocument> findDocumentsByStatus(final String status) {
        return milestoneDocumentService.findMilestonesByStatus(status);
    }

    public LeosDocument findTemplateByName(String name) throws RepositoryException {
        List<LeosDocument> docs = configService.findConfigByName(name);
        if (docs.isEmpty()) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, "Template " + name + " not found");
        } else {
            return docs.get(0);
        }
    }

    public List<LeosDocument> findDocumentsUsingFilter(final String packageName, final Set<String> categories, final QueryFilter queryFilter,
                                                       final int startIndex, final int maxResults) {
        //Build query
        StringBuilder queryBuild = new StringBuilder(String.format("SELECT d FROM DocumentV d WHERE d.isLatestVersion = true AND d.packageId IN (SELECT p.id FROM Package p" +
                " WHERE p.name LIKE '%%%s%%')", packageName));
        buildQueryStringFromQueryFilter(queryBuild, categories, queryFilter);

        List<DocumentV> docs = entityManager.createQuery(queryBuild.toString()).setFirstResult(startIndex).setMaxResults(maxResults).getResultList();
        List<LeosDocument> xmlDocs = new ArrayList<>();
        for (DocumentV doc : docs) {
            xmlDocs.add(ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, doc));
        }
        xmlDocs.addAll(milestoneDocumentService.findMilestonesUsingFilter(packageName, categories, queryFilter, startIndex, maxResults));
        return xmlDocs;
    }

    public Long countDocumentsUsingFilter(final String packageName, final Set<String> categories, final QueryFilter queryFilter) {
        //Build query
        StringBuilder queryBuild = new StringBuilder(
                String.format("SELECT COUNT(d) FROM DocumentV d WHERE d.isLatestVersion = true AND d.packageId IN (SELECT p.id FROM Package p WHERE p.name " +
                        "LIKE '%%%s%%')", packageName));
        buildQueryStringFromQueryFilter(queryBuild, categories, queryFilter);

        Long count = (Long) entityManager.createQuery(queryBuild.toString()).getSingleResult();
        count += milestoneDocumentService.countMilestonesUsingFilter(packageName, categories, queryFilter);
        return count;
    }

    private void buildQueryStringFromQueryFilter(StringBuilder queryBuild, final Set<String> categories, QueryFilter queryFilter) {
        if (!categories.isEmpty()) {
            String categoryStr = categories.stream()
                    .map(a -> "'" + a + "'")
                    .collect(Collectors.joining(","));

            queryBuild.append(String.format(" AND d.categoryCode IN (%s)",
                    categoryStr));
        }
        String whereFiltersClause = getWhereClauseFromQueryFilter(queryFilter, DocumentV.class);
        if(!whereFiltersClause.isEmpty()){
            queryBuild.append(" AND ");
            Optional<QueryFilter.Filter> roleFilter = queryFilter.getFilters().stream().filter(f -> f.key.equals("role")).findFirst();
            if (roleFilter.isPresent()) {
                String[] values = roleFilter.get().value;
                queryBuild.append("d.packageId IN (SELECT p.pkg.id FROM PackageCollaborators p WHERE ");
                for (int i = 0; i < values.length; i++) {
                    String value = values[i];
                    String[] valueAttrs = value.split("::");
                    if (valueAttrs.length == 1) {
                        queryBuild.append(String.format("(p.collaborator.collaboratorName = '%s')", valueAttrs[0]));
                    } else if (valueAttrs.length == 2) {
                        queryBuild.append(String.format("(p.collaborator.collaboratorName = '%s' AND p.collaborator.role = '%s')", valueAttrs[0],
                                valueAttrs[1]));
                    } else if (valueAttrs.length == 3) {
                        queryBuild.append(String.format("(p.collaborator.collaboratorName = '%s' AND p.collaborator.role = '%s' AND p.collaborator" +
                                ".organization = '%s')", valueAttrs[0], valueAttrs[1], valueAttrs[2]));
                    }
                    if (i < values.length - 1) {
                        queryBuild.append(" OR ");
                    }
                }
                queryBuild.append(")");
                queryFilter.removeFilter("role");
                if (!queryFilter.getFilters().isEmpty()) {
                    queryBuild.append(" AND ");
                }
            }
            queryBuild.append(whereFiltersClause);
        }
        String formSortClause = formSortClause(queryFilter, DocumentV.class);
        if (!formSortClause.isEmpty()) {
            queryBuild.append(" ORDER BY ");
            queryBuild.append(formSortClause);
        }
    }

    private DocumentContent createDocument(final Document doc, Map<String, ?> metadata, final String labelVersion,
                                           int versionType, byte[] contentBytes, String comments, String userId) throws RepositoryException {
        DocumentVersion docVersion = updateDocumentVersion(doc, userId, versionType, labelVersion, comments);
        return updateDocumentContent(docVersion, null, userId, new String(contentBytes, StandardCharsets.UTF_8), metadata);
    }

    private DocumentContent updateDocument(final Document doc, Map<String, ?> metadata, final String labelVersion,
                                           int versionType, byte[] contentBytes, String comments, String userId) throws RepositoryException {
        Optional<DocumentV> docView = documentVRepository.findLastVersionByDocumentId(doc.getId());

        if (docView.isPresent()) {
            DocumentVersion docVersion = updateDocumentVersion(doc, userId, versionType, labelVersion, comments);
            return updateDocumentContent(docVersion, docView.get(), userId, new String(contentBytes, StandardCharsets.UTF_8), metadata);
        } else {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentV.class.getName());
        }
    }

    private DocumentContent updateDocumentMetadata(final Document doc, Map<String, ?> metadata,
                                                         final String labelVersion, int versionType, String comments, String userId) throws RepositoryException {
        Optional<DocumentV> docView = documentVRepository.findLastVersionByDocumentId(doc.getId());

        if (docView.isPresent()) {
            DocumentVersion docVersion = updateDocumentVersion(doc, userId, versionType, labelVersion, comments);
            return updateDocumentContent(docVersion, docView.get(), userId, docView.get().getContent(), metadata);
        } else {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentV.class.getName());
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
                                             String contentString, Map<String, ?> metadata) throws RepositoryException {
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
