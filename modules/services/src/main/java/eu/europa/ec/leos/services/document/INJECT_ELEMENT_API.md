# Inject Element API

## Overview
API endpoint for external applications (e.g., DG SANTE EMP2) to inject content into EdiT documents.

## Endpoint
```
POST /secured/injectElement
```

## Request Format
```json
{
  "documentId": "doc123",
  "sections": [
    {
      "sectionType": "CITATIONS|RECITALS|ENACTING_TERMS",
      "operation": "CLEAN",
      "items": []
    }
  ]
}
```
```json
{
  "success": true,
  "message": "Elements injected successfully"
}
```

## Supported Operations

### CLEAN (Current Implementation)
Clears all child elements from the specified section, then re-populates it with the provided `items`.
Supported for `CITATIONS` and `RECITALS`. For `ENACTING_TERMS`, only the clean step is performed (no re-population).

## LineItem Structure
`LineItem` is recursive. Fields: `refId`, `type` (AknType), `content`, `position`, `children`.

- `content` — text content of the element
- `position` — character offset for inline elements (e.g. AUTHORIAL_NOTE inside a paragraph)
- `children` — nested LineItems

### Citations Example
```json
{
  "sectionType": "CITATIONS",
  "operation": "CLEAN",
  "items": [
    {
      "type": "CITATION",
      "children": [
        { "type": "PARAGRAPH", "content": "Simple citation text," }
      ]
    },
    {
      "type": "CITATION",
      "children": [
        {
          "type": "PARAGRAPH",
          "content": "Having regard to the opinion of the Committee,",
          "children": [
            { "type": "AUTHORIAL_NOTE", "refId": "1", "position": 45, "content": "OJ C [...], [...], p. [...]" }
          ]
        }
      ]
    }
  ]
}
```

### Recitals Example (with groups)
```json
{
  "sectionType": "RECITALS",
  "operation": "CLEAN",
  "items": [
    {
      "type": "RECITAL",
      "children": [
        { "type": "PARAGRAPH", "content": "Simple standalone recital." }
      ]
    },
    {
      "type": "RECITALS",
      "content": "Group Heading",
      "children": [
        {
          "type": "RECITAL",
          "children": [
            {
              "type": "PARAGRAPH",
              "content": "Grouped recital with footnote,",
              "children": [
                { "type": "AUTHORIAL_NOTE", "refId": "1", "position": 29, "content": "Footnote text." }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## AknType Enum
```
CITATION, RECITAL, RECITALS,
PART, TITLE, CHAPTER, SECTION,
NUMBERED_ARTICLE, UNNUMBERED_ARTICLE, ARTICLE_HEADING,
PARAGRAPH, LIST, POINT,
AUTHORIAL_NOTE
```

Note: `RECITALS` (plural) = a recitals group with `<num>`, optional `<heading>` (from `content`), and `<recital>` children.

## AUTHORIAL_NOTE Inline Placement
`AUTHORIAL_NOTE` is a child of `PARAGRAPH` with a `position` field (character offset into parent `content`).
The note is spliced into the text at that position. Multiple notes are sorted by position.

```
content = "Having regard to the Committee,"  (position 30 = after "Committee")
→ <p>Having regard to the Committee<authorialNote marker="1" ...>...</authorialNote>,</p>
```

## ElementInjectionHelper — Build Methods
`buildItemXml` dispatches to dedicated methods per type:
- `AUTHORIAL_NOTE` → inline `<authorialNote marker="{refId}" placement="bottom"><p>...</p></authorialNote>`
- `RECITALS` → `buildRecitalsGroupXml`: `<recitals leos:editable="false"><num>#</num>[<heading>content</heading>]<recital>...</recital></recitals>`
- `RECITAL` → `buildRecitalXml`: `<recital leos:editable="true"><num leos:editable="false">#</num>{children}</recital>`
- Everything else → `buildInlineBlockXml`: inline children spliced by position, block children appended

## Validation — SectionContentValidator
Called before DOM manipulation in `CleanOperationStrategy`.

