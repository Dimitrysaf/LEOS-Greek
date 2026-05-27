package eu.europa.ec.leos.rest.handlers;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExceptionResponse {

    private String message;
    private ExceptionType type;
    private Map<String, String> errors;

    public ExceptionResponse(String message, ExceptionType type) {
        this.message = message;
        this.type = type;
    }
}
