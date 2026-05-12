package eu.europa.ec.digit.userdata.dto;

import eu.europa.ec.digit.userdata.dto.validationgroup.Create;
import eu.europa.ec.digit.userdata.dto.validationgroup.Update;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@EqualsAndHashCode(of = "login")
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    @NotNull(groups = {Create.class, Update.class}, message = "User login is required.")
    @Size(min = 1, max = 50, groups = {Create.class, Update.class},
            message = "User login must be between 1 and 50 characters long.")
    @Pattern(regexp = "^\\w+$", groups = {Create.class, Update.class},
            message = "User login cannot contain whitespaces")
    private String login;

    @NotNull(groups = Create.class)
    @Size(min = 1, max = 50, groups = {Create.class, Update.class},
            message = "User last name must be between 1 and 50 characters long.")
    @Pattern(regexp = "^[\\p{L}\\s'-]+$", groups = {Create.class, Update.class},
            message = "User last name contains invalid characters")
    private String lastName;

    @NotNull(groups = Create.class)
    @Size(min = 1, max = 50, groups = {Create.class, Update.class},
            message = "User first name must be between 1 and 50 characters long.")
    @Pattern(regexp = "^[\\p{L}\\s'-]+$", groups = {Create.class, Update.class},
            message = "User first name contains invalid characters")
    private String firstName;

    @NotNull(groups = Create.class)
    @Email(groups = {Create.class, Update.class})
    private String email;

    @NotEmpty(groups = Create.class)
    private List<UserEntityDto> entities;

    private List<String> roles;

    private Date dateCreated;

    private Boolean special;
}
