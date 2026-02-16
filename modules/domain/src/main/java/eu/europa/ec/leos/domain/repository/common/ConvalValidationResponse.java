package eu.europa.ec.leos.domain.repository.common;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class ConvalValidationResponse implements Serializable {

    private boolean isValid;
    private String result;

}