package eu.europa.ec.leos.services.collection;

public class CreateCollectionError {
    private int code;
    private String message;
    private String errorCode;

    //For Jackson
    public CreateCollectionError() {
    }

    public CreateCollectionError(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public CreateCollectionError(int code, String message, String errorCode) {
        this.code = code;
        this.message = message;
        this.errorCode = errorCode;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
