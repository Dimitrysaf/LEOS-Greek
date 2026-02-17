package eu.europa.ec.leos.services.document.operation;

import eu.europa.ec.leos.services.dto.request.SectionRequest;
import eu.europa.ec.leos.services.dto.request.SectionType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

/**
 * Strategy implementation for CLEAN operation.
 * Removes all child elements from a specified section (Citations, Recitals, or Enacting Terms).
 */
@Component
@Slf4j
public class CleanOperationStrategy implements OperationStrategy {
    
    @Override
    public void execute(Document doc, SectionRequest section) {
        String tagName = getSectionTagName(section.getSectionType());
        Node sectionNode = doc.getElementsByTagName(tagName).item(0);
        
        if (sectionNode == null) {
            log.warn("Section {} not found in document", tagName);
            return;
        }
        
        while (sectionNode.hasChildNodes()) {
            sectionNode.removeChild(sectionNode.getFirstChild());
        }
        
        log.debug("Cleaned section: {}", tagName);
    }
    
    /**
     * Maps SectionType enum to corresponding XML tag name.
     * 
     * @param sectionType the section type from the request
     * @return the XML tag name for the section
     * @throws IllegalArgumentException if section type is unknown
     */
    private String getSectionTagName(SectionType sectionType) {
        switch (sectionType) {
            case CITATIONS: 
                return "citations";
            case RECITALS: 
                return "recitals";
            case ENACTING_TERMS: 
                return "body";
            default: 
                throw new IllegalArgumentException("Unknown section type: " + sectionType);
        }
    }
}
