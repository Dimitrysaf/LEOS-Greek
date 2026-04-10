package eu.europa.ec.leos.services.document.operation.builder;

import eu.europa.ec.leos.services.dto.request.AknType;
import eu.europa.ec.leos.services.dto.request.LineItem;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.utils.StructureConfigUtils;
import eu.europa.ec.leos.vo.structure.TocItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import jakarta.inject.Provider;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Component
public class HigherDivisionBuilder {

    private static final Map<AknType, String> TYPE_TO_NODE_NAME = new EnumMap<>(AknType.class);
    static {
        TYPE_TO_NODE_NAME.put(AknType.PART,    "part");
        TYPE_TO_NODE_NAME.put(AknType.TITLE,   "title");
        TYPE_TO_NODE_NAME.put(AknType.CHAPTER, "chapter");
        TYPE_TO_NODE_NAME.put(AknType.SECTION, "section");
    }

    private final Provider<StructureContext> structureContextProvider;

    @Autowired
    public HigherDivisionBuilder(Provider<StructureContext> structureContextProvider) {
        this.structureContextProvider = structureContextProvider;
    }

    public AknElementBuilder forType(AknType type) {
        return new DelegatingBuilder(type);
    }

    private class DelegatingBuilder implements AknElementBuilder {
        private final AknType aknType;

        DelegatingBuilder(AknType aknType) {
            this.aknType = aknType;
        }

        @Override
        public AknType type() {
            return aknType;
        }

        @Override
        public String build(LineItem item, Function<LineItem, String> buildChild) {
            String nodeName = TYPE_TO_NODE_NAME.get(aknType);
            List<TocItem> tocItems = structureContextProvider.get().getTocItems();
            TocItem tocItem = StructureConfigUtils.getTocItemByName(tocItems, nodeName);

            String template = tocItem != null ? tocItem.getTemplate() : null;
            if (template == null || template.isBlank()) {
                throw new IllegalStateException("No template found for higher division element: " + nodeName);
            }

            String heading = item.getContent() != null ? escape(item.getContent()) : "";
            String xml = template
                    .replace("${num}", "#")
                    .replace("${heading}", heading);

            if (item.getChildren() != null && !item.getChildren().isEmpty()) {
                StringBuilder children = new StringBuilder();
                item.getChildren().forEach(child -> children.append(buildChild.apply(child)));
                String closingTag = "</" + nodeName + ">";
                String headingCloseTag = "</heading>";
                int insertAt = xml.lastIndexOf(headingCloseTag);
                if (insertAt >= 0) {
                    insertAt += headingCloseTag.length();
                } else {
                    insertAt = xml.lastIndexOf(closingTag);
                }
                xml = xml.substring(0, insertAt) + children + xml.substring(insertAt);
            }

            return xml;
        }
    }
}
