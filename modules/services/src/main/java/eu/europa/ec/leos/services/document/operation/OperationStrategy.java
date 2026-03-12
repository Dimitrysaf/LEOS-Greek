package eu.europa.ec.leos.services.document.operation;

import eu.europa.ec.leos.services.dto.request.SectionRequest;

public interface OperationStrategy {
    byte[] execute(byte[] content, SectionRequest section, String documentCollectionName);
}
