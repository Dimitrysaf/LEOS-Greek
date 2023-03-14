package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.services.dto.request.NodeDropValidationRequest;
import eu.europa.ec.leos.services.dto.response.NodeValidationResponse;

public interface TocApiService {
    NodeValidationResponse nodeValidationDrop(NodeDropValidationRequest request);
}
