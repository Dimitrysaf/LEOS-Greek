package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.controllers.requests.QueryFilter;
import eu.europa.ec.leos.repository.entities.Document;
import eu.europa.ec.leos.repository.entities.DocumentMilestone;
import eu.europa.ec.leos.repository.entities.DocumentMilestoneList;
import eu.europa.ec.leos.repository.entities.DocumentV;
import eu.europa.ec.leos.repository.entities.MilestoneV;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.repositories.DocumentCategoriesRepository;
import eu.europa.ec.leos.repository.repositories.DocumentMilestoneListRepository;
import eu.europa.ec.leos.repository.repositories.DocumentMilestoneRepository;
import eu.europa.ec.leos.repository.repositories.MilestoneVRepository;
import eu.europa.ec.leos.repository.utils.ConversionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static eu.europa.ec.leos.repository.controllers.requests.QueryFilter.formSortClause;
import static eu.europa.ec.leos.repository.controllers.requests.QueryFilter.getWhereClauseFromQueryFilter;

@Service
public class MilestoneDocumentServiceImpl implements MilestoneDocumentService {

    @Autowired
    private MilestoneVRepository milestoneVRepository;
    @Autowired
    private DocumentMilestoneListRepository documentMilestoneListRepository;
    @Autowired
    private DocumentMilestoneRepository documentMilestoneRepository;
    @Autowired
    private DocumentCategoriesRepository documentCategoriesRepository;
    @Autowired
    private EntityManager entityManager;

    @Value("${repository.default.id}")
    private String repositoryId;

    public List<LeosDocument> findMilestonesByStatus(String status) {
        List<LeosDocument> legDocuments = new ArrayList<>();
        List<MilestoneV> milestones = milestoneVRepository.findMilestonesByStatus(status);
        // Sort them by names
        Map<String, List<MilestoneV>> sortedByNames =
                milestones.stream().collect(Collectors.groupingBy(MilestoneV::getName));
        for (Map.Entry<String,List<MilestoneV>> entry : sortedByNames.entrySet()) {
            legDocuments.add(ConversionUtils.buildLegDocument(entry.getValue().get(0), documentMilestoneListRepository, documentCategoriesRepository));
        }
        return legDocuments;
    }

    public List<LeosDocument> findMilestoneByName(final String fileName) {
        List<LeosDocument> listDocs = new ArrayList<>();
        List<MilestoneV> docs = milestoneVRepository.findMilestonesByName(fileName);
        for (MilestoneV doc : docs) {
            listDocs.add(ConversionUtils.buildLegDocument(doc, documentMilestoneListRepository, documentCategoriesRepository));
        }
        return listDocs;
    }

    public Optional<LeosDocument> findMilestoneByRef(final String ref) {
        List<LeosDocument> listDocs = new ArrayList<>();
        Optional<MilestoneV> doc = milestoneVRepository.findMilestonesByRef(ref);
        return doc.isPresent() ? Optional.of(ConversionUtils.buildLegDocument(doc.get(), documentMilestoneListRepository, documentCategoriesRepository)) :
                Optional.empty();
    }

