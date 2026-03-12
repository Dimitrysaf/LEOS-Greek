package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.services.document.operation.OperationStrategy;
import eu.europa.ec.leos.services.document.operation.OperationStrategyFactory;
import eu.europa.ec.leos.services.dto.request.DocumentLinesRequest;
import eu.europa.ec.leos.services.dto.request.Operation;
import eu.europa.ec.leos.services.dto.request.SectionRequest;
import eu.europa.ec.leos.services.dto.request.SectionType;
import eu.europa.ec.leos.services.store.WorkspaceService;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import io.atlassian.fugue.Option;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import jakarta.inject.Provider;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.mockito.ArgumentMatchers.contains;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InjectElementServiceImplTest {

    @Mock private WorkspaceService workspaceService;
    @Mock private DocumentContentService documentContentService;
    @Mock private OperationStrategyFactory strategyFactory;
    @Mock private OperationStrategy operationStrategy;
    @Mock private Provider<StructureContext> structureContextProvider;
    @Mock private StructureContext structureContext;
    @Mock private DocumentLanguageContext documentLanguageContext;
    @Mock private SecurityContext securityContext;
    @InjectMocks private InjectElementServiceImpl injectElementService;

    private XmlDocument mockDocumentWithContent(String xmlContent) {
        XmlDocument mockDocument = mock(XmlDocument.class);
        Content mockContent = mock(Content.class);
        Content.Source mockSource = mock(Content.Source.class);
        when(mockSource.getBytes()).thenReturn(xmlContent.getBytes(StandardCharsets.UTF_8));
        when(mockContent.getSource()).thenReturn(mockSource);
        when(mockDocument.getContent()).thenReturn(Option.some(mockContent));
        LeosMetadata mockMetadata = mock(LeosMetadata.class);
        when(mockMetadata.getDocTemplate()).thenReturn("BL-023");
        when(mockMetadata.getDocumentCollectionName()).thenReturn("ANY");
        when(mockMetadata.getLanguage()).thenReturn("EN");
        doReturn(Option.some(mockMetadata)).when(mockDocument).getMetadata();
        return mockDocument;
    }

    private SectionRequest sectionRequest(SectionType type) {
        SectionRequest section = new SectionRequest();
        section.setSectionType(type);
        section.setOperation(Operation.CLEAN);
        return section;
    }

    private XmlDocument setupCitationsRequest() {
        String xmlContent = "<akomaNtoso><bill><preamble><citations></citations></preamble></bill></akomaNtoso>";
        XmlDocument mockDocument = mockDocumentWithContent(xmlContent);
        when(workspaceService.findDocumentByRef("doc123", XmlDocument.class)).thenReturn(mockDocument);
        when(securityContext.hasPermission(mockDocument, LeosPermission.CAN_UPDATE)).thenReturn(true);
        when(strategyFactory.getStrategy(Operation.CLEAN)).thenReturn(operationStrategy);
        when(operationStrategy.execute(any(byte[].class), any(SectionRequest.class), anyString())).thenAnswer(i -> i.getArgument(0));
        when(structureContextProvider.get()).thenReturn(structureContext);
        return mockDocument;
    }

    private DocumentLinesRequest citationsRequest() {
        DocumentLinesRequest request = new DocumentLinesRequest();
        request.setDocumentId("doc123");
        request.setSections(List.of(sectionRequest(SectionType.CITATIONS)));
        return request;
    }

    @Test
    public void testCleanCitationsSection() throws Exception {
        String xmlContent = "<akomaNtoso><bill><preamble><citations>" +
                "<citation xml:id=\"cit_1\"><p>Citation 1</p></citation>" +
                "</citations></preamble></bill></akomaNtoso>";

        XmlDocument mockDocument = mockDocumentWithContent(xmlContent);
        when(workspaceService.findDocumentByRef("doc123", XmlDocument.class)).thenReturn(mockDocument);
        when(securityContext.hasPermission(mockDocument, LeosPermission.CAN_UPDATE)).thenReturn(true);
        when(strategyFactory.getStrategy(Operation.CLEAN)).thenReturn(operationStrategy);
        when(operationStrategy.execute(any(byte[].class), any(SectionRequest.class), anyString())).thenAnswer(i -> i.getArgument(0));
        when(structureContextProvider.get()).thenReturn(structureContext);

        DocumentLinesRequest request = new DocumentLinesRequest();
        request.setDocumentId("doc123");
        request.setSections(List.of(sectionRequest(SectionType.CITATIONS)));

        injectElementService.injectElements(request);

        verify(operationStrategy).execute(any(byte[].class), any(SectionRequest.class), anyString());
        verify(documentContentService).updateDocument(eq(mockDocument), argThat(bytes -> {
            String xml = new String(bytes, StandardCharsets.UTF_8);
            return xml.contains("<citations");
        }), anyString());
    }

    @Test
    public void testCleanMultipleSections() throws Exception {
        String xmlContent = "<akomaNtoso><bill><preamble>" +
                "<citations><citation xml:id=\"cit_1\"><p>Citation</p></citation></citations>" +
                "<recitals><recital xml:id=\"rec_1\"><p>Recital</p></recital></recitals>" +
                "</preamble></bill></akomaNtoso>";

        XmlDocument mockDocument = mockDocumentWithContent(xmlContent);
        when(workspaceService.findDocumentByRef("doc123", XmlDocument.class)).thenReturn(mockDocument);
        when(securityContext.hasPermission(mockDocument, LeosPermission.CAN_UPDATE)).thenReturn(true);
        when(strategyFactory.getStrategy(Operation.CLEAN)).thenReturn(operationStrategy);
        when(operationStrategy.execute(any(byte[].class), any(SectionRequest.class), anyString())).thenAnswer(i -> i.getArgument(0));
        when(structureContextProvider.get()).thenReturn(structureContext);

        DocumentLinesRequest request = new DocumentLinesRequest();
        request.setDocumentId("doc123");
        request.setSections(List.of(sectionRequest(SectionType.CITATIONS), sectionRequest(SectionType.RECITALS)));

        injectElementService.injectElements(request);

        verify(operationStrategy, times(2)).execute(any(byte[].class), any(SectionRequest.class), anyString());
        verify(documentContentService).updateDocument(eq(mockDocument), argThat(bytes -> {
            String xml = new String(bytes, StandardCharsets.UTF_8);
            return xml.contains("<citations") && xml.contains("<recitals");
        }), anyString());
    }

    @Test
    public void testInjectElementsThrowsSecurityExceptionWhenNoPermission() {
        XmlDocument mockDocument = mock(XmlDocument.class);
        when(workspaceService.findDocumentByRef("doc123", XmlDocument.class)).thenReturn(mockDocument);
        when(securityContext.hasPermission(mockDocument, LeosPermission.CAN_UPDATE)).thenReturn(false);

        DocumentLinesRequest request = new DocumentLinesRequest();
        request.setDocumentId("doc123");
        request.setSections(List.of(sectionRequest(SectionType.CITATIONS)));

        assertThrows(SecurityException.class, () -> injectElementService.injectElements(request));
    }

    @Test
    public void testInjectElementsThrowsWhenSectionsNull() {
        DocumentLinesRequest request = new DocumentLinesRequest();
        request.setDocumentId("doc123");
        request.setSections(null);
        assertThrows(IllegalArgumentException.class, () -> injectElementService.injectElements(request));
    }

    @Test
    public void testInjectElementsThrowsWhenSectionsEmpty() {
        DocumentLinesRequest request = new DocumentLinesRequest();
        request.setDocumentId("doc123");
        request.setSections(List.of());
        assertThrows(IllegalArgumentException.class, () -> injectElementService.injectElements(request));
    }

    @Test
    public void testDocumentCollectionNamePassedToStrategy() throws Exception {
        setupCitationsRequest();
        injectElementService.injectElements(citationsRequest());
        verify(operationStrategy).execute(any(byte[].class), any(SectionRequest.class), eq("ANY"));
    }

    @Test
    public void testStructureContextAndLanguageContextInitialised() throws Exception {
        setupCitationsRequest();
        injectElementService.injectElements(citationsRequest());
        verify(structureContext).useDocumentTemplate("BL-023");
        verify(documentLanguageContext).setDocumentLanguage("EN");
    }

    @Test
    public void testCommitMessageContainsOperation() throws Exception {
        setupCitationsRequest();
        injectElementService.injectElements(citationsRequest());
        verify(documentContentService).updateDocument(any(), any(), contains("CLEAN"));
    }

    @Test
    public void testInjectElementsWithInvalidDocumentId() {
        when(workspaceService.findDocumentByRef("invalid", XmlDocument.class))
                .thenThrow(new IllegalArgumentException("Document not found"));

        DocumentLinesRequest request = new DocumentLinesRequest();
        request.setDocumentId("invalid");
        request.setSections(List.of(sectionRequest(SectionType.CITATIONS)));

        assertThrows(IllegalArgumentException.class, () -> injectElementService.injectElements(request));
    }
}
