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
package eu.europa.ec.leos.services.controllers;

import com.google.common.collect.ImmutableMap;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.Explanatory;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.Memorandum;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.domain.vo.ErrorVO;
import eu.europa.ec.leos.domain.vo.MetadataVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.converter.ProposalConverterService;
import eu.europa.ec.leos.services.dto.request.ExportDocumentRequest;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ZipPackageUtil;
import eu.europa.ec.leos.services.leoslight.service.LeosLightXmlDocumentService;
import eu.europa.ec.leos.services.leoslight.util.ByteChecksumComparator;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.validation.ValidationService;
import io.atlassian.fugue.Pair;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;

import static eu.europa.ec.leos.services.leoslight.util.DocumentApiUtil.buildFileAttachment;
import static eu.europa.ec.leos.services.leoslight.util.DocumentApiUtil.getDocumentData;
import static eu.europa.ec.leos.services.leoslight.util.DocumentApiUtil.getDocumentMetadata;
import static eu.europa.ec.leos.services.leoslight.util.DocumentApiUtil.getLeosDocument;
import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;

@RestController
public class LeosLightApiController {

    private static final Logger LOG = LoggerFactory.getLogger(LeosLightApiController.class);

    public static final Map<Class, String> DOC_TYPE_MAP;

    static {
        Map<Class, String> tempMap = new HashMap<>();
        tempMap.put(Annex.class, "annex");
        tempMap.put(Bill.class, "document");
        tempMap.put(Explanatory.class, "council_explanatory");
        tempMap.put(FinancialStatement.class, "financial-statement");
        tempMap.put(Memorandum.class, "memorandum");
        tempMap.put(Proposal.class, "collection");

        DOC_TYPE_MAP = Collections.unmodifiableMap(tempMap);
    }


    private ValidationService validationService;
    private ProposalConverterService proposalConverterService;
    private LeosRepository leosRepository;
    private PackageService packageService;
    private MessageHelper messageHelper;
    private SecurityContext securityContext;
    private LeosLightXmlDocumentService leosLightXmlDocumentService;
    private Properties applicationProperties;

    @Autowired
    public LeosLightApiController(SecurityContext securityContext, ValidationService validationService,
                                  ProposalConverterService proposalConverterService,
                                  LeosRepository leosRepository, PackageService packageService, MessageHelper messageHelper,
                                  LeosLightXmlDocumentService leosLightXmlDocumentService, Properties applicationProperties) {
        this.validationService = validationService;
        this.proposalConverterService = proposalConverterService;
        this.leosRepository = leosRepository;
        this.packageService = packageService;
        this.messageHelper = messageHelper;
        this.securityContext = securityContext;
        this.leosLightXmlDocumentService = leosLightXmlDocumentService;
        this.applicationProperties = applicationProperties;
    }

