package eu.europa.ec.leos.services.api.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Arrays;

@ControllerAdvice
public class ResponseExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(ResponseExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleException(Throwable ex) {
        String errorMessage = ex.getMessage();
        logError(ex, "Unexpected error occurred");
        return new ResponseEntity<>("{\n\t'errorCode': " + ErrorCode.G001 + " , \n\t'message': '" + errorMessage + "'\n}",
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(CreateMilestoneException.class)
    public ResponseEntity<ExceptionResponse> handleException(CreateMilestoneException ex) {
        logError(ex, "Unexpected error occurred");
        return new ResponseEntity<>(new ExceptionResponse(ex.getErrorCode().toString(), ex.getMessageKey()),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(PendingTranslationException.class)
    public ResponseEntity<Object> handleException(PendingTranslationException ex) {
        logError(ex, "Not possible to publish the custom template. There are languages with pending translations");
        return new ResponseEntity<>(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private static void logError(Throwable ex, String message) {
        if (Arrays.stream(ex.getStackTrace()).findFirst().isPresent()) {
            LOG.error("{}: {}", message, Arrays.stream(ex.getStackTrace()).findFirst().get(), ex);
        }
    }

}
