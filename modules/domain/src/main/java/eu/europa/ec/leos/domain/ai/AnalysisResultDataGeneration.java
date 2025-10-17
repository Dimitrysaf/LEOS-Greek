package eu.europa.ec.leos.domain.ai;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class AnalysisResultDataGeneration extends AnalysisResult {
    private String explanation;
    private String type_of_data;
    private List<String> eId;
    private String description;
    private List<String> standard;
    private int provision_count;

    public void setStandard(Object standard) {
        if (standard instanceof String) {
            this.standard = new ArrayList<>();
            this.standard.add((String) standard);
        } else {
            this.standard = (List<String>) standard;
        }
    }

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
