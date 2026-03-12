package eu.europa.ec.leos.services.document.operation;

import eu.europa.ec.leos.services.dto.request.AknType;
import eu.europa.ec.leos.services.dto.request.LineItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayInputStream;
import java.io.StringWriter;
import java.util.List;

import eu.europa.ec.leos.services.document.operation.builder.*;
import static org.junit.jupiter.api.Assertions.*;

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

    @BeforeEach
    void setUp() throws Exception {
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
        ));
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
        factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
        DocumentBuilder builder = factory.newDocumentBuilder();
        citationsDoc = builder.parse(new ByteArrayInputStream(CITATIONS_XML.getBytes()));
        recitalsDoc = builder.parse(new ByteArrayInputStream(RECITALS_XML.getBytes()));
        bodyDoc = builder.parse(new ByteArrayInputStream(BODY_XML.getBytes()));
    }

    private LineItem paragraph(String content) {
        LineItem p = new LineItem();
        p.setType(AknType.PARAGRAPH);
        p.setContent(content);
        return p;
    }

    private LineItem paragraphWithNote(String content, int position, String noteRefId, String noteContent) {
        LineItem note = new LineItem();
        note.setType(AknType.AUTHORIAL_NOTE);
        note.setRefId(noteRefId);
        note.setPosition(position);
        note.setContent(noteContent);

        LineItem p = new LineItem();
        p.setType(AknType.PARAGRAPH);
        p.setContent(content);
        p.setChildren(List.of(note));
        return p;
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

        LineItem note1 = new LineItem();
        note1.setType(AknType.AUTHORIAL_NOTE);
        note1.setRefId("2");
        note1.setPosition(47);
        note1.setContent("First footnote.");

        LineItem note2 = new LineItem();
        note2.setType(AknType.AUTHORIAL_NOTE);
        note2.setRefId("3");
        note2.setPosition(57);
        note2.setContent("Second footnote.");

        LineItem p = new LineItem();
        p.setType(AknType.PARAGRAPH);
        p.setContent(text);
        p.setChildren(List.of(note1, note2));

        helper.insertCitations(citationsDoc, List.of(citation(p)));

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
        if (heading == null || heading.isEmpty()) throw new IllegalArgumentException("RECITALS group requires a heading");
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
        LineItem note = new LineItem();
        note.setType(AknType.AUTHORIAL_NOTE);
        note.setRefId("1");
        note.setPosition(58);
        note.setContent("OJ L 123, 1.1.2024, p. 1.");
        LineItem para = new LineItem();
        para.setType(AknType.NUMBERED_PARAGRAPH);
        para.setContent(text);
        para.setChildren(List.of(note));

        helper.insertEnactingTerms(bodyDoc, List.of(numberedArticle(articleHeading("Scope"), para)));

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
    void testArticleWithoutHeading() throws Exception {
        helper.insertEnactingTerms(bodyDoc, List.of(
                numberedArticle(numberedParagraph("Paragraph without heading."))
        ));
        // heading is now required — validator rejects this before reaching the helper,
        // but the helper itself still builds valid XML if called directly
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

    // --- Enacting terms helpers ---

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
