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

import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.integration.rest.UserJSON;
import eu.europa.ec.leos.services.api.ApiService;
import eu.europa.ec.leos.services.collection.CreateCollectionException;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.document.FinancialStatementService;
import eu.europa.ec.leos.services.dto.request.CreateExplanatoryDocumentRequest;
import eu.europa.ec.leos.services.dto.request.ExplanatoryRequest;
import eu.europa.ec.leos.services.dto.request.UpdateProposalRequest;
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
import java.util.List;
import java.util.Objects;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;
import static eu.europa.ec.leos.services.support.XmlHelper.validatePath;

@RestController
@RequestMapping(value = "/secured/proposal")
public class ProposalApiController {

    private static final Logger LOG = LoggerFactory.getLogger(ProposalApiController.class);

    private final ApiService apiService;
    private final FinancialStatementService financialStatementService;

    @Autowired
    public ProposalApiController(ApiService apiService,
                                 FinancialStatementService financialStatementService) {
        this.apiService = Objects.requireNonNull(apiService);
        this.financialStatementService = Objects.requireNonNull(financialStatementService);
    }

    @RequestMapping(value = "/{proposalRef}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<Object> updateProposalMetadata(@PathVariable String proposalRef, @RequestBody UpdateProposalRequest request) {
        try {
            proposalRef = encodeParam(proposalRef);
            return new ResponseEntity<>(apiService.updateProposalMetadata(proposalRef, request), HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while updating proposal title - " + e.getMessage());
            return new ResponseEntity<>("Error occurred while updating proposal title: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{proposalRef}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Object> deleteProposal(@PathVariable("proposalRef") String proposalRef) {
        try {
            proposalRef = encodeParam(proposalRef);
            apiService.deleteCollection(proposalRef);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            LOG.error("Error occurred while deleting proposal - " + e.getMessage());
            return new ResponseEntity<>("Error occurred while deleting proposal: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/searchUser", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> searchUser(@RequestParam("searchKey") String searchKey) {
        try {
            List<UserJSON> users = apiService.searchUser(searchKey);
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while searching for users in repository - " + e.getMessage());
            return new ResponseEntity<>("Error occurred while searching for users for repository: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/createExplanatory", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> createExplanatory(@RequestBody ExplanatoryRequest request) {
        try {
            apiService.createExplanatoryDocument(request.getProposalRef(), request.getTemplate());
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while creating the explanatory", e);
            return new ResponseEntity<>("Error occurred while creating the explanatory document: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/createExplanatoryDocument", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> createExplanatoryDocument(@RequestBody CreateExplanatoryDocumentRequest request) {
        try {
            ProposalMetadata metadata = apiService.createExplanatoryDocument(request.getTemplateId(), request.getDocPurpose(), request.isEeaRelevance());
            return new ResponseEntity<>(metadata, HttpStatus.OK);
        } catch (UnsupportedOperationException e) {
            LOG.error("Method not supported in current instance", e);
            return new ResponseEntity<>("Method not supported in the current instance of the application", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while creating the explanatory", e);
            return new ResponseEntity<>("Error occurred while creating the explanatory document: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{proposalRef}/getExports", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getExports(@PathVariable String proposalRef) {
        try {
            proposalRef = encodeParam(proposalRef);
            List<ExportPackageVO> exports = apiService.getExportDocuments(proposalRef);
            return new ResponseEntity<>(exports, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while getting exports to e-consilium", e);
            return new ResponseEntity<>("Error occurred while getting to e-consilium: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{proposalRef}/updateExport/{exportId}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> updateExport(@PathVariable String proposalRef, @PathVariable String exportId, @RequestBody List<String> comments) {
        try {
            proposalRef = encodeParam(proposalRef);
            exportId = encodeParam(exportId);
            List<ExportPackageVO> exports = apiService.updateExportDocument(proposalRef, exportId, comments);
            return new ResponseEntity<>(exports, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while updating export ", e);
            return new ResponseEntity<>("Error occurred while updating export: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{proposalRef}/deleteExport/{exportId}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> deleteExport(@PathVariable String proposalRef, @PathVariable String exportId) {
        try {
            proposalRef = encodeParam(proposalRef);
            exportId = encodeParam(exportId);
            List<ExportPackageVO> exports = apiService.deleteExportDocument(proposalRef, exportId);
            return new ResponseEntity<>(exports, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while updating export ", e);
            return new ResponseEntity<>("Error occurred while updating export: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{proposalRef}/notifyExport/{exportId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> notifyExport(@PathVariable String proposalRef, @PathVariable String exportId) {
        try {
            proposalRef = encodeParam(proposalRef);
            exportId = encodeParam(exportId);
            apiService.notifyExportPackage(proposalRef, exportId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while updating export ", e);
            return new ResponseEntity<>("Error occurred while updating export: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{proposalRef}/previewExport/{exportId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> previewExport(@PathVariable String proposalRef, @PathVariable String exportId) {
        try {
            proposalRef = encodeParam(proposalRef);
            exportId = encodeParam(exportId);
            byte[] result = apiService.downloadExportPackage(proposalRef, exportId);
            final String jobFileName = "Proposal_" + exportId + "_AKN2DW_" + System.currentTimeMillis() + ".docx";
            // create the HttpHeaders object and set the Content-Type header
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Disposition", "attachment; filename=\"" + jobFileName + "\"");
            return new ResponseEntity<>(result, headers, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while previewing export ", e);
            return new ResponseEntity<>("Error occurred while previewing export: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @RequestMapping(value = "/{proposalRef}/deleteExplanatory/{explanatoryRef}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Object> deleteExplanatory(@PathVariable String proposalRef, @PathVariable String explanatoryRef) {
        try {
            proposalRef = encodeParam(proposalRef);
            explanatoryRef = encodeParam(explanatoryRef);
            apiService.deleteExplanatoryDocument(proposalRef, explanatoryRef);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while deleting explanatory", e);
            return new ResponseEntity<>("Error occurred while deleting explanatory document: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{proposalRef}/export", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> exportProposal(
            @PathVariable("proposalRef") String proposalRef,
            @RequestParam String exportOutput) {
        try {
            proposalRef = encodeParam(proposalRef);
            exportOutput = encodeParam(exportOutput);
            String jobId = apiService.exportProposal(proposalRef, exportOutput);
            return new ResponseEntity<>(jobId, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while trying to export proposal", e);
            return new ResponseEntity<>("Error occurred while exporting proposal : " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> uploadProposal(@RequestParam("legFile") MultipartFile legFile) {
        CreateCollectionResult createCollectionResult;
        try {
            validatePath(legFile.getName());
            File content = new File(FilenameUtils.normalize(legFile.getName()));
            try (FileOutputStream fos = new FileOutputStream(content)) {
                fos.write(legFile.getBytes());
            } catch (IOException ioe) {
                LOG.error("Error Occurred while reading the Leg file: " + ioe.getMessage(), ioe);
                return new ResponseEntity<>("An error occurred during the reading of the Leg file.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
            createCollectionResult = apiService.uploadProposal(content);
            return new ResponseEntity<>(createCollectionResult, HttpStatus.OK);
        } catch (CreateCollectionException ex) {
            LOG.error("Error occurred while creating proposal " + ex.getMessage());
            return new ResponseEntity<>("Error occurred while creating proposal", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/validateLegFile", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<LegFileValidation> validateLegFile(@RequestParam("legFile") MultipartFile legFile) {
        validatePath(legFile.getName());
        File content = new File(FilenameUtils.normalize(legFile.getName()));
        try (FileOutputStream fos = new FileOutputStream(content)) {
            fos.write(legFile.getBytes());
        } catch (IOException ioe) {
            LOG.error("Error Occurred while reading the Leg file: " + ioe.getMessage(), ioe);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        LegFileValidation result = this.apiService.validateLegFile(content);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping(value = "{proposalRef}/create-financial-statement", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void createFinancialStatement(@PathVariable("proposalRef") String proposalRef){
        proposalRef = encodeParam(proposalRef);
        this.financialStatementService.createFinancialStatementFromProposal(proposalRef);
    }

    @DeleteMapping(value = "{proposalRef}/delete-financial-statement/{financialStatementRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFinancialStatement(@PathVariable("proposalRef") String proposalRef,
                                         @PathVariable("financialStatementRef") String financialStatementRef){
        proposalRef = encodeParam(proposalRef);
        financialStatementRef = encodeParam(financialStatementRef);
        this.financialStatementService.deleteFinancialStatement(proposalRef, financialStatementRef);
    }

    @RequestMapping(value = "/{proposalRef}/validate", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<String> validateProposal(@PathVariable("proposalRef") String proposalRef) {
        try {
            proposalRef = encodeParam(proposalRef);
            apiService.validateProposal(proposalRef);
            return new ResponseEntity<>("OK", HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while trying to validate proposal", e);
            return new ResponseEntity<>("Error occurred while validating proposal: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
