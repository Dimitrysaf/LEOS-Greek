package eu.europa.ec.leos.services.dto.collaborator;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import eu.europa.ec.leos.model.user.ClientSystem;
import eu.europa.ec.leos.model.user.Entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CollaboratorDTO {

    private String login;
    private String fullName;
    private Entity entity;
    private String role;
    @JsonInclude(Include.NON_NULL)
    private ClientSystem clientSystem;

    public CollaboratorDTO(String login, String fullName, String roleName, Entity entity) {
        this.login = login;
        this.fullName = fullName;
        this.role = roleName;
        this.entity = entity;
    }

    public CollaboratorDTO(String login, String fullName, String roleName, Entity entity, ClientSystem clientSystem) {
        this(login, fullName, roleName, entity);
        this.clientSystem = clientSystem;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public Entity getEntity() {
        return entity;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setEntity(Entity entity) {
        this.entity = entity;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
