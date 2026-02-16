package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.services.dto.request.DocumentLinesRequest;

public interface InjectElementService {
    void injectElements(DocumentLinesRequest request);
}
