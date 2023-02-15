package eu.europa.ec.leos.services.dto.request;

import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;

public class NodeDropValidationRequest {
    private TableOfContentItemVO nodeDragged;
    private TableOfContentItemVO nodeDroppedAt;
    private String documentType;
    private String documentRef;

    public NodeDropValidationRequest() {
        super();
    }
    public NodeDropValidationRequest(TableOfContentItemVO nodeDragged, TableOfContentItemVO nodeDroppedAt, String documentType, String documentRef) {
        super();
        this.nodeDragged = nodeDragged;
        this.nodeDroppedAt = nodeDroppedAt;
        this.documentType = documentType;
        this.documentRef = documentRef;
    }

    public TableOfContentItemVO getNodeDragged() {
        return nodeDragged;
    }

    public void setNodeDragged(TableOfContentItemVO nodeDragged) {
        this.nodeDragged = nodeDragged;
    }

    public TableOfContentItemVO getNodeDroppedAt() {
        return nodeDroppedAt;
    }

    public void setNodeDroppedAt(TableOfContentItemVO nodeDroppedAt) {
        this.nodeDroppedAt = nodeDroppedAt;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getDocumentRef() {
        return documentRef;
    }

    public void setDocumentRef(String documentRef) {
        this.documentRef = documentRef;
    }


}
