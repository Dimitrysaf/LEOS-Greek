package eu.europa.ec.leos.domain.ai;

import java.util.List;

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

    public String digital_public_service;
    public String description;
    public List<String> eId;
    public Boolean cross_border_interaction;
    public AnalysisResultLegalInteroperabilityMeasures legal_interoperability_measures;
    public AnalysisResultOrganisationalInteroperabilityMeasures organisational_interoperability_measures;
    public AnalysisResultSemanticInteroperabilityMeasures semantic_interoperability_measures;
    public AnalysisResultTechnicalInteroperabilityMeasures technical_interoperability_measures;
    public String interoperable_europe_solutions;
    public List<String> other_interoperability_solutions;
}
