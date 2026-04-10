package eu.europa.ec.leos.services.api.exception;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends LeosApiException {
    private static final HttpStatus HTTP_STATUS = HttpStatus.FORBIDDEN;

    public ForbiddenException() {
        this("Operation not allowed");
    }

    public ForbiddenException(String messageKey) {
        super(messageKey, HTTP_STATUS);
    }

}
