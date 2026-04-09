package eu.europa.ec.leos.rest.handlers;

import lombok.Getter;
import org.springframework.http.HttpStatusCode;

/**
 * Exception enriched with response details.
 */
@Getter
public class RestTemplateResponseException extends IllegalArgumentException {

    private final ExceptionResponse response;
    private final HttpStatusCode status;

    public RestTemplateResponseException(ExceptionResponse response, HttpStatusCode status) {
        super(response.getMessage() + "|" + response.getType());
        this.response = response;
        this.status = status;
    }

}
