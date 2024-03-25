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

import com.google.common.eventbus.EventBus;
import eu.europa.ec.leos.domain.repository.LeosLegStatus;
import eu.europa.ec.leos.domain.repository.document.ExportDocument;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.model.event.MilestoneUpdatedEvent;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.security.AuthClient;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.security.TokenService;
import eu.europa.ec.leos.services.api.ApiService;
import eu.europa.ec.leos.services.api.ConfigService;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.collection.CreateCollectionService;
import eu.europa.ec.leos.services.compare.ContentComparatorContext;
import eu.europa.ec.leos.services.compare.ContentComparatorService;
import eu.europa.ec.leos.services.document.TransformationService;
import eu.europa.ec.leos.services.dto.response.AppConfigResponse;
import eu.europa.ec.leos.services.dto.response.MilestonePDFDownloadResponse;
import eu.europa.ec.leos.services.dto.response.MilestoneViewResponse;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.store.ExportPackageService;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.WorkspaceService;
import eu.europa.ec.leos.services.support.LeosXercesUtils;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.vo.token.JsonTokenReponse;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;
import org.w3c.dom.Document;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.MessageFormat;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Properties;

import static eu.europa.ec.leos.services.compare.ContentComparatorService.ATTR_NAME;
import static eu.europa.ec.leos.services.compare.ContentComparatorService.CONTENT_ADDED_CLASS;
import static eu.europa.ec.leos.services.compare.ContentComparatorService.CONTENT_REMOVED_CLASS;
import static eu.europa.ec.leos.services.support.XmlHelper.UTF_8;
import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;
import static eu.europa.ec.leos.services.support.XmlHelper.validatePath;

@RestController
@RequestMapping
public class LeosApiController {
    private static final Logger LOG = LoggerFactory.getLogger(LeosApiController.class);
    private static final String ERROR_OCCURRED_WHILE_GETTING_DOCUMENT = "Error occurred while getting document ";
    private static final String FOR_USER = " for user ";
    private static final String CONTENT_DISPOSITION = "Content-Disposition";
    private static final String ATTACHMENT_FILENAME = "attachment; filename=\"";
    private static final String ERROR_WHILE_CREATING_NEW_BILL_ANNEX = "Error while creating new bill annex - ";

    private final LegService legService;
    private final WorkspaceService workspaceService;
    private final TokenService tokenService;
    private final TransformationService transformationService;
    private final ContentComparatorService comparatorService;
    private final EventBus leosApplicationEventBus;
    private final ExportService exportService;
    private final CreateCollectionService createCollectionService;
    private final Properties applicationProperties;
    private final ExportPackageService exportPackageService;
    private final ApiService apiService;

    private final ConfigService configService;
    private final SecurityContext securityContext;
    private final int SINGLE_COLUMN_MODE = 1;
    private final int TWO_COLUMN_MODE = 2;
    private static final String GRANT_TYPE = "grant-type";
    private static final String BEARER_GRANT_TYPE = "jwt-bearer";
    private static final String BEARER_PARAMETER = "assertion";
    private static  final String CLIENT_CONTEXT_PARAMETER = "Client-Context";

    @Value("${leos.api.jwt.auth.access.token.expire.min}")
    private String accessTokenExpirationInMin;

    @Autowired
    public LeosApiController(LegService legService, WorkspaceService workspaceService, TokenService tokenService,
                             TransformationService transformationService, ContentComparatorService comparatorService,
                             EventBus leosApplicationEventBus, ExportService exportService,
                             CreateCollectionService createCollectionService, Properties applicationProperties,
                             ExportPackageService exportPackageService, ApiService apiService, ConfigService configService,
                             SecurityContext securityContext) {
        this.legService = legService;
        this.workspaceService = workspaceService;
        this.tokenService = tokenService;
        this.transformationService = transformationService;
        this.comparatorService = comparatorService;
        this.leosApplicationEventBus = leosApplicationEventBus;
        this.exportService = exportService;
        this.createCollectionService = createCollectionService;
        this.applicationProperties = applicationProperties;
        this.exportPackageService = exportPackageService;
        this.apiService = apiService;
        this.configService = configService;
        this.securityContext = securityContext;
    }

