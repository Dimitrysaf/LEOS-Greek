package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;

public interface FinancialStatementApiService extends BaseDocumentService<FinancialStatement>{
    DocumentViewResponse prefillDigitalDimensionsLFDS(final String proposalRef, final String analysisType) throws Exception;
}
