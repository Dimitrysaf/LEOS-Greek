package eu.europa.ec.leos.rest.handlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.ResponseErrorHandler;

import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;
import java.util.Scanner;

public class RestTemplateResponseErrorHandler implements ResponseErrorHandler {
    private static final Logger LOG = LoggerFactory.getLogger(RestTemplateResponseErrorHandler.class);

    private final ObjectMapper mapper = new ObjectMapper();
    @Override
    public boolean hasError(ClientHttpResponse httpResponse) throws IOException {
        HttpStatus status = httpResponse.getStatusCode();
        return !status.is2xxSuccessful();
    }

    @Override
    public void handleError(ClientHttpResponse httpResponse) throws IOException {

        String responseAsString = toString(httpResponse.getBody());
        LOG.error("Status code: {}; ResponseBody: {}", httpResponse.getStatusCode(), responseAsString);

        Optional<ExceptionResponse> exceptionResponse = Optional.empty();
        try {
            exceptionResponse = Optional.ofNullable(mapper.readValue(responseAsString, ExceptionResponse.class));
        } catch (Exception e) {
            // do nothing
        }

        if (httpResponse.getStatusCode().series() == HttpStatus.Series.SERVER_ERROR) {
            throw new IllegalStateException("Server Error: " + httpResponse.getStatusText());
        } else if (httpResponse.getStatusCode().series() == HttpStatus.Series.CLIENT_ERROR) {
            // handle CLIENT_ERROR

            if (httpResponse.getStatusCode() == HttpStatus.NOT_FOUND) {
                if(exceptionResponse.isPresent()){
                    throw new IllegalArgumentException(exceptionResponse.get().getMessage() + "|" + exceptionResponse.get().getType());
                }else{
                    throw new IllegalArgumentException("Resource not found");
                }
            }
            throw new IllegalStateException("CLIENT_ERROR: " + responseAsString);
        }
    }

    private String toString(InputStream inputStream) {
        Scanner s = new Scanner(inputStream).useDelimiter("\\A");
        return s.hasNext() ? s.next() : "";
    }

}