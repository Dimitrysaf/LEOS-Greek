package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.controllers.requests.QueryFilter;
import eu.europa.ec.leos.repository.entities.Document;
import eu.europa.ec.leos.repository.entities.DocumentMilestone;
import eu.europa.ec.leos.repository.entities.DocumentMilestoneList;
import eu.europa.ec.leos.repository.entities.MilestoneV;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.repositories.DocumentMilestoneListRepository;
import eu.europa.ec.leos.repository.repositories.DocumentMilestoneRepository;
import eu.europa.ec.leos.repository.repositories.MilestoneVRepository;
import eu.europa.ec.leos.repository.utils.ConversionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MilestoneDocumentServiceImpl implements MilestoneDocumentService {

    private static final Logger LOG = LoggerFactory.getLogger(MilestoneDocumentServiceImpl.class);

    @Autowired
    private MilestoneVRepository milestoneVRepository;
    @Autowired
    private DocumentMilestoneListRepository documentMilestoneListRepository;
    @Autowired
    private DocumentMilestoneRepository documentMilestoneRepository;
    @Autowired
    private EntityManager entityManager;

    @Override
    public List<LeosDocument> findMilestonesByStatus(String status) {
        List<LeosDocument> legDocuments = new ArrayList<>();
        List<MilestoneV> milestones = milestoneVRepository.findMilestonesByStatus(status);
        // Sort them by names
        Map<String, List<MilestoneV>> sortedByNames =
                milestones.stream().collect(Collectors.groupingBy(MilestoneV::getName));
        for (Map.Entry<String, List<MilestoneV>> entry : sortedByNames.entrySet()) {
            legDocuments.add(ConversionUtils.buildLegDocument(entry.getValue().get(0), documentMilestoneListRepository, documentMilestoneRepository, false));
        }
        return legDocuments;
    }

    @Override
    public List<LeosDocument> findMilestoneByName(final String fileName) {
        List<LeosDocument> listDocs = new ArrayList<>();
        List<MilestoneV> docs = milestoneVRepository.findMilestonesByName(fileName);
        for (MilestoneV doc : docs) {
            listDocs.add(ConversionUtils.buildLegDocument(doc, documentMilestoneListRepository, documentMilestoneRepository, true));
        }
        return listDocs;
    }

    @Override
    public Optional<LeosDocument> findMilestoneByRef(final String ref) {
        Optional<MilestoneV> doc = milestoneVRepository.findMilestonesByRef(ref);
        return doc.map(milestoneV -> ConversionUtils.buildLegDocument(milestoneV, documentMilestoneListRepository, documentMilestoneRepository, true));
    }

    @Override
    public Optional<LeosDocument> findMilestoneById(BigDecimal id) {
        Optional<MilestoneV> doc = milestoneVRepository.findMilestonesById(id);
        return doc.map(milestoneV -> ConversionUtils.buildLegDocument(milestoneV, documentMilestoneListRepository, documentMilestoneRepository, true));
    }

    @Override
    public List<LeosDocument> findMilestoneByPackageId(final String pkgId, final boolean fetchContent) throws RepositoryException {
        try {
            List<MilestoneV> docs = milestoneVRepository.findMilestonesByPackageId(new BigDecimal(Long.parseLong(pkgId)));
            return ConversionUtils.buildLegDocuments(docs, documentMilestoneRepository, documentMilestoneListRepository, fetchContent);
        } catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, LeosDocument.class.getName());
        }
    }

    @Override
    public LeosDocument createMilestoneFromContent(final Document doc, Map<String, ?> metadata,
                                                   byte[] contentBytes, final String userId) throws RepositoryException {
        DocumentMilestone documentMilestone = createDocumentMilestone(doc, contentBytes, userId, metadata);
        return ConversionUtils.buildLegDocument(documentMilestone, documentMilestoneListRepository);
    }

    @Override
    public LeosDocument updateMilestoneMetadata(final BigDecimal milestoneId, Map<String, ?> metadata, String userId) throws RepositoryException {
        try {
            DocumentMilestone docMilestone = documentMilestoneRepository.findById(milestoneId).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentMilestone.class.getName()));
            docMilestone.setAuditLastMBy(userId);
            docMilestone.setAuditLastMDate(LocalDateTime.now());
            docMilestone = updateMilestoneComments(docMilestone, metadata);
            docMilestone = documentMilestoneRepository.save(docMilestone);
            return ConversionUtils.buildLegDocument(docMilestone, documentMilestoneListRepository);
        } catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentMilestone.class.getName());
        }
    }

    @Override
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
            docMilestone = updateMilestoneComments(docMilestone, metadata);
            docMilestone = documentMilestoneRepository.save(docMilestone);
            return ConversionUtils.buildLegDocument(docMilestone, documentMilestoneListRepository);
        } catch (Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, DocumentMilestone.class.getName());
        }
    }

    private DocumentMilestone updateMilestoneComments(DocumentMilestone docMilestone, Map<String, ?> metadata) throws RepositoryException {
        if (metadata.get("milestoneComments") != null) {
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
        if (metadata.get("comments") != null) {
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
        if (metadata.get("jobId") != null) {
            docMilestone.setJobId((String) metadata.get("jobId"));
        }
        return docMilestone;
    }

    private DocumentMilestone createDocumentMilestone(Document doc, byte[] content, String updatedBy,
                                                      Map<String, ?> metadata) throws RepositoryException {
        DocumentMilestone docMilestone = new DocumentMilestone();
        docMilestone.setAuditCBy(updatedBy);
        docMilestone.setAuditCDate(LocalDateTime.now());
        docMilestone.setAuditLastMBy(updatedBy);
        docMilestone.setAuditLastMDate(LocalDateTime.now());
        docMilestone.setDocument(doc);
        if (metadata.get("status") == null) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Missing parameter 'status'");
        }
        docMilestone = updateMilestoneComments(docMilestone, metadata);

        docMilestone.setContent(content);
        if (metadata.get("jobDate") != null) {
            docMilestone.setJobDate(ConversionUtils.convertToLocalDateTime(ConversionUtils.getDateFromString((String) metadata.get("jobDate")
                    , ConversionUtils.LEOS_REPO_DATE_FORMAT)));
        }
        if (metadata.get("exportDate") != null) {
            docMilestone.setJobDate(ConversionUtils.convertToLocalDateTime(ConversionUtils.getDateFromString((String) metadata.get("exportDate")
                    , ConversionUtils.LEOS_REPO_DATE_FORMAT)));
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

    @Override
    public List<LeosDocument> findMilestonesUsingFilter(final String packageName, final Set<String> categories, final QueryFilter queryFilter,
                                                        final int startIndex, final int maxResults, final boolean fetchContent) {
        StringBuilder queryBuild = new StringBuilder("SELECT m ");
        queryBuild.append(" FROM MilestoneV m");
        Query query = createQuery(queryBuild, packageName, categories, queryFilter, true);
        List<MilestoneV> docs = query.setFirstResult(startIndex).setMaxResults(maxResults).getResultList();
        return ConversionUtils.buildLegDocuments(docs, documentMilestoneRepository, documentMilestoneListRepository, fetchContent);
    }

    @Override
    public long countMilestonesUsingFilter(final String packageName, final Set<String> categories, final QueryFilter queryFilter) {
        StringBuilder queryBuild = new StringBuilder("SELECT COUNT(m) ");
        queryBuild.append(" FROM MilestoneV m");
        Query query = createQuery(queryBuild, packageName, categories, queryFilter, false);
        long count = (long) query.getSingleResult();
        return count;
    }

    private Query createQuery(StringBuilder queryBuild, String packageName, Set<String> categories, QueryFilter queryFilter, boolean orderBy) {
        final List<QueryFilter.Filter> filters = queryFilter.getFilters();
        final Class objectClass = MilestoneV.class;
        queryBuild.append(" WHERE 1 = 1");
        if (!packageName.equals("%")) {
            queryBuild.append(" AND m.packageName = :packageName");
        }
        if (!categories.isEmpty()) {
            queryBuild.append(" AND m.categoryCode IN (:categoryList)");
        }
        enrichQueryWithProcedureTypeAndTemplate(queryBuild, filters, objectClass);
        Optional<QueryFilter.Filter> docsFilter = enrichQueryWithDocumentMilestone(queryBuild, filters);
        if(orderBy) {
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
        setParametersForDocumentMilestone(query, docsFilter);
        return query;
    }

    private Optional<QueryFilter.Filter> enrichQueryWithDocumentMilestone(StringBuilder queryBuild, List<QueryFilter.Filter> filters) {
        Optional<QueryFilter.Filter> docsFilter = filters.stream().filter(f -> f.key.equals("containedDocuments")).findFirst();
        if (docsFilter.isPresent()) {
            queryBuild.append(" AND m.milestoneId IN (");
            queryBuild.append("     SELECT l.milestone.id");
            queryBuild.append("     FROM DocumentMilestoneList l ");
            queryBuild.append("     WHERE l.containedDocuments IN (:docsFilter)");
            queryBuild.append(" )");
        }
        return docsFilter;
    }

    private void setParametersForDocumentMilestone(Query query, Optional<QueryFilter.Filter> docsFilter) {
        if (docsFilter.isPresent()) {
            query.setParameter("docsFilter", Arrays.asList(docsFilter.get().value));
        }
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
                } else {
                    if (filter.nullCheck) {
                        queryBuild.append(" OR ");
                    }
                    else {
                        queryBuild.append(" AND ");
                    }
                    queryBuild.append(columnName);
                    queryBuild.append(" ").append(filter.operator).append(" ");
                    queryBuild.append(" :keyValue_").append(i);
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
                    query.setParameter("valueList_" + i, Arrays.asList(filter.value));
                } else {
                    //query.setParameter("op_" + i, filter.operator);
                    query.setParameter("keyValue_" + i, Arrays.asList(filter.value));
                }
            } catch (NoSuchFieldException e) {
                continue;
            }
            break;
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

    @Override
    public void deleteMilestoneByRef(Document doc) {
        List<DocumentMilestone> milestones = documentMilestoneRepository.findDocumentMilestonesByDocument(doc);
        for (DocumentMilestone m : milestones) {
            List<DocumentMilestoneList> milestonesList = documentMilestoneListRepository.findDocumentMilestoneListsByMilestone(m);
            documentMilestoneListRepository.deleteAll(milestonesList);
        }
        documentMilestoneRepository.deleteAll(milestones);
    }
}
