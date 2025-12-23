package eu.europa.ec.leos.integration;

import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.repository.common.LeosFile;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.model.user.User;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

@Service
@Instance(InstanceType.COMMISSION)
public class ProposalAKN4EUServiceImpl implements AKN4EUService {

    private static final Logger LOG = LoggerFactory.getLogger(ProposalAKN4EUServiceImpl.class);

    @Autowired
    private RestTemplate restTemplate;

    @Value("#{integrationProperties['leos.akn4eu.url']}")
    private String akn4euUrl;

    @Value("#{integrationProperties['leos.akn4eu.convert.uri']}")
    private String convertUri;

    @Value("#{integrationProperties['leos.akn4eu.apply.metadata.uri']}")
    private String applyMetadataUri;

    @Override
    public void convert(LeosFile legFile, User user, String outputDescriptor) throws Exception {
        Validate.notNull(legFile, "legFile must not be null!");
        try {
            String uri = akn4euUrl + convertUri;

            MultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
            map.add("inputFile", legFile.getResource());
            map.add("outputDescriptor", outputDescriptor);
            map.add("emailAddress", user.getEmail());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(map, headers);
            ResponseEntity<Object> response = restTemplate.postForEntity(uri, requestEntity, Object.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return;
            }

            LOG.error("Not successfull conversion using the external service Akn4EU");
            throw new IllegalStateException("Not successfull conversion using the external service Akn4EU");

        } catch(Exception e){
            throw new Exception("Exception while calling external service Akn4EU", e);
        }
    }

    @Override
    public byte[] applyMetadata(LeosFile legFile, User user) throws Exception {
        Validate.notNull(legFile, "legFile must not be null!");
        try {
            String uri = akn4euUrl + applyMetadataUri;

            MultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
            map.add("inputFile", legFile.getResource());
            map.add("validate", user != null && user.getEmail() != null);
            if (user != null && user.getEmail() != null) {
                map.add("email", user.getEmail());
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.setAccept(Arrays.asList(MediaType.APPLICATION_OCTET_STREAM));
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(map, headers);
            ResponseEntity<byte[]> response = restTemplate.postForEntity(uri, requestEntity, byte[].class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return (byte[]) response.getBody();
            }

            LOG.error("Not successfull apply metadata using the external service Akn4EU");
            throw new IllegalStateException("Not successfull apply metadata using the external service Akn4EU");

        } catch(Exception e){
            throw new Exception("Exception while calling external service Akn4EU", e);
        }
    }
}
