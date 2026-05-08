package eu.europa.ec.leos.services.document.operation;

import eu.europa.ec.leos.domain.repository.LeosCategory;
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
        LineItem note = item(AknType.AUTHORIAL_NOTE);
        note.setPosition(0);
        LineItem child = item(AknType.RECITAL);
        child.setContent("Recital text.");
        child.setChildren(List.of(note));
        LineItem g = new LineItem();
        g.setType(AknType.RECITALS);
        g.setChildren(List.of(child));
        return g;
    }

    @Test
    void testCitationsRejectedForNonBillDocument() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.CITATIONS, List.of(item(AknType.CITATION)), "ANY", LeosCategory.MEMORANDUM));
        assertTrue(ex.getMessage().contains("CITATIONS"));
    }

    @Test
    void testRecitalsRejectedForNonBillDocument() {
        LineItem note = item(AknType.AUTHORIAL_NOTE);
        note.setPosition(0);
        LineItem recital = item(AknType.RECITAL);
        recital.setChildren(List.of(note));
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.RECITALS, List.of(recital), "ANY", LeosCategory.ANNEX));
        assertTrue(ex.getMessage().contains("RECITALS"));
    }

    @Test
    void testEnactingTermsRejectedForNonBillDocument() {
        LineItem article = item(AknType.NUMBERED_ARTICLE);
        article.setChildren(List.of(item(AknType.NUMBERED_PARAGRAPH)));
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.ENACTING_TERMS, List.of(article), "ANY", LeosCategory.MEMORANDUM));
        assertTrue(ex.getMessage().contains("ENACTING_TERMS"));
    }

    @Test
    void testRecitalsGroupAllowedForAutonomousAct() {
        assertDoesNotThrow(() ->
                validator.validate(SectionType.RECITALS, List.of(recitalsGroup()), XmlHelper.ACT_AUTO_COM, LeosCategory.BILL));
    }

    @Test
    void testRecitalsGroupRejectedForNonAutonomousAct() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.RECITALS, List.of(recitalsGroup()), "OTHER_COLLECTION", LeosCategory.BILL));
        assertTrue(ex.getMessage().contains("autonomous act"));
    }

    @Test
    void testRecitalsGroupRejectedWhenCollectionNameIsNull() {
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.RECITALS, List.of(recitalsGroup()), null, LeosCategory.BILL));
    }

    @Test
    void testStandaloneRecitalAllowedForNonAutonomousAct() {
        LineItem note = item(AknType.AUTHORIAL_NOTE);
        note.setPosition(0);
        LineItem recital = item(AknType.RECITAL);
        recital.setContent("Recital text.");
        recital.setChildren(List.of(note));
        assertDoesNotThrow(() ->
                validator.validate(SectionType.RECITALS, List.of(recital), "OTHER_COLLECTION", LeosCategory.BILL));
    }

    @Test
    void testTooManyItemsThrows() {
        List<LineItem> items = new java.util.ArrayList<>();
        for (int i = 0; i < SectionContentValidator.MAX_ITEMS + 1; i++) {
            items.add(item(AknType.RECITAL));
        }
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.RECITALS, items, "ANY", LeosCategory.BILL));
    }

    @Test
    void testContentTooLongThrows() {
        LineItem citation = item(AknType.CITATION);
        citation.setContent("x".repeat(SectionContentValidator.MAX_CONTENT_LENGTH + 1));
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.CITATIONS, List.of(citation), "ANY", LeosCategory.BILL));
    }

    @Test
    void testExcessiveNestingThrows() {
        LineItem deepPoint = item(AknType.POINT);
        for (int i = 0; i < SectionContentValidator.MAX_DEPTH; i++) {
            LineItem wrapper = item(AknType.POINT);
            wrapper.setChildren(List.of(deepPoint));
            deepPoint = wrapper;
        }
        LineItem list = item(AknType.LIST);
        list.setChildren(List.of(deepPoint));
        LineItem para = item(AknType.NUMBERED_PARAGRAPH);
        para.setChildren(List.of(list));
        LineItem article = item(AknType.NUMBERED_ARTICLE);
        article.setChildren(List.of(para));
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.ENACTING_TERMS, List.of(article), "ANY", LeosCategory.BILL));
    }

    @Test
    void testInvalidRootTypeThrows() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.CITATIONS, List.of(item(AknType.RECITAL)), "ANY", LeosCategory.BILL));
        assertTrue(ex.getMessage().contains("RECITAL"));
        assertTrue(ex.getMessage().contains("CITATIONS[0]"));
    }

    @Test
    void testInvalidChildTypeIncludesPathInMessage() {
        LineItem title = item(AknType.TITLE);
        LineItem invalidChild = item(AknType.CITATION); // CITATION not allowed under TITLE
        title.setChildren(List.of(invalidChild));
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.ENACTING_TERMS, List.of(title), "ANY", LeosCategory.BILL));
        assertTrue(ex.getMessage().contains("ENACTING_TERMS[0](TITLE).children[0]"));
    }

    @Test
    void testAuthorialNoteWithoutPositionThrows() {
        LineItem note = item(AknType.AUTHORIAL_NOTE);
        LineItem citation = item(AknType.CITATION);
        citation.setChildren(List.of(note));
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.CITATIONS, List.of(citation), "ANY", LeosCategory.BILL));
    }

    @Test
    void testRecitalsGroupWithNoChildrenThrows() {
        LineItem g = item(AknType.RECITALS);
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.RECITALS, List.of(g), XmlHelper.ACT_AUTO_COM, LeosCategory.BILL));
    }

    @Test
    void testRecitalWithNullContentThrows() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.RECITALS, List.of(item(AknType.RECITAL)), "ANY", LeosCategory.BILL));
        assertTrue(ex.getMessage().contains("RECITAL"));
        assertTrue(ex.getMessage().contains("non-blank content"));
    }

    @Test
    void testRecitalWithBlankContentThrows() {
        LineItem recital = item(AknType.RECITAL);
        recital.setContent("   ");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.RECITALS, List.of(recital), "ANY", LeosCategory.BILL));
        assertTrue(ex.getMessage().contains("RECITAL"));
        assertTrue(ex.getMessage().contains("non-blank content"));
    }

    @Test
    void testCitationWithNullContentThrows() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.CITATIONS, List.of(item(AknType.CITATION)), "ANY", LeosCategory.BILL));
        assertTrue(ex.getMessage().contains("CITATION"));
        assertTrue(ex.getMessage().contains("non-blank content"));
    }

    @Test
    void testCitationWithBlankContentThrows() {
        LineItem citation = item(AknType.CITATION);
        citation.setContent("");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.CITATIONS, List.of(citation), "ANY", LeosCategory.BILL));
        assertTrue(ex.getMessage().contains("CITATION"));
        assertTrue(ex.getMessage().contains("non-blank content"));
    }

    @Test
    void testNullItemsReturnsWithoutThrowing() {
        assertDoesNotThrow(() -> validator.validate(SectionType.CITATIONS, null, "ANY", LeosCategory.BILL));
    }

    @Test
    void testUnsupportedSectionTypeThrows() {
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(null, List.of(), "ANY", LeosCategory.BILL));
    }

    @Test
    void testAuthorialNoteWithNegativePositionThrows() {
        LineItem note = item(AknType.AUTHORIAL_NOTE);
        note.setPosition(-1);
        LineItem citation = item(AknType.CITATION);
        citation.setChildren(List.of(note));
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.CITATIONS, List.of(citation), "ANY", LeosCategory.BILL));
    }

    @Test
    void testArticleWithoutHeadingAllowed() {
        LineItem article1 = item(AknType.NUMBERED_ARTICLE);
        article1.setChildren(List.of(item(AknType.NUMBERED_PARAGRAPH)));
        LineItem article2 = item(AknType.NUMBERED_ARTICLE);
        article2.setChildren(List.of(item(AknType.NUMBERED_PARAGRAPH)));
        assertDoesNotThrow(() ->
                validator.validate(SectionType.ENACTING_TERMS, List.of(article1, article2), "ANY", LeosCategory.BILL));
    }

    @Test
    void testArticleHeadingNotFirstChildThrows() {
        LineItem article1 = item(AknType.NUMBERED_ARTICLE);
        article1.setChildren(List.of(item(AknType.NUMBERED_PARAGRAPH), item(AknType.ARTICLE_HEADING)));
        LineItem article2 = item(AknType.NUMBERED_ARTICLE);
        article2.setChildren(List.of(item(AknType.NUMBERED_PARAGRAPH)));
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.ENACTING_TERMS, List.of(article1, article2), "ANY", LeosCategory.BILL));
        assertTrue(ex.getMessage().contains("ARTICLE_HEADING"));
    }

    @Test
    void testValidEnactingTermsRootTypesAllowed() {
        LineItem numbered1 = item(AknType.NUMBERED_ARTICLE);
        numbered1.setChildren(List.of(item(AknType.ARTICLE_HEADING), item(AknType.NUMBERED_PARAGRAPH)));
        LineItem numbered2 = item(AknType.NUMBERED_ARTICLE);
        numbered2.setChildren(List.of(item(AknType.NUMBERED_PARAGRAPH)));
        assertDoesNotThrow(() ->
                validator.validate(SectionType.ENACTING_TERMS, List.of(numbered1, numbered2), "ANY", LeosCategory.BILL),
                "NUMBERED_ARTICLE should be a valid ENACTING_TERMS root");

        LineItem unnumbered = item(AknType.UNNUMBERED_ARTICLE);
        unnumbered.setChildren(List.of(item(AknType.ARTICLE_HEADING), item(AknType.NUMBERED_PARAGRAPH)));
        assertDoesNotThrow(() ->
                validator.validate(SectionType.ENACTING_TERMS, List.of(unnumbered), "ANY", LeosCategory.BILL),
                "UNNUMBERED_ARTICLE should be a valid ENACTING_TERMS root");
    }

    @Test
    void testSingleNumberedArticleInEnactingTermsThrows() {
        LineItem article = item(AknType.NUMBERED_ARTICLE);
        article.setChildren(List.of(item(AknType.NUMBERED_PARAGRAPH)));
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.ENACTING_TERMS, List.of(article), "ANY", LeosCategory.BILL));
        assertTrue(ex.getMessage().contains("UNNUMBERED_ARTICLE"));
    }

    @Test
    void testSingleUnnumberedArticleInEnactingTermsAllowed() {
        LineItem article = item(AknType.UNNUMBERED_ARTICLE);
        article.setChildren(List.of(item(AknType.NUMBERED_PARAGRAPH)));
        assertDoesNotThrow(() ->
                validator.validate(SectionType.ENACTING_TERMS, List.of(article), "ANY", LeosCategory.BILL));
    }

    @Test
    void testLeafNodeWithChildrenThrows() {
        LineItem note = item(AknType.AUTHORIAL_NOTE);
        note.setPosition(0);
        note.setChildren(List.of(item(AknType.CITATION)));
        LineItem citation = item(AknType.CITATION);
        citation.setChildren(List.of(note));
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.CITATIONS, List.of(citation), "ANY", LeosCategory.BILL));
    }
}
