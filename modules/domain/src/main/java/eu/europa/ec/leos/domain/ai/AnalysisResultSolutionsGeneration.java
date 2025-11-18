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
public class AnalysisResultSolutionsGeneration extends AnalysisResult {
    private String explanation;
    private String digital_solution;
    private List<String> eId;
    private List<String> functionalities;
    private String responsible_actor;
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

    public void setFunctionalities(Object functionalities) {
        if (functionalities instanceof String) {
            this.functionalities = new ArrayList();
            this.functionalities.add((String)functionalities);
        } else {
            this.functionalities = (List)functionalities;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof AnalysisResultSolutionsGeneration)) return false;
        AnalysisResultSolutionsGeneration that = (AnalysisResultSolutionsGeneration) o;
        return provision_count == that.provision_count && Objects.equals(explanation, that.explanation) && Objects.equals(digital_solution, that.digital_solution) && Objects.equals(eId, that.eId) && Objects.equals(functionalities, that.functionalities) && Objects.equals(responsible_actor, that.responsible_actor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(explanation, digital_solution, eId, functionalities, responsible_actor, provision_count);
    }
}
