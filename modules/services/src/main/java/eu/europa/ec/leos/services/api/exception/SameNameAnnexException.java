package eu.europa.ec.leos.services.api.exception;

public class SameNameAnnexException extends RuntimeException {

    private static final long serialVersionUID = 1644366742521353921L;
    private ErrorCode errorCode = ErrorCode.SNA001;
    private String messageKey = "page.collection.drafts.same.name.annex.error";

    public SameNameAnnexException() {
        super();
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public String getMessageKey() {
        return messageKey;
    }
}
