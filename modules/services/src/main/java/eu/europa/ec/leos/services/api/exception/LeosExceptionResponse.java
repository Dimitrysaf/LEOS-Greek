package eu.europa.ec.leos.services.api.exception;

public class LeosExceptionResponse extends RuntimeException {

    private String errorCode;
    private String messageKey;
    private String details;

    public LeosExceptionResponse(String errorCode, String messageKey) {
        this.errorCode = errorCode;
        this.messageKey = messageKey;
    }

    public LeosExceptionResponse(String errorCode, String messageKey, String details) {
        this.errorCode = errorCode;
        this.messageKey = messageKey;
        this.details = details;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getMessageKey() {
        return messageKey;
    }

    public void setMessageKey(String messageKey) {
        this.messageKey = messageKey;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}
