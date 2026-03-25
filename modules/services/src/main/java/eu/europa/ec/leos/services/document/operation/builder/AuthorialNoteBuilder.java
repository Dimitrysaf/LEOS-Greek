package eu.europa.ec.leos.services.document.operation.builder;

import eu.europa.ec.leos.services.dto.request.AknType;
import eu.europa.ec.leos.services.dto.request.LineItem;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class AuthorialNoteBuilder implements AknElementBuilder {

    @Override
    public AknType type() { return AknType.AUTHORIAL_NOTE; }

    @Override
    public String build(LineItem item, Function<LineItem, String> buildChild) {
        String text = item.getContent() != null ? item.getContent() : "";
        String marker = item.getRefId() != null ? escape(item.getRefId()) : "";
        return "<authorialNote marker=\"" + marker + "\" placement=\"bottom\"><p>" + escape(text) + "</p></authorialNote>";
    }
}
