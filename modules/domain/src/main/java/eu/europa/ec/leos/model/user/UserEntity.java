package eu.europa.ec.leos.model.user;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true, exclude = "role")
@NoArgsConstructor
public class UserEntity extends Entity {
    private String role;

    public UserEntity(String id, String name, String organizationName, Boolean special, String role) {
        super(id, name, organizationName, special);
        this.role = role;
    }

    public UserEntity(String id, String name, Boolean special, String organizationName) {
        super(id, name, organizationName, special);
    }
}
