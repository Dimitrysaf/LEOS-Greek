package eu.europa.ec.leos.domain.ai;

import java.util.ArrayList;
import java.util.List;

public class AnalysisResultDataGeneration extends AnalysisResult {
    public String explanation;
    public String type_of_data;
    public List<String> eId;
    public String description;
    public List<String> standard;

    public void setStandard(Object standard) {
        if (standard instanceof String) {
            this.standard = new ArrayList<>();
            this.standard.add((String) standard);
        } else {
            this.standard = (List<String>) standard;
        }
    }
}
