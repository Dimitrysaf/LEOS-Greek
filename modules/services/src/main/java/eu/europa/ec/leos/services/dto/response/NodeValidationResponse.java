package eu.europa.ec.leos.services.dto.response;

import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;

public class NodeValidationResponse {
    private boolean valid;
    private TableOfContentItemVO nodeDragged;
    private TableOfContentItemVO nodeDroppedAt;
    private String error;
    public NodeValidationResponse(boolean valid, TableOfContentItemVO nodeDragged, TableOfContentItemVO nodeDroppedAt,String error) {
        this.valid = valid;
        this.nodeDragged = nodeDragged;
        this.nodeDroppedAt = nodeDroppedAt;
        this.error = error;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
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

}
