package eu.europa.ec.leos.services.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InjectElementResponse {
    private boolean success;
    private String message;
}
