package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.repository.document.Explanatory;
import eu.europa.ec.leos.services.dto.response.TocAndAncestorsResponse;

import java.util.List;

public interface CouncilExplanatoryApiService extends BaseDocumentService<Explanatory> {
    TocAndAncestorsResponse fetchTocAncestor(String documentRef, List<String> elementIds);
}
