package eu.europa.ec.leos.services.dto.response;

import eu.europa.ec.leos.vo.toc.TocDropResult;

public class NodeValidationResponse {

    private TocDropResult result;

    public NodeValidationResponse(TocDropResult result) {
        this.result = result;
    }

    public TocDropResult getResult() {
        return result;
    }

    @Override
    public String toString() {
        return "NodeValidationResponse{" +
                "result=" + result +
                '}';
    }
}
