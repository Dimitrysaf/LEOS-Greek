package eu.europa.ec.digit.userdata.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@jakarta.persistence.Entity
@Table(name="LEOS_USER_ENTITY")
@IdClass(UserEntity.UserEntityId.class)
@Data
public class UserEntity implements Serializable {
    @Id
    @Column(name = "USER_LOGIN")
    private String userLogin;

    @Id
    @Column(name = "ENTITY_ID")
    private String entityId;

    @ManyToOne
    @JoinColumn(name = "ROLE_NAME", referencedColumnName = "ROLE_NAME")
    private Role role;

    public record UserEntityId(String userLogin, String entityId) implements Serializable {
    }
}
