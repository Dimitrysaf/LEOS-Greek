package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.entities.Document;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;

import java.util.List;
import java.util.Map;

public interface MilestoneDocumentService {
    List<LeosDocument> findMilestonesByStatus(String status);

    List<LeosDocument> findMilestoneByPackageNameAndFileName(final String packageName, final String fileName);

    LeosDocument createMilestoneFromContent(final Document doc, Map<String, ?> metadata,
                                            byte[] contentBytes, final String userId) throws RepositoryException;

    LeosDocument updateMilestone(final String milestoneId, Map<String, ?> properties, String userId) throws RepositoryException;
}
