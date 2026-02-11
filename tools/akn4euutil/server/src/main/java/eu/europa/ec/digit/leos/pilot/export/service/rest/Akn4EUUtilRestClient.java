/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.digit.leos.pilot.export.service.rest;

import eu.europa.ec.digit.leos.pilot.export.model.LeosRenditionOutputList;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;

@Service
@Slf4j
public class Akn4EUUtilRestClient {

    private final RestTemplate restTemplate;
    @Value("${leos.rest.core.api.url}")
    private String leosRestCoreApiURL;
    @Value("${leos.rest.core.api.html.renditions.uri}")
    private String leosRestCoreApiHtmlRenditionsURI;
    @Value("${leos.rest.core.api.con.validation.uri}")
    private String leosRestCoreApiConValidationURI;

    @Autowired
    public Akn4EUUtilRestClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private String getUrl(String resourceUrl) {
        return leosRestCoreApiURL + resourceUrl;
    }

    public LeosRenditionOutputList generateHtmlRenditions(ByteArrayResource inputFile) throws IOException {
        String url = getUrl(leosRestCoreApiHtmlRenditionsURI);
        MultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
        map.add("document", inputFile);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(map, headers);
        try {
            ResponseEntity<LeosRenditionOutputList> outputList = restTemplate.postForEntity(url, requestEntity, LeosRenditionOutputList.class);
            return outputList.getBody();
        } catch (RestClientException e) {
            log.error("EdiT/Core module is not available for HTML rendition generation - {}", e.getMessage());
        }
        LeosRenditionOutputList output = new LeosRenditionOutputList();
        output.setLeosRenditionOutputs(Collections.emptyList());
        return output;
    }

    public void callLeosValidation(ByteArrayResource inputFile, String email) throws IOException {
        String url = getUrl(leosRestCoreApiConValidationURI);
        MultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
        map.add("zipFile", inputFile);
        map.add("email", email);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(map, headers);
        try {
            ResponseEntity<String> outputList = restTemplate.postForEntity(url, requestEntity, String.class);
        } catch (RestClientException e) {
            log.error("EdiT/Core module is not available for validation - {}", e.getMessage());
        }
    }
}
