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

import eu.europa.ec.digit.leos.pilot.export.model.CustomMultipartFile;
import eu.europa.ec.digit.leos.pilot.export.model.LeosConvertDocumentInput;
import eu.europa.ec.digit.leos.pilot.export.model.LeosConvertDocumentOutput;
import eu.europa.ec.digit.leos.pilot.export.model.LeosRenditionOutput;
import eu.europa.ec.digit.leos.pilot.export.service.LeosDocumentService;
import eu.europa.ec.digit.leos.pilot.export.service.LeosLegDocumentService;
import eu.europa.ec.digit.leos.pilot.export.service.MetadataService;
import eu.europa.ec.digit.leos.pilot.export.service.XmlDocumentService;
import eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil;
import eu.europa.ec.digit.leos.pilot.export.util.ZipUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class LeosDocumentServiceImpl implements LeosDocumentService {
    private static final Logger LOG = LoggerFactory.getLogger(LeosLegDocumentServiceImpl.class);

    private final LeosLegDocumentService leosLegDocumentService;
    private final XmlDocumentService xmlDocumentService;
    private final MetadataService metadataService;

    public LeosDocumentServiceImpl(LeosLegDocumentService leosLegDocumentService,
            XmlDocumentService xmlDocumentService,
            MetadataService metadataService) {
        this.leosLegDocumentService = leosLegDocumentService;
        this.xmlDocumentService = xmlDocumentService;
        this.metadataService = metadataService;
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
        Map<String, Object> translationMap;
        List<LeosRenditionOutput> renditionOutputs = new ArrayList<>();
        try {
            translationMap = ZipUtil.unzipByteArray(convertDocumentInput.getTranslationsFile().getBytes());
            translationMap.keySet().stream().forEach(translationKey -> {
                MultipartFile main = null;
                if(translationKey.startsWith(ConvertUtil.PROPOSAL_FILE_PREFIX)) {
                    main = new CustomMultipartFile((byte[])translationMap.get(translationKey), translationKey,
                            "application/xml");
                }
                LeosConvertDocumentInput renditionInput = createDocumentInput(
                        new CustomMultipartFile((byte[])translationMap.get(translationKey), translationKey,
                                "application/xml"),
                        main,
                        false
                );
                LeosRenditionOutput renditionOutput = xmlDocumentService.xmlToHtmlRendition(renditionInput);
                renditionOutputs.add(renditionOutput);
            });
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return renditionOutputs;
    }

    public byte[] applyMetadata(MultipartFile inputFile) {
        return metadataService.applyMetadata(inputFile);
    }

}