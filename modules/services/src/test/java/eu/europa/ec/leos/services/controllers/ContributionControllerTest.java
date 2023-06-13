package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.common.ErrorCode;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.services.api.ContributionApiService;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.dto.request.CloneProposalRequest;
import eu.europa.ec.leos.services.user.UserService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.mockito.Mockito.*;
import static org.junit.Assert.*;

@RunWith(MockitoJUnitRunner.class)
public class ContributionControllerTest {
    private static final String PROPOSAL_REF = "proposal";
    private static final String USER_LOGIN = "demo";
    private static final String DOCUMENT_LEG_NAME = "document_test";


    @Mock
    private UserService userService;

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
        when(contributionApiService.createCloneProposal(PROPOSAL_REF, cloneRequest.getUserLogin(), cloneRequest.getLegDocumentName()))
                .thenReturn(expectedResult);

        ResponseEntity<Object> response = contributionController.createCloneProposal(PROPOSAL_REF, cloneRequest);

        verify(contributionApiService, times(1)).createCloneProposal(PROPOSAL_REF, cloneRequest.getUserLogin(), cloneRequest.getLegDocumentName());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedResult, response.getBody());
    }

    @Test
    public void testRequestCloneProposal_Exception() {
        CloneProposalRequest cloneRequest = new CloneProposalRequest();
        cloneRequest.setUserLogin(USER_LOGIN);
        cloneRequest.setLegDocumentName(DOCUMENT_LEG_NAME);

        Exception exception = new RuntimeException("Test exception");
        when(contributionApiService.createCloneProposal(PROPOSAL_REF, cloneRequest.getUserLogin(), cloneRequest.getLegDocumentName()))
                .thenThrow(exception);

        ResponseEntity<Object> response = contributionController.createCloneProposal(PROPOSAL_REF, cloneRequest);

        verify(contributionApiService, times(1)).createCloneProposal(PROPOSAL_REF, cloneRequest.getUserLogin(), cloneRequest.getLegDocumentName());

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
}
