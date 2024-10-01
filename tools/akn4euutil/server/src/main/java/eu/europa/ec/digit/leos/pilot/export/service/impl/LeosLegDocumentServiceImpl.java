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

import eu.europa.ec.digit.leos.pilot.export.exception.LegDocumentException;
import eu.europa.ec.digit.leos.pilot.export.model.LeosConvertDocumentInput;
import eu.europa.ec.digit.leos.pilot.export.model.LeosConvertDocumentOutput;
import eu.europa.ec.digit.leos.pilot.export.model.LeosRenditionOutput;
import eu.europa.ec.digit.leos.pilot.export.service.LeosLegDocumentService;
import eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil;
import eu.europa.ec.digit.leos.pilot.export.util.ZipUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.HTML_EXT;
import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.HTML_JS_PATH;
import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.HTML_RENDITION_PATH;
import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.HTML_TOC;
import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.JS_EXT;
import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.XML_EXT;

@Service
public class LeosLegDocumentServiceImpl implements LeosLegDocumentService {

    private static final Logger LOG = LoggerFactory.getLogger(LeosLegDocumentServiceImpl.class);


    public LeosLegDocumentServiceImpl() {
    }

    public LeosConvertDocumentOutput updateWithTranslations(LeosConvertDocumentInput convertDocumentInput, List<LeosRenditionOutput> renditionOutputs) {
        try {
            Map<String, Object> contentToZip = ZipUtil.unzipByteArray(convertDocumentInput.getInputFile().getBytes());
            Map<String, Object> translationMap = ZipUtil.unzipByteArray(convertDocumentInput.getTranslationsFile().getBytes());
            Map<String, Object> cssContentToZip = new HashMap<>();

            List<String> filesToRemove = new ArrayList<>();
            Map<String, Object> filesToAdd = new HashMap<>();
            String outputFilename = "";

            //Find the files matching in the translations zip
            for (String contentKey : contentToZip.keySet()) {
                if (contentKey.endsWith(XML_EXT)) {
                    String baseKey = (contentKey.lastIndexOf('-') != -1)
                            ? contentKey.substring(0, contentKey.lastIndexOf('-'))
                            : contentKey;

                    translationMap.keySet().stream()
                            .filter(translationKey -> translationKey.startsWith(baseKey))
                            .findFirst()
                            .ifPresent(translationKey -> {
                                filesToRemove.add(contentKey);
                                filesToAdd.put(translationKey, translationMap.get(translationKey));
                            });
                }
            }
            //replace original xml files + renditions with translations files
            outputFilename = replaceOriginalWithTranslations(convertDocumentInput, filesToRemove, translationMap,
                    outputFilename, contentToZip, filesToAdd);

            renditionOutputs.forEach(output -> {
                String htmlName = HTML_RENDITION_PATH + output.getRenditionFilename();
                contentToZip.put(htmlName, output.getRendition());
                contentToZip.put(output.getStyleSheetName(), output.getStyleSheetOutput());
            });
            return new LeosConvertDocumentOutput(outputFilename, ZipUtil.zipByteArray(contentToZip));
        } catch (IOException e) {
            LOG.info("Issue converting document", e);
            throw new LegDocumentException("Issue converting document", e);
        }
    }

    private String replaceOriginalWithTranslations(LeosConvertDocumentInput convertDocumentInput, List<String> filesToRemove,
                                                   Map<String, Object> translationMap, String outputFilename,
                                                   Map<String, Object> contentToZip, Map<String, Object> filesToAdd) {
        for (String fileToRemove : filesToRemove) {
            String fileName = fileToRemove.substring(0, fileToRemove.indexOf(XML_EXT));
            String fileNameWithoutLang = fileName.substring(0, fileName.lastIndexOf("-"));
            boolean isMainFile = fileName.startsWith(ConvertUtil.PROPOSAL_FILE_PREFIX);
            if(isMainFile) {
                String translatedFileName = translationMap.keySet().stream()
                        .filter(translationKey -> translationKey.startsWith(fileNameWithoutLang))
                        .findFirst().get();
                outputFilename = getOutputFilename(convertDocumentInput.getInputFile().getOriginalFilename(),
                        translatedFileName);
            } else {
                outputFilename = convertDocumentInput.getInputFile().getOriginalFilename();
            }
            fileName = isMainFile ? ConvertUtil.COVER_PAGE : fileName;
            String htmlFile = fileName + HTML_EXT;
            String tocHtmlFile = fileName + HTML_TOC + HTML_EXT;
            String jsFile = fileName + HTML_TOC + JS_EXT;
            contentToZip.remove(fileToRemove);
            contentToZip.remove(HTML_RENDITION_PATH + htmlFile);
            contentToZip.remove(HTML_RENDITION_PATH + tocHtmlFile);
            contentToZip.remove(HTML_JS_PATH + jsFile);
        }
        //add the translations xml to zip
        contentToZip.putAll(filesToAdd);
        return outputFilename;
    }

    private String getOutputFilename(String originalFilename, String translationFilename) {
        originalFilename = originalFilename.substring(0, originalFilename.lastIndexOf('-'));
        String translatedLang = translationFilename.substring(translationFilename.lastIndexOf('-') - 1,
                translationFilename.lastIndexOf('.'));
        return originalFilename.concat(translatedLang + ".leg");
    }
    
}
