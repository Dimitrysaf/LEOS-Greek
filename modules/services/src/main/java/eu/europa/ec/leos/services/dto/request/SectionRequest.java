package eu.europa.ec.leos.services.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class SectionRequest {
    private SectionType sectionType;
    private Operation operation;
    private List<LineItem> items;
}
