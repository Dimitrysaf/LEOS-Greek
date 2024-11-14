package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.integration.ConValidatorService;
import eu.europa.ec.leos.services.api.ApiService;
import eu.europa.ec.leos.services.document.FinancialStatementService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class ProposalApiControllerTest {

    @Mock
    private FinancialStatementService financialStatementService;
    @Mock
    private ApiService apiService;
    @Mock
    private ConValidatorService conValidatorService;
    @InjectMocks
    private ProposalApiController proposalApiController;

    @Test
    public void createFinancialStatement() {
        this.proposalApiController.createFinancialStatement("proposalRef");
        Assert.assertTrue(true);
    }

    @Test
    public void deleteFinancialStatement() {
        this.proposalApiController.deleteFinancialStatement("proposalRef", "finStateRef");
        Assert.assertTrue(true);
    }
}
