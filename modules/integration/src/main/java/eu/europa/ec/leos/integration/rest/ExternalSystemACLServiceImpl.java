package eu.europa.ec.leos.integration.rest;

import eu.europa.ec.leos.integration.ExternalSystemACLService;
import eu.europa.ec.leos.integration.dto.AccessDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class ExternalSystemACLServiceImpl implements ExternalSystemACLService {

    private final RestTemplate restTemplate;

    public ExternalSystemACLServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    //TODO handle exception
    @Override
    public List<AccessDTO> getAccessControlList(String url) {
        return getListResponseEntity(url);
    }

    @Override
    public Optional<AccessDTO> getAccess(String url, String userId) {
        url=url.replace("${userId}", userId);
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(url);
        List<AccessDTO> list = getListResponseEntity(uriBuilder.toUriString());
        return list.stream().findFirst();
    }

    private List<AccessDTO> getListResponseEntity(String url) {
        ResponseEntity<List<AccessDTO>> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<AccessDTO>>() {}
        );
        return responseEntity.getBody();
    }

}
