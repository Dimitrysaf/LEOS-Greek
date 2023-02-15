package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.services.dto.request.NodeDropValidationRequest;
import eu.europa.ec.leos.services.dto.response.NodeValidationResponse;
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.List;

@Service
public class TableOfContentServiceImpl implements  TableOfContentService {
     public NodeValidationResponse nodeValidationDrop(NodeDropValidationRequest request) {
          return new NodeValidationResponse(true,request.getNodeDragged(),request.getNodeDroppedAt(),null);
     }

}
