package eu.europa.ec.leos.services.document.operation;

import eu.europa.ec.leos.services.dto.request.AknType;
import eu.europa.ec.leos.services.dto.request.LineItem;
import eu.europa.ec.leos.services.dto.request.SectionType;
import eu.europa.ec.leos.services.support.XmlHelper;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class SectionContentValidatorTest {

    private final SectionContentValidator validator = new SectionContentValidator();

    private LineItem item(AknType type) {
        LineItem i = new LineItem();
        i.setType(type);
        return i;
    }

    private LineItem recitalsGroup() {
        LineItem child = item(AknType.RECITAL);
        child.setChildren(List.of(item(AknType.PARAGRAPH)));
        LineItem g = new LineItem();
        g.setType(AknType.RECITALS);
        g.setChildren(List.of(child));
        return g;
    }

    @Test
    void testRecitalsGroupAllowedForAutonomousAct() {
        assertDoesNotThrow(() ->
                validator.validate(SectionType.RECITALS, List.of(recitalsGroup()), XmlHelper.ACT_AUTO_COM));
    }

    @Test
    void testRecitalsGroupRejectedForNonAutonomousAct() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.RECITALS, List.of(recitalsGroup()), "OTHER_COLLECTION"));
        assertTrue(ex.getMessage().contains("autonomous act"));
    }

    @Test
    void testRecitalsGroupRejectedWhenCollectionNameIsNull() {
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.RECITALS, List.of(recitalsGroup()), null));
    }

    @Test
    void testStandaloneRecitalAllowedForNonAutonomousAct() {
        LineItem recital = item(AknType.RECITAL);
        recital.setChildren(List.of(item(AknType.PARAGRAPH)));
        assertDoesNotThrow(() ->
                validator.validate(SectionType.RECITALS, List.of(recital), "OTHER_COLLECTION"));
    }

    @Test
    void testTooManyItemsThrows() {
        List<LineItem> items = new java.util.ArrayList<>();
        for (int i = 0; i < SectionContentValidator.MAX_ITEMS + 1; i++) {
            LineItem r = item(AknType.RECITAL);
            r.setChildren(List.of(item(AknType.PARAGRAPH)));
            items.add(r);
        }
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.RECITALS, items, "ANY"));
    }

    @Test
    void testContentTooLongThrows() {
        LineItem para = item(AknType.PARAGRAPH);
        para.setContent("x".repeat(SectionContentValidator.MAX_CONTENT_LENGTH + 1));
        LineItem citation = item(AknType.CITATION);
        citation.setChildren(List.of(para));
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.CITATIONS, List.of(citation), "ANY"));
    }

    @Test
    void testExcessiveNestingThrows() {
        // build a chain deeper than MAX_DEPTH
        LineItem deepPoint = item(AknType.POINT);
        for (int i = 0; i < SectionContentValidator.MAX_DEPTH; i++) {
            LineItem wrapper = item(AknType.POINT);
            wrapper.setChildren(List.of(deepPoint));
            deepPoint = wrapper;
        }
        LineItem list = item(AknType.LIST);
        list.setChildren(List.of(deepPoint));
        LineItem para = item(AknType.PARAGRAPH);
        para.setChildren(List.of(list));
        LineItem citation = item(AknType.CITATION);
        citation.setChildren(List.of(para));
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.CITATIONS, List.of(citation), "ANY"));
    }

    @Test
    void testInvalidRootTypeThrows() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.CITATIONS, List.of(item(AknType.RECITAL)), "ANY"));
        assertTrue(ex.getMessage().contains("RECITAL"));
    }

    @Test
    void testAuthorialNoteWithoutPositionThrows() {
        LineItem note = item(AknType.AUTHORIAL_NOTE);
        LineItem para = item(AknType.PARAGRAPH);
        para.setChildren(List.of(note));
        LineItem citation = item(AknType.CITATION);
        citation.setChildren(List.of(para));
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.CITATIONS, List.of(citation), "ANY"));
    }

    @Test
    void testAuthorialNotePositionExceedsContentLengthThrows() {
        LineItem note = item(AknType.AUTHORIAL_NOTE);
        note.setPosition(100);
        note.setContent("note");
        LineItem para = item(AknType.PARAGRAPH);
        para.setContent("short text");
        para.setChildren(List.of(note));
        LineItem citation = item(AknType.CITATION);
        citation.setChildren(List.of(para));
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.CITATIONS, List.of(citation), "ANY"));
    }

    @Test
    void testRecitalsGroupWithNoChildrenThrows() {
        LineItem g = item(AknType.RECITALS);
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.RECITALS, List.of(g), XmlHelper.ACT_AUTO_COM));
    }

    @Test
    void testNullItemsReturnsWithoutThrowing() {
        assertDoesNotThrow(() -> validator.validate(SectionType.CITATIONS, null, "ANY"));
    }

    @Test
    void testUnsupportedSectionTypeThrows() {
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(null, List.of(), "ANY"));
    }

    @Test
    void testAuthorialNoteWithNegativePositionThrows() {
        LineItem note = item(AknType.AUTHORIAL_NOTE);
        note.setPosition(-1);
        LineItem para = item(AknType.PARAGRAPH);
        para.setChildren(List.of(note));
        LineItem citation = item(AknType.CITATION);
        citation.setChildren(List.of(para));
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.CITATIONS, List.of(citation), "ANY"));
    }

    @Test
    void testArticleWithoutHeadingAllowed() {
        LineItem article = item(AknType.NUMBERED_ARTICLE);
        article.setChildren(List.of(item(AknType.NUMBERED_PARAGRAPH)));
        assertDoesNotThrow(() ->
                validator.validate(SectionType.ENACTING_TERMS, List.of(article), "ANY"));
    }

    @Test
    void testArticleHeadingNotFirstChildThrows() {
        LineItem article = item(AknType.NUMBERED_ARTICLE);
        article.setChildren(List.of(item(AknType.NUMBERED_PARAGRAPH), item(AknType.ARTICLE_HEADING)));
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.ENACTING_TERMS, List.of(article), "ANY"));
        assertTrue(ex.getMessage().contains("ARTICLE_HEADING"));
    }

    @Test
    void testValidEnactingTermsRootTypesAllowed() {
        for (AknType rootType : List.of(AknType.NUMBERED_ARTICLE, AknType.UNNUMBERED_ARTICLE)) {
            LineItem article = item(rootType);
            article.setChildren(List.of(item(AknType.ARTICLE_HEADING), item(AknType.NUMBERED_PARAGRAPH)));
            assertDoesNotThrow(() ->
                    validator.validate(SectionType.ENACTING_TERMS, List.of(article), "ANY"),
                    rootType + " should be a valid ENACTING_TERMS root");
        }
    }

    @Test
    void testLeafNodeWithChildrenThrows() {
        LineItem note = item(AknType.AUTHORIAL_NOTE);
        note.setPosition(0);
        note.setChildren(List.of(item(AknType.PARAGRAPH)));
        LineItem para = item(AknType.PARAGRAPH);
        para.setChildren(List.of(note));
        LineItem citation = item(AknType.CITATION);
        citation.setChildren(List.of(para));
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.CITATIONS, List.of(citation), "ANY"));
    }
}
