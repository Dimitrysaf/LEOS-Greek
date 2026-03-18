package eu.europa.ec.leos.services.document.operation;

import eu.europa.ec.leos.domain.repository.LeosCategory;
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
import jakarta.inject.Provider;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.TransformerFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CleanOperationStrategyTest {

    @Mock private ElementInjectionHelper injectionHelper;
    @Mock private XmlContentProcessor xmlContentProcessor;
    @Mock private NumberService numberService;
    @Mock private SectionContentValidator sectionContentValidator;
    @Mock private Provider<StructureContext> structureContextProvider;
    @Mock private StructureContext structureContext;
    @Mock private DocumentLanguageContext documentLanguageContext;
    private CleanOperationStrategy strategy;

    @BeforeEach
    void setUp() throws Exception {
        XmlFactoryConfig config = new XmlFactoryConfig();
        strategy = new CleanOperationStrategy(
                injectionHelper, xmlContentProcessor, numberService, sectionContentValidator,
                structureContextProvider, documentLanguageContext,
                config.documentBuilderFactory(), config.transformerFactory());
    }

    private static final String CITATIONS_XML =
            "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\" xmlns:leos=\"urn:eu:europa:ec:leos\">" +
            "<bill><preamble><citations><citation><p>Old</p></citation></citations></preamble></bill></akomaNtoso>";

    private byte[] xmlBytes() { return CITATIONS_XML.getBytes(StandardCharsets.UTF_8); }

    @Test
    public void testValidationFailurePropagatesAsIllegalArgumentException() {
        doThrow(new IllegalArgumentException("Invalid element type"))
                .when(sectionContentValidator).validate(any(), any(), any(), any());

        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.CITATIONS);
        section.setOperation(Operation.CLEAN);
        section.setItems(List.of());

        assertThrows(IllegalArgumentException.class, () -> strategy.execute(xmlBytes(), section, "ANY", LeosCategory.BILL));
    }

    @Test
    public void testValidateCalledWithDocumentCollectionNameAndCategory() throws Exception {
        when(xmlContentProcessor.doXMLPostProcessing(any())).thenAnswer(i -> i.getArgument(0));

        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.CITATIONS);
        section.setOperation(Operation.CLEAN);
        section.setItems(List.of());

        strategy.execute(xmlBytes(), section, XmlHelper.ACT_AUTO_COM, LeosCategory.BILL);

        verify(sectionContentValidator).validate(SectionType.CITATIONS, List.of(), XmlHelper.ACT_AUTO_COM, LeosCategory.BILL);
    }

    @Test
    public void testCleanCitationsRemovesExistingChildrenFromOutput() throws Exception {
        when(xmlContentProcessor.doXMLPostProcessing(any())).thenAnswer(i -> i.getArgument(0));

        List<LineItem> items = List.of(new LineItem());
        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.CITATIONS);
        section.setOperation(Operation.CLEAN);
        section.setItems(items);

        byte[] result = strategy.execute(xmlBytes(), section, "ANY", LeosCategory.BILL);

        String xml = new String(result, StandardCharsets.UTF_8);
        assertFalse(xml.contains("<p>Old</p>"), "Existing citation content must be removed from output");
        assertTrue(xml.contains("<citations"), "citations element must still be present");
        verify(injectionHelper).insertCitations(any(), eq(items));
        verify(xmlContentProcessor).doXMLPostProcessing(any());
    }

    @Test
    public void testCleanRecitalsRemovesRecitalElementsPreservesIntroInOutput() throws Exception {
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

        byte[] result = strategy.execute(recitalsXml.getBytes(StandardCharsets.UTF_8), section, "ANY", LeosCategory.BILL);

        String xml = new String(result, StandardCharsets.UTF_8);
        assertTrue(xml.contains("<intro>"), "intro element must be preserved in output");
        assertFalse(xml.contains("Old recital"), "recital content must be removed from output");
        verify(injectionHelper).insertRecitals(any(), any());
    }

    @Test
    public void testCleanSectionNotFoundReturnsOriginalContent() throws Exception {
        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.RECITALS);
        section.setOperation(Operation.CLEAN);

        byte[] input = xmlBytes();
        byte[] result = strategy.execute(input, section, "ANY", LeosCategory.BILL);

        assertSame(input, result);
        verifyNoInteractions(injectionHelper);
        verifyNoInteractions(xmlContentProcessor);
    }

    @Test
    public void testCleanEnactingTermsRemovesArticlesPreservesClauseInOutput() throws Exception {
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

        byte[] result = strategy.execute(bodyXml.getBytes(StandardCharsets.UTF_8), section, "ANY", LeosCategory.BILL);

        String xml = new String(result, StandardCharsets.UTF_8);
        assertFalse(xml.contains("Old text."), "article content must be removed from output");
        assertTrue(xml.contains("Binding clause."), "clause must be preserved in output");
        verify(injectionHelper).insertEnactingTerms(any(), eq(items));
        verify(numberService).renumberArticles(any(), eq(true));
        verify(numberService, times(4)).renumberHigherSubDivisions(any(), eq("EN"), any(), any());
    }

    @Test
    public void testRecitalsOutputContainsRenumberedContentAndNoOldRecitals() throws Exception {
        String recitalsXml = "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\" xmlns:leos=\"urn:eu:europa:ec:leos\">" +
                "<bill><preamble><recitals><recital><num>(1)</num><p>Old</p></recital></recitals></preamble></bill></akomaNtoso>";
        byte[] renumbered = "<renumbered/>".getBytes(StandardCharsets.UTF_8);
        when(xmlContentProcessor.doXMLPostProcessing(any())).thenAnswer(i -> i.getArgument(0));
        when(numberService.renumberRecitals(any())).thenReturn(renumbered);

        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.RECITALS);
        section.setOperation(Operation.CLEAN);
        section.setItems(List.of());

        byte[] result = strategy.execute(recitalsXml.getBytes(StandardCharsets.UTF_8), section, "ANY", LeosCategory.BILL);

        assertArrayEquals(renumbered, result, "output must be the result of renumberRecitals");
        verify(numberService).renumberRecitals(any());
        verify(numberService, never()).renumberArticles(any(), anyBoolean());
    }

    @Test
    public void testCitationsOutputIsPassedThroughPostProcessing() throws Exception {
        byte[] postProcessed = "<postprocessed/>".getBytes(StandardCharsets.UTF_8);
        when(xmlContentProcessor.doXMLPostProcessing(any())).thenReturn(postProcessed);

        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.CITATIONS);
        section.setOperation(Operation.CLEAN);
        section.setItems(List.of());

        byte[] result = strategy.execute(xmlBytes(), section, "ANY", LeosCategory.BILL);

        assertArrayEquals(postProcessed, result, "output must be the result of doXMLPostProcessing");
        verify(numberService, never()).renumberRecitals(any());
        verify(numberService, never()).renumberArticles(any(), anyBoolean());
    }

    @Test
    public void testEnactingTermsRenumberHigherSubDivisionsCalledForAllFourElementsInOrder() throws Exception {
        String bodyXml =
                "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\" xmlns:leos=\"urn:eu:europa:ec:leos\">" +
                "<bill><body><clause><content><p>Clause.</p></content></clause></body></bill></akomaNtoso>";
        when(xmlContentProcessor.doXMLPostProcessing(any())).thenAnswer(i -> i.getArgument(0));
        when(numberService.renumberArticles(any(), eq(true))).thenAnswer(i -> i.getArgument(0));
        when(structureContextProvider.get()).thenReturn(structureContext);
        when(structureContext.getTocItems()).thenReturn(List.of());
        when(documentLanguageContext.getDocumentLanguage()).thenReturn("EN");
        when(numberService.renumberHigherSubDivisions(any(), eq("EN"), eq(XmlHelper.PART),    any())).thenAnswer(i -> ("part-done:"   + new String((byte[]) i.getArgument(0), StandardCharsets.UTF_8)).getBytes(StandardCharsets.UTF_8));
        when(numberService.renumberHigherSubDivisions(any(), eq("EN"), eq(XmlHelper.TITLE),   any())).thenAnswer(i -> ("title-done:"  + new String((byte[]) i.getArgument(0), StandardCharsets.UTF_8)).getBytes(StandardCharsets.UTF_8));
        when(numberService.renumberHigherSubDivisions(any(), eq("EN"), eq(XmlHelper.CHAPTER), any())).thenAnswer(i -> ("chapter-done:"+ new String((byte[]) i.getArgument(0), StandardCharsets.UTF_8)).getBytes(StandardCharsets.UTF_8));
        when(numberService.renumberHigherSubDivisions(any(), eq("EN"), eq(XmlHelper.SECTION), any())).thenAnswer(i -> ("section-done:"+ new String((byte[]) i.getArgument(0), StandardCharsets.UTF_8)).getBytes(StandardCharsets.UTF_8));

        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.ENACTING_TERMS);
        section.setOperation(Operation.CLEAN);
        section.setItems(List.of());

        byte[] result = strategy.execute(bodyXml.getBytes(StandardCharsets.UTF_8), section, "ANY", LeosCategory.BILL);
        String xml = new String(result, StandardCharsets.UTF_8);

        assertTrue(xml.contains("section-done:"), "output must pass through renumberHigherSubDivisions for SECTION last");
        assertTrue(xml.contains("chapter-done:"), "output must pass through renumberHigherSubDivisions for CHAPTER");
        assertTrue(xml.contains("title-done:"),   "output must pass through renumberHigherSubDivisions for TITLE");
        assertTrue(xml.contains("part-done:"),    "output must pass through renumberHigherSubDivisions for PART");
        verify(numberService).renumberHigherSubDivisions(any(), eq("EN"), eq(XmlHelper.PART),    any());
        verify(numberService).renumberHigherSubDivisions(any(), eq("EN"), eq(XmlHelper.TITLE),   any());
        verify(numberService).renumberHigherSubDivisions(any(), eq("EN"), eq(XmlHelper.CHAPTER), any());
        verify(numberService).renumberHigherSubDivisions(any(), eq("EN"), eq(XmlHelper.SECTION), any());
    }

    @Test
    public void testEnactingTermsDoesNotCallRenumberHigherSubDivisionsForRecitals() throws Exception {
        String recitalsXml = "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\" xmlns:leos=\"urn:eu:europa:ec:leos\">" +
                "<bill><preamble><recitals><recital><num>(1)</num><p>Old</p></recital></recitals></preamble></bill></akomaNtoso>";
        when(xmlContentProcessor.doXMLPostProcessing(any())).thenAnswer(i -> i.getArgument(0));
        when(numberService.renumberRecitals(any())).thenAnswer(i -> i.getArgument(0));

        SectionRequest section = new SectionRequest();
        section.setSectionType(SectionType.RECITALS);
        section.setOperation(Operation.CLEAN);
        section.setItems(List.of());

        byte[] result = strategy.execute(recitalsXml.getBytes(StandardCharsets.UTF_8), section, "ANY", LeosCategory.BILL);

        assertNotNull(result);
        verify(numberService, never()).renumberHigherSubDivisions(any(), any(), any(), any());
    }
}
