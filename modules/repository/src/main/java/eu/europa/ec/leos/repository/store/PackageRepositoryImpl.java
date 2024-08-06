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
package eu.europa.ec.leos.repository.store;

import eu.europa.ec.leos.domain.repository.LeosExportStatus;
import eu.europa.ec.leos.domain.repository.LeosLegStatus;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.LinkedPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.ExportDocument;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.model.filter.QueryFilter;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.vo.response.FavouritePackageResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

/**
 * Package Repository implementation.
 *
 * @constructor Creates a specific Package Repository, injected with a generic LEOS Repository.
 */
@Repository
public class PackageRepositoryImpl implements PackageRepository {

    private static final Logger logger = LoggerFactory.getLogger(PackageRepositoryImpl.class);

    private final LeosRepository leosRepository;

    @Autowired
    public PackageRepositoryImpl(LeosRepository leosRepository) {
        this.leosRepository = leosRepository;
    }

    @Override
    public LeosPackage createPackage(String path, String name, String originRef, String language, Boolean isTranslated) {
        logger.debug("Creating Package... [path=" + path + ", name=" + name + "]");
        return leosRepository.createPackage(path, name, originRef, language, isTranslated);
    }

    @Override
    public void deletePackage(String path) {
        logger.debug("Deleting Package... [path=" + path + "]");
        leosRepository.deletePackage(path);
    }

    @Override
    public LegDocument createLegDocumentFromContent(String path, String name, String jobId, List<String> milestoneComments, byte[] contentBytes, LeosLegStatus status,
                                                    List<String> containedDocuments) {
        logger.debug("Creating Leg document from content... [path=" + path + ", name=" + name + "]");
        return leosRepository.createLegDocumentFromContent(path, name, jobId, milestoneComments, contentBytes, status, containedDocuments);
    }

    @Override
    public LegDocument findLegDocumentById(String id, boolean latest) {
        logger.debug("Finding  Leg document by ID... [id=" + id + ", latest=" + latest + "]");
        return leosRepository.findDocumentById(id, LegDocument.class, latest);
    }

    @Override
    public LegDocument updateLegDocument(String ref, String id, LeosLegStatus status) {
        logger.debug("Updating Leg document status... [id=" + id + ", status=" + status.name() + "]");
        return leosRepository.updateLegDocument(ref, id, status);
    }

    @Override
    public LegDocument updateLegDocument(String ref, String id, List<String> containedDocuments) {
        logger.debug("Updating contained documents... [id=" + id + "");
        return leosRepository.updateLegDocument(ref, id, containedDocuments);
    }

    @Override
    public LegDocument updateLegDocument(String id, LeosLegStatus status, byte[] content, VersionType versionType, String comment) {
        logger.debug("Updating Leg document status and content... [id=" + id + ", status=" + status.name() + ", content size=" + content.length + ", versionType=" + versionType + ", comment=" + comment + "]");
        return leosRepository.updateLegDocument(id, status, content, versionType, comment);
    }

    @Override
    public LeosPackage findPackageByDocumentId(String documentId) {
        logger.debug("Finding Package by document ID... [documentId=" + documentId + "]");
        return leosRepository.findPackageByDocumentId(documentId);
    }

    @Override
    public LeosPackage findPackageByPackageId(String packageId) {
        logger.debug("Finding Package by package ID... [packageId=" + packageId + "]");
        return leosRepository.findPackageByPackageId(packageId);
    }

    @Override
    public List<LinkedPackage> findLinkedPackageByPackageId(String pkgId) {
        logger.debug("Finding linked Package by package ID... [packageId=" + pkgId + "]");
        return leosRepository.findLinkedPackageByPkgId(pkgId);
    }

    @Override
    public LinkedPackage findLinkedPackageByLinkedPackageId(String linkedPkgId) {
        logger.debug("Finding linked Package by linked package ID... [linkedPackageId=" + linkedPkgId + "]");
        return leosRepository.findLinkedPackageByLinkedPkgId(linkedPkgId);
    }

    @Override
    public <D extends LeosDocument> LeosPackage findPackageByDocumentRef(String documentRef, Class<? extends D> type) {
        logger.debug("Finding Package by document ref... [documentRef=" + documentRef + "]");
        return leosRepository.findPackageByDocumentRef(documentRef, type);
    }

