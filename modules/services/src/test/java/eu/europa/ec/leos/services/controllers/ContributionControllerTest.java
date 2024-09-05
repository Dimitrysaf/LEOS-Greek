package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.repository.LeosCategoryClass;
import eu.europa.ec.leos.domain.common.ErrorCode;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.services.api.ContributionApiService;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.dto.request.ApplyContributionsRequest;
import eu.europa.ec.leos.services.dto.request.CloneProposalRequest;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.response.DeclineContributionResponse;
import eu.europa.ec.leos.services.response.MergeContributionResponse;
import eu.europa.ec.leos.services.user.UserService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;

import static org.mockito.Mockito.*;
import static org.junit.Assert.*;

@RunWith(MockitoJUnitRunner.class)
public class ContributionControllerTest {
    private static final String PROPOSAL_REF = "proposal";
    private static final String DOCUMENT_REF = "DOCUMENT_REF";
    private static final LeosCategoryClass TEST_CLASS = LeosCategoryClass.ANNEX;
    private static final String USER_LOGIN = "demo";
    private static final String DOCUMENT_LEG_NAME = "document_test";
    private static final String LEG_FILE_ID = "1";

    @Mock
    private ContributionApiService contributionApiService;

    @InjectMocks
    private ContributionController contributionController;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testRequestCloneProposal_Success() {
        CloneProposalRequest cloneRequest = new CloneProposalRequest();
        cloneRequest.setUserLogin(USER_LOGIN);
        cloneRequest.setLegDocumentName(DOCUMENT_LEG_NAME);

        CreateCollectionResult expectedResult = new CreateCollectionResult();
        when(contributionApiService.createCloneProposal(cloneRequest.getUserLogin(), cloneRequest.getLegDocumentName(), LEG_FILE_ID))
                .thenReturn(expectedResult);

        ResponseEntity<Object> response = contributionController.createCloneProposal(LEG_FILE_ID, cloneRequest);

        verify(contributionApiService, times(1)).createCloneProposal(cloneRequest.getUserLogin(), cloneRequest.getLegDocumentName(), LEG_FILE_ID);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedResult, response.getBody());
    }

    @Test
    public void testRequestCloneProposal_Exception() {
        CloneProposalRequest cloneRequest = new CloneProposalRequest();
        cloneRequest.setUserLogin(USER_LOGIN);
        cloneRequest.setLegDocumentName(DOCUMENT_LEG_NAME);

        Exception exception = new RuntimeException("Test exception");
        when(contributionApiService.createCloneProposal(cloneRequest.getUserLogin(), cloneRequest.getLegDocumentName(), LEG_FILE_ID))
                .thenThrow(exception);

        ResponseEntity<Object> response = contributionController.createCloneProposal(LEG_FILE_ID, cloneRequest);

        verify(contributionApiService, times(1)).createCloneProposal(cloneRequest.getUserLogin(), cloneRequest.getLegDocumentName(), LEG_FILE_ID);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals(exception.getMessage(), response.getBody());
    }

    @Test
    public void updateClonedProposalRevisionStatus_Success() {
        when(contributionApiService.updateClonedProposalRevisionStatus(PROPOSAL_REF, DOCUMENT_LEG_NAME)).thenReturn(new Result("", null));

        ResponseEntity<Object> response = contributionController.updateClonedProposalRevisionStatus(PROPOSAL_REF, DOCUMENT_LEG_NAME);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void updateClonedProposalRevisionStatus_Fail() {
        when(contributionApiService.updateClonedProposalRevisionStatus(PROPOSAL_REF, DOCUMENT_LEG_NAME)).thenReturn(new Result("", ErrorCode.DOCUMENT_NOT_FOUND));

        ResponseEntity<Object> response = contributionController.updateClonedProposalRevisionStatus(PROPOSAL_REF, DOCUMENT_LEG_NAME);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void listContributionsForDocument() {
        when(contributionApiService.listContributionsForDocument(DOCUMENT_REF)).thenReturn(new ArrayList<>());

        ResponseEntity<Object> response = contributionController.listContributionsForDocument(DOCUMENT_REF, "ANNEX");

        //verify that the service has been called with the correct params
        verify(contributionApiService, times(1)).listContributionsForDocument(DOCUMENT_REF);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void test_viewMergePane() throws Exception {
        String TEST_CONTEXT_PATH = "/test-content-path";
        String TEST_DOCUMENT_REF = "documentRef";
        String TEST_DOCUMENT_TYPE = "documentType";
        String TEST_VERSION_LABEL = "versionLabel";
        String TEST_RESPONSE_BODY = "Test Response";
        String TEST_LEG_FILE_NAME = "PROP_ACT_TEST";
        HttpServletRequest httpRequestMock = Mockito.mock(HttpServletRequest.class);
        DocumentViewResponse testResponse = new DocumentViewResponse(TEST_DOCUMENT_REF, TEST_RESPONSE_BODY, null, null, null);
        when(httpRequestMock.getContextPath()).thenReturn(TEST_CONTEXT_PATH);
        when(contributionApiService.compareAndShowRevision(anyString(), anyString(), anyString(), anyString())).thenReturn(testResponse);

        ResponseEntity<DocumentViewResponse> response = contributionController.viewMergePane(httpRequestMock, TEST_DOCUMENT_REF, TEST_DOCUMENT_TYPE,
                TEST_VERSION_LABEL, TEST_LEG_FILE_NAME);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(TEST_RESPONSE_BODY, response.getBody().getEditableXml());

        verify(contributionApiService).compareAndShowRevision(TEST_CONTEXT_PATH, TEST_DOCUMENT_REF, TEST_VERSION_LABEL, TEST_LEG_FILE_NAME);
    }

    @Test
    public void test_declineContribution(){
        String TEST_DOCUMENT_REF = "documentRef";
        String TEST_DOCUMENT_TYPE = "documentType";

        ResponseEntity<DeclineContributionResponse> response = contributionController.declineContribution(TEST_DOCUMENT_REF, TEST_DOCUMENT_TYPE);
        DeclineContributionResponse responseData = response.getBody();

        verify(this.contributionApiService).declineContribution(TEST_DOCUMENT_REF);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(responseData);
        assertEquals(ContributionVO.ContributionStatus.CONTRIBUTION_DONE.getValue(), responseData.getContributionStatus());
    }

    @Test
    public void test_mergeContribution() throws Exception {
        String TEST_DOCUMENT_REF = "documentRef";
        String TEST_DOCUMENT_CONTENT = "test content";
        ApplyContributionsRequest TEST_REQUEST = new ApplyContributionsRequest();

        when(this.contributionApiService.mergeContribution(anyString(), any(ApplyContributionsRequest.class))).thenReturn(new MergeContributionResponse(true,
                TEST_DOCUMENT_CONTENT.getBytes(StandardCharsets.UTF_8)));

        ResponseEntity<MergeContributionResponse> response = this.contributionController.mergeContribution(TEST_DOCUMENT_REF, TEST_REQUEST);

        verify(this.contributionApiService).mergeContribution(TEST_DOCUMENT_REF, TEST_REQUEST);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(TEST_DOCUMENT_CONTENT, new String(response.getBody().getMergedContent()));
    }
}
