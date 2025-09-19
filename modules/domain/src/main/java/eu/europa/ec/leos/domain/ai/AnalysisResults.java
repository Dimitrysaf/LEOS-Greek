package eu.europa.ec.leos.domain.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

@Setter
@Getter
public class AnalysisResults {
    private List<AnalysisResultDataGeneration> dataGenerationResults = new ArrayList<>();
    private List<AnalysisResultDescriptionGeneration> descGenerationResults = new ArrayList<>();
    private List<AnalysisResultSolutionsGeneration> solutionsGenerationResults = new ArrayList<>();
    private List<AnalysisResultInteroperabilityGeneration> interGenerationResults = new ArrayList<>();
    private List<AnalysisResultDataFlowsGeneration> dataFlowsGenerationResults = new ArrayList<>();

    public List<? extends AnalysisResult> getAnalysisResults(LFDSSections section) {
        switch (section) {
            case DESCRIPTION_GENERATION:
                return descGenerationResults;
            case DATA_GENERATION:
                return dataGenerationResults;
            case DIGITAL_SOLUTIONS:
                return solutionsGenerationResults;
            case INTEROPERABILITY_ASSESSMENT:
                return interGenerationResults;
            case DATA_FLOW_ANALYSIS:
                return dataFlowsGenerationResults;
            default:
                return new ArrayList();
        }
    }

    public void addAnalysisResult(LFDSSections section, LinkedHashMap result) {
        switch (section) {
            case DESCRIPTION_GENERATION:
                descGenerationResults.add(new ObjectMapper().convertValue(result, AnalysisResultDescriptionGeneration.class));
                break;
            case DATA_GENERATION:
                dataGenerationResults.add(new ObjectMapper().convertValue(result, AnalysisResultDataGeneration.class));
                break;
            case DIGITAL_SOLUTIONS:
                solutionsGenerationResults.add(new ObjectMapper().convertValue(result, AnalysisResultSolutionsGeneration.class));
                break;
            case INTEROPERABILITY_ASSESSMENT:
                interGenerationResults.add(new ObjectMapper().convertValue(result, AnalysisResultInteroperabilityGeneration.class));
                break;
            case DATA_FLOW_ANALYSIS:
                dataFlowsGenerationResults.add(new ObjectMapper().convertValue(result, AnalysisResultDataFlowsGeneration.class));
                break;
            default:
                break;
        }
    }
}
