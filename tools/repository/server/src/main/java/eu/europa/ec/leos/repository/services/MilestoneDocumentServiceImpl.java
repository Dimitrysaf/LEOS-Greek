package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.entities.Document;
import eu.europa.ec.leos.repository.entities.DocumentMilestone;
import eu.europa.ec.leos.repository.entities.DocumentMilestoneList;
import eu.europa.ec.leos.repository.entities.MilestoneV;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.repositories.DocumentCategoriesRepository;
import eu.europa.ec.leos.repository.repositories.DocumentMilestoneListRepository;
import eu.europa.ec.leos.repository.repositories.DocumentMilestoneRepository;
import eu.europa.ec.leos.repository.repositories.MilestoneVRepository;
import eu.europa.ec.leos.repository.utils.ConversionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    public List<LeosDocument> findMilestoneByPackageNameAndFileName(final String packageName, final String fileName) {
        List<LeosDocument> listDocs = new ArrayList<>();
        List<MilestoneV> docs = milestoneVRepository.findMilestonesByPackageNameAndName(packageName, fileName);
        for (MilestoneV doc : docs) {
            listDocs.add(ConversionUtils.buildLegDocument(doc, documentMilestoneListRepository, documentCategoriesRepository));
        }
        return listDocs;
    }

    public LeosDocument createMilestoneFromContent(final Document doc, Map<String, ?> metadata,
                                                   byte[] contentBytes, final String userId) throws RepositoryException {
        DocumentMilestone documentMilestone = createDocumentMilestone(doc, contentBytes, userId, metadata);
        return ConversionUtils.buildLegDocument(documentMilestone, documentMilestoneListRepository);
    }

    public LeosDocument updateMilestone(final String milestoneId, Map<String, ?> metadata, String userId) throws RepositoryException {
        try {
            DocumentMilestone docMilestone = documentMilestoneRepository.getById(new BigDecimal(Long.parseLong(milestoneId)));
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
            if (metadata.get("clonedMilestoneId") != null) {
                docMilestone.setClonedMilestoneId(new BigDecimal(Long.parseLong((String) metadata.get("clonedMilestoneId"))));
            }
            docMilestone.setMilestoneId(docMilestone.getId());
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
        docMilestone.setDocumentId(doc);
        if (metadata.get("milestoneComments")  == null) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Missing parameter 'milestoneComments'");
        } else {
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

        docMilestone.setMilestoneId(new BigDecimal(0));
        docMilestone.setContent(content);

        if (metadata.get("status")  == null) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Missing parameter 'status'");
        }
        docMilestone.setStatus((String) metadata.get("status"));
        if (metadata.get("jobDate")  != null) {
            docMilestone.setJobDate(ConversionUtils.convertToLocalDateTime(ConversionUtils.getDateFromString((String) metadata.get("jobDate")
                    , ConversionUtils.LEOS_REPO_DATE_FORMAT)));
        }
        if (metadata.get("exportDate")  != null) {
            docMilestone.setJobDate(ConversionUtils.convertToLocalDateTime(ConversionUtils.getDateFromString((String) metadata.get("exportDate")
                    , ConversionUtils.LEOS_REPO_DATE_FORMAT)));
        }
        if (metadata.get("exportStatus")  != null) {
            docMilestone.setExportStatus((String) metadata.get("exportStatus"));
        }
        if (metadata.get("clonedMilestoneId")  != null) {
            docMilestone.setClonedMilestoneId(new BigDecimal(Long.parseLong((String) metadata.get("clonedMilestoneId"))));
        }

        docMilestone = documentMilestoneRepository.save(docMilestone);

        if (metadata.get("containedDocuments")  == null) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.ERROR_WHILE_CREATING, "Missing parameter 'containedDocuments'");
        } else {
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
}
