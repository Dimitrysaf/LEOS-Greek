package eu.europa.ec.leos.services.ai;

import eu.europa.ec.leos.domain.ai.AnalysisResults;
import eu.europa.ec.leos.domain.repository.document.Bill;

public interface AIService {
    void prepareAnalysis(final String proposalRef);

    void prepareAnalysis(final Bill bill);

    AnalysisResults prefillDigitalDimensionsLFDS(final String proposalRef);
}