**Allowed root types per section:**
| Section | Allowed roots |
|---|---|
| CITATIONS | CITATION |
| RECITALS | RECITAL, RECITALS |
| ENACTING_TERMS | PART, TITLE, CHAPTER, SECTION, NUMBERED_ARTICLE, UNNUMBERED_ARTICLE |

> **Mixed-root rule**: If any higher division element (PART, TITLE, CHAPTER, SECTION) appears at the root of ENACTING_TERMS, articles (NUMBERED_ARTICLE, UNNUMBERED_ARTICLE) cannot also appear at the root — validation error.

**Allowed children per parent type:**
| Parent | Allowed children |
|---|---|
| CITATION | PARAGRAPH |
| RECITAL | PARAGRAPH |
| RECITALS | RECITAL |
| PARAGRAPH | LIST, AUTHORIAL_NOTE |
| LIST | POINT |
| POINT | POINT, LIST |
| AUTHORIAL_NOTE | _(leaf)_ |
| PART | TITLE, CHAPTER, SECTION, NUMBERED_ARTICLE, UNNUMBERED_ARTICLE |
| TITLE | CHAPTER, SECTION, NUMBERED_ARTICLE, UNNUMBERED_ARTICLE |
| CHAPTER | SECTION, NUMBERED_ARTICLE, UNNUMBERED_ARTICLE |
| SECTION | NUMBERED_ARTICLE, UNNUMBERED_ARTICLE |
| NUMBERED_ARTICLE / UNNUMBERED_ARTICLE | ARTICLE_HEADING, NUMBERED_PARAGRAPH, UNNUMBERED_PARAGRAPH |
| ARTICLE_HEADING | _(leaf)_ |

## Processing Pipeline (CLEAN)
1. `SectionContentValidator.validate()` — fail fast on invalid types
2. DOM parse `byte[]` → Document
3. Clear section children (RECITALS: only removes `<recital>` and `<recitals>` children, preserves `<intro>`)
4. `ElementInjectionHelper.insertCitations/insertRecitals()` — build and append nodes
5. Serialize DOM → `byte[]`
6. RECITALS only: `numberService.renumberRecitals()` — resolves `#` placeholders (calls `renumberRecitalSections` internally, handles both `<recital>` and `<recitals>` group numbering)
7. `xmlContentProcessor.doXMLPostProcessing()` — assigns `xml:id` attributes

## Architecture
- **Controller**: `LeosApiController.injectElement()`
- **Service**: `InjectElementServiceImpl` — sets `StructureContext` and `DocumentLanguageContext` before executing strategies
- **Strategy interface**: `OperationStrategy.execute(byte[], SectionRequest, String documentCollectionName) → byte[]` — each strategy owns full parse/mutate/serialize/postprocess cycle
- **Factory**: `OperationStrategyFactory`
- **Validator**: `SectionContentValidator`
- **Helper**: `ElementInjectionHelper`

## Key Implementation Notes
- `StructureContext` is request-scoped: call `useDocumentTemplate(docTemplate)` before `getTocItems()`
- `DocumentLanguageContext` must be set before strategies execute (needed by `NumberService`)
- AKN namespace: `xmlns="http://docs.oasis-open.org/legaldocml/ns/akn/3.0"` + `xmlns:leos="urn:eu:europa:ec:leos"` — fragments must be wrapped in NS_WRAPPER before parsing
- `doXMLPostProcessing` is mandatory — without it, inserted elements lack `xml:id` and are not editable in UI
- `renumberRecitals` already calls `renumberRecitalSections` internally — one call handles both levels

## Tests
- `InjectElementServiceImplTest` — mocks: WorkspaceService, DocumentContentService, OperationStrategyFactory, OperationStrategy, StructureContext, DocumentLanguageContext, LeosMetadata (via `doReturn` for wildcard generic)
- `CleanOperationStrategyTest` — mocks: ElementInjectionHelper, XmlContentProcessor, NumberService, SectionContentValidator
- `ElementInjectionHelperTest` — integration-style, uses real DOM parsing; tests simple citations, inline authorial note at position, multiple notes
