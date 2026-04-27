package eu.europa.ec.leos.services.document.operation;

import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.services.dto.request.AknType;
import eu.europa.ec.leos.services.dto.request.LineItem;
import eu.europa.ec.leos.services.dto.request.SectionType;
import eu.europa.ec.leos.services.support.XmlHelper;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class SectionContentValidator {

    static final int MAX_ITEMS = 5000;
    static final int MAX_DEPTH = 50;
    static final int MAX_CONTENT_LENGTH = 50_000;

    // Allowed section types per document category — extend here to support new combinations
    private static final Map<LeosCategory, Set<SectionType>> ALLOWED_SECTIONS_BY_CATEGORY = new EnumMap<>(LeosCategory.class);

    static {
        ALLOWED_SECTIONS_BY_CATEGORY.put(LeosCategory.BILL, EnumSet.allOf(SectionType.class));
    }

    // Allowed root types per section
    private static final Map<SectionType, Set<AknType>> SECTION_ROOTS = new EnumMap<>(SectionType.class);

    // Allowed children per parent type
    private static final Map<AknType, Set<AknType>> ALLOWED_CHILDREN = new EnumMap<>(AknType.class);

    static {
        SECTION_ROOTS.put(SectionType.CITATIONS,      EnumSet.of(AknType.CITATION));
        SECTION_ROOTS.put(SectionType.RECITALS,       EnumSet.of(AknType.RECITAL, AknType.RECITALS));
        SECTION_ROOTS.put(SectionType.ENACTING_TERMS, EnumSet.of(
                AknType.PART, AknType.TITLE, AknType.CHAPTER, AknType.SECTION,
                AknType.NUMBERED_ARTICLE, AknType.UNNUMBERED_ARTICLE));

        ALLOWED_CHILDREN.put(AknType.CITATION,           EnumSet.of(AknType.AUTHORIAL_NOTE));
        ALLOWED_CHILDREN.put(AknType.RECITAL,            EnumSet.of(AknType.AUTHORIAL_NOTE));
        ALLOWED_CHILDREN.put(AknType.RECITALS,         EnumSet.of(AknType.RECITAL));
        ALLOWED_CHILDREN.put(AknType.PART,               EnumSet.of(AknType.TITLE, AknType.CHAPTER, AknType.SECTION, AknType.NUMBERED_ARTICLE, AknType.UNNUMBERED_ARTICLE));
        ALLOWED_CHILDREN.put(AknType.TITLE,              EnumSet.of(AknType.CHAPTER, AknType.SECTION, AknType.NUMBERED_ARTICLE, AknType.UNNUMBERED_ARTICLE));
        ALLOWED_CHILDREN.put(AknType.CHAPTER,            EnumSet.of(AknType.SECTION, AknType.NUMBERED_ARTICLE, AknType.UNNUMBERED_ARTICLE));
        ALLOWED_CHILDREN.put(AknType.SECTION,            EnumSet.of(AknType.NUMBERED_ARTICLE, AknType.UNNUMBERED_ARTICLE));
        ALLOWED_CHILDREN.put(AknType.NUMBERED_ARTICLE,   EnumSet.of(AknType.ARTICLE_HEADING, AknType.NUMBERED_PARAGRAPH, AknType.UNNUMBERED_PARAGRAPH));
        ALLOWED_CHILDREN.put(AknType.UNNUMBERED_ARTICLE, EnumSet.of(AknType.ARTICLE_HEADING, AknType.NUMBERED_PARAGRAPH, AknType.UNNUMBERED_PARAGRAPH));
        ALLOWED_CHILDREN.put(AknType.ARTICLE_HEADING,    EnumSet.noneOf(AknType.class));
        ALLOWED_CHILDREN.put(AknType.PARAGRAPH,          EnumSet.of(AknType.LIST, AknType.AUTHORIAL_NOTE));
        ALLOWED_CHILDREN.put(AknType.NUMBERED_PARAGRAPH,   EnumSet.of(AknType.AUTHORIAL_NOTE));
        ALLOWED_CHILDREN.put(AknType.UNNUMBERED_PARAGRAPH, EnumSet.of(AknType.AUTHORIAL_NOTE));
        ALLOWED_CHILDREN.put(AknType.LIST,               EnumSet.of(AknType.POINT));
        ALLOWED_CHILDREN.put(AknType.POINT,              EnumSet.of(AknType.POINT, AknType.LIST));
        ALLOWED_CHILDREN.put(AknType.AUTHORIAL_NOTE,     EnumSet.noneOf(AknType.class));
    }

    public void validate(SectionType sectionType, List<LineItem> items, String documentCollectionName, LeosCategory category) {
        Set<SectionType> allowedSections = ALLOWED_SECTIONS_BY_CATEGORY.getOrDefault(category, EnumSet.noneOf(SectionType.class));
        if (!allowedSections.contains(sectionType)) {
            throw new IllegalArgumentException(
                    "Section type " + sectionType + " is not allowed for document category " + category);
        }
        if (items == null) return;
        if (items.size() > MAX_ITEMS) {
            throw new IllegalArgumentException("Too many items: max " + MAX_ITEMS + " allowed");
        }
        Set<AknType> allowedRoots = SECTION_ROOTS.get(sectionType);
        if (allowedRoots == null) {
            throw new IllegalArgumentException("Unsupported section type: " + sectionType);
        }
        if (sectionType == SectionType.ENACTING_TERMS && items != null) {
            boolean hasHigherDivisions = items.stream().anyMatch(i ->
                    i.getType() == AknType.PART || i.getType() == AknType.TITLE ||
                    i.getType() == AknType.CHAPTER || i.getType() == AknType.SECTION);
            boolean hasRootArticles = items.stream().anyMatch(i ->
                    i.getType() == AknType.NUMBERED_ARTICLE || i.getType() == AknType.UNNUMBERED_ARTICLE);
            if (hasHigherDivisions && hasRootArticles) {
                throw new IllegalArgumentException(
                        "Articles cannot appear at the root of ENACTING_TERMS when higher division elements (PART, TITLE, CHAPTER, SECTION) are present");
            }
            long rootArticleCount = items.stream()
                    .filter(i -> i.getType() == AknType.NUMBERED_ARTICLE || i.getType() == AknType.UNNUMBERED_ARTICLE)
                    .count();
            boolean hasSingleNumberedArticle = rootArticleCount == 1 &&
                    items.stream().anyMatch(i -> i.getType() == AknType.NUMBERED_ARTICLE);
            if (hasSingleNumberedArticle) {
                throw new IllegalArgumentException(
                        "A single article in ENACTING_TERMS must be UNNUMBERED_ARTICLE, not NUMBERED_ARTICLE");
            }
        }
        if (sectionType == SectionType.RECITALS) {
            boolean hasGroups = items.stream().anyMatch(i -> i.getType() == AknType.RECITALS);
            if (hasGroups && !XmlHelper.ACT_AUTO_COM.equals(documentCollectionName)) {
                throw new IllegalArgumentException("RECITALS groups are only allowed in autonomous acts");
            }
        }
        for (LineItem item : items) {
            validateItem(item, allowedRoots, 0);
        }
    }

    private void validateItem(LineItem item, Set<AknType> allowedTypes, int depth) {
        if (depth > MAX_DEPTH) {
            throw new IllegalArgumentException("Item nesting exceeds maximum depth of " + MAX_DEPTH);
        }
        if (item.getContent() != null && item.getContent().length() > MAX_CONTENT_LENGTH) {
            throw new IllegalArgumentException("Content exceeds maximum length of " + MAX_CONTENT_LENGTH);
        }
        if (item.getType() == null || !allowedTypes.contains(item.getType())) {
            throw new IllegalArgumentException(
                    "Invalid element type '" + item.getType() + "'. Allowed here: " + allowedTypes);
        }
        if ((item.getType() == AknType.RECITAL || item.getType() == AknType.CITATION) && item.getContent() == null) {
            throw new IllegalArgumentException(item.getType() + " content must not be null");
        }
        if (item.getType() == AknType.AUTHORIAL_NOTE) {
            if (item.getPosition() == null || item.getPosition() < 0) {
                throw new IllegalArgumentException("AUTHORIAL_NOTE requires a non-negative position");
            }
        }
        if ((item.getType() == AknType.PARAGRAPH || item.getType() == AknType.NUMBERED_PARAGRAPH
                || item.getType() == AknType.UNNUMBERED_PARAGRAPH) && item.getChildren() != null) {
            int contentLength = item.getContent() != null ? item.getContent().length() : 0;
            for (LineItem child : item.getChildren()) {
                if (child.getType() == AknType.AUTHORIAL_NOTE && child.getPosition() != null
                        && child.getPosition() > contentLength) {
                    throw new IllegalArgumentException(
                            "AUTHORIAL_NOTE position " + child.getPosition() + " exceeds paragraph content length " + contentLength);
                }
            }
        }
        if (item.getChildren() != null && !item.getChildren().isEmpty()) {
            Set<AknType> allowedChildren = ALLOWED_CHILDREN.get(item.getType());
            if (allowedChildren == null || allowedChildren.isEmpty()) {
                throw new IllegalArgumentException(
                        "Element type '" + item.getType() + "' cannot have children");
            }
            if (item.getType() == AknType.NUMBERED_ARTICLE || item.getType() == AknType.UNNUMBERED_ARTICLE) {
                boolean headingPresent = item.getChildren().stream().anyMatch(c -> c.getType() == AknType.ARTICLE_HEADING);
                if (headingPresent && item.getChildren().get(0).getType() != AknType.ARTICLE_HEADING) {
                    throw new IllegalArgumentException("ARTICLE_HEADING must be the first child of an article");
                }
            }
            for (LineItem child : item.getChildren()) {
                validateItem(child, allowedChildren, depth + 1);
            }
        } else if (item.getType() == AknType.RECITALS) {
            throw new IllegalArgumentException("RECITALS must have at least one RECITAL child");
        } else if (item.getType() == AknType.NUMBERED_ARTICLE || item.getType() == AknType.UNNUMBERED_ARTICLE) {
            throw new IllegalArgumentException("Article must have at least one paragraph child");
        }
    }
}
