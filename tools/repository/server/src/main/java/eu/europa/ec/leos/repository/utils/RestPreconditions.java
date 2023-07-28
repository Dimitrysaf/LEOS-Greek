package eu.europa.ec.leos.repository.utils;

import org.springframework.http.HttpStatus;
import org.springframework.util.CollectionUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.Optional;

public class RestPreconditions {
    private RestPreconditions() {
        throw new AssertionError();
    }

    public static void checkFound(final boolean expression, HttpStatus httpStatus, String message) {
        if (!expression) {
            throw new ResponseStatusException(httpStatus == null ? HttpStatus.NOT_FOUND: httpStatus, message);
        }
    }

    public static <S> S checkFound(final S resource, HttpStatus httpStatus, String message) {
        if (resource == null) {
            throw new ResponseStatusException(httpStatus == null ? HttpStatus.NOT_FOUND: httpStatus, message);
        }
        return resource;
    }
    public static <T extends Collection> T checkFound(final T resource, HttpStatus httpStatus, String message) {
        if (CollectionUtils.isEmpty(resource)) {
            throw new ResponseStatusException(httpStatus == null ? HttpStatus.NOT_FOUND: httpStatus, message);
        }
        return resource;
    }
}
