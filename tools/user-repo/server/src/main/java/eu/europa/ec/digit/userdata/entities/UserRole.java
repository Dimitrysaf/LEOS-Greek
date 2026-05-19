package eu.europa.ec.digit.userdata.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Subselect;
import org.hibernate.annotations.Synchronize;

import java.io.Serializable;

@jakarta.persistence.Entity
@Subselect("""
        SELECT USER_LOGIN, ROLE_NAME, SPECIAL FROM (
            SELECT USER_LOGIN, ROLE_NAME, SPECIAL,
                   ROW_NUMBER() OVER (PARTITION BY USER_LOGIN, ROLE_NAME ORDER BY SPECIAL ASC) AS rn
            FROM LEOS_USER_ROLE
        ) WHERE rn = 1""")
@Synchronize("LEOS_USER_ROLE")
@IdClass(UserRole.UserRoleId.class)
@Data
public class UserRole implements Serializable {
    @Id
    @Column(name = "USER_LOGIN")
    private String userLogin;

    @Id
    @Column(name = "ROLE_NAME")
    private String role;

    @Column(name = "SPECIAL")
    private Boolean special;

    public record UserRoleId(String userLogin, String role) implements Serializable {
    }
}
