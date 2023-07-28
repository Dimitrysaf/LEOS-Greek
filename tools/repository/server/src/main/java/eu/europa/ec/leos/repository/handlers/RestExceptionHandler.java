package eu.europa.ec.leos.repository.handlers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import eu.europa.ec.leos.repository.controllers.response.ExceptionResponse;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<?> dataNotFoundExceptionHandling(ResponseStatusException exception) {
        return new ResponseEntity<>(new ExceptionResponse(exception.getMessage(), ExceptionResponse.ExceptionType.WARNING),exception.getStatus());
    }

    @ExceptionHandler(RepositoryException.class)
    public ResponseEntity<?> repositoryExceptionHandling(RepositoryException exception) {
        return new ResponseEntity<>(new ExceptionResponse(exception.getName() + " " + exception.getCode().getDetail(),
                ExceptionResponse.ExceptionType.ERROR),HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> globalExceptionHandling(Exception exception) {
        return new ResponseEntity<>(new ExceptionResponse(exception.getMessage(),
                ExceptionResponse.ExceptionType.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
