package eu.europa.ec.leos.services.controllers;

import com.google.common.collect.ImmutableMap;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.model.action.TrackChangeActionType;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.services.api.FinancialStatementApiService;
import eu.europa.ec.leos.services.api.GenericDocumentApiService;
import eu.europa.ec.leos.services.api.GenericDocumentTocApiService;
import eu.europa.ec.leos.services.dto.coedition.CoEditionContext;
import eu.europa.ec.leos.services.dto.request.InsertElementRequest;
import eu.europa.ec.leos.services.dto.request.SaveIntermediateVersionRequest;
import eu.europa.ec.leos.services.dto.request.ToggleTrackChangeEnabledRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.SaveElementResponse;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.services.response.SearchAndReplaceAllResponse;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.structure.TocItem;
import io.atlassian.fugue.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;

@RestController
@RequestMapping(value = "/secured/stat_digit_financ_legis")
public class FinancialStatementController implements FinancialStatementApi {
    private static final Logger LOG = LoggerFactory.getLogger(FinancialStatementController.class);
    private static  final String CLIENT_CONTEXT_PARAMETER = "Client-Context";

    private FinancialStatementApiService financialStatementApiService;

    private GenericDocumentApiService genericDocumentApiService;
    private GenericDocumentTocApiService genericDocumentTocApiService;
    @Autowired
    private CoEditionContext coEditionContext;

    public FinancialStatementController(GenericDocumentApiService genericDocumentApiService,
                                        GenericDocumentTocApiService genericDocumentTocApiService,
                                        FinancialStatementApiService financialStatementApiService) {
        this.genericDocumentTocApiService = Objects.requireNonNull(genericDocumentTocApiService);
        this.genericDocumentApiService = Objects.requireNonNull(genericDocumentApiService);
        this.financialStatementApiService = Objects.requireNonNull(financialStatementApiService);
    }

    @Override
    public DocumentViewResponse getDocumentByRef(String reference) {
        // When the controller will be used as generic document controller the category will be part of the path.
        reference = encodeParam(reference);
        DocumentViewResponse response = this.genericDocumentApiService.getDocumentByRef(reference);
        return response;
    }

    @Override
    public List<TableOfContentItemVO> getToc(String docRef, TocMode tocMode) {
        // When the controller will be used as generic document controller the category will be part of the path.
        docRef = encodeParam(docRef);
        List<TableOfContentItemVO> tableOfContent = this.genericDocumentTocApiService.getTableOfContent(docRef, tocMode);
        return tableOfContent;
    }

    @Override
    public List<TocItem> getTocItems(String documentRef) {
        documentRef = encodeParam(documentRef);
        List<TocItem> tocItems = this.genericDocumentApiService.getTocItems(documentRef);
        return tocItems;
    }

