package eu.europa.ec.digit.userdata.exception;

import lombok.Getter;

@Getter
public class BadRequestException extends RuntimeException {
    private final String messageKey;

    public BadRequestException() {
        this.messageKey = "page.workspace.administration.entity-info.invalid-request";
    }

    public BadRequestException(String message) {
        super(message);
        this.messageKey = "page.workspace.administration.entity-info.invalid-request";
    }

    public BadRequestException(String message, String messageKey) {
        super(message);
        this.messageKey = messageKey;
    }

    public BadRequestException(String message, String messageKey, Throwable cause) {
        super(message, cause);
        this.messageKey = messageKey;
    }

    public BadRequestException(String messageKey, Throwable cause) {
        super(cause);
        this.messageKey = messageKey;
    }
}
