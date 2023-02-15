package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.services.dto.request.NodeDropValidationRequest;
import eu.europa.ec.leos.services.dto.response.NodeValidationResponse;
import eu.europa.ec.leos.vo.toc.TocItem;

import java.util.List;

public interface TableOfContentService {
     NodeValidationResponse nodeValidationDrop(NodeDropValidationRequest request);
}
