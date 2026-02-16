package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.services.dto.request.DocumentLinesRequest;

/**
 * Service interface for injecting elements into EdiT documents.
 * This service handles requests from external applications (e.g., DG SANTE EMP2)
 * to modify document content by performing operations on specific sections.
 * 
 * Supported operations:
 * - CLEAN: Removes all child elements from a section (Citations, Recitals, or Enacting Terms)
 * - OVERWRITE: Replaces an existing element identified by refId (future support)
 * - INSERT_BEFORE: Inserts content before a specified element (future support)
 * - INSERT_AFTER: Inserts content after a specified element (future support)
 * - APPEND: Adds content at the end of a section (future support)
 */
public interface InjectElementService {
    /**
     * Injects elements into a document based on the provided request.
     * 
     * @param request the DocumentLinesRequest containing:
     *                - documentId: the reference ID of the target document
     *                - sections: list of section operations to perform (Citations, Recitals, Enacting Terms)
     * @throws RuntimeException if the document is not found or processing fails
     */
    void injectElements(DocumentLinesRequest request);
}
