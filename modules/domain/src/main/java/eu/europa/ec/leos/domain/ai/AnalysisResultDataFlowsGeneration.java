package eu.europa.ec.leos.domain.ai;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof AnalysisResultDataFlowsGeneration)) return false;
        AnalysisResultDataFlowsGeneration that = (AnalysisResultDataFlowsGeneration) o;
        return provision_count == that.provision_count && Objects.equals(digital_solution, that.digital_solution) && Objects.equals(eId, that.eId) && Objects.equals(addresser, that.addresser) && Objects.equals(action, that.action) && Objects.equals(action_result, that.action_result) && Objects.equals(addressee, that.addressee);
    }

    @Override
    public int hashCode() {
        return Objects.hash(digital_solution, eId, addresser, action, action_result, addressee, provision_count);
    }
}
