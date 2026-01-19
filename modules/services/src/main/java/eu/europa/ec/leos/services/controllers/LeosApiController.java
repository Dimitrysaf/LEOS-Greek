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
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.repository.LeosLegStatus;
import eu.europa.ec.leos.domain.repository.common.LeosFile;
import eu.europa.ec.leos.domain.repository.document.ExportDocument;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.domain.vo.ProposalDetailsVO;
import eu.europa.ec.leos.integration.ConValidatorService;
import eu.europa.ec.leos.model.event.MilestoneUpdatedEvent;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.rest.aop.annotation.PerformanceLogger;
import eu.europa.ec.leos.security.AuthClient;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.security.TokenService;
import eu.europa.ec.leos.services.api.ApiService;
import eu.europa.ec.leos.services.api.ConfigService;
import eu.europa.ec.leos.services.coedition.handler.CoEditionInfoHandler;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.collection.CreateCollectionService;
import eu.europa.ec.leos.services.compare.ContentComparatorContext;
import eu.europa.ec.leos.services.compare.ContentComparatorService;
import eu.europa.ec.leos.services.document.TransformationService;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.models.AnnexType;
import eu.europa.ec.leos.services.dto.response.AppConfigResponse;
import eu.europa.ec.leos.services.dto.response.LeosRenditionOutputResponseList;
import eu.europa.ec.leos.services.dto.response.MilestonePDFDownloadResponse;
import eu.europa.ec.leos.services.dto.response.MilestoneViewResponse;
import eu.europa.ec.leos.services.exception.NotFoundException;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.export.ZipPackageUtil;
import eu.europa.ec.leos.services.notification.NotificationService;
import eu.europa.ec.leos.services.store.ExportPackageService;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.WorkspaceService;
import eu.europa.ec.leos.services.support.LeosXercesUtils;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.vo.coedition.CoEditionVO;
import eu.europa.ec.leos.vo.coedition.InfoType;
import eu.europa.ec.leos.vo.token.JsonTokenReponse;
import eu.europa.ec.leos.model.notification.validation.DocumentExternalValidationNotification;
import org.apache.commons.io.FilenameUtils;
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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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
import java.io.IOException;
import java.text.MessageFormat;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;

import static eu.europa.ec.leos.services.compare.ContentComparatorService.ATTR_NAME;
import static eu.europa.ec.leos.services.compare.ContentComparatorService.CONTENT_ADDED_CLASS;
import static eu.europa.ec.leos.services.compare.ContentComparatorService.CONTENT_REMOVED_CLASS;
import static eu.europa.ec.leos.services.support.XmlHelper.UTF_8;
import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;
import static eu.europa.ec.leos.services.support.XmlHelper.isValidFileNameForBinaryFile;
import static eu.europa.ec.leos.services.support.XmlHelper.isValidSizeFileForBinaryFile;
import static eu.europa.ec.leos.services.support.XmlHelper.isValidMimeTypeForBinaryFile;
import static eu.europa.ec.leos.services.support.XmlHelper.validatePath;
import static eu.europa.ec.leos.services.support.XmlHelper.isValidFileNameForZipFile;
import static eu.europa.ec.leos.services.support.XmlHelper.isValidSizeFileForBinaryFile;
import static eu.europa.ec.leos.services.support.XmlHelper.isValidMimeTypeForLegFile;

