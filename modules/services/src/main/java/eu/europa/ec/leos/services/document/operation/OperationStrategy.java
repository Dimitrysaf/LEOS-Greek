package eu.europa.ec.leos.services.document.operation;

import eu.europa.ec.leos.services.dto.request.SectionRequest;
import org.w3c.dom.Document;

public interface OperationStrategy {
    void execute(Document doc, SectionRequest section);
}
