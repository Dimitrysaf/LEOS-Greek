package eu.europa.ec.leos.services.document.operation.builder;

import eu.europa.ec.leos.services.dto.request.AknType;
import eu.europa.ec.leos.services.dto.request.LineItem;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class CitationBuilder implements AknElementBuilder {

    @Override
    public AknType type() { return AknType.CITATION; }

    @Override
    public String build(LineItem item, Function<LineItem, String> buildChild) {
        return "<citation leos:editable=\"true\">" + buildParagraph(item, buildChild) + "</citation>";
    }
}
