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

import eu.europa.ec.leos.domain.ai.AnalysisResult;
import eu.europa.ec.leos.domain.ai.AnalysisResults;
import eu.europa.ec.leos.domain.ai.AnalysisStatus;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.integration.ConValidatorService;
import eu.europa.ec.leos.integration.rest.UserJSON;
import eu.europa.ec.leos.services.ai.AIService;
import eu.europa.ec.leos.services.api.ApiService;
import eu.europa.ec.leos.services.collection.CreateCollectionException;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.document.FinancialStatementService;
import eu.europa.ec.leos.services.dto.request.CreateExplanatoryDocumentRequest;
import eu.europa.ec.leos.services.dto.request.ExplanatoryRequest;
import eu.europa.ec.leos.services.dto.request.UpdateProposalRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.LegFileValidation;
import eu.europa.ec.leos.services.export.ExportPackageVO;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;
import static eu.europa.ec.leos.services.support.XmlHelper.isValidFileName;
import static eu.europa.ec.leos.services.support.XmlHelper.validateBasePath;

@RestController
@RequestMapping(value = "/secured/ai")
public class AIApiController {

    private static final Logger LOG = LoggerFactory.getLogger(AIApiController.class);

    private final AIService aiService;

    @Autowired
    public AIApiController(AIService aiService) {
        this.aiService = Objects.requireNonNull(aiService);
    }

    @RequestMapping(value = "/{proposalRef}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<Object> prepareAnalysis(@PathVariable String proposalRef) {
        try {
            proposalRef = encodeParam(proposalRef);
            aiService.prepareAnalysis(proposalRef);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while preparing analysis - " + e.getMessage());
            return new ResponseEntity<>("Error occurred while preparing proposal analysis: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/status/{proposalRef}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<AnalysisStatus> getAnalysisStatus(
            @PathVariable("proposalRef") String proposalRef) {
        try {
            proposalRef = encodeParam(proposalRef);
            AnalysisStatus results = aiService.getAnalysisStatus(proposalRef);
            return new ResponseEntity<>(results, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while trying to get analysis status", e);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
