package eu.europa.ec.leos.services.document.operation.builder;

import eu.europa.ec.leos.services.dto.request.AknType;
import org.springframework.stereotype.Component;

@Component
public class UnnumberedParagraphBuilder extends ArticleParagraphBuilder {

    @Override
    public AknType type() { return AknType.UNNUMBERED_PARAGRAPH; }

    @Override
    protected boolean numbered() { return false; }
}
