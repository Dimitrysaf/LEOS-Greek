package eu.europa.ec.leos.services.document.operation.builder;

import eu.europa.ec.leos.services.dto.request.AknType;
import eu.europa.ec.leos.services.dto.request.LineItem;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class NumberedArticleBuilder implements AknElementBuilder {

    @Override
    public AknType type() { return AknType.NUMBERED_ARTICLE; }

    @Override
    public String build(LineItem item, Function<LineItem, String> buildChild) {
        StringBuilder sb = new StringBuilder("<article leos:editable=\"true\" leos:deletable=\"true\" leos:autonumbering=\"true\">");
        sb.append("<num leos:editable=\"false\">#</num>");
        if (item.getChildren() != null) {
            item.getChildren().forEach(child -> sb.append(buildChild.apply(child)));
        }
        sb.append("</article>");
        return sb.toString();
    }
}
