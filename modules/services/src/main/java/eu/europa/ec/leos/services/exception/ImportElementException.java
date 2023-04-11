package eu.europa.ec.leos.services.exception;

public class ImportElementException extends RuntimeException {
    
    public ImportElementException(String message, Exception e) {
        super(message, e);
    }

    public ImportElementException(String message) {
        super(message);
    }
}
