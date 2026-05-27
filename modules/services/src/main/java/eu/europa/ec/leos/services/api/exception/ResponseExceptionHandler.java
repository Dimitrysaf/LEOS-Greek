package eu.europa.ec.leos.services.api.exception;

import eu.europa.ec.leos.exception.LeosErrorMessage;
import eu.europa.ec.leos.rest.handlers.ExceptionType;
import eu.europa.ec.leos.rest.handlers.RestTemplateResponseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.HandlerMethod;

import java.util.Arrays;

@ControllerAdvice
public class ResponseExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(ResponseExceptionHandler.class);

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleMessageNotReadable(HttpMessageNotReadableException ex) {
        Throwable cause = ex.getCause();
        String message = (cause != null && cause.getMessage() != null) ? cause.getMessage() : ex.getMessage();
        LOG.debug("Request body not readable: {}", message);
        return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
    }

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

    @ExceptionHandler(LeosExceptionResponse.class)
    public ResponseEntity<LeosExceptionResponse> handleException(LeosExceptionResponse ex) {
        String errorMessage = ex.getMessage();
        if (Arrays.stream(ex.getStackTrace()).findFirst().isPresent()) {
            LOG.error("Unexpected error occurred :" + Arrays.stream(ex.getStackTrace()).findFirst().get(), ex);
        } else {
            LOG.error("Unexpected error occurred :" + errorMessage, ex);
        }
        return new ResponseEntity<>(new LeosExceptionResponse(ex.getErrorCode().toString(), ex.getMessageKey()),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(PendingTranslationException.class)
    public ResponseEntity<Object> handleException(PendingTranslationException ex) {
        logError(ex, "Not possible to publish the custom template. There are languages with pending translations");
        return new ResponseEntity<>(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(DuplicateTemplateException.class)
    public ResponseEntity<Object> handleException(DuplicateTemplateException ex) {
        logError(ex, "Not possible to publish the custom template. Duplicate template name found");
        return new ResponseEntity<>(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private static void logError(Throwable ex, String message) {
        if (Arrays.stream(ex.getStackTrace()).findFirst().isPresent()) {
            LOG.error("{}: {}", message, Arrays.stream(ex.getStackTrace()).findFirst().get(), ex);
        }
    }

    @ExceptionHandler(LeosApiException.class)
    public ResponseEntity<eu.europa.ec.leos.rest.handlers.ExceptionResponse> handleException(LeosApiException ex) {
        if (Arrays.stream(ex.getStackTrace()).findFirst().isPresent()) {
            LOG.error("Unexpected error occurred :" + Arrays.stream(ex.getStackTrace()).findFirst().get(), ex);
        }
        return new ResponseEntity<>(new eu.europa.ec.leos.rest.handlers.ExceptionResponse(ex.getMessageKey(), ExceptionType.ERROR),
                ex.getHttpStatus());
    }

    @ExceptionHandler(RestTemplateResponseException.class)
    public ResponseEntity<eu.europa.ec.leos.rest.handlers.ExceptionResponse> handleException(RestTemplateResponseException ex) {
        if (Arrays.stream(ex.getStackTrace()).findFirst().isPresent()) {
            LOG.error("Unexpected error occurred :" + Arrays.stream(ex.getStackTrace()).findFirst().get(), ex);
        }
        return new ResponseEntity<>(ex.getResponse(), ex.getStatus());
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<eu.europa.ec.leos.rest.handlers.ExceptionResponse> handleException(ForbiddenException ex) {
        if (Arrays.stream(ex.getStackTrace()).findFirst().isPresent()) {
            LOG.error("Unexpected error occurred :" + Arrays.stream(ex.getStackTrace()).findFirst().get(), ex);
        }
        return new ResponseEntity<>(new eu.europa.ec.leos.rest.handlers.ExceptionResponse(ex.getMessageKey(), ExceptionType.ERROR),
                HttpStatus.FORBIDDEN);
    }

}
