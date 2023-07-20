package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.services.api.GenericDocumentApiService;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RunWith(MockitoJUnitRunner.class)
public class FinancialStatementControllerTest {

    @Mock
    private GenericDocumentApiService genericDocumentApiService;
    @InjectMocks
    private FinancialStatementController financialStatementController;

    @Test
    public void getDocumentByRef() {
        final String TEST_DOC_REF = "testDocRef";
        final String TEST_PROPOSAL_REF = "testProposalRef";
        final String TEST_XML = "testXml";
        final VersionInfoVO TEST_VERSION_INFO = new VersionInfoVO(null, null, null, null, null);

        Mockito.when(this.genericDocumentApiService.getDocumentByRef(Mockito.anyString()))
                .thenReturn(new DocumentViewResponse(TEST_PROPOSAL_REF,TEST_XML,TEST_VERSION_INFO));

        DocumentViewResponse response = this.financialStatementController.getDocumentByRef(TEST_DOC_REF);

        Assert.assertNotNull(response);
        Assert.assertEquals(TEST_PROPOSAL_REF, response.getProposalRef());
        Assert.assertEquals(TEST_XML, response.getEditableXml());
        Assert.assertEquals(TEST_VERSION_INFO, response.getVersionInfoVO());

        Mockito.spy(this.genericDocumentApiService).getDocumentByRef(Mockito.eq(TEST_DOC_REF));
    }

    @Test
    public void getToc() {
        final String TEST_DOC_REF = "testDocRef";
        final TocMode TEST_TOC_MODE = TocMode.SIMPLIFIED;

        Mockito.when(this.genericDocumentApiService.getTableOfContent(Mockito.anyString(), Mockito.any(TocMode.class)))
                .thenReturn(new ArrayList<>());

        List<TableOfContentItemVO> response = this.financialStatementController.getToc(TEST_DOC_REF, TEST_TOC_MODE);

        Assert.assertNotNull(response);
        Assert.assertTrue(response.isEmpty());

        Mockito.spy(this.genericDocumentApiService).getTableOfContent(Mockito.eq(TEST_DOC_REF), Mockito.eq(TEST_TOC_MODE));
    }

    @Test
    public void getTocItems() {
        final String TEST_DOC_REF = "testDocRef";

        Mockito.when(this.genericDocumentApiService.getTocItems(Mockito.anyString()))
                .thenReturn(new ArrayList<>());

        List<TocItem> response = this.financialStatementController.getTocItems(TEST_DOC_REF);

        Assert.assertNotNull(response);
        Assert.assertTrue(response.isEmpty());

        Mockito.spy(this.genericDocumentApiService).getTocItems(Mockito.eq(TEST_DOC_REF));
    }

    @Test
    public void getVersionData() {
        final String TEST_DOC_REF = "testDocRef";

        Mockito.when(this.genericDocumentApiService.getVersionsData(Mockito.anyString()))
                .thenReturn(new ArrayList<>());

        List<VersionVO> response = this.financialStatementController.getVersionData(TEST_DOC_REF);

        Assert.assertNotNull(response);
        Assert.assertTrue(response.isEmpty());

        Mockito.spy(this.genericDocumentApiService).getVersionsData(Mockito.eq(TEST_DOC_REF));
    }

    @Test
    public void getDocumentConfig() {
        final String TEST_DOC_REF = "testDocRef";
        final DocumentConfigResponse TEST_RESPONSE = new DocumentConfigResponse(
                new ArrayList<>(),
                new ArrayList<>(),
                new ArrayList<>(),
                new ArrayList<>(),
                new HashMap<>(),
                new HashMap<>(),
                "testRef",
                null,
                new HashMap<>(),
                false,
                false
        );

        Mockito.when(this.genericDocumentApiService.getDocumentConfig(Mockito.anyString()))
                .thenReturn(TEST_RESPONSE);

        DocumentConfigResponse response = this.financialStatementController.getDocumentConfig(TEST_DOC_REF);

        Assert.assertNotNull(response);
        Assert.assertEquals(TEST_RESPONSE, response);

        Mockito.spy(this.genericDocumentApiService).getTocItems(Mockito.eq(TEST_DOC_REF));
    }

    @Test
    public void getRecentChanges() {
        final String TEST_DOC_REF = "testDocRef";

        Mockito.when(this.genericDocumentApiService.getRecentMinorVersions(Mockito.anyString()))
                .thenReturn(new ArrayList<>());

        List<VersionVO> response = this.financialStatementController.getRecentChanges(TEST_DOC_REF);

        Assert.assertNotNull(response);
        Assert.assertTrue(response.isEmpty());

        Mockito.spy(this.genericDocumentApiService).getRecentMinorVersions(Mockito.eq(TEST_DOC_REF));
    }
}