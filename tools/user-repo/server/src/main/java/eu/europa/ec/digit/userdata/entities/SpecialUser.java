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

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@jakarta.persistence.Entity
@Table(name = "LEOS_SPECIAL_USER")
@Data
@EqualsAndHashCode(of = {"login"})
@NoArgsConstructor
@AllArgsConstructor
public class SpecialUser implements Serializable {

    @Serial
    private static final long serialVersionUID = -242509624358432413L;

    @Id
    @Column(name = "USER_LOGIN", nullable = false)
    private String login;

    @Column(name = "USER_PER_ID", nullable = false)
    private Long perId;

    @Column(name = "USER_LASTNAME", nullable = false)
    private String lastName;

    @Column(name = "USER_FIRSTNAME", nullable = false)
    private String firstName;

    @Column(name = "USER_EMAIL", nullable = false)
    private String email;

    @JsonIgnore
    @OneToMany
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinTable(name = "LEOS_SPECIAL_USER_ROLE", joinColumns = @JoinColumn(name = "USER_LOGIN"), inverseJoinColumns = @JoinColumn(name = "ROLE_NAME"))
    private List<Role> roleEntities;

    @OneToMany
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinTable(name = "LEOS_SPECIAL_USER_ENTITY", joinColumns = @JoinColumn(name = "USER_LOGIN"), inverseJoinColumns = @JoinColumn(name = "ENTITY_ID"))
    private List<SpecialEntity> entities;

    @Column(name = "DATE_CREATED")
    @CreationTimestamp
    private Date dateCreated;

    public SpecialUser(String login, Long perId, String lastName, String firstName,String email) {
        this.login = login;
        this.perId = perId;
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
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
                        (roleEntities != null ? roleEntities : new ArrayList<Role>()).stream().map(Role::getRole),
                        Stream.of("USER"))
                .collect(Collectors.collectingAndThen(Collectors.toList(), Collections::unmodifiableList));
    }
}
