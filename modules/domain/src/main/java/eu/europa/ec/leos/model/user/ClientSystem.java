package eu.europa.ec.leos.model.user;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
public class ClientSystem implements Serializable {
    private String clientId;
    private String displayName;
}
