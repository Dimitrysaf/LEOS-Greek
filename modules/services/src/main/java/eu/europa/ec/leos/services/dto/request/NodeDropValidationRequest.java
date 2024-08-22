package eu.europa.ec.leos.services.dto.request;

import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItemPosition;

import java.io.Serializable;
import java.util.List;

public class NodeDropValidationRequest implements Serializable {
    private List<String> draggedNodeId;
    private String draggedNodeTagName;
    private String targetNodeId;
    private String targetNodeTagName;
    private String parentNodeId;
    private String parentNodeTagName;
    private TocItemPosition position;
    private LeosCategory documentType;
    private String documentRef;
    private List<TableOfContentItemVO> tableOfContentItemVOs;

    public List<TableOfContentItemVO> getTableOfContentItemVOs() {
        return tableOfContentItemVOs;
    }

    public void setTableOfContentItemVOs(List<TableOfContentItemVO> tableOfContentItemVOs) {
        this.tableOfContentItemVOs = tableOfContentItemVOs;
    }

    public List<String> getDraggedNodeId() {
        return draggedNodeId;
    }

    public String getDraggedNodeTagName() {
        return draggedNodeTagName;
    }

    public void setDraggedNodeTagName(String draggedNodeTagName) {
        this.draggedNodeTagName = draggedNodeTagName;
    }

    public String getTargetNodeId() {
        return targetNodeId;
    }

    public String getTargetNodeTagName() {
        return targetNodeTagName;
    }

    public void setTargetNodeTagName(String targetNodeTagName) {
        this.targetNodeTagName = targetNodeTagName;
    }

    public String getParentNodeId() {
        return parentNodeId;
    }

    public void setParentNodeId(String parentNodeId) {
        this.parentNodeId = parentNodeId;
    }

    public String getParentNodeTagName() {
        return parentNodeTagName;
    }

    public void setParentNodeTagName(String parentNodeTagName) {
        this.parentNodeTagName = parentNodeTagName;
    }

    public TocItemPosition getPosition() {
        return position;
    }

    public LeosCategory getDocumentType() {
        return documentType;
    }

    public String getDocumentRef() {
        return documentRef;
    }

    public void setDocumentRef(String documentRef) {
        this.documentRef = documentRef;
    }

    public void setDraggedNodeId(List<String> draggedNodeId) {
        this.draggedNodeId = draggedNodeId;
    }

    public void setTargetNodeId(String targetNodeId) {
        this.targetNodeId = targetNodeId;
    }

    public void setPosition(TocItemPosition position) {
        this.position = position;
    }

    public void setDocumentType(LeosCategory documentType) {
        this.documentType = documentType;
    }

}
