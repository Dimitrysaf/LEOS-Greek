package eu.europa.ec.digit.userdata.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRepoExceptionResponse {

    private String message;

    private Map<String, String> errors;

    public UserRepoExceptionResponse(String message) {
        this.message = message;
    }
}
