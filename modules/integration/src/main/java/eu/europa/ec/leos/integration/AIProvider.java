package eu.europa.ec.leos.integration;

import eu.europa.ec.leos.domain.ai.AnalysisResults;
import org.w3c.dom.Document;

import java.time.Instant;

public interface AIProvider {
    void prepareAnalysis(final byte[] billContent, final String billRef, final Document billDocument);

    AnalysisResults prefillDigitalDimensionsLFDS(final String billRef, final Instant lastModificationInstant);
}