    @RequestMapping(value = "/token", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getToken(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Cache-Control", "no-store");
        response.setHeader("Pragma", "no-cache");
        String contextPath = request.getContextPath();
        final String clientContextToken = request.getHeader(CLIENT_CONTEXT_PARAMETER);
        final String grantType = request.getHeader(GRANT_TYPE);
        if (!StringUtils.isEmpty(grantType) && grantType.contains(BEARER_GRANT_TYPE)) {
            String token = request.getHeader(BEARER_PARAMETER);
            return validateAndGenerateAccessToken(token, clientContextToken, response, contextPath);
        } else {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if (cookie.getName().equals("Authorization")) {
                        return validateAndGenerateAccessToken(cookie.getValue(), clientContextToken, response, contextPath);
                    } else {
                        LOG.warn("Authorization failed! Wrong Headers: No authorization cookie found");
                    }
                }
            } else {
                LOG.warn("Authorization failed! Wrong Headers: '{}' is missing or contains no cookie is found", GRANT_TYPE);
            }
        }
        return new ResponseEntity<>("Wrong Headers!", HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<Object> validateAndGenerateAccessToken(String token, String clientContextToken, HttpServletResponse response, String contextPath) {
        AuthClient authClient = tokenService.validateClientByJwtToken(token);
        if (authClient.isVerified()) {
            LOG.debug("Client '{}' correctly validated with jwt-bearer token provided", authClient.getName());
            String user = tokenService.extractUserFromToken(token);
            if(StringUtils.isNotBlank(clientContextToken)) {
                if(!tokenService.validateClientContextToken(clientContextToken)) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    return new ResponseEntity<>("Wrong client context token! Token is invalid!", HttpStatus.BAD_REQUEST);
                }
                if(!tokenService.validateUserFromClientContext(clientContextToken, token)) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    return new ResponseEntity<>("Wrong client context token! User mismatch!", HttpStatus.BAD_REQUEST);
                }
            }

            int accessTokenExpirationInMinInt = getAccessTokenExpirationInMinInt();
            long expiresInMilliSec = System.currentTimeMillis() + accessTokenExpirationInMinInt * 60 * 1000;
            JsonTokenReponse jsonToken = new JsonTokenReponse(tokenService.getAccessToken(user), "jwt", expiresInMilliSec, null, null);
            LOG.debug("Created accessToken for the Client '{}", authClient.getName());
            return new ResponseEntity<>(jsonToken, HttpStatus.OK);
        } else {
            LOG.warn("Authorization failed! A client is asking for an accessToken, but the provided '{}' token is not valid!", BEARER_GRANT_TYPE);
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // set 400 status code
            response.setHeader("Set-Cookie", "Authorization=; Path=" + contextPath + "; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly"); // delete the "Authorization" cookie
            response.setHeader("Set-Cookie", "JSESSIONID=; Path=" + contextPath + "; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly"); // delete the "JSESSIONID" cookie
            return new ResponseEntity<>("Wrong jwt-bearer token!", HttpStatus.BAD_REQUEST);
        }
    }

    private int getAccessTokenExpirationInMinInt() {
        int accessTokenExpirationInMinInt = 60;
        try {
            accessTokenExpirationInMinInt = Integer.parseInt(accessTokenExpirationInMin);
        } catch(Exception e){}
        return accessTokenExpirationInMinInt;
    }

    @RequestMapping(value = "/secured/compare", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ResponseEntity<Object> compareContents(HttpServletRequest request, @RequestParam("mode") int mode,
                                                  @RequestParam("firstContent") MultipartFile firstContent, @RequestParam("secondContent") MultipartFile secondContent) {
        if ((mode != SINGLE_COLUMN_MODE) && (mode != TWO_COLUMN_MODE)) {
            return new ResponseEntity<>("Mode value has to be 1(single column mode) or 2(two column mode)", HttpStatus.BAD_REQUEST);
        }
        try {
            String contextPath = UriComponentsBuilder.fromHttpRequest(new ServletServerHttpRequest(request)).build().toUriString();
            String baseContextPath = contextPath.substring(0, StringUtils.ordinalIndexOf(contextPath, "/", 4));
            String firstContentHtml = transformationService
                    .formatToHtml(new ByteArrayInputStream(firstContent.getBytes()), baseContextPath, null)
                    .replaceAll("(?i)(href|onClick)=\".*?\"", "");
            String secondContentHtml = transformationService
                    .formatToHtml(new ByteArrayInputStream(secondContent.getBytes()), baseContextPath, null)
                    .replaceAll("(?i)(href|onClick)=\".*?\"", "");
            if (mode == SINGLE_COLUMN_MODE) {
                String comparedContent = comparatorService.compareContents(new ContentComparatorContext.Builder(firstContentHtml, secondContentHtml)
                        .withAttrName(ATTR_NAME)
                        .withRemovedValue(CONTENT_REMOVED_CLASS)
                        .withAddedValue(CONTENT_ADDED_CLASS)
                        .build());
                Document document = XercesUtils.createXercesDocument(comparedContent.getBytes(UTF_8));
                comparedContent = new String(LeosXercesUtils.wrapWithPageOrientationDivs(document), UTF_8);
                return new ResponseEntity<>(new String[]{comparedContent}, HttpStatus.OK);
            }
            return new ResponseEntity<>(comparatorService.twoColumnsCompareContents(new ContentComparatorContext.Builder(firstContentHtml, secondContentHtml).build()), HttpStatus.OK);
        } catch (Exception ex) {
            LOG.error("Error occurred while comparing contents", ex.getMessage());
            return new ResponseEntity<>("Error occurred while comparing contents: ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/search/{userId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getProposalsForUser(@PathVariable("userId") String userId,
                                                      @RequestParam(value = "proposalId", defaultValue = "") String proposalId,
                                                      @RequestParam(value = "legFileStatus", defaultValue = "") String legFileStatus) {
        try {
            userId = encodeParam(userId);
            proposalId = encodeParam(proposalId);
            return new ResponseEntity<>(legService.getLegDocumentDetailsByUserId(userId, proposalId, legFileStatus).toArray(), HttpStatus.OK);
        } catch (Exception ex) {
            LOG.error("Exception occurred in search " + ex.getMessage());
            return new ResponseEntity<>("Error Occurred while getting the Leg Document for user " + userId, HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(value = "/secured/search/{userId}/{documentRef}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getDocumentForUser(@PathVariable("userId") String userId, @PathVariable("documentRef") String documentRef) {
        XmlDocument document = null;
        final String finalUserId = encodeParam(userId);
        documentRef = encodeParam(documentRef);
        try {
            document = workspaceService.findDocumentByRef(documentRef, XmlDocument.class);
        } catch (Exception ex) {
            LOG.error(ERROR_OCCURRED_WHILE_GETTING_DOCUMENT + documentRef + FOR_USER + finalUserId + ". " + ex.getMessage());
            return new ResponseEntity<>(ERROR_OCCURRED_WHILE_GETTING_DOCUMENT + documentRef + FOR_USER + finalUserId, HttpStatus.NOT_FOUND);
        }

        if (!securityContext.hasPermission(document, LeosPermission.CAN_READ)) {
            LOG.error(ERROR_OCCURRED_WHILE_GETTING_DOCUMENT + documentRef + FOR_USER + finalUserId + ". User not allowed to access the document.");
            return new ResponseEntity<>(ERROR_OCCURRED_WHILE_GETTING_DOCUMENT + documentRef + FOR_USER + finalUserId, HttpStatus.FORBIDDEN);
        }

        switch (document.getCategory()) {
            case ANNEX:
            case BILL:
            case MEMORANDUM:
            case STAT_FINANC_LEGIS:
            case COVERPAGE:
            case PROPOSAL:
            case COUNCIL_EXPLANATORY:
                String documentViewUrl = applicationProperties.getProperty("leos.mapping.url") +
                        applicationProperties.getProperty("leos.document.view." + document.getCategory().toString().toLowerCase() + ".uri");
                return new ResponseEntity<>(Collections.singletonMap("url", MessageFormat.format(documentViewUrl, documentRef)), HttpStatus.OK);
            default:
                LOG.error(ERROR_OCCURRED_WHILE_GETTING_DOCUMENT + documentRef + FOR_USER + userId + ". Wrong category for document!!!");
                return new ResponseEntity<>(ERROR_OCCURRED_WHILE_GETTING_DOCUMENT + documentRef + FOR_USER + userId, HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(value = "/secured/searchlegfile/{legFileId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getLegFile(@PathVariable("legFileId") String legFileId) {
        boolean isStatusUpdated = false;
        LeosLegStatus currentStatus = null;
        try {
            legFileId = encodeParam(legFileId);
            LegDocument legDocument = legService.findLegDocumentById(legFileId);
            currentStatus = legDocument.getStatus();
            if (!(currentStatus == LeosLegStatus.IN_PREPARATION || currentStatus == LeosLegStatus.FILE_ERROR)) {
                byte[] file = legDocument.getContent().get().getSource().getBytes();
                HttpHeaders headers = new HttpHeaders();
                headers.set(CONTENT_DISPOSITION, ATTACHMENT_FILENAME + legDocument.getName() + "\"");
                headers.setContentLength(file.length);
                LegDocument updatedLegDocument = legService.updateLegDocument(legDocument.getMilestoneRef(), legFileId, LeosLegStatus.EXPORTED);
                leosApplicationEventBus.post(new MilestoneUpdatedEvent(updatedLegDocument, true));
                isStatusUpdated = true;
                return new ResponseEntity<>(file, headers, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Leg file with Id" + legFileId + " in status " + currentStatus, HttpStatus.NOT_FOUND);
            }
        } catch (Exception ex) {
            // in case of any exception reverting to current status
            if (isStatusUpdated) {
                LegDocument legDocument = legService.findLegDocumentById(legFileId);
                LegDocument updatedLegDocument = legService.updateLegDocument(legDocument.getMilestoneRef(), legFileId, currentStatus);
                leosApplicationEventBus.post(new MilestoneUpdatedEvent(updatedLegDocument, true));
            }
            LOG.error("Exception occurred in downloading leg file " + ex.getMessage());
            return new ResponseEntity<>("Error Occurred while sending the leg file  for Leg File Id " +
                    legFileId, HttpStatus.NOT_FOUND);
        }

    }

    @RequestMapping(value = "/secured/searchlegfile/anystatus/{legFileId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getLegFileAnyStatus(@PathVariable("legFileId") String legFileId) {
        boolean isStatusUpdated = false;
        LeosLegStatus currentStatus = null;
        try {
            legFileId = encodeParam(legFileId);
            LegDocument legDocument = legService.findLegDocumentById(legFileId);
            currentStatus = legDocument.getStatus();
            byte[] file = legDocument.getContent().get().getSource().getBytes();
            HttpHeaders headers = new HttpHeaders();
            headers.set(CONTENT_DISPOSITION, ATTACHMENT_FILENAME + legDocument.getName() + "\"");
            headers.setContentLength(file.length);
            LegDocument updatedLegDocument = legService.updateLegDocument(legDocument.getMilestoneRef(), legFileId, LeosLegStatus.EXPORTED);
            leosApplicationEventBus.post(new MilestoneUpdatedEvent(updatedLegDocument, true));
            isStatusUpdated = true;
            return new ResponseEntity<>(file, headers, HttpStatus.OK);
        } catch (Exception ex) {
            // in case of any exception reverting to current status
            if (isStatusUpdated) {
                LegDocument legDocument = legService.findLegDocumentById(legFileId);
                LegDocument updatedLegDocument = legService.updateLegDocument(legDocument.getMilestoneRef(), legFileId, currentStatus);
                leosApplicationEventBus.post(new MilestoneUpdatedEvent(updatedLegDocument, true));
            }
            LOG.error("Exception occurred in downloading leg file " + ex.getMessage());
            return new ResponseEntity<>("Error Occurred while sending the leg file  for Leg File Id " +
                    legFileId, HttpStatus.NOT_FOUND);
        }

    }

    @RequestMapping(value = "/secured/renditionfromleg", method = RequestMethod.POST, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getPdfFromLegFile(@RequestParam("legFile") MultipartFile legFile, @RequestParam("type") String type) {
        File legFileTemp = null;
        try {
            final ExportOptions exportOptions = new ExportLW(type);
            exportOptions.setWithAnnotations(true);

            //create a temporary file with the bytes arrived as input
            legFileTemp = File.createTempFile("tmp_", ".leg");
            FileUtils.writeByteArrayToFile(legFileTemp, legFile.getBytes());
            byte[] renditionFile = exportService.exportToToolboxCoDe(legFileTemp, exportOptions);

            HttpHeaders headers = new HttpHeaders();
            headers.set(CONTENT_DISPOSITION, ATTACHMENT_FILENAME + "TOOLBOX_RESULT_" + System.currentTimeMillis() + "\"");
            headers.setContentLength(renditionFile.length);

            LOG.info("Returning zip file of {} bytes containing renditions to the external caller." + renditionFile.length);
            return new ResponseEntity<>(renditionFile, headers, HttpStatus.OK);
        } catch (Exception e) {
            String errMsg = "Error occurred while creating rendition file: " + e.getMessage();
            LOG.error(errMsg, e);
            return new ResponseEntity<>(errMsg, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            if (legFileTemp != null && legFileTemp.exists()) {
                boolean fileDeleted = legFileTemp.delete();
                if (!fileDeleted) {
                    LOG.warn("File not deleted");
                }
            }
        }
    }

    @RequestMapping(value = "/secured/milestones/{proposalRef}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getLegFilesForProposal(@PathVariable("proposalRef") String proposalRef) {
        Proposal proposal = null;
        try {
            proposalRef = encodeParam(proposalRef);
            proposal = workspaceService.findDocumentByRef(proposalRef, Proposal.class);
        } catch (Exception ex) {
            LOG.error("Error occurred while getting proposal {}. {}", proposalRef, ex.getMessage(), ex);
            return new ResponseEntity<>("Error occurred while getting proposal " + proposalRef, HttpStatus.NOT_FOUND);
        }

        try {
            List<LegDocument> legFiles = legService.findLegDocumentByProposal(proposal.getId());
            return new ResponseEntity<>(legFiles, HttpStatus.OK);
        } catch (Exception ex) {
            LOG.error("Error occurred while getting milestones for proposal {}. {}", proposalRef, ex.getMessage(), ex);
            return new ResponseEntity<>("Error occurred while getting milestones for proposal " + proposalRef, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/collectionfromleg", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> createCollectionFromLeg(@RequestParam("file") MultipartFile file) {
        CreateCollectionResult createCollectionResult;
        try {
            validatePath(file.getOriginalFilename());
            File content = new File(applicationProperties.getProperty("leos.mandate.upload.path") + file.getOriginalFilename());

            try (FileOutputStream fos = new FileOutputStream(content)) {
                fos.write(file.getBytes());
            } catch (IOException ioe) {
                LOG.error("Error Occurred while reading the Leg file: " + ioe.getMessage(), ioe);
                return new ResponseEntity<>("An error occurred during the reading of the Leg file.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

            createCollectionResult = createCollectionService.createCollectionFromLeg(content);
            return new ResponseEntity<>(createCollectionResult, HttpStatus.OK);
        } catch (Exception ex) {
            LOG.error("Error Occurred while creating collection from the Leg file: " + ex.getMessage(), ex);
            return new ResponseEntity<>("An error occurred during collection creation.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/cloneProposal", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> cloneProposalFromLeg(@RequestParam("file") MultipartFile legFile,
                                                       @RequestParam("targetUser") String targetUser,
                                                       @RequestParam("connectedEntity") String connectedEntity,
                                                       @RequestParam("iscRef") String iscRef) {
        CreateCollectionResult createCollectionResult;
        try {
            targetUser = encodeParam(targetUser);
            connectedEntity = encodeParam(connectedEntity);
            iscRef = encodeParam(iscRef);
            validatePath(legFile.getOriginalFilename());
            File content = new File(legFile.getOriginalFilename());

            try (FileOutputStream fos = new FileOutputStream(content)) {
                fos.write(legFile.getBytes());
            } catch (IOException ioe) {
                LOG.error("Error Occurred while reading the Leg file: " + ioe.getMessage(), ioe);
                return new ResponseEntity<>("An error occurred during the reading of the Leg file.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

            createCollectionResult = createCollectionService.cloneCollection(content, iscRef, targetUser, connectedEntity);
            return new ResponseEntity<>(createCollectionResult, HttpStatus.OK);
        } catch (Exception ex) {
            LOG.error("Error Occurred while cloning proposal from the Leg file: " + ex.getMessage(), ex);
            return new ResponseEntity<>("An error occurred during proposal cloning.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/revisionDone", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> updateClonedProposalRevisionStatus(@RequestParam("cloneProposalId") String cloneProposalId,
                                                                     @RequestParam("legFileName") String legFileName) {
        Result<?> result;
        try {
            cloneProposalId = encodeParam(cloneProposalId);
            legFileName = encodeParam(legFileName);
            result = createCollectionService.updateOriginalProposalAfterRevisionDone(cloneProposalId, legFileName);
        } catch (Exception ex) {
            LOG.error("Error Occurred while getting revision done status: " + ex.getMessage(), ex);
            return new ResponseEntity<>("Error Occurred while getting revision done status", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(result.get(), HttpStatus.OK);
    }

    @RequestMapping(value = "/secured/export/{proposalRef}/{exportPackageId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getExportPackage(@PathVariable("proposalRef") String proposalRef, @PathVariable("exportPackageId") String exportPackageId) {
        ExportDocument exportDocument = null;
        try {
            exportPackageId = encodeParam(exportPackageId);
            exportDocument = exportPackageService.findExportDocumentById(exportPackageId, true);
            byte[] file = exportDocument.getContent().get().getSource().getBytes();
            HttpHeaders headers = new HttpHeaders();
            headers.set(CONTENT_DISPOSITION, ATTACHMENT_FILENAME + exportDocument.getName() + "\"");
            headers.setContentLength(file.length);
            return new ResponseEntity<>(file, headers, HttpStatus.OK);
        } catch (Exception ex) {
            LOG.error("Error occurred while retrieving export package for id " + exportPackageId + ". " + ex.getMessage());
            return new ResponseEntity<>("Error occurred while retrieving export package for id " +
                    exportPackageId, HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(value = "/secured/proposals/{proposalRef}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getProposalDetails(@PathVariable String proposalRef) {
        proposalRef = encodeParam(proposalRef);
        Optional<DocumentVO> requestedProposal = apiService.getProposalDetails(proposalRef);
        if (requestedProposal.isPresent()) {
            return ResponseEntity.ok(requestedProposal.get());
        } else {
            return new ResponseEntity<>("No result found", HttpStatus.NOT_FOUND);
        }

    }

    @RequestMapping(value = "/secured/proposals/{proposalRef}/download", method = RequestMethod.GET, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> downloadProposal(@PathVariable("proposalRef") String proposalRef) {
        try {
            proposalRef = encodeParam(proposalRef);
            return new ResponseEntity<>(apiService.downloadProposal(proposalRef), HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while downloading proposal - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occured while downloading proposal", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/proposals/{proposalRef}/createAnnex", method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> createProposalAnnex(@PathVariable("proposalRef") String proposalRef) {
        try {
            proposalRef = encodeParam(proposalRef);
            this.apiService.createProposalAnnex(proposalRef);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            LOG.error(ERROR_WHILE_CREATING_NEW_BILL_ANNEX + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while creating new bill annex", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/proposals/{proposalRef}/update-annex-title/{annexId}", method = RequestMethod.PUT,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> updateAnnexTitle(@PathVariable("proposalRef") String proposalRef, @PathVariable("annexId") String annexId,
                                                   @RequestParam("title") String title) {
        try {
            proposalRef = encodeParam(proposalRef);
            annexId = encodeParam(annexId);
//            title = encodeParam(title);
            this.apiService.updateAnnexTitle(proposalRef, annexId, title);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            LOG.error(ERROR_WHILE_CREATING_NEW_BILL_ANNEX + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while creating new bill annex", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/proposals/{proposalRef}/update-explanatory-title/{docId}",
            method = RequestMethod.PUT,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> updateExplanatoryTitle(@PathVariable String proposalRef,
                                                         @PathVariable String docId,
                                                         @RequestParam String title) {
        try {
            proposalRef = encodeParam(proposalRef);
            docId = encodeParam(docId);
//            title = encodeParam(title);
            this.apiService.updateExplanatoryTitle(proposalRef, docId, title);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            LOG.error("Error while updating explanatory title - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while explanatory title", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/proposals/{proposalRef}/milestones", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getProposalMilestones(@PathVariable("proposalRef") String proposalRef) {
        try {
            proposalRef = encodeParam(proposalRef);
            return new ResponseEntity<>(apiService.getProposalMilestones(proposalRef), HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while generating milestones - " + e.getMessage());
            return new ResponseEntity<>("An error occurred while generating milestones", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/proposals/{proposalRef}/deleteAnnex/{annexRef}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> deleteAnnex(@PathVariable("proposalRef") String proposalRef,
                                              @PathVariable("annexRef") String annexRef) {
        try {
            proposalRef = encodeParam(proposalRef);
            annexRef = encodeParam(annexRef);
            apiService.deleteAnnex(proposalRef, annexRef);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            LOG.error("Error occured while deleting proposal annex - " + e.getMessage());
            return new ResponseEntity<>("Error occured while deleting proposal annex", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/updateAnnexOrder/{proposalRef}/annex/{annexRef}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> updateProposalAnnexOrder(@PathVariable("proposalRef") String proposalRef, @PathVariable("annexRef") String annexRef,
                                                           @RequestParam String moveDirection, @RequestParam Integer timesToMove) {
        try {
            proposalRef = encodeParam(proposalRef);
            annexRef = encodeParam(annexRef);
            moveDirection = encodeParam(moveDirection);
            apiService.updateAnnexOrder(proposalRef, annexRef, moveDirection, timesToMove);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            LOG.error("Error occured while updating annex order - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occured while updating annex order", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/proposals/{proposalRef}/milestones", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> createMilestone(@PathVariable("proposalRef") String proposalRef, @RequestBody String milestoneComment) {
        try {
            proposalRef = encodeParam(proposalRef);
            return new ResponseEntity<>(apiService.createMilestone(proposalRef, milestoneComment), HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Unexpected error while creating new milestone - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error while creating new milestone", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/users/current", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getCurrentUser() {
        try {
            return new ResponseEntity<>(securityContext.getUser(), HttpStatus.OK);
        } catch (Exception e) {
            LOG.error(ERROR_WHILE_CREATING_NEW_BILL_ANNEX + e.getMessage());
            return new ResponseEntity<>("Unexpected error occured while getting current user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/document/{documentRef}", method = RequestMethod.GET, produces = MediaType.APPLICATION_XML_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getDocument(@PathVariable("documentRef") String documentRef) {
        XmlDocument document = null;
        try {
            documentRef = encodeParam(documentRef);
            document = workspaceService.findDocumentByRef(documentRef, XmlDocument.class);
            if (document != null) {
                DocumentVO vo = new DocumentVO(document);
                return new ResponseEntity<>(vo, HttpStatus.OK);
            }
        } catch (Exception e) {
            LOG.error("Error occured while getting XML Document - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting XML document", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return null;
    }

    @RequestMapping(value = "/secured/config", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getConfig(HttpServletRequest request) {
        try {
            String clientContextToken = request.getHeader(CLIENT_CONTEXT_PARAMETER);
            AppConfigResponse appConfigResponse = configService.getApplicationConfig(clientContextToken);
            return new ResponseEntity<>(appConfigResponse, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while getting application configuration - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting application configuration", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/list-milestones-view/{documentRef}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getListMilestoneDocumentViews(@PathVariable("documentRef") String documentRef,
                                                                @RequestParam("legFileName") String legFileName) {
        try {
            documentRef = encodeParam(documentRef);
            legFileName = encodeParam(legFileName);
            MilestoneViewResponse milestonesView = apiService.listMilestoneDocuments(documentRef, legFileName);
            return new ResponseEntity<>(milestonesView, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while getting milestone documents views - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while milestone documents views", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/list-milestones-view-version/{documentRef}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getListMilestoneDocumentViewsFromDoc(@PathVariable("documentRef") String documentRef,
                                                                @RequestParam("versionedReference") String versionedReference) {
        try {
            documentRef = encodeParam(documentRef);
            versionedReference = encodeParam(versionedReference);
            MilestoneViewResponse milestonesView = apiService.listMilestoneDocumentsFromVersionRef(documentRef, versionedReference);
            return new ResponseEntity<>(milestonesView, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while getting milestone documents views - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while milestone documents views", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/list-milestones-view/pdf-export/{documentRef}", method = RequestMethod.GET, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getMilestoneExportPDF(@PathVariable("documentRef") String documentRef,
                                                        @RequestParam("legFileName") String legFileName) {
        try {
            documentRef = encodeParam(documentRef);
            legFileName = encodeParam(legFileName);
            MilestonePDFDownloadResponse response = apiService.downloadMilestonePDF(documentRef, legFileName);
            // create the HttpHeaders object and set the Content-Type header
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.set(CONTENT_DISPOSITION, ATTACHMENT_FILENAME + response.getFilename() + "\"");
            return new ResponseEntity<>(response.getContent(), headers, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while getting application configuration - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting application configuration", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/list-milestones-view-version/pdf-export/{documentRef}", method = RequestMethod.GET, produces =
            MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getMilestoneExportPDFFromVersion(@PathVariable("documentRef") String documentRef,
                                                                   @RequestParam("versionedReference") String versionedReference) {
        try {
            documentRef = encodeParam(documentRef);
            versionedReference = encodeParam(versionedReference);
            MilestonePDFDownloadResponse response = apiService.downloadMilestonePDFFromVersion(documentRef, versionedReference);
            // create the HttpHeaders object and set the Content-Type header
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.set(CONTENT_DISPOSITION, ATTACHMENT_FILENAME + response.getFilename() + "\"");
            return new ResponseEntity<>(response.getContent(), headers, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while getting application configuration - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting application configuration", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
    