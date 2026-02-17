package eu.europa.ec.leos.services.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class DocumentLinesRequest {
    private String documentId;
    private List<SectionRequest> sections;
}
