package eu.europa.ec.leos.services.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ResponseExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleException() {
        return new ResponseEntity<>("{\n\t'errorCode': 500 , \n\t'message': 'Unexpected error occurred while fetching data'\n}", HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
