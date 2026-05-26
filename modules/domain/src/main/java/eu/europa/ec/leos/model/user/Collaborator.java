package eu.europa.ec.leos.model.user;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
@EqualsAndHashCode(of = {"login", "entity", "role", "leosClientId"})
public class Collaborator implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String login;

    private String entity;

    private String role;

    private String leosClientId;

    private String displayName;

    protected Collaborator() {
    }

    public Collaborator(String login, String role, String entity) {
        this.login = login;
        this.role = role;
        this.entity = entity;
    }

    public Collaborator(String login, String role, String entity, String leosClientId) {
        this.login = login;
        this.role = role;
        this.entity = entity;
        this.leosClientId = leosClientId;
    }

    public Collaborator(String login, String role, String entity, String leosClientId, String displayName) {
        this.login = login;
        this.role = role;
        this.entity = entity;
        this.leosClientId = leosClientId;
        this.displayName = displayName;
    }

}
