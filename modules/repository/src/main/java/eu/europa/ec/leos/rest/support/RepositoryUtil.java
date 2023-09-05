package eu.europa.ec.leos.rest.support;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.rest.extensions.LeosMetadataExtensions;
import eu.europa.ec.leos.rest.mapping.RestProperties;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.Collections.emptyList;

public final class RepositoryUtil {

    private static RepositoryPropertiesMapper repositoryPropertiesMapper = new RestProperties();
    
    private RepositoryUtil() {
    }
    
    public static Map<String, ?> updateDocumentProperties(LeosMetadata metadata) {
        Map<String, Object> properties = new HashMap<>();
        properties.putAll(LeosMetadataExtensions.toLeosRepositoryProperties(metadata));
        properties.putAll(updateMilestoneCommentsProperties(Collections.emptyList()));
        return properties;
    }

    public static Map<String, List<String>> updateMilestoneCommentsProperties(List<String> milestoneComments) {
        Map<String, List<String>> result = new HashMap<>();
        result.put(repositoryPropertiesMapper.getId(RepositoryProperties.MILESTONE_COMMENTS), milestoneComments);
        return result;
    }
}