@RestController
@RequestMapping
@PerformanceLogger
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
    private final DocumentContentService documentContentService;
    private final EventBus leosApplicationEventBus;
    private final ExportService exportService;
    private final CreateCollectionService createCollectionService;
    private final Properties applicationProperties;
    private final ExportPackageService exportPackageService;
    private final ApiService apiService;
    private final UserService userService;
    private final CoEditionInfoHandler coEditionInfoHandler;
    private ConValidatorService conValidatorService;
    private NotificationService notificationService;

    private final ConfigService configService;
    private final SecurityContext securityContext;
    private final int SINGLE_COLUMN_MODE = 1;
    private final int TWO_COLUMN_MODE = 2;
    private static final String GRANT_TYPE = "grant-type";
    private static final String BEARER_GRANT_TYPE = "jwt-bearer";
    private static final String BEARER_PARAMETER = "assertion";
    private static  final String CLIENT_CONTEXT_PARAMETER = "Client-Context";
    private static final String AUTHORIZATION = "Authorization";
    private static final String JSESSIONID = "JSESSIONID";

    @Value("${leos.api.jwt.auth.access.token.expire.min}")
    private String accessTokenExpirationInMin;

    @Autowired
    public LeosApiController(LegService legService, WorkspaceService workspaceService, TokenService tokenService,
                             TransformationService transformationService, ContentComparatorService comparatorService,
                             EventBus leosApplicationEventBus, ExportService exportService,
                             CreateCollectionService createCollectionService, Properties applicationProperties,
                             ExportPackageService exportPackageService, ApiService apiService, ConfigService configService,
                             SecurityContext securityContext, UserService userService, CoEditionInfoHandler coEditionInfoHandler,
                             DocumentContentService documentContentService, ConValidatorService conValidatorService,
                             NotificationService notificationService) {
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
        this.userService = userService;
        this.coEditionInfoHandler = coEditionInfoHandler;
        this.documentContentService = documentContentService;
        this.conValidatorService = conValidatorService;
        this.notificationService = notificationService;
    }

    @RequestMapping(value = "/token", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getToken(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Cache-Control", "no-store");
        response.setHeader("Pragma", "no-cache");

        final String contextPath = request.getContextPath();
        final String clientContextToken = request.getHeader(CLIENT_CONTEXT_PARAMETER);
        final String grantType = request.getHeader(GRANT_TYPE);
        final Cookie jSessionIdCookie = request.getCookies() != null ? Arrays.stream(request.getCookies())
                .filter(cookie -> JSESSIONID.equals(cookie.getName()))
                .findAny().orElse(null) : null;
        if (!StringUtils.isEmpty(grantType) && grantType.contains(BEARER_GRANT_TYPE)) {
            String token = request.getHeader(BEARER_PARAMETER);
            return validateAndGenerateAccessToken(token, clientContextToken, response, contextPath, jSessionIdCookie);
        } else {
            Cookie authorizationCookie = Arrays.stream(request.getCookies())
                    .filter(cookie -> AUTHORIZATION.equals(cookie.getName()))
                    .findAny().orElse(null);
            if (authorizationCookie != null) {
                return validateAndGenerateAccessToken(authorizationCookie.getValue(), clientContextToken, response, contextPath, jSessionIdCookie);
            }
            LOG.warn("Authorization failed! Wrong headers: '{}' is missing or no authorization cookie is found.", GRANT_TYPE);
        }
        return new ResponseEntity<>("Wrong headers!", HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<Object> validateAndGenerateAccessToken(String token, String clientContextToken, HttpServletResponse response, String contextPath, Cookie jSessionId) {
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
            String accessToken = tokenService.getAccessToken(user, authClient); //TODO provide systemName
            JsonTokenReponse jsonToken = new JsonTokenReponse(accessToken, "jwt", expiresInMilliSec, null, null);
            tokenService.setAccessTokenMap(accessToken, jSessionId != null ? jSessionId.getValue() : null);
            LOG.debug("Created accessToken for the client {}", authClient.getName());
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
            boolean isCoverPage = documentContentService.isCoverPageExists(firstContent.getBytes());
            String firstContentHtml = transformationService
                    .formatToHtml(new ByteArrayInputStream(firstContent.getBytes()), baseContextPath, null, isCoverPage ? new ByteArrayInputStream(documentContentService.getCoverPageContent(firstContent.getBytes())) : null)
                    .replaceAll("(?i)(href|onClick)=\".*?\"", "");
            String secondContentHtml = transformationService
                    .formatToHtml(new ByteArrayInputStream(secondContent.getBytes()), baseContextPath, null, isCoverPage ? new ByteArrayInputStream(documentContentService.getCoverPageContent(secondContent.getBytes())) : null)
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
            case STAT_DIGIT_FINANC_LEGIS:
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
    public ResponseEntity<Object> getLegFile(@PathVariable("legFileId") String legFileId,
                                             @RequestParam(required = false, defaultValue = "false") Boolean isDownload) {
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
                if (!(isDownload || currentStatus == LeosLegStatus.CONTRIBUTION_SENT)) {
                    LOG.info("While search leg file updating Leg document status... [id={}, status={}]", legDocument.getId(), LeosLegStatus.EXPORTED.name());
                    LegDocument updatedLegDocument = legService.updateLegDocument(legDocument.getMilestoneRef(), legFileId, LeosLegStatus.EXPORTED);
                    leosApplicationEventBus.post(new MilestoneUpdatedEvent(updatedLegDocument, true));
                    isStatusUpdated = true;
                }
                return new ResponseEntity<>(file, headers, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Leg file with Id" + legFileId + " in status " + currentStatus, HttpStatus.NOT_FOUND);
            }
        } catch (Exception ex) {
            // in case of any exception reverting to current status
            if (isStatusUpdated) {
                LegDocument legDocument = legService.findLegDocumentById(legFileId);
                LOG.info("While exception in search leg file updating Leg document status... [id={}, status={}]", legDocument.getId(), currentStatus);
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
    public ResponseEntity<Object> getLegFileAnyStatus(@PathVariable("legFileId") String legFileId,
                                                      @RequestParam(required = false, defaultValue = "false") Boolean isDownload) {
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
            if (!(isDownload || currentStatus == LeosLegStatus.CONTRIBUTION_SENT)) {
                LOG.info("While search leg file in any status updating Leg document status... [id={}, status={}]", legDocument.getId(), LeosLegStatus.EXPORTED.name());
                LegDocument updatedLegDocument = legService.updateLegDocument(legDocument.getMilestoneRef(), legFileId, LeosLegStatus.EXPORTED);
                leosApplicationEventBus.post(new MilestoneUpdatedEvent(updatedLegDocument, true));
                isStatusUpdated = true;
            }
            return new ResponseEntity<>(file, headers, HttpStatus.OK);
        } catch (Exception ex) {
            // in case of any exception reverting to current status
            if (isStatusUpdated) {
                LegDocument legDocument = legService.findLegDocumentById(legFileId);
                LOG.info("While search leg file in any status updating Leg document status... [id={}, status={}]", legDocument.getId(), currentStatus);
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
        try {
            final ExportOptions exportOptions = new ExportLW(type);
            exportOptions.setWithAnnotations(true);

            //create a temporary file with the bytes arrived as input
            LeosFile leosFile = new LeosFile();
            leosFile.generateFileName("tmp_", ".leg");
            leosFile.setBytes(legFile.getBytes());
            byte[] renditionFile = exportService.exportToToolboxCoDe(leosFile, exportOptions);

            HttpHeaders headers = new HttpHeaders();
            headers.set(CONTENT_DISPOSITION, ATTACHMENT_FILENAME + "TOOLBOX_RESULT_" + System.currentTimeMillis() + "\"");
            headers.setContentLength(renditionFile.length);

            LOG.info("Returning zip file of {} bytes containing renditions to the external caller." + renditionFile.length);
            return new ResponseEntity<>(renditionFile, headers, HttpStatus.OK);
        } catch (Exception e) {
            String errMsg = "Error occurred while creating rendition file: " + e.getMessage();
            LOG.error(errMsg, e);
            return new ResponseEntity<>(errMsg, HttpStatus.INTERNAL_SERVER_ERROR);
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
            List<LegDocument> legFiles = legService.findLegDocumentByAnyDocumentId(proposal.getId());
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
            String pathname = applicationProperties.getProperty("leos.mandate.upload.path") + file.getOriginalFilename();
            LeosFile content = new LeosFile(FilenameUtils.normalize(pathname));

            try {
                content.setBytes(file.getBytes());
            } catch (IOException ioe) {
                LOG.error("Error Occurred while reading the Leg file: " + ioe.getMessage(), ioe);
                return new ResponseEntity<>("An error occurred during the reading of the Leg file.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
            DocumentVO propDocument = createCollectionService.getProposalDocumentFromLeg(content);
            createCollectionResult = createCollectionService.createCollectionFromLeg(content, propDocument, "EN", false);
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
        User user = userService.getUser(targetUser);
        String loggedInUser = securityContext.getUser().getLogin();
        Collection<? extends GrantedAuthority> loggedInUserAuthorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
        try {
            targetUser = encodeParam(targetUser);
            connectedEntity = encodeParam(connectedEntity);
            iscRef = encodeParam(iscRef);
            validatePath(legFile.getOriginalFilename());
            LeosFile content = new LeosFile(FilenameUtils.normalize(legFile.getOriginalFilename()));
            userService.switchUser(user.getLogin());
            try {
                content.setBytes(legFile.getBytes());
            } catch (IOException ioe) {
                LOG.error("Error Occurred while reading the Leg file: " + ioe.getMessage(), ioe);
                return new ResponseEntity<>("An error occurred during the reading of the Leg file.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

            createCollectionResult = createCollectionService.cloneCollection(content, iscRef, targetUser, connectedEntity);
            return new ResponseEntity<>(createCollectionResult, HttpStatus.OK);
        } catch (Exception ex) {
            LOG.error("Error Occurred while cloning proposal from the Leg file: " + ex.getMessage(), ex);
            return new ResponseEntity<>("An error occurred during proposal cloning.", HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            userService.switchUserWithAuthorities(loggedInUser, loggedInUserAuthorities);
        }
    }

    @RequestMapping(value = "/secured/revisionDone", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> updateClonedProposalRevisionStatus(@RequestParam("cloneProposalId") String cloneProposalId,
                                                                     @RequestParam("legFileId") String legFileId) {
        Result<?> result;
        try {
            cloneProposalId = encodeParam(cloneProposalId);
            legFileId = encodeParam(legFileId);
            result = createCollectionService.updateOriginalProposalAfterRevisionDone(cloneProposalId, legFileId);
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
        String userId = securityContext.getUser().getLogin();
        Optional<ProposalDetailsVO> requestedProposal = apiService.getProposalDetails(proposalRef, userId);
        if (requestedProposal.isPresent()) {
            LOG.info("Proposal with ref {} is opened by the user {}", proposalRef, securityContext.getUser().getLogin());
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
            byte[] proposal = apiService.downloadProposal(proposalRef);
            LOG.info("Proposal with ref {} is downloaded by user {}", proposalRef, securityContext.getUser().getLogin());
            return new ResponseEntity<>(proposal, HttpStatus.OK);
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
            this.apiService.createProposalAnnex(proposalRef, AnnexType.NORMAL, null, null, null);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            LOG.error(ERROR_WHILE_CREATING_NEW_BILL_ANNEX + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while creating new bill annex", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/proposals/{proposalRef}/createForeignAnnex", method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> createProposalForeignAnnex(@PathVariable("proposalRef") String proposalRef, @RequestParam("foreignAnnexFile") MultipartFile foreignAnnexFile) throws Exception {
        try {
            validatePath(FilenameUtils.normalize(foreignAnnexFile.getOriginalFilename()));
            if (!isValidFileNameForBinaryFile(foreignAnnexFile.getOriginalFilename()) || !isValidSizeFileForBinaryFile(foreignAnnexFile.getSize()) || !isValidMimeTypeForBinaryFile(foreignAnnexFile.getBytes())) {
                return new ResponseEntity<>("Invalid file", HttpStatus.BAD_REQUEST);
            }
            proposalRef = encodeParam(proposalRef);
            this.apiService.createProposalAnnex(proposalRef, AnnexType.FOREIGN, foreignAnnexFile.getBytes(), foreignAnnexFile.getOriginalFilename(), String.format("%.2f KB", foreignAnnexFile.getSize() / 1024.0));
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            LOG.error(ERROR_WHILE_CREATING_NEW_BILL_ANNEX + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while creating new bill foreign annex", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/proposals/{proposalRef}/update-annex-title/{annexId}", method = RequestMethod.PUT,
            produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
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

    @RequestMapping(value = "/secured/proposals/{proposalRef}/updateForeignAnnex/{annexId}", method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> updateForeignAnnex(@PathVariable("proposalRef") String proposalRef, @PathVariable("annexId") String annexId,
            @RequestParam("foreignAnnexFile") MultipartFile foreignAnnexFile) {
        try {
            validatePath(FilenameUtils.normalize(foreignAnnexFile.getOriginalFilename()));
            if (!isValidFileNameForBinaryFile(foreignAnnexFile.getOriginalFilename()) || !isValidSizeFileForBinaryFile(foreignAnnexFile.getSize()) || !isValidMimeTypeForBinaryFile(foreignAnnexFile.getBytes())) {
                return new ResponseEntity<>("Invalid file", HttpStatus.BAD_REQUEST);
            }
            proposalRef = encodeParam(proposalRef);
            annexId = encodeParam(annexId);
            this.apiService.updateForeignAnnex(proposalRef, annexId, foreignAnnexFile.getBytes(), foreignAnnexFile.getOriginalFilename(), String.format("%.2f KB", foreignAnnexFile.getSize() / 1024.0));
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            LOG.error(ERROR_WHILE_CREATING_NEW_BILL_ANNEX + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while updating new bill foreign annex", HttpStatus.INTERNAL_SERVER_ERROR);
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
    public ResponseEntity<Object> getProposalMilestones(@PathVariable("proposalRef") String proposalRef,
                                                        @RequestParam(value="language", required = false) String language) {
        try {
            proposalRef = encodeParam(proposalRef);
            if (language == null) {
                return new ResponseEntity<>(apiService.getProposalMilestones(proposalRef), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(apiService.getProposalMilestones(proposalRef, language), HttpStatus.OK);
            }
        } catch (NotFoundException e) {
            LOG.debug(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while getting milestones - " + e.getMessage());
            return new ResponseEntity<>("An error occurred while getting milestones: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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
            LOG.info("Annex document with ref {} is deleted by user {}", annexRef, securityContext.getUser().getLogin());
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

    @RequestMapping(value = "/secured/updateAnnexPosition/{proposalRef}/annex", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> updateProposalAnnexPosition(@PathVariable("proposalRef") String proposalRef,
                                                              @RequestParam Integer previousIndex, @RequestParam Integer nextIndex,
                                                              HttpServletRequest request) {
        proposalRef = encodeParam(proposalRef);
        String sessionId = request.getSession().getId();
        User user = securityContext.getUser();
        // TODO Temporary solution should be replaced by a true co edition handling for proposal (same mechanism as edition documents),
        CoEditionVO coEditionVO = new CoEditionVO(sessionId, null, user.getLogin()
                , user.getName(), user.getDefaultEntity() != null ? user.getDefaultEntity().getOrganizationName() : "",
                user.getEmail(), proposalRef + "_ANNEXES_POS", null, InfoType.DOCUMENT_INFO, System.currentTimeMillis());
        List<CoEditionVO> coEditionVOS = coEditionInfoHandler.getCurrentEditInfo(proposalRef + "_ANNEXES_POS");
        for (CoEditionVO coEditionVO1 : coEditionVOS) {
            if (System.currentTimeMillis() - coEditionVO1.getEditionTime() > 30000) {
                coEditionInfoHandler.removeInfo(coEditionVO1);
            }
        }
        coEditionVOS = coEditionInfoHandler.getCurrentEditInfo(proposalRef + "_ANNEXES_POS");
        if (!coEditionVOS.isEmpty()) {
            LOG.error("Error occured while updating annex order - Other user's concurrency");
            return new ResponseEntity<>("Cannot update annexes' positions because of other user's concurrency", HttpStatus.TOO_MANY_REQUESTS);
        }
        try {
            coEditionInfoHandler.storeInfo(coEditionVO);
            apiService.updateAnnexPosition(proposalRef, previousIndex, nextIndex);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            LOG.error("Error occured while updating annex order - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occured while updating annex order", HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            coEditionVOS = coEditionInfoHandler.getCurrentEditInfo(proposalRef + "_ANNEXES_POS");
            for (CoEditionVO coEditionVO1 : coEditionVOS) {
                coEditionInfoHandler.removeInfo(coEditionVO1);
            }
        }
    }

    @RequestMapping(value = "/secured/proposals/{proposalRef}/milestones", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> createMilestone(@PathVariable("proposalRef") String proposalRef, @RequestBody String milestoneComment) throws Exception {
        proposalRef = encodeParam(proposalRef);
        return new ResponseEntity<>(apiService.createMilestone(proposalRef, milestoneComment), HttpStatus.OK);
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
                LOG.info("Document with doc ref {} is retrieved by the user {}: ", documentRef, securityContext.getUser().getLogin());
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
            AppConfigResponse appConfigResponse = configService.getApplicationConfig(request.getHeader(AUTHORIZATION));
            return new ResponseEntity<>(appConfigResponse, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error occurred while getting application configuration - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting application configuration", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/secured/list-milestones-view/{documentRef}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getListMilestoneDocumentViews(@PathVariable("documentRef") String documentRef,
                                                                @RequestParam("legFileName") String legFileName,
                                                                @RequestParam("legFileId") String legFileId) {
        try {
            documentRef = encodeParam(documentRef);
            legFileName = encodeParam(legFileName);
            legFileId = encodeParam(legFileId);
            MilestoneViewResponse milestonesView = apiService.listMilestoneDocuments(documentRef, legFileName, legFileId);
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
                                                        @RequestParam("legFileName") String legFileName,
                                                        @RequestParam("legFileId") String legFileId) {
        try {
            documentRef = encodeParam(documentRef);
            legFileName = encodeParam(legFileName);
            legFileId = encodeParam(legFileId);
            MilestonePDFDownloadResponse response = apiService.downloadMilestonePDF(documentRef, legFileName, legFileId);
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

    @RequestMapping(value = "/getHtmlRenditions", method = RequestMethod.POST, produces =
            MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> getHtmlRenditions(@RequestParam("document") MultipartFile document) {
        try {
            LeosRenditionOutputResponseList renditionOutputs = apiService.getHtmlRenditions(document.getBytes());
            return new ResponseEntity<>(renditionOutputs, HttpStatus.OK);
        }
        catch (Exception e) {
            LOG.error("Error occurred while getting Html renditions - {}", e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting Html renditions", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/conValidation", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> conValidation(@RequestParam("zipFile") MultipartFile zipFile, @RequestParam(name = "email", required = true) String email) {
        try {
            validatePath(FilenameUtils.normalize(zipFile.getOriginalFilename()));
            if (!isValidFileNameForZipFile(zipFile.getOriginalFilename()) || !isValidSizeFileForBinaryFile(zipFile.getSize()) || !isValidMimeTypeForLegFile(zipFile.getBytes())) {
                return new ResponseEntity<>("Invalid file", HttpStatus.BAD_REQUEST);
            }
            LeosFile receivedFile = new LeosFile();
            receivedFile.setBytes(zipFile.getBytes());
            receivedFile.setName(zipFile.getOriginalFilename());
            receivedFile.setOriginalFileName(zipFile.getOriginalFilename());
            LeosFile legFile = ZipPackageUtil.unzipFile(receivedFile, ZipPackageUtil.unzipFiles(receivedFile).entrySet().stream().filter(entry -> entry.getKey().toLowerCase().endsWith(".leg")).findFirst().get().getKey());
            String validationResult = conValidatorService.validate(legFile);
            Map<String, Object> contentToZip = new HashMap<>();
            contentToZip.put("result.xml", validationResult);
            contentToZip.put(legFile.getOriginalFileName(), legFile);
            LeosFile resultZipFile = ZipPackageUtil.zipLeosFiles("validation.zip", contentToZip, "");
            notificationService.sendNotification(new DocumentExternalValidationNotification(email, "", new Date(), "", legFile.getOriginalFileName(), resultZipFile.getBytes()));
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e) {
            LOG.error("Error occurred running conValidation - {}", e.getMessage());
            return new ResponseEntity<>("Error occurred running conValidation", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