    public FavouritePackageResponse getFavouritePackage(String ref, String userId) {
        return this.leosRepository.getFavouritePackage(ref, userId);
    }

    @Override
    public <D extends LeosDocument> List<D> findDocumentsByPackagePath(String path, Class<? extends D> type, boolean fetchContent) {
        logger.debug("Finding document by package path... [path=" + path + ", type=" + type.getSimpleName() + "]");
        return leosRepository.findDocumentsByParentPath(path, type, false, fetchContent);
    }

    @Override
    public <D extends LeosDocument> D findDocumentByPackagePathAndName(String path, String name, Class<? extends D> type) {
        logger.debug("Finding document by package path... [path=" + path + ", name=" + name + ", type=" + type.getSimpleName() + "]");
        return leosRepository.findDocumentByParentPath(path, name, type);
    }

    @Override
    public LegDocument findLastLegByVersionedReference(String path, String versionedReference) throws Exception {
        logger.debug("Finding document by document reference... [path=$path, versionedReference=$versionedReference]");
        QueryFilter queryFilter = new QueryFilter();
        QueryFilter.Filter filter = new QueryFilter.Filter(QueryFilter.FilterType.containedDocuments.name(), "=", false, versionedReference);
        queryFilter.addFilter(filter);
        QueryFilter.SortOrder sortOrder = new QueryFilter.SortOrder(QueryFilter.FilterType.creationDate.name(), QueryFilter.SORT_DESCENDING);
        queryFilter.addSortOrder(sortOrder);
        // TODO set maximum value using a global constant
        Stream<LegDocument> legDocuments = leosRepository.findPagedDocumentsByParentPath(path, LegDocument.class, true, true, 0, 100, queryFilter);
        Optional<LegDocument> optionalLegDocument = legDocuments.findFirst();
        if (optionalLegDocument.isPresent()) {
            return optionalLegDocument.get();
        } else {
            throw new Exception("Unable to retrieve the Milestone");
        }
    }

    @Override
    public LegDocument findLastContributionByVersionedReferenceAndName(String path, String legFileName, String versionedReference) throws Exception {
        logger.debug("Finding document by document reference... [path=$path, versionedReference=$versionedReference]");
        QueryFilter queryFilter = new QueryFilter();
        QueryFilter.Filter filter = new QueryFilter.Filter(QueryFilter.FilterType.containedDocuments.name(), "=", false, versionedReference);
        queryFilter.addFilter(filter);
        filter = new QueryFilter.Filter(QueryFilter.FilterType.ref.name(), "=", false, legFileName.replace(".leg", ""));
        queryFilter.addFilter(filter);
        QueryFilter.SortOrder sortOrder = new QueryFilter.SortOrder(QueryFilter.FilterType.creationDate.name(), QueryFilter.SORT_DESCENDING);
        queryFilter.addSortOrder(sortOrder);
        // TODO set maximum value using a global constant
        Stream<LegDocument> legDocuments = leosRepository.findPagedDocumentsByParentPath(path, LegDocument.class, true, true, 0, 100, queryFilter);
        Optional<LegDocument> optionalLegDocument = legDocuments.filter((l) -> l.getStatus().equals(LeosLegStatus.CONTRIBUTION_SENT)).findFirst();
        if (optionalLegDocument.isPresent()) {
            return optionalLegDocument.get();
        } else {
            throw new Exception("Unable to retrieve the Milestone");
        }
    }

    @Override
    public LegDocument findLastContributionByVersionedReference(String path, String versionedReference) throws Exception {
        logger.debug("Finding document by document reference... [path=$path, versionedReference=$versionedReference]");
        QueryFilter queryFilter = new QueryFilter();
        QueryFilter.Filter filter = new QueryFilter.Filter(QueryFilter.FilterType.containedDocuments.name(), "=", false, versionedReference);
        queryFilter.addFilter(filter);
        QueryFilter.SortOrder sortOrder = new QueryFilter.SortOrder(QueryFilter.FilterType.creationDate.name(), QueryFilter.SORT_DESCENDING);
        queryFilter.addSortOrder(sortOrder);
        // TODO set maximum value using a global constant
        Stream<LegDocument> legDocuments = leosRepository.findPagedDocumentsByParentPath(path, LegDocument.class, true, true, 0, 100, queryFilter);
        Optional<LegDocument> optionalLegDocument = legDocuments.filter((l) -> l.getStatus().equals(LeosLegStatus.CONTRIBUTION_SENT)).findFirst();
        if (optionalLegDocument.isPresent()) {
            return optionalLegDocument.get();
        } else {
            throw new Exception("Unable to retrieve the Milestone");
        }
    }

