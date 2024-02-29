package eu.europa.ec.leos.integration.rest;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.leos.security.LeosPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import eu.europa.ec.leos.integration.AnnotationProvider;
import eu.europa.ec.leos.integration.rest.AnnotationsSearchResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.util.UriUtils;

@Component
public class AnnotationClientImpl implements AnnotationProvider {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private AnnotationAuthProvider authenticationProvider;

    @Override
    public String searchAnnotations(URI uri, String jwtToken, String proposalRef) {
        HttpHeaders headers = this.getDefaultHttpHeaders(jwtToken, proposalRef);
        HttpEntity<?> request = new HttpEntity<>(headers);
        final AnnotationsSearchResponse response = restTemplate.exchange(uri, HttpMethod.GET, request, AnnotationsSearchResponse.class).getBody();
        try {
            final ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsString(response);
        } catch (Exception ex) {
            throw new RestClientException("Error parsing search annotations response.", ex);
        }
    }

    @Override
    public SendTemporaryAnnotationsResponse sendTemporaryAnnotations(final byte[] legFile, final URI uri, final String jwtToken, String proposalRef) {
        final HttpHeaders headers = this.getDefaultHttpHeaders(jwtToken, proposalRef);
        headers.set("Content-Type", "application/octet-stream");
        final HttpEntity<byte[]> request = new HttpEntity<>(legFile, headers);
        return restTemplate.exchange(uri, HttpMethod.POST, request, SendTemporaryAnnotationsResponse.class).getBody();
    }

    @Override
    public AnnotateStatusResponse sendUserPermissions(List<LeosPermission> permissions, URI uri, String jwtToken) {
        final HttpHeaders headers = this.getDefaultHttpHeaders(jwtToken, null);
        headers.set("Content-Type", "application/json");
        final HttpEntity<AnnotatePermissionsJson> request = new HttpEntity<>(new AnnotatePermissionsJson(permissions), headers);
        return restTemplate.exchange(uri, HttpMethod.POST, request, AnnotateStatusResponse.class).getBody();
    }

    private HttpHeaders getDefaultHttpHeaders(final String jwtToken, final String proposalRef) {
        HttpHeaders headers = new HttpHeaders();
        TokenJson tokenJson = authenticationProvider.getToken(jwtToken, proposalRef);
        // FIX ME In ticket LEOS-2862 Annotations: improve authentication provider
        String token  = encodeParam(tokenJson.getAccessToken());
        headers.set("Authorization", "Bearer " + token);
        headers.set("Accept", "application/json");
        return headers;
    }

    public static String encodeParam(String value) {
        return UriUtils.encodePath(value, StandardCharsets.UTF_8);
    }

}