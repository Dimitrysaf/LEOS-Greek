package eu.europa.ec.leos.services.document.operation.builder;

import eu.europa.ec.leos.services.dto.request.AknType;
import eu.europa.ec.leos.services.dto.request.LineItem;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.function.Function;

@Component
public class ParagraphBuilder implements AknElementBuilder {

    @Override
    public AknType type() { return AknType.PARAGRAPH; }

    @Override
    public String build(LineItem item, Function<LineItem, String> buildChild) {
        String text = item.getContent() != null ? item.getContent() : "";

        List<LineItem> inlineChildren = item.getChildren() == null ? List.of() :
                item.getChildren().stream()
                        .filter(c -> c.getPosition() != null)
                        .sorted(Comparator.comparingInt(LineItem::getPosition))
                        .toList();
        List<LineItem> blockChildren = item.getChildren() == null ? List.of() :
                item.getChildren().stream()
                        .filter(c -> c.getPosition() == null && c.getType() != AknType.AUTHORIAL_NOTE)
                        .toList();

        StringBuilder inner = new StringBuilder();
        int cursor = 0;
        for (LineItem inline : inlineChildren) {
            int pos = Math.min(inline.getPosition(), text.length());
            int safeStart = Math.min(cursor, text.length());
            inner.append(escape(text.substring(safeStart, pos)));
            inner.append(buildChild.apply(inline));
            cursor = pos;
        }
        inner.append(escape(text.substring(Math.min(cursor, text.length()))));
        blockChildren.forEach(block -> inner.append(buildChild.apply(block)));

        return "<p>" + inner + "</p>";
    }
}