    @Override
    public LegDocument findLastContribution(String path, String legFileName) {
        logger.debug("Finding contribution leg document by name ... [path=$path, legFileName=$legFileName]");
        String ref = legFileName.replace(".leg", "");
        QueryFilter queryFilter = new QueryFilter();
        QueryFilter.Filter filter = new QueryFilter.Filter(QueryFilter.FilterType.ref.name(), "=", false, ref);
        queryFilter.addFilter(filter);
        QueryFilter.SortOrder sortOrder = new QueryFilter.SortOrder(QueryFilter.FilterType.creationDate.name(), QueryFilter.SORT_DESCENDING);
        queryFilter.addSortOrder(sortOrder);
        // TODO set maximum value using a global constant
        Stream<LegDocument> legDocuments = leosRepository.findPagedDocumentsByParentPath(path, LegDocument.class, true, true, 0, 100, queryFilter);
        Optional<LegDocument> optionalLegDocument = legDocuments.filter((l) -> l.getStatus().equals(LeosLegStatus.CONTRIBUTION_SENT)).findFirst();
        if (optionalLegDocument.isPresent()) {
            return optionalLegDocument.get();
        } else {
            throw new RuntimeException("Unable to retrieve the Milestone");
        }
    }

    @Override
    public <D extends LeosDocument> List<D> findDocumentsByPackageId(String id, Class<? extends D> type, boolean allVersion, boolean fetchContent) {
        logger.debug("Finding document by package id... [pkgId=" + id + ", type=" + type.getSimpleName() + "]");
        return leosRepository.findDocumentsByPackageId(id, type, allVersion, fetchContent);
    }

    @Override
    public <D extends LeosDocument> List<D> findDocumentsByUserId(String userId, Class<? extends D> type, String leosAuthority) {
        logger.debug("Finding document by user... userId=" + userId);
        return leosRepository.findDocumentsByUserId(userId, type, leosAuthority);
    }

    @Override
    public <D extends LeosDocument> List<D> findDocumentsByStatus(LeosLegStatus status, Class<? extends D> type) {
        logger.debug("Finding documents by status... status=" + status);
        return leosRepository.findDocumentsByStatus(status, type);
    }

    @Override
    public ExportDocument createExportDocumentFromContent(String path, String name, List<String> comments, byte[] contentBytes, LeosExportStatus status) {
        logger.debug("Creating Export document from content... [path=" + path + ", name=" + name + "]");
        return leosRepository.createExportDocumentFromContent(path, name, comments, contentBytes, status);
    }

    @Override
    public ExportDocument updateExportDocument(String id, LeosExportStatus status, byte[] contentBytes, VersionType versionType, String comment) {
        logger.debug("Updating Export document status and content... [id=" + id + ", status=" + status.name() + ", content size=" + contentBytes.length + ", versionType=" + versionType + ", comment=" + comment + "]");
        return leosRepository.updateExportDocument(id, status, contentBytes, versionType, comment);
    }

    @Override
    public ExportDocument updateExportDocument(String ref, String id, LeosExportStatus status) {
        logger.debug("Updating Export document status... [id=" + id + ", status=" + status.name() + "]");
        return leosRepository.updateExportDocument(ref, id, status);
    }

    @Override
    public ExportDocument updateExportDocument(String ref, String id, List<String> comments) {
        logger.debug("Updating Export document comments... [id=" + id + ", comments=" + comments + "]");
        return leosRepository.updateExportDocument(ref, id, comments);
    }

    @Override
    public void deleteExportDocument(String id) {
        logger.debug("Deleting Export document... [id=" + id + "]");
        leosRepository.deleteDocumentById(id);
    }

    @Override
    public ExportDocument findExportDocumentById(String id, boolean latest) {
        logger.debug("Finding Export document by ID... [id=" + id + ", latest=" + latest + "]");
        return leosRepository.findDocumentById(id, ExportDocument.class, latest);
    }
}
