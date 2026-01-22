package eu.europa.ec.leos.services.api.exception;

import eu.europa.ec.leos.exception.LeosErrorMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Arrays;

@ControllerAdvice
public class ResponseExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(ResponseExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception ex, HandlerMethod handlerMethod) {
        String errorMessage = ex.getMessage();
        if (Arrays.stream(ex.getStackTrace()).findFirst().isPresent()) {
            LOG.error("Unexpected error occurred :" + Arrays.stream(ex.getStackTrace()).findFirst().get(), ex);
        } else {
            LOG.error("Unexpected error occurred :" + errorMessage, ex);
        }
        String message = ErrorCode.G001 + " - Generic error";
        LeosErrorMessage annotation = handlerMethod.getMethodAnnotation(LeosErrorMessage.class);
        if (annotation != null) {
            message =  annotation.value();
        }
        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(CreateMilestoneException.class)
    public ResponseEntity<ExceptionResponse> handleException(CreateMilestoneException ex) {
        String errorMessage = ex.getMessage();
        if (Arrays.stream(ex.getStackTrace()).findFirst().isPresent()) {
            LOG.error("Unexpected error occurred :" + Arrays.stream(ex.getStackTrace()).findFirst().get(), ex);
        } else {
            LOG.error("Unexpected error occurred :" + errorMessage, ex);
        }
        return new ResponseEntity<>(new ExceptionResponse(ex.getErrorCode().toString(), ex.getMessageKey()),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(SameNameAnnexException.class)
    public ResponseEntity<String> handleException(SameNameAnnexException ex) {
        String errorMessage = ex.getMessage();
        if (Arrays.stream(ex.getStackTrace()).findFirst().isPresent()) {
            LOG.error("Unexpected error occurred :" + Arrays.stream(ex.getStackTrace()).findFirst().get(), ex);
        } else {
            LOG.error("Unexpected error occurred :" + errorMessage, ex);
        }
        return new ResponseEntity<>(ex.getMessageKey(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
