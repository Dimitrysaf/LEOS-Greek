package eu.europa.ec.digit.userdata.dto;

import eu.europa.ec.digit.userdata.dto.validationgroup.Create;
import eu.europa.ec.digit.userdata.dto.validationgroup.Update;
import eu.europa.ec.digit.userdata.dto.validationgroup.UserValidOnCreation;
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
@UserValidOnCreation(groups = Create.class)
public class UserDto {
    @NotNull(groups = {Create.class, Update.class}, message = "page.workspace.administration.user-info.error.login_required")
    @Pattern(regexp = "^\\w{1,50}$", groups = {Create.class, Update.class},
            message = "page.workspace.administration.user-info.error.invalid_login")
    private String login;

    @NotNull(groups = Create.class, message = "page.workspace.administration.user-info.error.lastname_required")
    @Pattern(regexp = "^(?!\\s*$)[\\p{L}\\s'-]{1,50}$",
            message = "page.workspace.administration.user-info.error.invalid_lastname",
            groups = {Create.class, Update.class})
    private String lastName;

    @NotNull(groups = Create.class, message = "page.workspace.administration.user-info.error.firstname_required")
    @Pattern(regexp = "^(?!\\s*$)[\\p{L}\\s'-]{1,50}$",
            message = "page.workspace.administration.user-info.error.invalid_firstname",
            groups = {Create.class, Update.class})
    private String firstName;

    @NotBlank(groups = Create.class, message = "page.workspace.administration.user-info.error.email_required")
    @Email(groups = {Create.class, Update.class}, message = "page.workspace.administration.user-info.error.invalid_email")
    private String email;

    private List<UserEntityDto> entities;

    private List<String> roles;

    private Date dateCreated;

    private Boolean special;

    private List<UserRoleDto> userRoles;
}
