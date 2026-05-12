package eu.europa.ec.digit.userdata.entities;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@jakarta.persistence.Entity
@Table(name="LEOS_SPECIAL_USER_ENTITY")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = { "id"})
public class SpecialUserEntity implements Serializable {

    @EmbeddedId
    private UserEntityId id;

    @ManyToOne
    @MapsId("userLogin")
    @JoinColumn(name = "USER_LOGIN", referencedColumnName = "USER_LOGIN")
    private SpecialUser user;

    @ManyToOne
    @MapsId("entityId")
    @JoinColumn(name = "ENTITY_ID", referencedColumnName = "ENTITY_ID")
    private SpecialEntity entity;

    @ManyToOne
    @JoinColumn(name = "ROLE_NAME", referencedColumnName = "ROLE_NAME")
    private Role role;

    public SpecialUserEntity(SpecialUser user, SpecialEntity entity) {
        this.id = new UserEntityId(user.getLogin(), entity.getId());
        this.user = user;
        this.entity = entity;
    }

    @Embeddable
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode(of = { "userLogin", "entityId"})
    @Getter @Setter
    public static class UserEntityId implements Serializable {
        @Column(name = "USER_LOGIN")
        private String userLogin;

        @Column(name = "ENTITY_ID")
        private String entityId;
    }
}
