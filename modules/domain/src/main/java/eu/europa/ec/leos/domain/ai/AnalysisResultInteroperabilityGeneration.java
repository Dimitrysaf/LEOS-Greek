package eu.europa.ec.leos.domain.ai;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class AnalysisResultInteroperabilityGeneration extends AnalysisResult {
    public class AnalysisResultLegalInteroperabilityMeasures {
        public List<String> policies;
        public List<String> legal_barriers;
    }

    public class AnalysisResultOrganisationalInteroperabilityMeasures {
        public List<String> measures;
        public List<String> organisational_barriers;
    }

    public class AnalysisResultSemanticInteroperabilityMeasures {
        public List<String> measures;
        public List<String> semantic_barriers;
    }

    public class AnalysisResultTechnicalInteroperabilityMeasures {
        public List<String> measures;
        public List<String> technical_barriers;
    }

    private String digital_public_service;
    private String description;
    private List<String> eId;
    private Boolean cross_border_interaction;
    private AnalysisResultLegalInteroperabilityMeasures legal_interoperability_measures;
    private AnalysisResultOrganisationalInteroperabilityMeasures organisational_interoperability_measures;
    private AnalysisResultSemanticInteroperabilityMeasures semantic_interoperability_measures;
    private AnalysisResultTechnicalInteroperabilityMeasures technical_interoperability_measures;
    private String interoperable_europe_solutions;
    private List<String> other_interoperability_solutions;
    private int provision_count;

    @JsonSetter("other_interoperability_solutions")
    public void setOtherInteroperabilitySolutions(Object other_interoperability_solutions) {
        if (other_interoperability_solutions instanceof String) {
            this.other_interoperability_solutions = new ArrayList();
            this.other_interoperability_solutions.add((String)other_interoperability_solutions);
        } else {
            this.other_interoperability_solutions = (List)other_interoperability_solutions;
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
