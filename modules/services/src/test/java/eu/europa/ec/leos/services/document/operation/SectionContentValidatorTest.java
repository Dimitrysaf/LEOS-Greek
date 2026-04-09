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
        LineItem article = item(AknType.NUMBERED_ARTICLE);
        article.setChildren(List.of(item(AknType.NUMBERED_PARAGRAPH)));
        assertDoesNotThrow(() ->
                validator.validate(SectionType.ENACTING_TERMS, List.of(article), "ANY", LeosCategory.BILL));
    }

    @Test
    void testArticleHeadingNotFirstChildThrows() {
        LineItem article = item(AknType.NUMBERED_ARTICLE);
        article.setChildren(List.of(item(AknType.NUMBERED_PARAGRAPH), item(AknType.ARTICLE_HEADING)));
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                validator.validate(SectionType.ENACTING_TERMS, List.of(article), "ANY", LeosCategory.BILL));
        assertTrue(ex.getMessage().contains("ARTICLE_HEADING"));
    }

    @Test
    void testValidEnactingTermsRootTypesAllowed() {
        for (AknType rootType : List.of(AknType.NUMBERED_ARTICLE, AknType.UNNUMBERED_ARTICLE)) {
            LineItem article = item(rootType);
            article.setChildren(List.of(item(AknType.ARTICLE_HEADING), item(AknType.NUMBERED_PARAGRAPH)));
            assertDoesNotThrow(() ->
                    validator.validate(SectionType.ENACTING_TERMS, List.of(article), "ANY", LeosCategory.BILL),
                    rootType + " should be a valid ENACTING_TERMS root");
        }
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