    @Override
    public ResponseEntity<Object> searchVersionData(String documentRef, String authorKey, String type) {
        try {
            documentRef = encodeParam(documentRef);
            List<VersionVO> versions = this.genericDocumentApiService.searchVersions(documentRef, authorKey, type);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public List<VersionVO> getMajorVersionsData(String documentRef, int pageIndex, int pageSize) {
        documentRef = encodeParam(documentRef);
        return this.genericDocumentApiService.getMajorVersionsData(documentRef, pageIndex, pageSize);
    }

    @Override
    public ResponseEntity<Object> countMajorVersionsData(String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            int versions = this.genericDocumentApiService.countMajorVersionsData(documentRef);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting document versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public DocumentConfigResponse getDocumentConfig(String documentRef, HttpServletRequest request) {
        documentRef = encodeParam(documentRef);
        String clientContextToken = request.getHeader(CLIENT_CONTEXT_PARAMETER);
        DocumentConfigResponse config = this.financialStatementApiService.getDocumentConfig(documentRef, clientContextToken);
        return config;
    }

    @Override
    public List<VersionVO> getRecentChanges(String documentRef, int pageIndex, int pageSize) {
        documentRef = encodeParam(documentRef);
        List<VersionVO> recentMinorVersions = this.genericDocumentApiService.getRecentMinorVersions(documentRef,
                pageIndex, pageSize);
        return recentMinorVersions;
    }

    @Override
    public int countRecentChanges(String documentRef) {
        documentRef = encodeParam(documentRef);
        return this.genericDocumentApiService.countRecentMinorVersions(documentRef);
    }

    @Override
    public ResponseEntity<Object> getIntermediateVersionData(String documentRef, String currIntVersion,
                                                             int pageIndex, int pageSize) {
        try {
            documentRef = encodeParam(documentRef);
            currIntVersion = encodeParam(currIntVersion);
            List<VersionVO> versions = this.genericDocumentApiService.getIntermediateVersionsData(documentRef,
                    currIntVersion, pageIndex, pageSize);
            return ResponseEntity.ok().body(versions);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> countIntermediateVersionData(String documentRef, String currIntVersion) {
        try {
            documentRef = encodeParam(documentRef);
            currIntVersion = encodeParam(currIntVersion);
            int count = this.genericDocumentApiService.countIntermediateVersionsData(documentRef, currIntVersion);
            return ResponseEntity.ok().body(count);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex versioning data - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting versioning data",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    // TODO when refactor: the endpoint path should be /version/{id} in order to follow the REST APIs resources naming.
    @Override
    public DocumentViewResponse getVersion(String versionId) {
        versionId = encodeParam(versionId);
        DocumentViewResponse version = this.genericDocumentApiService.getVersion(versionId);
        return version;
    }

    @Override
    public List<VersionVO> saveVersion(String documentRef, SaveIntermediateVersionRequest request) {
        documentRef = encodeParam(documentRef);
        List<VersionVO> versions = this.genericDocumentApiService.saveDocument(documentRef, request.getVersionType(),
                request.getCheckinComment());
        return versions;
    }

    // TODO when refactor: This API call is redundant. Its the same as getVersion. Then the FE should only parse the XML.
    @Override
    public byte[] downloadVersion(String versionId) {
        return this.genericDocumentApiService.getXmlContent(versionId);
    }

    @Override
    public DocumentViewResponse restoreVersion(String documentRef, String targetVersion) {
        documentRef = encodeParam(documentRef);
        targetVersion = encodeParam(targetVersion);
        DocumentViewResponse response = this.genericDocumentApiService.restoreToVersion(documentRef, targetVersion);
        return response;
    }

    // TODO on Refactor set the path to /{documentRef/element/{elementId}/{elementName. The "/save-element" is not needed.
    @Override
    public ResponseEntity<Object> saveElement(String documentRef, String elementName, String elementId,
                                              String presenterId, String elementContent) throws Exception {
        try {
            documentRef = encodeParam(documentRef);
            elementName = encodeParam(elementName);
            elementId = encodeParam(elementId);
            presenterId = encodeParam(presenterId);
            SaveElementResponse response = this.genericDocumentApiService.saveElement(documentRef, elementId,
                    elementName, elementContent);
            coEditionContext.sendUpdatedElements(documentRef, presenterId, response, null);
            return ResponseEntity.ok(response);
        } catch (Exception cmisBaseException) {
            LOG.error("---[FINANCIAL STATEMENT] [CMIS EXCEPTION] --- Error saving element : {} ",
                    cmisBaseException.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }


    @Override
    public EditElementResponse getElement(String documentRef, String elementId, String elementTagName) {
        documentRef = encodeParam(documentRef);
        elementId = encodeParam(elementId);
        elementTagName = encodeParam(elementTagName);
        EditElementResponse response = this.genericDocumentApiService.getElement(documentRef, elementId,
                elementTagName);
        return response;
    }

    @Override
    public ResponseEntity<Object> getUserGuidance(String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            String userGuidance = this.financialStatementApiService.fetchUserGuidance(documentRef);
            return ResponseEntity.ok().body(userGuidance);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get user guidance for annex " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get user guidance for annex", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public List<SearchMatchVO> getSearchResults(String documentRef, String searchText, boolean matchCase,
                                   boolean completeWords, String tempUpdatedContentXML) throws Exception {
        documentRef = encodeParam(documentRef);
        return this.genericDocumentApiService.searchTextInDocument(documentRef, searchText, matchCase, completeWords,
                tempUpdatedContentXML);
    }

    @Override
    public ResponseEntity<Object> compareDocumentVersions(String newVersionId, String oldVersionId) {
        try {
            newVersionId = encodeParam(newVersionId);
            oldVersionId = encodeParam(oldVersionId);
            String contentHtml = this.genericDocumentApiService.compare(newVersionId, oldVersionId);
            return ResponseEntity.ok().body(contentHtml);
        } catch (Exception e) {
            return new ResponseEntity<>("Unexpected error while trying to get document version as html ",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<Object> deleteDocumentElement(String documentRef, String elementName, String elementId) {
        try {
            documentRef = encodeParam(documentRef);
            elementName = encodeParam(elementName);
            elementId = encodeParam(elementId);
            DocumentViewResponse financialStatement = this.financialStatementApiService.deleteBlock(documentRef, elementName, elementId);
            return ResponseEntity.ok().body(financialStatement);
        } catch (Exception e) {
            LOG.error("Error occurred while getting financial statement element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while deleting financial statement element", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> insertGroup(String documentRef, String elementName, String elementId,
                                              InsertElementRequest request) {
        try {
            documentRef = encodeParam(documentRef);
            elementName = encodeParam(elementName);
            elementId = encodeParam(elementId);
            DocumentViewResponse lfds = this.financialStatementApiService.insertGroup(documentRef, elementName, elementId, request.getPosition());
            return ResponseEntity.ok().body(lfds);
        } catch (Exception e) {
            LOG.error("Error occurred while getting financial statement element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while inserting financial statement element", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> insertElement(String documentRef, String elementName, String elementId,
                                                InsertElementRequest request) {
        try {
            documentRef = encodeParam(documentRef);
            elementName = encodeParam(elementName);
            elementId = encodeParam(elementId);
            DocumentViewResponse bill = this.financialStatementApiService.insertElement(documentRef, elementName, elementId, request.getPosition());
            return ResponseEntity.ok().body(bill);
        } catch (Exception e) {
            LOG.error("Error occurred while getting financial statement element - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while inserting financial statement element", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> replaceOneText(String documentRef, ReplaceMatchRequest request) {
        try {
            byte[] response = this.genericDocumentApiService.replaceOneTextInDocument(request);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting downloading xml version - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while  downloading xml version",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> replaceAllText(String documentRef, ReplaceAllMatchRequest request) {
        try {
            Pair<byte[], Integer> response = this.genericDocumentApiService.replaceAllTextInDocument(request);
            SearchAndReplaceAllResponse searchAndReplaceAllResponse = new SearchAndReplaceAllResponse(new String(response.left(), StandardCharsets.UTF_8), response.right());
            return ResponseEntity.ok().body(searchAndReplaceAllResponse);
        } catch (Exception e) {
            LOG.error("Error occurred  while getting downloading xml version - " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while  downloading xml version",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> saveAllAfterReplace(String documentRef, SaveAfterReplaceRequest request) {
        try {
            DocumentViewResponse view = this.genericDocumentApiService.saveAfterReplace(request);
            return ResponseEntity.ok().body(view);
        } catch (Exception e) {
            LOG.error("Error occurred  while saving after replace all - " + e.getMessage());
            return new ResponseEntity<>("Error occurred while saving after replace all",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    public ResponseEntity<Object> downloadCleanVersion(String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            byte[] cleanVersion = this.genericDocumentApiService.downloadCleanVersion(documentRef);
            final String jobFileName = documentRef + "_AKN2DW_CLEAN_" + System.currentTimeMillis() + ".docx";
            // create the HttpHeaders object and set the Content-Type header
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Disposition", "attachment; filename=\"" + jobFileName + "\"");
            return new ResponseEntity<>(cleanVersion, headers, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error(
                    "Error occurred  while trying to download clean version for financial statement " + e.getMessage());
            return new ResponseEntity<>(
                    "Error occurred  while trying to download clean version for financial statement",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> showCleanVersion(String documentRef) {
        try {
            documentRef = encodeParam(documentRef);
            DocumentViewResponse cleanVersion = this.genericDocumentApiService.showCleanVersion(documentRef);
            return ResponseEntity.ok().body(cleanVersion);
        } catch (Exception e) {
            LOG.error("Error occurred  while trying to get  clean version for financial statement " + e.getMessage());
            return new ResponseEntity<>("Error occurred  while trying to get clean version for financial statement",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> toggleTrackChangeEnabled(String documentRef,
                                                           ToggleTrackChangeEnabledRequest toggleTrackChangeEnabledRequest) {
        try {
            documentRef = encodeParam(documentRef);
            boolean isTrackChangesEnabled = toggleTrackChangeEnabledRequest.isTrackChangedEnabled();
            boolean response = financialStatementApiService.toggleTrackChangeEnabled(isTrackChangesEnabled,
                    documentRef);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred while toggling Track change enabled- " + e);
            return new ResponseEntity<>("Unexpected error occurred while toggling Track change enabled",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> rejectChange(String documentRef, String elementId, String elementTagName,
                                               String trackChangeAction, String presenterId) {
        try {
            documentRef = encodeParam(documentRef);
            elementId = encodeParam(elementId);
            elementTagName = encodeParam(elementTagName);
            trackChangeAction = encodeParam(trackChangeAction);
            presenterId = encodeParam(presenterId);
            TrackChangeActionType trackChangeActionType = TrackChangeActionType.of(trackChangeAction);
            DocumentViewResponse response = this.financialStatementApiService.rejectChange(documentRef, elementId, elementTagName, trackChangeActionType, presenterId);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred  while rejecting change - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error while rejecting change ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> finaliseDocument(String documentRef) {
        documentRef = encodeParam(documentRef);
        try {
            this.genericDocumentApiService.finaliseDocument(documentRef);
            return ResponseEntity.ok().body(ImmutableMap.of("result", "Document successfully finalised!"));
        } catch (Exception e) {
            return new ResponseEntity<>("Unexpected error while finalising document", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
