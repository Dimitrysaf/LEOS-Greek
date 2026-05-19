package eu.europa.ec.leos.model.user;

import lombok.Builder;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
@Builder
public class ClientSystem implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private String clientId;
    private String displayName;
}
