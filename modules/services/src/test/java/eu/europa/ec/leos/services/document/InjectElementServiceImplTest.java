package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.services.document.operation.OperationStrategy;
import eu.europa.ec.leos.services.document.operation.OperationStrategyFactory;
import eu.europa.ec.leos.services.dto.request.*;
import eu.europa.ec.leos.services.store.WorkspaceService;
import io.atlassian.fugue.Option;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InjectElementServiceImplTest {

    @Mock
    private WorkspaceService workspaceService;

    @Mock
    private DocumentContentService documentContentService;

    @Mock
    private OperationStrategyFactory strategyFactory;

    @Mock
    private OperationStrategy operationStrategy;

    @InjectMocks
    private InjectElementServiceImpl injectElementService;

    /**
     * Tests the CLEAN operation for the CITATIONS section.
     * Verifies that when a CLEAN operation is requested for citations,
     * the service processes the request and updates the document accordingly.
     * The CLEAN operation removes all existing citation elements from the citations section.
     */
    @Test
    public void testCleanCitationsSection() throws Exception {
        String xmlContent = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\">" +
                "<bill><preamble><citations>" +
                "<citation xml:id=\"cit_1\"><p>Citation 1</p></citation>" +
                "<citation xml:id=\"cit_2\"><p>Citation 2</p></citation>" +
                "</citations></preamble></bill></akomaNtoso>";

        XmlDocument mockDocument = mock(XmlDocument.class);
        Content mockContent = mock(Content.class);
        Content.Source mockSource = mock(Content.Source.class);
        
        when(mockSource.getBytes()).thenReturn(xmlContent.getBytes());
        when(mockContent.getSource()).thenReturn(mockSource);
        when(mockDocument.getContent()).thenReturn(Option.some(mockContent));
        when(workspaceService.findDocumentByRef("doc123", XmlDocument.class)).thenReturn(mockDocument);
        when(strategyFactory.getStrategy(Operation.CLEAN)).thenReturn(operationStrategy);

        DocumentLinesRequest request = new DocumentLinesRequest();
        request.setDocumentId("doc123");
        
        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.CITATIONS);
        section.setOperation(Operation.CLEAN);
        request.setSections(Arrays.asList(section));

        injectElementService.injectElements(request);

        verify(documentContentService, times(1)).updateDocument(eq(mockDocument), any(byte[].class), anyString());
    }

    /**
     * Tests the CLEAN operation for the RECITALS section.
     * Verifies that when a CLEAN operation is requested for recitals,
     * the service processes the request and updates the document accordingly.
     * The CLEAN operation removes all existing recital elements from the recitals section.
     */
    @Test
    public void testCleanRecitalsSection() throws Exception {
        String xmlContent = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\">" +
                "<bill><preamble><recitals>" +
                "<recital xml:id=\"rec_1\"><num>(1)</num><p>Recital 1</p></recital>" +
                "</recitals></preamble></bill></akomaNtoso>";

        XmlDocument mockDocument = mock(XmlDocument.class);
        Content mockContent = mock(Content.class);
        Content.Source mockSource = mock(Content.Source.class);
        
        when(mockSource.getBytes()).thenReturn(xmlContent.getBytes());
        when(mockContent.getSource()).thenReturn(mockSource);
        when(mockDocument.getContent()).thenReturn(Option.some(mockContent));
        when(workspaceService.findDocumentByRef("doc123", XmlDocument.class)).thenReturn(mockDocument);
        when(strategyFactory.getStrategy(Operation.CLEAN)).thenReturn(operationStrategy);

        DocumentLinesRequest request = new DocumentLinesRequest();
        request.setDocumentId("doc123");
        
        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.RECITALS);
        section.setOperation(Operation.CLEAN);
        request.setSections(Arrays.asList(section));

        injectElementService.injectElements(request);

        verify(documentContentService, times(1)).updateDocument(eq(mockDocument), any(byte[].class), anyString());
    }

    /**
     * Tests the CLEAN operation for the ENACTING_TERMS section.
     * Verifies that when a CLEAN operation is requested for enacting terms,
     * the service processes the request and updates the document accordingly.
     * The CLEAN operation removes all existing article elements from the body section.
     */
    @Test
    public void testCleanEnactingTermsSection() throws Exception {
        String xmlContent = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\">" +
                "<bill><body>" +
                "<article xml:id=\"art_1\"><num>Article 1</num><heading>Title</heading></article>" +
                "</body></bill></akomaNtoso>";

        XmlDocument mockDocument = mock(XmlDocument.class);
        Content mockContent = mock(Content.class);
        Content.Source mockSource = mock(Content.Source.class);
        
        when(mockSource.getBytes()).thenReturn(xmlContent.getBytes());
        when(mockContent.getSource()).thenReturn(mockSource);
        when(mockDocument.getContent()).thenReturn(Option.some(mockContent));
        when(workspaceService.findDocumentByRef("doc123", XmlDocument.class)).thenReturn(mockDocument);
        when(strategyFactory.getStrategy(Operation.CLEAN)).thenReturn(operationStrategy);

        DocumentLinesRequest request = new DocumentLinesRequest();
        request.setDocumentId("doc123");
        
        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.ENACTING_TERMS);
        section.setOperation(Operation.CLEAN);
        request.setSections(Arrays.asList(section));

        injectElementService.injectElements(request);

        verify(documentContentService, times(1)).updateDocument(eq(mockDocument), any(byte[].class), anyString());
    }

    /**
     * Tests the CLEAN operation for multiple sections simultaneously.
     * Verifies that the service can handle cleaning multiple sections (CITATIONS and RECITALS)
     * in a single request. All elements from both sections should be removed.
     */
    @Test
    public void testCleanMultipleSections() throws Exception {
        String xmlContent = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\">" +
                "<bill><preamble>" +
                "<citations><citation xml:id=\"cit_1\"><p>Citation</p></citation></citations>" +
                "<recitals><recital xml:id=\"rec_1\"><num>(1)</num><p>Recital</p></recital></recitals>" +
                "</preamble><body><article xml:id=\"art_1\"><num>Article 1</num></article></body></bill></akomaNtoso>";

        XmlDocument mockDocument = mock(XmlDocument.class);
        Content mockContent = mock(Content.class);
        Content.Source mockSource = mock(Content.Source.class);
        
        when(mockSource.getBytes()).thenReturn(xmlContent.getBytes());
        when(mockContent.getSource()).thenReturn(mockSource);
        when(mockDocument.getContent()).thenReturn(Option.some(mockContent));
        when(workspaceService.findDocumentByRef("doc123", XmlDocument.class)).thenReturn(mockDocument);
        when(strategyFactory.getStrategy(Operation.CLEAN)).thenReturn(operationStrategy);

        DocumentLinesRequest request = new DocumentLinesRequest();
        request.setDocumentId("doc123");
        
        SectionRequest citationsSection = new SectionRequest();
        citationsSection.setSectionType(SectionType.CITATIONS);
        citationsSection.setOperation(Operation.CLEAN);
        
        SectionRequest recitalsSection = new SectionRequest();
        recitalsSection.setSectionType(SectionType.RECITALS);
        recitalsSection.setOperation(Operation.CLEAN);
        
        request.setSections(Arrays.asList(citationsSection, recitalsSection));

        injectElementService.injectElements(request);

        verify(documentContentService, times(1)).updateDocument(eq(mockDocument), any(byte[].class), anyString());
    }

    /**
     * Tests error handling when an invalid document ID is provided.
     * Verifies that the service throws a RuntimeException when attempting to
     * inject elements into a non-existent document.
     */
    @Test
    public void testInjectElementsWithInvalidDocumentId() {
        when(workspaceService.findDocumentByRef("invalid", XmlDocument.class))
                .thenThrow(new RuntimeException("Document not found"));

        DocumentLinesRequest request = new DocumentLinesRequest();
        request.setDocumentId("invalid");
        
        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.CITATIONS);
        section.setOperation(Operation.CLEAN);
        request.setSections(Arrays.asList(section));

        assertThrows(RuntimeException.class, () -> injectElementService.injectElements(request));
    }
}
