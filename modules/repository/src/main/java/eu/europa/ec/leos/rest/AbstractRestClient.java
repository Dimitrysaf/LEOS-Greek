package eu.europa.ec.leos.rest;

import eu.europa.ec.leos.rest.support.requests.UpdateDocumentRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AbstractRestClient {

    private static final Logger logger = LoggerFactory.getLogger(AbstractRestClient.class);

    @Autowired
    private RestTemplate restTemplate;

    protected <T> T getEntity(String url, Class<T> responseType, Object... parameters) {
        ResponseEntity<T> resp;
        try {
            resp = restTemplate.getForEntity(url, responseType, parameters);
            return resp.getBody();
        } catch (Exception e) {
            logger.error("Error occured in GET request" + e.getMessage());
        }
        return null;
    }

    protected <T> T postEntity(String url, Object request, Class<T> responseType, Object... parameters) {
        HttpEntity<UpdateDocumentRequest> payload = new HttpEntity(request);
        ResponseEntity<T> resp = restTemplate.postForEntity(url, payload, responseType, parameters);
        return resp.getBody();
    }

    protected <T> T putEntity(String url, Object request, Class<T> responseType, Object... parameters) {
        HttpEntity<UpdateDocumentRequest> payload = new HttpEntity(request);
        ResponseEntity<T> resp = restTemplate.exchange(url, HttpMethod.PUT, payload, responseType, parameters);
        return resp.getBody();
    }

    protected void delete(String url, Object parameter) {
        restTemplate.delete(url, parameter);
    }

}
