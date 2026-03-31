package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.rest.support.model.Package;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.collection.CreateCollectionService;
import eu.europa.ec.leos.services.collection.ExtPackageResult;
import eu.europa.ec.leos.services.dto.response.LeosRenditionOutputResponseList;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.structure.lang.LanguageGroupService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class ApiServiceImplExtProposalTest {

    @Mock private CreateCollectionService createCollectionService;
    @Mock private PackageService packageService;
    @Mock private LanguageGroupService languageGroupService;

    private ApiServiceImpl apiService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        apiService = new ApiServiceImpl(
                null, null, null, null,
                createCollectionService,
                null, null, null, null, null, null, null, null,
                packageService,
                null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
                languageGroupService) {
            @Override public byte[] downloadProposal(String proposalRef) { return null; }
            @Override public void validateProposal(String proposalRef) {}
            @Override public void validateProposals(String email, String username) {}
            @Override public LeosRenditionOutputResponseList getHtmlRenditions(byte[] document) throws IOException { return null; }
            @Override public Package findPackageByName(String packageName) { return null; }
        };
    }

    @Test
    public void createExtProposalWithEnOnlyReturnsOneResult() throws Exception {
        CreateCollectionResult enResult = mockResult("proposal-en");
        when(createCollectionService.createCollection(any(), eq(false))).thenReturn(enResult);

        List<ExtPackageResult> results = apiService.createExtProposal("templateKey", new String[]{"EN"}, "purpose");

        assertEquals(1, results.size());
        assertEquals("EN", results.get(0).getLanguage());
        assertEquals("proposal-en", results.get(0).getProposalId());
        assertEquals(200, results.get(0).getHttpStatus());
    }

    @Test
    public void createExtProposalWithMultipleLanguagesReturnsOneResultPerLanguage() throws Exception {
        CreateCollectionResult enResult = mockResult("proposal-en");
        CreateCollectionResult frResult = mockResult("proposal-fr");
        when(createCollectionService.createCollection(any(), eq(false))).thenReturn(enResult);
        when(createCollectionService.createCollection(any(), eq(true))).thenReturn(frResult);

        List<ExtPackageResult> results = apiService.createExtProposal("templateKey", new String[]{"EN", "FR"}, "purpose");

        assertEquals(2, results.size());
        assertEquals("EN", results.get(0).getLanguage());
        assertEquals("proposal-en", results.get(0).getProposalId());
        assertEquals("FR", results.get(1).getLanguage());
        assertEquals("proposal-fr", results.get(1).getProposalId());
    }

    @Test
    public void createExtProposalWithoutEnReturnsErrorResult() {
        List<ExtPackageResult> results = apiService.createExtProposal("templateKey", new String[]{"FR"}, "purpose");

        assertEquals(1, results.size());
        assertNotNull(results.get(0).getError());
        assertEquals(400, results.get(0).getHttpStatus());
        verifyNoInteractions(createCollectionService);
    }

    @Test
    public void createExtProposalRollsBackAndReturnsErrorWhenLinguisticVersionFails() throws Exception {
        CreateCollectionResult enResult = mockResult("proposal-en");
        when(createCollectionService.createCollection(any(), eq(false))).thenReturn(enResult);
        when(createCollectionService.createCollection(any(), eq(true))).thenThrow(new RuntimeException("creation failed"));

        LeosPackage leosPackage = mock(LeosPackage.class);
        when(packageService.findPackageByDocumentRef(eq("proposal-en"), eq(Proposal.class))).thenReturn(leosPackage);

        List<ExtPackageResult> results = apiService.createExtProposal("templateKey", new String[]{"EN", "DE"}, "purpose");

        assertEquals(1, results.size());
        assertNotNull(results.get(0).getError());
        assertEquals(500, results.get(0).getHttpStatus());
        verify(packageService).deletePackage(leosPackage);
    }

    @Test
    public void createExtProposalWithNullLanguageCodesDefaultsToEn() throws Exception {
        CreateCollectionResult enResult = mockResult("proposal-en");
        when(createCollectionService.createCollection(any(), eq(false))).thenReturn(enResult);

        List<ExtPackageResult> results = apiService.createExtProposal("templateKey", null, "purpose");

        assertEquals(1, results.size());
        assertEquals("EN", results.get(0).getLanguage());
    }

    private CreateCollectionResult mockResult(String proposalId) {
        CreateCollectionResult result = mock(CreateCollectionResult.class);
        when(result.getProposalId()).thenReturn(proposalId);
        when(result.isCollectionCreated()).thenReturn(true);
        when(result.getError()).thenReturn(null);
        return result;
    }
}
