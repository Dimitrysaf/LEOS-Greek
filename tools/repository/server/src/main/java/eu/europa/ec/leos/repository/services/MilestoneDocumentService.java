package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.controllers.requests.QueryFilter;
import eu.europa.ec.leos.repository.entities.Document;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

public interface MilestoneDocumentService {
    List<LeosDocument> findMilestonesByStatus(String status);

    List<LeosDocument> findMilestoneByName(final String fileName);

    Optional<LeosDocument> findMilestoneByRef(final String Ref);

    List<LeosDocument> findMilestoneByPackageId(final String pkgId) throws RepositoryException;

    LeosDocument createMilestoneFromContent(final Document doc, Map<String, ?> metadata,
                                            byte[] contentBytes, final String userId) throws RepositoryException;

    LeosDocument updateMilestoneMetadata(final String milestoneId, Map<String, ?> properties, String userId) throws RepositoryException;

    LeosDocument updateMilestone(final Document doc, byte[] content, Map<String, ?> properties, String userId) throws RepositoryException;

    List<LeosDocument> findMilestonesUsingFilter(final String packageName, final Set<String> categories, final QueryFilter queryFilter, final int startIndex,
                                                 final int maxResults);

    long countMilestonesUsingFilter(final String packageName, final Set<String> categories, final QueryFilter queryFilter);

    void deleteMilestoneByRef(Document doc);
}
