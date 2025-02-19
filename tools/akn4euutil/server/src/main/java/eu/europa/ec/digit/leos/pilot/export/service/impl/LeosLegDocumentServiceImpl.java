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
import eu.europa.ec.digit.leos.pilot.export.exception.XmlUtilException;
import eu.europa.ec.digit.leos.pilot.export.model.LeosConvertDocumentInput;
import eu.europa.ec.digit.leos.pilot.export.model.LeosConvertDocumentOutput;
import eu.europa.ec.digit.leos.pilot.export.model.LeosRenditionOutput;
import eu.europa.ec.digit.leos.pilot.export.service.ConvertDocumentService;
import eu.europa.ec.digit.leos.pilot.export.service.LegPackage;
import eu.europa.ec.digit.leos.pilot.export.service.LegService;
import eu.europa.ec.digit.leos.pilot.export.service.LeosLegDocumentService;
import eu.europa.ec.digit.leos.pilot.export.service.XmlDocumentService;
import eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil;
import eu.europa.ec.digit.leos.pilot.export.util.ExportLW;
import eu.europa.ec.digit.leos.pilot.export.util.ExportOptions;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil;
import eu.europa.ec.digit.leos.pilot.export.util.ZipUtil;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.HTML_EXT;
import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.HTML_JS_PATH;
import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.HTML_RENDITION_PATH;
import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.HTML_RENDITION_PDF_PATH;
import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.HTML_RENDITION_WORD_PATH;
import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.HTML_TOC;
import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.JS_EXT;
import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.LEGISWRITE_PREFIX;
import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.PDF_EXT;
import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.PDF_PREFIX;
import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.PROPOSAL_FILE_PREFIX;
import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.XML_EXT;
import static eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil.ZIP_EXT;

@Service
public class LeosLegDocumentServiceImpl implements LeosLegDocumentService {

    private static final Logger LOG = LoggerFactory.getLogger(LeosLegDocumentServiceImpl.class);
    public static final String ISSUE_CONVERTING_DOCUMENT = "Issue converting document";
    public static final String DOCUMENT_REF = "documentRef";
    public static final String HREF = "href";
    public static final String DASH = "-";
    protected final static String ZIP_PACKAGE_NAME = "AkomaNtoso2LegisWrite";

    private final ConvertDocumentService convertDocumentService;
    private final LegService legService;
    private final XmlDocumentService xmlDocumentService;

    @Autowired
    public LeosLegDocumentServiceImpl(ConvertDocumentService convertDocumentService, LegService legService, XmlDocumentService xmlDocumentService) {
        this.convertDocumentService = convertDocumentService;
        this.legService = legService;
        this.xmlDocumentService = xmlDocumentService;
    }

