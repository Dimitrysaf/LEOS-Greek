package eu.europa.ec.leos.services.api.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class LeosApiException extends Exception {
    private final HttpStatus httpStatus;
    private final String messageKey;

    public LeosApiException(String messageKey) {
        this(messageKey, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public LeosApiException(String messageKey, HttpStatus httpStatus) {
        super(messageKey);
        this.messageKey = messageKey;
        this.httpStatus = httpStatus;
    }

}
