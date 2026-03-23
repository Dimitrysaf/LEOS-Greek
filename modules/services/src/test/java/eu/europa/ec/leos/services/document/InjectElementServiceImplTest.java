package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.BillMetadata;
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
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InjectElementServiceImplTest {

    private static final String DOCUMENT_ID = "doc123";
    private static final String PACKAGE_ID = "pkg456";
    private static final String PACKAGE_PATH = "/path/to/package";
    private static final String COLLECTION_NAME = "ANY_COLLECTION";
    private static final byte[] BILL_CONTENT = "<akomaNtoso/>".getBytes(StandardCharsets.UTF_8);

    @Mock private PackageService packageService;
    @Mock private ProposalService proposalService;
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
        givenPackageFound(DOCUMENT_ID, PACKAGE_ID, PACKAGE_PATH, bill);
        givenProposalFound(PACKAGE_PATH, mock(Proposal.class));
        when(securityContext.hasPermission(bill, LeosPermission.CAN_UPDATE)).thenReturn(false);

        assertThrows(SecurityException.class,
                () -> injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS)));
    }

    // --- Package resolution ---

    @Test
    void injectElements_whenPackageNotFound_throwsIllegalArgument() {
        when(packageService.findPackageByDocumentRef(eq("unknown"), eq(XmlDocument.class)))
                .thenThrow(new IllegalArgumentException("Package not found"));

        assertThrows(IllegalArgumentException.class,
                () -> injectElementService.injectElements(requestFor("unknown", SectionType.CITATIONS)));
    }

    @Test
    void injectElements_whenDocumentNotFoundInPackage_throwsIllegalArgument() {
        LeosPackage leosPackage = mock(LeosPackage.class);
        when(leosPackage.getId()).thenReturn(PACKAGE_ID);
        when(packageService.findPackageByDocumentRef(eq(DOCUMENT_ID), eq(XmlDocument.class))).thenReturn(leosPackage);
        when(packageService.findDocumentsByPackageId(eq(PACKAGE_ID), eq(XmlDocument.class), eq(false), eq(true)))
                .thenReturn(List.of());

        assertThrows(IllegalArgumentException.class,
                () -> injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS)));
    }

    // --- Strategy execution ---

    @Test
    void injectElements_passesCurrentDocumentContentToStrategy() {
        byte[] expectedContent = "<bill/>".getBytes(StandardCharsets.UTF_8);
        Bill bill = mockBillWithContent(expectedContent);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_ID, PACKAGE_PATH, bill, COLLECTION_NAME);
        givenStrategyReturnsContentUnchanged();

        injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS));

        verify(operationStrategy).execute(eq(expectedContent), any(SectionRequest.class), anyString(), eq(LeosCategory.BILL));
    }

    @Test
    void injectElements_passesDocumentCollectionNameToStrategy() {
        Bill bill = mockBillWithContent(BILL_CONTENT);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_ID, PACKAGE_PATH, bill, "SPECIFIC_COLLECTION");
        givenStrategyReturnsContentUnchanged();

        injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS));

        verify(operationStrategy).execute(any(byte[].class), any(SectionRequest.class), eq("SPECIFIC_COLLECTION"), any());
    }

    @Test
    void injectElements_withMultipleSections_executesStrategyForEachSection() {
        Bill bill = mockBillWithContent(BILL_CONTENT);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_ID, PACKAGE_PATH, bill, COLLECTION_NAME);
        givenStrategyReturnsContentUnchanged();

        injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS, SectionType.RECITALS));

        verify(operationStrategy, times(2)).execute(any(byte[].class), any(SectionRequest.class), anyString(), any());
    }

    @Test
    void injectElements_whenStrategyThrowsUnsupportedOperation_wrapsInInjectElementException() {
        Bill bill = mockBillWithContent(BILL_CONTENT);
        givenPackageFound(DOCUMENT_ID, PACKAGE_ID, PACKAGE_PATH, bill);
        givenProposalFound(PACKAGE_PATH, proposalWithCollection(COLLECTION_NAME));
        when(securityContext.hasPermission(bill, LeosPermission.CAN_UPDATE)).thenReturn(true);
        when(strategyFactory.getStrategy(Operation.CLEAN))
                .thenThrow(new UnsupportedOperationException("Operation not supported: CLEAN"));

        assertThrows(InjectElementException.class,
                () -> injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS)));
    }

    @Test
    void injectElements_whenStrategyThrowsIllegalArgument_propagatesAsIs() {
        Bill bill = mockBillWithContent(BILL_CONTENT);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_ID, PACKAGE_PATH, bill, COLLECTION_NAME);
        when(operationStrategy.execute(any(), any(), any(), any()))
                .thenThrow(new IllegalArgumentException("Invalid section content"));

        assertThrows(IllegalArgumentException.class,
                () -> injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS)));
    }

    // --- Document context ---

    @Test
    void injectElements_initialisesDocumentContextFromDocument() {
        Bill bill = mockBillWithContent(BILL_CONTENT);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_ID, PACKAGE_PATH, bill, COLLECTION_NAME);
        givenStrategyReturnsContentUnchanged();

        injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS));

        verify(documentContextInitializer).initializeFrom(bill);
    }

    // --- Document persistence ---

    @Test
    void injectElements_savesUpdatedContentToCorrectDocument() {
        Bill bill = mockBillWithContent(BILL_CONTENT);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_ID, PACKAGE_PATH, bill, COLLECTION_NAME);
        givenStrategyReturnsContentUnchanged();

        injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS));

        verify(documentContentService).updateDocument(eq(bill), any(byte[].class), anyString());
    }

    @Test
    void injectElements_auditMessageContainsSingleOperationName() {
        Bill bill = mockBillWithContent(BILL_CONTENT);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_ID, PACKAGE_PATH, bill, COLLECTION_NAME);
        givenStrategyReturnsContentUnchanged();

        injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS));

        verify(documentContentService).updateDocument(any(), any(), contains("CLEAN"));
    }

    @Test
    void injectElements_auditMessageDeduplicatesRepeatedOperationNames() {
        Bill bill = mockBillWithContent(BILL_CONTENT);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_ID, PACKAGE_PATH, bill, COLLECTION_NAME);
        givenStrategyReturnsContentUnchanged();

        injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS, SectionType.RECITALS));

        verify(documentContentService).updateDocument(any(), any(), argThat(msg ->
                msg.indexOf("CLEAN") == msg.lastIndexOf("CLEAN")));
    }

    @Test
    void injectElements_whenUpdateDocumentThrows_wrapsInInjectElementException() {
        Bill bill = mockBillWithContent(BILL_CONTENT);
        givenFullyAuthorised(DOCUMENT_ID, PACKAGE_ID, PACKAGE_PATH, bill, COLLECTION_NAME);
        givenStrategyReturnsContentUnchanged();
        when(documentContentService.updateDocument(any(), any(), any()))
                .thenThrow(new RuntimeException("Storage failure"));

        assertThrows(InjectElementException.class,
                () -> injectElementService.injectElements(requestFor(DOCUMENT_ID, SectionType.CITATIONS)));
    }

    // --- Helpers ---

    private void givenPackageFound(String documentRef, String packageId, String packagePath, Bill bill) {
        LeosPackage leosPackage = mock(LeosPackage.class);
        when(leosPackage.getId()).thenReturn(packageId);
        when(leosPackage.getPath()).thenReturn(packagePath);
        when(packageService.findPackageByDocumentRef(eq(documentRef), eq(XmlDocument.class))).thenReturn(leosPackage);
        when(packageService.findDocumentsByPackageId(eq(packageId), eq(XmlDocument.class), eq(false), eq(true)))
                .thenReturn(List.of(bill));
        BillMetadata metadata = mock(BillMetadata.class);
        when(metadata.getRef()).thenReturn(documentRef);
        doReturn(Option.some(metadata)).when(bill).getMetadata();
    }

    private void givenProposalFound(String packagePath, Proposal proposal) {
        when(proposalService.findProposalByPackagePath(packagePath)).thenReturn(proposal);
        when(proposalService.populateProposalMetadataFromXml(proposal)).thenReturn(proposal);
    }

    private void givenFullyAuthorised(String documentId, String packageId, String packagePath, Bill bill, String collectionName) {
        givenPackageFound(documentId, packageId, packagePath, bill);
        givenProposalFound(packagePath, proposalWithCollection(collectionName));
        when(securityContext.hasPermission(bill, LeosPermission.CAN_UPDATE)).thenReturn(true);
        when(strategyFactory.getStrategy(Operation.CLEAN)).thenReturn(operationStrategy);
        when(bill.getCategory()).thenReturn(LeosCategory.BILL);
    }

    private void givenStrategyReturnsContentUnchanged() {
        when(operationStrategy.execute(any(byte[].class), any(SectionRequest.class), anyString(), any()))
                .thenAnswer(i -> i.getArgument(0));
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

    private Bill mockBillWithContent(byte[] contentBytes) {
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
        request.setSections(Arrays.stream(types)
                .map(type -> {
                    SectionRequest section = new SectionRequest();
                    section.setSectionType(type);
                    section.setOperation(Operation.CLEAN);
                    return section;
                })
                .toList());
        return request;
    }

    private DocumentLinesRequest requestFor(String documentId) {
        DocumentLinesRequest request = new DocumentLinesRequest();
        request.setDocumentId(documentId);
        return request;
    }
}
