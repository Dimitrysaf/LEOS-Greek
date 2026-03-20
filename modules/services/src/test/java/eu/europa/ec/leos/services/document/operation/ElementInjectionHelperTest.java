package eu.europa.ec.leos.services.document.operation;

import eu.europa.ec.leos.services.dto.request.AknType;
import eu.europa.ec.leos.services.dto.request.LineItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayInputStream;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

import eu.europa.ec.leos.services.document.operation.builder.*;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.vo.structure.TocItem;
import eu.europa.ec.leos.services.utils.StructureConfigUtils;
import jakarta.inject.Provider;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ElementInjectionHelperTest {

    private ElementInjectionHelper helper;
    private Document citationsDoc;
    private Document recitalsDoc;
    private Document bodyDoc;

    private static final String CITATIONS_XML =
            "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\" xmlns:leos=\"urn:eu:europa:ec:leos\">" +
            "<bill><preamble><citations></citations></preamble></bill></akomaNtoso>";

    private static final String RECITALS_XML =
            "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\" xmlns:leos=\"urn:eu:europa:ec:leos\">" +
            "<bill><preamble><recitals><intro><p>Intro text</p></intro></recitals></preamble></bill></akomaNtoso>";

    private static final String BODY_XML =
            "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\" xmlns:leos=\"urn:eu:europa:ec:leos\">" +
            "<bill><body><clause><content><p>Binding clause.</p></content></clause></body></bill></akomaNtoso>";

    private static TocItem tocItemWithTemplate(eu.europa.ec.leos.vo.structure.AknTag aknTag, String template) {
        TocItem tocItem = mock(TocItem.class);
        when(tocItem.getAknTag()).thenReturn(aknTag);
        when(tocItem.getTemplate()).thenReturn(template);
        return tocItem;
    }

    @BeforeEach
    void setUp() throws Exception {
        Provider<StructureContext> structureContextProvider = mock(Provider.class);
        StructureContext structureContext = mock(StructureContext.class);
        when(structureContextProvider.get()).thenReturn(structureContext);
        List<TocItem> tocItems = List.of(
                tocItemWithTemplate(eu.europa.ec.leos.vo.structure.AknTag.PART,    "<part leos:editable=\"true\"><num>${num}</num><heading>${heading}</heading></part>"),
                tocItemWithTemplate(eu.europa.ec.leos.vo.structure.AknTag.TITLE,   "<title leos:editable=\"true\"><num>${num}</num><heading>${heading}</heading></title>"),
                tocItemWithTemplate(eu.europa.ec.leos.vo.structure.AknTag.CHAPTER, "<chapter leos:editable=\"true\"><num>${num}</num><heading>${heading}</heading></chapter>"),
                tocItemWithTemplate(eu.europa.ec.leos.vo.structure.AknTag.SECTION, "<section leos:editable=\"true\"><num>${num}</num><heading>${heading}</heading></section>")
        );
        when(structureContext.getTocItems()).thenReturn(tocItems);
        HigherDivisionBuilder higherDivisionBuilder = new HigherDivisionBuilder(structureContextProvider);
        XmlFactoryConfig config = new XmlFactoryConfig();
        helper = new ElementInjectionHelper(List.of(
                new CitationBuilder(),
                new AuthorialNoteBuilder(),
                new RecitalBuilder(),
                new RecitalsGroupBuilder(),
                new ParagraphBuilder(),
                new ListBuilder(),
                new PointBuilder(),
                new ArticleHeadingBuilder(),
                new NumberedArticleBuilder(),
                new NumberedParagraphBuilder(),
                new UnnumberedParagraphBuilder()
        ), higherDivisionBuilder, config.documentBuilderFactory());
        DocumentBuilder builder = config.documentBuilderFactory().newDocumentBuilder();
        citationsDoc = builder.parse(new ByteArrayInputStream(CITATIONS_XML.getBytes(StandardCharsets.UTF_8)));
        recitalsDoc = builder.parse(new ByteArrayInputStream(RECITALS_XML.getBytes(StandardCharsets.UTF_8)));
        bodyDoc = builder.parse(new ByteArrayInputStream(BODY_XML.getBytes(StandardCharsets.UTF_8)));
    }

    private LineItem paragraph(String content) {
        LineItem p = new LineItem();
        p.setType(AknType.PARAGRAPH);
        p.setContent(content);
        return p;
    }

    private LineItem note(String refId, int position, String content) {
        LineItem note = new LineItem();
        note.setType(AknType.AUTHORIAL_NOTE);
        note.setRefId(refId);
        note.setPosition(position);
        note.setContent(content);
        return note;
    }

    private LineItem paragraphWithNotes(String content, LineItem... notes) {
        LineItem p = new LineItem();
        p.setType(AknType.PARAGRAPH);
        p.setContent(content);
        p.setChildren(List.of(notes));
        return p;
    }

    private LineItem paragraphWithNote(String content, int position, String noteRefId, String noteContent) {
        return paragraphWithNotes(content, note(noteRefId, position, noteContent));
    }

    private LineItem citation(LineItem... children) {
        LineItem c = new LineItem();
        c.setType(AknType.CITATION);
        c.setChildren(List.of(children));
        return c;
    }

    private String serialize(Document d) throws Exception {
        StringWriter sw = new StringWriter();
        TransformerFactory tf = TransformerFactory.newInstance();
        tf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
        try { tf.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, ""); } catch (IllegalArgumentException ignored) {}
        try { tf.setAttribute(XMLConstants.ACCESS_EXTERNAL_STYLESHEET, ""); } catch (IllegalArgumentException ignored) {}
        Transformer t = tf.newTransformer();
        t.transform(new DOMSource(d), new StreamResult(sw));
        return sw.toString();
    }

    @Test
    void testSimpleCitationWithoutAuthorialNote() throws Exception {
        helper.insertCitations(citationsDoc, List.of(
                citation(paragraph("Lorem ipsum dolor sit amet,"))
        ));

        NodeList citations = citationsDoc.getElementsByTagName("citation");
        assertEquals(1, citations.getLength());

        String xml = serialize(citationsDoc);
        assertTrue(xml.contains("<p>Lorem ipsum dolor sit amet,</p>"));
        assertFalse(xml.contains("authorialNote"));
    }

    @Test
    void testCitationWithAuthorialNoteAtPosition() throws Exception {
        String text = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium,";
        int pos = 62;

        helper.insertCitations(citationsDoc, List.of(
                citation(paragraphWithNote(text, pos, "1", "Footnote text here."))
        ));

        String xml = serialize(citationsDoc);
        String expected = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem" +
                "<authorialNote marker=\"1\" placement=\"bottom\"><p>Footnote text here.</p></authorialNote>" +
                " accusantium,";
        assertTrue(xml.contains(expected), "Expected note spliced at position 62, got:\n" + xml);
    }

    @Test
    void testCitationWithTwoAuthorialNotesAtDifferentPositions() throws Exception {
        String text = "At vero eos et accusamus et iusto odio dignissimos ducimus,";
        // pos 47 = after "dignissimos", pos 57 = after "ducimus"
        helper.insertCitations(citationsDoc, List.of(
                citation(paragraphWithNotes(text, note("2", 47, "First footnote."), note("3", 57, "Second footnote.")))
        ));

        String xml = serialize(citationsDoc);
        assertTrue(xml.contains("<authorialNote marker=\"2\""), "Missing first note");
        assertTrue(xml.contains("<authorialNote marker=\"3\""), "Missing second note");
        // note2 must appear after note1
        assertTrue(xml.indexOf("First footnote") < xml.indexOf("Second footnote"));
    }

    @Test
    void testMultipleCitationsMixedContent() throws Exception {
        helper.insertCitations(citationsDoc, List.of(
                citation(paragraph("Simple citation text,")),
                citation(paragraphWithNote("Citation with a note at end,", 27, "1", "Footnote."))
        ));

        NodeList citations = citationsDoc.getElementsByTagName("citation");
        assertEquals(2, citations.getLength());

        String xml = serialize(citationsDoc);
        assertTrue(xml.contains("<p>Simple citation text,</p>"));
        assertTrue(xml.contains("Citation with a note at end" +
                "<authorialNote marker=\"1\" placement=\"bottom\"><p>Footnote.</p></authorialNote>" +
                ","));
    }

    // --- Recital tests ---

    @Test
    void testSimpleRecital() throws Exception {
        helper.insertRecitals(recitalsDoc, List.of(recital(paragraph("Whereas this is a simple recital."))));

        NodeList recitals = recitalsDoc.getElementsByTagName("recital");
        assertEquals(1, recitals.getLength());

        String xml = serialize(recitalsDoc);
        assertTrue(xml.contains("#"));
        assertTrue(xml.contains("<p>Whereas this is a simple recital.</p>"));
        assertTrue(xml.contains("<intro>"));
    }

    @Test
    void testRecitalWithAuthorialNote() throws Exception {
        String text = "Whereas the Committee has issued an opinion,";
        helper.insertRecitals(recitalsDoc, List.of(recital(paragraphWithNote(text, 38, "1", "OJ C 123, p. 1."))));

        String xml = serialize(recitalsDoc);
        assertTrue(xml.contains("Whereas the Committee has issued an op" +
                "<authorialNote marker=\"1\" placement=\"bottom\"><p>OJ C 123, p. 1.</p></authorialNote>" +
                "inion,"));
    }

    @Test
    void testRecitalsGroupWithHeading() throws Exception {
        helper.insertRecitals(recitalsDoc, List.of(recitalsGroup("Group Heading", recital(paragraph("Grouped recital text.")))));

        String xml = serialize(recitalsDoc);
        assertTrue(xml.contains("<heading>Group Heading</heading>"));
        assertTrue(xml.contains("<p>Grouped recital text.</p>"));
    }

    @Test
    void testRecitalsGroupWithRecitalContainingFootnote() throws Exception {
        String text = "Grouped recital with footnote,";
        helper.insertRecitals(recitalsDoc, List.of(recitalsGroup("My Group", recital(paragraphWithNote(text, 29, "1", "Footnote text.")))));

        String xml = serialize(recitalsDoc);
        assertTrue(xml.contains("<heading>My Group</heading>"));
        assertTrue(xml.contains("Grouped recital with footnote" +
                "<authorialNote marker=\"1\" placement=\"bottom\"><p>Footnote text.</p></authorialNote>,"));
    }

    @Test
    void testMixedStandaloneRecitalAndGroup() throws Exception {
        helper.insertRecitals(recitalsDoc, List.of(
                recital(paragraph("Standalone recital.")),
                recitalsGroup("Section A",
                        recital(paragraph("First grouped recital.")),
                        recital(paragraph("Second grouped recital.")))));

        String xml = serialize(recitalsDoc);
        NodeList recitalNodes = recitalsDoc.getElementsByTagName("recital");
        assertEquals(3, recitalNodes.getLength());
        assertTrue(xml.contains("<heading>Section A</heading>"));
        assertTrue(xml.contains("<p>Standalone recital.</p>"));
        assertTrue(xml.contains("<p>First grouped recital.</p>"));
        assertTrue(xml.contains("<p>Second grouped recital.</p>"));
        assertTrue(xml.contains("<intro>"));
    }

    // --- Helpers ---

    private LineItem recital(LineItem... children) {
        LineItem r = new LineItem();
        r.setType(AknType.RECITAL);
        r.setChildren(List.of(children));
        return r;
    }

    private LineItem recitalsGroup(String heading, LineItem... children) {
        LineItem g = new LineItem();
        g.setType(AknType.RECITALS);
        g.setContent(heading);
        g.setChildren(List.of(children));
        return g;
    }

    // --- Enacting terms tests ---

    @Test
    void testSimpleNumberedArticleWithNumberedParagraph() throws Exception {
        helper.insertEnactingTerms(bodyDoc, List.of(
                numberedArticle(articleHeading("Subject matter"), numberedParagraph("This Regulation establishes a framework."))
        ));

        String xml = serialize(bodyDoc);
        NodeList articles = bodyDoc.getElementsByTagName("article");
        assertEquals(1, articles.getLength());
        assertTrue(xml.contains("leos:autonumbering=\"true\""));
        assertTrue(xml.contains("<num leos:editable=\"false\">#</num>"));
        assertTrue(xml.contains("<heading>Subject matter</heading>"));
        assertTrue(xml.contains("<paragraph>"));
        assertTrue(xml.contains("<num>#</num>"));
        assertTrue(xml.contains("<content><p>This Regulation establishes a framework.</p></content>"));
        // clause must be preserved
        assertTrue(xml.contains("<clause>"));
    }

    @Test
    void testArticleWithUnnumberedParagraph() throws Exception {
        helper.insertEnactingTerms(bodyDoc, List.of(
                numberedArticle(articleHeading("Entry into force"), unnumberedParagraph("This Regulation shall enter into force on the twentieth day."))
        ));

        String xml = serialize(bodyDoc);
        assertTrue(xml.contains("<paragraph>"));
        assertFalse(xml.contains("<num>#</num>"));
        assertTrue(xml.contains("<content><p>This Regulation shall enter into force on the twentieth day.</p></content>"));
    }

    @Test
    void testArticleWithNumberedParagraphAndFootnote() throws Exception {
        String text = "This Regulation establishes a framework for the submission of reports,";
        helper.insertEnactingTerms(bodyDoc, List.of(
                numberedArticle(articleHeading("Scope"), numberedParagraphWithNote(text, 58, "1", "OJ L 123, 1.1.2024, p. 1."))
        ));

        String xml = serialize(bodyDoc);
        assertTrue(xml.contains("This Regulation establishes a framework for the submission" +
                "<authorialNote marker=\"1\" placement=\"bottom\"><p>OJ L 123, 1.1.2024, p. 1.</p></authorialNote>" +
                " of reports,"));
    }

    @Test
    void testArticleWithMixedNumberedAndUnnumberedParagraphs() throws Exception {
        helper.insertEnactingTerms(bodyDoc, List.of(
                numberedArticle(
                        articleHeading("Definitions"),
                        unnumberedParagraph("For the purposes of this Regulation:"),
                        numberedParagraph("'competent authority' means the national authority."),
                        numberedParagraph("'reporting entity' means any legal or natural person.")
                )
        ));

        String xml = serialize(bodyDoc);
        NodeList paragraphs = bodyDoc.getElementsByTagName("paragraph");
        assertEquals(3, paragraphs.getLength());
        assertTrue(xml.contains("<content><p>For the purposes of this Regulation:</p></content>"));
        assertTrue(xml.contains("<content><p>'competent authority' means the national authority.</p></content>"));
    }

    @Test
    void testMultipleArticles() throws Exception {
        helper.insertEnactingTerms(bodyDoc, List.of(
                numberedArticle(articleHeading("Subject matter"), numberedParagraph("First article paragraph.")),
                numberedArticle(articleHeading("Entry into force"), unnumberedParagraph("This Regulation shall enter into force."))
        ));

        String xml = serialize(bodyDoc);
        NodeList articles = bodyDoc.getElementsByTagName("article");
        assertEquals(2, articles.getLength());
        assertTrue(xml.contains("<heading>Subject matter</heading>"));
        assertTrue(xml.contains("<heading>Entry into force</heading>"));
        // clause preserved
        assertTrue(xml.contains("<clause>"));
    }

    @Test
    void testArticleWithoutHeadingBuildsValidXmlWhenCalledDirectly() throws Exception {
        // The validator rejects headingless articles before they reach the helper.
        // This test verifies the helper itself does not break when called without one.
        helper.insertEnactingTerms(bodyDoc, List.of(
                numberedArticle(numberedParagraph("Paragraph without heading."))
        ));
        String xml = serialize(bodyDoc);
        assertFalse(xml.contains("<heading>"));
        assertTrue(xml.contains("<content><p>Paragraph without heading.</p></content>"));
    }

    @Test
    void testInsertCitationsWithEmptyListProducesNoChildren() throws Exception {
        helper.insertCitations(citationsDoc, List.of());
        NodeList citations = citationsDoc.getElementsByTagName("citation");
        assertEquals(0, citations.getLength());
    }

    @Test
    void testInsertRecitalsWithEmptyListPreservesIntro() throws Exception {
        helper.insertRecitals(recitalsDoc, List.of());
        String xml = serialize(recitalsDoc);
        assertTrue(xml.contains("<intro>"));
        assertEquals(0, recitalsDoc.getElementsByTagName("recital").getLength());
    }

    @Test
    void testXmlSpecialCharactersInContentAreEscaped() throws Exception {
        helper.insertCitations(citationsDoc, List.of(
                citation(paragraph("Text with <tags> & \"quotes\""))
        ));
        String xml = serialize(citationsDoc);
        assertTrue(xml.contains("&lt;tags&gt;"));
        assertTrue(xml.contains("&amp;"));
        assertFalse(xml.contains("<tags>"));
    }

    // --- Higher division tests ---

    @Test
    void testTitleWithHeadingAndArticle() throws Exception {
        helper.insertEnactingTerms(bodyDoc, List.of(
                title("Objectives and Scope",
                        numberedArticle(articleHeading("Subject matter"), numberedParagraph("This Regulation establishes a framework.")))
        ));

        String xml = serialize(bodyDoc);
        assertTrue(xml.contains("<title"), "title element must be present");
        assertTrue(xml.contains("<heading>Objectives and Scope</heading>"));
        assertTrue(xml.contains("<heading>Subject matter</heading>"));
        assertTrue(xml.contains("<content><p>This Regulation establishes a framework.</p></content>"));
        // article must be sibling of heading, not inside it
        int headingClose = xml.indexOf("</heading>");
        int articleOpen  = xml.indexOf("<article");
        assertTrue(articleOpen > headingClose, "article must appear after </heading>");
    }

    @Test
    void testChapterInsideTitleWithArticle() throws Exception {
        helper.insertEnactingTerms(bodyDoc, List.of(
                title("General Framework",
                        chapter("General Provisions",
                                numberedArticle(articleHeading("Definitions"), unnumberedParagraph("For the purposes of this Regulation:"))))
        ));

        String xml = serialize(bodyDoc);
        assertTrue(xml.contains("<title"));
        assertTrue(xml.contains("<chapter"));
        assertTrue(xml.contains("<heading>General Framework</heading>"));
        assertTrue(xml.contains("<heading>General Provisions</heading>"));
        assertTrue(xml.contains("<heading>Definitions</heading>"));
        assertTrue(xml.contains("<content><p>For the purposes of this Regulation:</p></content>"));
    }

    @Test
    void testSectionInsideChapterInsideTitleInsidePart() throws Exception {
        helper.insertEnactingTerms(bodyDoc, List.of(
                part("General Framework",
                        title("Objectives",
                                chapter("Scope",
                                        section("Subject Matter",
                                                numberedArticle(articleHeading("Subject matter"), numberedParagraph("This Regulation applies."))))))
        ));

        String xml = serialize(bodyDoc);
        assertTrue(xml.contains("<part"));
        assertTrue(xml.contains("<title"));
        assertTrue(xml.contains("<chapter"));
        assertTrue(xml.contains("<section"));
        assertTrue(xml.contains("<heading>General Framework</heading>"));
        assertTrue(xml.contains("<heading>Objectives</heading>"));
        assertTrue(xml.contains("<heading>Scope</heading>"));
        assertTrue(xml.contains("<heading>Subject Matter</heading>"));
        assertTrue(xml.contains("<heading>Subject matter</heading>"));
        assertTrue(xml.contains("<content><p>This Regulation applies.</p></content>"));
        // verify nesting order in xml
        assertTrue(xml.indexOf("<part") < xml.indexOf("<title"));
        assertTrue(xml.indexOf("<title") < xml.indexOf("<chapter"));
        assertTrue(xml.indexOf("<chapter") < xml.indexOf("<section"));
        assertTrue(xml.indexOf("<section") < xml.indexOf("<article"));
    }

    @Test
    void testPartDirectlyContainingArticle() throws Exception {
        helper.insertEnactingTerms(bodyDoc, List.of(
                part("Final Provisions",
                        numberedArticle(articleHeading("Entry into force"), unnumberedParagraph("This Regulation shall enter into force on the twentieth day.")))
        ));

        String xml = serialize(bodyDoc);
        assertTrue(xml.contains("<part"));
        assertTrue(xml.contains("<heading>Final Provisions</heading>"));
        assertTrue(xml.contains("<heading>Entry into force</heading>"));
        int headingClose = xml.lastIndexOf("</heading>", xml.indexOf("<article"));
        int articleOpen  = xml.indexOf("<article");
        assertTrue(articleOpen > headingClose, "article must appear after </heading> of part");
    }

    @Test
    void testTitleSkippingChapterDirectlyToSection() throws Exception {
        helper.insertEnactingTerms(bodyDoc, List.of(
                title("Reporting Requirements",
                        section("Annual Reports",
                                numberedArticle(articleHeading("Scope of reporting"), numberedParagraph("Reporting entities shall submit annual reports."))))
        ));

        String xml = serialize(bodyDoc);
        assertTrue(xml.contains("<title"));
        assertFalse(xml.contains("<chapter"), "chapter must not be present when skipped");
        assertTrue(xml.contains("<section"));
        assertTrue(xml.contains("<heading>Reporting Requirements</heading>"));
        assertTrue(xml.contains("<heading>Annual Reports</heading>"));
    }

    @Test
    void testComplexScenarioAllHigherDivisions() throws Exception {
        helper.insertEnactingTerms(bodyDoc, List.of(
                part("General Framework",
                        title("Objectives and Scope",
                                chapter("General Provisions",
                                        section("Subject Matter",
                                                numberedArticle(articleHeading("Subject matter"),
                                                        numberedParagraph("This Regulation establishes a framework."),
                                                        numberedParagraph("It applies to all legal persons."))),
                                        numberedArticle(articleHeading("Definitions"),
                                                unnumberedParagraph("For the purposes of this Regulation:"),
                                                numberedParagraph("'competent authority' means the national authority."))),
                                chapter("Specific Provisions",
                                        numberedArticle(articleHeading("Obligations"),
                                                numberedParagraphWithNote(
                                                        "Member States shall designate a competent authority by the date referred to in Article 10,",
                                                        89, "1", "OJ L 123, 1.1.2024, p. 1.")))),
                        title("Reporting Requirements",
                                numberedArticle(articleHeading("Scope of reporting"),
                                        numberedParagraph("Reporting entities shall submit annual reports.")))),
                part("Final Provisions",
                        section("Entry into Force",
                                numberedArticle(articleHeading("Entry into force"),
                                        unnumberedParagraph("This Regulation shall enter into force on the twentieth day.")))
                )
        ));

        String xml = serialize(bodyDoc);

        // structure present
        assertTrue(xml.contains("<part"));
        assertTrue(xml.contains("<title"));
        assertTrue(xml.contains("<chapter"));
        assertTrue(xml.contains("<section"));

        // headings
        assertTrue(xml.contains("<heading>General Framework</heading>"));
        assertTrue(xml.contains("<heading>Objectives and Scope</heading>"));
        assertTrue(xml.contains("<heading>General Provisions</heading>"));
        assertTrue(xml.contains("<heading>Subject Matter</heading>"));
        assertTrue(xml.contains("<heading>Reporting Requirements</heading>"));
        assertTrue(xml.contains("<heading>Final Provisions</heading>"));
        assertTrue(xml.contains("<heading>Entry into Force</heading>"));

        // articles
        assertEquals(5, bodyDoc.getElementsByTagName("article").getLength());

        // footnote spliced correctly
        assertTrue(xml.contains(
                "Member States shall designate a competent authority by the date referred to in Article 10" +
                "<authorialNote marker=\"1\" placement=\"bottom\"><p>OJ L 123, 1.1.2024, p. 1.</p></authorialNote>,"));

        // clause preserved
        assertTrue(xml.contains("<clause>"));

        // nesting order
        assertTrue(xml.indexOf("<part") < xml.indexOf("<title"));
        assertTrue(xml.indexOf("<title") < xml.indexOf("<chapter"));
        assertTrue(xml.indexOf("<chapter") < xml.indexOf("<section"));
    }

    @Test
    void testHigherDivisionHeadingSpecialCharsEscaped() throws Exception {
        helper.insertEnactingTerms(bodyDoc, List.of(
                title("Scope & <Definitions>",
                        numberedArticle(articleHeading("Article"), numberedParagraph("Text.")))
        ));

        String xml = serialize(bodyDoc);
        assertTrue(xml.contains("Scope &amp; &lt;Definitions&gt;"));
        assertFalse(xml.contains("<Definitions>"));
    }

    // --- Higher division helpers ---

    private LineItem higherDivision(AknType type, String heading, LineItem... children) {
        LineItem item = new LineItem();
        item.setType(type);
        item.setContent(heading);
        item.setChildren(List.of(children));
        return item;
    }

    private LineItem part(String heading, LineItem... children)    { return higherDivision(AknType.PART,    heading, children); }
    private LineItem title(String heading, LineItem... children)   { return higherDivision(AknType.TITLE,   heading, children); }
    private LineItem chapter(String heading, LineItem... children) { return higherDivision(AknType.CHAPTER, heading, children); }
    private LineItem section(String heading, LineItem... children) { return higherDivision(AknType.SECTION, heading, children); }

    private LineItem numberedParagraphWithNote(String content, int position, String refId, String noteContent) {
        LineItem p = new LineItem();
        p.setType(AknType.NUMBERED_PARAGRAPH);
        p.setContent(content);
        p.setChildren(List.of(note(refId, position, noteContent)));
        return p;
    }

    private LineItem articleHeading(String content) {
        LineItem h = new LineItem();
        h.setType(AknType.ARTICLE_HEADING);
        h.setContent(content);
        return h;
    }

    private LineItem numberedParagraph(String content) {
        LineItem p = new LineItem();
        p.setType(AknType.NUMBERED_PARAGRAPH);
        p.setContent(content);
        return p;
    }

    private LineItem unnumberedParagraph(String content) {
        LineItem p = new LineItem();
        p.setType(AknType.UNNUMBERED_PARAGRAPH);
        p.setContent(content);
        return p;
    }

    private LineItem numberedArticle(LineItem... children) {
        LineItem a = new LineItem();
        a.setType(AknType.NUMBERED_ARTICLE);
        a.setChildren(List.of(children));
        return a;
    }
}
