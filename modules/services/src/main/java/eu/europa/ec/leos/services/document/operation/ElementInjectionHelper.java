package eu.europa.ec.leos.services.document.operation;

import eu.europa.ec.leos.services.document.operation.builder.AknElementBuilder;
import eu.europa.ec.leos.services.document.operation.builder.HigherDivisionBuilder;
import eu.europa.ec.leos.services.dto.request.AknType;
import eu.europa.ec.leos.services.dto.request.LineItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.services.support.XmlHelper.*;

@Component
@Slf4j
public class ElementInjectionHelper {

    private static final String NS_WRAPPER = "<root xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\" xmlns:leos=\"urn:eu:europa:ec:leos\">";

    private static final java.util.Map<AknType, String> ENACTING_TERMS_TAGS;
    static {
        java.util.EnumMap<AknType, String> m = new java.util.EnumMap<>(AknType.class);
        m.put(AknType.PART,             PART);
        m.put(AknType.TITLE,              TITLE);
        m.put(AknType.CHAPTER,            CHAPTER);
        m.put(AknType.SECTION,            SECTION);
        m.put(AknType.NUMBERED_ARTICLE,   ARTICLE);
        m.put(AknType.UNNUMBERED_ARTICLE, ARTICLE);
        ENACTING_TERMS_TAGS = java.util.Collections.unmodifiableMap(m);
    }

    private final Map<AknType, AknElementBuilder> builders;
    private final DocumentBuilderFactory documentBuilderFactory;

    @Autowired
    public ElementInjectionHelper(List<AknElementBuilder> builderList,
                                   HigherDivisionBuilder higherDivisionBuilder,
                                   DocumentBuilderFactory documentBuilderFactory) {
        builders = new EnumMap<>(AknType.class);
        builderList.forEach(b -> builders.put(b.type(), b));
        for (AknType type : new AknType[]{AknType.PART, AknType.TITLE, AknType.CHAPTER, AknType.SECTION}) {
            builders.put(type, higherDivisionBuilder.forType(type));
        }
        this.documentBuilderFactory = documentBuilderFactory;
    }

    public void insertCitations(Document doc, List<LineItem> items) {
        insertInto(doc, CITATIONS, items, item -> CITATION);
    }

    public void insertRecitals(Document doc, List<LineItem> items) {
        insertInto(doc, RECITALS, items, item -> item.getType() == AknType.RECITALS ? RECITALS : RECITAL);
    }

    public void insertEnactingTerms(Document doc, List<LineItem> items) {
        insertInto(doc, BODY, items, item -> {
            String tag = ENACTING_TERMS_TAGS.get(item.getType());
            if (tag == null) throw new IllegalArgumentException("No tag mapping for enacting terms type: " + item.getType());
            return tag;
        });
    }

    private void insertInto(Document doc, String containerTag, List<LineItem> items, java.util.function.Function<LineItem, String> tagResolver) {
        try {
            Node containerNode = doc.getElementsByTagName(containerTag).item(0);
            if (containerNode == null) {
                log.warn("Container element '{}' not found in document", containerTag);
                return;
            }
            DocumentBuilder builder;
            synchronized (documentBuilderFactory) {
                builder = documentBuilderFactory.newDocumentBuilder();
            }
            Node anchor = containerNode.getFirstChild();
            for (LineItem item : items) {
                String xml = buildItemXml(item);
                String wrapped = NS_WRAPPER + xml + "</root>";
                Document fragment = builder.parse(new ByteArrayInputStream(wrapped.getBytes(StandardCharsets.UTF_8)));
                Node importedNode = doc.importNode(fragment.getDocumentElement().getElementsByTagName(tagResolver.apply(item)).item(0), true);
                containerNode.insertBefore(importedNode, anchor);
            }
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to insert into " + containerTag, e);
        }
    }

    String buildItemXml(LineItem item) {
        AknElementBuilder builder = builders.get(item.getType());
        if (builder == null) throw new IllegalArgumentException("No builder registered for type: " + item.getType());
        return builder.build(item, this::buildItemXml);
    }
}
