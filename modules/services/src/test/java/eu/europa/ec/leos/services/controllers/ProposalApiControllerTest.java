package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.integration.ConValidatorService;
import eu.europa.ec.leos.services.api.ApiService;
import eu.europa.ec.leos.services.api.CoverPageApiService;
import eu.europa.ec.leos.services.document.FinancialStatementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class ProposalApiControllerTest {

    @Mock
    private FinancialStatementService financialStatementService;
    @Mock
    private ApiService apiService;
    @Mock
    private ConValidatorService conValidatorService;
    private ProposalApiController proposalApiController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        proposalApiController = new ProposalApiController(apiService, financialStatementService, conValidatorService);
    }

    @Test
    public void createFinancialStatement() {
        this.proposalApiController.createFinancialStatement("proposalRef");
        assertTrue(true);
    }

    @Test
    public void deleteFinancialStatement() {
        this.proposalApiController.deleteFinancialStatement("proposalRef", "finStateRef");
        assertTrue(true);
    }
}