    public LeosConvertDocumentOutput updateWithTranslations(LeosConvertDocumentInput convertDocumentInput,
                                                            List<LeosRenditionOutput> renditionOutputs) {
        try {
            Map<String, Object> contentToZip = ZipUtil.unzipByteArray(convertDocumentInput.getInputFile().getBytes());
            Map<String, Object> translationMap = ZipUtil.unzipByteArray(convertDocumentInput.getTranslationsFile().getBytes());

            this.replaceDocumentRefHrefForMain(translationMap);

            List<String> filesToRemove = new ArrayList<>();
            Map<String, Object> filesToAdd = new HashMap<>();
            String outputFilename = "";
            OutputRenditions renditions = new OutputRenditions();

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
                                if (translationKey.startsWith(PROPOSAL_FILE_PREFIX)) {
                                    renditions.setOutputWordFileName(translationKey.substring(0, translationKey.indexOf(XML_EXT)));
                                }
                            });
                }
            }
            //replace original xml files + renditions with translations files
            outputFilename = replaceOriginalWithTranslations(convertDocumentInput, filesToRemove, translationMap,
                    outputFilename, contentToZip, filesToAdd);
            final String outputPdfFileName = outputFilename != null ? outputFilename.replaceAll("\\.[^.]+$", PDF_EXT)
                    : null;
            renditions.setOutputPdfFileName(outputPdfFileName);

            renditionOutputs.forEach(output -> {
                contentToZip.put(output.getHtmlRenditionFilename(), output.getHtmlRendition());
                contentToZip.put(output.getHtmlTocRenditionFilename(), output.getHtmlTocRendition());
                contentToZip.put(output.getHtmlTocJSFilename(), output.getHtmlTocJS());
            });

            ExportLW exportOptionsPDF = new ExportLW(ExportOptions.Output.PDF);
            ExportLW exportOptionsWord = new ExportLW(ExportOptions.Output.WORD);
            LegPackage legPackage = legService.createLegPackage(contentToZip, exportOptionsWord);
            File pdfPackage = createZipFile(legPackage, "job1.zip", exportOptionsPDF);
            File legisWritePackage = createZipFile(legPackage, "job2.zip", exportOptionsWord);

            Map<String, File> packages = new HashMap<>();
            packages.put(exportOptionsPDF.getFilePrefix() + ZIP_PACKAGE_NAME, pdfPackage);
            packages.put(exportOptionsWord.getFilePrefix() + ZIP_PACKAGE_NAME, legisWritePackage);

            byte[] convertedDocument = this.convertDocumentService.convertDocument(ZipUtil.zipByteArray(new HashMap<>(packages)),
                    outputFilename);
            Map<String, Object> convertedDocumentMap = ZipUtil.unzipByteArray(convertedDocument);
            convertedDocumentMap.keySet().stream().forEach(entryKey -> {
                try {
                    Map<String, Object> documentMap = ZipUtil.unzipByteArray((byte[]) convertedDocumentMap.get(entryKey));
                    documentMap.keySet().stream().forEach(documentKey -> {
                        if (documentKey.endsWith(ZIP_EXT)) {
                            try {
                                Map<String, Object> renditionMap = ZipUtil.unzipByteArray((byte[]) documentMap.get(documentKey));
                                if (documentKey.startsWith(LEGISWRITE_PREFIX)) {
                                    renditionMap.keySet().stream().forEach(renditionKey ->
                                            contentToZip.put(HTML_RENDITION_WORD_PATH + renditionKey,
                                                    renditionMap.get(renditionKey)));
                                } else if (documentKey.startsWith(PDF_PREFIX)) {
                                    renditionMap.keySet().stream().forEach(renditionKey ->
                                            contentToZip.put(HTML_RENDITION_PDF_PATH + renditionKey,
                                                    renditionMap.get(renditionKey)));
                                }
                            } catch (IOException e) {
                                LOG.info(ISSUE_CONVERTING_DOCUMENT, e);
                                throw new LegDocumentException(ISSUE_CONVERTING_DOCUMENT, e);
                            }
                        }
                    });
                } catch (IOException e) {
                    LOG.info(ISSUE_CONVERTING_DOCUMENT, e);
                    throw new LegDocumentException(ISSUE_CONVERTING_DOCUMENT, e);
                }
            });
            return new LeosConvertDocumentOutput(outputFilename, ZipUtil.zipByteArray(contentToZip));
        } catch (IOException e) {
            LOG.info(ISSUE_CONVERTING_DOCUMENT, e);
            throw new LegDocumentException(ISSUE_CONVERTING_DOCUMENT, e);
        } catch (Exception e) {
            LOG.info(ISSUE_CONVERTING_DOCUMENT, e);
            throw new LegDocumentException(ISSUE_CONVERTING_DOCUMENT, e);
        }
    }

    protected File createZipFile(LegPackage legPackage, String jobFileName, ExportOptions exportOptions) throws Exception {
        try (ByteArrayOutputStream contentFileContent = xmlDocumentService.createContentFile(exportOptions,
                legPackage.getExportResource())) {
            Map<String, Object> contentToZip = new HashMap<>();
            contentToZip.put("content.xml", contentFileContent);
            String propActFileName = legPackage.getExportResource().getName() + ".leg";
            contentToZip.put(propActFileName, legPackage.getFile());
            return ZipUtil.zipFiles(jobFileName, contentToZip);
        }
    }

    /**
     * Check and change the href attribute for documentRef tag  <br/>
     * for main-*.xml file to match the name of other files in the translation document
     *
     * @param translationMap
     */
    private void replaceDocumentRefHrefForMain(Map<String, Object> translationMap) {
        translationMap
                .entrySet().stream()
                .filter(entry -> Objects.nonNull(entry)
                        && entry.getKey().toLowerCase().startsWith(PROPOSAL_FILE_PREFIX))
                .findFirst()
                .ifPresent(mainEntry -> this.processMainEntry(mainEntry, translationMap));
    }

    private void processMainEntry(Map.Entry<String, Object> mainEntry, Map<String, Object> translationMap) {
        String mainKey = mainEntry.getKey();
        byte[] mainFile = (byte[]) mainEntry.getValue();

        try (InputStream inputStream = new ByteArrayInputStream(mainFile)) {
            XmlUtil.XmlFile xmlFile = XmlUtil.parseXml(inputStream, mainKey);

            boolean isAttributeChanged = this.updateDocumentRefs(translationMap, xmlFile);
            if (isAttributeChanged) {
                translationMap.replace(mainKey, xmlFile.getBytes());
            }
        } catch (IOException | XmlUtilException e) {
            throw new LegDocumentException(ISSUE_CONVERTING_DOCUMENT, e);
        }
    }

    private boolean updateDocumentRefs(Map<String, Object> translationMap, XmlUtil.XmlFile xmlFile) {
        NodeList xmlNodesReferences = xmlFile.getElementsByName(DOCUMENT_REF);
        AtomicBoolean isAttributeChanged = new AtomicBoolean(false);

        for (int i = 0; i < xmlNodesReferences.getLength(); i++) {
            Node hrefAttr = xmlNodesReferences.item(i).getAttributes().getNamedItem(HREF);
            String href = hrefAttr.getNodeValue();

            if (!translationMap.containsKey(href)) {
                String fileNameWithoutLang = href.substring(0, href.lastIndexOf(DASH));
                translationMap.keySet().stream()
                        .filter(translationKey -> translationKey.startsWith(fileNameWithoutLang))
                        .findFirst().ifPresent(attr -> {
                            hrefAttr.setNodeValue(attr);
                            isAttributeChanged.set(true);
                        });
            }
        }
        return isAttributeChanged.get();
    }

    private String replaceOriginalWithTranslations(LeosConvertDocumentInput convertDocumentInput, List<String> filesToRemove,
                                                   Map<String, Object> translationMap, String outputFilename,
                                                   Map<String, Object> contentToZip, Map<String, Object> filesToAdd) {
        boolean containsMainFile = false;
        for (String fileToRemove : filesToRemove) {
            String fileName = fileToRemove.substring(0, fileToRemove.indexOf(XML_EXT));
            String fileNameWithoutLang = fileName.substring(0, fileName.lastIndexOf(DASH));
            boolean isMainFile = fileName.startsWith(PROPOSAL_FILE_PREFIX);
            if (isMainFile) {
                String translatedFileName = translationMap.keySet().stream()
                        .filter(translationKey -> translationKey.startsWith(fileNameWithoutLang))
                        .findFirst().get();
                outputFilename = getOutputFilename(convertDocumentInput.getInputFile().getOriginalFilename(),
                        translatedFileName);
                containsMainFile = true;
            } else if (!containsMainFile) {
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
        contentToZip.keySet().removeIf(key -> key.startsWith(HTML_RENDITION_PDF_PATH));
        contentToZip.keySet().removeIf(key -> key.startsWith(HTML_RENDITION_WORD_PATH));
        //add the translations xml to zip
        contentToZip.putAll(filesToAdd);
        return outputFilename;
    }

    private String getOutputFilename(String originalFilename, String translationFilename) {
        originalFilename = originalFilename.substring(0, originalFilename.lastIndexOf('-'));
        String translatedLang = translationFilename.substring(translationFilename.lastIndexOf('-'),
                translationFilename.lastIndexOf('.'));
        return originalFilename.concat(translatedLang + ".leg");
    }

    @Data
    static class OutputRenditions {
        private String outputPdfFileName;
        private String outputWordFileName;
    }

}