    @RequestMapping(value = "/secured/editlight/importDocument", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> importDocument(@RequestParam MultipartFile inputFile, @RequestParam("language") String locale,
                                                 @RequestParam(required = false) String callbackAddress) {

        LOG.info("user in security context " + securityContext.getUser());
        locale = encodeParam(locale);
        String inputFileName = encodeParam(inputFile.getOriginalFilename());
        String docRef = inputFileName.substring(0, inputFileName.lastIndexOf("-") + 1) + locale;
        docRef = encodeParam(docRef);
        String errorMessage;

        DocumentVO documentVO = null;
        File docFileTemp = null;

        try {
            docFileTemp = File.createTempFile(docRef, ".xml");
            OutputStream outputStream = new FileOutputStream(docFileTemp);
            outputStream.write(inputFile.getBytes());

            documentVO = proposalConverterService.createDocument(docRef + ".xml", docFileTemp, true);
            List<ErrorVO> errors = validationService.validateDocument(documentVO);

            if (errors.isEmpty()) {
                MetadataVO metadataVO = documentVO.getMetadata();
                Pair<Class, LeosMetadata> result = getDocumentData(documentVO, metadataVO, locale, docRef);
                Class docType = result.left();
                LeosMetadata docMetaData = result.right();
                docMetaData.setCallbackAddress(callbackAddress);
                docMetaData.setImported(true);
                LeosDocument savedDocument = null;
                try {
                    savedDocument = leosRepository.findDocumentByRef(docRef, docType);
                } catch (Exception exception) {
                    LOG.info(messageHelper.getMessage("leoslight.document.not.found"));
                }

                String documentReferenceUrl = getDocumentViewUrl(docRef, docType);

                if (savedDocument != null) {
                    if (ByteChecksumComparator.checksumMatched(savedDocument.getContent().get().getSource().getBytes(), documentVO.getSource())) {
                        errorMessage = messageHelper.getMessage("leoslight.document.duplicate");
                        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(
                                ImmutableMap.of("documentUrl", documentReferenceUrl, "result", errorMessage));
                    } else {
                        leosRepository.updateDocument(savedDocument.getId(), docMetaData, documentVO.getSource(), VersionType.MAJOR, "no comment", result.left());
                        return ResponseEntity.status(HttpStatus.OK).body(
                                ImmutableMap.of("documentUrl", documentReferenceUrl, "result", messageHelper.getMessage("leoslight.document.updated.major.version")));
                    }
                } else {
                    savedDocument = leosRepository.createDocumentFromContent(packageService.createPackage().getPath(), docRef + ".xml",
                            docMetaData, docType, documentVO.getCategory().name(), documentVO.getSource());
                    leosRepository.updateDocument(savedDocument.getId(), docMetaData, documentVO.getSource(), VersionType.INTERMEDIATE, "Document created", docType);
                    return ResponseEntity.status(HttpStatus.OK).body(
                            ImmutableMap.of("documentUrl", documentReferenceUrl, "result", messageHelper.getMessage("leoslight.document.created")));
                }
            } else {
                errorMessage = messageHelper.getMessage("leoslight.document.validation.failure");
            }
        } catch (Exception e) {
            errorMessage = (documentVO == null) ? messageHelper.getMessage("leoslight.document.invalid.document") :
                    messageHelper.getMessage("leoslight.service.import.error");
        } finally {
            if ((docFileTemp != null) && docFileTemp.exists()) {
                docFileTemp.delete();
            }
        }
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(
                ImmutableMap.of("documentUrl", "", "result", errorMessage));
    }

    @PostMapping(value = "/secured/editlight/exportDocument", produces = {MediaType.APPLICATION_OCTET_STREAM_VALUE, MediaType.APPLICATION_JSON_VALUE})
    @ResponseBody
    public ResponseEntity<Object> exportDocument(@RequestBody ExportDocumentRequest exportDocumentRequest) throws IOException {
        String documentUrl = encodeParam(exportDocumentRequest.getDocumentUrl());
        if(StringUtils.isBlank(documentUrl)) {
            return ResponseEntity.badRequest().body("documentUrl is mandatory!");
        }

        String outputDescriptor = exportDocumentRequest.getOutputDescriptor();
        if(StringUtils.isBlank(outputDescriptor)) {
            return ResponseEntity.badRequest().body("outputDescriptor is mandatory!");
        }

        Map<String, Object> documentMetadata = getDocumentMetadata(documentUrl, leosRepository);
        String callbackAddress = exportDocumentRequest.getCallbackAddress();
        if(StringUtils.isEmpty(callbackAddress)) {
            callbackAddress = String.valueOf(documentMetadata.get("callbackAddress"));
        }

        LeosDocument savedDocument = getLeosDocument(documentUrl, leosRepository);
        if (savedDocument == null) {
            return new ResponseEntity<>(messageHelper.getMessage("leoslight.document.not.found"), HttpStatus.NOT_FOUND);
        }
        String docName = savedDocument.getName();
        Map<String, Object> contentToZip = new HashMap<>();

        //1.add xml doc
        byte[] docContent = savedDocument.getContent().get().getSource().getBytes();
        contentToZip.put(docName, docContent);

        //2. HTML rendition
        String cssFileName = savedDocument.getCategory().name().toLowerCase(Locale.ROOT) + ".css";
        leosLightXmlDocumentService.addDocumentHtmlRendition(contentToZip, docName, docContent, cssFileName);


        //3.process annotation and add document conversion
        try {
            ExportOptions exportOptions = new ExportLW(ExportOptions.Output.PDF, Bill.class, true, true);
            contentToZip.put("exports.zip", leosLightXmlDocumentService.convert(docContent, docName, outputDescriptor, exportOptions));
        } catch (Exception exception) {
            LOG.error("Error occurred while xml file conversion" + exception.getMessage());
            return ResponseEntity.internalServerError().body(exception.getMessage());
        }

        //4.final packaging
        File file = ZipPackageUtil.zipFiles("result.zip", contentToZip, null);

        //5.send response
        if (StringUtils.isNotEmpty(callbackAddress)) {
            try {
                leosLightXmlDocumentService.sendZipFileToCallbackUrlAsync(file, callbackAddress);
            } catch (Exception exception) {
                LOG.error("Error occurred sending response to callback: " + callbackAddress + exception.getMessage());
                return ResponseEntity.internalServerError().body(exception.getMessage());
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            return new ResponseEntity<>(ImmutableMap.of("result", "Successfully exported to callback address!"), headers, HttpStatus.OK);
        } else {
            return buildFileAttachment(FileUtils.readFileToByteArray(file), file.getName());
        }
    }

    @RequestMapping(value = "/editlight/test", method = RequestMethod.GET)
    public String test() {
        return "Test RESTful service. " + System.currentTimeMillis();
    }

    @RequestMapping(value = "/editlight/test", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> testCallbackAddress(@RequestParam MultipartFile inputFile) {
        return ResponseEntity.ok().body(ImmutableMap.of("result", "Successfully tested callback address!"));
    }

    private <D extends LeosDocument> String getDocumentViewUrl(String docRef, Class<? extends D> docType) {
        String mappingUrl = applicationProperties.getProperty("leos.mapping.url");
        String urlPart = DOC_TYPE_MAP.get(docType);
        String documentReferenceUrl = mappingUrl + "/ui/"+ urlPart + '/' + docRef;
        return encodeParam(documentReferenceUrl);
    }

}
