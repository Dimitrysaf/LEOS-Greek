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

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof AnalysisResultInteroperabilityGeneration)) return false;
        AnalysisResultInteroperabilityGeneration that = (AnalysisResultInteroperabilityGeneration) o;
        return provision_count == that.provision_count && Objects.equals(digital_public_service, that.digital_public_service) && Objects.equals(description, that.description) && Objects.equals(eId, that.eId) && Objects.equals(cross_border_interaction, that.cross_border_interaction) && Objects.equals(interoperable_europe_solutions, that.interoperable_europe_solutions) && Objects.equals(other_interoperability_solutions, that.other_interoperability_solutions);
    }

    @Override
    public int hashCode() {
        return Objects.hash(digital_public_service, description, eId, cross_border_interaction, interoperable_europe_solutions, other_interoperability_solutions, provision_count);
    }
}
