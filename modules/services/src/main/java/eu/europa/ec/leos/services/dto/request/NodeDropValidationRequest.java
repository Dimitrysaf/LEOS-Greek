package eu.europa.ec.leos.services.dto.request;

import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItemPosition;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class NodeDropValidationRequest implements Serializable {
    private List<String> draggedNodeId;
    private String draggedNodeTagName;
    private String targetNodeId;
    private String targetNodeTagName;
    private String parentNodeId;
    private String parentNodeTagName;
    private TocItemPosition position;
    private String documentType;
    private String documentRef;
    private List<TableOfContentItemVO> tableOfContentItemVOs;
}
