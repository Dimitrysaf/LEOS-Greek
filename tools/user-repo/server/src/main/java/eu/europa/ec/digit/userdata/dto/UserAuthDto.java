package eu.europa.ec.digit.userdata.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@EqualsAndHashCode(of = {"login", "perId", "special"})
@AllArgsConstructor
@NoArgsConstructor
public class UserAuthDto {
    private String login;

    private Long perId;

    private Boolean special;

    private String lastName;

    private String firstName;

    private String email;

    private String jobTitle;

    private Date dateCreated;

    private List<String> roles;

    private List<UserEntityDto> entities;

}
