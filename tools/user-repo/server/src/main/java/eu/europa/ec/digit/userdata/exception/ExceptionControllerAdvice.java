package eu.europa.ec.digit.userdata.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.UUID;
import java.util.stream.Collectors;

@ControllerAdvice
@Slf4j
public class ExceptionControllerAdvice {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<UserRepoExceptionResponse> onIllegalArgument(IllegalArgumentException e) {
        log.error(e.getMessage(), e);
        return ResponseEntity.badRequest().body(new UserRepoExceptionResponse(
                "page.workspace.administration.entity-info.invalid-request"));
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<UserRepoExceptionResponse> onValidationError(BindException e) {
        log.error(e.getMessage(), e);
        final String message = e.getAllErrors().stream()
                .map(ObjectError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        return ResponseEntity.badRequest().body(new UserRepoExceptionResponse(message));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<UserRepoExceptionResponse> onBadRequest(BadRequestException e) {
        log.error(e.getMessage(), e);
        return ResponseEntity.badRequest().body(new UserRepoExceptionResponse(
                e.getMessageKey() != null ? e.getMessageKey() :
                "page.workspace.administration.entity-info.invalid-request"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<UserRepoExceptionResponse> onException(Exception e) {
        final String messageId = UUID.randomUUID().toString();
        log.error("[{}] {}", messageId, e.getMessage(), e);
        return ResponseEntity.internalServerError().body(
                new UserRepoExceptionResponse("An unexpected error occurred. Log Message ID: " + messageId));
    }
}
