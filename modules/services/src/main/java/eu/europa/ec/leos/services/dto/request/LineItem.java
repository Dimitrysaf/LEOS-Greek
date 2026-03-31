package eu.europa.ec.leos.services.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class LineItem {
    private String refId;
    private AknType type;
    private String content;
    private Integer position;
    private List<LineItem> children;
}
