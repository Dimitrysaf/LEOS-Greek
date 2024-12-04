package eu.europa.ec.leos.services.annotate;

import java.net.URI;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.integration.rest.AnnotateStatusResponse;
import eu.europa.ec.leos.integration.rest.SendTemporaryAnnotationsResponse;
import eu.europa.ec.leos.security.LeosPermission;
import org.apache.cxf.common.util.StringUtils;
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
    public String updateAnnotation(String proposalRef, String id, String jsonAnnot) {
        URI uri = UriComponentsBuilder.fromHttpUrl(annotationHost + "/api/annotations")
                .path("/{id}").buildAndExpand(id).encode().toUri();

        try {
            return annotationProvider.updateAnnotation(uri, this.getAnnotateToken(), proposalRef, jsonAnnot);
        } catch (Exception exception) {
            LOG.error("Error updating annotations: ", exception);
            throw new RuntimeException("Error Occurred While Updating Annotation");
        }
    }

    @Override
    public void deleteAnnotation(String proposalRef, String id) {
        URI uri = UriComponentsBuilder.fromHttpUrl(annotationHost + "/api/annotations")
                .path("/{id}").buildAndExpand(id).encode().toUri();

        try {
            annotationProvider.deleteAnnotation(uri, this.getAnnotateToken(), proposalRef, id);
        } catch (Exception exception) {
            LOG.error("Error deleting annotations: ", exception);
            throw new RuntimeException("Error Occurred While Deleting Annotation");
        }
    }

    @Override
    public String createAnnotation(String proposalRef, String jsonAnnot) {
        URI uri = UriComponentsBuilder.fromHttpUrl(annotationHost + "/api/annotations").build().encode().toUri();

        try {
            return annotationProvider.createAnnotation(uri, this.getAnnotateToken(), proposalRef, jsonAnnot);
        } catch (Exception exception) {
            LOG.error("Error creating annotations: ", exception);
            throw new RuntimeException("Error Occurred While Creating Annotation");
        }
    }

    @Override
    public String getFeedbackAnnotations(String docName, LegDocument legDocument, String proposalRef) {
        URI uri = UriComponentsBuilder.fromHttpUrl(annotationHost + "/api/search")
                .queryParam("_separate_replies", true)
                .queryParam("group", "__world__")
                .queryParam("limit", -1)
                .queryParam("offset", 0)
                .queryParam("order", "asc")
                .queryParam("sort", "created")
                .queryParam("metadatasets", "[{\"status\":[\"ALL\"]}]")
                .queryParam("uri", "uri://LEOS/" + legDocument.getName() + "/revision-" + docName).build().encode().toUri();

        try {
            return annotationProvider.searchAnnotations(uri, this.getAnnotateToken(), proposalRef);
        } catch (Exception exception) {
            LOG.error("Error getting feedback annotations: ", exception);
            throw new RuntimeException("Error Occurred While Getting Feedback Annotation");
        }
    }

    @Override
    public String fetchFeedbackRepliesFromDB(String docName, String proposalRef, LegDocument legDocument, String storedAnnotations, boolean setFlag) {
        if (StringUtils.isEmpty(storedAnnotations)) {
            return "";
        }
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
                if (isNormalAnnot(reply) && isReplyFromRevision(reply) && isCreatedAfterContribution(reply, legDocument)) {
                    boolean isAlreadyStored = false;
                    for (final JsonNode storedReplyAnnot : storedRepliesJson) {
                        if (reply.get("id").asText("").equals(storedReplyAnnot.get("id").asText("id"))) {
                            isAlreadyStored = true;
                            ((ObjectNode) storedReplyAnnot).remove("feedback");
                            break;
                        }
                    }
                    if (!isAlreadyStored) {
                        JsonNode refs = reply.get("references");
                        for (final JsonNode storedAnnot : rowStoredAnnotsJson) {
                            if (storedAnnot.get("id").asText("").equals(refs.get(0).asText("ref"))) {
                                if (setFlag) {
                                    ((ObjectNode) reply).put("feedbackToBeSent", true);
                                }
                                ((ArrayNode) storedRepliesJson).add(reply);
                                break;
                            }
                        }
                    }
                }
            }
            storedAnnotations =  mapper.writeValueAsString(storedAnnotsJson);
            storedAnnotations = storedAnnotations.replaceAll("uri://LEOS/" + docName, "uri://LEOS/" + legDocument.getName() + "/revision-" + docName);
        } catch (Exception exception) {
            LOG.error("Error getting feedback annotations: ", exception);
        }
        return storedAnnotations;
    }

    @Override
    public List<JsonNode> getFeedbackRepliesFromDB(String docName, String proposalRef, LegDocument legDocument, String storedAnnotations) {
        List<JsonNode> repliesList = new ArrayList<JsonNode>();
        if (StringUtils.isEmpty(storedAnnotations)) {
            return repliesList;
        }
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
                if (isNormalAnnot(reply) && isReplyFromRevision(reply) && isCreatedAfterContribution(reply, legDocument)) {
                    boolean isAlreadyStored = false;
                    for (final JsonNode storedReplyAnnot : storedRepliesJson) {
                        if (reply.get("id").asText("").equals(storedReplyAnnot.get("id").asText("id"))) {
                            isAlreadyStored = true;
                            break;
                        }
                    }
                    if (!isAlreadyStored) {
                        JsonNode refs = reply.get("references");
                        for (final JsonNode storedAnnot : rowStoredAnnotsJson) {
                            if (storedAnnot.get("id").asText("").equals(refs.get(0).asText("ref"))) {
                                repliesList.add(reply);
                                break;
                            }
                        }
                    }
                }
            }
        } catch (Exception exception) {
            LOG.error("Error getting feedback annotations: ", exception);
        }
        return repliesList;
    }

    @Override
    public int countFeedbackRepliesFromDB(String docName, String proposalRef, LegDocument legDocument, String storedAnnotations) {
        int count = 0;
        if (StringUtils.isEmpty(storedAnnotations)) {
            return 0;
        }
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
                if (isNormalAnnot(reply) && isReplyFromRevision(reply) && isCreatedAfterContribution(reply, legDocument)) {
                    boolean isAlreadyStored = false;
                    for (final JsonNode storedReplyAnnot : storedRepliesJson) {
                        if (reply.get("id").asText("").equals(storedReplyAnnot.get("id").asText("id"))) {
                            isAlreadyStored = true;
                            break;
                        }
                    }
                    if (!isAlreadyStored) {
                        JsonNode refs = reply.get("references");
                        for (final JsonNode storedAnnot : rowStoredAnnotsJson) {
                            if (storedAnnot.get("id").asText("").equals(refs.get(0).asText("ref"))) {
                                count++;
                                break;
                            }
                        }
                    }
                }
            }
        } catch (Exception exception) {
            LOG.error("Error getting feedback annotations: ", exception);
        }
        return count;
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

    @Override
    public boolean isNormalAnnot(JsonNode annot) {
        return (annot != null && (annot.get("status") == null
                || annot.get("status").get("status") == null
                || annot.get("status").get("status").asText("").equals("NORMAL")));
    }

    @Override
    public boolean isReplyFromRevision(JsonNode annot) {
        return (annot != null && annot.get("uri") != null
                && annot.get("uri").asText("").contains("revision-"));
    }

    @Override
    public boolean isCreatedAfterContribution(JsonNode annot, LegDocument legDocument) {
        String annotCreationStr = annot.get("created").asText(null);
        if (annotCreationStr != null) {
            Instant legCreationInstant = legDocument.getCreationInstant();
            Instant annotCreationInstant = Instant.parse(annotCreationStr);
            return annotCreationInstant.compareTo(legCreationInstant) >= 0;
        }
        return false;
    }

    private String getAnnotateToken() {
        return this.securityContext.getAnnotateToken(annotationHost + "/api/token");
    }

}