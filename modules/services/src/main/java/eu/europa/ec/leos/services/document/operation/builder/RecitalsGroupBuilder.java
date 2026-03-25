package eu.europa.ec.leos.services.document.operation.builder;

import eu.europa.ec.leos.services.dto.request.AknType;
import eu.europa.ec.leos.services.dto.request.LineItem;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class RecitalsGroupBuilder implements AknElementBuilder {

    @Override
    public AknType type() { return AknType.RECITALS; }

    @Override
    public String build(LineItem item, Function<LineItem, String> buildChild) {
        StringBuilder sb = new StringBuilder("<recitals leos:editable=\"false\">");
        sb.append("<num leos:editable=\"false\">#</num>");
        if (item.getContent() != null && !item.getContent().isEmpty()) {
            sb.append("<heading>").append(escape(item.getContent())).append("</heading>");
        }
        if (item.getChildren() != null) {
            item.getChildren().forEach(child -> sb.append(buildChild.apply(child)));
        }
        sb.append("</recitals>");
        return sb.toString();
    }
}
