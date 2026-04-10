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

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import com.fasterxml.jackson.annotation.JsonIgnore;

@jakarta.persistence.Entity
@Table(name = "LEOS_USER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User implements Serializable {

    @Serial
    private static final long serialVersionUID = -242509624358432413L;

    @Id
    @Column(name = "USER_LOGIN", nullable = false, insertable = false, updatable = false)
    private String login;

    @Column(name = "USER_PER_ID", nullable = false, insertable = false, updatable = false)
    private Long perId;

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
    @OneToMany
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinTable(name = "LEOS_USER_ROLE", joinColumns = @JoinColumn(name = "USER_LOGIN"), inverseJoinColumns = @JoinColumn(name = "ROLE_NAME"))
    private List<Role> roleEntities;

    @OneToMany
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinTable(name = "LEOS_USER_ENTITY", joinColumns = @JoinColumn(name = "USER_LOGIN"), inverseJoinColumns = @JoinColumn(name = "ENTITY_ID"))
    @OrderBy("ENTITY_ORG_NAME, ENTITY_NAME")
    private List<Entity> entities;

    @Column(name = "SPECIAL", insertable = false, updatable = false)
    private Boolean special;

    public User(String login, Long perId, String lastName, String firstName, String email, String jobTitle, List<Role> roleEntities, List<Entity> entities) {
        this.login = login;
        this.perId = perId;
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.jobTitle = jobTitle;
        this.roleEntities = roleEntities;
        this.entities = entities;
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
                        Stream.of("USER"))
                .collect(Collectors.collectingAndThen(Collectors.toList(), Collections::unmodifiableList));
    }
}
