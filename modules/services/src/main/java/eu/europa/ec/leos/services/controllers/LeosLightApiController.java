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
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.AuthClient;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.security.TokenService;
import eu.europa.ec.leos.services.api.ApiService;
import eu.europa.ec.leos.services.api.LeosLightApiService;
import eu.europa.ec.leos.services.collection.CreateCollectionService;
import eu.europa.ec.leos.services.converter.ProposalConverterService;
import eu.europa.ec.leos.services.dto.request.ExportDocumentOptions;
import eu.europa.ec.leos.services.dto.request.ExportDocumentRequest;
import eu.europa.ec.leos.services.exception.InvalidInputException;
import eu.europa.ec.leos.services.exception.NotFoundException;
import eu.europa.ec.leos.services.leoslight.service.LeosLightXmlDocumentService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.validation.ValidationService;
import io.atlassian.fugue.Pair;
import org.apache.commons.io.FileUtils;
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

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.Properties;

import static eu.europa.ec.leos.services.leoslight.util.DocumentApiUtil.APPLICATION_XML_VALUE;
import static eu.europa.ec.leos.services.leoslight.util.DocumentApiUtil.APPLICATION_ZIP_VALUE;
import static eu.europa.ec.leos.services.leoslight.util.DocumentApiUtil.buildFileAttachment;
import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;
import static eu.europa.ec.leos.services.support.XmlHelper.validatePath;

@RestController
public class LeosLightApiController {

    private static final Logger LOG = LoggerFactory.getLogger(LeosLightApiController.class);

    private MessageHelper messageHelper;
    private TokenService tokenService;
    private LeosLightApiService leosLightApiService;
    private SecurityContext securityContext;
    private LeosLightXmlDocumentService leosLightXmlDocumentService;
    private final CreateCollectionService createCollectionService;
    private final ApiService apiService;
    private Properties applicationProperties;
    private final ValidationService validationService;
    private final ProposalConverterService proposalConverterService;
    private final LeosRepository leosRepository;
    private final PackageService packageService;

    private static  final String CLIENT_CONTEXT_PARAMETER = "Client-Context";

    @Autowired
    public LeosLightApiController(MessageHelper messageHelper, TokenService tokenService,
                LeosLightApiService leosLightApiService, SecurityContext securityContext, ValidationService validationService,
                                  ProposalConverterService proposalConverterService,
                                  LeosRepository leosRepository, PackageService packageService,
                                  LeosLightXmlDocumentService leosLightXmlDocumentService,
                                  CreateCollectionService createCollectionService, ApiService apiService,
                                  Properties applicationProperties) {
        this.validationService = validationService;
        this.proposalConverterService = proposalConverterService;
        this.leosRepository = leosRepository;
        this.packageService = packageService;
        this.messageHelper = messageHelper;
        this.tokenService = tokenService;
        this.leosLightApiService = leosLightApiService;
        this.securityContext = securityContext;
        this.leosLightXmlDocumentService = leosLightXmlDocumentService;
        this.createCollectionService = createCollectionService;
        this.apiService = apiService;
        this.applicationProperties = applicationProperties;
    }

    @RequestMapping(value = "/secured/leos-light/import-document", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> importDocument(@RequestParam MultipartFile inputFile,
                                                 @RequestParam String language,
                                                 @RequestParam(required = false) String callbackAddress) {
        if(inputFile.isEmpty()) {
            throw new InvalidInputException("leoslight.service.import.file.empty");
        }

        String locale = encodeParam(language);
        String inputFileName = encodeParam(inputFile.getOriginalFilename());

        Pair<String, String> result = null;
        try {
            result = leosLightApiService.importDocument(inputFileName, inputFile.getBytes(), locale, callbackAddress);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ImmutableMap.of("documentUrl", result.left(), "result", result.right()));
        } catch (IOException exception) {
            LOG.info(exception.getMessage());
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(
                    ImmutableMap.of("documentUrl", "", "result", messageHelper.getMessage("leoslight.service.import.error")));
        }
    }

    @PostMapping(value = "/secured/leos-light/export-document", produces = {MediaType.APPLICATION_OCTET_STREAM_VALUE, MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<Object> exportDocument(@RequestBody ExportDocumentRequest request, HttpServletRequest httpRequest) throws IOException {
        String clientContextToken = httpRequest.getHeader(CLIENT_CONTEXT_PARAMETER);

        Pair<Boolean, File> result = leosLightApiService.exportDocument(request, clientContextToken);
        Boolean isExported = result.left();
        File file = result.right();

        try {
            if (isExported != null && isExported) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                return new ResponseEntity<>(ImmutableMap.of("result", messageHelper.getMessage("leoslight.service.export.callback.success")), headers, HttpStatus.OK);
            } else {
                if(request.getOptions() == null || ExportDocumentOptions.OutputType.XML.equals(request.getOptions().getOutputType())) {
                    return buildFileAttachment(FileUtils.readFileToByteArray(file), file.getName(), APPLICATION_XML_VALUE);
                } else {
                    return buildFileAttachment(FileUtils.readFileToByteArray(file), file.getName(), APPLICATION_ZIP_VALUE);
                }
            }
        } finally {
            if ((file != null) && file.exists()) {
                file.delete();
            }
        }
    }

    @RequestMapping(value = "/leos-light/context-token", method = RequestMethod.GET)
    public String getContextToken(@RequestParam String clientId, @RequestParam String user, @RequestParam String role, @RequestParam String systemName) {
        AuthClient authClient = tokenService.getAuthClient(clientId);
        if(authClient == null || !authClient.isVerified()) {
            throw new NotFoundException(messageHelper.getMessage("leoslight.auth.client.not.found"));
        }
        return tokenService.getClientContextToken(clientId, user, role, systemName);
    }

    @RequestMapping(value = "/secured/editlight/importProposal", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> importProposal(@RequestParam("legFile") MultipartFile file) {
        try {
            validatePath(file.getOriginalFilename());
            Pair<Object, Object> result = leosLightApiService.importProposal(file);
            if(result.right() == HttpStatus.OK) {
                return new ResponseEntity<>(result.left(), HttpStatus.OK);
            } else if(result.right() == HttpStatus.ACCEPTED) {
                return new ResponseEntity<>(result.left(), HttpStatus.ACCEPTED);
            } else if(result.right() == HttpStatus.NOT_FOUND) {
                return new ResponseEntity<>(result.left(), HttpStatus.NOT_FOUND);
            }else {
                return new ResponseEntity<>(result.left(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception ex) {
            LOG.error("Error Occurred while creating collection from the Leg file: " + ex.getMessage(), ex);
            return new ResponseEntity<>("An error occurred during collection creation.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/editlight/test", method = RequestMethod.GET)
    public String test() {
        return "Test RESTful service. " + System.currentTimeMillis();
    }

    @RequestMapping(value = "/leos-light/test-callback", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> testCallbackAddress(@RequestParam MultipartFile inputFile) {
        return ResponseEntity.ok().body(ImmutableMap.of("result", "Successfully tested callback address!"));
    }

}
