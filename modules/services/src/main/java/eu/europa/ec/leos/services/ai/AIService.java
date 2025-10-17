package eu.europa.ec.leos.services.ai;

import eu.europa.ec.leos.domain.ai.AnalysisResults;
import eu.europa.ec.leos.domain.ai.AnalysisStatus;
import eu.europa.ec.leos.domain.repository.document.Bill;

public interface AIService {
    void prepareAnalysis(final String proposalRef);

    AnalysisStatus getAnalysisStatus(final String proposalRef);

    AnalysisResults prefillDigitalDimensionsLFDS(final String proposalRef, final String analysisType) throws Exception;
}
