package eu.europa.ec.leos.rest;

import eu.europa.ec.leos.rest.support.requests.UpdateDocumentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AbstractRestClient {

    @Autowired
    private RestTemplate restTemplate;

    protected <T> T getEntity(String url, Class<T> responseType, Object... parameters) {
        ResponseEntity<T> resp = restTemplate.getForEntity(url, responseType, parameters);
        return resp.getBody();
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
