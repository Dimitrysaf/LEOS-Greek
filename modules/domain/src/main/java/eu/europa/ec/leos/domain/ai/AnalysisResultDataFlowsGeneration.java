package eu.europa.ec.leos.domain.ai;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class AnalysisResultDataFlowsGeneration extends AnalysisResult {
    private String digital_solution;
    private List<String> eId;
    private String addresser;
    private String action;
    private String action_result;
    private String addressee;
    private int provision_count;

    @JsonSetter("eId")
    public void setEId(Object eId) {
        if (eId instanceof String) {
            this.eId = new ArrayList();
            this.eId.add((String)eId);
        } else {
            this.eId = (List)eId;
        }
    }

    @JsonGetter("eId")
    public List<String> getEId() {
        return this.eId;
    }
}
