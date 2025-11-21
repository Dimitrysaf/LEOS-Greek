package eu.europa.ec.leos.services.api.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class ResponseExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(ResponseExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e, HandlerMethod handlerMethod) {
        String methodName = handlerMethod.getMethod().getName();
        Map<String, Object> response = new HashMap<>();
        switch(methodName) {
            case "createProposalForeignAnnex":
                LOG.error("Error while creating new bill annex - " + e.getMessage());
                response.put("errorCode", ErrorCode.CA001);
                response.put("message", "Unexpected error occurred while creating new bill annex");
                break;
            default:
                if (Arrays.stream(e.getStackTrace()).findFirst().isPresent()) {
                    LOG.error("Unexpected error occurred :" + Arrays.stream(e.getStackTrace()).findFirst().get(), e);
                }
                response.put("errorCode", ErrorCode.G001);
                response.put("message", e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(CreateMilestoneException.class)
    public ResponseEntity<ExceptionResponse> handleException(CreateMilestoneException ex) {
        if (Arrays.stream(ex.getStackTrace()).findFirst().isPresent()) {
            LOG.error("Unexpected error occurred :" + Arrays.stream(ex.getStackTrace()).findFirst().get(), ex);
        }
        return new ResponseEntity<>(new ExceptionResponse(ex.getErrorCode().toString(), ex.getMessageKey()),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
