package eu.europa.ec.leos.services.api.exception;

public class CreateAnnexException extends RuntimeException {

    private static final long serialVersionUID = 1644366742521353921L;
    private ErrorCode errorCode = ErrorCode.SNA001;
    private String messageKey;

    public CreateAnnexException(String messageKey) {
        this.messageKey = messageKey;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public String getMessageKey() {
        return messageKey;
    }
}
