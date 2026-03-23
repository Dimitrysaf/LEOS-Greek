package eu.europa.ec.leos.services.document.operation.builder;

import eu.europa.ec.leos.services.dto.request.AknType;
import eu.europa.ec.leos.services.dto.request.LineItem;

import java.util.Comparator;
import java.util.List;
import java.util.function.Function;

public interface AknElementBuilder {
    AknType type();
    String build(LineItem item, Function<LineItem, String> buildChild);

    default String escape(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }

    default String buildParagraph(LineItem item, Function<LineItem, String> buildChild) {
        String text = item.getContent() != null ? item.getContent() : "";
        List<LineItem> inlineChildren = item.getChildren() == null ? List.of() :
                item.getChildren().stream()
                        .filter(c -> c.getPosition() != null)
                        .sorted(Comparator.comparingInt(LineItem::getPosition))
                        .toList();
        StringBuilder inner = new StringBuilder();
        int cursor = 0;
        for (LineItem inline : inlineChildren) {
            int pos = Math.min(inline.getPosition(), text.length());
            inner.append(escape(text.substring(Math.min(cursor, text.length()), pos)));
            inner.append(buildChild.apply(inline));
            cursor = pos;
        }
        inner.append(escape(text.substring(Math.min(cursor, text.length()))));
        return "<p>" + inner + "</p>";
    }
}
