package eu.europa.ec.leos.integration;

import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.repository.common.LeosFile;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.model.user.User;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import org.springframework.util.StreamUtils;
import org.springframework.web.client.RestTemplate;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Service
@Instance(InstanceType.OS)
public class AKN4EUServiceImpl implements AKN4EUService {

    private static final Logger LOG = LoggerFactory.getLogger(AKN4EUServiceImpl.class);

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
            byte[] fileBytes = legFile.getBytes();
            if (isZipFile(fileBytes)) {
                Map<String, byte[]> xmlEntries = extractLegislativeXmls(fileBytes);
                if (xmlEntries.isEmpty()) {
                    LOG.warn("No legislative XML found in LEG package, skipping akn4euutil conversion");
                    return;
                }
                for (Map.Entry<String, byte[]> entry : xmlEntries.entrySet()) {
                    String xmlName = entry.getKey();
                    byte[] xmlBytes = entry.getValue();
                    LOG.debug("Sending {} from LEG package to akn4euutil {}", xmlName, convertUri);
                    postXmlToRenditions(xmlName, xmlBytes, null, null, outputDescriptor);
                }
            } else {
                postXmlToRenditions(legFile.getName(), fileBytes, null, null, outputDescriptor);
            }
        } catch (Exception e) {
            throw new Exception("Exception while calling akn4euutil convert", e);
        }
    }

    private boolean isZipFile(byte[] bytes) {
        return bytes != null && bytes.length > 3
                && bytes[0] == 0x50 && bytes[1] == 0x4B
                && bytes[2] == 0x03 && bytes[3] == 0x04;
    }

    private Map<String, byte[]> extractLegislativeXmls(byte[] legBytes) throws IOException {
        Map<String, byte[]> result = new LinkedHashMap<>();
        try (ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(legBytes))) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                String name = entry.getName();
                if (!entry.isDirectory() && name.endsWith(".xml")
                        && !name.contains("/") && !name.equals("content.xml")) {
                    try (ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
                        StreamUtils.copy(zis, bos);
                        result.put(name, bos.toByteArray());
                    }
                }
            }
        }
        return result;
    }

    private byte[] postXmlToRenditions(String fileName, byte[] xmlBytes, String mainFileName, byte[] mainXmlBytes, String outputDescriptor) throws Exception {
        String uri = akn4euUrl + convertUri;
        final String name = fileName;
        ByteArrayResource resource = new ByteArrayResource(xmlBytes) {
            @Override
            public String getFilename() { return name; }
        };

        MultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
        map.add("inputFile", resource);
        if (mainXmlBytes != null && mainFileName != null) {
            final String mName = mainFileName;
            ByteArrayResource mainResource = new ByteArrayResource(mainXmlBytes) {
                @Override
                public String getFilename() { return mName; }
            };
            map.add("main", mainResource);
        }
        if (outputDescriptor != null) {
            map.add("outputDescriptor", outputDescriptor);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_OCTET_STREAM, MediaType.ALL));
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(map, headers);
        ResponseEntity<byte[]> response = restTemplate.postForEntity(uri, requestEntity, byte[].class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            LOG.error("Conversion failed for {} calling akn4euutil at {}", fileName, uri);
            throw new IllegalStateException("Conversion failed calling akn4euutil for " + fileName);
        }
        LOG.debug("akn4euutil /getRenditions succeeded for {} ({} bytes)", fileName,
                response.getBody() != null ? response.getBody().length : 0);
        return response.getBody();
    }

    @Override
    public Map<String, byte[]> getHtmlRenditions(LeosFile legFile, User user) throws Exception {
        Validate.notNull(legFile, "legFile must not be null!");
        try {
            byte[] fileBytes = legFile.getBytes();
            Map<String, byte[]> xmlEntries = isZipFile(fileBytes)
                    ? extractLegislativeXmls(fileBytes)
                    : Collections.singletonMap(legFile.getName(), fileBytes);

            if (xmlEntries.isEmpty()) {
                LOG.warn("No legislative XML found in LEG package for HTML rendition");
                return Collections.emptyMap();
            }

            // Find the proposal (main) XML to use as cover page source
            String mainFileName = null;
            byte[] mainXmlBytes = null;
            for (Map.Entry<String, byte[]> entry : xmlEntries.entrySet()) {
                if (entry.getKey().startsWith("main")) {
                    mainFileName = entry.getKey();
                    mainXmlBytes = entry.getValue();
                    LOG.debug("Found proposal XML for cover page: {}", mainFileName);
                    break;
                }
            }

            Map<String, byte[]> result = new LinkedHashMap<>();
            for (Map.Entry<String, byte[]> entry : xmlEntries.entrySet()) {
                // Skip the proposal/main XML — it is only used as cover page data
                if (entry.getKey().startsWith("main")) {
                    continue;
                }
                LOG.debug("Requesting HTML rendition for {}", entry.getKey());
                byte[] htmlZip = postXmlToRenditions(entry.getKey(), entry.getValue(), mainFileName, mainXmlBytes, null);
                if (htmlZip != null && htmlZip.length > 0) {
                    result.put(entry.getKey(), htmlZip);
                }
            }
            return result;
        } catch (Exception e) {
            throw new Exception("Exception while getting HTML renditions from akn4euutil", e);
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
                return response.getBody();
            }

            LOG.error("applyMetadata failed calling akn4euutil at {}", uri);
            throw new IllegalStateException("applyMetadata failed calling akn4euutil");

        } catch (Exception e) {
            throw new Exception("Exception while calling akn4euutil applyMetadata", e);
        }
    }
}
