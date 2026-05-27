package eu.europa.ec.leos.rest.handlers;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
public class ExceptionResponse {

    private String message;
    private ExceptionType type;
    private Map<String, String> errors;
    private String details;

    public ExceptionResponse(String message, ExceptionType type) {
        this.message = message;
        this.type = type;
    }
}
