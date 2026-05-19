/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.digit.userdata.entities;

import java.io.Serial;
import java.io.Serializable;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import jakarta.persistence.*;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

@jakarta.persistence.Entity
@IdClass(User.UserId.class)
@Table(name = "LEOS_USER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = {"login", "perId", "special"})
public class User implements Serializable {

    @Serial
    private static final long serialVersionUID = -242509624358432413L;

    @Id
    @Column(name = "USER_LOGIN", nullable = false, insertable = false, updatable = false)
    private String login;

    @Id
    @Column(name = "USER_PER_ID", nullable = false, insertable = false, updatable = false)
    private Long perId;

    @Id
    @Column(name = "SPECIAL", nullable = false, insertable = false, updatable = false)
    private Boolean special;

    @Column(name = "USER_LASTNAME", nullable = false, insertable = false, updatable = false)
    private String lastName;

    @Column(name = "USER_FIRSTNAME", nullable = false, insertable = false, updatable = false)
    private String firstName;

    @Column(name = "USER_EMAIL", nullable = false, insertable = false, updatable = false)
    private String email;

    @Column(name = "JOB_TITLE", nullable = false, insertable = false, updatable = false)
    private String jobTitle;

    @CreationTimestamp
    @Column(name = "DATE_CREATED", nullable = false, insertable = false, updatable = false)
    private Date dateCreated;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "LEOS_USER_ROLE", joinColumns = @JoinColumn(name = "USER_LOGIN", referencedColumnName = "USER_LOGIN"), inverseJoinColumns = @JoinColumn(name = "ROLE_NAME"))
    private List<Role> roleEntities;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "LEOS_USER_ENTITY", joinColumns = @JoinColumn(name = "USER_LOGIN", referencedColumnName = "USER_LOGIN"), inverseJoinColumns = @JoinColumn(name = "ENTITY_ID"))
    @OrderBy("ENTITY_ORG_NAME, ENTITY_NAME")
    private List<Entity> entities;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "USER_LOGIN", referencedColumnName = "USER_LOGIN")
    private List<UserEntity> userEntities;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "USER_LOGIN", referencedColumnName = "USER_LOGIN")
    private List<UserRole> userRoles;

    public User(String login, Long perId, String lastName, String firstName, String email, String jobTitle, List<Role> roles, List<UserEntity> userEntities) {
        this.login = login;
        this.perId = perId;
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.jobTitle = jobTitle;
        this.roleEntities = roles;
        this.userEntities = userEntities;
    }

    /**
     * Retrieves an unmodifiable list of role names associated with the user.
     * This includes the roles obtained from the user's role entities and the default
     * role "USER".
     *
     * @return a list of role names, combining existing roles and a default "USER" role.
     */
    public List<String> getRoles() {
        return Stream
                .concat(
                        roleEntities.stream().map(Role::getRole),
                        Stream.of(Role.ROLE_USER))
                .collect(Collectors.collectingAndThen(Collectors.toList(), Collections::unmodifiableList));
    }


    public static class UserId implements Serializable {
        @Serial
        private static final long serialVersionUID = 1L;
        private String login;
        private Boolean special;
        private Long perId;
    }
}
