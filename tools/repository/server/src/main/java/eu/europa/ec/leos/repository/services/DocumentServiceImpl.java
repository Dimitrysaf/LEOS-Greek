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

import eu.europa.ec.leos.repository.common.VersionType;
import eu.europa.ec.leos.repository.entities.DocumentCategories;
import eu.europa.ec.leos.repository.entities.DocumentContent;
import eu.europa.ec.leos.repository.entities.DocumentV;
import eu.europa.ec.leos.repository.entities.Document;
import eu.europa.ec.leos.repository.entities.DocumentVersion;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.Collaborator;
import eu.europa.ec.leos.repository.model.Template;
import eu.europa.ec.leos.repository.model.XmlDocument;
import eu.europa.ec.leos.repository.repositories.DocumentCategoriesRepository;
import eu.europa.ec.leos.repository.repositories.DocumentContentRepository;
import eu.europa.ec.leos.repository.repositories.DocumentPropertiesVRepository;
import eu.europa.ec.leos.repository.repositories.DocumentRepository;
import eu.europa.ec.leos.repository.repositories.DocumentVRepository;
import eu.europa.ec.leos.repository.repositories.DocumentVersionRepository;
import eu.europa.ec.leos.repository.repositories.PackageRepository;
import eu.europa.ec.leos.repository.utils.ConversionUtils;
import eu.europa.ec.leos.repository.utils.PropertiesMetadata;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

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
    private final DocumentPropertiesVRepository documentPropertiesVRepository;
    private final PackageRepository packageRepository;
    private final PackageService packageService;
    private final TemplateService templateService;
    private final CollaboratorsService collaboratorsService;

    @Autowired
    public DocumentServiceImpl(DocumentRepository documentRepository, DocumentVRepository documentVRepository, DocumentVersionRepository documentVersionRepository, DocumentContentRepository documentContentRepository, DocumentCategoriesRepository documentCategoriesRepository, DocumentPropertiesVRepository documentPropertiesVRepository, PackageRepository packageRepository, PackageService packageService, TemplateService templateService, CollaboratorsService collaboratorsService) {
        this.documentRepository = documentRepository;
        this.documentVRepository = documentVRepository;
        this.documentVersionRepository = documentVersionRepository;
        this.documentContentRepository = documentContentRepository;
        this.documentCategoriesRepository = documentCategoriesRepository;
        this.documentPropertiesVRepository = documentPropertiesVRepository;
        this.packageRepository = packageRepository;
        this.packageService = packageService;
        this.templateService = templateService;
        this.collaboratorsService = collaboratorsService;
    }

    public XmlDocument createDocumentFromContent(final String repositoryId, final String packageName, final String name, Map<String, ?> metadata,
                                                 final String labelVersion,
                                                 int versionType, byte[] contentBytes, String comments) throws RepositoryException {
        checkMetadata(metadata);

        String createdBy = (String) metadata.get(PropertiesMetadata.CREATED_BY.getLeosName());
        LocalDateTime creationDate =
                ConversionUtils.convertToLocalDateTime(ConversionUtils.getDateFromString((String) metadata.get(PropertiesMetadata.CREATION_DATE.getLeosName())
                        , ConversionUtils.LEOS_REPO_DATE_FORMAT));

        // FIRST STEP: get package
        Optional<Package> pkg = packageRepository.findPackageByName(repositoryId, packageName);
        if (!pkg.isPresent()) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Package.class.getName());
        }
        DocumentCategories docCat
                = documentCategoriesRepository.findDocumentCategoriesByCategoryCode((String) metadata.get(PropertiesMetadata.CATEGORY.getLeosName()));
        if (docCat == null) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentCategories.class.getName());
        }

        Document doc = new Document();
        doc.setName(name);
        doc.setAuditCBy(createdBy);
        doc.setAuditCDate(creationDate);
        doc.setAuditLastMBy(createdBy);
        doc.setAuditLastMDate(LocalDateTime.now());
        doc.setPackageId(pkg.get());
        doc.setDocStage((String) metadata.get(PropertiesMetadata.DOC_STAGE.getLeosName()));
        doc.setDocTemplate((String) metadata.get(PropertiesMetadata.DOC_TEMPLATE.getLeosName()));
        doc.setRef((String) metadata.get(PropertiesMetadata.REF.getLeosName()));
        doc.setLanguage((String) metadata.get(PropertiesMetadata.LANGUAGE.getLeosName()));
        doc.setProcedureType((String) metadata.get(PropertiesMetadata.DOC_TYPE.getLeosName()));
        List<Collaborator> collaborators = ConversionUtils.getLeosCollaboratorsFromString((String) metadata.get(PropertiesMetadata.COLLABORATORS.getLeosName()));
        collaboratorsService.updateCollaborators(pkg.get(), collaborators, createdBy);
        doc.setCategoryId(docCat);
        if (metadata.get(PropertiesMetadata.CLONED_PROPOSAL.getLeosName()) != null) {
            doc.setOriginalRef(new BigDecimal(Long.valueOf((String) metadata.get(PropertiesMetadata.ORIGIN_REF.getLeosName()))));
            doc.setClonedFrom(new BigDecimal(Long.valueOf((String) metadata.get(PropertiesMetadata.CLONED_FROM.getLeosName()))));
            doc.setRevisionStatus((String) metadata.get(PropertiesMetadata.REVISION_STATUS.getLeosName()));
        }
        doc = documentRepository.save(doc);
        if (doc == null) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, Document.class.getName());
        }

        updateDocument(doc, metadata, labelVersion, versionType, contentBytes, comments, createdBy);
        return ConversionUtils.buildXmlDocument(documentVRepository, collaboratorsService, documentPropertiesVRepository, doc.getId());
    }

    public XmlDocument createDocumentFromSource(final String repositoryId, final String sourceDocumentName, final String packageName, final String name, Map<String, ?> metadata,
                                       final String labelVersion, int versionType, String comments)  throws RepositoryException {
        Template template = templateService.findTemplateByName(sourceDocumentName, metadata);
        return createDocumentFromContent(repositoryId, packageName, name, metadata, labelVersion, versionType, template.getSource(), comments);
    }

    public XmlDocument updateDocument(final String documentId, Map<String, ?> metadata, final String labelVersion,
                                    int versionType, byte[] contentBytes, String comments, String userId) throws RepositoryException {
        Boolean isMajor = versionType == 1;
        checkMetadata(metadata);

        Optional<DocumentV> docView = documentVRepository.findVersionByVersionId(new BigDecimal(Long.parseLong(documentId)));
        if (!docView.isPresent()) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentV.class.getName());
        }
        Optional<Document> doc = documentRepository.findById(docView.get().getDocumentId());
        if (!doc.isPresent()) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Document.class.getName());
        }

        Optional<DocumentVersion> latestVersion = documentVersionRepository.findLastVersionByDocumentId(doc.get().getId());
        Optional<DocumentVersion> latestMajorVersion = Optional.empty();
        if (isMajor) {
            latestMajorVersion = documentVersionRepository.findLastMajorVersionByDocumentId(doc.get().getId());
        }

        updateDocumentMetadata(doc.get(), (Map<String, Object>) metadata, userId);
        updateDocument(doc.get(), metadata, labelVersion, versionType, contentBytes, comments, userId);

        if (latestVersion.isPresent()) {
            latestVersion.get().setIsLatestVersion(false);
            documentVersionRepository.save(latestVersion.get());
        }
        if (latestMajorVersion.isPresent()) {
            latestMajorVersion.get().setIsLatestMajorVersion(false);
            documentVersionRepository.save(latestMajorVersion.get());
        }

        return ConversionUtils.buildXmlDocument(documentVRepository, collaboratorsService, documentPropertiesVRepository, doc.get().getId());
    }

    public XmlDocument updateDocument(final String documentId, Map<String, ?> metadata, final String labelVersion,
                                      int versionType, String comments, String userId) throws RepositoryException {
        Boolean isMajor = versionType == 1;
        checkMetadata(metadata);

        Optional<DocumentV> docView = documentVRepository.findVersionByVersionId(new BigDecimal(Long.parseLong(documentId)));
        if (!docView.isPresent()) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentV.class.getName());
        }
        Optional<Document> doc = documentRepository.findById(docView.get().getDocumentId());
        if (!doc.isPresent()) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Document.class.getName());
        }

        Optional<DocumentVersion> latestVersion = documentVersionRepository.findLastVersionByDocumentId(doc.get().getId());
        Optional<DocumentVersion> latestMajorVersion = Optional.empty();
        if (isMajor) {
            latestMajorVersion = documentVersionRepository.findLastMajorVersionByDocumentId(doc.get().getId());
        }

        updateDocumentMetadata(doc.get(), (Map<String, Object>) metadata, userId);
        updateDocumentWithoutContent(doc.get(), metadata, labelVersion, versionType, comments, userId);

        if (latestVersion.isPresent()) {
            latestVersion.get().setIsLatestVersion(false);
            documentVersionRepository.save(latestVersion.get());
        }
        if (latestMajorVersion.isPresent()) {
            latestMajorVersion.get().setIsLatestMajorVersion(false);
            documentVersionRepository.save(latestMajorVersion.get());
        }

        return ConversionUtils.buildXmlDocument(documentVRepository, collaboratorsService, documentPropertiesVRepository, doc.get().getId());
    }

    public void deleteDocumentById(String id) throws RepositoryException {
        Optional<DocumentV> docView = documentVRepository.findVersionByVersionId(new BigDecimal(Long.parseLong(id)));
        if (!docView.isPresent()) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentV.class.getName());
        }
        Optional<Document> doc = documentRepository.findById(docView.get().getDocumentId());
        if (doc.isPresent()) {
            documentRepository.delete(doc.get());
        }
        List<DocumentVersion> versions = documentVersionRepository.findAllVersionsByDocumentId(docView.get().getDocumentId());
        for (DocumentVersion v :versions) {
            documentVersionRepository.delete(v);
        }
    }

    public XmlDocument findDocumentById(final String versionId, final boolean latest) {
        Optional<DocumentV> docView = documentVRepository.findVersionByVersionId(new BigDecimal(Long.parseLong(versionId)));
        if (docView.isPresent() && latest && !docView.get().isLatestVersion()) {
            docView = documentVRepository.findLastVersionByDocumentId(docView.get().getDocumentId());
        }
        return ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, docView.isPresent() ? docView.get() : null);
    }

    public XmlDocument findLatestMajorVersionById(final String versionId) {
        Optional<DocumentV> docView = documentVRepository.findLatestMajorVersionById(new BigDecimal(Long.parseLong(versionId)));
        return ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, docView.isPresent() ? docView.get() : null);
    }

    public XmlDocument findFirstVersion(final String versionId, final String docRef) {
        Optional<DocumentV> docView = documentVRepository.findVersionByVersionId(new BigDecimal(Long.parseLong(versionId)));
        if (docView.isPresent()) {
            docView = documentVRepository.findFirstVersion(docView.get().getDocumentId(), docRef);
        }
         return ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, docView.isPresent() ? docView.get() : null);
    }

    public XmlDocument findDocumentByVersion(final String id, final String docRef, final String versionLabel) {
        Optional<DocumentV> docView = documentVRepository.findVersionByVersionId(new BigDecimal(Long.parseLong(id)));
        if (docView.isPresent()) {
            docView = documentVRepository.findDocumentByVersion(docView.get().getDocumentId(),docRef, versionLabel);
        }
        return ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, docView.isPresent() ? docView.get() : null);
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

    private Document updateDocumentMetadata(Document doc, Map<String, Object> metadata, String userId) throws RepositoryException {
        List<Collaborator> collaborators = ConversionUtils.getLeosCollaboratorsFromString((String) metadata.get(PropertiesMetadata.COLLABORATORS.getLeosName()));
        collaboratorsService.updateCollaborators(doc.getPackageId(), collaborators, userId);
        doc.setBaseRevisionId(metadata.get(PropertiesMetadata.BASE_REVISION_ID.getLeosName()) != null ?
                new BigDecimal(Long.valueOf((String) metadata.get(PropertiesMetadata.BASE_REVISION_ID.getLeosName()))) : null);
        if (metadata.get(PropertiesMetadata.CLONED_PROPOSAL.getLeosName()) != null) {
            doc.setOriginalRef(metadata.get(PropertiesMetadata.ORIGIN_REF.getLeosName()) != null ?
                    new BigDecimal(Long.valueOf((String) metadata.get(PropertiesMetadata.ORIGIN_REF.getLeosName()))) : null);
            doc.setClonedFrom(metadata.get(PropertiesMetadata.BASE_REVISION_ID.getLeosName()) != null ?
                    new BigDecimal(Long.valueOf((String) metadata.get(PropertiesMetadata.BASE_REVISION_ID.getLeosName()))) : null);
            doc.setRevisionStatus((String) metadata.get(PropertiesMetadata.REVISION_STATUS.getLeosName()));
            doc.setContributionStatus((String) metadata.get(PropertiesMetadata.CONTRIBUTION_STATUS.getLeosName()));
        }
        Document document = documentRepository.save(doc);
        if (document == null) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, Document.class.getName());
        }
        return document;
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

    public List<XmlDocument> findAllMinorsForIntermediate(final String docRef, String currIntVersion, final int startIndex, final int maxResults) {
        List<XmlDocument> docs = new ArrayList<>();
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

    public List<XmlDocument> findAllMajors(final String docRef, final int startIndex, final int maxResult)  {
        PageRequest pageRequest =
                PageRequest.of(startIndex, maxResult, Sort.Direction.DESC, "docAuditLastMDate");
        Page<DocumentV> docViews = documentVRepository.findAllMajors(docRef, pageRequest);
        List<XmlDocument> docs = new ArrayList<>();
        for (DocumentV doc : docViews) {
            docs.add(ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, doc));
        }
        return docs;
    }

    public List<XmlDocument> findRecentMinorVersions(final String docRef, String lastMajorVersion, final int startIndex, final int maxResults) {
        List<XmlDocument> xmlDocs = new ArrayList<>();
        lastMajorVersion = buildMinorVersionsGreaterThanMajorRegularExp(lastMajorVersion, true);
        PageRequest pageRequest =
                PageRequest.of(startIndex, maxResults, Sort.Direction.DESC, "docAuditLastMDate");
        Page<DocumentV> docs = documentVRepository.findRecentMinorVersions(docRef, lastMajorVersion, pageRequest);
        for (DocumentV doc : docs) {
            xmlDocs.add(ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, doc));
        }
        return xmlDocs;
    }

    public List<XmlDocument> findDocumentsByUserId(final String userId, final String primaryType, final String leosAuthority) {
        List<XmlDocument> xmlDocs = new ArrayList<>();
        List<String> pkgIdsList = collaboratorsService.findDocumentsByUserId(userId, leosAuthority);
        for (String pkgId : pkgIdsList) {
            List<XmlDocument> foundDocs = packageService.findDocumentsByPackageId(pkgId, Stream.of(primaryType).collect(Collectors.toSet()), false);
            xmlDocs.addAll(foundDocs);
        }
        return xmlDocs;
    }

    public List<XmlDocument> findDocumentsByRef(final String ref) {
        List<XmlDocument> xmlDocs = new ArrayList<>();
        List<DocumentV> docs = documentVRepository.findDocumentsByRef(ref);
        for (DocumentV doc : docs) {
            xmlDocs.add(ConversionUtils.buildXmlDocument(documentPropertiesVRepository, collaboratorsService, doc));
        }
        return xmlDocs;
    }

    private void updateDocument(final Document doc, Map<String, ?> metadata, final String labelVersion, int versionType,
                                byte[] contentBytes, String comments, String userId) throws RepositoryException {

        Boolean eeaRelevance = ConversionUtils.convertBoolean(metadata.get(PropertiesMetadata.EEA_RELEVANCE.getLeosName()));
        if (eeaRelevance == null) {
            eeaRelevance = false;
        }

        DocumentVersion docVersion = updateDocumentVersion(doc, userId, versionType, labelVersion, comments);
        updateDocumentContent(docVersion, userId, eeaRelevance, new String(contentBytes, StandardCharsets.UTF_8), metadata);
    }

    private void updateDocumentWithoutContent(final Document doc, Map<String, ?> metadata, final String labelVersion,
                                int versionType, String comments, String userId) throws RepositoryException {
        Boolean eeaRelevance = ConversionUtils.convertBoolean(metadata.get(PropertiesMetadata.EEA_RELEVANCE.getLeosName()));
        if (eeaRelevance == null) {
            eeaRelevance = false;
        }

        Optional<DocumentV> docView = documentVRepository.findLastVersionByDocumentId(doc.getId());

        if (docView.isPresent()) {
            DocumentVersion docVersion = updateDocumentVersion(doc, userId, versionType, labelVersion, comments);
            updateDocumentContent(docVersion, userId, eeaRelevance, docView.get().getContent(), metadata);
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

        docVersion = documentVersionRepository.save(docVersion);
        if (docVersion == null) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, DocumentVersion.class.getName());
        }
        return docVersion;
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
        content.setVersionId(docVersion);
        content.setTitle((String) metadata.get(PropertiesMetadata.TITLE.getLeosName()));
        content.setCategoryCode((String) metadata.get(PropertiesMetadata.CATEGORY.getLeosName()));
        content = documentContentRepository.save(content);
        if (content == null) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, DocumentContent.class.getName());
        }
        return content;
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
