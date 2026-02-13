/*
 * Copyright 2021-2022 European Commission
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
package eu.europa.ec.digit.leos.pilot.export.service.impl;

import eu.europa.ec.digit.leos.pilot.export.model.LeosConvertDocumentInput;
import eu.europa.ec.digit.leos.pilot.export.model.LeosConvertDocumentOutput;
import eu.europa.ec.digit.leos.pilot.export.model.LeosRenditionOutput;
import eu.europa.ec.digit.leos.pilot.export.model.LeosRenditionOutputList;
import eu.europa.ec.digit.leos.pilot.export.service.LeosDocumentService;
import eu.europa.ec.digit.leos.pilot.export.service.LeosLegDocumentService;
import eu.europa.ec.digit.leos.pilot.export.service.LeosPrefinalisationService;
import eu.europa.ec.digit.leos.pilot.export.service.XmlDocumentService;
import eu.europa.ec.digit.leos.pilot.export.service.rest.Akn4EUUtilRestClient;
import eu.europa.ec.digit.leos.pilot.export.util.StringUtil;
import eu.europa.ec.digit.leos.pilot.export.util.ZipUtil;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class LeosDocumentServiceImpl implements LeosDocumentService {
    private static final Logger LOG = LoggerFactory.getLogger(LeosLegDocumentServiceImpl.class);

    private final LeosLegDocumentService leosLegDocumentService;
    private final XmlDocumentService xmlDocumentService;
    private final LeosPrefinalisationService leosPrefinalisationService;
    private final Akn4EUUtilRestClient restClient;

    @Value("${notification.functional.mailbox}")
    private String notificationRecipient;

    @Autowired
    public LeosDocumentServiceImpl(LeosLegDocumentService leosLegDocumentService,
                                   XmlDocumentService xmlDocumentService,
                                   LeosPrefinalisationService metadataService, Akn4EUUtilRestClient restClient) {
        this.leosLegDocumentService = leosLegDocumentService;
        this.xmlDocumentService = xmlDocumentService;
        this.leosPrefinalisationService = metadataService;
        this.restClient = restClient;
    }

    public LeosConvertDocumentInput createDocumentInput(MultipartFile inputFile, MultipartFile main, boolean isWithAnnotations) {
        final LeosConvertDocumentInput convertDocumentInput = new LeosConvertDocumentInput();
        convertDocumentInput.setInputFile(inputFile);
        convertDocumentInput.setMain(main);
        convertDocumentInput.setWithAnnotations(isWithAnnotations);
        return convertDocumentInput;
    }

    public LeosConvertDocumentInput createDocumentInput(MultipartFile inputFile, MultipartFile translationsFile) {
        final LeosConvertDocumentInput convertDocumentInput = new LeosConvertDocumentInput();
        convertDocumentInput.setInputFile(inputFile);
        convertDocumentInput.setTranslationsFile(translationsFile);
        return convertDocumentInput;
    }

    public byte[] getRenditions(LeosConvertDocumentInput convertDocumentInput) {
        return xmlDocumentService.xmlToHtmlPackage(convertDocumentInput);
    }

    public LeosConvertDocumentOutput updateWithTranslations(LeosConvertDocumentInput convertDocumentInput) {
        List<LeosRenditionOutput> renditionOutputs = getRenditionOutputs(convertDocumentInput);
        return leosLegDocumentService.updateWithTranslations(convertDocumentInput, renditionOutputs);
    }

    private List<LeosRenditionOutput> getRenditionOutputs(LeosConvertDocumentInput convertDocumentInput) {
        LeosRenditionOutputList outputList;
        try {
            outputList = restClient.generateHtmlRenditions(convertFileToByteArray(convertDocumentInput.getTranslationsFile()));
        } catch (IOException e) {
            LOG.error("Error while generating html renditions - {}", e.getMessage());
            throw new RuntimeException(e);
        }
        return outputList.getLeosRenditionOutputs();
    }

    public void callLeosValidation(MultipartFile inputFile, String email) {
        try {
            String recipient = (StringUtil.isEmpty(email) || !StringUtil.isEmailValid(email)) ? notificationRecipient : email;
            restClient.callLeosValidation(convertFileToByteArray(inputFile), recipient);
        } catch (IOException e) {
            LOG.error("Error while calling leos validation - {}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public byte[] applyMetadata(MultipartFile inputFile) throws IOException {
        Map<String, Object> zipContent = ZipUtil.unzipByteArray(inputFile.getBytes());
        return this.leosPrefinalisationService.applyMetadata(zipContent);
    }

    public String applyMetadataAsync(MultipartFile inputFile, String callbackUrl, String email) throws IOException {
        Map<String, Object> zipContent = ZipUtil.unzipByteArray(inputFile.getBytes());
        String recipient = (StringUtil.isEmpty(email) || !StringUtil.isEmailValid(email)) ? notificationRecipient : email;
        return this.leosPrefinalisationService.applyMetadataAsync(zipContent, callbackUrl, inputFile.getOriginalFilename(), recipient);
    }

    private ByteArrayResource convertFileToByteArray(MultipartFile multipartFile) throws IOException {
        return new ByteArrayResource(multipartFile.getBytes()) {
            @Override
            public String getFilename() {
                return multipartFile.getOriginalFilename();
            }
        };
    }
}
