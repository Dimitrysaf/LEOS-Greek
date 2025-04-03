package eu.europa.ec.leos.integration.rest;

import eu.europa.ec.leos.integration.ExternalSystemACLService;
import eu.europa.ec.leos.integration.dto.AccessDTO;
import eu.europa.ec.leos.integration.exception.ExternalSystemACLException;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.annotation.PostConstruct;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@Slf4j
public class ExternalSystemACLServiceImpl implements ExternalSystemACLService {

    private static final Logger LOG = LoggerFactory.getLogger(ExternalSystemACLServiceImpl.class);

    private final RestTemplate restTemplate;

    @Value("${leos.content.script.security.policy}")
    private String allowedDomains;
    private Pattern allowedDomainsPattern;

    public ExternalSystemACLServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostConstruct
    private void postConstruct() {
        this.allowedDomainsPattern = this.generateAllowedDomainsPattern();
    }

    //TODO handle exception
    @Override
    public List<AccessDTO> getAccessControlList(String url) {
        return getListResponseEntity(url);
    }

    @Override
    public Optional<AccessDTO> getAccess(String url, String userId) {
        url = url.replace("${userId}", userId);
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(url);
        List<AccessDTO> list = getListResponseEntity(uriBuilder.toUriString());
        return list.stream().findFirst();
    }

    private List<AccessDTO> getListResponseEntity(String url) {
        ResponseEntity<List<AccessDTO>> responseEntity = restTemplate.exchange(
                validateUrl(url),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<AccessDTO>>() {}
        );
        return responseEntity.getBody();
    }

    private Pattern generateAllowedDomainsPattern() {
        String validDomainNameRegex = allowedDomains.replaceAll("\\s+", "|");
        validDomainNameRegex = validDomainNameRegex.replaceAll("\\.", "\\\\.");
        validDomainNameRegex = validDomainNameRegex.replaceAll("\\*", "[0-9a-zA-Z]+");
        return Pattern.compile(validDomainNameRegex);
    }

    private String validateUrl(String url) {
        try {
            URL urlObj = new URL(url);
            String domain = String.format("%s://%s", urlObj.getProtocol(), urlObj.getAuthority());
            if (allowedDomainsPattern.matcher(domain).matches()) {
                return url;
            }
            LOG.error("External system ACL service not in domain white list!!!!");
            throw new ExternalSystemACLException("External system ACL service not in domain white list!!!!");
        } catch (MalformedURLException e) {
            LOG.error("External system ACL service url malformed: {}", url);
            throw new ExternalSystemACLException(e.getMessage());
        }
    }

}
