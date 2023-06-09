package eu.europa.ec.leos.services.exception;

import eu.europa.ec.leos.domain.common.ErrorCode;

public class XmlValidationException extends Throwable {
    ErrorCode errorCode;

    public XmlValidationException(String message, ErrorCode errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public XmlValidationException(String message) {
        super(message);
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

}
