package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.document.operation.OperationStrategy;
import eu.europa.ec.leos.services.document.operation.OperationStrategyFactory;
import eu.europa.ec.leos.services.dto.request.DocumentLinesRequest;
import eu.europa.ec.leos.services.dto.request.Operation;
import eu.europa.ec.leos.services.dto.request.SectionRequest;
import eu.europa.ec.leos.services.dto.request.SectionType;
import eu.europa.ec.leos.services.store.PackageService;
import io.atlassian.fugue.Option;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InjectElementServiceImplTest {

    private static final String DOCUMENT_ID = "doc123";
    private static final String PACKAGE_PATH = "/path/to/package";
    private static final String COLLECTION_NAME = "ANY_COLLECTION";
    private static final byte[] BILL_CONTENT = "<akomaNtoso/>".getBytes(StandardCharsets.UTF_8);

    @Mock private PackageService packageService;
    @Mock private ProposalService proposalService;
    @Mock private BillService billService;
    @Mock private SecurityContext securityContext;
    @Mock private OperationStrategyFactory strategyFactory;
    @Mock private OperationStrategy operationStrategy;
    @Mock private DocumentContentService documentContentService;
    @Mock private DocumentContextInitializer documentContextInitializer;
    @InjectMocks private InjectElementServiceImpl injectElementService;

    // --- Validation ---

    @Test
    void injectElements_whenSectionsNull_throwsIllegalArgument() {
        DocumentLinesRequest request = requestFor(DOCUMENT_ID);
        request.setSections(null);

        assertThrows(IllegalArgumentException.class, () -> injectElementService.injectElements(request));
    }

    @Test
    void injectElements_whenSectionsEmpty_throwsIllegalArgument() {
        DocumentLinesRequest request = requestFor(DOCUMENT_ID);
        request.setSections(List.of());

        assertThrows(IllegalArgumentException.class, () -> injectElementService.injectElements(request));
    }

    // --- Security ---

    @Test
    void injectElements_whenUserLacksUpdatePermission_throwsSecurityException() {
        Bill bill = mockBill();
        givenPackageFound(DOCUMENT_ID, PACKAGE_PATH);
        givenProposalFound(PACKAGE_PATH, mockProposal());
        givenBillFound(PACKAGE_PATH, bill);
        when(securityContext.hasPermission(bill, LeosPermission.CAN_UPDATE)).thenReturn(false);

        assertThrows(SecurityException.class,
                () -> injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS)));
    }

    // --- Package resolution ---

    @Test
    void injectElements_whenPackageNotFound_throwsIllegalArgument() {
        when(packageService.findPackageByDocumentRef(eq("unknown"), eq(Proposal.class)))
                .thenThrow(new IllegalArgumentException("Package not found"));

        assertThrows(IllegalArgumentException.class,
                () -> injectElementService.injectElements(requestFor("unknown", SectionType.CITATIONS)));
    }

    // --- Strategy execution ---

    @Test
    void injectElements_passesCurrentBillContentToStrategy() {
        byte[] expectedContent = "<bill/>".getBytes(StandardCharsets.UTF_8);
        Bill bill = billWithContent(expectedContent);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_PATH, bill, COLLECTION_NAME);
        givenStrategyReturnsContentUnchanged();

        injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS));

        verify(operationStrategy).execute(eq(expectedContent), any(SectionRequest.class), anyString());
    }

    @Test
    void injectElements_passesDocumentCollectionNameToStrategy() {
        Bill bill = billWithContent(BILL_CONTENT);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_PATH, bill, "SPECIFIC_COLLECTION");
        givenStrategyReturnsContentUnchanged();

        injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS));

        verify(operationStrategy).execute(any(byte[].class), any(SectionRequest.class), eq("SPECIFIC_COLLECTION"));
    }

    @Test
    void injectElements_withMultipleSections_executesStrategyForEachSection() {
        Bill bill = billWithContent(BILL_CONTENT);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_PATH, bill, COLLECTION_NAME);
        givenStrategyReturnsContentUnchanged();

        injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS, SectionType.RECITALS));

        verify(operationStrategy, times(2)).execute(any(byte[].class), any(SectionRequest.class), anyString());
    }

    @Test
    void injectElements_whenStrategyThrowsUnsupportedOperation_wrapsInInjectElementException() {
        Bill bill = billWithContent(BILL_CONTENT);
        Proposal proposal = proposalWithCollection(COLLECTION_NAME);
        givenPackageFound(DOCUMENT_ID, PACKAGE_PATH);
        givenProposalFound(PACKAGE_PATH, proposal);
        givenBillFound(PACKAGE_PATH, bill);
        when(strategyFactory.getStrategy(Operation.CLEAN))
                .thenThrow(new UnsupportedOperationException("Operation not supported: CLEAN"));

        assertThrows(InjectElementException.class,
                () -> injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS)));
    }

    @Test
    void injectElements_whenStrategyThrowsIllegalArgument_propagatesAsIs() {
        Bill bill = billWithContent(BILL_CONTENT);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_PATH, bill, COLLECTION_NAME);
        when(operationStrategy.execute(any(), any(), any()))
                .thenThrow(new IllegalArgumentException("Invalid section content"));

        assertThrows(IllegalArgumentException.class,
                () -> injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS)));
    }

    // --- Document context ---

    @Test
    void injectElements_initialisesDocumentContextFromBill() {
        Bill bill = billWithContent(BILL_CONTENT);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_PATH, bill, COLLECTION_NAME);
        givenStrategyReturnsContentUnchanged();

        injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS));

        verify(documentContextInitializer).initializeFrom(bill);
    }

    // --- Document persistence ---

    @Test
    void injectElements_savesUpdatedContentToCorrectBill() {
        Bill bill = billWithContent(BILL_CONTENT);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_PATH, bill, COLLECTION_NAME);
        givenStrategyReturnsContentUnchanged();

        injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS));

        verify(documentContentService).updateDocument(eq(bill), any(byte[].class), anyString());
    }

    @Test
    void injectElements_auditMessageContainsSingleOperationName() {
        Bill bill = billWithContent(BILL_CONTENT);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_PATH, bill, COLLECTION_NAME);
        givenStrategyReturnsContentUnchanged();

        injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS));

        verify(documentContentService).updateDocument(any(), any(), contains("CLEAN"));
    }

    @Test
    void injectElements_auditMessageDeduplicatesRepeatedOperationNames() {
        Bill bill = billWithContent(BILL_CONTENT);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_PATH, bill, COLLECTION_NAME);
        givenStrategyReturnsContentUnchanged();

        injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS, SectionType.RECITALS));

        verify(documentContentService).updateDocument(any(), any(), argThat(msg ->
                msg.indexOf("CLEAN") == msg.lastIndexOf("CLEAN")));
    }

    @Test
    void injectElements_whenUpdateDocumentThrows_wrapsInInjectElementException() {
        Bill bill = billWithContent(BILL_CONTENT);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_PATH, bill, COLLECTION_NAME);
        givenStrategyReturnsContentUnchanged();
        when(documentContentService.updateDocument(any(), any(), any()))
                .thenThrow(new RuntimeException("Storage failure"));

        assertThrows(InjectElementException.class,
                () -> injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS)));
    }

    // --- Helpers ---

    private void givenPackageFound(String documentId, String packagePath) {
        LeosPackage leosPackage = mock(LeosPackage.class);
        when(leosPackage.getPath()).thenReturn(packagePath);
        when(packageService.findPackageByDocumentRef(eq(documentId), eq(Proposal.class))).thenReturn(leosPackage);
    }

    private void givenProposalFound(String packagePath, Proposal proposal) {
        when(proposalService.findProposalByPackagePath(packagePath)).thenReturn(proposal);
        when(proposalService.populateProposalMetadataFromXml(proposal)).thenReturn(proposal);
    }

    private void givenBillFound(String packagePath, Bill bill) {
        when(billService.findBillByPackagePath(packagePath)).thenReturn(bill);
        when(securityContext.hasPermission(bill, LeosPermission.CAN_UPDATE)).thenReturn(true);
    }

    private void givenFullyAuthorised(String documentId, String packagePath, Bill bill, String collectionName) {
        givenPackageFound(documentId, packagePath);
        givenProposalFound(packagePath, proposalWithCollection(collectionName));
        givenBillFound(packagePath, bill);
        when(strategyFactory.getStrategy(Operation.CLEAN)).thenReturn(operationStrategy);
    }

    private void givenStrategyReturnsContentUnchanged() {
        when(operationStrategy.execute(any(byte[].class), any(SectionRequest.class), anyString()))
                .thenAnswer(i -> i.getArgument(0));
    }

    private Proposal mockProposal() {
        return mock(Proposal.class);
    }

    private Proposal proposalWithCollection(String collectionName) {
        ProposalMetadata metadata = mock(ProposalMetadata.class);
        when(metadata.getDocumentCollectionName()).thenReturn(collectionName);
        Proposal proposal = mock(Proposal.class);
        doReturn(Option.some(metadata)).when(proposal).getMetadata();
        return proposal;
    }

    private Bill mockBill() {
        return mock(Bill.class);
    }

    private Bill billWithContent(byte[] contentBytes) {
        Content.Source source = mock(Content.Source.class);
        when(source.getBytes()).thenReturn(contentBytes);
        Content content = mock(Content.class);
        when(content.getSource()).thenReturn(source);
        Bill bill = mock(Bill.class);
        when(bill.getContent()).thenReturn(Option.some(content));
        return bill;
    }

    private DocumentLinesRequest requestFor(String documentId, SectionType... types) {
        DocumentLinesRequest request = new DocumentLinesRequest();
        request.setDocumentId(documentId);
        request.setSections(List.of(
                java.util.Arrays.stream(types)
                        .map(type -> {
                            SectionRequest section = new SectionRequest();
                            section.setSectionType(type);
                            section.setOperation(Operation.CLEAN);
                            return section;
                        })
                        .toArray(SectionRequest[]::new)));
        return request;
    }

    private DocumentLinesRequest requestFor(String documentId) {
        DocumentLinesRequest request = new DocumentLinesRequest();
        request.setDocumentId(documentId);
        return request;
    }
}
