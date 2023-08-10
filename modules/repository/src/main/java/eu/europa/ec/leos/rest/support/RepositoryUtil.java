package eu.europa.ec.leos.rest.support;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.rest.extensions.LeosMetadataExtensions;
import eu.europa.ec.leos.rest.mapping.RestProperties;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;

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
        return properties;
    }

    public static String addMilestoneCommentsToComments(String comments, List<String> milestoneComments) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            if (comments != null && !milestoneComments.isEmpty()) {
                comments += "::" + mapper.writeValueAsString(milestoneComments);
            } else if (!milestoneComments.isEmpty()) {
                comments = mapper.writeValueAsString(milestoneComments);
            } else {
                return comments;
            }
        } catch (JsonProcessingException e) {
            return comments;
        }
        return comments;
    }


    public static Map<String, Object> updateMilestoneCommentsProperties(Map<String, Object> properties, List<String> milestoneComments) {
        if (properties == null) {
            properties = new HashMap<>();
        }
        if (milestoneComments.isEmpty()) {
            return properties;
        }
        try {
            Object comments = properties.get(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS));
            ObjectMapper mapper = new ObjectMapper();
            if (comments != null) {
                properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS),
                        comments + "::" + mapper.writeValueAsString(milestoneComments));
            } else {
                properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS), mapper.writeValueAsString(milestoneComments));
            }
        } catch (JsonProcessingException e) {
            return properties;
        }
        return properties;
    }
}
