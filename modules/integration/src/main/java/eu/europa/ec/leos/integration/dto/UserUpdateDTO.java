package eu.europa.ec.leos.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Collection;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = {"login"})
public class UserUpdateDTO {
    private String login;

    private String lastName;

    private String firstName;

    private String email;

    private Collection<String> roles;

    private Set<UserEntityDTO> addedEntities;

    private Set<String> removedEntities;
}
