package eu.europa.ec.leos.services.api.exception;

public class ExceptionResponse {

    private String errorCode;
    private String messageKey;

    public ExceptionResponse(String errorCode, String messageKey) {
        this.errorCode = errorCode;
        this.messageKey = messageKey;
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

}
