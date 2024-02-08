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

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.common.collect.ImmutableMap;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.domain.vo.ErrorVO;
import eu.europa.ec.leos.domain.vo.MetadataVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.AuthClient;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.security.TokenService;
import eu.europa.ec.leos.services.converter.ProposalConverterService;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ZipPackageUtil;
import eu.europa.ec.leos.services.leoslight.service.LeosLightXmlDocumentService;
import eu.europa.ec.leos.services.leoslight.util.AsyncZipFileSender;
import eu.europa.ec.leos.services.leoslight.util.ByteChecksumComparator;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.validation.ValidationService;
import io.atlassian.fugue.Pair;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;

import static eu.europa.ec.leos.services.leoslight.util.DocumentApiUtil.buildFileAttachment;
import static eu.europa.ec.leos.services.leoslight.util.DocumentApiUtil.getDocumentData;
import static eu.europa.ec.leos.services.leoslight.util.DocumentApiUtil.getLeosDocument;

@RestController
@RequestMapping("/secured/editlight/")
public class LeosLightApiController {

    private static final Logger LOG = LoggerFactory.getLogger(LeosLightApiController.class);

    private ValidationService validationService;
    private ProposalConverterService proposalConverterService;
    private LeosRepository leosRepository;
    private PackageService packageService;
    private TokenService tokenService;
    private MessageHelper messageHelper;
    private SecurityContext securityContext;
    private LeosLightXmlDocumentService leosLightXmlDocumentService;
    private Properties applicationProperties;

    @Autowired
    public LeosLightApiController(SecurityContext securityContext, ValidationService validationService,
                                  ProposalConverterService proposalConverterService,
                                  LeosRepository leosRepository, PackageService packageService, TokenService tokenService,
                                  MessageHelper messageHelper, LeosLightXmlDocumentService leosLightXmlDocumentService, Properties applicationProperties) {
        this.validationService = validationService;
        this.proposalConverterService = proposalConverterService;
        this.leosRepository = leosRepository;
        this.packageService = packageService;
        this.tokenService = tokenService;
        this.messageHelper = messageHelper;
        this.securityContext = securityContext;
        this.leosLightXmlDocumentService = leosLightXmlDocumentService;
        this.applicationProperties = applicationProperties;
    }

    @RequestMapping(value = "/importDocument", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> importDocument(@RequestParam MultipartFile inputFile, @RequestParam("language") String locale,
                                                 @RequestParam(required = false) String callbackAddress) {

        LOG.info("user in security context " + securityContext.getUser());
        String inputFileName = inputFile.getOriginalFilename();
        String docRef = inputFileName.substring(0, inputFileName.lastIndexOf("-") + 1) + locale;
        String mappingUrl =  applicationProperties.getProperty("leos.mapping.url");
        String documentReferenceUrl = mappingUrl + "/ui/document/" + docRef;
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
                LeosDocument savedDocument = null;
                try {
                    savedDocument = leosRepository.findDocumentByRef(docRef, docType);
                } catch (Exception exception) {
                    LOG.info(messageHelper.getMessage("leoslight.document.not.found"));
                }
                if (savedDocument != null) {
                    if (ByteChecksumComparator.checksumMatched(savedDocument.getContent().get().getSource().getBytes(), documentVO.getSource())) {
                        errorMessage = messageHelper.getMessage("leoslight.document.duplicate");
                    } else {
                        leosRepository.updateDocument(savedDocument.getId(), docMetaData, documentVO.getSource(), VersionType.MAJOR, "no comment", result.left());
                        return ResponseEntity.status(HttpStatus.OK).body(
                                ImmutableMap.of("documentUrl", documentReferenceUrl, "result", messageHelper.getMessage("leoslight.document.updated.major.version")));
                    }
                } else {
                    leosRepository.createDocumentFromContent(packageService.createPackage().getPath(), docRef + ".xml",
                            docMetaData, docType, documentVO.getCategory().name(), documentVO.getSource());
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

    @GetMapping(value = "/editDocument", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> editDocument(@RequestParam String encryptedProfile) {

        AuthClient authClient = tokenService.validateClientByJwtToken(encryptedProfile);
        String docURL = "";
        String role_permission = "";
        if (authClient != null) {
            DecodedJWT decodedToken = JWT.decode(encryptedProfile);
            Claim url = decodedToken.getClaim("documentURL");
            Claim role = decodedToken.getClaim("role_permission");
            Validate.notNull(url, "document url claim cannot be null");
            Validate.notNull(role, "role permission claim cannot be null");
            docURL = url.asString();
            role_permission = role.asString();
        } else {
            return new ResponseEntity<Object>(messageHelper.getMessage("leoslight.service.edit.permission.denied"), HttpStatus.FORBIDDEN);
        }
        LeosDocument savedDocument = getLeosDocument(docURL, leosRepository);
        if (savedDocument != null && !savedDocument.getContent().isEmpty()) {
            byte[] contentDocument = savedDocument.getContent().get().getSource().getBytes();
        } else {
            return new ResponseEntity<>(messageHelper.getMessage("leoslight.document.not.found"), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(messageHelper.getMessage("leoslight.status.ok"), HttpStatus.OK);
    }

    @PostMapping(value = "/exportDocument", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> exportDocument(@RequestParam("documentUrl") String documentUrl, @RequestParam String outputDescriptor,
                                                 @RequestParam(required = false) String callbackAddress) throws IOException {

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
        }

        //4.final packaging
        File file = ZipPackageUtil.zipFiles("result.zip", contentToZip, null);

        //5.send response
        if (StringUtils.isNotEmpty(callbackAddress)) {
            AsyncZipFileSender.sendZipFileToCallbackUrlAsync(FileUtils.readFileToByteArray(file), callbackAddress);
            return new ResponseEntity<>("Asynchronously exported to address: " + callbackAddress, HttpStatus.OK);
        } else {
            return buildFileAttachment(FileUtils.readFileToByteArray(file), file.getName());
        }
    }

    @RequestMapping("/test")
    public String test() {
        return "Test RESTful service. " + System.currentTimeMillis();
    }


}
