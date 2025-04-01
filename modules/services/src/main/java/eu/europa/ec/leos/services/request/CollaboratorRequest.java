package eu.europa.ec.leos.services.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CollaboratorRequest {

    private String userId;
    private String roleName;
    private String connectedDG;
    private String leosClientId;

    public CollaboratorRequest() {
    }

    public CollaboratorRequest(String userId, String roleName, String connectedDG, String leosClientId) {
        this.userId = userId;
        this.roleName = roleName;
        this.connectedDG = connectedDG;
        this.leosClientId = leosClientId;
    }

}
