package eu.europa.ec.leos.integration;

import eu.europa.ec.leos.domain.ai.AnalysisResults;
import eu.europa.ec.leos.domain.ai.AnalysisStatus;
import eu.europa.ec.leos.domain.ai.LFDSSections;
import io.atlassian.fugue.Pair;
import org.w3c.dom.Document;

import java.util.LinkedHashMap;

public interface AIProvider {
    void prepareAnalysis(final byte[] billContent, final String billRef, final Document billDocument);

    Pair<AnalysisStatus, LinkedHashMap<String, String>> getAnalysisStatus(final String billRef, final String metadataAI);

    AnalysisResults prefillDigitalDimensionsLFDS(final String billRef, final LFDSSections analysisType, final String aiMetadata) throws Exception;

    AnalysisResults prefillAllDigitalDimensionsLFDS(final String billRef, final String aiMetadata) throws Exception;
}
