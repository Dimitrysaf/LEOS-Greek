package eu.europa.ec.leos.services.annotate;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import eu.europa.ec.leos.integration.rest.AnnotateStatusResponse;
import eu.europa.ec.leos.integration.rest.SendTemporaryAnnotationsResponse;
import eu.europa.ec.leos.security.LeosPermission;
import org.apache.jena.atlas.json.JsonArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import eu.europa.ec.leos.integration.AnnotationProvider;
import eu.europa.ec.leos.security.SecurityContext;

@Service
public class AnnotateServiceImpl implements AnnotateService {

    private static final Logger LOG = LoggerFactory.getLogger(AnnotateServiceImpl.class);

    private final SecurityContext securityContext;
    private final AnnotationProvider annotationProvider;

    @Value("${annotate.server.internal.url}")
    private String annotationHost;

    @Autowired
    AnnotateServiceImpl(SecurityContext securityContext, AnnotationProvider annotationProvider) {
        this.securityContext = securityContext;
        this.annotationProvider = annotationProvider;
    }

    @Override
    public String getAnnotations(String docName, String proposalRef) {

        URI uri = UriComponentsBuilder.fromHttpUrl(annotationHost + "/api/search")
                .queryParam("_separate_replies", true)
                .queryParam("group", "__world__")
                .queryParam("limit", -1)
                .queryParam("offset", 0)
                .queryParam("order", "asc")
                .queryParam("sort", "created")
                .queryParam("uri", "uri://LEOS/" + docName).build().encode().toUri();

        try {
            return annotationProvider.searchAnnotations(uri, this.getAnnotateToken(), proposalRef);
        } catch (Exception exception) {
            LOG.error("Error getting annotations: ", exception);
            throw new RuntimeException("Error Occurred While Getting Annotation");
        }
    }

    @Override
    public String getFeedbackAnnotations(String docName, String legFileName, String proposalRef) {
        URI uri = UriComponentsBuilder.fromHttpUrl(annotationHost + "/api/search")
                .queryParam("_separate_replies", true)
                .queryParam("group", "__world__")
                .queryParam("limit", -1)
                .queryParam("offset", 0)
                .queryParam("order", "asc")
                .queryParam("sort", "created")
                .queryParam("metadatasets", "[{\"status\":[\"ALL\"]}]")
                .queryParam("uri", "uri://LEOS/" + legFileName + "/revision-" + docName).build().encode().toUri();

        try {
            return annotationProvider.searchAnnotations(uri, this.getAnnotateToken(), proposalRef);
        } catch (Exception exception) {
            LOG.error("Error getting feedback annotations: ", exception);
            throw new RuntimeException("Error Occurred While Getting Feedback Annotation");
        }
    }

    @Override
    public String fetchFeedbackRepliesFromDB(String docName, String proposalRef, String legFileName, String storedAnnotations) {
        URI uri = UriComponentsBuilder.fromHttpUrl(annotationHost + "/api/search")
                .queryParam("_separate_replies", true)
                .queryParam("group", "__world__")
                .queryParam("limit", -1)
                .queryParam("offset", 0)
                .queryParam("order", "asc")
                .queryParam("sort", "created")
                .queryParam("metadatasets", "[{\"status\":[\"ALL\"]}]")
                .queryParam("uri", "uri://LEOS/" + docName).build().encode().toUri();

        try {
            String annotations =  annotationProvider.searchAnnotations(uri, this.getAnnotateToken(), proposalRef);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode annotsJson = mapper.readTree(annotations);
            JsonNode storedAnnotsJson = mapper.readTree(storedAnnotations);

            JsonNode rowStoredAnnotsJson = storedAnnotsJson.get("rows");
            JsonNode repliesAnnots = annotsJson.get("replies");
            JsonNode storedRepliesJson = storedAnnotsJson.get("replies");
            for (final JsonNode reply : repliesAnnots) {
                boolean found = false;
                JsonNode refs = reply.get("references");
                for (final JsonNode storedAnnot : rowStoredAnnotsJson) {
                    if (storedAnnot.get("id").asText("").equals(refs.get(0).asText("ref"))) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    ((ArrayNode) storedRepliesJson).add(reply);
                }
            }
            storedAnnotations =  mapper.writeValueAsString(storedAnnotsJson);
            storedAnnotations = storedAnnotations.replaceAll("uri://LEOS/" + docName, "uri://LEOS/" + legFileName + "/revision-" + docName);
        } catch (Exception exception) {
            LOG.error("Error getting feedback annotations: ", exception);
        }
        return storedAnnotations;
    }

    @Override
    public String createTemporaryAnnotations(final byte[] legFile, final String proposalRef) {
        URI uri = UriComponentsBuilder.fromHttpUrl(annotationHost + "/api/annotations/temporary").build().encode().toUri();
        try {
            final SendTemporaryAnnotationsResponse response = annotationProvider
                    .sendTemporaryAnnotations(legFile, uri, this.getAnnotateToken(), proposalRef);
            return response.getCreatedId();
        } catch (Exception exception) {
            LOG.error("Error creating temporary annotations: ", exception);
            throw new RuntimeException("Error occurred while creating temporary annotations");
        }
    }

    @Override
    public boolean sendUserPermissions(List<LeosPermission> permissions) {
        URI uri = UriComponentsBuilder.fromHttpUrl(annotationHost + "/api/user/permissions").build().encode().toUri();
        try {
            final AnnotateStatusResponse response = annotationProvider.sendUserPermissions(permissions, uri, this.getAnnotateToken());
            return response.getStatus().equalsIgnoreCase("ok");
        } catch (Exception exception) {
            LOG.error("Error sending user permissions to annotate: ", exception);
            return false;
        }
    }

    private String getAnnotateToken() {
        return this.securityContext.getAnnotateToken(annotationHost + "/api/token");
    }

}