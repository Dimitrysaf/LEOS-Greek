export type AnalysisResult = {
  id: number;
  legal_resource_celex: string;
  validated: boolean;
  updated_at: string;
  created_at: string;
  analysis_type: string;
}

export type AnalysisResultDataGeneration = AnalysisResult & {
  explanation: string;
  type_of_data: string;
  eId: string[];
  description: string;
  standard: string[];
}

export type AnalysisResultDescriptionGeneration = AnalysisResult & {
  article_heading: string;
  explanation: string;
  eId: string;
  text: string;
  category: string[];
  description: string;
  high_level_process: string[];
  actors: string[];
}

export type AnalysisResultSolutionsGeneration = AnalysisResult & {
  explanation: string;
  digital_solution: string;
  eId: string[];
  functionalities: string[];
  responsible_actor: string;
}

export type AnalysisResultLegalInteroperabilityMeasures = {
  policies: string[];
  legal_barriers: string[];
}

export type AnalysisResultOrganisationalInteroperabilityMeasures = {
  measures: string[];
  organisational_barriers: string[];
}

export type AnalysisResultSemanticInteroperabilityMeasures = {
  measures: string[];
  semantic_barriers: string[];
}

export type AnalysisResultTechnicalInteroperabilityMeasures = {
  measures: string[];
  technical_barriers: string[];
}

export type AnalysisResultInteroperabilityGeneration = AnalysisResult & {
  digital_public_service: string;
  description: string;
  eId: string[];
  cross_border_interaction: boolean;
  legal_interoperability_measures: AnalysisResultLegalInteroperabilityMeasures;
  organisational_interoperability_measures: AnalysisResultOrganisationalInteroperabilityMeasures;
  semantic_interoperability_measures: AnalysisResultSemanticInteroperabilityMeasures;
  technical_interoperability_measures: AnalysisResultTechnicalInteroperabilityMeasures;
  interoperable_europe_solutions: string;
  other_interoperability_solutions: string[];
}

export type AnalysisResultDataFlowsGeneration = AnalysisResult & {
  digital_solution: string;
  eId: string[];
  addresser: string;
  action: string;
  action_result: string;
  addressee: string;
}

export type AnalysisResults = {
  dataGenerationResults: AnalysisResultDataGeneration[];
  descGenerationResults: AnalysisResultDescriptionGeneration[];
  solutionsGenerationResults: AnalysisResultSolutionsGeneration[];
  interGenerationResults: AnalysisResultInteroperabilityGeneration[];
  dataFlowsGenerationResults: AnalysisResultDataFlowsGeneration[];
};
