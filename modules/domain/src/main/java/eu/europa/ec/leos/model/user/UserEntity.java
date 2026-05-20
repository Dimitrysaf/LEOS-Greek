package eu.europa.ec.leos.model.user;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serial;

@Data
@EqualsAndHashCode(callSuper = true, exclude = "role")
@NoArgsConstructor
public class UserEntity extends Entity {

    @Serial
    private static final long serialVersionUID = 1L;

    private String role;

    public UserEntity(String id, String name, String organizationName, Boolean special, String role) {
        super(id, name, organizationName, special);
        this.role = role;
    }

    public UserEntity(String id, String name, Boolean special, String organizationName) {
        super(id, name, organizationName, special);
    }
}
