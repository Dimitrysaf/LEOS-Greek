package eu.europa.ec.leos.services.api.exception;

public class CreateMilestoneException extends Exception {

    private static final long serialVersionUID = 1644366742521353920L;
    private ErrorCode errorCode = ErrorCode.CM001;
    private String messageKey = "page.milestone.already.exist.for.this.major.version.error";

    public CreateMilestoneException() {
        super();
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public String getMessageKey() {
        return messageKey;
    }
}