    public List<LeosDocument> findMilestoneByPackageId(final String pkgId) throws RepositoryException {
        try {
            List<LeosDocument> listDocs = new ArrayList<>();
            List<MilestoneV> docs = milestoneVRepository.findMilestonesByPackageId(new BigDecimal(Long.parseLong(pkgId)));
            for (MilestoneV doc : docs) {
                listDocs.add(ConversionUtils.buildLegDocument(doc, documentMilestoneListRepository, documentCategoriesRepository));
            }
            return listDocs;
        } catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, LeosDocument.class.getName());
        }
    }

    public LeosDocument createMilestoneFromContent(final Document doc, Map<String, ?> metadata,
                                                   byte[] contentBytes, final String userId) throws RepositoryException {
        DocumentMilestone documentMilestone = createDocumentMilestone(doc, contentBytes, userId, metadata);
        return ConversionUtils.buildLegDocument(documentMilestone, documentMilestoneListRepository);
    }

    public LeosDocument updateMilestoneMetadata(final String milestoneId, Map<String, ?> metadata, String userId) throws RepositoryException {
        try {
            DocumentMilestone docMilestone = documentMilestoneRepository.findById(new BigDecimal(Long.parseLong(milestoneId))).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentMilestone.class.getName()));
            docMilestone.setAuditLastMBy(userId);
            docMilestone.setAuditLastMDate(LocalDateTime.now());
            if (metadata.get("milestoneComments")  != null) {
                try {
                    List<String> milestoneCommentsList = (List<String>) metadata.get("milestoneComments");
                    if (milestoneCommentsList.isEmpty()) {
                        throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Wrong value for parameter " +
                                "'milestoneComments'");

                    }
                    docMilestone.setMilestoneComments(milestoneCommentsList.get(0));
                } catch (ClassCastException e) {
                    throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Wrong value for parameter " +
                            "'milestoneComments'");
                }
            }
            if (metadata.get("comments")  != null) {
                try {
                    List<String> milestoneCommentsList = (List<String>) metadata.get("comments");
                    if (milestoneCommentsList.isEmpty()) {
                        throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Wrong value for parameter " +
                                "'comments'");

                    }
                    docMilestone.setMilestoneComments(milestoneCommentsList.get(0));
                } catch (ClassCastException e) {
                    throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Wrong value for parameter " +
                            "'comments'");
                }
            }
            if (metadata.get("status") != null) {
                docMilestone.setStatus((String) metadata.get("status"));
            }
            if (metadata.get("exportStatus") != null) {
                docMilestone.setExportStatus((String) metadata.get("exportStatus"));
            }
            if (metadata.get("exportDate") != null) {
                docMilestone.setExportDate(ConversionUtils.convertToLocalDateTime(ConversionUtils.getDateFromString((String) metadata.get("exportDate")
                        , ConversionUtils.LEOS_REPO_DATE_FORMAT)));
            }
            if (metadata.get("jobId")  != null) {
                docMilestone.setJobId((String) metadata.get("jobId"));
            }
            docMilestone = documentMilestoneRepository.save(docMilestone);
            return ConversionUtils.buildLegDocument(docMilestone, documentMilestoneListRepository);
        } catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentMilestone.class.getName());
        }
    }


    public LeosDocument updateMilestone(final Document doc, byte[] content, Map<String, ?> metadata, String userId) throws RepositoryException {
        try {
            List<DocumentMilestone> docMilestones = documentMilestoneRepository.findDocumentMilestonesByDocument(doc);
            DocumentMilestone docMilestone;
            if (docMilestones.isEmpty()) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentMilestone.class.getName());
            } else {
                docMilestone = docMilestones.get(0);
            }
            docMilestone.setAuditLastMBy(userId);
            docMilestone.setAuditLastMDate(LocalDateTime.now());
            docMilestone.setContent(content);
            if (metadata.get("milestoneComments")  != null) {
                try {
                    List<String> milestoneCommentsList = (List<String>) metadata.get("milestoneComments");
                    if (milestoneCommentsList.isEmpty()) {
                        throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Wrong value for parameter " +
                                "'milestoneComments'");

                    }
                    docMilestone.setMilestoneComments(milestoneCommentsList.get(0));
                } catch (ClassCastException e) {
                    throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Wrong value for parameter " +
                            "'milestoneComments'");
                }
            }
            if (metadata.get("comments")  != null) {
                try {
                    List<String> milestoneCommentsList = (List<String>) metadata.get("milestoneComments");
                    if (milestoneCommentsList.isEmpty()) {
                        throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Wrong value for parameter " +
                                "'comments'");

                    }
                    docMilestone.setMilestoneComments(milestoneCommentsList.get(0));
                } catch (ClassCastException e) {
                    throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Wrong value for parameter " +
                            "'comments'");
                }
            }
            if (metadata.get("status") != null) {
                docMilestone.setStatus((String) metadata.get("status"));
            }
            if (metadata.get("exportStatus") != null) {
                docMilestone.setExportStatus((String) metadata.get("exportStatus"));
            }
            if (metadata.get("exportDate") != null) {
                docMilestone.setExportDate(ConversionUtils.convertToLocalDateTime(ConversionUtils.getDateFromString((String) metadata.get("exportDate")
                        , ConversionUtils.LEOS_REPO_DATE_FORMAT)));
            }
            if (metadata.get("jobId")  != null) {
                docMilestone.setJobId((String) metadata.get("jobId"));
            }
            docMilestone = documentMilestoneRepository.save(docMilestone);
            return ConversionUtils.buildLegDocument(docMilestone, documentMilestoneListRepository);
        } catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentMilestone.class.getName());
        }
    }

    private DocumentMilestone createDocumentMilestone(Document doc, byte[] content, String updatedBy,
                                                      Map<String, ?> metadata) throws RepositoryException {
        DocumentMilestone docMilestone = new DocumentMilestone();
        docMilestone.setAuditCBy(updatedBy);
        docMilestone.setAuditCDate(LocalDateTime.now());
        docMilestone.setAuditLastMBy(updatedBy);
        docMilestone.setAuditLastMDate(LocalDateTime.now());
        docMilestone.setDocument(doc);
        if (metadata.get("milestoneComments")  != null) {
            try {
                List<String> milestoneCommentsList = (List<String>) metadata.get("milestoneComments");
                if (milestoneCommentsList.isEmpty()) {
                    throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Wrong value for parameter " +
                            "'milestoneComments'");

                }
                docMilestone.setMilestoneComments(milestoneCommentsList.get(0));
            } catch (ClassCastException e) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Wrong value for parameter " +
                        "'milestoneComments'");
            }
        }
        if (metadata.get("comments")  != null) {
            try {
                List<String> milestoneCommentsList = (List<String>) metadata.get("comments");
                if (milestoneCommentsList.isEmpty()) {
                    throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Wrong value for parameter " +
                            "'comments'");

                }
                docMilestone.setMilestoneComments(milestoneCommentsList.get(0));
            } catch (ClassCastException e) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Wrong value for parameter " +
                        "'comments'");
            }
        }

        docMilestone.setContent(content);

        if (metadata.get("status")  == null) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Missing parameter 'status'");
        }
        docMilestone.setStatus((String) metadata.get("status"));
        if (metadata.get("jobDate")  != null) {
            docMilestone.setJobDate(ConversionUtils.convertToLocalDateTime(ConversionUtils.getDateFromString((String) metadata.get("jobDate")
                    , ConversionUtils.LEOS_REPO_DATE_FORMAT)));
        }
        if (metadata.get("jobId")  != null) {
            docMilestone.setJobId((String) metadata.get("jobId"));
        }
        if (metadata.get("exportDate")  != null) {
            docMilestone.setJobDate(ConversionUtils.convertToLocalDateTime(ConversionUtils.getDateFromString((String) metadata.get("exportDate")
                    , ConversionUtils.LEOS_REPO_DATE_FORMAT)));
        }
        if (metadata.get("exportStatus")  != null) {
            docMilestone.setExportStatus((String) metadata.get("exportStatus"));
        }

        if (docMilestone.getJobDate() == null) {
            docMilestone.setJobDate(LocalDateTime.now());
        }
        docMilestone = documentMilestoneRepository.save(docMilestone);

        if (metadata.get("containedDocuments") != null) {
            try {
                List<String> containedDocuments = (List<String>) metadata.get("containedDocuments");
                for (String containedDoc : containedDocuments) {
                    DocumentMilestoneList milestoneList = new DocumentMilestoneList();
                    milestoneList.setAuditCDate(LocalDateTime.now());
                    milestoneList.setAuditCBy(updatedBy);
                    milestoneList.setAuditLastMBy(updatedBy);
                    milestoneList.setAuditLastMDate(LocalDateTime.now());
                    milestoneList.setMilestone(docMilestone);
                    milestoneList.setContainedDocuments(containedDoc);
                    milestoneList = documentMilestoneListRepository.save(milestoneList);
                }
            } catch (ClassCastException e) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Wrong value for parameter " +
                        "'containedDocuments'");
            }
        }
        return docMilestone;
    }

    public List<LeosDocument> findMilestonesUsingFilter(final String packageName, final Set<String> categories, final QueryFilter queryFilter, final int startIndex, final int maxResults) {
        //Build query
        StringBuilder queryBuild = new StringBuilder(
                String.format("SELECT m FROM MilestoneV m WHERE ", packageName));
        if (!packageName.equals("%")) {
            queryBuild.append(String.format(" m.packageId IN (SELECT p.id FROM Package p WHERE p.name = '%s' AND p.repositoryId IN (SELECT r.id FROM " +
                    "Repository r WHERE r.cmisId = '%s'))", packageName, repositoryId));
        } else {
            queryBuild.append(String.format(" m.packageId IN (SELECT p.id FROM Package p WHERE p.repositoryId IN (SELECT r.id FROM " +
                    "Repository r WHERE r.cmisId = '%s'))", repositoryId));
        }
        buildQueryWithFilterQuery(queryBuild, categories, queryFilter);

        List<MilestoneV> docs = entityManager.createQuery(queryBuild.toString()).setFirstResult(startIndex).setMaxResults(maxResults).getResultList();
        List<LeosDocument> xmlDocs = new ArrayList<>();
        for (MilestoneV doc : docs) {
            xmlDocs.add(ConversionUtils.buildLegDocument(doc, documentMilestoneListRepository, documentCategoriesRepository));
        }
        return xmlDocs;
    }

    public Long countMilestonesUsingFilter(final String packageName, final Set<String> categories, final QueryFilter queryFilter) {
        //Build query
        StringBuilder queryBuild = new StringBuilder(
                String.format("SELECT COUNT(m) FROM MilestoneV m WHERE", packageName));
        if (!packageName.equals("%")) {
            queryBuild.append(String.format(" m.packageId IN (SELECT p.id FROM Package p WHERE p.name = '%s' AND p.repositoryId IN (SELECT r.id FROM " +
                    "Repository r WHERE r.cmisId = '%s'))", packageName, repositoryId));
        } else {
            queryBuild.append(String.format(" m.packageId IN (SELECT p.id FROM Package p WHERE p.repositoryId IN (SELECT r.id FROM " +
                    "Repository r WHERE r.cmisId = '%s'))", repositoryId));
        }
        buildQueryWithFilterQuery(queryBuild, categories, queryFilter);

        return (Long) entityManager.createQuery(queryBuild.toString()).getSingleResult();
    }

    private void buildQueryWithFilterQuery(StringBuilder queryBuild, final Set<String> categories, final QueryFilter queryFilter) {
        if (!categories.isEmpty()) {
            queryBuild.append(" AND ");
            String categoryStr = categories.stream()
                    .map(a -> "'" + a + "'")
                    .collect(Collectors.joining(","));

            queryBuild.append(String.format("m.categoryId IN (SELECT c.id FROM DocumentCategories c WHERE c.categoryCode IN (%s))",
                    categoryStr));
        }
        String whereFiltersClause = getWhereClauseFromQueryFilter(queryFilter, MilestoneV.class);
        if(!whereFiltersClause.isEmpty()){
            queryBuild.append(" AND ");
            Optional<QueryFilter.Filter> docsFilter = queryFilter.getFilters().stream().filter(f -> f.key.equals("containedDocuments")).findFirst();
            if (docsFilter.isPresent()) {
                StringBuilder value = new StringBuilder("'");
                value.append(StringUtils.join(docsFilter.get().value, "', '"));
                value.append("'");
                queryBuild.append(String.format("m.milestoneId IN (SELECT l.milestone.id FROM DocumentMilestoneList l WHERE l.containedDocuments IN (%s))",
                        value));
                queryFilter.removeFilter("containedDocuments");
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

    public void deleteMilestoneByRef(Document doc) {
        List<DocumentMilestone> milestones = documentMilestoneRepository.findDocumentMilestonesByDocument(doc);
        for (DocumentMilestone m : milestones) {
            List<DocumentMilestoneList> milestonesList = documentMilestoneListRepository.findDocumentMilestoneListsByMilestone(m);
            documentMilestoneListRepository.deleteAll(milestonesList);
        }
        documentMilestoneRepository.deleteAll(milestones);
    }
}
