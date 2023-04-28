package eu.europa.ec.leos.rest.support.response;

public class ExceptionResponse {

    public enum ExceptionType {
        ERROR,
        WARNING
    }

    private String message;
    private ExceptionType type;

    public ExceptionResponse(String message, ExceptionType type) {
        this.message = message;
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public ExceptionType getType() {
        return type;
    }

    public void setType(ExceptionType type) {
        this.type = type;
    }
}
