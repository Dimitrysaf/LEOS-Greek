package eu.europa.ec.leos.services.document.operation;

import eu.europa.ec.leos.services.dto.request.SectionRequest;
import eu.europa.ec.leos.services.dto.request.SectionType;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

@Component
public class CleanOperationStrategy implements OperationStrategy {
    
    @Override
    public void execute(Document doc, SectionRequest section) {
        String tagName = getSectionTagName(section.getSectionType());
        Node sectionNode = doc.getElementsByTagName(tagName).item(0);
        
        if (sectionNode != null) {
            while (sectionNode.hasChildNodes()) {
                sectionNode.removeChild(sectionNode.getFirstChild());
            }
        }
    }
    
    private String getSectionTagName(SectionType sectionType) {
        switch (sectionType) {
            case CITATIONS: return "citations";
            case RECITALS: return "recitals";
            case ENACTING_TERMS: return "body";
            default: throw new IllegalArgumentException("Unknown section type: " + sectionType);
        }
    }
}
