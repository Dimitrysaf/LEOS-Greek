package eu.europa.ec.leos.services.document.operation.builder;

import eu.europa.ec.leos.services.dto.request.AknType;
import eu.europa.ec.leos.services.dto.request.LineItem;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class PointBuilder implements AknElementBuilder {

    @Override
    public AknType type() { return AknType.POINT; }

    @Override
    public String build(LineItem item, Function<LineItem, String> buildChild) {
        if (item.getChildren() == null || item.getChildren().isEmpty())
            throw new IllegalArgumentException("POINT must have at least one child");
        StringBuilder sb = new StringBuilder("<point>");
        item.getChildren().forEach(child -> sb.append(buildChild.apply(child)));
        sb.append("</point>");
        return sb.toString();
    }
}
