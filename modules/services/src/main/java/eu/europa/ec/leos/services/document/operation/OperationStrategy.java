package eu.europa.ec.leos.services.document.operation;

import eu.europa.ec.leos.services.dto.request.SectionRequest;
import org.w3c.dom.Document;

/**
 * Strategy interface for executing operations on document sections.
 * Implementations define specific behaviors for different operation types (CLEAN, OVERWRITE, etc.).
 */
public interface OperationStrategy {
    /**
     * Executes the operation on the specified document section.
     * 
     * @param doc the DOM Document to modify
     * @param section the section request containing operation details
     */
    void execute(Document doc, SectionRequest section);
}
