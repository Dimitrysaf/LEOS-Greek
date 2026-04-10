package eu.europa.ec.leos.services.document.operation.builder;

import eu.europa.ec.leos.services.dto.request.AknType;
import eu.europa.ec.leos.services.dto.request.LineItem;

import java.util.Comparator;
import java.util.List;
import java.util.function.Function;

abstract class ArticleParagraphBuilder implements AknElementBuilder {

    protected abstract boolean numbered();

    @Override
    public String build(LineItem item, Function<LineItem, String> buildChild) {
        String text = item.getContent() != null ? item.getContent() : "";

        List<LineItem> notes = item.getChildren() == null ? List.of() :
                item.getChildren().stream()
                        .filter(c -> c.getPosition() != null)
                        .sorted(Comparator.comparingInt(LineItem::getPosition))
                        .toList();

        StringBuilder inner = new StringBuilder();
        int cursor = 0;
        for (LineItem note : notes) {
            int pos = Math.min(note.getPosition(), text.length());
            int safeStart = Math.min(cursor, text.length());
            inner.append(escape(text.substring(safeStart, pos)));
            inner.append(buildChild.apply(note));
            cursor = pos;
        }
        inner.append(escape(text.substring(Math.min(cursor, text.length()))));

        StringBuilder sb = new StringBuilder("<paragraph>");
        if (numbered()) sb.append("<num>#</num>");
        sb.append("<content><p>").append(inner).append("</p></content>");
        sb.append("</paragraph>");
        return sb.toString();
    }
}
