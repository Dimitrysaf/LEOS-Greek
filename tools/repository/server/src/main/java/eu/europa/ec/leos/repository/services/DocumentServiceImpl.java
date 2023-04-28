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
import eu.europa.ec.leos.repository.entities.ConfigCategory;
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
import eu.europa.ec.leos.repository.repositories.ConfigCategoryRepository;
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

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class DocumentServiceImpl implements DocumentService {
    private final DocumentRepository documentRepository;
    private final DocumentVRepository documentVRepository;
    private final DocumentVersionRepository documentVersionRepository;
    private final DocumentContentRepository documentContentRepository;
    private final DocumentCategoriesRepository documentCategoriesRepository;
    private final ConfigCategoryRepository configCategoryRepository;
    private final DocumentPropertiesVRepository documentPropertiesVRepository;
    private final DocumentPropertiesRepository documentPropertiesRepository;
    private final DocumentPropertyValuesRepository documentPropertyValuesRepository;
    private final PackageRepository packageRepository;
    private final PackageService packageService;
    private final TemplateService templateService;
    private final CollaboratorsService collaboratorsService;
    private final MilestoneDocumentService milestoneDocumentService;
    private final ConfigService configService;

    private static final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    public DocumentServiceImpl(DocumentRepository documentRepository, DocumentVRepository documentVRepository,
                               DocumentVersionRepository documentVersionRepository, DocumentContentRepository documentContentRepository,
                               DocumentCategoriesRepository documentCategoriesRepository, DocumentPropertiesVRepository documentPropertiesVRepository,
                               DocumentPropertiesRepository documentPropertiesRepository,
                               DocumentPropertyValuesRepository documentPropertyValuesRepository,
                               PackageRepository packageRepository, PackageService packageService, TemplateService templateService,
                               CollaboratorsService collaboratorsService,
                               ConfigCategoryRepository configCategoryRepository,
                               MilestoneDocumentService milestoneDocumentService,
                               ConfigService configService) {
        this.documentRepository = documentRepository;
        this.documentVRepository = documentVRepository;
        this.documentVersionRepository = documentVersionRepository;
        this.documentContentRepository = documentContentRepository;
        this.documentCategoriesRepository = documentCategoriesRepository;
        this.documentPropertiesVRepository = documentPropertiesVRepository;
        this.documentPropertiesRepository = documentPropertiesRepository;
        this.documentPropertyValuesRepository = documentPropertyValuesRepository;
        this.configCategoryRepository = configCategoryRepository;
        this.packageRepository = packageRepository;
        this.packageService = packageService;
        this.templateService = templateService;
        this.collaboratorsService = collaboratorsService;
        this.milestoneDocumentService = milestoneDocumentService;
        this.configService = configService;
    }

    @Transactional(rollbackFor = Exception.class)
    public LeosDocument createDocumentFromContent(final String repositoryId, final String packageName, final String name, Map<String, ?> metadata,
                                                  final String labelVersion,
                                                  int versionType, byte[] contentBytes, String comments) throws RepositoryException {
        try {
            checkMetadata(metadata);

            String createdBy = (String) metadata.get(PropertiesMetadata.CREATED_BY.getLeosName());
            LocalDateTime creationDate =
                    ConversionUtils.convertToLocalDateTime(ConversionUtils.getDateFromString((String) metadata.get(PropertiesMetadata.CREATION_DATE.getLeosName())
                            , ConversionUtils.LEOS_REPO_DATE_FORMAT));

            // FIRST STEP: get package
            Package pkg = packageRepository.findPackageByName(repositoryId, packageName).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Package.class.getName()));
            DocumentCategories docCat
                    =
                    documentCategoriesRepository.findDocumentCategoriesByCategoryCode((String) metadata.get(PropertiesMetadata.CATEGORY.getLeosName())).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentCategories.class.getName()));

            Document doc = new Document();
            doc.setName(name);
            doc.setAuditCBy(createdBy);
            doc.setAuditCDate(creationDate);
            doc.setAuditLastMBy(createdBy);
            doc.setAuditLastMDate(LocalDateTime.now());
            doc.setPackageId(pkg);
            doc.setDocStage(metadata.get(PropertiesMetadata.DOC_STAGE.getLeosName()) == null ? "-" :
                    (String) metadata.get(PropertiesMetadata.DOC_STAGE.getLeosName()));
            doc.setDocTemplate(metadata.get(PropertiesMetadata.DOC_TEMPLATE.getLeosName()) == null ? "-" :
                    (String) metadata.get(PropertiesMetadata.DOC_TEMPLATE.getLeosName()));
            doc.setLanguage(metadata.get(PropertiesMetadata.LANGUAGE.getLeosName()) == null ? "-" :
                    (String) metadata.get(PropertiesMetadata.LANGUAGE.getLeosName()));
            doc.setProcedureType((String) metadata.get(PropertiesMetadata.DOC_TYPE.getLeosName()));
            if (metadata.get(PropertiesMetadata.COLLABORATORS.getLeosName()) != null) {
                List<Collaborator> collaborators = ConversionUtils.getLeosCollaboratorsFromString((String) metadata.get(PropertiesMetadata.COLLABORATORS.getLeosName()));
                collaboratorsService.updateCollaborators(pkg, collaborators, createdBy);
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
                updateDocument(doc, metadata, labelVersion, versionType, contentBytes, comments, createdBy);
                return ConversionUtils.buildXmlDocument(documentVRepository, collaboratorsService, documentPropertiesVRepository, doc.getId());
            } else if (type.contains("zip")) {
                return milestoneDocumentService.createMilestoneFromContent(doc, metadata, contentBytes, createdBy);
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
                                       final String labelVersion, int versionType, String comments)  throws RepositoryException {
        LeosDocument template = templateService.findTemplateByName(sourceDocumentName);
        return createDocumentFromContent(repositoryId, packageName, name, metadata, labelVersion, versionType, template.getSource(), comments);
    }

    @Transactional(rollbackFor = Exception.class)
    public LeosDocument updateDocument(final String versionId, Map<String, ?> metadata, final String labelVersion,
                                    int versionType, byte[] contentBytes, String comments, String userId) throws Exception {
        boolean isMajor = versionType != VersionType.MINOR.value();

        DocumentV docView = documentVRepository.findVersionByVersionId(new BigDecimal(Long.parseLong(versionId))).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentV.class.getName()));
        Document doc = documentRepository.findById(docView.getDocumentId()).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Document.class.getName()));

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
    public LeosDocument updateDocument(final String versionId, Map<String, ?> metadata, final String category, final String labelVersion,
                                      int versionType, String comments, String userId) throws Exception {
        boolean isMajor = versionType != VersionType.MINOR.value();

        DocumentCategories docCat
                = documentCategoriesRepository.findDocumentCategoriesByCategoryCode(category).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentCategories.class.getName()));
        DocumentV docView =
                documentVRepository.findVersionByVersionIdAndCategory(new BigDecimal(Long.parseLong(versionId)), docCat.getCategoryCode()).orElse(null);
        if (docView == null) {
            return milestoneDocumentService.updateMilestone(versionId, metadata, userId);
        }
        Document doc = documentRepository.findById(docView.getDocumentId()).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Document.class.getName()));

        Optional<DocumentVersion> latestVersion = documentVersionRepository.findLastVersionByDocumentId(doc.getId());
        Optional<DocumentVersion> latestMajorVersion = Optional.empty();
        if (isMajor) {
            latestMajorVersion = documentVersionRepository.findLastMajorVersionByDocumentId(doc.getId());
        }

        doc = updateDocumentMetadata(doc, (Map<String, Object>) metadata, userId);
        DocumentContent docContent = updateDocumentWithoutContent(doc, metadata, labelVersion, versionType, comments, userId);

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
        documentVersionRepository.deleteAll(versions);
    }

    public LeosDocument findDocumentById(final String versionId, final boolean latest) {
        Optional<DocumentV> docView = documentVRepository.findVersionByVersionId(new BigDecimal(Long.parseLong(versionId)));
        if (docView.isPresent() && latest && !docView.get().isLatestVersion()) {
            docView = documentVRepository.findLastVersionByDocumentId(docView.get().getDocumentId());
        }
        return ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, docView.orElse(null));
    }

    public LeosDocument findLatestMajorVersionById(final String versionId) {
        Optional<DocumentV> docView = documentVRepository.findLatestMajorVersionById(new BigDecimal(Long.parseLong(versionId)));
        return ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, docView.orElse(null));
    }

    public LeosDocument findFirstVersion(final String versionId, final String docRef) {
        Optional<DocumentV> docView = documentVRepository.findVersionByVersionId(new BigDecimal(Long.parseLong(versionId)));
        if (docView.isPresent()) {
            docView = documentVRepository.findFirstVersion(docView.get().getDocumentId(), docRef);
        }
         return ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, docView.orElse(null));
    }

    public LeosDocument findDocumentByVersion(final String id, final String docRef, final String versionLabel) {
        Optional<DocumentV> docView = documentVRepository.findVersionByVersionId(new BigDecimal(Long.parseLong(id)));
        if (docView.isPresent()) {
            docView = documentVRepository.findDocumentByVersion(docView.get().getDocumentId(),docRef, versionLabel);
        }
        return ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, docView.orElse(null));
    }

    public List<LeosDocument> findDocumentByPackageNameAndFileName(final String packageName, final String fileName, final String category) throws RepositoryException {
        List<LeosDocument> listDocs = new ArrayList<>();
        Optional<DocumentCategories> cat = documentCategoriesRepository.findDocumentCategoriesByCategoryCode(category);
        if (cat.isPresent()) {
            List<DocumentV> docs = documentVRepository.findDocumentsByPackageNameAndCategory(packageName, category, fileName);
            if (docs.isEmpty()) {
                return milestoneDocumentService.findMilestoneByPackageNameAndFileName(packageName, fileName);
            } else {
                for (DocumentV doc : docs) {
                    listDocs.add(ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, doc));
                }
            }
        } else {
            Optional<ConfigCategory> configCat = configCategoryRepository.findConfigCategoriesByCategoryCode(category);
            if (configCat.isPresent()) {
                return configService.findConfigByName(fileName);
            }
        }
        return listDocs;
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
        List<Collaborator> collaborators = ConversionUtils.getLeosCollaboratorsFromString((String) metadata.get(PropertiesMetadata.COLLABORATORS.getLeosName()));
        collaboratorsService.updateCollaborators(doc.getPackageId(), collaborators, userId);
        doc.setBaseRevisionId(metadata.get(PropertiesMetadata.BASE_REVISION_ID.getLeosName()) != null ?
                new BigDecimal(Long.parseLong((String) metadata.get(PropertiesMetadata.BASE_REVISION_ID.getLeosName()))) : null);
        if (metadata.get(PropertiesMetadata.CLONED_PROPOSAL.getLeosName()) != null) {
            doc.setOriginalRef(metadata.get(PropertiesMetadata.ORIGIN_REF.getLeosName()) != null ?
                    new BigDecimal(Long.parseLong((String) metadata.get(PropertiesMetadata.ORIGIN_REF.getLeosName()))) : null);
            doc.setClonedFrom(metadata.get(PropertiesMetadata.BASE_REVISION_ID.getLeosName()) != null ?
                    new BigDecimal(Long.parseLong((String) metadata.get(PropertiesMetadata.BASE_REVISION_ID.getLeosName()))) : null);
            doc.setRevisionStatus((String) metadata.get(PropertiesMetadata.REVISION_STATUS.getLeosName()));
            doc.setContributionStatus((String) metadata.get(PropertiesMetadata.CONTRIBUTION_STATUS.getLeosName()));
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
                PageRequest.of(startIndex, maxResults, Sort.Direction.DESC, "docAuditLastMDate");

        Page<DocumentV> docViews = documentVRepository.findAllMinorsForIntermediate(docRef, currIntVersion,
                pageRequest);
        for (DocumentV doc : docViews) {
            docs.add(ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, doc));
        }
        return docs;
    }

    public Integer getAllMinorsCountForIntermediate(final String docRef, String currIntVersion) {
        currIntVersion = buildMinorVersionsGreaterThanMajorRegularExp(currIntVersion, true);
        Integer minorsCount = documentVRepository.getAllMinorsCountForIntermediate(docRef, currIntVersion);
        return minorsCount;
    }

    public Integer getAllMajorsCount(final String docRef) {
        Integer majorsCount = documentVRepository.getAllMajorsCount(docRef);
        return majorsCount;
    }

    public Integer getRecentMinorVersionsCount(final String docRef, String currIntVersion) {
        currIntVersion = buildMinorVersionsGreaterThanMajorRegularExp(currIntVersion, true);
        return documentVRepository.getRecentMinorVersionsCount(docRef, currIntVersion);
    }

    public List<LeosDocument> findAllMajors(final String docRef, final int startIndex, final int maxResult)  {
        PageRequest pageRequest =
                PageRequest.of(startIndex, maxResult, Sort.Direction.DESC, "docAuditLastMDate");
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
                PageRequest.of(startIndex, maxResults, Sort.Direction.DESC, "docAuditLastMDate");
        Page<DocumentV> docs = documentVRepository.findRecentMinorVersions(docRef, lastMajorVersion, pageRequest);
        for (DocumentV doc : docs) {
            xmlDocs.add(ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, doc));
        }
        return xmlDocs;
    }

    public List<LeosDocument> findDocumentsByUserId(final String userId, final String primaryType, final String leosAuthority) {
        List<LeosDocument> xmlDocs = new ArrayList<>();
        List<String> pkgIdsList = collaboratorsService.findDocumentsByUserId(userId, leosAuthority);
        for (String pkgId : pkgIdsList) {
            List<LeosDocument> foundDocs = packageService.findDocumentsByPackageId(pkgId,
                    Stream.of(primaryType).collect(Collectors.toSet()), false);
            xmlDocs.addAll(foundDocs);
        }
        return xmlDocs;
    }

    public List<LeosDocument> findDocumentsByRef(final String ref) {
        List<LeosDocument> xmlDocs = new ArrayList<>();
        List<DocumentV> docs = documentVRepository.findDocumentsByRef(ref);
        for (DocumentV doc : docs) {
            xmlDocs.add(ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, doc));
        }
        return xmlDocs;
    }

    public List<LeosDocument> findDocumentsStatus(final String status) {
        return milestoneDocumentService.findMilestonesByStatus(status);
    }

    private DocumentContent updateDocument(final Document doc, Map<String, ?> metadata, final String labelVersion, int versionType,
                                byte[] contentBytes, String comments, String userId) throws RepositoryException {

        Boolean eeaRelevance = ConversionUtils.convertBoolean(metadata.get(PropertiesMetadata.EEA_RELEVANCE.getLeosName()));
        if (eeaRelevance == null) {
            eeaRelevance = false;
        }

        DocumentVersion docVersion = updateDocumentVersion(doc, userId, versionType, labelVersion, comments);
        return updateDocumentContent(docVersion, userId, eeaRelevance, new String(contentBytes, StandardCharsets.UTF_8), metadata);
    }

    private DocumentContent updateDocumentWithoutContent(final Document doc, Map<String, ?> metadata, final String labelVersion,
                                int versionType, String comments, String userId) throws RepositoryException {
        Boolean eeaRelevance = ConversionUtils.convertBoolean(metadata.get(PropertiesMetadata.EEA_RELEVANCE.getLeosName()));
        if (eeaRelevance == null) {
            eeaRelevance = false;
        }

        Optional<DocumentV> docView = documentVRepository.findLastVersionByDocumentId(doc.getId());

        if (docView.isPresent()) {
            DocumentVersion docVersion = updateDocumentVersion(doc, userId, versionType, labelVersion, comments);
            return updateDocumentContent(docVersion, userId, eeaRelevance, docView.get().getContent(), metadata);
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
        docVersion.setIsLatestMajorVersion(versionType == 1);
        docVersion.setIsMajorVersion(versionType == 1);

        // These values are not used
        docVersion.setIsVersionSeriesCheckedOut(false);
        docVersion.setVersionSeriesId(labelVersion);

        return documentVersionRepository.save(docVersion);
    }

    private DocumentContent updateDocumentContent(DocumentVersion docVersion, String userId,
                                             Boolean eeaRelevance, String contentString, Map<String, ?> metadata) throws RepositoryException {
        DocumentContent content = new DocumentContent();
        content.setContent(contentString);
        content.setCreatedBy(userId);
        content.setCreationDate(LocalDateTime.now());
        content.setLastModifiedBy(userId);
        content.setLastModificationDate(LocalDateTime.now());
        content.setEeaRelevance(eeaRelevance);
        content.setTemplate((String) metadata.get(PropertiesMetadata.TEMPLATE.getLeosName()));
        content.setDocPurpose((String) metadata.get(PropertiesMetadata.DOC_PURPOSE.getLeosName()));
        content.setDocType((String) metadata.get(PropertiesMetadata.DOC_TYPE.getLeosName()));
        content.setVersion(docVersion);
        content.setTitle((String) metadata.get(PropertiesMetadata.TITLE.getLeosName()));
        content.setCategoryCode((String) metadata.get(PropertiesMetadata.CATEGORY.getLeosName()));
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
