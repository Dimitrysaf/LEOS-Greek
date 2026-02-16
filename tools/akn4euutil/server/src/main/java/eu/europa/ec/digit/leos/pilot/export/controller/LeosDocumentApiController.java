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
package eu.europa.ec.digit.leos.pilot.export.controller;

import eu.europa.ec.digit.leos.pilot.export.exception.LeosDocumentException;
import eu.europa.ec.digit.leos.pilot.export.model.LeosConvertDocumentInput;
import eu.europa.ec.digit.leos.pilot.export.model.LeosConvertDocumentOutput;
import eu.europa.ec.digit.leos.pilot.export.service.LeosDocumentService;
import eu.europa.ec.digit.leos.pilot.export.util.StringUtil;
import eu.europa.ec.digit.leos.pilot.export.util.ZipUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

import static eu.europa.ec.digit.leos.pilot.export.util.DocumentApiUtil.buildErrorResponse;
import static eu.europa.ec.digit.leos.pilot.export.util.DocumentApiUtil.buildValidZipResponse;
import static org.springframework.http.HttpStatus.ACCEPTED;

@RestController
@CrossOrigin(origins = "*")
public class LeosDocumentApiController {

    private static final Logger LOG = LoggerFactory.getLogger(LeosDocumentApiController.class);
    private final LeosDocumentService leosDocumentService;

    public LeosDocumentApiController(LeosDocumentService leosDocumentService) {
        this.leosDocumentService = leosDocumentService;
    }

    @RequestMapping(value = "/getRenditions", method = RequestMethod.POST, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getRenditions(@RequestParam MultipartFile inputFile, @RequestParam(required = false) MultipartFile main,
                                                @RequestParam(required = false, defaultValue = "false") boolean isWithAnnotations) {
        try {
            final LeosConvertDocumentInput convertDocumentInput = leosDocumentService.createDocumentInput(
                    inputFile,
                    main,
                    isWithAnnotations
            );
            byte[] convertDocumentOutput = leosDocumentService.getRenditions(convertDocumentInput);
            return buildValidZipResponse(convertDocumentOutput);
        } catch (LeosDocumentException e) {
            return buildErrorResponse("Issue processing the document", e, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return buildErrorResponse("Error found while processing the document", e, HttpStatus.INTERNAL_SERVER_ERROR, true);
        }
    }

    @RequestMapping(value = "/updateWithTranslations", method = RequestMethod.POST, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> updateWithTranslations(@RequestParam MultipartFile inputFile,
                                                         @RequestParam MultipartFile translationsFile) {

        if (translationsFile.isEmpty() || !translationsFile.getContentType().equalsIgnoreCase("application/zip")) {
            return ResponseEntity.badRequest().body("The translations file must be a .zip file.");
        }
        try {
            final LeosConvertDocumentInput convertDocumentInput = leosDocumentService.createDocumentInput(
                    inputFile,
                    translationsFile
            );
            LeosConvertDocumentOutput convertDocumentOutput = leosDocumentService.updateWithTranslations(convertDocumentInput);
            return buildValidZipResponse(convertDocumentOutput.getOutputFile(), convertDocumentOutput.getOutputFileName());
        } catch (LeosDocumentException e) {
            return buildErrorResponse("Issue processing the document", e, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return buildErrorResponse("Error found while processing the document", e, HttpStatus.INTERNAL_SERVER_ERROR, true);
        }
    }

    @RequestMapping(value = "/applyMetadata", method = RequestMethod.POST, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> applyMetadata(@RequestParam MultipartFile inputFile,
                                                @RequestParam(name = "email", required = false) String email) {
        try {
            if (!StringUtil.isEmpty(email)) {
                if (!StringUtil.isEmailValid(email)) {
                    return ResponseEntity.badRequest().body("Email format is not valid");
                }
                leosDocumentService.callLeosValidation(inputFile, email);
            }
            byte[] documentOutput = leosDocumentService.applyMetadata(inputFile);
            return buildValidZipResponse(documentOutput);
        } catch (LeosDocumentException e) {
            return buildErrorResponse("Issue processing the document", e, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return buildErrorResponse("Error found while processing the document", e, HttpStatus.INTERNAL_SERVER_ERROR, true);
        }
    }

    @RequestMapping(value = "/applyMetadataAsync", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> applyMetadata(@RequestParam("inputFile") MultipartFile inputFile,
                                                @RequestParam("callbackUrl") String callbackUrl,
                                                @RequestParam(name = "email", required = false) String email) {
        try {
            if (!StringUtil.isEmpty(email)) {
                if (!StringUtil.isEmailValid(email)) {
                    return ResponseEntity.badRequest().body("Email format is not valid");
                }
                leosDocumentService.callLeosValidation(inputFile, email);
            }
            String asyncId = leosDocumentService.applyMetadataAsync(inputFile, callbackUrl);
            return new ResponseEntity<>(asyncId, HttpStatus.OK);
        } catch (Exception e) {
            return buildErrorResponse("Error found while processing the document", e, HttpStatus.INTERNAL_SERVER_ERROR, true);
        }
    }

    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public String test() { return "Test RESTful service"; }

    @RequestMapping(value = "/**", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptionsRequest() {
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/prefinalization-callback", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(ACCEPTED)
    public void processPrefinalization(final @RequestParam(name = "token") String token, @RequestParam MultipartFile inputFile) throws IOException {
        // This is just for callback testing purposes
        LOG.info("Received callback call on prefinalization service!!!");
        LOG.info("token => "  + token);
        LOG.info("inputFile length => " + inputFile.getBytes().length);
        Map<String, Object> zipContent = ZipUtil.unzipByteArray(inputFile.getBytes());
        for (Map.Entry<String, Object> zipEntry : zipContent.entrySet()) {
            LOG.info(zipEntry.getKey());
            if (zipEntry.getKey().endsWith(".leg")) {
                Map<String, Object> legContent = ZipUtil.unzipByteArray((byte[]) zipEntry.getValue());
                for (Map.Entry<String, Object> legContentEntry : legContent.entrySet()) {
                    LOG.info("-------------> " + legContentEntry.getKey());
                }
            }
        }
    }
}
