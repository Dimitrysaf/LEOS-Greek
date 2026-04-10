package eu.europa.ec.leos.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Collection;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = {"login"})
public class UserDTO {
    private String login;

    private Long perId;

    private String lastName;

    private String firstName;

    private String email;

    private String jobTitle;

    private Collection<String> roles;

    private String defaultEntity;

    private Collection<EntityDTO> entities;

    private Date dateCreated;

    private Boolean special;
}
