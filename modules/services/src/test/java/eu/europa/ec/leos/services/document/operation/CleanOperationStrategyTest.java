package eu.europa.ec.leos.services.document.operation;

import eu.europa.ec.leos.services.dto.request.AknType;
import eu.europa.ec.leos.services.dto.request.LineItem;
import eu.europa.ec.leos.services.dto.request.Operation;
import eu.europa.ec.leos.services.dto.request.SectionRequest;
import eu.europa.ec.leos.services.dto.request.SectionType;
import eu.europa.ec.leos.services.numbering.NumberService;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.vo.structure.TocItem;
import jakarta.inject.Provider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CleanOperationStrategyTest {

    @Mock private ElementInjectionHelper injectionHelper;
    @Mock private XmlContentProcessor xmlContentProcessor;
    @Mock private NumberService numberService;
    @Mock private SectionContentValidator sectionContentValidator;
    @Mock private Provider<StructureContext> structureContextProvider;
    @Mock private StructureContext structureContext;
    @Mock private DocumentLanguageContext documentLanguageContext;
    @InjectMocks private CleanOperationStrategy strategy;

    private static final String CITATIONS_XML =
            "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\" xmlns:leos=\"urn:eu:europa:ec:leos\">" +
            "<bill><preamble><citations><citation><p>Old</p></citation></citations></preamble></bill></akomaNtoso>";

    private byte[] xmlBytes() { return CITATIONS_XML.getBytes(StandardCharsets.UTF_8); }

    @Test
    public void testValidationFailurePropagatesAsIllegalArgumentException() {
        doThrow(new IllegalArgumentException("Invalid element type"))
                .when(sectionContentValidator).validate(any(), any(), any());

        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.CITATIONS);
        section.setOperation(Operation.CLEAN);
        section.setItems(List.of());

        assertThrows(IllegalArgumentException.class, () -> strategy.execute(xmlBytes(), section, "ANY"));
    }

    @Test
    public void testValidateCalledWithDocumentCollectionName() throws Exception {
        when(xmlContentProcessor.doXMLPostProcessing(any())).thenAnswer(i -> i.getArgument(0));

        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.CITATIONS);
        section.setOperation(Operation.CLEAN);
        section.setItems(List.of());

        strategy.execute(xmlBytes(), section, XmlHelper.ACT_AUTO_COM);

        verify(sectionContentValidator).validate(SectionType.CITATIONS, List.of(), XmlHelper.ACT_AUTO_COM);
    }

    @Test
    public void testCleanCitationsRemovesChildrenAndDelegatesToHelper() throws Exception {
        when(xmlContentProcessor.doXMLPostProcessing(any())).thenAnswer(i -> i.getArgument(0));

        List<LineItem> items = List.of(new LineItem());
        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.CITATIONS);
        section.setOperation(Operation.CLEAN);
        section.setItems(items);

        strategy.execute(xmlBytes(), section, "ANY");

        verify(injectionHelper).insertCitations(any(), eq(items));
        verify(xmlContentProcessor).doXMLPostProcessing(any());
    }

    @Test
    public void testCleanRecitalsRemovesChildrenWithoutCallingHelper() throws Exception {
        String recitalsXml = CITATIONS_XML.replace("citations", "recitals").replace("citation", "recital");
        when(xmlContentProcessor.doXMLPostProcessing(any())).thenAnswer(i -> i.getArgument(0));

        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.RECITALS);
        section.setOperation(Operation.CLEAN);

        strategy.execute(recitalsXml.getBytes(StandardCharsets.UTF_8), section, "ANY");

        verify(injectionHelper).insertRecitals(any(), any());
        verify(xmlContentProcessor).doXMLPostProcessing(any());
    }

    @Test
    public void testCleanSectionNotFoundReturnsOriginalContent() throws Exception {
        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.RECITALS);
        section.setOperation(Operation.CLEAN);

        byte[] input = xmlBytes();
        byte[] result = strategy.execute(input, section, "ANY");

        assertSame(input, result);
        verifyNoInteractions(injectionHelper);
        verifyNoInteractions(xmlContentProcessor);
    }

    @Test
    public void testCleanEnactingTermsRemovesArticlesPreservesClauseAndDelegatesToHelper() throws Exception {
        String bodyXml =
                "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\" xmlns:leos=\"urn:eu:europa:ec:leos\">" +
                "<bill><body>" +
                "<article><num>Article 1</num><paragraph><num>1.</num><content><p>Old text.</p></content></paragraph></article>" +
                "<clause><content><p>Binding clause.</p></content></clause>" +
                "</body></bill></akomaNtoso>";
        when(xmlContentProcessor.doXMLPostProcessing(any())).thenAnswer(i -> i.getArgument(0));
        when(numberService.renumberArticles(any(), eq(true))).thenAnswer(i -> i.getArgument(0));
        when(structureContextProvider.get()).thenReturn(structureContext);
        when(structureContext.getTocItems()).thenReturn(List.of());
        when(documentLanguageContext.getDocumentLanguage()).thenReturn("EN");
        when(numberService.renumberHigherSubDivisions(any(), any(), any(), any())).thenAnswer(i -> i.getArgument(0));

        List<LineItem> items = List.of(new LineItem());
        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.ENACTING_TERMS);
        section.setOperation(Operation.CLEAN);
        section.setItems(items);

        strategy.execute(bodyXml.getBytes(StandardCharsets.UTF_8), section, "ANY");

        verify(injectionHelper).insertEnactingTerms(any(), eq(items));
        verify(numberService).renumberArticles(any(), eq(true));
        verify(numberService, times(4)).renumberHigherSubDivisions(any(), eq("EN"), any(), any());
        verify(xmlContentProcessor).doXMLPostProcessing(any());
    }

    @Test
    public void testCleanCitationsActuallyClearsExistingChildren() throws Exception {
        when(xmlContentProcessor.doXMLPostProcessing(any())).thenAnswer(i -> i.getArgument(0));

        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.CITATIONS);
        section.setOperation(Operation.CLEAN);
        section.setItems(List.of());

        byte[] result = strategy.execute(xmlBytes(), section, "ANY");

        String xml = new String(result, java.nio.charset.StandardCharsets.UTF_8);
        assertFalse(xml.contains("<p>Old</p>"), "Existing citation content should be removed");
    }

    @Test
    public void testCleanRecitalsPreservesIntroElement() throws Exception {
        String recitalsXml =
                "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\" xmlns:leos=\"urn:eu:europa:ec:leos\">" +
                "<bill><preamble><recitals>" +
                "<intro><p>Intro text</p></intro>" +
                "<recital><num>(1)</num><p>Old recital</p></recital>" +
                "</recitals></preamble></bill></akomaNtoso>";
        when(xmlContentProcessor.doXMLPostProcessing(any())).thenAnswer(i -> i.getArgument(0));
        when(numberService.renumberRecitals(any())).thenAnswer(i -> i.getArgument(0));

        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.RECITALS);
        section.setOperation(Operation.CLEAN);
        section.setItems(List.of());

        byte[] result = strategy.execute(recitalsXml.getBytes(java.nio.charset.StandardCharsets.UTF_8), section, "ANY");

        String xml = new String(result, java.nio.charset.StandardCharsets.UTF_8);
        assertTrue(xml.contains("<intro>"), "intro element must be preserved");
        assertFalse(xml.contains("Old recital"), "Old recital must be removed");
    }

    @Test
    public void testCleanEnactingTermsPreservesClause() throws Exception {
        String bodyXml =
                "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\" xmlns:leos=\"urn:eu:europa:ec:leos\">" +
                "<bill><body>" +
                "<article><num>#</num><paragraph><content><p>Old</p></content></paragraph></article>" +
                "<clause><content><p>Binding clause.</p></content></clause>" +
                "</body></bill></akomaNtoso>";
        when(xmlContentProcessor.doXMLPostProcessing(any())).thenAnswer(i -> i.getArgument(0));
        when(numberService.renumberArticles(any(), eq(true))).thenAnswer(i -> i.getArgument(0));
        when(structureContextProvider.get()).thenReturn(structureContext);
        when(structureContext.getTocItems()).thenReturn(List.of());
        when(documentLanguageContext.getDocumentLanguage()).thenReturn("EN");
        when(numberService.renumberHigherSubDivisions(any(), any(), any(), any())).thenAnswer(i -> i.getArgument(0));

        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.ENACTING_TERMS);
        section.setOperation(Operation.CLEAN);
        section.setItems(List.of());

        byte[] result = strategy.execute(bodyXml.getBytes(java.nio.charset.StandardCharsets.UTF_8), section, "ANY");

        String xml = new String(result, java.nio.charset.StandardCharsets.UTF_8);
        assertTrue(xml.contains("Binding clause."), "clause must be preserved");
        assertFalse(xml.contains("Old"), "article content must be removed");
    }

    @Test
    public void testRecitalsCallsRenumberRecitals() throws Exception {
        String recitalsXml = CITATIONS_XML.replace("citations", "recitals").replace("citation", "recital");
        when(xmlContentProcessor.doXMLPostProcessing(any())).thenAnswer(i -> i.getArgument(0));
        when(numberService.renumberRecitals(any())).thenAnswer(i -> i.getArgument(0));

        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.RECITALS);
        section.setOperation(Operation.CLEAN);
        section.setItems(List.of());

        strategy.execute(recitalsXml.getBytes(java.nio.charset.StandardCharsets.UTF_8), section, "ANY");

        verify(numberService).renumberRecitals(any());
        verify(numberService, never()).renumberArticles(any(), anyBoolean());
    }

    @Test
    public void testCitationsDoesNotCallRenumber() throws Exception {
        when(xmlContentProcessor.doXMLPostProcessing(any())).thenAnswer(i -> i.getArgument(0));

        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.CITATIONS);
        section.setOperation(Operation.CLEAN);
        section.setItems(List.of());

        strategy.execute(xmlBytes(), section, "ANY");

        verify(numberService, never()).renumberRecitals(any());
        verify(numberService, never()).renumberArticles(any(), anyBoolean());
    }

    @Test
    public void testEnactingTermsCallsRenumberHigherSubDivisionsForAllFourElements() throws Exception {
        String bodyXml =
                "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\" xmlns:leos=\"urn:eu:europa:ec:leos\">" +
                "<bill><body><clause><content><p>Clause.</p></content></clause></body></bill></akomaNtoso>";
        when(xmlContentProcessor.doXMLPostProcessing(any())).thenAnswer(i -> i.getArgument(0));
        when(numberService.renumberArticles(any(), eq(true))).thenAnswer(i -> i.getArgument(0));
        when(structureContextProvider.get()).thenReturn(structureContext);
        when(structureContext.getTocItems()).thenReturn(List.of());
        when(documentLanguageContext.getDocumentLanguage()).thenReturn("EN");
        when(numberService.renumberHigherSubDivisions(any(), any(), any(), any())).thenAnswer(i -> i.getArgument(0));

        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.ENACTING_TERMS);
        section.setOperation(Operation.CLEAN);
        section.setItems(List.of());

        strategy.execute(bodyXml.getBytes(StandardCharsets.UTF_8), section, "ANY");

        verify(numberService).renumberHigherSubDivisions(any(), eq("EN"), eq(XmlHelper.PART),    any());
        verify(numberService).renumberHigherSubDivisions(any(), eq("EN"), eq(XmlHelper.TITLE),   any());
        verify(numberService).renumberHigherSubDivisions(any(), eq("EN"), eq(XmlHelper.CHAPTER), any());
        verify(numberService).renumberHigherSubDivisions(any(), eq("EN"), eq(XmlHelper.SECTION), any());
    }

    @Test
    public void testEnactingTermsDoesNotCallRenumberHigherSubDivisionsForRecitals() throws Exception {
        String recitalsXml = CITATIONS_XML.replace("citations", "recitals").replace("citation", "recital");
        when(xmlContentProcessor.doXMLPostProcessing(any())).thenAnswer(i -> i.getArgument(0));
        when(numberService.renumberRecitals(any())).thenAnswer(i -> i.getArgument(0));

        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.RECITALS);
        section.setOperation(Operation.CLEAN);
        section.setItems(List.of());

        strategy.execute(recitalsXml.getBytes(StandardCharsets.UTF_8), section, "ANY");

        verify(numberService, never()).renumberHigherSubDivisions(any(), any(), any(), any());
    }
}
