package eu.europa.ec.leos.services.api.exception;

import lombok.Getter;

import java.io.Serial;

@Getter
public class DuplicateTemplateException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1644366742521353922L;
    private final ErrorCode errorCode = ErrorCode.CT001;
    private final String messageKey;
    private final String duplicatedDgs;

    public DuplicateTemplateException(String messageKey, String duplicatedDgs) {
        super();
        this.messageKey = messageKey;
        this.duplicatedDgs = duplicatedDgs;
    }

}
